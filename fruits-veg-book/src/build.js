// Builds "فواكهي وخضراواتي" – a 3D-style Arabic fruits & vegetables book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art } = require('./food-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, colour word, sentence]
const FRUITS = [
  ['تُفَّاحَة', 'Apple', 'apple', 'أَحْمَر', 'التُّفَّاحَةُ حُلْوَةٌ وَمُقَرْمِشَة'],
  ['مَوْزَة', 'Banana', 'banana', 'أَصْفَر', 'المَوْزَةُ تُعْطِينَا الطَّاقَة'],
  ['فَرَاوِلَة', 'Strawberry', 'strawberry', 'أَحْمَر', 'الفَرَاوِلَةُ حَمْرَاءُ وَلَذِيذَة'],
  ['عِنَب', 'Grapes', 'grapes', 'بَنَفْسَجِيّ', 'العِنَبُ يَنْمُو فِي عَنَاقِيد'],
  ['بُرْتُقَالَة', 'Orange', 'orange', 'بُرْتُقَالِيّ', 'البُرْتُقَالَةُ فِيهَا فِيتَامِين سِي'],
  ['بِطِّيخ', 'Watermelon', 'watermelon', 'أَخْضَرُ وَأَحْمَر', 'البِطِّيخُ فِيهِ مَاءٌ كَثِير'],
  ['كُمَّثْرَى', 'Pear', 'pear', 'أَخْضَر', 'الكُمَّثْرَى حُلْوَةٌ وَطَرِيَّة'],
  ['كَرَز', 'Cherry', 'cherry', 'أَحْمَر', 'الكَرَزُ صَغِيرٌ وَأَحْمَر'],
  ['أَنَانَاس', 'Pineapple', 'pineapple', 'أَصْفَر', 'الأَنَانَاسُ لَهُ تَاجٌ أَخْضَر'],
  ['رُمَّان', 'Pomegranate', 'pomegranate', 'أَحْمَر', 'الرُّمَّانُ فِيهِ حَبَّاتٌ كَثِيرَة'],
];
const VEG = [
  ['جَزَر', 'Carrot', 'carrot', 'بُرْتُقَالِيّ', 'الجَزَرُ مُفِيدٌ لِلْعُيُون'],
  ['ذُرَة', 'Corn', 'corn', 'أَصْفَر', 'الذُّرَةُ حَبَّاتُهَا صَفْرَاء'],
  ['يَقْطِين', 'Pumpkin', 'pumpkin', 'بُرْتُقَالِيّ', 'اليَقْطِينُ كَبِيرٌ وَمُسْتَدِير'],
  ['طَمَاطِم', 'Tomato', 'tomato', 'أَحْمَر', 'الطَّمَاطِمُ حَمْرَاءُ وَعَصِيرِيَّة'],
  ['خِيَار', 'Cucumber', 'cucumber', 'أَخْضَر', 'الخِيَارُ بَارِدٌ وَمُنْعِش'],
  ['بَطَاطِس', 'Potato', 'potato', 'بُنِّيّ', 'البَطَاطِسُ تَنْمُو تَحْتَ الأَرْض'],
  ['بَاذِنْجَان', 'Eggplant', 'eggplant', 'بَنَفْسَجِيّ', 'البَاذِنْجَانُ لَوْنُهُ بَنَفْسَجِيّ'],
  ['بَصَل', 'Onion', 'onion', 'ذَهَبِيّ', 'البَصَلُ لَهُ طَبَقَاتٌ كَثِيرَة'],
  ['فُلْفُل', 'Pepper', 'pepper', 'أَصْفَر', 'الفُلْفُلُ أَلْوَانُهُ كَثِيرَة'],
  ['بُرُوكُلِي', 'Broccoli', 'broccoli', 'أَخْضَر', 'البُرُوكُلِي يُشْبِهُ شَجَرَةً صَغِيرَة'],
];
const ALL = [...FRUITS.map(f => [...f, 'fruit']), ...VEG.map(v => [...v, 'veg'])];
const BY = Object.fromEntries(ALL.map(a => [a[2], a]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '')[0];
const hue = i => Math.round((i * 360 / 20 * 7 + 10) % 360);

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
const row = (a, n, s) => `<div class="grp" style="--s:${s}px">${Array.from({ length: n }, () => art(a)).join('')}</div>`;

const pages = [];
let P = 1;

// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, 100, 12)}
  <div class="ctop">${['strawberry', 'pineapple', 'cherry'].map((a, k) => `<div class="ct ct${k}">${art(a)}</div>`).join('')}</div>
  <h1>${t3d('فَوَاكِهِي', '#ffffff', '#e0482c', 12)}<br>${t3d('وَخَضْرَاوَاتِي', '#ffd23f', '#1f9d63', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى الفَوَاكِهِ وَالخَضْرَاوَاتِ بِالعَرَبِيَّة</div>
  <div class="cen">My Fruits &amp; Vegetables</div>
  <div class="cart">${['watermelon', 'carrot', 'apple', 'broccoli', 'banana', 'tomato'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(2, 20)}
  <div class="owner">
    ${art('orange', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#e07b00', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('pear', { cls: 'mini' })}${art('eggplant', { cls: 'mini' })}${art('cherry', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(3, 120)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1f9d63')}
    <div class="card">
      <p>مَرْحَبًا بِكُمْ فِي سُوقِ الفَوَاكِهِ وَالخَضْرَاوَات! 🍎🥕</p>
      <ul>
        <li>اقْرَؤُوا الاسْمَ وَأَشِيرُوا إِلَى الصُّورَة، ثُمَّ اسْأَلُوا: مَا لَوْنُهَا؟</li>
        <li>اقْرَؤُوا الجُمْلَةَ القَصِيرَةَ مَعًا وَدَعُوا الطِّفْلَ يُكَرِّرُهَا.</li>
        <li>ابْحَثُوا عَنْ هٰذِهِ الفَوَاكِهِ وَالخَضْرَاوَاتِ فِي المَطْبَخِ أَوِ السُّوق.</li>
        <li>شَجِّعُوهُ عَلَى كِتَابَةِ الاسْمِ فَوْقَ النِّقَاط.</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('pumpkin', { cls: 'mini' })}${art('grapes', { cls: 'mini' })}${art('pepper', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(4, 45)}
  ${title('فَوَاكِهِي', '#e0482c')}
  <div class="ovg">${FRUITS.map(f => `<div class="ovc">${art(f[2])}<b>${f[0]}</b></div>`).join('')}</div>
  ${title('خَضْرَاوَاتِي', '#1f9d63')}
  <div class="ovg">${VEG.map(f => `<div class="ovc">${art(f[2])}<b>${f[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–24 ---------- One page per item
ALL.forEach(([name, en, ill, colour, sentence, kind], i) => {
  const h = hue(i);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},65%,35%)`, 9, 'big')}<span class="en">${en}</span></div>
    <div class="stage">
      <div class="pedestal"></div>
      ${art(ill, { cls: 'ill' })}
      <div class="kind ${kind}">${kind === 'fruit' ? '🍎<b>فَاكِهَة</b>' : '🥕<b>خُضَار</b>'}</div>
    </div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>🎨</i><div><small>اللَّوْن</small><b>${colour}</b></div></div>
      <div class="chip"><i class="ab">أ ب</i><div><small>الحَرْفُ الأَوَّل</small><b class="fl">${firstLetter(name)}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الاسْم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${[590, 350, 115].map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Fruit or vegetable?
const SORT = ['apple', 'carrot', 'banana', 'potato', 'grapes', 'onion', 'watermelon', 'broccoli'];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(40, 150)}
  ${title('فَاكِهَةٌ أَمْ خُضَار؟', '#1f9d63')}
  <div class="hint">ضَعْ عَلَامَةَ ✓ فِي المُرَبَّعِ الصَّحِيح</div>
  <div class="sort">${SORT.map(a => `<div class="sc">${art(a)}<b>${BY[a][0]}</b><div class="opts"><span><i></i>فَاكِهَة</span><span><i></i>خُضَار</span></div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Shadow match
const SH = [['pineapple', 'cherry'], ['pear', 'broccoli'], ['broccoli', 'pineapple'], ['banana', 'pear'], ['cherry', 'banana']];
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(41, 200)}
  ${title('أَيْنَ ظِلِّي؟', '#1d7fa8')}
  <div class="hint">صِلْ كُلَّ صُورَةٍ بِظِلِّهَا 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}<b>${BY[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Counting
const COUNT = [['cherry', 3], ['carrot', 5], ['tomato', 2], ['orange', 4]];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(42, 20)}
  ${title('كَمْ عَدَدُهَا؟', '#e0482c')}
  <div class="hint">عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => art(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 28 ---------- Complete the pattern
const PAT = [
  [['apple', 'banana', 'apple', 'banana', 'apple'], ['banana', 'cherry', 'apple']],
  [['carrot', 'carrot', 'tomato', 'carrot', 'carrot'], ['onion', 'tomato', 'carrot']],
  [['strawberry', 'grapes', 'orange', 'strawberry', 'grapes'], ['grapes', 'pear', 'orange']],
  [['pear', 'pear', 'cherry', 'cherry', 'pear'], ['cherry', 'pear', 'lemon']],
];
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(43, 270)}
  ${title('أَكْمِلِ النَّمَط', '#6a3fd0')}
  <div class="hint">مَا الصُّورَةُ التَّالِيَة؟ ضَعْ دَائِرَةً حَوْلَ الجَوَاب ⭕</div>
  ${PAT.map(([seq, opts]) => `<div class="pat"><div class="seq">${seq.map(a => art(a)).join('')}<div class="q">؟</div></div><div class="popts">${opts.map(a => `<div>${art(a)}</div>`).join('')}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 29 ---------- Draw on the plate
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(44, 180)}
  ${title('طَبَقِي الصِّحِّيّ', '#1d7fa8')}
  <div class="hint">ارْسُمْ فِي الطَّبَقِ فَوَاكِهَكَ وَخَضْرَاوَاتِكَ المُفَضَّلَة 🍽️</div>
  <div class="plate"><div class="p2"></div></div>
  <div class="cutlery">${art('apple', { cls: 'pa' })}${art('carrot', { cls: 'pa' })}${art('grapes', { cls: 'pa' })}</div>
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:350">
  ${title('لَوِّنِ الفَوَاكِه', '#c2367a')}
  <div class="colorbox">
    ${art('watermelon', { cls: 'outline c1' })}${art('pineapple', { cls: 'outline c2' })}${art('pear', { cls: 'outline c3' })}
    <div class="ref">${art('watermelon')}${art('pineapple')}${art('pear')}<small>انْظُرْ وَلَوِّن</small></div>
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
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى الفَوَاكِهِ وَالخَضْرَاوَات<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${['strawberry', 'carrot', 'orange'].map(a => art(a)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 100, 12)}
  <h2>${t3d('فَوَاكِهِي وَخَضْرَاوَاتِي', '#fff', '#1f9d63', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَرِّفُ طِفْلَكَ عَلَى عَشْرِ فَوَاكِهَ وَعَشْرِ خَضْرَاوَاتٍ بِاللُّغَةِ العَرَبِيَّة.</p>
    <ul><li>٢٠ صُورَةً مَعَ الاسْمِ وَاللَّوْنِ وَالجُمْلَة</li><li>فَاكِهَةٌ أَمْ خُضَار؟ وَأَلْعَابُ الظِّلَالِ وَالعَدّ</li><li>أَكْمِلِ النَّمَطَ وَطَبَقِي الصِّحِّيّ</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn fruits &amp; vegetables in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">${['pear', 'eggplant', 'pomegranate', 'cucumber', 'lemon', 'onion'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
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
.grp{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.grp svg{width:var(--s);height:var(--s)}
/* cover */
.cover{--h:100;background:radial-gradient(circle at 50% 38%,#fffbd6,#d9f7b0 42%,#8fdc7a 75%,#3fb36a);text-align:center;padding:40px}
.ctop{position:relative;height:210px}
.ct{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,60,20,.3))}.ct svg{width:100%;height:100%}
.ct0{width:160px;height:160px;left:50px;top:40px;transform:rotate(-12deg)}.ct1{width:200px;height:200px;left:285px;top:0}.ct2{width:160px;height:160px;right:50px;top:40px}
.cover h1{position:relative;font-size:118px;line-height:1.12}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:27px;font-weight:800;color:#1a7a44;background:#fff;padding:2px 26px;border-radius:30px;box-shadow:0 6px 0 #b5e8a0,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #1f9d63;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:330px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,60,20,.28))}.ca svg{width:100%;height:100%}
.ca0{width:240px;height:240px;left:270px;bottom:10px}.ca1{width:170px;height:170px;left:30px;bottom:130px}.ca2{width:190px;height:190px;left:100px;bottom:0}
.ca3{width:180px;height:180px;right:120px;bottom:10px}.ca4{width:170px;height:170px;right:20px;bottom:150px}.ca5{width:130px;height:130px;left:-10px;bottom:10px}
.cart.small .ca5{left:auto;right:-10px;bottom:10px}
.back h2{position:relative;font-size:70px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#1f9d63;font-size:19px;margin-top:8px}
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
.ovg{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:8px 10px;margin:8px 0 6px}
.ovc{text-align:center}.ovc svg{width:118px;height:118px;margin:0 auto}
.ovc b{font-size:20px;font-weight:800;background:#fff;padding:0 12px;border-radius:16px;box-shadow:0 3px 0 #f0d9b0}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:92px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,45%);direction:ltr;margin-top:-6px}
.stage{position:relative;height:460px;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:12px;width:430px;height:90px;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 12px 0 hsl(var(--h),45%,62%),0 24px 28px rgba(40,20,80,.25)}
.ill{position:relative;width:450px;height:450px;margin-bottom:40px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.kind{position:absolute;top:0;right:0;display:flex;flex-direction:column;align-items:center;justify-content:center;width:120px;height:120px;border-radius:30px;font-size:48px;
  box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 rgba(0,0,0,.25),0 14px 18px rgba(40,20,80,.25)}
.kind b{font-size:22px;font-weight:800;color:#fff;margin-top:-4px}
.kind.fruit{background:linear-gradient(150deg,#ff8a9a,#ff3b4f)}.kind.veg{background:linear-gradient(150deg,#7ee08a,#2fae52)}
.sent{position:relative;margin:0 auto;padding:6px 40px;border-radius:50px;background:#fff;font-size:36px;font-weight:800;color:hsl(var(--h),60%,32%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#8a80a3}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,38%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:60px}
.trace .solid{fill:hsl(var(--h),70%,48%)}.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.sort{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:18px 22px;margin-top:22px}
.sc{display:flex;flex-direction:column;align-items:center;gap:4px;background:#fff;border-radius:30px;padding:6px 16px 12px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:90px;height:90px;flex:none}.sc>b{font-size:28px;font-weight:800;color:hsl(var(--h),55%,32%);line-height:1.2}
.opts{display:flex;gap:28px}.opts span{display:flex;align-items:center;gap:8px;font-size:23px;font-weight:800}
.opts i{width:34px;height:34px;border-radius:8px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:190px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:112px;height:112px;margin:0 auto}.mc b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1}
.shadowimg svg{width:130px;height:130px;margin-top:6px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.pat{position:relative;margin-top:18px;background:rgba(255,255,255,.8);border-radius:34px;padding:8px 16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.seq{display:flex;align-items:center;justify-content:center;gap:4px}.seq svg{width:88px;height:88px}
.q{width:88px;height:88px;border-radius:24px;border:5px dashed hsl(var(--h),60%,60%);display:flex;align-items:center;justify-content:center;font-size:56px;font-weight:800;color:hsl(var(--h),60%,55%)}
.popts{display:flex;justify-content:center;gap:36px;margin-top:8px}.popts div{background:hsl(var(--h),80%,95%);border-radius:50%;padding:4px}.popts svg{width:60px;height:60px}
.plate{position:relative;margin:34px auto 0;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff,#eef3f8 60%,#cfd9e6);
  box-shadow:0 14px 0 #b8c4d4,0 26px 40px rgba(40,20,80,.25);display:flex;align-items:center;justify-content:center}
.p2{width:470px;height:470px;border-radius:50%;background:#fff;box-shadow:inset 0 6px 14px rgba(0,0,0,.08)}
.cutlery{position:relative;display:flex;justify-content:center;gap:40px;margin-top:30px}.pa{width:110px;height:110px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}.c1{width:460px;height:460px;left:20px;top:20px}.c2{width:380px;height:380px;right:10px;bottom:20px}.c3{width:300px;height:300px;left:30px;bottom:40px}
.outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.8 !important}
.outline [filter]{display:none}
.outline path:not([fill^="url"]),.outline ellipse:not([fill^="url"]){fill-opacity:.0;stroke:#2b2340;stroke-width:1.2}
.ref{position:absolute;top:18px;right:18px;width:130px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:80px;height:80px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:hsl(var(--h),55%,35%)}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>فواكهي وخضراواتي</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
