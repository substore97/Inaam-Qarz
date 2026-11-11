// Art for the first-grade English book. Extends the shared art library.
const lib = require('../../islamic1-book/src/islamic1-art');
const { A } = lib;
A.zigzag = c => { c.shadow(100, 180, 70, 6); c.raw(`<path d="M20 150 L55 60 L90 150 L125 60 L160 150 L185 90" stroke="${c.lg('#ff4757')}" stroke-width="18" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`); };
A.greet = c => A.g_friend(c);
module.exports = lib;
