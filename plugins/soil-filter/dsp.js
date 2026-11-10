// Soil Filter: sound heard through soil. Soil swallows sound, the high notes first, and more so the longer the
// path and the wetter the ground. The sound also arrives late, by the time it takes to travel. There are two
// listeners 10 cm apart, so a source off to one side reaches them at different times and with different
// dullness. Rain wets the ground from the top down. The listener can be the species' own network, shaken by
// what comes through the soil.
import { Bank } from '../kit/dsp.js'
export const create = sr => {
  const P = { depth: 10, wet: .3, side: 0, rain: 0, web: .25, mix: 1, level: 1 }, N = sr * .1 | 0, buf = new Float32Array(N), M = 16, bank = new Bank(M, sr)
  const ear = [0, 1].map(() => ({ a1: 0, a2: 0, a3: 0, cur: -1, gain: -1, cut: 1000, path: 10 }))
  let at = 0, cut = 1000, spec = null, weather = true, deep = true, fit = 1, front = 0, extra = 0, wetNow = .3, held = 0, lev = 1, scaleNote = '', tuned = -1
  let mono = new Float32Array(128), wl = new Float32Array(128), wr = new Float32Array(128)
  const tune = () => { // the full-grown network as the listener: its modes, heard by its two microphones; wet soil damps it
    if (!spec) return
    const st = spec.stages[spec.stages.length - 1]
    for (let i = 0; i < M; i++) {
      const hz = (st.hz[i] || 0) * fit, ring = .35 * (1 - .5 * wetNow) / (1 + hz / 1000), z = st.zone[i] || [], m = st.mic[i] || [0, 0], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9)
      let push = 0; for (let j = 0; j < 6; j++) push += Math.abs(z[j] || 0) // the sound arrives across the whole web
      bank.tune(i, hz, ring); bank.hear(i, m[0] / mm, m[1] / mm); bank.drive[i] = (push / 3 + .08) * Math.sqrt(1 - Math.exp(-1 / (Math.max(.001, ring) * sr))) * 30
    }
    tuned = wetNow
  }
  return {
    load(s) {
      spec = s && s.stages ? s : null; weather = !s || !s.has || s.has.weather !== false; deep = !s || !s.has || s.has.depth !== false
      fit = 1; let note = ''
      if (spec) { const f = spec.stages[spec.stages.length - 1].hz[0]; if (f > 0) { while (f * fit < 100) fit *= 2; while (f * fit > 1000) fit /= 2 } if (fit != 1) note = ` The listening network's real notes are out of hearing at this size: it is made ${fit > 1 ? fit + ' times smaller' : 1 / fit + ' times bigger'}.` }
      scaleNote = ((deep ? '' : 'This size has no depth, the colony is flat: the distance is taken sideways through the top layer of soil.') + (weather ? '' : ' No weather at this size: it does not rain.') + note).trim()
      bank.silence(); tune()
    },
    set(k, v) { P[k] = v },
    process(L, R, x) {
      const n = L.length, dt = n / sr; if (mono.length != n) { mono = new Float32Array(n); wl = new Float32Array(n); wr = new Float32Array(n) }
      // rain: a wet front moves down from the surface while it rains, and the soil above it is wetter; when the rain stops that water drains away
      const rain = weather ? P.rain : 0
      if (rain > 0) { front = Math.min(120, front + rain * 12 * dt); extra += (rain - extra) * Math.min(1, dt / .5) } else { extra -= extra * Math.min(1, dt / 6); if (extra < .002) { extra = 0; front = 0 } }
      const off = P.side * 25; let wsum = 0
      for (let e = 0; e < 2; e++) {
        const q = ear[e], path = Math.hypot(P.depth, off + (e ? -5 : 5)), wet = Math.min(1, P.wet + (1 - P.wet) * extra * Math.min(1, front / Math.max(1, P.depth))) // only the wetted part of the way down counts
        q.path = path; q.wet = wet; wsum += wet / 2
        q.cut = 12000 * Math.exp(-path / (14 * (1 - .65 * wet))) // every 14 cm of dry soil takes the top off; wet soil does it in less
        q.c = 1 - Math.exp(-6.2832 * Math.max(60, q.cut) / sr); q.g1 = Math.exp(-path / 60) * 2; q.len = Math.min(N - 2, path / 100 / 150 * sr) // about 150 m/s in loose soil
        if (q.cur < 0) { q.cur = q.len; q.gain = q.g1 }
        q.dg = (q.g1 - q.gain) / n
      }
      wetNow = wsum; cut = (ear[0].cut + ear[1].cut) / 2
      const web = spec ? P.web : 0
      if (web > 0 && Math.abs(wetNow - tuned) > .01) tune()
      const A = ear[0], B = ear[1]
      for (let i = 0; i < n; i++) {
        buf[at] = x ? x[i] : 0
        for (let e = 0; e < 2; e++) {
          const q = e ? B : A; if (q.cur != q.len) { const d = q.len - q.cur; q.cur += d > .25 ? .25 : d < -.25 ? -.25 : d } // the delay glides when the listener or the source moves
          const rp = at - q.cur + N, i0 = rp | 0, f = rp - i0, d = buf[i0 % N] * (1 - f) + buf[(i0 + 1) % N] * f
          q.a1 += q.c * (d - q.a1); q.a2 += q.c * (q.a1 - q.a2); q.a3 += q.c * (q.a2 - q.a3); q.gain += q.dg
          if (q.a3 < 1e-18 && q.a3 > -1e-18) q.a1 = q.a2 = q.a3 = 0
        }
        at = (at + 1) % N
        L[i] = A.a3 * A.gain; R[i] = B.a3 * B.gain; mono[i] = (L[i] + R[i]) * .5
      }
      let g0 = lev, dg = 0
      if (web > 0) {
        wl.fill(0); wr.fill(0); bank.process(wl, wr, mono)
        let pk = 0; for (let i = 0; i < n; i++) { const a = Math.abs(wl[i]), b = Math.abs(wr[i]); if (a > pk) pk = a; if (b > pk) pk = b }
        held = pk > held ? pk : held + (pk - held) * (dt / .5) // a mode that sits on a note of the sound is turned down while it is above full scale
        dg = ((held > 1 ? 1 / held : 1) - lev) / n
      }
      for (let i = 0; i < n; i++) {
        const s = x ? x[i] * (1 - P.mix) : 0; let a = L[i], b = R[i]
        if (web > 0) { g0 += dg; a = a * (1 - web) + wl[i] * g0 * web; b = b * (1 - web) + wr[i] * g0 * web }
        a = (s + a * P.mix) * P.level; b = (s + b * P.mix) * P.level; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b))
      }
      lev = g0
    },
    view() { return { cut, cutL: ear[0].cut, cutR: ear[1].cut, pathL: ear[0].path, pathR: ear[1].path, msL: ear[0].cur / sr * 1000, msR: ear[1].cur / sr * 1000, wetNow, front, raining: extra, fit, scaleNote } }
  }
}
