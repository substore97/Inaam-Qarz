# بَيْتِي الجَمِيل — My Lovely Home

A 32-page A4 Arabic book for kids aged 3–7: 20 things found in 4 rooms of the home, with 3D clay-style illustrations.
Every white word has a dark outline so it stays readable.

- `Bayti-Al-Jameel-APP.pdf`: A4, Full HD, smallest file, for the app
- `Bayti-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Bayti-Al-Jameel-Cover.jpg`: front cover

Rebuild:
```
cd home-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Bayti-Al-Jameel "بيتي الجميل"
```
