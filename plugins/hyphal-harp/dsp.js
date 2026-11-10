// Hyphal Harp: pluck the network. A note strikes the web of hyphae at a chosen distance from its centre.
// The web is resized so that its lowest mode is the key played; its own mode ratios, at the chosen stage
// of growth, give the tone. Each mode's loudness is how strongly a strike at that distance moves it.
import { Bank, midiHz, clamp, soften, stageAt } from '../kit/dsp.js'
export const create = sr => {
  const V = 8, M = 16, voices = Array.from({ length: V }, () => ({ bank: new Bank(M, sr), key: -1, age: 0 }))
  const P = { stage: .5, pos: .35, ring: 1.4, own: 1, bright: .6, level: .8 }, shown = new Float32Array(M)
  let spec = null, clock = 0, energy = 0
  const tune = (v, vel) => {
    const [a, b, t] = stageAt(spec, P.stage), f0 = midiHz(v.key), z = clamp(P.pos, 0, 1) * 5, z0 = z | 0, z1 = Math.min(5, z0 + 1), zt = z - z0, amp = new Float32Array(M)
    let norm = 1e-9
    for (let i = 0; i < M; i++) {
      const ra = a.hz[i] / a.hz[0], rb = (b.hz[i] || a.hz[i]) / b.hz[0], ratio = ra + (rb - ra) * t // the web's own mode ratios at this stage of growth
      const r = (i + 1) + P.own * (ratio - (i + 1))                                                // or a plain string's, or in between
      v.bank.tune(i, f0 * r, P.ring * (vel < 0 ? .12 : 1) / (1 + i * (1 - P.bright) * .5))
      if (vel < 0) continue
      amp[i] = a.zone[i][z0] + (a.zone[i][z1] - a.zone[i][z0]) * zt; norm += Math.abs(amp[i])
      const m = a.mic[i], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); v.bank.hear(i, m[0] / mm, m[1] / mm)
    }
    // if no part of the web lies at that distance, strike it everywhere: every mode, the higher ones more weakly
    if (vel >= 0 && norm < 1e-6) { norm = 0; for (let i = 0; i < M; i++) { amp[i] = 1 / (1 + i); norm += amp[i] } }
    if (vel >= 0) for (let i = 0; i < M; i++) { v.bank.strike(i, vel * amp[i] / norm * 2.4); shown[i] = Math.abs(amp[i]) / norm }
  }
  return {
    load(s) { spec = s; for (const v of voices) { v.bank.silence(); v.key = -1 } },
    set(k, v) { P[k] = v },
    noteOn(key, vel) { if (!spec) return; const v = voices.find(v => v.key == key) || voices.reduce((a, b) => a.age < b.age ? a : b); v.key = key; v.age = ++clock; tune(v, vel) },
    noteOff(key) { const v = voices.find(v => v.key == key); if (v && spec) { tune(v, -1); v.key = -1 } }, // letting go damps the web
    process(L, R) { let e = 0; for (const v of voices) e += v.bank.process(L, R); energy = Math.min(1, Math.sqrt(e) * 3); soften(L, R, P.level) },
    view() { return { modes: Array.from(shown), energy } }
  }
}
