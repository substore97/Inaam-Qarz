// Builds "فضائي الجميل" – a 3D-style Arabic space book for kids – A4 portrait.
// White words always get a dark outline.
const fs = require('fs');
const path = require('path');
const { art } = require('./space-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, kind, sentence, planet order or 0]
const ITEMS = [
  ['الشَّمْس', 'The Sun', 'sunstar', 'نَجْم', 'الشَّمْسُ نَجْمٌ كَبِيرٌ وَحَارّ', 0],
  ['عُطَارِد', 'Mercury', 'mercury', 'كَوْكَب', 'عُطَارِدُ أَقْرَبُ كَوْكَبٍ إِلَى الشَّمْس', 1],
  ['الزُّهَرَة', 'Venus', 'venus', 'كَوْكَب', 'الزُّهَرَةُ أَشَدُّ الكَوَاكِبِ حَرَارَة', 2],
  ['الأَرْض', 'Earth', 'earth', 'كَوْكَب', 'الأَرْضُ بَيْتُنَا الجَمِيل', 3],
  ['المِرِّيخ', 'Mars', 'mars', 'كَوْكَب', 'المِرِّيخُ هُوَ الكَوْكَبُ الأَحْمَر', 4],
  ['المُشْتَرِي', 'Jupiter', 'jupiter', 'كَوْكَب', 'المُشْتَرِي أَكْبَرُ الكَوَاكِب', 5],
  ['زُحَل', 'Saturn', 'saturn', 'كَوْكَب', 'زُحَلُ لَهُ حَلَقَاتٌ جَمِيلَة', 6],
  ['أُورَانُوس', 'Uranus', 'uranus', 'كَوْكَب', 'أُورَانُوسُ يَدُورُ عَلَى جَنْبِه', 7],
  ['نِبْتُون', 'Neptune', 'neptune', 'كَوْكَب', 'نِبْتُونُ أَبْعَدُ الكَوَاكِبِ عَنِ الشَّمْس', 8],
  ['القَمَر', 'The Moon', 'moonball', 'قَمَر', 'القَمَرُ يَدُورُ حَوْلَ الأَرْض', 0],
  ['النُّجُوم', 'Stars', 'stars', 'نُجُوم', 'النُّجُومُ تَلْمَعُ فِي اللَّيْل', 0],
  ['المُذَنَّب', 'Comet', 'comet', 'جِسْمٌ فَضَائِيّ', 'المُذَنَّبُ لَهُ ذَيْلٌ طَوِيل', 0],
  ['الكُوَيْكِب', 'Asteroid', 'asteroid', 'جِسْمٌ فَضَائِيّ', 'الكُوَيْكِبُ صَخْرَةٌ تَدُورُ حَوْلَ الشَّمْس', 0],
  ['المَجَرَّة', 'Galaxy', 'galaxy', 'مَجَرَّة', 'نَعِيشُ فِي مَجَرَّةِ دَرْبِ التَّبَّانَة', 0],
  ['الصَّارُوخ', 'Rocket', 'rocket', 'مَرْكَبَة', 'الصَّارُوخُ يَحْمِلُنَا إِلَى الفَضَاء', 0],
  ['رَائِدُ الفَضَاء', 'Astronaut', 'astronaut', 'إِنْسَان', 'رَائِدُ الفَضَاءِ يَلْبَسُ بَدْلَةً خَاصَّة', 0],
  ['القَمَرُ الصِّنَاعِيّ', 'Satellite', 'satellite', 'آلَة', 'القَمَرُ الصِّنَاعِيُّ يَدُورُ حَوْلَ الأَرْض', 0],
  ['التِّلِسْكُوب', 'Telescope', 'telescope', 'أَدَاة', 'نَرَى النُّجُومَ بِالتِّلِسْكُوب', 0],
  ['المَرْكَبَةُ الجَوَّالَة', 'Rover', 'rover', 'مَرْكَبَة', 'المَرْكَبَةُ الجَوَّالَةُ تَسِيرُ عَلَى المِرِّيخ', 0],
  ['مَحَطَّةُ الفَضَاء', 'Space Station', 'station', 'مَحَطَّة', 'رُوَّادُ الفَضَاءِ يَعِيشُونَ فِي المَحَطَّة', 0],
];
const PLANETS = ITEMS.filter(i => i[5]);
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '').replace(/^ال/, '')[0];
const hue = i => Math.round((i * 360 / 20 * 7 + 230) % 360);

const ring = (c, w = 2.5) => [[-w, 0], [w, 0], [0, -w], [0, w], [-w * .7, -w * .7], [w * .7, -w * .7], [-w * .7, w * .7], [w * .7, w * .7]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(',');
const isWhite = c => /^#f{3}(f{3})?$/i.test(c) || c === 'white';
const t3d = (txt, top, side, depth = 8, cls = '') => {
  const sh = isWhite(top) ? [ring(side, 3)] : [];
  for (let i = 1; i <= depth; i++) sh.push(`0 ${i}px 0 ${side}`);
  sh.push(`0 ${depth + 4}px 14px rgba(20,10,60,.4)`);
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

// maze (same algorithm as the vehicles book)
function maze(cols, rows, seed) {
  let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const vis = Array.from({ length: rows }, () => Array(cols).fill(false));
  const W = { h: Array.from({ length: rows + 1 }, () => Array(cols).fill(true)), v: Array.from({ length: rows }, () => Array(cols + 1).fill(true)) };
  const st = [[0, cols - 1]]; vis[0][cols - 1] = true;
  while (st.length) {
    const [r, c] = st[st.length - 1];
    const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([y, x]) => y >= 0 && y < rows && x >= 0 && x < cols && !vis[y][x]);
    if (!nb.length) { st.pop(); continue; }
    const [y, x] = nb[Math.floor(rnd() * nb.length)];
    if (y !== r) W.h[Math.max(y, r)][c] = false; else W.v[r][Math.max(x, c)] = false;
    vis[y][x] = true; st.push([y, x]);
  }
  return W;
}

const pages = [];
let P = 1;

// 1 ---------- Cover
pages.push(`
<section class="page cover">
  <div class="starsbg"></div>
  <div class="ca cs0">${art('saturn')}</div><div class="ca cs1">${art('earth')}</div><div class="ca cs2">${art('comet')}</div>
  <h1>${t3d('فَضَائِي', '#ffd23f', '#c46a00', 12)}<br>${t3d('الجَمِيل', '#ffffff', '#5a2db8', 12)}</h1>
  <div class="csub">رِحْلَةٌ مُمْتِعَةٌ بَيْنَ الكَوَاكِبِ وَالنُّجُوم</div>
  <div class="cen">My Lovely Space</div>
  <div class="ca cs3">${art('rocket')}</div><div class="ca cs4">${art('astronaut')}</div><div class="ca cs5">${art('moonball')}</div><div class="ca cs6">${art('mars')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:240">
  ${bubbles(2, 240)}
  <div class="owner">
    ${art('astronaut', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#4a3fd0', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('earth', { cls: 'mini' })}${art('rocket', { cls: 'mini' })}${art('stars', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:265">
  ${bubbles(3, 265)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#6a3fd0')}
    <div class="card">
      <p>هَيَّا نَنْطَلِقُ فِي رِحْلَةٍ إِلَى الفَضَاء! 🚀</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ الكَوْكَبِ أَوِ النَّجْمِ وَأَشِيرُوا إِلَى صُورَتِه.</li>
        <li>عُدُّوا الكَوَاكِبَ الثَّمَانِيَةَ بِالتَّرْتِيبِ مِنَ الشَّمْس.</li>
        <li>انْظُرُوا إِلَى السَّمَاءِ لَيْلًا وَابْحَثُوا عَنِ القَمَرِ وَالنُّجُوم.</li>
        <li>شَجِّعُوا طِفْلَكُمْ عَلَى كِتَابَةِ الاسْمِ وَطَرْحِ الأَسْئِلَة.</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('saturn', { cls: 'mini' })}${art('telescope', { cls: 'mini' })}${art('moonball', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:230">
  ${bubbles(4, 230)}
  ${title('فِي الفَضَاء', '#3a3fb8')}
  <div class="ovg">${ITEMS.map(i => `<div class="ovc">${art(i[2])}<b>${i[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–24 ---------- One page per item
ITEMS.forEach(([name, en, ill, kind, sentence, order], i) => {
  const h = hue(i), long = name.length > 11;
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,30%)`, 9, long ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="sky"><div class="starsbg"></div>${art(ill, { cls: 'ill' })}${order ? `<div class="order"><small class="wo">الكَوْكَب</small><b>${AR(order)}</b></div>` : ''}</div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>🔭</i><div><small>مَا هُوَ؟</small><b>${kind}</b></div></div>
      <div class="chip"><i class="ab wo">أ ب</i><div><small>الحَرْفُ الأَوَّل</small><b class="fl">${firstLetter(name)}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الاسْم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(long ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- The solar system
pages.push(`
<section class="page plain" style="--h:235">
  ${bubbles(40, 235)}
  ${title('المَجْمُوعَةُ الشَّمْسِيَّة', '#3a3fb8')}
  <div class="hint">ثَمَانِيَةُ كَوَاكِبَ تَدُورُ حَوْلَ الشَّمْس ☀️</div>
  <div class="solar"><div class="starsbg"></div>
    <div class="sunbig">${art('sunstar')}</div>
    <div class="orbit">${PLANETS.map(p => `<div class="pl">${art(p[2])}<b>${AR(p[5])}. ${p[0]}</b></div>`).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);

// 26 ---------- Order the planets
const SHUF = ['mars', 'neptune', 'earth', 'saturn', 'mercury', 'jupiter', 'uranus', 'venus'];
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(41, 200)}
  ${title('رَتِّبِ الكَوَاكِب', '#1d7fa8')}
  <div class="hint">اكْتُبْ رَقْمَ كُلِّ كَوْكَبٍ حَسَبَ بُعْدِهِ عَنِ الشَّمْس (١ - ٨) 🔢</div>
  <div class="ordg">${SHUF.map(a => `<div class="oc">${art(a)}<b>${BY[a][0]}</b><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Shadow match
const SH = [['rocket', 'saturn'], ['astronaut', 'telescope'], ['satellite', 'rocket'], ['telescope', 'astronaut'], ['saturn', 'satellite']];
pages.push(`
<section class="page plain" style="--h:265">
  ${bubbles(42, 265)}
  ${title('أَيْنَ ظِلِّي؟', '#6a3fd0')}
  <div class="hint">صِلْ كُلَّ صُورَةٍ بِظِلِّهَا 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}<b>${BY[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 28 ---------- Maze: rocket to the moon
const MC = 8, MR = 9, CS = 76, MW = maze(MC, MR, 11);
let mz = '';
for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (MW.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (MW.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
pages.push(`
<section class="page plain" style="--h:220">
  ${bubbles(43, 220)}
  ${title('سَاعِدِ الصَّارُوخَ لِيَصِلَ إِلَى القَمَر', '#2a6fd4')}
  <div class="mazebox"><div class="starsbg"></div>
    ${art('rocket', { cls: 'mzs' })}
    <svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="#ffd23f" stroke-width="9" stroke-linecap="round" fill="none"/></svg>
    ${art('moonball', { cls: 'mze' })}
  </div>
  ${pno(P++)}
</section>`);

// 29 ---------- Draw yourself as an astronaut
pages.push(`
<section class="page plain" style="--h:250">
  ${bubbles(44, 250)}
  ${title('أَنَا رَائِدُ فَضَاء!', '#4a3fd0')}
  <div class="hint">ارْسُمْ وَجْهَكَ دَاخِلَ الخُوذَة 🧑‍🚀</div>
  <div class="helmet"><div class="visor"></div></div><div class="suit"><i></i></div>
  <div class="todayrow"><span>اسْمِي: ....................</span></div>
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:300">
  ${title('لَوِّنِ الفَضَاء', '#9b3fd0')}
  <div class="colorbox">${[['saturn', 'c1'], ['rocket', 'c2'], ['astronaut', 'c3']].map(([a, c]) => art(a, { cls: 'outline ' + c })).join('')}
    <div class="ref">${['saturn', 'rocket', 'astronaut'].map(a => art(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
  ${pno(P++)}
</section>`);

// 31 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِرَائِدِ / لِرَائِدَةِ الفَضَاءِ الصَّغِير</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى الكَوَاكِبِ وَالنُّجُوم<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${art('rocket')}${art('earth')}${art('stars')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  <div class="starsbg"></div>
  <h2>${t3d('فَضَائِي الجَمِيل', '#fff', '#5a2db8', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يَأْخُذُ طِفْلَكَ فِي رِحْلَةٍ إِلَى الفَضَاء.</p>
    <ul><li>الشَّمْسُ وَالكَوَاكِبُ الثَّمَانِيَةُ وَالقَمَر</li><li>النُّجُومُ وَالمُذَنَّبُ وَالمَجَرَّة</li><li>الصَّارُوخُ وَرَائِدُ الفَضَاءِ وَالمَحَطَّة</li><li>أَلْعَابٌ وَمَتَاهَةٌ وَصَفْحَةُ تَلْوِينٍ وَشَهَادَة</li></ul>
    <p class="en2">A joyful 3D picture book about space in Arabic · Ages 3–7</p>
  </div>
  <div class="ca bs0">${art('jupiter')}</div><div class="ca bs1">${art('satellite')}</div><div class="ca bs2">${art('uranus')}</div><div class="ca bs3">${art('rover')}</div>
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
.starsbg{position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background-image:radial-gradient(2px 2px at 8% 12%,#fff,transparent),radial-gradient(2px 2px at 22% 70%,#fff,transparent),radial-gradient(3px 3px at 40% 30%,#fff6b0,transparent),
  radial-gradient(2px 2px at 63% 84%,#fff,transparent),radial-gradient(2px 2px at 78% 18%,#fff,transparent),radial-gradient(3px 3px at 90% 60%,#fff6b0,transparent),
  radial-gradient(2px 2px at 52% 52%,#fff,transparent),radial-gradient(2px 2px at 14% 44%,#fff,transparent),radial-gradient(2px 2px at 86% 90%,#fff,transparent),radial-gradient(2px 2px at 33% 92%,#fff,transparent)}
.t3d{font-family:Lalezar,Baloo;display:inline-block;line-height:1.15}
.wo{text-shadow:${ring('rgba(20,10,60,.8)', 1.6)}}
.pno{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;color:#fff;
  text-shadow:${ring('hsl(var(--h),60%,25%)', 1.4)};
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
svg{display:block}
.ttl{position:relative;text-align:center;font-size:58px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,30%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.22),0 16px 26px rgba(40,20,80,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
/* cover */
.cover{background:radial-gradient(circle at 50% 40%,#3b3f9e,#1d1f5c 55%,#0d0f33);text-align:center;padding:40px}
.cover h1{position:relative;font-size:130px;line-height:1.1;margin-top:250px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#3a2a9e;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #b8a8ff,0 12px 20px rgba(0,0,0,.3)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:${ring('#5a2db8', 1.6)},0 3px 0 #5a2db8;direction:ltr}
.ca{position:absolute;filter:drop-shadow(0 10px 14px rgba(0,0,0,.4))}.ca svg{width:100%;height:100%}
.cs0{width:260px;height:260px;left:20px;top:20px}.cs1{width:200px;height:200px;right:40px;top:40px}.cs2{width:150px;height:150px;left:300px;top:20px}
.cs3{width:230px;height:230px;left:20px;bottom:30px}.cs4{width:240px;height:240px;left:280px;bottom:10px}.cs5{width:170px;height:170px;right:30px;bottom:60px}.cs6{width:100px;height:100px;right:200px;bottom:230px}
.back h2{position:relative;font-size:88px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#5a2db8;font-size:19px;margin-top:8px}
.bs0{width:200px;height:200px;left:20px;bottom:30px}.bs1{width:180px;height:180px;left:240px;bottom:80px}.bs2{width:160px;height:160px;right:220px;bottom:10px}.bs3{width:190px;height:190px;right:20px;bottom:30px}
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
.ovg{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}
.ovc{text-align:center;background:radial-gradient(circle at 50% 40%,#3b3f9e,#1d1f5c);border-radius:24px;padding:6px 0 8px;box-shadow:0 5px 0 #13154a,0 10px 14px rgba(20,10,60,.25)}
.ovc svg{width:122px;height:122px;margin:0 auto}
.ovc b{font-size:18px;font-weight:800;color:#fff;white-space:nowrap;text-shadow:${ring('#13154a', 1.6)}}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:88px}.iname .big.long{font-size:66px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,35%);direction:ltr;margin-top:-6px}
.sky{position:relative;height:460px;border-radius:40px;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#3b3f9e,#1d1f5c 60%,#0d0f33);
  box-shadow:inset 0 0 0 6px rgba(255,255,255,.25),0 10px 0 hsl(var(--h),45%,60%),0 20px 26px rgba(20,10,60,.3)}
.ill{position:relative;width:420px;height:420px;filter:drop-shadow(0 10px 16px rgba(0,0,0,.4))}
.order{position:absolute;top:18px;right:18px;width:110px;height:110px;border-radius:28px;background:linear-gradient(150deg,#ffd23f,#ff9f1c);display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 0 #c46a00}
.order small{font-size:17px;font-weight:800;color:#fff}.order b{font-size:52px;font-weight:800;color:#7a3a00;line-height:1}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:33px;font-weight:800;color:hsl(var(--h),60%,28%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#7a6f92}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,32%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#8a80a3}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}.trace text.sm{font-size:40px}
.trace .solid{fill:hsl(var(--h),70%,44%)}.trace .dash{fill:#dcd5e8;stroke:none}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.solar{position:relative;margin-top:20px;height:840px;border-radius:40px;background:radial-gradient(circle at 50% 10%,#3b3f9e,#1d1f5c 55%,#0d0f33);overflow:hidden;box-shadow:0 10px 0 #13154a}
.sunbig{position:absolute;left:50%;top:-120px;transform:translateX(-50%);width:300px;height:300px}.sunbig svg{width:100%;height:100%}
.orbit{position:absolute;left:0;right:0;top:200px;display:grid;grid-template-columns:1fr 1fr;gap:6px 20px;padding:0 30px}
.pl{display:flex;align-items:center;gap:12px}.pl svg{width:130px;height:130px;flex:none}
.pl b{font-size:28px;font-weight:800;color:#fff;text-shadow:${ring('#13154a', 2)}}
.ordg{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:26px}
.oc{display:flex;align-items:center;gap:12px;background:#1d1f5c;border-radius:28px;padding:10px 16px;box-shadow:0 6px 0 #13154a}
.oc svg{width:120px;height:120px}.oc b{flex:1;font-size:26px;font-weight:800;color:#fff;text-shadow:${ring('#13154a', 1.8)}}
.oc i{width:76px;height:76px;border-radius:50%;background:#fff;border:4px dashed #ffd23f}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:116px;height:116px;margin:0 auto}.mc b{font-size:21px;font-weight:800;color:hsl(var(--h),55%,30%);line-height:1}
.shadowimg svg{width:136px;height:136px;margin-top:4px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.mazebox{position:relative;margin:30px auto 0;width:690px;height:820px;border-radius:40px;background:radial-gradient(circle at 50% 45%,#3b3f9e,#1d1f5c 60%,#0d0f33);box-shadow:0 8px 0 #13154a,0 16px 24px rgba(20,10,60,.3)}
.mz{position:absolute;left:45px;top:80px;width:600px;height:676px}
.mzs{position:absolute;right:-6px;top:-14px;width:110px;height:110px}.mze{position:absolute;left:-6px;bottom:-14px;width:110px;height:110px}
.helmet{position:relative;z-index:1;margin:30px auto 0;width:560px;height:560px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff,#e6ebf3 60%,#b9c3d4);box-shadow:0 14px 0 #9aa6bb,0 26px 36px rgba(20,10,60,.3)}
.visor{position:absolute;left:70px;top:80px;width:420px;height:380px;border-radius:50%;background:#fff;border:10px solid #7fb8dd;box-shadow:inset 0 0 30px rgba(79,168,255,.25)}
.suit{position:relative;z-index:0;margin:-60px auto 0;width:620px;height:200px;border-radius:120px 120px 30px 30px;background:linear-gradient(#f4f6fb,#d5dbe6);box-shadow:0 10px 0 #9aa6bb}
.suit i{position:absolute;left:50%;top:60px;transform:translateX(-50%);width:120px;height:70px;border-radius:16px;background:#4fa8ff;box-shadow:inset 0 -6px 0 #2f6fe0}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:30px;font-size:30px;font-weight:800;color:hsl(var(--h),55%,30%)}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}
.c1{width:440px;height:440px;left:20px;top:40px}.c2{width:340px;height:340px;left:20px;bottom:20px}.c3{width:320px;height:320px;right:40px;bottom:40px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.colorbox .outline [stroke="#c9a46a"],.colorbox .outline [stroke="#e8c88a"]{stroke:#2b2340;stroke-width:1.5;fill:none}
.ref{position:absolute;top:18px;right:18px;width:120px;text-align:center;border-radius:24px;background:#1d1f5c;padding:6px}
.ref svg{width:80px;height:80px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:#fff;text-shadow:${ring('#13154a', 1.4)}}
/* certificate */
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d);padding:40px}
.frame{position:relative;height:100%;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:60px;box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:230px;height:230px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:88px}
.cp{font-size:30px;font-weight:700;color:#8a5200;margin-top:14px;line-height:1.7}
.certart{display:flex;justify-content:center;gap:10px;margin-top:10px}.certart svg{width:150px;height:150px}
.sig{display:flex;justify-content:space-around;margin-top:24px;font-size:22px;font-weight:700;color:#8a5200}
.cert .pno{bottom:56px}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>فضائي الجميل</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
