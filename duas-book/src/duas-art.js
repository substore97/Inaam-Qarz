// Extra 3D art for "أدعيتي الجميلة": mosque, tissue box, heart.
const lib = require('../../food-book/src/food2-art');
const { A } = lib;

A.mosque = c => {
  c.shadow(100, 190, 90, 8);
  c.cyl(150, 50, 22, 132, '#f4f6fb', 6, { top: '#ffffff' });
  c.raw('<rect x="148" y="90" width="26" height="8" fill="#36b14f"/>');
  c.path('M150 50 Q161 26 172 50 Z', '#36b14f', { vert: true });
  c.line('M161 26 V14', '#ffc93b', 3); c.ball(161, 12, 4, '#ffc93b');
  c.raw(`<rect x="24" y="104" width="128" height="80" rx="6" fill="${c.vg('#f4f6fb')}" ${c.edge('#f4f6fb')}/>`);
  c.raw('<path d="M74 184 V150 Q88 130 102 150 V184 Z" fill="#36b14f"/>');
  for (const x of [40, 124]) c.raw(`<path d="M${x - 8} 150 V134 Q${x} 122 ${x + 8} 134 V150 Z" fill="#7fcff5"/>`);
  c.path('M34 106 Q34 50 88 46 Q142 50 142 106 Z', '#36c45d', { shine: [64, 70, 12, 6, -25, .7] });
  c.line('M88 46 V24', '#ffc93b', 3);
  c.raw(`<mask id="${c.id}cm"><rect width="200" height="200" fill="#fff"/><circle cx="93" cy="16" r="8" fill="#000"/></mask><circle cx="88" cy="18" r="9" fill="#ffc93b" mask="url(#${c.id}cm)"/>`);
  c.face(88, 84, .8);
};
A.tissue = c => {
  c.shadow(100, 186, 70, 8);
  c.path('M84 70 Q76 30 100 22 Q124 30 116 70 Z', '#ffffff', { vert: true });
  c.raw(`<rect x="34" y="70" width="132" height="108" rx="16" fill="${c.vg('#7fcff5')}" ${c.edge('#7fcff5')}/>`);
  c.raw('<rect x="70" y="66" width="60" height="14" rx="7" fill="#4fa8ff"/>');
  for (const [x, y] of [[56, 100], [146, 110], [60, 156], [140, 160]]) c.star(x, y, 8, '#ffffff');
  c.face(100, 128, 1);
};
A.bigheart = c => { c.shadow(100, 186, 60, 8); c.heart(100, 104, 70, '#ff4f8b'); c.face(100, 98, 1.1); };
module.exports = lib;
