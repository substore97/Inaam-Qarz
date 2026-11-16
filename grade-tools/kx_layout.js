// ===== kx: combinatorial layout for the 100-book series. C.X = {bg,pic,ttl,txt,fac,pno,ord,hm}
const XC = () => { const X = C.X; return `x-bg${X.bg} x-pic${X.pic} x-ttl${X.ttl} x-txt${X.txt} x-fac${X.fac} x-pno${X.pno} x-ord${X.ord}`; };
const XH = i => { const X = C.X, b = X.hue; return X.hm === 1 ? b : X.hm === 2 ? (b + i * 37) % 360 : (i % 2 ? (b + 150) % 360 : b); };
KI.kx = ([t, en, a, x, f1, f2], i) => {
  const T = `<div class="xT"><span class="xN">${AR(i + 1)}</span><h2>${t}</h2><em>${en}</em></div>`;
  const P = `<div class="xP"><div class="xPin n${NA(a)}">${AS(a)}</div></div>`;
  const X = `<div class="xX"><p>${x}</p></div>`;
  const F = `<div class="xF"><div><b>${C.f1L}</b><span>${f1}</span></div><div><b>${C.f2L}</b><span>${f2}</span></div></div>`;
  const o = C.X.ord;
  const body = o === 1 ? T + P + X + F : o === 2 ? P + T + X + F : o === 3 ? T + X + P + F : o === 4 ? T + P + F + X
    : o === 5 ? `<div class="xRow">${P}<div class="xCol">${T}${F}</div></div>${X}` : `${T}<div class="xRow">${P}${F}</div>${X}`;
  return `<div class="xW">${body}</div>`;
};
KH.kx = (a) => `<div class="xT xAH"><h2>${a.title}</h2></div>`;
