package main

import (
	"encoding/json"
	"strings"
)

// psTry runs a Defender command and returns "" on success or the error text.
func psTry(script string) (out string, errText string) {
	b, err := ps(nil, `try { `+script+` } catch { 'ERR:' + $_.Exception.Message }`)
	out = strings.TrimSpace(string(b))
	if i := strings.Index(out, "ERR:"); i >= 0 {
		msg := strings.TrimSpace(out[i+4:])
		if len(msg) > 300 {
			msg = msg[:300]
		}
		if msg == "" {
			msg = "unknown error"
		}
		return "", msg
	}
	if err != nil && out == "" {
		return "", "Microsoft Defender is not available"
	}
	return out, ""
}

func avQuery() (AVInfo, string) {
	var info AVInfo
	out, errText := psTry(`$s = Get-MpComputerStatus -ErrorAction Stop; ` +
		`$t = @(Get-MpThreat -ErrorAction SilentlyContinue | Select-Object -First 40 @{n='id';e={[long]$_.ThreatID}},@{n='name';e={$_.ThreatName}},` +
		`@{n='severity';e={[int]$_.SeverityID}},@{n='active';e={[bool]$_.IsActive}},@{n='files';e={,@($_.Resources | Select-Object -First 4)}}); ` +
		`ConvertTo-Json -Compress -Depth 4 -InputObject @{enabled=[bool]$s.AntivirusEnabled; realtime=[bool]$s.RealTimeProtectionEnabled; ` +
		`sigAge=[long]$s.AntivirusSignatureAge; quickAge=[long]$s.QuickScanAge; fullAge=[long]$s.FullScanAge; threats=$t}`)
	if errText != "" {
		return info, errText
	}
	if json.Unmarshal([]byte(out), &info) != nil {
		return info, "could not read Microsoft Defender status"
	}
	return info, ""
}

// avRun blocks until the job is finished and returns "" or the error text.
func avRun(kind string) string {
	cmd := map[string]string{
		"quick":  `Start-MpScan -ScanType QuickScan -ErrorAction Stop`,
		"full":   `Start-MpScan -ScanType FullScan -ErrorAction Stop`,
		"update": `Update-MpSignature -ErrorAction Stop`,
		"remove": `Remove-MpThreat -ErrorAction Stop`,
	}[kind]
	_, errText := psTry(cmd + `; 'OK'`)
	return errText
}

// avOpen shows Windows Security's own protection page (history, quarantine, restore).
func avOpen() {
	run(nil, "explorer.exe", "windowsdefender://threat")
}
