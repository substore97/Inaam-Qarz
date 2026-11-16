package main

import (
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// A Target is one kind of junk. Only files inside its Dirs (matching Pattern, older
// than MinAge) or listed in Files are ever deleted. Documents, pictures, passwords,
// cookies, history and program settings do not live in any of these places.
type Target struct {
	ID      string
	Dirs    []string
	Files   []string      // individual files
	Pattern string        // optional file-name glob for Dirs
	MinAge  time.Duration // skip newer files (they may belong to a running program)
	// Special targets (the Recycle Bin) bring their own logic.
	Scan, Clean func() CleanResult
}

type Place struct {
	Path  string `json:"path"`
	Bytes int64  `json:"bytes"`
	Files int    `json:"files"`
}

type CleanResult struct {
	ID      string  `json:"id"`
	Files   int     `json:"files"`
	Bytes   int64   `json:"bytes"`
	Skipped int     `json:"skipped"` // in use or no permission
	Places  []Place `json:"places"`  // biggest locations, for display
}

// safeRoot refuses folders that must never be emptied, whatever the environment says.
func safeRoot(root string) bool {
	if root == "" {
		return false
	}
	c := filepath.Clean(root)
	home, _ := os.UserHomeDir()
	for _, bad := range []string{filepath.VolumeName(c) + string(os.PathSeparator), "/", home, os.Getenv("WINDIR"),
		os.Getenv("ProgramFiles"), os.Getenv("ProgramFiles(x86)"), os.Getenv("ProgramData"), os.Getenv("APPDATA"), os.Getenv("LOCALAPPDATA")} {
		if bad != "" && strings.EqualFold(c, filepath.Clean(bad)) {
			return false
		}
	}
	return true
}

// walk visits deletable files. It never follows links/junctions and never leaves root.
func (t Target) walk(remove bool) (res CleanResult) {
	res.ID = t.ID
	cutoff := time.Now().Add(-t.MinAge)
	visit := func(path string, info fs.FileInfo, pl *Place) {
		if remove && os.Remove(path) != nil {
			res.Skipped++
			return
		}
		res.Files++
		res.Bytes += info.Size()
		pl.Files++
		pl.Bytes += info.Size()
	}
	for _, root := range t.Dirs {
		if !safeRoot(root) {
			continue
		}
		pl := Place{Path: root}
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
				return nil // link, junction, cloud placeholder, device: leave alone
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
			visit(path, info, &pl)
			return nil
		})
		if remove && t.Pattern == "" {
			// remove folders that are now empty (deepest first); non-empty ones simply fail
			sort.Slice(dirs, func(i, j int) bool { return len(dirs[i]) > len(dirs[j]) })
			for _, d := range dirs {
				os.Remove(d)
			}
		}
		if pl.Files > 0 {
			res.Places = append(res.Places, pl)
		}
	}
	for _, f := range t.Files {
		if info, err := os.Lstat(f); err == nil && info.Mode().IsRegular() {
			pl := Place{Path: f}
			visit(f, info, &pl)
			if pl.Files > 0 {
				res.Places = append(res.Places, pl)
			}
		}
	}
	sort.Slice(res.Places, func(i, j int) bool { return res.Places[i].Bytes > res.Places[j].Bytes })
	if len(res.Places) > 15 {
		res.Places = res.Places[:15]
	}
	return
}

func scanAll() []CleanResult {
	out := []CleanResult{}
	for _, t := range targets() {
		if t.Scan != nil {
			out = append(out, t.Scan())
		} else {
			out = append(out, t.walk(false))
		}
	}
	return out
}

func cleanAll(ids []string) []CleanResult {
	want := map[string]bool{}
	for _, id := range ids {
		want[id] = true
	}
	out := []CleanResult{}
	for _, t := range targets() {
		if !want[t.ID] {
			continue
		}
		if t.Clean != nil {
			out = append(out, t.Clean())
		} else {
			out = append(out, t.walk(true))
		}
	}
	return out
}

// dirSet collects existing folders, dropping duplicates and folders nested inside
// one that is already claimed, so nothing is counted twice across categories.
type dirSet struct{ seen []string }

func (s *dirSet) add(dirs ...string) (out []string) {
next:
	for _, d := range dirs {
		if st, err := os.Lstat(d); err != nil || !st.IsDir() {
			continue
		}
		low := strings.ToLower(filepath.Clean(d))
		for _, o := range s.seen {
			if low == o || strings.HasPrefix(low, o+string(os.PathSeparator)) {
				continue next
			}
		}
		s.seen = append(s.seen, low)
		out = append(out, d)
	}
	return
}

func glob(patterns ...string) (out []string) {
	for _, p := range patterns {
		m, _ := filepath.Glob(p)
		out = append(out, m...)
	}
	return
}
