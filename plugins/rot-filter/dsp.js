// Rot Filter: your sound through a rotting log. The sound going in drives a wooden bar. As the bar rots it
// loses stiffness and weight, so its notes fall and blur. White rot takes both together; brown rot takes
// stiffness first.
import { Bank } from '../kit/dsp.js'
export const create = sr => {
  const BAR = [1, 2.76, 5.4, 8.93, 13.34, 18.64], P = { decay: .2, kind: 0, length: 1, ring: .5, mix: .7, level: 1 }, bank = new Bank(BAR.length, sr)
  let spec = null, wl = new Float32Array(128), wr = new Float32Array(128), st = { f: 460 }
  const tune = () => {
    const u = P.decay, brown = P.kind > 1.5 || (P.kind < .5 && spec && spec.fruit.trophic == 'brown-rot')
    const stiff = brown ? Math.pow(1 - u, 3) * .97 + .03 : 1 - .7 * u, weight = brown ? 1 - .5 * u : 1 - .6 * u, f0 = 460 / (P.length * P.length) * Math.sqrt(stiff / weight)
    BAR.forEach((r, k) => { const ring = P.ring * (1 - .85 * u) / (1 + k * .5); bank.tune(k, f0 * r, ring); bank.hear(k, .8 - k * .1, .3 + k * .1); bank.drive[k] = Math.sqrt(1 - Math.exp(-1 / (Math.max(.001, ring) * sr))) * 22 })
    st = { f: f0, brown, u }
  }
  return {
    load(s) { spec = s; tune() }, set(k, v) { P[k] = v; tune() },
    process(L, R, x) {
      const n = L.length; if (wl.length != n) { wl = new Float32Array(n); wr = new Float32Array(n) } wl.fill(0); wr.fill(0)
      bank.process(wl, wr, x || undefined)
      for (let i = 0; i < n; i++) { const dry = x ? x[i] * (1 - P.mix) : 0, a = (dry + wl[i] * P.mix) * P.level, b = (dry + wr[i] * P.mix) * P.level; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b)) }
    },
    view() { return st }
  }
}
