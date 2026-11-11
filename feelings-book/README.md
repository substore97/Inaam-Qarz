# مَشَاعِرِي الجَمِيلَة — My Feelings

A 24-page A4 Arabic book for kids aged 3–7 about 12 feelings, how to express them, and how to calm down when angry (with hadith sources), with 3D emoji-style faces.

- `Mashairi-Al-Jameela-APP.pdf`: A4, Full HD, for the app
- `Mashairi-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Mashairi-Al-Jameela-Cover.jpg`: front cover
- `Mashairi-Al-Jameela-PlayStore.txt`: name (Arabic/English) and Arabic description for Play Console

Rebuild:
```
cd feelings-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Mashairi-Al-Jameela "مشاعري الجميلة"
```
