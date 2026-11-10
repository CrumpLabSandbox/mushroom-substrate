// Forest Floor: a colony growing live, heard as it grows. The 400K engine runs beside the sound. Every
// branch, fusion and abandoned hypha strikes the web of hyphae where it happened, with one hypha's turgor
// force; about once a second the web is retuned to the network as it now is, so its notes fall as it grows.
// Mushrooms that start to form ring as small plates while they expand. Rain strikes the web near the surface.
// Between the strikes, every growing tip pushes forward in small pulses: together a faint steady push at the
// edge of the web that grows with the number of tips. Rain leaves the ground wet for a while, and wet ground
// deadens the web. A key taps the web yourself, from the centre (low keys) to the edge (high keys).
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
export const make = flowDrive => sr => {
  const M = 24, YM = 8, web = new Bank(M, sr), young = new Bank(YM, sr), P = { speed: 2, ring: .5, size: .3, caps: .6, tips: .2, rain: 0, level: 1 }, rnd = rng(59), IMP = { 0: 1, 1: 2, 3: 1, 7: 1, 8: 1 }
  const edge = new Float32Array(M), low = new Float32Array(M)
  let spec = null, stage = null, caps = [], agc = 1, heard = 0, x = new Float32Array(128), taps = {}, strikes = 0, fit = 1, wet = 0, wetTuned = 0, tipPush = 0, flowPush = 0, founded = 0, shed = 0, note = '', ringing = 0
  const has = k => !spec || !spec.has || spec.has[k] !== false
  const tune = () => {
    if (!stage) return
    const lo = stage.hz[0] || 0 // a network too small or too large to hear at its real size is moved into hearing by whole octaves
    if (lo > 0) { while (lo * fit < 120 && fit < 1e5) fit *= 2; while (lo * fit > 12000 && fit > 1e-5) fit /= 2 }
    let em = 1e-9; for (let i = 0; i < M; i++) em = Math.max(em, Math.abs(stage.zone[i] ? stage.zone[i][5] : 0))
    for (let i = 0; i < M; i++) {
      const hz = (stage.hz[i] || 0) * P.size * fit; web.tune(i, hz, P.ring * (1 - .5 * wet) / (1 + hz / 2500))
      const m = stage.mic[i] || [0, 0], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); web.hear(i, m[0] / mm, m[1] / mm)
      edge[i] = Math.abs(stage.zone[i] ? stage.zone[i][5] : 0) / em // how much each mode moves at the growing edge
      low[i] = i < 4 ? .5 / (1 + i) : 0 // only the lowest modes answer the steady push of flow
    }
    wetTuned = wet
    note = [fit == 1 ? '' : `The network at this size is too ${fit > 1 ? 'large and low' : 'small and high'} to hear as it is: every note of the web is ${fit > 1 ? 'raised ' + fit : 'lowered ' + 1 / fit} times.`,
      flowDrive && !has('flow') ? 'No flow at this size: the low tone follows the number of growing tips.' : '', has('fruit') ? '' : 'No mushrooms form at this size.', has('weather') ? '' : 'No weather at this size: no rain falls.'].filter(Boolean).join(' ')
  }
  const strike = (zone, amt) => { if (stage) { for (let i = 0; i < M; i++) web.strike(i, amt * (stage.zone[i] ? stage.zone[i][zone] : 0) * .5); strikes++ } }
  const newCap = (pan, age) => { const c = { bank: new Bank(spec.cap.overtones.length, sr), age, pan, r: spec.cap.radius_cm, tuned: -1 }; caps.push(c); return c }
  return {
    load(s) { spec = s; stage = s.stages[Math.min(2, s.stages.length - 1)]; caps = []; fit = 1; web.silence(); young.silence(); tune() }, // until the live network reports, an early stage of the prebuilt one
    set(k, v) { P[k] = v; if (k == 'ring' || k == 'size') tune() },
    noteOn(key, vel) { strike(clamp((key - 48) / 25 * 6 | 0, 0, 5), 1 + 2 * vel) }, // a tap on the web: low keys at the centre, high keys at the edge
    noteOff() {},
    live(m) {
      if (m.restarted) { caps = []; web.silence(); fit = 1 }
      if (m.stage) { stage = m.stage; tune() }
      if (m.taps) taps = m.taps
      for (const [type, zone, pan] of m.events || []) {
        if (IMP[type]) strike(zone, IMP[type])
        if (type == 4 && spec && has('fruit') && caps.length < 10) newCap(pan, 0) // a mushroom begins
        if (type == 10 && stage) { // rain on the ground above, and on any mushrooms; the ground stays wet for a while
          for (let d = 0; d < 30; d++) web.strike(rnd() * M | 0, (rnd() - .5) * 4 * (stage.zone[0] ? 1 : 0))
          for (const c of caps) for (let k = 0; k < c.bank.n; k++) c.bank.strike(k, (rnd() - .5) * P.caps * 2)
          wet = 1
        }
        if (type == 12 && spec) { // spores leaving a mushroom (the 4M simulator): their push back shakes the cap they leave
          let c = null; for (const o of caps) if (!c || Math.abs(o.pan - pan) < Math.abs(c.pan - pan)) c = o
          if (!c || (Math.abs(c.pan - pan) > .15 && caps.length < 10)) c = newCap(pan, 20)
          c.age = Math.min(c.age, 23); c.shed = .4; shed++
        }
        if (type == 13 && spec) { // a spore has founded a new individual: a web as small as the youngest one, struck once as it starts
          const y = spec.stages[0]; let f = 1; const lo = y.hz[0] || 0; if (lo > 0) { while (lo * f < 120 && f < 1e5) f *= 2; while (lo * f > 12000 && f > 1e-5) f /= 2 }
          for (let i = 0; i < YM; i++) { const hz = (y.hz[i] || 0) * P.size * f; young.tune(i, hz, P.ring * .5 / (1 + hz / 2500)); young.hear(i, Math.cos(pan * TAU / 4) * .6, Math.sin(pan * TAU / 4) * .6); young.strike(i, (y.zone[i] ? y.zone[i][0] : 0) * .8) }
          founded++; ringing = P.ring * 4 + .5
        }
      }
    },
    process(L, R) {
      const n = L.length, dt = n / sr; if (x.length != n) x = new Float32Array(n)
      if (wet > .001) { wet *= Math.exp(-dt / 8); if (Math.abs(wet - wetTuned) > .04 || wet <= .001) { if (wet <= .001) wet = 0; tune() } }
      // two steady pushes: every growing tip advances in small pulses, a push at the edge that adds up as the square root of their number;
      // and, in Foraging, material moving through thick cords pushes on them
      const tips = taps.tips || 0
      tipPush = P.tips * Math.sqrt(Math.min(tips, 20000) / 400) * .04
      flowPush = !flowDrive ? 0 : (has('flow') ? Math.min(1, Math.sqrt((taps.flow || 0) / 400)) * (has('cords') ? Math.min(1, (taps.cords || 0) / 200) : 1) : Math.min(1, Math.sqrt(tips / 400))) * .6
      const drive = tipPush > 0 || flowPush > 0
      if (drive) { for (let i = 0; i < M; i++) web.drive[i] = Math.sqrt(tipPush * tipPush * edge[i] * edge[i] + flowPush * flowPush * low[i] * low[i]); for (let i = 0; i < n; i++) x[i] = rnd() - .5 }
      web.process(L, R, drive ? x : undefined)
      if (ringing > 0) { ringing -= dt; young.process(L, R) }
      for (let c = caps.length; c--;) { // a cap expanding: small yields at random, its note falling as it grows
        const cap = caps[c], grown = Math.min(1, cap.age / 20), r = cap.r * (.15 + .85 * grown), nk = cap.bank.n; cap.age += dt
        if (grown != cap.tuned) { cap.tuned = grown; for (let k = 0; k < nk; k++) { cap.bank.tune(k, 90 * 3 / r * spec.cap.overtones[k] * P.size, .2 / (1 + k * .5)); cap.bank.hear(k, Math.cos(cap.pan * TAU / 4) / (1 + k), Math.sin(cap.pan * TAU / 4) / (1 + k)) } }
        if (grown < 1 && rnd() < 40 * dt) for (let k = 0; k < nk; k++) cap.bank.strike(k, (rnd() - .5) * P.caps)
        if (cap.shed > 0) { cap.shed -= dt; for (let k = 0; k < nk; k++) cap.bank.strike(k, (rnd() - .5) * P.caps * .25) }
        cap.bank.process(L, R); if (cap.age > 26) caps.splice(c, 1)
      }
      // the network gets heavier as it grows, so each strike moves it less: the listening level follows, slowly
      let pk = 1e-6; for (let i = 0; i < n; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]))
      heard += (pk - heard) * (pk > heard ? .2 : .002); agc += (clamp(.25 / Math.max(heard, 1e-4), .2, 60) - agc) * .01
      soften(L, R, P.level * agc)
    },
    view() { return { strikes, caps: caps.length, gain: agc, capList: caps.map(c => [c.pan, Math.min(1, c.age / 20), c.shed > 0 ? 1 : 0]), wet, fit, tipPush, flowPush, founded, shed, scaleNote: note } }
  }
}
export const create = make(false)
