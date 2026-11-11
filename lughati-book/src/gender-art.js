// Boy/girl and male/female animal pairs for "المذكر والمؤنث". Extends the shared art library.
const lib = require('../../compare-book/src/compare-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const bow = (c, x, y, s = 1) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-18 -12 L-18 12 Z M0 0 L18 -12 L18 12 Z" fill="#ff4f9a" stroke="#c2366a" stroke-width="2"/></g>`); c.ball(x, y, 5 * s, '#ff79b0', { shine: false }); };
const sign = (c, x, t, col) => c.raw(`<rect x="${x - 26}" y="2" width="52" height="34" rx="10" fill="${col}"/><text x="${x}" y="27" text-anchor="middle" font-family="Baloo" font-weight="800" font-size="22" fill="#fff" stroke="rgba(10,20,60,.55)" stroke-width="3" paint-order="stroke">${t}</text>`);
const pair = (bc, gc, prop, ps = .3, boy = 'kidc') => c => {
  put(c, boy, -22, 26, .76, bc); put(c, 'girlc', 70, 26, .76, gc);
  if (prop) put(c, prop, 70, 128, ps);
  sign(c, 54, 'هُوَ', '#2f7de8'); sign(c, 146, 'هِيَ', '#ff4f9a');
};
const apair = (an, s = .5, y = 70, bowX = 150, bowY = 76, an2) => c => {
  put(c, an, -6, y, s); put(c, an2 || an, 94, y, s);
  if (!an2) bow(c, bowX, bowY, 1);
  sign(c, 46, 'هُوَ', '#2f7de8'); sign(c, 146, 'هِيَ', '#ff4f9a');
};
A.g_teacher = pair('#36c45d', '#36c45d', 'book', .3);
A.g_doctor = pair(undefined, '#f7f9fc', 'organheart', .26, 'doctor');
A.g_student = pair('#4fa8ff', '#ff6fae', 'bag', .3);
A.g_player = pair('#ff8a1f', '#ff8a1f', 'football', .26);
A.g_painter = pair('#b05cff', '#b05cff', 'palette', .3);
A.g_cook = pair(undefined, '#ffffff', 'soup', .3, 'chef');
A.g_friend = pair('#ffd23f', '#2ec4b6', 'bigheart', .26);
A.g_neighbor = pair('#ff4757', '#4fa8ff', 'myhouse', .3);
A.g_cat = apair('cat', .5, 74, 168, 86);
A.g_dog = apair('dog', .5, 74, 166, 84);
A.g_hen = apair('rooster', .5, 70, 0, 0, 'chicken');
A.g_horse = apair('horse', .5, 74, 160, 80);
module.exports = lib;
