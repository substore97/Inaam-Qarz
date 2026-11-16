package main

import (
	"encoding/json"
	"sync"
	"time"
)

// Virus scanning is done by Microsoft Defender, the antivirus built into Windows.
// This program only starts its scans and shows what it found; Defender decides what
// is harmful and quarantines it (quarantined files can be restored in Windows Security).

type flexStrings []string // PowerShell writes a one-item list as a plain string

func (f *flexStrings) UnmarshalJSON(b []byte) error {
	var many []string
	if json.Unmarshal(b, &many) == nil {
		*f = many
		return nil
	}
	var one string
	if json.Unmarshal(b, &one) == nil && one != "" {
		*f = []string{one}
	}
	return nil
}

type Threat struct {
	ID       int64       `json:"id"`
	Name     string      `json:"name"`
	Severity int         `json:"severity"` // 1 low, 2 moderate, 4 high, 5 severe
	Active   bool        `json:"active"`
	Files    flexStrings `json:"files"`
}

type AVInfo struct {
	Enabled  bool     `json:"enabled"`
	Realtime bool     `json:"realtime"`
	SigAge   int64    `json:"sigAge"`   // days since virus definitions were updated
	QuickAge int64    `json:"quickAge"` // days since last quick scan (huge = never)
	FullAge  int64    `json:"fullAge"`
	Threats  []Threat `json:"threats"`
}

type AVState struct {
	Supported bool   `json:"supported"`
	Error     string `json:"error"`
	Info      AVInfo `json:"info"`
	Busy      string `json:"busy"` // "", quick, full, update, remove
	BusySecs  int    `json:"busySecs"`
	LastKind  string `json:"lastKind"`
	LastErr   string `json:"lastErr"`
	Admin     bool   `json:"admin"`
}

var av struct {
	sync.Mutex
	busy              string
	started           time.Time
	lastKind, lastErr string
	cache             AVInfo
	cacheErr          string
	cacheAt           time.Time
}

func avGet() AVState {
	av.Lock()
	stale := time.Since(av.cacheAt) > 4*time.Second
	av.Unlock()
	if stale {
		info, errText := avQuery()
		av.Lock()
		av.cache, av.cacheErr, av.cacheAt = info, errText, time.Now()
		av.Unlock()
	}
	av.Lock()
	defer av.Unlock()
	s := AVState{Supported: av.cacheErr == "", Error: av.cacheErr, Info: av.cache, Busy: av.busy,
		LastKind: av.lastKind, LastErr: av.lastErr, Admin: isAdmin()}
	if s.Info.Threats == nil {
		s.Info.Threats = []Threat{}
	}
	if av.busy != "" {
		s.BusySecs = int(time.Since(av.started).Seconds())
	}
	return s
}

// avStart begins a scan / update / removal in the background. One job at a time.
func avStart(kind string) bool {
	switch kind {
	case "quick", "full", "update", "remove":
	default:
		return false
	}
	av.Lock()
	defer av.Unlock()
	if av.busy != "" {
		return false
	}
	av.busy, av.started = kind, time.Now()
	go func() {
		errText := avRun(kind)
		av.Lock()
		av.busy, av.lastKind, av.lastErr, av.cacheAt = "", kind, errText, time.Time{}
		av.Unlock()
	}()
	return true
}
