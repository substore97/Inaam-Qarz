# أَلْوَانِي وَأَشْكَالِي — My Colors & Shapes

A 32-page A4 Arabic book for kids aged 3–7: 10 colors and 10 shapes, with 3D clay-style illustrations.

- `Alwani-wa-Ashkali-APP.pdf`: A4, Full HD, smallest file, for the app
- `Alwani-wa-Ashkali-PRINT.pdf`: A4, 300 DPI, for printing
- `Alwani-wa-Ashkali-Cover.jpg`: front cover

Rebuild:
```
cd colors-shapes-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Alwani-wa-Ashkali "ألواني وأشكالي"
```
