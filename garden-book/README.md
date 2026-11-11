# حَدِيقَتِي الجَمِيلَة — My Lovely Garden

A 24-page A4 Arabic book for kids aged 3–7 about 12 plants and garden things, how a plant grows, and what plants need, with 3D clay-style illustrations.

- `Hadiqati-Al-Jameela-APP.pdf`: A4, Full HD, for the app
- `Hadiqati-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Hadiqati-Al-Jameela-Cover.jpg`: front cover
- `Hadiqati-Al-Jameela-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd garden-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Hadiqati-Al-Jameela "حديقتي الجميلة"
```
