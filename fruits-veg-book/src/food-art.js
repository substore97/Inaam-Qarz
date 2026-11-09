// Extra 3D fruits & vegetables for "فواكهي وخضراواتي". Extends the shared art library.
const lib = require('../../animals-book/src/animals-art');
const { A } = lib;

// face with white eye-whites, for darker foods
const faceW = (c, cx, cy, s = 1, o = {}) => {
  for (const sx of [-1, 1]) c.raw(`<ellipse cx="${cx + sx * 13 * s}" cy="${cy - 4 * s}" rx="${8 * s}" ry="${9 * s}" fill="#fff"/>`);
  c.face(cx, cy, s, { ...o, mouth: false });
  c.line(`M${cx - 6 * s} ${cy + 7 * s} Q${cx} ${cy + 13 * s} ${cx + 6 * s} ${cy + 7 * s}`, '#fff', 2.6 * s);
};

A.orange = c => {
  c.shadow(100, 186, 55);
  c.ball(100, 110, 64, '#ff9a1f');
  for (const [x, y] of [[70, 140], [130, 135], [118, 160], [80, 165], [140, 105], [60, 110]]) c.raw(`<circle cx="${x}" cy="${y}" r="1.8" fill="#e07a10" opacity=".7"/>`);
  c.ell(100, 48, 4, 8, '#7b4a24');
  c.ell(122, 44, 20, 9, '#45d36a', { rot: -25 });
  c.face(100, 114, 1.2);
};

A.watermelon = c => {
  c.shadow(100, 176, 72);
  c.path('M16 78 A84 84 0 0 0 184 78 Z', '#2fae52', { shine: [40, 110, 6, 18, 30, .5] });
  c.raw('<path d="M27 78 A73 73 0 0 0 173 78 Z" fill="#eaffd9"/>');
  c.path('M35 78 A65 65 0 0 0 165 78 Z', '#ff4d5e', { noEdge: true });
  c.ell(100, 78, 84, 7, '#ff7a86', { noEdge: true });
  for (const [x, y, r] of [[60, 100, 20], [140, 100, -20], [80, 122, 10], [120, 122, -10], [100, 132, 0], [50, 86, 30], [150, 86, -30]])
    c.raw(`<ellipse cx="${x}" cy="${y}" rx="3" ry="5" transform="rotate(${r} ${x} ${y})" fill="#2b2340"/>`);
  c.face(100, 100, 1, { mouthDy: 1 });
};

A.pear = c => {
  c.shadow(100, 188, 50);
  c.line('M100 44 Q98 30 106 22', '#7b4a24', 5);
  c.ell(122, 32, 17, 8, '#45d36a', { rot: -25 });
  c.path('M100 42 C88 42 84 62 80 78 C58 96 48 122 54 146 C62 180 138 180 146 146 C152 122 142 96 120 78 C116 62 112 42 100 42 Z', '#c5e04a', { shine: [76, 108, 8, 16, 20, .6] });
  c.face(100, 136, 1.05);
};

A.cherry = c => {
  c.shadow(100, 186, 62);
  c.line('M72 112 Q86 64 110 36 M132 106 Q122 68 110 36', '#3cae4c', 4);
  c.ell(128, 36, 20, 9, '#45d36a', { rot: -20 });
  c.ball(72, 140, 34, '#d61a3c');
  c.ball(134, 134, 32, '#e0233f');
  c.face(72, 143, .7);
  c.face(134, 137, .66);
};

A.pineapple = c => {
  c.shadow(100, 192, 52);
  for (const [r, l] of [[-40, 30], [-20, 38], [0, 44], [20, 38], [40, 30]]) c.ell(100 + r * .5, 62 - l * .55, 9, l * .75, '#2fae52', { rot: r });
  c.raw(`<clipPath id="${c.id}pc"><ellipse cx="100" cy="128" rx="48" ry="60"/></clipPath>`);
  c.ell(100, 128, 48, 60, '#ffbf3b', { shine: true });
  let lines = '';
  for (let k = -120; k <= 120; k += 22) lines += `M${100 + k} 60 l100 140 M${100 + k} 60 l-100 140 `;
  c.raw(`<g clip-path="url(#${c.id}pc)"><path d="${lines}" stroke="#d98a12" stroke-width="2.4" fill="none" opacity=".75"/></g>`);
  c.raw(`<ellipse cx="100" cy="130" rx="26" ry="20" fill="#ffd36b" opacity=".85"/>`);
  c.face(100, 130, 1);
};

A.tomato = c => {
  c.shadow(100, 186, 58);
  c.ell(100, 114, 66, 58, '#ff3b30', { shine: true });
  c.star(100, 60, 22, '#36b14f');
  c.ell(100, 44, 4, 10, '#2f8f3f');
  c.face(100, 118, 1.15);
};

A.cucumber = c => {
  c.shadow(100, 184, 70);
  c.ell(100, 110, 34, 86, '#3cae4c', { rot: 55, shine: true });
  for (const [t, o] of [[-60, 8], [-38, -12], [-15, 14], [10, -14], [34, 12], [56, -8], [-48, 18], [44, -16]]) {
    const x = 100 + t * .82 + o * .57, y = 110 - t * .57 + o * .82;
    c.raw(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#a8e6a1"/>`);
  }
  c.ell(171, 61, 7, 6, '#2f8f3f');
  c.face(100, 112, .9);
};

A.potato = c => {
  c.shadow(100, 184, 66);
  c.path('M40 112 C34 74 80 58 112 64 C150 70 170 92 164 124 C158 160 120 170 88 166 C56 162 44 140 40 112 Z', '#d1a56a', { shine: [70, 82, 16, 7, -20, .6] });
  for (const [x, y] of [[62, 100], [140, 96], [128, 148], [70, 146], [150, 126]]) c.raw(`<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#a77b43"/>`);
  c.face(102, 116, 1.1);
};

A.eggplant = c => {
  c.shadow(100, 188, 55);
  c.path('M118 56 C152 64 168 110 152 148 C136 186 70 186 58 150 C48 120 70 100 90 88 C102 80 104 60 118 56 Z', '#7b3fa8', { shine: [130, 88, 6, 16, -30, .6] });
  c.path('M100 70 L112 50 L118 66 L130 54 L128 72 L142 72 L124 82 Z', '#3cae4c');
  c.line('M118 54 Q120 40 128 34', '#2f8f3f', 6);
  faceW(c, 104, 138, .95);
};

A.onion = c => {
  c.shadow(100, 190, 55);
  c.line('M92 182 L88 192 M100 184 L100 194 M108 182 L112 192', '#c9a774', 2.5);
  c.path('M100 36 C112 70 162 90 162 132 C162 172 132 186 100 186 C68 186 38 172 38 132 C38 90 88 70 100 36 Z', '#eab05a', { shine: [66, 110, 8, 18, 20, .7] });
  c.line('M100 44 C90 90 70 120 76 178 M100 44 C110 90 130 120 124 178', '#c98a2e', 2.5);
  c.line('M100 36 Q96 22 104 12', '#6fbf4a', 5);
  c.face(100, 134, 1.05);
};

A.pepper = c => {
  c.shadow(100, 190, 56);
  c.path('M58 82 C52 58 80 52 100 62 C120 52 148 58 142 82 C158 122 148 172 120 180 C110 184 90 184 80 180 C52 172 42 122 58 82 Z', '#ffc61a', { shine: [70, 96, 8, 18, 10, .7] });
  c.line('M100 64 C96 110 98 150 100 180', '#e0a400', 2.4);
  c.path('M88 66 Q100 50 112 66 Q100 72 88 66 Z', '#36b14f');
  c.line('M100 60 Q100 40 114 32', '#2f8f3f', 7);
  c.face(100, 126, 1.05);
};

A.broccoli = c => {
  c.shadow(100, 190, 50);
  c.path('M82 120 L118 120 L126 180 Q100 190 74 180 Z', '#a8e07a', { cyl: true });
  c.line('M92 130 L84 112 M108 130 L116 112', '#8ccf5c', 6);
  for (const [x, y, r] of [[64, 94, 26], [136, 94, 26], [80, 66, 27], [120, 66, 27], [100, 52, 26], [100, 92, 34]]) c.ball(x, y, r, '#2e9e45');
  faceW(c, 100, 92, .95);
};

module.exports = lib;
