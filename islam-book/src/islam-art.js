// 3D art for "ديني الجميل": Kaaba, prayer mat, charity box, lantern, Quran stand.
const lib = require('../../feelings-book/src/feel-art');
const { A } = lib;

A.kaaba = c => {
  c.ell(100, 182, 92, 14, '#f4f6fb', { shine: true });
  c.path('M34 66 L120 48 L176 64 L90 84 Z', '#3d3d4f', { flat: true });
  c.path('M90 84 L176 64 L176 160 L90 182 Z', '#1f1f2a', { vert: true });
  c.path('M34 66 L90 84 L90 182 L34 162 Z', '#2b2b38', { vert: true });
  c.path('M34 86 L90 104 L90 118 L34 100 Z', '#e8b830', { vert: true });
  c.path('M90 104 L176 84 L176 98 L90 118 Z', '#ffd25a', { vert: true });
  c.raw('<path d="M40 92 l8 3 m6 2 l8 3 m6 2 l8 3 M96 110 l10 -2 m6 -1 l10 -2 m6 -1 l10 -2 m6 -1 l10 -2" stroke="#8a6a10" stroke-width="2"/>');
  c.path('M120 130 L144 124 L144 170 L120 176 Z', '#ffd25a', { vert: true });
  c.shine(52, 120, 4, 22, 0, .25);
};
A.prayermat = c => {
  c.shadow(100, 176, 86, 8);
  c.path('M30 60 L150 34 L176 140 L56 168 Z', '#2e9e6a', { vert: true });
  c.raw('<path d="M42 66 L146 44 L166 134 L62 158 Z" fill="none" stroke="#ffd25a" stroke-width="5"/>');
  c.path('M60 72 Q84 40 112 56 L132 132 L82 144 Z', '#1f7a50', { flat: true });
  c.raw('<path d="M60 72 Q84 40 112 56" fill="none" stroke="#ffd25a" stroke-width="4"/>');
  for (const [x, y] of [[100, 92], [108, 116], [92, 124]]) c.star(x, y, 7, '#ffd25a');
  c.raw('<path d="M30 60 l-8 6 M40 58 l-8 6 M56 168 l-6 8 M66 166 l-6 8" stroke="#ffd25a" stroke-width="3"/>');
};
A.charitybox = c => {
  c.shadow(100, 186, 70, 8);
  c.path('M40 84 L70 66 L170 66 L140 84 Z', '#ffd25a', { vert: true });
  c.path('M140 84 L170 66 L170 160 L140 180 Z', '#c99a20', { flat: true });
  c.raw(`<rect x="40" y="84" width="100" height="96" rx="6" fill="${c.vg('#ffc93b')}" ${c.edge('#ffc93b')}/>`);
  c.raw('<path d="M84 74 L124 74 L118 78 L80 78 Z" fill="#5a3a00"/>');
  c.ball(102, 46, 18, '#ffd84d'); c.raw('<circle cx="102" cy="46" r="11" fill="none" stroke="#c99a20" stroke-width="3"/>');
  c.heart(90, 130, 22, '#ff4f8b');
  c.face(90, 160, .55, { blush: false });
};
A.lantern = c => {
  c.line('M100 10 V26', '#c99a20', 3); c.raw('<circle cx="100" cy="10" r="6" fill="none" stroke="#c99a20" stroke-width="3"/>');
  c.raw(`<radialGradient id="${c.id}lg"><stop offset="0" stop-color="#fff6b0" stop-opacity=".9"/><stop offset="1" stop-color="#fff6b0" stop-opacity="0"/></radialGradient><circle cx="100" cy="110" r="80" fill="url(#${c.id}lg)"/>`);
  c.path('M74 46 L126 46 L112 26 L88 26 Z', '#e8b830', { vert: true });
  c.path('M66 50 L134 50 L146 130 L54 130 Z', '#ff8a1f', { vert: true });
  c.raw('<path d="M80 52 L72 128 M100 52 V128 M120 52 L128 128" stroke="#e8b830" stroke-width="5"/>');
  c.raw('<path d="M76 66 L124 66 M66 100 L134 100" stroke="#ffe680" stroke-width="3" opacity=".8"/>');
  c.path('M54 130 L146 130 L126 156 L74 156 Z', '#e8b830', { vert: true });
  c.path('M88 156 L112 156 L104 176 L96 176 Z', '#c99a20');
  c.ball(100, 90, 12, '#fff3a0');
  c.raw(`<mask id="${c.id}mm"><rect width="200" height="200" fill="#fff"/><circle cx="168" cy="40" r="15" fill="#000"/></mask><circle cx="160" cy="44" r="18" fill="#ffd23f" mask="url(#${c.id}mm)"/>`);
};
A.rehal = c => {
  c.shadow(100, 186, 70, 8);
  c.raw(`<g><path d="M52 176 L150 92" stroke="#8b5a2b" stroke-width="12" stroke-linecap="round"/><path d="M148 176 L50 92" stroke="#a8693a" stroke-width="12" stroke-linecap="round"/></g>`);
  c.path('M28 104 Q64 84 100 104 L100 64 Q64 44 28 64 Z', '#2e9e6a', { vert: true });
  c.path('M172 104 Q136 84 100 104 L100 64 Q136 44 172 64 Z', '#2e9e6a', { vert: true });
  c.path('M36 98 Q66 82 98 98 L98 66 Q66 50 36 66 Z', '#fffbea', { flat: true });
  c.path('M164 98 Q134 82 102 98 L102 66 Q134 50 164 66 Z', '#fffbea', { flat: true });
  c.raw('<path d="M46 72 Q68 64 92 74 M46 82 Q68 74 92 84 M108 74 Q132 64 154 72 M108 84 Q132 74 154 82" stroke="#c9b878" stroke-width="2.5" fill="none"/>');
  c.star(100, 30, 12, '#ffd25a');
};
A.coins = c => { c.shadow(100, 180, 60, 7); for (const [x, y] of [[70, 150], [100, 150], [130, 150], [85, 128], [115, 128], [100, 106]]) { c.ell(x, y, 24, 10, '#e8b830'); c.ell(x, y - 4, 24, 10, '#ffd84d', { noEdge: true }); } };
module.exports = lib;
