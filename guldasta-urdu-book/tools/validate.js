// node validate.js content/wNN.json -> problems or OK (+ word count)
const fs = require('fs');
let d; try { d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); } catch (e) { console.log('JSON ERROR', e.message); process.exit(1); }
const E = [], push = m => E.push(m);
let words = 0;
const LAT = /[A-Za-z]/, ARDIG = /[٠-٩]/, WDIG = /[0-9]/;
const ARLET = /[كيىهة]/; // ك ي ى ه ة  (Arabic forms not used in Urdu)
const ur = (s, w, max) => {
  if (typeof s !== 'string' || !s.trim()) return push(`${w}: empty`);
  words += s.split(/\s+/).filter(Boolean).length;
  if (LAT.test(s)) push(`${w}: Latin letters «${s.match(/[A-Za-z]+/)[0]}»`);
  if (ARDIG.test(s)) push(`${w}: use Urdu digits ۰-۹, not Arabic ٠-٩`);
  if (WDIG.test(s)) push(`${w}: use Urdu digits ۰-۹, not 0-9`);
  const m = s.match(ARLET); if (m) push(`${w}: Arabic letter «${m[0]}» in Urdu text (use ک ی ے ہ)`);
  if (/ﷺ/.test(s)) push(`${w}: write صلی اللہ علیہ وسلم in full`);
  if (/[,?;]/.test(s)) push(`${w}: use Urdu punctuation ، ؟ ؛`);
  if (/\.(\s|$)/.test(s)) push(`${w}: use Urdu full stop ۔`);
  if (max && s.split(/\s+/).length > max) push(`${w}: too long (> ${max} words)`);
};
const para = (arr, w, min = 1) => { if (!Array.isArray(arr) || arr.length < min) return push(`${w}: need ${min}+ paragraphs`); arr.forEach((p, i) => { ur(p, `${w} p${i + 1}`); const n = p.split(/\s+/).length; if (n > 170) push(`${w} p${i + 1}: paragraph too long (${n} words, max ~140)`); }); };
const titles = new Set();
(d.items || []).forEach((it, i) => {
  const w = `item ${i + 1} «${(it.t || '').slice(0, 30)}»`;
  ur(it.t, `${w}.t`, 14); if (titles.has(it.t)) push(`${w}: duplicate title`); titles.add(it.t);
  switch (it.type) {
    case 'article': if (it.sub) ur(it.sub, `${w}.sub`, 20); para(it.p, w, 2); if (it.box) { ur(it.box.t, `${w}.box.t`, 10); ur(it.box.p, `${w}.box.p`, 65); } break;
    case 'story': para(it.p, w, 4); ur(it.moral, `${w}.moral`, 35); break;
    case 'quran': case 'dua':
      if (!(it.s >= 1 && it.s <= 114) || !Array.isArray(it.a) || it.a.length !== 2 || it.a[1] < it.a[0] || it.a[1] - it.a[0] > 4) push(`${w}: bad s/a`);
      ur(it.tr, `${w}.tr`); if (it.type === 'quran') para(it.p, w, 1); else ur(it.when, `${w}.when`, 45); break;
    case 'hadith': if (!/[ً-ْ]/.test(it.ar || '')) push(`${w}: ar needs harakat`); if (LAT.test(it.ar || '')) push(`${w}: Latin in ar`);
      ur(it.tr, `${w}.tr`); ur(it.ref, `${w}.ref`, 14); para(it.p, w, 1); break;
    case 'recipe': ur(it.serves, `${w}.serves`, 4); ur(it.time, `${w}.time`, 5); if (!Array.isArray(it.ajza) || it.ajza.length < 4) push(`${w}: ajza 4+`); else it.ajza.forEach((x, k) => ur(x, `${w}.ajza${k + 1}`, 15));
      if (!Array.isArray(it.steps) || it.steps.length < 3) push(`${w}: steps 3+`); else it.steps.forEach((x, k) => ur(x, `${w}.step${k + 1}`, 60)); ur(it.tip, `${w}.tip`, 40); break;
    case 'list': if (!['jokes', 'quotes', 'proverbs', 'facts', 'tips'].includes(it.style)) push(`${w}: style`); if (!Array.isArray(it.items) || it.items.length < 5) push(`${w}: items 5+`); else it.items.forEach((x, k) => ur(x, `${w}.item${k + 1}`, 65)); break;
    case 'riddles': if (!Array.isArray(it.items) || it.items.length < 5) push(`${w}: items 5+`); else it.items.forEach((x, k) => { ur(x.q, `${w}.q${k + 1}`, 50); ur(x.a, `${w}.a${k + 1}`, 30); }); break;
    default: push(`${w}: unknown type ${it.type}`);
  }
});
if (!d.items || !d.items.length) push('no items');
console.log(E.length ? E.slice(0, 80).join('\n') + (E.length > 80 ? `\n... ${E.length} problems` : '') : 'OK');
console.log('WORDS', words, 'ITEMS', (d.items || []).length);
process.exit(E.length ? 1 : 0);
