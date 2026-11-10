# فَضَائِي الجَمِيل — My Lovely Space

A 32-page A4 Arabic book for kids aged 3–7: the sun, the 8 planets, the moon, stars, comet, asteroid, galaxy and space machines, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Fadai-Al-Jameel-APP.pdf`: A4, Full HD, smallest file, for the app
- `Fadai-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Fadai-Al-Jameel-Cover.jpg`: front cover

Rebuild:
```
cd space-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Fadai-Al-Jameel "فضائي الجميل"
```
