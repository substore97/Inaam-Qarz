# أَدْعِيَتِي الجَمِيلَة — My Beautiful Duas

A 28-page A4 book of 16 daily duas for children aged 3–7, with full harakat, English meaning and source (Quran / Sunnah), and 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Adiyati-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Adiyati-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Adiyati-Al-Jameela-Cover.jpg`: front cover
- `Adiyati-Al-Jameela-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd duas-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Adiyati-Al-Jameela "أدعيتي الجميلة"
```
