// Spike Table: a wavetable instrument. The table is one cycle of the voltage between two electrodes at each
// of 64 stages of the network's growth. A held note scans through the table, so the tone changes the way
// the electrical wave changed as the fungus grew.
import { midiHz, clamp, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const S = 512, P = { pos: .2, sweep: .15, depth: .6, attack: .02, release: .6, level: 1 }, V = 8, voices = Array.from({ length: V }, () => ({ key: -1, f: 0, ph: 0, g: 0, on: false, age: 0, vel: 0 }))
  let levels = null, F = 0, clock = 0, lfo = 0, pos = 0
  return {
    load(spec) { // rebuild the frames from their harmonics, with copies that drop the top harmonics for high notes
      const wt = spec.wavetable; F = wt.frames; levels = []
      for (let H = wt.harmonics; H >= 2; H >>= 1) {
        const t = new Float32Array(F * S)
        for (let f = 0; f < F; f++) { let pk = 1e-9; for (let i = 0; i < S; i++) { let x = 0; for (let h = 0; h < H; h++) x += wt.amps[f][h] * Math.cos(TAU * (h + 1) * i / S + wt.phases[f][h]); t[f * S + i] = x; pk = Math.max(pk, Math.abs(x)) } for (let i = 0; i < S; i++) t[f * S + i] /= pk }
        levels.push([H, t])
      }
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) { const v = voices.find(v => v.key == key) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b); v.key = key; v.f = midiHz(key); v.on = true; v.vel = vel; v.age = ++clock },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      if (!levels) return
      const n = L.length, up = 1 / (P.attack * sr), down = 1 / (P.release * sr)
      lfo += TAU * P.sweep * n / sr; pos = clamp(P.pos + P.depth * .5 * Math.sin(lfo), 0, 1) // the scan drifts through growth and back
      const fp = pos * (F - 1), f0 = Math.min(F - 2, fp | 0), ft = fp - f0
      for (const v of voices) {
        if (!v.on && v.g <= 0) continue
        let tab = levels[levels.length - 1][1]; for (const [H, t] of levels) if (H * v.f < sr / 2) { tab = t; break }
        for (let i = 0; i < n; i++) {
          v.g = v.on ? Math.min(1, v.g + up) : Math.max(0, v.g - down)
          const x = v.ph * S, k = x | 0, t = x - k, k1 = (k + 1) % S, a = tab[f0 * S + k] + (tab[f0 * S + k1] - tab[f0 * S + k]) * t, b = tab[(f0 + 1) * S + k] + (tab[(f0 + 1) * S + k1] - tab[(f0 + 1) * S + k]) * t
          const s = (a + (b - a) * ft) * v.g * v.vel * .35; L[i] += s; R[i] += s
          if ((v.ph += v.f / sr) >= 1) v.ph -= 1
        }
      }
      soften(L, R, P.level)
    },
    view() { return { pos } }
  }
}
