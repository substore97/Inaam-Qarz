// node check_layout.js <bookdir>  -> reports text overlapping text/pictures, text outside its card, text outside the page
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const dir = process.argv[2]; const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 794, height: 1123 } });
  await p.goto('file://' + path.join('/home/user/Inaam-Qarz', dir, 'build', 'book.html'), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  const res = await p.evaluate(() => {
    const out = []; const secs = [...document.querySelectorAll('section')];
    const inter = (a, b, m = 2) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > m && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > m;
    const vis = el => { for (let e = el; e && e.tagName !== 'SECTION'; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return true; };
    secs.forEach((sec, si) => {
      const S = sec.getBoundingClientRect(); const texts = [];
      const tw = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
      for (let n; (n = tw.nextNode());) {
        if (!n.textContent.trim()) continue; const el = n.parentElement;
        if (el.closest('svg') || el.closest('.bub') || !vis(el)) continue;
        if (getComputedStyle(el).fontSize && parseFloat(getComputedStyle(el).fontSize) < 9) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        [...r.getClientRects()].filter(q => q.width > 1 && q.height > 1).forEach(q => texts.push({ q, el, t: n.textContent.trim().slice(0, 30) }));
      }
      const pics = [...sec.querySelectorAll('svg')].filter(s => !s.closest('.trace') && vis(s) && s.getBoundingClientRect().width > 30).map(s => s.getBoundingClientRect());
      // shrink glyph boxes a bit (line boxes include half-leading)
      const core = q => { const h = q.height, pad = h * 0.18; return { left: q.left + 1, right: q.right - 1, top: q.top + pad, bottom: q.bottom - pad }; };
      texts.forEach((a, i) => {
        const A = core(a.q);
        if (A.left < S.left - 1 || A.right > S.right + 1 || A.top < S.top - 1 || A.bottom > S.bottom + 1) out.push(`p${si + 1}: OUTSIDE PAGE «${a.t}»`);
        for (let j = i + 1; j < texts.length; j++) { const bb = texts[j]; if (bb.el === a.el) continue; if (inter(A, core(bb.q), 3)) out.push(`p${si + 1}: TEXT OVER TEXT «${a.t}» × «${bb.t}»`); }
        // container: nearest ancestor with background/border
        for (let e = a.el; e && e !== sec; e = e.parentElement) { const s = getComputedStyle(e);
          const box = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent') || s.backgroundImage !== 'none' || parseFloat(s.borderTopWidth) > 0;
          if (box && !['inline'].includes(s.display)) { const R = e.getBoundingClientRect(); if (A.left < R.left - 2 || A.right > R.right + 2 || A.top < R.top - 2 || A.bottom > R.bottom + 2) out.push(`p${si + 1}: OUT OF BOX «${a.t}» (${e.className || e.tagName})`); break; } }
      });
      texts.forEach(a => pics.forEach(P => { const A = core(a.q); const ip = { left: P.left + P.width * .12, right: P.right - P.width * .12, top: P.top + P.height * .12, bottom: P.bottom - P.height * .12 }; if (inter(A, ip, 4)) out.push(`p${si + 1}: TEXT OVER PICTURE «${a.t}»`); }));
    });
    return [...new Set(out)];
  });
  await b.close();
  console.log(res.length ? res.join('\n') : 'LAYOUT OK');
})();
