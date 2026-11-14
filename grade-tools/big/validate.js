// node validate.js content_<slug>.json  -> checks schema, counts, art names, forbidden chars
const fs = require('fs');
const { A } = require('/home/user/Inaam-Qarz/science12-book/src/science12-art');
const f = process.argv[2]; const c = JSON.parse(fs.readFileSync(f, 'utf8')); const err = [];
const art = (x, w) => { const n = String(x).split(':')[0]; if (!A[n]) err.push(`unknown art "${x}" in ${w}`); };
for (const k of ['title','t1','t2','csub','cen','noteP','ovTitle','certP','blurb','en2','f1L','f2L']) if (typeof c[k] !== 'string' || !c[k]) err.push('missing ' + k);
for (const [k, n] of [['noteLi',3],['blurbLi',4],['coverTop',3],['coverBot',4],['ownerMini',3],['noteMini',3],['certArts',3],['backArts',4]]) if (!Array.isArray(c[k]) || c[k].length !== n) err.push(`${k} must have ${n}`);
['coverTop','coverBot','ownerMini','noteMini','certArts','backArts'].forEach(k => (c[k]||[]).forEach(x => art(x, k))); art(c.ownerArt || '', 'ownerArt');
if (!Array.isArray(c.items) || c.items.length !== 40) err.push('items must be exactly 40 (has ' + (c.items||[]).length + ')');
(c.items||[]).forEach((it, i) => { if (!Array.isArray(it) || it.length !== 6) err.push(`item ${i} must be [title,en,arts,text,f1,f2]`); else { String(it[2]).split(',').forEach(x => art(x.trim(), 'item ' + i)); if (String(it[2]).split(',').length > 3) err.push(`item ${i}: max 3 arts`); if (it[3].length > 230) err.push(`item ${i}: text too long (${it[3].length} chars, max 230)`); if (it[4].length > 70 || it[5].length > 70) err.push(`item ${i}: f1/f2 max 70 chars`); } });
if (!Array.isArray(c.acts) || c.acts.length !== 4) err.push('acts must be exactly 4');
(c.acts||[]).forEach((a, i) => { if (!['review','facts','qa','story2','raw'].includes(a.type)) err.push('act ' + i + ' bad type');
  if (a.type === 'review') { if (a.rows.length !== 12) err.push('review needs 12 rows'); a.rows.forEach(r => art(r[0], 'review')); }
  if (a.type === 'qa' && (a.rows.length < 4 || a.rows.length > 5)) err.push('qa needs 4-5 rows');
  if (a.type === 'facts' && (a.rows.length < 4 || a.rows.length > 6)) err.push('facts needs 4-6 rows');
  if (a.type === 'story2' && (a.lines.length < 4 || a.lines.length > 7)) err.push('story2 needs 4-7 lines');
  (a.arts||[]).forEach(x => art(x, 'act ' + i)); });
const all = JSON.stringify(c);
if (/ﷺ/.test(all)) err.push('ﷺ ligature is forbidden – write صَلَّى اللّٰهُ عَلَيْهِ وَسَلَّمَ');
if (/[؀-ۿ]/.test(c.en2) && false) {}
if (/(أكتب|أَكْتُبُ|ارسم|أَرْسُمُ|لوّن|أُلَوِّنُ|ضع دائرة|أَضَعُ|صِلْ|أَصِلُ)/.test(all)) err.push('writing/drawing/colouring instructions are forbidden (reading-only book)');
if (/grade|Grade|الصف/.test(all)) err.push('no grade words allowed');
console.log(err.length ? 'ERRORS:\n' + err.join('\n') : 'OK ' + f);
