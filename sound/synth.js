// The synthesiser. Turns a recording (sound/record.js) into stereo audio. Nothing here is a recording
// of a fungus: it is a set of stated mappings. There are four ways of listening, and a free mix.
//
//   faster      As it is, faster. The electrode voltages played as sound waves and every growth event as
//               the same plain click, placed left to right where it happened. Only the speed is chosen.
//   instrument  The fungus plays itself. The network is a web of taut strings (sound/resonator.js); its own
//               growth strikes it, its electrical spikes bow it, and each mushroom that matures sounds as
//               a small drum sized to its cap. No speed-up on pitch.
//   data        Data you can read by ear. One steady voice per individual: its pitch is how many growing
//               tips it has, its loudness is how fast the colony is feeding, its brightness is the
//               temperature. A fight is a dissonant pair of notes, a mushroom a bell, rain a hiss.
//   music       Music. Events are snapped to sixteenth notes and a five-note scale; depth picks the note,
//               flow drives the kick drum, abandoned hyphae are the hi-hat, the season moves the key.
//   mix         The original layers, each with its own gain: voices, events, body drone and ring.
//
// A recording has two clocks (growth time and electrical time). They are sped up by different amounts
// and both are reported with the audio.
var synth = (rec, map) => {
  const way = (map && map.way) || 'mix'
  const preset = { faster: { voices: 1, events: 1, plain: 1, body: 0, ring: 0 }, instrument: { voices: 0, events: 0, body: 0, ring: 1.2, strike: 1, caps: 1 },
    data: { voices: 0, events: 0, body: 0, ring: 0, data: 1 }, music: { voices: 0, events: 0, body: 0, ring: 0, music: 1 }, mix: {} }[way]
  const m = Object.assign({ rate: 48000, pitch: 180, seconds: 0, voices: 1, events: 1, body: .6, ring: 1, ringTime: .35, ringSize: 1, plain: 0, strike: 0, caps: 0, data: 0, music: 0, tempo: 96 }, map, preset)
  const modesOf = typeof modes != 'undefined' ? modes : require('./resonator.js')
  const sr = m.rate, V = rec.volts, n = V[0].length, spikeS = rec.meta.spike_interval_minutes * 60, E = rec.events, T = rec.taps, W = rec.meta.size[0], DZ = rec.meta.size[1]
  // speed-up of the electrical clock that puts the species' spike rate at the chosen pitch
  const eSpeed = m.speed || m.pitch * spikeS, step = eSpeed / (rec.meta.electrical_sample_seconds * sr) // electrical samples per audio sample
  const len = Math.max(1, Math.floor(m.seconds ? m.seconds * sr : n / step)), L = new Float32Array(len), R = new Float32Array(len)
  const dur = len / sr, gSpeed = rec.meta.growth_seconds / dur // growth seconds per second of audio
  const col = k => rec.meta.tap_names.indexOf(k), tap = (c, i) => { const x = i / len * (T.length - 1), k = x | 0, f = x - k; return T[k][c] + (T[Math.min(T.length - 1, k + 1)][c] - T[k][c]) * f }
  const range = c => { let lo = 1e30, hi = -1e30; for (const r of T) { lo = Math.min(lo, r[c]); hi = Math.max(hi, r[c]) } return [lo, hi - lo || 1] }
  const at = t => t / gSpeed * sr | 0, panOf = x => Math.min(1, Math.max(0, x / W))
  let seed = 12345; const rnd = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296
  // a short enveloped sound added at sample `a`: freq 0 means noise
  const note = (a, freq, secs, vol, pan, attack = 96, curve = 5) => {
    const dn = Math.min(len - a, secs * sr | 0); if (a < 0 || dn <= 0) return
    const gl = Math.cos(pan * 1.5708) * vol, gr = Math.sin(pan * 1.5708) * vol, w = 6.2832 * freq / sr
    for (let i = 0; i < dn; i++) { const s = (freq ? Math.sin(w * i) : rnd() * 2 - 1) * Math.min(1, i / attack) * Math.exp(-curve * i / dn); L[a + i] += s * gl; R[a + i] += s * gr }
  }
  const says = []
  let ringLow = []

  // ---- voices: electrode voltages as sound waves
  if (m.voices) {
    V.forEach((v, k) => {
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
    says.push(`Electrical activity is sped up ${fmt(eSpeed)} times, which puts one spike every ${rec.meta.spike_interval_minutes} minutes at ${(eSpeed / spikeS).toFixed(0)} Hz.`)
  }

  // ---- events: each growth event a short sound (or, in the plain form, the same click for all)
  if (m.events) {
    // type: [base frequency Hz, length s, loudness, noise or tone]
    const KIND = { 0: [1500, .035, .10, 0], 1: [520, .11, .16, 0], 2: [240, .09, .05, 0], 3: [0, .12, .035, 1], 4: [660, .25, .12, 0], 5: [200, .2, .06, 0], 6: [330, .7, .22, 0],
      7: [95, .3, .16, 0], 8: [130, .3, .18, 0], 10: [0, 1.6, .16, 1], 11: [0, .5, .05, 1], 12: [0, .22, .05, 1], 13: [880, 1, .2, 0] }
    for (let j = 0; j < E.t.length; j++) {
      const kd = KIND[E.type[j]]; if (!kd) continue
      if (m.plain) note(at(E.t[j]), 0, .004, m.events * .12, panOf(E.x[j]), 8, 3)
      else note(at(E.t[j]), kd[3] ? 0 : kd[0] * (1.6 - 1.1 * Math.min(1, E.z[j] / DZ)), kd[1], m.events * kd[2], panOf(E.x[j])) // shallow is higher, deep is lower
    }
  }

  // ---- body: a drone that follows flow and tip count
  if (m.body && T.length > 1) {
    const fi = col('flow'), ti = col('ntips'), fr = range(fi), tr = range(ti)
    let ph = 0, a = 0, b = 0
    for (let i = 0; i < len; i++) {
      a += .0005 * (tap(fi, i) / (fr[0] + fr[1]) - a); b += .0005 * (tap(ti, i) / (tr[0] + tr[1]) - b); ph += 6.2832 * 55 / sr
      const s = m.body * .16 * a * (Math.sin(ph) + .5 * Math.sin(ph * 1.5) + b * .5 * Math.sin(ph * 3) + b * .25 * Math.sin(ph * 5))
      L[i] += s; R[i] += s
    }
  }

  // ---- ring: the network as a resonator, one bank of modes per snapshot, struck by what happens in its stretch of time
  if (m.ring && rec.shots && rec.shots.length) {
    const LOUD = { 0: .5, 1: 1, 2: .3, 3: .25, 4: .7, 5: .4, 6: 1.2, 7: 1, 8: 1, 13: 1.2 }, tail = Math.min(len, 6 * m.ringTime * sr | 0), el = rec.meta.electrodes, tmp = new Float32Array(len)
    // every strike: [audio sample, x, y, z, loudness]
    const strikes = []
    for (let j = 0; j < E.t.length; j++) LOUD[E.type[j]] && strikes.push([at(E.t[j]), E.x[j], E.y[j], E.z[j], LOUD[E.type[j]]])
    if (m.strike) V.forEach((v, e) => { // each electrical spike at an electrode bows the web there
      let mean = 0; for (let i = 0; i < n; i++) mean += v[i]; mean /= n
      for (let i = 1; i < n; i++) v[i - 1] < mean && v[i] >= mean && i / step < len && strikes.push([i / step | 0, el[e][0], el[e][1], el[e][2], .06])
    })
    strikes.sort((a, b) => a[0] - b[0])
    rec.shots.forEach((shot, si) => {
      const from = si ? at(shot.t) : 0, to = si + 1 < rec.shots.length ? at(rec.shots[si + 1].t) : len, N = shot.x.length
      if (N < 3) return
      const md = modesOf(shot), nearest = (x, y, z) => { let b = 0, bd = 1e30; for (let i = 0; i < N; i++) { const d = (shot.x[i] - x) ** 2 + (shot.y[i] - y) ** 2 + (shot.z[i] - z) ** 2; d < bd && (bd = d, b = i) } return b }
      const hits = strikes.filter(s => s[0] >= from && s[0] < to).map(s => [s[0], nearest(s[1], s[2], s[3]), s[4]])
      if (!hits.length) return
      const a0 = Math.max(0, hits[0][0]), a1 = Math.min(len, hits[hits.length - 1][0] + tail), pick = el.map(p => nearest(p[0], p[1], p[2]))
      md.hz[0] && ringLow.push(md.hz[0] * m.ringSize)
      md.hz.forEach((hz, k) => {
        const f = hz * m.ringSize; if (f < 25 || f > sr * .42) return
        const w = 6.2832 * f / sr, r = Math.exp(-1 / (m.ringTime / (1 + f / 2500) * sr)), c1 = 2 * r * Math.cos(w), c2 = r * r, sh = md.shape[k]
        let gl = 0, gr = 0; pick.forEach((p, e) => { const pan = el.length > 1 ? e / (el.length - 1) : .5; gl += Math.cos(pan * 1.5708) * sh[p]; gr += Math.sin(pan * 1.5708) * sh[p] })
        if (Math.abs(gl) + Math.abs(gr) < 1e-4) return
        tmp.fill(0, a0, a1)
        for (const h of hits) tmp[h[0]] += h[2] * sh[h[1]] * Math.sin(w)
        const g = m.ring * .12
        for (let i = a0, y1 = 0, y2 = 0; i < a1; i++) { const y = c1 * y1 - c2 * y2 + tmp[i]; y2 = y1; y1 = y; L[i] += y * gl * g; R[i] += y * gr * g }
      })
    })
    ringLow.length && says.push(`As a web of taut strings${m.ringSize == 1 ? ' at its real size' : ' at ' + (1 / m.ringSize).toFixed(1) + ' times its real size'}, the network's lowest note goes from ${ringLow[0].toFixed(0)} Hz to ${ringLow[ringLow.length - 1].toFixed(0)} Hz as it grows. Real hyphae are too damped to ring; the ${m.ringTime} second ring is a choice.` +
      (m.strike ? ' Electrical spikes at the electrodes also bow the web.' : ''))
  }
  // ---- caps: each mushroom that matures sounds as a drum, pitched by the size of its cap (about 90 Hz for a 6 cm cap)
  if (m.caps) {
    const f0 = 90 * 6 / rec.meta.cap_cm; let count = 0
    for (let j = 0; j < E.t.length; j++) if (E.type[j] == 6) { count++; [1, 1.59, 2.14, 2.3, 2.65, 2.92].forEach((p, k) => note(at(E.t[j]), f0 * p, .5 / (1 + k * .4), .3 / (1 + k), panOf(E.x[j]), 24, 6)) }
    count && says.push(`${count} mushroom${count > 1 ? 's' : ''} matured; each sounds as a drum at ${f0.toFixed(0)} Hz, the estimate for a soft cap ${rec.meta.cap_cm} cm across.`)
  }

  // ---- data: one voice per individual, read by ear
  if (m.data && T.length > 1) {
    const two = range(col('tips1'))[0] + range(col('tips1'))[1] > 0, ui = col('up'), ur = range(ui), ci = col('tsurf'), cr = range(ci)
    ;[['tips0', two ? .25 : .5, 110], ['tips1', .75, 165]].forEach(([name, pan, base], v) => {
      if (v && !two) return
      const c = col(name), tr = range(c), lg = x => Math.log(1 + Math.max(0, x)), lo = lg(tr[0]), span = lg(tr[0] + tr[1]) - lo || 1
      let ph = 0, f = base, a = 0, gl = Math.cos(pan * 1.5708), gr = Math.sin(pan * 1.5708)
      for (let i = 0; i < len; i++) {
        const tips = tap(c, i), want = base * Math.pow(2, 3 * (lg(tips) - lo) / span), bright = (tap(ci, i) - cr[0]) / cr[1]
        f += .002 * (want - f); a += .001 * ((tips > 0 ? .25 + .75 * Math.sqrt(Math.max(0, tap(ui, i)) / (ur[0] + ur[1])) : 0) - a); ph += 6.2832 * f / sr
        const s = m.data * .3 * a * (Math.sin(ph) + bright * .5 * Math.sin(2 * ph) + bright * .3 * Math.sin(3 * ph))
        L[i] += s * gl; R[i] += s * gr
      }
    })
    for (let j = 0; j < E.t.length; j++) {
      const t = E.type[j], a = at(E.t[j]), pan = panOf(E.x[j])
      if (t == 7 || t == 8) { note(a, 466, .3, m.data * .12, pan); note(a, 494, .3, m.data * .12, pan) } // rivals meet: two notes a semitone apart
      else if (t == 6) { note(a, 1320, 1.2, m.data * .2, pan); note(a, 1980, .8, m.data * .08, pan) }    // a mushroom matures: bell
      else if (t == 10) note(a, 0, 1.2, m.data * .1, .5)                                                  // rain
      else if (t == 13) note(a, 880, .8, m.data * .15, pan)                                               // a spore founds an individual
    }
    says.push(`Each steady voice is one individual${two ? ' (the first on the left, the second on the right and a fifth higher)' : ''}: three octaves of pitch cover its fewest to its most growing tips, loudness is how fast the colony is feeding, and brightness is temperature (${cr[0].toFixed(0)} to ${(cr[0] + cr[1]).toFixed(0)} °C). ` +
      `Two notes a semitone apart mark rivals meeting, a bell a mature mushroom, a hiss rain.`)
  }

  // ---- music: events snapped to a pulse and a scale
  if (m.music) {
    const slot = 60 / m.tempo / 4, slots = Math.floor(dur / slot), SC = [0, 3, 5, 7, 10], ROOTS = [45, 48, 50, 52], hz = k => 440 * Math.pow(2, (k - 69) / 12)
    const ci = col('tsurf'), cr = range(ci), fi = col('flow'), bins = Array.from({ length: slots }, () => ({ n: 0, z: 0, x: 0, fuse: 0, drop: 0, fruit: 0, rain: 0 }))
    for (let j = 0; j < E.t.length; j++) {
      const b = bins[Math.min(slots - 1, E.t[j] / gSpeed / slot | 0)], t = E.type[j]; if (!b) continue
      if (t == 0 || t == 1) { b.n++; b.z += E.z[j]; b.x += E.x[j]; t == 1 && b.fuse++ } else if (t == 2 || t == 3) b.drop++; else if (t == 6) b.fruit++; else if (t == 10) b.rain++
    }
    let prevFlow = 0
    for (let s = 0; s < slots; s++) {
      const a = s * slot * sr | 0, b = bins[s], bar = s >> 4, mid = Math.min(len - 1, (bar * 16 + 8) * slot * sr | 0)
      // the key follows temperature where there is weather, otherwise how far through the run we are
      const root = ROOTS[Math.min(3, (cr[1] > 1 ? (tap(ci, mid) - cr[0]) / cr[1] : bar * 16 / slots) * 4 | 0)]
      if (s % 16 == 0) { note(a, hz(root - 12), slot * 15, m.music * .2, .5, 2000, 2); note(a, hz(root - 5), slot * 15, m.music * .08, .5, 2000, 2) } // bass holds the bar
      if (b.n) { // melody: mean depth picks the note, shallow high; several events at once are louder; a fusion drops an octave
        const d = 1 - Math.min(1, b.z / b.n / DZ * 3), k = Math.round(d * 9), pitch = root + 12 + 12 * (k / 5 | 0) + SC[k % 5] - (b.fuse ? 12 : 0)
        note(a, hz(pitch), b.fuse ? .5 : .28, m.music * Math.min(.3, .1 + .05 * Math.log(1 + b.n)), panOf(b.x / b.n), 48, 5)
        note(a, hz(pitch) * 2, .12, m.music * .04, panOf(b.x / b.n), 48, 6)
      }
      if (s % 4 == 0) { const f = tap(fi, Math.min(len - 1, a)); if (s % 16 == 0 || f > prevFlow) { const dn = Math.min(len - a, .22 * sr | 0); for (let i = 0; i < dn; i++) { const e = Math.exp(-7 * i / dn), v = Math.sin(6.2832 * (48 * i / sr + 50 * (1 - Math.exp(-i / 900)) * .012)) * e * m.music * .5; L[a + i] += v; R[a + i] += v } } prevFlow = f } // kick: every bar, and any beat on which flow is rising
      if (b.drop) note(a, 0, .04, m.music * Math.min(.1, .03 * b.drop), .65, 8, 6) // hi-hat: hyphae stopping or being abandoned
      if (b.fruit) [0, 7, 12].forEach((iv, k) => note(a + k * slot * sr / 2 | 0, hz(root + 24 + iv), 1.2, m.music * .16, .5)) // a mushroom: three rising notes
      if (b.rain) note(a, 0, slot * 8, m.music * .1, .5, 4000, 3)
    }
    says.push(`Events are snapped to sixteenth notes at ${m.tempo} beats per minute. Branches and fusions play a five-note minor scale, higher for shallower; the kick sounds each bar and on beats where flow is rising; the hi-hat is hyphae stopping or being abandoned; ` +
      (cr[1] > 1 ? 'the key moves with temperature.' : 'the key rises through the run.') + ' This is the furthest from the model.')
  }

  // ---- level: bring the peak to -3 dB
  let peak = 1e-9; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
  const gain = .708 / peak; for (let i = 0; i < len; i++) { L[i] *= gain; R[i] *= gain }
  says.push(`Growth is sped up ${fmt(gSpeed)} times: ${(rec.meta.growth_seconds / 86400).toFixed(1)} days in ${dur.toFixed(1)} seconds.`)
  return { left: L, right: R, rate: sr, seconds: dur, info: { way, electrical_speed_up: m.voices || m.strike ? eSpeed : null, growth_speed_up: gSpeed, pitch_hz: eSpeed / spikeS, ring_lowest_hz: ringLow, says: says.join(' ') } }
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
