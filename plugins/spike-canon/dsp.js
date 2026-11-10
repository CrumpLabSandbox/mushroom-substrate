// Spike Canon: rhythm and counterpoint from electrical activity. A short chain of excitable units, the same
// model the engines use for spiking, runs live. The unit at the growing tip is driven and fires on its own;
// the units behind it fire only when the wave reaches them. Each firing is a note, so the voices follow one
// another down the hypha like a canon. Each unit plays one of the network's own notes.
import { Notes, ownNotes, clamp } from '../kit/dsp.js'
export const create = sr => {
  const MAX = 8, P = { voices: 5, rate: 1.4, coupling: .14, spread: .6, recovery: .08, base: 48, length: .4, stage: .6 }, notes = new Notes()
  const v = new Float32Array(MAX).fill(-1.2), w = new Float32Array(MAX).fill(-.62), d = new Float32Array(MAX), lit = new Float32Array(MAX)
  let spec = null, pitch = [0], carry = 0
  return {
    load(s) { spec = s; pitch = ownNotes(s, P.stage, 16) },
    set(k, x) { P[k] = x; if (spec && k == 'stage') pitch = ownNotes(spec, P.stage, 16) },
    advance(n) {
      if (!spec) return []
      const N = Math.round(P.voices), h = .2
      carry += 40 * P.rate * n / sr / h // one cycle of a driven unit is 40 of the model's time units
      for (; carry >= 1; carry--) {
        d.fill(0); for (let k = 0; k < N - 1; k++) { const g = P.coupling * (v[k + 1] - v[k]); d[k] += g; d[k + 1] -= g }
        for (let k = 0; k < N; k++) {
          const drive = .3 + P.spread * .3 * (1 - k / Math.max(1, N - 1)), a = v[k] // the tip end is driven hardest
          v[k] = clamp(a + h * (a - a * a * a / 3 - w[k] + drive + d[k]), -2.5, 2.5); w[k] += h * P.recovery * (a + .7 - .8 * w[k])
          if (a < 1 && v[k] >= 1) { notes.play(P.base + pitch[k % pitch.length], .45 + .5 * (drive - .3) / .3, P.length * sr); lit[k] = 1 }
        }
      }
      for (let k = 0; k < MAX; k++) lit[k] *= .9
      return notes.tick(n)
    },
    view() { const N = Math.round(P.voices); return { v: Array.from(v.subarray(0, N)), lit: Array.from(lit.subarray(0, N)), pitch: pitch.slice(0, N) } }
  }
}
