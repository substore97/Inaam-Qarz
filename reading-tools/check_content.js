// node check.js book.json  -> rule check of the reading-book content
const fs = require('fs');
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const E = [];
const FA = 'َ', KA = 'ِ', DA = 'ُ', SUK = 'ْ', SH = 'ّ';
const TAN = /[ً-ٍ]/;
const letters = w => w.replace(/[ً-ْ]/g, '').length;
function onlyH(w, allowed, need, name) {
  if (/[^ء-يً-ْ]/.test(w)) return E.push(`${name} «${w}»: only Arabic letters`);
  if (letters(w) !== 3) E.push(`${name} «${w}»: must be 3 letters`);
  const parts = w.match(/[ء-ي][ً-ْ]*/g) || [];
  parts.forEach(p => { const h = p.slice(1); if (h.length !== 1 || !allowed.includes(h)) E.push(`${name} «${w}»: letter ${p[0]} needs exactly one of the allowed harakat`); });
  if (need && !need.some(n => w.includes(n))) E.push(`${name} «${w}»: must contain ${need.map(n => 'ـ' + n).join(' or ')}`);
}
const cnt = (k, n) => { if (!Array.isArray(d[k]) || d[k].length !== n) E.push(`${k}: need ${n}`); };
cnt('fatha_words', 15); cnt('fatha_phrases', 9); cnt('kasra_words', 16); cnt('kasra_phrases', 6); cnt('damma_words', 15);
cnt('three_words', 40); cnt('three_phrases', 12); cnt('cards', 16); cnt('stories', 8);
(d.fatha_words || []).forEach(w => onlyH(w, [FA], null, 'fatha_words'));
(d.kasra_words || []).forEach(w => onlyH(w, [FA, KA], [KA], 'kasra_words'));
(d.damma_words || []).forEach(w => onlyH(w, [FA, DA], [DA], 'damma_words'));
(d.three_words || []).forEach(w => onlyH(w, [FA, KA, DA], null, 'three_words'));
const ph = (k, allowed) => (d[k] || []).forEach(p => { const ws = p.split(' '); if (ws.length !== 2 || !ws[1].startsWith('وَ')) return E.push(`${k} «${p}»: format "X وَY"`); onlyH(ws[0], allowed, null, k); onlyH(ws[1].slice(2), allowed, null, k); });
ph('fatha_phrases', [FA]); ph('kasra_phrases', [FA, KA]); ph('three_phrases', [FA, KA, DA]);
const all = [...(d.fatha_words || []), ...(d.kasra_words || []), ...(d.damma_words || []), ...(d.three_words || [])];
const dup = all.filter((w, i) => all.indexOf(w) !== i); if (dup.length) E.push('duplicate words: ' + dup.join(' '));
(d.cards || []).forEach(s => { if (!/^[ء-ْ\s،.؟!]+$/.test(s)) E.push(`card «${s}»: only Arabic`); if (!/[.؟!]$/.test(s)) E.push(`card «${s}»: end with .`); const n = s.split(/\s+/).length; if (n < 3 || n > 7) E.push(`card «${s}»: 3–6 words`); });
(d.stories || []).forEach((st, i) => { if (!st.art) E.push(`story ${i + 1}: art`); if (!Array.isArray(st.lines) || st.lines.length < 4 || st.lines.length > 6) E.push(`story ${i + 1}: 4–6 lines`); else st.lines.forEach(l => { if (!/^[ء-ْ\s،.؟!]+$/.test(l)) E.push(`story ${i + 1} «${l}»: only Arabic`); if (l.split(/\s+/).length > 8) E.push(`story ${i + 1} «${l}»: max 8 words per line`); }); });
// tashkeel coverage in cards/stories: each word should carry at least one haraka
[...(d.cards || []), ...(d.stories || []).flatMap(s => s.lines || [])].forEach(s => s.replace(/[.،؟!]/g, '').split(/\s+/).forEach(w => { if (w && !/[ً-ْ]/.test(w)) E.push(`no harakat on «${w}» in «${s}»`); }));
console.log(E.length ? E.join('\n') : 'OK');
