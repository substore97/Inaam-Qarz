# Notes for Claude

## Book delivery preferences (from the owner, Inaam ur Rahman)
Every time a book is made or updated, send ALL of these to the user:
1. **App PDF**: as few MB as possible but Full HD (1920 px tall pages), with no visible quality loss. This is what goes in their app.
2. **Full PDF**: full-quality print version (300 DPI).
3. **Front cover as a separate JPG**.

**Page size: always A4 (portrait).**

**Tracing words are solid light grey (`fill:#dcd5e8`), never dashed outlines.**

**White text always gets a dark outline/border** so it is clearly readable (see `ring()` / `t3d()` in `home-book/src/build.js`).

Author credit "تأليف: انعام الرحمن" goes on page 2 only, always directly below the heading "هذا الكتاب ملك", not on the front or back cover. Page 2 has no "عمري ... سنوات" (age) line.
User communicates in Roman Urdu; reply in Roman Urdu.

## Books so far
- `arabic-kids-book/`: حروفي الجميلة (Arabic alphabet), 36 pages
- `animals-book/`: حيواناتي الجميلة (animals), 32 pages
- `numbers-book/`: أرقامي الجميلة (numbers 1–20), 32 pages
- `colors-shapes-book/`: ألواني وأشكالي (colors & shapes), 32 pages
- `fruits-veg-book/`: فواكهي وخضراواتي (fruits & vegetables), 32 pages
- `vehicles-book/`: مركباتي الجميلة (vehicles), 32 pages
- `opposites-book/`: أضدادي الجميلة (opposites), 28 pages
- `seasons-book/`: فصولي الجميلة (weather, seasons & days), 28 pages
- `home-book/`: بيتي الجميل (things at home), 32 pages
- `space-book/`: فضائي الجميل (space & planets), 32 pages
- `sea-book/`: بحري الجميل (sea creatures), 28 pages
- `toys-book/`: ألعابي الجميلة (toys & play manners), 28 pages

Shared tooling lives in `arabic-kids-book/src/` (3D art library `art.js`, `pdf.js`, `pack.py`).
For a new book: `BOOK_DIR=<dir> node arabic-kids-book/src/pdf.js <FilePrefix> "<Arabic title>"`.
