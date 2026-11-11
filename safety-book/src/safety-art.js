// 3D safety items for "سلامتي". Extends the shared art library.
const lib = require('../../homes-book/src/homes-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const scene = (col, prop, s = .55, px = 96, py = 84, param, who = 'kidc') => c => { put(c, who, -4, 6, .92, col); put(c, prop, px, py, s, param); };
const no = c => c.raw('<circle cx="100" cy="100" r="86" fill="none" stroke="#ff2d3a" stroke-width="12" opacity=".9"/><path d="M40 40 L160 160" stroke="#ff2d3a" stroke-width="12" stroke-linecap="round" opacity=".9"/>');

A.flame = c => { c.shadow(100, 188, 50, 6); c.path('M100 20 Q160 90 140 150 Q128 186 100 186 Q72 186 60 150 Q44 100 80 60 Q84 96 100 100 Q90 60 100 20 Z', '#ff6b1a', { vert: true }); c.path('M100 90 Q132 130 120 162 Q112 180 100 180 Q88 180 80 162 Q72 136 100 90 Z', '#ffd23f', { flat: true }); c.face(100, 150, .5, { blush: false }); };
A.socket = c => { c.raw(`<rect x="36" y="36" width="128" height="128" rx="26" fill="${c.vg('#f4f6fb')}" ${c.edge('#d5dbe6')}/>`); c.ball(100, 100, 40, '#e6ebf3'); c.raw('<rect x="82" y="84" width="9" height="26" rx="4" fill="#3d3d5c"/><rect x="109" y="84" width="9" height="26" rx="4" fill="#3d3d5c"/>'); c.raw('<path d="M150 20 l-14 30 h14 l-14 30" stroke="#ffd23f" stroke-width="7" fill="none" stroke-linejoin="round"/>'); };
A.helmet = c => { c.shadow(100, 176, 70, 7); c.path('M24 140 Q24 46 100 42 Q176 46 176 140 Z', '#2f7de8', { vert: true }); c.raw('<path d="M60 70 Q100 52 140 70 M50 100 Q100 80 150 100" stroke="#bfe6ff" stroke-width="7" fill="none"/>'); c.raw(`<rect x="16" y="132" width="168" height="18" rx="9" fill="${c.vg('#1f55b8')}"/>`); };
A.knife = c => { c.shadow(100, 176, 70, 6); c.raw(`<g transform="rotate(-30 100 100)"><rect x="20" y="88" width="64" height="26" rx="10" fill="${c.vg('#8b5a2b')}"/><path d="M84 88 H176 Q170 114 84 114 Z" fill="${c.vg('#d5dbe6')}" stroke="#9aa3b5" stroke-width="2"/><circle cx="36" cy="101" r="4" fill="#e8c08a"/><circle cx="66" cy="101" r="4" fill="#e8c08a"/></g>`); };
A.medicine = c => { c.shadow(100, 188, 50, 6); c.raw(`<rect x="60" y="64" width="80" height="120" rx="14" fill="${c.vg('#ff9f43')}" ${c.edge('#ff9f43')}/><rect x="54" y="40" width="92" height="30" rx="8" fill="${c.vg('#ffffff')}" stroke="#d5dbe6" stroke-width="2"/>`); c.raw('<rect x="70" y="96" width="60" height="50" rx="8" fill="#ffffff"/><path d="M100 106 v30 M85 121 h30" stroke="#ff4757" stroke-width="8"/>'); c.ell(150, 170, 16, 9, '#ff6fae'); c.ell(40, 176, 14, 8, '#4fa8ff'); };
A.stopsign = c => { c.raw('<path d="M100 120 V190" stroke="#9aa3b5" stroke-width="10"/>'); const p = Array.from({ length: 8 }, (_, k) => { const a = (k + .5) * Math.PI / 4; return `${(100 + 72 * Math.cos(a)).toFixed(1)},${(84 + 72 * Math.sin(a)).toFixed(1)}`; }).join(' '); c.raw(`<polygon points="${p}" fill="${c.vg('#ff2d3a')}" stroke="#ffffff" stroke-width="7"/><text x="100" y="102" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="50" fill="#fff" stroke="#8a0010" stroke-width="2" paint-order="stroke">قِفْ</text>`); };
A.window = c => { c.raw(`<rect x="34" y="20" width="132" height="150" rx="10" fill="${c.vg('#c98a4e')}"/><rect x="46" y="32" width="108" height="126" rx="6" fill="#9fd8ff"/><path d="M100 32 V158 M46 95 H154" stroke="#c98a4e" stroke-width="8"/><rect x="24" y="166" width="152" height="16" rx="6" fill="${c.vg('#a8693a')}"/>`); c.raw('<path d="M60 50 l20 -6 M118 50 l20 -6" stroke="#ffffff" stroke-width="5" opacity=".7"/>'); };
A.phone = c => { c.shadow(100, 190, 50, 6); c.raw(`<rect x="56" y="16" width="88" height="170" rx="18" fill="${c.vg('#2b2340')}"/><rect x="64" y="34" width="72" height="124" rx="6" fill="#bfe6ff"/><circle cx="100" cy="172" r="7" fill="#5a5470"/>`); for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) c.raw(`<rect x="${70 + k * 22}" y="${46 + r * 26}" width="16" height="18" rx="5" fill="#ffffff"/>`); };
A.s_fire = c => { A.flame(c); no(c); };
A.s_elec = c => { A.socket(c); no(c); };
A.s_road = c => { put(c, 'girlc', 70, 30, .66, '#ff6fae'); put(c, 'father', -4, 10, .8); put(c, 'trafficlight', 130, 30, .4); };
A.s_belt = c => { put(c, 'car', 0, 10, 1); };
A.s_helmet = scene('#36c45d', 'helmet', .46, 104, 90);
A.s_knife = c => { A.knife(c); no(c); };
A.s_medicine = c => { put(c, 'mother', -6, 6, .92); put(c, 'medicine', 110, 96, .42); };
A.s_swim = c => { put(c, 'father', 104, 4, .6); put(c, 'swim', 0, 0, 1); };
A.s_stranger = scene('#ffb627', 'stopsign', .52, 100, 70);
A.s_hot = c => { put(c, 'kettle', 10, 10, .9); no(c); };
A.s_window = c => { A.window(c); no(c); };
A.s_phone = scene('#2f7de8', 'phone', .48, 104, 80, undefined, 'girlc');
module.exports = lib;
