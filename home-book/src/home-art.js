// 3D household objects for "بيتي الجميل". Extends the shared art library.
const lib = require('../../seasons-book/src/weather-art');
const { A } = lib;

const box = (c, x, y, w, h, col, r = 10) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);
const glass = (c, x, y, w, h, r = 6) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg('#bfe6ff')}" stroke="#7fb8dd" stroke-opacity=".6"/>`);

A.bed = c => {
  c.shadow(100, 186, 86, 8);
  box(c, 14, 70, 22, 110, '#b5733f', 8);
  box(c, 164, 110, 22, 70, '#b5733f', 8);
  box(c, 20, 120, 160, 40, '#c98a4e', 8);
  box(c, 28, 104, 150, 26, '#f4f6fb', 12);
  c.path('M70 100 L176 100 Q182 100 182 108 L182 140 L70 140 Z', '#5aa8ff', { vert: true, shine: [110, 110, 30, 4, 0, .6] });
  c.ell(52, 104, 22, 13, '#ffffff');
  c.face(124, 122, .8);
};
A.pillow = c => {
  c.shadow(100, 170, 70, 8);
  c.path('M24 70 Q20 50 40 50 Q100 40 160 50 Q180 50 176 70 Q170 100 176 130 Q180 150 160 150 Q100 160 40 150 Q20 150 24 130 Q30 100 24 70 Z', '#ffb3c7', { shine: [60, 66, 20, 7, -10, .7] });
  for (const [x, y] of [[60, 80], [140, 80], [60, 124], [140, 124]]) c.raw(`<circle cx="${x}" cy="${y}" r="3" fill="#ff8fab"/>`);
  c.face(100, 102, 1.05);
};
A.lamp = c => {
  c.shadow(100, 188, 46, 7);
  c.ell(100, 178, 40, 10, '#9a6234');
  c.cyl(95, 100, 10, 76, '#c5ccd8', 3);
  c.path('M56 104 L72 34 L128 34 L144 104 Z', '#ffd23f', { vert: true, shine: [82, 60, 6, 18, 10, .6] });
  c.raw('<ellipse cx="100" cy="104" rx="44" ry="8" fill="#fff6b0" opacity=".9"/>');
  c.face(100, 70, .9);
};
A.clock = c => {
  c.shadow(100, 186, 50, 7);
  c.ball(64, 34, 16, '#ff4757').ball(136, 34, 16, '#ff4757');
  c.line('M70 168 L60 186 M130 168 L140 186', '#5a5a6e', 6);
  c.ball(100, 104, 70, '#ff4757');
  c.ball(100, 104, 56, '#ffffff', { shine: false });
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; c.raw(`<circle cx="${100 + 46 * Math.sin(a)}" cy="${104 - 46 * Math.cos(a)}" r="${k % 3 ? 2 : 4}" fill="#3d3d5c"/>`); }
  c.line('M100 104 L100 70 M100 104 L124 116', '#3d3d5c', 5);
  c.face(100, 128, .7, { blush: false });
};
A.chair = c => {
  c.shadow(100, 188, 60, 7);
  box(c, 50, 30, 100, 80, '#ff8a1f', 18);
  c.raw('<rect x="64" y="44" width="72" height="52" rx="12" fill="#ffb066" opacity=".7"/>');
  c.raw(`<rect x="52" y="120" width="12" height="64" rx="5" fill="${c.lg('#9a6234')}"/><rect x="136" y="120" width="12" height="64" rx="5" fill="${c.lg('#9a6234')}"/>`);
  box(c, 40, 108, 120, 22, '#e0701a', 10);
  c.face(100, 72, .9);
};
A.table = c => {
  c.shadow(100, 188, 84, 8);
  c.raw(`<rect x="34" y="96" width="14" height="88" rx="5" fill="${c.lg('#9a6234')}"/><rect x="152" y="96" width="14" height="88" rx="5" fill="${c.lg('#9a6234')}"/>`);
  c.ell(100, 84, 86, 18, '#c98a4e');
  c.raw(`<rect x="14" y="84" width="172" height="16" fill="${c.vg('#b5733f')}"/>`);
  c.ell(100, 82, 84, 16, '#e0a868', { shine: true });
  c.raw('<g transform="translate(68 18) scale(.32)">'); A.flower(c); c.raw('</g>');
  c.face(100, 108, .55, { blush: false });
};
A.sofa = c => {
  c.shadow(100, 186, 90, 8);
  box(c, 30, 56, 140, 70, '#9b59d6', 22);
  box(c, 10, 90, 40, 76, '#8a48c4', 18);
  box(c, 150, 90, 40, 76, '#8a48c4', 18);
  box(c, 44, 116, 112, 44, '#a86be0', 14);
  c.raw('<path d="M100 120 V158" stroke="#8a48c4" stroke-width="3"/>');
  c.raw('<rect x="26" y="164" width="10" height="16" rx="3" fill="#5a3a1e"/><rect x="164" y="164" width="10" height="16" rx="3" fill="#5a3a1e"/>');
  c.face(100, 88, .95);
};
A.tv = c => {
  c.shadow(100, 186, 60, 7);
  c.line('M80 30 L96 52 M124 26 L104 52', '#5a5a6e', 4);
  c.ball(80, 28, 5, '#ff4757').ball(124, 24, 5, '#4fa8ff');
  c.line('M80 160 L70 182 M120 160 L130 182', '#5a5a6e', 7);
  box(c, 16, 50, 168, 114, '#3d3d5c', 18);
  c.raw(`<rect x="28" y="62" width="144" height="90" rx="10" fill="${c.vg('#6fd3ff')}"/>`);
  c.shine(54, 76, 16, 5, -15, .6);
  c.face(100, 108, 1.1);
};
A.book = c => {
  c.shadow(100, 186, 64, 7);
  c.path('M24 50 Q62 40 100 56 L100 176 Q62 160 24 170 Z', '#ffffff', { vert: true });
  c.path('M176 50 Q138 40 100 56 L100 176 Q138 160 176 170 Z', '#f4f6fb', { vert: true });
  c.raw('<path d="M36 76 Q64 70 90 80 M36 96 Q64 90 90 100 M36 116 Q64 110 90 120 M110 80 Q136 70 164 76 M110 100 Q136 90 164 96" stroke="#c5ccd8" stroke-width="3" fill="none"/>');
  c.path('M20 170 Q62 158 100 176 Q138 158 180 170 L180 180 Q138 168 100 186 Q62 168 20 180 Z', '#ff4757', { flat: true });
  c.face(136, 136, .7);
};
A.fridge = c => {
  c.shadow(100, 190, 56, 7);
  box(c, 50, 12, 100, 174, '#e8f3ff', 16);
  c.raw('<path d="M50 74 H150" stroke="#b9c9dc" stroke-width="4"/>');
  c.raw(`<rect x="130" y="28" width="8" height="34" rx="4" fill="${c.lg('#9aa3b5')}"/><rect x="130" y="88" width="8" height="40" rx="4" fill="${c.lg('#9aa3b5')}"/>`);
  c.raw('<g transform="translate(62 20) scale(.18)">'); A.apple(c); c.raw('</g>');
  c.shine(66, 120, 4, 40, 0, .6);
  c.face(94, 126, .95);
};
A.kettle = c => {
  c.shadow(100, 186, 62, 7);
  c.path('M142 104 Q176 96 184 64 L176 62 Q168 88 142 92 Z', '#36c45d');
  c.line('M60 70 Q100 20 140 70', '#3d3d5c', 8);
  c.path('M40 170 Q30 120 60 84 Q100 64 140 84 Q170 120 160 170 Z', '#36c45d', { shine: [70, 104, 10, 18, 20, .7] });
  c.ell(100, 76, 36, 8, '#2e9e45');
  c.ball(100, 66, 8, '#3d3d5c');
  c.face(100, 128, 1);
};
A.plate = c => {
  c.shadow(100, 168, 86, 8);
  c.ell(100, 120, 86, 34, '#eef3f8', { shine: true });
  c.ell(100, 118, 60, 22, '#ffffff', { noEdge: true });
  c.raw('<ellipse cx="100" cy="120" rx="86" ry="34" fill="none" stroke="#5aa8ff" stroke-width="4"/>');
  c.raw('<g transform="translate(66 52) scale(.34)">'); A.strawberry(c); c.raw('</g>');
  c.face(100, 128, .55, { blush: false });
};
A.spoon = c => {
  c.shadow(100, 184, 60, 6);
  c.raw(`<g transform="rotate(-35 100 100)"><rect x="94" y="88" width="12" height="110" rx="6" fill="${c.lg('#c5ccd8')}" stroke="#8a93a8" stroke-opacity=".5"/></g>`);
  c.ell(78, 64, 30, 40, '#d5dbe6', { rot: -35, shine: true });
  c.ell(78, 64, 20, 28, '#eef3f8', { rot: -35, noEdge: true });
  c.face(78, 66, .75);
};
A.bathtub = c => {
  c.shadow(100, 188, 88, 8);
  for (const [x, y, r] of [[60, 74, 14], [84, 62, 18], [112, 66, 16], [136, 76, 12], [100, 50, 10]]) c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="#bfe3ff" stroke-width="2"/>`);
  c.line('M168 90 V48 Q168 36 156 36 L146 36', '#9aa3b5', 6);
  c.path('M14 90 L186 90 Q186 168 140 170 L60 170 Q14 168 14 90 Z', '#ffffff', { vert: true, shine: [50, 110, 30, 4, 0, .6] });
  c.raw('<rect x="10" y="84" width="180" height="14" rx="7" fill="#d5e9fb"/>');
  c.raw('<rect x="46" y="168" width="12" height="18" rx="4" fill="#ffd23f"/><rect x="142" y="168" width="12" height="18" rx="4" fill="#ffd23f"/>');
  c.face(100, 128, 1);
};
A.soap = c => {
  for (const [x, y, r] of [[150, 40, 12], [168, 66, 8], [40, 50, 10], [56, 30, 6]]) c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="#e8f6ff" opacity=".8" stroke="#a6d8ff"/>`);
  c.shadow(100, 170, 70, 8);
  c.raw(`<rect x="30" y="80" width="140" height="80" rx="34" fill="${c.vg('#ff9ec7')}" ${c.edge('#ff9ec7')}/>`);
  c.raw(`<rect x="38" y="70" width="124" height="70" rx="30" fill="${c.vg('#ffc2dc')}"/>`);
  c.shine(66, 86, 18, 6, -8, .7);
  c.face(100, 108, 1);
};
A.toothbrush = c => {
  c.shadow(100, 184, 70, 6);
  c.raw(`<g transform="rotate(-30 100 100)"><rect x="30" y="94" width="150" height="16" rx="8" fill="${c.vg('#4fa8ff')}"/>
    <rect x="132" y="70" width="44" height="26" rx="6" fill="#ffffff" stroke="#c5ccd8"/>
    <path d="M136 70 V96 M144 70 V96 M152 70 V96 M160 70 V96 M168 70 V96" stroke="#bfe6ff" stroke-width="3"/>
    <path d="M134 62 Q150 50 172 62 Q178 70 170 72 L136 72 Q128 70 134 62 Z" fill="#ffffff" stroke="#bfe6ff"/></g>`);
  c.face(86, 118, .55, { blush: false });
};
A.towel = c => {
  c.shadow(100, 188, 60, 7);
  c.raw(`<rect x="20" y="22" width="160" height="12" rx="6" fill="${c.vg('#c5ccd8')}"/>`);
  c.path('M44 30 L156 30 L156 170 Q100 182 44 170 Z', '#2ec4b6', { vert: true, shine: [70, 70, 6, 24, 0, .6] });
  c.raw('<path d="M44 140 Q100 150 156 140 M44 152 Q100 162 156 152" stroke="#ffffff" stroke-width="6" fill="none"/>');
  c.face(100, 92, 1);
};
A.mirror = c => {
  c.shadow(100, 190, 50, 7);
  c.ell(100, 92, 64, 82, '#ffc61a');
  c.ell(100, 92, 52, 70, '#d6f0ff', { noEdge: true });
  c.raw('<path d="M74 52 L92 40 M68 76 L104 46" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity=".9"/>');
  c.raw(`<rect x="84" y="170" width="32" height="18" rx="6" fill="${c.vg('#ffc61a')}"/>`);
  c.face(100, 110, 1);
};
A.teddy = c => A.bear(c);

module.exports = lib;
