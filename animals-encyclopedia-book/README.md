# موسوعتي للحيوانات

Arabic kids picture book (My Animal Encyclopedia, reading-only, layout k18) in 3D style, 50 A4 pages.

Build: `node src/build.js && BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Mawsuat-Al-Hayawanat "موسوعتي للحيوانات"`

Outputs: `Mawsuat-Al-Hayawanat-APP.pdf` (Full HD, ≈4 MB) and `-PlayStore.txt` (set `PRINT=1` to also make the print PDF and cover).
