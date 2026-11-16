//go:build !windows

// Development build for non-Windows machines: enough to run and test the interface.
package main

import (
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/shirou/gopsutil/v4/process"
)

func otherBytes(pid int32) uint64 {
	p := &process.Process{Pid: pid}
	if io, err := p.IOCounters(); err == nil && io != nil {
		return io.ReadBytes + io.WriteBytes
	}
	return 0
}

func hungWindows() []HungWin { return nil }
func isAdmin() bool          { return os.Geteuid() == 0 }

func openWindow(url string) {
	println(url)
	exec.Command("xdg-open", url).Start()
}

func targets() []Target {
	if d := os.Getenv("PCMONITOR_TEST_CLEAN"); d != "" {
		return []Target{{ID: "temp", Dirs: strings.Split(d, ":"), MinAge: time.Second}, {ID: "browser"}}
	}
	return nil
}
