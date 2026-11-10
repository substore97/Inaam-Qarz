// Builds "حيواناتي الجميلة" – a 3D-style Arabic animals book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art, Ctx } = require('./animals-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, lives in, eats, sentence]
const ANIMALS = [
  ['أَرْنَب', 'Rabbit', 'rabbit', 'الحَقْل', 'الجَزَرَ وَالخَسّ', 'الأَرْنَبُ يَقْفِزُ بِسُرْعَة'],
  ['بَطَّة', 'Duck', 'duck', 'البُحَيْرَة', 'الحُبُوب', 'البَطَّةُ تَسْبَحُ فِي المَاء'],
  ['قِطَّة', 'Cat', 'cat', 'البَيْت', 'السَّمَكَ وَالحَلِيب', 'القِطَّةُ تُحِبُّ اللَّعِب'],
  ['أَسَد', 'Lion', 'lion', 'الغَابَة', 'اللَّحْم', 'الأَسَدُ مَلِكُ الغَابَة'],
  ['فِيل', 'Elephant', 'elephant', 'الغَابَة', 'العُشْبَ وَالفَوَاكِه', 'الفِيلُ لَهُ خُرْطُومٌ طَوِيل'],
  ['دَجَاجَة', 'Chicken', 'chicken', 'المَزْرَعَة', 'الحُبُوب', 'الدَّجَاجَةُ تَبِيضُ البَيْض'],
  ['بَقَرَة', 'Cow', 'cow', 'المَزْرَعَة', 'العُشْب', 'البَقَرَةُ تُعْطِينَا الحَلِيب'],
  ['خَرُوف', 'Sheep', 'sheep', 'المَزْرَعَة', 'العُشْب', 'الخَرُوفُ لَهُ صُوفٌ نَاعِم'],
  ['دُبّ', 'Bear', 'bear', 'الغَابَة', 'العَسَلَ وَالسَّمَك', 'الدُّبُّ يُحِبُّ العَسَل'],
  ['قِرْد', 'Monkey', 'monkey', 'الغَابَة', 'المَوْز', 'القِرْدُ يَتَسَلَّقُ الأَشْجَار'],
  ['ضِفْدَع', 'Frog', 'frog', 'البِرْكَة', 'الحَشَرَات', 'الضِّفْدَعُ يَقْفِزُ عَالِيًا'],
  ['سَمَكَة', 'Fish', 'fish', 'البَحْر', 'النَّبَاتَاتِ الصَّغِيرَة', 'السَّمَكَةُ تَعِيشُ فِي المَاء'],
  ['حُوت', 'Whale', 'whale', 'المُحِيط', 'الأَسْمَاكَ الصَّغِيرَة', 'الحُوتُ أَكْبَرُ حَيَوَان'],
  ['سُلَحْفَاة', 'Turtle', 'turtle', 'الحَدِيقَة', 'الخَضْرَاوَات', 'السُّلَحْفَاةُ تَمْشِي بِبُطْء'],
  ['بُومَة', 'Owl', 'owl', 'الشَّجَرَة', 'الفِئْرَان', 'البُومَةُ تَسْهَرُ فِي اللَّيْل'],
  ['بِطْرِيق', 'Penguin', 'penguin', 'الأَمَاكِنِ البَارِدَة', 'السَّمَك', 'البِطْرِيقُ لَا يَطِير'],
  ['فَرَاشَة', 'Butterfly', 'butterfly', 'الحَدِيقَة', 'رَحِيقَ الأَزْهَار', 'الفَرَاشَةُ أَلْوَانُهَا جَمِيلَة'],
  ['نَحْلَة', 'Bee', 'bee', 'الخَلِيَّة', 'رَحِيقَ الأَزْهَار', 'النَّحْلَةُ تَصْنَعُ العَسَل'],
  ['حَلَزُون', 'Snail', 'snail', 'الحَدِيقَة', 'أَوْرَاقَ النَّبَات', 'الحَلَزُونُ يَحْمِلُ بَيْتَه'],
  ['فَأْر', 'Mouse', 'mouse', 'الحَقْل', 'الحُبُوبَ وَالجُبْن', 'الفَأْرُ صَغِيرٌ وَسَرِيع'],
];
const byArt = Object.fromEntries(ANIMALS.map(a => [a[2], a]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '')[0];
const hue = i => Math.round((i * 360 / 20 * 7) % 360);

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
  ${bubbles(1, 280, 12)}
  <div class="ctop">${['lion', 'butterfly', 'owl'].map((a, k) => `<div class="ct ct${k}">${art(a)}</div>`).join('')}</div>
  <h1>${t3d('حَيَوَانَاتِي', '#ffd23f', '#e07b00', 12)}<br>${t3d('الجَمِيلَة', '#ffffff', '#1f9d63', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى الحَيَوَانَاتِ بِالعَرَبِيَّة</div>
  <div class="cen">My Lovely Animals</div>
  <div class="cart">${['elephant', 'cat', 'penguin', 'monkey', 'turtle', 'chicken'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page (author credit lives here, under the heading)
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(2, 150)}
  <div class="owner">
    ${art('rabbit', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#1f9d63', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('butterfly', { cls: 'mini' })}${art('snail', { cls: 'mini' })}${art('duck', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(3, 200)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#2a7fd4')}
    <div class="card">
      <p>مَرْحَبًا بِكُمْ فِي عَالَمِ الحَيَوَانَاتِ الجَمِيل! 🌟</p>
      <ul>
        <li>اقْرَؤُوا مَعَ طِفْلِكُمُ اسْمَ الحَيَوَانِ وَأَشِيرُوا إِلَى صُورَتِه.</li>
        <li>اسْأَلُوهُ: أَيْنَ يَعِيشُ؟ وَمَاذَا يَأْكُل؟</li>
        <li>اقْرَؤُوا الجُمْلَةَ القَصِيرَةَ مَعًا، ثُمَّ دَعُوهُ يُكَرِّرُهَا.</li>
        <li>شَجِّعُوهُ عَلَى كِتَابَةِ اسْمِ الحَيَوَانِ فَوْقَ النِّقَاط.</li>
        <li>اسْتَمْتِعُوا بِالأَلْعَابِ وَالتَّلْوِينِ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('cow', { cls: 'mini' })}${art('mouse', { cls: 'mini' })}${art('frog', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Index of animals
pages.push(`
<section class="page plain" style="--h:40">
  ${bubbles(4, 40)}
  ${title('حَيَوَانَاتُ الكِتَاب', '#e07b00')}
  <div class="idx">${ANIMALS.map((a, i) => `<div class="ix" style="--h:${hue(i)}">${art(a[2])}<b>${a[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5-24 ---------- One page per animal
ANIMALS.forEach(([name, en, ill, lives, eats, sentence], i) => {
  const h = hue(i);
  pages.push(`
  <section class="page animal" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="aname">${t3d(name, '#fff', `hsl(${h},65%,35%)`, 9, 'big')}<span class="en">${en}</span></div>
    <div class="stage">
      <div class="pedestal"></div>
      ${art(ill, { cls: 'ill' })}
      <div class="fl"><small>الحَرْفُ الأَوَّل</small>${t3d(firstLetter(name), '#fff', `hsl(${h},70%,35%)`, 5)}</div>
    </div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>🏡</i><div><small>يَعِيشُ فِي</small><b>${lives}</b></div></div>
      <div class="chip"><i>🍽️</i><div><small>يَأْكُلُ</small><b>${eats}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ اسْمَ الحَيَوَان</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${[590, 350, 115].map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Where do they live?
const HAB = [
  ['🚜 المَزْرَعَة', 40, ['chicken', 'cow', 'sheep', 'rabbit']],
  ['🌳 الغَابَة', 120, ['lion', 'elephant', 'monkey', 'bear', 'owl']],
  ['🌊 المَاء', 200, ['fish', 'whale', 'frog', 'duck', 'penguin']],
];
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(40, 120)}
  ${title('أَيْنَ تَعِيشُ الحَيَوَانَات؟', '#1f9d63')}
  ${HAB.map(([t, h, list]) => `<div class="hab" style="--h:${h}"><div class="habt">${t}</div><div class="habr">${list.map(a => `<div>${art(a)}<b>${byArt[a][0]}</b></div>`).join('')}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 26 ---------- Match animal with its food
const MATCH = [['rabbit', 'banana'], ['monkey', 'corn'], ['bee', 'carrot'], ['cat', 'flower'], ['chicken', 'fish']];
const FOODN = { carrot: 'جَزَرَة', banana: 'مَوْزَة', flower: 'زَهْرَة', fish: 'سَمَكَة', corn: 'ذُرَة' };
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(41, 20)}
  ${title('صِلْ كُلَّ حَيَوَانٍ بِطَعَامِه', '#e0482c')}
  <div class="hint">ارْسُمْ خَطًّا مِنَ الحَيَوَانِ إِلَى طَعَامِهِ المُفَضَّل ✏️</div>
  <div class="match">${MATCH.map(([a, f]) => `<div class="mrow"><div class="mc">${art(a)}<b>${byArt[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc">${art(f)}<b>${FOODN[f]}</b></div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Counting
const COUNT = [['duck', 3], ['fish', 5], ['bear', 2], ['bee', 4]];
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(42, 260)}
  ${title('كَمْ عَدَدُهَا؟', '#6a3fd0')}
  <div class="hint">عُدَّ الحَيَوَانَاتِ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => art(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 28 ---------- Shadow match
const SH = [['elephant', 'owl'], ['cat', 'penguin'], ['owl', 'elephant'], ['snail', 'cat'], ['penguin', 'snail']];
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(43, 180)}
  ${title('أَيْنَ ظِلِّي؟', '#1d7fa8')}
  <div class="hint">صِلْ كُلَّ حَيَوَانٍ بِظِلِّه 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}<b>${byArt[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 29-30 ---------- Colouring pages
for (const [a, h] of [['lion', 40], ['butterfly', 320]]) {
  pages.push(`
  <section class="page plain" style="--h:${h}">
    ${title('لَوِّنِ ' + byArt[a][0].replace(/^(.)/, 'ال$1').replace(/^الأَ/, 'الأَ'), `hsl(${h},65%,38%)`)}
    <div class="colorbox">${art(a, { cls: 'outline' })}<div class="ref">${art(a)}<small>انْظُرْ وَلَوِّن</small></div></div>
    ${pno(P++)}
  </section>`);
}

// 31 ---------- Certificate
const medal = art('medal', { cls: 'medal' });
pages.push(`
<section class="page cert">
  <div class="frame">
    ${medal}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى الحَيَوَانَاتِ الجَمِيلَة<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${['lion', 'rabbit', 'elephant'].map(a => art(a)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 280, 12)}
  <h2>${t3d('حَيَوَانَاتِي الجَمِيلَة', '#fff', '#1f9d63', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَرِّفُ طِفْلَكَ عَلَى عِشْرِينَ حَيَوَانًا بِاللُّغَةِ العَرَبِيَّة.</p>
    <ul><li>٢٠ حَيَوَانًا مَعَ الاسْمِ وَالجُمْلَة</li><li>أَيْنَ يَعِيشُ؟ وَمَاذَا يَأْكُل؟</li><li>أَلْعَابُ التَّوْصِيلِ وَالعَدّ وَالظِّلَال</li><li>صَفَحَاتُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn animal names in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">${['sheep', 'whale', 'mouse', 'frog', 'bee', 'cow'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
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
/* cover */
.cover{--h:150;background:radial-gradient(circle at 50% 35%,#fffbd6,#b8f2c9 45%,#5fd3a8 80%,#2fae8a);text-align:center;padding:40px}
.ctop{position:relative;height:200px;margin-top:20px}
.ct{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,60,40,.3))}.ct svg{width:100%;height:100%}
.ct0{width:220px;height:220px;left:250px;top:-10px}.ct1{width:150px;height:150px;left:40px;top:30px;transform:rotate(-12deg)}.ct2{width:160px;height:160px;right:40px;top:30px}
.cover h1{position:relative;font-size:122px;line-height:1.1;margin-top:10px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:32px;font-weight:800;color:#167a52;background:#fff;padding:2px 30px;border-radius:30px;box-shadow:0 6px 0 #9fe0c2,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #1f9d63;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:380px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,60,40,.28))}.ca svg{width:100%;height:100%}
.ca0{width:250px;height:250px;left:270px;bottom:10px}.ca1{width:190px;height:190px;left:20px;bottom:150px}.ca2{width:180px;height:180px;right:20px;bottom:160px}
.ca3{width:200px;height:200px;left:90px;bottom:0}.ca4{width:200px;height:200px;right:80px;bottom:0}.ca5{width:150px;height:150px;left:180px;bottom:200px}
.cart.small .ca5{left:auto;right:200px;bottom:210px}
.back h2{position:relative;font-size:84px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:28px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#1f9d63;font-size:19px;margin-top:8px}
/* owner */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
/* note */
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:27px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* index */
.idx{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:22px}
.ix{height:168px;border-radius:26px;background:linear-gradient(160deg,#fff,hsl(var(--h),85%,92%));text-align:center;padding-top:6px;
  box-shadow:0 6px 0 hsl(var(--h),55%,72%),0 12px 16px rgba(40,20,80,.12)}
.ix svg{width:118px;height:118px;margin:0 auto}.ix b{font-size:24px;font-weight:800;color:hsl(var(--h),60%,35%)}
/* animal page */
.animal{display:flex;flex-direction:column;gap:20px}
.aname{position:relative;text-align:center}
.aname .big{font-size:96px}
.aname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,45%);direction:ltr;margin-top:-6px}
.stage{position:relative;height:470px;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:12px;width:430px;height:90px;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 12px 0 hsl(var(--h),45%,62%),0 24px 28px rgba(40,20,80,.25)}
.ill{position:relative;width:470px;height:470px;margin-bottom:40px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.fl{position:absolute;top:0;right:0;width:118px;height:132px;border-radius:30px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,52%));box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 hsl(var(--h),65%,36%),0 14px 18px rgba(40,20,80,.25)}
.fl small{font-size:15px;font-weight:800;color:#fff}.fl .t3d{font-size:70px;margin-top:-4px}
.sent{position:relative;margin:0 auto;padding:6px 40px;border-radius:50px;background:#fff;font-size:38px;font-weight:800;color:hsl(var(--h),60%,32%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#8a80a3}.chip b{font-size:27px;font-weight:800;color:hsl(var(--h),65%,38%);line-height:1.3}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:60px}
.trace .solid{fill:hsl(var(--h),70%,48%)}.trace .dash{fill:#dcd5e8;stroke:none}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* habitats */
.hab{position:relative;margin-top:24px;border-radius:32px;padding:12px 16px 14px;background:linear-gradient(160deg,hsl(var(--h),90%,96%),hsl(var(--h),70%,86%));
  box-shadow:0 8px 0 hsl(var(--h),45%,68%),0 14px 20px rgba(40,20,80,.15)}
.habt{display:inline-block;font-size:32px;font-weight:800;color:#fff;padding:0 24px;border-radius:24px;background:hsl(var(--h),60%,45%);box-shadow:0 4px 0 hsl(var(--h),60%,32%)}
.habr{display:flex;justify-content:space-around;margin-top:6px}.habr div{text-align:center}.habr svg{width:122px;height:122px}
.habr b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,30%)}
/* matching */
.match{position:relative;margin-top:22px;display:flex;flex-direction:column;gap:16px}
.mrow{display:flex;align-items:center}
.mc{width:190px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:112px;height:112px;margin:0 auto}.mc b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1}
.shadowimg svg{width:130px;height:130px;margin-top:6px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
/* counting */
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:26px;background:rgba(255,255,255,.75);border-radius:34px;padding:14px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:100px;height:100px}
.cans{width:96px;height:96px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
/* colouring */
.colorbox{position:relative;margin:26px auto 0;width:690px;height:850px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.colorbox .outline{width:640px;height:640px;position:absolute;left:25px;top:130px}
.outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.8 !important}
.outline [filter]{display:none}
.ref{position:absolute;top:18px;right:18px;width:140px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:110px;height:110px;margin:0 auto}.ref small{font-size:16px;font-weight:800;color:hsl(var(--h),55%,35%)}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>حيواناتي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
