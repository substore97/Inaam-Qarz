# My Big English Book — كتابي الكبير للإنجليزية

53-page A4 colourful English picture-word book for ages 1–7 (layout `e1` "bubble-gum pop": bright gradient pages,
white cloud title banner, white candy cards with a coloured 3D bottom edge, 3D art in a soft colour bubble, English word
+ Arabic meaning with harakat). 477 items: alphabet (2 letters per page, letter highlighted), numbers 1–20 with dots,
colours, shapes, 29 themes, days & months, 16 sentences. Reading-only.

- Content: `content/pages.json` · Build: `node src/build.js` then
  `APP_MB=3.5 BOOK_DIR=$PWD node ../arabic-kids-book/src/pdf.js My-Big-English "كتابي الكبير للإنجليزية"`
- 3D art from `arabic-kids-book/src/extra100-art.js`; fonts Fredoka + Baloo Bhaijaan 2.
