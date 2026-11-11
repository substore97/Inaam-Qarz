# طَعَامِي الجَمِيل — My Lovely Food

A 28-page A4 Arabic book for kids aged 3–7 about 16 foods, where they come from, and the manners of eating, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Taami-Al-Jameel-APP.pdf`: A4, Full HD, smallest file, for the app
- `Taami-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Taami-Al-Jameel-Cover.jpg`: front cover

Rebuild:
```
cd food-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Taami-Al-Jameel "طعامي الجميل"
```
