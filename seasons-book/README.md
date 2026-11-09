# فُصُولِي الجَمِيلَة — My Lovely Seasons & Weather

A 28-page A4 Arabic book for kids aged 3–7: 8 kinds of weather, the 4 seasons and the days of the week, with 3D clay-style illustrations.

- `Fusuli-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Fusuli-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Fusuli-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd seasons-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Fusuli-Al-Jameela "فصولي الجميلة"
```
