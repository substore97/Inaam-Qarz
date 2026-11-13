// Builds "لغتي الجميلة ٩" – Arabic language, ninth-grade syllabus – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./lughati9-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, sentence, chip1, chip2, traceword?]
const ITEMS = [["الوَاحِدُ وَالاثْنَانِ", "Numbers 1 and 2", "students", "جَاءَ طَالِبٌ وَاحِدٌ، وَطَالِبَتَانِ اثْنَتَانِ", "يُوَافِقَانِ المَعْدُودَ", "يَأْتِيَانِ بَعْدَ المَعْدُودِ صِفَةً"], ["الأَعْدَادُ مِنْ ٣ إِلَى ١٠", "Numbers 3 to 10", "books3", "قَرَأْتُ ثَلَاثَةَ كُتُبٍ وَخَمْسَ قِصَصٍ", "تُخَالِفُ المَعْدُودَ فِي التَّذْكِيرِ وَالتَّأْنِيثِ", "المَعْدُودُ جَمْعٌ مَجْرُورٌ"], ["الأَعْدَادُ مِنْ ١١ إِلَى ١٩", "Numbers 11 to 19", "students", "فِي الفَصْلِ ثَلَاثَةَ عَشَرَ طَالِبًا، وَخَمْسَ عَشْرَةَ طَالِبَةً", "مِنْ ١٣ إِلَى ١٩: الجُزْءُ الأَوَّلُ يُخَالِفُ، وَالثَّانِي يُوَافِقُ", "المَعْدُودُ مُفْرَدٌ مَنْصُوبٌ"], ["أَلْفَاظُ العُقُودِ", "Tens (20, 30 …)", "teacher", "فِي المَدْرَسَةِ عِشْرُونَ مُعَلِّمًا وَثَلَاثُونَ مُعَلِّمَةً", "لَا تَتَغَيَّرُ مَعَ المُذَكَّرِ وَالمُؤَنَّثِ", "المَعْدُودُ مُفْرَدٌ مَنْصُوبٌ"], ["صِيغَةُ «مَا أَفْعَلَ»", "The form mā af'ala", "stars", "مَا أَجْمَلَ السَّمَاءَ!", "مَا أَجْمَلَ", "مَنْصُوبٌ بَعْدَ الفِعْلِ"], ["صِيغَةُ «أَفْعِلْ بِـ»", "The form af'il bi", "sky", "أَجْمِلْ بِالسَّمَاءِ!", "أَجْمِلْ بِـ", "مَجْرُورٌ بِالبَاءِ"], ["التَّعَجُّبُ السَّمَاعِيُّ", "Heard exclamations", "f_surprised", "سُبْحَانَ اللّٰهِ! لِلّٰهِ دَرُّكَ!", "سُبْحَانَ اللّٰهِ! لِلّٰهِ دَرُّهُ!", "لَيْسَ لَهُ صِيغَةٌ قِيَاسِيَّةٌ"], ["نِعْمَ", "Ni'ma (how good)", "m_honest", "نِعْمَ الخُلُقُ الصِّدْقُ", "المَخْصُوصُ بِالمَدْحِ: الصِّدْقُ", "فِعْلٌ جَامِدٌ لِلْمَدْحِ"], ["بِئْسَ", "Bi'sa (how bad)", "f_angry", "بِئْسَ الخُلُقُ الكَذِبُ", "المَخْصُوصُ بِالذَّمِّ: الكَذِبُ", "فِعْلٌ جَامِدٌ لِلذَّمِّ"], ["حَبَّذَا وَلَا حَبَّذَا", "Habbadha & la habbadha", "medal", "حَبَّذَا العَمَلُ، وَلَا حَبَّذَا الكَسَلُ", "حَبَّذَا ← مَدْحٌ", "لَا حَبَّذَا ← ذَمٌّ"], ["أَفْعَالُ المُقَارَبَةِ", "Verbs of nearness", "train", "كَادَ القِطَارُ يَصِلُ", "كَادَ، أَوْشَكَ، كَرَبَ", "تَدُلُّ عَلَى قُرْبِ وُقُوعِ الخَبَرِ"], ["أَفْعَالُ الرَّجَاءِ", "Verbs of hope", "raincloud", "عَسَى الخَيْرُ أَنْ يَعُمَّ", "عَسَى، حَرَى، اخْلَوْلَقَ", "تَدُلُّ عَلَى رَجَاءِ وُقُوعِ الخَبَرِ"], ["أَفْعَالُ الشُّرُوعِ", "Verbs of beginning", "v_write", "بَدَأَ الطَّالِبُ يَكْتُبُ", "بَدَأَ، شَرَعَ، أَخَذَ", "تَدُلُّ عَلَى البَدْءِ فِي الخَبَرِ"], ["تُحْذَفُ بَيْنَ عَلَمَيْنِ", "Dropped between two names", "bigbook", "عُمَرُ بنُ الخَطَّابِ خَلِيفَةٌ عَادِلٌ", "عَلِيُّ بنُ أَبِي طَالِبٍ", "الثَّانِي أَبٌ لِلْأَوَّلِ"], ["تَثْبُتُ فِي أَوَّلِ الكَلَامِ", "Kept at the start", "book", "ابْنُ سِينَا طَبِيبٌ مَشْهُورٌ", "ابْنُ بَطُّوطَةَ رَحَّالَةٌ", "إِذَا جَاءَتْ فِي أَوَّلِ الكَلَامِ"], ["تَثْبُتُ إِذَا لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ", "Kept when not between names", "family", "هٰذَا ابْنُ عَمِّي", "خَالِدٌ ابْنُ أَخِي", "لِأَنَّ مَا بَعْدَهَا لَيْسَ عَلَمًا"], ["المُقَدِّمَةُ وَالتَّحِيَّةُ", "Opening & greeting", "envelope", "أَبْدَأُ بِالبَسْمَلَةِ، ثُمَّ أَكْتُبُ اسْمَ المُرْسَلِ إِلَيْهِ وَالتَّحِيَّةَ", "سَعَادَةُ مُدِيرِ المَدْرَسَةِ المُحْتَرَمُ", "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ"], ["المَوْضُوعُ", "The subject", "v_write", "أَكْتُبُ المَوْضُوعَ بِعِبَارَاتٍ وَاضِحَةٍ مُخْتَصَرَةٍ مُهَذَّبَةٍ", "المَوْضُوعُ: طَلَبُ إِقَامَةِ مُسَابَقَةٍ ثَقَافِيَّةٍ", "نَرْجُو التَّكَرُّمَ بِالمُوَافَقَةِ"], ["الخَاتِمَةُ وَالتَّوْقِيعُ", "Closing & signature", "school", "أَخْتِمُ بِالشُّكْرِ، ثُمَّ أَكْتُبُ اسْمِي وَالتَّارِيخَ", "وَتَقَبَّلُوا خَالِصَ التَّحِيَّةِ", "مُقَدِّمُهُ: الطَّالِبُ ..."]];
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

const C = {"dir": "lughati9-book", "prefix": "Lughati-9", "title": "لغتي الجميلة ٩", "artmod": "lughati9-art", "header": "Builds \"لغتي الجميلة ٩\" – Arabic language, ninth-grade syllabus – A4 portrait.", "grade": "Grade 9", "theme": "9", "layout": "g9", "cover": "--h:200;background:#ffffff", "h": 200, "t1": "لُغَتِي الجَمِيلَةُ", "t2": "الجُزْءُ التَّاسِعُ", "s1": "#0b2a50", "s2": "#7a3a00", "csub": "أَقْرَأُ وَأُعْرِبُ وَأَكْتُبُ", "cen": "My Beautiful Arabic 9", "coverTop": ["bigbook", "v_write", "books3"], "coverBot": ["students", "envelope", "pencil", "notebook"], "ownerArt": "bigbook", "ownerMini": ["pencil", "notebook", "envelope"], "noteP": "هٰذَا الكِتَابُ يُعَلِّمُ طِفْلَكُمْ قَوَاعِدَ جَدِيدَةً: العَدَدُ وَالمَعْدُودُ، وَأُسْلُوبُ التَّعَجُّبِ، وَأُسْلُوبُ المَدْحِ وَالذَّمِّ، وَكَادَ وَأَخَوَاتُهَا، وَكِتَابَةُ «ابْن»، وَكِتَابَةُ الخِطَابِ الرَّسْمِيِّ، وَالقِرَاءَةُ وَالفَهْمُ 📚", "noteLi": ["فِي كُلِّ دَرْسٍ مَسَاحَةٌ لِيَكْتُبَ طِفْلُكُمْ جُمْلَةً مِنْ عِنْدِهِ؛ شَجِّعُوهُ عَلَيْهَا.", "اطْلُبُوا مِنْهُ قِرَاءَةَ الأَعْدَادِ مَعَ المَعْدُودِ قِرَاءَةً صَحِيحَةً.", "سَاعِدُوهُ فِي كِتَابَةِ خِطَابٍ حَقِيقِيٍّ إِلَى مَدْرَسَتِهِ.", "فِي التَّمَارِينِ يَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ."], "noteMini": ["v_read", "pencil", "v_write"], "certP": "لِأَنَّهُ أَتَمَّ كِتَابَ «لُغَتِي الجَمِيلَةُ ٩» بِنَجَاحٍ", "certArts": ["book", "medal", "pencil"], "blurb": "كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ وَرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَادِ لِتَعْلِيمِ اللُّغَةِ العَرَبِيَّةِ لِلْأَطْفَالِ فِي سَنَتِهِمُ الدِّرَاسِيَّةِ التَّاسِعَةِ.", "blurbLi": ["العَدَدُ وَالمَعْدُودُ، وَأُسْلُوبُ التَّعَجُّبِ", "أُسْلُوبُ المَدْحِ وَالذَّمِّ، وَكَادَ وَأَخَوَاتُهَا", "كِتَابَةُ «ابْن»، وَالخِطَابُ الرَّسْمِيُّ", "نُصُوصٌ لِلْقِرَاءَةِ وَالفَهْمِ، وَشَهَادَةٌ"], "en2": "A complete Arabic language book with a brand-new design – part 9", "backArts": ["students", "bigbook", "envelope", "medal"], "extraCss": ".wpair{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px 24px;box-shadow:0 8px 0 hsl(var(--h),50%,74%)}.wph{display:flex;justify-content:space-around;margin-bottom:8px}.wph b{font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:18px;padding:2px 26px;line-height:1.6;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.wpr{display:flex;align-items:center;justify-content:space-around;margin-top:12px}.wpr span{min-width:220px;text-align:center;font-size:42px;font-weight:800;line-height:1.6;border-radius:22px;padding:2px 14px;background:hsl(var(--h),80%,94%);color:hsl(var(--h),60%,28%)}.wpr i{font-style:normal;font-size:42px;font-weight:800;color:hsl(var(--h),60%,45%)}.ptab{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}.ptab>div{display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:12px 22px;box-shadow:0 7px 0 hsl(var(--h),50%,72%)}\n.ptab i{font-style:normal;flex:none;width:110px;height:110px;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:80px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);text-shadow:0 0 4px hsl(var(--h),60%,20%),0 0 4px hsl(var(--h),60%,20%)}\n.ptab b{display:block;font-size:34px;font-weight:800;line-height:1.6;color:hsl(var(--h),60%,30%)}.ptab small{display:block;font-size:24px;font-weight:700;color:#6f6a8a;line-height:1.6}.ptab p{font-size:30px;font-weight:800;line-height:1.7;color:#2b2340}\n.story p{font-size:33px !important;line-height:2.2 !important}.steps{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:16px}.steps div{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:12px 20px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}\n.steps i{font-style:normal;flex:none;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.steps b{font-size:31px;font-weight:800;line-height:1.7;color:#2b2340}\n.tips{margin-top:26px}.tips p{font-size:30px;font-weight:700;line-height:2}\n.wtopic{position:relative;margin-top:20px;background:#fff;border-radius:28px;padding:14px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.wtopic b{display:block;text-align:center;font-size:34px;font-weight:800;line-height:1.7;color:hsl(var(--h),60%,30%)}\n.wbank{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:8px}.wbank span{font-size:27px;font-weight:800;line-height:1.6;background:hsl(var(--h),80%,93%);border-radius:16px;padding:2px 16px}\n.wlines{position:relative;margin:20px 40px 0;display:flex;flex-direction:column;gap:0}.wlines i{display:block;height:74px;border-bottom:3px solid hsl(var(--h),40%,72%)}\n.story p{font-size:32px !important;line-height:2.15 !important}.letter{margin-top:22px}.letter p{font-size:28px;font-weight:700;line-height:2}.letter .ld{text-align:left;color:#6f6a8a}.letter .ls{text-align:left;color:hsl(var(--h),60%,30%);font-weight:800}.qrow{margin-top:20px !important;padding:12px 16px !important}.qw{min-width:300px !important;max-width:360px;font-size:28px !important}.qo{font-size:30px !important}", "units": [{"title": "العَدَدُ وَالمَعْدُودُ", "en": "Numbers & Counted Nouns", "icon": "books3", "arts": ["books3", "students", "dates"], "intro": "لِلْعَدَدِ مَعَ المَعْدُودِ أَحْكَامٌ فِي التَّذْكِيرِ وَالتَّأْنِيثِ وَالإِعْرَابِ.", "chip1": ["📌", "القَاعِدَةُ"], "chip2": ["💡", "المَعْدُودُ"], "items": [["الوَاحِدُ وَالاثْنَانِ", "Numbers 1 and 2", "students", "جَاءَ طَالِبٌ وَاحِدٌ، وَطَالِبَتَانِ اثْنَتَانِ", "يُوَافِقَانِ المَعْدُودَ", "يَأْتِيَانِ بَعْدَ المَعْدُودِ صِفَةً"], ["الأَعْدَادُ مِنْ ٣ إِلَى ١٠", "Numbers 3 to 10", "books3", "قَرَأْتُ ثَلَاثَةَ كُتُبٍ وَخَمْسَ قِصَصٍ", "تُخَالِفُ المَعْدُودَ فِي التَّذْكِيرِ وَالتَّأْنِيثِ", "المَعْدُودُ جَمْعٌ مَجْرُورٌ"], ["الأَعْدَادُ مِنْ ١١ إِلَى ١٩", "Numbers 11 to 19", "students", "فِي الفَصْلِ ثَلَاثَةَ عَشَرَ طَالِبًا، وَخَمْسَ عَشْرَةَ طَالِبَةً", "مِنْ ١٣ إِلَى ١٩: الجُزْءُ الأَوَّلُ يُخَالِفُ، وَالثَّانِي يُوَافِقُ", "المَعْدُودُ مُفْرَدٌ مَنْصُوبٌ"], ["أَلْفَاظُ العُقُودِ", "Tens (20, 30 …)", "teacher", "فِي المَدْرَسَةِ عِشْرُونَ مُعَلِّمًا وَثَلَاثُونَ مُعَلِّمَةً", "لَا تَتَغَيَّرُ مَعَ المُذَكَّرِ وَالمُؤَنَّثِ", "المَعْدُودُ مُفْرَدٌ مَنْصُوبٌ"]], "acts": [{"type": "words", "title": "أَخْتَارُ العَدَدَ أَوِ المَعْدُودَ الصَّحِيحَ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["اشْتَرَيْتُ (٣) ... أَقْلَامٍ", ["ثَلَاثَ", "ثَلَاثَةَ"]], ["قَرَأْتُ (٥) ... صَفَحَاتٍ", ["خَمْسَ", "خَمْسَةَ"]], ["حَفِظْتُ (١٢) ... سُورَةً", ["اثْنَيْ عَشَرَ", "اثْنَتَيْ عَشْرَةَ"]], ["فِي البُسْتَانِ عِشْرُونَ ...", ["شَجَرَةً", "شَجَرَاتٍ"]]], "top": ["pencil", "tree"]}, {"type": "words", "title": "أَخْتَارُ المَعْدُودَ الصَّحِيحَ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["زَارَنَا سَبْعَةُ ...", ["رَجُلًا", "رِجَالٍ"]], ["مَضَى خَمْسَةَ عَشَرَ ...", ["يَوْمًا", "أَيَّامٍ"]], ["فِي الأُسْبُوعِ سَبْعَةُ ...", ["أَيَّامٍ", "يَوْمًا"]], ["عِنْدِي ... أَخَوَاتٍ", ["ثَلَاثَةُ", "ثَلَاثُ"]]], "top": ["family", "clock"]}]}, {"title": "أُسْلُوبُ التَّعَجُّبِ", "en": "Exclamation", "icon": "stars", "arts": ["stars", "sky", "f_surprised"], "intro": "التَّعَجُّبُ أُسْلُوبٌ نُعَبِّرُ بِهِ عَنِ الدَّهْشَةِ وَالإِعْجَابِ، وَلَهُ صِيغَتَانِ: (مَا أَفْعَلَهُ!) وَ(أَفْعِلْ بِهِ!).", "chip1": ["📌", "الصِّيغَةُ"], "chip2": ["💡", "المُتَعَجَّبُ مِنْهُ"], "items": [["صِيغَةُ «مَا أَفْعَلَ»", "The form mā af'ala", "stars", "مَا أَجْمَلَ السَّمَاءَ!", "مَا أَجْمَلَ", "مَنْصُوبٌ بَعْدَ الفِعْلِ"], ["صِيغَةُ «أَفْعِلْ بِـ»", "The form af'il bi", "sky", "أَجْمِلْ بِالسَّمَاءِ!", "أَجْمِلْ بِـ", "مَجْرُورٌ بِالبَاءِ"], ["التَّعَجُّبُ السَّمَاعِيُّ", "Heard exclamations", "f_surprised", "سُبْحَانَ اللّٰهِ! لِلّٰهِ دَرُّكَ!", "سُبْحَانَ اللّٰهِ! لِلّٰهِ دَرُّهُ!", "لَيْسَ لَهُ صِيغَةٌ قِيَاسِيَّةٌ"]], "acts": [{"type": "words", "title": "أَخْتَارُ الحَرَكَةَ الصَّحِيحَةَ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["مَا أَجْمَلَ ...!", ["الحَدِيقَةُ", "الحَدِيقَةَ"]], ["أَكْرِمْ بِـ ...!", ["المُعَلِّمِ", "المُعَلِّمَ"]], ["مَا أَصْدَقَ ...!", ["المُؤْمِنَ", "المُؤْمِنُ"]], ["أَعْظِمْ بِـ ...!", ["الأُمَّ", "الأُمِّ"]]], "top": ["sunflower", "teacher"]}, {"type": "words", "title": "أُحَوِّلُ إِلَى أُسْلُوبِ تَعَجُّبٍ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["الجَوُّ جَمِيلٌ", ["مَا أَجْمَلَ الجَوَّ!", "مَا أَجْمَلُ الجَوِّ!"]], ["البَحْرُ وَاسِعٌ", ["أَوْسِعِ البَحْرَ!", "أَوْسِعْ بِالبَحْرِ!"]], ["العِلْمُ نَافِعٌ", ["مَا أَنْفَعَ العِلْمَ!", "مَا أَنْفَعُ العِلْمُ!"]], ["الصِّدْقُ جَمِيلٌ", ["أَجْمَلُ الصِّدْقُ!", "أَجْمِلْ بِالصِّدْقِ!"]]], "top": ["sun", "bigbook"]}]}, {"title": "أُسْلُوبُ المَدْحِ وَالذَّمِّ", "en": "Praise & Blame", "icon": "medal", "arts": ["medal", "m_honest", "f_angry"], "intro": "نَمْدَحُ بِـ (نِعْمَ) وَ(حَبَّذَا)، وَنَذُمُّ بِـ (بِئْسَ) وَ(لَا حَبَّذَا).", "chip1": ["🎯", "المَخْصُوصُ"], "chip2": ["💡", "مَعْلُومَةٌ"], "items": [["نِعْمَ", "Ni'ma (how good)", "m_honest", "نِعْمَ الخُلُقُ الصِّدْقُ", "المَخْصُوصُ بِالمَدْحِ: الصِّدْقُ", "فِعْلٌ جَامِدٌ لِلْمَدْحِ"], ["بِئْسَ", "Bi'sa (how bad)", "f_angry", "بِئْسَ الخُلُقُ الكَذِبُ", "المَخْصُوصُ بِالذَّمِّ: الكَذِبُ", "فِعْلٌ جَامِدٌ لِلذَّمِّ"], ["حَبَّذَا وَلَا حَبَّذَا", "Habbadha & la habbadha", "medal", "حَبَّذَا العَمَلُ، وَلَا حَبَّذَا الكَسَلُ", "حَبَّذَا ← مَدْحٌ", "لَا حَبَّذَا ← ذَمٌّ"]], "acts": [{"type": "words", "title": "مَدْحٌ أَمْ ذَمٌّ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["نِعْمَ الصَّدِيقُ الكِتَابُ", ["مَدْحٌ", "ذَمٌّ"]], ["بِئْسَ العَادَةُ الكَسَلُ", ["مَدْحٌ", "ذَمٌّ"]], ["حَبَّذَا الأَمَانَةُ", ["مَدْحٌ", "ذَمٌّ"]], ["لَا حَبَّذَا الغِشُّ", ["مَدْحٌ", "ذَمٌّ"]]], "top": ["book", "medal"]}, {"type": "words", "title": "أَيْنَ المَخْصُوصُ بِالمَدْحِ أَوِ الذَّمِّ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["نِعْمَ الرَّجُلُ خَالِدٌ", ["الرَّجُلُ", "خَالِدٌ"]], ["بِئْسَ الخُلُقُ الغِيبَةُ", ["الغِيبَةُ", "الخُلُقُ"]], ["نِعْمَتِ الصِّفَةُ الحِلْمُ", ["الصِّفَةُ", "الحِلْمُ"]], ["حَبَّذَا الصَّبْرُ", ["الصَّبْرُ", "حَبَّذَا"]]], "top": ["m_patience", "f_calm"]}]}, {"title": "كَادَ وَأَخَوَاتُهَا", "en": "Kāda and its sisters", "icon": "train", "arts": ["train", "raincloud", "v_write"], "intro": "كَادَ وَأَخَوَاتُهَا أَفْعَالٌ نَاسِخَةٌ تَرْفَعُ الاسْمَ، وَخَبَرُهَا جُمْلَةٌ فِعْلِيَّةٌ فِعْلُهَا مُضَارِعٌ.", "chip1": ["📌", "أَفْعَالُهَا"], "chip2": ["💡", "مَعْنَاهَا"], "items": [["أَفْعَالُ المُقَارَبَةِ", "Verbs of nearness", "train", "كَادَ القِطَارُ يَصِلُ", "كَادَ، أَوْشَكَ، كَرَبَ", "تَدُلُّ عَلَى قُرْبِ وُقُوعِ الخَبَرِ"], ["أَفْعَالُ الرَّجَاءِ", "Verbs of hope", "raincloud", "عَسَى الخَيْرُ أَنْ يَعُمَّ", "عَسَى، حَرَى، اخْلَوْلَقَ", "تَدُلُّ عَلَى رَجَاءِ وُقُوعِ الخَبَرِ"], ["أَفْعَالُ الشُّرُوعِ", "Verbs of beginning", "v_write", "بَدَأَ الطَّالِبُ يَكْتُبُ", "بَدَأَ، شَرَعَ، أَخَذَ", "تَدُلُّ عَلَى البَدْءِ فِي الخَبَرِ"]], "acts": [{"type": "words", "title": "مَا نَوْعُ الفِعْلِ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["أَوْشَكَ المَطَرُ أَنْ يَنْزِلَ", ["مُقَارَبَةٌ", "رَجَاءٌ", "شُرُوعٌ"]], ["عَسَى اللّٰهُ أَنْ يَرْحَمَنَا", ["مُقَارَبَةٌ", "رَجَاءٌ", "شُرُوعٌ"]], ["شَرَعَ العُمَّالُ يَبْنُونَ", ["مُقَارَبَةٌ", "رَجَاءٌ", "شُرُوعٌ"]], ["كَادَ الطِّفْلُ يَسْقُطُ", ["مُقَارَبَةٌ", "رَجَاءٌ", "شُرُوعٌ"]]], "top": ["raincloud", "builder"]}, {"type": "words", "title": "أَيْنَ اسْمُ الفِعْلِ النَّاسِخِ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["كَادَ الوَقْتُ يَنْتَهِي", ["الوَقْتُ", "يَنْتَهِي"]], ["بَدَأَ المُعَلِّمُ يَشْرَحُ", ["يَشْرَحُ", "المُعَلِّمُ"]], ["عَسَى المَرِيضُ أَنْ يُشْفَى", ["المَرِيضُ", "يُشْفَى"]], ["أَخَذَ الطُّلَّابُ يَقْرَؤُونَ", ["يَقْرَؤُونَ", "الطُّلَّابُ"]]], "top": ["clock", "teacher"]}]}, {"title": "كِتَابَةُ «ابْن»", "en": "Writing ibn", "icon": "v_write", "arts": ["v_write", "bigbook", "family"], "intro": "تُحْذَفُ أَلِفُ «ابْن» إِذَا وَقَعَتْ بَيْنَ اسْمَيْنِ عَلَمَيْنِ، الثَّانِي أَبٌ لِلْأَوَّلِ، وَتَثْبُتُ فِي غَيْرِ ذٰلِكَ.", "chip1": ["✍️", "مِثَالٌ"], "chip2": ["💡", "القَاعِدَةُ"], "items": [["تُحْذَفُ بَيْنَ عَلَمَيْنِ", "Dropped between two names", "bigbook", "عُمَرُ بنُ الخَطَّابِ خَلِيفَةٌ عَادِلٌ", "عَلِيُّ بنُ أَبِي طَالِبٍ", "الثَّانِي أَبٌ لِلْأَوَّلِ"], ["تَثْبُتُ فِي أَوَّلِ الكَلَامِ", "Kept at the start", "book", "ابْنُ سِينَا طَبِيبٌ مَشْهُورٌ", "ابْنُ بَطُّوطَةَ رَحَّالَةٌ", "إِذَا جَاءَتْ فِي أَوَّلِ الكَلَامِ"], ["تَثْبُتُ إِذَا لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ", "Kept when not between names", "family", "هٰذَا ابْنُ عَمِّي", "خَالِدٌ ابْنُ أَخِي", "لِأَنَّ مَا بَعْدَهَا لَيْسَ عَلَمًا"]], "acts": [{"type": "words", "title": "أَيُّهُمَا مَكْتُوبٌ صَحِيحًا؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["", ["عُثْمَانُ بنُ عَفَّانَ", "عُثْمَانُ ابْنُ عَفَّانَ"]], ["", ["هٰذَا بنُ جَارِنَا", "هٰذَا ابْنُ جَارِنَا"]], ["", ["ابْنُ خَلْدُونَ عَالِمٌ", "بنُ خَلْدُونَ عَالِمٌ"]], ["", ["خَالِدُ ابْنُ الوَلِيدِ", "خَالِدُ بنُ الوَلِيدِ"]]], "top": ["v_write", "pencil"]}, {"type": "words", "title": "لِمَاذَا حُذِفَتِ الأَلِفُ أَوْ ثَبَتَتْ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["سَعْدُ بنُ أَبِي وَقَّاصٍ", ["وَقَعَتْ بَيْنَ عَلَمَيْنِ", "جَاءَتْ فِي أَوَّلِ الكَلَامِ", "لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ"]], ["ابْنُ كَثِيرٍ مُفَسِّرٌ", ["وَقَعَتْ بَيْنَ عَلَمَيْنِ", "جَاءَتْ فِي أَوَّلِ الكَلَامِ", "لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ"]], ["هُوَ ابْنُ صَدِيقِي", ["وَقَعَتْ بَيْنَ عَلَمَيْنِ", "جَاءَتْ فِي أَوَّلِ الكَلَامِ", "لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ"]], ["أَحْمَدُ بنُ حَنْبَلٍ", ["وَقَعَتْ بَيْنَ عَلَمَيْنِ", "جَاءَتْ فِي أَوَّلِ الكَلَامِ", "لَمْ تَقَعْ بَيْنَ عَلَمَيْنِ"]]], "top": ["bigbook", "rehal"]}]}, {"title": "كِتَابَةُ الخِطَابِ الرَّسْمِيِّ", "en": "Writing a Formal Letter", "icon": "envelope", "arts": ["envelope", "v_write", "school"], "intro": "الخِطَابُ الرَّسْمِيُّ نُرْسِلُهُ إِلَى جِهَةٍ أَوْ مَسْؤُولٍ، وَلَهُ أَجْزَاءٌ مُرَتَّبَةٌ.", "chip1": ["📝", "مِثَالٌ"], "chip2": ["💡", "مِثَالٌ آخَرُ"], "items": [["المُقَدِّمَةُ وَالتَّحِيَّةُ", "Opening & greeting", "envelope", "أَبْدَأُ بِالبَسْمَلَةِ، ثُمَّ أَكْتُبُ اسْمَ المُرْسَلِ إِلَيْهِ وَالتَّحِيَّةَ", "سَعَادَةُ مُدِيرِ المَدْرَسَةِ المُحْتَرَمُ", "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ"], ["المَوْضُوعُ", "The subject", "v_write", "أَكْتُبُ المَوْضُوعَ بِعِبَارَاتٍ وَاضِحَةٍ مُخْتَصَرَةٍ مُهَذَّبَةٍ", "المَوْضُوعُ: طَلَبُ إِقَامَةِ مُسَابَقَةٍ ثَقَافِيَّةٍ", "نَرْجُو التَّكَرُّمَ بِالمُوَافَقَةِ"], ["الخَاتِمَةُ وَالتَّوْقِيعُ", "Closing & signature", "school", "أَخْتِمُ بِالشُّكْرِ، ثُمَّ أَكْتُبُ اسْمِي وَالتَّارِيخَ", "وَتَقَبَّلُوا خَالِصَ التَّحِيَّةِ", "مُقَدِّمُهُ: الطَّالِبُ ..."]], "acts": [{"type": "words", "title": "أَيْنَ تُكْتَبُ هٰذِهِ العِبَارَةُ؟", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ", ["المُقَدِّمَةُ", "المَوْضُوعُ", "الخَاتِمَةُ"]], ["نَرْجُو السَّمَاحَ لَنَا بِزِيَارَةِ المَكْتَبَةِ العَامَّةِ", ["المُقَدِّمَةُ", "المَوْضُوعُ", "الخَاتِمَةُ"]], ["وَتَقَبَّلُوا خَالِصَ التَّحِيَّةِ وَالتَّقْدِيرِ", ["المُقَدِّمَةُ", "المَوْضُوعُ", "الخَاتِمَةُ"]], ["وَلَكُمْ مِنَّا جَزِيلُ الشُّكْرِ", ["المُقَدِّمَةُ", "المَوْضُوعُ", "الخَاتِمَةُ"]]], "top": ["envelope", "library"]}, {"type": "raw", "title": "أَكْتُبُ خِطَابًا", "html": "<div class=\"wtopic\"><b>أَكْتُبُ خِطَابًا إِلَى مُدِيرِ المَدْرَسَةِ أَطْلُبُ فِيهِ إِقَامَةَ رِحْلَةٍ عِلْمِيَّةٍ</b><div class=\"wbank\"><span>بِسْمِ اللّٰهِ</span><span>السَّلَامُ عَلَيْكُمْ</span><span>نَرْجُو</span><span>رِحْلَةٌ عِلْمِيَّةٌ</span><span>وَتَقَبَّلُوا</span><span>التَّوْقِيعُ</span></div></div><div class=\"wlines\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>"}]}, {"title": "أَقْرَأُ وَأَفْهَمُ", "en": "Reading & Understanding", "icon": "bigbook", "arts": ["bigbook", "students"], "intro": "أَقْرَأُ نَصَّيْنِ، ثُمَّ أُجِيبُ عَنْ أَسْئِلَةِ الفَهْمِ وَالقَوَاعِدِ.", "acts": [{"type": "raw", "title": "نَصٌّ لِلْقِرَاءَةِ", "html": "<div class=\"card story\"><h3>مِنْ عُلَمَاءِ المُسْلِمِينَ 📚</h3><p>مَا أَعْظَمَ عُلَمَاءَ المُسْلِمِينَ! فَقَدْ كَتَبَ ابْنُ سِينَا كِتَابَ «القَانُونِ» فِي الطِّبِّ، وَدَرَسَهُ الأَطِبَّاءُ مِئَاتِ السِّنِينَ.<br>وَأَلَّفَ الخَوَارِزْمِيُّ أَوَّلَ كِتَابٍ فِي عِلْمِ الجَبْرِ، وَنِعْمَ العِلْمُ الجَبْرُ.<br>وَزَارَ ابْنُ بَطُّوطَةَ أَكْثَرَ مِنْ أَرْبَعِينَ بَلَدًا، وَكَتَبَ عَنْ رِحْلَاتِهِ.</p></div>", "arts": ["bigbook", "medicine", "globe"]}, {"type": "words", "title": "أُجِيبُ عَنِ النَّصِّ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["مَنْ كَتَبَ كِتَابَ «القَانُونِ» فِي الطِّبِّ؟", ["ابْنُ بَطُّوطَةَ", "ابْنُ سِينَا"]], ["فِي أَيِّ عِلْمٍ أَلَّفَ الخَوَارِزْمِيُّ؟", ["الجَبْرِ", "الطِّبِّ"]], ["«مَا أَعْظَمَ عُلَمَاءَ المُسْلِمِينَ!» أُسْلُوبُ ...", ["مَدْحٍ", "تَعَجُّبٍ"]], ["«أَرْبَعِينَ بَلَدًا»: إِعْرَابُ «بَلَدًا» ...", ["تَمْيِيزٌ مَنْصُوبٌ", "حَالٌ مَنْصُوبَةٌ"]]], "top": ["bigbook", "globe"]}, {"type": "raw", "title": "نَصٌّ لِلْقِرَاءَةِ", "html": "<div class=\"card story\"><h3>يَوْمُ النَّظَافَةِ 🧹</h3><p>بَدَأَ الطُّلَّابُ يُنَظِّفُونَ سَاحَةَ المَدْرَسَةِ صَبَاحَ الخَمِيسِ، وَكَانُوا ثَلَاثِينَ طَالِبًا وَأَرْبَعَةَ مُعَلِّمِينَ.<br>وَمَا كَادَتِ الشَّمْسُ تَرْتَفِعُ حَتَّى صَارَتِ السَّاحَةُ نَظِيفَةً.<br>فَقَالَ المُدِيرُ: نِعْمَ العَمَلُ عَمَلُكُمْ، وَحَبَّذَا التَّعَاوُنُ!</p></div>", "arts": ["school", "students", "sun"]}, {"type": "words", "title": "أُجِيبُ عَنِ النَّصِّ", "hint": "أَكْتُبُ رَقْمَ الإِجَابَةِ الصَّحِيحَةِ فِي المُرَبَّعِ", "rows": [["مَتَى نَظَّفَ الطُّلَّابُ السَّاحَةَ؟", ["صَبَاحَ الخَمِيسِ", "مَسَاءَ الجُمُعَةِ"]], ["كَمْ كَانَ عَدَدُ الطُّلَّابِ؟", ["ثَلَاثَةَ عَشَرَ طَالِبًا", "ثَلَاثُونَ طَالِبًا"]], ["«بَدَأَ الطُّلَّابُ يُنَظِّفُونَ»: «بَدَأَ» فِعْلُ ...", ["شُرُوعٍ", "رَجَاءٍ"]], ["«نِعْمَ العَمَلُ عَمَلُكُمْ»: المَخْصُوصُ بِالمَدْحِ ...", ["العَمَلُ", "عَمَلُكُمْ"]]], "top": ["school", "medal"]}]}]};
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
const itemPages6 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item6" style="--h:${h}">
    <header class="l6h"><span class="l6tag">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</span><h2>${name}</h2><em>${en}</em></header>
    <div class="l6main">
      <figure class="l6pic">${G(ill)}</figure>
      <div class="l6side">
        <p class="l6sent">${sentence}</p>
        <div class="l6box"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="l6box alt"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="l6write"><b>${C.ltr ? "✍️ I write my own sentence:" : "✍️ أَكْتُبُ جُمْلَةً مِنْ عِنْدِي:"}</b><i></i><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPagesStd = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2, tw], i) => {
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
const itemPages7 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item7" style="--h:${h}">
    <div class="l7top"><span class="l7hex">${C.ltr ? li + 1 : AR(li + 1)}</span><small>${U.title}</small></div>
    <div class="l7hero"><figure>${G(ill)}</figure><div class="l7name"><h2>${name}</h2><em>${en}</em></div></div>
    <div class="l7steps">
      <div><i>📖</i><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><b>${sentence}</b></div></div>
      <div><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
    </div>
    <div class="l7note"><b>🧠 ${C.ltr ? 'My own example:' : 'أَكْتُبُ مِثَالًا مِنْ عِنْدِي:'}</b><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages8 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i);
  pages.push(`
  <section class="page item8" style="--h:${h}">
    <aside class="l8side"><b>${C.ltr ? li + 1 : AR(li + 1)}</b><span>${U.title}</span></aside>
    <div class="l8main">
      <h2 class="l8title">${name}</h2>
      <div class="l8row">
        <figure class="l8pol">${G(ill)}<figcaption>${en}</figcaption></figure>
        <blockquote class="l8quote${sentence.length > 95 ? ' long' : ''}">${sentence}</blockquote>
      </div>
      <div class="l8info">
        <div><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
      <div class="l8board"><b>${C.ltr ? '✏️ Your turn: write your own example' : '✏️ دَوْرُكَ: اكْتُبْ مِثَالًا مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages9 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item9" style="--h:${h}">
    <div class="l9hero">
      <span class="l9mark">${C.ltr ? 'Lesson' : 'دَرْسٌ'}<b>${N(li + 1)}</b></span>
      <div class="l9t"><h2>${name}</h2><em>${en}</em></div>
      <figure class="l9pic">${G(ill)}</figure>
    </div>
    <ol class="l9pts">
      <li><b>${N(1)}</b><div><small>${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div></li>
      <li><b>${N(2)}</b><div><small>${U.chip1[1]}</small><p>${c1}</p></div></li>
      <li><b>${N(3)}</b><div><small>${U.chip2[1]}</small><p>${c2}</p></div></li>
    </ol>
    <div class="l9bub"><b>${C.ltr ? '💬 Now you: write a sentence of your own' : '💬 الآنَ أَنْتَ: اكْتُبْ جُمْلَةً مِنْ عِنْدِكَ'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages = (...a) => (C.layout === 'g6' ? itemPages6 : C.layout === 'g7' ? itemPages7 : C.layout === 'g8' ? itemPages8 : C.layout === 'g9' ? itemPages9 : itemPagesStd)(...a);
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
if (C.layout === 'g6') {
  const LET = C.ltr ? ['a', 'b', 'c', 'd'] : ['أ', 'ب', 'ج', 'د'];
  ACT.words = (a) => `<div class="hint6">${a.hint}</div><div class="q6grid">${a.rows.map(([w, o], j) => `<div class="q6" style="--h:${(j * 70 + 200) % 360}"><span class="qn">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q6o">${o.map((x, k) => `<span><i>${LET[k]}</i>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint6">${a.hint || 'ضَعْ ✓ لِلصَّوَابِ وَ ✗ لِلْخَطَأِ'}</div><table class="tf6"><tr><th></th><th>${C.ltr ? 'Sentence' : 'العِبَارَةُ'}</th><th>✓</th><th>✗</th></tr>${a.rows.map((t, j) => `<tr><td class="n">${C.ltr ? j + 1 : AR(j + 1)}</td><td>${t}</td><td><i></i></td><td><i></i></td></tr>`).join('')}</table><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g7') {
  ACT.words = (a) => `<div class="hint7">${a.hint}</div><div class="q7list">${a.rows.map(([w, o], j) => `<div class="q7"><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${w}</p><div class="q7o">${o.map(x => `<span><u></u>${x}</span>`).join('')}</div></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint7">${a.hint || 'أَضَعُ دَائِرَةً حَوْلَ: ✓ صَوَابٌ، أَوْ ✗ خَطَأٌ'}</div><div class="tf7">${a.rows.map((t, j) => `<div><span class="q7n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><div class="tf7b"><span>✓ ${C.ltr ? 'True' : 'صَوَابٌ'}</span><span>✗ ${C.ltr ? 'False' : 'خَطَأٌ'}</span></div></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g8') {
  ACT.words = (a) => `<div class="f8"><div class="hint8">${a.hint}</div><ol class="q8">${a.rows.map(([w, o], j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><div><p>${w}</p><div class="q8o">( ${o.map(x => `<span>${x}</span>`).join('<em>|</em>')} )</div></div></li>`).join('')}</ol></div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="f8"><div class="hint8">${a.hint || 'أَضَعُ عَلَامَةَ ( ✓ ) أَمَامَ العِبَارَةِ الصَّحِيحَةِ، وَعَلَامَةَ ( ✗ ) أَمَامَ العِبَارَةِ الخَاطِئَةِ'}</div><ol class="tf8">${a.rows.map((t, j) => `<li><span class="q8n">${C.ltr ? j + 1 : AR(j + 1)}</span><p>${t}</p><i>(&nbsp;&nbsp;&nbsp;&nbsp;)</i></li>`).join('')}</ol></div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
if (C.layout === 'g9') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint9">${a.hint}</div><div class="q9grid">${a.rows.map(([w, o], j) => `<div class="q9"><div class="q9h"><span>${N(j + 1)}</span><u></u></div><p>${w}</p><ol>${o.map((x, k) => `<li><b>(${N(k + 1)})</b> ${x}</li>`).join('')}</ol></div>`).join('')}</div>${a.top ? `<div class="tlrow">${a.top.map(x => G(x)).join('')}</div>` : ''}`;
  ACT.tf = (a) => `<div class="hint9">${a.hint || 'أَكْتُبُ «صَحٌّ» أَوْ «خَطَأٌ» عَلَى الخَطِّ'}</div><div class="tf9">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><p>${t}</p><i></i></div>`).join('')}</div><div class="tlrow">${a.top.map(x => G(x)).join('')}</div>`;
}
const actPages = (LIST, off) => LIST.forEach((a, j) => {
  j = j + off;
  const h = [150, 200, 20, 45, 265, 100, 320, 180][j % 8];
  pages.push(`
<section class="page plain" style="--h:${h}">
  ${bubbles(40 + j, h)}
  ${C.layout === 'g9' ? `<div class="a9h"><i>✏️</i><div><small>${C.ltr ? 'Exercise ' + (j + 1) : 'تَمْرِينٌ ' + AR(j + 1)}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g8' ? `<div class="a8h"><span>${C.ltr ? 'Activity' : 'نَشَاطٌ'}</span><h2>${a.title}</h2></div>` : C.layout === 'g7' ? `<div class="a7h"><b>${C.ltr ? 'Exercise' : 'تَمْرِينٌ'}</b><h2>${a.title}</h2></div>` : C.layout === 'g6' ? `<div class="a6h"><span>${C.ltr ? 'Practice' : 'تَدْرِيبٌ'}</span><h2>${a.title}</h2></div>` : title(a.title, `hsl(${h},60%,30%)`)}
  ${ACT[a.type](a)}
  ${pno(P++)}
</section>`);
});

const unitPage6 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit6" style="--h:${h}">
  <div class="u6band"><div class="u6num">${C.ltr ? k + 1 : AR(k + 1)}</div><div class="u6t"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  <div class="u6art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<div class="u6intro">${u.intro}</div>` : ''}
  <div class="u6list"><b>${C.ltr ? 'In this unit:' : 'فِي هٰذِهِ الوَحْدَةِ:'}</b>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map((t, n) => `<span><i>${C.ltr ? n + 1 : AR(n + 1)}</i>${t}</span>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage7 = (u, k) => { const h = (k * 47 + C.h) % 360; pages.push(`
<section class="page plain unit7" style="--h:${h}">
  <div class="u7num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u7card"><small>${C.ltr ? 'Unit ' + (k + 1) : 'الوَحْدَةُ ' + ['الأُولَى','الثَّانِيَةُ','الثَّالِثَةُ','الرَّابِعَةُ','الخَامِسَةُ','السَّادِسَةُ','السَّابِعَةُ','الثَّامِنَةُ'][k]}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u7shelf">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u7intro">${u.intro}</p>` : ''}
  <div class="u7chips"><b>${C.ltr ? 'In this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b><div>${[...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)].map(t => `<span>${t}</span>`).join('')}</div></div>
  ${pno(P++)}
</section>`); };
const unitPage8 = (u, k) => { const h = (k * 47 + C.h) % 360; const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit8" style="--h:${h}">
  <div class="u8top"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div>
  <div class="u8num">${C.ltr ? k + 1 : AR(k + 1)}</div>
  <div class="u8art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u8intro">${u.intro}</p>` : ''}
  <div class="u8grid">${all.map((t, n) => `<div><i>${C.ltr ? n + 1 : AR(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage9 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit9" style="--h:${h}">
  <div class="u9ring"><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div></div>
  <h1 class="u9t">${u.title}</h1><em class="u9en">${u.en}</em>
  <div class="u9art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${u.intro ? `<p class="u9intro">${u.intro}</p>` : ''}
  <div class="u9toc">${all.map((t, n) => `<div><b>${N(n + 1)}</b><span>${t}</span><i></i></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage = (u, k) => C.layout === 'g9' ? unitPage9(u, k) : C.layout === 'g8' ? unitPage8(u, k) : C.layout === 'g7' ? unitPage7(u, k) : C.layout === 'g6' ? unitPage6(u, k) : pages.push(`
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
.cover{--h:200;background:#ffffff;text-align:center;padding:40px}
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
bdi[dir=ltr]{unicode-bidi:isolate-override !important;direction:ltr}
/* ===== Grade-9 interface: framed white page, colour hero block with round picture, big-number points, speech-bubble writing, write-the-number exercises ===== */
.page:not(.cover) .bub{display:none}
.page:not(.cover):not(.cert){background:#ffffff !important}
.page:not(.cover):not(.cert)::after{content:'';position:absolute;inset:16px;border:4px solid hsl(var(--h),55%,80%);border-radius:34px;pointer-events:none}
.pno{width:auto !important;min-width:70px;height:40px !important;padding:0 18px;border-radius:14px 14px 0 0 !important;bottom:18px !important;background:hsl(var(--h),55%,80%) !important;box-shadow:none !important;color:hsl(var(--h),55%,25%) !important;text-shadow:none !important;font-size:22px !important}
/* ---- lesson page ---- */
.item9{padding:0 0 80px !important}
.l9hero{position:relative;margin:16px 16px 0;height:400px;border-radius:30px 30px 0 0;background:linear-gradient(160deg,hsl(var(--h),70%,60%),hsl(var(--h),65%,42%));display:flex;align-items:center;padding:0 40px}
.l9mark{position:absolute;top:0;inset-inline-start:40px;width:86px;padding:10px 0 22px;background:#fff;color:hsl(var(--h),60%,35%);text-align:center;font-size:18px;font-weight:800;line-height:1.3;clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}
.l9mark b{display:block;font-size:42px;line-height:1.1}
.l9t{flex:1;padding-top:40px;padding-inline-start:110px;padding-inline-end:10px}
.l9t h2{font-size:54px;font-weight:800;line-height:1.45;color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,18%),0 0 3px hsl(var(--h),60%,18%),0 0 3px hsl(var(--h),60%,18%)}
.l9t em{display:block;font-style:normal;font-family:Fredoka;font-size:24px;font-weight:600;color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,18%),0 0 3px hsl(var(--h),60%,18%)}
.l9pic{flex:none;width:310px;height:310px;border-radius:50%;background:#fff;box-shadow:0 0 0 12px hsla(0,0%,100%,.35),0 16px 30px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;margin-top:110px}
.l9pic svg{width:250px;height:250px}
.l9pts{list-style:none;margin:30px 50px 0;padding:0}
.l9pts li{display:flex;gap:20px;align-items:flex-start;padding:12px 0;border-bottom:2px solid #eef0f5}
.l9pts li>b{flex:none;width:64px;font-size:64px;font-weight:800;line-height:1;color:hsl(var(--h),60%,55%);text-align:center}
.l9pts small{display:block;font-size:20px;font-weight:800;color:hsl(var(--h),40%,45%);line-height:1.5}
.l9pts p{font-size:28px;font-weight:800;line-height:1.7;color:#2b2340}
.l9pts li:first-child p{font-size:30px}
.l9bub{position:relative;margin:30px 50px 0;border:4px solid hsl(var(--h),55%,70%);border-radius:30px;padding:14px 24px 16px;background:hsl(var(--h),80%,97%)}
.l9bub::after{content:'';position:absolute;bottom:-22px;inset-inline-start:60px;width:36px;height:36px;background:hsl(var(--h),80%,97%);border-inline-end:4px solid hsl(var(--h),55%,70%);border-bottom:4px solid hsl(var(--h),55%,70%);transform:rotate(45deg)}
.l9bub b{font-size:24px;font-weight:800;color:hsl(var(--h),50%,35%)}
.l9bub i{display:block;height:56px;border-bottom:2px dashed hsl(var(--h),40%,72%)}
/* ---- unit opener ---- */
.page.plain.unit9:not(.cover):not(.cert){padding:60px 60px 90px !important;text-align:center}
.u9ring{width:250px;height:250px;margin:20px auto 0;border-radius:50%;background:radial-gradient(circle,#fff 0 52%,hsl(var(--h),70%,88%) 53% 66%,hsl(var(--h),65%,55%) 67% 100%);display:flex;align-items:center;justify-content:center}
.u9ring small{display:block;font-size:24px;font-weight:800;color:hsl(var(--h),50%,40%);line-height:1.3}
.u9ring b{display:block;font-size:84px;font-weight:800;line-height:1;color:hsl(var(--h),60%,35%)}
.u9t{font-size:56px;font-weight:800;line-height:1.5;color:hsl(var(--h),60%,30%);margin-top:20px}
.u9en{display:block;font-style:normal;font-family:Fredoka;font-size:24px;font-weight:600;color:#7a7590}
.u9art{display:flex;justify-content:center;gap:24px;margin-top:16px}.u9art svg{width:120px;height:120px}
.u9intro{margin-top:14px;font-size:25px;font-weight:700;line-height:1.9;color:#3b3550}
.u9toc{margin:22px 20px 0;text-align:start}
.u9toc div{display:flex;align-items:baseline;gap:12px;padding:6px 0}
.u9toc b{flex:none;font-size:26px;font-weight:800;color:hsl(var(--h),60%,45%)}
.u9toc span{flex:none;font-size:24px;font-weight:800;color:#2b2340;line-height:1.6}
.u9toc i{flex:1;border-bottom:3px dotted hsl(var(--h),40%,70%);margin-bottom:8px}
/* ---- exercise pages ---- */
.page.plain:not(.unit9){padding-top:46px}
.a9h{position:relative;display:flex;align-items:center;gap:16px;margin:6px 40px 0}
.a9h i{font-style:normal;flex:none;width:70px;height:70px;border-radius:50%;background:hsl(var(--h),65%,52%);display:flex;align-items:center;justify-content:center;font-size:34px}
.a9h small{display:block;font-size:22px;font-weight:800;color:hsl(var(--h),50%,45%);line-height:1.4}
.a9h h2{font-size:40px;font-weight:800;line-height:1.4;color:hsl(var(--h),60%,28%);border-bottom:6px solid hsl(var(--h),70%,80%)}
.hint9{position:relative;margin:16px 40px 0;font-size:23px;font-weight:700;color:#6f6a8a;line-height:1.7}
.q9grid{position:relative;margin:16px 40px 0;display:grid;grid-template-columns:1fr 1fr;gap:18px}
.q9{border:3px solid #e9ebf2;border-radius:24px;padding:12px 18px 14px;background:#fff}
.q9h{display:flex;align-items:center;justify-content:space-between}
.q9h span{width:40px;height:40px;border-radius:12px;background:hsl(var(--h),70%,92%);color:hsl(var(--h),55%,35%);font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center}
.q9h u{width:52px;height:44px;border:3px solid hsl(var(--h),55%,60%);border-radius:10px}
.q9 p{font-size:27px;font-weight:800;line-height:1.7;color:#2b2340;margin-top:8px}
.q9 ol{list-style:none;margin:6px 0 0;padding:0}
.q9 li{font-size:25px;font-weight:700;line-height:1.75;color:#3b3550}.q9 li b{color:hsl(var(--h),55%,45%)}
.tf9{position:relative;margin:20px 40px 0;display:flex;flex-direction:column;gap:14px}
.tf9>div{display:flex;align-items:center;gap:16px;border:3px solid #e9ebf2;border-radius:22px;padding:10px 18px}
.tf9 span{flex:none;width:40px;height:40px;border-radius:12px;background:hsl(var(--h),70%,92%);color:hsl(var(--h),55%,35%);font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center}
.tf9 p{flex:1;font-size:27px;font-weight:700;line-height:1.7;color:#2b2340}
.tf9 i{flex:none;width:130px;border-bottom:3px dotted hsl(var(--h),40%,60%);height:40px}
.q9grid + .tlrow,.tf9 + .tlrow{margin-top:26px !important}.q9grid + .tlrow svg,.tf9 + .tlrow svg{width:130px !important;height:130px !important}
/* shared blocks */
.card,.refc,.steps div,.du,.wtopic,.surah,.facts{box-shadow:none !important;border:3px solid #e9ebf2 !important}
.surah{border-color:#e8c56a !important}
.toc .tocr{background:#fff !important;border:3px solid #e9ebf2 !important;border-radius:20px !important}
/* ---- cover ---- */
.cover{background:#ffffff !important;overflow:hidden}
.cover::before{content:'';position:absolute;left:-30%;right:-30%;top:190px;height:600px;transform:rotate(-12deg);background:linear-gradient(180deg,hsl(var(--h),70%,60%) 0 33%,hsl(calc(var(--h) + 25),70%,55%) 33% 66%,hsl(calc(var(--h) + 50),70%,50%) 66% 100%)}
.cover::after{content:'';position:absolute;left:60px;right:60px;top:300px;height:380px;border-radius:40px;background:hsl(var(--h),55%,26%);box-shadow:0 20px 40px rgba(0,0,0,.18)}
.cover > *:not(.ca):not(.gbadge):not(.bub){position:relative;z-index:1}
.cover .ca{z-index:2}.cover .bub{display:none}
.cover h1{font-size:74px !important;line-height:1.45 !important;margin-top:330px !important}
.back h2{font-size:62px !important;margin-top:120px !important}
.l9pts p{font-size:29px}.l9pts li:first-child p{font-size:31px}.l9pts li{padding:14px 0}
.wpair{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px 24px;box-shadow:0 8px 0 hsl(var(--h),50%,74%)}.wph{display:flex;justify-content:space-around;margin-bottom:8px}.wph b{font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:18px;padding:2px 26px;line-height:1.6;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.wpr{display:flex;align-items:center;justify-content:space-around;margin-top:12px}.wpr span{min-width:220px;text-align:center;font-size:42px;font-weight:800;line-height:1.6;border-radius:22px;padding:2px 14px;background:hsl(var(--h),80%,94%);color:hsl(var(--h),60%,28%)}.wpr i{font-style:normal;font-size:42px;font-weight:800;color:hsl(var(--h),60%,45%)}.ptab{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}.ptab>div{display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:12px 22px;box-shadow:0 7px 0 hsl(var(--h),50%,72%)}
.ptab i{font-style:normal;flex:none;width:110px;height:110px;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:80px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);text-shadow:0 0 4px hsl(var(--h),60%,20%),0 0 4px hsl(var(--h),60%,20%)}
.ptab b{display:block;font-size:34px;font-weight:800;line-height:1.6;color:hsl(var(--h),60%,30%)}.ptab small{display:block;font-size:24px;font-weight:700;color:#6f6a8a;line-height:1.6}.ptab p{font-size:30px;font-weight:800;line-height:1.7;color:#2b2340}
.story p{font-size:33px !important;line-height:2.2 !important}.steps{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:16px}.steps div{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:12px 20px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.steps i{font-style:normal;flex:none;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.steps b{font-size:31px;font-weight:800;line-height:1.7;color:#2b2340}
.tips{margin-top:26px}.tips p{font-size:30px;font-weight:700;line-height:2}
.wtopic{position:relative;margin-top:20px;background:#fff;border-radius:28px;padding:14px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.wtopic b{display:block;text-align:center;font-size:34px;font-weight:800;line-height:1.7;color:hsl(var(--h),60%,30%)}
.wbank{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:8px}.wbank span{font-size:27px;font-weight:800;line-height:1.6;background:hsl(var(--h),80%,93%);border-radius:16px;padding:2px 16px}
.wlines{position:relative;margin:20px 40px 0;display:flex;flex-direction:column;gap:0}.wlines i{display:block;height:74px;border-bottom:3px solid hsl(var(--h),40%,72%)}
.story p{font-size:32px !important;line-height:2.15 !important}.letter{margin-top:22px}.letter p{font-size:28px;font-weight:700;line-height:2}.letter .ld{text-align:left;color:#6f6a8a}.letter .ls{text-align:left;color:hsl(var(--h),60%,30%);font-weight:800}.qrow{margin-top:20px !important;padding:12px 16px !important}.qw{min-width:300px !important;max-width:360px;font-size:28px !important}.qo{font-size:30px !important}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>لغتي الجميلة ٩</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
