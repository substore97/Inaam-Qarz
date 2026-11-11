# أَخْلَاقِي الجَمِيلَة — My Good Manners

A 24-page A4 book for kids aged 3–7 about 12 good manners, with short ayat/ahadith and their sources, and 3D kid characters (boys and girls).

- `Akhlaqi-Al-Jameela-APP.pdf`: A4, Full HD, for the app
- `Akhlaqi-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Akhlaqi-Al-Jameela-Cover.jpg`: front cover
- `Akhlaqi-Al-Jameela-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd manners-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Akhlaqi-Al-Jameela "أخلاقي الجميلة"
```
