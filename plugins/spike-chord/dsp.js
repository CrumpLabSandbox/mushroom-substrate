// Spike Chord: a chord whose intervals are measurements. Five species have a measured interval between
// electrical spikes. Sped up by one factor, each becomes a pitch, and together they are a chord whose notes
// stand in the ratios of the data. Each voice is one unit of the engines' electrical model running at its
// species' rate. The loaded species adds its own.
import { soften, fhnCycle, fhnStep, rng, TAU } from '../kit/dsp.js'
export const DATA = [['Schizophyllum commune', 41], ['Pleurotus ostreatus', 70], ['Omphalotus nidiformis', 92], ['Flammulina velutipes', 102], ['Cordyceps militaris', 116]]
export const create = sr => {
  const P = { top: 330, drive: .6, drift: .3, own: 1, a: 1, b: 1, c: 1, d: 1, e: 1, level: 1 }, rnd = rng(29), N = 6
  const v = new Float32Array(N).fill(-1.2), w = new Float32Array(N).fill(-.62), dc = new Float32Array(N), wob = new Float32Array(N), gain = new Float32Array(N)
  let mins = DATA.map(d => d[1]).concat([60]), count = 0
  return {
    load(s) { mins[5] = s.numbers.spike_interval_min },
    set(k, x) { P[k] = x },
    process(L, R) {
      const n = L.length, per = fhnCycle(P.drive), want = [P.a, P.b, P.c, P.d, P.e, P.own]
      if ((count += n) > 4800) { count = 0; for (let k = 0; k < N; k++) wob[k] += (rnd() - .5) * .02 - wob[k] * .05 } // real intervals vary from spike to spike
      for (let k = 0; k < N; k++) {
        const f = P.top * mins[0] / mins[k] * (1 + wob[k] * P.drift), dtau = per * f / sr, sub = Math.max(1, Math.ceil(dtau / .15)), h = dtau / sub, pan = k / (N - 1)
        for (let i = 0; i < n; i++) {
          gain[k] += .0004 * (want[k] - gain[k])
          for (let s = 0; s < sub; s++) fhnStep(v, w, k, h, P.drive, 0)
          dc[k] += .001 * (v[k] - dc[k]); const x = (v[k] - dc[k]) * gain[k] * .1
          L[i] += x * Math.cos(pan * TAU / 4); R[i] += x * Math.sin(pan * TAU / 4)
        }
      }
      soften(L, R, P.level)
    },
    view() { return { hz: mins.map((m, k) => P.top * mins[0] / m), mins: mins.slice(), speed: P.top * mins[0] * 60 } }
  }
}
