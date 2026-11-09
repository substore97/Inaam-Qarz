# مَرْكَبَاتِي الجَمِيلَة — My Lovely Vehicles

A 32-page A4 Arabic book for kids aged 3–7: 20 vehicles on land, at sea and in the air, with 3D clay-style illustrations.

- `Markabati-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Markabati-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Markabati-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd vehicles-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Markabati-Al-Jameela "مركباتي الجميلة"
```
