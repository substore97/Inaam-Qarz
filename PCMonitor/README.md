# PC Monitor / پی سی مانیٹر

Windows tool (English + Urdu) that shows what is slowing the PC: hung programs,
CPU, RAM, disk and network use per program, plus a safe cache / temp-file cleaner.

- Ready program: `release/PCMonitor.exe` (Windows 10/11, 64-bit, no install)
- Build: `GOOS=windows GOARCH=amd64 go build -ldflags "-s -w -H windowsgui" -o release/PCMonitor.exe .`

It runs a page on 127.0.0.1 only and opens it in an Edge app window; nothing is sent anywhere.
