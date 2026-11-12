// Builds "لغتي الجميلة ٥" – Arabic language, fifth-grade syllabus – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./lughati5-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, sentence, chip1, chip2, traceword?]
const ITEMS = [["كَانَ الجَوُّ جَمِيلًا", "The weather was nice", "sun", "كَانَ الجَوُّ جَمِيلًا أَمْسِ", "الجَوُّ", "جَمِيلًا", "كَانَ"], ["أَصْبَحَ الطِّفْلُ نَشِيطًا", "The child became active", "kidc:#36c45d", "أَصْبَحَ الطِّفْلُ نَشِيطًا بَعْدَ النَّوْمِ", "الطِّفْلُ", "نَشِيطًا", "أَصْبَحَ"], ["صَارَ المَاءُ ثَلْجًا", "The water became ice", "icecube", "صَارَ المَاءُ ثَلْجًا فِي الثَّلَّاجَةِ", "المَاءُ", "ثَلْجًا", "صَارَ"], ["لَيْسَ الطَّرِيقُ بَعِيدًا", "The road is not far", "myhouse", "لَيْسَ الطَّرِيقُ إِلَى المَدْرَسَةِ بَعِيدًا", "الطَّرِيقُ", "بَعِيدًا", "لَيْسَ"], ["إِنَّ الصِّدْقَ نَجَاةٌ", "Honesty is salvation", "m_honest", "إِنَّ الصِّدْقَ نَجَاةٌ لِصَاحِبِهِ", "الصِّدْقَ", "نَجَاةٌ", "إِنَّ"], ["كَأَنَّ القَمَرَ مِصْبَاحٌ", "As if the moon were a lamp", "moon", "كَأَنَّ القَمَرَ مِصْبَاحٌ فِي السَّمَاءِ", "القَمَرَ", "مِصْبَاحٌ", "كَأَنَّ"], ["لَعَلَّ المَطَرَ نَازِلٌ", "Perhaps the rain is coming", "raincloud", "لَعَلَّ المَطَرَ نَازِلٌ اليَوْمَ", "المَطَرَ", "نَازِلٌ", "لَعَلَّ"], ["لٰكِنَّ المَاءَ بَارِدٌ", "But the water is cold", "waterglass", "الجَوُّ حَارٌّ لٰكِنَّ المَاءَ بَارِدٌ", "المَاءَ", "بَارِدٌ", "لٰكِنَّ"], ["جَاءَ الطَّالِبَانِ", "The two students came", "g_friend", "جَاءَ الطَّالِبَانِ إِلَى المَدْرَسَةِ مُبَكِّرَيْنِ", "الرَّفْعُ", "الأَلِفُ: الطَّالِبَانِ", "الطَّالِبَانِ"], ["رَأَيْتُ الطَّالِبَيْنِ", "I saw the two students", "g_student", "رَأَيْتُ الطَّالِبَيْنِ فِي المَكْتَبَةِ", "النَّصْبُ", "اليَاءُ: الطَّالِبَيْنِ", "الطَّالِبَيْنِ"], ["سَلَّمْتُ عَلَى الطَّالِبَيْنِ", "I greeted the two students", "g_neighbor", "سَلَّمْتُ عَلَى الطَّالِبَيْنِ فِي الصَّبَاحِ", "الجَرُّ", "اليَاءُ: الطَّالِبَيْنِ", "الطَّالِبَيْنِ"], ["حَضَرَ المُعَلِّمُونَ", "The teachers came", "students", "حَضَرَ المُعَلِّمُونَ إِلَى الحَفْلِ", "الرَّفْعُ", "الوَاوُ: المُعَلِّمُونَ", "المُعَلِّمُونَ"], ["شَكَرْتُ المُعَلِّمِينَ", "I thanked the teachers", "teacher", "شَكَرْتُ المُعَلِّمِينَ عَلَى جُهُودِهِمْ", "النَّصْبُ", "اليَاءُ: المُعَلِّمِينَ", "المُعَلِّمِينَ"], ["اسْتَمَعْتُ إِلَى المُعَلِّمِينَ", "I listened to the teachers", "v_read", "اسْتَمَعْتُ إِلَى المُعَلِّمِينَ بِانْتِبَاهٍ", "الجَرُّ", "اليَاءُ: المُعَلِّمِينَ", "المُعَلِّمِينَ"], ["عَلَى الأَلِفِ", "On the alif", "q_man", "سَأَلَ الطَّالِبُ المُعَلِّمَ سُؤَالًا", "«أ»: أَقْوَى الحَرَكَتَيْنِ الفَتْحَةُ", "سَأَلَ، رَأْسٌ، يَسْأَلُ", "سَأَلَ"], ["عَلَى الوَاوِ", "On the waw", "prayermat", "المُؤْمِنُ يُحِبُّ الخَيْرَ لِلنَّاسِ", "«ؤ»: أَقْوَى الحَرَكَتَيْنِ الضَّمَّةُ", "مُؤْمِنٌ، سُؤَالٌ، فُؤَادٌ", "مُؤْمِنٌ"], ["عَلَى اليَاءِ", "On the yaa (nabra)", "bucket", "فِي القَرْيَةِ بِئْرٌ عَمِيقَةٌ", "«ئ»: أَقْوَى الحَرَكَتَيْنِ الكَسْرَةُ", "بِئْرٌ، ذِئْبٌ، سُئِلَ", "بِئْرٌ"]];
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

const C = {"dir": "lughati5-book", "prefix": "Lughati-5", "title": "لغتي الجميلة ٥", "artmod": "lughati5-art", "header": "Builds \"لغتي الجميلة ٥\" – Arabic language, fifth-grade syllabus – A4 portrait.", "grade": "Grade 5", "theme": "5", "cover": "--h:200;background:radial-gradient(circle at 50% 40%,#ffffff 0 20%,transparent 21%),repeating-radial-gradient(circle at 50% 40%,#dcefff 0 22px,#c3e2ff 22px 44px)", "h": 200, "t1": "لُغَتِي الجَمِيلَةُ", "t2": "الجُزْءُ الخَامِسُ", "s1": "#1f5fbf", "s2": "#c46a00", "csub": "أَقْرَأُ وَأَفْهَمُ وَأُعْرِبُ وَأَكْتُبُ", "cen": "My Beautiful Arabic 5", "coverTop": ["moon", "bigbook", "sun"], "coverBot": ["students", "envelope", "g_friend", "laptop"], "ownerArt": "bigbook", "ownerMini": ["pencil", "notebook", "envelope"], "noteP": "هٰذَا الكِتَابُ يَنْقُلُ طِفْلَكُمْ إِلَى قَوَاعِدَ أَعْمَقَ: كَانَ وَأَخَوَاتُهَا، وَإِنَّ وَأَخَوَاتُهَا، وَإِعْرَابُ المُثَنَّى وَجَمْعِ المُذَكَّرِ السَّالِمِ، وَالهَمْزَةُ المُتَوَسِّطَةُ، وَكِتَابَةُ الرِّسَالَةِ، وَالقِرَاءَةُ وَالفَهْمُ 📚", "noteLi": ["اطْلُبُوا مِنْهُ أَنْ يُدْخِلَ «كَانَ» ثُمَّ «إِنَّ» عَلَى جُمْلَةٍ وَاحِدَةٍ، وَيُلَاحِظَ تَغَيُّرَ الحَرَكَاتِ.", "دَعُوهُ يَكْتُبُ رِسَالَةً حَقِيقِيَّةً إِلَى قَرِيبٍ أَوْ صَدِيقٍ.", "اقْرَؤُوا النُّصُوصَ مَعًا، وَنَاقِشُوا الفِكْرَةَ الرَّئِيسَةَ.", "شَجِّعُوهُ عَلَى الكِتَابَةِ فَوْقَ الحُرُوفِ الرَّمَادِيَّةِ."], "noteMini": ["v_read", "envelope", "v_write"], "certP": "لِأَنَّهُ أَتَمَّ كِتَابَ «لُغَتِي الجَمِيلَةُ ٥» بِنَجَاحٍ", "certArts": ["book", "medal", "pencil"], "blurb": "كِتَابٌ شَامِلٌ مُلَوَّنٌ بِرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَادِ لِتَعْلِيمِ اللُّغَةِ العَرَبِيَّةِ لِلْأَطْفَالِ فِي سَنَتِهِمُ الدِّرَاسِيَّةِ الخَامِسَةِ.", "blurbLi": ["كَانَ وَأَخَوَاتُهَا، وَإِنَّ وَأَخَوَاتُهَا", "إِعْرَابُ المُثَنَّى وَجَمْعِ المُذَكَّرِ السَّالِمِ", "الهَمْزَةُ المُتَوَسِّطَةُ، وَكِتَابَةُ الرِّسَالَةِ", "نُصُوصٌ لِلْقِرَاءَةِ وَالفَهْمِ، وَشَهَادَةٌ"], "en2": "A complete, joyful 3D Arabic language book – part 5", "backArts": ["raincloud", "icecube", "g_neighbor", "clockt:6:00"], "extraCss": ".wpair{position:relative;margin-top:24px;background:#fff;border-radius:34px;padding:16px 24px;box-shadow:0 8px 0 hsl(var(--h),50%,74%)}.wph{display:flex;justify-content:space-around;margin-bottom:8px}.wph b{font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);border-radius:18px;padding:2px 26px;line-height:1.6;text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.wpr{display:flex;align-items:center;justify-content:space-around;margin-top:12px}.wpr span{min-width:220px;text-align:center;font-size:42px;font-weight:800;line-height:1.6;border-radius:22px;padding:2px 14px;background:hsl(var(--h),80%,94%);color:hsl(var(--h),60%,28%)}.wpr i{font-style:normal;font-size:42px;font-weight:800;color:hsl(var(--h),60%,45%)}.ptab{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:18px}.ptab>div{display:flex;align-items:center;gap:20px;background:#fff;border-radius:30px;padding:12px 22px;box-shadow:0 7px 0 hsl(var(--h),50%,72%)}\n.ptab i{font-style:normal;flex:none;width:110px;height:110px;border-radius:26px;display:flex;align-items:center;justify-content:center;font-size:80px;font-weight:800;color:#fff;background:hsl(var(--h),65%,50%);text-shadow:0 0 4px hsl(var(--h),60%,20%),0 0 4px hsl(var(--h),60%,20%)}\n.ptab b{display:block;font-size:34px;font-weight:800;line-height:1.6;color:hsl(var(--h),60%,30%)}.ptab small{display:block;font-size:24px;font-weight:700;color:#6f6a8a;line-height:1.6}.ptab p{font-size:30px;font-weight:800;line-height:1.7;color:#2b2340}\n.story p{font-size:33px !important;line-height:2.2 !important}.steps{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:16px}.steps div{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:12px 20px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}\n.steps i{font-style:normal;flex:none;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.steps b{font-size:31px;font-weight:800;line-height:1.7;color:#2b2340}\n.tips{margin-top:26px}.tips p{font-size:30px;font-weight:700;line-height:2}\n.wtopic{position:relative;margin-top:20px;background:#fff;border-radius:28px;padding:14px 22px;box-shadow:0 6px 0 hsl(var(--h),50%,76%)}.wtopic b{display:block;text-align:center;font-size:34px;font-weight:800;line-height:1.7;color:hsl(var(--h),60%,30%)}\n.wbank{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:8px}.wbank span{font-size:27px;font-weight:800;line-height:1.6;background:hsl(var(--h),80%,93%);border-radius:16px;padding:2px 16px}\n.wlines{position:relative;margin:20px 40px 0;display:flex;flex-direction:column;gap:0}.wlines i{display:block;height:74px;border-bottom:3px solid hsl(var(--h),40%,72%)}\n.story p{font-size:32px !important;line-height:2.15 !important}.letter{margin-top:22px}.letter p{font-size:28px;font-weight:700;line-height:2}.letter .ld{text-align:left;color:#6f6a8a}.letter .ls{text-align:left;color:hsl(var(--h),60%,30%);font-weight:800}.qrow{margin-top:20px !important;padding:12px 16px !important}.qw{min-width:300px !important;max-width:360px;font-size:28px !important}.qo{font-size:30px !important}", "units": [{"title": "كَانَ وَأَخَوَاتُهَا", "en": "Kana & its sisters", "icon": "sun", "arts": ["sun", "icecube", "kidc:#36c45d"], "intro": "كَانَ وَأَخَوَاتُهَا تَدْخُلُ عَلَى الجُمْلَةِ الاسْمِيَّةِ، فَتَرْفَعُ المُبْتَدَأَ وَيُسَمَّى اسْمَهَا، وَتَنْصِبُ الخَبَرَ وَيُسَمَّى خَبَرَهَا.", "chip1": ["1️⃣", "اسْمُهَا (مَرْفُوعٌ)"], "chip2": ["2️⃣", "خَبَرُهَا (مَنْصُوبٌ)"], "items": [["كَانَ الجَوُّ جَمِيلًا", "The weather was nice", "sun", "كَانَ الجَوُّ جَمِيلًا أَمْسِ", "الجَوُّ", "جَمِيلًا", "كَانَ"], ["أَصْبَحَ الطِّفْلُ نَشِيطًا", "The child became active", "kidc:#36c45d", "أَصْبَحَ الطِّفْلُ نَشِيطًا بَعْدَ النَّوْمِ", "الطِّفْلُ", "نَشِيطًا", "أَصْبَحَ"], ["صَارَ المَاءُ ثَلْجًا", "The water became ice", "icecube", "صَارَ المَاءُ ثَلْجًا فِي الثَّلَّاجَةِ", "المَاءُ", "ثَلْجًا", "صَارَ"], ["لَيْسَ الطَّرِيقُ بَعِيدًا", "The road is not far", "myhouse", "لَيْسَ الطَّرِيقُ إِلَى المَدْرَسَةِ بَعِيدًا", "الطَّرِيقُ", "بَعِيدًا", "لَيْسَ"]], "acts": [{"type": "words", "title": "اخْتَرِ الخَبَرَ الصَّحِيحَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["كَانَ الطَّالِبُ ...", ["مُجْتَهِدًا", "مُجْتَهِدٌ"]], ["أَصْبَحَتِ السَّمَاءُ ...", ["صَافِيَةٌ", "صَافِيَةً"]], ["لَيْسَ الكَذِبُ ...", ["مُفِيدًا", "مُفِيدٌ"]], ["صَارَ الجَوُّ ...", ["بَارِدٌ", "بَارِدًا"]]]}, {"type": "words", "title": "أَيْنَ اسْمُ كَانَ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ اسْمِ الفِعْلِ النَّاسِخِ ⭕", "rows": [["كَانَ البَحْرُ هَادِئًا", ["البَحْرُ", "هَادِئًا"]], ["أَصْبَحَ الوَلَدُ طَوِيلًا", ["طَوِيلًا", "الوَلَدُ"]], ["صَارَتِ الشَّجَرَةُ كَبِيرَةً", ["الشَّجَرَةُ", "كَبِيرَةً"]], ["لَيْسَ الدَّرْسُ صَعْبًا", ["صَعْبًا", "الدَّرْسُ"]]]}]}, {"title": "إِنَّ وَأَخَوَاتُهَا", "en": "Inna & its sisters", "icon": "moon", "arts": ["m_honest", "moon", "raincloud"], "intro": "إِنَّ وَأَخَوَاتُهَا تَدْخُلُ عَلَى الجُمْلَةِ الاسْمِيَّةِ، فَتَنْصِبُ المُبْتَدَأَ وَيُسَمَّى اسْمَهَا، وَتَرْفَعُ الخَبَرَ وَيُسَمَّى خَبَرَهَا.", "chip1": ["1️⃣", "اسْمُهَا (مَنْصُوبٌ)"], "chip2": ["2️⃣", "خَبَرُهَا (مَرْفُوعٌ)"], "items": [["إِنَّ الصِّدْقَ نَجَاةٌ", "Honesty is salvation", "m_honest", "إِنَّ الصِّدْقَ نَجَاةٌ لِصَاحِبِهِ", "الصِّدْقَ", "نَجَاةٌ", "إِنَّ"], ["كَأَنَّ القَمَرَ مِصْبَاحٌ", "As if the moon were a lamp", "moon", "كَأَنَّ القَمَرَ مِصْبَاحٌ فِي السَّمَاءِ", "القَمَرَ", "مِصْبَاحٌ", "كَأَنَّ"], ["لَعَلَّ المَطَرَ نَازِلٌ", "Perhaps the rain is coming", "raincloud", "لَعَلَّ المَطَرَ نَازِلٌ اليَوْمَ", "المَطَرَ", "نَازِلٌ", "لَعَلَّ"], ["لٰكِنَّ المَاءَ بَارِدٌ", "But the water is cold", "waterglass", "الجَوُّ حَارٌّ لٰكِنَّ المَاءَ بَارِدٌ", "المَاءَ", "بَارِدٌ", "لٰكِنَّ"]], "acts": [{"type": "words", "title": "اخْتَرِ الاسْمَ الصَّحِيحَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["إِنَّ ... نَافِعٌ", ["العِلْمُ", "العِلْمَ"]], ["كَأَنَّ ... أُمٌّ", ["المُعَلِّمَةَ", "المُعَلِّمَةُ"]], ["لَعَلَّ ... نَاجِحٌ", ["الطَّالِبُ", "الطَّالِبَ"]], ["إِنَّ ... حَارَّةٌ", ["الشَّمْسَ", "الشَّمْسُ"]]]}, {"type": "words", "title": "كَانَ أَمْ إِنَّ؟", "hint": "اخْتَرِ النَّاسِخَ المُنَاسِبَ لِلْحَرَكَاتِ ⭕", "rows": [["... الجَوُّ بَارِدًا", ["كَانَ", "إِنَّ"]], ["... الجَوَّ بَارِدٌ", ["كَانَ", "إِنَّ"]], ["... الطَّالِبُ نَشِيطًا", ["أَصْبَحَ", "لَعَلَّ"]], ["... الطَّالِبَ نَشِيطٌ", ["أَصْبَحَ", "لَعَلَّ"]]]}]}, {"title": "إِعْرَابُ المُثَنَّى", "en": "The dual: case endings", "icon": "g_friend", "arts": ["g_friend", "g_neighbor"], "intro": "يُرْفَعُ المُثَنَّى بِالأَلِفِ، وَيُنْصَبُ وَيُجَرُّ بِاليَاءِ.", "chip1": ["🏷️", "الحَالَةُ"], "chip2": ["✍️", "العَلَامَةُ"], "items": [["جَاءَ الطَّالِبَانِ", "The two students came", "g_friend", "جَاءَ الطَّالِبَانِ إِلَى المَدْرَسَةِ مُبَكِّرَيْنِ", "الرَّفْعُ", "الأَلِفُ: الطَّالِبَانِ", "الطَّالِبَانِ"], ["رَأَيْتُ الطَّالِبَيْنِ", "I saw the two students", "g_student", "رَأَيْتُ الطَّالِبَيْنِ فِي المَكْتَبَةِ", "النَّصْبُ", "اليَاءُ: الطَّالِبَيْنِ", "الطَّالِبَيْنِ"], ["سَلَّمْتُ عَلَى الطَّالِبَيْنِ", "I greeted the two students", "g_neighbor", "سَلَّمْتُ عَلَى الطَّالِبَيْنِ فِي الصَّبَاحِ", "الجَرُّ", "اليَاءُ: الطَّالِبَيْنِ", "الطَّالِبَيْنِ"]], "acts": [{"type": "words", "title": "اخْتَرِ الصَّوَابَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["فَازَ ...", ["اللَّاعِبَانِ", "اللَّاعِبَيْنِ"]], ["شَاهَدْتُ ...", ["الفِيلَانِ", "الفِيلَيْنِ"]], ["نَظَرْتُ إِلَى ...", ["النَّجْمَيْنِ", "النَّجْمَانِ"]], ["فِي الحَدِيقَةِ ... جَمِيلَتَانِ", ["وَرْدَتَانِ", "وَرْدَتَيْنِ"]]]}, {"type": "words", "title": "مَا عَلَامَةُ الإِعْرَابِ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["جَلَسَ الوَلَدَانِ", ["الأَلِفُ", "اليَاءُ"]], ["أَحْبَبْتُ الوَلَدَيْنِ", ["الأَلِفُ", "اليَاءُ"]], ["مَرَرْتُ بِالوَلَدَيْنِ", ["الأَلِفُ", "اليَاءُ"]], ["نَجَحَتِ البِنْتَانِ", ["الأَلِفُ", "اليَاءُ"]]]}, {"type": "words", "title": "أُحَوِّلُ إِلَى المُثَنَّى", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["حَضَرَ المُعَلِّمُ ← حَضَرَ ...", ["المُعَلِّمَانِ", "المُعَلِّمَيْنِ"]], ["قَرَأْتُ الكِتَابَ ← قَرَأْتُ ...", ["الكِتَابَيْنِ", "الكِتَابَانِ"]], ["جَلَسْتُ عَلَى الكُرْسِيِّ ← جَلَسْتُ عَلَى ...", ["الكُرْسِيَّيْنِ", "الكُرْسِيَّانِ"]], ["طَارَ العُصْفُورُ ← طَارَ ...", ["العُصْفُورَانِ", "العُصْفُورَيْنِ"]]]}]}, {"title": "إِعْرَابُ جَمْعِ المُذَكَّرِ السَّالِمِ", "en": "Sound masculine plural: case endings", "icon": "students", "arts": ["students"], "intro": "يُرْفَعُ جَمْعُ المُذَكَّرِ السَّالِمُ بِالوَاوِ، وَيُنْصَبُ وَيُجَرُّ بِاليَاءِ.", "chip1": ["🏷️", "الحَالَةُ"], "chip2": ["✍️", "العَلَامَةُ"], "items": [["حَضَرَ المُعَلِّمُونَ", "The teachers came", "students", "حَضَرَ المُعَلِّمُونَ إِلَى الحَفْلِ", "الرَّفْعُ", "الوَاوُ: المُعَلِّمُونَ", "المُعَلِّمُونَ"], ["شَكَرْتُ المُعَلِّمِينَ", "I thanked the teachers", "teacher", "شَكَرْتُ المُعَلِّمِينَ عَلَى جُهُودِهِمْ", "النَّصْبُ", "اليَاءُ: المُعَلِّمِينَ", "المُعَلِّمِينَ"], ["اسْتَمَعْتُ إِلَى المُعَلِّمِينَ", "I listened to the teachers", "v_read", "اسْتَمَعْتُ إِلَى المُعَلِّمِينَ بِانْتِبَاهٍ", "الجَرُّ", "اليَاءُ: المُعَلِّمِينَ", "المُعَلِّمِينَ"]], "acts": [{"type": "words", "title": "اخْتَرِ الصَّوَابَ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["نَجَحَ ...", ["المُجْتَهِدُونَ", "المُجْتَهِدِينَ"]], ["شَجَّعْتُ ...", ["اللَّاعِبُونَ", "اللَّاعِبِينَ"]], ["سَلَّمْتُ عَلَى ...", ["المُصَلِّينَ", "المُصَلُّونَ"]], ["... يَعْمَلُونَ فِي المَزْرَعَةِ", ["الفَلَّاحِينَ", "الفَلَّاحُونَ"]]]}, {"type": "words", "title": "مَا عَلَامَةُ الإِعْرَابِ؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["فَرِحَ المُسَافِرُونَ", ["الوَاوُ", "اليَاءُ"]], ["رَأَيْتُ المُسَافِرِينَ", ["الوَاوُ", "اليَاءُ"]], ["تَحَدَّثْتُ مَعَ المُهَنْدِسِينَ", ["الوَاوُ", "اليَاءُ"]], ["المُؤْمِنُونَ صَادِقُونَ", ["الوَاوُ", "اليَاءُ"]]]}]}, {"title": "الهَمْزَةُ المُتَوَسِّطَةُ", "en": "The hamza in the middle of a word", "icon": "q_man", "arts": ["q_man", "prayermat", "bucket"], "intro": "تُكْتَبُ الهَمْزَةُ المُتَوَسِّطَةُ عَلَى حَرْفٍ يُنَاسِبُ أَقْوَى الحَرَكَتَيْنِ: حَرَكَتِهَا وَحَرَكَةِ مَا قَبْلَهَا. وَالكَسْرَةُ أَقْوَى، ثُمَّ الضَّمَّةُ، ثُمَّ الفَتْحَةُ، ثُمَّ السُّكُونُ.", "chip1": ["✍️", "تُكْتَبُ"], "chip2": ["📖", "أَمْثِلَةٌ"], "items": [["عَلَى الأَلِفِ", "On the alif", "q_man", "سَأَلَ الطَّالِبُ المُعَلِّمَ سُؤَالًا", "«أ»: أَقْوَى الحَرَكَتَيْنِ الفَتْحَةُ", "سَأَلَ، رَأْسٌ، يَسْأَلُ", "سَأَلَ"], ["عَلَى الوَاوِ", "On the waw", "prayermat", "المُؤْمِنُ يُحِبُّ الخَيْرَ لِلنَّاسِ", "«ؤ»: أَقْوَى الحَرَكَتَيْنِ الضَّمَّةُ", "مُؤْمِنٌ، سُؤَالٌ، فُؤَادٌ", "مُؤْمِنٌ"], ["عَلَى اليَاءِ", "On the yaa (nabra)", "bucket", "فِي القَرْيَةِ بِئْرٌ عَمِيقَةٌ", "«ئ»: أَقْوَى الحَرَكَتَيْنِ الكَسْرَةُ", "بِئْرٌ، ذِئْبٌ، سُئِلَ", "بِئْرٌ"]], "acts": [{"type": "words", "title": "أَكْتُبُ الهَمْزَةَ الصَّحِيحَةَ", "hint": "اخْتَرِ الشَّكْلَ المُنَاسِبَ ⭕", "rows": [["رَ...سٌ", ["أ", "ؤ", "ئ"]], ["ذِ...بٌ", ["أ", "ؤ", "ئ"]], ["فُ...ادٌ", ["أ", "ؤ", "ئ"]], ["يَسْ...لُ", ["أ", "ؤ", "ئ"]]]}, {"type": "words", "title": "أَيُّهَا مَكْتُوبٌ صَحِيحًا؟", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["✍️", ["مُؤْمِنٌ", "مُأْمِنٌ"]], ["✍️", ["بِئْرٌ", "بِأْرٌ"]], ["✍️", ["سُؤَالٌ", "سُئَالٌ"]], ["✍️", ["يَسْأَلُ", "يَسْئَلُ"]]]}]}, {"title": "التَّعْبِيرُ الكِتَابِيُّ", "en": "Writing", "icon": "envelope", "arts": ["envelope", "pencil"], "intro": "أَتَعَلَّمُ كِتَابَةَ رِسَالَةٍ إِلَى صَدِيقٍ، وَكِتَابَةَ فِقْرَةٍ عَنْ رِحْلَةٍ.", "acts": [{"type": "raw", "title": "كَيْفَ أَكْتُبُ رِسَالَةً؟", "html": "<div class=\"hint\">أَجْزَاءُ الرِّسَالَةِ ✉️</div><div class=\"steps\"><div style=\"--h:120\"><i>١</i><b>التَّارِيخُ وَالمَكَانُ فِي أَعْلَى الرِّسَالَةِ</b></div><div style=\"--h:180\"><i>٢</i><b>التَّحِيَّةُ: عَزِيزِي ... السَّلَامُ عَلَيْكُمْ</b></div><div style=\"--h:240\"><i>٣</i><b>المَوْضُوعُ: مَا أُرِيدُ أَنْ أَقُولَهُ</b></div><div style=\"--h:300\"><i>٤</i><b>الخِتَامُ وَالتَّوْقِيعُ: أَخُوكَ المُحِبُّ</b></div></div><div class=\"card letter\"><p class=\"ld\">الرِّيَاضُ، ١٥ رَمَضَانَ</p><p>عَزِيزِي خَالِدُ، السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ،</p><p>أَكْتُبُ إِلَيْكَ لِأُخْبِرَكَ أَنِّي نَجَحْتُ فِي الاخْتِبَارِ، وَأَنْتَظِرُ زِيَارَتَكَ فِي العِيدِ.</p><p class=\"ls\">أَخُوكَ المُحِبُّ: عَلِيٌّ</p></div>"}, {"type": "raw", "title": "أَكْتُبُ رِسَالَةً", "html": "<div class=\"wtopic\"><b>المَوْضُوعُ: رِسَالَةٌ إِلَى صَدِيقِي</b><div class=\"wbank\"><span>عَزِيزِي</span><span>السَّلَامُ عَلَيْكُمْ</span><span>اشْتَقْتُ إِلَيْكَ</span><span>المَدْرَسَةُ</span><span>أَخُوكَ المُحِبُّ</span></div></div><div class=\"wlines\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>"}, {"type": "raw", "title": "أَكْتُبُ فِقْرَةً", "html": "<div class=\"wtopic\"><b>المَوْضُوعُ: رِحْلَةٌ مَدْرَسِيَّةٌ</b><div class=\"wbank\"><span>الحَافِلَةُ</span><span>المُعَلِّمُ</span><span>زُرْنَا</span><span>تَعَلَّمْنَا</span><span>اسْتَمْتَعْنَا</span></div></div><div class=\"wlines\"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>"}]}, {"title": "أَقْرَأُ وَأَفْهَمُ", "en": "Reading & Understanding", "icon": "bigbook", "arts": ["clockt:6:00", "laptop"], "intro": "أَقْرَأُ نَصَّيْنِ ثُمَّ أُجِيبُ عَنِ الأَسْئِلَةِ.", "acts": [{"type": "raw", "title": "نَصٌّ لِلْقِرَاءَةِ", "html": "<div class=\"card story\"><h3>الوَقْتُ ثَمِينٌ ⏰</h3><p>اسْتَيْقَظَ عُمَرُ مُبَكِّرًا، فَصَلَّى الفَجْرَ مَعَ أَبِيهِ فِي المَسْجِدِ.<br>ثُمَّ رَاجَعَ دُرُوسَهُ، وَتَنَاوَلَ فَطُورَهُ.<br>وَبَعْدَ المَدْرَسَةِ قَسَّمَ وَقْتَهُ بَيْنَ الوَاجِبِ وَاللَّعِبِ وَزِيَارَةِ جَدِّهِ.<br>قَالَ أَبُوهُ: أَحْسَنْتَ يَا عُمَرُ، إِنَّ الوَقْتَ أَغْلَى مِنَ الذَّهَبِ.</p></div>", "arts": ["mymosque", "book", "grandpa"]}, {"type": "words", "title": "أُجِيبُ عَنِ النَّصِّ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["مَتَى اسْتَيْقَظَ عُمَرُ؟", ["مُبَكِّرًا", "مُتَأَخِّرًا"]], ["أَيْنَ صَلَّى الفَجْرَ؟", ["فِي المَسْجِدِ", "فِي البَيْتِ"]], ["مَاذَا فَعَلَ بَعْدَ المَدْرَسَةِ؟", ["قَسَّمَ وَقْتَهُ", "نَامَ طَوِيلًا"]], ["الوَقْتُ أَغْلَى مِنَ ...", ["الذَّهَبِ", "التُّرَابِ"]]]}, {"type": "raw", "title": "نَصٌّ لِلْقِرَاءَةِ", "html": "<div class=\"card story\"><h3>الحَاسُوبُ 💻</h3><p>الحَاسُوبُ جِهَازٌ مُفِيدٌ، نَتَعَلَّمُ بِهِ وَنَبْحَثُ عَنِ المَعْلُومَاتِ.<br>لٰكِنَّ الجُلُوسَ أَمَامَهُ طَوِيلًا يُتْعِبُ العَيْنَيْنِ وَالظَّهْرَ.<br>لِذٰلِكَ نَسْتَعْمِلُهُ وَقْتًا قَصِيرًا، وَنُمَارِسُ الرِّيَاضَةَ، وَنَقْرَأُ الكُتُبَ.</p></div>", "arts": ["laptop", "eye", "book"]}, {"type": "words", "title": "أُجِيبُ عَنِ النَّصِّ", "hint": "ضَعْ دَائِرَةً حَوْلَ الجَوَابِ الصَّحِيحِ ⭕", "rows": [["مَا الحَاسُوبُ؟", ["جِهَازٌ مُفِيدٌ", "لُعْبَةٌ خَطِرَةٌ"]], ["مَاذَا يُتْعِبُ الجُلُوسُ الطَّوِيلُ؟", ["العَيْنَيْنِ وَالظَّهْرَ", "الشَّعْرَ"]], ["كَيْفَ نَسْتَعْمِلُ الحَاسُوبَ؟", ["وَقْتًا قَصِيرًا", "طَوَالَ اليَوْمِ"]], ["مَاذَا نَفْعَلُ أَيْضًا؟", ["نُمَارِسُ الرِّيَاضَةَ", "نَسْهَرُ"]]]}]}]};
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
.cover{--h:200;background:radial-gradient(circle at 50% 40%,#ffffff 0 20%,transparent 21%),repeating-radial-gradient(circle at 50% 40%,#dcefff 0 22px,#c3e2ff 22px 44px);text-align:center;padding:40px}
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
/* ===== Grade-5 theme: notebook paper, red margin, clip tab, sticker pictures ===== */
.bub{display:none}
.page:not(.cover):not(.cert){background:#fbfaf4 !important;
  background-image:linear-gradient(90deg,transparent calc(100% - 64px),#ff8a8a calc(100% - 64px),#ff8a8a calc(100% - 60px),transparent calc(100% - 60px)),
  repeating-linear-gradient(180deg,transparent 0 46px,hsla(var(--h),60%,70%,.35) 46px 48px) !important}
.page:not(.cover):not(.cert)::before{content:'';position:absolute;top:0;left:0;right:0;height:22px;background:repeating-linear-gradient(90deg,hsl(var(--h),70%,58%) 0 30px,hsl(calc(var(--h) + 30),70%,62%) 30px 60px)}
.page:not(.cover):not(.cert)::after{content:'';position:absolute;left:24px;top:120px;bottom:120px;width:16px;background:radial-gradient(circle,#d8d4c8 6px,transparent 7px) 0 0/16px 60px repeat-y}
.ttl{display:table;margin:40px auto 0 !important;font-size:46px !important;padding:4px 40px 8px;border-radius:16px;background:hsl(var(--h),70%,55%);transform:rotate(-1deg);box-shadow:4px 6px 0 hsl(var(--h),50%,35%)}
.hint{margin-top:16px !important;color:hsl(var(--h),55%,28%) !important}
.iname{margin-top:40px}.iname .big{display:inline-block;font-size:68px !important;padding:0 40px 6px;border-radius:16px;background:hsl(var(--h),70%,55%);transform:rotate(-1deg);box-shadow:4px 6px 0 hsl(var(--h),50%,35%)}
.iname .big.long{font-size:50px !important}
.iname .en{color:hsl(var(--h),55%,30%) !important;margin-top:12px !important}
.item .water{background:#fff;border-radius:50%/42%;margin:6px 70px 0;height:480px !important;border:10px dashed hsl(var(--h),70%,70%);box-shadow:none}
.item .ill{width:420px !important;height:420px !important}
.sent{border-radius:14px;background:hsl(var(--h),85%,94%);border:3px solid hsl(var(--h),60%,60%);box-shadow:4px 5px 0 hsl(var(--h),45%,70%)}
.chip{border-radius:14px;border:3px solid hsl(var(--h),60%,70%);box-shadow:4px 5px 0 hsl(var(--h),45%,80%)}
.trace{border-radius:14px;border:3px solid hsl(var(--h),55%,78%)}
.qrow,.rw,.wgo,.tocr,.steps div,.du,.wp,.vs,.dvs div{border-radius:14px !important}
.unit .unum{margin-top:90px}.unit .utitle{margin-top:20px}
.note{padding-top:30px}.owner{padding-top:60px}
.pno{bottom:30px}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>لغتي الجميلة ٥</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
