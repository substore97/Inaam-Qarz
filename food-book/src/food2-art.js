// 3D foods for "طعامي الجميل". Extends the shared art library.
const lib = require('../../clothes-book/src/clothes-art');
const { A } = lib;

const bowl = (c, col = '#ffffff', rim = '#4fa8ff') => {
  c.path('M24 104 L176 104 Q170 170 100 176 Q30 170 24 104 Z', col, { vert: true, shine: [56, 124, 20, 5, 10, .6] });
  c.raw(`<path d="M24 104 L176 104" stroke="${rim}" stroke-width="6" stroke-linecap="round"/>`);
};

A.bread = c => {
  c.shadow(100, 176, 80, 8);
  c.path('M22 130 Q16 70 70 62 Q100 50 130 62 Q184 70 178 130 Q176 160 100 162 Q24 160 22 130 Z', '#e8a85a', { shine: [60, 80, 22, 7, -10, .7] });
  c.raw('<path d="M60 76 Q70 96 64 116 M96 68 Q106 90 100 114 M134 76 Q144 96 138 116" stroke="#c98234" stroke-width="5" stroke-linecap="round" fill="none"/>');
  c.face(100, 132, .9);
};
A.egg = c => {
  c.shadow(100, 182, 52, 7);
  c.path('M100 26 C146 26 162 100 152 136 C142 172 58 172 48 136 C38 100 54 26 100 26 Z', '#fff6e6', { shine: [76, 62, 8, 18, 15, .8] });
  c.face(100, 118, 1);
};
A.milk = c => {
  c.shadow(100, 190, 52, 7);
  c.path('M60 54 L140 54 L148 80 L148 182 L52 182 L52 80 Z', '#ffffff', { vert: true });
  c.path('M60 54 L100 26 L140 54 Z', '#e6ebf3', { vert: true });
  c.raw('<rect x="88" y="16" width="24" height="14" rx="3" fill="#4fa8ff"/><path d="M52 120 Q76 108 100 120 T148 120 L148 182 L52 182 Z" fill="#4fa8ff" opacity=".9"/>');
  c.raw('<g transform="translate(64 128) scale(.36)">'); A.cow(c); c.raw('</g>');
  c.face(100, 94, .85);
};
A.cheese = c => {
  c.shadow(100, 178, 80, 8);
  c.path('M20 110 L170 64 L180 76 L180 156 L20 160 Z', '#ffd23f', { vert: true });
  c.path('M20 110 L170 64 L180 76 L32 118 Z', '#ffe680', { flat: true });
  for (const [x, y, r] of [[60, 136, 10], [110, 120, 8], [148, 140, 12], [90, 150, 6], [150, 100, 7]]) c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#f0b90b"/>`);
  c.face(100, 140, .75);
};
A.rice = c => {
  c.shadow(100, 186, 76, 8);
  for (let i = 0; i < 40; i++) { const x = 40 + (i * 37) % 120, y = 60 + ((i * 53) % 46); c.ell(x, y, 6, 3, '#ffffff', { rot: (i * 47) % 180, noEdge: true }); }
  c.path('M34 104 Q40 50 100 48 Q160 50 166 104 Z', '#fffdf6', { vert: true, noEdge: true });
  for (let i = 0; i < 22; i++) { const x = 46 + (i * 41) % 108, y = 64 + ((i * 29) % 36); c.ell(x, y, 5, 2.4, '#f2ecdc', { rot: (i * 61) % 180, flat: true, noEdge: true }); }
  bowl(c, '#ff8a6b', '#e8573a');
  c.face(100, 140, .85);
};
A.honey = c => {
  c.shadow(100, 188, 56, 7);
  c.raw(`<rect x="44" y="60" width="112" height="124" rx="30" fill="${c.vg('#ffb627')}" ${c.edge('#ffb627')} fill-opacity=".95"/>`);
  c.raw(`<rect x="52" y="36" width="96" height="28" rx="8" fill="${c.vg('#c98a4e')}"/><path d="M52 64 Q66 82 80 64 Q94 86 108 64 Q122 80 136 64 Q146 74 148 64" fill="#ffc93b"/>`);
  c.raw('<rect x="62" y="104" width="76" height="40" rx="12" fill="#fff6e0"/><text x="100" y="132" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="22" fill="#c46a00">عَسَل</text>');
  c.shine(60, 90, 6, 20, 0, .6);
  c.raw('<g transform="translate(130 20) scale(.3)">'); A.bee(c); c.raw('</g>');
  c.face(100, 164, .6, { blush: false });
};
A.dates = c => {
  c.ell(100, 150, 86, 26, '#e6ebf3', { shine: true });
  for (const [x, y, r] of [[56, 128, -20], [96, 120, 10], [136, 128, 30], [76, 102, 40], [118, 100, -30]]) c.ell(x, y, 22, 13, '#7a3a1e', { rot: r, shine: true });
  c.face(96, 120, .55, { blush: false });
};
A.soup = c => {
  c.shadow(100, 186, 76, 8);
  c.line('M70 64 Q60 44 72 30 M100 60 Q90 40 102 24 M130 64 Q120 44 132 30', '#c5ccd8', 4);
  c.ell(100, 104, 74, 14, '#ff9f43', { noEdge: true });
  for (const [x, y, col] of [[70, 102, '#ff8a1f'], [104, 100, '#36c45d'], [130, 106, '#ff8a1f'], [88, 108, '#ffd23f']]) c.ball(x, y, 6, col, { shine: false });
  bowl(c, '#ffffff', '#ff4757');
  c.face(100, 140, .9);
};
A.sandwich = c => {
  c.shadow(100, 184, 80, 8);
  c.path('M20 140 L180 140 L170 170 L30 170 Z', '#e8a85a', { vert: true });
  c.path('M24 132 Q50 120 76 134 Q102 120 128 134 Q154 120 176 132 L176 142 L24 142 Z', '#45d36a', { flat: true });
  c.raw('<rect x="24" y="118" width="152" height="16" rx="5" fill="#ffd23f"/><rect x="28" y="104" width="144" height="14" rx="5" fill="#ff6b6b"/>');
  c.path('M18 106 Q20 56 100 52 Q180 56 182 106 Z', '#f2b768', { vert: true, shine: [60, 70, 20, 6, -10, .7] });
  for (const [x, y] of [[70, 74], [100, 66], [130, 74], [86, 88], [116, 88]]) c.ell(x, y, 3, 2, '#fff6e0', { flat: true, noEdge: true });
  c.face(100, 154, .6, { blush: false });
};
A.cookies = c => {
  c.shadow(100, 180, 76, 8);
  for (const [x, y, r] of [[64, 120, 44], [136, 116, 42], [100, 76, 40]]) {
    c.ball(x, y, r, '#d99a55');
    for (const [dx, dy] of [[-14, -10], [12, -16], [0, 8], [16, 12], [-18, 14]]) c.raw(`<circle cx="${x + dx * r / 44}" cy="${y + dy * r / 44}" r="${4 * r / 44}" fill="#6b3e1f"/>`);
  }
  c.face(100, 80, .7);
};
A.olives = c => {
  c.shadow(100, 186, 76, 8);
  for (const [x, y] of [[60, 92], [84, 80], [110, 82], [136, 92], [74, 100], [98, 98], [124, 102]]) { c.ell(x, y, 13, 16, '#6b8e23', { rot: 20 }); }
  c.ell(150, 60, 24, 9, '#45d36a', { rot: -30 }).ell(160, 80, 22, 8, '#3cb95a', { rot: 20 });
  bowl(c, '#ffffff', '#36c45d');
  c.face(100, 140, .85);
};
A.yogurt = c => {
  c.shadow(100, 188, 52, 7);
  c.path('M54 70 L146 70 L136 180 L64 180 Z', '#ffffff', { vert: true });
  c.raw('<rect x="48" y="58" width="104" height="16" rx="6" fill="#ff6fae"/>');
  c.raw('<g transform="translate(74 104) scale(.26)">'); A.strawberry(c); c.raw('</g>');
  c.ell(100, 58, 46, 8, '#ffe0ef');
  c.face(100, 150, .75);
};
A.water = c => {
  c.shadow(100, 190, 44, 7);
  c.raw(`<rect x="86" y="14" width="28" height="20" rx="5" fill="${c.vg('#2f7de8')}"/>`);
  c.path('M88 34 L112 34 L112 46 Q140 58 140 86 L140 176 Q140 186 128 186 L72 186 Q60 186 60 176 L60 86 Q60 58 88 46 Z', '#bfe6ff', { vert: true });
  c.raw('<path d="M60 110 Q80 102 100 110 T140 110 L140 176 Q140 186 128 186 L72 186 Q60 186 60 176 Z" fill="#6cc4ff" opacity=".7"/>');
  c.raw('<rect x="64" y="90" width="72" height="26" rx="8" fill="#ffffff"/><text x="100" y="109" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="16" fill="#2f7de8">مَاء</text>');
  c.shine(72, 70, 4, 20, 0, .8);
  c.face(100, 146, .75);
};
A.pancakes = c => {
  c.ell(100, 168, 88, 16, '#e6ebf3', { shine: true });
  for (let i = 0; i < 4; i++) { const y = 150 - i * 20; c.ell(100, y, 66, 18, '#e8a85a'); c.ell(100, y - 4, 64, 14, '#f2c27a', { noEdge: true }); }
  c.path('M56 82 Q100 60 144 82 Q140 96 126 92 Q118 110 108 96 Q96 104 88 94 Q72 100 64 92 Q52 92 56 82 Z', '#ffb627', { shine: [80, 76, 10, 3, 0, .7] });
  c.raw(`<rect x="88" y="62" width="24" height="12" rx="3" fill="#fff6c9"/>`);
  c.face(100, 126, .7, { blush: false });
};
A.juice = c => A.cup(c, 1);
module.exports = lib;
