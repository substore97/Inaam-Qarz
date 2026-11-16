//go:build !windows

// Development build for non-Windows machines: enough to run and test the interface.
package main

import (
	"os"
	"os/exec"
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

func elevate() bool { return false }

// The development build never shuts anything down.
func shutdownPC() bool { return os.Getenv("PCMONITOR_TEST_SHUTDOWN") != "" }

// Test layout: PCMONITOR_TEST_CLEAN points at a folder with temp/, apps/ and a file dump.dmp.
func targets() []Target {
	d := os.Getenv("PCMONITOR_TEST_CLEAN")
	if d == "" {
		return nil
	}
	var set dirSet
	return []Target{
		{ID: "temp", Dirs: set.add(d + "/temp"), MinAge: time.Second},
		{ID: "apps", Dirs: set.add(d+"/apps/one", d+"/apps/two", d+"/apps/one/nested", d+"/apps/missing")},
		{ID: "dumps", Files: []string{d + "/dump.dmp"}},
		{ID: "prefetch"},
		{ID: "recycle", Scan: func() CleanResult { return CleanResult{ID: "recycle", Bytes: 5 << 20, Files: 3} }, Clean: func() CleanResult { return CleanResult{ID: "recycle"} }},
	}
}

var fakeJobs = []PrintJob{{"HP LaserJet 1020", 7, "Invoice-November.pdf", "user", 482000, "Error, Printing"}, {"HP LaserJet 1020", 8, "رسید.docx", "user", 91000, "Normal"}}

func printJobs() []PrintJob {
	if os.Getenv("PCMONITOR_TEST_PRINT") == "" {
		return []PrintJob{}
	}
	return fakeJobs
}

func printDelete(printer string, id int) bool {
	for i, j := range fakeJobs {
		if j.Printer == printer && j.ID == id {
			fakeJobs = append(fakeJobs[:i:i], fakeJobs[i+1:]...)
			return true
		}
	}
	return false
}

func printClear() (int, bool) { fakeJobs = nil; return 0, false }

// Fake antivirus for interface tests (PCMONITOR_TEST_AV=1).
var fakeThreats = []Threat{
	{ID: 1, Name: "Trojan:Win32/Wacatac.B!ml", Severity: 5, Active: true, Files: flexStrings{`file:_C:\Users\user\Downloads\crack_setup.exe`}},
	{ID: 2, Name: "PUA:Win32/Presenoker", Severity: 1, Active: false, Files: flexStrings{`file:_C:\Users\user\AppData\Local\Temp\toolbar.dll`}},
}

func avQuery() (AVInfo, string) {
	if os.Getenv("PCMONITOR_TEST_AV") == "" {
		return AVInfo{}, "Microsoft Defender is not available"
	}
	return AVInfo{Enabled: true, Realtime: true, SigAge: 3, QuickAge: 12, FullAge: 4294967295, Threats: fakeThreats}, ""
}

func avRun(kind string) string {
	time.Sleep(4 * time.Second)
	if kind == "remove" {
		fakeThreats = fakeThreats[1:]
	}
	return ""
}

func avOpen() {}
