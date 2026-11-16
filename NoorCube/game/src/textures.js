// Every texture in the game is drawn here at start-up, so the APK ships no image files.
import * as THREE from 'three';

function tex(size, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function rng(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// Eight-pointed star (two squares), the classic khatam motif.
function star8(g, cx, cy, r) {
  for (let k = 0; k < 2; k++) {
    g.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI / 2) * i + (k * Math.PI) / 4 + Math.PI / 4;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.closePath();
    g.stroke();
  }
}

export function makeTextures() {
  const T = {};

  // Stone tile: soft speckle, engraved border, faint star.
  T.tile = tex(256, (g, s) => {
    g.fillStyle = '#fff';
    g.fillRect(0, 0, s, s);
    const r = rng(7);
    for (let i = 0; i < 900; i++) {
      const v = 200 + Math.floor(r() * 55);
      g.fillStyle = `rgba(${v},${v},${v},${0.25 + r() * 0.3})`;
      g.fillRect(r() * s, r() * s, 1 + r() * 2.5, 1 + r() * 2.5);
    }
    const grad = g.createRadialGradient(s / 2, s / 2, s * 0.2, s / 2, s / 2, s * 0.75);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.16)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
    g.strokeStyle = 'rgba(0,0,0,0.2)';
    g.lineWidth = 3;
    roundRect(g, 18, 18, s - 36, s - 36, 14);
    g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.lineWidth = 1.5;
    roundRect(g, 21, 21, s - 42, s - 42, 12);
    g.stroke();
    g.strokeStyle = 'rgba(0,0,0,0.055)';
    g.lineWidth = 2;
    star8(g, s / 2, s / 2, 70);
  });

  // Soft round glow.
  T.glow = tex(128, (g, s) => {
    const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });

  // Light well: glowing pool with rings.
  T.well = tex(256, (g, s) => {
    const c = s / 2;
    const grad = g.createRadialGradient(c, c, 0, c, c, 100);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,0.75)');
    grad.addColorStop(0.8, 'rgba(255,255,255,0.28)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.beginPath(); g.arc(c, c, 100, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.95)';
    g.lineWidth = 7;
    g.beginPath(); g.arc(c, c, 96, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 2.5;
    g.beginPath(); g.arc(c, c, 110, 0, Math.PI * 2); g.stroke();
  });

  // Lantern plate: ring and star, tinted with the colour it needs.
  T.lantern = tex(256, (g, s) => {
    const c = s / 2;
    g.strokeStyle = '#fff';
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = 9;
    g.beginPath(); g.arc(c, c, 102, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 7;
    star8(g, c, c, 80);
    g.fillStyle = '#fff';
    g.beginPath(); g.arc(c, c, 17, 0, Math.PI * 2); g.fill();
    g.lineWidth = 2;
    g.beginPath(); g.arc(c, c, 114, 0, Math.PI * 2); g.stroke();
  });

  // Spiral for shadow tiles and portals.
  T.swirl = tex(256, (g, s) => {
    const c = s / 2;
    g.lineCap = 'round';
    for (let arm = 0; arm < 3; arm++) {
      for (let i = 0; i < 60; i++) {
        const t0 = i / 60, t1 = (i + 1) / 60;
        const a0 = arm * ((Math.PI * 2) / 3) + t0 * 5.2, a1 = arm * ((Math.PI * 2) / 3) + t1 * 5.2;
        g.strokeStyle = `rgba(255,255,255,${0.15 + 0.85 * (1 - t0)})`;
        g.lineWidth = 3 + 9 * (1 - t0);
        g.beginPath();
        g.moveTo(c + Math.cos(a0) * (8 + t0 * 100), c + Math.sin(a0) * (8 + t0 * 100));
        g.lineTo(c + Math.cos(a1) * (8 + t1 * 100), c + Math.sin(a1) * (8 + t1 * 100));
        g.stroke();
      }
    }
    g.strokeStyle = 'rgba(255,255,255,0.9)';
    g.lineWidth = 5;
    g.beginPath(); g.arc(c, c, 110, 0, Math.PI * 2); g.stroke();
  });

  // Turntable: ring with three clockwise arrows.
  T.arrows = tex(256, (g, s) => {
    const c = s / 2;
    g.strokeStyle = '#fff';
    g.fillStyle = '#fff';
    g.lineCap = 'round';
    g.lineWidth = 4;
    g.beginPath(); g.arc(c, c, 112, 0, Math.PI * 2); g.stroke();
    for (let i = 0; i < 3; i++) {
      const a0 = (i * Math.PI * 2) / 3, a1 = a0 + 1.45;
      g.lineWidth = 13;
      g.beginPath(); g.arc(c, c, 78, a0, a1); g.stroke();
      const hx = c + Math.cos(a1) * 78, hy = c + Math.sin(a1) * 78;
      g.save();
      g.translate(hx, hy);
      g.rotate(a1 + Math.PI / 2);
      g.beginPath(); g.moveTo(26, 0); g.lineTo(-10, -24); g.lineTo(-10, 24); g.closePath(); g.fill();
      g.restore();
    }
    g.beginPath(); g.arc(c, c, 14, 0, Math.PI * 2); g.fill();
  });

  // Glass cracks.
  T.crack = tex(256, (g, s) => {
    const r = rng(21);
    g.strokeStyle = 'rgba(255,255,255,0.9)';
    g.lineCap = 'round';
    const cx = s * 0.42, cy = s * 0.55;
    for (let i = 0; i < 7; i++) {
      let a = (i / 7) * Math.PI * 2 + r() * 0.5, x = cx, y = cy;
      g.lineWidth = 2.6;
      g.beginPath(); g.moveTo(x, y);
      for (let k = 0; k < 5; k++) {
        a += (r() - 0.5) * 0.9;
        x += Math.cos(a) * (18 + r() * 22); y += Math.sin(a) * (18 + r() * 22);
        g.lineTo(x, y);
      }
      g.stroke();
    }
    g.strokeStyle = 'rgba(255,255,255,0.75)';
    g.lineWidth = 5;
    roundRect(g, 12, 12, s - 24, s - 24, 16);
    g.stroke();
  });

  // Ice: streaks and sparkles.
  T.frost = tex(256, (g, s) => {
    const r = rng(5);
    g.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const x = r() * s, y = r() * s, len = 30 + r() * 80;
      g.strokeStyle = `rgba(255,255,255,${0.25 + r() * 0.5})`;
      g.lineWidth = 1.5 + r() * 3;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y - len * 0.8); g.stroke();
    }
    g.fillStyle = '#fff';
    for (let i = 0; i < 26; i++) {
      const x = 20 + r() * (s - 40), y = 20 + r() * (s - 40), q = 2 + r() * 5;
      g.beginPath(); g.moveTo(x - q, y); g.lineTo(x, y - q); g.lineTo(x + q, y); g.lineTo(x, y + q); g.closePath(); g.fill();
    }
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 4;
    roundRect(g, 12, 12, s - 24, s - 24, 16);
    g.stroke();
  });

  // Cube face: glowing rounded square with a faint star.
  T.panel = tex(256, (g, s) => {
    g.fillStyle = '#fff';
    roundRect(g, 10, 10, s - 20, s - 20, 46);
    g.fill();
    const grad = g.createRadialGradient(s / 2, s / 2, 20, s / 2, s / 2, s * 0.62);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.42)');
    g.fillStyle = grad;
    roundRect(g, 10, 10, s - 20, s - 20, 46);
    g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.2)';
    g.lineWidth = 5;
    star8(g, s / 2, s / 2, 64);
  });

  // Cube face frame: thin gold border.
  T.frame = tex(256, (g, s) => {
    g.strokeStyle = '#fff';
    g.lineWidth = 9;
    roundRect(g, 8, 8, s - 16, s - 16, 50);
    g.stroke();
  });

  // Hint arrow (points to texture "up" = north).
  T.arrow = tex(256, (g, s) => {
    g.fillStyle = '#fff';
    g.beginPath();
    g.moveTo(s / 2, 26);
    g.lineTo(s - 44, 128);
    g.lineTo(s / 2 + 40, 128);
    g.lineTo(s / 2 + 40, 226);
    g.lineTo(s / 2 - 40, 226);
    g.lineTo(s / 2 - 40, 128);
    g.lineTo(44, 128);
    g.closePath();
    g.fill();
  });

  // Ring pulse used for landings and lighting.
  T.ring = tex(256, (g, s) => {
    const c = s / 2;
    const grad = g.createRadialGradient(c, c, 84, c, c, 124);
    grad.addColorStop(0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.6, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, s, s);
  });

  return T;
}
