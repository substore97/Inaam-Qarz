// node validate.js content/tNN.json  -> prints problems, or OK
const fs = require('fs'), path = require('path');
const f = process.argv[2];
const T = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'topics.json'), 'utf8'));
let d; const errs = [];
try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { console.log('JSON ERROR', e.message); process.exit(1); }
const E = (m) => errs.push(m);
const AR = /[؀-ۿ]/, LAT = /[A-Za-z]/;
const words = s => s.replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
const stars = s => (s.match(/\*/g) || []).length;
const topic = T.find(t => t.n === d.n);
if (!topic) E('bad n');
const en = (s, where, max) => { if (typeof s !== 'string' || !s.trim()) return E(`${where}: empty`); if (AR.test(s)) E(`${where}: Arabic letters in English text`); if (max && s.replace(/\*/g, '').length > max) E(`${where}: too long (${s.length}>${max})`); if (/\s{2,}/.test(s.replace('____', 'X'))) E(`${where}: double space`); };
const ar = (s, where, max) => { if (typeof s !== 'string' || !s.trim()) return E(`${where}: empty`); if (LAT.test(s)) E(`${where}: Latin letters in Arabic text`); if (!AR.test(s)) E(`${where}: no Arabic`); if (max && s.replace(/\*/g, '').length > max) E(`${where}: too long (${s.length}>${max})`); if (/[,?;]/.test(s)) E(`${where}: use Arabic punctuation ، ؟ ؛`); if (/ﷺ/.test(s)) E(`${where}: no ﷺ`); };
if (topic) {
  const es = d.entries || [];
  if (es.length !== 30) E(`entries: ${es.length} (need 30)`);
  const got = es.map(e => e.w);
  topic.words.forEach(w => { if (!got.includes(w)) E(`missing headword "${w}"`); });
  got.forEach(w => { if (!topic.words.includes(w)) E(`unknown headword "${w}"`); });
  const exs = new Set();
  es.forEach((e, i) => {
    const k = `entry ${e.w || i}`;
    if (!['n.', 'v.', 'adj.', 'adv.', 'phr.', 'phr. v.'].includes(e.pos)) E(`${k}: pos "${e.pos}"`);
    if (!/^\/[^/]+\/$/.test(e.ipa || '')) E(`${k}: ipa must be /.../`);
    else { if (/[A-Z]/.test(e.ipa)) E(`${k}: capital letters in ipa`); if (!/[ˈ]/.test(e.ipa) && e.ipa.replace(/[^aeiouæɑɒɔəɜɪʊʌ]/g, '').length > 2) E(`${k}: ipa has no stress mark ˈ`); if (/[':]/.test(e.ipa)) E(`${k}: use ˈ and ː, not ' or :`); }
    if (!['B1', 'B2', 'C1', 'C2'].includes(e.lvl)) E(`${k}: lvl`);
    ar(e.ar, `${k}.ar`, 40);
    en(e.ex, `${k}.ex`, 120); if (stars(e.ex || '') !== 2) E(`${k}.ex: need exactly one *...*`);
    ar(e.exAr, `${k}.exAr`, 130); if (stars(e.exAr || '') !== 2) E(`${k}.exAr: need exactly one *...*`);
    if (exs.has(e.ex)) E(`${k}: duplicate example`); exs.add(e.ex);
    if (!Array.isArray(e.syn) || e.syn.length > 3) E(`${k}.syn: 0-3 items`); else e.syn.forEach(s => en(s, `${k}.syn`, 22));
    if (!Array.isArray(e.col) || e.col.length < 2 || e.col.length > 3) E(`${k}.col: 2-3 items`); else e.col.forEach(s => en(s, `${k}.col`, 30));
    if (typeof e.fam !== 'string') E(`${k}.fam: string`); else if (e.fam) en(e.fam, `${k}.fam`, 70);
  });
  const p = d.practice || {};
  if (!Array.isArray(p.bank) || p.bank.length !== 8) E('practice.bank: need 8'); else p.bank.forEach(b => { if (!topic.words.includes(b)) E(`bank word "${b}" not a headword`); });
  if (!Array.isArray(p.gap) || p.gap.length !== 8) E('practice.gap: need 8');
  else p.gap.forEach((g, i) => { en(g.s, `gap ${i + 1}`, 130); if ((g.s.match(/____/g) || []).length !== 1 || /_____/.test(g.s)) E(`gap ${i + 1}: need exactly one ____ (4 underscores)`); en(g.a, `gap ${i + 1}.a`, 40); });
  if (!Array.isArray(p.para) || p.para.length !== 4) E('practice.para: need 4');
  else p.para.forEach((g, i) => { en(g.a, `para ${i + 1}.a`, 120); en(g.b, `para ${i + 1}.b`, 120); if (stars(g.b) !== 2) E(`para ${i + 1}.b: need one *...*`); });
  const s = d.speaking || {};
  if (!Array.isArray(s.p1) || s.p1.length !== 3) E('speaking.p1: need 3'); else s.p1.forEach((x, i) => { en(x.q, `p1 ${i + 1}.q`, 120); en(x.a, `p1 ${i + 1}.a`); const n = words(x.a); if (n < 22 || n > 50) E(`p1 ${i + 1}.a: ${n} words (25-45)`); });
  if (!s.p2) E('speaking.p2 missing'); else { en(s.p2.cue, 'p2.cue', 90); if (!Array.isArray(s.p2.points) || s.p2.points.length !== 4) E('p2.points: need 4'); else { s.p2.points.forEach((x, i) => en(x, `p2.point ${i + 1}`, 80)); if (!/^and explain/.test(s.p2.points[3])) E('p2: last point must start "and explain"'); } en(s.p2.a, 'p2.a'); const n = words(s.p2.a || ''); if (n < 135 || n > 190) E(`p2.a: ${n} words (140-180)`); }
  if (!Array.isArray(s.p3) || s.p3.length !== 2) E('speaking.p3: need 2'); else s.p3.forEach((x, i) => { en(x.q, `p3 ${i + 1}.q`, 140); en(x.a, `p3 ${i + 1}.a`); const n = words(x.a); if (n < 45 || n > 80) E(`p3 ${i + 1}.a: ${n} words (50-75)`); });
  ar(s.tipAr, 'speaking.tipAr', 140);
  const spk = [...(s.p1 || []).map(x => x.a), s.p2 && s.p2.a, ...(s.p3 || []).map(x => x.a)].join(' ');
  if (stars(spk) / 2 < 5) E('speaking: mark at least 5 headwords with *...*');
  if (stars(spk) % 2) E('speaking: unbalanced *');
  const w = d.writing || {};
  en(w.q, 'writing.q', 360);
  if (!Array.isArray(w.essay) || w.essay.length !== 4) E('writing.essay: need 4 paragraphs');
  else {
    const n = w.essay.reduce((a, p) => a + words(p), 0);
    w.essay.forEach((p, i) => { en(p, `essay p${i + 1}`); if (stars(p) % 2) E(`essay p${i + 1}: unbalanced *`); });
    if (d.n === 20) { if (n < 155 || n > 210) E(`report: ${n} words (160-200)`); }
    else { if (n < 245 || n > 295) E(`essay: ${n} words (250-290)`); }
    if (stars(w.essay.join(' ')) / 2 < 6) E('essay: mark at least 6 headwords with *...*');
  }
  ar(w.tipAr, 'writing.tipAr', 160);
  if (d.n === 20) {
    if (w.task !== 'Task 1') E('topic 20: writing.task must be "Task 1"');
    const c = w.chart || {};
    if (!['line', 'bar'].includes(c.kind)) E('chart.kind');
    if (!Array.isArray(c.x) || c.x.length < 4 || c.x.length > 6) E('chart.x: 4-6 labels');
    if (!Array.isArray(c.series) || c.series.length < 2 || c.series.length > 3) E('chart.series: 2-3');
    else c.series.forEach(se => { if (!Array.isArray(se.v) || se.v.length !== (c.x || []).length || se.v.some(v => typeof v !== 'number')) E(`series ${se.name}: values`); });
  } else {
    if (w.task !== 'Task 2') E('writing.task must be "Task 2"');
    if (!['Opinion essay', 'Discussion essay', 'Advantages and disadvantages', 'Problem and solution', 'Two-part question'].includes(w.type)) E('writing.type');
  }
}
console.log(errs.length ? errs.join('\n') : 'OK');
process.exit(errs.length ? 1 : 0);
