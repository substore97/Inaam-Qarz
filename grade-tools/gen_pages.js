const AR2 = 0;
const G = (x, cls) => { const k = x.indexOf(':'); const n = k < 0 ? x : x.slice(0, k), col = k < 0 ? '' : x.slice(k + 1); const o = {}; if (cls) o.cls = cls; if (col) o.color = col; return art(n, o); };
const L = (x) => BY[x] ? BY[x][0] : BY[x.split(':')[0]] ? BY[x.split(':')[0]][0] : '';
// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, C.h, 12)}
  ${C.grade ? `<div class="gbadge">${C.grade}</div>` : ''}
  ${C.coverTop.map((x, k) => `<div class="ca cs${k}">${G(x)}</div>`).join('')}
  <h1>${t3d(C.t1, '#ffffff', C.s1, 12)}<br>${t3d(C.t2, '#ffd23f', C.s2, 12)}</h1>
  <div class="csub">${C.csub}</div>
  <div class="cen">${C.cen}</div>
  ${C.coverBot.map((x, k) => `<div class="ca cs${k + 3}">${G(x)}</div>`).join('')}
</section>`);
P++;
// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(2, C.h)}
  <div class="owner">
    <div class="ownerart">${G(C.ownerArt)}</div>
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', C.s1, 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${C.ownerMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(3, 120)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1f8f4f')}
    <div class="card">
      <p>${C.noteP}</p>
      <ul>${C.noteLi.map(x => `<li>${x}</li>`).join('')}<li>${C.noteLast || 'العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!'}</li></ul>
    </div>
    <div class="row3">${C.noteMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 4 ---------- Overview / contents
if (C.units) {
  let pg = 5; const rows = C.units.map((u, k) => { const r = { n: k + 1, t: u.title, en: u.en, a: u.icon, pg }; pg += 1 + (u.items || []).length + (u.acts || []).length; return r; });
  pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.tocTitle || 'الفِهْرِس', C.s1)}
  <div class="toc">${rows.map(r => `<div class="tocr" style="--h:${(r.n * 47 + C.h) % 360}"><i>${AR(r.n)}</i>${G(r.a)}<div><b>${r.t}</b><small>${r.en}</small></div><span>${AR(r.pg)}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`);
} else {
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.ovTitle, C.s1)}
  ${(() => { const OV = ITEMS.filter((i, k, a) => a.findIndex(x => x[0] === i[0]) === k); return `<div class="ovg${OV.length > 12 ? ' ov16' : ''}">${OV.map(i => `<div class="ovc">${G(String(i[2]).split(',')[0])}<b>${i[0]}</b></div>`).join('')}</div>`; })()}
  ${pno(P++)}
</section>`);
}
// items
const itemPages6 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item6" style="--h:${h}">
    <header class="l6h"><span class="l6tag">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</span><h2>${name}</h2><em>${en}</em></header>
    <div class="l6main">
      <figure class="l6pic">${G(ill)}</figure>
      <div class="l6side">
        <p class="l6sent">${sentence}</p>
        <div class="l6box"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="l6box alt"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="l6write"><b>${C.ltr ? "✍️ I write my own sentence:" : "✍️ أَكْتُبُ جُمْلَةً مِنْ عِنْدِي:"}</b><i></i><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPagesStd = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], i) => {
  i = i + off;
  const h = hue(i); const w = tw || name; const long = w.length > (C.ltr ? 6 : 10);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,28%)`, 9, name.length > 10 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="water">${G(ill, 'ill')}</div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="chip"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">${C.traceLabel || '✎ أَكْتُبُ الكَلِمَة'}</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(C.ltr ? (long ? [175, 520] : [115, 350, 590]) : (long ? [520, 175] : [590, 350, 115])).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${w}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages7 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item7" style="--h:${h}">
    <div class="l7top"><span class="l7hex">${C.ltr ? li + 1 : AR(li + 1)}</span><small>${U.title}</small></div>
    <div class="l7hero"><figure>${G(ill)}</figure><div class="l7name"><h2>${name}</h2><em>${en}</em></div></div>
    <div class="l7steps">
      <div><i>📖</i><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><b>${sentence}</b></div></div>
      <div><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="l7note"><b>🧠 ${C.ltr ? 'My own example:' : 'أَكْتُبُ مِثَالًا مِنْ عِنْدِي:'}</b><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages8 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item8" style="--h:${h}">
    <aside class="l8side"><b>${C.ltr ? li + 1 : AR(li + 1)}</b><span>${U.title}</span></aside>
    <div class="l8main">
      <h2 class="l8title">${name}</h2>
      <div class="l8row">
        <figure class="l8pol">${G(ill)}<figcaption>${en}</figcaption></figure>
        <blockquote class="l8quote${sentence.length > 95 ? ' long' : ''}">${sentence}</blockquote>
      </div>
      <div class="l8info">
        <div><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
      <div class="l8board"><b>${C.ltr ? '✏️ Your turn: write your own example' : '✏️ دَوْرُكَ: اكْتُبْ مِثَالًا مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages9 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item9" style="--h:${h}">
    <div class="l9hero">
      <span class="l9mark">${C.ltr ? 'Lesson' : 'دَرْسٌ'}<b>${N(li + 1)}</b></span>
      <div class="l9t"><h2${name.length > 18 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div>
      <figure class="l9pic">${G(ill)}</figure>
    </div>
    <ol class="l9pts">
      <li><b>${N(1)}</b><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div></li>
      <li><b>${N(2)}</b><div><small>${U.chip1[1]}</small><p>${c1}</p></div></li>
      <li><b>${N(3)}</b><div><small>${U.chip2[1]}</small><p>${c2}</p></div></li>
    </ol>
    <div class="l9bub"><b>${C.ltr ? '💬 Now you: write a sentence of your own' : '💬 الآنَ أَنْتَ: اكْتُبْ جُمْلَةً مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages10 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item10" style="--h:${h}">
    <div class="l10h"><b>${N(li + 1)}</b><div><h2${name.length > 20 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div></div>
    <div class="l10map">
      <div class="l10c l10top"><small>📖 ${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div>
      <div class="l10c l10a"><small>${U.chip1[0]} ${U.chip1[1]}</small><p>${c1}</p></div>
      <figure class="l10pic">${G(ill)}</figure>
      <div class="l10c l10b"><small>${U.chip2[0]} ${U.chip2[1]}</small><p>${c2}</p></div>
    </div>
    <div class="l10card"><b>${C.ltr ? '🗂️ My example card' : '🗂️ بِطَاقَتِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages12 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  const long = (sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150;
  pages.push(`
  <section class="page item12" style="--h:${h}">
    <aside class="p12"><small>${C.ltr ? 'LESSON' : 'الدَّرْسُ'}</small><b>${N(li + 1)}</b><figure>${G(ill)}</figure><em>${en}</em><span>${U.title}</span></aside>
    <div class="m12${long ? ' long' : ''}">
      <h2>${name}</h2>
      <div class="q12">${sentence}</div>
      <div class="tb12"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="tb12"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
      <div class="lp12"><b>${C.ltr ? '✉️ My own example' : '✉️ مِثَالِي الخَاصُّ'}</b><u></u><u></u><u></u><u></u><u></u></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages11 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item11" style="--h:${h}">
    <div class="run11"><span>${U.title}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div>
    <div class="k11">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</div>
    <h2 class="t11${name.length > 22 ? ' long' : ''}">${name}</h2>
    <div class="d11">${en}</div>
    <div class="b11">
      <figure class="f11">${G(ill)}<figcaption>${C.ltr ? '▲ ' : '▲ '}${name}</figcaption></figure>
      <div class="c11${(sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150 ? ' long' : ''}">
        <p class="lead11">${sentence}</p>
        <div class="fx11"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="fx11"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="nb11"><div class="sp11">${'<i></i>'.repeat(12)}</div><b>${C.ltr ? '✍️ Notebook: my own example' : '✍️ دَفْتَرِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><u></u><u></u><u></u><u></u></div>
    ${pno(P++)}
  </section>`);
});
// ===== Grade-1 topic-book layouts k1..k10 (each a different page design) =====
const TRK = (w, cls = '') => { const long = w.length > 10; return `<div class="trace ${cls}"><span class="tlabel">✎ أَكْتُبُ الكَلِمَةَ</span><svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(long ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${w}</text>`).join('')}</svg></div>`; };
const KT = (t, h, d = 8) => t3d(t, '#fff', `hsl(${h},60%,26%)`, d, t.length > 12 ? 'big long' : 'big');
const KI = {
  k1: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k1sky"><i class="k1moon"></i><i class="k1s a"></i><i class="k1s b"></i><i class="k1s c"></i><div class="k1arch">${G(ill)}</div></div>
  <div class="k1tag"><b>${KT(name, 40)}</b><small>${en}</small></div>
  <div class="k1scroll">${s}</div>
  <div class="k1facts"><span>🌙 ${c1}</span><span>⭐ ${c2}</span></div>
  ${TRK(tw || name)}`,
  k2: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k2dome"><div>${G(ill)}</div></div>
  <div class="k2name">${KT(name, h)}<small>${en}</small></div>
  <div class="k2rug">${s}</div>
  <div class="k2cols"><div><i>📌</i>${c1}</div><div><i>✨</i>${c2}</div></div>
  ${TRK(tw || name)}`,
  k3: ([name, en, ill, s, c1, c2, tw, hon], i, h) => `
  <div class="k3book"><div class="k3r"><small>مِنْ أَنْبِيَاءِ اللّٰهِ</small><h2>${name}</h2><em>${hon || 'عَلَيْهِ السَّلَامُ'}</em><p>${s}</p></div><div class="k3l">${G(ill)}<b>${en}</b></div></div>
  <div class="k3lesson"><div><small>📜 أَعْرِفُ</small><b>${c1}</b></div><div><small>💡 أَتَعَلَّمُ</small><b>${c2}</b></div></div>
  ${TRK(tw || name)}`,
  k4: ([name, en, ill, s, prod, pill, tw, q], i, h) => `
  <div class="k4q">${q}</div>
  <div class="k4row"><div class="k4barn"><div>${G(ill)}</div><b>${name}</b></div><div class="k4arrow"></div><div class="k4gift"><div>${G(pill)}</div><b>${prod}</b></div></div>
  <div class="k4en">${en}</div>
  <div class="k4fence">${s}</div>
  ${TRK(tw || prod)}`,
  k5: ([name, en, ill, s, pl, n, tw], i, h) => `
  <div class="k5pair"><div class="k5one"><span>وَاحِدٌ</span>${G(ill)}<b>${name}</b></div><div class="k5ar" data-en="${en}"></div><div class="k5many"><span>كَثِيرٌ</span><div>${G(ill)}${G(ill)}${G(ill)}</div><b>${pl}</b></div></div>
  <div class="k5sent">${s}</div>
  ${TRK(tw || pl)}`,
  k6: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k6panel"><div class="k6bub">${s}</div>${G(ill)}</div>
  <div class="k6words">${s.replace(/[.!؟]/g, '').split(' ').map(w => `<span>${w}</span>`).join('')}</div>
  <div class="k6en">${en}</div>
  ${TRK(tw || name)}`,
  k7: ([name, en, ill, s, price, n, tw], i, h) => `
  <div class="k7shop"><div class="k7awn"></div><div class="k7item">${G(ill)}</div><div class="k7shelf"></div><div class="k7tag"><small>السِّعْرُ</small><b>${price}</b></div></div>
  <div class="k7name">${KT(name, h)}<small>${en}</small></div>
  <div class="k7coins"><small>أَعُدُّ النُّقُودَ:</small>${Array.from({ length: n }, () => G('coin')).join('')}</div>
  <div class="k7sent">${s}</div>
  ${TRK(tw || name)}`,
  k8: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k8phone"><div class="k8bar"><b>${en}</b><span>📶 🔋</span></div><div class="k8scr"><div class="k8pic">${G(ill)}</div><h2>${name}</h2><div class="k8m in">${s}</div><div class="k8m out">${c1}</div><div class="k8m in">${c2}</div></div></div>
  ${TRK(tw || name)}`,
  k9: ([name, en, ill, s, n, c2, tw], i, h) => `
  <div class="k9train"><i class="k9eng"></i>${Array.from({ length: 10 }, (_, k) => `<div class="${k + 1 === n ? 'on' : ''}">${AR(k + 1)}</div>`).join('')}</div>
  <div class="k9big"><b>${AR(n)}</b>${KT(name, h, 9)}<small>${en}</small></div>
  <div class="k9pic">${G(ill)}</div>
  <div class="k9sent">${s}</div>
  ${TRK(tw || name)}`,
  k10: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <i class="k10sun"></i>
  <div class="k10sign"><b>${KT(name, 28)}</b><small>${en}</small></div>
  <div class="k10pic">${G(ill)}</div>
  <svg class="k10dune" viewBox="0 0 794 420" preserveAspectRatio="none"><path d="M0 120 Q200 20 420 110 T794 80 V420 H0 Z" fill="#f3d39b"/><path d="M0 220 Q260 130 520 210 T794 190 V420 H0 Z" fill="#e9bf78"/></svg>
  <div class="k10card">${s}<div><span>🐪 ${c1}</span><span>🌴 ${c2}</span></div></div>
  ${TRK(tw || name)}`,
};
const KH = {
  k1: (a, j) => `<div class="k1ah"><i>🌙</i><h2>${a.title}</h2></div>`,
  k2: (a, j) => `<div class="k2ah"><i></i><h2>${a.title}</h2><i></i></div>`,
  k3: (a, j) => `<div class="k3ah"><span>نَشَاطٌ ${AR(j + 1)}</span><h2>${a.title}</h2></div>`,
  k4: (a, j) => `<div class="k4ah"><i></i><h2>${a.title}</h2></div>`,
  k5: (a, j) => `<div class="k5ah"><h2>${a.title}</h2></div>`,
  k6: (a, j) => `<div class="k6ah"><i>!</i><h2>${a.title}</h2></div>`,
  k7: (a, j) => `<div class="k7ah"><i></i><h2>${a.title}</h2></div>`,
  k8: (a, j) => `<div class="k8ah"><i>💬</i><div><small>نَشَاطٌ جَدِيدٌ · الآنَ</small><h2>${a.title}</h2></div></div>`,
  k9: (a, j) => `<div class="k9ah"><div>${Array.from({ length: 3 }, (_, k) => `<span>${AR(k + 1)}</span>`).join('')}</div><h2>${a.title}</h2></div>`,
  k10: (a, j) => `<div class="k10ah"><h2>${a.title}</h2><i></i></div>`,
};
// ===== Reading-only grade-1 layouts k11..k15 (no writing anywhere) =====
Object.assign(KI, {
  k11: ([title, en, arts, txt, part], i, h) => `
  <div class="k11scene">${arts.split(',').map(x => G(x)).join('')}<i class="k11ground"></i></div>
  <div class="k11page"><div class="k11t"><b>${title}</b><span>${part}</span></div><small>${en}</small><p>${txt}</p></div>`,
  k12: ([qw, en, art, q, a, note], i, h) => `
  <div class="k12q"><i>؟</i><b>${qw}</b><small>${en}</small><p>${q}</p></div>
  <div class="k12fold"><span>الجَوَابُ ⬇</span></div>
  <div class="k12a"><div>${G(art)}</div><p>${a}</p></div>
  <div class="k12note">💡 ${note}</div>`,
  k13: ([name, en, art, s, f1, f2, f3], i, h) => `
  <div class="k13board"><i class="k13clip"></i><div class="k13paper"><div class="k13tag">${en}</div><div class="k13pic">${G(art)}</div><h2>${name}</h2><p>${s}</p><ul><li>${f1}</li><li>${f2}</li><li>${f3}</li></ul></div></div>`,
  k14: ([name, honor, art, s, f1, f2, en], i, h) => `
  <div class="k14scroll"><i class="k14rod"></i><div class="k14paper"><div class="k14med">${G(art)}</div><h2>${name}</h2><em>${honor}</em><small>${en}</small><p>${s}</p><div class="k14facts"><span>${f1}</span><span>${f2}</span></div></div><i class="k14rod"></i></div>`,
  k15: ([name, en, art, s, f1, f2], i, h) => `
  <div class="k15card"><div class="k15pic">${G(art)}</div><div class="k15txt"><i class="k15stamp">✈</i><h2>${name}</h2><small>${en}</small><i class="k15mark">رِحْلَتِي</i></div></div>
  <div class="k15ticket"><b>🎫</b><p>${s}</p></div>
  <div class="k15tags"><span>🧳 ${f1}</span><span>🧳 ${f2}</span></div>`,
});
Object.assign(KH, {
  k11: (a, j) => `<div class="k11ah"><i></i><h2>${a.title}</h2><i></i></div>`,
  k12: (a, j) => `<div class="k12ah"><b>؟</b><h2>${a.title}</h2></div>`,
  k13: (a, j) => `<div class="k13ah"><i></i><h2>${a.title}</h2></div>`,
  k14: (a, j) => `<div class="k14ah"><h2>${a.title}</h2></div>`,
  k15: (a, j) => `<div class="k15ah"><i></i><h2>${a.title}</h2></div>`,
});


const itemPagesK = (LIST) => LIST.forEach((it, i) => { const h = hue(i); pages.push(`
  <section class="page plain ki ${C.layout}i" style="--h:${h}">
  ${KI[C.layout](it, i, h)}
  ${pno(P++)}
  </section>`); });

const itemPages = (...a) => C.layout && /^k\d/.test(C.layout) ? itemPagesK(a[0]) : (C.layout === 'g6' ? itemPages6 : C.layout === 'g7' ? itemPages7 : C.layout === 'g8' ? itemPages8 : C.layout === 'g9' ? itemPages9 : C.layout === 'g10' ? itemPages10 : C.layout === 'g11' ? itemPages11 : C.layout === 'g12' ? itemPages12 : itemPagesStd)(...a);
// activities
const ACT = { match: (a) => `<div class="hint">${a.hint}</div>
  <div class="match">${a.rows.map(([l, ll, r, rl]) => `<div class="mrow"><div class="mc">${G(l)}<b>${ll || (r.startsWith("=") ? "" : L(l))}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i>${r.startsWith('=') ? `<div class="mq">${r.slice(1)}</div>` : `<div class="mc">${G(r)}<b>${rl || L(r)}</b></div>`}</div>`).join('')}</div>`,
  circle: (a) => `<div class="hint">${a.hint}</div>
  ${a.rows.map(([q, o], j) => `<div class="wgo" style="--h:${(j * 70 + 200) % 360}"><b>${q}</b><div>${o.map(x => G(x)).join('')}</div></div>`).join('')}`,
  tf: (a) => `<div class="hint">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأ'}</div>
  <div class="tlrow">${a.top.map(x => G(x)).join('')}</div>
  ${a.rows.map(t => `<div class="rw"><b>${t}</b><div class="opts"><span><i></i>✓</span><span><i></i>✗</span></div></div>`).join('')}`,
  maze: (a) => { const MC = 8, MR = 9, CS = 76, MZ = maze(MC, MR, a.seed || 57); let mz = '';
    for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (MZ.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
    for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (MZ.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
    return `<div class="mazebox city">${G(a.from, 'mzs')}<svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="#5a6478" stroke-width="10" stroke-linecap="round" fill="none"/></svg>${G(a.to, 'mze')}</div>`; },
  count: (a) => `<div class="hint">${a.hint || 'عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢'}</div>
  ${a.rows.map(([x, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => G(x)).join('')}</div><div class="cans"></div></div>`).join('')}`,
  draw: (a) => `<div class="hint">${a.hint}</div><div class="bigboard"><div></div></div><div class="todayrow"><span>${a.label}</span></div>`,
  words: (a) => `<div class="hint">${a.hint}</div>${a.rows.map(([w, o], j) => `<div class="qrow" style="--h:${(j * 60 + 260) % 360}"><div class="qw">${w}</div>${o.map(x => `<div class="qo">${x}</div>`).join('')}</div>`).join('')}`,
  sums: (a) => `<div class="hint">${a.hint || 'أَحْسُبُ وَأَكْتُبُ الجَوَابَ فِي المُرَبَّع ✏️'}</div>${a.rows.map(([it, x, y, op]) => `<div class="sumr"><div class="sg">${Array.from({ length: x }, () => G(it)).join('')}</div><b>${op === '-' ? '−' : '+'}</b><div class="sg">${Array.from({ length: y }, () => G(it)).join('')}</div><b>=</b><i class="sbox"></i><span>${AR(x)} ${op === '-' ? '−' : '+'} ${AR(y)} = ....</span></div>`).join('')}`,
  raw: (a) => a.html.replace(/<span data-a="([^"]+)"><\/span>/g, (_, x) => G(x)) + (a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join("")}</div>` : ""),
};
if (C.layout === 'g6') {
  const LET = C.ltr ? ['a', 'b', 'c', 'd'] : ['أ', 'ب', 'ج', 'د'];
  ACT.words = (a) => `<div class="hint6">${a.hint}</div><div class="q6grid">${a.rows.map(([w, o], j) => `<div class="q6" style="--h:${(j * 70 + 200) % 360}"><span class="qn">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q6o">${o.map((x, k) => `<span><i>${LET[k]}</i>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint6">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأِ'}</div><table class="tf6"><tr><th></th><th>${C.ltr ? 'Sentence' : 'العِبَارَةُ'}</th><th>✓</th><th>✗</th></tr>${a.rows.map((t, j) => `<tr><td class="n">${C.ltr ? j + 1 : AR(j + 1)}</td><td>${t}</td><td><i></i></td><td><i></i></td></tr>`).join('')}</table><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g7') {
  ACT.words = (a) => `<div class="hint7">${a.hint}</div><div class="q7list">${a.rows.map(([w, o], j) => `<div class="q7"><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q7o">${o.map(x => `<span><u></u>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint7">${a.hint || 'أَضَعُ دَائِرَةً حَوْلَ: ✓ صَوَابٌ، أَوْ ✗ خَطَأٌ'}</div><div class="tf7">${a.rows.map((t, j) => `<div><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><div class="tf7b"><span>✓ ${C.ltr ? 'True' : 'صَوَابٌ'}</span><span>✗ ${C.ltr ? 'False' : 'خَطَأٌ'}</span></div></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g8') {
  ACT.words = (a) => `<div class="f8"><div class="hint8">${a.hint}</div><ol class="q8">${a.rows.map(([w, o], j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><div><p>${w}</p><div class="q8o">( ${o.map(x => `<span>${x}</span>`).join('<em>|</em>')} )</div></div></li>`).join('')}</ol></div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="f8"><div class="hint8">${a.hint || 'أَضَعُ عَلَامَةَ ( ✓ ) أَمَامَ العِبَارَةِ الصَّحِيحَةِ، وَعَلَامَةَ ( ✗ ) أَمَامَ العِبَارَةِ الخَاطِئَةِ'}</div><ol class="tf8">${a.rows.map((t, j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><i>(&nbsp;&nbsp;&nbsp;&nbsp;)</i></li>`).join('')}</ol></div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g9') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint9">${a.hint}</div><div class="q9grid">${a.rows.map(([w, o], j) => `<div class="q9"><div class="q9h"><span>${N(j + 1)}</span><u></u></div><p>${w}</p><ol>${o.map((x, k) => `<li><b>(${N(k + 1)})</b> ${x}</li>`).join('')}</ol></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint9">${a.hint || 'أَكْتُبُ «صَحٌّ» أَوْ «خَطَأٌ» عَلَى الخَطِّ'}</div><div class="tf9">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><p>${t}</p><i></i></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g10') {
  const N = n => C.ltr ? n : AR(n); const LT = C.ltr ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
  const sheet = (rows, labels) => `<div class="ans10"><b>${C.ltr ? '✏️ Answer sheet: shade the circle' : '✏️ وَرَقَةُ الإِجَابَةِ: أُظَلِّلُ الدَّائِرَةَ'}</b><div class="ans10g">${rows.map((o, j) => `<div><span>${N(j + 1)}</span>${(labels || o.map((_, k) => LT[k])).map(x => `<i>${x}</i>`).join('')}</div>`).join('')}</div></div>`;
  ACT.words = (a) => `<div class="hint10">${a.hint}</div><div class="q10${JSON.stringify(a.rows).replace(/<[^>]+>/g, '').length > 300 ? ' dense' : ''}">${a.rows.map(([w, o], j) => `<div><span>${N(j + 1)}</span><div><p>${w}</p><div class="q10o">${o.map((x, k) => `<em><b>${LT[k]}</b> ${x}</em>`).join('')}</div></div></div>`).join('')}</div>${sheet(a.rows.map(r => r[1]))}`;
  ACT.tf = (a) => `<div class="hint10">${a.hint || 'أَقْرَأُ العِبَارَاتِ، ثُمَّ أُظَلِّلُ: (ص) لِلصَّوَابِ، أَوْ (خ) لِلْخَطَأِ'}</div><div class="q10">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><div><p>${t}</p></div></div>`).join('')}</div>${sheet(a.rows, C.ltr ? ['T', 'F'] : ['ص', 'خ'])}`;
}
if (C.layout === 'g11') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint11">🖍️ ${a.hint}</div><div class="q11">${a.rows.map(([w, o], j) => `<div><p><span>${N(j + 1)}</span>${w}</p><div class="tg11">${o.map(x => `<em>${x}</em>`).join('')}</div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint11">🖍️ ${a.hint || 'أُلَوِّنُ 👍 إِذَا كَانَتِ العِبَارَةُ صَحِيحَةً، وَ 👎 إِذَا كَانَتْ خَطَأً'}</div><div class="q11 tf11">${a.rows.map((t, j) => `<div><p><span>${N(j + 1)}</span>${t}</p><div class="tg11"><em>👍</em><em>👎</em></div></div>`).join('')}</div>`;
}
if (C.layout === 'g12') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint12">⭕ ${a.hint}</div><div class="x12">${a.rows.map(([w, o], j) => `<div><b>${N(j + 1)}</b><div><p>${w}</p><div class="xo12">${o.map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint12">⭕ ${a.hint || '' + (C.ltr ? 'I read the sentence and circle True or False.' : 'أَقْرَأُ العِبَارَةَ، ثُمَّ أَضَعُ دَائِرَةً حَوْلَ (صَحِيحَةٌ) أَوْ (خَاطِئَةٌ)') + ''}</div><div class="x12">${a.rows.map((t, j) => `<div><b>${N(j + 1)}</b><div><p>${t}</p><div class="xo12">${(C.ltr ? ['True', 'False'] : ['صَحِيحَةٌ', 'خَاطِئَةٌ']).map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
}
Object.assign(ACT, {
  review: (a) => `<div class="rv">${a.rows.map(([x, w]) => `<div>${G(x)}<b>${w}</b></div>`).join('')}</div>`,
  facts: (a) => `<ul class="fc">${a.rows.map(t => `<li>${t}</li>`).join('')}</ul>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
  qa: (a) => `<div class="qa">${a.rows.map(([q, x]) => `<div><p class="qq">${q}</p><p class="aa">${x}</p></div>`).join('')}</div>`,
  story2: (a) => `<div class="st">${a.lines.map(l => `<p>${l}</p>`).join('')}</div>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
});
const actPages = (LIST, off) => LIST.forEach((a, j) => {
  j = j + off;
  const h = [150, 200, 20, 45, 265, 100, 320, 180][j % 8];
  pages.push(`
<section class="page plain kact" style="--h:${h}">
  ${bubbles(40 + j, h)}
  ${C.layout && /^k\d/.test(C.layout) ? KH[C.layout](a, j) : C.layout === 'g12' ? `<div class="a12h"><b>${C.ltr ? j + 1 : AR(j + 1)}</b><div><small>${C.ltr ? 'Task' : 'نَشَاطٌ'}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g11' ? `<div class="run11"><span>${C.ltr ? 'Practice' : 'تَدْرِيبَاتٌ'}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div><div class="k11">${C.ltr ? 'Exercise ' + (j + 1) : 'تَدْرِيبٌ ' + AR(j + 1)}</div><h2 class="t11 sm">${a.title}</h2>` : C.layout === 'g10' ? `<div class="a10h"><span>${C.ltr ? 'Task ' + (j + 1) : 'مَهَمَّةٌ ' + AR(j + 1)}</span><h2>${a.title}</h2></div>` : C.layout === 'g9' ? `<div class="a9h"><i>✏️</i><div><small>${C.ltr ? 'Exercise ' + (j + 1) : 'تَمْرِينٌ ' + AR(j + 1)}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g8' ? `<div class="a8h"><span>${C.ltr ? 'Activity' : 'نَشَاطٌ'}</span><h2>${a.title}</h2></div>` : C.layout === 'g7' ? `<div class="a7h"><b>${C.ltr ? 'Exercise' : 'تَمْرِينٌ'}</b><h2>${a.title}</h2></div>` : C.layout === 'g6' ? `<div class="a6h"><span>${C.ltr ? 'Practice' : 'تَدْرِيبٌ'}</span><h2>${a.title}</h2></div>` : title(a.title, `hsl(${h},60%,30%)`)}
  ${ACT[a.type](a)}
  ${pno(P++)}
</section>`);
});

const unitPage6 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit6" style="--h:${h}">
  <div class="u6band"><div class="u6num">${C.ltr ? k + 1 : AR(k + 1)}</div><div class="u6t"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  <div class="u6art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="u6intro">${u.intro}</div>` : ''}
  <div class="u6list"><b>${C.ltr ? 'In this unit:' : 'فِي هٰذِهِ الوَحْدَةِ:'}</b>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map((t, n) => `<span><i>${C.ltr ? n + 1 : AR(n + 1)}</i>${t}</span>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage7 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit7" style="--h:${h}">
  <div class="u7num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u7card"><small>${C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ'][k]}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u7shelf">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u7intro">${u.intro}</p>` : ''}
  <div class="u7chips"><b>${C.ltr ? 'In this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b><div>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map(t => `<span>${t}</span>`).join('')}</div></div>
  ${pno(P++)}
</section>`); };
const unitPage8 = (u, k) => { const h = (k * 47 + C.h) % 360; const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit8" style="--h:${h}">
  <div class="u8top"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u8num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u8art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u8intro">${u.intro}</p>` : ''}
  <div class="u8grid">${all.map((t, n) => `<div><i>${C.ltr ? n + 1 : AR(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage9 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit9" style="--h:${h}">
  <div class="u9ring"><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div></div>
  <h1 class="u9t">${u.title}</h1><em class="u9en">${u.en}</em>
  <div class="u9art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u9intro">${u.intro}</p>` : ''}
  <div class="u9toc">${all.map((t, n) => `<div><b>${N(n + 1)}</b><span>${t}</span><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage10 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit10" style="--h:${h}">
  <div class="u10top"><div class="u10stamp"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div><div><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u10intro">${u.intro}</p>` : ''}
  <div class="u10road">${all.map((t, n) => `<div class="${n % 2 ? 'r' : 'l'}"><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  <div class="u10art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage11 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit11" style="--h:${h}">
  <div class="tk11">
    <div class="stub11"><small>${C.ltr ? 'UNIT' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div>
    <div class="body11"><h1>${u.title}</h1><em>${u.en}</em>${u.intro ? `<p>${u.intro}</p>` : ''}</div>
  </div>
  <div class="art11">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="ls11"><b>${C.ltr ? 'Inside this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b>${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage12 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit12" style="--h:${h}">
  <div class="u12art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="u12band"><b>${N(k + 1)}</b><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u12intro">${u.intro}</p>` : ''}
  <div class="u12tiles">${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage = (u, k) => C.layout === 'g12' ? unitPage12(u, k) : C.layout === 'g11' ? unitPage11(u, k) : C.layout === 'g10' ? unitPage10(u, k) : C.layout === 'g9' ? unitPage9(u, k) : C.layout === 'g8' ? unitPage8(u, k) : C.layout === 'g7' ? unitPage7(u, k) : C.layout === 'g6' ? unitPage6(u, k) : pages.push(`
<section class="page plain unit" style="--h:${(k * 47 + C.h) % 360}">
  ${bubbles(60 + k, (k * 47 + C.h) % 360, 14)}
  <div class="unum">${t3d(C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ','التَّاسِعَةُ','العَاشِرَةُ'][k], '#ffd23f', '#7a3a00', 7)}</div>
  <h1 class="utitle">${t3d(u.title, '#ffffff', `hsl(${(k * 47 + C.h) % 360},60%,28%)`, 10)}</h1>
  <div class="uen">${u.en}</div>
  <div class="uart">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="card uintro">${u.intro}</div>` : ''}
  ${pno(P++)}
</section>`);
if (C.units) { let off = 0, aoff = 0; C.units.forEach((u, k) => { unitPage(u, k); itemPages(u.items || [], u, off); off += (u.items || []).length; actPages(u.acts || [], aoff); aoff += (u.acts || []).length; }); }
else { itemPages(ITEMS, C, 0); actPages(C.acts, 0); }
// Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">${C.certP}<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${C.certArts.map(x => G(x)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);
// Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, C.h, 12)}
  <h2>${t3d(C.t1 + ' ' + C.t2, '#fff', C.s1, 8)}</h2>
  <div class="card blurb">
    <p>${C.blurb}</p>
    <ul>${C.blurbLi.map(x => `<li>${x}</li>`).join('')}</ul>
    <p class="en2">${C.en2}</p>
  </div>
  ${C.backArts.map((x, k) => `<div class="ca bs${k}">${G(x)}</div>`).join('')}
</section>`);
