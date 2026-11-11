// Builds "مشاعري الجميلة" – a 3D-style Arabic book about feelings – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./feel-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [feeling, english, art, when do I feel it?, sentence]
const ITEMS = [
  ['سَعِيد', 'Happy', 'f_happy', 'عِنْدَمَا أَلْعَبُ مَعَ أَصْدِقَائِي', 'أَنَا سَعِيدٌ وَأَبْتَسِم'],
  ['حَزِين', 'Sad', 'f_sad', 'عِنْدَمَا تَنْكَسِرُ لُعْبَتِي', 'أَنَا حَزِينٌ وَأَحْتَاجُ عِنَاقًا'],
  ['غَاضِب', 'Angry', 'f_angry', 'عِنْدَمَا يَأْخُذُ أَحَدٌ لُعْبَتِي', 'أَنَا غَاضِبٌ وَأُحَاوِلُ أَنْ أَهْدَأ'],
  ['خَائِف', 'Scared', 'f_scared', 'عِنْدَمَا أَسْمَعُ صَوْتَ الرَّعْد', 'أَنَا خَائِفٌ فَأَذْهَبُ إِلَى أُمِّي'],
  ['مُتَفَاجِئ', 'Surprised', 'f_surprised', 'عِنْدَمَا أَرَى هَدِيَّةً جَمِيلَة', 'يَا لَلْمُفَاجَأَة!'],
  ['نَعْسَان', 'Sleepy', 'f_sleepy', 'فِي آخِرِ اللَّيْل', 'أَنَا نَعْسَانُ وَأُرِيدُ أَنْ أَنَام'],
  ['خَجُول', 'Shy', 'f_shy', 'عِنْدَمَا أُقَابِلُ شَخْصًا جَدِيدًا', 'أَنَا خَجُولٌ قَلِيلًا'],
  ['مُحِبّ', 'Loving', 'f_love', 'عِنْدَمَا أُعَانِقُ أُمِّي وَأَبِي', 'أُحِبُّ عَائِلَتِي كَثِيرًا'],
  ['ضَاحِك', 'Laughing', 'f_laugh', 'عِنْدَمَا أَسْمَعُ قِصَّةً مُضْحِكَة', 'أَضْحَكُ: هَا هَا هَا!'],
  ['فَخُور', 'Proud', 'f_proud', 'عِنْدَمَا أَنْجَحُ فِي عَمَلِي', 'أَنَا فَخُورٌ بِنَفْسِي'],
  ['هَادِئ', 'Calm', 'f_calm', 'عِنْدَمَا أَسْمَعُ القُرْآن', 'أَنَا هَادِئٌ وَمُرْتَاح'],
  ['مَرِيض', 'Sick', 'f_sick', 'عِنْدَمَا أُصَابُ بِالزُّكَام', 'أَنَا مَرِيضٌ وَأَحْتَاجُ الرَّاحَة'],
];
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '').replace(/^ال/, '')[0];
const hue = i => Math.round((i * 360 / 12 * 5 + 320) % 360);

const ring = (c, w = 2.5) => [[-w, 0], [w, 0], [0, -w], [0, w], [-w * .7, -w * .7], [w * .7, -w * .7], [-w * .7, w * .7], [w * .7, w * .7]].map(([x, y]) => `${x}px ${y}px 0 ${c}`).join(',');
const isWhite = c => /^#f{3}(f{3})?$/i.test(c) || c === 'white';
const t3d = (txt, top, side, depth = 8, cls = '') => {
  const sh = isWhite(top) ? [ring(side, 3)] : [];
  for (let i = 1; i <= depth; i++) sh.push(`0 ${i}px 0 ${side}`);
  sh.push(`0 ${depth + 4}px 14px rgba(10,30,70,.38)`);
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
const sea = '<i class="conf k1"></i><i class="conf k2"></i><i class="conf k3"></i><i class="conf k4"></i>';

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
  ${sea}
  <div class="ca cs0">${art('f_love')}</div><div class="ca cs1">${art('f_happy')}</div><div class="ca cs2">${art('f_surprised')}</div>
  <h1>${t3d('مَشَاعِرِي', '#ffffff', '#c2364f', 12)}<br>${t3d('الجَمِيلَة', '#ffd23f', '#6a3fd0', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى مَشَاعِرِي وَأُعَبِّرُ عَنْهَا</div>
  <div class="cen">My Feelings</div>
  <div class="ca cs3">${art('f_laugh')}</div><div class="ca cs4">${art('f_sad')}</div><div class="ca cs5">${art('f_angry')}</div><div class="ca cs6">${art('f_sleepy')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:330">
  ${bubbles(2, 330)}
  <div class="owner">
    ${art('f_happy', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#c2367a', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('f_love', { cls: 'mini' })}${art('f_proud', { cls: 'mini' })}${art('f_calm', { cls: 'mini' })}</div>
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
      <p>عِنْدَمَا يَعْرِفُ الطِّفْلُ اسْمَ شُعُورِهِ يَسْتَطِيعُ أَنْ يُعَبِّرَ عَنْه! 💛</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ الشُّعُورِ وَقَلِّدُوا الوَجْهَ مَعًا أَمَامَ المِرْآة.</li>
        <li>اسْأَلُوا طِفْلَكُم: مَتَى تَشْعُرُ بِهٰذَا؟</li>
        <li>أَخْبِرُوهُ أَنَّ كُلَّ المَشَاعِرِ طَبِيعِيَّة، وَالمُهِمُّ كَيْفَ نَتَصَرَّف.</li>
        <li>عَلِّمُوهُ مَاذَا يَفْعَلُ عِنْدَ الغَضَبِ كَمَا عَلَّمَنَا النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ.</li>
        <li>اسْتَعْمِلُوا جَدْوَلَ «كَيْفَ أَشْعُرُ اليَوْم؟» كُلَّ يَوْم.</li>
      </ul>
    </div>
    <div class="row3">${art('f_shy', { cls: 'mini' })}${art('f_scared', { cls: 'mini' })}${art('f_laugh', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:330">
  ${bubbles(4, 330)}
  ${title('مَشَاعِرُ الكِتَاب', '#c2367a')}
  <div class="ovg">${ITEMS.map(i => `<div class="ovc">${art(i[2])}<b>${i[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–16 ---------- One page per feeling
ITEMS.forEach(([name, en, ill, when, sentence], i) => {
  const h = hue(i);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,30%)`, 9, 'big')}<span class="en">${en}</span></div>
    <div class="water">${art(ill, { cls: 'ill' })}</div>
    <div class="sent">${sentence}</div>
    <div class="chips"><div class="chip wide"><i>💭</i><div><small>مَتَى أَشْعُرُ بِذٰلِك؟</small><b>${when}</b></div></div></div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الكَلِمَة</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${[590, 350, 115].map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 17 ---------- How would I feel?
const HW = [['gift', 'أَخَذْتُ هَدِيَّة', 'f_sad'], ['raincloud', 'سَمِعْتُ الرَّعْد', 'f_happy'], ['bed', 'حَانَ وَقْتُ النَّوْم', 'f_scared'], ['medal', 'فُزْتُ بِالسِّبَاق', 'f_sleepy'], ['toytrain', 'انْكَسَرَتْ لُعْبَتِي', 'f_proud']];
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(40, 45)}
  ${title('كَيْفَ أَشْعُر؟', '#c46a00')}
  <div class="hint">صِلْ كُلَّ مَوْقِفٍ بِالشُّعُورِ المُنَاسِب ✏️</div>
  <div class="match">${HW.map(([a, t, f]) => `<div class="mrow"><div class="mc">${art(a)}<b>${t}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc">${art(f)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 18 ---------- Match the face to its name
const MF = [['f_angry', 'خَائِف'], ['f_scared', 'مُتَفَاجِئ'], ['f_surprised', 'خَجُول'], ['f_shy', 'غَاضِب']];
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(41, 200)}
  ${title('صِلِ الوَجْهَ بِاسْمِه', '#2a6fd4')}
  <div class="hint">ارْسُمْ خَطًّا مِنْ كُلِّ وَجْهٍ إِلَى اسْمِ شُعُورِه 😊</div>
  <div class="match">${MF.map(([a, d]) => `<div class="mrow"><div class="mc">${art(a)}</div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mq">${d}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 19 ---------- When I get angry
const ANG = [['f_calm', 'أَقُولُ: أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيم', 'مُتَّفَقٌ عَلَيْه'], ['f_shy', 'أَسْكُتُ وَلَا أَقُولُ كَلَامًا سَيِّئًا', 'رَوَاهُ أَحْمَد'], ['chair', 'إِذَا كُنْتُ وَاقِفًا أَجْلِس', 'رَوَاهُ أَبُو دَاوُد'], ['f_love', 'أَتَكَلَّمُ مَعَ أُمِّي أَوْ أَبِي', '']];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(42, 150)}
  ${title('عِنْدَمَا أَغْضَب...', '#1f8f4f')}
  <div class="hint">هٰكَذَا عَلَّمَنَا النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَنْ نَهْدَأ 🌿</div>
  ${ANG.map(([a, t, s], k) => `<div class="lc"><i class="wo">${AR(k + 1)}</i>${art(a)}<div><b class="lt">${t}</b>${s ? `<span>📖 ${s}</span>` : ''}</div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 20 ---------- Mood tracker
const DAYS = ['السَّبْت', 'الأَحَد', 'الإِثْنَيْن', 'الثُّلَاثَاء', 'الأَرْبِعَاء', 'الخَمِيس', 'الجُمُعَة'];
pages.push(`
<section class="page plain" style="--h:265">
  ${bubbles(43, 265)}
  ${title('كَيْفَ أَشْعُرُ اليَوْم؟', '#6a3fd0')}
  <div class="hint">ارْسُمْ وَجْهَ شُعُورِكَ فِي كُلِّ يَوْم ✏️</div>
  <div class="legend2">${['f_happy', 'f_sad', 'f_angry', 'f_sleepy', 'f_calm'].map(a => art(a)).join('')}</div>
  <div class="mood">${DAYS.map(d => `<div class="md"><b>${d}</b><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 21 ---------- Draw your feeling
pages.push(`
<section class="page plain" style="--h:25">
  ${bubbles(44, 25)}
  ${title('ارْسُمْ شُعُورَك', '#c46a00')}
  <div class="hint">ارْسُمْ وَجْهًا يُعَبِّرُ عَنْ شُعُورِكَ الآن 🖍️</div>
  <div class="drawface"><div></div></div>
  <div class="todayrow"><span>أَشْعُرُ بِـ: ....................</span></div>
  ${pno(P++)}
</section>`);

// 22 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:330">
  ${title('لَوِّنِ الوُجُوه', '#c2367a')}
  <div class="colorbox">${[['f_laugh', 'c1'], ['f_love', 'c2'], ['f_surprised', 'c3']].map(([a, c]) => art(a, { cls: 'outline ' + c })).join('')}
    <div class="ref">${['f_laugh', 'f_love', 'f_surprised'].map(a => art(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
  ${pno(P++)}
</section>`);

// 23 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى مَشَاعِرِهِ وَعَبَّرَ عَنْهَا<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${art('f_happy')}${art('f_proud')}${art('f_love')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 24 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${sea}
  <h2>${t3d('مَشَاعِرِي الجَمِيلَة', '#fff', '#c2364f', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُسَاعِدُ طِفْلَكَ عَلَى فَهْمِ مَشَاعِرِهِ وَالتَّعْبِيرِ عَنْهَا.</p>
    <ul><li>١٢ شُعُورًا مَعَ الاسْمِ وَالمَوْقِف</li><li>عِنْدَمَا أَغْضَب: هَدْيُ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ</li><li>جَدْوَلُ «كَيْفَ أَشْعُرُ اليَوْم؟»</li><li>أَلْعَابٌ وَرَسْمٌ وَتَلْوِينٌ وَشَهَادَة</li></ul>
    <p class="en2">A joyful 3D picture book about feelings in Arabic · Ages 3–7</p>
  </div>
  <div class="ca bs0">${art('f_calm')}</div><div class="ca bs1">${art('f_shy')}</div><div class="ca bs2">${art('f_proud')}</div><div class="ca bs3">${art('f_sick')}</div>
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
.conf{position:absolute;width:14px;height:8px;border-radius:3px}
.k1{left:8%;top:14%;background:#ff4757;transform:rotate(20deg)}.k2{left:18%;top:30%;background:#ffd23f;transform:rotate(-30deg)}.k3{right:10%;top:16%;background:#4fa8ff;transform:rotate(40deg)}.k4{right:20%;top:34%;background:#36c45d;transform:rotate(-10deg)}
.desk{position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(#e0a868,#c98a4e);border-top:8px solid #b5733f}
.cloth{position:absolute;left:0;right:0;bottom:0;height:24%;background:repeating-conic-gradient(#ff6b6b 0 25%,#ffffff 0 50%) 0 0/40px 40px;opacity:.85;border-top:6px solid #e8573a}
.rail{position:absolute;left:6%;right:6%;top:9%;height:10px;border-radius:5px;background:linear-gradient(#e6ebf3,#9aa3b5)}
.floor{position:absolute;left:0;right:0;bottom:0;height:22%;background:repeating-linear-gradient(90deg,#e2b37a 0 60px,#d9a66a 60px 64px);box-shadow:inset 0 6px 0 rgba(0,0,0,.08)}
.t3d{font-family:Lalezar,Baloo;display:inline-block;line-height:1.15}
.wo{text-shadow:${ring('rgba(10,30,70,.8)', 1.6)}}
.pno{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;color:#fff;
  text-shadow:${ring('hsl(var(--h),60%,25%)', 1.4)};
  background:radial-gradient(circle at 35% 30%,hsl(var(--h),90%,75%),hsl(var(--h),70%,48%));box-shadow:0 4px 0 hsl(var(--h),60%,35%),0 8px 14px rgba(0,0,0,.2)}
svg{display:block}
.ttl{position:relative;text-align:center;font-size:56px;margin-top:10px}
.hint{position:relative;text-align:center;font-size:24px;font-weight:700;color:hsl(var(--h),45%,28%);margin-top:4px}
.card{position:relative;background:#fff;border-radius:34px;padding:24px 34px;box-shadow:0 8px 0 rgba(60,120,200,.22),0 16px 26px rgba(10,30,70,.15)}
.nameline{width:520px;height:86px;margin:24px auto;border-radius:44px;background:#fff;box-shadow:inset 0 4px 10px rgba(0,0,0,.08),0 6px 0 hsl(var(--h),50%,75%)}
.mini{width:170px;height:170px;filter:drop-shadow(0 8px 8px rgba(10,30,70,.2))}
/* cover */
.cover{background:radial-gradient(circle at 50% 40%,#fffaf2,#ffe0ef 50%,#e2d4ff 88%);text-align:center;padding:40px}
.cover h1{position:relative;font-size:130px;line-height:1.1;margin-top:230px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#c2364f;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #ffc2d6,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:${ring('#c2364f', 1.6)},0 3px 0 #c2364f;direction:ltr}
.ca{position:absolute;filter:drop-shadow(0 10px 12px rgba(10,30,70,.3))}.ca svg{width:100%;height:100%}
.cs0{width:200px;height:200px;left:30px;top:20px}.cs1{width:240px;height:240px;left:270px;top:0}.cs2{width:180px;height:180px;right:30px;top:40px}
.cs3{width:230px;height:230px;left:20px;bottom:30px}.cs4{width:230px;height:230px;left:280px;bottom:10px}.cs5{width:190px;height:190px;right:30px;bottom:40px}.cs6{width:110px;height:110px;right:220px;bottom:200px}
.back h2{position:relative;font-size:90px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#c2364f;font-size:19px;margin-top:8px}
.bs0{width:220px;height:220px;left:20px;bottom:20px}.bs1{width:170px;height:170px;left:250px;bottom:40px}.bs2{width:170px;height:170px;right:210px;bottom:40px}.bs3{width:200px;height:200px;right:20px;bottom:20px}
/* owner / note */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(10,30,70,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;text-shadow:${ring('#a8245a', 1.8)};
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:26px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ovg{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:24px}
.ovc{text-align:center;background:linear-gradient(#fff6ea,#ffd9a8);border-radius:24px;padding:6px 0 10px;box-shadow:0 5px 0 #e0a060,0 10px 14px rgba(80,40,0,.18)}
.ovc svg{width:126px;height:126px;margin:0 auto}
.ovc b{font-size:17px;font-weight:800;color:#fff;white-space:nowrap;text-shadow:${ring('#a0561a', 1.7)}}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:88px}.iname .big.long{font-size:66px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,32%);direction:ltr;margin-top:-6px}
.water{position:relative;height:460px;border-radius:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#ffffff,hsl(var(--h),80%,92%) 70%);
  box-shadow:inset 0 0 0 6px rgba(255,255,255,.4),0 10px 0 hsl(var(--h),45%,60%),0 20px 26px rgba(10,30,70,.25)}
.ill{position:relative;width:420px;height:420px;filter:drop-shadow(0 10px 14px rgba(10,30,70,.3))}
.sent{position:relative;margin:0 auto;padding:6px 36px;border-radius:50px;background:#fff;font-size:33px;font-weight:800;color:hsl(var(--h),60%,26%);
  box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(10,30,70,.15)}
.chips{position:relative;display:flex;gap:20px;justify-content:center}
.chip{width:330px;height:104px;border-radius:28px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,94%));display:flex;align-items:center;gap:14px;padding:0 18px;
  box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.chip i{font-style:normal;font-size:44px}.chip small{display:block;font-size:17px;font-weight:700;color:#6f6a8a}.chip b{font-size:28px;font-weight:800;color:hsl(var(--h),65%,30%);line-height:1.3}
.chip b.fl{font-size:44px;line-height:1}
.chip i.ab{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);border-radius:16px;padding:6px 10px;box-shadow:0 4px 0 hsl(var(--h),60%,34%)}
.trace{position:relative;margin:0 auto;width:690px;height:132px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#8a80a3}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:56px}.trace text.sm{font-size:40px}
.trace .solid{fill:hsl(var(--h),70%,40%)}.trace .dash{fill:#dcd5e8;stroke:none}
.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* activities */
.chip.wide{width:600px;justify-content:center}.chip.wide b{font-size:30px}
.lc{margin-top:22px !important}.lc b.lt{font-size:30px;line-height:1.5}.lc span{font-size:20px;color:#6a6080}
.legend2{position:relative;display:flex;justify-content:center;gap:16px;margin-top:14px}.legend2 svg{width:90px;height:90px}
.mood{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:20px}
.md{background:#fff;border-radius:26px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.md b{display:block;font-size:22px;font-weight:800;color:hsl(var(--h),55%,30%)}.md i{display:block;margin:8px auto 4px;width:120px;height:120px;border-radius:50%;border:4px dashed hsl(var(--h),50%,65%)}
.lawn{position:absolute;left:0;right:0;bottom:0;height:20%;background:linear-gradient(#9be07a,#5cc45a);border-radius:50% 50% 0 0/30% 30% 0 0}
.water{background:radial-gradient(circle at 50% 45%,#ffffff,hsl(var(--h),80%,92%) 70%) !important}
.lc{position:relative;display:flex;align-items:center;gap:16px;margin-top:4px;background:#fff;border-radius:32px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.lc>i{font-style:normal;width:56px;height:56px;border-radius:50%;background:hsl(var(--h),60%,45%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800}
.lc svg{width:140px;height:140px;flex:none}.lc b{display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,28%)}.lc span{font-size:24px;font-weight:700;color:#4a4060}
.arr{text-align:center;font-size:30px;color:hsl(var(--h),50%,45%);line-height:1.1}
.bigboard.garden{background:linear-gradient(#8fd477,#4fb84f)}.bigboard.garden div{background:linear-gradient(#ffffff 70%,#e6f8e0)}
.say{position:absolute;top:24px;right:24px;font-size:38px;font-weight:800;color:hsl(var(--h),70%,30%);background:#fff;border-radius:30px;padding:6px 24px;border:4px solid hsl(var(--h),60%,60%);box-shadow:0 6px 0 hsl(var(--h),50%,70%)}
.say:after{content:'';position:absolute;left:30px;bottom:-22px;border:12px solid transparent;border-top:14px solid hsl(var(--h),60%,60%)}
.ws{position:relative;display:flex;align-items:center;justify-content:space-around;margin-top:26px;background:rgba(255,255,255,.8);border-radius:34px;padding:12px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.ws svg{width:120px;height:120px}
.wsay{min-width:180px;text-align:center;font-size:36px;font-weight:800;color:#fff;background:hsl(var(--h),60%,48%);border-radius:24px;padding:6px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,32%);text-shadow:${ring('hsl(210,60%,22%)', 1.6)}}
.sense{position:relative;display:flex;align-items:center;gap:14px;margin-top:20px;background:#fff;border-radius:32px;padding:6px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.sense>i{font-style:normal;width:52px;height:52px;flex:none;border-radius:50%;background:hsl(var(--h),60%,52%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
.sense svg{width:120px;height:120px;flex:none}.sense div{flex:1}.sense b{display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,30%)}.sense span{font-size:26px;font-weight:700;color:#4a4060}
.mq{width:220px;height:120px;border-radius:28px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:hsl(var(--h),60%,28%);box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.crow>svg{width:130px;height:130px;flex:none}.hq{flex:1;font-size:34px;font-weight:800;color:hsl(var(--h),55%,30%)}
.drawface{position:relative;margin:30px auto 0;width:560px;height:620px;border-radius:50%;background:#fff;border:8px solid #f2b48a;box-shadow:0 12px 0 #e0a070,0 24px 30px rgba(80,40,0,.2)}
.drawface i{position:absolute;top:250px;width:70px;height:120px;border-radius:50%;background:#fff;border:8px solid #f2b48a}.drawface .e1{left:-60px}.drawface .e2{right:-60px}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:30px;font-size:30px;font-weight:800;color:hsl(var(--h),55%,30%)}
.lrow{position:relative;display:flex;gap:20px;margin-top:26px}
.lb{flex:1;height:170px;background:#fff;border-radius:30px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.lb svg{width:320px;height:112px}
.bigboard{position:relative;margin:30px auto 0;width:680px;height:600px;border-radius:24px;background:linear-gradient(#c98a4e,#a8693a);padding:22px;box-shadow:0 12px 0 #8b5a2b,0 24px 30px rgba(40,20,80,.25)}
.bigboard div{width:100%;height:100%;border-radius:12px;background:#ffffff;box-shadow:inset 0 0 0 4px #e6ebf3}
.mc.sk svg{width:120px;height:120px;margin-top:10px}
.bigshirt{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:600px;height:600px}
.tank .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.tank .outline [filter]{display:none}
.tank .outline circle{fill:#fff !important;stroke:#2b2340}
.tank .outline rect,.tank .outline path[fill="#ffffff"]{stroke:#2b2340 !important}
.pat{position:relative;margin-top:22px;background:rgba(255,255,255,.8);border-radius:34px;padding:8px 16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(40,20,80,.1)}
.seq{display:flex;align-items:center;justify-content:center;gap:4px}.seq svg{width:96px;height:96px}
.q{width:92px;height:92px;border-radius:24px;border:5px dashed hsl(var(--h),60%,60%);display:flex;align-items:center;justify-content:center;font-size:54px;font-weight:800;color:hsl(var(--h),60%,50%)}
.popts{display:flex;justify-content:center;gap:36px;margin-top:6px}.popts div{background:hsl(var(--h),80%,95%);border-radius:50%;padding:4px}.popts svg{width:64px;height:64px}
.sort{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px 20px;margin-top:18px}
.sc{display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:28px;padding:6px 10px 14px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.sc svg{width:96px;height:96px}.sc>b{font-size:24px;font-weight:800;color:hsl(var(--h),55%,28%)}
.opts{display:flex;gap:20px;margin-top:6px}.opts span{display:flex;align-items:center;gap:6px;font-size:21px;font-weight:800}
.opts i{width:30px;height:30px;border-radius:8px;border:3px solid hsl(var(--h),50%,55%);background:#fff}
.man{position:relative;display:flex;align-items:center;gap:16px;margin-top:26px;background:#fff;border-radius:34px;padding:12px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 18px rgba(40,20,80,.1)}
.man svg{width:130px;height:130px;flex:none}.man b{flex:1;font-size:30px;font-weight:800;color:hsl(var(--h),55%,28%)}
.mstars{display:flex;gap:8px}.mstars i{width:54px;height:54px;border-radius:14px;border:4px dashed #ffb627}
.todayrow{position:relative;display:flex;justify-content:space-around;margin-top:30px;font-size:30px;font-weight:800;color:hsl(var(--h),55%,30%)}
.crow{position:relative;display:flex;align-items:center;gap:20px;margin-top:30px;background:rgba(255,255,255,.75);border-radius:34px;padding:16px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,78%),0 12px 18px rgba(10,30,70,.1)}
.cimgs{flex:1;display:flex;justify-content:center;gap:2px}.cimgs svg{width:104px;height:104px}
.cans{width:100px;height:100px;flex:none;border-radius:50%;background:#fff;border:5px dashed hsl(var(--h),60%,60%)}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}
.mrow{display:flex;align-items:center}
.mc{width:200px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(10,30,70,.12)}
.mc svg{width:116px;height:116px;margin:0 auto}.mc b{font-size:21px;font-weight:800;color:hsl(var(--h),55%,28%);line-height:1}
.shadowimg svg{width:136px;height:136px;margin-top:4px;filter:brightness(0) opacity(.55)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 10px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.odd{position:relative;display:flex;justify-content:space-around;margin-top:30px;background:rgba(255,255,255,.8);border-radius:34px;padding:16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.odd svg{width:130px;height:130px}
.mazebox{position:relative;margin:30px auto 0;width:690px;height:820px;border-radius:40px;overflow:hidden;background:linear-gradient(#9fe3ff,#3fb0ec 70%,#1d7fc8);box-shadow:0 8px 0 #1d6fb8,0 16px 24px rgba(10,30,70,.3)}
.mazebox .sand{height:8%}
.mz{position:absolute;left:45px;top:80px;width:600px;height:676px}
.mzs{position:absolute;right:-4px;top:-10px;width:110px;height:110px}.mze{position:absolute;left:-4px;bottom:-14px;width:110px;height:110px}
.tank{position:relative;margin:40px auto 0;width:680px;height:700px;border-radius:30px;border:16px dashed #ffb627;background:#ffffff;overflow:hidden;box-shadow:0 12px 0 #5ab0e0,0 24px 30px rgba(10,30,70,.25)}
.tw{display:none}
.tsand{display:none}
.tc{position:absolute;right:20px;bottom:40px;width:220px;height:220px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(10,30,70,.15)}
.outline{position:absolute}
.c1{width:440px;height:440px;left:20px;top:40px}.c2{width:340px;height:340px;left:20px;bottom:20px}.c3{width:300px;height:300px;right:40px;bottom:60px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
.colorbox .outline rect:not([fill^="url"]){fill:#fff !important;stroke:#2b2340;stroke-width:1.4}
.colorbox .outline circle:not([fill^="url"]):not([fill="#fff"]):not([fill="#2b2340"]){fill:#fff !important;stroke:#2b2340;stroke-width:1.4}
.colorbox .outline path[fill="none"],.colorbox .outline circle[fill="none"]{stroke:#2b2340 !important;stroke-width:2 !important}
.ref{position:absolute;top:18px;right:18px;width:120px;text-align:center;border-radius:24px;background:hsl(var(--h),90%,95%);padding:6px}
.ref svg{width:80px;height:80px;margin:0 auto}.ref small{font-size:15px;font-weight:800;color:hsl(var(--h),55%,30%)}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>مشاعري الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
