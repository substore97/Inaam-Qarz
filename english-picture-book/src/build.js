// «My Big English Book» — colourful picture-word English book for ages 1–7 (layout e1 "bubble-gum pop").
// node english-picture-book/src/build.js  -> build/book.html ; then BOOK_DIR=english-picture-book node arabic-kids-book/src/pdf.js
const fs = require('fs'), path = require('path');
const { art } = require('../../arabic-kids-book/src/extra100-art');
const ROOT = path.join(__dirname, '..');
const C = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'pages.json'), 'utf8'));
const FONT = 'file:///home/user/Inaam-Qarz/arabic-kids-book/fonts/';
const PAL = [['#ff5f8f', '#ffb86b'], ['#4facfe', '#00d4c8'], ['#a66cff', '#ff7ac6'], ['#ffb400', '#ff6a3d'], ['#20c997', '#9be15d'],
  ['#ff6b6b', '#c86bff'], ['#00b4ff', '#6c63ff'], ['#ff9a3d', '#ffd23f'], ['#17c3b2', '#227c9d'], ['#ff4f9a', '#7b5cff'],
  ['#56cc6e', '#00a6d6'], ['#ff7b54', '#ffb26b']];
const DARK = ['#b3124a', '#0a5fa8', '#5b2ab5', '#b35a00', '#0a7a55', '#a3162f', '#2d3aa8', '#b35600', '#0b5f6e', '#8a1268', '#1d7a37', '#b33f14'];
const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const G = (n, cls = '') => { try { return art(n, { cls }); } catch (err) { throw new Error('art ' + n); } };
let pageNo = 0;
const pages = [];
const toc = [];
function page(inner, i, cls = '') {
  pageNo++;
  const [c1, c2] = PAL[i % PAL.length];
  const num = cls.includes('cover') ? '' : `<div class="pn" style="--d:${DARK[i % DARK.length]}"><span>${pageNo}</span></div><div class="cred">تَأْلِيف: انعام الرحمن</div>`;
  pages.push(`<section class="pg ${cls}" style="--c1:${c1};--c2:${c2};--d:${DARK[i % DARK.length]}"><i class="o o1"></i><i class="o o2"></i><i class="o o3"></i>${inner}${num}</section>`);
  return pageNo;
}
const cloud = (en, ar) => `<div class="hd"><svg class="cl" viewBox="0 0 700 170" preserveAspectRatio="none"><path d="M60 150 C10 150 5 95 50 85 C40 40 100 20 135 45 C160 5 240 0 270 35 C300 0 390 0 420 35 C450 5 540 10 560 50 C610 30 665 60 650 100 C695 110 690 150 640 150 Z" fill="#fff"/></svg><h1>${e(en)}</h1><h2 dir="rtl">${ar}</h2></div>`;
const card = (it, k) => `<div class="cd" style="--k:${PAL[k % PAL.length][0]}"><div class="bub">${it[1].startsWith('#') ? `<b class="bignum">${it[1].slice(1)}</b>` : G(it[1])}</div><b class="w${it[0].length > 13 ? ' long' : ''}">${e(it[0])}</b><span class="a" dir="rtl">${it[2]}</span></div>`;
const grid = (items, cols, cls = '') => `<div class="grid ${cls}" style="--cols:${cols}">${items.map(card).join('')}</div>`;

let pi = 0;
// cover
const coverArts = ['apple', 'cat', 'rocket', 'rainbow', 'lion', 'butterfly', 'car', 'teddy', 'sun', 'fish', 'balloon', 'elephant'];
const title = 'My Big English Book'.split('').map((ch, i) => ch === ' ' ? ' ' : `<span style="color:${['#ff3d7f', '#ffb400', '#22c55e', '#3b82f6', '#a855f7', '#ff6a3d'][i % 6]}">${ch}</span>`).join('');
page(`<div class="cv">${coverArts.map((a, i) => `<div class="ca c${i}">${G(a)}</div>`).join('')}
<div class="cvbox"><div class="abc"><span>A</span><span>B</span><span>C</span></div><h1>${title}</h1>
<h2 dir="rtl">كِتَابِي الكَبِيرُ لِلإِنْجِلِيزِيَّة</h2><p>ABC · 123 · Colours · Animals · 450+ words</p>
<p dir="rtl" class="pa">الحُرُوفُ · الأَرْقَامُ · الأَلْوَانُ · الحَيَوَانَاتُ · أَكْثَرُ مِنْ ٤٥٠ كَلِمَة</p></div>
<div class="age">Ages 1–7 · لِلْأَعْمَارِ مِنْ ١ إِلَى ٧</div></div>`, pi++, 'cover');
// owner page (page 2)
page(`<div class="own"><div class="ownart">${G('bigbook')}</div><h2 dir="rtl">هٰذَا الكِتَابُ مِلْكُ</h2><div class="by" dir="rtl">تَأْلِيف: انعام الرحمن</div>
<h3>This book belongs to a little star!</h3><div class="minis">${['apple', 'beachball', 'cat', 'sunstar', 'kite'].map(a => G(a)).join('')}</div>
<p>Look at the pictures, say the words and have fun!</p><p dir="rtl" class="pa">اُنْظُرْ إِلَى الصُّوَرِ، وَقُلِ الكَلِمَاتِ، وَاسْتَمْتِعْ بِالتَّعَلُّمِ!</p></div>`, pi++);
const tocIdx = pages.length; page('', pi++); // filled later
// alphabet: 2 letters per page
const AL = C.alphabet;
for (let i = 0; i < AL.length; i += 2) {
  const bands = AL.slice(i, i + 2).map(([L, items], j) => {
    const its = items.map((it, k) => {
      const w = e(it[0]).replace(new RegExp(L, 'i'), m => `<u>${m}</u>`);
      return `<div class="cd sm" style="--k:${PAL[(i + j + k) % PAL.length][0]}"><div class="bub">${it[1].startsWith('#') ? `<b class="bignum">${it[1].slice(1)}</b>` : G(it[1])}</div><b class="w">${w}</b><span class="a" dir="rtl">${it[2]}</span></div>`;
    }).join('');
    return `<div class="band"><div class="lt" style="--k:${PAL[(i + j * 5) % PAL.length][0]};--k2:${PAL[(i + j * 5) % PAL.length][1]}"><b>${L}${L.toLowerCase()}</b></div><div class="agrid n${items.length}">${its}</div></div>`;
  }).join('');
  const p = page(cloud(`Letters ${AL[i][0]} and ${AL[i + 1][0]}`, `الحَرْفَانِ ${AL[i][0]} وَ ${AL[i + 1][0]}`).replace(/الحَرْفَانِ ([A-Z]) وَ ([A-Z])/, (m, a, b) => `الحَرْفَانِ <bdi>${a}</bdi> وَ <bdi>${b}</bdi>`) + `<div class="alpha">${bands}</div>`, pi++);
  if (i === 0) toc.push(['The Alphabet A–Z', 'الحُرُوفُ الإِنْجِلِيزِيَّة', p, 'apple']);
}
// numbers
const dots = n => `<div class="dots">${Array.from({ length: n }, (_, k) => `<i style="background:${PAL[k % PAL.length][0]}"></i>`).join('')}</div>`;
const numPage = (list, start, en, ar) => page(cloud(en, ar) + `<div class="nums">${list.map(([w, a], k) => `<div class="nc" style="--k:${PAL[k % PAL.length][0]}"><b class="nb">${start + k}</b><div><b class="w">${w}</b><span class="a" dir="rtl">${a}</span>${dots(start + k)}</div></div>`).join('')}</div>`, pi++);
toc.push(['Numbers 1–20', 'الأَرْقَامُ مِنْ ١ إِلَى ٢٠', numPage(C.numbers1, 1, 'Numbers 1 to 10', 'الأَرْقَامُ مِنْ ١ إِلَى ١٠'), 'dice']);
numPage(C.numbers2, 11, 'Numbers 11 to 20', 'الأَرْقَامُ مِنْ ١١ إِلَى ٢٠');
// colours
const blob = c => `<svg class="blob" viewBox="0 0 120 120"><path d="M60 8 C86 6 112 26 110 56 C114 84 92 112 62 110 C30 114 8 92 10 62 C6 32 30 10 60 8 Z" fill="${c}" stroke="#2b2b2b" stroke-opacity=".25" stroke-width="3"/><ellipse cx="42" cy="38" rx="16" ry="9" fill="#fff" fill-opacity=".45"/></svg>`;
toc.push(['Colours', 'الأَلْوَان', page(cloud('Colours', 'الأَلْوَان') + `<div class="grid" style="--cols:3">${C.colours.map(([w, c, a, ar_], k) => `<div class="cd" style="--k:${c === '#ffffff' ? '#cfd8dc' : c}"><div class="bub col">${blob(c)}<div class="mini">${G(ar_)}</div></div><b class="w" style="color:${c === '#ffffff' ? '#455a64' : c};-webkit-text-stroke:${c === '#ffffff' || c === '#fdd835' ? '1px #555' : '0'}">${w}</b><span class="a" dir="rtl">${a}</span></div>`).join('')}</div>`, pi++), 'palette']);
toc.push(['Shapes', 'الأَشْكَال', page(cloud('Shapes', 'الأَشْكَال') + grid(C.shapes, 3, 'g10'), pi++), 'sh_cube']);
for (const t of C.themes) toc.push([t.en, t.ar, page(cloud(t.en, t.ar) + grid(t.items, 3, t.items.length <= 10 ? 'g10' : ''), pi++), t.items[0][1]]);
// days & months
toc.push(['Days and Months', 'الأَيَّامُ وَالشُّهُور', page(cloud('Days and Months', 'الأَيَّامُ وَالشُّهُور') + `<div class="dm"><h3>Days of the Week <span dir="rtl">أَيَّامُ الأُسْبُوع</span></h3><div class="days">${C.days.map(([w, a], k) => `<div class="pill" style="--k:${PAL[k][0]}"><b>${w}</b><span dir="rtl">${a}</span></div>`).join('')}</div>
<h3>Months of the Year <span dir="rtl">شُهُورُ السَّنَة</span></h3><div class="months">${C.months.map(([w, a], k) => `<div class="pill m" style="--k:${PAL[k % 12][0]}"><i>${k + 1}</i><b>${w}</b><span dir="rtl">${a}</span></div>`).join('')}</div></div>`, pi++), 'clock']);
// sentences
for (let i = 0; i < C.sentences.length; i += 8) {
  const p = page(cloud(i ? 'Let’s Read More!' : 'Let’s Read!', i ? 'لِنَقْرَأْ أَكْثَرَ!' : 'هَيَّا نَقْرَأ!') + `<div class="sents">${C.sentences.slice(i, i + 8).map(([s, a_, a], k) => `<div class="sc" style="--k:${PAL[(k + i) % 12][0]}"><div class="bub">${G(a_)}</div><div><b>${e(s)}</b><span dir="rtl">${a}</span></div></div>`).join('')}</div>`, pi++);
  if (!i) toc.push(['Let’s Read!', 'هَيَّا نَقْرَأ!', p, 'v_read']);
}
// well done
page(`<div class="own"><div class="ownart">${G('medal')}</div><h3 class="wd">Well done!</h3><h2 dir="rtl">أَحْسَنْتَ!</h2>
<p>You know lots of English words now. Keep reading every day!</p><p dir="rtl" class="pa">أَصْبَحْتَ تَعْرِفُ كَلِمَاتٍ إِنْجِلِيزِيَّةً كَثِيرَةً. اِقْرَأْ كُلَّ يَوْمٍ!</p>
<div class="minis">${['sunstar', 'balloon', 'gift', 'rainbow', 'sunstar'].map(a => G(a)).join('')}</div></div>`, pi++);
// back cover
page(`<div class="cv back">${coverArts.slice(0, 8).map((a, i) => `<div class="ca c${i}">${G(a)}</div>`).join('')}<div class="cvbox"><h1>${title}</h1><h2 dir="rtl">كِتَابِي الكَبِيرُ لِلإِنْجِلِيزِيَّة</h2>
<p>A big, bright picture book with more than 450 English words and their Arabic meanings: letters, numbers, colours, shapes, animals, food, home, school, toys, jobs, weather, feelings, good manners and first sentences.</p>
<p dir="rtl" class="pa">كِتَابٌ مُصَوَّرٌ كَبِيرٌ وَمُلَوَّنٌ فِيهِ أَكْثَرُ مِنْ ٤٥٠ كَلِمَةً إِنْجِلِيزِيَّةً مَعَ مَعَانِيهَا بِالعَرَبِيَّة.</p></div></div>`, pi++, 'cover');
// contents page
const tocHTML = cloud('Contents', 'المُحْتَوَيَات') + `<div class="toc">${toc.map(([en, ar, p, a], k) => `<div class="tr" style="--k:${PAL[k % 12][0]}"><div class="ti">${G(a)}</div><div class="tt"><b>${e(en)}</b><span dir="rtl">${ar}</span></div><i>${p}</i></div>`).join('')}</div>`;
pages[tocIdx] = pages[tocIdx].replace('<i class="o o3"></i>', '<i class="o o3"></i>' + tocHTML);
const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8').replace(/FONT\//g, FONT);
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style></head><body>${pages.join('\n')}</body></html>`);
const items = C.alphabet.reduce((a, x) => a + x[1].length, 0) + 20 + 12 + C.shapes.length + C.themes.reduce((a, t) => a + t.items.length, 0) + 19;
console.log('pages', pages.length, 'items', items, 'toc', toc.length);
