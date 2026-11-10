// Combat Zone: two individuals growing toward each other. Each is a web with its own notes, struck by its
// own growth at its own rate, one to the left and one to the right. Where they meet, hyphae of both die and
// a barrier forms: a meeting strikes both webs at their edges at once and deadens them for a moment. If one
// has the advantage it keeps growing into the other's ground and the loser falls quiet.
import { Bank, rng, clamp, soften, stageAt } from '../kit/dsp.js'
export const create = sr => {
  const M = 16, P = { stage: .6, pace: 30, meet: .3, edge: 0, ring: .6, size: .5, level: 1 }, rnd = rng(61)
  const side = [0, 1].map(() => ({ spec: null, bank: new Bank(M, sr), st: null, hush: 0, hits: 0 }))
  let meetings = 0
  const tune = () => side.forEach((s, k) => {
    if (!s.spec) return; s.st = stageAt(s.spec, P.stage)[0]
    for (let i = 0; i < M; i++) { const hz = (s.st.hz[i] || 0) * P.size; s.bank.tune(i, hz, P.ring * (1 - .8 * s.hush) / (1 + hz / 2500)); const pan = k ? .8 : .2; s.bank.hear(i, Math.cos(pan * 1.5708), Math.sin(pan * 1.5708)) }
  })
  const strike = (s, zone, amt) => { for (let i = 0; i < M; i++) s.bank.strike(i, amt * (s.st.zone[i] ? s.st.zone[i][zone] : 0)) }
  return {
    load(sp) { side[0].spec = sp; if (!side[1].spec) side[1].spec = sp; tune() },
    load2(sp) { side[1].spec = sp; tune() },
    set(k, v) { P[k] = v; tune() },
    process(L, R) {
      if (!side[0].st || !side[1].st) return
      const dt = L.length / sr
      side.forEach((s, k) => {
        const idx = Math.min(7, P.stage * 8 | 0), perHour = (s.spec.rates_per_hour.branch[idx] || 0) + (s.spec.rates_per_hour.fusion[idx] || 0) + 1
        const adv = clamp(1 + (k ? -P.edge : P.edge), 0, 2) // the one with the advantage keeps growing; the other is held back
        if (rnd() < Math.min(60, perHour * P.pace / 3600 * adv) * dt) { strike(s, rnd() * 6 | 0, .5 * adv); s.hits++ }
        s.hush *= Math.exp(-dt / .4)
      })
      if (rnd() < P.meet * 12 * dt) { // a meeting: both webs struck at their edges, both deadened
        for (const s of side) { strike(s, 5, .8); s.hush = 1 } meetings++; tune()
      }
      for (const s of side) s.bank.process(L, R)
      soften(L, R, P.level * 2)
    },
    view() { return { hits: side.map(s => s.hits), hush: side.map(s => s.hush), meetings } }
  }
}
