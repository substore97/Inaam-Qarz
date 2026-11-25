// node src/pdf.js [out.pdf] : waits for src/paginate.js to finish inside build/book.html, reports problems, prints a vector PDF.
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'Claude-Urdu-APP.pdf');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  p.on('pageerror', e => console.log('JS ERROR', e.message));
  await p.goto('file://' + path.join(ROOT, 'build', 'book.html'), { waitUntil: 'load' });
  await p.waitForFunction(() => window.__done, null, { timeout: 0, polling: 1000 });
  const r = await p.evaluate(() => window.__done);
  console.log('pages', r.pages); console.log(r.warn.length ? r.warn.slice(0, 40).join('\n') : 'LAYOUT OK');
  await p.pdf({ path: OUT + '.raw', format: 'A4', printBackground: true, preferCSSPageSize: true });
  require('child_process').execFileSync('python3', [path.join(__dirname, 'squeeze.py'), OUT + '.raw', OUT, 'کلاڈ اے آئی — مکمل رہنما']); require('fs').unlinkSync(OUT + '.raw');
  await b.close(); console.log('PDF', OUT);
})();
