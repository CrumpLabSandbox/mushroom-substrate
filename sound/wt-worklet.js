// A small wavetable oscillator bank for the wavetable page. It reads band-limited copies of the table
// (sound/wavetable.js, wavetableMips), blends neighbouring frames by the scan position, and plays up to
// eight notes with a simple attack and release.
class Wavetable extends AudioWorkletProcessor {
  constructor() {
    super(); this.voices = []; this.pos = 0; this.target = 0; this.attack = .01; this.release = .4; this.n = 0
    this.port.onmessage = e => {
      const m = e.data
      if (m.levels) { this.levels = m.levels; this.F = m.frames; this.S = m.size; this.H = m.harmonics }
      if (m.on != null) { this.voices = this.voices.filter(v => v.key != m.key).slice(-7); this.voices.push({ f: m.on, key: m.key, ph: 0, g: 0, off: false }) }
      if (m.off != null) for (const v of this.voices) if (v.key == m.off) v.off = true
      if (m.pos != null) this.target = m.pos
      if (m.attack != null) { this.attack = m.attack; this.release = m.release }
    }
  }
  process(_, out) {
    const L = out[0][0], R = out[0][1] || L
    if (!this.levels) return true
    const S = this.S, up = 1 / (this.attack * sampleRate), down = 1 / (this.release * sampleRate)
    for (const v of this.voices) { let l = 0; while (l < this.levels.length - 1 && (this.H >> l) * v.f > sampleRate / 2) l++; v.tab = this.levels[l] } // the copy with no harmonics above half the sample rate
    for (let i = 0; i < L.length; i++) {
      this.pos += .001 * (this.target - this.pos)
      const fp = this.pos * (this.F - 1), f0 = Math.min(Math.max(0, this.F - 2), fp | 0), ft = this.F > 1 ? fp - f0 : 0, f1 = Math.min(this.F - 1, f0 + 1)
      let s = 0
      for (const v of this.voices) {
        const x = v.ph * S, k = x | 0, t = x - k, k1 = (k + 1) % S, a = v.tab[f0 * S + k] + (v.tab[f0 * S + k1] - v.tab[f0 * S + k]) * t, b = v.tab[f1 * S + k] + (v.tab[f1 * S + k1] - v.tab[f1 * S + k]) * t
        v.g = v.off ? v.g - down : Math.min(1, v.g + up)
        s += (a + (b - a) * ft) * v.g; v.ph += v.f / sampleRate; if (v.ph >= 1) v.ph -= 1
      }
      L[i] = R[i] = s * .22
    }
    this.voices = this.voices.filter(v => !v.off || v.g > 0)
    if ((this.n += L.length) > 2000) { this.n = 0; this.port.postMessage({ pos: this.pos }) }
    return true
  }
}
registerProcessor('wavetable', Wavetable)
