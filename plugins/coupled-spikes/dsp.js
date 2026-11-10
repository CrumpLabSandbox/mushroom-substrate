// Coupled Spikes: the electrical model itself as the oscillator. Each note is a small ring of excitable units,
// the model the engines use for spiking, stepped fast enough to be heard and tuned so one cycle is the note's
// period. The units pull on their neighbours as stretches of hypha do. How hard they are driven, how unequal
// that drive is and how strongly they are coupled are the model's own settings, and they are the timbre.
import { midiHz, soften, fhnCycle, fhnStep, TAU } from '../kit/dsp.js'
export const create = sr => {
  const U = 6, V = 6, P = { units: 4, drive: .6, spread: .3, coupling: .1, attack: .01, release: .5, level: 1 }
  const voices = Array.from({ length: V }, () => ({ key: -1, f: 0, g: 0, on: false, age: 0, vel: 0, v: new Float32Array(U).fill(-1.2), w: new Float32Array(U).fill(-.62), dc: 0 }))
  let clock = 0, shown = new Float32Array(U)
  return {
    load() {}, set(k, x) { P[k] = x },
    noteOn(key, vel) { const v = voices.find(v => v.key == key) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b); v.key = key; v.f = midiHz(key); v.on = true; v.vel = vel; v.age = ++clock; for (let k = 0; k < U; k++) { v.v[k] = -1.2 + k * .3; v.w[k] = -.62 } },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      const n = L.length, N = Math.round(P.units), up = 1 / (P.attack * sr), down = 1 / (P.release * sr)
      for (const vo of voices) {
        if (!vo.on && vo.g <= 0) continue
        const per = fhnCycle(P.drive), dtau = per * vo.f / sr, sub = Math.max(1, Math.ceil(dtau / .15)), h = dtau / sub // the model's time per sample, in small enough steps
        for (let i = 0; i < n; i++) {
          vo.g = vo.on ? Math.min(1, vo.g + up) : Math.max(0, vo.g - down)
          for (let s = 0; s < sub; s++) for (let k = 0; k < N; k++) {
            const a = vo.v[(k + N - 1) % N], b = vo.v[(k + 1) % N], drive = P.drive + P.spread * (k / Math.max(1, N - 1) - .5) * .5
            fhnStep(vo.v, vo.w, k, h, drive, N > 1 ? P.coupling * (a + b - 2 * vo.v[k]) : 0)
          }
          let l = 0, r = 0; for (let k = 0; k < N; k++) { const pan = N > 1 ? k / (N - 1) : .5; l += vo.v[k] * Math.cos(pan * TAU / 4); r += vo.v[k] * Math.sin(pan * TAU / 4) }
          vo.dc += .001 * ((l + r) / 2 - vo.dc) // the units sit off-centre between spikes; take that out
          const gain = vo.g * vo.vel * .16 / Math.sqrt(N); L[i] += (l - vo.dc) * gain; R[i] += (r - vo.dc) * gain
        }
        shown = vo.v
      }
      soften(L, R, P.level)
    },
    view() { return { v: Array.from(shown.subarray(0, Math.round(P.units))) } }
  }
}
