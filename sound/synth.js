// The synthesiser. Turns a recording (sound/record.js) into stereo audio. Nothing here is physics:
// it is a set of stated mappings, each with a gain, so any one can be heard alone.
//
//   voices   the electrode voltages played as sound waves (audification), one electrode per stereo
//            position. Pitch is set by how much the electrical clock is sped up.
//   events   every growth event becomes a short sound, placed in time by how much growth is sped up,
//            left-right by where it happened and higher or lower by how deep it was.
//   body     a low drone whose loudness follows flow through the network and whose brightness follows
//            the number of growing tips.
//
// The two speed-ups are separate because the recording has two clocks. Both are reported with the audio.
var synth = (rec, map) => {
  const m = Object.assign({ rate: 48000, pitch: 180, seconds: 0, voices: 1, events: 1, body: .6 }, map)
  const sr = m.rate, V = rec.volts, n = V[0].length, spikeS = rec.meta.spike_interval_minutes * 60
  // speed-up of the electrical clock that puts the species' spike rate at the chosen pitch
  const eSpeed = m.speed || m.pitch * spikeS, step = eSpeed / (rec.meta.electrical_sample_seconds * sr) // electrical samples per audio sample
  const len = Math.max(1, Math.floor(m.seconds ? m.seconds * sr : n / step)), L = new Float32Array(len), R = new Float32Array(len)
  const dur = len / sr, gSpeed = rec.meta.growth_seconds / dur // growth seconds per second of audio
  // ---- voices
  if (m.voices) V.forEach((v, k) => {
    const pan = V.length > 1 ? k / (V.length - 1) : .5, gl = Math.cos(pan * 1.5708), gr = Math.sin(pan * 1.5708)
    let mean = 0, peak = 1e-9; for (let i = 0; i < n; i++) mean += v[i]; mean /= n
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(v[i] - mean))
    const g = m.voices * .5 / Math.sqrt(V.length) / peak
    let lp = 0
    for (let i = 0; i < len; i++) {
      const x = (i * step) % (n - 1), a = x | 0, f = x - a, s = (v[a] + (v[a + 1] - v[a]) * f - mean) * g
      lp += .5 * (s - lp); L[i] += lp * gl; R[i] += lp * gr // a gentle low-pass: the model's waveform has hard corners
    }
  })
  // ---- events
  if (m.events) {
    const E = rec.events, W = rec.meta.size[0], DZ = rec.meta.size[1]
    // type: [base frequency Hz, length s, loudness, noise or tone]
    const KIND = { 0: [1500, .035, .10, 0], 1: [520, .11, .16, 0], 2: [240, .09, .05, 0], 3: [0, .12, .035, 1], 4: [660, .25, .12, 0], 5: [200, .2, .06, 0], 6: [330, .7, .22, 0],
      7: [95, .3, .16, 0], 8: [130, .3, .18, 0], 10: [0, 1.6, .16, 1], 11: [0, .5, .05, 1], 12: [0, .22, .05, 1], 13: [880, 1, .2, 0] }
    let seed = 12345; const rnd = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296
    for (let j = 0; j < E.t.length; j++) {
      const kd = KIND[E.type[j]]; if (!kd) continue
      const at = E.t[j] / gSpeed * sr | 0, dn = Math.min(len - at, kd[1] * sr | 0); if (dn <= 0) continue
      const pan = Math.min(1, Math.max(0, E.x[j] / W)), gl = Math.cos(pan * 1.5708), gr = Math.sin(pan * 1.5708)
      const fr = kd[0] * (1.6 - 1.1 * Math.min(1, E.z[j] / DZ)), g = m.events * kd[2], w = 6.2832 * fr / sr // shallow is higher, deep is lower
      for (let i = 0; i < dn; i++) {
        const env = Math.min(1, i / 96) * Math.exp(-5 * i / dn), s = (kd[3] ? rnd() * 2 - 1 : Math.sin(w * i)) * env * g
        L[at + i] += s * gl; R[at + i] += s * gr
      }
    }
  }
  // ---- body
  if (m.body && rec.taps.length > 1) {
    const T = rec.taps, col = k => rec.meta.tap_names.indexOf(k), fi = col('flow'), ti = col('ntips')
    let fmax = 1e-9, tmax = 1; for (const row of T) { fmax = Math.max(fmax, row[fi]); tmax = Math.max(tmax, row[ti]) }
    let ph = 0, ph2 = 0, a = 0, b = 0
    for (let i = 0; i < len; i++) {
      const x = i / len * (T.length - 1), k = x | 0, f = x - k, r0 = T[k], r1 = T[Math.min(T.length - 1, k + 1)]
      const flow = (r0[fi] + (r1[fi] - r0[fi]) * f) / fmax, tips = (r0[ti] + (r1[ti] - r0[ti]) * f) / tmax
      a += .0005 * (flow - a); b += .0005 * (tips - b)
      ph += 6.2832 * 55 / sr; ph2 += 6.2832 * 82.5 / sr
      const s = m.body * .16 * a * (Math.sin(ph) + .5 * Math.sin(ph2) + b * .5 * Math.sin(ph * 3) + b * .25 * Math.sin(ph * 5))
      L[i] += s; R[i] += s
    }
  }
  // ---- level: bring the peak to -3 dB, never by more than is needed
  let peak = 1e-9; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
  const gain = .708 / peak; for (let i = 0; i < len; i++) { L[i] *= gain; R[i] *= gain }
  return { left: L, right: R, rate: sr, seconds: dur, info: {
    electrical_speed_up: eSpeed, growth_speed_up: gSpeed, pitch_hz: eSpeed / spikeS,
    says: `Electrical activity is sped up ${fmt(eSpeed)} times, which puts one spike every ${rec.meta.spike_interval_minutes} minutes at ${(eSpeed / spikeS).toFixed(0)} Hz. ` +
      `Growth is sped up ${fmt(gSpeed)} times: ${(rec.meta.growth_seconds / 86400).toFixed(1)} days in ${dur.toFixed(1)} seconds.` } }
}
var fmt = v => v >= 1e6 ? (v / 1e6).toFixed(1) + ' million' : v >= 1e3 ? Math.round(v / 1e3) + ' thousand' : v.toFixed(0)
// 32-bit float stereo WAV
var wav = a => {
  const n = a.left.length, b = new ArrayBuffer(44 + n * 8), d = new DataView(b), s = (o, t) => { for (let i = 0; i < t.length; i++) d.setUint8(o + i, t.charCodeAt(i)) }
  s(0, 'RIFF'); d.setUint32(4, 36 + n * 8, true); s(8, 'WAVEfmt '); d.setUint32(16, 16, true); d.setUint16(20, 3, true); d.setUint16(22, 2, true)
  d.setUint32(24, a.rate, true); d.setUint32(28, a.rate * 8, true); d.setUint16(32, 8, true); d.setUint16(34, 32, true); s(36, 'data'); d.setUint32(40, n * 8, true)
  for (let i = 0; i < n; i++) { d.setFloat32(44 + i * 8, a.left[i], true); d.setFloat32(48 + i * 8, a.right[i], true) }
  return b
}
if (typeof module != 'undefined') module.exports = { synth, wav }
