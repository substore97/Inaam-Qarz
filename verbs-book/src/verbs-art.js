// Action scenes for "أفعالي". Extends the shared art library.
const lib = require('../../earth-book/src/earth-art');
const { A, Ctx } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const scene = (col, prop, s = .55, px = 96, py = 84, param, who = 'kidc') => c => { put(c, who, -4, 6, .92, col); put(c, prop, px, py, s, param); };
A.v_eat = scene('#ff8a1f', 'sandwich', .46, 104, 90);
A.v_drink = scene('#4fa8ff', 'cup', .44, 108, 90);
A.v_sleep = c => {
  put(c, 'bed', 0, 20, 1);
  const o = Ctx.faceMode; Ctx.faceMode = 'sleep';
  c.ball(52, 92, 26, '#ffcfa8'); c.path('M28 84 Q30 62 54 64 Q74 66 76 84 Q64 74 52 76 Q38 76 28 84 Z', '#5a3a22'); c.face(52, 98, .5);
  Ctx.faceMode = o;
  c.raw('<text x="120" y="60" font-family="Baloo" font-weight="800" font-size="30" fill="#6a3fd0">Z</text><text x="144" y="40" font-family="Baloo" font-weight="800" font-size="22" fill="#9b59d6">z</text><text x="162" y="24" font-family="Baloo" font-weight="800" font-size="16" fill="#b05cff">z</text>');
};
A.v_read = scene('#36c45d', 'book', .5, 100, 90);
A.v_write = c => { put(c, 'kidc', -4, 6, .92, '#ff6fae'); put(c, 'notebook', 96, 100, .46); put(c, 'schoolpencil', 130, 70, .36); };
A.v_draw = scene('#b05cff', 'palette', .48, 102, 90);
A.v_run = c => A.runner(c);
A.v_play = c => A.s_foot(c);
A.v_wash = c => A.h_hands(c);
A.v_pray = c => { put(c, 'prayermat', 0, 50, .9); put(c, 'kidc', 34, 30, .7, '#f2f2f2'); };
A.v_cook = c => { put(c, 'chef', -4, 6, .92); put(c, 'soup', 104, 100, .44); };
A.v_swim = c => A.swim(c);
module.exports = lib;
