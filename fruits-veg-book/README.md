# فَوَاكِهِي وَخَضْرَاوَاتِي — My Fruits & Vegetables

A 32-page A4 Arabic book for kids aged 3–7: 10 fruits and 10 vegetables, with 3D clay-style illustrations.

- `Fawakihi-wa-Khadrawati-APP.pdf`: A4, Full HD, smallest file, for the app
- `Fawakihi-wa-Khadrawati-PRINT.pdf`: A4, 300 DPI, for printing
- `Fawakihi-wa-Khadrawati-Cover.jpg`: front cover

Rebuild:
```
cd fruits-veg-book
node src/build.js
BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js Fawakihi-wa-Khadrawati "فواكهي وخضراواتي"
```
