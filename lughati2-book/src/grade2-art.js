// Shared art for the grade-2 books. Extends the shared art library.
const lib = require('../../english1-book/src/english1-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const bubble = (c, x, y, t, col = '#ffffff') => c.raw(`<g><ellipse cx="${x}" cy="${y}" rx="30" ry="24" fill="${col}" stroke="#c5ccd8" stroke-width="3"/><path d="M${x - 10} ${y + 20} l-8 16 l18 -12" fill="${col}" stroke="#c5ccd8" stroke-width="3"/><text x="${x}" y="${y + 12}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="32" fill="#6a3fd0">${t}</text></g>`);
const arrow = (c, x1, y1, x2, col = '#ff4757') => c.raw(`<path d="M${x1} ${y1} H${x2}" stroke="${col}" stroke-width="9" stroke-linecap="round"/><path d="M${x2} ${y1} l${x2 > x1 ? -16 : 16} -12 v24 Z" fill="${col}"/>`);
// pronoun scenes
A.pr_ana = c => { put(c, 'kidc', 10, 10, .92, '#36c45d'); c.raw('<path d="M70 120 l-26 -6" stroke="#ffcfa8" stroke-width="0"/>'); c.heart(160, 50, 16, '#ff4f8b'); };
A.pr_nahnu = c => { put(c, 'kidc', -8, 50, .58, '#4fa8ff'); put(c, 'girlc', 52, 50, .58, '#ff6fae'); put(c, 'kidc', 112, 50, .58, '#ffb627'); };
A.pr_anta = c => { put(c, 'kidc', 30, 10, .9, '#2f7de8'); arrow(c, 10, 190, 60); };
A.pr_anti = c => { put(c, 'girlc', 30, 10, .9, '#ff6fae'); arrow(c, 10, 190, 60); };
A.pr_huwa = c => { put(c, 'kidc', 30, 10, .9, '#ff8a1f'); };
A.pr_hiya = c => { put(c, 'girlc', 30, 10, .9, '#b05cff'); };
// question-word scenes
A.q_man = c => { put(c, 'kidc', 0, 20, .86, '#4fa8ff'); bubble(c, 160, 40, '؟'); };
A.q_ma = c => { put(c, 'gift', 10, 30, .8); bubble(c, 160, 40, '؟'); };
A.q_ayna = c => { put(c, 'p_behind', 0, 10, .9); bubble(c, 166, 36, '؟'); };
A.q_mata = c => { put(c, 'clockt', 10, 20, .8, '7:00'); bubble(c, 166, 36, '؟'); };
A.q_kayfa = c => { put(c, 'f_happy', 0, 20, .8); bubble(c, 166, 36, '؟'); };
A.q_hal = c => { put(c, 'cat', 0, 30, .8); bubble(c, 166, 36, '؟'); };
// prepositions
A.pp_fi = c => A.p_in(c);
A.pp_ala = c => A.p_on(c);
A.pp_min = c => { put(c, 'myhouse', -10, 30, .7); put(c, 'kidc', 120, 60, .5, '#36c45d'); arrow(c, 110, 176, 190); };
A.pp_ila = c => { put(c, 'school', 90, 20, .6); put(c, 'girlc', -6, 60, .5, '#ff6fae'); arrow(c, 70, 176, 120); };
// tense scenes
A.t_past = c => { put(c, 'notebook', 20, 40, .7); c.raw('<path d="M140 40 a30 30 0 1 0 30 30" stroke="#6a3fd0" stroke-width="7" fill="none"/><path d="M170 70 l-8 -14 l16 0 Z" fill="#6a3fd0"/>'); };
A.t_now = c => A.v_write(c);
A.t_cmd = c => { put(c, 'teacher', -4, 6, .92); put(c, 'notebook', 112, 96, .4); };
// ta marbuta / maftuha
A.tm_tree = c => A.gtree(c);
A.tm_house = c => A.myhouse(c);
// fractions: param "n,k" = k of n parts coloured
A.frac = (c, p = '2,1') => { const [n, k] = p.split(',').map(Number); c.shadow(100, 186, 70, 7); c.ball(100, 100, 78, '#fff3d6', { shine: false });
  for (let i = 0; i < n; i++) { const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n; const P = (a) => `${(100 + 76 * Math.cos(a)).toFixed(1)} ${(100 + 76 * Math.sin(a)).toFixed(1)}`;
    c.raw(`<path d="M100 100 L${P(a0)} A76 76 0 0 1 ${P(a1)} Z" fill="${i < k ? '#ff8a1f' : '#fff3d6'}" stroke="#c46a00" stroke-width="4"/>`); }
  c.raw('<circle cx="100" cy="100" r="76" fill="none" stroke="#c46a00" stroke-width="5"/>'); };
// equal groups: param "g,m,item"
A.groups = (c, p = '2,3,apple') => { const [g, m, it] = p.split(','); const G = +g, M = +m; const w = 200 / G;
  for (let i = 0; i < G; i++) { const cx = w * i + w / 2; c.raw(`<ellipse cx="${cx}" cy="110" rx="${w / 2 - 6}" ry="70" fill="#ffffff" stroke="#a8d4ff" stroke-width="4"/>`);
    for (let j = 0; j < M; j++) put(c, it, cx - 18, 52 + j * (110 / M), Math.min(.18, 0.6 / M)); } };
A.rock = c => { c.shadow(100, 180, 64, 7); c.path('M30 160 Q20 100 70 76 Q110 56 150 80 Q186 104 170 160 Z', '#9aa3b5', { vert: true }); c.face(100, 130, .5, { blush: false }); };
A.push = c => { put(c, 'kidc', -10, 10, .86, '#36c45d'); put(c, 'box', 90, 70, .6); arrow(c, 40, 30, 120); };
A.pull = c => { put(c, 'toytrain', 0, 70, .55); put(c, 'girlc', 96, 50, .56, '#ff6fae'); c.raw('<path d="M100 150 L120 140" stroke="#8b5a2b" stroke-width="4"/>'); arrow(c, 120, 30, 190); };
A.desert = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="22" fill="${c.vg('#ffe7a8')}"/><path d="M0 150 Q60 110 120 140 T200 130 V200 H0 Z" fill="#f2c46a"/>`); put(c, 'cactus', 20, 50, .6); put(c, 'sun', 120, 0, .4); };
A.forest = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="22" fill="${c.vg('#cfefc0')}"/>`); put(c, 'gtree', -20, 10, .7); put(c, 'gtree', 90, 0, .7); put(c, 'bear', 60, 100, .45); };
A.polar = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="22" fill="${c.vg('#dff4ff')}"/><path d="M0 150 Q100 120 200 150 V200 H0 Z" fill="#ffffff"/>`); put(c, 'penguin', 50, 40, .6); put(c, 'snowflake', 140, 10, .3); };
A.seahab = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="22" fill="${c.vg('#7fd0ff')}"/>`); put(c, 'whale', 10, 30, .6); put(c, 'clownfish', 110, 120, .35); put(c, 'coral', 0, 120, .4); };
A.barchart = c => { c.raw('<path d="M20 20 V180 H190" stroke="#2b2340" stroke-width="4" fill="none"/>'); [[40, 120, '#ff4757'], [90, 60, '#ffb627'], [140, 150, '#36c45d']].forEach(([x, h, col]) => c.raw(`<rect x="${x}" y="${180 - h}" width="34" height="${h}" rx="6" fill="${c.vg(col)}"/>`)); };
module.exports = lib;
