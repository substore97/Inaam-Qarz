// Art for "علومي ١٠": Punnett square, ionic bond, water molecule, balance equation, food pyramid of energy, cart with force arrow.
const lib = require('../../math10-book/src/math10-art');
const { A } = lib;
A.punnett = c => { c.shadow(100, 188, 80, 6); c.raw('<rect x="40" y="40" width="140" height="140" rx="10" fill="#ffffff" stroke="#2b2340" stroke-width="4"/><path d="M110 40 V180 M40 110 H180" stroke="#2b2340" stroke-width="4"/>');
  const t = (x, y, s, col) => c.raw(`<text x="${x}" y="${y}" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="${col}">${s}</text>`);
  t(75, 30, 'T', '#e8392b'); t(145, 30, 't', '#2f55c4'); t(24, 85, 'T', '#e8392b'); t(24, 155, 't', '#2f55c4');
  t(75, 86, 'TT', '#2b2340'); t(145, 86, 'Tt', '#2b2340'); t(75, 156, 'Tt', '#2b2340'); t(145, 156, 'tt', '#2b2340'); };
A.ionic = c => { c.shadow(100, 186, 80, 6); c.ball(64, 100, 38, '#b58cff'); c.ball(140, 100, 46, '#36c45d');
  c.raw('<text x="64" y="110" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="26" fill="#fff" stroke="#2b2340" stroke-width="4" paint-order="stroke">Na⁺</text><text x="140" y="110" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="26" fill="#fff" stroke="#2b2340" stroke-width="4" paint-order="stroke">Cl⁻</text>'); };
A.water2 = c => { c.shadow(100, 186, 70, 6); c.raw('<path d="M100 92 L52 140 M100 92 L148 140" stroke="#9aa3b5" stroke-width="10"/>'); c.ball(100, 90, 40, '#e8392b'); c.ball(50, 142, 24, '#f4f6ff'); c.ball(150, 142, 24, '#f4f6ff');
  c.raw('<text x="100" y="100" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="#fff" stroke="#2b2340" stroke-width="4" paint-order="stroke">O</text><text x="50" y="151" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="#2b2340">H</text><text x="150" y="151" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="#2b2340">H</text>'); };
A.cart = c => { c.shadow(100, 188, 80, 6); c.raw('<rect x="40" y="96" width="100" height="60" rx="10" fill="#ff8a1f"/>'); c.ball(64, 166, 14, '#2b2340'); c.ball(118, 166, 14, '#2b2340');
  c.raw('<path d="M146 126 H186" stroke="#e8392b" stroke-width="9" stroke-linecap="round"/><path d="M186 126 l-16 -11 v22 Z" fill="#e8392b"/><text x="164" y="108" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="#e8392b">F</text>'); };
A.epyramid = c => { c.shadow(100, 188, 86, 6); const L = [['#36c45d', 170, 150], ['#ffd23f', 130, 110], ['#ff8a1f', 90, 70], ['#e8392b', 50, 30]];
  L.forEach(([col, w], k) => c.raw(`<rect x="${100 - w / 2}" y="${150 - k * 34}" width="${w}" height="32" rx="6" fill="${col}"/>`)); };
module.exports = lib;
