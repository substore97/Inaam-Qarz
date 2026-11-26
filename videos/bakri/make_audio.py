# Builds the soundtrack: original plucked-string music bed + birds + goat bell, as music_bed.wav (60 s).
import numpy as np, wave, sys

SR = 44100
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(5)
out = np.zeros(N)

def pluck(freq, dur, amp=0.3):
    n = int(SR * dur)
    p = int(SR / freq)
    buf = rng.uniform(-1, 1, p)
    y = np.zeros(n)
    for i in range(n):
        y[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return y * amp

def add(sig, t):
    i = int(t * SR)
    j = min(N, i + len(sig))
    out[i:j] += sig[: j - i]

# pentatonic C major melody, 96 BPM, original
beat = 60 / 96
notes = {"C4": 261.6, "D4": 293.7, "E4": 329.6, "G4": 392.0, "A4": 440.0, "C5": 523.3, "D5": 587.3, "E5": 659.3,
         "C3": 130.8, "G3": 196.0, "A3": 220.0, "F3": 174.6}
melody = ["E4", "G4", "A4", "G4", "E4", "D4", "C4", "D4", "E4", "G4", "C5", "A4", "G4", "E4", "D4", "-",
          "C5", "A4", "G4", "E4", "G4", "A4", "C5", "D5", "E5", "D5", "C5", "A4", "G4", "-", "E4", "-"]
bass = ["C3", "G3", "A3", "F3"]
cache = {}
t = 0.0
bar = 0
while t < DUR - 2:
    for k, nm in enumerate(melody):
        tt = t + k * beat / 2
        if tt > DUR - 2:
            break
        if nm != "-":
            key = (nm, "m")
            if key not in cache:
                cache[key] = pluck(notes[nm], 1.2, 0.18)
            add(cache[key], tt)
    for k in range(4):
        tt = t + k * 4 * beat
        if tt > DUR - 2:
            break
        nm = bass[k]
        key = (nm, "b")
        if key not in cache:
            cache[key] = pluck(notes[nm], 2.4, 0.22)
        add(cache[key], tt)
    t += len(melody) * beat / 2

# soft birds: short frequency-swept chirps
for _ in range(70):
    tt = rng.uniform(0, DUR - 1)
    n = int(SR * rng.uniform(0.05, 0.12))
    f0 = rng.uniform(2500, 4200)
    ff = f0 + rng.uniform(-900, 900) * np.linspace(0, 1, n)
    ph = 2 * np.pi * np.cumsum(ff) / SR
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    for r in range(rng.integers(1, 4)):
        add(0.03 * env * np.sin(ph), tt + r * 0.13)

# goat bell jingles while Chamki hops (seconds)
def bell(tt):
    n = int(SR * 0.5)
    tm = np.arange(n) / SR
    sig = sum(np.sin(2 * np.pi * f * tm) * a for f, a in [(2100, 1), (3350, 0.5), (5100, 0.25)])
    add(0.035 * sig * np.exp(-tm * 9), tt)
for a, b in [(0.2, 4.6), (5.5, 6.2), (8.6, 12.4), (25.0, 29.8), (36.0, 39.8), (55.0, 59.5)]:
    for tt in np.arange(a, b, 0.42):
        bell(tt + rng.uniform(-0.05, 0.05))

# fade in/out
fi = int(SR * 1.0); fo = int(SR * 2.5)
out[:fi] *= np.linspace(0, 1, fi)
out[-fo:] *= np.linspace(1, 0, fo)
out = out / max(1e-9, np.abs(out).max()) * 0.8
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "music_bed.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("ok")
