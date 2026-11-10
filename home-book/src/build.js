// Builds "بيتي الجميل" – a 3D-style Arabic book about things in the home – A4 portrait.
// Every white word gets a dark outline so it stays readable on light backgrounds.
const fs = require('fs');
const path = require('path');
const { art } = require('./home-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

const ROOMS = {
  bed: ['غُرْفَةُ النَّوْم', '🛏️', '#3d8fe0', 'نَوْم'],
  live: ['غُرْفَةُ الجُلُوس', '🛋️', '#8a48c4', 'جُلُوس'],
  kitchen: ['المَطْبَخ', '🍳', '#e8701a', 'مَطْبَخ'],
  bath: ['الحَمَّام', '🛁', '#1fa89b', 'حَمَّام'],
};
// [name, english, art, sentence, room]
const ITEMS = [
  ['سَرِير', 'Bed', 'bed', 'أَنَامُ عَلَى السَّرِير', 'bed'],
  ['وِسَادَة', 'Pillow', 'pillow', 'أَضَعُ رَأْسِي عَلَى الوِسَادَة', 'bed'],
  ['مِصْبَاح', 'Lamp', 'lamp', 'المِصْبَاحُ يُعْطِينَا النُّور', 'bed'],
  ['سَاعَة', 'Clock', 'clock', 'السَّاعَةُ تُخْبِرُنَا بِالوَقْت', 'bed'],
  ['دُبْدُوب', 'Teddy Bear', 'teddy', 'أَلْعَبُ مَعَ الدُّبْدُوب', 'bed'],
  ['أَرِيكَة', 'Sofa', 'sofa', 'نَجْلِسُ عَلَى الأَرِيكَة', 'live'],
  ['تِلْفَاز', 'TV', 'tv', 'نُشَاهِدُ التِّلْفَازَ مَعًا', 'live'],
  ['كُرْسِيّ', 'Chair', 'chair', 'أَجْلِسُ عَلَى الكُرْسِيّ', 'live'],
  ['طَاوِلَة', 'Table', 'table', 'نَضَعُ الأَشْيَاءَ عَلَى الطَّاوِلَة', 'live'],
  ['كِتَاب', 'Book', 'book', 'أَقْرَأُ الكِتَابَ كُلَّ يَوْم', 'live'],
  ['ثَلَّاجَة', 'Fridge', 'fridge', 'الثَّلَّاجَةُ تَحْفَظُ الطَّعَام', 'kitchen'],
  ['إِبْرِيق', 'Kettle', 'kettle', 'نَغْلِي المَاءَ فِي الإِبْرِيق', 'kitchen'],
  ['كُوب', 'Cup', 'cup', 'أَشْرَبُ العَصِيرَ فِي الكُوب', 'kitchen'],
  ['صَحْن', 'Plate', 'plate', 'آكُلُ طَعَامِي فِي الصَّحْن', 'kitchen'],
  ['مِلْعَقَة', 'Spoon', 'spoon', 'آكُلُ بِالمِلْعَقَة', 'kitchen'],
  ['حَوْضُ الاسْتِحْمَام', 'Bathtub', 'bathtub', 'أَسْتَحِمُّ فِي الحَوْض', 'bath'],
  ['صَابُون', 'Soap', 'soap', 'أَغْسِلُ يَدَيَّ بِالصَّابُون', 'bath'],
  ['فُرْشَاةُ الأَسْنَان', 'Toothbrush', 'toothbrush', 'أُنَظِّفُ أَسْنَانِي بِالفُرْشَاة', 'bath'],
  ['مِنْشَفَة', 'Towel', 'towel', 'أُجَفِّفُ يَدَيَّ بِالمِنْشَفَة', 'bath'],
  ['مِرْآة', 'Mirror', 'mirror', 'أَرَى وَجْهِي فِي المِرْآة', 'bath'],
];
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const A = (name, o = {}) => art(name, name === 'cup' ? { color: 1, ...o } : o);
const firstLetter = w => w.replace(/[ً-ْ]/g, '')[0];
const hue = i => Math.round((i * 360 / 20 * 7 + 30) % 360);

// outline made from 8 offset shadows (no ugly inner lines on joined Arabic letters)
const ring = (c, w = 2.5) => [[-w, 0], [w, 0], [0, -w], [0, w], [-w * .7, -w * .7], [w * .7, -w * .7], [-w * .7, w * .7], [w * .7, w * .7]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(',');
const isWhite = c => /^#f{3}(f{3})?$/i.test(c) || c === 'white';
const t3d = (txt, top, side, depth = 8, cls = '') => {
  const sh = isWhite(top) ? [ring(side, 3)] : [];
  for (let i = 1; i <= depth; i++) sh.push(`0 ${i}px 0 ${side}`);
  sh.push(`0 ${depth + 4}px 14px rgba(40,20,80,.35)`);
  return `<span class="t3d ${cls}" style="color:${top};text-shadow:${sh.join(',')}">${txt}</span>`;
};
function bubbles(seed, h, n = 10) {
  let s = seed * 9301 + 49297, out = '';
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const size = 14 + rnd() * 46;
    out += `<i class="bub" style="width:${size}px;height:${size}px;left:${rnd() * 100}%;top:${rnd() * 100}%;--h:${(h + rnd() * 120) % 360}"></i>`;
  }
  return out;
}
const pno = n => `<div class="pno">${AR(n)}</div>`;
const title = (txt, side) => `<h2 class="ttl">${t3d(txt, '#fff', side, 7)}</h2>`;

const pages = [];
let P = 1;

// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, 30, 12)}
  <div class="ctop">${art('house', { cls: 'chouse' })}</div>
  <h1>${t3d('بَيْتِي', '#ffffff', '#c2364f', 12)}<br>${t3d('الجَمِيل', '#ffd23f', '#6a3fd0', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى أَشْيَاءِ البَيْتِ بِالعَرَبِيَّة</div>
  <div class="cen">My Lovely Home</div>
  <div class="cart">${['sofa', 'lamp', 'teddy', 'kettle', 'tv', 'clock'].map((a, k) => `<div class="ca ca${k}">${A(a)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:30">
  ${bubbles(2, 30)}
  <div class="owner">
    ${A('teddy', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#e07b00', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${A('book', { cls: 'mini' })}${A('lamp', { cls: 'mini' })}${A('pillow', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(3, 270)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#6a3fd0')}
    <div class="card">
      <p>أَهْلًا بِكُمْ فِي جَوْلَةٍ مُمْتِعَةٍ دَاخِلَ البَيْت! 🏠</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ الشَّيْءِ ثُمَّ ابْحَثُوا عَنْهُ فِي بَيْتِكُم.</li>
        <li>اسْأَلُوا طِفْلَكُمْ: فِي أَيِّ غُرْفَةٍ نَجِدُه؟</li>
        <li>اقْرَؤُوا الجُمْلَةَ القَصِيرَةَ وَدَعُوهُ يُمَثِّلُهَا.</li>
        <li>شَجِّعُوهُ عَلَى العَادَاتِ الجَمِيلَةِ فِي صَفْحَةِ «عَادَاتِي».</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${A('sofa', { cls: 'mini' })}${A('fridge', { cls: 'mini' })}${A('bathtub', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview by room
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(4, 200)}
  ${title('أَشْيَاءُ بَيْتِي', '#2a6fd4')}
  ${Object.entries(ROOMS).map(([k, [n, e, col]]) => `<div class="ovr" style="--gc:${col}"><div class="ovh wo">${e} ${n}</div><div class="ovg">${ITEMS.filter(i => i[4] === k).map(i => `<div class="ovc">${A(i[2])}<b>${i[0]}</b></div>`).join('')}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 5–24 ---------- One page per item
ITEMS.forEach(([name, en, ill, sentence, room], i) => {
  const h = hue(i), [rn, re, rc] = ROOMS[room];
  const long = name.length > 9;
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},65%,32%)`, 9, long ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="stage">
      <div class="pedestal"></div>
      ${A(ill, { cls: 'ill' })}
      <div class="kind" style="--gc:${rc}">${re}<b class="wo">${ROOMS[room][3]}</b></div>
    </div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>📍</i><div><small>أَيْنَ أَجِدُهُ؟</small><b>${rn}</b></div></div>
      <div class="chip"><i class="ab wo">أ ب</i><div><small>الحَرْفُ الأَوَّل</small><b class="fl">${firstLetter(name)}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الاسْم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(long ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Which room?
const SORT = ['bed', 'kettle', 'soap', 'sofa', 'spoon', 'pillow', 'towel', 'tv'];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(40, 150)}
  ${title('فِي أَيِّ غُرْفَة؟', '#1f9d63')}
  <div class="hint">ضَعْ عَلَامَةَ ✓ عَلَى الغُرْفَةِ المُنَاسِبَة</div>
  <div class="sort">${SORT.map(a => `<div class="sc">${A(a)}<b>${BY[a][0]}</b><div class="opts">${Object.values(ROOMS).map(r => `<span><i></i>${r[3]}</span>`).join('')}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Shadow match
const SH = [['lamp', 'clock'], ['kettle', 'mirror'], ['chair', 'lamp'], ['clock', 'chair'], ['mirror', 'kettle']];
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(41, 260)}
  ${title('أَيْنَ ظِلِّي؟', '#6a3fd0')}
  <div class="hint">صِلْ كُلَّ صُورَةٍ بِظِلِّهَا 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${A(a)}<b>${BY[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${A(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Counting
const COUNT = [['cup', 3], ['spoon', 4], ['pillow', 2], ['book', 5]];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(42, 20)}
  ${title('كَمْ عَدَدُهَا؟', '#e0482c')}
  <div class="hint">عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => A(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 28 ---------- What doesn't belong?
const ODD = [['المَطْبَخ', ['fridge', 'kettle', 'bed', 'plate']], ['الحَمَّام', ['soap', 'tv', 'towel', 'toothbrush']], ['غُرْفَةِ النَّوْم', ['bed', 'pillow', 'lamp', 'kettle']], ['غُرْفَةِ الجُلُوس', ['sofa', 'bathtub', 'tv', 'chair']]];
pages.push(`
<section class="page plain" style="--h:300">
  ${bubbles(43, 300)}
  ${title('مَا الَّذِي لَا يَنْتَمِي؟', '#9b3fd0')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الشَّيْءِ الَّذِي لَيْسَ مِنْ هٰذِهِ الغُرْفَة ⭕</div>
  ${ODD.map(([r, list]) => `<div class="odd"><div class="oddt">مِنْ ${r}؟</div><div class="oddr">${list.map(a => `<div>${A(a)}</div>`).join('')}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 29 ---------- My good habits
const HAB = [['toothbrush', 'أُنَظِّفُ أَسْنَانِي'], ['soap', 'أَغْسِلُ يَدَيَّ'], ['bed', 'أُرَتِّبُ سَرِيرِي'], ['book', 'أَقْرَأُ كِتَابًا']];
const DAYS = ['سَبْت', 'أَحَد', 'إِثْنَيْن', 'ثُلَاثَاء', 'أَرْبِعَاء', 'خَمِيس', 'جُمُعَة'];
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(44, 180)}
  ${title('عَادَاتِي الجَمِيلَة', '#1d7fa8')}
  <div class="hint">ضَعْ نَجْمَةً ⭐ كُلَّ يَوْمٍ تَفْعَلُ فِيهِ العَادَةَ الجَمِيلَة</div>
  <div class="habits">
    <div class="hrow head"><div></div>${DAYS.map(d => `<b>${d}</b>`).join('')}</div>
    ${HAB.map(([a, t]) => `<div class="hrow"><div class="hl">${A(a)}<span>${t}</span></div>${DAYS.map(() => '<i></i>').join('')}</div>`).join('')}
  </div>
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:330">
  ${title('لَوِّنْ أَشْيَاءَ البَيْت', '#c2367a')}
  <div class="colorbox">${[['tv', 'c1'], ['kettle', 'c2'], ['clock', 'c3']].map(([a, c]) => A(a, { cls: 'outline ' + c })).join('')}
    <div class="ref">${['tv', 'kettle', 'clock'].map(a => A(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
  ${pno(P++)}
</section>`);

// 31 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى أَشْيَاءِ البَيْت<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${A('house')}${A('teddy')}${A('lamp')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 30, 12)}
  <h2>${t3d('بَيْتِي الجَمِيل', '#fff', '#c2364f', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَرِّفُ طِفْلَكَ عَلَى عِشْرِينَ شَيْئًا فِي أَرْبَعِ غُرَفٍ مِنَ البَيْت.</p>
    <ul><li>غُرْفَةُ النَّوْم، غُرْفَةُ الجُلُوس، المَطْبَخ، الحَمَّام</li><li>٢٠ صُورَةً مَعَ الاسْمِ وَالجُمْلَة</li><li>أَلْعَابٌ وَجَدْوَلُ العَادَاتِ الجَمِيلَة</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn things at home in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">${['bed', 'mirror', 'soap', 'fridge', 'chair'].map((a, k) => `<div class="ca ca${k}">${A(a)}</div>`).join('')}</div>
</section>`);

const css = `
@font-face{font-family:Baloo;src:url('${font('BalooBhaijaan2.ttf')}');font-weight:400 800}
@font-face{font-family:Lalezar;src:url('${font('Lalezar.ttf')}')}
@font-face{font-family:Fredoka;src:url('${font('Fredoka.ttf')}');font-weight:300 700}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Baloo,sans-serif;direction:rtl;color:#2b2340;background:#fff}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:40px 40px 80px;
  background:radial-gradient(circle at 30% 20%,hsl(var(--h),100%,97%),hsl(var(--h),85%,88%) 70%,hsl(var(--h),70%,80%))}
.bub{position:absolute;border-radius:50%;opacity:.55;background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--h),90%,85%) 45%,hsl(var(--h),70%,70%));box-shadow:0 6px 12px hsla(var(--h),60%,40%,.18)}
.t3d{font-family:Lalezar,Baloo;display:inline-block;line-height:1.15}
.wo{text-shadow:${ring('rgba(30,20,60,.75)', 1.6)}}
.pno{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;color:#fff;
  text-shadow:${ring('hsl(var(--h),60%,28%)', 1.4)};
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
svg{display:block}
.ttl{position:relative;text-align:center;font-size:58px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,32%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.22),0 16px 26px rgba(40,20,80,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
/* cover */
.cover{--h:30;background:radial-gradient(circle at 50% 38%,#fffbe6,#ffd9b8 42%,#ffa98f 75%,#e8706a);text-align:center;padding:40px}
.ctop{position:relative;height:250px}.chouse{width:270px;height:270px;margin:-10px auto 0;filter:drop-shadow(0 12px 12px rgba(80,20,20,.3))}
.cover h1{position:relative;font-size:130px;line-height:1.1}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#c2364f;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #ffc2c9,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:${ring('#c2364f', 1.6)},0 3px 0 #c2364f;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:300px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(80,20,20,.28))}.ca svg{width:100%;height:100%}
.ca0{width:230px;height:230px;left:250px;bottom:0}.ca1{width:170px;height:170px;left:30px;bottom:110px}.ca2{width:180px;height:180px;left:60px;bottom:-10px}
.ca3{width:170px;height:170px;right:60px;bottom:0}.ca4{width:170px;height:170px;right:20px;bottom:150px}.ca5{width:130px;height:130px;left:200px;bottom:170px}
.cart.small .ca0{left:auto;right:280px}.cart.small .ca4{right:auto;left:200px;bottom:110px}
.back h2{position:relative;font-size:90px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#c2364f;font-size:19px;margin-top:8px}
/* owner / note */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;text-shadow:${ring('#a8245a', 1.8)};
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:26px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ovr{position:relative;margin-top:12px}
.ovh{display:inline-block;font-size:26px;font-weight:800;color:#fff;padding:0 20px;border-radius:20px;background:var(--gc);box-shadow:0 4px 0 rgba(0,0,0,.2)}
.ovg{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:6px}
.ovc{text-align:center;background:rgba(255,255,255,.75);border-radius:22px;padding:4px 0 6px;box-shadow:0 4px 0 hsl(var(--h),50%,80%)}
.ovc svg{width:104px;height:104px;margin:0 auto}.ovc b{font-size:17px;font-weight:800;white-space:nowrap}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:90px}.iname .big.long{font-size:70px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,38%);direction:ltr;margin-top:-6px}
.stage{position:relative;height:440px;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:12px;width:430px;height:90px;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 12px 0 hsl(var(--h),45%,62%),0 24px 28px rgba(40,20,80,.25)}
.ill{position:relative;width:440px;height:440px;margin-bottom:40px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.kind{position:absolute;top:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;width:120px;height:120px;border-radius:30px;font-size:46px;
  background:var(--gc);box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 rgba(0,0,0,.25),0 14px 18px rgba(40,20,80,.25)}
.kind b{font-size:24px;font-weight:800;color:#fff;margin-top:-4px}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:34px;font-weight:800;color:hsl(var(--h),60%,30%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#7a6f92}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,34%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#8a80a3}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}
.trace text.sm{font-size:42px}
.trace .solid{fill:hsl(var(--h),70%,44%)}.trace .dash{fill:#dcd5e8;stroke:none}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.sort{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:16px 20px;margin-top:20px}
.sc{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:28px;padding:4px 10px 12px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:104px;height:104px}.sc>b{font-size:24px;font-weight:800;color:hsl(var(--h),55%,30%);line-height:1.2}
.opts{display:flex;gap:10px;margin-top:6px}.opts span{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:800}
.opts i{width:26px;height:26px;border-radius:7px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:116px;height:116px;margin:0 auto}.mc b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,32%);line-height:1}
.shadowimg svg{width:136px;height:136px;margin-top:4px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.odd{position:relative;margin-top:24px;background:rgba(255,255,255,.8);border-radius:34px;padding:10px 16px 14px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.oddt{font-size:26px;font-weight:800;color:hsl(var(--h),55%,32%)}
.oddr{display:flex;justify-content:space-around}.oddr svg{width:120px;height:120px}
.habits{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.hrow{display:grid;grid-template-columns:200px repeat(7,1fr);gap:6px;align-items:center;padding:8px 0;border-bottom:2px dashed hsl(var(--h),50%,85%)}
.hrow:last-child{border-bottom:none}
.hrow.head b{text-align:center;font-size:18px;font-weight:800;color:#fff;background:hsl(var(--h),60%,48%);border-radius:12px;padding:2px 0;text-shadow:${ring('hsl(190,60%,25%)', 1.2)}}
.hl{display:flex;flex-direction:column;align-items:center}.hl svg{width:140px;height:140px}.hl span{font-size:21px;font-weight:800;color:hsl(var(--h),55%,30%)}
.hrow i{height:96px;border-radius:14px;border:3px dashed hsl(var(--h),50%,70%)}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}
.c1{width:460px;height:460px;left:20px;top:40px}.c2{width:320px;height:320px;left:30px;bottom:30px}.c3{width:300px;height:300px;right:30px;bottom:60px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.ref{position:absolute;top:18px;right:18px;width:120px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:80px;height:80px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:hsl(var(--h),55%,32%)}
/* certificate */
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d);padding:40px}
.frame{position:relative;height:100%;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:60px;box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:230px;height:230px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:88px}
.cp{font-size:31px;font-weight:700;color:#8a5200;margin-top:14px;line-height:1.7}
.certart{display:flex;justify-content:center;gap:10px;margin-top:10px}.certart svg{width:150px;height:150px}
.sig{display:flex;justify-content:space-around;margin-top:24px;font-size:22px;font-weight:700;color:#8a5200}
.cert .pno{bottom:56px}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>بيتي الجميل</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
