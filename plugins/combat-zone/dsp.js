// Combat Zone: two individuals growing toward each other. Each is a web with its own notes, struck by its
// own growth at its own rate, one to the left and one to the right. Where they meet, hyphae of both die and
// a barrier forms: a meeting strikes both webs at their edges at once and deadens them for a moment. If one
// has the advantage it keeps growing into the other's ground and the loser falls quiet.
// The advantage can be left to the species: their rank in the published pecking order, and which is nearer
// the temperature it grows best at. The encounter can also run on its own: the two approach, meet, and one
// replaces the other or they deadlock, and then two fresh individuals start again.
import { Bank, rng, clamp, soften, stageAt } from '../kit/dsp.js'
// combat scores by family, copied from species/families/*.json: inferred from the wood-decay pecking order for the first five, unknown defaults for the rest
export const SCORE = { 'CORD-L': .9, 'CORD-S': .85, RHIZ: .8, MAT: .5, DIF: .2, 'ECM-L': .5, 'ECM-M': .4, 'ECM-S': .3, HOST: .4, GARDEN: .1, LIT: .3, RING: .5 }
const gT = (T, a, o, b) => T <= a || T >= b ? 0 : clamp((T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T))), 0, 1) // cardinal temperature curve, docs/research/06 section 4
export const create = sr => {
  const M = 16, P = { stage: .6, pace: 30, meet: .3, edge: 0, rank: 0, temp: 18, war: 0, ring: .6, size: .5, level: 1 }, rnd = rng(61)
  const side = [0, 1].map(() => ({ spec: null, bank: new Bank(M, sr), st: null, hush: 0, hits: 0, pos: .6, warm: 1, score: .5, adv: 1, edge: new Float32Array(M) }))
  let meetings = 0, clock = 0, count = 0, share = .5, bias = 0, phase = -1, touch = .3, fit = 1, note = '', rounds = 0
  const has = (s, k) => !s.has || s.has[k] !== false
  const adapt = () => { // one factor for both webs, so their notes keep their true relation: only used when a size puts them outside hearing
    if (!side[0].spec || !side[1].spec) return
    let lo = 1e9, hi = 0; for (const s of side) { const g = s.spec.stages; lo = Math.min(lo, g[g.length - 1].hz[0] || 1e9); hi = Math.max(hi, g[0].hz[0] || 0); s.score = SCORE[s.spec.family] || .4 }
    fit = 1; while (lo * fit < 120 && fit < 1e5) fit *= 2; while (hi * fit > 24000 && lo * fit > 240) fit /= 2
    const a = side[0].spec, b = side[1].spec
    note = [fit == 1 ? '' : `The networks at this size are too ${fit > 1 ? 'large and low' : 'small and high'} to hear as they are: every note of both is ${fit > 1 ? 'raised ' + fit : 'lowered ' + 1 / fit} times.`,
      has(a, 'rivals') && has(b, 'rivals') ? '' : 'The simulator at this size has no rivals: the two webs were grown apart, and their meeting is staged here.', has(a, 'weather') && has(b, 'weather') ? '' : 'No weather at this size: both are held at their best temperature.'].filter(Boolean).join(' ')
  }
  const tune = () => side.forEach((s, k) => {
    if (!s.spec) return
    const [a, b, t] = stageAt(s.spec, s.pos), pan = k ? 1 - .4 * (1 - share) : .4 * share; s.st = a // each is heard from the middle of the ground it holds
    let em = 1e-9; for (let i = 0; i < M; i++) em = Math.max(em, Math.abs(a.zone[i] ? a.zone[i][5] : 0))
    for (let i = 0; i < M; i++) {
      const hz = ((a.hz[i] || 0) * (1 - t) + (b.hz[i] || a.hz[i] || 0) * t) * P.size * fit, e = Math.abs(a.zone[i] ? a.zone[i][5] : 0) / em
      s.bank.tune(i, hz, P.ring * (1 - .8 * s.hush * e) / (1 + hz / 2500)); s.bank.hear(i, Math.cos(pan * 1.5708), Math.sin(pan * 1.5708)) // a meeting kills hyphae at the edge: the modes that move most there are deadened most
    }
  })
  const strike = (s, zone, amt) => { for (let i = 0; i < M; i++) s.bank.strike(i, amt * (s.st.zone[i] ? s.st.zone[i][zone] : 0)) }
  return {
    load(sp) { side[0].spec = sp; if (!side[1].spec) side[1].spec = sp; adapt(); tune() },
    load2(sp) { side[1].spec = sp; adapt(); tune() },
    set(k, v) { P[k] = v; if (k == 'war') clock = 0; tune() },
    process(L, R) {
      if (!side[0].st || !side[1].st) return
      const dt = L.length / sr, a = side[0], b = side[1]
      for (const s of side) { const n = s.spec.numbers; s.warm = has(s.spec, 'weather') ? gT(P.temp, n.t_min_c, n.t_opt_c, n.t_max_c) : 1 }
      // who has the advantage: your hand, the species' rank, and which is nearer its best temperature
      bias = clamp(P.edge + P.rank * 2 * (a.score - b.score) / (a.score + b.score) + .5 * (a.warm - b.warm) / (a.warm + b.warm + 1e-6), -1, 1)
      let out = 1, near = 1
      if (P.war > 0) { // the encounter runs on its own: approach, contact, outcome, then two fresh individuals
        clock += dt; if (clock >= P.war) { clock = 0; rounds++ }
        phase = clock / P.war; near = clamp(phase / .3, 0, 1); touch = P.meet * clamp((phase - .25) / .15, 0, 1); out = clamp((phase - .5) / .5, 0, 1)
        share = .5 + .5 * bias * out
      } else { phase = -1; touch = P.meet; share = .5 + .35 * bias }
      side.forEach((s, k) => {
        const lead = k ? -bias : bias, lost = P.war > 0 && lead < 0 ? -lead * out : 0
        s.pos = P.stage * (.25 + .75 * near) * (1 - .8 * lost) // the loser's network is cut back toward its centre
        const R8 = s.spec.rates_per_hour, idx = Math.min(R8.branch.length - 1, s.pos * 8 | 0), perHour = (R8.branch[idx] || 0) + (R8.fusion[idx] || 0) + 1
        s.adv = clamp(1 + lead * out, 0, 2) * s.warm // the one with the advantage keeps growing; the other is held back
        if (rnd() < Math.min(60, perHour * P.pace / 3600 * s.adv) * dt) { strike(s, rnd() * 6 | 0, .5 * Math.min(1.5, s.adv)); s.hits++ }
        s.hush *= Math.exp(-dt / .4)
      })
      let retune = (count += L.length) > 2400 // the deadening wears off and the ground held changes, so the webs are retuned twenty times a second
      if (rnd() < touch * 12 * clamp(a.warm + b.warm, 0, 1) * dt) { // a meeting: both webs struck at their edges, both deadened
        for (const s of side) { strike(s, 5, .8); s.hush = 1 } meetings++; retune = true
      }
      if (retune) { count = 0; tune() }
      for (const s of side) s.bank.process(L, R)
      soften(L, R, P.level * 2)
    },
    view() { return { hits: side.map(s => s.hits), hush: side.map(s => s.hush), meetings, stage: side.map(s => s.pos), share, bias, phase, touch, warm: side.map(s => s.warm), score: side.map(s => s.score), growing: side.map(s => s.adv), rounds, fit, scaleNote: note } }
  }
}
