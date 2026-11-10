// Hyphal Harp: pluck the network. A note strikes the web of hyphae at a chosen distance from its centre.
// The web is resized so that its lowest mode is the key played; its own mode ratios, at the chosen stage
// of growth, give the tone. Each mode's loudness is how strongly a strike at that distance moves it.
// A harder strike is a shorter one and wakes the high modes more. While a key is held the web can go on
// growing, so its modes drift toward those of the later stages. Old hyphae at the centre can be abandoned:
// modes that move mostly there lose their strings, so they are quieter and die sooner.
import { Bank, midiHz, clamp, soften, stageAt } from '../kit/dsp.js'
// Retunes one mode of a bank while it is ringing, keeping its loudness and where it is in its swing (a plain
// retune would reread the old motion at the new pitch, which can make it far louder).
const retuneMode = (b, i, hz, sec) => {
  const c2 = b.c2[i], sw = b.sw[i]; if (!c2 || !sw) return b.tune(i, hz, sec)
  const r = Math.sqrt(c2), y1 = b.y1[i], C = (y1 * b.c1[i] / (2 * r) - b.y2[i] * r) / sw; b.tune(i, hz, sec)
  if (b.c2[i]) { const rn = Math.sqrt(b.c2[i]); b.y2[i] = (y1 * b.c1[i] / (2 * rn) - C * b.sw[i]) / rn }
}
export const create = sr => {
  const V = 8, M = 16, voices = Array.from({ length: V }, () => ({ bank: new Bank(M, sr), key: -1, age: 0, st: 0, grow: false }))
  const P = { stage: .5, pos: .35, ring: 1.4, own: 1, bright: .6, grow: .05, age: 0, level: .8 }, shown = new Float32Array(M), amp = new Float32Array(M)
  let spec = null, clock = 0, energy = 0, note = '', dies = true, lastStage = .5, lastKey = 60
  const ratio = (st, i) => st.hz[i] > 0 && st.hz[0] > 0 ? st.hz[i] / st.hz[0] : i + 1
  // share of a mode's movement that is in the two rings nearest the centre, where the oldest hyphae are
  const central = (st, i) => { const z = st.zone[i]; if (!z) return 0; let s = 1e-9; for (let k = 0; k < z.length; k++) s += Math.abs(z[k]); return (Math.abs(z[0]) + Math.abs(z[1] || 0)) / s }
  // frequencies and ring times for a voice at its own stage of growth; damped is true once the key is let go
  const retune = (v, damped) => {
    const [a, b, t] = stageAt(spec, v.st), f0 = midiHz(v.key), old = dies ? P.age : 0
    for (let i = 0; i < M; i++) {
      const ra = ratio(a, i), rb = ratio(b, i), r = (i + 1) + P.own * (ra + (rb - ra) * t - (i + 1)) // the web's own mode ratios, or a plain string's, or in between
      retuneMode(v.bank, i, f0 * r, P.ring * (damped ? .12 : 1) * (1 - .9 * old * central(a, i)) / (1 + i * (1 - P.bright) * .5))
    }
  }
  const strike = (v, vel) => {
    const [a] = stageAt(spec, v.st), z = clamp(P.pos, 0, 1) * 5, z0 = z | 0, z1 = Math.min(5, z0 + 1), zt = z - z0, old = dies ? P.age : 0, hard = clamp(vel, .05, 1) / .8
    let norm = 1e-9
    for (let i = 0; i < M; i++) {
      const zn = a.zone[i]; amp[i] = zn ? (zn[z0] + (zn[z1] - zn[z0]) * zt) * (1 - old * central(a, i)) : 0; norm += Math.abs(amp[i])
      const m = a.mic[i] || [1, 1], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); v.bank.hear(i, m[0] / mm, m[1] / mm)
    }
    // if no part of the web lies at that distance, strike it everywhere: every mode, the higher ones more weakly
    if (norm < 1e-6) { norm = 0; for (let i = 0; i < M; i++) { amp[i] = 1 / (1 + i); norm += amp[i] } }
    // a hard strike is short and sharp and reaches the high modes; a soft one is slow and does not (unchanged at a velocity of 0.8)
    for (let i = 0; i < M; i++) { const k = amp[i] / norm * Math.pow(hard, i * .25); v.bank.strike(i, vel * k * 2.4); shown[i] = Math.abs(k) }
  }
  return {
    load(s) {
      spec = s; for (const v of voices) { v.bank.silence(); v.key = -1; v.grow = false }
      const has = s.has || {}, parts = []; dies = s.engine !== '4k'
      if (has.cords === false) parts.push('No cords at this size: every hypha is the same thickness, so the modes come from the shape of the web alone.')
      if (!dies) parts.push('Nothing is abandoned at this size, so dying back at the centre does nothing.')
      if (s.engine === '4m') parts.push('The real web here is metres across and its lowest note is far below hearing; it is shrunk a great deal to reach the key.')
      note = parts.join(' ')
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      if (!spec) return
      const v = voices.find(v => v.key == key) || voices.find(v => v.key < 0 && v.age == 0) || voices.reduce((a, b) => (a.key < 0 ? a.age : a.age + 1e9) < (b.key < 0 ? b.age : b.age + 1e9) ? a : b) // a free voice first, then the oldest held one
      v.key = key; v.age = ++clock; v.st = clamp(P.stage, 0, 1); v.grow = true; lastKey = key; retune(v, false); strike(v, vel)
    },
    noteOff(key) { const v = voices.find(v => v.key == key); if (v && spec) { retune(v, true); v.key = -1; v.grow = false } }, // letting go damps the web
    process(L, R) {
      let e = 0
      for (const v of voices) {
        if (v.grow && P.grow > 0 && v.st < 1) { v.st = Math.min(1, v.st + P.grow * L.length / sr); retune(v, false) } // the web goes on growing under a held key
        if (v.key >= 0 && v.age == clock) lastStage = v.st
        e += v.bank.process(L, R)
      }
      energy = Math.min(1, Math.sqrt(e) * 3); soften(L, R, P.level)
    },
    view() {
      const st = spec ? stageAt(spec, lastStage)[0] : null, real = st ? st.hz[0] : 0
      return { modes: Array.from(shown), energy, stage: lastStage, held: voices.reduce((n, v) => n + (v.key >= 0 ? 1 : 0), 0), dying: dies ? P.age : 0, resize: real > 0 ? midiHz(lastKey) / real : 0, scaleNote: note }
    }
  }
}
