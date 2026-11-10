// The synthesiser: physical models only. Every sound is a body that can vibrate, set moving by a force
// that the simulation says acted on it, and heard through two microphones. Nothing is assigned a sound.
//
// Bodies
//   web    the network as a web of taut strings (sound/resonator.js): its modes come from its real size,
//          shape and cord thickness, and change as it grows.
//   caps   each fruiting body's cap as a small plate on a stem. Its lowest note is about 90 Hz at 3 cm
//          radius (docs/research/07) and rises as 1/radius, so a cap's note falls while it expands.
//
// Forces (all from the recording)
//   growth      on the web: a hypha breaking out as a branch, two walls dissolving in a fusion, a piece
//               losing its turgor when abandoned or killed. Each is one hypha's turgor force
//               (pressure x cross-section, about 10 micronewtons) acting for a millisecond.
//               on a cap: the same small yields, at random, for as long as the cap is expanding.
//   electrical  on the web: each spike at an electrode taken as a brief change of turgor there (1% by
//               default). No such pressure pulse has been measured; this one is an assumption.
//   spores      on a cap: about 30,000 spores a second leave a mature cap at about 1 m/s. Each launch
//               pushes back on the cap with the spore's momentum.
//   rain        on caps and on the ground: 4 mm drops at 9 m/s, 5 mm of rain in an hour. A drop on the
//               ground reaches the hyphae below it, weakened with depth.
//
// Time. A strike rings at its real pitch for its real length. Only the schedule is compressed: days of
// growth play in seconds (one time-lapse factor for everything, electrical activity included).
//
// Loudness. The forces differ by many orders of magnitude (a raindrop against a spore). Each force on
// each body is rendered separately, brought to an audible level, and mixed; the true differences are
// reported in decibels with the sound. Within one force on one body, relative loudness is the model's.
//
// What is not physical: real hyphae and caps are too damped to ring (the ring time is a stated
// choice), and nothing radiates into real soil or air: the microphones hear the bodies directly.
var synth = (rec, map) => {
  const m = Object.assign({ rate: 48000, seconds: 16, ringTime: .35, ringSize: 1, growth: 1, electrical: 1, spores: 1, rain: 1, balance: .5, spikePressure: .01 }, map)
  const modesOf = typeof modes != 'undefined' ? modes : require('./resonator.js')
  const sr = m.rate, len = Math.max(1, m.seconds * sr | 0), E = rec.events, V = rec.volts, W = rec.meta.size[0], gSpeed = rec.meta.growth_seconds / m.seconds, at = t => t / gSpeed * sr | 0
  let seed = 12345; const rnd = () => (seed = seed * 1664525 + 1013904223 >>> 0) / 4294967296
  // the six sounds that can exist: [force][body] -> stereo bus
  const NAMES = ['growth', 'electrical', 'spores', 'rain'], bus = {}, B = (f, b) => bus[f + b] || (bus[f + b] = { f, b, L: new Float32Array(len), R: new Float32Array(len) })
  // two microphones at the surface, a fifth of the way in from each side. A moving point is heard at 1/(1 + distance/reach).
  const MIC = [[W * .2, W / 2, 0], [W * .8, W / 2, 0]], reach = W / 10, hear = (x, y, z, k) => 1 / (1 + Math.hypot(x - MIC[k][0], y - MIC[k][1], z - MIC[k][2]) / reach)
  const info = { time_lapse: gSpeed, lowest_note_hz: [], sources: [], caps: 0 }

  // ---------- the web ----------
  const shots = rec.shots || [], J0 = 5e5 * Math.PI * 2.5e-6 * 2.5e-6 * 1e-3 // one hypha's turgor force for a millisecond, N s
  const strikes = [] // [audio sample, x, y, z, impulse N s, force index]
  const IMP = { 0: 1, 1: 2, 3: 1, 7: 1, 8: 1 }
  for (let j = 0; j < E.t.length; j++) IMP[E.type[j]] && strikes.push([at(E.t[j]), E.x[j], E.y[j], E.z[j], IMP[E.type[j]] * J0, 0])
  // electrical spikes: found in each electrode's recorded stretch for a growth step, then repeated to fill that step's real length
  {
    const per = rec.meta.electrical_samples / rec.meta.steps | 0, tdt = rec.meta.electrical_sample_seconds, stepS = rec.meta.step_seconds, el = rec.meta.electrodes
    const window = per * tdt, rate = 1 / (rec.meta.spike_interval_minutes * 60) * gSpeed
    if (rate < sr / 6) V.forEach((v, e) => {
      let mean = 0; for (let i = 0; i < v.length; i++) mean += v[i]; mean /= v.length
      for (let s = 0; s < rec.meta.steps; s++) for (let i = s * per + 1; i < (s + 1) * per; i++) if (v[i - 1] < mean && v[i] >= mean)
        for (let rep = 0, tau = (i - s * per) * tdt; tau + rep * window < stepS; rep++) strikes.push([at(s * stepS + tau + rep * window), el[e][0], el[e][1], el[e][2], m.spikePressure * J0, 1])
    })
    else info.note = `Electrical spikes are left out: at this time-lapse they would come ${fmt(rate)} times a second, too fast to place.`
  }
  // rain on the ground: drops over the whole plot for an hour, each reaching the nearest hypha beneath it, weakened by depth (5 mm scale)
  const rains = []; for (let j = 0; j < E.t.length; j++) E.type[j] == 10 && rains.push(E.t[j])
  const DROP = 3.4e-5 * 9, DROPS = 41 // a 4 mm drop (34 mg) at 9 m/s, in N s; drops per square metre per second in 5 mm/h rain
  for (const tr of rains) {
    const all = DROPS * (W * 1e-6) * (W * 1e-6) * 3600, n = Math.min(4000, Math.round(all)), scale = Math.sqrt(all / Math.max(1, n))
    for (let d = 0; d < n; d++) strikes.push([at(tr + rnd() * 3600), rnd() * W, rnd() * W, -1, DROP * scale, 3])
  }
  strikes.sort((a, b) => a[0] - b[0])
  if (shots.length) {
    const tail = Math.min(len, 6 * m.ringTime * sr | 0), tmp = new Float32Array(len)
    shots.forEach((shot, si) => {
      const from = si ? at(shot.t) : 0, to = si + 1 < shots.length ? at(shots[si + 1].t) : len, N = shot.x.length
      if (N < 3) return
      const md = modesOf(shot)
      const nearest = (x, y, z) => { let b = 0, bd = 1e30; for (let i = 0; i < N; i++) { const d = (shot.x[i] - x) ** 2 + (shot.y[i] - y) ** 2 + (z < 0 ? 0 : (shot.z[i] - z) ** 2); d < bd && (bd = d, b = i) } return b }
      const hits = [[], [], [], []]
      for (const s of strikes) if (s[0] >= from && s[0] < to && s[0] < len) { const node = nearest(s[1], s[2], s[3]); hits[s[5]].push(s[0], node, s[3] < 0 ? s[4] * Math.exp(-shot.z[node] / 5000) : s[4]) }
      md.hz[0] && info.lowest_note_hz.push(md.hz[0] * m.ringSize)
      const mic = [0, 1].map(k => shot.x.map((x, i) => hear(x, shot.y[i], shot.z[i], k) / N))
      md.hz.forEach((hz, k) => {
        const f = hz * m.ringSize; if (f < 25 || f > sr * .42) return
        const w = 6.2832 * f / sr, r = Math.exp(-1 / (m.ringTime / (1 + f / 2500) * sr)), c1 = 2 * r * Math.cos(w), c2 = r * r, sh = md.shape[k], mass = md.mass[k]
        let gl = 0, gr = 0; for (let i = 0; i < N; i++) { gl += sh[i] * mic[0][i]; gr += sh[i] * mic[1][i] }
        hits.forEach((h, fi) => {
          if (!h.length) return
          const a0 = Math.max(0, h[0]), a1 = Math.min(len, h[h.length - 3] + tail), o = B(NAMES[fi], 'web')
          tmp.fill(0, a0, a1)
          for (let q = 0; q < h.length; q += 3) tmp[h[q]] += h[q + 2] * sh[h[q + 1]] / mass * Math.sin(w) // metres per second set going by this strike
          for (let i = a0, y1 = 0, y2 = 0; i < a1; i++) { const y = c1 * y1 - c2 * y2 + tmp[i]; y2 = y1; y1 = y; o.L[i] += y * gl; o.R[i] += y * gr }
        })
      })
    })
  }

  // ---------- the caps ----------
  // each fruiting body: when it started, when it matured, when it ended, and where
  const caps = []
  for (let j = 0; j < E.t.length; j++) if (E.type[j] == 4) caps.push({ x: E.x[j], y: E.y[j], t0: E.t[j], tm: Infinity, t1: rec.meta.growth_seconds })
  for (let j = 0; j < E.t.length; j++) { const t = E.type[j]; if (t != 6 && t != 5 && t != 11) continue; const c = caps.find(c => c.x == E.x[j] && c.y == E.y[j] && c.t0 <= E.t[j] && c.t1 >= E.t[j]); c && (t == 6 ? c.tm = E.t[j] : c.t1 = E.t[j]) }
  const RF = rec.meta.cap_cm / 200, PART = [1, 1.73, 2.33, 3.91, 4.11] // final cap radius in metres; the first modes of a free round plate
  const YIELDS = 1000, SPORES = 3e4, SPORE = 2.6e-13 // small yields per second while a cap expands (assumed); spores per second and each one's momentum, N s
  for (const c of caps) {
    const a0 = Math.max(0, at(c.t0)), a1 = Math.min(len, at(c.t1)); if (a1 - a0 < 64) continue
    info.caps++
    const n = a1 - a0, grow = new Float32Array(n), spore = new Float32Array(n), rain = new Float32Array(n), span = c.tm < Infinity ? c.tm - c.t0 : 4.5 * 86400
    const size = i => { const u = ((a0 + i) / sr * gSpeed - c.t0) / span; return RF * (.15 + .85 * (u < 0 ? 0 : u > 1 ? 1 : u) * (c.tm < Infinity || u < .6 ? 1 : .6 / u)) } // radius now, metres
    const tm = c.tm < Infinity ? at(c.tm) - a0 : n, gs = J0 * Math.sqrt(YIELDS * gSpeed / sr), ss = SPORE * Math.sqrt(SPORES * gSpeed / sr)
    for (let i = 0; i < n; i++) { const z = (rnd() + rnd() + rnd() - 1.5) * 2; i < tm ? grow[i] = z * gs : spore[i] = z * ss } // random pushes: yields while expanding, spore launches once mature
    for (const tr of rains) { const drops = Math.round(DROPS * Math.PI * RF * RF * 3600); for (let d = 0; d < drops; d++) { const i = at(tr + rnd() * 3600) - a0; i >= 0 && i < n && (rain[i] += DROP) } }
    const gl = hear(c.x, c.y, 0, 0), gr = hear(c.x, c.y, 0, 1)
    ;[['growth', grow], ['spores', spore], ['rain', rain]].forEach(([name, ex]) => {
      let any = false; for (let i = 0; i < n && !any; i += 7) any = ex[i] != 0; if (!any && name != 'rain') return
      if (name == 'rain' && !rains.length) return
      const o = B(name, 'caps')
      PART.forEach((p, k) => {
        let y1 = 0, y2 = 0, c1 = 0, c2 = 0, sw = 0, mass = 1
        for (let i = 0; i < n; i++) {
          if (i % 256 == 0) { // the cap has grown: retune it. A cap's thickness is a quarter of its radius; a quarter of its mass moves.
            const rad = size(i), f = 90 * .03 / rad * p * m.ringSize, w = 6.2832 * Math.min(f, sr * .42) / sr, r = Math.exp(-1 / (m.ringTime / (1 + k * .6) * sr))
            c1 = 2 * r * Math.cos(w); c2 = r * r; sw = Math.sin(w); mass = .25 * 700 * Math.PI * rad * rad * rad / 4
          }
          const y = c1 * y1 - c2 * y2 + ex[i] / mass * sw; y2 = y1; y1 = y
          o.L[a0 + i] += y * gl / (1 + k); o.R[a0 + i] += y * gr / (1 + k)
        }
      })
    })
  }

  // ---------- level and mix ----------
  const L = new Float32Array(len), R = new Float32Array(len), all = Object.values(bus)
  for (const o of all) { o.peak = 0; for (let i = 0; i < len; i++) o.peak = Math.max(o.peak, Math.abs(o.L[i]), Math.abs(o.R[i])) }
  const ref = Math.max(...all.map(o => o.peak), 1e-300)
  for (const o of all) {
    if (!(o.peak > 0)) continue
    const g = m[o.f] * (o.b == 'web' ? 1 - m.balance : m.balance) * 2 / o.peak
    info.sources.push({ force: o.f, body: o.b, peak_metres_per_second: o.peak, db_below_loudest: 20 * Math.log10(ref / o.peak) })
    for (let i = 0; i < len; i++) { L[i] += o.L[i] * g; R[i] += o.R[i] * g }
  }
  let peak = 1e-9; for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
  const gain = .708 / peak; for (let i = 0; i < len; i++) { L[i] *= gain; R[i] *= gain }
  info.sources.sort((a, b) => a.db_below_loudest - b.db_below_loudest)
  const low = info.lowest_note_hz
  info.says = `Time-lapse: ${(rec.meta.growth_seconds / 86400).toFixed(1)} days in ${m.seconds} seconds, ${fmt(gSpeed)} times faster than life. Each sound rings at its real pitch. ` +
    (low.length ? `The network's lowest note goes from ${low[0].toFixed(0)} Hz to ${low[low.length - 1].toFixed(0)} Hz as it grows${m.ringSize == 1 ? '' : ' (heard as if ' + (1 / m.ringSize).toFixed(1) + ' times its real size)'}. ` : '') +
    (info.caps ? `${info.caps} fruiting bod${info.caps > 1 ? 'ies' : 'y'} sounded. ` : 'No fruiting body formed. ') +
    (info.sources.length ? 'Heard, with how much quieter each really is than the loudest: ' + info.sources.map(s => `${s.force} on the ${s.body == 'web' ? 'network' : 'caps'} (${s.db_below_loudest < .5 ? 'loudest' : '−' + s.db_below_loudest.toFixed(0) + ' dB'})`).join(', ') + '. ' : 'Nothing acted on anything. ') +
    (info.note ? info.note + ' ' : '') + `Real hyphae and caps are too damped to ring; the ${m.ringTime} second ring is a choice.`
  return { left: L, right: R, rate: sr, seconds: m.seconds, info }
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
