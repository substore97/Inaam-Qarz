# حَيَوَانَاتِي الجَمِيلَة — My Lovely Animals

A 32-page A4 Arabic book for kids (ages 3–7) about 20 animals, with 3D clay-style illustrations.

- `Hayawanati-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Hayawanati-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Hayawanati-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd animals-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Hayawanati-Al-Jameela "حيواناتي الجميلة"
```
It reuses the art library and fonts from `arabic-kids-book/`.
