// Spore Scatter: the spread of pitches from the spread of spores. Each note is a spore landing. How far it
// lands from the mushroom follows the dispersal rule the stand-scale engine uses: most fall close, a few
// travel far. Distance is pitch distance from a centre note; wind pushes more of them to one side. Rarely, a
// spore that lands far out founds a new individual, and the centre moves there: the music changes key by
// colonising. The parent goes on shedding for a while, so for a time two centres are heard at once. The
// landing distances can be pulled onto the intervals of the network's own notes.
import { Notes, ownNotes, rng, clamp } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const P = { rate: 8, reach: 2.5, wind: 0, gust: .5, found: 1, base: 60, length: .25, octave: 0, thin: 1, own: 0, overlap: 3 }, notes = new Notes(), rnd = rng(17), rnd2 = rng(171)
  let spec = null, centre = 60, parent = 60, clock = 0, last = [], moved = 9, pitch = [0], founded = 0, H = ALL, front = 1, scaleNote = ''
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  // `own` pulls a landing distance onto the nearest interval the network's modes make with its lowest;
  // a spore that lands beyond the largest of them stays where it fell
  const snap = d => { if (!(P.own > 0) || d > pitch[pitch.length - 1] + 1) return d; let best = 1e9, near = d; for (const p of pitch) if (Math.abs(p - d) < best) { best = Math.abs(p - d); near = p } return d + (near - d) * P.own }
  return {
    load(s) { spec = s; centre = parent = P.base; let kept = 0; pitch = ownNotes(s, .7, 24).filter((x, i) => !i || x - kept >= .3 ? (kept = x, true) : false)
      H = s.has || ALL; clock = 0; moved = 9
      scaleNote = H.spores ? '' : 'No spores at this size: each note is a new branch instead, placed within the growing front, which widens through the run and then begins again. Nothing founds a new individual.'
    },
    set(k, v) { P[k] = v; if (k == 'base') centre = parent = v },
    advance(n) {
      if (!spec) return []
      const dt = n / sr; clock += dt; moved += dt
      const puff = 1 - P.gust * (.5 + .5 * Math.sin(clock * .9) * Math.sin(clock * .23)) // discharge comes and goes with the air
      if (!H.spores) { // no spores: branches, anywhere inside the front, which grows through the run
        const c = spec.curves.front_um, top = Math.max(0, ...c), p = (clock / 40 % 1) * (c.length - 1), k = p | 0
        front = top > 0 ? (c[k] + (c[Math.min(c.length - 1, k + 1)] - c[k]) * (p - k)) / top : clock / 40 % 1
        if (rnd() < P.rate * dt) {
          const d = front * P.reach * 4 * rnd(), side = rnd() < .5 + P.wind / 2 ? 1 : -1, key = clamp(centre + side * snap(d), 24, 108)
          play(key, .4 + .4 * d / (P.reach * 4), P.length * sr); last.push([key - centre, 0, 0]); if (last.length > 60) last.shift() // the newest growth, at the front, is the loudest
        }
        for (const l of last) l[1] += dt
        return done(n)
      }
      if (rnd() < P.rate * puff * dt) {
        const u = rnd(), d = P.reach * u / (1.02 - u), side = rnd() < .5 + P.wind / 2 ? 1 : -1, far = d > P.reach * 3 && rnd() < .06 * P.found
        const old = P.overlap > 0 && centre != parent && rnd2() < Math.exp(-moved / P.overlap) // the parent is still shedding
        const from = old ? parent : centre, key = clamp(from + side * snap(d), 24, 108)
        play(key, .85 / (1 + d / 10) * (old ? .8 : 1), P.length * sr); last.push([key - centre, 0, old ? 1 : 0]); if (last.length > 60) last.shift()
        if (far && !old) { parent = centre; centre = clamp(key, 36, 96); moved = 0; founded++ } // far enough to be on unclaimed ground: a new individual
      }
      for (const l of last) l[1] += dt
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; return out },
    view() { return { centre, last: last.map(l => l.slice()), moved, parent, parentShare: P.overlap > 0 && centre != parent ? Math.exp(-moved / P.overlap) : 0, founded, own: pitch, spores: !!H.spores, front, scaleNote, sounding: notes.count(), nps } }
  }
}
