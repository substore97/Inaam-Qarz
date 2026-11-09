// Renders every page of build/book.html to a high-res image, then packs them into PDFs:
//   Huroofi-Al-Jameela-PRINT.pdf   – 300 DPI, 8.5" x 8.5" (for printing / KDP / print shops)
//   Huroofi-Al-Jameela-MOBILE.pdf  – 150 DPI, small file for phones / your app
// Raster pages look identical in every PDF viewer (phones included).
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'build', 'pages');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 816, height: 816 }, deviceScaleFactor: 3.125 }); // 816px * 3.125 = 2550px = 8.5in @300dpi
  await p.goto('file://' + path.join(ROOT, 'build', 'book.html'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const secs = await p.$$('section');
  for (let i = 0; i < secs.length; i++) {
    await secs[i].screenshot({ path: path.join(OUT, `page-${String(i + 1).padStart(2, '0')}.png`) });
  }
  await b.close();
  execFileSync('python3', ['-I', path.join(__dirname, 'pack.py'), OUT, ROOT], { stdio: 'inherit' });
})();
