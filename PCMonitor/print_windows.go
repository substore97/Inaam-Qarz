package main

import (
	"encoding/json"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

// run executes a command without flashing a console window.
func run(env []string, name string, args ...string) ([]byte, error) {
	c := exec.Command(name, args...)
	c.SysProcAttr = &syscall.SysProcAttr{HideWindow: true, CreationFlags: 0x08000000} // CREATE_NO_WINDOW
	c.Env = append(os.Environ(), env...)
	return c.Output()
}

func ps(env []string, script string) ([]byte, error) {
	return run(env, "powershell", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command",
		"[Console]::OutputEncoding=[Text.Encoding]::UTF8; "+script)
}

// printJobs lists every job waiting in every printer's queue.
func printJobs() []PrintJob {
	out, err := ps(nil, `$j=@(Get-Printer | ForEach-Object { Get-PrintJob -PrinterName $_.Name -ErrorAction SilentlyContinue } | `+
		`Select-Object @{n='printer';e={$_.PrinterName}},@{n='id';e={[int]$_.Id}},@{n='doc';e={$_.DocumentName}},`+
		`@{n='user';e={$_.UserName}},@{n='size';e={[long]$_.Size}},@{n='status';e={$_.JobStatus.ToString()}}); `+
		`ConvertTo-Json -Compress -InputObject $j`)
	jobs := []PrintJob{}
	if err == nil {
		json.Unmarshal(out, &jobs)
	}
	return jobs
}

// printDelete removes one job. Names travel in environment variables, never in the script text.
func printDelete(printer string, id int) bool {
	_, err := ps([]string{"PCM_PRINTER=" + printer, "PCM_JOB=" + strconv.Itoa(id)},
		`Remove-PrintJob -PrinterName $env:PCM_PRINTER -ID ([int]$env:PCM_JOB) -ErrorAction Stop`)
	return err == nil
}

// printClear empties all queues. The polite way first; if jobs are stuck and we are
// administrator, restart the print spooler and delete its queue files.
func printClear() (remaining int, forced bool) {
	for _, j := range printJobs() {
		printDelete(j.Printer, j.ID)
	}
	time.Sleep(1500 * time.Millisecond)
	left := printJobs()
	if len(left) == 0 || !isAdmin() {
		return len(left), false
	}
	run(nil, "net", "stop", "spooler", "/y")
	if win := os.Getenv("WINDIR"); win != "" {
		files, _ := filepath.Glob(filepath.Join(win, "System32", "spool", "PRINTERS", "*"))
		for _, f := range files {
			if st, err := os.Lstat(f); err == nil && st.Mode().IsRegular() {
				os.Remove(f)
			}
		}
	}
	run(nil, "net", "start", "spooler")
	time.Sleep(2 * time.Second)
	return len(printJobs()), true
}

// shutdownPC turns the computer off. It does not force programs to close, so Windows
// still stops and asks if a program has unsaved work.
func shutdownPC() bool {
	_, err := run(nil, "shutdown", "/s", "/t", "0")
	return err == nil
}
