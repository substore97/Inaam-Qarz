// Builds "أرقامي الجميلة" – a 3D-style Arabic numbers book (1–20) for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art } = require('../../animals-book/src/animals-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [arabic word, english, object art]
const NUMS = [
  ['وَاحِد', 'One', 'sun'], ['اِثْنَان', 'Two', 'cat'], ['ثَلَاثَة', 'Three', 'duck'], ['أَرْبَعَة', 'Four', 'apple'],
  ['خَمْسَة', 'Five', 'fish'], ['سِتَّة', 'Six', 'strawberry'], ['سَبْعَة', 'Seven', 'bee'], ['ثَمَانِيَة', 'Eight', 'flower'],
  ['تِسْعَة', 'Nine', 'lemon'], ['عَشَرَة', 'Ten', 'grapes'],
  ['أَحَدَ عَشَرَ', 'Eleven', 'strawberry'], ['اِثْنَا عَشَرَ', 'Twelve', 'carrot'], ['ثَلَاثَةَ عَشَرَ', 'Thirteen', 'butterfly'],
  ['أَرْبَعَةَ عَشَرَ', 'Fourteen', 'lemon'], ['خَمْسَةَ عَشَرَ', 'Fifteen', 'fish'], ['سِتَّةَ عَشَرَ', 'Sixteen', 'apple'],
  ['سَبْعَةَ عَشَرَ', 'Seventeen', 'chicken'], ['ثَمَانِيَةَ عَشَرَ', 'Eighteen', 'flower'], ['تِسْعَةَ عَشَرَ', 'Nineteen', 'bee'],
  ['عِشْرُون', 'Twenty', 'duck'],
];
const hue = i => Math.round((i * 360 / 20 * 7 + 20) % 360);

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
const tile = (n, h, cls = '') => `<div class="ntile ${cls}" style="--h:${h}">${t3d(AR(n), '#fff', `hsl(${h},70%,36%)`, 6)}</div>`;
const objSize = n => n === 1 ? 300 : n === 2 ? 250 : n === 3 ? 205 : n === 4 ? 175 : n <= 6 ? 165 : n <= 8 ? 150 : n <= 10 ? 125 : n <= 15 ? 110 : 88;
const group = (a, n, s) => `<div class="grp">${Array.from({ length: n }, () => art(a)).join('')}</div>`.replace('class="grp"', `class="grp" style="--s:${s}px"`);

const pages = [];
let P = 1;

// 1 ---------- Cover
const BAL = ['#ff4757', '#ffd23f', '#4fa8ff', '#4cd964', '#b05cff'];
pages.push(`
<section class="page cover">
  ${bubbles(1, 30, 12)}
  <div class="ballons">${BAL.map((c, k) => `<div class="bl b${k}">${art('balloon', { color: c, vb: '25 0 150 212' })}<span>${t3d(AR(k + 1), '#fff', 'rgba(0,0,0,.3)', 3)}</span></div>`).join('')}</div>
  <h1>${t3d('أَرْقَامِي', '#ffffff', '#e0482c', 12)}<br>${t3d('الجَمِيلَة', '#ffd23f', '#c46a00', 12)}</h1>
  <div class="csub">أَتَعَلَّمُ الأَرْقَامَ مِنْ ١ إِلَى ٢٠</div>
  <div class="cen">My Beautiful Numbers</div>
  <div class="cart">${['bear', 'rabbit', 'duck', 'apple', 'bee', 'fish'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page (author credit under the heading)
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(2, 20)}
  <div class="owner">
    ${art('penguin', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#e0482c', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('sun', { cls: 'mini' })}${art('cake', { cls: 'mini' })}${art('gift', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(3, 260)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#6a3fd0')}
    <div class="card">
      <p>أَهْلًا بِكُمْ فِي رِحْلَةِ الأَرْقَامِ المُمْتِعَة! 🌟</p>
      <ul>
        <li>اقْرَؤُوا الرَّقَمَ وَاسْمَهُ بِصَوْتٍ وَاضِح.</li>
        <li>عُدُّوا الصُّوَرَ مَعَ طِفْلِكُمْ بِالإِصْبَعِ وَاحِدَةً وَاحِدَة.</li>
        <li>لَوِّنُوا مَعًا دَوَائِرَ العَدِّ لِيَرَى الطِّفْلُ الكَمِّيَّة.</li>
        <li>شَجِّعُوهُ عَلَى كِتَابَةِ الرَّقَمِ فَوْقَ النِّقَاط.</li>
        <li>العَبُوا أَلْعَابَ آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ شَهَادَةَ التَّقْدِير!</li>
      </ul>
    </div>
    <div class="row3">${art('rocket', { cls: 'mini' })}${art('balloon', { cls: 'mini', color: '#ff6fae', vb: '25 0 150 212' })}${art('moon', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview 1–20
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(4, 200)}
  ${title('الأَرْقَامُ مِنْ ١ إِلَى ٢٠', '#1d7fa8')}
  <div class="ov">${NUMS.map((n, i) => `<div class="ovc">${tile(i + 1, hue(i))}<b>${n[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–24 ---------- One page per number
NUMS.forEach(([word, en, obj], i) => {
  const n = i + 1, h = hue(i);
  const frame = Array.from({ length: 20 }, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('');
  const trace = [0, 1, 2, 3, 4].map(k => `<text x="${640 - k * 135}" y="80" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${AR(n)}</text>`).join('');
  pages.push(`
  <section class="page num" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="top">
      ${tile(n, h, 'big')}
      <div class="words">
        <div class="wpill">${t3d(word, `hsl(${h},75%,45%)`, `hsl(${h},60%,30%)`, 5)}</div>
        <div class="en">${n} · ${en}</div>
        <div class="count">عُدَّ مَعِي! 👆</div>
      </div>
    </div>
    <div class="objs">${group(obj, n, objSize(n))}</div>
    <div class="frame10">${frame}</div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الرَّقَم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="84" x2="690" y2="84" class="base"/>${trace}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Count and match
const CM = [['apple', 3, 5], ['bee', 5, 2], ['duck', 2, 4], ['fish', 4, 1], ['sun', 1, 3]];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(40, 20)}
  ${title('عُدَّ وَصِلْ', '#e0482c')}
  <div class="hint">عُدَّ الصُّوَرَ ثُمَّ صِلْهَا بِالرَّقَمِ الصَّحِيح ✏️</div>
  <div class="match">${CM.map(([a, k, r], j) => `<div class="mrow"><div class="mc wide">${group(a, k, k > 3 ? 62 : 80)}</div><i class="dot"></i><i class="gap"></i><i class="dot"></i>${tile(r, hue(j * 3), 'mid')}</div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Colour the right amount
const CL = [[2, 'apple'], [4, 'strawberry'], [3, 'lemon'], [5, 'flower']];
pages.push(`
<section class="page plain" style="--h:320">
  ${bubbles(41, 320)}
  ${title('لَوِّنِ العَدَدَ المَطْلُوب', '#c2367a')}
  <div class="hint">انْظُرْ إِلَى الرَّقَمِ وَلَوِّنْ بِعَدَدِهِ فَقَط 🖍️</div>
  ${CL.map(([n, a], j) => `<div class="crow">${tile(n, hue(j * 5 + 2), 'mid')}<div class="cimgs outline">${Array.from({ length: 7 }, () => art(a)).join('')}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 27 ---------- Which is more?
const MORE = [['rabbit', 2, 'rabbit', 4], ['apple', 5, 'apple', 3], ['fish', 1, 'fish', 3], ['bee', 4, 'bee', 2]];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(42, 150)}
  ${title('أَيُّهُمَا أَكْثَر؟', '#1f9d63')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ المَجْمُوعَةِ الأَكْثَر ⭕</div>
  ${MORE.map(([a, x, b, y]) => `<div class="cmp"><div class="box">${group(a, x, 74)}</div><div class="box">${group(b, y, 74)}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 28 ---------- Missing numbers
const TRAINS = [[1, 2, 0, 4, 5], [6, 0, 8, 0, 10], [11, 12, 0, 14, 0], [0, 17, 18, 0, 20]];
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(43, 45)}
  ${title('أَكْمِلِ الأَرْقَام', '#c46a00')}
  <div class="hint">اكْتُبِ الرَّقَمَ النَّاقِصَ فِي كُلِّ قِطَار 🚂</div>
  ${TRAINS.map((t, j) => `<div class="train">${t.map((v, k) => v ? tile(v, hue(j * 5 + k), 'mid') : '<div class="ntile mid empty"></div>').join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 29 ---------- Dot to dot (star with 10 points)
const pts = Array.from({ length: 10 }, (_, k) => {
  const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 120 : 270;
  return [350 + r * Math.cos(a), 330 + r * Math.sin(a)];
});
pages.push(`
<section class="page plain" style="--h:220">
  ${bubbles(44, 220)}
  ${title('صِلِ النِّقَاطَ بِالتَّرْتِيب', '#2a6fd4')}
  <div class="hint">ابْدَأْ مِنْ ١ إِلَى ١٠ ثُمَّ ارْجِعْ إِلَى ١ ... مَاذَا ظَهَرَ؟ ⭐</div>
  <div class="dots"><svg viewBox="0 0 700 640">
    <path d="M${pts.map(p => p.map(v => v.toFixed(0)).join(' ')).join(' L')} Z" fill="none" stroke="#d9d3ea" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>
    ${pts.map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="11" fill="hsl(220,70%,52%)"/><text x="${x + (x >= 350 ? 22 : -22)}" y="${y + 10}" text-anchor="middle" class="dn">${AR(k + 1)}</text>`).join('')}
  </svg>${art('rabbit', { cls: 'dart' })}</div>
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring: number 3 with three ducks
pages.push(`
<section class="page plain" style="--h:50">
  ${title('لَوِّنِ الرَّقَمَ ٣', '#c46a00')}
  <div class="colorbox">
    <svg class="bignum" viewBox="0 0 400 420"><text x="200" y="380" text-anchor="middle">${AR(3)}</text></svg>
    <div class="cimgs outline big">${art('duck')}${art('duck')}${art('duck')}</div>
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
    <p class="cp">لِأَنَّهُ تَعَلَّمَ الأَرْقَامَ مِنْ ١ إِلَى ٢٠<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${['#ff4757', '#4fa8ff', '#4cd964'].map(c => art('balloon', { color: c, vb: '25 0 150 212' })).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 30, 12)}
  <h2>${t3d('أَرْقَامِي الجَمِيلَة', '#fff', '#e0482c', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَلِّمُ طِفْلَكَ الأَرْقَامَ العَرَبِيَّةَ مِنْ وَاحِدٍ إِلَى عِشْرِين.</p>
    <ul><li>٢٠ رَقَمًا مَعَ الاسْمِ وَالعَدّ</li><li>دَوَائِرُ العَدِّ وَتَمَارِينُ الكِتَابَة</li><li>أَلْعَابُ التَّوْصِيلِ وَالمُقَارَنَة</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn Arabic numbers 1–20 · Ages 3–7</p>
  </div>
  <div class="cart small">${['strawberry', 'cat', 'grapes', 'chicken', 'lemon', 'owl'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
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
.ttl{position:relative;text-align:center;font-size:62px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,35%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.22),0 16px 26px rgba(40,20,80,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
.ntile{width:110px;height:110px;flex:none;border-radius:28px;display:flex;align-items:center;justify-content:center;font-size:76px;
  background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,52%));box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 hsl(var(--h),65%,36%),0 14px 16px rgba(40,20,80,.25)}
.ntile .t3d{margin-top:14px}
.ntile.big{width:270px;height:270px;border-radius:46px;font-size:200px;box-shadow:inset 0 8px 0 rgba(255,255,255,.35),inset 0 -12px 0 rgba(0,0,0,.15),0 14px 0 hsl(var(--h),65%,36%),0 26px 30px rgba(40,20,80,.3)}
.ntile.big .t3d{margin-top:34px}
.ntile.mid{width:104px;height:104px;font-size:66px}
.ntile.empty{background:#fff;border:5px dashed hsl(var(--h),60%,60%);box-shadow:0 8px 0 rgba(0,0,0,.06)}
.grp{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:6px}
.grp svg{width:var(--s);height:var(--s);filter:drop-shadow(0 5px 6px rgba(40,20,80,.15))}
.outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:2.2 !important}
.outline [filter]{display:none}
/* cover */
.cover{--h:30;background:radial-gradient(circle at 50% 38%,#fff6d6,#ffc9a8 45%,#ff8fa3 80%,#e85d8a);text-align:center;padding:40px}
.ballons{position:relative;height:250px;margin-top:10px}
.ballons .bl{position:absolute;width:120px;height:170px}.ballons svg{width:100%;height:100%}
.ballons span{position:absolute;top:30px;left:0;right:0;font-size:60px}
.b0{left:30px;top:40px;transform:rotate(-12deg)}.b1{left:170px;top:0}.b2{left:315px;top:30px;transform:rotate(4deg)}.b3{left:460px;top:0}.b4{left:590px;top:40px;transform:rotate(12deg)}
.cover h1{position:relative;font-size:130px;line-height:1.1}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:32px;font-weight:800;color:#c2364f;background:#fff;padding:2px 30px;border-radius:30px;box-shadow:0 6px 0 #ffc2c9,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #c2364f;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:330px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(80,20,40,.28))}.ca svg{width:100%;height:100%}
.ca0{width:230px;height:230px;left:280px;bottom:20px}.ca1{width:190px;height:190px;left:40px;bottom:30px}.ca2{width:180px;height:180px;right:40px;bottom:30px}
.ca3{width:130px;height:130px;left:190px;bottom:170px}.ca4{width:130px;height:130px;right:180px;bottom:180px}.ca5{width:130px;height:130px;left:-10px;bottom:200px}
.back h2{position:relative;font-size:84px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:28px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#c2364f;font-size:19px;margin-top:8px}
/* owner */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:27px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ov{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:18px 14px;margin-top:24px}
.ovc{display:flex;flex-direction:column;align-items:center;gap:10px}.ovc b{font-size:21px;font-weight:800;color:#1d5f80;background:#fff;padding:0 12px;border-radius:16px;box-shadow:0 3px 0 #bfe0f0}
/* number page */
.num{display:flex;flex-direction:column;gap:18px}
.top{position:relative;display:flex;align-items:center;gap:30px;height:300px}
.words{flex:1;text-align:center}
.wpill{display:inline-block;background:#fff;border-radius:50px;padding:6px 40px;box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.wpill .t3d{font-family:Baloo;font-weight:800;font-size:66px;line-height:1.5}
.words .en{font-family:Fredoka;font-weight:600;font-size:30px;color:hsl(var(--h),45%,45%);direction:ltr;margin-top:14px}
.count{display:inline-block;margin-top:12px;font-size:26px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);padding:0 22px;border-radius:22px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.objs{position:relative;height:370px;border-radius:36px;background:rgba(255,255,255,.7);display:flex;align-items:center;justify-content:center;padding:10px;
  box-shadow:inset 0 0 0 4px rgba(255,255,255,.8),0 8px 0 hsl(var(--h),50%,78%),0 14px 20px rgba(40,20,80,.1)}
.frame10{position:relative;margin:0 auto;display:grid;grid-template-columns:repeat(10,1fr);gap:8px;padding:12px 16px;background:#fff;border-radius:24px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.frame10 i{width:46px;height:46px;border-radius:50%;border:3px dashed hsl(var(--h),40%,78%)}
.frame10 i:nth-child(5n){margin-left:6px}
.frame10 i.on{border:none;background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--h),90%,65%) 35%,hsl(var(--h),75%,45%));box-shadow:0 4px 6px rgba(40,20,80,.25)}
.trace{position:relative;margin:0 auto;width:690px;height:120px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:84px}
.trace .solid{fill:hsl(var(--h),70%,48%)}.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:22px}
.mrow{display:flex;align-items:center}
.mc{width:190px;height:150px;border-radius:28px;background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc.wide{width:300px;height:140px;padding:6px}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 12px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.crow{position:relative;display:flex;align-items:center;gap:16px;margin-top:30px;background:rgba(255,255,255,.8);border-radius:34px;padding:16px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:76px;height:76px}
.cmp{position:relative;display:flex;gap:24px;margin-top:28px}
.box{flex:1;height:170px;background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;padding:8px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.train{position:relative;display:flex;justify-content:center;gap:16px;margin-top:40px;padding:22px 10px;background:rgba(255,255,255,.6);border-radius:36px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.dots{position:relative;margin:20px auto 0;width:700px;height:760px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.dots svg{width:700px;height:640px}.dn{font-family:Baloo;font-weight:800;font-size:34px;fill:#2b2340}
.dart{position:absolute;width:150px !important;height:150px;left:20px;bottom:10px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.bignum{width:420px;height:440px;margin:20px auto 0}.bignum text{font-family:Lalezar;font-size:520px;fill:#fff;stroke:#2b2340;stroke-width:6}
.cimgs.big svg{width:200px;height:200px}
/* certificate */
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d);padding:40px}
.frame{position:relative;height:100%;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:60px;box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:230px;height:230px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:88px}
.cp{font-size:31px;font-weight:700;color:#8a5200;margin-top:14px;line-height:1.7}
.certart{display:flex;justify-content:center;gap:20px;margin-top:10px}.certart svg{width:110px;height:155px}
.sig{display:flex;justify-content:space-around;margin-top:24px;font-size:22px;font-weight:700;color:#8a5200}
.cert .pno{bottom:56px}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أرقامي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
