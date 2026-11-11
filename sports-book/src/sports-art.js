// 3D sports gear and scenes for "رياضتي". Extends the shared art library.
const lib = require('../../hygiene-book/src/hygiene-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const scene = (col, prop, s = .55, px = 96, py = 84, param, who = 'kidc') => c => { put(c, who, -4, 6, .92, col); put(c, prop, px, py, s, param); };

A.football = c => {
  c.shadow(100, 186, 60, 7); c.ball(100, 106, 74, '#ffffff');
  c.raw('<path d="M100 78 l22 16 -8 26 h-28 l-8 -26 Z" fill="#2b2340"/><path d="M100 78 V40 M122 94 l34 -10 M114 120 l20 30 M86 120 l-20 30 M78 94 l-34 -10" stroke="#2b2340" stroke-width="3"/>');
  c.raw('<path d="M60 52 l12 -10 14 6 M140 52 l-12 -10 -14 6 M40 120 l4 18 M160 120 l-4 18 M84 172 h32" stroke="#2b2340" stroke-width="3" fill="none"/>');
  c.face(100, 150, .5, { blush: false });
};
A.basketball = c => {
  c.shadow(100, 186, 60, 7); c.ball(100, 106, 74, '#ff8a1f');
  c.raw('<g stroke="#7a3a00" stroke-width="3.5" fill="none"><path d="M26 106 H174 M100 32 V180"/><path d="M50 50 Q80 106 50 162 M150 50 Q120 106 150 162"/></g>');
  c.face(100, 136, .5, { blush: false });
};
A.volleyball = c => {
  c.shadow(100, 186, 60, 7); c.ball(100, 106, 74, '#ffe680');
  c.raw('<g stroke="#2f7de8" stroke-width="4" fill="none"><path d="M100 106 Q70 60 40 60 M100 106 Q150 96 168 130 M100 106 Q96 160 66 172"/></g>');
  c.face(100, 120, .5, { blush: false });
};
A.racket = c => {
  c.shadow(100, 188, 54, 6);
  c.raw(`<g transform="rotate(-30 100 100)"><rect x="93" y="120" width="14" height="64" rx="6" fill="${c.lg('#2b2340')}"/>`);
  c.raw('<ellipse cx="100" cy="72" rx="44" ry="54" fill="none" stroke="#ff4757" stroke-width="10"/><g stroke="#e6ebf3" stroke-width="2">' + [-30, -15, 0, 15, 30].map(x => `<path d="M${100 + x} 22 V122"/>`).join('') + [-36, -18, 0, 18, 36].map(y => `<path d="M58 ${72 + y} H142"/>`).join('') + '</g></g>');
  c.ball(156, 160, 18, '#d4f23a');
};
A.bow = c => {
  c.shadow(100, 186, 60, 6);
  c.raw('<path d="M70 20 Q150 100 70 180" fill="none" stroke="#a8693a" stroke-width="10" stroke-linecap="round"/><path d="M70 20 V180" stroke="#e6ebf3" stroke-width="2"/>');
  c.raw('<path d="M40 100 H176" stroke="#8b5a2b" stroke-width="5"/><path d="M176 100 l-16 -9 v18 Z" fill="#9aa3b5"/><path d="M40 100 l-10 -10 M40 100 l-10 10 M48 100 l-10 -10 M48 100 l-10 10" stroke="#ff4757" stroke-width="4"/>');
};
A.target = c => { c.shadow(100, 188, 50, 6); for (const [r, col] of [[76, '#ffffff'], [60, '#ff4757'], [44, '#ffffff'], [28, '#ff4757'], [12, '#ffd23f']]) c.ball(100, 100, r, col, { shine: r === 76 }); c.raw('<path d="M100 100 L170 40" stroke="#8b5a2b" stroke-width="5"/>'); };
A.swim = c => {
  put(c, 'kidc', 10, -4, .9, '#ff4757');
  c.raw(`<rect x="0" y="110" width="200" height="90" fill="${c.vg('#4fb3ff')}" opacity=".92"/>`);
  c.raw('<path d="M0 116 q12 -10 25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0 t25 0" stroke="#ffffff" stroke-width="5" fill="none"/>');
  c.raw('<path d="M30 150 q12 -8 24 0 M120 160 q12 -8 24 0" stroke="#bfe6ff" stroke-width="4" fill="none"/>');
};
A.runner = c => { put(c, 'kidc', 10, 6, .9, '#36c45d'); c.raw('<path d="M10 70 h36 M2 96 h40 M14 122 h30" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".9"/>'); put(c, 'shoes', 120, 140, .3); };
A.exercise = c => { put(c, 'kidc', 4, 20, .82, '#b05cff'); c.star(30, 20, 10, '#ffd23f'); c.star(172, 20, 10, '#ffd23f'); };
A.s_foot = scene('#2f7de8', 'football', .42, 106, 110);
A.s_basket = scene('#ff8a1f', 'basketball', .42, 106, 100, undefined, 'girlc');
A.s_volley = scene('#ffd23f', 'volleyball', .42, 106, 100);
A.s_tennis = scene('#2ec4b6', 'racket', .5, 100, 80, undefined, 'girlc');
A.s_archery = scene('#8b5a2b', 'bow', .52, 100, 70);
A.s_bike = c => { put(c, 'bicycle', 0, 20, .96); };
A.s_horse = c => { put(c, 'horse', 0, 20, .96); put(c, 'kidc', 56, 14, .5, '#ff4757'); };
A.s_rope = scene('#ff6fae', 'jumprope', .55, 96, 80, undefined, 'girlc');
A.s_walk = c => { put(c, 'girlc', 10, 6, .9, '#36c45d'); put(c, 'gtree', 120, 50, .45); };
module.exports = lib;
