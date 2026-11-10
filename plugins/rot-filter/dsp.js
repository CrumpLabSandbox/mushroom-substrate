// Rot Filter: your sound through a rotting log. The sound going in drives a wooden bar. As the bar rots it
// loses stiffness and weight, so its notes fall and blur. White rot takes both together; brown rot takes
// stiffness first. The log can rot while you listen, at a pace set by the species, how wet the wood is and
// the temperature; wet wood is also heavier and rings for less time.
import { Bank, clamp } from '../kit/dsp.js'
const WOOD = { 'white-rot': 1, 'brown-rot': 1, 'tree-parasite': .8, 'litter-soil': .4 } // how readily the species rots wood; anything else .15 (the same table as the Decay plugin)
// the cardinal temperature curve the engines use (Rosso et al. 1993): 0 at the coldest and hottest, 1 at the best
const gT = (T, a, o, b) => T <= a || T >= b ? 0 : clamp((T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T))), 0, 1)
// wood too dry does not rot, and waterlogged wood has no air: best at about half, nothing below 15% or at 100%
const gW = w => w <= .15 ? 0 : w < .5 ? (w - .15) / .35 : Math.max(0, 1 - (w - .5) / .5 * (w - .5) / .5)
export const create = sr => {
  const BAR = [1, 2.76, 5.4, 8.93, 13.34, 18.64], P = { decay: .2, kind: 0, length: 1, ring: .5, wet: .4, rot: 60, temp: 20, mix: .7, level: 1 }, bank = new Bank(BAR.length, sr)
  let spec = null, wl = new Float32Array(128), wr = new Float32Array(128), st = { f: 460 }, u = .2, pace = 0, logs = 0, weather = true, scaleNote = '', count = 0, held = 0, gain = 1
  const tune = () => {
    const brown = P.kind > 1.5 || (P.kind < .5 && !!spec && spec.fruit.trophic == 'brown-rot')
    const stiff = brown ? Math.pow(1 - u, 3) * .97 + .03 : 1 - .7 * u, weight = (brown ? 1 - .5 * u : 1 - .6 * u) * (1 + .8 * P.wet) / 1.32 // water adds weight; 1.32 keeps a log at 40% wetness where it was before wetness was a control
    const f0 = 460 / (P.length * P.length) * Math.sqrt(stiff / weight)
    BAR.forEach((r, k) => { const ring = P.ring * (1 - .85 * u) * (1 - .5 * P.wet) / .8 / (1 + k * .5); bank.tune(k, f0 * r, ring); bank.hear(k, .8 - k * .1, .3 + k * .1); bank.drive[k] = Math.sqrt(1 - Math.exp(-1 / (Math.max(.001, ring) * sr))) * 6 })
    st = { f: f0, brown, u, stiff, weight, pace, logs, scaleNote }
  }
  const setPace = () => {
    const n = spec && spec.numbers
    pace = (spec ? WOOD[spec.fruit.trophic] || .15 : 1) * gW(P.wet) * (weather && n ? gT(P.temp, n.t_min_c, n.t_opt_c, n.t_max_c) : 1)
  }
  return {
    load(s) {
      spec = s; weather = !s || !s.has || s.has.weather !== false
      scaleNote = weather ? '' : 'No weather at this size: the log rots at the species\' best temperature and the temperature control does nothing.'
      setPace(); tune()
    },
    set(k, v) { P[k] = v; if (k == 'decay') u = v; setPace(); if (k != 'mix' && k != 'level') tune() },
    process(L, R, x) {
      const n = L.length; if (wl.length != n) { wl = new Float32Array(n); wr = new Float32Array(n) } wl.fill(0); wr.fill(0)
      if (P.rot > 0 && pace > 0) { // what is left of the log goes at a steady share per second: sound wood to 97% gone in `rot` seconds at the best pace
        u += (1 - u) * 3.5 / P.rot * pace * n / sr
        if (u >= .97) { u = 0; logs++ } // the log has gone, and another falls
        if ((count += n) >= 512) { count = 0; tune() }
      }
      bank.process(wl, wr, x || undefined)
      // when a note of the bar falls onto a note of the sound going in, the bar rings many times louder; it is
      // turned down while it is above full scale, and let back up over about half a second
      let pk = 0; for (let i = 0; i < n; i++) { const a = Math.abs(wl[i]), b = Math.abs(wr[i]); if (a > pk) pk = a; if (b > pk) pk = b }
      held = pk > held ? pk : held + (pk - held) * (n / sr / .5)
      const g1 = held > 1.2 ? 1.2 / held : 1, dg = (g1 - gain) / n
      for (let i = 0; i < n; i++) { gain += dg; const dry = x ? x[i] * (1 - P.mix) : 0, w = P.mix * gain, a = (dry + wl[i] * w) * P.level, b = (dry + wr[i] * w) * P.level; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b)) }
    },
    view() { st.turnedDown = gain; return st }
  }
}
