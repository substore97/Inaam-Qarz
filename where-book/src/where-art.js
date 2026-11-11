// Position scenes (a cat and a box) for "أين القطة؟". Extends the shared art library.
const lib = require('../../sports-book/src/sports-art');
const { A } = lib;
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };
const ground = c => c.ell(100, 186, 96, 10, '#bfe3a8', { shine: true });
A.p_on = c => { ground(c); put(c, 'box', 40, 70, .6); put(c, 'cat', 54, 34, .46); };
A.p_under = c => { ground(c); put(c, 'table', 0, 0, 1); put(c, 'cat', 60, 110, .4); };
A.p_in = c => { ground(c); put(c, 'catbox', 10, 10, .9); };
A.p_out = c => { ground(c); put(c, 'catout', 10, 10, .9); };
A.p_front = c => { ground(c); put(c, 'box', 40, 40, .6); put(c, 'cat', 54, 100, .46); };
A.p_behind = c => { ground(c); put(c, 'cat', 86, 40, .5); put(c, 'box', 30, 54, .7); };
A.p_beside = c => { ground(c); put(c, 'box', 0, 70, .6); put(c, 'cat', 108, 90, .44); };
A.p_between = c => { ground(c); put(c, 'box', -10, 84, .5); put(c, 'box', 110, 84, .5); put(c, 'cat', 64, 96, .4); };
A.p_right = c => { ground(c); put(c, 'box', 10, 70, .56); put(c, 'cat', 112, 96, .4); c.raw('<path d="M150 40 h30 l-10 -10 M180 40 l-10 10" stroke="#ff4757" stroke-width="6" fill="none" stroke-linecap="round"/>'); };
A.p_left = c => { ground(c); put(c, 'box', 78, 70, .56); put(c, 'cat', 6, 96, .4); c.raw('<path d="M50 40 h-30 l10 -10 M20 40 l10 10" stroke="#2f7de8" stroke-width="6" fill="none" stroke-linecap="round"/>'); };
A.p_near = c => { ground(c); put(c, 'myhouse', 0, 10, .8); put(c, 'cat', 120, 100, .4); };
A.p_far = c => { ground(c); put(c, 'myhouse', -10, 20, .7); put(c, 'cat', 160, 140, .18); c.raw('<path d="M138 170 Q150 150 162 170" stroke="#9aa3b5" stroke-width="3" fill="none" stroke-dasharray="4 5"/>'); };
module.exports = lib;
