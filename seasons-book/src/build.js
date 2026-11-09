// Builds "فصولي الجميلة" – a 3D-style Arabic weather, seasons & days book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art } = require('./weather-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';
const tree = s => art('tree', { color: s });

// [word, english, art, sky, sentence, what-I-do, do-icon]
const WEATHER = [
  ['مُشْمِس', 'Sunny', 'sun', 'linear-gradient(#7fd0ff,#fff6c9)', 'الجَوُّ مُشْمِسٌ وَجَمِيل', 'أَلْبَسُ قُبَّعَة', art('sunhat')],
  ['غَائِم', 'Cloudy', 'cloud2', 'linear-gradient(#a9c4de,#e6eef7)', 'السَّمَاءُ مَلِيئَةٌ بِالغُيُوم', 'أَلْعَبُ فِي الحَدِيقَة', art('flower')],
  ['مُمْطِر', 'Rainy', 'raincloud', 'linear-gradient(#8aa6c4,#dbe6f2)', 'المَطَرُ يَنْزِلُ مِنَ السَّمَاء', 'أَحْمِلُ مِظَلَّة', art('umbrella')],
  ['عَاصِف', 'Windy', 'windy', 'linear-gradient(#9fe3e0,#effbf7)', 'الرِّيحُ قَوِيَّةٌ اليَوْم', 'أُطَيِّرُ طَائِرَةً وَرَقِيَّة', art('kite')],
  ['مُثْلِج', 'Snowy', 'snowy', 'linear-gradient(#bfe0ff,#ffffff)', 'الثَّلْجُ أَبْيَضُ وَبَارِد', 'أَلْبَسُ قُبَّعَةً صُوفِيَّة', art('beanie')],
  ['عَاصِفَةٌ رَعْدِيَّة', 'Stormy', 'storm', 'linear-gradient(#4a5878,#9aa8c4)', 'أَسْمَعُ الرَّعْدَ وَأَرَى البَرْق', 'أَبْقَى فِي البَيْت', art('house')],
  ['قَوْسُ قُزَح', 'Rainbow', 'rainbow', 'linear-gradient(#8fd3ff,#ffffff)', 'قَوْسُ قُزَحَ أَلْوَانُهُ جَمِيلَة', 'أَعُدُّ الأَلْوَان', art('butterfly')],
  ['ضَبَابِيّ', 'Foggy', 'fog', 'linear-gradient(#c9d3df,#f2f5f9)', 'الضَّبَابُ يُغَطِّي الطَّرِيق', 'أَمْشِي بِحَذَر', art('car')],
];
// [season, english, tree, sky, sentence, items [[art, name]...]]
const SEASONS = [
  ['الرَّبِيع', 'Spring', 'spring', 'linear-gradient(#bde9ff,#eaffe0)', 'الأَزْهَارُ تَتَفَتَّحُ فِي الرَّبِيع', [['flower', 'زَهْرَة'], ['butterfly', 'فَرَاشَة'], ['bee', 'نَحْلَة']]],
  ['الصَّيْف', 'Summer', 'summer', 'linear-gradient(#7fd0ff,#fff3c4)', 'الجَوُّ حَارٌّ فِي الصَّيْف', [['sun', 'شَمْس'], ['watermelon', 'بِطِّيخ'], ['sunhat', 'قُبَّعَة']]],
  ['الخَرِيف', 'Autumn', 'autumn', 'linear-gradient(#ffe0b8,#fff6e6)', 'الأَوْرَاقُ تَتَسَاقَطُ فِي الخَرِيف', [['leaf', 'وَرَقَةُ شَجَر'], ['pomegranate', 'رُمَّان'], ['kite', 'طَائِرَةٌ وَرَقِيَّة']]],
  ['الشِّتَاء', 'Winter', 'winter', 'linear-gradient(#bfe0ff,#ffffff)', 'الجَوُّ بَارِدٌ فِي الشِّتَاء', [['snowman', 'رَجُلُ الثَّلْج'], ['beanie', 'قُبَّعَةٌ صُوفِيَّة'], ['snowflake', 'نُدْفَةُ ثَلْج']]],
];
const DAYS = ['السَّبْت', 'الأَحَد', 'الإِثْنَيْن', 'الثُّلَاثَاء', 'الأَرْبِعَاء', 'الخَمِيس', 'الجُمُعَة'];

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
const hue = i => Math.round((i * 360 / 12 * 5 + 190) % 360);

const pages = [];
let P = 1;

// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, 190, 12)}
  <div class="ctop">${['sun', 'rainbow', 'raincloud'].map((a, k) => `<div class="ct ct${k}">${art(a)}</div>`).join('')}</div>
  <h1>${t3d('فُصُولِي', '#ffd23f', '#e07b00', 12)}<br>${t3d('الجَمِيلَة', '#ffffff', '#2a6fd4', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى الطَّقْسِ وَفُصُولِ السَّنَة</div>
  <div class="cen">My Lovely Seasons &amp; Weather</div>
  <div class="cart">${['spring', 'summer', 'autumn', 'winter'].map((s, k) => `<div class="ca ca${k}">${tree(s)}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(2, 200)}
  <div class="owner">
    ${art('umbrella', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#2a6fd4', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('kite', { cls: 'mini' })}${art('snowflake', { cls: 'mini' })}${art('leaf', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:140">
  ${bubbles(3, 140)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1f9d63')}
    <div class="card">
      <p>هَيَّا نَتَعَرَّفُ عَلَى الطَّقْسِ وَالفُصُولِ وَأَيَّامِ الأُسْبُوع! 🌦️</p>
      <ul>
        <li>انْظُرُوا مِنَ النَّافِذَةِ كُلَّ صَبَاحٍ وَاسْأَلُوا: كَيْفَ الطَّقْسُ اليَوْم؟</li>
        <li>اقْرَؤُوا الجُمْلَةَ القَصِيرَةَ وَتَحَدَّثُوا عَمَّا نَفْعَلُهُ فِي كُلِّ طَقْس.</li>
        <li>لَاحِظُوا كَيْفَ تَتَغَيَّرُ الشَّجَرَةُ فِي كُلِّ فَصْل.</li>
        <li>رَدِّدُوا أَيَّامَ الأُسْبُوعِ مَعًا، وَامْلَؤُوا مُفَكِّرَةَ الطَّقْس.</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${tree('spring').replace('<svg ', '<svg class="mini" ')}${art('rainbow', { cls: 'mini' })}${tree('autumn').replace('<svg ', '<svg class="mini" ')}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:205">
  ${bubbles(4, 205)}
  ${title('الطَّقْس', '#2a6fd4')}
  <div class="ovg">${WEATHER.map(w => `<div class="ovc">${art(w[2])}<b>${w[0]}</b></div>`).join('')}</div>
  ${title('فُصُولُ السَّنَة', '#1f9d63')}
  <div class="ovg">${SEASONS.map(s => `<div class="ovc">${tree(s[2])}<b>${s[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–12 ---------- Weather pages
WEATHER.forEach(([w, en, a, sky, sent, todo, icon], i) => {
  const h = hue(i);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(w, '#fff', `hsl(${h},60%,35%)`, 9, w.length > 9 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="sky" style="background:${sky}">${art(a, { cls: 'ill' })}</div>
    <div class="sent">${sent}</div>
    <div class="chips"><div class="chip wide">${icon}<div><small>مَاذَا أَفْعَل؟</small><b>${todo}</b></div></div></div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الكَلِمَة</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(w.length > 9 ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${w}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 13–16 ---------- Season pages
SEASONS.forEach(([s, en, tr, sky, sent, items], i) => {
  const h = [120, 45, 25, 205][i];
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 30, h)}
    <div class="iname"><span class="snum">الفَصْلُ ${['الأَوَّل', 'الثَّانِي', 'الثَّالِث', 'الرَّابِع'][i]}</span>${t3d('فَصْلُ ' + s, '#fff', `hsl(${h},60%,35%)`, 9, 'big long')}<span class="en">${en}</span></div>
    <div class="sky" style="background:${sky}">${tree(tr).replace('<svg ', '<svg class="ill" ')}</div>
    <div class="sent">${sent}</div>
    <div class="sitems">${items.map(([a, n]) => `<div class="si">${art(a)}<b>${n}</b></div>`).join('')}</div>
    ${pno(P++)}
  </section>`);
});

// 17 ---------- The four seasons cycle
pages.push(`
<section class="page plain" style="--h:100">
  ${bubbles(40, 100)}
  ${title('الفُصُولُ الأَرْبَعَة', '#1f9d63')}
  <div class="hint">تَتَكَرَّرُ الفُصُولُ كُلَّ سَنَةٍ بِهٰذَا التَّرْتِيب 🔄</div>
  <div class="cycle">
    ${SEASONS.map((s, k) => `<div class="cy cy${k}">${tree(s[2])}<b>${s[0]}</b></div>`).join('')}
    <div class="arrows">⟳</div>
  </div>
  ${pno(P++)}
</section>`);

// 18 ---------- Days of the week
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(41, 270)}
  ${title('أَيَّامُ الأُسْبُوع', '#6a3fd0')}
  <div class="hint">فِي الأُسْبُوعِ سَبْعَةُ أَيَّام 📅</div>
  <div class="days">${DAYS.map((d, k) => `<div class="day" style="--h:${(k * 51 + 10) % 360}"><i>${AR(k + 1)}</i><b>${d}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 19 ---------- Weather diary
pages.push(`
<section class="page plain" style="--h:190">
  ${bubbles(42, 190)}
  ${title('مُفَكِّرَةُ الطَّقْس', '#1d7fa8')}
  <div class="hint">ارْسُمْ أَوْ ضَعْ عَلَامَةً عَلَى طَقْسِ كُلِّ يَوْم ✏️</div>
  <div class="legend">${['sun', 'cloud2', 'raincloud', 'windy', 'snowflake'].map(a => art(a)).join('')}</div>
  <div class="diary">${DAYS.map(d => `<div class="drw"><b>${d}</b><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 20 ---------- Match weather to what we use
const MW = [['sun', 'umbrella', 'مُشْمِس', 'مِظَلَّة'], ['raincloud', 'beanie', 'مُمْطِر', 'قُبَّعَةٌ صُوفِيَّة'], ['snowflake', 'kite', 'مُثْلِج', 'طَائِرَةٌ وَرَقِيَّة'], ['windy', 'sunhat', 'عَاصِف', 'قُبَّعَة']];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(43, 20)}
  ${title('مَاذَا أَحْتَاج؟', '#e0482c')}
  <div class="hint">صِلْ كُلَّ طَقْسٍ بِمَا نَحْتَاجُهُ فِيه ✏️</div>
  <div class="match">${MW.map(([a, b, wa, wb]) => `<div class="mrow"><div class="mc">${art(a)}<b>${wa}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc">${art(b)}<b>${wb}</b></div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 21 ---------- Which season?
const SORT = [['flower', 'زَهْرَة'], ['snowman', 'رَجُلُ الثَّلْج'], ['watermelon', 'بِطِّيخ'], ['leaf', 'وَرَقَةُ شَجَر'], ['butterfly', 'فَرَاشَة'], ['beanie', 'قُبَّعَةٌ صُوفِيَّة']];
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(44, 45)}
  ${title('فِي أَيِّ فَصْل؟', '#c46a00')}
  <div class="hint">ضَعْ عَلَامَةَ ✓ عَلَى الفَصْلِ المُنَاسِب</div>
  <div class="sort">${SORT.map(([a, n]) => `<div class="sc">${art(a)}<b>${n}</b><div class="opts">${['رَبِيع', 'صَيْف', 'خَرِيف', 'شِتَاء'].map(o => `<span><i></i>${o}</span>`).join('')}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 22 ---------- Counting
const COUNT = [['sun', 2], ['cloud2', 4], ['snowflake', 5], ['umbrella', 3]];
pages.push(`
<section class="page plain" style="--h:220">
  ${bubbles(45, 220)}
  ${title('كَمْ عَدَدُهَا؟', '#2a6fd4')}
  <div class="hint">عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => art(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 23 ---------- Odd one out
const ODD = [['sun', 'sun', 'snowflake', 'sun'], ['umbrella', 'kite', 'umbrella', 'umbrella'], ['leaf', 'leaf', 'leaf', 'flower'], ['snowman', 'watermelon', 'snowman', 'snowman']];
pages.push(`
<section class="page plain" style="--h:300">
  ${bubbles(46, 300)}
  ${title('أَيُّهَا مُخْتَلِف؟', '#9b3fd0')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الصُّورَةِ المُخْتَلِفَة ⭕</div>
  ${ODD.map(r => `<div class="odd">${r.map(a => `<div>${art(a)}</div>`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 24 ---------- Draw today's weather
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(47, 180)}
  ${title('ارْسُمِ الطَّقْسَ اليَوْم', '#1d7fa8')}
  <div class="hint">انْظُرْ مِنَ النَّافِذَةِ وَارْسُمْ مَا تَرَاه 🪟</div>
  <div class="window"><i></i><i></i><i></i><i></i></div>
  <div class="todayrow"><span>اليَوْم: ....................</span><span>الطَّقْس: ....................</span></div>
  ${pno(P++)}
</section>`);

// 25–26 ---------- Colouring
for (const [ttl, items, h] of [['لَوِّنْ قَوْسَ قُزَح', [['rainbow', 'c1'], ['umbrella', 'c2'], ['sun', 'c3']], 200], ['لَوِّنِ الشَّجَرَة', [['tree', 'c4', 'summer'], ['leaf', 'c5']], 120]]) {
  pages.push(`
  <section class="page plain" style="--h:${h}">
    ${title(ttl, `hsl(${h},65%,38%)`)}
    <div class="colorbox">${items.map(([a, c, p]) => art(a, { cls: 'outline ' + c, color: p })).join('')}
      <div class="ref">${items.map(([a, , p]) => art(a, { color: p })).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
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
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى الطَّقْسِ وَالفُصُول<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${art('sun')}${art('rainbow')}${art('snowflake')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 28 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 190, 12)}
  <h2>${t3d('فُصُولِي الجَمِيلَة', '#fff', '#2a6fd4', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَرِّفُ طِفْلَكَ عَلَى الطَّقْسِ وَفُصُولِ السَّنَةِ وَأَيَّامِ الأُسْبُوع.</p>
    <ul><li>٨ أَنْوَاعٍ مِنَ الطَّقْس</li><li>الفُصُولُ الأَرْبَعَة وَشَجَرَةُ كُلِّ فَصْل</li><li>أَيَّامُ الأُسْبُوعِ وَمُفَكِّرَةُ الطَّقْس</li><li>أَلْعَابٌ وَصَفَحَاتُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn weather, seasons &amp; days in Arabic · Ages 3–7</p>
  </div>
  <div class="cart small">${['windy', 'umbrella', 'snowy', 'kite'].map((a, k) => `<div class="ca ca${k}">${art(a)}</div>`).join('')}</div>
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
.cover{--h:190;background:radial-gradient(circle at 50% 38%,#ffffff,#d6f0ff 40%,#9fd6f7 72%,#58a8e8);text-align:center;padding:40px}
.ctop{position:relative;height:200px}
.ct{position:absolute;filter:drop-shadow(0 10px 10px rgba(20,40,80,.25))}.ct svg{width:100%;height:100%}
.ct0{width:170px;height:170px;left:40px;top:20px}.ct1{width:230px;height:230px;left:262px;top:-30px}.ct2{width:170px;height:170px;right:40px;top:20px}
.cover h1{position:relative;font-size:126px;line-height:1.12}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#1d5fa8;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #a9d4f5,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:24px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #2a6fd4;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:300px;display:flex;justify-content:space-around;align-items:flex-end;padding:0 10px 10px}
.ca{position:relative;width:180px;height:180px;filter:drop-shadow(0 10px 10px rgba(20,40,80,.25))}.ca svg{width:100%;height:100%}
.cart .ca1,.cart .ca2{width:200px;height:200px}
.back h2{position:relative;font-size:84px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#2a6fd4;font-size:18px;margin-top:8px}
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
.ovg{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:8px 12px;margin:10px 0}
.ovc{text-align:center;background:rgba(255,255,255,.7);border-radius:26px;padding:6px 0 10px;box-shadow:0 5px 0 hsl(var(--h),50%,78%)}
.ovc svg{width:130px;height:130px;margin:0 auto}.ovc b{font-size:21px;font-weight:800;white-space:nowrap}
/* item pages */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:90px}.iname .big.long{font-size:74px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,40%);direction:ltr;margin-top:-6px}
.snum{display:inline-block;font-size:22px;font-weight:800;color:#fff;background:hsl(var(--h),60%,48%);padding:0 18px;border-radius:18px;margin-bottom:4px}
.sky{position:relative;height:460px;border-radius:40px;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 6px rgba(255,255,255,.7),0 10px 0 hsl(var(--h),45%,70%),0 20px 26px rgba(40,20,80,.2)}
.ill{width:430px;height:430px;filter:drop-shadow(0 10px 12px rgba(40,20,80,.18))}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:34px;font-weight:800;color:hsl(var(--h),60%,32%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.chips{position:relative;display:flex;justify-content:center}
.chip{height:110px;border-radius:30px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:16px;padding:0 26px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.chip svg{width:96px;height:96px}.chip small{display:block;font-size:18px;font-weight:700;color:#8a80a3}.chip b{font-size:32px;font-weight:800;color:hsl(var(--h),65%,36%);line-height:1.3}
.trace{position:relative;margin:0 auto;width:690px;height:128px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}
.trace .solid{fill:hsl(var(--h),70%,45%)}.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
.sitems{position:relative;display:flex;gap:18px;justify-content:center}
.si{width:210px;height:220px;border-radius:30px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));text-align:center;padding-top:8px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.si svg{width:150px;height:150px;margin:0 auto}.si b{font-size:24px;font-weight:800;color:hsl(var(--h),60%,35%)}
/* activities */
.cycle{position:relative;margin:30px auto 0;width:690px;height:820px}
.cy{position:absolute;width:300px;text-align:center}.cy svg{width:270px;height:270px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(40,20,80,.2))}
.cy b{display:inline-block;font-size:34px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);padding:0 24px;border-radius:24px;box-shadow:0 5px 0 hsl(var(--h),60%,30%)}
.cy0{right:0;top:0}.cy1{left:0;top:0}.cy2{left:0;bottom:0}.cy3{right:0;bottom:0}
.cy0 b{background:#36b14f}.cy1 b{background:#ffb627}.cy2 b{background:#ff7a3d}.cy3 b{background:#4fa8ff}
.arrows{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scaleX(-1);font-size:220px;color:hsl(var(--h),50%,60%);opacity:.8}
.days{position:relative;display:flex;flex-direction:column;gap:18px;margin-top:30px;align-items:center}
.day{width:560px;height:96px;display:flex;align-items:center;gap:24px;padding:0 20px;border-radius:50px;background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,55%));
  box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 hsl(var(--h),65%,36%),0 14px 18px rgba(40,20,80,.2)}
.day i{font-style:normal;width:66px;height:66px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;color:hsl(var(--h),60%,40%)}
.day b{font-size:46px;font-weight:800;color:#fff;text-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.legend{position:relative;display:flex;justify-content:center;gap:16px;margin-top:14px}.legend svg{width:90px;height:90px;background:#fff;border-radius:22px;padding:4px}
.diary{position:relative;display:flex;flex-direction:column;gap:12px;margin-top:16px}
.drw{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:8px 16px;box-shadow:0 4px 0 hsl(var(--h),50%,78%)}
.drw b{width:170px;font-size:30px;font-weight:800;color:hsl(var(--h),60%,35%)}.drw i{flex:1;height:76px;border-radius:16px;border:4px dashed hsl(var(--h),50%,70%)}
.match{position:relative;margin-top:30px;display:flex;flex-direction:column;gap:26px}
.mrow{display:flex;align-items:center}
.mc{width:210px;height:170px;border-radius:28px;background:#fff;text-align:center;padding-top:6px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:124px;height:124px;margin:0 auto}.mc b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1.2}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.sort{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:26px}
.sc{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:30px;padding:8px 10px 14px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:130px;height:130px}.sc>b{font-size:26px;font-weight:800;color:hsl(var(--h),55%,32%)}
.opts{display:flex;gap:10px;margin-top:6px}.opts span{display:flex;align-items:center;gap:4px;font-size:19px;font-weight:800}
.opts i{width:26px;height:26px;border-radius:7px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.odd{position:relative;display:flex;justify-content:space-around;margin-top:30px;background:rgba(255,255,255,.8);border-radius:34px;padding:16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.odd svg{width:130px;height:130px}
.window{position:relative;margin:30px auto 0;width:620px;height:640px;border-radius:30px;background:#fff;border:22px solid #c98f4e;display:grid;grid-template-columns:1fr 1fr;
  box-shadow:0 12px 0 #9a6234,0 24px 30px rgba(40,20,80,.25)}
.window i{border:6px solid #c98f4e}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:40px;font-size:28px;font-weight:800;color:hsl(var(--h),55%,32%)}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.outline{position:absolute}
.c1{width:560px;height:560px;left:10px;top:40px}.c2{width:260px;height:260px;left:30px;bottom:20px}.c3{width:260px;height:260px;right:40px;bottom:30px}
.c4{width:600px;height:600px;left:20px;top:90px}.c5{width:200px;height:200px;left:20px;bottom:10px}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>فصولي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
