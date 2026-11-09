// Extra 3D art for "أضدادي الجميلة": pencil, cup, box and small composed scenes.
const lib = require('../../vehicles-book/src/vehicles-art');
const { A, Ctx } = lib;

const box = (c, x, y, w, h, col, r = 10) => c.raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c.vg(col)}" ${c.edge(col)}/>`);

// pencil: param = length of the body (long ≈ 130, short ≈ 40)
A.pencil = (c, len = 130) => {
  const x1 = 150, x0 = x1 - len;
  c.shadow((x0 + 186) / 2, 140, (186 - x0) / 2 + 6, 6);
  c.path(`M${x1} 92 L186 106 L${x1} 120 Z`, '#f3cf9a', { vert: true });
  c.path('M176 102 L186 106 L176 110 Z', '#3d3d5c', { flat: true });
  box(c, x0, 92, len, 28, '#ffc61a', 3);
  c.raw(`<path d="M${x0} 101 H${x1} M${x0} 111 H${x1}" stroke="#e0a400" stroke-width="1.5"/>`);
  box(c, x0 - 12, 91, 14, 30, '#c5ccd8', 2);
  box(c, x0 - 30, 92, 20, 28, '#ff8fab', 8);
  c.face(x0 + len / 2, 106, len > 60 ? .55 : .42, { blush: false });
};

// cup: param = juice level 0..1
A.cup = (c, level = 1) => {
  c.shadow(100, 182, 46, 7);
  const top = 48, bot = 172, lvl = bot - (bot - top - 10) * level;
  const xAt = y => 32 * (y - top) / (bot - top);
  if (level > 0) {
    c.path(`M${58 + xAt(lvl)} ${lvl} L${142 - xAt(lvl)} ${lvl} L${132} ${bot - 4} L${68} ${bot - 4} Z`, '#ff9f1c', { vert: true, noEdge: true });
    c.ell(100, lvl, 42 - xAt(lvl), 6, '#ffbe5c', { noEdge: true });
    c.line('M118 30 L108 120', '#ff4f8b', 6);
  }
  c.raw(`<path d="M56 ${top} L144 ${top} L132 ${bot} L68 ${bot} Z" fill="#dff3ff" fill-opacity=".15" stroke="#7fb8dd" stroke-width="3" stroke-linejoin="round"/>`);
  c.raw(`<ellipse cx="100" cy="${top}" rx="44" ry="7" fill="none" stroke="#7fb8dd" stroke-width="3"/>`);
  c.shine(70, 100, 4, 30, 0, .8);
  c.face(100, level > .4 ? 128 : 116, .9);
};

// cardboard box; param: 'open' | 'closed'
function cardboard(c, open, inside) {
  c.shadow(100, 186, 70, 8);
  if (open) {
    c.path('M40 96 L64 80 L160 80 L136 96 Z', '#7a4f22', { flat: true });
    c.path('M64 80 L44 50 L140 50 L160 80 Z', '#c98f4e', { vert: true });
  }
  if (inside) inside();
  if (open) c.path('M40 96 L14 70 L40 60 L64 80 Z', '#e0a868', { vert: true });
  else {
    c.path('M40 96 L64 80 L160 80 L136 96 Z', '#e9b878', { vert: true });
    c.raw('<path d="M84 96 L108 80 L120 80 L96 96 Z" fill="#c9c2a8"/>');
  }
  c.path('M136 96 L160 80 L160 160 L136 176 Z', '#b9813f', { flat: true });
  box(c, 40, 96, 96, 80, '#d99a55', 4);
  if (open) c.path('M136 96 L166 76 L186 100 L160 112 Z', '#e0a868', { vert: true });
  else c.raw('<rect x="82" y="96" width="14" height="80" fill="#c9c2a8"/>');
}
A.box = (c, state) => { cardboard(c, state === 'open'); c.face(70, 140, .8); };
A.catbox = c => cardboard(c, true, () => { c.raw('<g transform="translate(38 22) scale(.62)">'); A.cat(c); c.raw('</g>'); });
A.catout = c => {
  c.raw('<g transform="translate(70 30) scale(.62)">'); cardboard(c, false); c.raw('</g>');
  c.raw('<g transform="translate(-6 70) scale(.62)">'); A.cat(c); c.raw('</g>');
};
const ballAt = (c, x, y) => c.ball(x, y, 26, '#ff4757').line(`M${x - 25} ${y - 4} Q${x} ${y + 12} ${x + 25} ${y - 4}`, '#ffb3bd', 3);
A.ballfront = c => { c.raw('<g transform="translate(30 0) scale(.85)">'); cardboard(c, false); c.raw('</g>'); ballAt(c, 84, 156); };
A.ballbehind = c => { ballAt(c, 150, 92); c.raw('<g transform="translate(18 14) scale(.85)">'); cardboard(c, false); c.raw('</g>'); };

// art with a forced facial expression
function withFace(mode, fn) { Ctx.faceMode = mode; try { return fn(); } finally { Ctx.faceMode = null; } }

module.exports = { ...lib, withFace };
