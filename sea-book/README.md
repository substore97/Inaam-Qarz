# بَحْرِي الجَمِيل — My Lovely Sea

A 28-page A4 Arabic book for kids aged 3–7 about 16 sea creatures, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Bahri-Al-Jameel-APP.pdf`: A4, Full HD, smallest file, for the app
- `Bahri-Al-Jameel-PRINT.pdf`: A4, 300 DPI, for printing
- `Bahri-Al-Jameel-Cover.jpg`: front cover

Rebuild:
```
cd sea-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Bahri-Al-Jameel "بحري الجميل"
```
