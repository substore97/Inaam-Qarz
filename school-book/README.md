# أَدَوَاتِي المَدْرَسِيَّة — My School Supplies

A 28-page A4 Arabic book for kids aged 3–7 about 16 school supplies, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Adawati-Al-Madrasiyya-APP.pdf`: A4, Full HD, smallest file, for the app
- `Adawati-Al-Madrasiyya-PRINT.pdf`: A4, 300 DPI, for printing
- `Adawati-Al-Madrasiyya-Cover.jpg`: front cover
- `Adawati-Al-Madrasiyya-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd school-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Adawati-Al-Madrasiyya "أدواتي المدرسية"
```
