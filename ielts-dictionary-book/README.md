# قاموسي للآيلتس – My IELTS Dictionary (English ⇄ Arabic, for adults)

218-page A4 study dictionary for IELTS: 600 headwords in 20 topics (British IPA, CEFR level, Arabic meaning,
translated example, synonyms, collocations, word family), per topic a practice page with answers, Speaking
Parts 1–3 models and a model essay (Task 1 chart report for topic 20), guide pages, and English→Arabic /
Arabic→English indexes. Reading-only (no writing space), no grade.

- Content: `content/topics.json`, `content/t01.json … t20.json`, `content/extra.json`
- Content brief / proofreading brief / validator: `tools/BRIEF.md`, `tools/EXTRA.md`, `tools/PROOF.md`,
  `node tools/validate.js content/tNN.json`
- Build: `python3 src/build.py && node src/pdf.js` → `IELTS-Dictionary-APP.pdf` (vector PDF, ~5.6 MB;
  `.fit` page bodies auto-shrink, the script reports any overflow)
- Fonts (SIL Open Font License): Noto Sans / Noto Serif (with IPA) and Noto Naskh Arabic, subsets in `fonts/`
