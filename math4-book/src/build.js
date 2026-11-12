// Builds "رياضياتي الجميلة ٤" – fourth-grade math syllabus – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./math4-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, sentence, chip1, chip2, traceword?]
const ITEMS = [["الضَّرْبُ فِي ١٠", "Multiplying by 10", "array:2,5", "٢٣ × ١٠ = ٢٣٠", "٢٣ × ١٠ = ٢٣٠", "نُضِيفُ صِفْرًا وَاحِدًا", "٢٣ × ١٠ = ٢٣٠"], ["الضَّرْبُ فِي ١٠٠", "Multiplying by 100", "array:4,5", "٤٥ × ١٠٠ = ٤٥٠٠", "٤٥ × ١٠٠ = ٤٥٠٠", "نُضِيفُ صِفْرَيْنِ", "٤٥ × ١٠٠ = ٤٥٠٠"], ["قِسْمَةٌ بِلَا بَاقٍ", "Division without remainder", "array:4,5", "نُوَزِّعُ ٢٠ كُرَةً عَلَى ٥ صُفُوفٍ بِالتَّسَاوِي", "٢٠ ÷ ٥ = ٤", "لَا يُوجَدُ بَاقٍ", "٢٠ ÷ ٥ = ٤"], ["قِسْمَةٌ مَعَ بَاقٍ", "Division with remainder", "remdots:17,5", "نُوَزِّعُ ١٧ كُرَةً فِي صُفُوفٍ مِنْ ٥ فَيَبْقَى كُرَتَانِ", "١٧ ÷ ٥ = ٣", "البَاقِي ٢", "١٧ ÷ ٥ = ٣"], ["الكُسُورُ المُتَكَافِئَةُ", "Equivalent fractions", "frac:4,2", "نِصْفُ الدَّائِرَةِ يُسَاوِي جُزْأَيْنِ مِنْ أَرْبَعَةٍ", "١/٢ = ٢/٤", "نَضْرِبُ البَسْطَ وَالمَقَامَ فِي العَدَدِ نَفْسِهِ", "١/٢ = ٢/٤"], ["جَمْعُ الكُسُورِ", "Adding fractions", "frac:5,3", "نَجْمَعُ البَسْطَيْنِ وَيَبْقَى المَقَامُ كَمَا هُوَ", "١/٥ + ٢/٥ = ٣/٥", "المَقَامُ لَا يَتَغَيَّرُ", "١/٥ + ٢/٥ = ٣/٥"], ["طَرْحُ الكُسُورِ", "Subtracting fractions", "frac:6,3", "نَطْرَحُ البَسْطَيْنِ وَيَبْقَى المَقَامُ كَمَا هُوَ", "٥/٦ − ٢/٦ = ٣/٦", "المَقَامُ لَا يَتَغَيَّرُ", "٥/٦ − ٢/٦ = ٣/٦"], ["خَمْسَةُ أَعْشَارٍ", "Five tenths", "frac:10,5", "لَوَّنَّا خَمْسَةَ أَجْزَاءٍ مِنْ عَشَرَةٍ", "٠٫٥", "٥/١٠", "٠٫٥"], ["ثَلَاثَةُ أَعْشَارٍ", "Three tenths", "frac:10,3", "لَوَّنَّا ثَلَاثَةَ أَجْزَاءٍ مِنْ عَشَرَةٍ", "٠٫٣", "٣/١٠", "٠٫٣"], ["الزَّاوِيَةُ الحَادَّةُ", "Acute angle", "angle:50", "الزَّاوِيَةُ الحَادَّةُ أَصْغَرُ مِنَ القَائِمَةِ", "أَقَلُّ مِنْ ٩٠ دَرَجَةً", "رَأْسُ قِطْعَةِ البِيتْزَا"], ["الزَّاوِيَةُ القَائِمَةُ", "Right angle", "angle:90", "زَاوِيَةُ الكِتَابِ زَاوِيَةٌ قَائِمَةٌ", "٩٠ دَرَجَةً", "زَاوِيَةُ البَابِ"], ["الزَّاوِيَةُ المُنْفَرِجَةُ", "Obtuse angle", "angle:130", "الزَّاوِيَةُ المُنْفَرِجَةُ أَكْبَرُ مِنَ القَائِمَةِ", "أَكْبَرُ مِنْ ٩٠ دَرَجَةً", "الكُرْسِيُّ المُتَّكِئُ"], ["المِسَاحَةُ", "Area", "areagrid:4,3", "مِسَاحَةُ المُسْتَطِيلِ = الطُّولُ × العَرْضُ", "٤ × ٣ = ١٢", "١٢ وَحْدَةً مُرَبَّعَةً"]];
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

const C = {"dir": "math4-book", "prefix": "Riyadiyyati-4", "title": "رياضياتي الجميلة ٤", "artmod": "math4-art", "header": "Builds \"رياضياتي الجميلة ٤\" – fourth-grade math syllabus – A4 portrait.", "grade": "Grade 4", "theme": "4", "cover": "--h:30;background:repeating-conic-gradient(from 0deg at 50% 42%,#fff3dc 0 10deg,#ffe2b0 10deg 20deg)", "h": 30, "t1": "رِيَاضِيَّاتِي الجَمِيلَةُ", "t2": "الجُزْءُ الرَّابِعُ", "s1": "#c46a00", "s2": "#2f55c4", "csub": "أَحْسُبُ وَأَقِيسُ وَأُفَكِّرُ", "cen": "My Beautiful Math 4", "coverTop": ["angle:50", "array:3,4", "frac:4,2"], "coverBot": ["areagrid:4,3", "remdots:17,5", "angle:130", "frac:10,3"], "ownerArt": "array:3,4", "ownerMini": ["angle:90", "frac:4,2", "areagrid:4,3"], "noteP": "هٰذَا الكِتَابُ يُكْمِلُ مَهَارَاتِ الرِّيَاضِيَّاتِ: الأَعْدَادُ حَتَّى المِلْيُونِ، وَالعَمَلِيَّاتُ الأَرْبَعُ، وَالكُسُورُ، وَالأَعْدَادُ العَشْرِيَّةُ، وَالزَّوَايَا، وَالمِسَاحَةُ 🔢", "noteLi": ["دَرِّبُوا طِفْلَكُمْ عَلَى قِرَاءَةِ الأَعْدَادِ الكَبِيرَةِ مِنَ الفَوَاتِيرِ وَالأَسْعَارِ.", "اسْتَعْمِلُوا قِطَعَ الفَطِيرَةِ وَالبِيتْزَا لِشَرْحِ الكُسُورِ المُتَكَافِئَةِ.", "ابْحَثُوا عَنِ الزَّوَايَا القَائِمَةِ وَالحَادَّةِ وَالمُنْفَرِجَةِ فِي البَيْتِ.", "حُلُّوا مَسْأَلَةً كَلَامِيَّةً كُلَّ يَوْمٍ، وَاطْلُبُوا مِنْهُ شَرْحَ طَرِيقَتِهِ."], "noteMini": ["angle:50", "frac:10,5", "remdots:17,5"], "certP": "لِأَنَّهُ أَتَمَّ كِتَابَ «رِيَاضِيَّاتِي الجَمِيلَةُ ٤» بِنَجَاحٍ", "certArts": ["angle:90", "medal", "array:2,5"], "blurb": "كِتَابٌ شَامِلٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَادِ لِتَعْلِيمِ الرِّيَاضِيَّاتِ لِلْأَطْفَالِ فِي سَنَتِهِمُ الدِّرَاسِيَّةِ الرَّابِعَةِ.", "blurbLi": ["الأَعْدَادُ حَتَّى المِلْيُونِ وَالتَّقْرِيبُ", "الجَمْعُ وَالطَّرْحُ وَالضَّرْبُ وَالقِسْمَةُ مَعَ البَاقِي", "الكُسُورُ المُتَكَافِئَةُ وَالأَعْدَادُ العَشْرِيَّةُ", "الزَّوَايَا وَالمِسَاحَةُ، وَمَسَائِلُ كَلَامِيَّةٌ، وَشَهَادَةٌ"], "en2": "A complete, joyful 3D math book – part 4", "backArts": ["frac:5,3", "angle:50", "areagrid:5,2", "array:2,5"], "extraCss": ".vgrid{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:20px}\n.vs{background:#fff;border-radius:28px;padding:14px 30px;box-shadow:0 6px 0 hsl(var(--h),50%,74%);direction:ltr;text-align:right;font-family:Baloo}\n.vs span{display:block;font-size:54px;font-weight:800;line-height:1.35;color:hsl(var(--h),60%,28%);letter-spacing:6px}.vs span em{font-style:normal;float:left;color:hsl(var(--h),70%,45%)}\n.vs i{display:block;height:6px;border-radius:3px;background:hsl(var(--h),40%,40%);margin:6px 0 10px}\n.vs b{display:flex;justify-content:flex-end;gap:6px}.vs u{display:inline-block;width:40px;height:52px;border:3px dashed hsl(var(--h),50%,60%);border-radius:10px}\n.wps{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:22px}.wp{display:flex;align-items:center;gap:18px;background:#fff;border-radius:30px;padding:14px 22px;box-shadow:0 7px 0 hsl(var(--h),50%,74%);flex-wrap:wrap}\n.wp svg{width:120px;height:120px;flex:none}.wp p{flex:1;font-size:30px;font-weight:800;line-height:1.9;color:#2b2340}.wp b{width:100%;text-align:left;font-size:28px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.6}\n.pvt{position:relative;margin-top:24px;background:#fff;border-radius:30px;padding:16px 24px;box-shadow:0 7px 0 #c9b2ff}.pvh,.pvr{display:flex;align-items:center;gap:14px;margin-top:10px}\n.pvh b,.pvr span{flex:1;text-align:center;font-size:32px;font-weight:800;line-height:1.6;border-radius:18px;color:#fff;text-shadow:0 0 3px rgba(0,0,0,.6),0 0 3px rgba(0,0,0,.6)}.pvr span{font-size:50px}\n.c{background:#ff6b6b}.t{background:#4fa8ff}.o{background:#36c45d}.pvr em{width:150px;font-style:normal;font-size:42px;font-weight:800;color:#6a3fd0}.pvh:after{content:'';width:150px}\n.ttab{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}.ttab div{background:#fff;border-radius:26px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}\n.ttab h4{font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:16px;line-height:1.6;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.ttab p{font-size:29px;font-weight:800;line-height:1.75;color:#2b2340}\n.picto{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:16px}.picto>div{display:flex;align-items:center;gap:12px;background:#fff;border-radius:26px;padding:8px 18px;box-shadow:0 6px 0 #ffc98a}\n.picto>div>svg{width:80px;height:80px}.picto b{width:150px;font-size:30px;font-weight:800;line-height:1.6}.pbar{flex:1;display:flex;gap:4px}.pbar svg{width:62px;height:62px}.pvh b.th,.pvr span.th{background:#b05cff}.pvh:after,.pvr em{width:120px}.pvr em{width:170px !important;white-space:nowrap;font-size:36px}.pvh:after{width:170px !important}.perg{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:18px}.perg>div{display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:10px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}.perg svg{width:220px;height:220px;flex:none}.perg b{display:block;font-size:32px;font-weight:800;line-height:1.8}.perg p{font-size:30px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.8}.pv6 .pvh b,.pv6 .pvr span{font-size:22px}.pv6 .pvr span{font-size:44px}.pv6 .pvh b{line-height:1.4;padding:6px 2px}.pvh b.h6,.pvr span.h6{background:#e8508f}.pvh b.h5,.pvr span.h5{background:#ff8a1f}\n.dvs{position:relative;margin-top:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.dvs div{background:#fff;border-radius:26px;padding:16px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}.dvs b{display:block;font-size:48px;font-weight:800;line-height:1.5;color:hsl(var(--h),60%,30%)}.dvs span{display:block;font-size:28px;font-weight:800;line-height:1.8;color:#2b2340}", "units": [{"title": "الأَعْدَادُ حَتَّى المِلْيُونِ", "en": "Numbers to a Million", "icon": "group:book,3", "arts": ["group:book,2", "group:book,3"], "intro": "أَتَعَرَّفُ عَلَى مَنَازِلِ الأَعْدَادِ حَتَّى مِئَاتِ الأُلُوفِ، وَأَقْرَأُ الأَعْدَادَ الكَبِيرَةَ.", "acts": [{"type": "raw", "title": "القِيمَةُ المَنْزِلِيَّةُ", "html": "<div class=\"pvt pv6\"><div class=\"pvh\"><b class=\"h6\">مِئَاتُ الأُلُوفِ</b><b class=\"h5\">عَشَرَاتُ الأُلُوفِ</b><b class=\"th\">الأُلُوفُ</b><b class=\"c\">المِئَاتُ</b><b class=\"t\">العَشَرَاتُ</b><b class=\"o\">الآحَادُ</b></div><div class=\"pvr\"><span class=\"h6\">٢</span><span class=\"h5\">٤</span><span class=\"th\">٥</span><span class=\"c\">٣</span><span class=\"t\">١</span><span class=\"o\">٦</span><em>= ٢٤٥٣١٦</em></div><div class=\"pvr\"><span class=\"h6\">٥</span><span class=\"h5\">٠</span><span class=\"th\">٨</span><span class=\"c\">٠</span><span class=\"t\">٤</span><span class=\"o\">٠</span><em>= ٥٠٨٠٤٠</em></div><div class=\"pvr\"><span class=\"h6\">٩</span><span class=\"h5\">٩</span><span class=\"th\">٩</span><span class=\"c\">٩</span><span class=\"t\">٩</span><span class=\"o\">٩</span><em>= ٩٩٩٩٩٩</em></div></div><div class=\"hint\" style=\"margin-top:20px\">المِلْيُونُ = ١٠٠٠٠٠٠ ، وَهُوَ أَلْفُ أَلْفٍ</div>"}, {"type": "words", "title": "فِي أَيِّ مَنْزِلَةٍ الرَّقْمُ بَعْدَ السَّهْمِ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٤٣٦٥٢١ ← ٤", ["مِئَاتُ الأُلُوفِ", "الآحَادُ"]], ["٧٢٨٠٥٤ ← ٢", ["عَشَرَاتُ الأُلُوفِ", "المِئَاتُ"]], ["١٥٣٩٠٧ ← ٣", ["الأُلُوفُ", "العَشَرَاتُ"]], ["٦٨٢٣٤٠ ← ٣", ["المِئَاتُ", "الأُلُوفُ"]]]}, {"type": "words", "title": "أَيُّهُمَا أَكْبَرُ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ العَدَدِ الأَكْبَرِ ⭕", "rows": [["٣٤٥٦٧٨ أَمْ ٣٥٤٦٧٨", ["٣٤٥٦٧٨", "٣٥٤٦٧٨"]], ["٨٠٠٠٠٠ أَمْ ٧٩٩٩٩٩", ["٨٠٠٠٠٠", "٧٩٩٩٩٩"]], ["١٢٠٤٥٠ أَمْ ١٢٠٥٤٠", ["١٢٠٤٥٠", "١٢٠٥٤٠"]], ["٩٩٩٩٩٩ أَمْ ١٠٠٠٠٠٠", ["٩٩٩٩٩٩", "١٠٠٠٠٠٠"]]]}, {"type": "words", "title": "التَّقْرِيبُ لِأَقْرَبِ مِئَةٍ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٣٤٥٦", ["٣٥٠٠", "٣٤٠٠"]], ["٧٨٤٩", ["٧٨٠٠", "٧٩٠٠"]], ["١٢٥٠", ["١٣٠٠", "١٢٠٠"]], ["٦٠٨١", ["٦١٠٠", "٦٠٠٠"]]]}]}, {"title": "الجَمْعُ وَالطَّرْحُ", "en": "Addition & Subtraction", "icon": "sumpic:apple,3,2,+", "arts": ["sumpic:apple,3,2,+", "sumpic:apple,5,2,-"], "intro": "أَجْمَعُ وَأَطْرَحُ أَعْدَادًا كَبِيرَةً بِالطَّرِيقَةِ العَمُودِيَّةِ.", "acts": [{"type": "raw", "title": "أَجْمَعُ عَمُودِيًّا", "html": "<div class=\"hint\">أَحْسُبُ وَأَكْتُبُ النَّاتِجَ فِي المُرَبَّعَاتِ ✏️</div><div class=\"vgrid\"><div class=\"vs\" style=\"--h:20\"><span>٢٤٥١٣</span><span><em>+</em>١٣٢٦٤</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:75\"><span>٤٥٦٧٨</span><span><em>+</em>٢٣٤٥٦</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:130\"><span>٣٠٩٠٥</span><span><em>+</em>٤٨١٩٦</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:185\"><span>١٢٣٤٥</span><span><em>+</em>٦٧٨٩٠</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:240\"><span>٥٦٧٨٩</span><span><em>+</em>١٢٣٤٥</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:295\"><span>٤٠٤٠٤</span><span><em>+</em>٥٩٥٩٦</span><i></i><b><u></u><u></u><u></u><u></u><u></u><u></u></b></div></div>"}, {"type": "raw", "title": "أَطْرَحُ عَمُودِيًّا", "html": "<div class=\"hint\">أَحْسُبُ وَأَكْتُبُ النَّاتِجَ فِي المُرَبَّعَاتِ ✏️</div><div class=\"vgrid\"><div class=\"vs\" style=\"--h:20\"><span>٨٦٧٥٤</span><span><em>−</em>٢٣٤١٢</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:75\"><span>٥٠٠٠٠</span><span><em>−</em>١٢٣٤٥</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:130\"><span>٧٣٢٠١</span><span><em>−</em>٤٥٦٧٨</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:185\"><span>٩١٨٢٧</span><span><em>−</em>٣٦٤٥٠</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:240\"><span>٦٠٠٣٠</span><span><em>−</em>٢٠٩٠٧</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:295\"><span>٤٤٤٤٤</span><span><em>−</em>١٩٩٩٩</span><i></i><b><u></u><u></u><u></u><u></u><u></u></b></div></div>"}, {"type": "raw", "title": "مَسَائِلُ كَلَامِيَّةٌ", "html": "<div class=\"wps\"><div class=\"wp\" style=\"--h:30\"><span data-a=\"students\"></span><p>فِي مَدِينَةٍ ٤٥٢٠٠ رَجُلٍ وَ ٤٣٨٥٠ امْرَأَةً. كَمْ عَدَدُهُمْ جَمِيعًا؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:100\"><span data-a=\"library\"></span><p>كَانَ فِي المَكْتَبَةِ ١٢٥٠٠ كِتَابٍ، وَأُعِيرَ مِنْهَا ٣٧٥٠ كِتَابًا. كَمْ كِتَابًا بَقِيَ؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:170\"><span data-a=\"plane\"></span><p>قَطَعَتْ طَائِرَةٌ ٢٥٤٠ كِيلُومِتْرًا ذَهَابًا، وَمِثْلَهَا إِيَابًا. كَمِ المَسَافَةُ كُلُّهَا؟</p><b>الجَوَابُ: ........</b></div></div>"}]}, {"title": "الضَّرْبُ", "en": "Multiplication", "icon": "array:3,4", "arts": ["array:3,4", "array:2,5"], "intro": "أَضْرِبُ فِي ١٠ وَ ١٠٠ بِسُهُولَةٍ، وَأَضْرِبُ عَدَدًا مِنْ رَقْمَيْنِ أَوْ ثَلَاثَةٍ فِي عَدَدٍ مِنْ رَقْمٍ وَاحِدٍ.", "chip1": ["✖️", "الجُمْلَةُ العَدَدِيَّةُ"], "chip2": ["💡", "القَاعِدَةُ"], "items": [["الضَّرْبُ فِي ١٠", "Multiplying by 10", "array:2,5", "٢٣ × ١٠ = ٢٣٠", "٢٣ × ١٠ = ٢٣٠", "نُضِيفُ صِفْرًا وَاحِدًا", "٢٣ × ١٠ = ٢٣٠"], ["الضَّرْبُ فِي ١٠٠", "Multiplying by 100", "array:4,5", "٤٥ × ١٠٠ = ٤٥٠٠", "٤٥ × ١٠٠ = ٤٥٠٠", "نُضِيفُ صِفْرَيْنِ", "٤٥ × ١٠٠ = ٤٥٠٠"]], "acts": [{"type": "raw", "title": "أَضْرِبُ عَمُودِيًّا", "html": "<div class=\"hint\">أَحْسُبُ وَأَكْتُبُ النَّاتِجَ فِي المُرَبَّعَاتِ ✏️</div><div class=\"vgrid\"><div class=\"vs\" style=\"--h:20\"><span>٢٣</span><span><em>×</em>٤</span><i></i><b><u></u><u></u></b></div><div class=\"vs\" style=\"--h:75\"><span>٤٧</span><span><em>×</em>٦</span><i></i><b><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:130\"><span>٨٥</span><span><em>×</em>٩</span><i></i><b><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:185\"><span>٣٦</span><span><em>×</em>٨</span><i></i><b><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:240\"><span>٧٢</span><span><em>×</em>٥</span><i></i><b><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:295\"><span>٩٩</span><span><em>×</em>٣</span><i></i><b><u></u><u></u><u></u></b></div></div>"}, {"type": "raw", "title": "أَضْرِبُ عَمُودِيًّا", "html": "<div class=\"hint\">أَحْسُبُ وَأَكْتُبُ النَّاتِجَ فِي المُرَبَّعَاتِ ✏️</div><div class=\"vgrid\"><div class=\"vs\" style=\"--h:20\"><span>١٢٥</span><span><em>×</em>٣</span><i></i><b><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:75\"><span>٢١٤</span><span><em>×</em>٦</span><i></i><b><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:130\"><span>٣٠٧</span><span><em>×</em>٨</span><i></i><b><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:185\"><span>٤٥٦</span><span><em>×</em>٧</span><i></i><b><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:240\"><span>٦٠٨</span><span><em>×</em>٤</span><i></i><b><u></u><u></u><u></u><u></u></b></div><div class=\"vs\" style=\"--h:295\"><span>٩٩٩</span><span><em>×</em>٢</span><i></i><b><u></u><u></u><u></u><u></u></b></div></div>"}, {"type": "words", "title": "أَحْسُبُ النَّاتِجَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٢٣ × ٤ = ...", ["٩٢", "٨٢"]], ["٥٦ × ٧ = ...", ["٣٩٢", "٣٨٢"]], ["١٢٥ × ٣ = ...", ["٣٧٥", "٣٦٥"]], ["٤٨ × ٩ = ...", ["٤٣٢", "٤٢٢"]]]}, {"type": "raw", "title": "مَسَائِلُ كَلَامِيَّةٌ", "html": "<div class=\"wps\"><div class=\"wp\" style=\"--h:30\"><span data-a=\"students\"></span><p>فِي المَدْرَسَةِ ٢٤ فَصْلًا، فِي كُلِّ فَصْلٍ ٣٠ طَالِبًا. كَمْ طَالِبًا فِي المَدْرَسَةِ؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:100\"><span data-a=\"book\"></span><p>ثَمَنُ الكِتَابِ ١٥ رِيَالًا. كَمْ ثَمَنُ ٨ كُتُبٍ؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:170\"><span data-a=\"dates\"></span><p>فِي الصُّنْدُوقِ ١٢٥ تَمْرَةً. كَمْ تَمْرَةً فِي ٤ صَنَادِيقَ؟</p><b>الجَوَابُ: ........</b></div></div>"}]}, {"title": "القِسْمَةُ", "en": "Division", "icon": "remdots:17,5", "arts": ["remdots:17,5", "array:4,5"], "intro": "أَقْسِمُ الأَعْدَادَ، وَقَدْ يَبْقَى بَاقٍ أَصْغَرُ مِنَ المَقْسُومِ عَلَيْهِ.", "chip1": ["➗", "الجُمْلَةُ العَدَدِيَّةُ"], "chip2": ["🔍", "البَاقِي"], "items": [["قِسْمَةٌ بِلَا بَاقٍ", "Division without remainder", "array:4,5", "نُوَزِّعُ ٢٠ كُرَةً عَلَى ٥ صُفُوفٍ بِالتَّسَاوِي", "٢٠ ÷ ٥ = ٤", "لَا يُوجَدُ بَاقٍ", "٢٠ ÷ ٥ = ٤"], ["قِسْمَةٌ مَعَ بَاقٍ", "Division with remainder", "remdots:17,5", "نُوَزِّعُ ١٧ كُرَةً فِي صُفُوفٍ مِنْ ٥ فَيَبْقَى كُرَتَانِ", "١٧ ÷ ٥ = ٣", "البَاقِي ٢", "١٧ ÷ ٥ = ٣"]], "acts": [{"type": "raw", "title": "أَقْسِمُ", "html": "<div class=\"hint\">أَقْسِمُ وَأَكْتُبُ النَّاتِجَ وَالبَاقِيَ ✏️</div><div class=\"dvs\"><div style=\"--h:20\"><b>٢٩ ÷ ٤</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div><div style=\"--h:70\"><b>٤٧ ÷ ٦</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div><div style=\"--h:120\"><b>٥٨ ÷ ٧</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div><div style=\"--h:170\"><b>٨٣ ÷ ٩</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div><div style=\"--h:220\"><b>٦٥ ÷ ٨</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div><div style=\"--h:270\"><b>١٠٠ ÷ ٧</b><span>النَّاتِجُ: ......</span><span>البَاقِي: ......</span></div></div>"}, {"type": "words", "title": "مَا البَاقِي؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٢٣ ÷ ٥", ["٣", "٢"]], ["٣٨ ÷ ٦", ["٢", "٤"]], ["٥٠ ÷ ٧", ["١", "٣"]], ["٧١ ÷ ٨", ["٧", "٥"]]]}, {"type": "raw", "title": "مَسَائِلُ كَلَامِيَّةٌ", "html": "<div class=\"wps\"><div class=\"wp\" style=\"--h:30\"><span data-a=\"pencil\"></span><p>وَزَّعَ المُعَلِّمُ ٤٥ قَلَمًا عَلَى ٩ طُلَّابٍ بِالتَّسَاوِي. كَمْ قَلَمًا لِكُلِّ طَالِبٍ؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:100\"><span data-a=\"dates\"></span><p>عِنْدَ أُمِّي ٣٠ تَمْرَةً، وَضَعَتْهَا فِي أَطْبَاقٍ فِي كُلِّ طَبَقٍ ٤ تَمَرَاتٍ. كَمْ طَبَقًا مَلَأَتْ؟ وَكَمْ بَقِيَ؟</p><b>الجَوَابُ: ........</b></div><div class=\"wp\" style=\"--h:170\"><span data-a=\"bus\"></span><p>حَافِلَةٌ تَتَّسِعُ لِـ ٨ رُكَّابٍ. كَمْ حَافِلَةً نَحْتَاجُ لِنَقْلِ ٢٤ رَاكِبًا؟</p><b>الجَوَابُ: ........</b></div></div>"}]}, {"title": "الكُسُورُ", "en": "Fractions", "icon": "frac:4,2", "arts": ["frac:2,1", "frac:4,2"], "intro": "الكُسُورُ المُتَكَافِئَةُ لَهَا القِيمَةُ نَفْسُهَا، وَنَجْمَعُ الكُسُورَ ذَاتَ المَقَامِ الوَاحِدِ بِجَمْعِ البُسُوطِ.", "chip1": ["🍰", "الكَسْرُ"], "chip2": ["💡", "القَاعِدَةُ"], "items": [["الكُسُورُ المُتَكَافِئَةُ", "Equivalent fractions", "frac:4,2", "نِصْفُ الدَّائِرَةِ يُسَاوِي جُزْأَيْنِ مِنْ أَرْبَعَةٍ", "١/٢ = ٢/٤", "نَضْرِبُ البَسْطَ وَالمَقَامَ فِي العَدَدِ نَفْسِهِ", "١/٢ = ٢/٤"], ["جَمْعُ الكُسُورِ", "Adding fractions", "frac:5,3", "نَجْمَعُ البَسْطَيْنِ وَيَبْقَى المَقَامُ كَمَا هُوَ", "١/٥ + ٢/٥ = ٣/٥", "المَقَامُ لَا يَتَغَيَّرُ", "١/٥ + ٢/٥ = ٣/٥"], ["طَرْحُ الكُسُورِ", "Subtracting fractions", "frac:6,3", "نَطْرَحُ البَسْطَيْنِ وَيَبْقَى المَقَامُ كَمَا هُوَ", "٥/٦ − ٢/٦ = ٣/٦", "المَقَامُ لَا يَتَغَيَّرُ", "٥/٦ − ٢/٦ = ٣/٦"]], "acts": [{"type": "circle", "title": "أَيُّ شَكْلٍ يُسَاوِي ١/٢؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["١/٢", ["frac:4,1", "frac:4,2", "frac:4,3"]], ["١/٢", ["frac:6,3", "frac:6,2", "frac:6,1"]], ["١/٢", ["frac:3,1", "frac:8,2", "frac:8,4"]], ["١/٢", ["frac:10,5", "frac:10,3", "frac:10,8"]]]}, {"type": "words", "title": "أَجْمَعُ وَأَطْرَحُ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٢/٧ + ٣/٧ = ...", ["٥/٧", "٥/١٤"]], ["٤/٩ + ٤/٩ = ...", ["٨/٩", "٨/١٨"]], ["٦/٨ − ١/٨ = ...", ["٥/٨", "٥/٠"]], ["٩/١٠ − ٤/١٠ = ...", ["٥/١٠", "٥/٢٠"]]]}, {"type": "words", "title": "أُكْمِلُ الكَسْرَ المُكَافِئَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["١/٣ = .../٦", ["٢", "٣"]], ["٢/٥ = .../١٠", ["٤", "٥"]], ["٣/٤ = .../٨", ["٦", "٤"]], ["١/٢ = .../١٠", ["٥", "٢"]]]}]}, {"title": "الأَعْدَادُ العَشْرِيَّةُ", "en": "Decimals", "icon": "frac:10,3", "arts": ["frac:10,5", "frac:10,3"], "intro": "العَدَدُ العَشْرِيُّ يُكْتَبُ بِفَاصِلَةٍ عَشْرِيَّةٍ «٫»، وَالجُزْءُ مِنْ عَشَرَةٍ اسْمُهُ «عُشْرٌ».", "chip1": ["🔢", "العَدَدُ العَشْرِيُّ"], "chip2": ["🍰", "الكَسْرُ"], "items": [["خَمْسَةُ أَعْشَارٍ", "Five tenths", "frac:10,5", "لَوَّنَّا خَمْسَةَ أَجْزَاءٍ مِنْ عَشَرَةٍ", "٠٫٥", "٥/١٠", "٠٫٥"], ["ثَلَاثَةُ أَعْشَارٍ", "Three tenths", "frac:10,3", "لَوَّنَّا ثَلَاثَةَ أَجْزَاءٍ مِنْ عَشَرَةٍ", "٠٫٣", "٣/١٠", "٠٫٣"]], "acts": [{"type": "words", "title": "أُحَوِّلُ الكَسْرَ إِلَى عَدَدٍ عَشْرِيٍّ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٧/١٠", ["٠٫٧", "٧٫٠"]], ["٢/١٠", ["٠٫٢", "٢٫١"]], ["٩/١٠", ["٠٫٩", "٩٫١"]], ["٤/١٠", ["٠٫٤", "٤٫٠"]]]}, {"type": "words", "title": "أَيُّهُمَا أَكْبَرُ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ العَدَدِ الأَكْبَرِ ⭕", "rows": [["٠٫٦ أَمْ ٠٫٤", ["٠٫٦", "٠٫٤"]], ["٠٫٣ أَمْ ٠٫٨", ["٠٫٣", "٠٫٨"]], ["١٫٥ أَمْ ٠٫٩", ["١٫٥", "٠٫٩"]], ["٠٫١ أَمْ ٠٫٢", ["٠٫١", "٠٫٢"]]]}, {"type": "words", "title": "أَجْمَعُ الأَعْدَادَ العَشْرِيَّةَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٠٫٢ + ٠٫٥ = ...", ["٠٫٧", "٠٫٢٥"]], ["٠٫٤ + ٠٫٤ = ...", ["٠٫٨", "٠٫٤٤"]], ["١٫٣ + ٠٫٦ = ...", ["١٫٩", "١٫٣٦"]], ["٠٫٥ + ٠٫٥ = ...", ["١", "٠٫١٠"]]]}]}, {"title": "الزَّوَايَا وَالمِسَاحَةُ", "en": "Angles & Area", "icon": "angle:90", "arts": ["angle:50", "angle:90", "angle:130"], "intro": "الزَّاوِيَةُ القَائِمَةُ قِيَاسُهَا ٩٠ دَرَجَةً، وَالحَادَّةُ أَصْغَرُ مِنْهَا، وَالمُنْفَرِجَةُ أَكْبَرُ مِنْهَا. وَالمِسَاحَةُ عَدَدُ الوَحَدَاتِ المُرَبَّعَةِ دَاخِلَ الشَّكْلِ.", "chip1": ["📐", "القِيَاسُ"], "chip2": ["🔍", "مِثَالٌ"], "items": [["الزَّاوِيَةُ الحَادَّةُ", "Acute angle", "angle:50", "الزَّاوِيَةُ الحَادَّةُ أَصْغَرُ مِنَ القَائِمَةِ", "أَقَلُّ مِنْ ٩٠ دَرَجَةً", "رَأْسُ قِطْعَةِ البِيتْزَا"], ["الزَّاوِيَةُ القَائِمَةُ", "Right angle", "angle:90", "زَاوِيَةُ الكِتَابِ زَاوِيَةٌ قَائِمَةٌ", "٩٠ دَرَجَةً", "زَاوِيَةُ البَابِ"], ["الزَّاوِيَةُ المُنْفَرِجَةُ", "Obtuse angle", "angle:130", "الزَّاوِيَةُ المُنْفَرِجَةُ أَكْبَرُ مِنَ القَائِمَةِ", "أَكْبَرُ مِنْ ٩٠ دَرَجَةً", "الكُرْسِيُّ المُتَّكِئُ"], ["المِسَاحَةُ", "Area", "areagrid:4,3", "مِسَاحَةُ المُسْتَطِيلِ = الطُّولُ × العَرْضُ", "٤ × ٣ = ١٢", "١٢ وَحْدَةً مُرَبَّعَةً"]], "acts": [{"type": "words", "title": "مَا نَوْعُ الزَّاوِيَةِ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["٣٠ دَرَجَةً", ["حَادَّةٌ", "مُنْفَرِجَةٌ"]], ["٩٠ دَرَجَةً", ["قَائِمَةٌ", "حَادَّةٌ"]], ["١٢٠ دَرَجَةً", ["مُنْفَرِجَةٌ", "قَائِمَةٌ"]], ["٧٥ دَرَجَةً", ["حَادَّةٌ", "مُنْفَرِجَةٌ"]]]}, {"type": "words", "title": "أَحْسُبُ المِسَاحَةَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["مُسْتَطِيلٌ ٥ × ٢", ["١٠", "٧"]], ["مُرَبَّعٌ ضِلْعُهُ ٤", ["١٦", "٨"]], ["مُسْتَطِيلٌ ٦ × ٣", ["١٨", "٩"]], ["مُرَبَّعٌ ضِلْعُهُ ٧", ["٤٩", "١٤"]]]}]}]};
const AR2 = 0;
const G = (x, cls) => { const k = x.indexOf(':'); const n = k < 0 ? x : x.slice(0, k), col = k < 0 ? '' : x.slice(k + 1); const o = {}; if (cls) o.cls = cls; if (col) o.color = col; return art(n, o); };
const L = (x) => BY[x] ? BY[x][0] : BY[x.split(':')[0]] ? BY[x.split(':')[0]][0] : '';
// 1 ---------- Cover
pages.push(`
<section class="page cover">
  ${bubbles(1, C.h, 12)}
  ${C.grade ? `<div class="gbadge">${C.grade}</div>` : ''}
  ${C.coverTop.map((x, k) => `<div class="ca cs${k}">${G(x)}</div>`).join('')}
  <h1>${t3d(C.t1, '#ffffff', C.s1, 12)}<br>${t3d(C.t2, '#ffd23f', C.s2, 12)}</h1>
  <div class="csub">${C.csub}</div>
  <div class="cen">${C.cen}</div>
  ${C.coverBot.map((x, k) => `<div class="ca cs${k + 3}">${G(x)}</div>`).join('')}
</section>`);
P++;
// 2 ---------- Owner page
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(2, C.h)}
  <div class="owner">
    <div class="ownerart">${G(C.ownerArt)}</div>
    <h2>${t3d('هٰذَا الكِتَابُ مِلْكُ', '#fff', C.s1, 7)}</h2>
    <div class="author">تَأْلِيف: ${AUTHOR}</div>
    <div class="nameline"></div>
    <div class="stars">${C.ownerMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 3 ---------- Parents note
pages.push(`
<section class="page plain" style="--h:120">
  ${bubbles(3, 120)}
  <div class="note">
    ${title('رِسَالَةٌ إِلَى الوَالِدَيْن', '#1f8f4f')}
    <div class="card">
      <p>${C.noteP}</p>
      <ul>${C.noteLi.map(x => `<li>${x}</li>`).join('')}<li>العَبُوا الأَلْعَابَ فِي آخِرِ الكِتَاب، ثُمَّ امْنَحُوهُ الشَّهَادَة!</li></ul>
    </div>
    <div class="row3">${C.noteMini.map(x => G(x, 'mini')).join('')}</div>
  </div>
  ${pno(P++)}
</section>`);
// 4 ---------- Overview / contents
if (C.units) {
  let pg = 5; const rows = C.units.map((u, k) => { const r = { n: k + 1, t: u.title, en: u.en, a: u.icon, pg }; pg += 1 + (u.items || []).length + (u.acts || []).length; return r; });
  pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.tocTitle || 'الفِهْرِس', C.s1)}
  <div class="toc">${rows.map(r => `<div class="tocr" style="--h:${(r.n * 47 + C.h) % 360}"><i>${AR(r.n)}</i>${G(r.a)}<div><b>${r.t}</b><small>${r.en}</small></div><span>${AR(r.pg)}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`);
} else {
pages.push(`
<section class="page plain" style="--h:${C.h}">
  ${bubbles(4, C.h)}
  ${title(C.ovTitle, C.s1)}
  <div class="ovg${ITEMS.length > 12 ? ' ov16' : ''}">${ITEMS.map(i => `<div class="ovc">${G(i[2])}<b>${i[0]}</b></div>`).join('')}</div>
  ${pno(P++)}
</section>`);
}
// items
const itemPages = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], i) => {
  i = i + off;
  const h = hue(i); const w = tw || name; const long = w.length > (C.ltr ? 6 : 10);
  pages.push(`
  <section class="page item" style="--h:${h}">
    ${bubbles(i + 10, h)}
    <div class="iname">${t3d(name, '#fff', `hsl(${h},60%,28%)`, 9, name.length > 10 ? 'big long' : 'big')}<span class="en">${en}</span></div>
    <div class="water">${G(ill, 'ill')}</div>
    <div class="sent">${sentence}</div>
    <div class="chips">
      <div class="chip"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="chip"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="trace">
      <span class="tlabel">${C.traceLabel || '✎ أَكْتُبُ الكَلِمَة'}</span>
      <svg viewBox="0 0 700 100"><line x1="20" y1="80" x2="690" y2="80" class="base"/>${(C.ltr ? (long ? [175, 520] : [115, 350, 590]) : (long ? [520, 175] : [590, 350, 115])).map((x, k) => `<text x="${x}" y="72" class="${k ? 'dash' : 'solid'}${long ? ' sm' : ''}" text-anchor="middle">${w}</text>`).join('')}</svg>
    </div>
    ${pno(P++)}
  </section>`);
});
// activities
const ACT = { match: (a) => `<div class="hint">${a.hint}</div>
  <div class="match">${a.rows.map(([l, ll, r, rl]) => `<div class="mrow"><div class="mc">${G(l)}<b>${ll || (r.startsWith("=") ? "" : L(l))}</b></div><i class="dot"></i><i class="gap"></i><i class="dot"></i>${r.startsWith('=') ? `<div class="mq">${r.slice(1)}</div>` : `<div class="mc">${G(r)}<b>${rl || L(r)}</b></div>`}</div>`).join('')}</div>`,
  circle: (a) => `<div class="hint">${a.hint}</div>
  ${a.rows.map(([q, o], j) => `<div class="wgo" style="--h:${(j * 70 + 200) % 360}"><b>${q}</b><div>${o.map(x => G(x)).join('')}</div></div>`).join('')}`,
  tf: (a) => `<div class="hint">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأ'}</div>
  <div class="tlrow">${a.top.map(x => G(x)).join('')}</div>
  ${a.rows.map(t => `<div class="rw"><b>${t}</b><div class="opts"><span><i></i>✓</span><span><i></i>✗</span></div></div>`).join('')}`,
  maze: (a) => { const MC = 8, MR = 9, CS = 76, MZ = maze(MC, MR, a.seed || 57); let mz = '';
    for (let r = 0; r <= MR; r++) for (let c = 0; c < MC; c++) if (MZ.h[r][c] && !(r === 0 && c === MC - 1) && !(r === MR && c === 0)) mz += `M${c * CS} ${r * CS} h${CS} `;
    for (let r = 0; r < MR; r++) for (let c = 0; c <= MC; c++) if (MZ.v[r][c]) mz += `M${c * CS} ${r * CS} v${CS} `;
    return `<div class="mazebox city">${G(a.from, 'mzs')}<svg class="mz" viewBox="-6 -6 ${MC * CS + 12} ${MR * CS + 12}"><path d="${mz}" stroke="#5a6478" stroke-width="10" stroke-linecap="round" fill="none"/></svg>${G(a.to, 'mze')}</div>`; },
  count: (a) => `<div class="hint">${a.hint || 'عُدَّ وَاكْتُبِ الرَّقَمَ فِي الدَّائِرَة 🔢'}</div>
  ${a.rows.map(([x, n]) => `<div class="crow"><div class="cimgs">${Array.from({ length: n }, () => G(x)).join('')}</div><div class="cans"></div></div>`).join('')}`,
  draw: (a) => `<div class="hint">${a.hint}</div><div class="bigboard"><div></div></div><div class="todayrow"><span>${a.label}</span></div>`,
  words: (a) => `<div class="hint">${a.hint}</div>${a.rows.map(([w, o], j) => `<div class="qrow" style="--h:${(j * 60 + 260) % 360}"><div class="qw">${w}</div>${o.map(x => `<div class="qo">${x}</div>`).join('')}</div>`).join('')}`,
  sums: (a) => `<div class="hint">${a.hint || 'أَحْسُبُ وَأَكْتُبُ الجَوَابَ فِي المُرَبَّع ✏️'}</div>${a.rows.map(([it, x, y, op]) => `<div class="sumr"><div class="sg">${Array.from({ length: x }, () => G(it)).join('')}</div><b>${op === '-' ? '−' : '+'}</b><div class="sg">${Array.from({ length: y }, () => G(it)).join('')}</div><b>=</b><i class="sbox"></i><span>${AR(x)} ${op === '-' ? '−' : '+'} ${AR(y)} = ....</span></div>`).join('')}`,
  raw: (a) => a.html.replace(/<span data-a="([^"]+)"><\/span>/g, (_, x) => G(x)) + (a.arts ? `<div class="tlrow big2">${a.arts.map(x => G(x)).join("")}</div>` : ""),
};
const actPages = (LIST, off) => LIST.forEach((a, j) => {
  j = j + off;
  const h = [150, 200, 20, 45, 265, 100, 320, 180][j % 8];
  pages.push(`
<section class="page plain" style="--h:${h}">
  ${bubbles(40 + j, h)}
  ${title(a.title, `hsl(${h},60%,30%)`)}
  ${ACT[a.type](a)}
  ${pno(P++)}
</section>`);
});

const unitPage = (u, k) => pages.push(`
<section class="page plain unit" style="--h:${(k * 47 + C.h) % 360}">
  ${bubbles(60 + k, (k * 47 + C.h) % 360, 14)}
  <div class="unum">${t3d(C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ','التَّاسِعَةُ','العَاشِرَةُ'][k], '#ffd23f', '#7a3a00', 7)}</div>
  <h1 class="utitle">${t3d(u.title, '#ffffff', `hsl(${(k * 47 + C.h) % 360},60%,28%)`, 10)}</h1>
  <div class="uen">${u.en}</div>
  <div class="uart">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="card uintro">${u.intro}</div>` : ''}
  ${pno(P++)}
</section>`);
if (C.units) { let off = 0, aoff = 0; C.units.forEach((u, k) => { unitPage(u, k); itemPages(u.items || [], u, off); off += (u.items || []).length; actPages(u.acts || [], aoff); aoff += (u.acts || []).length; }); }
else { itemPages(ITEMS, C, 0); actPages(C.acts, 0); }
// Certificate
pages.push(`
<section class="page cert">
  <div class="frame">
    ${art('medal', { cls: 'medal' })}
    <h2>${t3d('شَهَادَةُ تَقْدِير', '#ffd23f', '#c46a00', 9)}</h2>
    <p class="cp">تُمْنَحُ هٰذِهِ الشَّهَادَةُ لِلْبَطَل / لِلْبَطَلَة</p>
    <div class="nameline"></div>
    <p class="cp">${C.certP}<br>أَحْسَنْتَ! أَنْتَ رَائِع ⭐</p>
    <div class="certart">${C.certArts.map(x => G(x)).join('')}</div>
    <div class="sig"><span>التَّارِيخ: ..............</span><span>التَّوْقِيع: ..............</span></div>
  </div>
  ${pno(P++)}
</section>`);
// Back cover
pages.push(`
<section class="page cover back">
  ${bubbles(9, C.h, 12)}
  <h2>${t3d(C.t1 + ' ' + C.t2, '#fff', C.s1, 8)}</h2>
  <div class="card blurb">
    <p>${C.blurb}</p>
    <ul>${C.blurbLi.map(x => `<li>${x}</li>`).join('')}</ul>
    <p class="en2">${C.en2}</p>
  </div>
  ${C.backArts.map((x, k) => `<div class="ca bs${k}">${G(x)}</div>`).join('')}
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
.cover{--h:30;background:repeating-conic-gradient(from 0deg at 50% 42%,#fff3dc 0 10deg,#ffe2b0 10deg 20deg);text-align:center;padding:40px}
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
.wgo{position:relative;margin-top:14px;background:rgba(255,255,255,.9);border-radius:34px;padding:8px 20px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.wgo b{display:block;text-align:center;font-size:29px;font-weight:800;color:hsl(var(--h),60%,28%)}
.wgo div{display:flex;justify-content:space-around}.wgo svg{width:124px;height:124px}
.tlrow{position:relative;display:flex;justify-content:center;gap:30px;margin-top:8px}.tlrow svg{width:150px;height:150px}
.mazebox.city{background:linear-gradient(#d9f2ff,#bfe3a8 70%,#8fd477);box-shadow:0 8px 0 #5fa84a,0 16px 24px rgba(10,30,70,.3)}
.item .water{height:560px}.item .ill{width:500px;height:500px}
.qrow{position:relative;display:flex;align-items:center;gap:14px;margin-top:34px;background:rgba(255,255,255,.85);border-radius:34px;padding:18px;box-shadow:0 6px 0 hsl(var(--h),50%,78%)}
.qw{min-width:220px;text-align:center;font-size:44px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:24px;padding:4px 14px;box-shadow:0 5px 0 hsl(var(--h),60%,30%);text-shadow:-2px 0 0 hsl(var(--h),60%,22%),2px 0 0 hsl(var(--h),60%,22%),0 -2px 0 hsl(var(--h),60%,22%),0 2px 0 hsl(var(--h),60%,22%)}
.qo{flex:1;text-align:center;font-size:44px;font-weight:800;background:#fff;border-radius:22px;padding:4px;box-shadow:0 4px 0 hsl(var(--h),40%,80%)}
.tlrow.big2{margin-top:40px}.tlrow.big2 svg{width:200px;height:200px}
.iname .en{margin-top:6px}
/* readability: extra room for harakat so marks never touch neighbouring lines */
.iname .t3d{line-height:1.45}.iname .en{margin-top:10px}
.sent{line-height:1.7;padding:8px 36px}
.chip b{line-height:1.6}.chip small{line-height:1.4}
.hint{line-height:1.6}.qw,.qo{line-height:1.6}.rw b{line-height:1.6}
.ovc b{font-size:19px;line-height:1.6}.mc b{line-height:1.5}.mq{line-height:1.5;font-size:36px}
.note .card{line-height:2.1}.blurb{line-height:1.9}.refc p{line-height:1.9}
.wgo b{line-height:1.6}
.t3d{font-family:Baloo,sans-serif !important;font-weight:800}
.ovg{grid-template-columns:repeat(3,1fr) !important;gap:16px !important;margin-top:22px !important}.ovc svg{width:150px !important;height:150px !important}.ovc b{font-size:23px !important}
.toc{position:relative;margin-top:26px;display:flex;flex-direction:column;gap:14px}
.tocr{display:flex;align-items:center;gap:16px;background:#fff;border-radius:28px;padding:8px 20px;box-shadow:0 6px 0 hsl(var(--h),55%,72%)}
.tocr i{font-style:normal;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),65%,48%);text-shadow:0 0 3px hsl(var(--h),60%,22%),0 0 3px hsl(var(--h),60%,22%)}
.tocr svg{width:84px;height:84px}.tocr div{flex:1}.tocr b{display:block;font-size:31px;font-weight:800;color:hsl(var(--h),60%,26%);line-height:1.6}.tocr small{font-family:Fredoka;font-size:18px;color:#6f6a8a}
.tocr span{font-size:30px;font-weight:800;color:hsl(var(--h),60%,30%)}
.unit{text-align:center}.unum{position:relative;margin-top:60px;font-size:52px}
.utitle{position:relative;font-size:84px;margin-top:20px;line-height:1.5}
.uen{position:relative;font-family:Fredoka;font-weight:600;font-size:30px;color:hsl(var(--h),50%,30%);margin-top:6px}
.uart{position:relative;display:flex;justify-content:center;gap:20px;margin-top:40px}.uart svg{width:220px;height:220px;filter:drop-shadow(0 12px 12px rgba(10,30,70,.25))}
.uintro{margin:40px 30px 0;font-size:30px;font-weight:700;line-height:2;text-align:center}
.lgrid7{position:relative;display:grid;grid-template-columns:repeat(7,1fr);gap:14px;margin-top:30px}
.lgrid7 .lt{font-style:normal;text-align:center;font-size:60px;font-weight:800;color:#fff;border-radius:22px;padding:6px 0;line-height:1.5}
.lt.q0{background:linear-gradient(#ff8a8a,#e8392b);text-shadow:0 0 3px #7a1010,0 0 3px #7a1010;box-shadow:0 6px 0 #a8201a}
.lt.q1{background:linear-gradient(#ffd84d,#ff9f1a);text-shadow:0 0 3px #7a3a00,0 0 3px #7a3a00;box-shadow:0 6px 0 #c46a00}
.lt.q2{background:linear-gradient(#7fe08a,#2aa84c);text-shadow:0 0 3px #0f5a20,0 0 3px #0f5a20;box-shadow:0 6px 0 #1f8f3f}
.lt.q3{background:linear-gradient(#8fc4ff,#2f7de8);text-shadow:0 0 3px #0f2f70,0 0 3px #0f2f70;box-shadow:0 6px 0 #1f55b8}
.ftab{position:relative;width:100%;margin-top:30px;border-collapse:separate;border-spacing:10px}
.ftab th{font-size:28px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:18px;padding:6px;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%);line-height:1.6}
.ftab td{font-size:56px;font-weight:800;text-align:center;background:#fff;border-radius:18px;line-height:1.6;color:hsl(var(--h),60%,28%);box-shadow:0 5px 0 hsl(var(--h),50%,78%)}
.ftab td.fl{background:hsl(var(--h),80%,92%)}
.tabox{position:relative;margin-top:30px;background:#fff;border-radius:34px;padding:20px 30px;box-shadow:0 8px 0 #ffc2dc}.tabox p{text-align:center;font-size:32px;font-weight:800;line-height:1.8}.tabox p b{color:#ff2d7a;font-size:44px}.tarow{display:flex;align-items:center;justify-content:center;gap:24px;margin-top:16px}.tarow span{min-width:200px;text-align:center;font-size:42px;font-weight:800;line-height:1.6;border-radius:22px;padding:4px 18px;background:#e3f0ff;color:#1f5fbf}.tarow span:last-child{background:#ffe3f0;color:#c2366a}.tarow i{font-style:normal;font-size:34px;font-weight:800;color:#ff2d7a}
.rsent{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:16px}
.rs{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:28px;padding:10px 26px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.rs b{font-size:40px;font-weight:800;line-height:1.8;color:hsl(var(--h),60%,26%)}.rs svg{width:100px;height:100px}
.story{margin-top:30px}.story h3{text-align:center;font-size:42px;font-weight:800;color:hsl(var(--h),60%,30%);line-height:1.6}.story p{font-size:36px;font-weight:700;line-height:2.2;text-align:right;margin-top:10px}
.sumr{position:relative;display:flex;align-items:center;gap:10px;margin-top:30px;min-height:150px;background:#fff;border-radius:28px;padding:10px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%);direction:rtl}
.sumr .sg{display:flex;flex-wrap:wrap;gap:2px;width:170px;justify-content:center}.sumr .sg svg{width:60px;height:60px}
.sumr b{font-size:46px;font-weight:800;color:hsl(var(--h),60%,35%)}.sumr .sbox{width:70px;height:70px;border:4px dashed hsl(var(--h),50%,60%);border-radius:16px}
.sumr span{flex:1;text-align:center;font-size:30px;font-weight:800;color:#2b2340;direction:rtl}
.ncards{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:24px}
.ncard{display:flex;align-items:center;gap:16px;background:#fff;border-radius:26px;padding:8px 18px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}
.ncard b{width:86px;text-align:center;font-size:58px;font-weight:800;color:#fff;border-radius:20px;line-height:1.4;background:hsl(var(--nh),65%,50%);text-shadow:0 0 3px hsl(var(--nh),60%,20%),0 0 3px hsl(var(--nh),60%,20%)}
.ncard .dots{flex:1;display:flex;flex-wrap:wrap;gap:6px}.ncard .dots i{width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,hsl(var(--nh),80%,60%) 50%,hsl(var(--nh),70%,40%))}
.ncard small{font-size:24px;font-weight:800;color:#5a5470;line-height:1.6}
.h100{position:relative;display:grid;grid-template-columns:repeat(10,1fr);gap:6px;margin-top:24px;direction:rtl}
.h100 i{font-style:normal;text-align:center;font-size:27px;font-weight:800;background:#fff;border-radius:10px;line-height:1.9;color:#2b2340;box-shadow:0 3px 0 hsl(var(--h),40%,80%)}
.h100 i.t{background:hsl(var(--h),70%,55%);color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}
.tens{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:24px}
.tens div{display:flex;align-items:center;justify-content:space-between;background:#fff;border-radius:24px;padding:6px 22px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.tens b{font-size:46px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.5}.tens span{font-size:32px;font-weight:800;line-height:1.6}
.twrite{position:relative;display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-top:30px}
.twrite div{background:#fff;border-radius:22px;text-align:center;padding:6px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.twrite b{display:block;font-size:64px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.4}.twrite i{display:block;font-style:normal;font-size:64px;font-weight:800;color:#dcd5e8;line-height:1.4}
.clk4{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:30px}.clk4 div{background:#fff;border-radius:28px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.clk4 svg{width:230px;height:230px;margin:0 auto}.clk4 b{font-size:30px;font-weight:800;line-height:1.6}
.gbadge{position:absolute;top:16px;left:50%;transform:translateX(-50%);z-index:5;font-family:Fredoka,Baloo,sans-serif;font-weight:700;font-size:26px;color:#fff;padding:2px 24px;border-radius:22px;direction:ltr;
  background:linear-gradient(150deg,#ffb627,#ff6b1a);box-shadow:inset 0 3px 0 rgba(255,255,255,.4),0 4px 0 #c45000,0 8px 14px rgba(0,0,0,.18);text-shadow:0 0 3px #7a2a00,0 0 3px #7a2a00,0 0 3px #7a2a00}
.cover .cs1{top:56px !important}
/* ===== Grade-4 theme: striped background, white paper panel, side ribbon, polaroid pictures ===== */
.bub{display:none}
.page:not(.cover):not(.cert){background:repeating-linear-gradient(135deg,hsl(var(--h),75%,90%) 0 26px,hsl(var(--h),70%,84%) 26px 52px) !important}
.page:not(.cover):not(.cert)::before{content:'';position:absolute;inset:22px 22px 22px 22px;border-radius:38px;background:#fffdf8;
  box-shadow:0 10px 0 hsl(var(--h),45%,70%),0 18px 30px rgba(20,30,60,.18)}
.page:not(.cover):not(.cert)::after{content:'';position:absolute;top:22px;bottom:22px;right:22px;width:30px;border-radius:0 38px 38px 0;
  background:repeating-linear-gradient(180deg,hsl(var(--h),70%,55%) 0 40px,hsl(calc(var(--h) + 40),70%,60%) 40px 80px)}
.ttl{display:table;margin:34px auto 0 !important;font-size:46px !important;padding:2px 46px 8px;border-radius:0 0 30px 30px;background:hsl(var(--h),70%,55%);box-shadow:0 6px 0 hsl(var(--h),60%,38%)}
.hint{margin-top:14px !important;color:hsl(var(--h),55%,28%) !important}
.iname{margin-top:34px}.iname .big{display:inline-block;font-size:70px !important;padding:0 40px 6px;border-radius:30px;background:hsl(var(--h),70%,55%);box-shadow:0 7px 0 hsl(var(--h),60%,38%)}
.iname .big.long{font-size:52px !important}
.iname .en{color:hsl(var(--h),55%,30%) !important;margin-top:12px !important}
.item .water{position:relative;background:#fff;border-radius:10px;padding:14px 14px 40px;margin:8px 60px 0;height:500px !important;transform:rotate(-1.6deg);
  box-shadow:0 0 0 2px #eee,0 14px 26px rgba(20,30,60,.25)}
.item .water::before{content:'';position:absolute;top:-16px;left:50%;width:150px;height:38px;transform:translateX(-50%) rotate(3deg);background:hsla(48,100%,70%,.85);border-radius:4px;z-index:2}
.item .ill{width:440px !important;height:440px !important}
.sent{border-radius:26px;border:4px solid hsl(var(--h),70%,60%);box-shadow:0 6px 0 hsl(var(--h),55%,75%)}
.chip{border-radius:22px;border-top:8px solid hsl(var(--h),70%,58%)}
.trace{border:4px solid hsl(var(--h),60%,80%)}
.unit .unum{margin-top:90px}.unit .utitle{margin-top:20px}
.unit .uart svg{width:200px;height:200px}
.note{padding-top:30px}.owner{padding-top:60px}
.toc{margin-top:20px}.tocr{border-right:12px solid hsl(var(--h),65%,55%)}
.pno{bottom:34px}
.vgrid{position:relative;display:grid;grid-template-columns:repeat(2,1fr);gap:22px;margin-top:20px}
.vs{background:#fff;border-radius:28px;padding:14px 30px;box-shadow:0 6px 0 hsl(var(--h),50%,74%);direction:ltr;text-align:right;font-family:Baloo}
.vs span{display:block;font-size:54px;font-weight:800;line-height:1.35;color:hsl(var(--h),60%,28%);letter-spacing:6px}.vs span em{font-style:normal;float:left;color:hsl(var(--h),70%,45%)}
.vs i{display:block;height:6px;border-radius:3px;background:hsl(var(--h),40%,40%);margin:6px 0 10px}
.vs b{display:flex;justify-content:flex-end;gap:6px}.vs u{display:inline-block;width:40px;height:52px;border:3px dashed hsl(var(--h),50%,60%);border-radius:10px}
.wps{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:22px}.wp{display:flex;align-items:center;gap:18px;background:#fff;border-radius:30px;padding:14px 22px;box-shadow:0 7px 0 hsl(var(--h),50%,74%);flex-wrap:wrap}
.wp svg{width:120px;height:120px;flex:none}.wp p{flex:1;font-size:30px;font-weight:800;line-height:1.9;color:#2b2340}.wp b{width:100%;text-align:left;font-size:28px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.6}
.pvt{position:relative;margin-top:24px;background:#fff;border-radius:30px;padding:16px 24px;box-shadow:0 7px 0 #c9b2ff}.pvh,.pvr{display:flex;align-items:center;gap:14px;margin-top:10px}
.pvh b,.pvr span{flex:1;text-align:center;font-size:32px;font-weight:800;line-height:1.6;border-radius:18px;color:#fff;text-shadow:0 0 3px rgba(0,0,0,.6),0 0 3px rgba(0,0,0,.6)}.pvr span{font-size:50px}
.c{background:#ff6b6b}.t{background:#4fa8ff}.o{background:#36c45d}.pvr em{width:150px;font-style:normal;font-size:42px;font-weight:800;color:#6a3fd0}.pvh:after{content:'';width:150px}
.ttab{position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}.ttab div{background:#fff;border-radius:26px;padding:10px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}
.ttab h4{font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:16px;line-height:1.6;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.ttab p{font-size:29px;font-weight:800;line-height:1.75;color:#2b2340}
.picto{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:16px}.picto>div{display:flex;align-items:center;gap:12px;background:#fff;border-radius:26px;padding:8px 18px;box-shadow:0 6px 0 #ffc98a}
.picto>div>svg{width:80px;height:80px}.picto b{width:150px;font-size:30px;font-weight:800;line-height:1.6}.pbar{flex:1;display:flex;gap:4px}.pbar svg{width:62px;height:62px}.pvh b.th,.pvr span.th{background:#b05cff}.pvh:after,.pvr em{width:120px}.pvr em{width:170px !important;white-space:nowrap;font-size:36px}.pvh:after{width:170px !important}.perg{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:18px}.perg>div{display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:10px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}.perg svg{width:220px;height:220px;flex:none}.perg b{display:block;font-size:32px;font-weight:800;line-height:1.8}.perg p{font-size:30px;font-weight:800;color:hsl(var(--h),60%,35%);line-height:1.8}.pv6 .pvh b,.pv6 .pvr span{font-size:22px}.pv6 .pvr span{font-size:44px}.pv6 .pvh b{line-height:1.4;padding:6px 2px}.pvh b.h6,.pvr span.h6{background:#e8508f}.pvh b.h5,.pvr span.h5{background:#ff8a1f}
.dvs{position:relative;margin-top:20px;display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.dvs div{background:#fff;border-radius:26px;padding:16px;text-align:center;box-shadow:0 6px 0 hsl(var(--h),50%,74%)}.dvs b{display:block;font-size:48px;font-weight:800;line-height:1.5;color:hsl(var(--h),60%,30%)}.dvs span{display:block;font-size:28px;font-weight:800;line-height:1.8;color:#2b2340}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>رياضياتي الجميلة ٤</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
