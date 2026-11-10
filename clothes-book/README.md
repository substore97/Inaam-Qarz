# مَلَابِسِي الجَمِيلَة — My Lovely Clothes

A 28-page A4 Arabic book for kids aged 3–7 about 16 clothing items, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Malabisi-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Malabisi-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Malabisi-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd clothes-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Malabisi-Al-Jameela "ملابسي الجميلة"
```
