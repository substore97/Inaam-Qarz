// Builds "أدعيتي الجميلة" – a 3D-style book of daily duas for children – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./duas-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [occasion, english title, art, dua, english meaning, source, extra line]
const ITEMS = [
  ['قَبْلَ الأَكْل', 'Before Eating', 'plate', 'بِسْمِ اللّٰهِ', 'In the name of Allah.', 'مُتَّفَقٌ عَلَيْه', ''],
  ['بَعْدَ الأَكْل', 'After Eating', 'soup', 'الحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنِي هٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّة', 'All praise is for Allah who fed me this and provided it for me, without any power or strength from me.', 'رَوَاهُ أَبُو دَاوُدَ وَالتِّرْمِذِيّ', ''],
  ['قَبْلَ النَّوْم', 'Before Sleeping', 'bed', 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا', 'In Your name, O Allah, I die and I live.', 'رَوَاهُ البُخَارِيّ', ''],
  ['عِنْدَ الاسْتِيقَاظ', 'On Waking Up', 'sun', 'الحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُور', 'All praise is for Allah who gave us life after causing us to die, and to Him is the return.', 'رَوَاهُ البُخَارِيّ', ''],
  ['عِنْدَ الخُرُوجِ مِنَ البَيْت', 'Leaving the House', 'bag', 'بِسْمِ اللّٰهِ، تَوَكَّلْتُ عَلَى اللّٰهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰه', 'In the name of Allah, I trust in Allah; there is no might nor power except with Allah.', 'رَوَاهُ أَبُو دَاوُدَ وَالتِّرْمِذِيّ', ''],
  ['عِنْدَ دُخُولِ البَيْت', 'Entering the House', 'house', 'بِسْمِ اللّٰهِ وَلَجْنَا، وَبِسْمِ اللّٰهِ خَرَجْنَا، وَعَلَى رَبِّنَا تَوَكَّلْنَا', 'In the name of Allah we enter, in the name of Allah we leave, and upon our Lord we rely.', 'رَوَاهُ أَبُو دَاوُد', ''],
  ['عِنْدَ دُخُولِ الخَلَاء', 'Entering the Toilet', 'soap', 'اللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الخُبُثِ وَالخَبَائِث', 'O Allah, I seek refuge in You from the evil ones.', 'مُتَّفَقٌ عَلَيْه', ''],
  ['عِنْدَ الخُرُوجِ مِنَ الخَلَاء', 'Leaving the Toilet', 'towel', 'غُفْرَانَكَ', 'I ask You for forgiveness.', 'رَوَاهُ أَبُو دَاوُدَ وَالتِّرْمِذِيّ', ''],
  ['عِنْدَ رُكُوبِ السَّيَّارَة', 'Riding in a Car', 'car', 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ', 'Glory be to Him who has made this of service to us, and we could not have done it ourselves; and to our Lord we will return.', 'سُورَةُ الزُّخْرُف: ١٣ - ١٤', ''],
  ['عِنْدَ نُزُولِ المَطَر', 'When It Rains', 'raincloud', 'اللّٰهُمَّ صَيِّبًا نَافِعًا', 'O Allah, (make it) a beneficial rain.', 'رَوَاهُ البُخَارِيّ', ''],
  ['عِنْدَ العُطَاس', 'After Sneezing', 'tissue', 'الحَمْدُ لِلّٰهِ', 'All praise is for Allah.', 'رَوَاهُ البُخَارِيّ', 'يَقُولُ لَكَ أَخُوكَ: يَرْحَمُكَ اللّٰه ✦ فَتَقُولُ: يَهْدِيكُمُ اللّٰهُ وَيُصْلِحُ بَالَكُم'],
  ['عِنْدَ اللِّقَاء', 'When We Meet', 'dove', 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُه', 'Peace be upon you, and the mercy of Allah and His blessings.', 'رَوَاهُ أَبُو دَاوُدَ وَالتِّرْمِذِيّ', ''],
  ['لِلْوَالِدَيْن', 'For My Parents', 'bigheart', 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', 'My Lord, have mercy on them as they raised me when I was small.', 'سُورَةُ الإِسْرَاء: ٢٤', ''],
  ['عِنْدَ الشُّكْر', 'Saying Thank You', 'gift', 'جَزَاكَ اللّٰهُ خَيْرًا', 'May Allah reward you with good.', 'رَوَاهُ التِّرْمِذِيّ', ''],
  ['عِنْدَ لُبْسِ الثَّوْب', 'Wearing Clothes', 'shirt', 'الحَمْدُ لِلّٰهِ الَّذِي كَسَانِي هٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّة', 'All praise is for Allah who clothed me with this and provided it for me, without any power or strength from me.', 'رَوَاهُ أَبُو دَاوُدَ وَالتِّرْمِذِيّ', ''],
  ['لِطَلَبِ العِلْم', 'For Knowledge', 'book', 'رَبِّ زِدْنِي عِلْمًا', 'My Lord, increase me in knowledge.', 'سُورَةُ طٰه: ١١٤', ''],
];
const BY = Object.fromEntries(ITEMS.map(i => [i[2], i]));
const firstLetter = w => w.replace(/[ً-ْ]/g, '').replace(/^ال/, '')[0];
const hue = i => Math.round((i * 360 / 16 * 5 + 120) % 360);

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
const sea = '<div class="cloth"></div>';

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
  ${bubbles(1, 140, 12)}
  <div class="ca cs0">${art('moon')}</div><div class="ca cs1">${art('mosque')}</div><div class="ca cs2">${art('stars')}</div>
  <h1>${t3d('أَدْعِيَتِي', '#ffffff', '#1f8f4f', 12)}<br>${t3d('الجَمِيلَة', '#ffd23f', '#c46a00', 12)}</h1>
  <div class="csub">أَذْكَارٌ وَأَدْعِيَةٌ يَوْمِيَّةٌ لِلْأَطْفَال</div>
  <div class="cen">My Beautiful Duas</div>
  <div class="ca cs3">${art('bed')}</div><div class="ca cs4">${art('book')}</div><div class="ca cs5">${art('bigheart')}</div><div class="ca cs6">${art('dove')}</div>
</section>`);
P++;

// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:140">
  ${bubbles(2, 140)}
  <div class="owner">
    ${art('mosque', { cls: 'ownerart' })}
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', '#1f8f4f', 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${art('moon', { cls: 'mini' })}${art('book', { cls: 'mini' })}${art('stars', { cls: 'mini' })}</div>
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
      <p>هٰذَا الكِتَابُ يُعَلِّمُ طِفْلَكُمْ أَدْعِيَةً قَصِيرَةً مِنَ القُرْآنِ وَالسُّنَّة 🤲</p>
      <ul>
        <li>اقْرَؤُوا الدُّعَاءَ بِصَوْتٍ وَاضِحٍ وَدَعُوا الطِّفْلَ يُرَدِّدُهُ ثَلَاثَ مَرَّات.</li>
        <li>عَلِّمُوهُ دُعَاءً وَاحِدًا كُلَّ أُسْبُوعٍ فِي وَقْتِهِ المُنَاسِب.</li>
        <li>كُونُوا قُدْوَةً لَهُ: قُولُوا الدُّعَاءَ أَمَامَهُ كُلَّ يَوْم.</li>
        <li>ذُكِرَ مَصْدَرُ كُلِّ دُعَاءٍ فِي أَسْفَلِ الصَّفْحَة.</li>
        <li>شَجِّعُوهُ بِالنُّجُومِ وَالشَّهَادَةِ فِي آخِرِ الكِتَاب!</li>
      </ul>
    </div>
    <div class="row3">${art('sun', { cls: 'mini' })}${art('raincloud', { cls: 'mini' })}${art('car', { cls: 'mini' })}</div>
  </div>
  ${pno(P++)}
</section>`);

// 4 ---------- Index
pages.push(`
<section class="page plain" style="--h:130">
  ${bubbles(4, 130)}
  ${title('أَدْعِيَةُ الكِتَاب', '#1f8f4f')}
  <div class="idx">${ITEMS.map((d, i) => `<div class="ix">${art(d[2])}<b>${d[0]}</b><i class="wo">${AR(i + 5)}</i></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 5–20 ---------- One page per dua
ITEMS.forEach(([occ, en, ill, dua, meaning, src, extra], i) => {
  const h = hue(i), long = dua.length > 60, mid = dua.length > 28;
  pages.push(`
  <section class="page dua" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="occ">${t3d(occ, '#fff', `hsl(${h},60%,30%)`, 8, occ.length > 16 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="dstage">${art(ill, { cls: 'dill' })}</div>
    <div class="dcard ${long ? 'long' : mid ? 'mid' : ''}"><span class="hands">🤲</span><p>${dua}</p>${extra ? `<div class="extra">${extra}</div>` : ''}</div>
    <div class="mean">${meaning}</div>
    <div class="drow">
      <div class="rep"><small>رَدِّدْ ثَلَاثَ مَرَّات</small><div><i></i><i></i><i></i></div></div>
      <div class="src">📖 ${src}</div>
    </div>
    ${pno(P++)}
  </section>`);
});

// 21 ---------- What do I say? (match)
const MQ = [['plate', 'قَبْلَ الأَكْل', 'جَزَاكَ اللّٰهُ خَيْرًا'], ['tissue', 'عِنْدَ العُطَاس', 'بِسْمِ اللّٰه'], ['gift', 'عِنْدَ الشُّكْر', 'رَبِّ زِدْنِي عِلْمًا'], ['book', 'لِطَلَبِ العِلْم', 'الحَمْدُ لِلّٰه']];
pages.push(`
<section class="page plain" style="--h:150">
  ${bubbles(40, 150)}
  ${title('مَاذَا أَقُول؟', '#1f8f4f')}
  <div class="hint">صِلْ كُلَّ صُورَةٍ بِالذِّكْرِ المُنَاسِب ✏️</div>
  <div class="match">${MQ.map(([a, w, d]) => `<div class="mrow"><div class="mc">${art(a)}<b>${w}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mq">${d}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 22 ---------- Complete the dua
const CQ = [['بِسْمِ ...', ['اللّٰه', 'السَّلَام', 'خَيْرًا']], ['الحَمْدُ ...', ['عِلْمًا', 'لِلّٰه', 'نَافِعًا']], ['جَزَاكَ اللّٰهُ ...', ['خَيْرًا', 'صَغِيرًا', 'غُفْرَانَك']], ['رَبِّ زِدْنِي ...', ['خَيْرًا', 'اللّٰه', 'عِلْمًا']]];
pages.push(`
<section class="page plain" style="--h:200">
  ${bubbles(41, 200)}
  ${title('أَكْمِلِ الدُّعَاء', '#2a6fd4')}
  <div class="hint">ضَعْ دَائِرَةً حَوْلَ الكَلِمَةِ الصَّحِيحَة ⭕</div>
  ${CQ.map(([q, opts], j) => `<div class="qrow" style="--h:${(j * 60 + 150) % 360}"><div class="qw">${q}</div>${opts.map(o => `<div class="qo">${o}</div>`).join('')}</div>`).join('')}
  ${pno(P++)}
</section>`);

// 23 ---------- Trace the words
const TR = ['بِسْمِ اللّٰه', 'الحَمْدُ لِلّٰه', 'جَزَاكَ اللّٰهُ خَيْرًا', 'رَبِّ زِدْنِي عِلْمًا'];
pages.push(`
<section class="page plain" style="--h:270">
  ${bubbles(42, 270)}
  ${title('أَكْتُبُ أَذْكَارِي', '#6a3fd0')}
  <div class="hint">اكْتُبْ فَوْقَ الحُرُوفِ الرَّمَادِيَّة ✎</div>
  ${TR.map(w => `<div class="trace big"><svg viewBox="0 0 700 110"><line x1="20" y1="88" x2="690" y2="88" class="base"/><text x="510" y="78" class="solid" text-anchor="middle">${w}</text><text x="170" y="78" class="dash" text-anchor="middle">${w}</text></svg></div>`).join('')}
  ${pno(P++)}
</section>`);

// 24 ---------- Weekly dua tracker
const TRK = [['bed', 'دُعَاءُ النَّوْم'], ['sun', 'دُعَاءُ الاسْتِيقَاظ'], ['plate', 'دُعَاءُ الطَّعَام'], ['house', 'دُعَاءُ البَيْت']];
const DAYS = ['سَبْت', 'أَحَد', 'إِثْنَيْن', 'ثُلَاثَاء', 'أَرْبِعَاء', 'خَمِيس', 'جُمُعَة'];
pages.push(`
<section class="page plain" style="--h:45">
  ${bubbles(43, 45)}
  ${title('نُجُومُ أَدْعِيَتِي', '#c46a00')}
  <div class="hint">ضَعْ نَجْمَةً ⭐ كُلَّ يَوْمٍ تَقُولُ فِيهِ الدُّعَاء</div>
  <div class="habits">
    <div class="hrow head"><div></div>${DAYS.map(d => `<b class="wo">${d}</b>`).join('')}</div>
    ${TRK.map(([a, t]) => `<div class="hrow"><div class="hl">${art(a)}<span>${t}</span></div>${DAYS.map(() => '<i></i>').join('')}</div>`).join('')}
  </div>
  ${pno(P++)}
</section>`);

// 25 ---------- Shadow match
const SH = [['mosque', 'car'], ['bed', 'mosque'], ['car', 'gift'], ['gift', 'bed'], ['dove', 'dove']];
pages.push(`
<section class="page plain" style="--h:265">
  ${bubbles(44, 265)}
  ${title('أَيْنَ ظِلِّي؟', '#6a3fd0')}
  <div class="hint">صِلْ كُلَّ صُورَةٍ بِظِلِّهَا 🔍</div>
  <div class="match">${[['mosque', 'car'], ['bed', 'mosque'], ['car', 'dove'], ['dove', 'gift'], ['gift', 'bed']].map(([a, s]) => `<div class="mrow"><div class="mc">${art(a)}</div><i class="dot"></i><i class="gap"></i><i class="dot"></i><div class="mc shadowimg">${art(s)}</div></div>`).join('')}</div>
  ${pno(P++)}
</section>`);

// 26 ---------- Colouring
pages.push(`
<section class="page plain" style="--h:140">
  ${title('لَوِّنِ المَسْجِد', '#1f8f4f')}
  <div class="colorbox">${[['mosque', 'c1'], ['moon', 'c2'], ['dove', 'c3']].map(([a, c]) => art(a, { cls: 'outline ' + c })).join('')}
    <div class="ref">${['mosque', 'moon', 'dove'].map(a => art(a)).join('')}<small>انْظُرْ وَلَوِّن</small></div></div>
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
    <p class="cp">لِأَنَّهُ حَفِظَ أَدْعِيَتَهُ الجَمِيلَة<br>بَارَكَ اللّٰهُ فِيكَ ⭐</p>
    <div class="certart">${art('mosque')}${art('book')}${art('stars')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);

// 28 ---------- Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, 140, 12)}
  <h2>${t3d('أَدْعِيَتِي الجَمِيلَة', '#fff', '#1f8f4f', 8)}</h2>
  <div class="card blurb">
    <p>كِتَابٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَاد يُعَلِّمُ طِفْلَكَ سِتَّةَ عَشَرَ دُعَاءً يَوْمِيًّا مِنَ القُرْآنِ وَالسُّنَّة.</p>
    <ul><li>كُلُّ دُعَاءٍ مَشْكُولٌ مَعَ المَعْنَى وَالمَصْدَر</li><li>أَدْعِيَةُ النَّوْمِ وَالطَّعَامِ وَالبَيْتِ وَالسَّفَر</li><li>أَلْعَابٌ وَكِتَابَةٌ وَجَدْوَلُ النُّجُوم</li><li>صَفْحَةُ تَلْوِينٍ وَشَهَادَةُ تَقْدِير</li></ul>
    <p class="en2">A joyful 3D picture book of daily duas for children · Ages 3–7</p>
  </div>
  <div class="cart">${['sun', 'house', 'raincloud', 'gift'].map((a, k) => `<div class="ca bs${k}">${art(a)}</div>`).join('')}</div>
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
.cover{--h:140;background:radial-gradient(circle at 50% 40%,#f2fff6,#c9f0d6 45%,#8fdcae 80%,#4fb882);text-align:center;padding:40px}
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
/* dua page */
.dua{display:flex;flex-direction:column;gap:26px}
.occ{position:relative;text-align:center}.occ .big{font-size:70px}.occ .big.long{font-size:54px}
.occ .en{display:block;font-family:Fredoka;font-weight:600;font-size:24px;color:hsl(var(--h),45%,32%);direction:ltr;margin-top:-4px}
.dstage{position:relative;height:370px;display:flex;align-items:center;justify-content:center;border-radius:40px;background:radial-gradient(circle at 50% 50%,#ffffff,hsl(var(--h),70%,90%) 70%);box-shadow:inset 0 0 0 5px rgba(255,255,255,.8),0 8px 0 hsl(var(--h),45%,72%)}
.dill{width:350px;height:350px;filter:drop-shadow(0 10px 12px rgba(40,20,80,.2))}
.dcard{position:relative;background:#fff;border-radius:36px;padding:34px 34px 26px;text-align:center;border:5px solid hsl(var(--h),60%,70%);box-shadow:0 8px 0 hsl(var(--h),50%,60%),0 16px 24px rgba(40,20,80,.15)}
.dcard p{font-size:72px;font-weight:800;line-height:1.7;color:hsl(var(--h),70%,22%)}
.dcard.mid p{font-size:56px}.dcard.long p{font-size:44px;line-height:1.85}
.hands{position:absolute;top:-30px;left:50%;transform:translateX(-50%);font-size:44px;background:#fff;border-radius:50%;width:66px;height:66px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 0 hsl(var(--h),50%,70%)}
.extra{margin-top:10px;font-size:27px;font-weight:700;color:hsl(var(--h),50%,30%);background:hsl(var(--h),80%,95%);border-radius:18px;padding:6px 12px;line-height:1.7}
.mean{position:relative;font-family:Fredoka;font-weight:500;font-size:24px;direction:ltr;text-align:center;color:#4a4060;padding:0 20px}
.drow{position:relative;display:flex;justify-content:space-between;align-items:center;gap:16px}
.rep{background:#fff;border-radius:26px;padding:8px 18px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}.rep small{display:block;font-size:18px;font-weight:800;color:hsl(var(--h),50%,30%);text-align:center}
.rep div{display:flex;gap:8px;margin-top:4px}.rep i{width:46px;height:46px;border-radius:12px;border:4px dashed #ffb627}
.src{font-size:24px;font-weight:800;color:#fff;background:hsl(var(--h),55%,40%);border-radius:22px;padding:8px 20px;box-shadow:0 5px 0 hsl(var(--h),55%,28%);text-shadow:${ring('hsl(150,50%,18%)', 1.4)}}
.idx{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:20px}
.ix{position:relative;text-align:center;background:#fff;border-radius:24px;padding:6px 4px 10px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.ix svg{width:96px;height:96px;margin:0 auto}.ix b{display:block;font-size:17px;font-weight:800;color:hsl(var(--h),55%,28%);line-height:1.3}
.ix i{position:absolute;top:6px;right:8px;font-style:normal;font-size:16px;font-weight:800;color:#fff;background:hsl(var(--h),55%,45%);border-radius:10px;padding:0 7px}
.mq{width:300px;height:110px;border-radius:28px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:hsl(var(--h),60%,28%);box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.qrow{position:relative;display:flex;align-items:center;gap:14px;margin-top:30px;background:rgba(255,255,255,.8);border-radius:34px;padding:16px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.qw{min-width:220px;text-align:center;font-size:36px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:24px;padding:4px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,30%);text-shadow:${ring('hsl(var(--h),60%,22%)', 1.6)}}
.qo{flex:1;text-align:center;font-size:32px;font-weight:800;background:#fff;border-radius:22px;padding:6px;box-shadow:0 4px 0 hsl(var(--h),40%,80%)}
.trace.big{height:140px;margin-top:26px}.trace.big text{font-size:50px}
.habits{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px;box-shadow:0 8px 0 hsl(var(--h),50%,75%),0 16px 24px rgba(40,20,80,.15)}
.hrow{display:grid;grid-template-columns:190px repeat(7,1fr);gap:6px;align-items:center;padding:8px 0;border-bottom:2px dashed hsl(var(--h),50%,85%)}
.hrow:last-child{border-bottom:none}
.hrow.head b{text-align:center;font-size:17px;font-weight:800;color:#fff;background:hsl(var(--h),60%,48%);border-radius:12px;padding:2px 0}
.hl{display:flex;flex-direction:column;align-items:center}.hl svg{width:120px;height:120px}.hl span{font-size:21px;font-weight:800;color:hsl(var(--h),55%,28%)}
.hrow i{height:90px;border-radius:14px;border:3px dashed hsl(var(--h),50%,70%)}
/* activities */
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أدعيتي الجميلة</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
