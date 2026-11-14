// Builds "دراساتي الإسلامية ١٢" – twelfth-grade Islamic studies – A4 portrait.
// White words get a dark outline; tracing words are solid light grey.
const fs = require('fs');
const path = require('path');
const { art } = require('./islamic12-art');

const ROOT = path.join(__dirname, '..');
const font = f => 'file://' + path.join(ROOT, '..', 'arabic-kids-book', 'fonts', f);
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AUTHOR = 'انعام الرحمن';

// [name, english, art, sentence, chip1, chip2, traceword?]
const ITEMS = [["فَضْلُ الدُّعَاءِ", "The virtue of du'a", "prayermat", "اللّٰهُ قَرِيبٌ يُجِيبُ مَنْ دَعَاهُ", "﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾ (البَقَرَةُ: ١٨٦)", "أَدْعُو اللّٰهَ فِي كُلِّ أُمُورِي"], ["آدَابُ الدُّعَاءِ", "Manners of du'a", "bigheart", "أَبْدَأُ بِحَمْدِ اللّٰهِ وَالصَّلَاةِ عَلَى النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ، وَأَدْعُو بِخُشُوعٍ", "﴿ ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً ﴾ (الأَعْرَافُ: ٥٥)", "أَتَحَرَّى أَوْقَاتَ الإِجَابَةِ، مِثْلَ مَا بَيْنَ الأَذَانِ وَالإِقَامَةِ"], ["فَضْلُ الذِّكْرِ", "The virtue of dhikr", "mosque", "ذِكْرُ اللّٰهِ يُطَمْئِنُ القَلْبَ", "﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾ (الرَّعْدُ: ٢٨)", "أُحَافِظُ عَلَى أَذْكَارِ الصَّبَاحِ وَالمَسَاءِ"], ["القَرْضُ الحَسَنُ", "The goodly loan", "charitybox", "أَنْ أُعْطِيَ المُحْتَاجَ مَالًا يَرُدُّهُ إِلَيَّ دُونَ زِيَادَةٍ", "«مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللّٰهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ القِيَامَةِ» رَوَاهُ مُسْلِمٌ", "أُقْرِضُ المُحْتَاجَ، وَأُيَسِّرُ عَلَيْهِ"], ["كِتَابَةُ الدَّيْنِ وَسَدَادُهُ", "Writing & repaying debts", "notebook", "أَمَرَ اللّٰهُ بِكِتَابَةِ الدَّيْنِ، وَيَجِبُ رَدُّهُ فِي وَقْتِهِ", "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ ﴾ (البَقَرَةُ: ٢٨٢)", "أَرُدُّ الدَّيْنَ فِي وَقْتِهِ وَلَا أُمَاطِلُ"], ["تَحْرِيمُ الرِّبَا", "Riba is forbidden", "coins", "الرِّبَا زِيَادَةٌ مَشْرُوطَةٌ عَلَى القَرْضِ، وَهُوَ مِنْ كَبَائِرِ الذُّنُوبِ", "﴿ وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا ﴾ (البَقَرَةُ: ٢٧٥)", "أَبْتَعِدُ عَنِ المُعَامَلَاتِ الرِّبَوِيَّةِ"], ["عَامُ الوُفُودِ", "The Year of Delegations", "camel_", "جَاءَتْ وُفُودُ القَبَائِلِ إِلَى المَدِينَةِ تُعْلِنُ إِسْلَامَهَا بَيْنَ يَدَيِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "السَّنَةُ التَّاسِعَةُ لِلْهِجْرَةِ", "﴿ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴾ (النَّصْرُ: ٢)"], ["آخِرُ وَصَايَاهُ", "His last advice", "prayermat", "كَانَ مِنْ آخِرِ مَا أَوْصَى بِهِ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ: «الصَّلَاةَ الصَّلَاةَ، وَمَا مَلَكَتْ أَيْمَانُكُمْ»", "رَوَاهُ أَبُو دَاوُدَ وَابْنُ مَاجَهْ", "أُحَافِظُ عَلَى الصَّلَاةِ، وَأُحْسِنُ إِلَى مَنْ يَعْمَلُ عِنْدَنَا"], ["وَفَاةُ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "The Prophet's death", "mymosque", "تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ فِي بَيْتِ عَائِشَةَ رَضِيَ اللّٰهُ عَنْهَا، وَعُمُرُهُ ثَلَاثٌ وَسِتُّونَ سَنَةً", "السَّنَةُ الحَادِيَةَ عَشْرَةَ لِلْهِجْرَةِ", "قَالَ أَبُو بَكْرٍ: «مَنْ كَانَ يَعْبُدُ اللّٰهَ فَإِنَّ اللّٰهَ حَيٌّ لَا يَمُوتُ»"], ["التَّيْسِيرُ", "Making things easy", "students", "«يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا»", "مُتَّفَقٌ عَلَيْهِ", "أُيَسِّرُ عَلَى النَّاسِ، وَأُبَشِّرُهُمْ بِالخَيْرِ"], ["الحِرْصُ عَلَى النَّافِعِ", "Striving for what benefits", "medal", "«احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللّٰهِ، وَلَا تَعْجِزْ»", "رَوَاهُ مُسْلِمٌ", "أَجْتَهِدُ فِيمَا يَنْفَعُنِي، وَأَتَوَكَّلُ عَلَى اللّٰهِ"], ["البِرُّ", "Righteousness", "bigheart", "«البِرُّ حُسْنُ الخُلُقِ»", "رَوَاهُ مُسْلِمٌ", "أُحْسِنُ خُلُقِي مَعَ النَّاسِ"], ["التَّفَاؤُلُ", "Optimism", "f_happy", "كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ يُحِبُّ الفَأْلَ الحَسَنَ", "«وَيُعْجِبُنِي الفَأْلُ الصَّالِحُ: الكَلِمَةُ الحَسَنَةُ» مُتَّفَقٌ عَلَيْهِ", "أَقُولُ الكَلِمَةَ الطَّيِّبَةَ، وَأَنْتَظِرُ الخَيْرَ"], ["حُسْنُ الظَّنِّ", "Thinking well of others", "bigheart", "لَا أَتَّهِمُ النَّاسَ بِلَا دَلِيلٍ", "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ ﴾ (الحُجُرَاتُ: ١٢)", "أَلْتَمِسُ العُذْرَ لِإِخْوَانِي"], ["الشَّجَاعَةُ", "Courage", "lion", "كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَشْجَعَ النَّاسِ", "«كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَحْسَنَ النَّاسِ، وَأَجْوَدَ النَّاسِ، وَأَشْجَعَ النَّاسِ» مُتَّفَقٌ عَلَيْهِ", "أَقُولُ الحَقَّ بِأَدَبٍ، وَلَا أَخَافُ إِلَّا اللّٰهَ"], ["الرُّجُوعُ إِلَى الحَقِّ", "Returning to the truth", "teacher", "عِنْدَ الاخْتِلَافِ نَرْجِعُ إِلَى القُرْآنِ وَالسُّنَّةِ", "﴿ فَإِن تَنَازَعْتُمْ فِي شَيْءٍ فَرُدُّوهُ إِلَى اللَّهِ وَالرَّسُولِ ﴾ (النِّسَاءُ: ٥٩)", "أَقْبَلُ الحَقَّ وَلَوْ خَالَفَ رَأْيِي"], ["الكَلِمَةُ الحُسْنَى", "The best words", "bigheart", "أَخْتَارُ أَحْسَنَ الكَلَامِ عِنْدَ الحِوَارِ", "﴿ وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ ﴾ (الإِسْرَاءُ: ٥٣)", "لَا أَسْخَرُ وَلَا أَرْفَعُ صَوْتِي"], ["تَرْكُ الجِدَالِ", "Leaving arguments", "g_friend", "أَتْرُكُ الجِدَالَ الَّذِي لَا فَائِدَةَ فِيهِ", "«أَنَا زَعِيمٌ بِبَيْتٍ فِي رَبَضِ الجَنَّةِ لِمَنْ تَرَكَ المِرَاءَ وَإِنْ كَانَ مُحِقًّا» رَوَاهُ أَبُو دَاوُدَ", "أُنْهِي النِّقَاشَ بِهُدُوءٍ إِذَا صَارَ جِدَالًا"]];
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

const C = {"dir": "islamic12-book", "prefix": "Islamiyyah-12", "title": "دراساتي الإسلامية ١٢", "artmod": "islamic12-art", "header": "Builds \"دراساتي الإسلامية ١٢\" – twelfth-grade Islamic studies – A4 portrait.", "grade": "Grade 12", "theme": "12", "layout": "g12", "cover": "--h:175;background:#0f5a52", "h": 175, "t1": "دِرَاسَاتِي الإِسْلَامِيَّةُ", "t2": "الجُزْءُ الثَّانِيَ عَشَرَ", "s1": "#063a35", "s2": "#7a4a00", "csub": "أَتَعَلَّمُ دِينِي وَأَعْمَلُ بِهِ", "cen": "My Islamic Studies 12", "coverTop": ["mosque", "rehal", "lantern"], "coverBot": ["kaaba", "prayermat", "bigbook", "mymosque"], "ownerArt": "rehal", "ownerMini": ["mosque", "lantern", "prayermat"], "noteP": "هٰذَا الكِتَابُ يُعَلِّمُ طِفْلَكُمْ: الدُّعَاءَ وَالذِّكْرَ، وَأَحْكَامَ القَرْضِ وَالدَّيْنِ وَالرِّبَا، وَأَحْدَاثًا مِنْ آخِرِ السِّيرَةِ النَّبَوِيَّةِ، وَأَحَادِيثَ نَبَوِيَّةً، وَالأَخْلَاقَ، وَآدَابَ الاخْتِلَافِ، وَحِفْظَ سُورَةِ النَّازِعَاتِ 🕌", "noteLi": ["رَاجِعُوا مَعَهُ حِفْظَ السُّورَةِ كُلَّ يَوْمٍ.", "احْفَظُوا مَعَهُ أَذْكَارَ الصَّبَاحِ وَالمَسَاءِ.", "نَاقِشُوا مَعَهُ كَيْفَ يُحَاوِرُ مَنْ يُخَالِفُهُ بِأَدَبٍ.", "فِي التَّدْرِيبَاتِ يَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ."], "noteMini": ["mosque", "rehal", "prayermat"], "certP": "لِأَنَّهُ أَتَمَّ كِتَابَ «دِرَاسَاتِي الإِسْلَامِيَّةُ ١٢» بِنَجَاحٍ", "certArts": ["mosque", "medal", "rehal"], "blurb": "كِتَابٌ شَامِلٌ بِتَصْمِيمٍ جَدِيدٍ وَرُسُومَاتٍ ثُلَاثِيَّةِ الأَبْعَادِ لِتَعْلِيمِ الدِّرَاسَاتِ الإِسْلَامِيَّةِ لِلطُّلَّابِ فِي سَنَتِهِمُ الدِّرَاسِيَّةِ الثَّانِيَةَ عَشْرَةَ.", "blurbLi": ["الدُّعَاءُ وَالذِّكْرُ، وَالقَرْضُ وَالدَّيْنُ وَالرِّبَا", "مِنْ آخِرِ السِّيرَةِ النَّبَوِيَّةِ، وَأَحَادِيثُ نَبَوِيَّةٌ", "الأَخْلَاقُ، وَآدَابُ الاخْتِلَافِ", "سُورَةُ النَّازِعَاتِ، وَشَهَادَةٌ"], "en2": "A complete Islamic studies book with a brand-new design – part 12", "backArts": ["kaaba", "mosque", "rehal", "lantern"], "extraCss": ".surah{position:relative;margin-top:24px;background:#fffdf5;border-radius:34px;padding:18px 28px;border:6px solid #e8c56a;box-shadow:0 8px 0 #c9a040}.surah h3{text-align:center;font-size:46px;font-weight:800;color:#1f7a50;line-height:1.7}.surah .bas{text-align:center;font-size:38px;font-weight:800;color:#8a5a00;line-height:2}.surah .ay{font-size:42px;font-weight:700;line-height:2.3;color:#2b2340;border-bottom:2px dashed #f0dca0;padding:2px 0}.surah .ay i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#1f9a60;color:#fff;font-size:22px;font-weight:800;vertical-align:middle;text-shadow:0 0 2px #0a3a20,0 0 2px #0a3a20}.duas{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:22px}.du{display:flex;align-items:center;gap:16px;background:#fff;border-radius:30px;padding:14px 20px;box-shadow:0 7px 0 hsl(var(--h),50%,74%)}.du svg{width:130px;height:130px;flex:none}.du small{display:block;font-size:24px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1.6}.du b{display:block;font-size:31px;font-weight:800;line-height:1.9;color:#2b2340}.du em{display:inline-block;font-style:normal;font-size:19px;font-weight:800;color:#fff;background:hsl(var(--h),50%,42%);border-radius:14px;padding:2px 14px;margin-top:4px;line-height:1.6}.surah.fat{margin-top:14px;padding:12px 24px}.surah.fat .ay{font-size:36px;line-height:2.05}.steps{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:12px}.steps div{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:8px 18px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}\n.steps i{font-style:normal;flex:none;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.steps b{font-size:29px;font-weight:800;line-height:1.7;color:#2b2340}\n.facts{position:relative;margin-top:24px;background:#fffdf5;border-radius:34px;padding:18px 28px;border:6px solid #8fd6a8;box-shadow:0 8px 0 #5fb37e}.facts h3{text-align:center;font-size:34px;font-weight:800;color:#1f7a50;line-height:1.7;margin-bottom:8px}\n.facts div{display:flex;align-items:center;gap:16px;margin-top:12px}.facts span{flex:none;width:210px;text-align:center;font-size:27px;font-weight:800;color:#fff;background:#1f9a60;border-radius:16px;line-height:1.7;text-shadow:0 0 3px #0a3a20,0 0 3px #0a3a20}.facts b{font-size:32px;font-weight:800;line-height:1.7;color:#2b2340}.steps b{font-size:33px}.steps{gap:18px}.steps div{padding:12px 20px}.surah.sm8 .ay{font-size:31px;line-height:1.85}.steps b{font-size:30px}.chip{height:auto !important;min-height:104px;padding:10px 18px}.chip b{font-size:24px !important;line-height:1.6}.item .water{height:520px}.item .ill{width:470px;height:470px}.surah.sm11 .ay{font-size:29px;line-height:1.7;padding:0}.surah.sm11 h3{font-size:36px}.surah.sm11 .bas{font-size:30px}.qrow{margin-top:20px !important;padding:12px 16px !important}.qw{min-width:300px !important;max-width:340px;font-size:28px !important}.qo{font-size:28px !important}.steps b{font-size:30px}.chip{height:auto !important;min-height:104px;padding:10px 18px}.chip b{font-size:23px !important;line-height:1.6}.surah.fat{margin-top:6px}.surah .cols{column-gap:34px}.surah.two .cols{columns:2;column-rule:2px dashed #f0dca0}.surah.two .ay{font-size:27px;line-height:1.8;break-inside:avoid;padding:3px 0}.surah.sm15 .ay{font-size:30px;line-height:1.8}.surah .ay{break-inside:avoid}.surah .nw{white-space:nowrap}.surah.tight .ay{font-size:24px !important;line-height:1.6 !important;padding:1px 0 !important}.surah.tight h3{font-size:36px}.surah.tight .bas{font-size:30px;line-height:1.7}.surah.tight .ay{font-size:23px !important;line-height:1.55 !important}.surah.xt .ay{font-size:21px !important;line-height:1.5 !important}.surah.xt h3{font-size:32px}.surah.one .ay{font-size:27px !important;line-height:1.9 !important}.surah.one.big .ay{font-size:36px !important;line-height:2.4 !important}.surah.one .cols{columns:1}", "units": [{"title": "الدُّعَاءُ وَالذِّكْرُ", "en": "Supplication & Remembrance", "icon": "prayermat", "arts": ["prayermat", "bigheart", "mosque"], "intro": "الدُّعَاءُ وَالذِّكْرُ مِنْ أَعْظَمِ العِبَادَاتِ، بِهِمَا يَتَّصِلُ المُسْلِمُ بِرَبِّهِ، وَيَطْمَئِنُّ قَلْبُهُ.", "chip1": ["📖", "الدَّلِيلُ"], "chip2": ["💡", "أَعْمَلُ"], "items": [["فَضْلُ الدُّعَاءِ", "The virtue of du'a", "prayermat", "اللّٰهُ قَرِيبٌ يُجِيبُ مَنْ دَعَاهُ", "﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾ (البَقَرَةُ: ١٨٦)", "أَدْعُو اللّٰهَ فِي كُلِّ أُمُورِي"], ["آدَابُ الدُّعَاءِ", "Manners of du'a", "bigheart", "أَبْدَأُ بِحَمْدِ اللّٰهِ وَالصَّلَاةِ عَلَى النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ، وَأَدْعُو بِخُشُوعٍ", "﴿ ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً ﴾ (الأَعْرَافُ: ٥٥)", "أَتَحَرَّى أَوْقَاتَ الإِجَابَةِ، مِثْلَ مَا بَيْنَ الأَذَانِ وَالإِقَامَةِ"], ["فَضْلُ الذِّكْرِ", "The virtue of dhikr", "mosque", "ذِكْرُ اللّٰهِ يُطَمْئِنُ القَلْبَ", "﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾ (الرَّعْدُ: ٢٨)", "أُحَافِظُ عَلَى أَذْكَارِ الصَّبَاحِ وَالمَسَاءِ"]], "acts": [{"type": "words", "title": "أَخْتَارُ الإِجَابَةَ", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ ... ﴾", ["الْقُلُوبُ", "الْعُقُولُ"]], ["مِنْ أَوْقَاتِ إِجَابَةِ الدُّعَاءِ ...", ["وَقْتُ اللَّعِبِ", "مَا بَيْنَ الأَذَانِ وَالإِقَامَةِ"]], ["أَبْدَأُ الدُّعَاءَ بِـ ...", ["حَمْدِ اللّٰهِ وَالثَّنَاءِ عَلَيْهِ", "ذِكْرِ حَاجَتِي فَوْرًا"]], ["﴿ ادْعُوا رَبَّكُمْ تَضَرُّعًا وَ... ﴾", ["جَهْرًا", "خُفْيَةً"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["اللّٰهُ قَرِيبٌ يُجِيبُ دُعَاءَ عِبَادِهِ", "الذِّكْرُ يَكُونُ فِي المَسْجِدِ فَقَطْ", "مِنْ آدَابِ الدُّعَاءِ الخُشُوعُ", "ذِكْرُ اللّٰهِ يُطَمْئِنُ القُلُوبَ", "لَا يَجُوزُ الدُّعَاءُ إِلَّا بِاللُّغَةِ العَرَبِيَّةِ"]}]}, {"title": "القَرْضُ وَالدَّيْنُ وَالرِّبَا", "en": "Loans, Debts & Riba", "icon": "coins", "arts": ["coins", "notebook", "charitybox"], "intro": "شَرَعَ الإِسْلَامُ القَرْضَ الحَسَنَ لِلتَّعَاوُنِ بَيْنَ النَّاسِ، وَأَمَرَ بِكِتَابَةِ الدَّيْنِ، وَحَرَّمَ الرِّبَا.", "chip1": ["📖", "الدَّلِيلُ"], "chip2": ["💡", "أَعْمَلُ"], "items": [["القَرْضُ الحَسَنُ", "The goodly loan", "charitybox", "أَنْ أُعْطِيَ المُحْتَاجَ مَالًا يَرُدُّهُ إِلَيَّ دُونَ زِيَادَةٍ", "«مَنْ نَفَّسَ عَنْ مُؤْمِنٍ كُرْبَةً مِنْ كُرَبِ الدُّنْيَا، نَفَّسَ اللّٰهُ عَنْهُ كُرْبَةً مِنْ كُرَبِ يَوْمِ القِيَامَةِ» رَوَاهُ مُسْلِمٌ", "أُقْرِضُ المُحْتَاجَ، وَأُيَسِّرُ عَلَيْهِ"], ["كِتَابَةُ الدَّيْنِ وَسَدَادُهُ", "Writing & repaying debts", "notebook", "أَمَرَ اللّٰهُ بِكِتَابَةِ الدَّيْنِ، وَيَجِبُ رَدُّهُ فِي وَقْتِهِ", "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ ﴾ (البَقَرَةُ: ٢٨٢)", "أَرُدُّ الدَّيْنَ فِي وَقْتِهِ وَلَا أُمَاطِلُ"], ["تَحْرِيمُ الرِّبَا", "Riba is forbidden", "coins", "الرِّبَا زِيَادَةٌ مَشْرُوطَةٌ عَلَى القَرْضِ، وَهُوَ مِنْ كَبَائِرِ الذُّنُوبِ", "﴿ وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا ﴾ (البَقَرَةُ: ٢٧٥)", "أَبْتَعِدُ عَنِ المُعَامَلَاتِ الرِّبَوِيَّةِ"]], "acts": [{"type": "words", "title": "مَا حُكْمُ المُعَامَلَةِ؟", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["أَقْرَضْتُ صَدِيقِي ١٠٠ رِيَالٍ، فَرَدَّهَا ١٠٠ رِيَالٍ", ["جَائِزَةٌ", "مُحَرَّمَةٌ"]], ["أَقْرَضْتُهُ ١٠٠ رِيَالٍ بِشَرْطِ أَنْ يَرُدَّهَا ١٢٠ رِيَالًا", ["جَائِزَةٌ", "مُحَرَّمَةٌ"]], ["كَتَبْنَا الدَّيْنَ، وَأَشْهَدْنَا عَلَيْهِ", ["جَائِزَةٌ", "مُحَرَّمَةٌ"]], ["تَأْخِيرُ سَدَادِ الدَّيْنِ مَعَ القُدْرَةِ عَلَيْهِ", ["جَائِزٌ", "مُحَرَّمٌ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["القَرْضُ الحَسَنُ فِيهِ أَجْرٌ عَظِيمٌ", "الرِّبَا مِنْ كَبَائِرِ الذُّنُوبِ", "أَمَرَ اللّٰهُ بِكِتَابَةِ الدَّيْنِ", "يَجُوزُ اشْتِرَاطُ زِيَادَةٍ عَلَى القَرْضِ", "يُؤَخِّرُ المُسْلِمُ سَدَادَ الدَّيْنِ وَهُوَ قَادِرٌ"]}]}, {"title": "مِنْ سِيرَةِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "en": "From the Prophet's Biography", "icon": "mymosque", "arts": ["mymosque", "camel_", "prayermat"], "intro": "أَتَعَرَّفُ عَلَى أَحْدَاثٍ مِنْ آخِرِ حَيَاةِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ: عَامِ الوُفُودِ، وَآخِرِ وَصَايَاهُ، وَوَفَاتِهِ.", "chip1": ["📅", "مَتَى؟"], "chip2": ["💡", "الدَّرْسُ"], "items": [["عَامُ الوُفُودِ", "The Year of Delegations", "camel_", "جَاءَتْ وُفُودُ القَبَائِلِ إِلَى المَدِينَةِ تُعْلِنُ إِسْلَامَهَا بَيْنَ يَدَيِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "السَّنَةُ التَّاسِعَةُ لِلْهِجْرَةِ", "﴿ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴾ (النَّصْرُ: ٢)"], ["آخِرُ وَصَايَاهُ", "His last advice", "prayermat", "كَانَ مِنْ آخِرِ مَا أَوْصَى بِهِ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ: «الصَّلَاةَ الصَّلَاةَ، وَمَا مَلَكَتْ أَيْمَانُكُمْ»", "رَوَاهُ أَبُو دَاوُدَ وَابْنُ مَاجَهْ", "أُحَافِظُ عَلَى الصَّلَاةِ، وَأُحْسِنُ إِلَى مَنْ يَعْمَلُ عِنْدَنَا"], ["وَفَاةُ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "The Prophet's death", "mymosque", "تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ فِي بَيْتِ عَائِشَةَ رَضِيَ اللّٰهُ عَنْهَا، وَعُمُرُهُ ثَلَاثٌ وَسِتُّونَ سَنَةً", "السَّنَةُ الحَادِيَةَ عَشْرَةَ لِلْهِجْرَةِ", "قَالَ أَبُو بَكْرٍ: «مَنْ كَانَ يَعْبُدُ اللّٰهَ فَإِنَّ اللّٰهَ حَيٌّ لَا يَمُوتُ»"]], "acts": [{"type": "words", "title": "أَخْتَارُ الإِجَابَةَ", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["كَانَ عَامُ الوُفُودِ فِي السَّنَةِ ... لِلْهِجْرَةِ", ["التَّاسِعَةِ", "الأُولَى"]], ["مِنْ آخِرِ وَصَايَا النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ ...", ["التِّجَارَةُ", "الصَّلَاةُ"]], ["تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ وَعُمُرُهُ ... سَنَةً", ["سِتُّونَ", "ثَلَاثٌ وَسِتُّونَ"]], ["تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ فِي بَيْتِ ...", ["عَائِشَةَ رَضِيَ اللّٰهُ عَنْهَا", "أَبِي بَكْرٍ رَضِيَ اللّٰهُ عَنْهُ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["دَخَلَ النَّاسُ فِي دِينِ اللّٰهِ أَفْوَاجًا فِي عَامِ الوُفُودِ", "أَوْصَى النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ بِالصَّلَاةِ قَبْلَ وَفَاتِهِ", "تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ فِي مَكَّةَ", "تُوُفِّيَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ فِي السَّنَةِ الحَادِيَةَ عَشْرَةَ لِلْهِجْرَةِ", "ثَبَّتَ أَبُو بَكْرٍ رَضِيَ اللّٰهُ عَنْهُ النَّاسَ عِنْدَ وَفَاةِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ"]}]}, {"title": "مِنْ هَدْيِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ", "en": "From the Prophet's Guidance", "icon": "bigheart", "arts": ["bigheart", "students", "medal"], "intro": "أَحْفَظُ أَحَادِيثَ مِنْ هَدْيِ النَّبِيِّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ، وَأَعْمَلُ بِهَا.", "chip1": ["📖", "المَصْدَرُ"], "chip2": ["💡", "أَعْمَلُ"], "items": [["التَّيْسِيرُ", "Making things easy", "students", "«يَسِّرُوا وَلَا تُعَسِّرُوا، وَبَشِّرُوا وَلَا تُنَفِّرُوا»", "مُتَّفَقٌ عَلَيْهِ", "أُيَسِّرُ عَلَى النَّاسِ، وَأُبَشِّرُهُمْ بِالخَيْرِ"], ["الحِرْصُ عَلَى النَّافِعِ", "Striving for what benefits", "medal", "«احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللّٰهِ، وَلَا تَعْجِزْ»", "رَوَاهُ مُسْلِمٌ", "أَجْتَهِدُ فِيمَا يَنْفَعُنِي، وَأَتَوَكَّلُ عَلَى اللّٰهِ"], ["البِرُّ", "Righteousness", "bigheart", "«البِرُّ حُسْنُ الخُلُقِ»", "رَوَاهُ مُسْلِمٌ", "أُحْسِنُ خُلُقِي مَعَ النَّاسِ"]], "acts": [{"type": "words", "title": "أُكْمِلُ الحَدِيثَ", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["«يَسِّرُوا وَلَا ...»", ["تُعَسِّرُوا", "تَتَكَاسَلُوا"]], ["«وَبَشِّرُوا وَلَا ...»", ["تَغْضَبُوا", "تُنَفِّرُوا"]], ["«احْرِصْ عَلَى مَا ...»", ["يَنْفَعُكَ", "تُحِبُّهُ"]], ["«البِرُّ حُسْنُ ...»", ["الخُلُقِ", "الصَّوْتِ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["المُسْلِمُ يُيَسِّرُ عَلَى النَّاسِ", "العَجْزُ وَالكَسَلُ مِنْ صِفَاتِ المُؤْمِنِ", "البِرُّ حُسْنُ الخُلُقِ", "أَسْتَعِينُ بِاللّٰهِ فِي كُلِّ أَعْمَالِي", "تَنْفِيرُ النَّاسِ مِنَ الدِّينِ عَمَلٌ حَسَنٌ"]}]}, {"title": "أَخْلَاقِي", "en": "My Good Character", "icon": "medal", "arts": ["medal", "f_happy", "lion"], "intro": "المُسْلِمُ مُتَفَائِلٌ، يُحْسِنُ الظَّنَّ بِالنَّاسِ، شُجَاعٌ فِي الحَقِّ.", "chip1": ["📖", "الدَّلِيلُ"], "chip2": ["💡", "أَعْمَلُ"], "items": [["التَّفَاؤُلُ", "Optimism", "f_happy", "كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ يُحِبُّ الفَأْلَ الحَسَنَ", "«وَيُعْجِبُنِي الفَأْلُ الصَّالِحُ: الكَلِمَةُ الحَسَنَةُ» مُتَّفَقٌ عَلَيْهِ", "أَقُولُ الكَلِمَةَ الطَّيِّبَةَ، وَأَنْتَظِرُ الخَيْرَ"], ["حُسْنُ الظَّنِّ", "Thinking well of others", "bigheart", "لَا أَتَّهِمُ النَّاسَ بِلَا دَلِيلٍ", "﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ ﴾ (الحُجُرَاتُ: ١٢)", "أَلْتَمِسُ العُذْرَ لِإِخْوَانِي"], ["الشَّجَاعَةُ", "Courage", "lion", "كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَشْجَعَ النَّاسِ", "«كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَحْسَنَ النَّاسِ، وَأَجْوَدَ النَّاسِ، وَأَشْجَعَ النَّاسِ» مُتَّفَقٌ عَلَيْهِ", "أَقُولُ الحَقَّ بِأَدَبٍ، وَلَا أَخَافُ إِلَّا اللّٰهَ"]], "acts": [{"type": "words", "title": "مَاذَا أَفْعَلُ؟", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["تَأَخَّرَ صَدِيقِي عَنْ مَوْعِدِنَا:", ["أَظُنُّ أَنَّهُ تَعَمَّدَ ذٰلِكَ", "أَلْتَمِسُ لَهُ عُذْرًا"]], ["رَسَبْتُ فِي اخْتِبَارٍ:", ["أَتَفَاءَلُ وَأَجْتَهِدُ أَكْثَرَ", "أَيْأَسُ وَأَتْرُكُ الدِّرَاسَةَ"]], ["رَأَيْتُ زُمَلَائِي يَظْلِمُونَ طَالِبًا صَغِيرًا:", ["أُدَافِعُ عَنْهُ بِأَدَبٍ", "أَسْكُتُ وَأَضْحَكُ مَعَهُمْ"]], ["سَمِعْتُ كَلَامًا سَيِّئًا عَنْ زَمِيلِي:", ["أُصَدِّقُهُ فَوْرًا", "لَا أُصَدِّقُهُ حَتَّى أَتَأَكَّدَ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["الكَلِمَةُ الحَسَنَةُ مِنَ الفَأْلِ الصَّالِحِ", "أَمَرَنَا اللّٰهُ بِاجْتِنَابِ كَثِيرٍ مِنَ الظَّنِّ", "كَانَ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ أَشْجَعَ النَّاسِ", "المُتَفَائِلُ يَيْأَسُ بِسُرْعَةٍ", "الشُّجَاعُ يَقُولُ الحَقَّ بِأَدَبٍ"]}]}, {"title": "آدَابُ الاخْتِلَافِ", "en": "Manners of Disagreement", "icon": "g_friend", "arts": ["g_friend", "teacher", "bigheart"], "intro": "يَخْتَلِفُ النَّاسُ فِي آرَائِهِمْ، وَالمُسْلِمُ يَخْتَلِفُ بِأَدَبٍ وَاحْتِرَامٍ، وَيَطْلُبُ الحَقَّ.", "chip1": ["📖", "الدَّلِيلُ"], "chip2": ["💡", "أَعْمَلُ"], "items": [["الرُّجُوعُ إِلَى الحَقِّ", "Returning to the truth", "teacher", "عِنْدَ الاخْتِلَافِ نَرْجِعُ إِلَى القُرْآنِ وَالسُّنَّةِ", "﴿ فَإِن تَنَازَعْتُمْ فِي شَيْءٍ فَرُدُّوهُ إِلَى اللَّهِ وَالرَّسُولِ ﴾ (النِّسَاءُ: ٥٩)", "أَقْبَلُ الحَقَّ وَلَوْ خَالَفَ رَأْيِي"], ["الكَلِمَةُ الحُسْنَى", "The best words", "bigheart", "أَخْتَارُ أَحْسَنَ الكَلَامِ عِنْدَ الحِوَارِ", "﴿ وَقُل لِّعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ ﴾ (الإِسْرَاءُ: ٥٣)", "لَا أَسْخَرُ وَلَا أَرْفَعُ صَوْتِي"], ["تَرْكُ الجِدَالِ", "Leaving arguments", "g_friend", "أَتْرُكُ الجِدَالَ الَّذِي لَا فَائِدَةَ فِيهِ", "«أَنَا زَعِيمٌ بِبَيْتٍ فِي رَبَضِ الجَنَّةِ لِمَنْ تَرَكَ المِرَاءَ وَإِنْ كَانَ مُحِقًّا» رَوَاهُ أَبُو دَاوُدَ", "أُنْهِي النِّقَاشَ بِهُدُوءٍ إِذَا صَارَ جِدَالًا"]], "acts": [{"type": "words", "title": "مَاذَا أَفْعَلُ؟", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["خَالَفَنِي زَمِيلِي فِي رَأْيٍ:", ["أَسْمَعُهُ وَأُحَاوِرُهُ بِأَدَبٍ", "أَسْخَرُ مِنْ رَأْيِهِ"]], ["تَبَيَّنَ لِي أَنَّ رَأْيَ زَمِيلِي هُوَ الصَّوَابُ:", ["أُصِرُّ عَلَى رَأْيِي", "أَرْجِعُ إِلَى الحَقِّ"]], ["تَحَوَّلَ النِّقَاشُ إِلَى صُرَاخٍ وَجِدَالٍ:", ["أَرْفَعُ صَوْتِي أَكْثَرَ", "أُنْهِيهِ بِهُدُوءٍ"]], ["اخْتَلَفْنَا فِي مَسْأَلَةٍ شَرْعِيَّةٍ:", ["نَرْجِعُ إِلَى القُرْآنِ وَالسُّنَّةِ وَأَهْلِ العِلْمِ", "نَتْرُكُ كُلَّ وَاحِدٍ يَقُولُ مَا يَشَاءُ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["الاخْتِلَافُ فِي الرَّأْيِ لَا يُفْسِدُ الأُخُوَّةَ إِذَا كَانَ بِأَدَبٍ", "عِنْدَ التَّنَازُعِ نَرُدُّ الأَمْرَ إِلَى اللّٰهِ وَالرَّسُولِ", "تَرْكُ الجِدَالِ ضَعْفٌ", "أَخْتَارُ أَحْسَنَ الكَلَامِ عِنْدَ الحِوَارِ", "السُّخْرِيَةُ مِنَ المُخَالِفِ مِنَ الأَدَبِ"]}]}, {"title": "القُرْآنُ الكَرِيمُ", "en": "The Holy Quran", "icon": "rehal", "arts": ["rehal", "bigbook"], "intro": "أَحْفَظُ سُورَةَ النَّازِعَاتِ، وَأَتَعَلَّمُ مَعَانِيَ بَعْضِ كَلِمَاتِهَا، وَأَفْهَمُ مَوْضُوعَاتِهَا.", "acts": [{"type": "raw", "title": "أَحْفَظُ السُّورَةَ", "html": "<div class=\"surah fat two\"><h3>سُورَةُ النَّازِعَاتِ (١)</h3><p class=\"bas\">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><div class=\"cols\"><p class=\"ay\">وَالنَّازِعَاتِ <span class=\"nw\">غَرْقًا&nbsp;<i>١</i></span></p><p class=\"ay\">وَالنَّاشِطَاتِ <span class=\"nw\">نَشْطًا&nbsp;<i>٢</i></span></p><p class=\"ay\">وَالسَّابِحَاتِ <span class=\"nw\">سَبْحًا&nbsp;<i>٣</i></span></p><p class=\"ay\">فَالسَّابِقَاتِ <span class=\"nw\">سَبْقًا&nbsp;<i>٤</i></span></p><p class=\"ay\">فَالْمُدَبِّرَاتِ <span class=\"nw\">أَمْرًا&nbsp;<i>٥</i></span></p><p class=\"ay\">يَوْمَ تَرْجُفُ <span class=\"nw\">الرَّاجِفَةُ&nbsp;<i>٦</i></span></p><p class=\"ay\">تَتْبَعُهَا <span class=\"nw\">الرَّادِفَةُ&nbsp;<i>٧</i></span></p><p class=\"ay\">قُلُوبٌ يَوْمَئِذٍ <span class=\"nw\">وَاجِفَةٌ&nbsp;<i>٨</i></span></p><p class=\"ay\">أَبْصَارُهَا <span class=\"nw\">خَاشِعَةٌ&nbsp;<i>٩</i></span></p><p class=\"ay\">يَقُولُونَ أَإِنَّا لَمَرْدُودُونَ فِي <span class=\"nw\">الْحَافِرَةِ&nbsp;<i>١٠</i></span></p><p class=\"ay\">أَإِذَا كُنَّا عِظَامًا <span class=\"nw\">نَّخِرَةً&nbsp;<i>١١</i></span></p><p class=\"ay\">قَالُوا تِلْكَ إِذًا كَرَّةٌ <span class=\"nw\">خَاسِرَةٌ&nbsp;<i>١٢</i></span></p><p class=\"ay\">فَإِنَّمَا هِيَ زَجْرَةٌ <span class=\"nw\">وَاحِدَةٌ&nbsp;<i>١٣</i></span></p><p class=\"ay\">فَإِذَا هُم <span class=\"nw\">بِالسَّاهِرَةِ&nbsp;<i>١٤</i></span></p><p class=\"ay\">هَلْ أَتَاكَ حَدِيثُ <span class=\"nw\">مُوسَىٰ&nbsp;<i>١٥</i></span></p><p class=\"ay\">إِذْ نَادَاهُ رَبُّهُ بِالْوَادِ الْمُقَدَّسِ <span class=\"nw\">طُوًى&nbsp;<i>١٦</i></span></p><p class=\"ay\">اذْهَبْ إِلَىٰ فِرْعَوْنَ إِنَّهُ <span class=\"nw\">طَغَىٰ&nbsp;<i>١٧</i></span></p><p class=\"ay\">فَقُلْ هَل لَّكَ إِلَىٰ أَن <span class=\"nw\">تَزَكَّىٰ&nbsp;<i>١٨</i></span></p><p class=\"ay\">وَأَهْدِيَكَ إِلَىٰ رَبِّكَ <span class=\"nw\">فَتَخْشَىٰ&nbsp;<i>١٩</i></span></p><p class=\"ay\">فَأَرَاهُ الْآيَةَ <span class=\"nw\">الْكُبْرَىٰ&nbsp;<i>٢٠</i></span></p><p class=\"ay\">فَكَذَّبَ <span class=\"nw\">وَعَصَىٰ&nbsp;<i>٢١</i></span></p><p class=\"ay\">ثُمَّ أَدْبَرَ <span class=\"nw\">يَسْعَىٰ&nbsp;<i>٢٢</i></span></p><p class=\"ay\">فَحَشَرَ <span class=\"nw\">فَنَادَىٰ&nbsp;<i>٢٣</i></span></p></div></div>"}, {"type": "raw", "title": "أَحْفَظُ السُّورَةَ", "html": "<div class=\"surah fat two tight\"><h3>سُورَةُ النَّازِعَاتِ (٢)</h3><div class=\"cols\"><p class=\"ay\">فَقَالَ أَنَا رَبُّكُمُ <span class=\"nw\">الْأَعْلَىٰ&nbsp;<i>٢٤</i></span></p><p class=\"ay\">فَأَخَذَهُ اللَّهُ نَكَالَ الْآخِرَةِ <span class=\"nw\">وَالْأُولَىٰ&nbsp;<i>٢٥</i></span></p><p class=\"ay\">إِنَّ فِي ذَٰلِكَ لَعِبْرَةً لِّمَن <span class=\"nw\">يَخْشَىٰ&nbsp;<i>٢٦</i></span></p><p class=\"ay\">أَأَنتُمْ أَشَدُّ خَلْقًا أَمِ السَّمَاءُ <span class=\"nw\">بَنَاهَا&nbsp;<i>٢٧</i></span></p><p class=\"ay\">رَفَعَ سَمْكَهَا <span class=\"nw\">فَسَوَّاهَا&nbsp;<i>٢٨</i></span></p><p class=\"ay\">وَأَغْطَشَ لَيْلَهَا وَأَخْرَجَ <span class=\"nw\">ضُحَاهَا&nbsp;<i>٢٩</i></span></p><p class=\"ay\">وَالْأَرْضَ بَعْدَ ذَٰلِكَ <span class=\"nw\">دَحَاهَا&nbsp;<i>٣٠</i></span></p><p class=\"ay\">أَخْرَجَ مِنْهَا مَاءَهَا <span class=\"nw\">وَمَرْعَاهَا&nbsp;<i>٣١</i></span></p><p class=\"ay\">وَالْجِبَالَ <span class=\"nw\">أَرْسَاهَا&nbsp;<i>٣٢</i></span></p><p class=\"ay\">مَتَاعًا لَّكُمْ <span class=\"nw\">وَلِأَنْعَامِكُمْ&nbsp;<i>٣٣</i></span></p><p class=\"ay\">فَإِذَا جَاءَتِ الطَّامَّةُ <span class=\"nw\">الْكُبْرَىٰ&nbsp;<i>٣٤</i></span></p><p class=\"ay\">يَوْمَ يَتَذَكَّرُ الْإِنسَانُ مَا <span class=\"nw\">سَعَىٰ&nbsp;<i>٣٥</i></span></p><p class=\"ay\">وَبُرِّزَتِ الْجَحِيمُ لِمَن <span class=\"nw\">يَرَىٰ&nbsp;<i>٣٦</i></span></p><p class=\"ay\">فَأَمَّا مَن <span class=\"nw\">طَغَىٰ&nbsp;<i>٣٧</i></span></p><p class=\"ay\">وَآثَرَ الْحَيَاةَ <span class=\"nw\">الدُّنْيَا&nbsp;<i>٣٨</i></span></p><p class=\"ay\">فَإِنَّ الْجَحِيمَ هِيَ <span class=\"nw\">الْمَأْوَىٰ&nbsp;<i>٣٩</i></span></p><p class=\"ay\">وَأَمَّا مَنْ خَافَ مَقَامَ رَبِّهِ وَنَهَى النَّفْسَ عَنِ <span class=\"nw\">الْهَوَىٰ&nbsp;<i>٤٠</i></span></p><p class=\"ay\">فَإِنَّ الْجَنَّةَ هِيَ <span class=\"nw\">الْمَأْوَىٰ&nbsp;<i>٤١</i></span></p><p class=\"ay\">يَسْأَلُونَكَ عَنِ السَّاعَةِ أَيَّانَ <span class=\"nw\">مُرْسَاهَا&nbsp;<i>٤٢</i></span></p><p class=\"ay\">فِيمَ أَنتَ مِن <span class=\"nw\">ذِكْرَاهَا&nbsp;<i>٤٣</i></span></p><p class=\"ay\">إِلَىٰ رَبِّكَ <span class=\"nw\">مُنتَهَاهَا&nbsp;<i>٤٤</i></span></p><p class=\"ay\">إِنَّمَا أَنتَ مُنذِرُ مَن <span class=\"nw\">يَخْشَاهَا&nbsp;<i>٤٥</i></span></p><p class=\"ay\">كَأَنَّهُمْ يَوْمَ يَرَوْنَهَا لَمْ يَلْبَثُوا إِلَّا عَشِيَّةً أَوْ <span class=\"nw\">ضُحَاهَا&nbsp;<i>٤٦</i></span></p></div></div>"}, {"type": "words", "title": "مَعَانِي الكَلِمَاتِ", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["﴿ الرَّاجِفَةُ ﴾", ["النَّفْخَةُ الأُولَى الَّتِي تَرْجُفُ لَهَا الأَرْضُ", "الرِّيحُ الشَّدِيدَةُ"]], ["﴿ وَاجِفَةٌ ﴾", ["خَائِفَةٌ مُضْطَرِبَةٌ", "مُطْمَئِنَّةٌ"]], ["﴿ دَحَاهَا ﴾", ["بَسَطَهَا وَمَهَّدَهَا", "رَفَعَهَا"]], ["﴿ الطَّامَّةُ الْكُبْرَىٰ ﴾", ["القِيَامَةُ", "الطُّوفَانُ"]]]}, {"type": "words", "title": "أَفْهَمُ السُّورَةَ", "hint": "أَضَعُ دَائِرَةً حَوْلَ الإِجَابَةِ الصَّحِيحَةِ", "rows": [["أَرْسَلَ اللّٰهُ مُوسَى عَلَيْهِ السَّلَامُ إِلَى ...", ["فِرْعَوْنَ", "قَارُونَ"]], ["قَالَ فِرْعَوْنُ: ...", ["أَنَا رَبُّكُمُ الْأَعْلَىٰ", "آمَنْتُ بِرَبِّ مُوسَى"]], ["مَنْ خَافَ مَقَامَ رَبِّهِ وَنَهَى النَّفْسَ عَنِ الهَوَى فَمَأْوَاهُ ...", ["الجَنَّةُ", "الجَحِيمُ"]], ["سَأَلَ الكُفَّارُ عَنْ مَوْعِدِ ...", ["السَّاعَةِ", "المَطَرِ"]]]}, {"type": "tf", "title": "صَحِيحَةٌ أَمْ خَاطِئَةٌ؟", "rows": ["سُورَةُ النَّازِعَاتِ مِنْ جُزْءِ عَمَّ", "ذَكَرَتِ السُّورَةُ قِصَّةَ مُوسَى وَفِرْعَوْنَ", "أَطَاعَ فِرْعَوْنُ مُوسَى عَلَيْهِ السَّلَامُ", "يَعْلَمُ النَّبِيُّ صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ مَوْعِدَ السَّاعَةِ", "الجِبَالُ أَرْسَاهَا اللّٰهُ فِي الأَرْضِ"]}]}]};
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
      <div class="l9t"><h2${name.length > 18 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div>
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
const itemPages10 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item10" style="--h:${h}">
    <div class="l10h"><b>${N(li + 1)}</b><div><h2${name.length > 20 ? ' class="long"' : ''}>${name}</h2><em>${en}</em></div></div>
    <div class="l10map">
      <div class="l10c l10top"><small>📖 ${C.ltr ? 'Read' : 'أَقْرَأُ'}</small><p>${sentence}</p></div>
      <div class="l10c l10a"><small>${U.chip1[0]} ${U.chip1[1]}</small><p>${c1}</p></div>
      <figure class="l10pic">${G(ill)}</figure>
      <div class="l10c l10b"><small>${U.chip2[0]} ${U.chip2[1]}</small><p>${c2}</p></div>
    </div>
    <div class="l10card"><b>${C.ltr ? '🗂️ My example card' : '🗂️ بِطَاقَتِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><i></i><i></i><i></i></div>
    ${pno(P++)}
  </section>`);
});
const itemPages12 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  const long = (sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150;
  pages.push(`
  <section class="page item12" style="--h:${h}">
    <aside class="p12"><small>${C.ltr ? 'LESSON' : 'الدَّرْسُ'}</small><b>${N(li + 1)}</b><figure>${G(ill)}</figure><em>${en}</em><span>${U.title}</span></aside>
    <div class="m12${long ? ' long' : ''}">
      <h2>${name}</h2>
      <div class="q12">${sentence}</div>
      <div class="tb12"><i>${U.chip1[0]}</i><div><small>${U.chip1[1]}</small><b>${c1}</b></div></div>
      <div class="tb12"><i>${U.chip2[0]}</i><div><small>${U.chip2[1]}</small><b>${c2}</b></div></div>
      <div class="lp12"><b>${C.ltr ? '✉️ My own example' : '✉️ مِثَالِي الخَاصُّ'}</b><u></u><u></u><u></u><u></u><u></u></div>
    </div>
    ${pno(P++)}
  </section>`);
});
const itemPages11 = (LIST, U, off) => LIST.forEach(([name, en, ill, sentence, c1, c2], li) => {
  const i = li + off, h = hue(i), N = n => C.ltr ? n : AR(n);
  pages.push(`
  <section class="page item11" style="--h:${h}">
    <div class="run11"><span>${U.title}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div>
    <div class="k11">${C.ltr ? 'Lesson ' + (li + 1) : 'الدَّرْسُ ' + AR(li + 1)}</div>
    <h2 class="t11${name.length > 22 ? ' long' : ''}">${name}</h2>
    <div class="d11">${en}</div>
    <div class="b11">
      <figure class="f11">${G(ill)}<figcaption>${C.ltr ? '▲ ' : '▲ '}${name}</figcaption></figure>
      <div class="c11${(sentence + c1 + c2).replace(/<[^>]+>/g, '').length > 150 ? ' long' : ''}">
        <p class="lead11">${sentence}</p>
        <div class="fx11"><small>${U.chip1[0]} ${U.chip1[1]}</small><b>${c1}</b></div>
        <div class="fx11"><small>${U.chip2[0]} ${U.chip2[1]}</small><b>${c2}</b></div>
      </div>
    </div>
    <div class="nb11"><div class="sp11">${'<i></i>'.repeat(12)}</div><b>${C.ltr ? '✍️ Notebook: my own example' : '✍️ دَفْتَرِي: أَكْتُبُ مِثَالًا مِنْ عِنْدِي'}</b><u></u><u></u><u></u><u></u></div>
    ${pno(P++)}
  </section>`);
});
const itemPages = (...a) => (C.layout === 'g6' ? itemPages6 : C.layout === 'g7' ? itemPages7 : C.layout === 'g8' ? itemPages8 : C.layout === 'g9' ? itemPages9 : C.layout === 'g10' ? itemPages10 : C.layout === 'g11' ? itemPages11 : C.layout === 'g12' ? itemPages12 : itemPagesStd)(...a);
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
if (C.layout === 'g10') {
  const N = n => C.ltr ? n : AR(n); const LT = C.ltr ? ['A', 'B', 'C', 'D'] : ['أ', 'ب', 'ج', 'د'];
  const sheet = (rows, labels) => `<div class="ans10"><b>${C.ltr ? '✏️ Answer sheet: shade the circle' : '✏️ وَرَقَةُ الإِجَابَةِ: أُظَلِّلُ الدَّائِرَةَ'}</b><div class="ans10g">${rows.map((o, j) => `<div><span>${N(j + 1)}</span>${(labels || o.map((_, k) => LT[k])).map(x => `<i>${x}</i>`).join('')}</div>`).join('')}</div></div>`;
  ACT.words = (a) => `<div class="hint10">${a.hint}</div><div class="q10${JSON.stringify(a.rows).replace(/<[^>]+>/g, '').length > 300 ? ' dense' : ''}">${a.rows.map(([w, o], j) => `<div><span>${N(j + 1)}</span><div><p>${w}</p><div class="q10o">${o.map((x, k) => `<em><b>${LT[k]}</b> ${x}</em>`).join('')}</div></div></div>`).join('')}</div>${sheet(a.rows.map(r => r[1]))}`;
  ACT.tf = (a) => `<div class="hint10">${a.hint || 'أَقْرَأُ العِبَارَاتِ، ثُمَّ أُظَلِّلُ: (ص) لِلصَّوَابِ، أَوْ (خ) لِلْخَطَأِ'}</div><div class="q10">${a.rows.map((t, j) => `<div><span>${N(j + 1)}</span><div><p>${t}</p></div></div>`).join('')}</div>${sheet(a.rows, C.ltr ? ['T', 'F'] : ['ص', 'خ'])}`;
}
if (C.layout === 'g11') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint11">🖍️ ${a.hint}</div><div class="q11">${a.rows.map(([w, o], j) => `<div><p><span>${N(j + 1)}</span>${w}</p><div class="tg11">${o.map(x => `<em>${x}</em>`).join('')}</div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint11">🖍️ ${a.hint || 'أُلَوِّنُ 👍 إِذَا كَانَتِ العِبَارَةُ صَحِيحَةً، وَ 👎 إِذَا كَانَتْ خَطَأً'}</div><div class="q11 tf11">${a.rows.map((t, j) => `<div><p><span>${N(j + 1)}</span>${t}</p><div class="tg11"><em>👍</em><em>👎</em></div></div>`).join('')}</div>`;
}
if (C.layout === 'g12') {
  const N = n => C.ltr ? n : AR(n);
  ACT.words = (a) => `<div class="hint12">⭕ ${a.hint}</div><div class="x12">${a.rows.map(([w, o], j) => `<div><b>${N(j + 1)}</b><div><p>${w}</p><div class="xo12">${o.map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
  ACT.tf = (a) => `<div class="hint12">⭕ ${a.hint || '' + (C.ltr ? 'I read the sentence and circle True or False.' : 'أَقْرَأُ العِبَارَةَ، ثُمَّ أَضَعُ دَائِرَةً حَوْلَ (صَحِيحَةٌ) أَوْ (خَاطِئَةٌ)') + ''}</div><div class="x12">${a.rows.map((t, j) => `<div><b>${N(j + 1)}</b><div><p>${t}</p><div class="xo12">${(C.ltr ? ['True', 'False'] : ['صَحِيحَةٌ', 'خَاطِئَةٌ']).map(x => `<em>${x}</em>`).join('')}</div></div></div>`).join('')}</div>`;
}
const actPages = (LIST, off) => LIST.forEach((a, j) => {
  j = j + off;
  const h = [150, 200, 20, 45, 265, 100, 320, 180][j % 8];
  pages.push(`
<section class="page plain" style="--h:${h}">
  ${bubbles(40 + j, h)}
  ${C.layout === 'g12' ? `<div class="a12h"><b>${C.ltr ? j + 1 : AR(j + 1)}</b><div><small>${C.ltr ? 'Task' : 'نَشَاطٌ'}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g11' ? `<div class="run11"><span>${C.ltr ? 'Practice' : 'تَدْرِيبَاتٌ'}</span><b>${C.ltr ? 'My English Book' : C.t1}</b></div><div class="k11">${C.ltr ? 'Exercise ' + (j + 1) : 'تَدْرِيبٌ ' + AR(j + 1)}</div><h2 class="t11 sm">${a.title}</h2>` : C.layout === 'g10' ? `<div class="a10h"><span>${C.ltr ? 'Task ' + (j + 1) : 'مَهَمَّةٌ ' + AR(j + 1)}</span><h2>${a.title}</h2></div>` : C.layout === 'g9' ? `<div class="a9h"><i>✏️</i><div><small>${C.ltr ? 'Exercise ' + (j + 1) : 'تَمْرِينٌ ' + AR(j + 1)}</small><h2>${a.title}</h2></div></div>` : C.layout === 'g8' ? `<div class="a8h"><span>${C.ltr ? 'Activity' : 'نَشَاطٌ'}</span><h2>${a.title}</h2></div>` : C.layout === 'g7' ? `<div class="a7h"><b>${C.ltr ? 'Exercise' : 'تَمْرِينٌ'}</b><h2>${a.title}</h2></div>` : C.layout === 'g6' ? `<div class="a6h"><span>${C.ltr ? 'Practice' : 'تَدْرِيبٌ'}</span><h2>${a.title}</h2></div>` : title(a.title, `hsl(${h},60%,30%)`)}
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
const unitPage10 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit10" style="--h:${h}">
  <div class="u10top"><div class="u10stamp"><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div><div><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u10intro">${u.intro}</p>` : ''}
  <div class="u10road">${all.map((t, n) => `<div class="${n % 2 ? 'r' : 'l'}"><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  <div class="u10art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage11 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit11" style="--h:${h}">
  <div class="tk11">
    <div class="stub11"><small>${C.ltr ? 'UNIT' : 'الوَحْدَةُ'}</small><b>${N(k + 1)}</b></div>
    <div class="body11"><h1>${u.title}</h1><em>${u.en}</em>${u.intro ? `<p>${u.intro}</p>` : ''}</div>
  </div>
  <div class="art11">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="ls11"><b>${C.ltr ? 'Inside this unit' : 'فِي هٰذِهِ الوَحْدَةِ'}</b>${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage12 = (u, k) => { const h = (k * 47 + C.h) % 360; const N = n => C.ltr ? n : AR(n); const all = [...(u.items || []).map(x => x[0]), ...(u.acts || []).map(x => x.title)]; pages.push(`
<section class="page plain unit12" style="--h:${h}">
  <div class="u12art">${(u.arts || [u.icon]).map(x => G(x)).join('')}</div>
  <div class="u12band"><b>${N(k + 1)}</b><div><small>${C.ltr ? 'Unit' : 'الوَحْدَةُ'}</small><h1>${u.title}</h1><em>${u.en}</em></div></div>
  ${u.intro ? `<p class="u12intro">${u.intro}</p>` : ''}
  <div class="u12tiles">${all.map((t, n) => `<div><i>${N(n + 1)}</i><span>${t}</span></div>`).join('')}</div>
  ${pno(P++)}
</section>`); };
const unitPage = (u, k) => C.layout === 'g12' ? unitPage12(u, k) : C.layout === 'g11' ? unitPage11(u, k) : C.layout === 'g10' ? unitPage10(u, k) : C.layout === 'g9' ? unitPage9(u, k) : C.layout === 'g8' ? unitPage8(u, k) : C.layout === 'g7' ? unitPage7(u, k) : C.layout === 'g6' ? unitPage6(u, k) : pages.push(`
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
.cover{--h:175;background:#0f5a52;text-align:center;padding:40px}
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
/* ===== Grade-12 interface: split page — wide colour panel with big number + round picture, letter-paper writing, cross-out-the-wrong-answers exercises, tile unit pages ===== */
.page:not(.cover) .bub{display:none}
.page:not(.cover):not(.cert){background:#ffffff !important}
.pno{left:auto !important;transform:none !important;bottom:26px !important;inset-inline-end:40px !important;width:54px !important;height:54px !important;border-radius:14px !important;background:#fff !important;border:3px solid hsl(var(--h),55%,55%);box-shadow:none !important;color:hsl(var(--h),55%,35%) !important;text-shadow:none !important;font-size:22px !important}
.cert .pno{display:none}
/* lesson */
.item12{display:flex;padding:0 !important}
.p12{position:relative;flex:none;width:225px;background:hsl(var(--h),60%,48%);display:flex;flex-direction:column;align-items:center;padding-top:50px;color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,15%),0 0 3px hsl(var(--h),60%,15%)}
.p12 small{font-size:24px;font-weight:800;letter-spacing:1px}
.p12>b{font-size:130px;font-weight:800;line-height:1}
.p12 figure{margin:30px 0 0;width:210px;height:210px;border-radius:50%;background:#fff;border:9px solid hsl(var(--h),70%,85%);display:flex;align-items:center;justify-content:center;margin-inline-end:-75px;text-shadow:none}
.p12 figure svg{width:165px;height:165px}
.p12 em{margin-top:26px;font-style:normal;font-family:Fredoka,Baloo;font-size:22px;font-weight:600;text-align:center;padding:0 20px;line-height:1.5}
.p12 span{position:absolute;bottom:40px;left:20px;right:20px;text-align:center;font-size:22px;font-weight:800;line-height:1.5;border-top:2px solid hsla(0,0%,100%,.6);padding-top:10px}
.m12{flex:1;padding:56px 40px 110px;padding-inline-start:100px;min-width:0}
.m12 h2{font-size:58px;font-weight:800;line-height:1.45;color:hsl(var(--h),60%,28%)}
.q12{position:relative;margin-top:24px;background:hsl(var(--h),70%,96%);border-radius:6px 30px 6px 6px;padding:24px 26px;font-size:34px;font-weight:800;line-height:1.85;color:#1f1b2e;box-shadow:inset 0 0 0 2px hsl(var(--h),50%,85%)}
.tb12{display:flex;gap:16px;align-items:center;margin-top:26px}
.tb12>i{font-style:normal;flex:none;width:56px;height:56px;border-radius:50%;background:hsl(var(--h),60%,48%);display:flex;align-items:center;justify-content:center;font-size:26px}
.tb12 small{display:block;font-size:23px;font-weight:800;color:hsl(var(--h),50%,40%);line-height:1.5}
.tb12 b{display:block;font-size:29px;font-weight:800;line-height:1.65;color:#2b2340}
.m12.long .q12{font-size:29px;line-height:1.75}.m12.long .tb12 b{font-size:25px}.m12.long .tb12{margin-top:20px}
.lp12{margin-top:34px;border:2px solid #e2e6ee;border-radius:12px;padding:12px 22px 14px;background:linear-gradient(90deg,transparent 0,transparent 100%)}
.lp12 b{font-size:23px;font-weight:800;color:hsl(var(--h),45%,38%)}
.lp12 u{display:block;height:58px;border-bottom:2px solid #c9d8ee;text-decoration:none}
/* unit */
.page.plain.unit12:not(.cover):not(.cert){padding:0 0 100px !important}
.u12art{height:380px;background:hsl(var(--h),70%,94%);display:flex;justify-content:center;align-items:center;gap:40px}.u12art svg{width:180px;height:180px}
.u12band{display:flex;align-items:center;gap:24px;background:hsl(var(--h),60%,48%);padding:24px 50px;color:#fff;text-shadow:0 0 3px hsl(var(--h),60%,15%),0 0 3px hsl(var(--h),60%,15%)}
.u12band>b{font-size:120px;font-weight:800;line-height:1}
.u12band small{font-size:24px;font-weight:800}.u12band h1{font-size:50px;font-weight:800;line-height:1.45}.u12band em{display:block;font-style:normal;font-family:Fredoka;font-size:23px;font-weight:600}
.u12intro{margin:26px 50px 0;font-size:25px;font-weight:700;line-height:1.9;color:#3b3550}
.u12tiles{margin:24px 50px 0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.u12tiles div{border:3px solid hsl(var(--h),55%,80%);border-radius:18px;padding:20px 12px;text-align:center;background:#fff}
.u12tiles i{font-style:normal;display:block;font-size:34px;font-weight:800;color:hsl(var(--h),55%,45%);line-height:1.2}
.u12tiles span{font-size:22px;font-weight:800;color:#2b2340;line-height:1.5}
/* exercises */
.page.plain:not(.unit12){padding-top:50px}
.a12h{position:relative;display:flex;align-items:center;gap:20px;margin:0 46px;padding-bottom:14px;border-bottom:4px solid hsl(var(--h),55%,80%)}
.a12h>b{flex:none;width:80px;height:80px;border-radius:20px;background:hsl(var(--h),60%,48%);color:#fff;font-size:44px;font-weight:800;display:flex;align-items:center;justify-content:center;text-shadow:0 0 3px #0008}
.a12h small{display:block;font-size:22px;font-weight:800;color:hsl(var(--h),50%,40%);line-height:1.4}
.a12h h2{font-size:40px;font-weight:800;line-height:1.45;color:hsl(var(--h),60%,28%)}
.hint12{position:relative;margin:16px 46px 0;font-size:23px;font-weight:700;color:#5f5a72;line-height:1.7}
.x12{position:relative;margin:18px 46px 0;display:flex;flex-direction:column;justify-content:space-evenly;min-height:780px}
.x12>div{display:flex;gap:16px;align-items:flex-start;padding:14px 0;border-bottom:2px solid #eef0f5}
.x12>div>b{flex:none;width:46px;height:46px;border-radius:50%;background:hsl(var(--h),70%,92%);color:hsl(var(--h),55%,35%);font-size:24px;font-weight:800;display:flex;align-items:center;justify-content:center;margin-top:4px}
.x12 p{font-size:29px;font-weight:800;line-height:1.7;color:#1f1b2e}
.xo12{display:flex;flex-wrap:wrap;gap:12px;margin-top:8px}
.xo12 em{font-style:normal;font-size:26px;font-weight:700;line-height:1.6;color:#3b3550;background:#f4f6fa;border-radius:10px;padding:4px 18px;border-bottom:4px solid hsl(var(--h),45%,75%)}
/* shared */
.card,.refc,.steps div,.du,.wtopic,.surah,.facts{box-shadow:none !important;border:2px solid #e2e6ee !important}
.surah{border:3px solid #e8c56a !important}
.toc .tocr{background:#fff !important;border:2px solid #e2e6ee !important;border-radius:14px !important}
/* cover: split */
.cover{background:#ffffff !important;overflow:hidden}
.cover::before{content:'';position:absolute;top:0;bottom:0;inset-inline-start:0;width:36%;background:hsl(var(--h),60%,48%)}
.cover::after{content:'';position:absolute;top:0;bottom:0;inset-inline-start:36%;width:14px;background:hsl(calc(var(--h) + 40),80%,60%)}
.cover > *:not(.ca):not(.gbadge):not(.bub){position:relative;z-index:1}
.cover .ca{z-index:2}.cover .bub{display:none}
.cover h1{font-size:72px !important;line-height:1.45 !important;margin-top:320px !important;background:#fff;border-radius:30px;margin-inline:40px !important;padding:10px 0;box-shadow:0 10px 30px rgba(0,0,0,.12)}
.back h2{font-size:62px !important;margin-top:120px !important}
.page.plain .story{margin-top:34px}.page.plain .story p{font-size:35px !important;line-height:2.15 !important}.page.plain .story h3{font-size:44px}
.surah{position:relative;margin-top:24px;background:#fffdf5;border-radius:34px;padding:18px 28px;border:6px solid #e8c56a;box-shadow:0 8px 0 #c9a040}.surah h3{text-align:center;font-size:46px;font-weight:800;color:#1f7a50;line-height:1.7}.surah .bas{text-align:center;font-size:38px;font-weight:800;color:#8a5a00;line-height:2}.surah .ay{font-size:42px;font-weight:700;line-height:2.3;color:#2b2340;border-bottom:2px dashed #f0dca0;padding:2px 0}.surah .ay i{font-style:normal;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#1f9a60;color:#fff;font-size:22px;font-weight:800;vertical-align:middle;text-shadow:0 0 2px #0a3a20,0 0 2px #0a3a20}.duas{position:relative;margin-top:24px;display:flex;flex-direction:column;gap:22px}.du{display:flex;align-items:center;gap:16px;background:#fff;border-radius:30px;padding:14px 20px;box-shadow:0 7px 0 hsl(var(--h),50%,74%)}.du svg{width:130px;height:130px;flex:none}.du small{display:block;font-size:24px;font-weight:800;color:hsl(var(--h),55%,35%);line-height:1.6}.du b{display:block;font-size:31px;font-weight:800;line-height:1.9;color:#2b2340}.du em{display:inline-block;font-style:normal;font-size:19px;font-weight:800;color:#fff;background:hsl(var(--h),50%,42%);border-radius:14px;padding:2px 14px;margin-top:4px;line-height:1.6}.surah.fat{margin-top:14px;padding:12px 24px}.surah.fat .ay{font-size:36px;line-height:2.05}.steps{position:relative;margin-top:20px;display:flex;flex-direction:column;gap:12px}.steps div{display:flex;align-items:center;gap:16px;background:#fff;border-radius:24px;padding:8px 18px;box-shadow:0 5px 0 hsl(var(--h),50%,76%)}
.steps i{font-style:normal;flex:none;width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#fff;background:hsl(var(--h),60%,45%);text-shadow:0 0 3px hsl(var(--h),60%,20%),0 0 3px hsl(var(--h),60%,20%)}.steps b{font-size:29px;font-weight:800;line-height:1.7;color:#2b2340}
.facts{position:relative;margin-top:24px;background:#fffdf5;border-radius:34px;padding:18px 28px;border:6px solid #8fd6a8;box-shadow:0 8px 0 #5fb37e}.facts h3{text-align:center;font-size:34px;font-weight:800;color:#1f7a50;line-height:1.7;margin-bottom:8px}
.facts div{display:flex;align-items:center;gap:16px;margin-top:12px}.facts span{flex:none;width:210px;text-align:center;font-size:27px;font-weight:800;color:#fff;background:#1f9a60;border-radius:16px;line-height:1.7;text-shadow:0 0 3px #0a3a20,0 0 3px #0a3a20}.facts b{font-size:32px;font-weight:800;line-height:1.7;color:#2b2340}.steps b{font-size:33px}.steps{gap:18px}.steps div{padding:12px 20px}.surah.sm8 .ay{font-size:31px;line-height:1.85}.steps b{font-size:30px}.chip{height:auto !important;min-height:104px;padding:10px 18px}.chip b{font-size:24px !important;line-height:1.6}.item .water{height:520px}.item .ill{width:470px;height:470px}.surah.sm11 .ay{font-size:29px;line-height:1.7;padding:0}.surah.sm11 h3{font-size:36px}.surah.sm11 .bas{font-size:30px}.qrow{margin-top:20px !important;padding:12px 16px !important}.qw{min-width:300px !important;max-width:340px;font-size:28px !important}.qo{font-size:28px !important}.steps b{font-size:30px}.chip{height:auto !important;min-height:104px;padding:10px 18px}.chip b{font-size:23px !important;line-height:1.6}.surah.fat{margin-top:6px}.surah .cols{column-gap:34px}.surah.two .cols{columns:2;column-rule:2px dashed #f0dca0}.surah.two .ay{font-size:27px;line-height:1.8;break-inside:avoid;padding:3px 0}.surah.sm15 .ay{font-size:30px;line-height:1.8}.surah .ay{break-inside:avoid}.surah .nw{white-space:nowrap}.surah.tight .ay{font-size:24px !important;line-height:1.6 !important;padding:1px 0 !important}.surah.tight h3{font-size:36px}.surah.tight .bas{font-size:30px;line-height:1.7}.surah.tight .ay{font-size:23px !important;line-height:1.55 !important}.surah.xt .ay{font-size:21px !important;line-height:1.5 !important}.surah.xt h3{font-size:32px}.surah.one .ay{font-size:27px !important;line-height:1.9 !important}.surah.one.big .ay{font-size:36px !important;line-height:2.4 !important}.surah.one .cols{columns:1}
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

const html = `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>دراساتي الإسلامية ١٢</title><style>${css}</style></head><body>${pages.join('\n')}</body></html>`;
fs.mkdirSync(path.join(ROOT, 'build'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'build', 'book.html'), html);
console.log('pages:', pages.length);
