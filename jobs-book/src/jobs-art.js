// 3D kid characters dressed for professions – "مهني الجميلة".
const lib = require('../../body-book/src/body-art');
const { A } = lib;
const SKIN = '#ffcfa8';
const put = (c, name, x, y, s, param) => { c.raw(`<g transform="translate(${x} ${y}) scale(${s})">`); A[name](c, param); c.raw('</g>'); };

function kid(c, o) {
  const top = o.shirt, pants = o.pants || '#3d4f7a';
  c.shadow(100, 192, 50, 6);
  c.raw(`<rect x="72" y="150" width="22" height="36" rx="8" fill="${c.lg(pants)}"/><rect x="106" y="150" width="22" height="36" rx="8" fill="${c.lg(pants)}"/>`);
  c.ell(82, 188, 15, 7, '#3d3d5c').ell(118, 188, 15, 7, '#3d3d5c');
  c.ell(54, 126, 12, 26, top, { rot: 22 }).ell(146, 126, 12, 26, top, { rot: -22 });
  c.ball(46, 150, 10, SKIN).ball(154, 150, 10, SKIN);
  c.raw(`<rect x="62" y="98" width="76" height="62" rx="24" fill="${c.vg(top)}" ${c.edge(top)}/>`);
  if (o.body) o.body();
  if (o.girl) { for (const sx of [-1, 1]) { c.ball(100 + sx * 46, 70, 17, o.hair || '#5a3a22'); c.ball(100 + sx * 40, 54, 6, '#ff6fae', { shine: false }); } }
  c.ball(64, 64, 10, SKIN).ball(136, 64, 10, SKIN);
  c.ball(100, 62, 38, SKIN);
  if (!o.hatOnly) c.path('M62 58 Q60 22 100 22 Q140 22 138 58 Q128 40 112 40 Q104 30 92 38 Q76 36 62 58 Z', o.hair || '#5a3a22');
  c.face(100, 72, .8);
  if (o.hat) o.hat();
  if (o.prop) o.prop();
}
const coatLines = c => c.raw('<path d="M100 100 V158 M84 100 L100 118 L116 100" stroke="#c5ccd8" stroke-width="3" fill="none"/>');

A.doctor = c => kid(c, { shirt: '#f7f9fc', pants: '#4fa8ff', body: () => { coatLines(c); c.line('M78 102 Q76 140 96 140 M122 102 Q124 140 104 140', '#3d3d5c', 3.5); c.ball(100, 142, 6, '#c5ccd8'); c.raw('<path d="M120 116 h10 M125 111 v10" stroke="#ff4757" stroke-width="4"/>'); } });
A.teacher = c => kid(c, { shirt: '#36c45d', body: () => c.raw('<path d="M84 100 L100 114 L116 100" stroke="#fff" stroke-width="4" fill="none"/>'), prop: () => put(c, 'book', 128, 118, .36) });
A.policekid = c => kid(c, { shirt: '#2f55c4', pants: '#1f3a8f', hatOnly: false,
  body: () => { c.star(118, 116, 8, '#ffd23f'); c.raw('<path d="M62 106 H138" stroke="#1f3a8f" stroke-width="4"/>'); },
  hat: () => { c.path('M58 40 Q60 14 100 14 Q140 14 142 40 Z', '#1f3a8f', { vert: true }); c.ell(100, 42, 46, 8, '#14275f'); c.star(100, 28, 7, '#ffd23f'); } });
A.firekid = c => kid(c, { shirt: '#e8392b', pants: '#b52a1f',
  body: () => c.raw('<path d="M62 132 H138 M62 144 H138" stroke="#ffd23f" stroke-width="5"/>'),
  hat: () => { c.path('M56 46 Q58 10 100 10 Q142 10 144 46 Z', '#e8392b', { vert: true }); c.ell(100, 46, 52, 9, '#c22a1f'); c.raw('<path d="M90 16 h20 v20 h-20 Z" fill="#ffd23f"/>'); } });
A.chef = c => kid(c, { shirt: '#ffffff', pants: '#3d3d5c',
  body: () => { for (const y of [112, 128, 144]) { c.ball(90, y, 3.5, '#c5ccd8', { shine: false }); c.ball(110, y, 3.5, '#c5ccd8', { shine: false }); } c.raw('<path d="M70 100 L100 108 L130 100" stroke="#ff4757" stroke-width="5" fill="none"/>'); },
  hat: () => { c.raw(`<rect x="72" y="22" width="56" height="18" rx="4" fill="${c.vg('#ffffff')}" stroke="#d5dbe6"/>`); c.ball(80, 20, 14, '#ffffff').ball(100, 16, 15, '#ffffff').ball(120, 20, 14, '#ffffff'); },
  prop: () => put(c, 'spoon', 130, 112, .4) });
A.farmer = c => kid(c, { shirt: '#ffd23f', pants: '#2f6fe0',
  body: () => c.raw('<rect x="72" y="118" width="56" height="42" rx="8" fill="#2f6fe0"/><path d="M76 118 L70 100 M124 118 L130 100" stroke="#2f6fe0" stroke-width="7"/>'),
  hat: () => { c.ell(100, 36, 60, 13, '#e8c08a'); c.path('M70 36 Q72 12 100 12 Q128 12 130 36 Z', '#f2d09a', { vert: true }); c.raw('<rect x="70" y="28" width="60" height="7" fill="#ff4757"/>'); },
  prop: () => put(c, 'carrot', 132, 108, .38) });
A.pilot = c => kid(c, { shirt: '#1f3a6f', pants: '#1f3a6f',
  body: () => { c.raw('<path d="M84 100 L100 118 L116 100" stroke="#fff" stroke-width="4" fill="none"/><path d="M106 112 h22 M110 108 h14" stroke="#ffd23f" stroke-width="3"/>'); for (const y of [124, 140]) c.ball(100, y, 3.5, '#ffd23f', { shine: false }); },
  hat: () => { c.path('M58 40 Q58 16 100 16 Q142 16 142 40 Z', '#1f3a6f', { vert: true }); c.ell(100, 42, 46, 8, '#111f40'); c.raw('<rect x="66" y="32" width="68" height="6" fill="#ffd23f"/>'); c.path('M88 24 L100 20 L112 24 L100 28 Z', '#ffd23f'); } });
A.builder = c => kid(c, { shirt: '#ff8a1f', pants: '#5a6a8a',
  body: () => c.raw('<path d="M62 120 H138 M62 136 H138" stroke="#e6ff6b" stroke-width="6"/>'),
  hat: () => { c.path('M58 44 Q58 10 100 10 Q142 10 142 44 Z', '#ffc61a', { vert: true }); c.ell(100, 44, 54, 8, '#e0a400'); c.raw('<rect x="94" y="12" width="12" height="30" rx="4" fill="#ffd84d"/>'); },
  prop: () => { c.raw(`<g transform="rotate(-30 150 140)"><rect x="146" y="112" width="8" height="46" rx="3" fill="${c.lg('#8b5a2b')}"/><rect x="134" y="104" width="34" height="14" rx="4" fill="${c.vg('#9aa3b5')}"/></g>`); } });
A.painter = c => kid(c, { shirt: '#ff6fae',
  body: () => { for (const [x, y, col] of [[80, 120, '#2f7de8'], [116, 140, '#ffd23f'], [92, 146, '#36c45d']]) c.raw(`<circle cx="${x}" cy="${y}" r="5" fill="${col}"/>`); },
  hat: () => { c.ell(94, 30, 42, 14, '#ff4757', { rot: -10 }); c.ball(80, 18, 5, '#ff4757', { shine: false }); },
  prop: () => put(c, 'palette', 124, 112, .38) });
A.postman = c => kid(c, { shirt: '#4fa8ff', pants: '#2f55c4',
  body: () => c.raw('<path d="M64 102 L136 150" stroke="#8b5a2b" stroke-width="7"/>'),
  hat: () => { c.path('M60 40 Q60 16 100 16 Q140 16 140 40 Z', '#2f55c4', { vert: true }); c.ell(100, 42, 44, 7, '#1f3a8f'); },
  prop: () => put(c, 'envelope', 124, 110, .36) });
A.dentist = c => kid(c, { shirt: '#bfefff', pants: '#2ec4b6', body: () => { coatLines(c); c.raw('<rect x="70" y="40" width="0" height="0"/>'); }, prop: () => put(c, 'tooth', 128, 106, .34) });
A.kidc = (c, col) => kid(c, { shirt: col || '#4fa8ff' });
A.girlc = (c, col) => kid(c, { shirt: col || '#ff6fae', girl: true, hair: '#6b3a1e' });
module.exports = lib;
