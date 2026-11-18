// Prints build/book.html to a small VECTOR PDF (text stays sharp at any zoom, fonts subset-embedded).
// Before printing, every ".fit" page body is shrunk (font-size) until it fits its box.
// Usage: node src/pdf.js [out.pdf]   -> also prints any page that still overflows.
const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const OUT = process.argv[2] || path.join(ROOT, 'IELTS-Dictionary-APP.pdf');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file://' + path.join(ROOT, 'build', 'book.html'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const rep = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('section.pg').forEach((s, i) => {
      s.querySelectorAll('.fit').forEach(el => {
        let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
        while (el.scrollHeight > el.clientHeight + 1 && n < 60) { fs -= 0.2; el.style.fontSize = fs + 'px'; n++; }
        if (n) el.dataset.shrunk = fs.toFixed(1);
      });
      const pr = s.getBoundingClientRect();
      s.querySelectorAll('.body, .ix').forEach(el => { if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) bad.push(`p${i + 1}: overflow ${el.className}`); });
      s.querySelectorAll('.fit').forEach(el => { if (parseFloat(el.dataset.shrunk || 99) < 13) bad.push(`p${i + 1}: small text ${el.dataset.shrunk}px`); });
    });
    return bad;
  });
  console.log(rep.length ? rep.join('\n') : 'FIT OK');
  await p.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('PDF', OUT);
})();
