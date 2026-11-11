# دِينِي الجَمِيل — My Beautiful Religion

A 20-page A4 book for kids aged 3–7: the 5 pillars of Islam, the 6 pillars of Iman, the five daily prayers with rak'ahs, and the steps of wudu, with hadith sources and 3D illustrations (Kaaba, prayer mat, lantern…).

- `Dini-Al-Jameel-APP.pdf`: A4, Full HD, for the app
- `Dini-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Dini-Al-Jameel-Cover.jpg`: front cover
- `Dini-Al-Jameel-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd islam-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Dini-Al-Jameel "ديني الجميل"
```
