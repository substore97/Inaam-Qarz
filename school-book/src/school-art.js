// 3D school supplies for "أدواتي المدرسية". Extends the shared art library.
const lib = require('../../duas-book/src/duas-art');
const { A } = lib;

const box = (c, x, y, w, h, col, r = 8) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);

A.schoolpencil = c => { c.raw('<g transform="rotate(-30 100 100) translate(-6 0)">'); A.pencil(c, 130); c.raw('</g>'); };
A.eraser = c => {
  c.shadow(100, 170, 70, 8);
  c.path('M30 110 L120 70 L176 100 L86 142 Z', '#ffc2d6', { vert: true, noEdge: true });
  c.path('M30 110 L86 142 L86 170 L30 138 Z', '#ff8fb1', { flat: true });
  c.path('M86 142 L176 100 L176 128 L86 170 Z', '#ff6f9c', { vert: true });
  c.path('M64 125 L150 85 L176 100 L86 142 Z', '#4fa8ff', { vert: true, noEdge: true, opacity: .9 });
  c.face(126, 132, .7);
};
A.ruler = c => {
  c.shadow(100, 164, 86, 7);
  c.raw('<g transform="rotate(-14 100 110)">');
  box(c, 14, 92, 172, 40, '#ffd23f', 6);
  for (let i = 0; i <= 16; i++) c.raw(`<path d="M${22 + i * 9.8} 92 V${i % 5 ? 102 : 110}" stroke="#8a5a00" stroke-width="2"/>`);
  c.raw('</g>');
  c.face(100, 120, .7, { blush: false });
};
A.sharpener = c => {
  c.shadow(100, 176, 60, 8);
  box(c, 50, 70, 100, 96, '#36c45d', 14);
  c.raw('<rect x="62" y="70" width="76" height="16" fill="#c5ccd8"/><circle cx="74" cy="118" r="14" fill="#2e9e45"/><circle cx="74" cy="118" r="7" fill="#1f6f30"/>');
  c.raw('<g transform="translate(110 30) rotate(70) scale(.5)">'); A.pencil(c, 60); c.raw('</g>');
  c.face(114, 130, .75);
};
A.scissors = c => {
  c.shadow(100, 184, 60, 7);
  c.path('M100 104 L60 18 L72 14 L106 96 Z', '#c5ccd8', { vert: true });
  c.path('M100 104 L140 18 L128 14 L94 96 Z', '#d5dbe6', { vert: true });
  for (const x of [66, 134]) c.raw(`<ellipse cx="${x}" cy="148" rx="28" ry="30" fill="none" stroke="${x < 100 ? '#ff4757' : '#2f7de8'}" stroke-width="14"/>`);
  c.line('M100 104 L72 126 M100 104 L128 126', '#9aa3b5', 12);
  c.ball(100, 104, 8, '#9aa3b5');
  c.face(100, 72, .55, { blush: false });
};
A.glue = c => {
  c.shadow(100, 188, 46, 7);
  c.raw(`<rect x="62" y="70" width="76" height="114" rx="16" fill="${c.vg('#ffffff')}" ${c.edge('#ffffff')}/>`);
  c.raw('<rect x="62" y="104" width="76" height="50" fill="#4fa8ff"/><text x="100" y="138" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="20" fill="#fff">صَمْغ</text>');
  c.path('M74 70 L126 70 L118 46 L82 46 Z', '#ff8a1f', { vert: true });
  c.path('M92 46 L100 18 L108 46 Z', '#ff8a1f');
  c.face(100, 168, .55, { blush: false });
};
A.notebook = c => {
  c.shadow(100, 188, 70, 8);
  box(c, 36, 24, 132, 160, '#9b59d6', 12);
  c.raw('<rect x="50" y="24" width="118" height="160" rx="10" fill="none"/>');
  for (let y = 36; y < 180; y += 18) c.raw(`<circle cx="44" cy="${y}" r="5" fill="#ffffff" stroke="#6a3fa0"/>`);
  c.raw('<rect x="70" y="54" width="80" height="44" rx="8" fill="#ffffff"/><path d="M80 70 H140 M80 84 H124" stroke="#c5b5e6" stroke-width="4"/>');
  c.face(108, 136, .9);
};
A.board = c => {
  c.shadow(100, 190, 80, 7);
  c.line('M44 160 L30 192 M156 160 L170 192', '#8b5a2b', 7);
  c.raw(`<rect x="14" y="34" width="172" height="128" rx="10" fill="${c.vg('#c98a4e')}"/><rect x="24" y="44" width="152" height="108" rx="6" fill="${c.vg('#2f7d5a')}"/>`);
  c.raw('<text x="140" y="84" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="28" fill="#ffffff" opacity=".9">أ ب ت</text><text x="66" y="84" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="#ffffff" opacity=".9">1+2</text>');
  c.raw('<rect x="120" y="156" width="40" height="8" rx="3" fill="#ffffff"/>');
  c.face(100, 120, .8, { blush: false });
};
A.globe = c => {
  c.shadow(100, 192, 50, 7);
  c.raw(`<path d="M100 172 V186 M70 188 H130" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>`);
  c.raw('<path d="M36 40 A76 76 0 0 1 164 150" fill="none" stroke="#ffc93b" stroke-width="7"/>');
  c.raw('<g transform="translate(6 6) scale(.94)">'); A.earth(c); c.raw('</g>');
};
A.laptop = c => {
  c.shadow(100, 182, 86, 8);
  c.path('M14 160 L186 160 L176 176 L24 176 Z', '#9aa3b5', { vert: true });
  box(c, 34, 40, 132, 118, '#5a5a6e', 12);
  c.raw(`<rect x="44" y="50" width="112" height="96" rx="6" fill="${c.vg('#6fd3ff')}"/>`);
  c.raw('<rect x="86" y="164" width="28" height="5" rx="2" fill="#c5ccd8"/>');
  c.face(100, 100, 1);
};
A.paintbrush = c => {
  c.shadow(100, 186, 60, 6);
  c.raw('<g transform="rotate(-35 100 100)">');
  c.raw(`<rect x="92" y="70" width="16" height="120" rx="8" fill="${c.lg('#ff4757')}"/><rect x="90" y="56" width="20" height="20" rx="3" fill="${c.lg('#c5ccd8')}"/>`);
  c.path('M90 58 Q86 30 100 8 Q114 30 110 58 Z', '#4fa8ff', { vert: true });
  c.raw('</g>');
  c.ball(60, 160, 10, '#4fa8ff').ball(40, 174, 6, '#4fa8ff');
  c.face(110, 120, .55, { blush: false });
};
A.palette = c => {
  c.shadow(100, 182, 76, 8);
  c.path('M100 30 C160 30 190 70 180 110 C172 140 140 128 132 146 C126 162 140 178 116 182 C60 190 14 150 20 100 C26 56 60 30 100 30 Z', '#e8c08a', { shine: [60, 60, 18, 7, -30, .6] });
  c.raw('<ellipse cx="146" cy="152" rx="12" ry="9" fill="#fff" opacity=".0"/>');
  for (const [x, y, col] of [[60, 70, '#ff4757'], [96, 56, '#ffd23f'], [136, 70, '#36c45d'], [150, 104, '#2f7de8'], [46, 112, '#9b59d6'], [70, 150, '#ff8a1f']]) c.ball(x, y, 12, col);
  c.face(98, 112, .9);
};
A.pencilcase = c => {
  c.shadow(100, 180, 84, 8);
  c.raw('<g transform="translate(20 30) rotate(-8) scale(.55)">'); A.pencil(c, 120); c.raw('</g>');
  c.raw('<g transform="translate(40 18) rotate(-20) scale(.5)">'); A.crayons(c); c.raw('</g>');
  c.raw(`<rect x="16" y="86" width="168" height="80" rx="34" fill="${c.vg('#ff8a1f')}" ${c.edge('#ff8a1f')}/>`);
  c.raw('<path d="M30 94 H170" stroke="#c5ccd8" stroke-width="6" stroke-dasharray="4 3"/><circle cx="172" cy="94" r="7" fill="#c5ccd8"/>');
  c.face(100, 130, .9);
};
module.exports = lib;
