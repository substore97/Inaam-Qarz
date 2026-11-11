# جِسْمِي الجَمِيل — My Lovely Body

A 24-page A4 Arabic book for kids aged 3–7 about 10 body parts, the five senses and healthy habits, with 3D clay-style illustrations.

- `Jismi-Al-Jameel-APP.pdf`: A4, Full HD, for the app
- `Jismi-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Jismi-Al-Jameel-Cover.jpg`: front cover
- `Jismi-Al-Jameel-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd body-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Jismi-Al-Jameel "جسمي الجميل"
```
