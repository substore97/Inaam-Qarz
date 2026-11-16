// Offline level generator for Noor Cube.
//
//   node tools/gen-levels.mjs            generate all worlds in parallel, write src/levels.js
//   node tools/gen-levels.mjs --world 2  generate one world into tools/.cache/
//   node tools/gen-levels.mjs --merge    rebuild src/levels.js from the cache
//
// Every candidate board is solved with the same breadth-first solver the game
// uses for hints, so a shipped level is always solvable and its par is optimal.
import { compileLevel, initialState, solve, replay } from '../src/logic.js';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(HERE, '.cache');
const OUT = path.join(HERE, '..', 'src', 'levels.js');

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hand-made lessons: the first meeting with each mechanic is kept as plain as possible.
const HAND = {
  0: [
    { slot: 0, rows: ['@rooo1'], tip: 'tip_roll' },
    { slot: 1, rows: ['oo', 'r1', '@.'], tip: 'tip_loop' },
  ],
  1: [{ slot: 0, rows: ['ooo', 'rg3', '@..'], tip: 'tip_mix' }],
  2: [{ slot: 0, rows: ['@rfff1'], tip: 'tip_glass' }],
  3: [{ slot: 0, rows: ['@riooo1'], tip: 'tip_ice' }],
  4: [
    { slot: 0, rows: ['..1', '@rt'], tip: 'tip_spin' },
    { slot: 5, rows: ['@rp.', '....', 'qoo1'], tip: 'tip_portal' },
  ],
  5: [],
};

const BUDGET_MS = +(process.env.GEN_SECONDS || 200) * 1000; // per world
const PRIM = [1, 2, 4];
const SECOND = [3, 5, 6];

// Each world: how boards are made (gen) and what each of the 12 slots asks for.
// A slot is { L: wanted solution length, ...filters }.
const WORLDS = [
  { // 1. Dawn — plain colours
    cap: 200000, tries: 9000,
    gen: (R) => ({
      w: R.int(3, 5), h: R.int(3, 5), fill: R.float(0.62, 0.95),
      lanterns: R.multi(PRIM, R.int(1, 3)),
    }),
    slots: [null, null, { L: 6, lant: 1 }, { L: 7, lant: 1 }, { L: 8, lant: 2 }, { L: 9, lant: 2 }, { L: 10, lant: 2 },
      { L: 11, lant: 2 }, { L: 12, lant: 3 }, { L: 13, lant: 3 }, { L: 15, lant: 3 }, { L: 17, lant: 3 }],
  },
  { // 2. Colours — mixing, shadows
    cap: 300000, tries: 30000,
    gen: (R) => {
      const n = R.int(1, 3);
      const lanterns = [R.pick(SECOND)];
      while (lanterns.length < n) lanterns.push(R.pick(R.chance(0.5) ? SECOND : PRIM));
      return { w: R.int(3, 5), h: R.int(3, 6), fill: R.float(0.6, 0.95), lanterns, shadow: R.chance(0.55) ? R.int(1, 2) : 0 };
    },
    slots: [null, { L: 8, lant: 1 }, { L: 9, lant: 1 }, { L: 10, lant: 2, shadow: true }, { L: 11, lant: 2 }, { L: 12, lant: 2, shadow: true },
      { L: 13, lant: 2 }, { L: 14, lant: 2 }, { L: 15, lant: 3, shadow: true }, { L: 17, lant: 3 }, { L: 19, lant: 3 }, { L: 21, lant: 3 }],
  },
  { // 3. Glass — tiles that fall away
    cap: 300000, tries: 30000,
    gen: (R) => {
      const n = R.int(1, 3);
      const lanterns = [];
      while (lanterns.length < n) lanterns.push(R.pick(R.chance(0.35) ? SECOND : PRIM));
      return { w: R.int(3, 5), h: R.int(3, 6), fill: R.float(0.7, 1), lanterns, fragFrac: R.float(0.25, 0.7), shadow: R.chance(0.15) ? 1 : 0 };
    },
    need: ['frag'],
    slots: [null, { L: 7, lant: 1 }, { L: 8, lant: 1 }, { L: 9, lant: 2 }, { L: 10, lant: 2 }, { L: 11, lant: 2 }, { L: 12, lant: 2 },
      { L: 13, lant: 2 }, { L: 14, lant: 3 }, { L: 16, lant: 3 }, { L: 18, lant: 3 }, { L: 20, lant: 3 }],
  },
  { // 4. Ice — sliding
    cap: 300000, tries: 30000,
    gen: (R) => {
      const n = R.int(1, 3);
      const lanterns = [];
      while (lanterns.length < n) lanterns.push(R.pick(R.chance(0.4) ? SECOND : PRIM));
      return { w: R.int(4, 6), h: R.int(3, 6), fill: R.float(0.65, 0.95), lanterns, ice: R.int(2, 7), fragFrac: R.chance(0.3) ? R.float(0.1, 0.3) : 0, shadow: R.chance(0.2) ? 1 : 0 };
    },
    need: ['ice'],
    slots: [null, { L: 7, lant: 1 }, { L: 8, lant: 1 }, { L: 9, lant: 2 }, { L: 10, lant: 2 }, { L: 11, lant: 2 }, { L: 12, lant: 2 },
      { L: 13, lant: 2 }, { L: 15, lant: 3 }, { L: 17, lant: 3 }, { L: 19, lant: 3 }, { L: 21, lant: 3 }],
  },
  { // 5. Spin — turntables and portals
    cap: 400000, tries: 30000,
    gen: (R) => {
      const n = R.int(1, 3);
      const lanterns = [];
      while (lanterns.length < n) lanterns.push(R.pick(R.chance(0.4) ? SECOND : PRIM));
      const tele = R.chance(0.5) ? 1 : 0;
      return { w: R.int(3, 6), h: R.int(3, 6), fill: R.float(0.6, 0.95), lanterns, spin: tele ? R.int(0, 2) : R.int(1, 3), tele, fragFrac: R.chance(0.25) ? R.float(0.1, 0.35) : 0, ice: R.chance(0.2) ? R.int(1, 3) : 0 };
    },
    slots: [null, { L: 7, lant: 1, need: ['spin'], no: ['tele'] }, { L: 9, lant: 2, need: ['spin'], no: ['tele'] }, { L: 11, lant: 2, need: ['spin'], no: ['tele'] },
      { L: 13, lant: 2, need: ['spin'], no: ['tele'] }, null, { L: 9, lant: 1, need: ['tele'] }, { L: 11, lant: 2, need: ['tele'] },
      { L: 13, lant: 2, need: ['tele', 'spin'] }, { L: 16, lant: 3, need: ['spin'] }, { L: 19, lant: 3, need: ['tele'] }, { L: 22, lant: 3, need: ['tele', 'spin'] }],
  },
  { // 6. Noor — everything together, white light
    cap: 800000, tries: 30000,
    gen: (R) => {
      const n = R.int(2, 4);
      const lanterns = R.chance(0.6) ? [7] : [R.pick(SECOND)];
      while (lanterns.length < n) lanterns.push(R.pick(R.chance(0.55) ? SECOND : PRIM));
      return {
        w: R.int(4, 6), h: R.int(4, 7), fill: R.float(0.6, 0.92), lanterns,
        shadow: R.chance(0.4) ? 1 : 0, fragFrac: R.chance(0.6) ? R.float(0.1, 0.4) : 0,
        ice: R.chance(0.5) ? R.int(1, 5) : 0, spin: R.chance(0.5) ? R.int(1, 2) : 0, tele: R.chance(0.35) ? 1 : 0,
      };
    },
    minFeatures: 2,
    slots: [{ L: 12, lant: 2 }, { L: 14, lant: 2 }, { L: 15, lant: 2, white: true }, { L: 16, lant: 3 }, { L: 18, lant: 3 }, { L: 19, lant: 3, white: true },
      { L: 21, lant: 3 }, { L: 23, lant: 3 }, { L: 25, lant: 3, white: true }, { L: 27, lant: 4 }, { L: 30, lant: 4 }, { L: 33, lant: 4, white: true }],
  },
];

function makeR(seed) {
  const r = mulberry32(seed);
  const R = {
    next: r,
    int: (a, b) => a + Math.floor(r() * (b - a + 1)),
    float: (a, b) => a + r() * (b - a),
    chance: (p) => r() < p,
    pick: (arr) => arr[Math.floor(r() * arr.length)],
    multi: (arr, n) => Array.from({ length: n }, () => arr[Math.floor(r() * arr.length)]),
    shuffle: (arr) => {
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr;
    },
  };
  return R;
}

// Grow a connected blob of tiles, optionally mirrored, cropped to its bounding box.
function makeShape(R, w, h, fill) {
  const g = Array.from({ length: h }, () => new Array(w).fill(false));
  const mirror = R.chance(0.4);
  const want = Math.max(4, Math.round(w * h * fill));
  const sx = mirror ? Math.floor((w - 1) / 2) : R.int(0, w - 1);
  const sy = R.int(0, h - 1);
  let count = 0;
  const put = (x, y) => {
    if (!g[y][x]) { g[y][x] = true; count++; }
    if (mirror) { const mx = w - 1 - x; if (!g[y][mx]) { g[y][mx] = true; count++; } }
  };
  put(sx, sy);
  let guard = 0;
  while (count < want && guard++ < 500) {
    const frontier = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (g[y][x]) continue;
      let nb = 0;
      if (x > 0 && g[y][x - 1]) nb++;
      if (x < w - 1 && g[y][x + 1]) nb++;
      if (y > 0 && g[y - 1][x]) nb++;
      if (y < h - 1 && g[y + 1][x]) nb++;
      if (nb) frontier.push([x, y]);
    }
    if (!frontier.length) break;
    const [x, y] = R.pick(frontier);
    put(x, y);
  }
  let x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (g[y][x]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const out = [];
  for (let y = y0; y <= y1; y++) out.push(g[y].slice(x0, x1 + 1).map((v) => (v ? 'o' : '.')));
  // connectivity check (mirroring can leave two halves apart)
  const H = out.length, W = out[0].length;
  const seen = new Set();
  let first = null, total = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (out[y][x] === 'o') { total++; if (!first) first = [x, y]; }
  const stack = [first];
  seen.add(first[1] * W + first[0]);
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || out[ny][nx] !== 'o') continue;
      const k = ny * W + nx;
      if (!seen.has(k)) { seen.add(k); stack.push([nx, ny]); }
    }
  }
  if (seen.size !== total) return null;
  return out;
}

function buildBoard(R, p) {
  const g = makeShape(R, p.w, p.h, p.fill);
  if (!g) return null;
  const H = g.length, W = g[0].length;
  const free = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] === 'o') free.push([x, y]);
  R.shuffle(free);
  const take = () => free.pop();
  const set = (c, ch) => { g[c[1]][c[0]] = ch; };

  // wells: one for every primary a lantern needs, sometimes a spare or a decoy
  let bits = 0;
  for (const c of p.lanterns) bits |= c;
  const wells = PRIM.filter((b) => bits & b);
  if (R.chance(0.25)) wells.push(R.pick(wells));
  if (p.decoy && R.chance(p.decoy)) { const others = PRIM.filter((b) => !(bits & b)); if (others.length) wells.push(R.pick(others)); }

  const fixed = 1 + wells.length + p.lanterns.length + (p.shadow || 0) + (p.spin || 0) + 2 * (p.tele || 0);
  if (free.length < fixed + 2) return null;

  // ice first, in straight runs, so slides actually happen
  let iceLeft = p.ice || 0;
  let guard = 0;
  while (iceLeft > 0 && guard++ < 30) {
    const c = R.pick(free);
    const [dx, dy] = R.pick([[1, 0], [0, 1]]);
    const len = Math.min(iceLeft, R.int(1, 3));
    for (let i = 0; i < len; i++) {
      const x = c[0] + dx * i, y = c[1] + dy * i;
      if (x >= W || y >= H || g[y][x] !== 'o') break;
      if (free.length <= fixed + 1) break;
      g[y][x] = 'i';
      const k = free.findIndex((f) => f[0] === x && f[1] === y);
      free.splice(k, 1);
      iceLeft--;
    }
  }

  set(take(), '@');
  for (const b of wells) set(take(), b === 1 ? 'r' : b === 2 ? 'g' : 'b');
  for (const c of p.lanterns) set(take(), String(c));
  for (let i = 0; i < (p.shadow || 0); i++) set(take(), 'x');
  for (let i = 0; i < (p.spin || 0); i++) set(take(), 't');
  if (p.tele) { set(take(), 'p'); set(take(), 'p'); }
  if (p.fragFrac) {
    const n = Math.min(12, Math.round(free.length * p.fragFrac));
    for (let i = 0; i < n; i++) set(take(), 'f');
  }
  return g.map((row) => row.join(''));
}

const countTiles = (rows) => rows.join('').replace(/\./g, '').length;
const swapTiles = (rows, from, to) => rows.map((r) => r.replace(new RegExp('[' + from + ']', 'g'), to));

function analyse(rows, cap, world, minLen, maxLen) {
  let L;
  try { L = compileLevel({ rows }); } catch { return null; }
  const res = solve(L, initialState(L), cap, maxLen);
  if (!res.path || res.path.length < minLen) return null;
  const sol = res.path;
  const { events } = replay(L, sol);
  const used = {
    frag: events.filter((e) => e.t === 'break').length,
    ice: events.filter((e) => e.t === 'slide').length,
    spin: events.filter((e) => e.t === 'spin').length,
    tele: events.filter((e) => e.t === 'tele').length,
    shadow: events.filter((e) => e.t === 'absorb').length,
    mix: events.filter((e) => e.t === 'dip' && e.before !== 0 && e.after !== e.before).length,
  };
  let turns = 0;
  for (let i = 1; i < sol.length; i++) if (sol[i] !== sol[i - 1]) turns++;
  const text = rows.join('');
  const has = { frag: /f/.test(text), ice: /i/.test(text), spin: /t/.test(text), tele: /p/.test(text), shadow: /x/.test(text), white: /7/.test(text) };

  // "matters" = the board plays differently without that kind of tile
  const matters = {};
  // (only solutions no longer than ours are of interest, so the search is depth-limited)
  const without = (from) => {
    const r = solve(compileLevel({ rows: swapTiles(rows, from, 'o') }), undefined, cap, sol.length);
    return r.path ? r.path.length : Infinity;
  };
  if (has.frag) matters.frag = without('f') < sol.length;
  if (has.ice) matters.ice = used.ice > 0 && without('i') !== sol.length;
  if (has.spin) matters.spin = used.spin > 0 && without('t') !== sol.length;
  if (has.tele) matters.tele = used.tele > 0 && without('p') !== sol.length;
  if (has.shadow) matters.shadow = used.shadow > 0 || without('x') < sol.length;

  // tiles that are present but make no difference are clutter: reject
  for (const k of Object.keys(matters)) if (!matters[k]) return null;

  const features = Object.keys(matters).length + (used.mix ? 1 : 0);
  const tiles = countTiles(rows);
  const score = turns * 0.6 - tiles * 0.45 + features * 2 + Math.log2(res.states) * 0.5;
  return { rows, sol, par: sol.length, lant: L.nLant, has, matters, used, features, tiles, score, w: L.w, h: L.h, world };
}

function generateWorld(wi) {
  const W = WORLDS[wi];
  const R = makeR(1000 + wi * 7919);
  const pool = new Map();
  const t0 = Date.now();
  const wanted = W.slots.filter(Boolean).map((s) => s.L);
  const minLen = Math.min(...wanted) - 1, maxLen = Math.max(...wanted) + 2;
  let tries = 0;
  for (; tries < W.tries && Date.now() - t0 < BUDGET_MS; tries++) {
    const p = W.gen(R);
    const rows = buildBoard(R, p);
    if (!rows) continue;
    const key = rows.join('/');
    if (pool.has(key)) continue;
    const a = analyse(rows, W.cap, wi, minLen, maxLen);
    if (!a) continue;
    if (W.need && !W.need.every((k) => a.matters[k])) continue;
    if (W.minFeatures && a.features < W.minFeatures) continue;
    pool.set(key, a);
  }
  const cands = [...pool.values()];
  const hand = HAND[wi];
  const levels = [];
  const usedKeys = new Set();
  let prev = null;
  W.slots.forEach((slot, si) => {
    const h = hand.find((x) => x.slot === si);
    if (h) {
      const a = analyseHand(h.rows, wi);
      levels.push({ rows: h.rows, sol: a.sol, par: a.par, tip: h.tip });
      return;
    }
    if (!slot) throw new Error(`world ${wi + 1} slot ${si + 1} has neither a recipe nor a hand-made level`);
    const ok = (c, slack) => {
      if (usedKeys.has(c.rows.join('/'))) return false;
      if (Math.abs(c.par - slot.L) > slack) return false;
      if (slot.lant && c.lant !== slot.lant && slack < 2) return false;
      if (slot.shadow && !c.has.shadow) return false;
      if (slot.white && !c.has.white) return false;
      if (slot.need && !slot.need.every((k) => c.matters[k])) return false;
      if (slot.no && slot.no.some((k) => c.has[k])) return false;
      return true;
    };
    let best = null;
    for (let slack = 0; slack <= 4 && !best; slack++) {
      for (const c of cands) {
        if (!ok(c, slack)) continue;
        // nudge towards variety: avoid repeating the previous board's footprint
        const s = c.score - (prev && prev.w === c.w && prev.h === c.h ? 1.5 : 0);
        if (!best || s > best.s) best = { c, s };
      }
    }
    if (!best) throw new Error(`world ${wi + 1} slot ${si + 1}: no candidate (pool ${cands.length})`);
    usedKeys.add(best.c.rows.join('/'));
    prev = best.c;
    levels.push({ rows: best.c.rows, sol: best.c.sol, par: best.c.par });
  });

  // first meeting with shadow tiles and white lanterns gets a one-line tip
  const tipFor = (re, tip) => {
    const l = levels.find((x) => !x.tip && re.test(x.rows.join('')));
    if (l && !levels.some((x) => x.tip === tip)) l.tip = tip;
  };
  if (wi === 0 && levels[2] && !levels[2].tip) levels[2].tip = 'tip_map';
  if (wi === 0 && levels[4] && !levels[4].tip) levels[4].tip = 'tip_undo';
  if (wi === 1) tipFor(/x/, 'tip_shadow');
  if (wi === 5) tipFor(/7/, 'tip_white');

  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`world ${wi + 1}: ${tries} boards tried, pool ${cands.length}, picked pars [${levels.map((l) => l.par).join(', ')}] in ${secs}s`);
  return levels;
}

function analyseHand(rows, wi) {
  const L = compileLevel({ rows });
  const res = solve(L);
  if (!res.path) throw new Error('hand-made level is unsolvable: ' + rows.join('/'));
  return { sol: res.path, par: res.path.length, world: wi };
}

function merge() {
  const all = [];
  for (let wi = 0; wi < WORLDS.length; wi++) {
    const f = path.join(CACHE, `world-${wi}.json`);
    if (!existsSync(f)) throw new Error('missing ' + f);
    const levels = JSON.parse(readFileSync(f, 'utf8'));
    levels.forEach((l, i) => all.push({ id: `${wi + 1}-${i + 1}`, world: wi, ...l }));
  }
  const body = all.map((l) => '  ' + JSON.stringify(l)).join(',\n');
  writeFileSync(OUT, `// Generated by tools/gen-levels.mjs — do not edit by hand.\n// par is the optimal number of moves; sol is one optimal solution (used for hints).\nexport const LEVELS = [\n${body},\n];\n`);
  console.log(`wrote ${all.length} levels to src/levels.js`);
}

const args = process.argv.slice(2);
mkdirSync(CACHE, { recursive: true });
if (args[0] === '--world') {
  const wi = +args[1];
  writeFileSync(path.join(CACHE, `world-${wi}.json`), JSON.stringify(generateWorld(wi)));
} else if (args[0] === '--merge') {
  merge();
} else {
  const jobs = WORLDS.map((_, wi) => new Promise((resolve, reject) => {
    const c = spawn(process.execPath, [fileURLToPath(import.meta.url), '--world', String(wi)], { stdio: 'inherit' });
    c.on('exit', (code) => (code === 0 ? resolve() : reject(new Error('world ' + (wi + 1) + ' failed'))));
  }));
  await Promise.all(jobs);
  merge();
}
