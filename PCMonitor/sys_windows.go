package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
	"unsafe"

	"golang.org/x/sys/windows"
)

var (
	kernel32                 = windows.NewLazySystemDLL("kernel32.dll")
	user32                   = windows.NewLazySystemDLL("user32.dll")
	procGetProcessIoCounters = kernel32.NewProc("GetProcessIoCounters")
	procEnumWindows          = user32.NewProc("EnumWindows")
	procIsHungAppWindow      = user32.NewProc("IsHungAppWindow")
	procIsWindowVisible      = user32.NewProc("IsWindowVisible")
	procGetWindowTextW       = user32.NewProc("GetWindowTextW")
	procGetWindowThreadPid   = user32.NewProc("GetWindowThreadProcessId")
	shell32                  = windows.NewLazySystemDLL("shell32.dll")
	procSHQueryRecycleBin    = shell32.NewProc("SHQueryRecycleBinW")
	procSHEmptyRecycleBin    = shell32.NewProc("SHEmptyRecycleBinW")
)

type ioCounters struct {
	ReadOps, WriteOps, OtherOps, ReadBytes, WriteBytes, OtherBytes uint64
}

// otherBytes returns the "I/O other" byte count of a process. On Windows socket
// traffic is counted here, which is why it is used as the network estimate.
func otherBytes(pid int32) uint64 {
	h, err := windows.OpenProcess(windows.PROCESS_QUERY_LIMITED_INFORMATION, false, uint32(pid))
	if err != nil {
		return 0
	}
	defer windows.CloseHandle(h)
	var c ioCounters
	r, _, _ := procGetProcessIoCounters.Call(uintptr(h), uintptr(unsafe.Pointer(&c)))
	if r == 0 {
		return 0
	}
	return c.OtherBytes
}

var (
	hungFound []HungWin
	enumCB    = syscall.NewCallback(func(hwnd uintptr, _ uintptr) uintptr {
		if v, _, _ := procIsWindowVisible.Call(hwnd); v == 0 {
			return 1
		}
		if hung, _, _ := procIsHungAppWindow.Call(hwnd); hung == 0 {
			return 1
		}
		var pid uint32
		procGetWindowThreadPid.Call(hwnd, uintptr(unsafe.Pointer(&pid)))
		buf := make([]uint16, 256)
		procGetWindowTextW.Call(hwnd, uintptr(unsafe.Pointer(&buf[0])), uintptr(len(buf)))
		hungFound = append(hungFound, HungWin{Pid: int32(pid), Title: windows.UTF16ToString(buf)})
		return 1
	})
)

// hungWindows lists visible windows that Windows marks as "Not responding".
func hungWindows() []HungWin {
	hungFound = nil
	procEnumWindows.Call(enumCB, 0)
	return hungFound
}

func isAdmin() bool {
	return windows.GetCurrentProcessToken().IsElevated()
}

func openWindow(url string) {
	for _, base := range []string{os.Getenv("ProgramFiles(x86)"), os.Getenv("ProgramFiles"), os.Getenv("LocalAppData")} {
		edge := filepath.Join(base, "Microsoft", "Edge", "Application", "msedge.exe")
		if base == "" {
			continue
		}
		if _, err := os.Stat(edge); err == nil {
			if exec.Command(edge, "--app="+url, "--window-size=1180,820").Start() == nil {
				return
			}
		}
	}
	exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
}

type shQueryRBInfo struct {
	cbSize uint32
	size   int64
	items  int64
}

// recycleInfo adds up the Recycle Bin of every drive letter.
func recycleInfo() (bytes int64, items int64) {
	for c := 'A'; c <= 'Z'; c++ {
		root := string(c) + `:\`
		if _, err := os.Stat(root); err != nil {
			continue
		}
		p, _ := windows.UTF16PtrFromString(root)
		var i shQueryRBInfo
		i.cbSize = uint32(unsafe.Sizeof(i))
		if r, _, _ := procSHQueryRecycleBin.Call(uintptr(unsafe.Pointer(p)), uintptr(unsafe.Pointer(&i))); r == 0 {
			bytes += i.size
			items += i.items
		}
	}
	return
}

func recycleTarget() Target {
	scan := func() CleanResult {
		b, n := recycleInfo()
		return CleanResult{ID: "recycle", Bytes: b, Files: int(n)}
	}
	return Target{ID: "recycle", Scan: scan, Clean: func() CleanResult {
		before, n := recycleInfo()
		procSHEmptyRecycleBin.Call(0, 0, 7) // no confirmation, no progress window, no sound
		after, left := recycleInfo()
		return CleanResult{ID: "recycle", Bytes: before - after, Files: int(n - left), Skipped: int(left)}
	}}
}

// elevate restarts PC Monitor as administrator (Windows asks the user to confirm).
func elevate() bool {
	exe, err := os.Executable()
	if err != nil {
		return false
	}
	verb, _ := windows.UTF16PtrFromString("runas")
	file, _ := windows.UTF16PtrFromString(exe)
	return windows.ShellExecute(0, verb, file, nil, nil, windows.SW_SHOWNORMAL) == nil
}

// Folder names that only Chromium-based programs (browsers, Teams, Discord, Slack,
// VS Code, WhatsApp, WebView2 apps ...) create, and that hold nothing but cache.
var chromiumCaches = []string{"GPUCache", "Code Cache", "DawnCache", "DawnGraphiteCache", "DawnWebGPUCache", "GrShaderCache", "ShaderCache"}

// chromiumDirs expands "<profile pattern>" into the cache folders inside matching profiles.
// The plain "Cache" folder is only taken when a Chromium-only folder sits next to it.
func chromiumDirs(profilePatterns ...string) (out []string) {
	for _, pat := range profilePatterns {
		for _, n := range chromiumCaches {
			for _, hit := range glob(filepath.Join(pat, n)) {
				out = append(out, hit, filepath.Join(filepath.Dir(hit), "Cache"), filepath.Join(filepath.Dir(hit), "Media Cache"))
			}
		}
	}
	return
}

func targets() []Target {
	local := os.Getenv("LocalAppData")
	roaming := os.Getenv("AppData")
	win := os.Getenv("WINDIR")
	pdata := os.Getenv("ProgramData")
	day := 24 * time.Hour
	var set dirSet
	j := filepath.Join

	t := []Target{{ID: "temp", Dirs: set.add(os.TempDir()), MinAge: 2 * time.Hour}}
	if win != "" {
		t = append(t, Target{ID: "wintemp", Dirs: set.add(j(win, "Temp")), MinAge: day})
	}

	var browser, crash []string
	if local != "" {
		for _, b := range []string{`Google\Chrome`, `Google\Chrome Beta`, `Microsoft\Edge`, `BraveSoftware\Brave-Browser`, `Vivaldi`, `Yandex\YandexBrowser`, `Chromium`} {
			ud := j(local, b, "User Data")
			browser = append(browser, chromiumDirs(j(ud, "*"))...)
			browser = append(browser, j(ud, "ShaderCache"), j(ud, "GrShaderCache"), j(ud, "GraphiteDawnCache"))
			crash = append(crash, j(ud, "Crashpad", "reports"))
		}
		for _, o := range []string{`Opera Software\Opera Stable`, `Opera Software\Opera GX Stable`} {
			browser = append(browser, j(local, o, "Cache"), j(local, o, "Default", "Cache"), j(local, o, "System Cache"))
		}
		for _, prof := range glob(j(local, `Mozilla\Firefox\Profiles`, "*")) {
			browser = append(browser, j(prof, "cache2"), j(prof, "startupCache"), j(prof, "shader-cache"))
		}
		// Old Internet Explorer / Edge cache. "Content.Outlook" next to it is deliberately left
		// alone: it can hold the only copy of an edited e-mail attachment.
		browser = append(browser, j(local, `Microsoft\Windows\INetCache\IE`), j(local, `Microsoft\Windows\INetCache\Low`))
	}
	t = append(t, Target{ID: "browser", Dirs: set.add(browser...)})

	var apps, appTemp []string
	for _, base := range []string{roaming, local} {
		if base == "" {
			continue
		}
		apps = append(apps, chromiumDirs(j(base, "*"), j(base, "*", "*"), j(base, "*", "Partitions", "*"),
			j(base, "*", "EBWebView", "*"), j(base, "*", "*", "EBWebView", "*"))...)
	}
	if local != "" {
		apps = append(apps, chromiumDirs(j(local, "Packages", "*", "LocalCache", "*", "*", "EBWebView", "*"))...)
		apps = append(apps, j(local, `Steam\htmlcache`))
		// Microsoft Store apps: only their declared temporary folders, never LocalState/LocalCache.
		appTemp = append(appTemp, glob(j(local, "Packages", "*", "TempState"), j(local, "Packages", "*", "AC", "Temp"), j(local, "Packages", "*", "AC", "INetCache"))...)
	}
	t = append(t, Target{ID: "apps", Dirs: set.add(apps...)}, Target{ID: "storetemp", Dirs: set.add(appTemp...), MinAge: 2 * time.Hour})

	if local != "" {
		low := j(filepath.Dir(local), "LocalLow")
		shader := []string{j(local, "D3DSCache"), j(local, `NVIDIA\DXCache`), j(local, `NVIDIA\GLCache`), j(low, `NVIDIA\PerDriverVersion\DXCache`),
			j(local, `AMD\DxCache`), j(local, `AMD\DxcCache`), j(local, `AMD\GLCache`), j(local, `AMD\VkCache`), j(local, `Intel\ShaderCache`)}
		if pdata != "" {
			shader = append(shader, j(pdata, `NVIDIA Corporation\NV_Cache`))
		}
		crash = append(crash, j(local, "CrashDumps"), j(local, `Microsoft\Windows\WER`))
		if pdata != "" {
			crash = append(crash, j(pdata, `Microsoft\Windows\WER\ReportArchive`), j(pdata, `Microsoft\Windows\WER\ReportQueue`), j(pdata, `Microsoft\Windows\WER\Temp`))
		}
		t = append(t,
			Target{ID: "thumbs", Dirs: []string{j(local, `Microsoft\Windows\Explorer`)}, Pattern: "*cache_*.db"},
			Target{ID: "shader", Dirs: set.add(shader...)},
			Target{ID: "crash", Dirs: set.add(crash...)},
		)
	}
	if win != "" {
		t = append(t,
			Target{ID: "dumps", Dirs: set.add(j(win, "Minidump"), j(win, "LiveKernelReports")), Files: []string{j(win, "MEMORY.DMP")}},
			Target{ID: "logs", Dirs: set.add(j(win, "Logs")), MinAge: 7 * day},
			Target{ID: "update", Dirs: set.add(j(win, `SoftwareDistribution\Download`)), MinAge: 7 * day},
			Target{ID: "delivery", Dirs: set.add(j(win, `ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\Cache`))},
			Target{ID: "prefetch", Dirs: []string{j(win, "Prefetch")}, Pattern: "*.pf"},
		)
	}
	return append(t, recycleTarget())
}
