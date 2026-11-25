// node reading-tools/check.js <book-dir> [outdir pages...] : overflow check + optional screenshots (scale 0.5)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2]);
  const out = process.argv[3]; const want = (process.argv[4] || '').split(',').filter(Boolean).map(Number);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file://' + path.join(dir, 'build', 'book.html'));
  await p.evaluate(() => document.fonts.ready);
  const bad = await p.evaluate(() => {
    const o = [];
    document.querySelectorAll('section').forEach((s, i) => {
      const R = s.getBoundingClientRect();
      const pno = s.querySelector('.pno'); const P = pno && pno.getBoundingClientRect();
      s.querySelectorAll('.tbl, .note, .legend, .cards, .card, .stories, .story, .ttl, .own, .cvc, .cell p, .stext p').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom > R.bottom - 34 || r.top < R.top) o.push(`p${i + 1} OUT ${el.className}`);
        if (P && r.bottom > P.top + 2 && r.left < P.right && r.right > P.left && !el.closest('.cover')) o.push(`p${i + 1} OVER PAGE NO ${el.className}`);
      });
      s.querySelectorAll('.cell, .card, .story, .stext').forEach(el => { if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) o.push(`p${i + 1} CLIP ${el.className} «${el.textContent.trim().slice(0, 20)}»`); });
    });
    return o;
  });
  console.log(bad.length ? [...new Set(bad)].slice(0, 30).join('\n') : 'LAYOUT OK');
  if (out) { const secs = await p.$$('section'); for (const i of want) await secs[i - 1].screenshot({ path: `${out}/p${String(i).padStart(2, '0')}.png`, scale: 'css' }); }
  await b.close();
})();
