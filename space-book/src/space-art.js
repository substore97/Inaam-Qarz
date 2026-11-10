// 3D space art for "فضائي الجميل". Extends the shared art library.
const lib = require('../../home-book/src/home-art');
const { A } = lib;

const box = (c, x, y, w, h, col, r = 8) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);
const clip = (c, id, cx, cy, r) => c.raw(`<clipPath id="${c.id}${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`);
const craters = (c, list, col) => list.forEach(([x, y, r]) => c.raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity=".55"/><circle cx="${x - r * .2}" cy="${y - r * .25}" r="${r * .7}" fill="#fff" opacity=".12"/>`));
const glow = (c, cx, cy, r, col) => c.raw(`<radialGradient id="${c.id}gl${r}"><stop offset=".55" stop-color="${col}" stop-opacity=".55"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${c.id}gl${r})"/>`);
const panel = (c, x, y, w, h) => {
  c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${c.vg('#2f6fe0')}" stroke="#1b3f8f" stroke-width="2"/>`);
  let d = ''; for (let i = 1; i < 4; i++) d += `M${x + w * i / 4} ${y} V${y + h} `; d += `M${x} ${y + h / 2} H${x + w}`;
  c.raw(`<path d="${d}" stroke="#8fc0ff" stroke-width="1.5" opacity=".8"/>`);
};

function planet(c, col, R = 66, fn) { const cx = 100, cy = 100; c.ball(cx, cy, R, col, { shine: false }); if (fn) fn(cx, cy, R); c.shine(cx - R * .4, cy - R * .45, R * .26, R * .12, -35, .6); }

A.sunstar = c => { glow(c, 100, 100, 96, '#ffb627'); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6, p = (r, d) => [100 + r * Math.cos(a + d), 100 + r * Math.sin(a + d)].map(v => v.toFixed(1)).join(' '); c.path(`M${p(60, -.17)} L${p(90, 0)} L${p(60, .17)} Z`, '#ff9f1c'); } c.ball(100, 100, 60, '#ffd23f'); c.face(100, 104, 1.3); };
A.mercury = c => planet(c, '#a9a9b8', 56, () => { craters(c, [[78, 80, 9], [122, 112, 12], [90, 130, 7], [128, 76, 6], [64, 112, 6]], '#77778a'); c.face(100, 104, .95); });
A.venus = c => planet(c, '#f2c46d', 62, (x, y) => {
  clip(c, 'v', x, y, 61);
  c.raw(`<g clip-path="url(#${c.id}v)" opacity=".5"><path d="M30 80 Q70 66 110 80 T190 80 M20 112 Q60 98 100 112 T180 112 M30 142 Q70 128 110 142 T190 142" stroke="#d99a3a" stroke-width="9" fill="none"/></g>`);
  c.face(100, 104, 1.05);
});
A.earth = c => planet(c, '#3a8dff', 66, (x, y) => {
  clip(c, 'e', x, y, 65);
  c.raw(`<g clip-path="url(#${c.id}e)"><path d="M44 70 Q60 46 88 52 Q100 66 84 80 Q70 96 52 92 Q38 84 44 70 Z M108 104 Q134 92 150 110 Q160 134 140 150 Q120 162 110 144 Q100 124 108 104 Z M70 140 Q86 132 94 146 Q90 164 72 160 Z" fill="${c.vg('#4cd964')}"/>
    <path d="M110 50 Q130 44 146 56" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity=".85" fill="none"/></g>`);
  c.face(100, 106, 1.05);
});
A.mars = c => planet(c, '#e8603c', 58, () => { craters(c, [[76, 82, 10], [124, 116, 11], [88, 132, 6], [130, 80, 7]], '#b9401f'); c.ell(100, 48, 22, 6, '#ffffff', { noEdge: true, opacity: .8 }); c.face(100, 104, .95); });
A.jupiter = c => planet(c, '#e0b084', 74, (x, y) => {
  clip(c, 'j', x, y, 73);
  c.raw(`<g clip-path="url(#${c.id}j)">${[[48, '#c98a5a'], [70, '#f2d2a8'], [128, '#c98a5a'], [150, '#f2d2a8'], [92, '#d9a070']].map(([yy, col]) => `<rect x="20" y="${yy}" width="160" height="12" fill="${col}" opacity=".8"/>`).join('')}</g>`);
  c.ell(130, 136, 14, 8, '#d9573a', { noEdge: true });
  c.face(96, 110, 1.15);
});
A.saturn = c => {
  c.raw(`<ellipse cx="100" cy="104" rx="86" ry="24" fill="none" stroke="#c9a46a" stroke-width="14" transform="rotate(-14 100 104)"/>`);
  planet(c, '#f2d08a', 54, (x, y) => { clip(c, 's', x, y, 53); c.raw(`<g clip-path="url(#${c.id}s)" opacity=".6"><rect x="40" y="70" width="120" height="9" fill="#d9b06a"/><rect x="40" y="118" width="120" height="9" fill="#d9b06a"/></g>`); });
  c.raw(`<path d="M16 126 A86 24 0 0 0 184 82" fill="none" stroke="#e8c88a" stroke-width="14" transform="rotate(-14 100 104)" stroke-linecap="round" clip-path="none"/>`);
  c.face(100, 96, .9);
};
A.uranus = c => {
  c.raw(`<ellipse cx="100" cy="100" rx="22" ry="88" fill="none" stroke="#c7f1f6" stroke-width="6" opacity=".9" transform="rotate(10 100 100)"/>`);
  planet(c, '#8fdde8', 58);
  c.raw(`<path d="M86 14 A22 88 0 0 1 112 186" fill="none" stroke="#e6fbfd" stroke-width="6" transform="rotate(10 100 100)"/>`);
  c.face(100, 104, .95);
};
A.neptune = c => planet(c, '#3d6ef0', 60, (x, y) => {
  clip(c, 'n', x, y, 59);
  c.raw(`<g clip-path="url(#${c.id}n)" opacity=".5"><rect x="30" y="66" width="140" height="10" fill="#7fa6ff"/><rect x="30" y="128" width="140" height="12" fill="#2a50c4"/></g>`);
  c.ell(76, 120, 12, 7, '#1f3fa8', { noEdge: true });
  c.face(100, 102, 1);
});
A.moonball = c => planet(c, '#d8dbe3', 62, () => { craters(c, [[74, 78, 12], [128, 114, 14], [86, 136, 8], [134, 72, 8], [60, 116, 7]], '#a0a6b4'); c.face(102, 104, 1, { mode: 'sleep', keep: true }); });
A.stars = c => { c.star(100, 96, 56, '#ffd23f'); c.face(100, 104, .95); c.star(36, 40, 18, '#ffe680', 15); c.star(166, 50, 14, '#ffe680', -10); c.star(160, 156, 20, '#ffd23f', 20); c.star(40, 160, 12, '#ffe680'); };
A.comet = c => {
  c.raw(`<linearGradient id="${c.id}ct" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe9ff" stop-opacity=".95"/><stop offset="1" stop-color="#8f7bff" stop-opacity="0"/></linearGradient>`);
  c.raw(`<path d="M128 70 Q60 70 8 190 Q70 120 150 104 Z" fill="url(#${c.id}ct)"/><path d="M134 90 Q80 110 40 196" stroke="#ffffff" stroke-width="3" opacity=".6" fill="none"/>`);
  c.ball(140, 74, 34, '#cfefff');
  c.face(140, 78, .8);
};
A.asteroid = c => {
  c.path('M44 102 C36 64 80 40 116 48 C158 56 172 92 160 126 C150 160 110 168 82 160 C54 152 48 132 44 102 Z', '#9a8a7a', { shine: [76, 70, 16, 6, -20, .5] });
  craters(c, [[78, 82, 10], [130, 110, 13], [100, 142, 8], [136, 72, 6]], '#6e6052');
  c.face(102, 108, 1);
};
A.galaxy = c => {
  glow(c, 100, 100, 96, '#9b6bff');
  c.raw(`<g transform="rotate(-20 100 100)">${[0, 120, 240].map(r => `<path d="M100 100 Q140 60 150 100 Q160 150 110 160 Q60 166 40 120" transform="rotate(${r} 100 100)" fill="none" stroke="#e5d8ff" stroke-width="10" stroke-linecap="round" opacity=".85"/>`).join('')}</g>`);
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = 20 + i * 2.8; c.raw(`<circle cx="${(100 + r * Math.cos(a)).toFixed(1)}" cy="${(100 + r * Math.sin(a) * .8).toFixed(1)}" r="${(i % 3) + 1.5}" fill="#fff"/>`); }
  c.ball(100, 100, 26, '#fff3c4');
  c.face(100, 102, .7);
};
A.astronaut = c => {
  c.shadow(100, 192, 50, 7, .18);
  box(c, 50, 92, 100, 56, '#d5dbe6', 18);
  box(c, 62, 96, 76, 74, '#f4f6fb', 22);
  c.raw('<rect x="86" y="112" width="28" height="20" rx="5" fill="#4fa8ff"/><circle cx="92" cy="118" r="3" fill="#ff4757"/><circle cx="104" cy="118" r="3" fill="#ffd23f"/>');
  c.ell(48, 128, 14, 26, '#eef1f6', { rot: 20 }).ell(152, 128, 14, 26, '#eef1f6', { rot: -20 });
  c.ball(42, 152, 11, '#ff8a1f').ball(158, 152, 11, '#ff8a1f');
  box(c, 66, 160, 28, 30, '#eef1f6', 10); box(c, 106, 160, 28, 30, '#eef1f6', 10);
  c.ball(100, 62, 50, '#ffffff');
  c.raw(`<ellipse cx="100" cy="66" rx="36" ry="30" fill="${c.vg('#9fd8ff')}" stroke="#4f7fbf" stroke-width="3"/>`);
  c.shine(84, 50, 12, 6, -25, .8);
  c.face(100, 70, .95);
};
A.satellite = c => {
  panel(c, 6, 82, 60, 36); panel(c, 134, 82, 60, 36);
  c.raw('<path d="M66 100 H82 M118 100 H134" stroke="#9aa3b5" stroke-width="5"/>');
  box(c, 78, 70, 44, 60, '#ffc93b', 6);
  c.line('M100 70 V50', '#9aa3b5', 4);
  c.path('M80 50 Q100 22 120 50 Z', '#e8edf5', { vert: true });
  c.ball(100, 42, 4, '#ff4757');
  c.face(100, 102, .6);
};
A.telescope = c => {
  c.shadow(100, 190, 56, 7);
  c.line('M100 120 L64 186 M100 120 L136 186 M100 120 L100 186', '#5a5a6e', 6);
  c.raw(`<g transform="rotate(-28 100 100)"><rect x="34" y="82" width="132" height="36" rx="12" fill="${c.vg('#4fa8ff')}" stroke="#2f6fe0" stroke-width="1.5"/>
    <rect x="150" y="76" width="24" height="48" rx="8" fill="${c.vg('#2f6fe0')}"/><rect x="22" y="90" width="16" height="20" rx="5" fill="${c.vg('#3d3d5c')}"/>
    <ellipse cx="174" cy="100" rx="6" ry="20" fill="#bfe6ff"/></g>`);
  c.ball(100, 116, 9, '#5a5a6e');
  c.face(96, 104, .72, { blush: false });
};
A.rover = c => {
  c.raw('<rect x="0" y="170" width="200" height="14" rx="7" fill="#d9734a"/>');
  c.shadow(100, 170, 84, 6);
  panel(c, 30, 52, 140, 18);
  c.line('M150 70 V40', '#9aa3b5', 5);
  box(c, 138, 26, 26, 18, '#e8edf5', 5); c.ball(158, 35, 5, '#3d3d5c');
  box(c, 34, 74, 132, 56, '#f4f6fb', 12);
  c.raw('<path d="M40 134 H160" stroke="#9aa3b5" stroke-width="5"/>');
  for (const x of [48, 100, 152]) { c.ball(x, 152, 18, '#33334a', { shine: false }); c.ball(x, 152, 8, '#d5dbe6'); }
  c.face(100, 102, .95);
};
A.station = c => {
  panel(c, 4, 40, 56, 30); panel(c, 4, 130, 56, 30); panel(c, 140, 40, 56, 30); panel(c, 140, 130, 56, 30);
  c.raw('<path d="M32 70 V130 M168 70 V130" stroke="#9aa3b5" stroke-width="5"/><path d="M32 100 H168" stroke="#9aa3b5" stroke-width="7"/>');
  c.raw(`<rect x="62" y="80" width="76" height="40" rx="20" fill="${c.vg('#e8edf5')}" stroke="#9aa3b5"/>`);
  c.raw(`<rect x="88" y="58" width="24" height="84" rx="12" fill="${c.vg('#ffc93b')}"/>`);
  c.face(100, 100, .7);
};
module.exports = lib;
