// Season Cycle: form and dynamics from the year. Temperature rises and falls; the mycelium is active
// according to the species' own temperature curve, and its activity is a slow line of low notes. Rain comes
// at random: a burst of quick high notes, and more activity while the ground is wet. Through the warm months
// the fungus stores reserve. When autumn cools the surface below the species' fruiting temperature, it
// fruits: each mushroom is a short falling figure, stepping down the network's own notes as the cap expands,
// slower for a species with a bigger cap. The open caps then shed spores for a while. Winter is silence.
import { Notes, ownNotes, rng, clamp } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const P = { year: 60, climate: 0, swing: 9, rain: 24, base: 43, octave: 0, thin: 1, apart: .3, spores: .5 }, notes = new Notes(), rnd = rng(13), rnd2 = rng(131)
  let spec = null, y = 0, reserve = 0, wet = 0, pitch = [0], queue = [], T = 0, act = 0, lastT = 0, fruited = false, fruitLeft = 0, shedIn = -1, shed = 0, caps = 0, big = 1, H = ALL, plot = false, people = 1, tipMax = 1, scaleNote = ''
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  const ctmi = (T, a, o, b) => T <= a || T >= b ? 0 : (T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T)))
  // the network's notes, with modes closer together than `apart` counted as one note
  const tune = () => { let kept = 0; pitch = ownNotes(spec, .7, 24).filter((x, i) => !i || x - kept >= P.apart ? (kept = x, true) : false) }
  return {
    load(s) { spec = s; tune(); reserve = 0; queue = []; fruitLeft = 0; shedIn = -1; shed = 0; big = clamp(Math.sqrt(s.cap.radius_cm / 5), .6, 2.5) // a bigger cap takes longer to open
      H = s.has || ALL; plot = s.engine == '4m' && !!H.spores; people = 1; fruited = false; tipMax = Math.max(0, ...s.curves.tips)
      scaleNote = [H.weather ? '' : 'No weather at this size: no seasons and no rain. The temperature stays at the species\' best and activity follows the number of growing tips through the run.',
        !H.fruit ? 'No mushrooms at this size: it never fruits.' : !H.weather ? 'With no autumn to trigger it, it fruits whenever enough reserve is stored.' : '',
        H.fruit && !H.spores ? 'No spores at this size: the open caps shed nothing.' : '',
        plot ? 'Spores at this size: each year\'s spores can found a new individual, up to four, each working from its own note.' : ''].filter(Boolean).join(' ')
    },
    set(k, v) { P[k] = v; if (spec && k == 'apart') tune() },
    advance(n) {
      if (!spec) return []
      const N = spec.numbers, dt = n / sr, dy = dt / P.year, m = pitch.length, lowN = Math.max(1, Math.ceil(m / 3))
      y += dy; if (y >= 1) { y -= 1; fruited = false }
      lastT = T
      if (H.weather) {
        T = N.t_opt_c - 8 + P.climate + P.swing * Math.sin(6.2832 * (y - .3)) // warmest two-thirds of the way through the year's first half
        act = clamp(ctmi(T, N.t_min_c, N.t_opt_c, N.t_max_c), 0, 1) * (1 + wet)
      } else { // a dish at a steady temperature: the only change is the growth run itself
        const c = spec.curves.tips, p = y * (c.length - 1), k = p | 0
        T = N.t_opt_c; act = tipMax > 0 ? .15 + .85 * (c[k] + (c[Math.min(c.length - 1, k + 1)] - c[k]) * (p - k)) / tipMax : .6
      }
      if (H.flow) reserve += act * dy * 10; wet *= Math.exp(-dt * 20 / P.year) // the ground stays wet for about a twentieth of a year
      if (rnd() < act * 3 * Math.sqrt(people) * dt) play(P.base + (people > 1 ? pitch[(rnd2() * people | 0) % m] : 0) + pitch[rnd() * lowN | 0], .25 + .25 * act, 1.2 * sr)              // the mycelium at work: slow notes from the lowest third of the network's notes
      if (H.weather && rnd() < P.rain * dy) { wet = 1; for (let k = 0; k < 10; k++) queue.push([k * .09 + rnd() * .06, P.base + 12 + pitch[Math.min(m - 1, lowN + (rnd() * (m - lowN) | 0))], .5, .12]) } // rain: the notes above those
      if (H.fruit && !fruited && (H.weather ? T < lastT && T <= N.t_opt_c - N.cold_drop_c && T > N.t_min_c + 1 && reserve > 1 : reserve > 3)) { // autumn, cool enough, and something stored: it fruits
        fruited = true; caps = Math.min(8, Math.round(reserve))
        for (let c = 0; c < caps; c++) { const hi = Math.max(0, m - 1 - c % 3); for (let k = 0; k < 5; k++) queue.push([c * .45 + k * .11 * big, P.base + 12 + pitch[Math.round(hi * (1 - k / 4))], .85 - k * .08, .5 * big]) } // each cap's note steps down the network's notes as it expands
        fruitLeft = caps * .45 + .55 * big + .5; shedIn = H.spores ? fruitLeft : -1; reserve = 0; if (!H.weather) fruited = false
      }
      if (fruitLeft > 0) fruitLeft -= dt
      if (shedIn >= 0 && (shedIn -= dt) < 0) { shed = 1; if (plot && people < 4) people++ } // the caps are open: spores for about a twelfth of a year
      if (shed > 0) {
        shed -= dt * 12 / P.year
        if (rnd2() < 14 * P.spores * Math.max(0, shed) * (.4 + .6 * Math.min(1, wet)) * caps / 8 * dt) play(P.base + 24 + pitch[Math.min(m - 1, lowN + (rnd2() * (m - lowN) | 0))], .1 + .12 * rnd2(), .07 * sr) // more leave in damp air
      }
      for (let i = queue.length; i--;) if ((queue[i][0] -= dt) <= 0) { const q = queue[i]; play(q[1], q[2], q[3] * sr); queue.splice(i, 1) }
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; queue.length = 0; return out },
    view() { const N = spec && spec.numbers; return { y, T, act, reserve, wet, fruiting: fruitLeft > 0, caps: fruitLeft > 0 || shed > 0 ? caps : 0, shedding: Math.max(0, shed), fruitsBelow: N ? N.t_opt_c - N.cold_drop_c : 0, capPace: big, notes: pitch.length, individuals: people, sounding: notes.count(), nps, scaleNote } }
  }
}
