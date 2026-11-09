# أَرْقَامِي الجَمِيلَة — My Beautiful Numbers

A 32-page A4 Arabic numbers book (1–20) for kids aged 3–7, with 3D clay-style illustrations.

- `Arqami-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Arqami-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Arqami-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd numbers-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Arqami-Al-Jameela "أرقامي الجميلة"
```
