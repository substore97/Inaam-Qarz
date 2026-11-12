// Art for "علومي ٣": magnet, nail, shadow, soil. Extends the grade-3 art.
const lib = require('../../math3-book/src/math3-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
A.magnet = c => { c.shadow(100, 186, 60, 7); c.raw(`<path d="M50 40 V120 A50 50 0 0 0 150 120 V40 H118 V120 A18 18 0 0 1 82 120 V40 Z" fill="${c.vg('#ff4757')}" stroke="#a8201a" stroke-width="3"/><rect x="50" y="24" width="32" height="26" rx="4" fill="${c.vg('#d5dbe6')}"/><rect x="118" y="24" width="32" height="26" rx="4" fill="${c.vg('#d5dbe6')}"/>`); c.face(100, 150, .45, { blush: false }); };
A.nail = c => { c.raw(`<g transform="rotate(30 100 100)"><rect x="94" y="40" width="12" height="120" fill="${c.lg('#9aa3b5')}"/><path d="M94 160 L100 184 L106 160 Z" fill="#7a8394"/><rect x="80" y="32" width="40" height="12" rx="4" fill="${c.vg('#c5ccd8')}"/></g>`); };
A.attract = c => { put(c, 'magnet', 0, -10, .7); put(c, 'nail', 90, 70, .6); put(c, 'nail', 120, 90, .5); c.raw('<path d="M120 60 q10 -6 20 0 M124 70 q10 -6 20 0" stroke="#ffd23f" stroke-width="4" fill="none"/>'); };
A.shadowtree = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="22" fill="${c.vg('#cfefff')}"/><path d="M0 140 H200 V200 H0 Z" fill="#9be07a"/><ellipse cx="140" cy="160" rx="60" ry="14" fill="rgba(20,40,20,.45)"/>`); put(c, 'gtree', 0, 4, .78); put(c, 'sun', 140, 0, .3); };
A.glasswin = c => A.window(c);
A.soil = c => { c.raw(`<rect x="10" y="60" width="180" height="120" rx="20" fill="${c.vg('#8b5a2b')}"/><path d="M10 80 Q100 50 190 80" fill="#9be07a"/>`); for (const [x, y] of [[50, 120], [100, 150], [150, 110], [80, 100], [130, 160]]) c.ball(x, y, 6, '#c98a4e', { shine: false }); put(c, 'sprout', 60, 0, .4); };
A.sandpile = c => { c.shadow(100, 186, 70, 6); c.path('M20 180 Q100 50 180 180 Z', '#f2c46a', { vert: true }); for (const [x, y] of [[80, 140], [110, 120], [130, 160]]) c.ball(x, y, 3, '#c99a40', { shine: false }); };
module.exports = lib;
