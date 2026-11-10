// After Rain: electrical activity after rain. One recording found large electrical changes in a mycorrhizal
// fungus after rain. Here a column of excitable units runs from the surface down. Dry, they are at rest. Rain
// wets the top: the wet units are driven past their threshold and start to fire, and the firing passes down
// the column to drier units below. As the ground dries from the top the activity fades. The units run fast
// enough to be heard.
// How fast a driven unit fires follows the species: its own interval between spikes, and how near the ground
// is to the temperature it grows best at. Between rains a unit can fire once on its own, as in the recordings.
// A key makes it rain.
import { fhnStep, fhnCycle, rng, soften, clamp, midiHz, TAU } from '../kit/dsp.js'
const gT = (T, a, o, b) => T <= a || T >= b ? 0 : clamp((T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T))), 0, 1) // cardinal temperature curve, docs/research/06 section 4
export const create = sr => {
  const N = 8, P = { rain: 4, dry: 6, pitch: 140, coupling: .12, soak: .5, temp: 20, rest: 0, level: 1 }, rnd = rng(53)
  const v = new Float32Array(N).fill(-1.2), w = new Float32Array(N).fill(-.62), wet = new Float32Array(N), dc = new Float32Array(N), stim = new Float32Array(N)
  let since = 0, spec = null, own = 1, warm = 1, D = N, hz = P.pitch, base = P.pitch, note = ''
  return {
    load(s) {
      spec = s; const has = k => !s.has || s.has[k] !== false
      own = clamp(60 / Math.max(1e-3, s.numbers.spike_interval_min || 60), .25, 4) // a species that spikes more often fires faster here, within two octaves either way
      D = has('depth') ? N : 3; if (D < N) for (let k = D; k < N; k++) { wet[k] = 0; v[k] = -1.2; w[k] = -.62 }
      note = [has('electrical') ? '' : 'No electrical activity at this size: the excitable units are borrowed from the 400K model.', has('weather') ? '' : 'No weather at this size: the rain is only yours, and the ground is held at the species\' best temperature.', has('depth') ? '' : 'A flat colony with no depth: only the top three units are there.'].filter(Boolean).join(' ')
    },
    set(k, x) { P[k] = x; if (k == 'rainNow') { wet[0] = 1; since = 0 } if (k == 'pitch') base = x },
    noteOn(key, vel) { wet[0] = Math.max(wet[0], clamp(.3 + vel, 0, 1)); since = 0; base = midiHz(key) }, // a fall of rain: a harder press is a heavier fall; the key is the rate of firing
    noteOff() {},
    process(L, R) {
      const n = L.length, dt = n / sr, nm = spec && spec.numbers
      if (rnd() < P.rain / 60 * dt) { wet[0] = 1; since = 0 } // it rains
      since += dt
      for (let k = D - 1; k > 0; k--) wet[k] += (wet[k - 1] * P.soak - wet[k]) * dt * 1.5 // water soaks down
      for (let k = 0; k < D; k++) wet[k] *= Math.exp(-dt / (P.dry * (1 + .4 * k)))         // and the ground dries, the surface first
      warm = nm && (!spec.has || spec.has.weather !== false) ? gT(P.temp, nm.t_min_c, nm.t_opt_c, nm.t_max_c) : 1
      hz = base * own * (.25 + .75 * warm)
      if (P.rest > 0 && rnd() < P.rest * own * dt) stim[rnd() * D | 0] = 1 // one unit is pushed over its threshold for about one firing, and fires on its own
      const dtau = fhnCycle(.5) * hz / sr, sub = Math.min(40, Math.max(1, Math.ceil(dtau / .15))), h = dtau / sub, fade = Math.exp(-2 * hz / sr)
      for (let i = 0; i < n; i++) {
        for (let s = 0; s < sub; s++) for (let k = 0; k < D; k++) {
          const up = k ? v[k - 1] : v[k], down = k < D - 1 ? v[k + 1] : v[k]
          fhnStep(v, w, k, h, .28 + wet[k] * .35 + stim[k] * .5, P.coupling * (up + down - 2 * v[k])) // wet units are driven past threshold; dry ones only pass the wave on
        }
        let l = 0, r = 0; for (let k = 0; k < D; k++) stim[k] *= fade
        for (let k = 0; k < D; k++) { dc[k] += .0008 * (v[k] - dc[k]); const x = (v[k] - dc[k]) / (1 + k * .35), pan = k / (N - 1); l += x * Math.cos(pan * TAU / 4); r += x * Math.sin(pan * TAU / 4) } // deeper is quieter
        L[i] = l * .12; R[i] = r * .12
      }
      soften(L, R, P.level)
    },
    view() { return { v: Array.from(v), wet: Array.from(wet), since, hz, warm, temp: P.temp, depth: D, scaleNote: note } }
  }
}
