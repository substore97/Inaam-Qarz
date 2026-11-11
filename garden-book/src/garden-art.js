// 3D plants for "حديقتي الجميلة". Extends the shared art library.
const lib = require('../../sounds-book/src/sounds-art');
const { A } = lib;
const soil = c => c.ell(100, 176, 80, 16, '#8b5a2b', { shine: true });

A.seed = c => { soil(c); c.ell(100, 142, 34, 24, '#c98a4e', { rot: -20, shine: true }); c.line('M78 150 Q100 136 122 132', '#a8693a', 3); c.face(100, 140, .75); };
A.sprout = c => {
  soil(c);
  c.line('M100 172 Q98 130 102 96', '#4cae4c', 8);
  c.ell(76, 92, 28, 13, '#6fd03a', { rot: -30, shine: true }).ell(126, 84, 28, 13, '#5cc43a', { rot: 30 });
  c.face(100, 150, .7);
};
A.greenleaf = c => {
  c.shadow(100, 182, 50, 6, .15);
  c.line('M100 176 Q102 166 106 158', '#3cae4c', 5);
  c.path('M100 160 C40 140 40 60 100 24 C160 60 160 140 100 160 Z', '#4cd964', { shine: [76, 70, 8, 20, 20, .6] });
  c.line('M100 158 V40 M100 120 L70 96 M100 120 L130 96 M100 88 L76 68 M100 88 L124 68', '#2fae52', 2.5);
  c.face(100, 108, .9);
};
A.sunflower = c => {
  c.line('M100 120 Q96 160 100 190', '#3cae4c', 9);
  c.ell(76, 160, 22, 10, '#4cd964', { rot: 30 }).ell(124, 150, 22, 10, '#4cd964', { rot: -30 });
  for (let i = 0; i < 14; i++) { const a = i * Math.PI / 7; c.ell((100 + 46 * Math.cos(a)).toFixed(1), (80 + 46 * Math.sin(a)).toFixed(1), 12, 22, '#ffc61a', { rot: (a * 180 / Math.PI + 90).toFixed(0) }); }
  c.ball(100, 80, 34, '#8b5a2b');
  for (let i = 0; i < 14; i++) c.raw(`<circle cx="${100 + 18 * Math.cos(i * 2.4) * (i % 3 + 1) / 3}" cy="${80 + 18 * Math.sin(i * 2.4) * (i % 3 + 1) / 3}" r="2" fill="#5a3a22"/>`);
  c.face(100, 84, .8);
};
A.palm = c => {
  c.ell(100, 184, 76, 12, '#f2d9a8', { shine: true });
  c.path('M92 184 Q86 120 100 70 L108 72 Q100 120 110 184 Z', '#b5733f', { cyl: true });
  c.raw('<path d="M90 160 h20 M92 136 h18 M94 112 h16 M96 90 h14" stroke="#8b5a2b" stroke-width="3"/>');
  for (const r of [-170, -135, -90, -45, -10, 160, 20]) { const t = r * Math.PI / 180; c.ell((104 + 40 * Math.cos(t)).toFixed(1), (66 + 30 * Math.sin(t) + 14).toFixed(1), 42, 11, r === -90 ? '#4cd964' : '#36c45d', { rot: (r > 90 || r < -90 ? r + 180 + 20 : r - 20).toFixed(0) }); }
  for (const [x, y] of [[96, 78], [110, 80], [102, 86]]) c.ball(x, y, 6, '#7a3a1e');
  c.face(102, 140, .6, { blush: false });
};
A.cactus = c => {
  c.path('M64 150 L136 150 L126 190 L74 190 Z', '#e67e22', { cyl: true });
  c.raw(`<rect x="58" y="142" width="84" height="14" rx="5" fill="${c.vg('#f39c4a')}"/>`);
  c.path('M48 100 Q44 70 60 72 Q70 74 70 96 L70 112 L82 112 L82 128 L64 128 Q48 126 48 100 Z', '#4cae4c');
  c.path('M152 84 Q156 56 140 58 Q130 60 130 84 L130 104 L118 104 L118 120 L136 120 Q152 118 152 84 Z', '#4cae4c');
  c.raw(`<rect x="76" y="40" width="48" height="108" rx="24" fill="${c.lg('#5cc43a')}" ${c.edge('#5cc43a')}/>`);
  c.ball(100, 40, 9, '#ff6fae');
  for (const [x, y] of [[86, 70], [114, 76], [90, 104], [112, 118], [56, 90], [144, 74]]) c.line(`M${x - 4} ${y} h8`, '#e8ffd0', 2);
  c.face(100, 96, .8);
};
A.grass = c => {
  c.ell(100, 178, 90, 14, '#8b5a2b');
  for (let i = 0; i < 16; i++) { const x = 18 + i * 11, h = 50 + (i * 37) % 40; c.path(`M${x - 6} 178 Q${x} ${178 - h} ${x + 10} ${170 - h} Q${x + 4} ${178 - h * .6} ${x + 6} 178 Z`, i % 2 ? '#4cd964' : '#36c45d', { flat: true }); }
  c.ball(150, 120, 8, '#ffd23f').ball(46, 128, 7, '#ff6fae');
  c.face(100, 150, .8);
};
A.pot = c => {
  c.line('M100 120 V70', '#3cae4c', 7);
  for (const [x, y, r] of [[78, 92, -30], [122, 84, 30], [84, 62, -20], [118, 54, 20]]) c.ell(x, y, 22, 11, '#4cd964', { rot: r });
  c.ball(100, 40, 14, '#ff4757');
  c.path('M54 122 L146 122 L132 188 L68 188 Z', '#e67e22', { cyl: true });
  c.raw(`<rect x="48" y="114" width="104" height="18" rx="6" fill="${c.vg('#f39c4a')}"/>`);
  c.face(100, 156, .9);
};
A.wateringcan = c => {
  c.shadow(100, 184, 70, 7);
  for (const [x, y] of [[176, 120], [186, 140], [170, 150]]) c.drop(x, y, .7, '#4fb3ff');
  c.path('M130 110 L176 70 L184 80 L140 128 Z', '#2f9e45');
  c.ell(180, 74, 8, 12, '#2f9e45', { rot: 40 });
  c.line('M60 70 Q100 30 130 80', '#2f9e45', 10);
  c.raw(`<rect x="40" y="76" width="100" height="100" rx="20" fill="${c.vg('#36c45d')}" ${c.edge('#36c45d')}/>`);
  c.shine(56, 100, 6, 24, 0, .6);
  c.face(90, 126, .95);
};
A.gtree = c => A.tree(c, 'summer');
A.growing = c => {
  soil(c);
  c.line('M100 172 Q96 120 100 70', '#4cae4c', 8);
  for (const [x, y, r] of [[78, 140, -30], [122, 128, 30], [80, 104, -30], [120, 92, 30]]) c.ell(x, y, 22, 10, '#5cc43a', { rot: r });
  c.ell(100, 64, 12, 18, '#ff8fb1');
};
module.exports = lib;
