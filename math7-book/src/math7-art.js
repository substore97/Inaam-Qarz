// Art for "رياضياتي ٧": parallelogram with base & height. Extends the shared chain.
const lib = require('../../science6-book/src/science6-art');
const { A } = lib;
A.para = c => { c.shadow(100, 176, 80, 7); c.path('M50 60 L180 60 L150 160 L20 160 Z', '#ffb84d', { vert: true });
  c.raw('<path d="M50 60 L50 160" stroke="#e8392b" stroke-width="5" stroke-dasharray="9 6"/><path d="M50 148 h12 v12" fill="none" stroke="#e8392b" stroke-width="3"/><path d="M20 172 L150 172" stroke="#2f55c4" stroke-width="6" stroke-linecap="round"/>'); };
module.exports = lib;
