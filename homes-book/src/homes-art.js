// Animal homes for "بيوت الحيوانات". Extends the shared art library.
const lib = require('../../where-book/src/where-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const ground = (c, col = '#9be07a') => c.ell(100, 186, 96, 12, col, { shine: true });

A.hive = c => {
  c.line('M100 4 V22', '#8b5a2b', 6); c.raw('<path d="M40 14 H160" stroke="#8b5a2b" stroke-width="8" stroke-linecap="round"/>');
  [[0, 26, 46], [1, 62, 62], [2, 102, 70], [3, 142, 60]].forEach(([k, y, rx]) => c.ell(100, y + 18, rx, 22, k % 2 ? '#ffc93b' : '#ffd84d'));
  c.ell(100, 178, 40, 14, '#e8b830'); c.raw('<ellipse cx="100" cy="132" rx="14" ry="12" fill="#5a3a00"/>');
  c.face(100, 96, .6);
};
A.nest = c => {
  c.raw('<path d="M0 150 Q100 120 200 140" stroke="#8b5a2b" stroke-width="12" fill="none" stroke-linecap="round"/>');
  c.ell(100, 130, 70, 34, '#c98a4e'); c.raw('<path d="M36 124 q20 10 40 0 t40 0 t40 0 M40 140 q20 8 40 0 t40 0 t40 0" stroke="#8b5a2b" stroke-width="3" fill="none"/>');
  c.ell(100, 112, 54, 14, '#6b4422', { noEdge: true });
  for (const x of [80, 100, 120]) c.ell(x, 106, 12, 15, '#bfe6ff');
};
A.burrow = c => { ground(c); c.path('M10 186 Q20 70 100 66 Q180 70 190 186 Z', '#a8d870', { vert: true }); c.ell(100, 160, 44, 30, '#4a2e1a', { noEdge: true }); c.ell(100, 168, 34, 20, '#2b1a0e', { noEdge: true }); };
A.cave = c => { ground(c, '#c5ccd8'); c.path('M4 186 Q10 40 100 30 Q190 40 196 186 Z', '#9aa3b5', { vert: true }); c.path('M50 186 Q54 96 100 92 Q146 96 150 186 Z', '#3d3d5c', { flat: true }); c.ball(40, 70, 8, '#b5bccb', { shine: false }); c.ball(160, 90, 10, '#b5bccb', { shine: false }); };
A.aquarium = c => { c.raw(`<rect x="14" y="40" width="172" height="140" rx="16" fill="${c.vg('#7fd0ff')}" stroke="#ffffff" stroke-width="6"/><rect x="14" y="40" width="172" height="20" rx="8" fill="#bfe6ff" opacity=".6"/>`); c.raw('<path d="M30 180 q10 -40 0 -70 M170 180 q-10 -30 0 -60" stroke="#36c45d" stroke-width="7" fill="none"/>'); for (const [x, y] of [[60, 90], [150, 76], [130, 120]]) c.ball(x, y, 5, '#ffffff', { shine: false }); c.ell(100, 172, 80, 8, '#ffe0a0', { noEdge: true }); };
A.stable = c => { ground(c); c.raw(`<rect x="20" y="70" width="160" height="116" rx="6" fill="${c.vg('#c0392b')}" ${c.edge('#c0392b')}/>`); c.path('M10 76 L100 20 L190 76 Z', '#8b2a20', { vert: true }); c.raw('<rect x="60" y="100" width="80" height="86" fill="#f2e2c0"/><path d="M60 100 L140 186 M140 100 L60 186" stroke="#c0392b" stroke-width="6"/><rect x="60" y="100" width="80" height="86" fill="none" stroke="#ffffff" stroke-width="6"/>'); };
A.coop = c => { ground(c); c.raw(`<rect x="34" y="90" width="132" height="80" rx="6" fill="${c.vg('#ffd23f')}" ${c.edge('#ffd23f')}/>`); c.path('M24 96 L100 46 L176 96 Z', '#ff6b4a', { vert: true }); c.raw('<path d="M44 170 v16 M156 170 v16" stroke="#8b5a2b" stroke-width="6"/><circle cx="100" cy="126" r="20" fill="#5a3a22"/><path d="M70 186 L100 150" stroke="#c98a4e" stroke-width="6"/>'); };
A.anthill = c => { ground(c); c.path('M20 186 Q70 60 100 56 Q130 60 180 186 Z', '#c98a4e', { vert: true }); c.raw('<ellipse cx="100" cy="66" rx="10" ry="6" fill="#4a2e1a"/><ellipse cx="80" cy="140" rx="8" ry="6" fill="#4a2e1a"/><ellipse cx="124" cy="120" rx="8" ry="6" fill="#4a2e1a"/>'); };
A.barn = c => { ground(c); c.raw(`<rect x="24" y="80" width="152" height="106" rx="4" fill="${c.vg('#e8392b')}" ${c.edge('#e8392b')}/>`); c.path('M14 88 L50 40 L150 40 L186 88 Z', '#8b2a20', { vert: true }); c.raw('<rect x="70" y="110" width="60" height="76" fill="#ffffff"/><path d="M70 110 L130 186 M130 110 L70 186" stroke="#e8392b" stroke-width="5"/><rect x="88" y="54" width="24" height="20" fill="#ffffff"/>'); };
A.web = c => { c.raw('<g stroke="#9aa3b5" stroke-width="2.2" fill="none">' + Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return `<path d="M100 96 L${(100 + 92 * Math.cos(a)).toFixed(1)} ${(96 + 92 * Math.sin(a)).toFixed(1)}"/>`; }).join('') + [20, 40, 60, 80].map(r => `<polygon points="${Array.from({ length: 8 }, (_, k) => { const a = k * Math.PI / 4; return `${(100 + r * Math.cos(a)).toFixed(1)},${(96 + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}"/>`).join('') + '</g>'); };
A.spider = c => { c.raw('<g stroke="#2b2340" stroke-width="5" fill="none" stroke-linecap="round">' + [-1, 1].map(s => [0, 1, 2, 3].map(i => `<path d="M${100 + s * 20} ${90 + i * 10} q${s * 30} ${-20 + i * 10} ${s * 50} ${10 + i * 14}"/>`).join('')).join('') + '</g>'); c.ball(100, 110, 30, '#5a3a8a'); c.ball(100, 76, 20, '#6a4a9a'); c.face(100, 80, .5); };
A.kennel = c => { ground(c); c.raw(`<rect x="34" y="84" width="132" height="102" rx="6" fill="${c.vg('#4fa8ff')}" ${c.edge('#4fa8ff')}/>`); c.path('M22 90 L100 34 L178 90 Z', '#2f55c4', { vert: true }); c.path('M70 186 V136 Q100 104 130 136 V186 Z', '#1f2a4a', { flat: true }); c.raw('<rect x="76" y="94" width="48" height="18" rx="6" fill="#ffffff"/><text x="100" y="108" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="13" fill="#2f55c4">بَيْتِي</text>'); };
A.den = c => { A.cave(c); };
const H = (home, animal, ax, ay, as, after = true) => c => { if (!after) put(c, animal, ax, ay, as); A[home](c); if (after) put(c, animal, ax, ay, as); };
A.a_bee = H('hive', 'bee', 120, 110, .4);
A.a_bird = H('nest', 'sparrow', 50, 30, .46);
A.a_rabbit = H('burrow', 'rabbit', 110, 104, .42);
A.a_bear = H('cave', 'bear', 50, 80, .52);
A.a_fish = c => { A.aquarium(c); put(c, 'clownfish', 40, 60, .4); put(c, 'fish', 100, 100, .36); };
A.a_horse = H('stable', 'horse', 90, 90, .5);
A.a_hen = H('coop', 'chicken', 116, 116, .38);
A.a_ant = c => { A.anthill(c); for (const [x, y] of [[20, 150], [130, 150], [70, 40]]) put(c, 'ant', x, y, .22); };
A.a_cow = H('barn', 'cow', 100, 100, .5);
A.a_spider = c => { A.web(c); put(c, 'spider', 40, 26, .6); };
A.a_dog = H('kennel', 'dog', 110, 110, .44);
A.a_lion = H('den', 'lion', 50, 80, .52);
module.exports = lib;
