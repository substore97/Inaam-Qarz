package main

import (
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"time"
)

// A Target is one kind of junk. Only files inside its Dirs (matching Pattern, older
// than MinAge) are ever deleted. Documents, pictures, passwords, cookies, history and
// program settings do not live in any of these folders.
type Target struct {
	ID      string
	Dirs    []string
	Pattern string        // optional file-name glob
	MinAge  time.Duration // skip newer files (they may belong to a running program)
}

type CleanResult struct {
	ID      string `json:"id"`
	Files   int    `json:"files"`
	Bytes   int64  `json:"bytes"`
	Skipped int    `json:"skipped"` // in use or no permission
}

// walk visits deletable files. It never follows links/junctions and never leaves root.
func (t Target) walk(visit func(path string, size int64) bool) (res CleanResult) {
	res.ID = t.ID
	cutoff := time.Now().Add(-t.MinAge)
	for _, root := range t.Dirs {
		if root == "" || len(filepath.Clean(root)) < 8 { // refuse anything as short as a drive root
			continue
		}
		var dirs []string
		filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				if d != nil && d.IsDir() {
					return fs.SkipDir
				}
				return nil
			}
			if d.IsDir() {
				if path != root {
					dirs = append(dirs, path)
				}
				return nil
			}
			if !d.Type().IsRegular() {
				return nil // link, junction, device: leave alone
			}
			if t.Pattern != "" {
				if ok, _ := filepath.Match(t.Pattern, d.Name()); !ok {
					return nil
				}
			}
			info, err := d.Info()
			if err != nil || (t.MinAge > 0 && info.ModTime().After(cutoff)) {
				return nil
			}
			if visit(path, info.Size()) {
				res.Files++
				res.Bytes += info.Size()
			} else {
				res.Skipped++
			}
			return nil
		})
		if visit != nil && t.Pattern == "" && cleaning {
			// remove folders that are now empty (deepest first); non-empty ones simply fail
			sort.Slice(dirs, func(i, j int) bool { return len(dirs[i]) > len(dirs[j]) })
			for _, d := range dirs {
				os.Remove(d)
			}
		}
	}
	return
}

var cleaning bool

func scanAll() []CleanResult {
	out := []CleanResult{}
	for _, t := range targets() {
		out = append(out, t.walk(func(string, int64) bool { return true }))
	}
	return out
}

func cleanAll(ids []string) []CleanResult {
	want := map[string]bool{}
	for _, id := range ids {
		want[id] = true
	}
	out := []CleanResult{}
	cleaning = true
	defer func() { cleaning = false }()
	for _, t := range targets() {
		if want[t.ID] {
			out = append(out, t.walk(func(p string, _ int64) bool { return os.Remove(p) == nil }))
		}
	}
	return out
}

func glob(patterns ...string) (out []string) {
	for _, p := range patterns {
		m, _ := filepath.Glob(p)
		out = append(out, m...)
	}
	return
}
