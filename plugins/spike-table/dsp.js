// Spike Table: a wavetable instrument. The table is one cycle of the voltage between two electrodes at each
// of 64 stages of the network's growth. A held note scans through the table, so the tone changes the way
// the electrical wave changed as the fungus grew. Each note also grows on its own while it is held, a hard
// key starts later in growth, the right ear can read a little later than the left, and the cycles can be
// made uneven in length, as measured spike intervals are.
// At sizes with no electrical model in the network, the table is rebuilt here from one excitable unit,
// driven harder as the number of growing tips rises.
import { midiHz, clamp, soften, TAU, rng, fhnStep, fhnCycle } from '../kit/dsp.js'
export const create = sr => {
  const S = 512, P = { pos: .2, sweep: .15, depth: .6, grow: .04, touch: .3, width: .15, irregular: 0, attack: .02, release: .6, level: 1 }, V = 8, rnd = rng(53)
  const voices = Array.from({ length: V }, () => ({ key: -1, f: 0, ph: 0, g: 0, on: false, age: 0, vel: 0, t: 0, jit: 1 }))
  let levels = null, F = 0, clock = 0, lfo = 0, pos = 0, note = '', shownPos = 0
  // one cycle of a single unit at a given drive, as harmonics: used where the network has no electrical model
  const unitCycle = (drive, H) => {
    const v = new Float32Array([-1.2]), w = new Float32Array([-.62]), h = .05, buf = []
    for (let i = 0, n = fhnCycle(drive) * 4 / h; i < n; i++) fhnStep(v, w, 0, h, drive, 0) // let it settle
    let prev = v[0], started = false
    for (let i = 0; i < 4000; i++) { fhnStep(v, w, 0, h, drive, 0); const up = prev < 0 && v[0] >= 0; prev = v[0]; if (up) { if (started) break; started = true } if (started) buf.push(v[0]) }
    const n = buf.length, amps = new Array(H).fill(0), phases = new Array(H).fill(0); if (n < 8) { amps[0] = 1; return [amps, phases] }
    for (let k = 0; k < H; k++) { let c = 0, s = 0; for (let i = 0; i < n; i++) { c += buf[i] * Math.cos(TAU * (k + 1) * i / n); s += buf[i] * Math.sin(TAU * (k + 1) * i / n) } amps[k] = Math.hypot(c, s) * 2 / n; phases[k] = Math.atan2(-s, c) }
    return [amps, phases]
  }
  return {
    load(spec) { // rebuild the frames from their harmonics, with copies that drop the top harmonics for high notes
      const wt = spec.wavetable; let amps = wt.amps, phases = wt.phases; F = wt.frames; note = ''
      if (spec.has && spec.has.electrical === false) {
        const tips = spec.curves && spec.curves.tips || [], top = tips.reduce((a, b) => Math.max(a, b), 0), low = tips.reduce((a, b) => Math.min(a, b), top), flat = !(top > low)
        amps = []; phases = []
        for (let f = 0; f < F; f++) {
          const x = f / (F - 1) * (tips.length - 1), i = Math.min(tips.length - 1, x | 0), tip = flat ? .5 : ((tips[i] + ((tips[Math.min(tips.length - 1, i + 1)] || tips[i]) - tips[i]) * (x - i)) - low) / (top - low)
          const [a, p] = unitCycle(.36 + .9 * tip, wt.harmonics); amps.push(a); phases.push(p)
        }
        note = 'No electrical activity runs through the network at this size: the table is one excitable unit on its own, ' + (flat ? 'at a steady drive, so it does not change with growth.' : 'driven harder as the number of growing tips rises.')
      }
      levels = []
      for (let H = wt.harmonics; H >= 2; H >>= 1) {
        const t = new Float32Array(F * S)
        for (let f = 0; f < F; f++) { let pk = 1e-9; for (let i = 0; i < S; i++) { let x = 0; for (let h = 0; h < H; h++) x += amps[f][h] * Math.cos(TAU * (h + 1) * i / S + phases[f][h]); t[f * S + i] = x; pk = Math.max(pk, Math.abs(x)) } for (let i = 0; i < S; i++) t[f * S + i] /= pk }
        levels.push([H, t])
      }
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) { const v = voices.find(v => v.key == key) || voices.reduce((a, b) => (a.on ? a.age + 1e9 : a.age) < (b.on ? b.age + 1e9 : b.age) ? a : b); v.key = key; v.f = midiHz(key); v.on = true; v.vel = clamp(vel, 0, 1); v.age = ++clock; v.t = 0 },
    noteOff(key) { for (const v of voices) if (v.key == key) v.on = false },
    process(L, R) {
      if (!levels) return
      const n = L.length, up = 1 / (Math.max(.001, P.attack) * sr), down = 1 / (Math.max(.005, P.release) * sr)
      lfo += TAU * P.sweep * n / sr; if (lfo > TAU) lfo -= TAU; pos = clamp(P.pos + P.depth * .5 * Math.sin(lfo), 0, 1) // the scan drifts through growth and back
      for (const v of voices) {
        if (!v.on && v.g <= 0) continue
        // this note's own place in growth: a hard key starts later, and it moves on while the key is held
        const mine = clamp(pos + P.touch * (v.vel - .8) * .5 + P.grow * v.t, 0, 1), fp = mine * (F - 1), f0 = Math.min(F - 2, fp | 0), ft = fp - f0
        const fq = clamp(mine + P.width * .25, 0, 1) * (F - 1), g0 = Math.min(F - 2, fq | 0), gt = fq - g0 // the right ear reads a little later in growth
        if (v.on) { v.t += n / sr; if (v.age == clock) shownPos = mine }
        let tab = levels[levels.length - 1][1]; for (const [H, t] of levels) if (H * v.f < sr / 2) { tab = t; break }
        for (let i = 0; i < n; i++) {
          const target = v.on ? v.vel : 0; v.g = v.g < target ? Math.min(target, v.g + up) : Math.max(target, v.g - down) // loudness moves to the key's, never jumps
          const x = v.ph * S, k = x | 0, t = x - k, k1 = (k + 1) % S
          const a = tab[f0 * S + k] + (tab[f0 * S + k1] - tab[f0 * S + k]) * t, b = tab[(f0 + 1) * S + k] + (tab[(f0 + 1) * S + k1] - tab[(f0 + 1) * S + k]) * t
          const c = tab[g0 * S + k] + (tab[g0 * S + k1] - tab[g0 * S + k]) * t, d = tab[(g0 + 1) * S + k] + (tab[(g0 + 1) * S + k1] - tab[(g0 + 1) * S + k]) * t
          L[i] += (a + (b - a) * ft) * v.g * .35; R[i] += (c + (d - c) * gt) * v.g * .35
          if ((v.ph += v.f * v.jit / sr) >= 1) { v.ph -= 1; v.jit = 1 + P.irregular * (rnd() - .5) } // each cycle a little longer or shorter than the last
        }
      }
      soften(L, R, P.level)
    },
    view() { return { pos: shownPos || pos, drift: pos, right: clamp((shownPos || pos) + P.width * .25, 0, 1), held: voices.reduce((n, v) => n + (v.on ? 1 : 0), 0), scaleNote: note } }
  }
}
