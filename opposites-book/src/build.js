// Builds "أضدادي الجميلة" – a 3D-style Arabic opposites book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art, withFace } = require('./opp-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// ---------- scene helpers
const BOT = (w, x = '50%') => `left:${x};bottom:8px;transform:translateX(-50%);width:${w}px;height:${w}px`;
const AT = (w, h, l, t) => `left:${l};top:${t};width:${w}px;height:${h}px`;
const scene = (items, bg = '', extra = '') => `<div class="scene" style="${bg ? `background:${bg}` : ''}">${extra}${items.map(([svg, st]) => `<div class="it" style="${st}">${svg}</div>`).join('')}</div>`;
const SKY_DAY = 'linear-gradient(#8fd3ff,#d9f1ff 70%,#bfe8a8 70%,#9fdc86)';
const SKY_NIGHT = 'linear-gradient(#1d2a5c,#3b4d8f 70%,#2f6b4a 70%,#24573c)';
const SEA = 'linear-gradient(#bfe8ff 0,#e6f6ff 48%,#5ec8f2 48%,#2a8fd4)';
const ROAD = 'linear-gradient(#bfe8ff 0,#e6f6ff 38%,#a7e08a 38%,#7fcf6a)';
const stars = '<i class="star" style="left:12%;top:14%"></i><i class="star" style="left:30%;top:30%"></i><i class="star" style="left:48%;top:10%"></i><i class="star" style="left:20%;top:52%"></i>';
const road = '<div class="road"></div>';
const pencil = len => art('pencil', { color: len, vb: '0 70 200 70' });
const balloon = c => art('balloon', { color: c, vb: '25 0 150 212' });
const ducks = '<div class="ducks">' + Array.from({ length: 5 }, () => art('duck')).join('') + '</div>';

// [word A, sentence A, scene A, word B, sentence B, scene B, icon A, icon B]
const PAIRS = [
  ['كَبِير', 'الفِيلُ كَبِير', scene([[art('elephant'), BOT(310)]]), 'صَغِير', 'الفَأْرُ صَغِير', scene([[art('mouse'), BOT(130)]]), art('elephant'), art('mouse')],
  ['طَوِيل', 'القَلَمُ طَوِيل', scene([[pencil(110), AT(640, 224, '10px', '40px')]]), 'قَصِير', 'القَلَمُ قَصِير', scene([[pencil(36), AT(640, 224, '10px', '40px')]]), pencil(110), pencil(36)],
  ['سَرِيع', 'السَّيَّارَةُ سَرِيعَة', scene([[art('racecar'), BOT(300)]], '', '<div class="speed"></div>'), 'بَطِيء', 'الحَلَزُونُ بَطِيء', scene([[art('snail'), BOT(270)]]), art('racecar'), art('snail')],
  ['حَارّ', 'الشَّمْسُ حَارَّة', scene([[art('sun'), BOT(290)]], 'radial-gradient(circle at 50% 50%,#fff3c4,#ffb46b)'), 'بَارِد', 'الثَّلْجُ بَارِد', scene([[art('snowman'), BOT(290)]], 'radial-gradient(circle at 50% 50%,#ffffff,#a9dcff)'), art('sun'), art('snowman')],
  ['نَهَار', 'فِي النَّهَارِ تُشْرِقُ الشَّمْس', scene([[art('house'), BOT(230)], [art('sun'), AT(130, 130, '74%', '6%')]], SKY_DAY), 'لَيْل', 'فِي اللَّيْلِ يَظْهَرُ القَمَر', scene([[art('house'), BOT(230)], [art('moon'), AT(130, 130, '74%', '4%')]], SKY_NIGHT, stars), art('sun'), art('moon')],
  ['فَوْق', 'المِنْطَادُ فِي الأَعْلَى', scene([[art('hotair'), AT(150, 150, '42%', '2%')]], SEA), 'تَحْت', 'الغَوَّاصَةُ فِي الأَسْفَل', scene([[art('submarine'), AT(170, 170, '40%', '46%')]], SEA), art('hotair'), art('submarine')],
  ['كَثِير', 'الفَرَاوِلَةُ كَثِيرَة', scene([[`<div class="many">${Array.from({ length: 8 }, () => art('strawberry')).join('')}</div>`, AT(600, 290, '45px', '6px')]]), 'قَلِيل', 'فَرَاوِلَةٌ وَاحِدَةٌ فَقَط', scene([[art('strawberry'), BOT(160)]]), art('strawberry'), art('strawberry')],
  ['سَعِيد', 'القِطَّةُ سَعِيدَة', scene([[art('cat'), BOT(290)]]), 'حَزِين', 'القِطَّةُ حَزِينَة', scene([[withFace('sad', () => art('cat')), BOT(290)]]), art('cat'), withFace('sad', () => art('cat'))],
  ['ثَقِيل', 'الشَّاحِنَةُ ثَقِيلَة', scene([[art('truck'), BOT(310)]]), 'خَفِيف', 'البَالُونُ خَفِيف', scene([[balloon('#ff6fae'), AT(170, 240, '40%', '20px')]]), art('truck'), balloon('#ff6fae')],
  ['مُمْتَلِئ', 'الكُوبُ مُمْتَلِئ', scene([[art('cup', { color: 1 }), BOT(290)]]), 'فَارِغ', 'الكُوبُ فَارِغ', scene([[art('cup', { color: 0 }), BOT(290)]]), art('cup', { color: 1 }), art('cup', { color: 0 })],
  ['مَفْتُوح', 'الصُّنْدُوقُ مَفْتُوح', scene([[art('box', { color: 'open' }), BOT(290)]]), 'مُغْلَق', 'الصُّنْدُوقُ مُغْلَق', scene([[art('box', { color: 'closed' }), BOT(290)]]), art('box', { color: 'open' }), art('box', { color: 'closed' })],
  ['دَاخِل', 'القِطَّةُ دَاخِلَ الصُّنْدُوق', scene([[art('catbox'), BOT(300)]]), 'خَارِج', 'القِطَّةُ خَارِجَ الصُّنْدُوق', scene([[art('catout'), BOT(300)]]), art('catbox'), art('catout')],
  ['قَرِيب', 'السَّيَّارَةُ قَرِيبَة', scene([[art('car'), BOT(300)]], ROAD, road), 'بَعِيد', 'السَّيَّارَةُ بَعِيدَة', scene([[art('car'), AT(80, 80, '45%', '30%')]], ROAD, road), art('car'), art('car')],
  ['مُسْتَيْقِظ', 'الدُّبُّ مُسْتَيْقِظ', scene([[art('bear'), BOT(290)]]), 'نَائِم', 'الدُّبُّ نَائِم', scene([[withFace('sleep', () => art('bear')), BOT(290)]], '', '<div class="zzz">Z<small>z</small><small>z</small></div>'), art('bear'), withFace('sleep', () => art('bear'))],
  ['أَمَام', 'الكُرَةُ أَمَامَ الصُّنْدُوق', scene([[art('ballfront'), BOT(300)]]), 'خَلْف', 'الكُرَةُ خَلْفَ الصُّنْدُوق', scene([[art('ballbehind'), BOT(300)]]), art('ballfront'), art('ballbehind')],
  ['أَوَّل', 'البَطَّةُ الأُولَى', scene([[ducks, AT(660, 200, '15px', '80px')]], '', '<div class="mark first">⭐</div>'), 'آخِر', 'البَطَّةُ الأَخِيرَة', scene([[ducks, AT(660, 200, '15px', '80px')]], '', '<div class="mark last">⭐</div>'), art('duck'), art('duck')],
];

const hue = i => Math.round((i * 360 / 16 * 5 + 15) % 360);
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
  ${bubbles(1, 30, 12)}
  <div class="cpair">
    <div class="cp1">${art('elephant')}<b>كَبِير</b></div><div class="vs">⇄</div><div class="cp1 sm">${art('mouse')}<b>صَغِير</b></div>
  </div>
  <h1>${t3d('أَضْدَادِي', '#ffffff', '#c2364f', 12)}<br>${t3d('الجَمِيلَة', '#ffd23f', '#6a3fd0', 12)}</h1>
  <div class="csub">أَتَعَلَّمُ الكَلِمَةَ وَعَكْسَهَا</div>
  <div class="cen">My Lovely Opposites</div>
  <div class="cart">
    <div class="ca ca0">${art('sun')}</div><div class="ca ca1">${art('snowman')}</div>
    <div class="ca ca2">${art('cup', { color: 1 })}</div><div class="ca ca3">${art('cup', { color: 0 })}</div>
    <div class="ca ca4">${art('racecar')}</div><div class="ca ca5">${art('snail')}</div>
  </div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:330">
  ${bubbles(2, 330)}
  <div class="owner">
    ${art('catbox', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#c2367a', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('sun', { cls: 'mini' })}${art('moon', { cls: 'mini' })}${art('hotair', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(3, 180)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1d7fa8')}
    <div class="card">
      <p>تَعَلُّمُ الأَضْدَادِ يُسَاعِدُ الطِّفْلَ عَلَى فَهْمِ العَالَمِ مِنْ حَوْلِه! 🌟</p>
      <ul>
        <li>اقْرَؤُوا الكَلِمَتَيْنِ وَقَارِنُوا بَيْنَ الصُّورَتَيْن.</li>
        <li>اسْأَلُوا: أَيُّهُمَا كَبِير؟ وَأَيُّهُمَا صَغِير؟</li>
        <li>مَثِّلُوا الكَلِمَاتِ بِالحَرَكَة: سَرِيع وَبَطِيء، فَوْق وَتَحْت.</li>
        <li>ابْحَثُوا عَنِ الأَضْدَادِ فِي البَيْتِ وَالشَّارِع.</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('box', { color: 'open', cls: 'mini' })}${withFace('sleep', () => art('bear', { cls: 'mini' }))}${art('catout', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(4, 45)}
  ${title('أَضْدَادُ الكِتَاب', '#c46a00')}
  <div class="ov">${PAIRS.map((p, i) => `<div class="ovc" style="--h:${hue(i)}">${p[6]}<b>${p[0]}</b><span>⇄</span><b>${p[3]}</b>${p[7]}</div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–20 ---------- One page per pair
PAIRS.forEach(([wa, sa, sca, wb, sb, scb], i) => {
  const h = hue(i);
  const half = (w, s, sc, cls) => `<div class="half ${cls}">${sc}<div class="lab">${t3d(w, cls === 'a' ? `hsl(${h},75%,48%)` : `hsl(${(h + 40) % 360},75%,48%)`, cls === 'a' ? `hsl(${h},60%,30%)` : `hsl(${(h + 40) % 360},60%,30%)`, 6)}<span>${s}</span></div></div>`;
  pages.push(`
  <section class="page pair" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="ptitle">${t3d(wa, `hsl(${h},75%,48%)`, `hsl(${h},60%,30%)`, 6)}<i>⇄</i>${t3d(wb, `hsl(${(h + 40) % 360},75%,48%)`, `hsl(${(h + 40) % 360},60%,30%)`, 6)}</div>
    ${half(wa, sa, sca, 'a')}
    ${half(wb, sb, scb, 'b')}
    ${pno(P++)}
  </section>`);
});

// 21 ---------- Match opposites
const MO = [[art('elephant'), 'كَبِير', art('snowman'), 'بَارِد'], [art('sun'), 'حَارّ', art('mouse'), 'صَغِير'], [art('racecar'), 'سَرِيع', withFace('sad', () => art('cat')), 'حَزِين'],
  [art('hotair'), 'فَوْق', art('snail'), 'بَطِيء'], [art('cat'), 'سَعِيد', art('submarine'), 'تَحْت']];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(40, 20)}
  ${title('صِلْ كُلَّ كَلِمَةٍ بِعَكْسِهَا', '#e0482c')}
  <div class="hint">ارْسُمْ خَطًّا بَيْنَ الكَلِمَةِ وَعَكْسِهَا ✏️</div>
  <div class="match">${MO.map(([a, wa, b, wb]) => `<div class="mrow"><div class="mc">${a}<b>${wa}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc">${b}<b>${wb}</b></div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 22 ---------- Which is bigger?
const BIG = [['apple', 70, 140], ['fish', 150, 80], ['duck', 90, 150], ['sun', 150, 70]];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(41, 150)}
  ${title('أَيُّهُمَا أَكْبَر؟', '#1f9d63')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الصُّورَةِ الأَكْبَر ⭕</div>
  ${BIG.map(([a, x, y]) => `<div class="cmp"><div class="box">${art(a).replace('<svg ', `<svg style="width:${x}px;height:${x}px" `)}</div><div class="box">${art(a).replace('<svg ', `<svg style="width:${y}px;height:${y}px" `)}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 23 ---------- Draw the opposite
const DR = [['كَثِير', `<div class="many sm">${Array.from({ length: 5 }, () => art('apple')).join('')}</div>`, 'قَلِيل'], ['مُمْتَلِئ', art('cup', { color: 1 }), 'فَارِغ'], ['كَبِير', art('sun'), 'صَغِير']];
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(42, 270)}
  ${title('ارْسُمِ العَكْس', '#6a3fd0')}
  <div class="hint">انْظُرْ إِلَى الصُّورَةِ ثُمَّ ارْسُمْ عَكْسَهَا فِي المُرَبَّعِ الفَارِغ 🖍️</div>
  ${DR.map(([wa, img, wb]) => `<div class="drow"><div class="dbox">${img}<b>${wa}</b></div><i>⇄</i><div class="dbox empty"><b>${wb}</b></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 24 ---------- Choose the opposite word
const QZ = [['كَبِير', ['طَوِيل', 'صَغِير', 'سَرِيع']], ['حَارّ', ['بَارِد', 'فَوْق', 'كَثِير']], ['لَيْل', ['قَرِيب', 'نَهَار', 'دَاخِل']], ['مَفْتُوح', ['مُغْلَق', 'خَفِيف', 'أَوَّل']], ['فَوْق', ['أَمَام', 'سَعِيد', 'تَحْت']]];
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(43, 200)}
  ${title('اخْتَرِ العَكْس', '#2a6fd4')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الكَلِمَةِ المُعَاكِسَة ⭕</div>
  ${QZ.map(([w, opts], j) => `<div class="qrow" style="--h:${hue(j * 3)}"><div class="qw">${w}</div><i>←</i>${opts.map(o => `<div class="qo">${o}</div>`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 25–26 ---------- Colouring
for (const [ttl, items, h] of [['لَوِّنِ الكَبِيرَ وَالصَّغِير', [['elephant', 'c1'], ['mouse', 'c2']], 30], ['لَوِّنِ النَّهَار', [['house', 'c3'], ['sun', 'c4'], ['hotair', 'c5']], 200]]) {
  pages.push(`
  <section class="page plain" style="--h:${h}">
    ${title(ttl, `hsl(${h},65%,38%)`)}
    <div class="colorbox">${items.map(([a, c]) => art(a, { cls: 'outline ' + c })).join('')}
      <div class="ref">${items.map(([a]) => art(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
    ${pno(P++)}
  </section>`);
}

// 27 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَلَّمَ الكَلِمَاتِ وَأَضْدَادَهَا<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${art('elephant')}${art('cat')}${art('mouse')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 28 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 30, 12)}
  <h2>${t3d('أَضْدَادِي الجَمِيلَة', '#fff', '#c2364f', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَلِّمُ طِفْلَكَ سِتَّةَ عَشَرَ زَوْجًا مِنَ الأَضْدَادِ بِاللُّغَةِ العَرَبِيَّة.</p>
    <ul><li>كَبِير وَصَغِير، سَرِيع وَبَطِيء، فَوْق وَتَحْت ...</li><li>صُوَرٌ تُوَضِّحُ المَعْنَى وَجُمَلٌ قَصِيرَة</li><li>أَلْعَابُ التَّوْصِيلِ وَالرَّسْمِ وَالاخْتِيَار</li><li>صَفَحَاتُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn opposites in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">
    <div class="ca ca0">${art('box', { color: 'open' })}</div><div class="ca ca1">${art('box', { color: 'closed' })}</div>
    <div class="ca ca2">${art('bear')}</div><div class="ca ca3">${withFace('sleep', () => art('bear'))}</div>
  </div>
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
.ttl{position:relative;text-align:center;font-size:60px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,35%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(120,90,200,.22),0 16px 26px rgba(40,20,80,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(40,20,80,.2))}
/* cover */
.cover{--h:30;background:radial-gradient(circle at 50% 38%,#fffbe0,#ffd0b8 42%,#ff9fb8 75%,#e2678f);text-align:center;padding:40px}
.cpair{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:20px;height:250px}
.cp1{text-align:center}.cp1 svg{width:230px;height:230px;filter:drop-shadow(0 10px 10px rgba(80,20,40,.3))}.cp1.sm svg{width:110px;height:110px}
.cp1 b{display:inline-block;font-size:26px;font-weight:800;color:#c2364f;background:#fff;padding:0 16px;border-radius:18px;margin-top:-10px}
.vs{font-size:60px;font-weight:800;color:#fff;margin-bottom:60px;text-shadow:0 3px 0 #c2364f}
.cover h1{position:relative;font-size:126px;line-height:1.1;margin-top:10px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:30px;font-weight:800;color:#c2364f;background:#fff;padding:2px 30px;border-radius:30px;box-shadow:0 6px 0 #ffc2c9,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #c2364f;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:250px}
.ca{position:absolute;filter:drop-shadow(0 10px 10px rgba(80,20,40,.28))}.ca svg{width:100%;height:100%}
.ca0{width:150px;height:150px;left:20px;bottom:30px}.ca1{width:150px;height:150px;left:150px;bottom:20px}.ca2{width:140px;height:140px;left:330px;bottom:40px}
.ca3{width:140px;height:140px;left:440px;bottom:40px}.ca4{width:160px;height:160px;right:110px;bottom:60px}.ca5{width:120px;height:120px;right:10px;bottom:20px}
.cart.small .ca0{width:190px;height:190px;left:30px;bottom:20px}.cart.small .ca1{width:190px;height:190px;left:200px;bottom:20px}
.cart.small .ca2{width:190px;height:190px;left:auto;right:200px;bottom:20px}.cart.small .ca3{width:190px;height:190px;right:30px;left:auto;bottom:20px}
.back h2{position:relative;font-size:84px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#c2364f;font-size:19px;margin-top:8px}
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
.ov{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:12px 16px;margin-top:20px}
.ovc{display:flex;align-items:center;justify-content:space-between;gap:4px;height:100px;background:#fff;border-radius:26px;padding:0 10px;box-shadow:0 5px 0 hsl(var(--h),55%,74%),0 10px 14px rgba(40,20,80,.1)}
.ovc svg{width:76px;height:76px;flex:none}.ovc b{font-size:24px;font-weight:800;color:hsl(var(--h),60%,38%);white-space:nowrap}.ovc span{font-size:24px;color:#9b90b2}
/* pair page */
.pair{display:flex;flex-direction:column;gap:16px;padding-top:30px}
.ptitle{position:relative;text-align:center;font-size:70px;display:flex;justify-content:center;align-items:center;gap:20px}
.ptitle i{font-style:normal;font-family:Fredoka;font-size:52px;color:hsl(var(--h),40%,55%)}
.half{position:relative;height:448px;background:#fff;border-radius:36px;padding:12px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.scene{position:relative;height:316px;border-radius:26px;overflow:hidden;background:radial-gradient(circle at 50% 40%,#fff,hsl(var(--h),80%,93%))}
.it{position:absolute}.it svg{width:100%;height:100%;filter:drop-shadow(0 8px 8px rgba(40,20,80,.15))}
.lab{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:12px}
.lab .t3d{font-size:68px}.lab span{font-size:30px;font-weight:800;color:hsl(var(--h),45%,35%);background:hsl(var(--h),80%,95%);padding:2px 22px;border-radius:24px}
.many{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.many svg{width:136px !important;height:136px !important}
.many.sm svg{width:90px !important;height:90px !important}
.speed{position:absolute;left:30px;top:120px;width:140px;height:80px;background:repeating-linear-gradient(#fff0 0 14px,#ffb46b 14px 20px);opacity:.7;border-radius:10px}
.star{position:absolute;width:14px;height:14px;background:#fff6b0;border-radius:50%;box-shadow:0 0 10px #fff6b0}
.road{position:absolute;left:50%;bottom:0;width:640px;height:190px;transform:translateX(-50%);background:#8a93a8;clip-path:polygon(47% 0,53% 0,100% 100%,0 100%)}
.zzz{position:absolute;left:66%;top:20px;font-family:Fredoka;font-weight:700;font-size:54px;color:#7b8cff}.zzz small{font-size:36px;margin-left:4px}
.ducks{display:flex;justify-content:space-between}.ducks svg{width:126px !important;height:126px !important}
.mark{position:absolute;top:10px;font-size:54px}.mark.first{right:50px}.mark.last{left:50px}
/* activities */
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:112px;height:112px;margin:0 auto}.mc b{font-size:24px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.cmp{position:relative;display:flex;gap:24px;margin-top:26px}
.box{flex:1;height:180px;background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.drow{position:relative;display:flex;align-items:center;gap:16px;margin-top:26px}
.drow>i{font-style:normal;font-family:Fredoka;font-size:50px;color:hsl(var(--h),50%,50%)}
.dbox{flex:1;height:250px;background:#fff;border-radius:30px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:12px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.dbox svg{width:180px;height:180px}.dbox b{font-size:28px;font-weight:800;color:hsl(var(--h),55%,35%)}
.dbox.empty{border:5px dashed hsl(var(--h),55%,65%);justify-content:flex-end}
.qrow{position:relative;display:flex;align-items:center;gap:14px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.qw{min-width:170px;text-align:center;font-size:40px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:24px;padding:2px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,34%)}
.qrow>i{font-style:normal;font-family:Fredoka;font-size:36px;color:hsl(var(--h),40%,55%)}
.qo{flex:1;text-align:center;font-size:34px;font-weight:800;background:#fff;border-radius:22px;padding:4px 6px;box-shadow:0 4px 0 hsl(var(--h),40%,80%)}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}
.c1{width:520px;height:520px;left:10px;top:70px}.c2{width:260px;height:260px;right:30px;bottom:30px}
.c3{width:480px;height:480px;left:20px;bottom:20px}.c4{width:260px;height:260px;right:150px;top:20px}.c5{width:220px;height:220px;left:30px;top:30px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.ref{position:absolute;top:18px;right:18px;width:120px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أضدادي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
