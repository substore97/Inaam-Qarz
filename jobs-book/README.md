# مِهَنِي الجَمِيلَة — My Lovely Professions

A 24-page A4 Arabic book for kids aged 3–7 about 12 professions, with 3D kid characters in uniform.

- `Mihani-Al-Jameela-APP.pdf`: A4, Full HD, for the app
- `Mihani-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Mihani-Al-Jameela-Cover.jpg`: front cover
- `Mihani-Al-Jameela-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd jobs-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Mihani-Al-Jameela "مهني الجميلة"
```
