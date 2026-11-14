# قاموسي المصور

Arabic kids picture book (My Picture Dictionary, reading-only, layout k33) in 3D style, 50 A4 pages.

Build: `node src/build.js && BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Qamusi-Al-Musawwar "قاموسي المصور"`

Outputs: `Qamusi-Al-Musawwar-APP.pdf` (Full HD, ≈4 MB) and `-PlayStore.txt` (set `PRINT=1` to also make the print PDF and cover).
