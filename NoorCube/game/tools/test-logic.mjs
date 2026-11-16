// Sanity tests for the rules and the solver. Run with: npm test
import assert from 'node:assert/strict';
import { compileLevel, initialState, move, solve, replay, isWon, rollFaces, spinFaces, faceOf, isStuck, F_D, F_U, F_N, F_S, F_E, F_W } from '../src/logic.js';
import { LEVELS } from '../src/levels.js';

let n = 0;
const test = (name, fn) => { fn(); n++; console.log('ok  ' + name); };
const play = (rows, path) => { const L = compileLevel({ rows }); return { L, ...replay(L, path) }; };

test('four rolls in a line bring every face back', () => {
  const f0 = 1 | (2 << 3) | (3 << 6) | (4 << 9) | (5 << 12) | (6 << 15);
  for (let d = 0; d < 4; d++) {
    let f = f0;
    for (let i = 0; i < 4; i++) f = rollFaces(f, d);
    assert.equal(f, f0);
    assert.equal(rollFaces(rollFaces(f0, d), (d + 2) % 4), f0, 'roll then roll back');
  }
  let f = f0;
  for (let i = 0; i < 4; i++) f = spinFaces(f);
  assert.equal(f, f0);
});

test('rolling east moves top to the east side and east to the floor', () => {
  const f0 = 1 | (2 << 3) | (3 << 6) | (4 << 9) | (5 << 12) | (6 << 15);
  const f = rollFaces(f0, 1);
  assert.equal(faceOf(f, F_E), 1);
  assert.equal(faceOf(f, F_D), 5);
  assert.equal(faceOf(f, F_W), 2);
  assert.equal(faceOf(f, F_U), 6);
  assert.equal(faceOf(f, F_N), 3);
  assert.equal(faceOf(f, F_S), 4);
});

test('spin is clockwise seen from above', () => {
  const f = spinFaces(3 << 6); // colour on north
  assert.equal(faceOf(f, F_E), 3);
});

test('straight line: dip then four rolls lights the lantern', () => {
  const { L, state } = play(['@rooo1'], 'EEEEE');
  assert.ok(isWon(L, state));
  assert.equal(state.faces, 0, 'light is spent on the lantern');
});

test('wrong face down does not light', () => {
  const { L, state } = play(['@roo1'], 'EEEE');
  assert.ok(!isWon(L, state));
});

test('going round a 2x2 block delivers to the neighbouring tile', () => {
  const { L, state } = play(['oo', 'r1', '@.'], 'NNES');
  assert.ok(isWon(L, state));
});

test('mixing red and green makes yellow', () => {
  const { L, state, events } = play(['ooo', 'rg3', '@..'], 'NNESNES');
  assert.ok(isWon(L, state));
  assert.ok(events.some((e) => e.t === 'dip' && e.after === 3));
});

test('lantern needs the exact colour', () => {
  // yellow face on a red lantern: stays dark
  const { L, state, events } = play(['ooo', 'rg1', '@..'], 'NNESNES');
  assert.ok(!isWon(L, state));
  assert.ok(events.some((e) => e.t === 'mismatch'));
});

test('shadow wipes the face', () => {
  const { state, events } = play(['@rooox1'], 'EEEEE');
  assert.ok(events.some((e) => e.t === 'absorb'));
  assert.equal(state.faces, 0);
});

test('glass breaks behind the cube', () => {
  const L = compileLevel({ rows: ['@fo1'] });
  let st = initialState(L);
  st = move(L, st, 1);
  st = move(L, st, 1);
  assert.equal(st.broken, 1);
  assert.equal(move(L, st, 3), null, 'cannot go back over broken glass');
});

test('stuck is detected', () => {
  const L = compileLevel({ rows: ['@f1'] });
  let st = move(L, initialState(L), 1);
  assert.ok(!isStuck(L, st));
  const L2 = compileLevel({ rows: ['1.', '.@'] });
  assert.ok(isStuck(L2, initialState(L2)));
});

test('ice slides without turning', () => {
  const { L, state, events } = play(['@riooo1'], 'EEEEE');
  assert.ok(isWon(L, state));
  assert.ok(events.some((e) => e.t === 'slide'));
});

test('ice stops at the edge', () => {
  const L = compileLevel({ rows: ['@ii.1'] });
  const st = move(L, initialState(L), 1);
  assert.equal(st.pos, 2);
});

test('turntable turns the side faces', () => {
  const { L, state } = play(['..1', '@rt'], 'EEN');
  assert.ok(isWon(L, state));
});

test('portal keeps the orientation', () => {
  const { L, state, events } = play(['@rp.', '....', 'qoo1'], 'EEEEE');
  assert.ok(isWon(L, state));
  assert.ok(events.some((e) => e.t === 'tele'));
});

test('solver finds the shortest path', () => {
  const L = compileLevel({ rows: ['oo', 'r1', '@.'] });
  const r = solve(L);
  assert.equal(r.path.length, 4);
  const L2 = compileLevel({ rows: ['@.1'] });
  const r2 = solve(L2);
  assert.equal(r2.path, null);
  assert.ok(r2.exhausted);
});

test('every shipped level is solvable and its par is optimal', () => {
  assert.ok(LEVELS.length >= 60, 'expected at least 60 levels, got ' + LEVELS.length);
  const seen = new Set();
  for (const def of LEVELS) {
    const L = compileLevel(def);
    const key = def.rows.join('/');
    assert.ok(!seen.has(key), 'duplicate level ' + def.id);
    seen.add(key);
    assert.ok(L.w <= 7 && L.h <= 8, def.id + ' is too big for the screen');
    const { state } = replay(L, def.sol);
    assert.ok(isWon(L, state), def.id + ': stored solution does not win');
    assert.equal(def.sol.length, def.par, def.id + ': par mismatch');
    const r = solve(L, initialState(L), 4000000);
    assert.ok(r.path !== null, def.id + ': solver found nothing');
    assert.equal(r.path.length, def.par, def.id + ': par is not optimal');
  }
});

console.log('\n' + n + ' tests passed');
