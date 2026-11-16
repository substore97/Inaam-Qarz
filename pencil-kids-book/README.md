# القلم المتكلم

Arabic kids picture book (The Talking Pencil, reading-only, kx combo 88) in 3D style, 40 A4 pages.

Build: `node src/build.js && BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Pencil-Kids "القلم المتكلم"`

Outputs: `Pencil-Kids-APP.pdf` (Full HD, ≈4 MB) and `-PlayStore.txt` (set `PRINT=1` to also make the print PDF and cover).
