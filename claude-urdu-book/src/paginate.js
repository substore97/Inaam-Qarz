// Runs inside build/book.html: flows all blocks into A4 pages (two columns for articles/stories,
// one column for Quran/hadith/recipes/lists), fills leftover space with small filler boxes,
// then numbers the pages and fills the contents lists. Sets window.__done when finished.
(function () {
  const D = window.DATA, book = document.getElementById('book'), warn = [];
  const U = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  let cur = null;
  const pageHTML = (sec, mode) => `<div class="frame"></div><div class="hd"><span class="sec">${sec.name}</span><span class="mag">${D.title}</span></div>
    <div class="body"><div class="headr"></div><div class="cols ${mode}">${mode === 'two' ? '<div class="col"></div><div class="col"></div>' : '<div class="col"></div>'}</div></div>
    <div class="ft"><div class="pn"><span></span></div></div><div class="cred">تالیف: انعام الرحمن</div>`;
  function newPage(sec, mode) {
    const s = document.createElement('section'); s.className = 'pg'; s.style.setProperty('--h', sec.hue);
    s.innerHTML = pageHTML(sec, mode); book.appendChild(s);
    cur = { s, cols: [...s.querySelectorAll('.col')], ci: 0, head: s.querySelector('.headr'), mode, sec };
  }
  const over = c => c.scrollHeight > c.clientHeight + 1;
  const used = c => { const l = c.lastElementChild; return l ? l.offsetTop + l.offsetHeight - c.offsetTop : 0; };
  const free = c => c.clientHeight - used(c);
  function make(b) {
    const t = document.createElement('template');
    t.innerHTML = b.k === 'p' ? `<p class="${b.cls || ''}">${b.text}</p>` : b.html;
    return t.content.firstElementChild;
  }
  function nextCol() { if (cur.ci < cur.cols.length - 1) cur.ci++; else newPage(cur.sec, cur.mode); }
  function place(b) {
    for (let guard = 0; guard < 40; guard++) {
      const col = cur.cols[cur.ci];
      if (b.keep && col.children.length && free(col) < 150) { nextCol(); continue; }
      const el = make(b); col.appendChild(el);
      if (!over(col)) return;
      col.removeChild(el);
      if (b.k === 'p') {
        const w = b.text.split(' '); let lo = 1, hi = w.length - 1, best = 0;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1, e2 = make({ k: 'p', cls: (b.cls || '') + ' sp', text: w.slice(0, mid).join(' ') });
          col.appendChild(e2); if (over(col)) hi = mid - 1; else { best = mid; lo = mid + 1; } col.removeChild(e2);
        }
        if (best >= 5 && (w.length - best >= 3 || !col.children.length)) {
          const e3 = make({ k: 'p', cls: (b.cls || '') + ' sp', text: w.slice(0, best).join(' ') }); e3.style.textAlignLast = 'justify'; col.appendChild(e3);
          b = { k: 'p', cls: 'ni', text: w.slice(best).join(' ') };
        }
      }
      if (!col.children.length) { col.appendChild(make(b)); warn.push('too big: ' + (b.text || b.html).slice(0, 60)); return; }
      nextCol();
    }
  }
  // filler pool
  const pool = D.fillers.map(f => ({ t: f.t, style: f.style, items: f.items.slice() }));
  let fp = 0;
  function liHTML(style, x) {
    if (style === 'proverbs' && x.includes(' — ')) { const [a, m] = x.split(' — '); return `<div class="li prov"><b>${a}</b> — ${m}</div>`; }
    return `<div class="li">${x}</div>`;
  }
  function fillCol(col) {
    for (let g = 0; g < 4 && free(col) > 170; g++) {
      while (fp < pool.length && !pool[fp].items.length) fp++;
      if (fp >= pool.length) return;
      const f = pool[fp], box = make({ html: `<div class="fill"><h4>${f.t}</h4></div>` }); col.appendChild(box);
      let n = 0;
      while (f.items.length) { const li = make({ html: liHTML(f.style, f.items[0]) }); box.appendChild(li); if (over(col)) { box.removeChild(li); break; } f.items.shift(); n++; }
      if (!n) { col.removeChild(box); return; }
      if (f.items.length) return; // column full
    }
  }
  let quota = 0;
  function fillPage() {
    if (quota <= 0) return;
    const before = fp + '/' + (pool[fp] ? pool[fp].items.length : 0);
    for (let i = cur.ci; i < cur.cols.length; i++) fillCol(cur.cols[i]);
    if (before !== fp + '/' + (pool[fp] ? pool[fp].items.length : 0)) quota--;
  }
  const leftChunks = () => pool.slice(fp).reduce((a, f) => a + (f.items.length ? 1 : 0), 0);
  // build
  const openers = [];
  for (let si = 0; si < D.sections.length; si++) {
    const sec = D.sections[si];
    const twoLeft = D.sections.slice(si).reduce((a, x) => a + x.items.filter(i => i.mode === 'two').length, 0);
    const twoHere = sec.items.filter(i => i.mode === 'two').length;
    quota = twoLeft ? Math.round(leftChunks() * (twoHere + (sec.items.some(i => i.mode === 'one') ? 1 : 0)) / Math.max(1, twoLeft)) : 0;
    // opener page
    const op = document.createElement('section'); op.className = 'pg op'; op.style.setProperty('--h', sec.hue);
    op.innerHTML = `<div class="frame"></div><div class="panel">${D.pattern}</div><div class="medal">${sec.icon}</div><h1>${sec.name}</h1><div class="intro">${sec.intro}</div>
      <div class="list${sec.items.length > 30 ? ' dense' : ''}"><h3>اس حصے میں</h3></div><div class="ft"><div class="pn"><span></span></div></div><div class="cred">تالیف: انعام الرحمن</div>`;
    book.appendChild(op); openers.push({ op, sec, rows: [] }); cur = null;
    for (const it of sec.items) {
      if (it.mode === 'two') {
        newPage(sec, 'two');
        cur.head.innerHTML = it.head; it._pg = cur.s;
      } else {
        if (!cur || cur.mode !== 'one' || free(cur.cols[cur.ci]) < cur.cols[0].clientHeight * 0.3) newPage(sec, 'one');
        it._pg = cur.s;
      }
      it.blocks.forEach(b => place(b));
      if (it.mode === 'two') fillPage();
      openers[openers.length - 1].rows.push(it);
    }
    if (cur && cur.mode === 'one') { quota = Math.max(quota, 1); fillPage(); }
  }
  // leftover filler boxes -> their own section
  while (fp < pool.length && !pool[fp].items.length) fp++;
  if (fp < pool.length && D.fun && D.fun.name) {
    const sec = D.fun;
    const op = document.createElement('section'); op.className = 'pg op'; op.style.setProperty('--h', sec.hue);
    op.innerHTML = `<div class="frame"></div><div class="panel">${D.pattern}</div><div class="medal">${sec.icon}</div><h1>${sec.name}</h1><div class="intro">${sec.intro}</div>
      <div class="list"><h3>اس حصے میں</h3></div><div class="ft"><div class="pn"><span></span></div></div><div class="cred">تالیف: انعام الرحمن</div>`;
    book.appendChild(op); const o = { op, sec, rows: [] }; openers.push(o);
    newPage(sec, 'two'); const seen = {};
    for (; fp < pool.length; fp++) { const f = pool[fp]; if (!f.items.length) continue;
      if (!seen[f.t]) { seen[f.t] = 1; o.rows.push({ t: f.t, _pg: cur.s }); }
      place({ k: 'h', html: `<div class="fill"><h4>${f.t}</h4>${f.items.map(x => liHTML(f.style, x)).join('')}</div>` }); f.items = []; }
  }
  // back cover to the end
  const back = document.getElementById('back'); if (back) document.body.appendChild(back);
  // numbering
  const all = [...document.querySelectorAll('section.pg')];
  all.forEach((s, i) => { const pn = s.querySelector('.pn span'); if (pn) pn.textContent = U(i + 1); s.dataset.n = i + 1; });
  for (const o of openers) {
    const L = o.op.querySelector('.list');
    o.rows.forEach(it => L.insertAdjacentHTML('beforeend', `<div><span>${it.t}</span><span>${U(it._pg.dataset.n)}</span></div>`));
    if (L.scrollHeight > L.clientHeight + 2) warn.push('opener list overflow: ' + o.sec.name);
    const first = o.op.dataset.n;
    const row = document.querySelector(`.toc [data-sec="${o.sec.key}"] span:last-child`); if (row) row.textContent = U(first);
  }
  const tp = document.getElementById('totalpages'); if (tp) tp.textContent = U(all.length);
  // final overflow scan
  all.forEach((s, i) => s.querySelectorAll('.col, .body').forEach(c => { if (c.scrollHeight > c.clientHeight + 2) warn.push(`p${i + 1}: overflow`); }));
  window.__done = { pages: all.length, warn };
})();
