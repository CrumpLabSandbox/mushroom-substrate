// Spore Scatter: the spread of pitches from the spread of spores. Each note is a spore landing. How far it
// lands from the mushroom follows the dispersal rule the stand-scale engine uses: most fall close, a few
// travel far. Distance is pitch distance from a centre note; wind pushes more of them to one side. Rarely, a
// spore that lands far out founds a new individual, and the centre moves there: the music changes key by
// colonising.
import { Notes, rng, clamp } from '../kit/dsp.js'
export const create = sr => {
  const P = { rate: 8, reach: 2.5, wind: 0, gust: .5, found: 1, base: 60, length: .25 }, notes = new Notes(), rnd = rng(17)
  let spec = null, centre = 60, clock = 0, last = [], moved = 9
  return {
    load(s) { spec = s; centre = P.base },
    set(k, v) { P[k] = v; if (k == 'base') centre = v },
    advance(n) {
      if (!spec) return []
      const dt = n / sr; clock += dt; moved += dt
      const puff = 1 - P.gust * (.5 + .5 * Math.sin(clock * .9) * Math.sin(clock * .23)) // discharge comes and goes with the air
      if (rnd() < P.rate * puff * dt) {
        const u = rnd(), d = P.reach * u / (1.02 - u), side = rnd() < .5 + P.wind / 2 ? 1 : -1, key = clamp(centre + side * d, 24, 108)
        notes.play(key, .85 / (1 + d / 10), P.length * sr); last.push([key - centre, 0]); if (last.length > 60) last.shift()
        if (d > P.reach * 3 && rnd() < .06 * P.found) { centre = clamp(key, 36, 96); moved = 0 } // far enough to be on unclaimed ground: a new individual
      }
      for (const l of last) l[1] += dt
      return notes.tick(n)
    },
    view() { return { centre, last: last.map(l => l.slice()), moved } }
  }
}
