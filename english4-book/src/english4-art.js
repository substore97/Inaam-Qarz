const lib = require('../../science4-book/src/science4-art');
const { A } = lib;
A.camel_ = c => { c.shadow(100, 188, 70, 7);
  for (const x of [56, 76, 124, 144]) c.raw(`<rect x="${x - 6}" y="120" width="12" height="64" rx="5" fill="${c.lg('#c99a5a')}"/>`);
  c.ell(100, 112, 62, 34, '#d9ac6a'); c.ball(86, 82, 22, '#d9ac6a'); c.ball(118, 84, 20, '#d9ac6a');
  c.raw(`<path d="M150 108 Q172 80 166 46" stroke="#d9ac6a" stroke-width="20" fill="none" stroke-linecap="round"/>`);
  c.ell(172, 42, 18, 12, '#d9ac6a'); c.face(174, 42, .4, { blush: false }); };
module.exports = lib;
