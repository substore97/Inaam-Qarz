// Builds "حروفي الجميلة" – a 3D-style Arabic alphabet book for kids – as HTML, then PDF.
const fs = require('fs');
const path = require('path');
const { art } = require('./art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, 'fonts', f);
const AR_DIGITS = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const TATWEEL = 'ـ';

const LETTERS = [
  ['ا', 'أَلِف', 'أَرْنَب', 'Rabbit', 'rabbit', 0],
  ['ب', 'بَاء', 'بَطَّة', 'Duck', 'duck', 1],
  ['ت', 'تَاء', 'تُفَّاحَة', 'Apple', 'apple', 1],
  ['ث', 'ثَاء', 'ثَلْج', 'Snow', 'snowman', 1],
  ['ج', 'جِيم', 'جَزَرَة', 'Carrot', 'carrot', 1],
  ['ح', 'حَاء', 'حُوت', 'Whale', 'whale', 1],
  ['خ', 'خَاء', 'خَرُوف', 'Sheep', 'sheep', 1],
  ['د', 'دَال', 'دُبّ', 'Bear', 'bear', 0],
  ['ذ', 'ذَال', 'ذُرَة', 'Corn', 'corn', 0],
  ['ر', 'رَاء', 'رُمَّانَة', 'Pomegranate', 'pomegranate', 0],
  ['ز', 'زَاي', 'زَهْرَة', 'Flower', 'flower', 0],
  ['س', 'سِين', 'سَمَكَة', 'Fish', 'fish', 1],
  ['ش', 'شِين', 'شَمْس', 'Sun', 'sun', 1],
  ['ص', 'صَاد', 'صَارُوخ', 'Rocket', 'rocket', 1],
  ['ض', 'ضَاد', 'ضِفْدَع', 'Frog', 'frog', 1],
  ['ط', 'طَاء', 'طَائِرَة', 'Airplane', 'plane', 1],
  ['ظ', 'ظَاء', 'ظَرْف', 'Envelope', 'envelope', 1],
  ['ع', 'عَيْن', 'عِنَب', 'Grapes', 'grapes', 1],
  ['غ', 'غَيْن', 'غَيْمَة', 'Cloud', 'cloud', 1],
  ['ف', 'فَاء', 'فَرَاوِلَة', 'Strawberry', 'strawberry', 1],
  ['ق', 'قَاف', 'قَمَر', 'Moon', 'moon', 1],
  ['ك', 'كَاف', 'كَعْكَة', 'Cake', 'cake', 1],
  ['ل', 'لَام', 'لَيْمُون', 'Lemon', 'lemon', 1],
  ['م', 'مِيم', 'مَوْزَة', 'Banana', 'banana', 1],
  ['ن', 'نُون', 'نَحْلَة', 'Bee', 'bee', 1],
  ['ه', 'هَاء', 'هَدِيَّة', 'Gift', 'gift', 1],
  ['و', 'وَاو', 'وَرْدَة', 'Rose', 'rose', 0],
  ['ي', 'يَاء', 'يَقْطِين', 'Pumpkin', 'pumpkin', 1],
];

const hue = i => Math.round((i * 360 / 28 * 5) % 360); // spread hues so neighbours differ
const t3d = (txt, top, side, depth = 8, cls = '') => {
  let sh = [];
  for (let i = 1; i <= depth; i++) sh.push(`0 ${i}px 0 ${side}`);
  sh.push(`0 ${depth + 4}px 14px rgba(40,20,80,.35)`);
  return `<span class="t3d ${cls}" style="color:${top};text-shadow:${sh.join(',')}">${txt}</span>`;
};

function bubbles(seed, h) {
  let s = seed * 9301 + 49297, out = '';
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 9; i++) {
    const size = 14 + rnd() * 46, x = rnd() * 100, y = rnd() * 100;
    out += `<i class="bub" style="width:${size}px;height:${size}px;left:${x}%;top:${y}%;--h:${(h + rnd() * 120) % 360}"></i>`;
  }
  return out;
}

function letterPage(L, i, pageNo) {
  const [ch, name, word, en, ill, joins] = L;
  const h = hue(i);
  const forms = joins
    ? [[ch, 'وَحْدَهُ'], [ch + TATWEEL, 'أَوَّلُ الكَلِمَة'], [TATWEEL + ch + TATWEEL, 'وَسَطُ الكَلِمَة'], [TATWEEL + ch, 'آخِرُ الكَلِمَة']]
    : [[ch, 'وَحْدَهُ'], [ch, 'أَوَّلُ الكَلِمَة'], [TATWEEL + ch, 'وَسَطُ الكَلِمَة'], [TATWEEL + ch, 'آخِرُ الكَلِمَة']];
  const trace = [0, 1, 2, 3, 4].map(k =>
    `<text x="${640 - k * 135}" y="78" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${ch}</text>`).join('');
  return `
  <section class="page letter" style="--h:${h}">
    ${bubbles(i + 3, h)}
    <div class="top">
      <div class="tilewrap">
        <div class="tile">${t3d(ch, '#fff', `hsl(${h},70%,38%)`, 10, 'big')}</div>
        <div class="lname">حَرْفُ ${name}</div>
      </div>
      <div class="stage">
        <div class="pedestal"></div>
        ${art(ill, { cls: 'ill' })}
      </div>
    </div>
    <div class="word">
      <span class="ar">${t3d(word, `hsl(${h},75%,45%)`, `hsl(${h},60%,30%)`, 5)}</span>
      <span class="en">${en}</span>
    </div>
    <div class="forms">${forms.map(([f, lab]) => `<div class="form"><b>${f}</b><small>${lab}</small></div>`).join('')}</div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الحَرْف</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${trace}</svg>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الكَلِمَة</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${[590, 350, 115].map((x, k) => `<text x="${x}" y="74" class="${k ? 'dash' : 'solid'} w" text-anchor="middle">${word}</text>`).join('')}</svg>
    </div>
    <div class="pno">${AR_DIGITS(pageNo)}</div>
  </section>`;
}

const pages = [];
let pno = 1;

// ---------- Cover ----------
pages.push(`
<section class="page cover">
  ${bubbles(1, 280)}
  <div class="ctiles">
    ${['ا', 'ب', 'ت'].map((l, k) => `<div class="tile small" style="--h:${[350, 200, 45][k]};transform:rotate(${[-10, 6, -4][k]}deg)">${t3d(l, '#fff', `hsl(${[350, 200, 45][k]},70%,38%)`, 7)}</div>`).join('')}
  </div>
  <h1>${t3d('حُرُوفِي', '#ffd23f', '#e07b00', 12)}<br>${t3d('الجَمِيلَة', '#ffffff', '#7b3fe4', 12)}</h1>
  <div class="csub">كِتَابُ الحُرُوفِ العَرَبِيَّةِ لِلأَطْفَال</div>
  <div class="cen">My Beautiful Arabic Letters</div>
  <div class="cart">
    ${['sun', 'rabbit', 'rocket', 'apple', 'bee', 'whale'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}
  </div>
</section>`);
pno++;

// ---------- Owner page ----------
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(2, 200)}
  <div class="owner">
    ${art('bear', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#2a7fd4', 7)}</h2>
    <div class="nameline"></div>
    <p>عُمْرِي: ............ سَنَوَات</p>
    <div class="author">تَأْلِيف: انعام الرحمن</div>
    <div class="stars">${art('rocket', { cls: 'mini' })}${art('cloud', { cls: 'mini' })}${art('flower', { cls: 'mini' })}</div>
  </div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- Parents note ----------
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(4, 150)}
  <div class="note">
    <h2>${t3d('رِسَالَةٌ إِلَى الوَالِدَيْن', '#fff', '#1f9d63', 7)}</h2>
    <div class="card">
      <p>أَهْلًا بِكُمْ فِي رِحْلَةِ تَعَلُّمِ الحُرُوفِ العَرَبِيَّة! 🌟</p>
      <ul>
        <li>اقْرَؤُوا مَعَ طِفْلِكُمْ صَفْحَةً أَوْ صَفْحَتَيْنِ كُلَّ يَوْم.</li>
        <li>انْطِقُوا اسْمَ الحَرْفِ وَصَوْتَهُ، ثُمَّ اسْمَ الصُّورَة.</li>
        <li>شَجِّعُوا الطِّفْلَ عَلَى تَتَبُّعِ الحَرْفِ المُنَقَّطِ بِإِصْبَعِهِ أَوْ بِالقَلَم.</li>
        <li>أَشِيرُوا إِلَى أَشْكَالِ الحَرْفِ فِي أَوَّلِ الكَلِمَةِ وَوَسَطِهَا وَآخِرِهَا.</li>
        <li>امْدَحُوا كُلَّ مُحَاوَلَة، وَفِي النِّهَايَةِ امْنَحُوهُ شَهَادَةَ التَّقْدِير!</li>
      </ul>
    </div>
    <div class="row3">${art('sheep', { cls: 'mini' })}${art('duck', { cls: 'mini' })}${art('frog', { cls: 'mini' })}</div>
  </div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- Overview ----------
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(5, 270)}
  <h2 class="ovt">${t3d('الحُرُوفُ العَرَبِيَّة', '#fff', '#6a3fd0', 7)}</h2>
  <div class="grid">${LETTERS.map((L, i) => `<div class="gt" style="--h:${hue(i)}">${t3d(L[0], '#fff', `hsl(${hue(i)},70%,36%)`, 5)}</div>`).join('')}</div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- 28 letter pages ----------
LETTERS.forEach((L, i) => pages.push(letterPage(L, i, pno++)));

// ---------- Numbers ----------
const NUMS = ['وَاحِد', 'اثْنَان', 'ثَلَاثَة', 'أَرْبَعَة', 'خَمْسَة', 'سِتَّة', 'سَبْعَة', 'ثَمَانِيَة', 'تِسْعَة', 'عَشَرَة'];
const NCOL = ['#ff4757', '#ff9f1c', '#ffd23f', '#4cd964', '#2ed1c4', '#4fa8ff', '#6c63ff', '#b05cff', '#ff6fae', '#ff7a3d'];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(7, 20)}
  <h2 class="ovt">${t3d('الأَرْقَام', '#fff', '#e0482c', 7)}</h2>
  <div class="nums">${NUMS.map((n, k) => `<div class="num"><div class="bl">${art('balloon', { color: NCOL[k], vb: '25 0 150 212' })}<span>${t3d(AR_DIGITS(k + 1), '#fff', 'rgba(0,0,0,.35)', 3)}</span></div><b>${n}</b></div>`).join('')}</div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- Colours ----------
const COLS = [['أَحْمَر', '#ff3b4f'], ['أَزْرَق', '#2f7de8'], ['أَصْفَر', '#ffd23f'], ['أَخْضَر', '#36c45d'], ['بُرْتُقَالِيّ', '#ff8a1f'],
  ['بَنَفْسَجِيّ', '#9b59d6'], ['وَرْدِيّ', '#ff6fae'], ['بُنِّيّ', '#9a5f33'], ['أَسْوَد', '#3d3d5c'], ['أَبْيَض', '#f4f6fb']];
const { Ctx } = require('./art');
const ballSvg = col => { const c = new Ctx(); c.shadow(100, 185, 55, 10); c.ball(100, 100, 72, col); return c.svg(); };
pages.push(`
<section class="page plain" style="--h:320">
  ${bubbles(8, 320)}
  <h2 class="ovt">${t3d('الأَلْوَان', '#fff', '#c2367a', 7)}</h2>
  <div class="cols">${COLS.map(([n, c]) => `<div class="col">${ballSvg(c)}<b>${n}</b></div>`).join('')}</div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- Certificate ----------
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَلَّمَ جَمِيعَ الحُرُوفِ العَرَبِيَّةِ بِنَجَاح<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  <div class="pno">${AR_DIGITS(pno++)}</div>
</section>`);

// ---------- Back cover ----------
pages.push(`
<section class="page cover back">
  ${bubbles(9, 280)}
  <h2>${t3d('حُرُوفِي الجَمِيلَة', '#fff', '#7b3fe4', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَلِّمُ طِفْلَكَ الحُرُوفَ العَرَبِيَّةَ الثَّمَانِيَةَ وَالعِشْرِين بِطَرِيقَةٍ مُمْتِعَة.</p>
    <ul><li>٢٨ حَرْفًا مَعَ صُورَةٍ وَكَلِمَة</li><li>أَشْكَالُ الحَرْفِ فِي الكَلِمَة</li><li>تَمَارِينُ كِتَابَةٍ مُنَقَّطَة</li><li>الأَرْقَامُ وَالأَلْوَانُ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn the 28 Arabic letters · Ages 3–7</p>
  </div>
  <div class="cart small">${['cake', 'moon', 'strawberry', 'gift', 'pumpkin', 'fish'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
</section>`);

const css = `
@font-face{font-family:Baloo;src:url('${font('BalooBhaijaan2.ttf')}');font-weight:400 800}
@font-face{font-family:Lalezar;src:url('${font('Lalezar.ttf')}')}
@font-face{font-family:Fredoka;src:url('${font('Fredoka.ttf')}');font-weight:300 700}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:Baloo,sans-serif;direction:rtl;color:#2b2340}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;padding:34px 40px;
  background:radial-gradient(circle at 30% 20%,hsl(var(--h),100%,97%),hsl(var(--h),85%,88%) 70%,hsl(var(--h),70%,80%))}
.bub{position:absolute;border-radius:50%;opacity:.55;
  background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--h),90%,85%) 45%,hsl(var(--h),70%,70%));
  box-shadow:0 6px 12px hsla(var(--h),60%,40%,.18)}
.t3d{font-family:Lalezar,Baloo;display:inline-block;line-height:1.1}
.pno{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);width:44px;height:44px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;color:#fff;
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
.tile{border-radius:44px;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,55%) 55%,hsl(var(--h),75%,45%));
  box-shadow:inset 0 8px 0 rgba(255,255,255,.35),inset 0 -12px 0 rgba(0,0,0,.15),0 14px 0 hsl(var(--h),65%,36%),0 26px 30px rgba(40,20,80,.3)}
.letter{display:flex;flex-direction:column;gap:22px;padding:40px 40px 80px}
.top{display:flex;gap:16px;align-items:center;height:420px;position:relative}
.tilewrap{width:290px;display:flex;flex-direction:column;align-items:center}
.letter .tile{width:270px;height:270px}
.t3d.big{font-size:215px;margin-top:22px}
.lname{margin-top:26px;font-size:34px;font-weight:800;color:hsl(var(--h),60%,32%);background:#fff;padding:0 26px;border-radius:30px;
  box-shadow:0 5px 0 hsl(var(--h),50%,75%),0 10px 18px rgba(0,0,0,.12)}
.stage{flex:1;height:420px;position:relative;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:18px;width:320px;height:70px;border-radius:50%;
  background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 10px 0 hsl(var(--h),45%,62%),0 22px 26px rgba(40,20,80,.25)}
.ill{width:390px;height:390px;position:relative;margin-bottom:30px;filter:drop-shadow(0 6px 8px rgba(40,20,80,.15))}
.word{position:relative;margin:0 auto;width:600px;height:110px;flex:none;border-radius:50px;background:#fff;display:flex;align-items:center;justify-content:center;gap:22px;
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,90%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.word .ar .t3d{font-family:Baloo;font-weight:800;font-size:64px;line-height:1.5;margin-top:4px}
.word .en{font-family:Fredoka;font-weight:600;font-size:24px;color:hsl(var(--h),40%,55%);direction:ltr}
.forms{position:relative;display:flex;justify-content:center;gap:18px}
.form{width:158px;height:126px;border-radius:26px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;flex-direction:column;align-items:center;justify-content:center;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.form b{font-size:60px;line-height:1.1;font-weight:800;color:hsl(var(--h),70%,42%);text-shadow:0 3px 0 hsl(var(--h),60%,80%)}
.form small{font-size:15px;font-weight:700;color:#7a6f92;margin-top:-2px}
.trace{position:relative;margin:0 auto;width:690px;height:132px;flex:none;background:#fff;border-radius:26px;padding:4px 10px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}
.trace text{font-family:Baloo;font-weight:700;font-size:84px}
.trace text.w{font-size:62px;font-weight:800}
.trace .solid{fill:hsl(var(--h),70%,50%)}
.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* cover */
.cover{--h:280;background:radial-gradient(circle at 50% 30%,#fff3c4,#ffb6d9 45%,#a78bfa 85%,#7c5ce0);text-align:center}
.cover h1{position:relative;font-size:130px;line-height:1.08;margin-top:150px}
.ctiles{position:absolute;top:50px;left:0;right:0;display:flex;justify-content:center;gap:26px}
.tile.small{width:96px;height:96px;border-radius:24px;font-size:84px}
.tile.small .t3d{margin-top:10px}
.csub{position:relative;display:inline-block;margin-top:22px;font-size:32px;font-weight:800;color:#5a2db8;background:#fff;padding:2px 30px;border-radius:30px;box-shadow:0 6px 0 #c9b5ff,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:24px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #7b3fe4;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:360px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(40,20,80,.25))}
.ca svg{width:100%;height:100%}
.ca0{width:160px;height:160px;left:30px;bottom:150px}.ca1{width:240px;height:240px;left:160px;bottom:20px}
.ca2{width:170px;height:170px;right:30px;bottom:130px}.ca3{width:170px;height:170px;right:170px;bottom:10px}
.ca4{width:160px;height:160px;left:390px;bottom:40px}.ca5{width:180px;height:180px;left:-6px;bottom:6px}
.cart.small .ca{transform:scale(1.05)}
.back h2{position:relative;font-size:84px;margin-top:150px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.25),0 16px 26px rgba(40,20,80,.15);text-align:right}
.author{position:relative;display:inline-block;margin-top:10px;font-size:26px;font-weight:800;color:#fff;padding:2px 26px;border-radius:26px;
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.author2{text-align:center;font-weight:800;color:#c2366a;font-size:24px;margin-top:6px}
.blurb{margin:40px 20px 0;font-size:28px;font-weight:600;line-height:1.7}
.blurb ul{margin:8px 26px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#7b3fe4;font-size:19px;margin-top:8px}
/* plain pages */
.owner{position:relative;text-align:center;padding-top:60px}
.ownerart{display:block;margin:6px auto 0;width:330px;height:330px;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2,.note h2,.ovt{margin-top:20px;font-size:62px;text-align:center;position:relative}
.nameline{width:520px;height:86px;margin:16px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.owner p{font-size:30px;font-weight:700;color:hsl(var(--h),50%,35%)}
.stars,.row3{display:flex;justify-content:center;gap:30px;margin-top:10px}
.stars .mini{width:160px;height:160px}
.owner .author{margin-top:26px;font-size:30px}
.stars{margin-top:40px}
.mini{width:150px;height:150px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
.note{position:relative;padding-top:50px}
.note .row3{margin-top:60px}
.note .mini{width:180px;height:180px}
.note .card{margin-top:30px;font-size:27px;font-weight:600;line-height:2}
.note ul{margin-right:24px;margin-top:6px}
.grid{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:26px 22px;margin:36px 20px 0}
.gt{height:120px;border-radius:28px;display:flex;align-items:center;justify-content:center;font-size:84px;
  background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,52%));
  box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 hsl(var(--h),65%,36%),0 14px 16px rgba(40,20,80,.25)}
.gt .t3d{margin-top:12px}
.nums{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:18px 14px;margin-top:30px}
.num:nth-child(9){grid-column:2}
.num{text-align:center}.bl{position:relative;height:225px}.bl svg{width:100%;height:100%}
.bl span{position:absolute;top:44px;left:0;right:0;font-size:78px}
.num b{font-size:28px;font-weight:800;color:#c0392b;background:#fff;padding:0 16px;border-radius:20px;box-shadow:0 4px 0 #ffc2b0}
.cols{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:22px 30px;margin:46px 30px 0}
.col{display:flex;align-items:center;gap:22px;background:rgba(255,255,255,.55);border-radius:90px;padding:6px 10px}
.col svg{width:140px;height:140px;flex:none}.col b{display:inline-block;font-size:38px;font-weight:800;background:#fff;padding:0 14px;border-radius:20px;box-shadow:0 4px 0 #f3b7d6}
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d)}
.frame{position:relative;height:100%;padding-top:90px !important;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:20px;
  box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:260px;height:260px;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:90px;margin-top:10px}
.cp{font-size:32px;font-weight:700;color:#8a5200;margin-top:20px;line-height:1.7}
.sig{display:flex;justify-content:space-around;margin-top:70px;font-size:22px;font-weight:700;color:#8a5200}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>حروفي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
