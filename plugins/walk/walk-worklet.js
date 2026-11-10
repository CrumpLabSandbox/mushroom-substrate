// The sound of the world: up to ten mushrooms playing at once, each in its own slot with its own output, so the
// page can place each one in space. A slot is a composer playing an instrument, or an atmosphere, optionally sent
// through an effect: the separate plugins' own sound code, unchanged. Each slot has a slow loudness rider (so a quiet
// plugin and a loud one sit together) and fades in and out as mushrooms come into and out of hearing.
import { INSTRUMENTS } from '../kit/instruments.js'
import { COMPOSERS } from '../kit/composers.js'
import { ATMOSPHERES, EFFECTS } from '../kit/atmospheres.js'
const SLOTS = 10, TARGET = .07
registerProcessor('walk', class extends AudioWorkletProcessor {
  constructor() {
    super()
    this.s = Array.from({ length: SLOTS }, () => null); this.count = 0; this.levels = new Float32Array(SLOTS)
    this.port.onmessage = e => {
      const m = e.data
      if (m.assign) this.assign(m.slot, m.assign)
      if (m.release != null) { const s = this.s[m.release]; if (s) s.leaving = true }
      if (m.set) { const s = this.s[m.set.slot]; if (s) for (const [part, k, v] of m.set.values) s[part] && s[part].set(k, v) }
    }
  }
  assign(i, a) {
    const old = this.s[i]; if (old && old.comp && old.comp.release) for (const ev of old.comp.release()) old.inst.noteOff(ev.off)
    const s = { id: a.id, g: 0, fade: 0, leaving: false, ms: 1e-4, ride: 1, L: new Float32Array(128), R: new Float32Array(128), X: new Float32Array(128), fxMix: a.fxMix || 0 }
    try {
      if (a.atmo) s.atmo = ATMOSPHERES[a.atmo](sampleRate)
      else { s.inst = INSTRUMENTS[a.inst](sampleRate); s.comp = COMPOSERS[a.comp](sampleRate) }
      if (a.fx) s.fx = EFFECTS[a.fx](sampleRate)
      for (const part of ['atmo', 'inst', 'comp', 'fx']) if (s[part]) { s[part].load(a.spec); for (const [k, v] of a.params[part] || []) s[part].set(k, v) }
      if (s.fx) s.fx.set('mix', s.fxMix)
    } catch (err) { this.port.postMessage({ error: String(err && err.message || err), slot: i }); s.dead = true }
    this.s[i] = s
  }
  process(_, outputs) {
    const levels = this.levels; levels.fill(0)
    for (let i = 0; i < SLOTS; i++) {
      const s = this.s[i], o = outputs[i], L = o[0], R = o[1] || o[0], n = L.length
      if (!s || s.dead) continue
      if (s.L.length != n) { s.L = new Float32Array(n); s.R = new Float32Array(n); s.X = new Float32Array(n) }
      s.L.fill(0); s.R.fill(0)
      if (s.atmo) s.atmo.process(s.L, s.R, null)
      else { for (const ev of s.comp.advance(n)) ev.off != null ? s.inst.noteOff(ev.off) : s.inst.noteOn(ev.on, ev.vel); s.inst.process(s.L, s.R, null) }
      if (s.fx) { for (let k = 0; k < n; k++) { s.X[k] = (s.L[k] + s.R[k]) * .5; s.L[k] = s.R[k] = 0 } s.fx.process(s.L, s.R, s.X) }
      // loudness: follow the slot's level slowly and bring it toward a common target
      let ms = 0; for (let k = 0; k < n; k++) ms += s.L[k] * s.L[k] + s.R[k] * s.R[k]; ms /= 2 * n
      s.ms += (ms - s.ms) * .02
      const rms = Math.sqrt(s.ms); if (rms > 2e-4) s.ride += (Math.min(6, Math.max(.15, TARGET / rms)) - s.ride) * .002
      // fades: about a second and a half in, the same out (375 blocks a second at 48 kHz)
      const want = s.leaving ? 0 : 1; s.fade += (want - s.fade) * .002
      if (s.leaving && s.fade < .003) { if (s.comp && s.comp.release) for (const ev of s.comp.release()) s.inst.noteOff(ev.off); this.s[i] = null; continue }
      const g0 = s.g, g1 = s.ride * s.fade; s.g = g1
      for (let k = 0; k < n; k++) { const g = g0 + (g1 - g0) * k / n; L[k] = s.L[k] * g; R[k] = s.R[k] * g }
      levels[i] = Math.sqrt(ms) * g1
    }
    if ((this.count += 128) >= 2048) { this.count = 0; this.port.postMessage({ levels: Array.from(levels), ids: this.s.map(s => s ? s.id : null) }) }
    return true
  }
})
