// 3D emotion faces for "مشاعري". Extends the shared art library.
const lib = require('../../garden-book/src/garden-art');
const { A } = lib;
const INK = '#2b2340';

function emo(c, col, kind) {
  c.shadow(100, 186, 56, 8);
  c.ball(100, 100, 70, col);
  const eyes = (ry = 9, dy = 0) => { for (const x of [74, 126]) c.raw(`<ellipse cx="${x}" cy="${88 + dy}" rx="8" ry="${ry}" fill="${INK}"/><circle cx="${x + 3}" cy="${84 + dy}" r="3" fill="#fff"/>`); };
  const closed = up => { for (const x of [74, 126]) c.line(up ? `M${x - 10} 90 Q${x} 78 ${x + 10} 90` : `M${x - 10} 86 Q${x} 96 ${x + 10} 86`, INK, 4); };
  const blush = (o = .5) => c.raw(`<ellipse cx="58" cy="112" rx="12" ry="7" fill="#ff6f91" opacity="${o}"/><ellipse cx="142" cy="112" rx="12" ry="7" fill="#ff6f91" opacity="${o}"/>`);
  const brows = (a) => c.line(`M60 ${70 - a} L86 ${70 + a} M140 ${70 - a} L114 ${70 + a}`, INK, 4.5);
  switch (kind) {
    case 'happy': eyes(); blush(); c.line('M74 120 Q100 146 126 120', INK, 5); break;
    case 'sad': eyes(8, 4); brows(-6); c.line('M78 136 Q100 118 122 136', INK, 5); c.drop(132, 116, 1, '#6cc4ff'); break;
    case 'angry': eyes(7, 4); brows(8); c.line('M78 136 Q100 122 122 136', INK, 5); c.raw('<path d="M150 46 l10 -14 M160 54 l14 -8 M148 36 l4 -16" stroke="#ff3b30" stroke-width="4" stroke-linecap="round"/>'); break;
    case 'scared': for (const x of [74, 126]) { c.raw(`<circle cx="${x}" cy="88" r="13" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="90" r="6" fill="${INK}"/>`); } brows(-4); c.line('M76 132 l8 -6 l8 6 l8 -6 l8 6 l8 -6 l8 6', INK, 4); break;
    case 'surprised': for (const x of [74, 126]) c.raw(`<circle cx="${x}" cy="86" r="11" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${x}" cy="87" r="6" fill="${INK}"/>`); c.line('M60 62 Q74 54 88 62 M112 62 Q126 54 140 62', INK, 4); c.raw(`<ellipse cx="100" cy="132" rx="13" ry="17" fill="#c2364f" stroke="${INK}" stroke-width="3"/>`); break;
    case 'sleepy': closed(false); blush(.4); c.raw(`<ellipse cx="100" cy="130" rx="8" ry="6" fill="#c2364f" stroke="${INK}" stroke-width="2.5"/><text x="150" y="50" font-family="Fredoka" font-weight="700" font-size="30" fill="#7b8cff">Z<tspan font-size="20" dy="-10">z</tspan><tspan font-size="14" dy="-8">z</tspan></text>`); break;
    case 'shy': for (const x of [74, 126]) c.raw(`<ellipse cx="${x}" cy="96" rx="7" ry="6" fill="${INK}"/>`); blush(.9); c.line('M88 124 Q100 130 112 124', INK, 4); break;
    case 'love': for (const x of [74, 126]) c.heart(x, 90, 14, '#ff3b5c'); blush(.6); c.line('M74 120 Q100 144 126 120', INK, 5); break;
    case 'laugh': closed(true); blush(.6); c.raw(`<path d="M68 114 Q100 162 132 114 Z" fill="#c2364f" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><path d="M84 140 Q100 150 116 140 Q100 132 84 140 Z" fill="#ff8fa3"/>`); c.drop(46, 92, .8, '#6cc4ff'); c.drop(154, 92, .8, '#6cc4ff'); break;
    case 'proud': closed(true); blush(); c.line('M76 118 Q100 140 124 118', INK, 5); c.star(150, 40, 20, '#ffd23f'); break;
    case 'calm': closed(false); blush(.4); c.line('M84 124 Q100 134 116 124', INK, 4.5); break;
    case 'sick': for (const x of [74, 126]) c.line(`M${x - 9} 88 h18`, INK, 4); c.line('M80 132 Q100 124 120 132', INK, 4); c.raw('<g transform="rotate(-20 120 140)"><rect x="104" y="128" width="58" height="10" rx="5" fill="#ffffff" stroke="#9aa3b5"/><circle cx="160" cy="133" r="7" fill="#ff3b30"/></g>'); c.raw('<rect x="60" y="34" width="80" height="18" rx="9" fill="#ffffff" opacity=".9" stroke="#c5ccd8"/>'); break;
  }
}
const COLS = { happy: '#ffd23f', sad: '#6fa8ff', angry: '#ff6b4a', scared: '#b9a6ff', surprised: '#ffb64a', sleepy: '#9fd8ff', shy: '#ffb3c7', love: '#ff8fb8', laugh: '#ffe14d', proud: '#7ee08a', calm: '#8fe3d4', sick: '#c9e88a' };
for (const k of Object.keys(COLS)) A['f_' + k] = c => emo(c, COLS[k], k);
module.exports = lib;
