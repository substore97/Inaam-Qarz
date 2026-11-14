// Art for "أنبياء الله": shared 3D art chain + the parted sea.
const lib = require('../../science12-book/src/science12-art');
const { A } = lib;
A.seasplit = c => { c.shadow(100, 190, 86, 6);
  c.raw('<path d="M14 60 Q30 40 50 60 T86 60 L76 182 H14 Z" fill="#3f9cf0"/><path d="M186 60 Q170 40 150 60 T114 60 L124 182 H186 Z" fill="#3f9cf0"/>');
  c.raw('<path d="M24 80 q12 -10 24 0 M24 120 q12 -10 24 0 M152 90 q12 -10 24 0 M150 140 q12 -10 24 0" stroke="#bfe3ff" stroke-width="5" fill="none" stroke-linecap="round"/>');
  c.raw('<path d="M86 60 L114 60 L124 182 L76 182 Z" fill="#f3d39b"/><path d="M100 70 L100 176" stroke="#e9bf78" stroke-width="4" stroke-dasharray="8 8"/>');
  c.raw('<path d="M132 36 L118 120" stroke="#8a5a2a" stroke-width="8" stroke-linecap="round"/>'); };
module.exports = lib;
