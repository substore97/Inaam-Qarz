# قصص الأنبياء

Arabic kids picture book (Stories of the Prophets, reading-only, layout k26) in 3D style, 50 A4 pages.

Build: `node src/build.js && BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Qisas-Al-Anbiya "قصص الأنبياء"`

Outputs: `Qisas-Al-Anbiya-APP.pdf` (Full HD, ≈4 MB) and `-PlayStore.txt` (set `PRINT=1` to also make the print PDF and cover).
