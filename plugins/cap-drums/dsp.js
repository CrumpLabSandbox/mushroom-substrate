// Cap Drums: each key is a mushroom cap of a different size, struck by a raindrop. A cap is a small plate:
// the bigger it is, the lower it sounds. The species' fruit form sets the overtones.
import { Bank, midiHz, clamp, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const V = 12, voices = Array.from({ length: V }, () => ({ bank: new Bank(6, sr), key: -1, age: 0 }))
  const P = { ring: .6, wet: .15, pos: .3, level: 1 }
  let spec = null, clock = 0, last = { key: 60, age: 9 }, energy = 0
  return {
    load(s) { spec = s; for (const v of voices) v.bank.silence() },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      if (!spec) return
      const v = voices.reduce((a, b) => a.age < b.age ? a : b), ov = spec.cap.overtones, f0 = midiHz(key) * (1 - .06 * P.wet), pan = clamp((key - 36) / 48, 0, 1)
      v.key = key; v.age = ++clock
      for (let k = 0; k < 6; k++) {
        if (k >= ov.length) { v.bank.tune(k, 0, 0); continue }
        v.bank.tune(k, f0 * ov[k], P.ring * (1 - .5 * P.wet) / (1 + k * .5)) // a wet cap is heavier and more damped
        v.bank.hear(k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4))
        v.bank.strike(k, vel * Math.cos(k * 1.3 * P.pos) / (1 + k * .3) * 1.6)   // where on the cap the drop lands decides which overtones it wakes
      }
      last = { key, age: 0 }
    },
    noteOff() {}, // a struck cap rings until it stops
    process(L, R) { let e = 0; for (const v of voices) e += v.bank.process(L, R); energy = Math.min(1, Math.sqrt(e) * 3); last.age += L.length / sr; soften(L, R, P.level) },
    view() { return { energy, key: last.key, age: last.age } }
  }
}
