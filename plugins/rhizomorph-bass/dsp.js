// Rhizomorph Bass: one long cord as a string. A rhizomorph is not even along its length: it has thick and
// thin stretches. A wave travelling along it partly turns back wherever the thickness changes, so the cord
// rings with echoes inside it. Three stretches, two joints; the amount turned back at each joint is worked
// out from the two cross-sections.
import { midiHz, clamp, soften, rng } from '../kit/dsp.js'
export const create = sr => {
  const V = 5, MAXN = 4096, P = { contrast: .5, joint: .35, pluck: .2, ring: .6, bright: .6, level: 1 }, rnd = rng(37)
  const mk = () => ({ key: -1, age: 0, n: [1, 1, 1], r: [0, 1, 2].map(() => new Float32Array(MAXN)), l: [0, 1, 2].map(() => new Float32Array(MAXN)), at: 0, lp: [0, 0], k: [0, 0], live: 0 })
  const voices = Array.from({ length: V }, mk)
  let spec = null, clock = 0, last = null
  return {
    load(s) { spec = s }, set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.reduce((a, b) => a.age < b.age ? a : b), total = clamp(sr / (2 * midiHz(key)), 6, MAXN * 3 - 6) // samples for one pass along the cord
      v.key = key; v.age = ++clock; v.live = 1
      const a = clamp(P.joint, .1, .45), frac = [a, 1 - 2 * a, a] // thin, thick, thin
      for (let s = 0; s < 3; s++) { v.n[s] = clamp(Math.round(total * frac[s]), 2, MAXN - 1); v.r[s].fill(0); v.l[s].fill(0) }
      const thick = 1 + P.contrast * Math.sqrt(spec ? spec.numbers.cord_max : 60), Z = [1, thick, 1] // a string's resistance to a wave goes as its cross-section
      v.k = [(Z[1] - Z[0]) / (Z[1] + Z[0]), (Z[2] - Z[1]) / (Z[2] + Z[1])]
      const s0 = P.pluck < .5 ? 0 : 1, at = Math.floor(clamp(P.pluck * 2 % 1, .05, .95) * v.n[s0])
      for (let i = 0; i < v.n[s0]; i++) { const d = 1 - Math.abs(i - at) / v.n[s0]; v.r[s0][i] += vel * d * d * .5; v.l[s0][i] += vel * d * d * .5 } // the pluck: a bump that sets off both ways
      v.at = 0; v.lp = [0, 0]; last = v
    },
    noteOff(key) { for (const v of voices) if (v.key == key) v.live = .25 },
    process(L, R) {
      const n = L.length, loss = Math.exp(-1 / (P.ring * 6 * sr / 100)), a = .15 + .85 * P.bright
      for (const v of voices) {
        if (v.key < 0) continue
        const [n0, n1, n2] = v.n, [k0, k1] = v.k; let e = 0
        for (let i = 0; i < n; i++) {
          const t = v.at, o0 = v.r[0][t % n0], o1 = v.r[1][t % n1], o2 = v.r[2][t % n2], p0 = v.l[0][t % n0], p1 = v.l[1][t % n1], p2 = v.l[2][t % n2]
          // the two ends are held: the wave turns back, losing a little, the high notes most
          v.lp[0] += a * (-p0 * loss - v.lp[0]); v.lp[1] += a * (-o2 * loss - v.lp[1])
          v.r[0][t % n0] = v.lp[0]; v.l[2][t % n2] = v.lp[1]
          // the joints: part passes, part turns back
          v.r[1][t % n1] = (1 + k0) * o0 - k0 * p1; v.l[0][t % n0] = k0 * o0 + (1 - k0) * p1
          v.r[2][t % n2] = (1 + k1) * o1 - k1 * p2; v.l[1][t % n1] = k1 * o1 + (1 - k1) * p2
          const s = (o1 + p1) * (v.live < 1 ? (v.live *= .9997, v.live * 4) : 1)
          L[i] += s * .8; R[i] += (o1 * .6 + p1) * .8 * (v.live < 1 ? v.live * 4 : 1); e += s * s; v.at++
        }
        if (e < 1e-10) v.key = -1
      }
      soften(L, R, P.level)
    },
    view() { return { k: last ? last.k : [0, 0], joint: P.joint } }
  }
}
