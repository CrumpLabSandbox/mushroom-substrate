// Turgor Bow: the web sustained, not plucked. Hyphal tips do not grow smoothly: they advance in pulses.
// Here that pulsing is the bow. While a key is held, small strikes arrive at the pulse rate, a little
// irregular, with a faint hiss of smaller yields between them, and the web rings on under them.
import { Bank, midiHz, clamp, soften, stageAt, rng } from '../kit/dsp.js'
export const create = sr => {
  const V = 6, M = 12, P = { stage: .6, pos: .5, rate: 24, jitter: .3, pressure: .6, ring: .8, own: 1, level: 1 }, rnd = rng(31)
  const voices = Array.from({ length: V }, () => ({ bank: new Bank(M, sr), key: -1, on: false, g: 0, ph: 0, age: 0, vel: 0 }))
  let spec = null, clock = 0, x = new Float32Array(128), energy = 0
  const tune = v => {
    const [a, b, t] = stageAt(spec, P.stage), f0 = midiHz(v.key), z = clamp(P.pos, 0, 1) * 5, z0 = z | 0, z1 = Math.min(5, z0 + 1), zt = z - z0; let norm = 1e-9
    const amp = []
    for (let i = 0; i < M; i++) {
      const ra = a.hz[i] / a.hz[0], rb = (b.hz[i] || a.hz[i]) / b.hz[0], r = (i + 1) + P.own * (ra + (rb - ra) * t - (i + 1))
      v.bank.tune(i, f0 * r, P.ring / (1 + i * .25)); amp.push(Math.abs(a.zone[i][z0] + (a.zone[i][z1] - a.zone[i][z0]) * zt)); norm += amp[i]
      const m = a.mic[i], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); v.bank.hear(i, m[0] / mm, m[1] / mm)
    }
    if (norm < 1e-6) { norm = 0; for (let i = 0; i < M; i++) { amp[i] = 1 / (1 + i); norm += amp[i] } }
    for (let i = 0; i < M; i++) v.bank.drive[i] = amp[i] / norm
  }
  return {
    load(s) { spec = s; for (const v of voices) v.bank.silence() },
    set(k, val) { P[k] = val; if (spec) for (const v of voices) v.key >= 0 && tune(v) },
    noteOn(key, vel) { if (!spec) return; const v = voices.find(v => v.key == key) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b); v.key = key; v.on = true; v.vel = vel; v.age = ++clock; tune(v) },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      const n = L.length; if (x.length != n) x = new Float32Array(n); let e = 0
      for (const v of voices) {
        if (v.key < 0) continue
        for (let i = 0; i < n; i++) {
          v.g += ((v.on ? 1 : 0) - v.g) * .002
          let s = (rnd() - .5) * .05 * P.pressure                                   // the hiss of small yields
          if ((v.ph += P.rate * (1 + (rnd() - .5) * P.jitter) / sr) >= 1) { v.ph -= 1; s += P.pressure * 1.5 } // one pulse of growth
          x[i] = s * v.g * v.vel
        }
        e += v.bank.process(L, R, x)
      }
      energy = Math.min(1, Math.sqrt(e) * 3); soften(L, R, P.level * 1.5)
    },
    view() { return { energy } }
  }
}
