// Shared art for the grade-3 books. Extends the shared art library.
const lib = require('../../lughati2-book/src/grade2-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
A.students = c => { put(c, 'kidc', -6, 50, .6, '#4fa8ff'); put(c, 'kidc', 58, 50, .6, '#36c45d'); put(c, 'kidc', 122, 50, .6, '#ff8a1f'); };
A.girls = c => { put(c, 'girlc', -6, 50, .6, '#ff6fae'); put(c, 'girlc', 58, 50, .6, '#b05cff'); put(c, 'girlc', 122, 50, .6, '#2ec4b6'); };
A.books3 = c => A.group(c, 'book,3');
A.redrose = c => A.rose(c);
A.clearsky = c => { c.raw(`<rect x="0" y="0" width="200" height="200" rx="24" fill="${c.vg('#8fd6ff')}"/>`); put(c, 'sun', 100, 10, .5); put(c, 'cloud', 0, 90, .5); };
A.punct = (c, t = '؟') => { c.shadow(100, 186, 60, 7); c.ball(100, 100, 76, '#ffd23f'); c.raw(`<text x="100" y="132" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="100" fill="#fff" stroke="#7a3a00" stroke-width="4" paint-order="stroke">${t}</text>`); };
module.exports = lib;
