// Builds "مركباتي الجميلة" – a 3D-style Arabic vehicles book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art } = require('./vehicles-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, where it moves, sentence, group]
const V = [
  ['سَيَّارَة', 'Car', 'car', 'عَلَى الطَّرِيق', 'السَّيَّارَةُ تَسِيرُ عَلَى الطَّرِيق', 'land'],
  ['سَيَّارَةُ أُجْرَة', 'Taxi', 'taxi', 'عَلَى الطَّرِيق', 'سَيَّارَةُ الأُجْرَةِ تُوصِلُ النَّاس', 'land'],
  ['سَيَّارَةُ سِبَاق', 'Race Car', 'racecar', 'عَلَى الحَلْبَة', 'سَيَّارَةُ السِّبَاقِ سَرِيعَةٌ جِدًّا', 'land'],
  ['حَافِلَة', 'Bus', 'bus', 'عَلَى الطَّرِيق', 'الحَافِلَةُ تَحْمِلُ رُكَّابًا كَثِيرِين', 'land'],
  ['شَاحِنَة', 'Truck', 'truck', 'عَلَى الطَّرِيق', 'الشَّاحِنَةُ تَنْقُلُ البَضَائِع', 'land'],
  ['قِطَار', 'Train', 'train', 'عَلَى السِّكَّة', 'القِطَارُ يَسِيرُ عَلَى السِّكَّة', 'land'],
  ['دَرَّاجَة', 'Bicycle', 'bicycle', 'عَلَى الطَّرِيق', 'الدَّرَّاجَةُ لَهَا عَجَلَتَان', 'land'],
  ['دَرَّاجَةٌ نَارِيَّة', 'Motorcycle', 'motorcycle', 'عَلَى الطَّرِيق', 'الدَّرَّاجَةُ النَّارِيَّةُ لَهَا مُحَرِّك', 'land'],
  ['سَيَّارَةُ إِسْعَاف', 'Ambulance', 'ambulance', 'عَلَى الطَّرِيق', 'الإِسْعَافُ يُسَاعِدُ المَرْضَى', 'land'],
  ['سَيَّارَةُ إِطْفَاء', 'Fire Truck', 'firetruck', 'عَلَى الطَّرِيق', 'سَيَّارَةُ الإِطْفَاءِ تُطْفِئُ النَّار', 'land'],
  ['سَيَّارَةُ شُرْطَة', 'Police Car', 'police', 'عَلَى الطَّرِيق', 'الشُّرْطَةُ تَحْمِينَا', 'land'],
  ['جَرَّار', 'Tractor', 'tractor', 'فِي الحَقْل', 'الجَرَّارُ يَعْمَلُ فِي المَزْرَعَة', 'land'],
  ['سَفِينَة', 'Ship', 'ship', 'فِي البَحْر', 'السَّفِينَةُ تُبْحِرُ فِي البَحْر', 'sea'],
  ['قَارِبٌ شِرَاعِيّ', 'Sailboat', 'sailboat', 'فِي البَحْر', 'القَارِبُ الشِّرَاعِيُّ يَتَحَرَّكُ بِالرِّيح', 'sea'],
  ['غَوَّاصَة', 'Submarine', 'submarine', 'تَحْتَ المَاء', 'الغَوَّاصَةُ تَسِيرُ تَحْتَ المَاء', 'sea'],
  ['زَوْرَق', 'Motorboat', 'motorboat', 'فِي البَحْر', 'الزَّوْرَقُ سَرِيعٌ فِي المَاء', 'sea'],
  ['طَائِرَة', 'Airplane', 'plane', 'فِي السَّمَاء', 'الطَّائِرَةُ تَطِيرُ فِي السَّمَاء', 'air'],
  ['مِرْوَحِيَّة', 'Helicopter', 'helicopter', 'فِي السَّمَاء', 'المِرْوَحِيَّةُ لَهَا مِرْوَحَةٌ كَبِيرَة', 'air'],
  ['صَارُوخ', 'Rocket', 'rocket', 'إِلَى الفَضَاء', 'الصَّارُوخُ يَذْهَبُ إِلَى الفَضَاء', 'air'],
  ['مِنْطَاد', 'Hot-air Balloon', 'hotair', 'فِي السَّمَاء', 'المِنْطَادُ يَطِيرُ بِالهَوَاءِ السَّاخِن', 'air'],
];
const BY = Object.fromEntries(V.map(v => [v[2], v]));
const GROUP = { land: ['بَرّ', '🚗', '#ff8a1f'], sea: ['بَحْر', '⚓', '#2f7de8'], air: ['جَوّ', '☁️', '#5ec8f2'] };
const firstLetter = w => w.replace(/[ً-ْ]/g, '')[0];
const hue = i => Math.round((i * 360 / 20 * 7 + 200) % 360);

const t3d = (txt, top, side, depth = 8, cls = '') => {
  const sh = [];
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
  ${bubbles(1, 200, 12)}
  <div class="ctop">${['helicopter', 'hotair', 'plane'].map((a, k) => `<div class="ct ct${k}">${art(a)}</div>`).join('')}</div>
  <h1>${t3d('مَرْكَبَاتِي', '#ffd23f', '#e0482c', 12)}<br>${t3d('الجَمِيلَة', '#ffffff', '#2a6fd4', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى وَسَائِلِ النَّقْلِ بِالعَرَبِيَّة</div>
  <div class="cen">My Lovely Vehicles</div>
  <div class="cart">${['bus', 'car', 'firetruck', 'train', 'sailboat'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:210">
  ${bubbles(2, 210)}
  <div class="owner">
    ${art('car', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#2a6fd4', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('rocket', { cls: 'mini' })}${art('submarine', { cls: 'mini' })}${art('bicycle', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:30">
  ${bubbles(3, 30)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#e07b00')}
    <div class="card">
      <p>اسْتَعِدُّوا لِرِحْلَةٍ مُمْتِعَةٍ مَعَ وَسَائِلِ النَّقْل! 🚦</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ المَرْكَبَةِ وَأَشِيرُوا إِلَى صُورَتِهَا.</li>
        <li>اسْأَلُوا طِفْلَكُمْ: أَيْنَ تَسِير؟ فِي البَرِّ أَمْ فِي البَحْرِ أَمْ فِي الجَوّ؟</li>
        <li>عَلِّمُوهُ أَلْوَانَ إِشَارَةِ المُرُورِ وَمَعْنَاهَا.</li>
        <li>شَجِّعُوهُ عَلَى كِتَابَةِ الاسْمِ فَوْقَ النِّقَاط.</li>
        <li>العَبُوا الأَلْعَابَ وَالمَتَاهَة، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('tractor', { cls: 'mini' })}${art('trafficlight', { cls: 'mini' })}${art('ship', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview by group
const ovSec = g => `<div class="ovh" style="--gc:${GROUP[g][2]}">${GROUP[g][1]} ${GROUP[g][0]}</div><div class="ovg">${V.filter(v => v[5] === g).map(v => `<div class="ovc">${art(v[2])}<b>${v[0]}</b></div>`).join('')}</div>`;
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(4, 200)}
  ${title('مَرْكَبَاتُ الكِتَاب', '#2a6fd4')}
  ${ovSec('land')}${ovSec('sea')}${ovSec('air')}
  ${pno(P++)}
</section>`);

// 5–24 ---------- One page per vehicle
V.forEach(([name, en, ill, where, sentence, g], i) => {
  const h = hue(i);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},65%,35%)`, 9, name.length > 9 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="stage">
      <div class="pedestal"></div>
      ${art(ill, { cls: 'ill' })}
      <div class="kind" style="--gc:${GROUP[g][2]}">${GROUP[g][1]}<b>${GROUP[g][0]}</b></div>
    </div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>📍</i><div><small>أَيْنَ تَتَحَرَّك؟</small><b>${where}</b></div></div>
      <div class="chip"><i class="ab">أ ب</i><div><small>الحَرْفُ الأَوَّل</small><b class="fl">${firstLetter(name)}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الاسْم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(name.length > 9 ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Land, sea or air?
const SORT = ['car', 'ship', 'helicopter', 'train', 'submarine', 'hotair', 'tractor', 'sailboat', 'rocket'];
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(40, 180)}
  ${title('بَرٌّ أَمْ بَحْرٌ أَمْ جَوّ؟', '#1d7fa8')}
  <div class="hint">ضَعْ عَلَامَةَ ✓ فِي المُرَبَّعِ الصَّحِيح</div>
  <div class="sort">${SORT.map(a => `<div class="sc">${art(a)}<b>${BY[a][0]}</b><div class="opts">${['بَرّ', 'بَحْر', 'جَوّ'].map(o => `<span><i></i>${o}</span>`).join('')}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Shadow match
const SH = [['train', 'bicycle'], ['helicopter', 'tractor'], ['sailboat', 'train'], ['bicycle', 'helicopter'], ['tractor', 'sailboat']];
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(41, 260)}
  ${title('أَيْنَ ظِلِّي؟', '#6a3fd0')}
  <div class="hint">صِلْ كُلَّ مَرْكَبَةٍ بِظِلِّهَا 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}<b>${BY[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Counting
const COUNT = [['car', 3], ['sailboat', 2], ['helicopter', 4], ['hotair', 5]];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(42, 20)}
  ${title('كَمْ عَدَدُهَا؟', '#e0482c')}
  <div class="hint">عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => art(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 28 ---------- Maze
function maze(cols, rows, seed) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const vis = Array.from({ length: rows }, () => Array(cols).fill(false));
  const walls = { h: Array.from({ length: rows + 1 }, () => Array(cols).fill(true)), v: Array.from({ length: rows }, () => Array(cols + 1).fill(true)) };
  const stack = [[0, cols - 1]];
  vis[0][cols - 1] = true;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && y < rows && x >= 0 && x < cols && !vis[y][x]);
    if (!nb.length) { stack.pop(); continue; }
    const [y, x] = nb[Math.floor(rnd() * nb.length)];
    if (y !== r) walls.h[Math.max(y, r)][c] = false; else walls.v[r][Math.max(x, c)] = false;
    vis[y][x] = true; stack.push([y, x]);
  }
  return walls;
}
const MC = 8, MR = 9, CS = 76;
const W = maze(MC, MR, 7);
let mz = '';
for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (W.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (W.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
pages.push(`
<section class="page plain" style="--h:140">
  ${bubbles(43, 140)}
  ${title('سَاعِدِ السَّيَّارَةَ لِتَصِلَ إِلَى البَيْت', '#1f9d63')}
  <div class="mazebox">
    ${art('car', { cls: 'mzs' })}
    <svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="hsl(140,55%,38%)" stroke-width="9" stroke-linecap="round" fill="none"/></svg>
    ${art('house', { cls: 'mze' })}
  </div>
  ${pno(P++)}
</section>`);

// 29 ---------- Traffic light
pages.push(`
<section class="page plain" style="--h:50">
  ${bubbles(44, 50)}
  ${title('إِشَارَةُ المُرُور', '#c46a00')}
  <div class="hint">تَعَلَّمْ أَلْوَانَ الإِشَارَةِ ثُمَّ لَوِّنِ الإِشَارَةَ الفَارِغَة 🚦</div>
  <div class="tl">
    <div class="tlwrap">${art('trafficlight', { cls: 'tlart', vb: '55 0 90 200' })}</div>
    <div class="tlrows">
      <div class="tlr" style="--c:#ff3b30"><i></i><div><b>أَحْمَر</b><span>قِفْ ✋</span></div></div>
      <div class="tlr" style="--c:#ffc61a"><i></i><div><b>أَصْفَر</b><span>اسْتَعِدّ ⏳</span></div></div>
      <div class="tlr" style="--c:#36c45d"><i></i><div><b>أَخْضَر</b><span>انْطَلِقْ 🚗</span></div></div>
    </div>
    <div class="tlwrap">${art('trafficlight', { cls: 'tlart outline', vb: '55 0 90 200' })}<small>لَوِّنِّي</small></div>
  </div>
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:355">
  ${title('لَوِّنِ المَرْكَبَات', '#c2367a')}
  <div class="colorbox">
    ${art('hotair', { cls: 'outline c1' })}${art('bus', { cls: 'outline c2' })}
    <div class="ref">${art('hotair')}${art('bus')}<small>انْظُرْ وَلَوِّن</small></div>
  </div>
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
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى وَسَائِلِ النَّقْل<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${['car', 'rocket', 'sailboat'].map(a => art(a)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 200, 12)}
  <h2>${t3d('مَرْكَبَاتِي الجَمِيلَة', '#fff', '#2a6fd4', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَرِّفُ طِفْلَكَ عَلَى عِشْرِينَ وَسِيلَةَ نَقْلٍ فِي البَرِّ وَالبَحْرِ وَالجَوّ.</p>
    <ul><li>٢٠ مَرْكَبَةً مَعَ الاسْمِ وَالجُمْلَة</li><li>بَرٌّ أَمْ بَحْرٌ أَمْ جَوّ؟ وَلُعْبَةُ الظِّلَال</li><li>مَتَاهَةٌ وَإِشَارَةُ المُرُور</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn vehicles in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">${['ambulance', 'police', 'motorboat', 'truck', 'taxi'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
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
.pno{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;color:#fff;
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
svg{display:block}
.ttl{position:relative;text-align:center;font-size:58px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,35%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.22),0 16px 26px rgba(40,20,80,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
/* cover */
.cover{--h:200;background:radial-gradient(circle at 50% 35%,#ffffff,#c7ecff 40%,#7cc8f5 72%,#3d8fe0);text-align:center;padding:40px}
.ctop{position:relative;height:210px}
.ct{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,40,80,.3))}.ct svg{width:100%;height:100%}
.ct0{width:190px;height:190px;left:30px;top:20px}.ct1{width:190px;height:190px;left:285px;top:-10px}.ct2{width:190px;height:190px;right:30px;top:20px;transform:rotate(-8deg)}
.cover h1{position:relative;font-size:126px;line-height:1.12}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#1d5fa8;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #a9d4f5,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #2a6fd4;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:360px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,40,80,.28))}.ca svg{width:100%;height:100%}
.ca0{width:210px;height:210px;left:20px;bottom:150px}.ca1{width:230px;height:230px;left:282px;bottom:0}.ca2{width:210px;height:210px;right:20px;bottom:150px}
.ca3{width:200px;height:200px;left:40px;bottom:-14px}.ca4{width:190px;height:190px;right:50px;bottom:-14px}
.back h2{position:relative;font-size:84px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#2a6fd4;font-size:19px;margin-top:8px}
/* owner / note */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:26px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ovh{position:relative;display:inline-block;margin:10px 0 4px;font-size:28px;font-weight:800;color:#fff;padding:0 22px;border-radius:22px;background:var(--gc);box-shadow:0 4px 0 rgba(0,0,0,.2)}
.ovg{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:4px 10px}
.ovc{text-align:center}.ovc svg{width:120px;height:120px;margin:0 auto}
.ovc b{font-size:18px;font-weight:800;background:#fff;padding:0 10px;border-radius:14px;box-shadow:0 3px 0 #c5d8ef;white-space:nowrap}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:88px}.iname .big.long{font-size:72px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,45%);direction:ltr;margin-top:-6px}
.stage{position:relative;height:440px;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:12px;width:440px;height:90px;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 12px 0 hsl(var(--h),45%,62%),0 24px 28px rgba(40,20,80,.25)}
.ill{position:relative;width:460px;height:460px;margin-bottom:40px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.kind{position:absolute;top:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;width:116px;height:116px;border-radius:30px;font-size:44px;
  background:var(--gc);box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 rgba(0,0,0,.25),0 14px 18px rgba(40,20,80,.25)}
.kind b{font-size:26px;font-weight:800;color:#fff;margin-top:-4px}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:34px;font-weight:800;color:hsl(var(--h),60%,32%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#8a80a3}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,38%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}
.trace .solid{fill:hsl(var(--h),70%,48%)}.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.sort{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:18px 16px;margin-top:22px}
.sc{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:28px;padding:6px 8px 12px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:120px;height:120px}.sc>b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,32%);line-height:1.3;white-space:nowrap}
.opts{display:flex;gap:10px;margin-top:6px}.opts span{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:800}
.opts i{width:26px;height:26px;border-radius:7px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:116px;height:116px;margin:0 auto}.mc b{font-size:20px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1}
.shadowimg svg{width:136px;height:136px;margin-top:4px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.mazebox{position:relative;margin:30px auto 0;width:690px;height:820px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.mz{position:absolute;left:45px;top:80px;width:600px;height:676px}
.mzs{position:absolute;right:-10px;top:-10px;width:110px;height:110px}.mze{position:absolute;left:-6px;bottom:-14px;width:110px;height:110px}
.tl{position:relative;display:flex;align-items:center;justify-content:space-between;margin-top:30px;background:#fff;border-radius:40px;padding:30px 20px;height:760px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.tlwrap{text-align:center}.tlart.outline{position:static}.tlwrap small{font-size:24px;font-weight:800;color:hsl(var(--h),55%,35%)}
.tlart{width:200px;height:444px;margin:0 auto;filter:drop-shadow(0 10px 12px rgba(40,20,80,.2))}
.tlart.outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.tlart.outline [filter]{display:none}
.tlrows{flex:1;display:flex;flex-direction:column;gap:60px;align-items:center}
.tlr{display:flex;align-items:center;gap:14px}.tlr i{width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,var(--c) 45%);box-shadow:0 4px 8px rgba(0,0,0,.25)}
.tlr b{display:block;font-size:30px;font-weight:800;color:var(--c);line-height:1.1;filter:brightness(.85)}.tlr span{font-size:30px;font-weight:800}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}.c1{width:440px;height:440px;left:20px;top:10px}.c2{width:520px;height:520px;right:20px;bottom:-20px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.colorbox .outline rect:not([fill^="url"]),.colorbox .outline path:not([fill^="url"]){fill-opacity:0;stroke:#2b2340;stroke-width:1}
.ref{position:absolute;top:18px;right:18px;width:130px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:90px;height:90px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:hsl(var(--h),55%,35%)}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>مركباتي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
