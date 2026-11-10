// After Rain: electrical activity after rain. One recording found large electrical changes in a mycorrhizal
// fungus after rain. Here a column of excitable units runs from the surface down. Dry, they are at rest. Rain
// wets the top: the wet units are driven past their threshold and start to fire, and the firing passes down
// the column to drier units below. As the ground dries from the top the activity fades. The units run fast
// enough to be heard.
import { fhnStep, fhnCycle, rng, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const N = 8, P = { rain: 4, dry: 6, pitch: 140, coupling: .12, soak: .5, level: 1 }, rnd = rng(53)
  const v = new Float32Array(N).fill(-1.2), w = new Float32Array(N).fill(-.62), wet = new Float32Array(N), dc = new Float32Array(N)
  let since = 0
  return {
    load() {}, set(k, x) { P[k] = x; if (k == 'rainNow') wet[0] = 1 },
    process(L, R) {
      const n = L.length, dt = n / sr
      if (rnd() < P.rain / 60 * dt) { wet[0] = 1; since = 0 } // it rains
      since += dt
      for (let k = N - 1; k > 0; k--) wet[k] += (wet[k - 1] * P.soak - wet[k]) * dt * 1.5 // water soaks down
      for (let k = 0; k < N; k++) wet[k] *= Math.exp(-dt / P.dry)                             // and the ground dries
      const dtau = fhnCycle(.5) * P.pitch / sr, sub = Math.max(1, Math.ceil(dtau / .15)), h = dtau / sub
      for (let i = 0; i < n; i++) {
        for (let s = 0; s < sub; s++) for (let k = 0; k < N; k++) {
          const up = k ? v[k - 1] : v[k], down = k < N - 1 ? v[k + 1] : v[k]
          fhnStep(v, w, k, h, .28 + wet[k] * .35, P.coupling * (up + down - 2 * v[k])) // wet units are driven past threshold; dry ones only pass the wave on
        }
        let l = 0, r = 0
        for (let k = 0; k < N; k++) { dc[k] += .0008 * (v[k] - dc[k]); const x = (v[k] - dc[k]) / (1 + k * .35), pan = k / (N - 1); l += x * Math.cos(pan * TAU / 4); r += x * Math.sin(pan * TAU / 4) } // deeper is quieter
        L[i] = l * .12; R[i] = r * .12
      }
      soften(L, R, P.level)
    },
    view() { return { v: Array.from(v), wet: Array.from(wet), since } }
  }
}
