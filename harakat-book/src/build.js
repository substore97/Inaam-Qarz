// Builds "حركاتي الجميلة" – Arabic vowel marks (harakat) – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./harakat-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, mark (on tatweel), example syllable, sound, description, syllable row, words [[art, word]], page hue]
const ITEMS = [
  ['الفَتْحَة', 'Fatha', 'ـَ', 'بَ', 'ba', 'خَطٌّ صَغِيرٌ فَوْقَ الحَرْف، نَفْتَحُ بِهِ الفَم', 'بَ تَ ثَ جَ حَ خَ', [['lion', 'أَسَد'], ['moon', 'قَمَر'], ['schoolpencil', 'قَلَم']], 355],
  ['الكَسْرَة', 'Kasra', 'ـِ', 'بِ', 'bi', 'خَطٌّ صَغِيرٌ تَحْتَ الحَرْف، نَكْسِرُ بِهِ الصَّوْتَ إِلَى أَسْفَل', 'بِ تِ ثِ جِ حِ خِ', [['grapes', 'عِنَب'], ['elephant', 'فِيل'], ['watermelon', 'بِطِّيخ']], 210],
  ['الضَّمَّة', 'Damma', 'ـُ', 'بُ', 'bu', 'وَاوٌ صَغِيرَةٌ فَوْقَ الحَرْف، نَضُمُّ بِهَا الشَّفَتَيْن', 'بُ تُ ثُ جُ حُ خُ', [['bear', 'دُبّ'], ['whale', 'حُوت'], ['orange', 'بُرْتُقَال']], 140],
  ['السُّكُون', 'Sukun', 'ـْ', 'بْ', 'b', 'دَائِرَةٌ صَغِيرَةٌ فَوْقَ الحَرْف، نَقِفُ عِنْدَهُ بِلَا حَرَكَة', 'أَبْ أَتْ أَثْ أَجْ أَحْ أَخْ', [['sun', 'شَمْس'], ['bee', 'نَحْلَة'], ['house', 'بَيْت']], 45],
  ['الشَّدَّة', 'Shadda', 'ـّ', 'بّ', 'bb', 'تُشْبِهُ حَرْفَ (w) الصَّغِير، نَنْطِقُ الحَرْفَ مَرَّتَيْن', 'رَبَّ مَدَّ شَدَّ عَمَّ حَجَّ صَبَّ', [['apple', 'تُفَّاحَة'], ['duck', 'بَطَّة'], ['cat', 'قِطَّة']], 275],
  ['التَّنْوِين', 'Tanween', 'ـً ـٍ ـٌ', 'بٌ', 'bun · ban · bin', 'حَرَكَتَانِ مَعًا، نَقُولُ بَعْدَهُمَا صَوْتَ النُّون', 'كِتَابٌ كِتَابًا كِتَابٍ', [['book', 'كِتَابٌ'], ['flower', 'وَرْدَةٌ'], ['star', 'نَجْمَةٌ']], 25],
];
const LET = ['ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'أ'];
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

const A2 = (n, o = {}) => n === 'star' ? art('stars', o) : art(n, o);
// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, 260, 12)}
  <div class="ctiles">${['بَ', 'بِ', 'بُ', 'بْ'].map((l, k) => `<div class="htile" style="--h:${[355, 210, 140, 45][k]}">${t3d(l, '#fff', `hsl(${[355, 210, 140, 45][k]},60%,30%)`, 7)}</div>`).join('')}</div>
  <h1>${t3d('حَرَكَاتِي', '#ffffff', '#6a3fd0', 12)}<br>${t3d('الجَمِيلَة', '#ffd23f', '#c46a00', 12)}</h1>
  <div class="csub">الفَتْحَةُ وَالكَسْرَةُ وَالضَّمَّةُ وَالسُّكُونُ وَالشَّدَّةُ وَالتَّنْوِين</div>
  <div class="cen">My Arabic Vowel Marks</div>
  <div class="ca cs3">${A2('lion')}</div><div class="ca cs4">${A2('book')}</div><div class="ca cs5">${A2('bear')}</div><div class="ca cs6">${A2('sun')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(2, 260)}
  <div class="owner">
    ${A2('book', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#6a3fd0', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${A2('schoolpencil', { cls: 'mini' })}${A2('notebook', { cls: 'mini' })}${A2('star', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(3, 45)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#c46a00')}
    <div class="card">
      <p>الحَرَكَاتُ هِيَ مِفْتَاحُ القِرَاءَةِ العَرَبِيَّة! 🔑</p>
      <ul>
        <li>ابْدَؤُوا بِالفَتْحَةِ ثُمَّ الكَسْرَةِ ثُمَّ الضَّمَّة، حَرَكَةً كُلَّ أُسْبُوع.</li>
        <li>انْطِقُوا الصَّوْتَ بِوُضُوحٍ وَدَعُوا الطِّفْلَ يُقَلِّدُ حَرَكَةَ الفَم.</li>
        <li>اقْرَؤُوا جَدْوَلَ المَقَاطِعِ كُلَّ يَوْمٍ لِعِدَّةِ دَقَائِق.</li>
        <li>اكْتُبُوا مَعَ طِفْلِكُمُ المَقَاطِعَ فَوْقَ الحُرُوفِ الرَّمَادِيَّة.</li>
        <li>امْدَحُوهُ عِنْدَ كُلِّ كَلِمَةٍ يَقْرَؤُهَا، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li>
      </ul>
    </div>
    <div class="row3">${A2('moon', { cls: 'mini' })}${A2('apple', { cls: 'mini' })}${A2('duck', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Overview
pages.push(`
<section class="page plain" style="--h:260">
  ${bubbles(4, 260)}
  ${title('بَيْتُ الحَرَكَات', '#6a3fd0')}
  <div class="hgrid">${ITEMS.map(it => `<div class="hc" style="--h:${it[8]}"><div class="hm">${it[3]}</div><b>${it[0]}</b><span>${it[3]}</span></div>`).join('')}</div>
  <div class="mad"><b>حُرُوفُ المَدّ:</b> <span>بَا</span><span>بُو</span><span>بِي</span></div>
  ${pno(P++)}
</section>`);

// 5–10 ---------- One page per haraka
ITEMS.forEach(([name, en, mark, ex, snd, desc, row, words, h]) => {
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(h, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,28%)`, 9, 'big')}<span class="en">${en}</span></div>
    <div class="hstage"><div class="bigex">${t3d(ex, '#fff', `hsl(${h},60%,30%)`, 8)}<small>${snd}</small></div></div>
    <div class="sent">${desc}</div>
    <div class="srow">${row.split(' ').map(s => `<span>${s}</span>`).join('')}</div>
    <div class="words">${words.map(([a, w]) => `<div class="wd">${A2(a)}<b>${w}</b></div>`).join('')}</div>
    <div class="trace">
      <span class="tlabel">✎ أَكْتُبُ</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${row.split(' ').slice(0, 5).map((s, k) => `<text x="${620 - k * 140}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${s}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});

// 11 ---------- Long vowels (madd)
pages.push(`
<section class="page plain" style="--h:180">
  ${bubbles(30, 180)}
  ${title('حُرُوفُ المَدّ', '#1d7fa8')}
  <div class="hint">نَمُدُّ الصَّوْتَ بِالأَلِفِ وَالوَاوِ وَاليَاء 🎵</div>
  ${[['ا', 'بَا', 'baa', 'بَاب'], ['و', 'بُو', 'boo', 'حُوت'], ['ي', 'بِي', 'bee', 'فِيل']].map(([l, s, en, w], k) => `<div class="mrw" style="--h:${[355, 140, 210][k]}"><i class="wo">${l}</i><b>${s}</b><span>${en}</span><em>${w}</em></div>`).join('')}
  <div class="srow">${['مَا', 'مُو', 'مِي', 'نَا', 'نُو', 'نِي'].map(s => `<span>${s}</span>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 12–13 ---------- Syllable reading chart
for (const part of [LET.slice(0, 14), LET.slice(14)]) {
  pages.push(`
  <section class="page plain" style="--h:${part[0] === 'ب' ? 330 : 120}">
    ${bubbles(31 + part.length, 330)}
    ${title('أَقْرَأُ المَقَاطِع', '#c2367a')}
    <div class="chart"><div class="ch head"><span>فَتْحَة</span><span>كَسْرَة</span><span>ضَمَّة</span><span>سُكُون</span></div>
    ${part.map(l => `<div class="ch">${['َ', 'ِ', 'ُ', 'ْ'].map(m => `<b>${l === 'أ' ? ['أَ', 'إِ', 'أُ', 'أْ'][['َ', 'ِ', 'ُ', 'ْ'].indexOf(m)] : l + m}</b>`).join('')}</div>`).join('')}</div>
    ${pno(P++)}
  </section>`);
}

// 14 ---------- Choose the correct haraka
const CH = [['moon', 'قـمر', ['قَـ', 'قِـ', 'قُـ']], ['grapes', 'عـنب', ['عَـ', 'عِـ', 'عُـ']], ['bear', 'د بّ', ['دَ', 'دِ', 'دُ']], ['whale', 'حـوت', ['حَـ', 'حِـ', 'حُـ']], ['lion', 'أسد', ['أَ', 'إِ', 'أُ']]];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(40, 150)}
  ${title('اخْتَرِ الحَرَكَةَ الصَّحِيحَة', '#1f8f4f')}
  <div class="hint">انْظُرْ إِلَى الصُّورَةِ وَضَعْ دَائِرَةً حَوْلَ الحَرْفِ الأَوَّلِ الصَّحِيح ⭕</div>
  ${CH.map(([a, w, o]) => `<div class="chq">${A2(a)}<b>${w.replace(' ', '')}</b>${o.map(x => `<span>${x}</span>`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 15 ---------- Circle the fatha
const MIX = ['بَ', 'بِ', 'تَ', 'سُ', 'مَ', 'نِ', 'كَ', 'دُ', 'لَ', 'رِ', 'فَ', 'هُ', 'جِ', 'وَ', 'يُ', 'عَ'];
pages.push(`
<section class="page plain" style="--h:355">
  ${bubbles(41, 355)}
  ${title('ابْحَثْ عَنِ الفَتْحَة', '#e0482c')}
  <div class="hint">لَوِّنْ بِالأَحْمَرِ كُلَّ حَرْفٍ عَلَيْهِ فَتْحَة 🖍️</div>
  <div class="fgrid">${MIX.map(s => `<span>${s}</span>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 16 ---------- Trace syllables
pages.push(`
<section class="page plain" style="--h:210">
  ${bubbles(42, 210)}
  ${title('أَكْتُبُ المَقَاطِع', '#2a6fd4')}
  <div class="hint">اكْتُبْ فَوْقَ الحُرُوفِ الرَّمَادِيَّة ✎</div>
  ${['مَ مِ مُ مْ', 'نَ نِ نُ نْ', 'لَ لِ لُ لْ', 'سَ سِ سُ سْ', 'رَ رِ رُ رْ'].map(r => `<div class="trace"><svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${r.split(' ').map((s, k) => `<text x="${610 - k * 160}" y="72" class="${k ? 'dash' : 'solid'}" text-anchor="middle">${s}</text>`).join('')}</svg></div>`).join('')}
  ${pno(P++)}
</section>`);

// 17 ---------- I read words
const RW = [['house', 'بَيْتٌ'], ['book', 'كِتَابٌ'], ['sun', 'شَمْسٌ'], ['moon', 'قَمَرٌ'], ['tree', 'شَجَرَةٌ'], ['fish', 'سَمَكَةٌ']];
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(43, 120)}
  ${title('أَقْرَأُ الكَلِمَات', '#1f8f4f')}
  <div class="hint">اقْرَأْ كُلَّ كَلِمَةٍ وَضَعْ نَجْمَةً ⭐ عِنْدَمَا تَقْرَؤُهَا</div>
  <div class="rwg">${RW.map(([a, w]) => `<div class="rwc">${a === 'tree' ? art('tree', { color: 'summer' }) : A2(a)}<b>${w}</b><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 18 ---------- Sentence reading
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(44, 45)}
  ${title('أَقْرَأُ جُمَلًا قَصِيرَة', '#c46a00')}
  <div class="hint">الآنَ أَسْتَطِيعُ أَنْ أَقْرَأ! 📖</div>
  ${[['lion', 'الأَسَدُ كَبِيرٌ'], ['sun', 'الشَّمْسُ حَارَّةٌ'], ['apple', 'التُّفَّاحَةُ لَذِيذَةٌ'], ['book', 'أَقْرَأُ كِتَابًا جَمِيلًا']].map(([a, t]) => `<div class="nlex">${a === 'tree' ? '' : A2(a)}<p>${t}</p></div>`).join('')}
  ${pno(P++)}
</section>`);

// 19 ---------- Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْقَارِئِ / لِلْقَارِئَةِ الصَّغِيرَة</p>
    <div class="nameline"></div>
    <p class="cp">لِأَنَّهُ تَعَلَّمَ الحَرَكَاتِ وَبَدَأَ يَقْرَأ<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${A2('book')}${A2('star')}${A2('schoolpencil')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 20 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 260, 12)}
  <h2>${t3d('حَرَكَاتِي الجَمِيلَة', '#fff', '#6a3fd0', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ يُعَلِّمُ طِفْلَكَ الحَرَكَاتِ العَرَبِيَّةَ خُطْوَةً خُطْوَةً لِيَبْدَأَ القِرَاءَة.</p>
    <ul><li>الفَتْحَةُ وَالكَسْرَةُ وَالضَّمَّةُ وَالسُّكُون</li><li>الشَّدَّةُ وَالتَّنْوِينُ وَحُرُوفُ المَدّ</li><li>جَدْوَلُ المَقَاطِعِ لِكُلِّ الحُرُوف</li><li>تَمَارِينُ قِرَاءَةٍ وَكِتَابَةٍ وَشَهَادَة</li></ul>
    <p class="en2">A joyful book to learn Arabic vowel marks (harakat) and start reading · Ages 4–7</p>
  </div>
  <div class="ca bs0">${A2('bear')}</div><div class="ca bs1">${A2('moon')}</div><div class="ca bs2">${A2('grapes')}</div><div class="ca bs3">${A2('duck')}</div>
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
.cover{--h:260;background:radial-gradient(circle at 50% 40%,#fbf7ff,#e4dcff 50%,#c9b8ff 85%);text-align:center;padding:40px}
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
.ctiles{position:relative;display:flex;justify-content:center;gap:24px;margin-top:40px}
.htile{width:120px;height:120px;border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:84px;background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,52%));box-shadow:inset 0 5px 0 rgba(255,255,255,.35),0 8px 0 hsl(var(--h),65%,36%)}
.htile .t3d{margin-top:22px}
.cover h1{margin-top:70px !important}
.hgrid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px}
.hc{background:linear-gradient(150deg,hsl(var(--h),95%,94%),hsl(var(--h),75%,84%));border-radius:30px;padding:12px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,66%)}
.hm{font-size:84px;line-height:1.3;color:hsl(var(--h),70%,42%);font-weight:800}.hc b{display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,26%)}.hc span{display:none}
.mad{position:relative;margin-top:26px;text-align:center;background:#fff;border-radius:30px;padding:14px;font-size:34px;font-weight:800;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.mad span{margin:0 16px;font-size:48px;color:hsl(var(--h),60%,40%)}
.hstage{position:relative;display:flex;align-items:center;justify-content:space-around;height:300px;border-radius:40px;background:radial-gradient(circle at 50% 45%,#fff,hsl(var(--h),80%,92%) 70%);box-shadow:inset 0 0 0 5px rgba(255,255,255,.8),0 8px 0 hsl(var(--h),45%,72%)}
.bigmark{font-size:230px;line-height:1;font-weight:800;color:hsl(var(--h),75%,48%)}
.bigex{text-align:center}.bigex .t3d{font-size:240px}.bigex small{display:block;font-family:Fredoka;font-size:34px;font-weight:600;color:hsl(var(--h),45%,40%);direction:ltr;margin-top:24px}
.srow{position:relative;display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.srow span{min-width:86px;text-align:center;font-size:50px;font-weight:800;color:hsl(var(--h),60%,32%);background:#fff;border-radius:22px;padding:0 12px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.words{position:relative;display:flex;justify-content:center;gap:16px}
.wd{width:210px;background:#fff;border-radius:26px;text-align:center;padding:6px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}.wd svg{width:110px;height:110px;margin:0 auto}.wd b{font-size:32px;font-weight:800;color:hsl(var(--h),60%,30%)}
.item{gap:18px !important}
.mrw{position:relative;display:flex;align-items:center;gap:22px;margin-top:26px;background:#fff;border-radius:34px;padding:12px 24px;box-shadow:0 6px 0 hsl(var(--h),50%,70%)}
.mrw i{font-style:normal;width:100px;height:100px;border-radius:26px;background:hsl(var(--h),65%,50%);color:#fff;display:flex;align-items:center;justify-content:center;font-size:66px;font-weight:800}
.mrw b{font-size:70px;font-weight:800;color:hsl(var(--h),60%,32%)}.mrw span{font-family:Fredoka;font-size:30px;color:#6a6080}.mrw em{margin-right:auto;font-style:normal;font-size:44px;font-weight:800;color:#2b2340}
.chart{position:relative;margin-top:18px;background:#fff;border-radius:30px;padding:10px 16px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.ch{display:grid;grid-template-columns:repeat(4,1fr);text-align:center;border-bottom:2px dashed hsl(var(--h),50%,85%)}.ch:last-child{border-bottom:none}
.ch b{font-size:38px;font-weight:800;line-height:1.28;color:#2b2340}
.ch.head span{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),55%,45%);border-radius:14px;margin:4px 6px}
.chq{position:relative;display:flex;align-items:center;gap:14px;margin-top:22px;background:#fff;border-radius:30px;padding:8px 16px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.chq svg{width:110px;height:110px;flex:none}.chq b{width:140px;font-size:46px;font-weight:800;color:hsl(var(--h),55%,28%)}.chq span{flex:1;text-align:center;font-size:52px;font-weight:800;background:hsl(var(--h),80%,95%);border-radius:20px}
.fgrid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:30px}
.fgrid span{height:150px;border-radius:50%;background:#fff;border:5px solid #2b2340;display:flex;align-items:center;justify-content:center;font-size:80px;font-weight:800;color:#2b2340}
.trace text{font-size:70px !important}
.rwg{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px}
.rwc{display:flex;align-items:center;gap:10px;background:#fff;border-radius:30px;padding:10px 14px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.rwc svg{width:120px;height:120px;flex:none}.rwc b{flex:1;font-size:46px;font-weight:800;color:hsl(var(--h),55%,26%)}.rwc i{width:54px;height:54px;border-radius:14px;border:4px dashed #ffb627}
.nlex{position:relative;display:flex;align-items:center;gap:16px;margin-top:30px;background:#fff;border-radius:34px;padding:12px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.nlex svg{width:150px;height:150px;flex:none}.nlex p{font-size:50px;font-weight:800;line-height:1.6;color:hsl(var(--h),55%,26%)}

.refc{position:relative;background:#fff;border-radius:28px;padding:14px 20px;text-align:center;border:4px solid hsl(var(--h),55%,72%);box-shadow:0 6px 0 hsl(var(--h),50%,62%)}
.refc p{font-size:30px;font-weight:800;line-height:1.7;color:hsl(var(--h),65%,24%)}.refc span{font-size:20px;font-weight:800;color:#fff;background:hsl(var(--h),55%,40%);border-radius:16px;padding:2px 16px}
.mw{position:relative;display:flex;align-items:center;justify-content:space-between;margin-top:22px;border-radius:34px;padding:16px 24px;background:linear-gradient(150deg,hsl(var(--h),95%,72%),hsl(var(--h),80%,55%));box-shadow:inset 0 5px 0 rgba(255,255,255,.3),0 8px 0 hsl(var(--h),60%,36%)}
.mw b{font-size:40px;font-weight:800;color:#fff}.mw span{font-size:24px;font-weight:800;color:#fff;background:rgba(0,0,0,.18);border-radius:18px;padding:4px 14px}
.rw{position:relative;display:flex;align-items:center;justify-content:space-between;margin-top:18px;background:#fff;border-radius:28px;padding:16px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.rw b{font-size:32px;font-weight:800;color:hsl(var(--h),55%,26%)}.rw .opts{gap:24px}.rw .opts span{font-size:30px}
.mtree{position:relative;margin:20px auto 0;width:680px;height:760px}.mtree svg{width:680px;height:760px}
.mtree i{position:absolute;width:56px;height:56px;border-radius:50%;background:#fff;border:4px dashed #ff4757}
.water.duo{justify-content:space-around}.water.duo .clk{width:320px;height:320px}.water.duo .obj{width:280px;height:280px;filter:drop-shadow(0 8px 10px rgba(40,20,80,.15))}
.ovc small{display:block;font-size:14px;font-weight:700;color:#6a6080}
.bigclock svg{width:560px;height:560px;margin:20px auto 0}
.hands{position:relative;display:flex;gap:20px;margin:20px 0}
.hd{flex:1;background:#fff;border-radius:28px;padding:14px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.hd i{display:block;width:120px;height:12px;border-radius:6px;margin:6px auto 10px}.hd b{display:block;font-size:30px;font-weight:800;color:hsl(var(--h),55%,26%)}.hd span{font-size:24px;font-weight:700;color:#4a4060}
.mc svg{width:130px !important;height:130px !important}
.drawc{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:30px}
.dc{background:#fff;border-radius:30px;padding:12px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.dc svg{width:280px;height:280px;margin:0 auto}.dc b{font-size:32px;font-weight:800;color:hsl(var(--h),55%,28%)}
.op svg{width:110px;height:110px;flex:none}.op b{flex:1;margin:0 14px;font-size:32px !important}
.hcard{position:relative;margin-top:20px;background:#fff;border-radius:34px;padding:26px 30px 20px;text-align:center;border:5px solid hsl(var(--h),55%,70%);box-shadow:0 8px 0 hsl(var(--h),50%,60%)}
.hcard p{font-size:34px;font-weight:800;line-height:1.9;color:hsl(var(--h),65%,22%)}.hcard.sm p{font-size:32px}
.hsrc{display:inline-block;margin-top:8px;font-size:22px;font-weight:800;color:#fff;background:hsl(var(--h),55%,38%);border-radius:18px;padding:4px 18px}
.five{position:relative;display:flex;justify-content:space-between;gap:8px;margin-top:30px}
.fv{flex:1;text-align:center;background:#fff;border-radius:24px;padding:8px 4px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.fv svg{width:110px;height:110px;margin:0 auto}.fv b{font-size:19px;font-weight:800;color:hsl(var(--h),55%,26%)}
.fv i,.wu i,.im i,.pr i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:hsl(var(--h),55%,45%);color:#fff;font-size:22px;font-weight:800}
.item{gap:30px !important}.pcard{padding:34px 22px !important}
.pnum{position:relative;align-self:center;font-size:26px;font-weight:800;color:#fff;background:hsl(var(--h),55%,40%);border-radius:22px;padding:2px 26px}
.pcard{position:relative;background:#fff;border-radius:34px;padding:22px;text-align:center;font-size:40px;font-weight:800;line-height:1.8;color:hsl(var(--h),65%,22%);border:5px solid hsl(var(--h),55%,70%);box-shadow:0 8px 0 hsl(var(--h),50%,60%)}
.pr{position:relative;display:flex;align-items:center;gap:18px;margin-top:20px;background:#fff;border-radius:30px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.sky2{width:150px;height:110px;border-radius:22px;position:relative;overflow:hidden;flex:none}.sky2 svg{position:absolute;width:70px;height:70px}
.r1 svg{left:40px;top:60px}.r2 svg{left:40px;top:6px}.r3 svg{left:76px;top:24px}.r4 svg{left:76px;top:62px}.r5 svg{left:40px;top:20px}
.pr b{flex:1;font-size:36px;font-weight:800;color:hsl(var(--h),55%,26%)}.pr span{font-size:28px;font-weight:800;color:#4a4060}
.iman{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:30px}
.im{display:flex;align-items:center;gap:12px;height:110px;padding:0 18px;border-radius:30px;background:linear-gradient(150deg,hsl(var(--h),90%,94%),hsl(var(--h),70%,84%));box-shadow:0 6px 0 hsl(var(--h),45%,65%)}
.im b{font-size:28px;font-weight:800;color:hsl(var(--h),55%,24%);line-height:1.4}
.wudu{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px}
.wu{position:relative;display:flex;align-items:center;gap:8px;background:#fff;border-radius:26px;padding:8px 12px;box-shadow:0 5px 0 hsl(var(--h),50%,76%);min-height:150px}
.wu svg{width:100px;height:100px;flex:none}.wu b{font-size:22px;font-weight:800;color:hsl(var(--h),55%,26%);line-height:1.5}
.ordp{position:relative;display:flex;flex-direction:column;gap:18px;margin:26px 0}
.op{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:30px;padding:14px 26px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.op b{font-size:38px;font-weight:800;color:hsl(var(--h),55%,26%)}.op i{width:90px;height:90px;border-radius:50%;border:5px dashed hsl(var(--h),55%,60%)}
.blank{display:inline-block;width:90px;height:56px;border-radius:16px;border:4px dashed hsl(var(--h),55%,60%);vertical-align:middle;background:#fff}
.ptrk{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px;box-shadow:0 8px 0 hsl(var(--h),50%,75%)}
.ph,.pt{display:grid;grid-template-columns:130px repeat(7,1fr);gap:6px;align-items:center;padding:8px 0}
.pt{border-top:2px dashed hsl(var(--h),50%,85%)}
.ph b{text-align:center;font-size:17px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:12px;padding:2px 0}
.pt span{font-size:26px;font-weight:800;color:hsl(var(--h),55%,28%)}.pt i{height:90px;border-radius:14px;border:3px dashed hsl(var(--h),50%,70%)}
.trace.big{height:140px;margin-top:26px}.trace.big text{font-size:58px}
.man b{padding:14px 10px}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>حركاتي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
