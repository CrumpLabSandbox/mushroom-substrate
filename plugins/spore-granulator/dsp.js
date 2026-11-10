// Spore Granulator: your sound, thrown like spores. The sound going in is kept for two seconds. Grains of it
// are launched at a steady rate. Each grain's length is a spore's flight time, which depends on its launch
// speed; how far back in the kept sound a grain is taken from follows the rule for how far spores land:
// most from just now, a few from long ago. Wind pushes grains to one side.
import { rng, clamp, TAU } from '../kit/dsp.js'
export const create = sr => {
  const N = sr * 2 | 0, buf = new Float32Array(N), P = { rate: 30, speed: 1, reach: .08, wind: 0, mix: .7, level: 1 }, rnd = rng(47), grains = []
  let at = 0, seen = []
  return {
    load() {}, set(k, v) { P[k] = v },
    process(L, R, x) {
      const n = L.length
      for (let i = 0; i < n; i++) {
        buf[at] = x ? x[i] : 0; at = (at + 1) % N
        if (rnd() < P.rate / sr && grains.length < 60) {
          const u = rnd(), back = clamp(P.reach * u / (1.02 - u), 0, 1.9), len = clamp(.004 + .05 * P.speed * (.5 + rnd()), .002, .25) * sr | 0 // faster launch, longer flight
          const pan = clamp(.5 + (rnd() - .5) * .8 + P.wind * .4, 0, 1)
          grains.push({ pos: (at - 1 - (back * sr | 0) - len + N * 2) % N, len, i: 0, gl: Math.cos(pan * TAU / 4), gr: Math.sin(pan * TAU / 4) }); seen.push([back, pan]); if (seen.length > 50) seen.shift()
        }
        let a = 0, b = 0
        for (let g = grains.length; g--;) { const q = grains[g], e = Math.sin(Math.PI * q.i / q.len), s = buf[(q.pos + q.i) % N] * e; a += s * q.gl; b += s * q.gr; if (++q.i >= q.len) grains.splice(g, 1) }
        const dry = (x ? x[i] : 0) * (1 - P.mix), p = (dry + a * P.mix) * P.level, q2 = (dry + b * P.mix) * P.level
        L[i] = p / (1 + Math.abs(p)); R[i] = q2 / (1 + Math.abs(q2))
      }
    },
    view() { return { seen: seen.slice(), live: grains.length } }
  }
}
