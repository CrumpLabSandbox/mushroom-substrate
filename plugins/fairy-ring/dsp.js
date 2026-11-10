// Fairy Ring: a ring of mycelium as a ring that carries a wave round and round. The living part of a fairy
// ring is a band: an outer edge advancing into fresh ground and an inner edge where it dies back. Each edge
// is a loop a little different in length, so the two beat. Every year the ring grows by the species' advance,
// its circumference lengthens, and its note falls.
import { midiHz, clamp, soften, rng } from '../kit/dsp.js'
export const create = sr => {
  const V = 6, MAXN = 8192, P = { age: 3, band: .3, ring: 1.5, bright: .5, level: 1 }, rnd = rng(41)
  const voices = Array.from({ length: V }, () => ({ key: -1, age: 0, a: new Float32Array(MAXN), b: new Float32Array(MAXN), na: 2, nb: 2, ia: 0, ib: 0, la: 0, lb: 0, damp: 1 }))
  let spec = null, clock = 0
  const radius = () => .5 + (spec ? spec.numbers.tip_speed_um_h * 8.76e-3 : .2) * P.age // metres: half a metre when the key is at pitch, then it advances
  return {
    load(s) { spec = s }, set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.reduce((a, b) => a.age < b.age ? a : b), r = radius(), f = midiHz(key) * .5 / r // a ring twice as far round sounds an octave lower
      v.key = key; v.age = ++clock; v.damp = 1
      v.na = clamp(Math.round(sr / f), 4, MAXN - 1); v.nb = clamp(Math.round(sr / f * (r + P.band) / r), 4, MAXN - 1) // the outer edge is longer by the width of the band
      for (let i = 0; i < v.na; i++) v.a[i] = (rnd() * 2 - 1) * vel * .5; for (let i = 0; i < v.nb; i++) v.b[i] = (rnd() * 2 - 1) * vel * .5
      v.ia = v.ib = 0; v.la = v.lb = 0
    },
    noteOff(key) { for (const v of voices) if (v.key == key) v.damp = .996 },
    process(L, R) {
      const n = L.length, g = Math.exp(-1 / (P.ring * sr / 60)), c = .2 + .8 * P.bright
      for (const v of voices) {
        if (v.key < 0) continue; let e = 0
        for (let i = 0; i < n; i++) {
          const xa = v.a[v.ia], xb = v.b[v.ib]
          v.la += c * (xa - v.la); v.lb += c * (xb - v.lb)
          v.a[v.ia] = v.la * g * v.damp; v.b[v.ib] = v.lb * g * v.damp
          v.ia = (v.ia + 1) % v.na; v.ib = (v.ib + 1) % v.nb
          L[i] += xa * .7 + xb * .3; R[i] += xa * .3 + xb * .7; e += xa * xa
        }
        if (e < 1e-10) v.key = -1
      }
      soften(L, R, P.level)
    },
    view() { return { radius: radius(), band: P.band } }
  }
}
