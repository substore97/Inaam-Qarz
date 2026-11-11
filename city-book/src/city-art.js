// 3D buildings for "مدينتي الجميلة". Extends the shared art library.
const lib = require('../../manners-book/src/manners-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };

function bld(c, o) {
  const { wall, roof = '#ff6b4a', w = 140, h = 110, sign, icon, flat, door = '#8b5a2b' } = o;
  const x = 100 - w / 2, y = 186 - h;
  c.ell(100, 188, w / 2 + 24, 10, '#9be07a', { shine: true });
  c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c.vg(wall)}" ${c.edge(wall)}/>`);
  if (flat) c.raw(`<rect x="${x - 6}" y="${y - 12}" width="${w + 12}" height="16" rx="5" fill="${c.vg(roof)}"/>`);
  else c.path(`M${x - 12} ${y + 4} L100 ${y - 46} L${x + w + 12} ${y + 4} Z`, roof, { vert: true });
  const cols = Math.floor(w / 44);
  for (let i = 0; i < cols; i++) for (const yy of [y + 18]) {
    const wx = x + 12 + i * ((w - 24) / cols) + 4;
    if (Math.abs(wx + 12 - 100) < 18) continue;
    c.raw(`<rect x="${wx}" y="${yy}" width="24" height="24" rx="5" fill="${c.vg('#bfe6ff')}" stroke="#ffffff" stroke-width="3"/>`);
  }
  c.raw(`<rect x="86" y="${186 - 44}" width="28" height="44" rx="6" fill="${c.vg(door)}"/>`);
  if (sign) { c.raw(`<rect x="${100 - sign.length * 7 - 12}" y="${y + 50}" width="${sign.length * 14 + 24}" height="28" rx="8" fill="#ffffff" stroke="${roof}" stroke-width="3"/><text x="100" y="${y + 70}" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="17" fill="${roof}">${sign}</text>`); }
  if (icon) icon(x, y);
  c.face(70, 186 - 24, .55, { blush: false });
}
A.school = c => bld(c, { wall: '#ffd23f', roof: '#2f7de8', sign: 'مَدْرَسَة', icon: (x, y) => { c.line(`M100 ${y - 46} V${y - 76}`, '#5a5a6e', 3); c.path(`M100 ${y - 76} L124 ${y - 68} L100 ${y - 60} Z`, '#36c45d', { flat: true }); } });
A.hospital = c => bld(c, { wall: '#f7f9fc', roof: '#ff4757', flat: true, w: 150, h: 130, sign: 'مُسْتَشْفَى', icon: (x, y) => c.raw(`<mask id="${c.id}hc"><rect width="200" height="200" fill="#fff"/><circle cx="${106}" cy="${y - 34}" r="14" fill="#000"/></mask><circle cx="100" cy="${y - 32}" r="17" fill="#ff4757" mask="url(#${c.id}hc)"/>`) });
A.market = c => { bld(c, { wall: '#ffe0b8', roof: '#36c45d', flat: true, w: 150, h: 100, sign: 'سُوق' }); for (let i = 0; i < 6; i++) c.raw(`<path d="M${25 + i * 25} 90 h25 v18 q-12.5 10 -25 0 Z" fill="${i % 2 ? '#ffffff' : '#ff4757'}"/>`); put(c, 'apple', 126, 150, .18); put(c, 'banana', 30, 150, .2); };
A.bakery = c => { bld(c, { wall: '#ffd9a8', roof: '#b5733f', sign: 'مَخْبَز' }); put(c, 'bread', 70, 20, .3); };
A.firestation = c => { bld(c, { wall: '#ff6b5a', roof: '#c2364f', flat: true, w: 160, h: 120, sign: 'الإِطْفَاء', door: '#ffd23f' }); c.raw('<rect x="124" y="148" width="40" height="38" rx="5" fill="#ffffff" stroke="#c2364f" stroke-width="3"/><path d="M124 160 h40 M124 172 h40" stroke="#c5ccd8" stroke-width="2"/>'); };
A.policestation = c => { bld(c, { wall: '#bfd8ff', roof: '#1f3a8f', flat: true, w: 150, h: 120, sign: 'الشُّرْطَة' }); c.star(100, 48, 14, '#ffd23f'); };
A.library = c => { bld(c, { wall: '#e8d8ff', roof: '#6a3fd0', w: 150, h: 115, sign: 'مَكْتَبَة' }); put(c, 'book', 74, 6, .26); };
A.airport = c => {
  c.ell(100, 188, 94, 10, '#9be07a', { shine: true });
  c.raw(`<rect x="134" y="54" width="20" height="132" rx="6" fill="${c.lg('#d5dbe6')}"/>`);
  c.path('M122 54 L166 54 L160 30 L128 30 Z', '#4fa8ff', { vert: true });
  c.raw(`<rect x="10" y="120" width="130" height="66" rx="8" fill="${c.vg('#e6ebf3')}" ${c.edge('#e6ebf3')}/><rect x="18" y="130" width="114" height="24" rx="5" fill="#9fd8ff"/>`);
  c.raw('<text x="75" y="176" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="17" fill="#2f7de8">مَطَار</text>');
  put(c, 'plane', 20, 6, .5);
};
A.postoffice = c => { bld(c, { wall: '#ffe680', roof: '#2f55c4', flat: true, w: 150, h: 115, sign: 'البَرِيد' }); put(c, 'envelope', 74, 22, .26); };
A.park = c => { c.ell(100, 186, 96, 14, '#7ed99a', { shine: true }); put(c, 'gtree', 0, 10, .6); put(c, 'gtree', 90, 20, .5); c.raw(`<rect x="60" y="150" width="80" height="10" rx="4" fill="${c.vg('#c98a4e')}"/><rect x="60" y="136" width="80" height="8" rx="4" fill="${c.vg('#c98a4e')}"/><path d="M66 160 v18 M134 160 v18" stroke="#8b5a2b" stroke-width="5"/>`); put(c, 'flower', 140, 130, .28); put(c, 'flower', 20, 140, .24); };
A.mymosque = c => A.mosque(c);
A.myhouse = c => A.house(c);
module.exports = lib;
