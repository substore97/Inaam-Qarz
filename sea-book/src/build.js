// Builds "بحري الجميل" – a 3D-style Arabic book about sea creatures – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./sea-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, colour, sentence]
const ITEMS = [
  ['سَمَكَة', 'Fish', 'fish', 'بُرْتُقَالِيّ', 'السَّمَكَةُ تَتَنَفَّسُ بِالخَيَاشِيم'],
  ['حُوت', 'Whale', 'whale', 'أَزْرَق', 'الحُوتُ الأَزْرَقُ أَكْبَرُ حَيَوَان'],
  ['دُلْفِين', 'Dolphin', 'dolphin', 'أَزْرَق', 'الدُّلْفِينُ ذَكِيٌّ وَيُحِبُّ اللَّعِب'],
  ['قِرْش', 'Shark', 'shark', 'رَمَادِيّ', 'القِرْشُ لَهُ أَسْنَانٌ حَادَّة'],
  ['أُخْطُبُوط', 'Octopus', 'octopus', 'بَنَفْسَجِيّ', 'الأُخْطُبُوطُ لَهُ ثَمَانِيَةُ أَذْرُع'],
  ['سَرَطَانُ البَحْر', 'Crab', 'crab', 'أَحْمَر', 'السَّرَطَانُ يَمْشِي إِلَى الجَانِب'],
  ['نَجْمُ البَحْر', 'Starfish', 'starfish', 'بُرْتُقَالِيّ', 'نَجْمُ البَحْرِ لَهُ خَمْسَةُ أَذْرُع'],
  ['قِنْدِيلُ البَحْر', 'Jellyfish', 'jellyfish', 'وَرْدِيّ', 'قِنْدِيلُ البَحْرِ جِسْمُهُ شَفَّاف'],
  ['حِصَانُ البَحْر', 'Seahorse', 'seahorse', 'أَصْفَر', 'حِصَانُ البَحْرِ يَسْبَحُ وَاقِفًا'],
  ['سُلَحْفَاةٌ بَحْرِيَّة', 'Sea Turtle', 'seaturtle', 'أَخْضَر', 'السُّلَحْفَاةُ تَضَعُ بَيْضَهَا عَلَى الشَّاطِئ'],
  ['صَدَفَة', 'Shell', 'shell', 'وَرْدِيّ', 'نَجِدُ الصَّدَفَ عَلَى الشَّاطِئ'],
  ['سَمَكَةُ المُهَرِّج', 'Clownfish', 'clownfish', 'بُرْتُقَالِيٌّ وَأَبْيَض', 'سَمَكَةُ المُهَرِّجِ لَهَا خُطُوطٌ بَيْضَاء'],
  ['السَّمَكَةُ المُنْتَفِخَة', 'Pufferfish', 'pufferfish', 'أَصْفَر', 'تَنْتَفِخُ كَالكُرَةِ عِنْدَمَا تَخَاف'],
  ['فُقْمَة', 'Seal', 'seal', 'رَمَادِيّ', 'الفُقْمَةُ سَبَّاحَةٌ مَاهِرَة'],
  ['مَرْجَان', 'Coral', 'coral', 'مُلَوَّن', 'المَرْجَانُ بَيْتٌ لِأَسْمَاكٍ كَثِيرَة'],
  ['سَمَكَةُ الرَّاي', 'Stingray', 'stingray', 'بَنَفْسَجِيّ', 'سَمَكَةُ الرَّاي جِسْمُهَا مُسَطَّح'],
];
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '').replace(/^ال/, '')[0];
const hue = i => Math.round((i * 360 / 16 * 5 + 180) % 360);

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
const sea = '<i class="seabub b1"></i><i class="seabub b2"></i><i class="seabub b3"></i><i class="seabub b4"></i><div class="sand"></div>';

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
  <div class="ca cs0">${art('jellyfish')}</div><div class="ca cs1">${art('dolphin')}</div><div class="ca cs2">${art('clownfish')}</div>
  <h1>${t3d('بَحْرِي', '#ffffff', '#1d5fa8', 12)}<br>${t3d('الجَمِيل', '#ffd23f', '#c46a00', 12)}</h1>
  <div class="csub">أَتَعَرَّفُ عَلَى حَيَوَانَاتِ البَحْرِ بِالعَرَبِيَّة</div>
  <div class="cen">My Lovely Sea</div>
  <div class="ca cs3">${art('octopus')}</div><div class="ca cs4">${art('coral')}</div><div class="ca cs5">${art('crab')}</div><div class="ca cs6">${art('starfish')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:195">
  ${bubbles(2, 195)}
  <div class="owner">
    ${art('octopus', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#1d6fb8', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('shell', { cls: 'mini' })}${art('seahorse', { cls: 'mini' })}${art('starfish', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:175">
  ${bubbles(3, 175)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1d7fa8')}
    <div class="card">
      <p>هَيَّا نَغُوصُ فِي أَعْمَاقِ البَحْرِ الجَمِيل! 🌊</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ الحَيَوَانِ وَأَشِيرُوا إِلَى صُورَتِه.</li>
        <li>اسْأَلُوا طِفْلَكُمْ عَنْ لَوْنِهِ وَعَنْ شَكْلِه.</li>
        <li>عُدُّوا مَعًا أَذْرُعَ الأُخْطُبُوطِ وَنَجْمِ البَحْر.</li>
        <li>شَجِّعُوهُ عَلَى كِتَابَةِ الاسْمِ فَوْقَ الحُرُوفِ الرَّمَادِيَّة.</li>
        <li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${art('dolphin', { cls: 'mini' })}${art('pufferfish', { cls: 'mini' })}${art('seal', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:190">
  ${bubbles(4, 190)}
  ${title('حَيَوَانَاتُ البَحْر', '#1d6fb8')}
  <div class="ovg">${ITEMS.map(i => `<div class="ovc">${art(i[2])}<b>${i[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–20 ---------- One page per creature
ITEMS.forEach(([name, en, ill, colour, sentence], i) => {
  const h = hue(i), long = name.length > 11;
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,30%)`, 9, long ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="water">${sea}${art(ill, { cls: 'ill' })}</div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>🎨</i><div><small>لَوْنُهُ</small><b>${colour}</b></div></div>
      <div class="chip"><i class="ab wo">أ ب</i><div><small>الحَرْفُ الأَوَّل</small><b class="fl">${firstLetter(name)}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ الاسْم</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(long ? [520, 175] : [590, 350, 115]).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 21 ---------- Counting
const COUNT = [['fish', 3], ['starfish', 5], ['crab', 2], ['jellyfish', 4]];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(40, 20)}
  ${title('كَمْ عَدَدُهَا؟', '#e0482c')}
  <div class="hint">عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢</div>
  ${COUNT.map(([a, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => art(a)).join('')}</div><div class="cans"></div></div>`).join('')}
  ${pno(P++)}
</section>`);

// 22 ---------- Shadow match
const SH = [['octopus', 'seahorse'], ['crab', 'octopus'], ['seahorse', 'stingray'], ['stingray', 'shark'], ['shark', 'crab']];
pages.push(`
<section class="page plain" style="--h:265">
  ${bubbles(41, 265)}
  ${title('أَيْنَ ظِلِّي؟', '#6a3fd0')}
  <div class="hint">صِلْ كُلَّ حَيَوَانٍ بِظِلِّه 🔍</div>
  <div class="match">${SH.map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}<b>${BY[a][0]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 23 ---------- Which one doesn't live in the sea?
const ODD = [['fish', 'crab', 'cat', 'octopus'], ['dolphin', 'lion', 'starfish', 'seal'], ['jellyfish', 'shell', 'whale', 'cow'], ['rabbit', 'seahorse', 'shark', 'stingray']];
pages.push(`
<section class="page plain" style="--h:140">
  ${bubbles(42, 140)}
  ${title('مَنْ لَا يَعِيشُ فِي البَحْر؟', '#1f9d63')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الحَيَوَانِ الَّذِي لَا يَعِيشُ فِي البَحْر ⭕</div>
  ${ODD.map(r => `<div class="odd">${r.map(a => `<div>${art(a)}</div>`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 24 ---------- Maze: fish to the coral
const MC = 8, MR = 9, CS = 76, MW = maze(MC, MR, 23);
let mz = '';
for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (MW.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (MW.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(43, 200)}
  ${title('سَاعِدِ السَّمَكَةَ لِتَصِلَ إِلَى بَيْتِهَا', '#1d6fb8')}
  <div class="mazebox">${sea}
    ${art('clownfish', { cls: 'mzs' })}
    <svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="#ffffff" stroke-width="9" stroke-linecap="round" fill="none"/></svg>
    ${art('coral', { cls: 'mze' })}
  </div>
  ${pno(P++)}
</section>`);

// 25 ---------- Draw in the aquarium
pages.push(`
<section class="page plain" style="--h:190">
  ${bubbles(44, 190)}
  ${title('حَوْضُ أَسْمَاكِي', '#1d7fa8')}
  <div class="hint">ارْسُمْ حَيَوَانَاتِ البَحْرِ الَّتِي تُحِبُّهَا فِي الحَوْض 🐠</div>
  <div class="tank"><div class="tw"></div><div class="tsand"></div>${art('coral', { cls: 'tc' })}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:320">
  ${title('لَوِّنْ حَيَوَانَاتِ البَحْر', '#c2367a')}
  <div class="colorbox">${[['dolphin', 'c1'], ['clownfish', 'c2'], ['starfish', 'c3']].map(([a, c]) => art(a, { cls: 'outline ' + c })).join('')}
    <div class="ref">${['dolphin', 'clownfish', 'starfish'].map(a => art(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
  ${pno(P++)}
</section>`);

// 27 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَرَّفَ عَلَى حَيَوَانَاتِ البَحْر<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${art('dolphin')}${art('starfish')}${art('clownfish')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 28 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${sea}
  <h2>${t3d('بَحْرِي الجَمِيل', '#fff', '#1d5fa8', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يَأْخُذُ طِفْلَكَ فِي رِحْلَةٍ إِلَى أَعْمَاقِ البَحْر.</p>
    <ul><li>١٦ حَيَوَانًا بَحْرِيًّا مَعَ الاسْمِ وَاللَّوْن</li><li>جُمَلٌ قَصِيرَةٌ وَمَعْلُومَاتٌ صَحِيحَة</li><li>عَدٌّ وَظِلَالٌ وَمَتَاهَةٌ وَحَوْضُ أَسْمَاك</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book about sea creatures in Arabic · Ages 3–7</p>
  </div>
  <div class="ca bs0">${art('whale')}</div><div class="ca bs1">${art('seahorse')}</div><div class="ca bs2">${art('pufferfish')}</div><div class="ca bs3">${art('seaturtle')}</div>
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
.seabub{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.7);background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.8),rgba(255,255,255,.1) 50%)}
.b1{width:30px;height:30px;left:8%;top:18%}.b2{width:18px;height:18px;left:14%;top:8%}.b3{width:24px;height:24px;right:10%;top:30%}.b4{width:14px;height:14px;right:16%;top:20%}
.sand{position:absolute;left:0;right:0;bottom:0;height:16%;background:linear-gradient(#f7e2b0,#e9c98a);border-radius:50% 50% 0 0/24% 24% 0 0}
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
.cover{background:linear-gradient(#7fd8ff,#2fa8e8 45%,#1d6fb8);text-align:center;padding:40px}
.cover h1{position:relative;font-size:130px;line-height:1.1;margin-top:230px}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:28px;font-weight:800;color:#1d5fa8;background:#fff;padding:2px 28px;border-radius:30px;box-shadow:0 6px 0 #a9d4f5,0 12px 20px rgba(0,0,0,.2)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:${ring('#1d5fa8', 1.6)},0 3px 0 #1d5fa8;direction:ltr}
.ca{position:absolute;filter:drop-shadow(0 10px 12px rgba(10,30,70,.3))}.ca svg{width:100%;height:100%}
.cs0{width:200px;height:200px;left:30px;top:20px}.cs1{width:240px;height:240px;left:270px;top:0}.cs2{width:180px;height:180px;right:30px;top:40px}
.cs3{width:230px;height:230px;left:20px;bottom:30px}.cs4{width:230px;height:230px;left:280px;bottom:10px}.cs5{width:190px;height:190px;right:30px;bottom:40px}.cs6{width:110px;height:110px;right:220px;bottom:200px}
.back h2{position:relative;font-size:90px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:27px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#1d5fa8;font-size:19px;margin-top:8px}
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
.ovc{text-align:center;background:linear-gradient(#bfeaff,#6fc8f2);border-radius:24px;padding:6px 0 10px;box-shadow:0 5px 0 #2f8fd4,0 10px 14px rgba(10,30,70,.2)}
.ovc svg{width:126px;height:126px;margin:0 auto}
.ovc b{font-size:17px;font-weight:800;color:#fff;white-space:nowrap;text-shadow:${ring('#1d5fa8', 1.7)}}
/* item page */
.item{display:flex;flex-direction:column;gap:20px}
.iname{position:relative;text-align:center}.iname .big{font-size:88px}.iname .big.long{font-size:66px}
.iname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,32%);direction:ltr;margin-top:-6px}
.water{position:relative;height:460px;border-radius:40px;overflow:hidden;display:flex;align-items:center;justify-content:center;background:linear-gradient(#9fe3ff,#3fb0ec 70%,#1d7fc8);
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
.tank{position:relative;margin:40px auto 0;width:680px;height:760px;border-radius:30px;border:16px solid #9fd8ff;background:linear-gradient(#e6f7ff,#bfeaff);overflow:hidden;box-shadow:0 12px 0 #5ab0e0,0 24px 30px rgba(10,30,70,.25)}
.tw{position:absolute;left:0;right:0;top:40px;height:14px;background:repeating-linear-gradient(90deg,#9fd8ff 0 40px,#bfeaff 40px 80px);border-radius:7px}
.tsand{position:absolute;left:0;right:0;bottom:0;height:110px;background:linear-gradient(#f7e2b0,#e9c98a)}
.tc{position:absolute;right:20px;bottom:40px;width:220px;height:220px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(10,30,70,.15)}
.outline{position:absolute}
.c1{width:440px;height:440px;left:20px;top:40px}.c2{width:340px;height:340px;left:20px;bottom:20px}.c3{width:300px;height:300px;right:40px;bottom:60px}
.colorbox .outline [fill^="url"]{fill:#fff !important;stroke:#2b2340 !important;stroke-opacity:1 !important;stroke-width:1.6 !important}
.colorbox .outline [filter]{display:none}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>بحري الجميل</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
