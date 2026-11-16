// Noor Cube — pure game rules.
// No DOM and no rendering in here: this file is shared by the game, the hint
// solver and the offline level generator, so all three always agree.
//
// The cube carries a light colour on each of its six faces. Colours are bit
// masks of the additive primaries (R=1, G=2, B=4), so mixing is a bitwise OR:
// R|G = yellow(3), R|B = magenta(5), G|B = cyan(6), R|G|B = white(7).

export const T_VOID = 0;
export const T_FLOOR = 1;
export const T_WELL = 2; // adds its colour to the face that lands on it
export const T_LANT = 3; // lights when the landing face matches exactly
export const T_SHADOW = 4; // wipes the landing face
export const T_FRAG = 5; // collapses once the cube leaves it
export const T_ICE = 6; // cube keeps sliding without turning
export const T_SPIN = 7; // turns the cube a quarter turn clockwise
export const T_TELE = 8; // jumps to the partner portal

// Directions: 0=N (-y), 1=E (+x), 2=S (+y), 3=W (-x)
export const DX = [0, 1, 0, -1];
export const DY = [-1, 0, 1, 0];
export const DIR_KEYS = 'NESW';

// Faces are packed 3 bits each in the order U, D, N, S, E, W.
export const F_U = 0, F_D = 1, F_N = 2, F_S = 3, F_E = 4, F_W = 5;

const pack = (u, d, n, s, e, w) => u | (d << 3) | (n << 6) | (s << 9) | (e << 12) | (w << 15);

export function faceOf(faces, i) {
  return (faces >> (3 * i)) & 7;
}

export function facesToArray(faces) {
  return [faces & 7, (faces >> 3) & 7, (faces >> 6) & 7, (faces >> 9) & 7, (faces >> 12) & 7, (faces >> 15) & 7];
}

export function rollFaces(f, dir) {
  const u = f & 7, d = (f >> 3) & 7, n = (f >> 6) & 7, s = (f >> 9) & 7, e = (f >> 12) & 7, w = (f >> 15) & 7;
  switch (dir) {
    case 0: return pack(s, n, u, d, e, w); // north: top goes to the north side
    case 1: return pack(w, e, n, s, u, d); // east: top goes to the east side
    case 2: return pack(n, s, d, u, e, w); // south
    default: return pack(e, w, n, s, d, u); // west
  }
}

// Quarter turn clockwise seen from above (N -> E -> S -> W -> N).
export function spinFaces(f) {
  const u = f & 7, d = (f >> 3) & 7, n = (f >> 6) & 7, s = (f >> 9) & 7, e = (f >> 12) & 7, w = (f >> 15) & 7;
  return pack(u, d, w, e, n, s);
}

const setDown = (f, c) => (f & ~(7 << 3)) | (c << 3);

const WELL_CHARS = { r: 1, g: 2, b: 4 };

// Level text format, one character per tile:
//   .  empty      o  floor      @  start
//   r g b  light wells          1..7  lanterns (colour mask)
//   x  shadow     f  glass      i  ice      t  turntable     p q  portal pairs
export function compileLevel(def) {
  const rows = def.rows;
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const n = w * h;
  const type = new Uint8Array(n);
  const color = new Uint8Array(n);
  const idx = new Int8Array(n).fill(-1);
  const partner = new Int16Array(n).fill(-1);
  let start = -1, nLant = 0, nFrag = 0;
  const portals = { p: [], q: [] };
  const lanterns = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x] || '.';
      const p = y * w + x;
      if (ch === '.' || ch === ' ') continue;
      type[p] = T_FLOOR;
      if (ch === '@') start = p;
      else if (WELL_CHARS[ch]) { type[p] = T_WELL; color[p] = WELL_CHARS[ch]; }
      else if (ch >= '1' && ch <= '7') { type[p] = T_LANT; color[p] = +ch; idx[p] = nLant++; lanterns.push(p); }
      else if (ch === 'x') type[p] = T_SHADOW;
      else if (ch === 'f') { type[p] = T_FRAG; idx[p] = nFrag++; }
      else if (ch === 'i') type[p] = T_ICE;
      else if (ch === 't') type[p] = T_SPIN;
      else if (ch === 'p' || ch === 'q') { type[p] = T_TELE; color[p] = ch === 'p' ? 0 : 1; portals[ch].push(p); }
      else if (ch !== 'o') throw new Error('Unknown tile "' + ch + '"');
    }
  }
  for (const k of ['p', 'q']) {
    const a = portals[k];
    if (a.length === 0) continue;
    if (a.length !== 2) throw new Error('Portal "' + k + '" needs exactly two tiles');
    partner[a[0]] = a[1];
    partner[a[1]] = a[0];
  }
  if (start < 0) throw new Error('Level has no start tile');
  if (nLant === 0) throw new Error('Level has no lanterns');
  if (nLant > 6 || nFrag > 14 || n > 64) throw new Error('Level too large for the solver key');
  return { w, h, n, type, color, idx, partner, start, nLant, nFrag, lanterns, allLit: (1 << nLant) - 1, def };
}

export function initialState(L) {
  return { pos: L.start, faces: 0, lit: 0, broken: 0 };
}

export function isWon(L, st) {
  return st.lit === L.allLit;
}

function walkable(L, broken, x, y) {
  if (x < 0 || y < 0 || x >= L.w || y >= L.h) return false;
  const p = y * L.w + x;
  const t = L.type[p];
  if (t === T_VOID) return false;
  if (t === T_FRAG && (broken >> L.idx[p]) & 1) return false;
  return true;
}

export function canMove(L, st, dir) {
  const x = st.pos % L.w, y = (st.pos / L.w) | 0;
  return walkable(L, st.broken, x + DX[dir], y + DY[dir]);
}

export function isStuck(L, st) {
  return !canMove(L, st, 0) && !canMove(L, st, 1) && !canMove(L, st, 2) && !canMove(L, st, 3);
}

// Apply one move. Returns the new state, or null when the way is blocked.
// When `ev` is an array, the visible steps are appended to it for the animator.
export function move(L, st, dir, ev) {
  const w = L.w, type = L.type;
  const dx = DX[dir], dy = DY[dir];
  const x = st.pos % w, y = (st.pos / w) | 0;
  let nx = x + dx, ny = y + dy;
  if (!walkable(L, st.broken, nx, ny)) return null;

  let faces = rollFaces(st.faces, dir);
  let lit = st.lit, broken = st.broken;
  let pos = ny * w + nx;
  if (ev) ev.push({ t: 'roll', dir, from: st.pos, to: pos });
  if (type[st.pos] === T_FRAG) {
    broken |= 1 << L.idx[st.pos];
    if (ev) ev.push({ t: 'break', pos: st.pos });
  }

  if (type[pos] === T_ICE) {
    const from = pos;
    for (;;) {
      const tx = nx + dx, ty = ny + dy;
      if (!walkable(L, broken, tx, ty)) break;
      nx = tx; ny = ty;
      if (type[ny * w + nx] !== T_ICE) break;
    }
    pos = ny * w + nx;
    if (ev && pos !== from) ev.push({ t: 'slide', dir, from, to: pos });
  }

  const t = type[pos];
  const down = (faces >> 3) & 7;
  if (t === T_WELL) {
    const mixed = down | L.color[pos];
    faces = setDown(faces, mixed);
    if (ev) ev.push({ t: 'dip', pos, color: L.color[pos], before: down, after: mixed });
  } else if (t === T_LANT) {
    const i = L.idx[pos];
    if (!((lit >> i) & 1)) {
      if (down === L.color[pos]) {
        lit |= 1 << i;
        faces = setDown(faces, 0);
        if (ev) ev.push({ t: 'light', pos, index: i, color: down });
      } else if (ev && down !== 0) {
        ev.push({ t: 'mismatch', pos, have: down, need: L.color[pos] });
      }
    }
  } else if (t === T_SHADOW) {
    if (down !== 0) {
      faces = setDown(faces, 0);
      if (ev) ev.push({ t: 'absorb', pos, color: down });
    }
  } else if (t === T_SPIN) {
    faces = spinFaces(faces);
    if (ev) ev.push({ t: 'spin', pos });
  } else if (t === T_TELE) {
    const to = L.partner[pos];
    if (to >= 0) {
      if (ev) ev.push({ t: 'tele', from: pos, to });
      pos = to;
    }
  }
  return { pos, faces, lit, broken };
}

export function stateKey(st) {
  // pos < 64, faces < 2^18, lit < 2^6, broken < 2^14  => fits in a double exactly
  return st.pos + 64 * (st.faces + 262144 * (st.lit + 64 * st.broken));
}

// Breadth-first solver. Can be run in slices (budget = states to expand per
// call) so the game can search for a hint without freezing a frame.
export class Solver {
  constructor(L, start, maxStates = 400000, maxDepth = 255) {
    this.L = L;
    this.maxStates = maxStates;
    this.maxDepth = maxDepth; // give up on solutions longer than this
    this.states = [start];
    this.parent = [-1];
    this.via = [-1];
    this.depth = [0];
    this.seen = new Set([stateKey(start)]);
    this.head = 0;
    this.done = false;
    this.result = null; // string of N/E/S/W, or null when no solution was found
    this.exhausted = false; // true when the whole space was searched
    if (isWon(L, start)) { this.done = true; this.result = ''; }
  }

  run(budget = Infinity) {
    const { L, states, parent, via, seen, depth } = this;
    let work = 0;
    while (!this.done && this.head < states.length) {
      if (work++ >= budget) return false;
      if (depth[this.head] >= this.maxDepth) { this.done = true; return true; }
      const i = this.head++;
      const s = states[i];
      for (let d = 0; d < 4; d++) {
        const ns = move(L, s, d);
        if (!ns) continue;
        const k = stateKey(ns);
        if (seen.has(k)) continue;
        seen.add(k);
        states.push(ns);
        parent.push(i);
        via.push(d);
        depth.push(depth[i] + 1);
        if (ns.lit === L.allLit) {
          let out = '';
          for (let j = states.length - 1; j > 0; j = parent[j]) out = DIR_KEYS[via[j]] + out;
          this.result = out;
          this.done = true;
          return true;
        }
      }
      if (states.length > this.maxStates) { this.done = true; return true; }
    }
    if (!this.done) { this.done = true; this.exhausted = true; }
    return true;
  }
}

export function solve(L, start = initialState(L), maxStates = 2000000, maxDepth = 255) {
  const s = new Solver(L, start, maxStates, maxDepth);
  s.run();
  return { path: s.result, states: s.states.length, exhausted: s.exhausted };
}

// Replay a move string; returns the final state and every event along the way.
export function replay(L, path) {
  let st = initialState(L);
  const events = [];
  for (const ch of path) {
    const ns = move(L, st, DIR_KEYS.indexOf(ch), events);
    if (!ns) throw new Error('Blocked move in replay: ' + ch);
    st = ns;
  }
  return { state: st, events };
}
