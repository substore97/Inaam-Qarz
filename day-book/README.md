# يَوْمِي الجَمِيل — My Lovely Day

A 24-page A4 Arabic book for kids aged 3–7 about the daily routine and telling time (full and half hours, morning/evening), with 3D clocks and illustrations.

- `Yawmi-Al-Jameel-APP.pdf`: A4, Full HD, for the app
- `Yawmi-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Yawmi-Al-Jameel-Cover.jpg`: front cover
- `Yawmi-Al-Jameel-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd day-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Yawmi-Al-Jameel "يومي الجميل"
```
