# أَصْوَاتُ الحَيَوَانَات — Animal Sounds

A 24-page A4 Arabic book for kids aged 3–7: 12 animals with the correct Arabic verb and noun for each sound, with 3D clay-style illustrations.

- `Aswat-Al-Hayawanat-APP.pdf`: A4, Full HD, for the app
- `Aswat-Al-Hayawanat-PRINT.pdf`: A4, 300 DPI, for printing
- `Aswat-Al-Hayawanat-Cover.jpg`: front cover
- `Aswat-Al-Hayawanat-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd sounds-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Aswat-Al-Hayawanat "أصوات الحيوانات"
```
