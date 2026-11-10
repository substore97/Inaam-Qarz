# أَلْعَابِي الجَمِيلَة — My Lovely Toys

A 28-page A4 Arabic book for kids aged 3–7 about 16 toys, with 3D clay-style illustrations and a page on good manners while playing. White words have a dark outline, and tracing words are solid light grey.

- `Alabi-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Alabi-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Alabi-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd toys-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Alabi-Al-Jameela "ألعابي الجميلة"
```
