// First-grade Arabic reading books (Baghdadi-qaida style), two different looks from the same structure.
// node reading-tools/build.js A|B   -> aqra-book/build/book.html  or  hayya-naqra-book/build/book.html
// Content: <book>/content/content.json (words, phrases, cards, stories). Letter tables are generated here.
const fs = require('fs'), path = require('path');
const { art } = require('../arabic-kids-book/src/extra100-art');
const T = process.argv[2] === 'B' ? 'B' : 'A';
const DIR = path.join(__dirname, '..', T === 'A' ? 'aqra-book' : 'hayya-naqra-book');
const C = JSON.parse(fs.readFileSync(path.join(DIR, 'content', 'content.json'), 'utf8'));
const FONT = 'file:///home/user/Inaam-Qarz/';
const TITLE = T === 'A' ? 'أَقْرَأُ وَأَتَعَلَّمُ' : 'هَيَّا نَقْرَأُ';
const SUB = T === 'A' ? 'خُطُوَاتِي الأُولَى فِي القِرَاءَةِ' : 'رِحْلَتِي مَعَ الحُرُوفِ وَالحَرَكَاتِ';
const G = n => art(n);

// ---------- harakat colouring ----------
const HC = T === 'A' ? { 'َ': '#e53935', 'ِ': '#1e6fd9', 'ُ': '#1b9e55' } : { 'َ': '#d81b60', 'ِ': '#3949ab', 'ُ': '#00897b' };
const colorize = w => (w.match(/[ء-ي][ً-ْ]*|[^ء-ي]/g) || []).map(p => {
  const h = (p.match(/[َُِ]/) || [])[0];
  return h ? `<span style="color:${HC[h]}">${p}</span>` : p;
}).join('');

// ---------- letters ----------
const L = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'];
const withH = (l, h) => (l === 'ا' ? (h === 'ِ' ? 'إ' : 'أ') : l) + h;
const row = h => L.map(l => withH(l, h));
let seed = T === 'A' ? 7 : 19;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
function scatter(hs, n) {
  const out = []; let prev = '';
  while (out.length < n) { const x = withH(L[Math.floor(rnd() * 28)], hs[Math.floor(rnd() * hs.length)]); if (x[0] !== prev) { out.push(x); prev = x[0]; } }
  return out;
}

// ---------- page parts ----------
let pn = 0; const pages = [];
const page = (inner, cls = '') => { pn++; pages.push(`<section class="pg ${cls}">${inner}${cls.includes('cover') ? '' : `<div class="pno"><span>${pn}</span></div><div class="cred">تَأْلِيف: انعام الرحمن</div>`}</section>`); };
const title = t => `<div class="ttl"><span>${t}</span></div>`;
const table = (items, cols, cls = '') => `<div class="tbl ${cls}" style="--c:${cols};flex:${Math.ceil(items.length / cols)} 1 0">${items.map(x => `<div class="cell"><span>${colorize(x)}</span></div>`).join('')}</div>`;
const note = t => `<div class="note"><b>${T === 'A' ? 'نَصِيحَةٌ لِلْمُعَلِّمِ' : 'إِلَى المُعَلِّمِ وَوَلِيِّ الأَمْرِ'}</b>${t}</div>`;
const legend = () => `<div class="legend"><span style="color:${HC['\u064E']}">الفَتْحَةُ: بَ</span><span style="color:${HC['\u0650']}">الكَسْرَةُ: بِ</span><span style="color:${HC['\u064F']}">الضَّمَّةُ: بُ</span></div>`;

// cover
const coverArts = T === 'A' ? ['bigbook', 'sun', 'tree', 'cat', 'kite', 'flower'] : ['moon', 'stars', 'rocket', 'owl', 'books3', 'rainbow'];
page(`<div class="cv">${coverArts.map((a, i) => `<div class="ca a${i}">${G(a)}</div>`).join('')}
<div class="cvc"><div class="abc">${['أ', 'ب', 'ت'].map(x => `<b>${x}</b>`).join('')}</div><h1>${TITLE}</h1><h2>${SUB}</h2>
<div class="grade">الصَّفُّ الأَوَّلُ</div></div></div>`, 'cover');
// owner page
page(`<div class="own"><div class="oa">${G(T === 'A' ? 'v_read' : 'bigbook')}</div><h2>هٰذَا الكِتَابُ مِلْكُ</h2><div class="by">تَأْلِيف: انعام الرحمن</div>
<p>أَقْرَأُ كُلَّ يَوْمٍ صَفْحَةً، وَأَنْطِقُ الحُرُوفَ بِصَوْتٍ وَاضِحٍ.</p>${legend()}</div>`);
// fatha
page(title('قِرَاءَةُ الحُرُوفِ بِالفَتْحَةِ') + table(row('َ'), 7) + title('كَلِمَاتٌ حُرُوفُهَا مَفْتُوحَةٌ') + table(C.fatha_words, 5, 'w'));
page(title('جُمَلٌ حُرُوفُهَا مَفْتُوحَةٌ') + table(C.fatha_phrases, 3, 'p') + title('أَقْرَأُ الحُرُوفَ مُتَفَرِّقَةً بِالفَتْحَةِ') + table(scatter(['َ'], 28), 7) +
  note('يَقْرَأُ الطِّفْلُ الحَرْفَ مَعَ حَرَكَتِهِ دُونَ تَهَجٍّ، ثُمَّ يَقْرَأُ الكَلِمَةَ كَامِلَةً.'));
// kasra
page(title('قِرَاءَةُ الحُرُوفِ بِالكَسْرَةِ') + table(row('ِ'), 7) + title('حُرُوفٌ مُتَفَرِّقَةٌ بِالفَتْحَةِ وَالكَسْرَةِ') + table(scatter(['َ', 'ِ'], 35), 7));
page(title('كَلِمَاتٌ بِالفَتْحَةِ وَالكَسْرَةِ') + table(C.kasra_words, 4, 'w') + title('جُمَلٌ بِالفَتْحَةِ وَالكَسْرَةِ') + table(C.kasra_phrases, 3, 'p'));
// damma
page(title('قِرَاءَةُ الحُرُوفِ بِالضَّمَّةِ') + table(row('ُ'), 7) + title('كَلِمَاتٌ بِالفَتْحَةِ وَالضَّمَّةِ') + table(C.damma_words, 5, 'w'));
// all three per letter
const tri = L.map(l => ['َ', 'ِ', 'ُ'].map(h => withH(l, h)).join(' '));
page(title('الحَرْفُ بِالحَرَكَاتِ الثَّلَاثِ') + table(tri.slice(0, 14), 2, 'tri') + legend());
page(title('الحَرْفُ بِالحَرَكَاتِ الثَّلَاثِ') + table(tri.slice(14), 2, 'tri') + legend());
page(title('حُرُوفٌ مُتَفَرِّقَةٌ بِالحَرَكَاتِ الثَّلَاثِ') + table(scatter(['َ', 'ِ', 'ُ'], 70), 7, 'sm') +
  note('هٰذَا الجَدْوَلُ مُهِمٌّ جِدًّا: يَقْرَأُ الطِّفْلُ كُلَّ حَرْفٍ بِحَرَكَتِهِ مُبَاشَرَةً، فَهُوَ بِدَايَةُ الاِنْطِلَاقِ فِي القِرَاءَةِ.'));
page(title('كَلِمَاتٌ بِالحَرَكَاتِ الثَّلَاثِ') + table(C.three_words.slice(0, 20), 4, 'w'));
page(title('تَابِعْ: كَلِمَاتٌ بِالحَرَكَاتِ الثَّلَاثِ') + table(C.three_words.slice(20), 4, 'w'));
page(title('جُمَلٌ بِالحَرَكَاتِ الثَّلَاثِ') + table(C.three_phrases, 3, 'p'));
// sentence cards (4 per page)
const CC = T === 'A' ? ['#0f8a7e', '#e2543b', '#7a4fc4', '#c2185b', '#2e7d32', '#1565c0'] : ['#6a1b9a', '#ef6c00', '#00838f', '#ad1457', '#283593', '#2e7d32'];
for (let i = 0; i < C.cards.length; i += 4)
  page((i ? '' : title('أَقْرَأُ الجُمَلَ')) + `<div class="cards${i ? '' : ' first'}">${C.cards.slice(i, i + 4).map((s, k) => `<div class="card"><p style="color:${CC[(i + k) % CC.length]}">${s}</p></div>`).join('')}</div>`);
// stories (2 per page)
for (let i = 0; i < C.stories.length; i += 2)
  page(`<div class="stories">${C.stories.slice(i, i + 2).map((s, k) => `<div class="story s${(i / 2 + k) % 3}"><div class="sart">${G(s.art)}</div><div class="stext">${s.lines.map(l => `<p>${l}</p>`).join('')}</div></div>`).join('')}</div>`);
// well done
page(`<div class="own"><div class="oa">${G('medal')}</div><h2>أَحْسَنْتَ يَا بَطَلُ!</h2><p>أَصْبَحْتَ تَقْرَأُ الحُرُوفَ وَالكَلِمَاتِ وَالجُمَلَ بِالحَرَكَاتِ الثَّلَاثِ.</p><p>اِقْرَأْ كُلَّ يَوْمٍ قِصَّةً جَمِيلَةً.</p></div>`);
// back
page(`<div class="cv back">${coverArts.slice(0, 4).map((a, i) => `<div class="ca a${i}">${G(a)}</div>`).join('')}<div class="cvc"><h1>${TITLE}</h1>
<p class="bk">كِتَابٌ لِتَعْلِيمِ القِرَاءَةِ خُطْوَةً خُطْوَةً: الحُرُوفُ بِالحَرَكَاتِ، ثُمَّ الكَلِمَاتُ، ثُمَّ الجُمَلُ، ثُمَّ نُصُوصٌ قَصِيرَةٌ مُصَوَّرَةٌ.</p></div></div>`, 'cover');

const css = fs.readFileSync(path.join(__dirname, `theme${T}.css`), 'utf8').replace(/FONT\//g, FONT);
fs.mkdirSync(path.join(DIR, 'build'), { recursive: true });
fs.writeFileSync(path.join(DIR, 'build', 'book.html'), `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${css}</style></head><body>${pages.join('\n')}</body></html>`);
console.log(T, 'pages', pages.length);
