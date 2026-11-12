// Renders every page of build/book.html to a high-res image, then packs them into PDFs:
//   Huroofi-Al-Jameela-PRINT.pdf   – 300 DPI, A4, 300 DPI (for printing)
//   Huroofi-Al-Jameela-APP.pdf     – Full HD, smallest file for your app
// Usage for another book: BOOK_DIR=<dir> node pdf.js <FilePrefix> <Arabic title>
// Raster pages look identical in every PDF viewer (phones included).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = process.env.BOOK_DIR || path.join(__dirname, '..');
const OUT = path.join(ROOT, 'build', 'pages');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: process.env.PRINT ? 3.125 : 2 }); // A4 = 794x1123 CSS px -> ~2481x3509 px (300 DPI)
  await p.goto('file://' + path.join(ROOT, 'build', 'book.html'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const secs = await p.$$('section');
  for (let i = 0; i < secs.length; i++) {
    await secs[i].screenshot({ path: path.join(OUT, `page-${String(i + 1).padStart(2, '0')}.png`) });
  }
  await b.close();
  execFileSync('python3', ['-I', path.join(__dirname, 'pack.py'), OUT, ROOT, ...process.argv.slice(2)], { stdio: 'inherit' });
})();
