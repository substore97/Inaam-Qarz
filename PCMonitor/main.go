// PC Monitor: shows what is slowing the computer down, which programs use
// CPU / RAM / disk / network, and safely removes cache and temporary files.
// It serves a local page on 127.0.0.1 and opens it in an app window.
package main

import (
	"crypto/rand"
	"embed"
	"encoding/hex"
	"encoding/json"
	"io/fs"
	"net"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/host"
	"github.com/shirou/gopsutil/v4/mem"
	gnet "github.com/shirou/gopsutil/v4/net"
	"github.com/shirou/gopsutil/v4/process"
)

//go:embed ui
var uiFS embed.FS

type Group struct {
	Name      string  `json:"name"`
	Pids      []int32 `json:"pids"`
	CPU       float64 `json:"cpu"`      // % of whole machine
	Mem       uint64  `json:"mem"`      // bytes
	DiskR     float64 `json:"diskR"`    // bytes/s
	DiskW     float64 `json:"diskW"`    // bytes/s
	Net       float64 `json:"net"`      // bytes/s, estimate
	NetTotal  uint64  `json:"netTotal"` // bytes since the program started, estimate
	Conns     int     `json:"conns"`
	Hung      bool    `json:"hung"`
	Protected bool    `json:"protected"`
}

type DiskInfo struct {
	Path  string `json:"path"`
	Total uint64 `json:"total"`
	Used  uint64 `json:"used"`
}

type PrintJob struct {
	Printer string `json:"printer"`
	ID      int    `json:"id"`
	Doc     string `json:"doc"`
	User    string `json:"user"`
	Size    int64  `json:"size"`
	Status  string `json:"status"`
}

type HungWin struct {
	Pid   int32  `json:"pid"`
	Name  string `json:"name"`
	Title string `json:"title"`
}

type Snapshot struct {
	Host     string     `json:"host"`
	OS       string     `json:"os"`
	Uptime   uint64     `json:"uptime"`
	Admin    bool       `json:"admin"`
	Cores    int        `json:"cores"`
	CPU      float64    `json:"cpu"`
	MemTotal uint64     `json:"memTotal"`
	MemUsed  uint64     `json:"memUsed"`
	Disks    []DiskInfo `json:"disks"`
	DiskR    float64    `json:"diskR"`
	DiskW    float64    `json:"diskW"`
	NetDown  float64    `json:"netDown"`
	NetUp    float64    `json:"netUp"`
	SessDown uint64     `json:"sessDown"` // since PC Monitor was opened
	SessUp   uint64     `json:"sessUp"`
	Hung     []HungWin  `json:"hung"`
	Procs    []Group    `json:"procs"`
}

type procPrev struct {
	cpu, r, w, other float64
	create           int64
}

var (
	mu       sync.RWMutex
	snap     Snapshot
	prev     = map[int32]procPrev{}
	prevTime time.Time
	prevNet  [2]uint64
	baseNet  [2]uint64
	haveNet  bool
	everNet  = map[string]bool{} // program names that have owned a network connection
	lastPoll = time.Now()
	closing  time.Time
)

// Programs Windows needs to keep running; ending them crashes or logs out the PC.
var protected = map[string]bool{
	"system": true, "system idle process": true, "registry": true, "smss.exe": true, "csrss.exe": true,
	"wininit.exe": true, "winlogon.exe": true, "services.exe": true, "lsass.exe": true, "svchost.exe": true,
	"dwm.exe": true, "explorer.exe": true, "fontdrvhost.exe": true, "memory compression": true,
	"sihost.exe": true, "ctfmon.exe": true, "secure system": true, "lsaiso.exe": true, "msmpeng.exe": true,
}

func collect() {
	now := time.Now()
	dt := now.Sub(prevTime).Seconds()
	first := prevTime.IsZero()
	prevTime = now
	cores, _ := cpu.Counts(true)
	if cores < 1 {
		cores = 1
	}

	s := Snapshot{Cores: cores, Admin: isAdmin()}
	if hi, err := host.Info(); err == nil {
		s.Host, s.OS, s.Uptime = hi.Hostname, strings.TrimSpace(hi.Platform+" "+hi.PlatformVersion), hi.Uptime
	}
	if c, err := cpu.Percent(0, false); err == nil && len(c) > 0 {
		s.CPU = c[0]
	}
	if m, err := mem.VirtualMemory(); err == nil {
		s.MemTotal, s.MemUsed = m.Total, m.Total-m.Available
	}
	if parts, err := disk.Partitions(false); err == nil {
		seen := map[string]bool{}
		for _, p := range parts {
			if seen[p.Device] {
				continue
			}
			if u, err := disk.Usage(p.Mountpoint); err == nil && u.Total > 0 {
				seen[p.Device] = true
				s.Disks = append(s.Disks, DiskInfo{p.Mountpoint, u.Total, u.Used})
			}
		}
	}
	if io, err := gnet.IOCounters(false); err == nil && len(io) > 0 {
		cur := [2]uint64{io[0].BytesRecv, io[0].BytesSent}
		if !haveNet {
			baseNet, haveNet = cur, true
		} else if dt > 0 && cur[0] >= prevNet[0] && cur[1] >= prevNet[1] {
			s.NetDown = float64(cur[0]-prevNet[0]) / dt
			s.NetUp = float64(cur[1]-prevNet[1]) / dt
		}
		if cur[0] >= baseNet[0] && cur[1] >= baseNet[1] {
			s.SessDown, s.SessUp = cur[0]-baseNet[0], cur[1]-baseNet[1]
		}
		prevNet = cur
	}

	conns := map[int32]int{}
	if cs, err := gnet.Connections("inet"); err == nil {
		for _, c := range cs {
			if c.Raddr.IP != "" && !strings.HasPrefix(c.Raddr.IP, "127.") && c.Raddr.IP != "::1" && c.Raddr.IP != "0.0.0.0" && c.Raddr.IP != "::" {
				conns[c.Pid]++
			}
		}
	}

	hungPids := map[int32]string{}
	for _, h := range hungWindows() {
		hungPids[h.Pid] = h.Title
	}

	groups := map[string]*Group{}
	next := map[int32]procPrev{}
	self := int32(os.Getpid())
	pids, _ := process.Pids()
	for _, pid := range pids {
		p := &process.Process{Pid: pid}
		name, err := p.Name()
		if err != nil || name == "" {
			continue
		}
		g := groups[name]
		if g == nil {
			g = &Group{Name: name, Protected: protected[strings.ToLower(name)]}
			groups[name] = g
		}
		g.Pids = append(g.Pids, pid)
		if pid == self || pid == 0 {
			g.Protected = true
		}
		if n := conns[pid]; n > 0 {
			g.Conns += n
			everNet[name] = true
		}
		if t, ok := hungPids[pid]; ok {
			g.Hung = true
			s.Hung = append(s.Hung, HungWin{pid, name, t})
		}
		if mi, err := p.MemoryInfo(); err == nil && mi != nil {
			g.Mem += mi.RSS
		}
		cur := procPrev{}
		cur.create, _ = p.CreateTime()
		if t, err := p.Times(); err == nil && t != nil {
			cur.cpu = t.User + t.System
		}
		if io, err := p.IOCounters(); err == nil && io != nil {
			cur.r, cur.w = float64(io.ReadBytes), float64(io.WriteBytes)
		}
		cur.other = float64(otherBytes(pid))
		g.NetTotal += uint64(cur.other)
		// Only compare with the previous sample if it is the same process (pids get reused).
		if old, ok := prev[pid]; ok && old.create == cur.create && dt > 0 && !first {
			if d := cur.cpu - old.cpu; d > 0 {
				g.CPU += d / dt / float64(cores) * 100
			}
			if d := cur.r - old.r; d > 0 {
				g.DiskR += d / dt
			}
			if d := cur.w - old.w; d > 0 {
				g.DiskW += d / dt
			}
			if d := cur.other - old.other; d > 0 {
				g.Net += d / dt
			}
		}
		next[pid] = cur
	}
	prev = next

	for _, g := range groups {
		if !everNet[g.Name] { // device I/O of a program that never touched the network is not data usage
			g.Net, g.NetTotal = 0, 0
		}
		s.DiskR += g.DiskR
		s.DiskW += g.DiskW
		s.Procs = append(s.Procs, *g)
	}
	sort.Slice(s.Procs, func(i, j int) bool { return s.Procs[i].CPU > s.Procs[j].CPU })

	mu.Lock()
	snap = s
	mu.Unlock()
}

func main() {
	tok := make([]byte, 16)
	rand.Read(tok)
	token := hex.EncodeToString(tok)

	ln, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		os.Exit(1)
	}
	addr := ln.Addr().String()

	collect()
	go func() {
		for {
			time.Sleep(2 * time.Second)
			collect()
			mu.RLock()
			idle, cl := time.Since(lastPoll), closing
			mu.RUnlock()
			// Quit when the window is gone: right after it says goodbye, or after a long silence.
			if idle > 3*time.Minute || (!cl.IsZero() && time.Since(cl) > 6*time.Second && idle > 6*time.Second) {
				os.Exit(0)
			}
		}
	}()

	sub, _ := fs.Sub(uiFS, "ui")
	mux := http.NewServeMux()
	mux.Handle("/", http.FileServer(http.FS(sub)))
	api := func(path string, post bool, h func(w http.ResponseWriter, r *http.Request)) {
		mux.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
			// Only our own page may call the API: right host, secret token, and POST for actions.
			if r.Host != addr || r.URL.Query().Get("t") != token || (post && r.Method != http.MethodPost) {
				http.Error(w, "forbidden", http.StatusForbidden)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			h(w, r)
		})
	}
	api("/api/stats", false, func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		lastPoll, closing = time.Now(), time.Time{}
		s := snap
		mu.Unlock()
		json.NewEncoder(w).Encode(s)
	})
	api("/api/bye", true, func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		closing = time.Now()
		mu.Unlock()
	})
	api("/api/kill", true, func(w http.ResponseWriter, r *http.Request) {
		var req struct{ Name string }
		json.NewDecoder(r.Body).Decode(&req)
		killed := 0
		if !protected[strings.ToLower(req.Name)] {
			pids, _ := process.Pids()
			for _, pid := range pids {
				p := &process.Process{Pid: pid}
				if n, err := p.Name(); err == nil && n == req.Name && pid != int32(os.Getpid()) && pid != 0 {
					if p.Kill() == nil {
						killed++
					}
				}
			}
		}
		json.NewEncoder(w).Encode(map[string]int{"killed": killed})
	})
	api("/api/print", false, func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]any{"jobs": printJobs(), "admin": isAdmin()})
	})
	api("/api/print/delete", true, func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Printer string
			ID      int
		}
		json.NewDecoder(r.Body).Decode(&req)
		json.NewEncoder(w).Encode(map[string]bool{"ok": printDelete(req.Printer, req.ID)})
	})
	api("/api/print/clear", true, func(w http.ResponseWriter, r *http.Request) {
		left, forced := printClear()
		json.NewEncoder(w).Encode(map[string]any{"remaining": left, "forced": forced, "admin": isAdmin()})
	})
	api("/api/shutdown", true, func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]bool{"ok": shutdownPC()})
	})
	api("/api/elevate", true, func(w http.ResponseWriter, r *http.Request) {
		ok := elevate()
		json.NewEncoder(w).Encode(map[string]bool{"ok": ok})
		if ok { // the administrator copy opens its own window; this one steps aside
			go func() { time.Sleep(700 * time.Millisecond); os.Exit(0) }()
		}
	})
	api("/api/clean/scan", false, func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(scanAll())
	})
	api("/api/clean/run", true, func(w http.ResponseWriter, r *http.Request) {
		var req struct{ Ids []string }
		json.NewDecoder(r.Body).Decode(&req)
		json.NewEncoder(w).Encode(cleanAll(req.Ids))
	})

	go openWindow("http://" + addr + "/?t=" + token)
	http.Serve(ln, mux)
}
