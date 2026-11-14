# Grade-book generator (source)

Tools used to build the grade/syllabus books (Grade 1 onward). Copy this folder to a scratch directory and run from there:

- `make_<book>.py` (in `configs/`) writes `cfg_<book>.json` (answers are computed in Python where possible).
- `python3 lint.py cfg.json` — checks Urdu letters, ﷺ ligature, stacked/doubled harakat, words starting with sukun, unbalanced brackets.
- `python3 gen.py cfg.json` — generates `<dir>/src/build.js` (via `mkbook.py`), renders, and builds the App PDF with `arabic-kids-book/src/pdf.js`.
- `python3 dumptext.py cfg.json out.txt` — plain text for the proofreader.
- `bash finish.sh <dir> <prefix> "<arabic title>" "<topic>" <pages>` — checks PlayStore TXT lengths, writes README, adds the CLAUDE.md line, commits and pushes.

Layouts: `layout: "g6"` (Grade 6), `"g7"` (Grade 7), `"g8"` (Grade 8), `"g9"` (Grade 9), `"g10"` (Grade 10), `"g11"` (Grade 11), `"g12"` (Grade 12) in `gen_pages.js`; themes `theme3.css` … `theme12.css`. Every new grade needs a new layout/theme.
Note: `gen.py`, `mkbook.py` and `finish.sh` expect the repo at `/home/user/Inaam-Qarz`.


Grade-1 topic books (24 pages): layouts `k1`–`k10` (`kid_layouts.js` is merged into `gen_pages.js`; themes `themekN.css` = `kbase.css` + `kN.css`). Content: `configs/make_kids1.py` + `make_kids2.py` (run both; kids2 writes all ten `cfg_*.json`). Build small: `bash buildk.sh ramadan masjid ...` (uses `APP_MB=1.5`). Preview: `python3 ksheet.py <dir> 1,5,9 out.png`.
