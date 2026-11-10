// Forest Floor: a colony growing live, heard as it grows. The 400K engine runs beside the sound. Every
// branch, fusion and abandoned hypha strikes the web of hyphae where it happened, with one hypha's turgor
// force; about once a second the web is retuned to the network as it now is, so its notes fall as it grows.
// Mushrooms that start to form ring as small plates while they expand. Rain strikes the web near the surface.
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
export const make = flowDrive => sr => {
  const M = 24, web = new Bank(M, sr), P = { speed: 2, ring: .5, size: .3, caps: .6, rain: 0, level: 1 }, rnd = rng(59), IMP = { 0: 1, 1: 2, 3: 1, 7: 1, 8: 1 }
  let spec = null, stage = null, caps = [], agc = 1, heard = 0, x = new Float32Array(128), taps = {}, strikes = 0
  const tune = () => {
    if (!stage) return
    for (let i = 0; i < M; i++) {
      const hz = (stage.hz[i] || 0) * P.size; web.tune(i, hz, P.ring / (1 + hz / 2500))
      const m = stage.mic[i] || [0, 0], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); web.hear(i, m[0] / mm, m[1] / mm)
      web.drive[i] = i < 4 ? .5 / (1 + i) : 0 // only the lowest modes answer the steady push of flow
    }
  }
  return {
    load(s) { spec = s; stage = s.stages[2]; caps = []; web.silence(); tune() }, // until the live network reports, an early stage of the prebuilt one
    set(k, v) { P[k] = v; if (k == 'ring' || k == 'size') tune() },
    live(m) {
      if (m.restarted) { caps = []; web.silence() }
      if (m.stage) { stage = m.stage; tune() }
      if (m.taps) taps = m.taps
      for (const [type, zone, pan] of m.events || []) {
        if (IMP[type] && stage) { for (let i = 0; i < M; i++) web.strike(i, IMP[type] * (stage.zone[i] ? stage.zone[i][zone] : 0) * .5); strikes++ }
        if (type == 4 && spec && caps.length < 10) { const b = new Bank(spec.cap.overtones.length, sr); caps.push({ bank: b, age: 0, pan, r: spec.cap.radius_cm }) } // a mushroom begins
        if (type == 10 && stage) for (let d = 0; d < 30; d++) web.strike(rnd() * M | 0, (rnd() - .5) * 4 * (stage.zone[0] ? 1 : 0)) // rain on the ground above
      }
    },
    process(L, R) {
      const n = L.length, dt = n / sr; if (x.length != n) x = new Float32Array(n)
      if (flowDrive) { const f = Math.min(1, Math.sqrt((taps.flow || 0) / 400)) * Math.min(1, (taps.cords || 0) / 200); for (let i = 0; i < n; i++) x[i] = (rnd() - .5) * f * .6 } // material moving through thick cords pushes on them
      const e = web.process(L, R, flowDrive ? x : undefined)
      for (let c = caps.length; c--;) { // a cap expanding: small yields at random, its note falling as it grows
        const cap = caps[c], grown = Math.min(1, cap.age / 20), r = cap.r * (.15 + .85 * grown); cap.age += dt
        spec.cap.overtones.forEach((o, k) => { cap.bank.tune(k, 90 * 3 / r * o * P.size, .2 / (1 + k * .5)); cap.bank.hear(k, Math.cos(cap.pan * TAU / 4) / (1 + k), Math.sin(cap.pan * TAU / 4) / (1 + k)) })
        if (grown < 1 && rnd() < 40 * dt) for (let k = 0; k < spec.cap.overtones.length; k++) cap.bank.strike(k, (rnd() - .5) * P.caps)
        cap.bank.process(L, R); if (cap.age > 26) caps.splice(c, 1)
      }
      // the network gets heavier as it grows, so each strike moves it less: the listening level follows, slowly
      let pk = 1e-6; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]))
      heard += (pk - heard) * (pk > heard ? .2 : .002); agc += (clamp(.25 / Math.max(heard, 1e-4), .2, 60) - agc) * .01
      soften(L, R, P.level * agc)
    },
    view() { return { strikes, caps: caps.length, gain: agc } }
  }
}
export const create = make(false)
