// Season Cycle: form and dynamics from the year. Temperature rises and falls; the mycelium is active
// according to the species' own temperature curve, and its activity is a slow line of low notes. Rain comes
// at random: a burst of quick high notes, and more activity while the ground is wet. Through the warm months
// the fungus stores reserve. When autumn cools the surface below the species' fruiting temperature, it
// fruits: each mushroom is a short falling figure, the cap's note dropping as it expands. Winter is silence.
import { Notes, ownNotes, rng, clamp } from '../kit/dsp.js'
export const create = sr => {
  const P = { year: 60, climate: 0, swing: 9, rain: 24, base: 43 }, notes = new Notes(), rnd = rng(13)
  let spec = null, y = 0, reserve = 0, wet = 0, pitch = [0], queue = [], T = 0, act = 0, lastT = 0, fruited = false
  const ctmi = (T, a, o, b) => T <= a || T >= b ? 0 : (T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T)))
  return {
    load(s) { spec = s; pitch = ownNotes(s, .7, 16); reserve = 0; queue = [] },
    set(k, v) { P[k] = v },
    advance(n) {
      if (!spec) return []
      const N = spec.numbers, dt = n / sr, dy = dt / P.year
      y += dy; if (y >= 1) { y -= 1; fruited = false }
      lastT = T; T = N.t_opt_c - 8 + P.climate + P.swing * Math.sin(6.2832 * (y - .3)) // warmest two-thirds of the way through the year's first half
      act = clamp(ctmi(T, N.t_min_c, N.t_opt_c, N.t_max_c), 0, 1) * (1 + wet)
      reserve += act * dy * 10; wet *= Math.exp(-dt / 3)
      if (rnd() < act * 3 * dt) notes.play(P.base + pitch[rnd() * 5 | 0], .25 + .25 * act, 1.2 * sr)              // the mycelium at work: slow low notes
      if (rnd() < P.rain * dy) { wet = 1; for (let k = 0; k < 10; k++) queue.push([k * .09 + rnd() * .06, P.base + 12 + pitch[6 + (rnd() * 9 | 0)], .5, .12]) } // rain
      if (!fruited && T < lastT && T <= N.t_opt_c - N.cold_drop_c && T > N.t_min_c + 1 && reserve > 1) { // autumn, cool enough, and something stored: it fruits
        fruited = true; const caps = Math.min(8, Math.round(reserve))
        for (let c = 0; c < caps; c++) for (let k = 0; k < 5; k++) queue.push([c * .45 + k * .11, P.base + 24 - k * 3.5 + pitch[c % 6], .85 - k * .08, .5]) // each cap's note falls as it expands
        reserve = 0
      }
      for (let i = queue.length; i--;) if ((queue[i][0] -= dt) <= 0) { const q = queue[i]; notes.play(q[1], q[2], q[3] * sr); queue.splice(i, 1) }
      return notes.tick(n)
    },
    view() { return { y, T, act, reserve, wet, fruiting: queue.length > 12 } }
  }
}
