// 3D clothes for "ملابسي الجميلة". Extends the shared art library.
const lib = require('../../birds-book/src/birds-art');
const { A } = lib;

const btn = (c, x, y) => c.raw(`<circle cx="${x}" cy="${y}" r="4" fill="#ffffff" stroke="#c5ccd8" stroke-width="1.5"/>`);

A.shirt = (c, col = '#4fa8ff') => {
  c.shadow(100, 190, 66, 7);
  c.path('M70 30 L40 40 L14 84 L40 100 L52 80 L52 182 L148 182 L148 80 L160 100 L186 84 L160 40 L130 30 Q100 54 70 30 Z', col, { vert: true, shine: [70, 70, 8, 30, 0, .5] });
  c.path('M70 30 L100 60 L86 72 L64 38 Z M130 30 L100 60 L114 72 L136 38 Z', '#ffffff', { flat: true });
  for (const y of [86, 110, 134, 158]) btn(c, 100, y);
  c.raw(`<rect x="118" y="96" width="22" height="18" rx="4" fill="none" stroke="#ffffff" stroke-width="2.5" opacity=".7"/>`);
  c.face(76, 126, .8);
};
A.pants = c => {
  c.shadow(100, 192, 60, 7);
  c.path('M50 22 L150 22 L158 186 L112 186 L100 80 L88 186 L42 186 Z', '#3d6ef0', { vert: true, shine: [62, 70, 6, 40, 4, .5] });
  c.raw('<rect x="50" y="22" width="100" height="16" fill="#2f55c4"/><path d="M100 38 V80" stroke="#2f55c4" stroke-width="3"/><path d="M60 50 Q70 64 84 52 M140 50 Q130 64 116 52" stroke="#7fa6ff" stroke-width="3" fill="none"/>');
  btn(c, 100, 30);
  c.face(100, 58, .55, { blush: false });
};
A.dress = c => {
  c.shadow(100, 192, 70, 7);
  c.path('M74 20 L84 20 Q100 36 116 20 L126 20 L134 70 L120 84 L172 182 L28 182 L80 84 L66 70 Z', '#ff6fae', { vert: true, shine: [70, 120, 8, 30, 20, .5] });
  c.raw('<path d="M72 80 Q100 92 128 80" stroke="#ffffff" stroke-width="6" fill="none"/><path d="M30 176 Q48 166 64 176 T100 176 T136 176 T170 176" stroke="#ffffff" stroke-width="4" fill="none"/>');
  c.ball(100, 82, 7, '#ffd23f');
  for (const [x, y] of [[80, 130], [116, 150], [100, 116], [130, 120], [68, 160]]) c.raw(`<circle cx="${x}" cy="${y}" r="4" fill="#ffd2e6"/>`);
  c.face(100, 54, .75);
};
A.thobe = c => {
  c.shadow(100, 192, 56, 7);
  c.path('M72 22 L46 34 L22 90 L44 100 L60 76 L58 188 L142 188 L140 76 L156 100 L178 90 L154 34 L128 22 Q100 40 72 22 Z', '#f7f9fc', { vert: true, shine: [76, 80, 8, 40, 0, .6] });
  c.raw('<path d="M90 26 Q100 34 110 26 L106 70 L94 70 Z" fill="#e6ebf3" stroke="#c5ccd8"/>');
  for (const y of [40, 52, 64]) btn(c, 100, y);
  c.face(100, 116, .85);
};
A.shoes = c => {
  c.shadow(100, 176, 86, 8);
  for (const [dx, col] of [[0, '#ff4757'], [70, '#ff4757']]) {
    c.raw(`<g transform="translate(${dx - 30} ${dx ? 10 : 0})">`);
    c.path('M40 150 L40 100 Q40 84 58 84 L78 84 Q84 110 110 116 Q132 120 132 140 L132 150 Z', col, { vert: true });
    c.raw('<rect x="36" y="146" width="100" height="12" rx="6" fill="#ffffff"/><path d="M60 96 L76 104 M60 108 L80 114" stroke="#ffffff" stroke-width="3"/>');
    c.raw('</g>');
  }
  c.face(130, 136, .55, { blush: false });
};
A.sock = (c, col = '#ffd23f') => {
  c.shadow(100, 188, 46, 6);
  c.path('M70 20 L130 20 L130 120 Q130 132 140 138 Q166 150 160 172 Q152 190 120 184 L82 176 Q64 172 66 150 L70 120 Z', col, { vert: true, shine: [84, 60, 6, 26, 0, .5] });
  c.raw(`<rect x="68" y="20" width="64" height="18" rx="4" fill="#ffffff" opacity=".85"/><path d="M70 70 H130 M70 92 H130" stroke="#ffffff" stroke-width="6" opacity=".7"/>`);
  c.face(100, 54, .6, { blush: false });
};
A.socks = c => { c.raw('<g transform="translate(-34 14) scale(.82)">'); A.sock(c, '#ffd23f'); c.raw('</g><g transform="translate(52 24) scale(.82)">'); A.sock(c, '#ffd23f'); c.raw('</g>'); };
A.boots = c => {
  c.ell(100, 182, 84, 10, '#8fd6ff', { shine: true });
  for (const dx of [0, 70]) {
    c.raw(`<g transform="translate(${dx - 30} ${dx ? 8 : 0})">`);
    c.path('M46 40 L94 40 L94 120 Q96 132 116 136 Q136 140 134 166 L44 166 Z', '#ffc61a', { vert: true });
    c.raw('<rect x="40" y="160" width="98" height="12" rx="6" fill="#e0a400"/><rect x="44" y="40" width="52" height="12" rx="4" fill="#e0a400"/>');
    c.raw('</g>');
  }
  c.face(68, 100, .6);
};
A.coat = c => {
  c.shadow(100, 192, 66, 7);
  c.path('M72 22 L42 36 L18 120 L42 128 L54 90 L54 184 L146 184 L146 90 L158 128 L182 120 L158 36 L128 22 L100 46 Z', '#c0392b', { vert: true, shine: [66, 80, 8, 40, 4, .5] });
  c.path('M72 22 L100 46 L100 184 L84 184 L84 70 Z', '#a83226', { flat: true, opacity: .5 });
  c.path('M72 22 L100 46 L82 66 L64 30 Z M128 22 L100 46 L118 66 L136 30 Z', '#e8705a', { flat: true });
  for (const y of [80, 110, 140]) { btn(c, 92, y); btn(c, 108, y); }
  c.raw('<path d="M60 136 H82 M118 136 H140" stroke="#8a2a20" stroke-width="3"/>');
  c.face(100, 162, .55, { blush: false });
};
A.scarf = c => {
  c.shadow(100, 188, 60, 7);
  c.path('M40 50 Q100 20 160 50 Q166 80 150 90 Q100 66 50 90 Q34 80 40 50 Z', '#9b59d6', { vert: true });
  c.path('M120 80 L150 84 L156 184 L126 184 Z', '#9b59d6', { vert: true });
  c.raw('<path d="M126 110 H152 M126 140 H154" stroke="#ffd23f" stroke-width="6"/><path d="M128 184 v10 M136 184 v10 M144 184 v10 M152 184 v10" stroke="#9b59d6" stroke-width="3"/>');
  c.raw('<path d="M44 60 Q100 34 156 60" stroke="#ffd23f" stroke-width="6" fill="none"/>');
  c.face(100, 54, .7);
};
A.gloves = c => {
  c.shadow(100, 186, 80, 7);
  for (const [dx, flip] of [[50, 1], [150, -1]]) {
    c.raw(`<g transform="translate(${dx} 0) scale(${flip} 1) translate(-50 0)">`);
    c.path('M26 150 L26 70 Q26 50 46 50 L60 50 Q76 50 76 70 L76 96 L90 82 Q100 76 104 88 L82 124 L78 150 Z', '#36c45d', { vert: true });
    c.raw('<rect x="22" y="144" width="60" height="20" rx="6" fill="#ffffff"/>');
    c.raw('</g>');
  }
  c.face(50, 104, .6);
};
A.glasses = c => {
  c.shadow(100, 160, 80, 6);
  c.line('M20 82 L6 70 M180 82 L194 70', '#3d3d5c', 6);
  for (const x of [56, 144]) { c.raw(`<rect x="${x - 40}" y="64" width="80" height="62" rx="26" fill="${c.vg('#2f4f8f')}" stroke="#ff4757" stroke-width="8"/>`); c.shine(x - 16, 82, 12, 6, -25, .7); }
  c.line('M96 84 Q100 76 104 84', '#ff4757', 7);
  c.face(100, 140, .6, { blush: false });
};
A.bag = c => {
  c.shadow(100, 190, 70, 7);
  c.line('M70 40 Q70 14 100 14 Q130 14 130 40', '#c0392b', 8);
  c.raw(`<rect x="34" y="40" width="132" height="146" rx="30" fill="${c.vg('#ff4757')}" ${c.edge('#ff4757')}/>`);
  c.raw(`<rect x="54" y="110" width="92" height="60" rx="16" fill="${c.vg('#ff6b78')}" stroke="#c0392b" stroke-opacity=".5"/><path d="M54 126 H146" stroke="#c0392b" stroke-width="3" opacity=".5"/>`);
  c.ball(100, 126, 6, '#ffd23f');
  c.shine(62, 66, 18, 6, -15, .6);
  c.face(100, 76, .9);
};
A.pajamas = c => {
  c.shadow(100, 192, 66, 7);
  c.path('M72 20 L44 30 L20 76 L42 88 L56 70 L56 124 L144 124 L144 70 L158 88 L180 76 L156 30 L128 20 Q100 40 72 20 Z', '#8fa8ff', { vert: true });
  c.path('M58 122 L142 122 L148 188 L110 188 L100 140 L90 188 L52 188 Z', '#7f96f0', { vert: true });
  for (const [x, y] of [[80, 50], [124, 60], [70, 96], [120, 100], [96, 76], [76, 160], [124, 164]]) c.star(x, y, 7, '#ffe680');
  c.raw('<g transform="translate(108 30) scale(.16)">'); A.moon(c); c.raw('</g>');
  c.face(100, 100, .6, { mode: 'sleep', keep: true });
};
module.exports = lib;
