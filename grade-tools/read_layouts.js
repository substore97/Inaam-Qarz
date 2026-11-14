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
Object.assign(ACT, {
  review: (a) => `<div class="rv">${a.rows.map(([x, w]) => `<div>${G(x)}<b>${w}</b></div>`).join('')}</div>`,
  facts: (a) => `<ul class="fc">${a.rows.map(t => `<li>${t}</li>`).join('')}</ul>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
  qa: (a) => `<div class="qa">${a.rows.map(([q, x]) => `<div><p class="q">${q}</p><p class="a">${x}</p></div>`).join('')}</div>`,
  story2: (a) => `<div class="st">${a.lines.map(l => `<p>${l}</p>`).join('')}</div>${a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join('')}</div>` : ''}`,
});
