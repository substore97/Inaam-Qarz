// 3D vehicles for "مركباتي الجميلة". Extends the shared art library.
const lib = require('../../fruits-veg-book/src/food-art');
const { A, darken } = lib;

const wheel = (c, x, y, r = 20) => { c.ball(x, y, r, '#33334a', { shine: false }); c.ball(x, y, r * .5, '#d5dbe6'); };
const glass = (c, d) => c.path(d, '#bfe6ff', { vert: true });
const box = (c, x, y, w, h, col, r = 10) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);
const label = (c, x, y, txt, col = '#fff', size = 12) => c.raw(`<text x="${x}" y="${y}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="${size}" fill="${col}">${txt}</text>`);
const water = c => c.ell(100, 172, 96, 14, '#4fc3f7', { shine: true });
const road = c => c.raw('<rect x="0" y="168" width="200" height="14" rx="7" fill="#8a93a8"/><path d="M14 175 H44 M74 175 H104 M134 175 H164" stroke="#fff" stroke-width="3" stroke-linecap="round"/>');

function car(c, col, o = {}) {
  road(c);
  c.shadow(100, 168, 82, 6);
  c.path('M22 150 L22 118 Q22 102 38 100 L58 98 L76 66 Q80 60 88 60 L128 60 Q136 60 140 66 L158 98 L168 100 Q182 104 182 120 L182 150 Z', col, { vert: true, shine: [60, 108, 22, 3, 0, .6] });
  glass(c, 'M84 68 L70 96 L102 96 L102 68 Z');
  glass(c, 'M108 68 L108 96 L150 96 L134 68 Z');
  if (o.stripe) c.raw(`<rect x="24" y="138" width="156" height="9" fill="${o.stripe}"/>`);
  if (o.checker) for (let x = 24; x < 178; x += 10) c.raw(`<rect x="${x}" y="${(x / 10) % 2 ? 138 : 143}" width="10" height="5" fill="#2b2340"/>`);
  if (o.sign) { box(c, 86, 44, 32, 16, '#fff', 5); label(c, 102, 56, o.sign, '#2b2340', 10); }
  if (o.lights) { c.ell(92, 54, 9, 6, '#ff3b4f'); c.ell(112, 54, 9, 6, '#4fa8ff'); }
  if (o.text) label(c, 62, 124, o.text, o.textCol || '#2b2340', 14);
  c.ell(178, 116, 4, 7, '#fff3a0');
  c.ell(25, 116, 3, 6, '#ff6b6b');
  wheel(c, 62, 152); wheel(c, 146, 152);
  c.face(o.fx || 120, o.fy || 120, 1);
}

A.car = c => car(c, '#ff4757');
A.taxi = c => car(c, '#ffc61a', { sign: 'أُجْرَة', checker: true });
A.police = c => car(c, '#f2f5fa', { stripe: '#2f6fe0', lights: true, text: 'شُرْطَة', textCol: '#2f6fe0', fx: 136 });

A.racecar = c => {
  road(c);
  c.shadow(100, 168, 86, 6);
  c.line('M28 118 L28 102', '#33334a', 4);
  box(c, 12, 94, 34, 9, '#ff8a1f', 4);
  c.path('M18 146 Q18 124 40 120 L78 118 Q88 96 110 96 Q126 96 132 118 L174 124 Q190 128 188 146 Z', '#ff8a1f', { vert: true, shine: [70, 126, 26, 3, 0, .6] });
  glass(c, 'M92 118 Q96 102 110 102 Q122 102 124 118 Z');
  c.ball(62, 132, 11, '#ffffff', { shine: false });
  label(c, 62, 137, '١', '#ff4757', 14);
  wheel(c, 48, 148, 22); wheel(c, 160, 150, 18);
  c.face(150, 134, .62);
};

A.bus = c => {
  road(c);
  c.shadow(100, 168, 86, 6);
  box(c, 12, 46, 178, 108, '#ffb627', 18);
  for (let x = 22; x < 140; x += 30) c.raw(`<rect x="${x}" y="60" width="24" height="30" rx="5" fill="${c.vg('#bfe6ff')}" stroke="#7fb8dd" stroke-opacity=".6"/>`);
  glass(c, 'M152 58 L182 58 Q188 58 188 66 L188 104 L152 104 Z');
  c.raw('<rect x="12" y="110" width="178" height="8" fill="#e08a00" opacity=".7"/>');
  c.ell(186, 128, 4, 7, '#fff3a0');
  wheel(c, 50, 156); wheel(c, 152, 156);
  c.face(100, 134, .85);
};

A.truck = c => {
  road(c);
  c.shadow(100, 168, 86, 6);
  box(c, 10, 50, 118, 94, '#4fa8ff', 8);
  c.raw('<path d="M40 56 V138 M70 56 V138 M100 56 V138" stroke="#2f7de8" stroke-width="3" opacity=".6"/>');
  c.path('M130 150 L130 78 Q130 68 140 68 L164 68 Q172 68 176 78 L188 104 L188 150 Z', '#ff4757', { vert: true });
  glass(c, 'M140 78 L164 78 L176 104 L140 104 Z');
  c.ell(186, 122, 3, 6, '#fff3a0');
  wheel(c, 38, 154, 18); wheel(c, 92, 154, 18); wheel(c, 160, 154, 18);
  c.face(158, 128, .62);
};

A.train = c => {
  c.raw('<rect x="0" y="168" width="200" height="6" fill="#8a6a4a"/>' + [10, 40, 70, 100, 130, 160, 190].map(x => `<rect x="${x - 6}" y="166" width="12" height="12" rx="2" fill="#a07850"/>`).join(''));
  for (const [x, y, r] of [[128, 40, 9], [114, 24, 12], [96, 12, 8]]) c.ball(x, y, r, '#f4f6fb');
  c.path('M150 150 L186 150 L170 128 L150 128 Z', '#9aa3b5');
  c.raw(`<rect x="60" y="88" width="98" height="52" rx="24" fill="${c.vg('#36c45d')}" ${c.edge('#36c45d')}/>`);
  c.ell(156, 114, 9, 25, '#2e9e45');
  box(c, 122, 58, 16, 32, '#3d3d5c', 4);
  box(c, 116, 52, 28, 10, '#3d3d5c', 4);
  box(c, 14, 54, 56, 94, '#ff4757', 8);
  box(c, 8, 46, 68, 12, '#c2364f', 6);
  glass(c, 'M24 66 L58 66 L58 96 L24 96 Z');
  wheel(c, 40, 152, 18); wheel(c, 88, 154, 15); wheel(c, 124, 154, 15);
  c.face(104, 112, .9);
};

A.bicycle = c => {
  road(c);
  c.shadow(100, 168, 80, 6);
  for (const x of [50, 150]) {
    c.raw(`<circle cx="${x}" cy="132" r="32" fill="none" stroke="#33334a" stroke-width="8"/>`);
    c.raw(`<path d="M${x - 28} 132 H${x + 28} M${x} 104 V160 M${x - 20} 112 L${x + 20} 152 M${x + 20} 112 L${x - 20} 152" stroke="#c5ccd8" stroke-width="1.5"/>`);
    c.ball(x, 132, 5, '#d5dbe6');
  }
  c.line('M50 132 L98 132 L84 84 Z M84 84 L136 88 L98 132 M136 80 L150 132', '#ff4757', 7);
  c.line('M136 80 L130 64 M124 62 L144 60', '#33334a', 5);
  c.ell(82, 78, 15, 5, '#33334a');
  c.ball(98, 132, 7, '#9aa3b5');
};

A.motorcycle = c => {
  road(c);
  c.shadow(100, 168, 80, 6);
  c.line('M150 104 L156 146', '#9aa3b5', 6);
  c.line('M146 100 L140 78 M134 76 L152 74', '#33334a', 5);
  c.raw(`<rect x="20" y="124" width="46" height="9" rx="4.5" fill="${c.vg('#c5ccd8')}"/>`);
  c.path('M56 124 Q64 98 96 96 L130 98 Q152 100 152 116 L142 130 L66 132 Z', '#9b59d6', { vert: true, shine: [90, 104, 22, 4, -5, .6] });
  c.path('M54 98 Q76 90 96 98 L94 104 Q74 98 56 104 Z', '#33334a');
  c.ball(156, 100, 8, '#fff3a0');
  wheel(c, 48, 146, 24); wheel(c, 156, 146, 24);
  c.face(108, 116, .72);
};

A.ambulance = c => {
  road(c);
  c.shadow(100, 168, 86, 6);
  c.ell(80, 50, 10, 7, '#ff3b4f');
  c.path('M12 150 L12 68 Q12 56 24 56 L130 56 Q142 56 148 64 L178 100 Q186 106 186 118 L186 150 Z', '#f7f9fc', { vert: true, shine: [50, 70, 30, 4, 0, .7] });
  glass(c, 'M136 66 L170 102 L136 102 Z');
  c.raw('<rect x="14" y="112" width="170" height="10" fill="#ff3b4f"/>');
  c.raw(`<mask id="${c.id}cr"><rect width="200" height="200" fill="#fff"/><circle cx="76" cy="84" r="13" fill="#000"/></mask><circle cx="70" cy="88" r="16" fill="#ff3b4f" mask="url(#${c.id}cr)"/>`);
  c.ell(184, 126, 3, 6, '#fff3a0');
  wheel(c, 50, 154); wheel(c, 150, 154);
  c.face(104, 138, .85);
};

A.firetruck = c => {
  road(c);
  c.shadow(100, 168, 88, 6);
  box(c, 8, 74, 124, 76, '#ff3b30', 8);
  c.raw('<path d="M12 62 H150 M12 70 H150" stroke="#c5ccd8" stroke-width="4"/>' + Array.from({ length: 12 }, (_, k) => `<path d="M${16 + k * 11} 62 V70" stroke="#c5ccd8" stroke-width="3"/>`).join(''));
  c.raw('<path d="M30 74 V62 M120 74 V62" stroke="#9aa3b5" stroke-width="4"/>');
  c.ball(56, 110, 18, '#d5dbe6'); c.ball(56, 110, 8, '#9aa3b5', { shine: false });
  c.path('M132 150 L132 82 Q132 74 140 74 L164 74 Q172 74 176 84 L188 106 L188 150 Z', '#ff3b30', { vert: true });
  glass(c, 'M140 84 L164 84 L176 106 L140 106 Z');
  c.ell(152, 70, 8, 6, '#4fa8ff');
  c.raw('<rect x="8" y="124" width="180" height="6" fill="#ffd23f"/>');
  wheel(c, 36, 154, 18); wheel(c, 96, 154, 18); wheel(c, 162, 154, 18);
  c.face(100, 100, .8);
};

A.tractor = c => {
  c.raw('<rect x="0" y="168" width="200" height="12" rx="6" fill="#a0784a"/>');
  c.shadow(100, 168, 84, 6);
  c.cyl(140, 58, 9, 40, '#5a5a6e', 3);
  box(c, 36, 44, 64, 10, '#2e9e45', 4);
  c.raw('<path d="M42 54 V100 M94 54 V100" stroke="#2e9e45" stroke-width="6"/>');
  glass(c, 'M46 56 L90 56 L90 96 L46 96 Z');
  c.path('M36 100 L176 100 Q186 100 186 112 L186 140 L36 140 Z', '#36c45d', { vert: true, shine: [110, 108, 30, 3, 0, .6] });
  c.ball(180, 114, 6, '#fff3a0');
  c.ball(60, 128, 40, '#33334a', { shine: false }); c.ball(60, 128, 20, '#ffd23f');
  c.ball(158, 150, 22, '#33334a', { shine: false }); c.ball(158, 150, 11, '#ffd23f');
  c.face(130, 120, .72);
};

A.ship = c => {
  water(c);
  for (const [x, h] of [[80, 30], [104, 24]]) { box(c, x, 64 - h + 30, 16, h, '#ff4757', 3); c.raw(`<rect x="${x}" y="${64 - h + 30}" width="16" height="6" fill="#33334a"/>`); }
  box(c, 66, 70, 70, 26, '#ffffff', 6);
  box(c, 44, 92, 116, 30, '#f4f6fb', 6);
  for (let x = 54; x < 154; x += 18) c.raw(`<rect x="${x}" y="100" width="12" height="12" rx="3" fill="#bfe6ff"/>`);
  c.path('M8 120 L192 120 L172 162 L28 162 Z', '#2f4f8f', { vert: true });
  c.path('M24 152 L176 152 L172 162 L28 162 Z', '#ff4757', { flat: true });
  c.face(100, 136, .85, { blush: true });
};

A.sailboat = c => {
  water(c);
  c.line('M100 26 V132', '#8b5a2b', 5);
  c.path('M100 22 L122 28 L100 34 Z', '#ff4757', { flat: true });
  c.path('M106 36 L106 124 L172 124 Z', '#ffffff', { vert: true });
  c.path('M94 46 L94 124 L36 124 Z', '#ffb3c7', { vert: true });
  c.path('M24 128 L176 128 Q166 162 132 164 L68 164 Q34 162 24 128 Z', '#e67e22', { vert: true, shine: [60, 136, 24, 3, 0, .6] });
  c.face(100, 145, .8);
};

A.submarine = c => {
  for (const [x, y, r] of [[160, 40, 6], [172, 24, 4], [150, 20, 3], [30, 50, 5]])
    c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#bfe9ff" opacity=".8" stroke="#7fcff5"/>`);
  c.line('M104 62 V40 H120', '#9aa3b5', 5);
  box(c, 78, 58, 44, 34, '#ffc61a', 10);
  c.ell(16, 112, 7, 18, '#9aa3b5');
  c.ell(100, 114, 82, 42, '#ffd23f', { shine: true });
  for (const x of [52, 148]) { c.ball(x, 108, 11, '#9aa3b5', { shine: false }); c.ball(x, 108, 7.5, '#bfe6ff'); }
  c.face(100, 118, .95);
  c.shadow(100, 184, 60, 6, .12);
};

A.motorboat = c => {
  water(c);
  c.drop(186, 128, .7, '#bfe9ff').drop(176, 112, .6, '#bfe9ff');
  box(c, 4, 108, 16, 34, '#3d3d5c', 4);
  glass(c, 'M108 120 L124 94 L142 94 L142 120 Z');
  c.path('M14 120 L168 120 Q196 122 186 142 L160 162 L30 162 Q16 150 14 120 Z', '#ffffff', { vert: true, shine: [60, 128, 30, 3, 0, .7] });
  c.raw('<path d="M18 138 L182 138" stroke="#ff4757" stroke-width="7"/>');
  c.face(96, 150, .7);
};

A.helicopter = c => {
  c.shadow(100, 186, 70, 7, .15);
  c.line('M60 140 L56 156 M136 140 L140 156 M40 156 H160', '#5a5a6e', 5);
  c.path('M54 98 L10 90 L10 104 L54 118 Z', '#ff8a1f', { vert: true });
  c.ell(10, 96, 4, 16, '#5a5a6e');
  c.ell(96, 106, 56, 42, '#ff8a1f', { shine: true });
  c.ell(128, 98, 22, 24, '#bfe6ff', { noEdge: true });
  c.raw('<rect x="92" y="54" width="10" height="12" fill="#5a5a6e"/>');
  c.ell(98, 52, 88, 5, '#3d3d5c');
  c.face(84, 114, .85);
};

A.hotair = c => {
  for (const [x, y, s] of [[30, 40, .8], [170, 60, .7]]) c.ball(x - 10 * s, y, 10 * s, '#ffffff').ball(x + 4 * s, y - 5 * s, 13 * s, '#ffffff').ball(x + 16 * s, y, 9 * s, '#ffffff');
  c.line('M78 140 L86 166 M122 140 L114 166', '#8b5a2b', 2.5);
  c.path('M70 132 Q100 158 130 132 L120 146 Q100 154 80 146 Z', '#c2364f', { flat: true });
  c.ell(100, 76, 64, 72, '#ff4757');
  c.ell(100, 76, 42, 72, '#ffd23f', { noEdge: true });
  c.ell(100, 76, 18, 72, '#4fa8ff', { noEdge: true });
  c.shine(66, 40, 14, 7, -40, .7);
  box(c, 80, 162, 40, 26, '#b5733f', 6);
  c.raw('<path d="M80 172 H120 M90 162 V188 M100 162 V188 M110 162 V188" stroke="#8b5a2b" stroke-width="1.5"/>');
  c.face(100, 84, 1.05);
};

A.house = c => {
  c.shadow(100, 186, 62, 7);
  box(c, 46, 96, 108, 86, '#ffe3b3', 6);
  c.path('M34 100 L100 40 L166 100 Z', '#ff6b4a', { vert: true });
  box(c, 86, 132, 28, 50, '#b5733f', 5);
  c.raw('<rect x="56" y="112" width="22" height="22" rx="4" fill="#bfe6ff"/><rect x="122" y="112" width="22" height="22" rx="4" fill="#bfe6ff"/>');
};

A.trafficlight = c => {
  c.shadow(100, 192, 40, 6);
  c.cyl(94, 150, 12, 38, '#5a5a6e', 3);
  box(c, 62, 8, 76, 146, '#3d3d5c', 18);
  for (const [y, col] of [[38, '#ff3b30'], [80, '#ffc61a'], [122, '#36c45d']]) { c.ball(100, y, 17, col); }
};

module.exports = lib;
