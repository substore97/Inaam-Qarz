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

func targets() []Target {
	local := os.Getenv("LocalAppData")
	win := os.Getenv("WINDIR")
	day := 24 * time.Hour
	var browser []string
	if local != "" {
		for _, b := range []string{`Google\Chrome`, `Microsoft\Edge`, `BraveSoftware\Brave-Browser`, `Opera Software\Opera Stable`} {
			for _, sub := range []string{"Cache", "Code Cache", "GPUCache"} {
				browser = append(browser, glob(filepath.Join(local, b, "User Data", "*", sub))...)
			}
		}
		browser = append(browser, glob(filepath.Join(local, `Mozilla\Firefox\Profiles`, "*", "cache2"))...)
	}
	t := []Target{
		{ID: "temp", Dirs: []string{os.TempDir()}, MinAge: day},
		{ID: "browser", Dirs: browser},
	}
	if local != "" {
		t = append(t,
			Target{ID: "thumbs", Dirs: []string{filepath.Join(local, `Microsoft\Windows\Explorer`)}, Pattern: "*cache_*.db"},
			Target{ID: "shader", Dirs: []string{filepath.Join(local, "D3DSCache")}},
			Target{ID: "crash", Dirs: []string{filepath.Join(local, "CrashDumps"), filepath.Join(local, `Microsoft\Windows\WER`)}},
		)
	}
	if win != "" {
		t = append(t,
			Target{ID: "wintemp", Dirs: []string{filepath.Join(win, "Temp")}, MinAge: day},
			Target{ID: "update", Dirs: []string{filepath.Join(win, `SoftwareDistribution\Download`)}, MinAge: 7 * day},
		)
	}
	return t
}
