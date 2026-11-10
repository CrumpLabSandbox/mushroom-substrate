// Gill Comb: the gills as a row of thin blades. Under a cap hang dozens of gills, each a thin plate fixed
// along its top edge. No two are quite the same length, so struck together they sound as a comb of close
// notes. As the cap opens the gills spread and their notes move apart.
import { Bank, midiHz, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const V = 5, G = 16, P = { gills: 12, open: .3, ring: .9, second: .4, level: 1 }
  const voices = Array.from({ length: V }, () => ({ bank: new Bank(G * 2, sr), key: -1, age: 0 }))
  let clock = 0, energy = 0
  return {
    load() {}, set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.reduce((a, b) => a.age < b.age ? a : b), n = Math.round(P.gills), f0 = midiHz(key); v.key = key; v.age = ++clock
      for (let k = 0; k < G; k++) {
        if (k >= n) { v.bank.tune(k, 0, 0); v.bank.tune(G + k, 0, 0); continue }
        const x = n > 1 ? k / (n - 1) - .5 : 0, f = f0 * (1 + x * P.open * .5), pan = x + .5 // a gill a little shorter sounds a little higher
        v.bank.tune(k, f, P.ring); v.bank.hear(k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4)); v.bank.strike(k, vel * 1.6 / Math.sqrt(n))
        v.bank.tune(G + k, f * 6.27, P.ring * .3); v.bank.hear(G + k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4)); v.bank.strike(G + k, vel * P.second / Math.sqrt(n)) // a fixed blade's second way of bending
      }
    },
    noteOff() {},
    process(L, R) { let e = 0; for (const v of voices) if (v.key >= 0) e += v.bank.process(L, R); energy = Math.min(1, Math.sqrt(e) * 2); soften(L, R, P.level) },
    view() { return { energy } }
  }
}
