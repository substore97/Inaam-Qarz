// Noor Cube — all sound is synthesised with WebAudio, so there are no audio files to ship.

const NOTE = (semi) => 261.63 * Math.pow(2, semi / 12); // semitones above middle C

// One pitch per primary; mixed colours play their parts together.
const COLOR_NOTES = { 1: [0], 2: [4], 4: [7], 3: [0, 4], 5: [0, 7], 6: [4, 7], 7: [0, 4, 7, 12] };

// Slow four-chord loop for the background pad (D minor colour).
const CHORDS = [
  [-10, 2, 5, 9, 12],
  [-14, 2, 5, 10, 14],
  [-7, 0, 5, 9, 12],
  [-12, 0, 4, 7, 14],
];
const BELL_SCALE = [14, 17, 19, 21, 24, 26, 29];

export class Sound {
  constructor() {
    this.ctx = null;
    this.sfxOn = true;
    this.musicOn = true;
    this.musicTimer = null;
    this.chord = 0;
    this.nextChordAt = 0;
  }

  // Must be called from a user gesture the first time.
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch { return; }
      const c = this.ctx;
      this.master = c.createGain();
      this.master.gain.value = 0.9;
      const comp = c.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      this.master.connect(comp).connect(c.destination);

      this.sfx = c.createGain();
      this.sfx.gain.value = this.sfxOn ? 1 : 0;
      this.sfx.connect(this.master);

      this.music = c.createGain();
      this.music.gain.value = 0;
      this.music.connect(this.master);

      // shared echo for a sense of space
      this.echo = c.createDelay(1);
      this.echo.delayTime.value = 0.31;
      const fb = c.createGain(); fb.gain.value = 0.36;
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      this.echo.connect(lp).connect(fb).connect(this.echo);
      const wet = c.createGain(); wet.gain.value = 0.5;
      this.echo.connect(wet).connect(this.master);

      const len = c.sampleRate;
      this.noise = c.createBuffer(1, len, c.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    if (this.musicOn) this.startMusic();
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend().catch(() => {}); }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume().catch(() => {}); }

  setSfx(on) { this.sfxOn = on; if (this.sfx) this.sfx.gain.value = on ? 1 : 0; }

  setMusic(on) {
    this.musicOn = on;
    if (!this.ctx) return;
    if (on) this.startMusic(); else this.stopMusic();
  }

  tone(freq, { type = 'sine', dur = 0.3, vol = 0.2, attack = 0.005, at = 0, slideTo = 0, echo = 0, out = null } = {}) {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(out || this.sfx);
    if (echo) { const e = c.createGain(); e.gain.value = echo; g.connect(e).connect(this.echo); }
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  hiss({ dur = 0.2, vol = 0.2, freq = 1000, q = 1, type = 'bandpass', at = 0, slideTo = 0 } = {}) {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime + at;
    const s = c.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    const f = c.createBiquadFilter();
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    if (slideTo) f.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(this.sfx);
    s.start(t, Math.random() * 0.5);
    s.stop(t + dur + 0.05);
  }

  play(name, arg) {
    if (!this.ctx || !this.sfxOn) return;
    switch (name) {
      case 'roll':
        this.tone(92, { dur: 0.11, vol: 0.34, slideTo: 52 });
        this.hiss({ dur: 0.05, vol: 0.11, freq: 1700, q: 0.7 });
        break;
      case 'land':
        this.tone(70, { dur: 0.22, vol: 0.45, slideTo: 38 });
        this.hiss({ dur: 0.12, vol: 0.16, freq: 800 });
        break;
      case 'bump':
        this.tone(140, { type: 'triangle', dur: 0.09, vol: 0.2, slideTo: 90 });
        break;
      case 'slide':
        this.hiss({ dur: 0.34, vol: 0.14, freq: 2600, q: 2, slideTo: 5200 });
        break;
      case 'dip': {
        const notes = COLOR_NOTES[arg.color] || [0];
        notes.forEach((n, i) => {
          this.tone(NOTE(n + 12), { dur: 0.7, vol: 0.2, echo: 0.5, at: i * 0.05 });
          this.tone(NOTE(n + 24), { dur: 0.4, vol: 0.06, at: i * 0.05 });
        });
        this.hiss({ dur: 0.3, vol: 0.06, freq: 4200, q: 3 });
        break;
      }
      case 'light': {
        const notes = COLOR_NOTES[arg.color] || [0];
        const run = [...notes, notes[0] + 12, (notes[1] ?? notes[0] + 7) + 12, notes[0] + 24];
        run.forEach((n, i) => this.tone(NOTE(n + 12), { type: 'triangle', dur: 0.9, vol: 0.2, echo: 0.6, at: i * 0.075 }));
        this.tone(NOTE(notes[0] - 12), { dur: 1.1, vol: 0.25 });
        this.hiss({ dur: 0.7, vol: 0.07, freq: 6200, q: 2, slideTo: 9000 });
        break;
      }
      case 'mismatch':
        this.tone(196, { type: 'square', dur: 0.12, vol: 0.07 });
        this.tone(185, { type: 'square', dur: 0.16, vol: 0.07, at: 0.1 });
        break;
      case 'absorb':
        this.tone(420, { dur: 0.45, vol: 0.22, slideTo: 60 });
        this.hiss({ dur: 0.4, vol: 0.1, freq: 900, slideTo: 150 });
        break;
      case 'break':
        this.hiss({ dur: 0.3, vol: 0.26, freq: 5200, q: 1.2, type: 'highpass' });
        for (let i = 0; i < 4; i++) this.tone(1900 + Math.random() * 2600, { dur: 0.12, vol: 0.06, at: i * 0.03 });
        break;
      case 'spin':
        this.tone(330, { type: 'triangle', dur: 0.24, vol: 0.14, slideTo: 620, echo: 0.3 });
        break;
      case 'tele':
        this.tone(240, { dur: 0.32, vol: 0.18, slideTo: 1500, echo: 0.6 });
        this.tone(1500, { dur: 0.3, vol: 0.1, slideTo: 300, at: 0.16, echo: 0.6 });
        break;
      case 'click':
        this.tone(660, { type: 'triangle', dur: 0.07, vol: 0.12 });
        break;
      case 'undo':
        this.tone(520, { type: 'triangle', dur: 0.12, vol: 0.12, slideTo: 330 });
        break;
      case 'hint':
        this.tone(NOTE(19), { dur: 0.3, vol: 0.14, echo: 0.5 });
        this.tone(NOTE(24), { dur: 0.4, vol: 0.14, echo: 0.5, at: 0.09 });
        break;
      case 'star':
        this.tone(NOTE(12 + [0, 4, 7][arg] * 1), { type: 'triangle', dur: 0.5, vol: 0.22, echo: 0.5 });
        this.tone(NOTE(24 + [0, 4, 7][arg]), { dur: 0.35, vol: 0.1 });
        break;
      case 'win':
        [0, 4, 7, 12, 16, 19, 24].forEach((n, i) => this.tone(NOTE(n + 12), { type: 'triangle', dur: 1.2, vol: 0.17, echo: 0.6, at: i * 0.085 }));
        this.tone(NOTE(-12), { dur: 1.8, vol: 0.28 });
        break;
      default:
    }
  }

  // ------------------------------------------------------------ music

  startMusic() {
    const c = this.ctx;
    if (!c || this.musicTimer) return;
    this.music.gain.cancelScheduledValues(c.currentTime);
    this.music.gain.setTargetAtTime(0.55, c.currentTime, 1.2);
    this.nextChordAt = c.currentTime + 0.1;
    const tick = () => {
      if (!this.ctx || this.ctx.state !== 'running') return;
      while (this.nextChordAt < this.ctx.currentTime + 1.5) {
        this._chord(this.nextChordAt);
        this.nextChordAt += 7;
      }
    };
    this.musicTimer = setInterval(tick, 500);
    tick();
  }

  stopMusic() {
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
    if (this.ctx) this.music.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
  }

  _chord(t) {
    const c = this.ctx;
    const notes = CHORDS[this.chord++ % CHORDS.length];
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(380, t);
    lp.frequency.linearRampToValueAtTime(1100, t + 3.5);
    lp.frequency.linearRampToValueAtTime(380, t + 8);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 2.5);
    g.gain.linearRampToValueAtTime(0.0001, t + 8.5);
    lp.connect(g).connect(this.music);
    const e = c.createGain(); e.gain.value = 0.4;
    g.connect(e).connect(this.echo);
    for (const n of notes) {
      for (const det of [-6, 6]) {
        const o = c.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = NOTE(n) / 2;
        o.detune.value = det;
        o.connect(lp);
        o.start(t);
        o.stop(t + 8.6);
      }
    }
    // a few bell notes over the chord
    const count = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const at = t + 0.8 + Math.random() * 5.5 - c.currentTime;
      const n = BELL_SCALE[Math.floor(Math.random() * BELL_SCALE.length)];
      this.tone(NOTE(n) / 2, { dur: 2.2, vol: 0.05, attack: 0.01, at: Math.max(0, at), echo: 0.8, out: this.music });
    }
  }
}
