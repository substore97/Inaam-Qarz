// Art for "لغتي الجميلة" (Arabic language, first grade). Extends the shared art library.
const lib = require('./gender-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
// param "name,n": n copies of an item arranged nicely
A.group = (c, p = 'pencil,3') => {
  const [n0, k] = p.split(','); const n = +k;
  const L = { 1: [[50, 40, .5]], 2: [[4, 50, .46], [100, 50, .46]], 3: [[0, 70, .38], [62, 20, .38], [124, 70, .38]], 4: [[6, 10, .4], [104, 10, .4], [6, 104, .4], [104, 104, .4]] }[n];
  L.forEach(([x, y, s]) => put(c, n0, x, y, s));
};
A.bigbook = c => { put(c, 'book', 0, 10, 1); };
module.exports = lib;
