# گلدستہ — Guldasta, Urdu family digest (رسالہ)

700+ page A4 Urdu family magazine (Noto Nastaliq Urdu; Quran in Amiri with the exact Uthmani text). Reading-only, no grade.

- Content: `content/w01.json … w15.json` (one file per writer/section), `content/static.json` (cover, page 2,
  editorial, section order/colours/intros), `content/quran_verses.json` (cache of the exact ayat used).
- Writers' brief, proofreading brief, validator: `tools/BRIEF.md`, `tools/PROOF.md`, `node tools/validate.js content/wNN.json`.
- Build: `python3 src/build.py && node src/pdf.js` → `Guldasta-Urdu-APP.pdf` (vector).
  `src/paginate.js` flows the text into pages in the browser (two columns for articles/stories, one for
  Quran/hadith/recipes/lists), fills leftover space with small boxes (jokes, facts, proverbs, wisdom) and numbers
  pages/contents. To refresh the Quran cache after changing ayah numbers: `QURAN_JSON=<quran-json>/dist/quran.json python3 src/build.py`
  (npm package `quran-json`, CC-BY-4.0).
