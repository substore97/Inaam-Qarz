# أَضْدَادِي الجَمِيلَة — My Lovely Opposites

A 28-page A4 Arabic book for kids aged 3–7: 16 pairs of opposites, with 3D clay-style illustrations.

- `Adhdadi-Al-Jameela-APP.pdf`: A4, Full HD, smallest file, for the app
- `Adhdadi-Al-Jameela-PRINT.pdf`: A4, 300 DPI, for printing
- `Adhdadi-Al-Jameela-Cover.jpg`: front cover

Rebuild:
```
cd opposites-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Adhdadi-Al-Jameela "أضدادي الجميلة"
```
