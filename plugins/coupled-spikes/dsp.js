// Coupled Spikes: the electrical model itself as the oscillator. Each note is a small ring of excitable units,
// the model the engines use for spiking, stepped fast enough to be heard and tuned so one cycle is the note's
// period. The units pull on their neighbours as stretches of hypha do. How hard they are driven, how unequal
// that drive is, how strongly they are coupled and how fast they recover are the model's own settings, and
// they are the timbre. A hard key drives the units harder. Temperature, placed against the species' own
// coldest, best and hottest points, scales the drive: far from its best the units stop firing.
import { midiHz, soften, clamp, TAU } from '../kit/dsp.js'
export const create = sr => {
  const U = 6, V = 6, P = { units: 4, drive: .6, spread: .3, coupling: .1, recover: .08, touch: .3, temp: 0, attack: .01, release: .5, level: 1 }
  const voices = Array.from({ length: V }, () => ({ key: -1, f: 0, g: 0, on: false, age: 0, vel: 0, v: new Float32Array(U).fill(-1.2), w: new Float32Array(U).fill(-.62), dc: 0, drive: .6, per: 0, h: 0, sub: 1 }))
  let clock = 0, shown = voices[0], dirty = false, card = null, weather = true, note = ''
  // the cardinal temperature curve the engines use: 0 at the species' coldest and hottest, 1 at its best
  const activity = () => {
    if (!card || !weather) return 1
    const [lo, opt, hi] = card, T = opt + P.temp; if (T <= lo || T >= hi) return 0
    const d = (opt - lo) * ((opt - lo) * (T - opt) - (opt - hi) * (opt + lo - 2 * T)); return d ? clamp((T - hi) * (T - lo) * (T - lo) / d, 0, 1) : 1
  }
  // how many of the model's time units one cycle of a single unit takes, measured by running it; 0 if it does not fire
  const cycle = (drive, eps, h) => {
    let v = -1.2, w = -.62, lo = 9, hi = -9, t = 0, first = -1
    const step = () => { const a = v, x = a + h * (a - a * a * a / 3 - w + drive); v = x < -2.5 ? -2.5 : x > 2.5 ? 2.5 : x; w += h * eps * (a + .7 - .8 * w) }
    const settle = 24 / eps / h
    for (let i = 0; i < settle; i++) { step(); if (i > settle / 2) { if (v < lo) lo = v; if (v > hi) hi = v } }
    if (hi - lo < .3) return 0
    const mid = (lo + hi) / 2
    for (let i = 0; i < settle; i++) { const p = v; step(); t += h; if (p < mid && v >= mid) { const at = t - h * (v - mid) / (v - p); if (first < 0) first = at; else return at - first } }
    return 0
  }
  const tune = vo => {
    const act = activity(); vo.drive = .3 + (clamp(P.drive + P.touch * (vo.vel - .8) * .6, .36, 1.3) - .3) * act // a hard key is a stronger push; cold or heat weakens it
    let per = cycle(vo.drive, P.recover, .1)
    if (per) { const dt = per * vo.f / sr, h = dt / Math.max(1, Math.ceil(dt / .15)); per = cycle(vo.drive, P.recover, h) || per } // measured again at the step size the note will use
    vo.per = per; const dtau = (per || 40) * vo.f / sr; vo.sub = Math.max(1, Math.ceil(dtau / .15)); vo.h = dtau / vo.sub
  }
  return {
    load(s) {
      const n = s && s.numbers; card = n && n.t_min_c < n.t_opt_c && n.t_opt_c < n.t_max_c ? [n.t_min_c, n.t_opt_c, n.t_max_c] : null
      const has = s && s.has || {}, parts = []; weather = has.weather !== false
      if (has.electrical === false) parts.push('The engine of this size has no electrical model. This instrument runs its own ring of units, so it sounds the same; only the species\' numbers are taken from the specimen.')
      if (!weather) parts.push('No weather at this size: the temperature is held at the species\' best.')
      note = parts.join(' '); dirty = true
    },
    set(k, x) { P[k] = x; if (k == 'drive' || k == 'recover' || k == 'touch' || k == 'temp') dirty = true },
    noteOn(key, vel) {
      const v = voices.find(v => v.key == key) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b)
      if (v.g < .001 || v.key != key) { for (let k = 0; k < U; k++) { v.v[k] = -1.2 + k * .3; v.w[k] = -.62 } if (v.g < .001) { let m = 0; for (let k = 0; k < U; k++) m += v.v[k]; v.dc = m * .7 / U * Math.min(U, Math.max(1, Math.round(P.units))) } } // a note still sounding carries on from where its units are
      v.key = key; v.f = midiHz(key); v.on = true; v.vel = clamp(vel, 0, 1); v.age = ++clock; tune(v); shown = v
    },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      const n = L.length, N = clamp(Math.round(P.units), 1, U), up = 1 / (Math.max(.001, P.attack) * sr), down = 1 / (Math.max(.005, P.release) * sr), eps = P.recover
      if (dirty) { dirty = false; for (const vo of voices) if (vo.on || vo.g > 0) tune(vo) }
      for (const vo of voices) {
        if ((!vo.on || !vo.per) && vo.g <= 0) continue // not held, or too cold or hot to fire: nothing to hear
        const h = vo.h, sub = vo.sub, v = vo.v, w = vo.w
        for (let i = 0; i < n; i++) {
          const target = vo.on && vo.per ? vo.vel : 0; vo.g = vo.g < target ? Math.min(target, vo.g + up) : Math.max(target, vo.g - down)
          for (let s = 0; s < sub; s++) for (let k = 0; k < N; k++) {
            const a = v[k], drive = vo.drive + (N > 1 ? P.spread * (k / (N - 1) - .5) * .5 : 0), pull = N > 1 ? P.coupling * (v[(k + N - 1) % N] + v[(k + 1) % N] - 2 * a) : 0
            const x = a + h * (a - a * a * a / 3 - w[k] + drive + pull); v[k] = x < -2.5 ? -2.5 : x > 2.5 ? 2.5 : x; w[k] += h * eps * (a + .7 - .8 * w[k])
          }
          let l = 0, r = 0; for (let k = 0; k < N; k++) { const pan = N > 1 ? k / (N - 1) : .5; l += v[k] * Math.cos(pan * TAU / 4); r += v[k] * Math.sin(pan * TAU / 4) }
          vo.dc += .001 * ((l + r) / 2 - vo.dc) // the units sit off-centre between spikes; take that out
          const gain = vo.g * .16 / Math.sqrt(N); L[i] += (l - vo.dc) * gain; R[i] += (r - vo.dc) * gain
        }
      }
      soften(L, R, P.level)
    },
    view() { const a = activity(); return { v: Array.from(shown.v.subarray(0, clamp(Math.round(P.units), 1, U))), drive: shown.drive, firing: shown.per > 0, activity: a, temp_c: card ? card[1] + (weather ? P.temp : 0) : null, cardinal_c: card, scaleNote: note } }
  }
}
