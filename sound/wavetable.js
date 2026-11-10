// Wavetables from the network's electrical activity. Takes a recording (sound/record.js) and cuts
// single cycles out of the voltage between two electrodes, one cycle from each stage of the network's
// growth, so that scanning through the table plays back how the wave's shape changed as the fungus grew.
//
// This is not physical modelling: the model's voltage is used directly as an oscillator's shape.
// The table matches SynthLand's wavetable engine: 64 frames of 2,048 samples, 512 harmonics a frame.
var fft = (re, im, inverse) => { // in-place radix-2
  const N = re.length
  for (let i = 1, j = 0; i < N; i++) { let b = N >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t } }
  for (let len = 2; len <= N; len <<= 1) {
    const a = (inverse ? 6.283185307179586 : -6.283185307179586) / len
    for (let i = 0; i < N; i += len) for (let k = 0; k < len / 2; k++) {
      const c = Math.cos(a * k), s = Math.sin(a * k), p = i + k, q = p + len / 2, tr = re[q] * c - im[q] * s, ti = re[q] * s + im[q] * c
      re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti
    }
  }
  if (inverse) for (let i = 0; i < N; i++) { re[i] /= N; im[i] /= N }
}
var wavetable = (rec, opt) => {
  const o = Object.assign({ frames: 64, size: 2048, harmonics: 512, a: 0, b: 1 }, opt)
  const va = rec.volts[o.a], vb = o.b >= 0 ? rec.volts[o.b] : null, per = rec.meta.electrical_samples / rec.meta.steps | 0, steps = rec.meta.steps
  let mean = 0; for (let i = 0; i < va.length; i++) mean += va[i]; mean /= va.length
  // one cycle of electrode a from a growth step: between its first two upward crossings of its mean
  const cycle = s => { let c0 = -1; for (let i = s * per + 1; i < (s + 1) * per; i++) if (va[i - 1] < mean && va[i] >= mean) { if (c0 < 0) c0 = i; else if (i - c0 > 8) return [c0, i] } return null }
  const frames = [], amps = [], phases = [], gains = [], from = []
  let single = 0
  for (let f = 0; f < o.frames; f++) {
    let s = Math.round(f / (o.frames - 1) * (steps - 1)), c = null
    for (let d = 0; d < steps && !c; d++) c = (s + d < steps && cycle(s + d)) || (s - d >= 0 && cycle(s - d)) // nearest step that has a whole cycle
    if (!c) break
    const n = c[1] - c[0], re = new Float32Array(o.size), im = new Float32Array(o.size)
    const take = v => { for (let i = 0; i < o.size; i++) { const x = c[0] + i / o.size * n, k = x | 0, t = x - k; re[i] = v(k) + (v(Math.min(k + 1, va.length - 1)) - v(k)) * t } }
    const peakOf = () => { let p = 0; for (let i = 0; i < o.size; i++) p = Math.max(p, Math.abs(re[i])); return p }
    take(k => va[k] - mean); const alone = peakOf()
    if (vb) { take(k => va[k] - vb[k]); if (peakOf() < .02 * alone) { take(k => va[k] - mean); single++ } } // two electrodes exactly in step cancel: use one
    // the second electrode need not repeat in exactly this time, so close the loop: remove the step between the ends, then the mean
    const jump = (va[c[1]] - (vb ? vb[c[1]] : mean)) - (va[c[0]] - (vb ? vb[c[0]] : mean)); let dc = 0
    for (let i = 0; i < o.size; i++) { re[i] -= jump * (i / o.size - .5); dc += re[i] } dc /= o.size
    for (let i = 0; i < o.size; i++) re[i] -= dc
    fft(re, im)
    // keep the first `harmonics` partials, drop the rest, and rebuild the frame from them
    const A = new Float32Array(o.harmonics), P = new Float32Array(o.harmonics)
    for (let h = 1; h <= o.harmonics; h++) { A[h - 1] = 2 * Math.hypot(re[h], im[h]) / o.size; P[h - 1] = Math.atan2(im[h], re[h]) }
    for (let i = 0; i < o.size; i++) if (i == 0 || (i > o.harmonics && i < o.size - o.harmonics)) re[i] = im[i] = 0
    fft(re, im, true)
    const g = peakOf() || 1; for (let i = 0; i < o.size; i++) re[i] /= g
    for (let h = 0; h < o.harmonics; h++) A[h] /= g
    frames.push(re); amps.push(A); phases.push(P); gains.push(g); from.push(s)
  }
  return { frames, amps, phases, gains, size: o.size, harmonics: o.harmonics,
    meta: { species: rec.meta.species, seed: rec.meta.seed, electrodes: o.b >= 0 ? [o.a, o.b] : [o.a], growth_days: rec.meta.growth_seconds / 86400, frames: frames.length, frames_from_one_electrode: single,
      spike_interval_minutes: rec.meta.spike_interval_minutes, millivolts_peak: gains, from_growth_step: from } }
}
// A wavetable as a mono 32-bit float WAV, frames end to end, with the "clm " chunk that Serum and Vital read for the frame size
var wavetableWav = wt => {
  const n = wt.frames.length * wt.size, clm = '<!>' + wt.size + ' 10000000 wavetable (mushroom-substrate)', cl = clm.length + (clm.length & 1)
  const b = new ArrayBuffer(12 + 24 + 8 + cl + 8 + n * 4), d = new DataView(b), s = (o, t) => { for (let i = 0; i < t.length; i++) d.setUint8(o + i, t.charCodeAt(i)) }
  s(0, 'RIFF'); d.setUint32(4, b.byteLength - 8, true); s(8, 'WAVEfmt '); d.setUint32(16, 16, true); d.setUint16(20, 3, true); d.setUint16(22, 1, true)
  d.setUint32(24, 48000, true); d.setUint32(28, 48000 * 4, true); d.setUint16(32, 4, true); d.setUint16(34, 32, true)
  s(36, 'clm '); d.setUint32(40, cl, true); s(44, clm); let at = 44 + cl
  s(at, 'data'); d.setUint32(at + 4, n * 4, true); at += 8
  for (const f of wt.frames) for (let i = 0; i < wt.size; i++, at += 4) d.setFloat32(at, f[i], true)
  return b
}
// Band-limited copies for playing without aliasing: level L keeps harmonics up to (harmonics >> L)
var wavetableMips = wt => {
  const levels = []; for (let hmax = wt.harmonics; hmax >= 1; hmax >>= 1) {
    const out = new Float32Array(wt.frames.length * wt.size)
    wt.frames.forEach((_, f) => {
      const re = new Float32Array(wt.size), im = new Float32Array(wt.size), A = wt.amps[f], P = wt.phases[f]
      for (let h = 1; h <= hmax; h++) { const a = A[h - 1] * wt.size / 2; re[h] = a * Math.cos(P[h - 1]); im[h] = a * Math.sin(P[h - 1]); re[wt.size - h] = re[h]; im[wt.size - h] = -im[h] }
      fft(re, im, true); out.set(re, f * wt.size)
    })
    levels.push(out)
  }
  return levels
}
if (typeof module != 'undefined') module.exports = { wavetable, wavetableWav, wavetableMips, fft }
