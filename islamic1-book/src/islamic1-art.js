// Art for "دراساتي الإسلامية" (first-grade Islamic studies). Extends the shared art library.
const lib = require('../../science1-book/src/science1-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
// sky at each prayer time, with a mosque on the horizon
const SKY = { fajr: ['#2b3a8f', '#ff9fb0', 'moon', 140, 30], dhuhr: ['#4fb3ff', '#bfe9ff', 'sun', 70, 6], asr: ['#6fc4ff', '#ffe9a8', 'sun', 130, 40], maghrib: ['#ff7a4a', '#ffd08a', 'sun', 128, 104], isha: ['#0f1a4f', '#2b3a8f', 'moon', 120, 20] };
A.sky = (c, t = 'dhuhr') => {
  const [top, bot, body, bx, by] = SKY[t];
  c.raw(`<defs><linearGradient id="${c.id}sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs><rect x="0" y="0" width="200" height="200" rx="22" fill="url(#${c.id}sk)"/>`);
  if (t === 'isha' || t === 'fajr') for (const [x, y] of [[30, 30], [70, 50], [170, 90], [100, 20], [40, 80]]) c.star(x, y, 5, '#fff3a0');
  put(c, body, bx, by, .34);
  c.raw('<rect x="0" y="160" width="200" height="40" rx="0" fill="#2e7a4a"/><rect x="0" y="182" width="200" height="18" rx="10" fill="#1f5a36"/>');
  put(c, 'mymosque', 50, 92, .5);
};
module.exports = lib;
