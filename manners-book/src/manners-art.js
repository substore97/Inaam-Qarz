// Scenes for "أخلاقي الجميلة": a kid next to a prop. Extends the shared art library.
const lib = require('../../day-book/src/day-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const scene = (col, prop, s = .55, px = 96, py = 84, param, who = 'kidc') => c => { put(c, who, -4, 6, .92, col); put(c, prop, px, py, s, param); };

A.tap = c => {
  c.shadow(100, 188, 50, 6);
  c.raw(`<rect x="30" y="40" width="40" height="40" rx="8" fill="${c.vg('#c5ccd8')}"/><rect x="60" y="50" width="80" height="22" rx="10" fill="${c.vg('#d5dbe6')}" stroke="#9aa3b5"/>`);
  c.raw(`<rect x="126" y="60" width="22" height="40" rx="8" fill="${c.lg('#c5ccd8')}"/><rect x="90" y="26" width="16" height="26" rx="5" fill="${c.vg('#ff4757')}"/><rect x="74" y="20" width="48" height="12" rx="6" fill="${c.vg('#ff4757')}"/>`);
  c.drop(137, 124, 1.1, '#4fb3ff');
  c.raw('<path d="M108 164 l46 -46 M108 118 l46 46" stroke="#ff4757" stroke-width="0"/>');
  c.face(98, 61, .4, { blush: false });
};
A.queue = c => { c.shadow(100, 186, 60, 6); for (const [x, col] of [[30, '#ff8a1f'], [80, '#36c45d']]) { c.raw(`<g transform="translate(${x - 52} 40) scale(.6)">`); A.kidc(c, col); c.raw('</g>'); } };

A.m_honest = scene('#4fa8ff', 'bigheart', .5, 100, 80);
A.m_share = c => { put(c, 'girlc', -30, 10, .86, '#ff6fae'); put(c, 'kidc', 58, 10, .86, '#36c45d'); put(c, 'cookies', 62, 120, .36); };
A.m_animals = c => { put(c, 'kidc', -6, 6, .9, '#ffb627'); put(c, 'cat', 100, 90, .5); put(c, 'bowl2', 108, 148, .3); };
A.bowl2 = c => { c.ell(100, 150, 70, 20, '#4fa8ff'); c.ell(100, 140, 60, 12, '#bfe6ff', { noEdge: true }); };
A.m_elders = c => { put(c, 'kidc', -10, 10, .9, '#9b59d6'); put(c, 'chair', 98, 80, .55); };
A.m_sorry = scene('#ff8a1f', 'toytrain', .5, 100, 100);
A.m_thanks = scene('#36c45d', 'gift', .5, 100, 90, undefined, 'girlc');
A.m_help = scene('#2ec4b6', 'bag', .46, 104, 90);
A.m_clean = scene('#b05cff', 'soap', .5, 100, 100, undefined, 'girlc');
A.m_water = scene('#2f7de8', 'tap', .55, 96, 80);
A.m_smile = scene('#ffd23f', 'f_happy', .46, 104, 70, undefined, 'girlc');
A.m_patience = c => { put(c, 'girlc', -30, 14, .84, '#ff8a1f'); put(c, 'kidc', 58, 14, .84, '#36c45d'); put(c, 'clockt', 136, 0, .32, '3:00'); };
A.m_parents = scene('#ff4757', 'bigheart', .5, 100, 80, undefined, 'girlc');
module.exports = lib;
