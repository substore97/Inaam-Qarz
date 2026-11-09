// Builds "ألواني وأشكالي" – a 3D-style Arabic colours & shapes book for kids – A4 portrait.
const fs = require('fs');
const path = require('path');
const { art, shape3d, shapeIcon, shapePath, blob, thing } = require('./shapes-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

const NAMES = {
  apple: 'تُفَّاحَة', strawberry: 'فَرَاوِلَة', pomegranate: 'رُمَّانَة', gift: 'هَدِيَّة', whale: 'حُوت', plane: 'طَائِرَة',
  balloon: 'بَالُون', ball: 'كُرَة', sun: 'شَمْس', lemon: 'لَيْمُون', banana: 'مَوْزَة', duck: 'بَطَّة', frog: 'ضِفْدَع',
  turtle: 'سُلَحْفَاة', carrot: 'جَزَرَة', pumpkin: 'يَقْطِين', fish: 'سَمَكَة', cat: 'قِطَّة', grapes: 'عِنَب', owl: 'بُومَة',
  star: 'نَجْمَة', flower: 'زَهْرَة', cake: 'كَعْكَة', heart: 'قَلْب', bear: 'دُبّ', monkey: 'قِرْد', penguin: 'بِطْرِيق',
  rabbit: 'أَرْنَب', sheep: 'خَرُوف', snowman: 'رَجُلُ الثَّلْج', cloud: 'غَيْمَة',
};
// [name, english, colour, page hue, objects]
const COLORS = [
  ['أَحْمَر', 'Red', '#ff3b4f', 355, ['apple', 'strawberry', 'pomegranate', 'gift']],
  ['أَزْرَق', 'Blue', '#2f7de8', 215, ['whale', 'plane', 'balloon', 'ball']],
  ['أَصْفَر', 'Yellow', '#ffd23f', 48, ['sun', 'lemon', 'banana', 'duck']],
  ['أَخْضَر', 'Green', '#36c45d', 135, ['frog', 'turtle', 'balloon', 'ball']],
  ['بُرْتُقَالِيّ', 'Orange', '#ff8a1f', 28, ['carrot', 'pumpkin', 'fish', 'cat']],
  ['بَنَفْسَجِيّ', 'Purple', '#9b59d6', 275, ['grapes', 'owl', 'balloon', 'star']],
  ['وَرْدِيّ', 'Pink', '#ff6fae', 330, ['flower', 'cake', 'heart', 'balloon']],
  ['بُنِّيّ', 'Brown', '#9a5f33', 28, ['bear', 'monkey', 'ball', 'heart']],
  ['أَسْوَد', 'Black', '#3d3d5c', 245, ['penguin', 'ball', 'balloon', 'star']],
  ['أَبْيَض', 'White', '#f4f6fb', 205, ['rabbit', 'sheep', 'snowman', 'cloud']],
];
const CBY = Object.fromEntries(COLORS.map(c => [c[1], c]));
// [type, name, english, colour, fact]
const SHAPES = [
  ['circle', 'دَائِرَة', 'Circle', '#ff3b4f', 'لَيْسَ لَهَا زَوَايَا'],
  ['square', 'مُرَبَّع', 'Square', '#2f7de8', 'لَهُ ٤ أَضْلَاعٍ مُتَسَاوِيَة'],
  ['triangle', 'مُثَلَّث', 'Triangle', '#ffc93b', 'لَهُ ٣ أَضْلَاع'],
  ['rect', 'مُسْتَطِيل', 'Rectangle', '#36c45d', 'لَهُ ٤ أَضْلَاع'],
  ['star', 'نَجْمَة', 'Star', '#ff8a1f', 'لَهَا ٥ رُؤُوس'],
  ['heart', 'قَلْب', 'Heart', '#9b59d6', 'رَمْزُ الحُبّ'],
  ['oval', 'بَيْضَاوِيّ', 'Oval', '#ff6fae', 'يُشْبِهُ البَيْضَة'],
  ['rhombus', 'مُعَيَّن', 'Diamond', '#2ec4b6', 'لَهُ ٤ أَضْلَاعٍ مُتَسَاوِيَة'],
  ['crescent', 'هِلَال', 'Crescent', '#ffb627', 'نَرَاهُ فِي السَّمَاءِ لَيْلًا'],
  ['hexagon', 'مُسَدَّس', 'Hexagon', '#6c63ff', 'لَهُ ٦ أَضْلَاع'],
];
const SBY = Object.fromEntries(SHAPES.map(s => [s[0], s]));
const hueOf = col => ({ '#ffc93b': 45, '#2ec4b6': 175, '#ffb627': 40, '#6c63ff': 245 }[col] ?? COLORS.find(c => c[2] === col)?.[3] ?? 200);

const obj = (name, col) => ['ball', 'star', 'heart'].includes(name) ? thing(name, col) : name === 'balloon' ? art('balloon', { color: col, vb: '25 0 150 212' }) : art(name);
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
const sideOf = col => col === '#f4f6fb' ? '#8aa0b8' : col === '#ffd23f' || col === '#ffc93b' || col === '#ffb627' ? '#c48a00' : `color-mix(in srgb, ${col} 60%, #1a1030)`;

const pages = [];
let P = 1;

// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, 300, 12)}
  <div class="ctop">${[['star', '#ffb627'], ['heart', '#ff6fae'], ['circle', '#2f7de8'], ['triangle', '#36c45d']].map(([t, c], k) => `<div class="ct ct${k}">${shape3d(t, c)}</div>`).join('')}</div>
  <h1>${t3d('أَلْوَانِي', '#ffd23f', '#e0482c', 12)}<br>${t3d('وَأَشْكَالِي', '#ffffff', '#6a3fd0', 12)}</h1>
  <div class="csub">أَتَعَلَّمُ الأَلْوَانَ وَالأَشْكَالَ بِالعَرَبِيَّة</div>
  <div class="cen">My Colors &amp; Shapes</div>
  <div class="cart">${['#ff3b4f', '#ffd23f', '#36c45d', '#2f7de8', '#9b59d6'].map((c, k) => `<div class="cb cb${k}">${blob(c, { seed: k + 1 })}</div>`).join('')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(2, 45)}
  <div class="owner">
    ${shape3d('star', '#ffb627', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#c46a00', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${shape3d('heart', '#ff6fae', { cls: 'mini' })}${blob('#2f7de8', { cls: 'mini', seed: 3 })}${shape3d('circle', '#36c45d', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:275">
  ${bubbles(3, 275)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#6a3fd0')}
    <div class="card">
      <p>مَرْحَبًا بِكُمْ فِي عَالَمِ الأَلْوَانِ وَالأَشْكَال! 🌈</p>
      <ul>
        <li>اقْرَؤُوا اسْمَ اللَّوْنِ وَابْحَثُوا عَنْهُ فِي البَيْت.</li>
        <li>سَمُّوا الصُّوَرَ مَعَ طِفْلِكُمْ: مَاذَا لَوْنُ التُّفَّاحَة؟</li>
        <li>ارْسُمُوا الأَشْكَالَ فَوْقَ النِّقَاطِ بِالإِصْبَعِ ثُمَّ بِالقَلَم.</li>
        <li>ابْحَثُوا عَنِ الأَشْكَالِ حَوْلَكُم: البَابُ مُسْتَطِيل، وَالشَّمْسُ دَائِرَة.</li>
        <li>اسْتَمْتِعُوا بِالأَلْعَابِ وَالتَّلْوِين، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${blob('#ff8a1f', { cls: 'mini', seed: 5 })}${shape3d('hexagon', '#6c63ff', { cls: 'mini' })}${blob('#ff6fae', { cls: 'mini', seed: 2 })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:190">
  ${bubbles(4, 190)}
  ${title('أَلْوَانِي', '#e0482c')}
  <div class="ovg">${COLORS.map(c => `<div class="ovc">${blob(c[2], { seed: c[3] % 7 })}<b>${c[0]}</b></div>`).join('')}</div>
  ${title('أَشْكَالِي', '#6a3fd0')}
  <div class="ovg">${SHAPES.map(s => `<div class="ovc">${shape3d(s[0], s[3])}<b>${s[1]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–14 ---------- Colour pages
COLORS.forEach(([name, en, col, h, objs], i) => {
  pages.push(`
  <section class="page clr" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="top">
      <div class="bigblob">${blob(col, { seed: i + 2 })}</div>
      <div class="words">
        <div class="lbl">لَوْنِي هُوَ</div>
        <div class="wpill" ${col === '#f4f6fb' ? 'style="background:#c9d6e6"' : ''}>${t3d(name, col === '#f4f6fb' ? '#fff' : col, sideOf(col), 7)}</div>
        <div class="en">${en}</div>
      </div>
    </div>
    <div class="objs">${objs.map(o => `<div class="oc">${obj(o, col)}<b>${NAMES[o]}</b></div>`).join('')}</div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ اسْمَ اللَّوْن</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${[590, 350, 115].map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle" ${k ? '' : `style="fill:${col === '#f4f6fb' ? '#9fb3c8' : col}"`}>${name}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 15–24 ---------- Shape pages
const MIX = ['circle', 'square', 'triangle', 'star', 'heart', 'rect', 'oval', 'rhombus', 'crescent', 'hexagon'];
SHAPES.forEach(([t, name, en, col, fact], i) => {
  const h = hueOf(col);
  const others = MIX.filter(x => x !== t);
  const row = [t, others[i % 9], others[(i + 3) % 9], t, others[(i + 5) % 9], others[(i + 1) % 9], t, others[(i + 7) % 9]];
  pages.push(`
  <section class="page shp" style="--h:${h}">
    ${bubbles(i + 30, h)}
    <div class="sname">${t3d(name, '#fff', sideOf(col), 9, 'big')}<span class="en">${en}</span></div>
    <div class="stage"><div class="pedestal"></div>${shape3d(t, col, { cls: 'ill' })}</div>
    <div class="fact">💡 ${fact}</div>
    <div class="trs">
      <span class="tlabel">✎ أَرْسُمُ الشَّكْل</span>
      <div class="trrow">${shapeIcon(t, { fill: col })}${[1, 2, 3, 4].map(() => shapeIcon(t, { dash: true })).join('')}</div>
    </div>
    <div class="trs">
      <span class="tlabel">🖍️ لَوِّنِ الأَشْكَالَ المُشَابِهَة</span>
      <div class="trrow find">${row.map(x => shapeIcon(x)).join('')}</div>
    </div>
    ${pno(P++)}
  </section>`);
});

// 25 ---------- Colour by number (house made of shapes)
const KEY = [[1, '#ff3b4f', 'أَحْمَر'], [2, '#2f7de8', 'أَزْرَق'], [3, '#ffd23f', 'أَصْفَر'], [4, '#36c45d', 'أَخْضَر'], [5, '#9a5f33', 'بُنِّيّ']];
const R = (d, n, x, y) => `<path d="${d}"/><text x="${x}" y="${y}">${AR(n)}</text>`;
const rr = (x, y, w, h) => `M${x} ${y} h${w} v${h} h${-w} Z`;
pages.push(`
<section class="page plain" style="--h:130">
  ${bubbles(50, 130)}
  ${title('لَوِّنْ حَسَبَ الرَّقَم', '#1f9d63')}
  <div class="key">${KEY.map(([n, c, nm]) => `<div class="k"><i style="background:radial-gradient(circle at 35% 30%,#fff,${c} 40%)"></i><b>${AR(n)}</b><small>${nm}</small></div>`).join('')}</div>
  <div class="cbn"><svg viewBox="0 0 700 720">
    ${R(rr(0, 600, 700, 120), 4, 350, 680)}
    ${R(shapePath('circle', 590, 110, 60), 3, 590, 125)}
    ${R(rr(150, 330, 300, 270), 3, 300, 470)}
    ${R('M120 340 L300 170 L480 340 Z', 1, 300, 295)}
    ${R(rr(260, 460, 80, 140), 5, 300, 545)}
    ${R(rr(175, 370, 70, 70), 2, 210, 418)}
    ${R(rr(355, 370, 70, 70), 2, 390, 418)}
    ${R(rr(560, 470, 36, 130), 5, 578, 550)}
    ${R(shapePath('circle', 578, 410, 75), 4, 578, 425)}
    ${R(shapePath('heart', 300, 245, 14), 1, 300, 252).replace(/<text[^>]*>.*?<\/text>/, '')}
  </svg></div>
  ${pno(P++)}
</section>`);

// 26 ---------- Match shape to its name
const SM = [['circle', 'triangle'], ['star', 'heart'], ['square', 'circle'], ['triangle', 'square'], ['heart', 'star']];
pages.push(`
<section class="page plain" style="--h:20">
  ${bubbles(51, 20)}
  ${title('صِلْ كُلَّ شَكْلٍ بِاسْمِه', '#e0482c')}
  <div class="hint">ارْسُمْ خَطًّا مِنَ الشَّكْلِ إِلَى اسْمِهِ الصَّحِيح ✏️</div>
  <div class="match">${SM.map(([a, b]) => `<div class="mrow"><div class="mc">${shape3d(a, SBY[a][3])}</div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="nm">${SBY[b][1]}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 27 ---------- Count the shapes in the train
const F = (d, c) => `<path d="${d}" fill="${c}" stroke="#2b2340" stroke-width="3" stroke-linejoin="round"/>`;
const train = [
  F(rr(430, 170, 220, 110), '#ff3b4f'), F(rr(560, 80, 90, 90), '#2f7de8'), F(rr(450, 110, 30, 60), '#9a5f33'),
  F(shapePath('circle', 465, 82, 14), '#e8eef7'), F(shapePath('circle', 440, 50, 18), '#e8eef7'),
  F(rr(230, 190, 180, 90), '#ffd23f'), F('M250 190 L285 135 L320 190 Z', '#36c45d'), F('M325 190 L360 135 L395 190 Z', '#ff8a1f'),
  F(rr(30, 190, 180, 90), '#9b59d6'), F(rr(55, 210, 50, 50), '#fff'), F(rr(135, 210, 50, 50), '#fff'),
  ...[[470, 300], [610, 300], [270, 300], [370, 300], [70, 300], [170, 300]].map(([x, y]) => F(shapePath('circle', x, y, 28), '#3d3d5c')),
  '<path d="M410 240 H430 M210 240 H230" stroke="#2b2340" stroke-width="6"/>',
].join('');
pages.push(`
<section class="page plain" style="--h:220">
  ${bubbles(52, 220)}
  ${title('عُدَّ الأَشْكَال', '#2a6fd4')}
  <div class="hint">كَمْ شَكْلًا مِنْ كُلِّ نَوْعٍ فِي القِطَار؟ 🚂</div>
  <div class="trainbox"><svg viewBox="0 20 680 320">${train}</svg></div>
  <div class="ctab">${['circle', 'square', 'triangle', 'rect'].map(t => `<div class="cnt">${shapeIcon(t, { fill: SBY[t][3] })}<b>${SBY[t][1]}</b><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 28 ---------- Match object to colour
const OM = [['apple', 'Yellow'], ['banana', 'Green'], ['frog', 'Blue'], ['whale', 'Purple'], ['grapes', 'Red']];
pages.push(`
<section class="page plain" style="--h:330">
  ${bubbles(53, 330)}
  ${title('صِلْ كُلَّ صُورَةٍ بِلَوْنِهَا', '#c2367a')}
  <div class="hint">مَا لَوْنُ كُلِّ صُورَة؟ صِلْهَا بِاللَّوْنِ الصَّحِيح 🎨</div>
  <div class="match">${OM.map(([a, c]) => `<div class="mrow"><div class="mc">${art(a)}<b>${NAMES[a]}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc">${blob(CBY[c][2], { face: false })}<b>${CBY[c][0]}</b></div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 29 ---------- Mixing colours
const MX = [['Red', 'Yellow', 'Orange'], ['Blue', 'Yellow', 'Green'], ['Red', 'Blue', 'Purple'], ['Red', 'White', 'Pink']];
pages.push(`
<section class="page plain" style="--h:50">
  ${bubbles(54, 50)}
  ${title('نَخْلِطُ الأَلْوَان', '#c46a00')}
  <div class="hint">مَاذَا يَحْدُثُ عِنْدَمَا نَخْلِطُ لَوْنَيْن؟ 🧪</div>
  ${MX.map(([a, b, r]) => `<div class="mix">${[a, b, r].map((c, k) => `<div class="mxc">${blob(CBY[c][2], { seed: k + 2 })}<b>${CBY[c][0]}</b></div>${k === 0 ? '<span class="op">+</span>' : k === 1 ? '<span class="op">=</span>' : ''}`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 30 ---------- Colouring: robot made of shapes
const W = d => `<path d="${d}" fill="#fff" stroke="#2b2340" stroke-width="4" stroke-linejoin="round"/>`;
const robot = [
  W('M350 40 L332 80 L368 80 Z'), W(rr(345, 80, 10, 30)),
  W(rr(240, 110, 220, 170)), W(shapePath('circle', 300, 180, 30)), W(shapePath('circle', 400, 180, 30)),
  W(shapePath('oval', 350, 245, 26)), W(rr(220, 160, 20, 60)), W(rr(460, 160, 20, 60)),
  W(rr(320, 280, 60, 30)),
  W(rr(200, 310, 300, 250)), W(shapePath('heart', 350, 400, 36)), W(shapePath('star', 270, 500, 26)), W(shapePath('star', 430, 500, 26)),
  W(shapePath('rhombus', 350, 505, 22)),
  W(rr(110, 330, 90, 40)), W(rr(500, 330, 90, 40)), W(shapePath('circle', 95, 350, 30)), W(shapePath('circle', 605, 350, 30)),
  W(rr(250, 560, 60, 110)), W(rr(390, 560, 60, 110)), W(shapePath('oval', 270, 690, 40)), W(shapePath('oval', 430, 690, 40)),
].join('');
pages.push(`
<section class="page plain" style="--h:250">
  ${title('لَوِّنِ الرُّوبُوت', '#4a3fd0')}
  <div class="colorbox"><svg viewBox="40 20 620 720">${robot}</svg></div>
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
    <p class="cp">لِأَنَّهُ تَعَلَّمَ الأَلْوَانَ وَالأَشْكَال<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${shape3d('star', '#ffb627')}${shape3d('heart', '#ff6fae')}${shape3d('circle', '#2f7de8')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 32 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 300, 12)}
  <h2>${t3d('أَلْوَانِي وَأَشْكَالِي', '#fff', '#6a3fd0', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَلِّمُ طِفْلَكَ عَشَرَةَ أَلْوَانٍ وَعَشَرَةَ أَشْكَالٍ بِاللُّغَةِ العَرَبِيَّة.</p>
    <ul><li>١٠ أَلْوَانٍ مَعَ صُوَرٍ جَمِيلَة</li><li>١٠ أَشْكَالٍ مَعَ تَمَارِينِ الرَّسْم</li><li>التَّلْوِينُ بِالأَرْقَامِ وَخَلْطُ الأَلْوَان</li><li>أَلْعَابٌ وَصَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book to learn colors &amp; shapes in Arabic · Ages 3–7</p>
  </div>
  <div class="cart">${['#ff8a1f', '#ff6fae', '#2ec4b6'].map((c, k) => `<div class="cb cb${k}">${blob(c, { seed: k + 4 })}</div>`).join('')}${[['hexagon', '#6c63ff'], ['rhombus', '#ff3b4f']].map(([t, c], k) => `<div class="cb cb${k + 3}">${shape3d(t, c)}</div>`).join('')}</div>
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
.tlabel{position:absolute;top:8px;right:18px;font-size:15px;font-weight:700;color:#9b90b2}
/* cover */
.cover{--h:300;background:radial-gradient(circle at 50% 38%,#fff8d6,#ffd1e8 40%,#b9a6ff 75%,#7c6cf0);text-align:center;padding:40px}
.ctop{position:relative;height:220px}
.ct{position:absolute;filter:drop-shadow(0 10px 10px rgba(40,20,80,.25))}.ct svg{width:100%;height:100%}
.ct0{width:190px;height:190px;left:290px;top:0}.ct1{width:150px;height:150px;left:60px;top:50px;transform:rotate(-12deg)}
.ct2{width:140px;height:140px;right:60px;top:50px}.ct3{width:120px;height:120px;left:180px;top:110px;transform:rotate(8deg)}
.cover h1{position:relative;font-size:126px;line-height:1.1}
.csub{position:relative;display:inline-block;margin-top:18px;font-size:30px;font-weight:800;color:#5a2db8;background:#fff;padding:2px 30px;border-radius:30px;box-shadow:0 6px 0 #c9b5ff,0 12px 20px rgba(0,0,0,.15)}
.cen{position:relative;font-family:Fredoka;font-weight:600;font-size:26px;color:#fff;margin-top:12px;text-shadow:0 2px 0 #6a3fd0;direction:ltr}
.cart{position:absolute;bottom:0;left:0;right:0;height:300px}
.cb{position:absolute;filter:drop-shadow(0 10px 10px rgba(40,20,80,.25))}.cb svg{width:100%;height:100%}
.cb0{width:180px;height:190px;left:20px;bottom:20px}.cb1{width:170px;height:180px;left:170px;bottom:70px}.cb2{width:200px;height:210px;left:300px;bottom:10px}
.cb3{width:170px;height:180px;right:160px;bottom:70px}.cb4{width:180px;height:190px;right:20px;bottom:20px}
.back h2{position:relative;font-size:80px;margin-top:110px}
.blurb{margin:36px 20px 0;font-size:28px;font-weight:600;line-height:1.75;text-align:right}
.blurb ul{margin:8px 28px 0}.en2{font-family:Fredoka;direction:ltr;text-align:center;color:#6a3fd0;font-size:19px;margin-top:8px}
/* owner / note */
.owner{position:relative;text-align:center;padding-top:50px}
.ownerart{width:330px;height:330px;margin:0 auto;filter:drop-shadow(0 12px 12px rgba(40,20,80,.2))}
.owner h2{font-size:62px}
.author{position:relative;display:inline-block;margin-top:4px;font-size:30px;font-weight:800;color:#fff;padding:2px 28px;border-radius:26px;
  background:linear-gradient(150deg,#ff7eb3,#ff4f8b);box-shadow:inset 0 3px 0 rgba(255,255,255,.35),0 5px 0 #c2366a,0 10px 16px rgba(0,0,0,.18)}
.stars,.row3{position:relative;display:flex;justify-content:center;gap:30px;margin-top:60px}
.note{position:relative;padding-top:40px}
.note .card{margin-top:30px;font-size:27px;font-weight:600;line-height:2}.note ul{margin-right:24px;margin-top:6px}
/* overview */
.ovg{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:8px 10px;margin:8px 0 6px}
.ovc{text-align:center}.ovc svg{width:120px;height:122px;margin:0 auto}
.ovc b{font-size:21px;font-weight:800;background:#fff;padding:0 12px;border-radius:16px;box-shadow:0 3px 0 #c9d9ef}
/* colour page */
.clr{display:flex;flex-direction:column;gap:22px}
.top{position:relative;display:flex;align-items:center;gap:16px;height:330px}
.bigblob svg{width:330px;height:340px;filter:drop-shadow(0 12px 14px rgba(40,20,80,.2))}
.words{flex:1;text-align:center}
.lbl{font-size:28px;font-weight:800;color:hsl(var(--h),45%,40%)}
.wpill{display:inline-block;background:#fff;border-radius:50px;padding:4px 44px;margin-top:6px;box-shadow:inset 0 -6px 0 hsl(var(--h),60%,92%),0 7px 0 hsl(var(--h),50%,72%),0 14px 22px rgba(40,20,80,.15)}
.wpill .t3d{font-family:Baloo;font-weight:800;font-size:76px;line-height:1.45}
.words .en{font-family:Fredoka;font-weight:600;font-size:32px;color:hsl(var(--h),40%,45%);direction:ltr;margin-top:14px}
.objs{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.oc{height:220px;border-radius:30px;background:linear-gradient(160deg,#fff,hsl(var(--h),80%,95%));text-align:center;padding-top:8px;box-shadow:0 6px 0 hsl(var(--h),45%,76%),0 12px 16px rgba(40,20,80,.12)}
.oc svg{width:160px;height:160px;margin:0 auto}.oc b{font-size:28px;font-weight:800;color:#3b3355}
.trace{position:relative;margin:0 auto;width:690px;height:126px;background:#fff;border-radius:26px;padding:4px 10px;box-shadow:0 6px 0 hsl(var(--h),45%,76%),0 12px 16px rgba(40,20,80,.12)}
.trace svg{width:100%;height:100%}.trace text{font-family:Baloo;font-weight:800;font-size:62px}
.trace .dash{fill:none;stroke:#b7aecb;stroke-width:2.4;stroke-dasharray:4 5;stroke-linecap:round}.trace .base{stroke:hsl(var(--h),50%,85%);stroke-width:2}
/* shape page */
.shp{display:flex;flex-direction:column;gap:18px}
.sname{position:relative;text-align:center}.sname .big{font-size:92px}
.sname .en{display:block;font-family:Fredoka;font-weight:600;font-size:26px;color:hsl(var(--h),45%,42%);direction:ltr;margin-top:-6px}
.stage{position:relative;height:400px;display:flex;align-items:center;justify-content:center}
.pedestal{position:absolute;bottom:8px;width:400px;height:84px;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#fff,hsl(var(--h),70%,85%) 60%,hsl(var(--h),55%,70%));
  box-shadow:0 12px 0 hsl(var(--h),45%,62%),0 24px 28px rgba(40,20,80,.25)}
.ill{position:relative;width:380px;height:400px;margin-bottom:40px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.fact{position:relative;margin:0 auto;padding:4px 34px;border-radius:40px;background:#fff;font-size:30px;font-weight:800;color:hsl(var(--h),55%,35%);box-shadow:0 6px 0 hsl(var(--h),45%,76%),0 12px 16px rgba(40,20,80,.12)}
.trs{position:relative;margin:0 auto;width:690px;height:140px;background:#fff;border-radius:26px;padding:24px 16px 6px;box-shadow:0 6px 0 hsl(var(--h),45%,76%),0 12px 16px rgba(40,20,80,.12)}
.trrow{display:flex;justify-content:space-around;align-items:center;height:100%}.trrow svg{width:100px;height:100px}
.trrow.find svg{width:74px;height:74px}
/* activities */
.key{position:relative;display:flex;justify-content:center;gap:14px;margin-top:14px}
.k{display:flex;align-items:center;gap:6px;background:#fff;border-radius:30px;padding:4px 12px 4px 8px;box-shadow:0 4px 0 #b8e3cc}
.k i{width:36px;height:36px;border-radius:50%;box-shadow:0 3px 4px rgba(0,0,0,.2)}.k b{font-size:26px;font-weight:800}.k small{font-size:20px;font-weight:700}
.cbn{position:relative;margin:20px auto 0;width:690px;height:760px;background:#fff;border-radius:40px;padding:20px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.cbn svg{width:100%;height:100%}.cbn path{fill:#fff;stroke:#2b2340;stroke-width:4;stroke-linejoin:round}
.cbn text{font-family:Baloo;font-weight:800;font-size:34px;fill:#8a80a3;text-anchor:middle}
.match{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:20px}
.mrow{display:flex;align-items:center}
.mc{width:190px;height:150px;border-radius:28px;background:#fff;text-align:center;padding-top:4px;box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.mc svg{width:118px;height:118px;margin:0 auto}.mc b{font-size:21px;font-weight:800;line-height:1}
.mc svg + b{display:block;margin-top:-4px}
.nm{width:190px;height:150px;border-radius:28px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:800;color:hsl(var(--h),60%,40%);box-shadow:0 6px 0 hsl(var(--h),50%,74%),0 12px 16px rgba(40,20,80,.12)}
.dot{width:22px;height:22px;border-radius:50%;background:hsl(var(--h),65%,50%);margin:0 12px;box-shadow:0 3px 0 hsl(var(--h),60%,32%)}
.gap{flex:1}
.trainbox{position:relative;margin:40px auto 0;background:#fff;border-radius:40px;padding:24px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.ctab{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:56px}
.cnt{display:flex;align-items:center;gap:14px;background:#fff;border-radius:30px;padding:12px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.cnt svg{width:110px;height:110px}.cnt b{flex:1;font-size:34px;font-weight:800}.cnt i{width:100px;height:100px;border-radius:20px;border:4px dashed hsl(var(--h),60%,60%)}
.mix{position:relative;display:flex;align-items:center;justify-content:center;gap:6px;margin-top:22px;background:rgba(255,255,255,.7);border-radius:36px;padding:8px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.mxc{text-align:center}.mxc svg{width:150px;height:150px}.mxc b{font-size:24px;font-weight:800}
.op{font-family:Fredoka;font-size:64px;font-weight:700;color:hsl(var(--h),60%,40%);margin:0 6px}
.colorbox{position:relative;margin:26px auto 0;width:690px;height:880px;background:#fff;border-radius:40px;padding:20px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.colorbox svg{width:100%;height:100%}
/* certificate */
.cert{--h:45;background:radial-gradient(circle at 50% 30%,#fffbe6,#ffe08a 60%,#ffc23d);padding:40px}
.frame{position:relative;height:100%;border-radius:40px;border:10px solid #fff;outline:6px dashed #ffb300;outline-offset:-24px;text-align:center;padding-top:60px;box-shadow:0 12px 30px rgba(150,90,0,.3),inset 0 0 40px rgba(255,255,255,.7)}
.medal{width:230px;height:230px;margin:0 auto;filter:drop-shadow(0 10px 10px rgba(120,70,0,.3))}
.cert h2{font-size:88px}
.cp{font-size:31px;font-weight:700;color:#8a5200;margin-top:14px;line-height:1.7}
.certart{display:flex;justify-content:center;gap:10px;margin-top:10px}.certart svg{width:140px;height:146px}
.sig{display:flex;justify-content:space-around;margin-top:24px;font-size:22px;font-weight:700;color:#8a5200}
.cert .pno{bottom:56px}
`;

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>ألواني وأشكالي</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
