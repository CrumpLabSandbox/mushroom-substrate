// Turgor Bow: the web sustained, not plucked. Hyphal tips do not grow smoothly: they advance in pulses.
// Here that pulsing is the bow. While a key is held, small strikes arrive at the pulse rate, a little
// irregular, with a faint hiss of smaller yields between them, and the web rings on under them.
// Several tips can pulse at once, each on its own clock. Temperature, against the species' own coldest, best
// and hottest points, sets how fast they pulse. A hard key is a wall that yields suddenly (a sharp push); a
// soft key is one that gives slowly (a dull push). The web can go on growing while the key is held.
import { Bank, midiHz, clamp, soften, stageAt, rng } from '../kit/dsp.js'
// Retunes one mode of a bank while it is ringing, keeping its loudness and where it is in its swing (a plain
// retune would reread the old motion at the new pitch, which can make it far louder).
const retuneMode = (b, i, hz, sec) => {
  const c2 = b.c2[i], sw = b.sw[i]; if (!c2 || !sw) return b.tune(i, hz, sec)
  const r = Math.sqrt(c2), y1 = b.y1[i], C = (y1 * b.c1[i] / (2 * r) - b.y2[i] * r) / sw; b.tune(i, hz, sec)
  if (b.c2[i]) { const rn = Math.sqrt(b.c2[i]); b.y2[i] = (y1 * b.c1[i] / (2 * rn) - C * b.sw[i]) / rn }
}
export const create = sr => {
  const V = 6, M = 12, T = 24, P = { stage: .6, pos: .5, rate: 24, jitter: .3, pressure: .6, tips: 1, temp: 0, grow: .03, ring: .8, own: 1, level: 1 }, rnd = rng(31)
  const voices = Array.from({ length: V }, () => ({ bank: new Bank(M, sr), key: -1, on: false, g: 0, ph: new Float32Array(T), pace: new Float32Array(T).fill(1), age: 0, vel: 0, st: 0, lp: 0, quiet: 0 }))
  const amp = new Float32Array(M)
  let spec = null, clock = 0, x = new Float32Array(128), energy = 0, card = null, weather = true, note = '', pulses = 0, lastStage = .6
  const activity = () => { // the cardinal temperature curve the engines use for growth: 0 at the coldest and hottest, 1 at the best
    if (!card || !weather) return 1
    const [lo, opt, hi] = card, t = opt + P.temp; if (t <= lo || t >= hi) return 0
    const d = (opt - lo) * ((opt - lo) * (t - opt) - (opt - hi) * (opt + lo - 2 * t)); return d ? clamp((t - hi) * (t - lo) * (t - lo) / d, 0, 1) : 1
  }
  const ratio = (st, i) => st.hz[i] > 0 && st.hz[0] > 0 ? st.hz[i] / st.hz[0] : i + 1
  const tune = v => {
    const [a, b, t] = stageAt(spec, v.st), f0 = midiHz(v.key), z = clamp(P.pos, 0, 1) * 5, z0 = z | 0, z1 = Math.min(5, z0 + 1), zt = z - z0; let norm = 1e-9
    for (let i = 0; i < M; i++) {
      const ra = ratio(a, i), rb = ratio(b, i), r = (i + 1) + P.own * (ra + (rb - ra) * t - (i + 1)), zn = a.zone[i]
      retuneMode(v.bank, i, f0 * r, P.ring / (1 + i * .25)); amp[i] = zn ? Math.abs(zn[z0] + (zn[z1] - zn[z0]) * zt) : 0; norm += amp[i]
      const m = a.mic[i] || [1, 1], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); v.bank.hear(i, m[0] / mm, m[1] / mm)
    }
    if (norm < 1e-6) { norm = 0; for (let i = 0; i < M; i++) { amp[i] = 1 / (1 + i); norm += amp[i] } }
    for (let i = 0; i < M; i++) v.bank.drive[i] = amp[i] / norm
  }
  return {
    load(s) {
      spec = s; for (const v of voices) { v.bank.silence(); v.key = -1; v.on = false; v.g = 0 }
      const n = s.numbers, has = s.has || {}, parts = []; card = n && n.t_min_c < n.t_opt_c && n.t_opt_c < n.t_max_c ? [n.t_min_c, n.t_opt_c, n.t_max_c] : null; weather = has.weather !== false
      if (!weather) parts.push('No weather at this size: the temperature is held at the species\' best, so the pulse rate is the one set.')
      if (has.cords === false) parts.push('No cords at this size: every hypha is the same thickness, so the modes come from the shape of the web alone.')
      if (s.engine === '4m') parts.push('The real web here is metres across; it is shrunk a great deal to reach the key.')
      note = parts.join(' ')
    },
    set(k, val) { P[k] = val; if (spec && (k == 'stage' || k == 'pos' || k == 'ring' || k == 'own')) for (const v of voices) if (v.key >= 0) { if (k == 'stage') v.st = clamp(val, 0, 1); tune(v) } },
    noteOn(key, vel) {
      if (!spec) return
      const v = voices.find(v => v.key == key) || voices.find(v => v.key < 0) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b)
      if (v.key != key) for (let k = 0; k < T; k++) v.ph[k] = k ? rnd() : 0 // each tip starts on its own clock
      v.key = key; v.on = true; v.vel = clamp(vel, 0, 1); v.age = ++clock; v.st = clamp(P.stage, 0, 1); v.quiet = 0; tune(v)
    },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      const n = L.length; if (x.length != n) x = new Float32Array(n); let e = 0
      const tips = clamp(Math.round(P.tips), 1, T), act = activity(), rate = P.rate * act / sr, push = P.pressure * 1.5 / Math.sqrt(tips), hiss = .05 * P.pressure * (act > 0 ? 1 : 0)
      for (const v of voices) {
        if (v.key < 0) continue
        if (v.on && P.grow > 0 && v.st < 1) { v.st = Math.min(1, v.st + P.grow * n / sr); tune(v) } // the web goes on growing under the bow
        if (v.on && v.age == clock) lastStage = v.st
        const sharp = clamp(.06 + .94 * v.vel * v.vel / .64, .06, 1), ph = v.ph // how suddenly the wall yields
        for (let i = 0; i < n; i++) {
          v.g += ((v.on ? 1 : 0) - v.g) * .002
          let s = (rnd() - .5) * hiss                                              // the hiss of small yields
          for (let k = 0; k < tips; k++) if ((ph[k] += rate * v.pace[k]) >= 1) { ph[k] -= 1; s += push; pulses++; v.pace[k] = 1 / (1 + (rnd() - .5) * 1.6 * P.jitter) } // the wait to the next is drawn afresh: up to 80% longer or shorter // one pulse of growth at one tip
          v.lp += sharp * (s - v.lp); x[i] = v.lp * v.g * v.vel
        }
        const be = v.bank.process(L, R, x); e += be
        if (!v.on && v.g < 1e-4 && be < 1e-12 && ++v.quiet > 8) { v.key = -1; v.g = 0; v.lp = 0; v.bank.silence() } // let go and rung out: the voice is free
      }
      energy = Math.min(1, Math.sqrt(e) * 3); soften(L, R, P.level * 1.5)
    },
    view() {
      const tc = spec && spec.curves && spec.curves.tips || [], real = tc.length ? tc[Math.min(tc.length - 1, Math.round(lastStage * (tc.length - 1)))] : 0
      return { energy, stage: lastStage, tips: clamp(Math.round(P.tips), 1, T), rate: P.rate * activity(), activity: activity(), temp_c: card ? card[1] + (weather ? P.temp : 0) : null, cardinal_c: card, real_tips: real, pulses, held: voices.reduce((n, v) => n + (v.on ? 1 : 0), 0), scaleNote: note }
    }
  }
}
