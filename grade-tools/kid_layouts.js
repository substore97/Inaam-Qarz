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
  <div class="k2cols"><div><i>🕌</i>${c1}</div><div><i>✨</i>${c2}</div></div>
  ${TRK(tw || name)}`,
  k3: ([name, en, ill, s, c1, c2, tw], i, h) => `
  <div class="k3book"><div class="k3r"><small>مِنْ أَنْبِيَاءِ اللّٰهِ</small><h2>${name}</h2><em>عَلَيْهِ السَّلَامُ</em><p>${s}</p></div><div class="k3l">${G(ill)}<b>${en}</b></div></div>
  <div class="k3lesson"><div><small>📜 أَعْرِفُ</small><b>${c1}</b></div><div><small>💡 أَتَعَلَّمُ</small><b>${c2}</b></div></div>
  ${TRK(tw || name)}`,
  k4: ([name, en, ill, s, prod, pill, tw], i, h) => `
  <div class="k4q">مَاذَا ${name.startsWith('ال') ? 'يُعْطِينَا' : 'يُعْطِينَا'} ${name}؟</div>
  <div class="k4row"><div class="k4barn"><div>${G(ill)}</div><b>${name}</b></div><div class="k4arrow"></div><div class="k4gift"><div>${G(pill)}</div><b>${prod}</b></div></div>
  <div class="k4en">${en}</div>
  <div class="k4fence">${s}</div>
  ${TRK(tw || prod)}`,
  k5: ([name, en, ill, s, pl, n, tw], i, h) => `
  <div class="k5pair"><div class="k5one"><span>وَاحِدٌ</span>${G(ill)}<b>${name}</b></div><div class="k5ar"></div><div class="k5many"><span>كَثِيرٌ</span><div>${G(ill)}${G(ill)}${G(ill)}</div><b>${pl}</b></div></div>
  <div class="k5en">${en}</div>
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
  <div class="k9train">${Array.from({ length: 10 }, (_, k) => `<div class="${10 - k === n ? 'on' : ''}">${AR(10 - k)}</div>`).join('')}<i class="k9eng"></i></div>
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
const itemPagesK = (LIST) => LIST.forEach((it, i) => { const h = hue(i); pages.push(`
  <section class="page plain ki ${C.layout}i" style="--h:${h}">
  ${KI[C.layout](it, i, h)}
  ${pno(P++)}
  </section>`); });
