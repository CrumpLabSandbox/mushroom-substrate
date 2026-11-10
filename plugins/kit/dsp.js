// Shared sound parts for the mushroom plugins. Plain modules: they run in the audio thread and in Node.
export const TAU = 6.283185307179586
export const midiHz = k => 440 * Math.pow(2, (k - 69) / 12)
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v
export const rng = (seed = 1) => { let a = seed >>> 0 || 1; return () => (a = a + 0x6D2B79F5 | 0, a = Math.imul(a ^ a >>> 15, 1 | a) >>> 0, a = (a + Math.imul(a ^ a >>> 7, 61 | a) ^ a) >>> 0, ((a ^ a >>> 14) >>> 0) / 4294967296) }

// A bank of resonators: each is one mode of a vibrating body, with a frequency, a ring time and how loudly
// the left and right microphones hear it. A mode can be struck (an impulse) or driven by a signal.
export class Bank {
  constructor(n, sr) {
    this.n = n; this.sr = sr
    for (const k of ['c1', 'c2', 'sw', 'y1', 'y2', 'hit', 'gl', 'gr', 'drive']) this[k] = new Float32Array(n)
  }
  // frequency in Hz and ring time in seconds (the time to fall to about a third)
  tune(i, hz, seconds) {
    if (!(hz > 15) || hz > this.sr * .45) { this.c1[i] = this.c2[i] = this.sw[i] = 0; this.y1[i] = this.y2[i] = 0; return }
    const w = TAU * hz / this.sr, r = Math.exp(-1 / (Math.max(.001, seconds) * this.sr))
    this.c1[i] = 2 * r * Math.cos(w); this.c2[i] = r * r; this.sw[i] = Math.sin(w)
  }
  hear(i, left, right) { this.gl[i] = left; this.gr[i] = right }
  strike(i, amount) { this.hit[i] += amount * this.sw[i] }
  silence() { this.y1.fill(0); this.y2.fill(0); this.hit.fill(0) }
  // adds this bank's sound to L and R; x, if given, drives every mode by its `drive` weight
  process(L, R, x) {
    const n = L.length; let energy = 0
    for (let i = 0; i < this.n; i++) {
      const c1 = this.c1[i], c2 = this.c2[i]; if (!c1 && !c2) continue
      let y1 = this.y1[i], y2 = this.y2[i]; const gl = this.gl[i], gr = this.gr[i], d = x ? this.drive[i] * this.sw[i] : 0
      let y = c1 * y1 - c2 * y2 + this.hit[i] + (d ? x[0] * d : 0); this.hit[i] = 0; y2 = y1; y1 = y; L[0] += y * gl; R[0] += y * gr
      if (d) for (let s = 1; s < n; s++) { y = c1 * y1 - c2 * y2 + x[s] * d; y2 = y1; y1 = y; L[s] += y * gl; R[s] += y * gr }
      else for (let s = 1; s < n; s++) { y = c1 * y1 - c2 * y2; y2 = y1; y1 = y; L[s] += y * gl; R[s] += y * gr }
      this.y1[i] = Math.abs(y1) < 1e-20 ? 0 : y1; this.y2[i] = Math.abs(y2) < 1e-20 ? 0 : y2; energy += y1 * y1
    }
    return energy
  }
}
// keeps the output inside full scale without a hard edge
export const soften = (L, R, gain = 1) => { for (let i = 0; i < L.length; i++) { const a = L[i] * gain, b = R[i] * gain; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b)) } }
// the stage of growth for a 0..1 position, and its neighbour, with the blend between them
export const stageAt = (spec, pos) => { const n = spec.stages.length - 1, x = clamp(pos, 0, 1) * n, a = Math.min(n, x | 0); return [spec.stages[a], spec.stages[Math.min(n, a + 1)], x - a, a] }
