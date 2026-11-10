# طُيُورِي وَحَشَرَاتِي — My Birds & Insects

A 28-page A4 Arabic book for kids aged 3–7 about 8 birds and 8 insects, including the butterfly life cycle, with 3D clay-style illustrations. White words have a dark outline, and tracing words are solid light grey.

- `Tuyuri-wa-Hasharati-APP.pdf`: A4, Full HD, smallest file, for the app
- `Tuyuri-wa-Hasharati-PRINT.pdf`: A4, 300 DPI, for printing
- `Tuyuri-wa-Hasharati-Cover.jpg`: front cover

Rebuild:
```
cd birds-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Tuyuri-wa-Hasharati "طيوري وحشراتي"
```
