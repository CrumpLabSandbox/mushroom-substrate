// Tip Chorus: texture from branching. The growth rule itself, run live: tips advance across a field, each
// branching at the species' rate and angle and fusing when two meet. Left to right across the field is low
// to high. A tip sounds every few steps, at each branch and at each fusion, so the music starts as a few
// lines, thickens as the tips multiply, and thins where they fuse, crowd or leave the field.
// Temperature moves the tips' speed by the species' own curve, and the pitches can be pulled onto the
// network's own notes.
import { Notes, ownNotes, rng, clamp, TAU } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const P = { pace: 5, branching: 1, angle: 1, fusion: 1, voices: 10, base: 60, span: 3, every: 4, length: .3, octave: 0, thin: 1, temp: 0, own: 0 }, notes = new Notes(), rnd = rng(5), rnd2 = rng(51), R = 64
  let spec = null, tips = [], pause = 0, lines = [], pitch = [0], warm = 1, fusedAgo = 9, branchedAgo = 9, H = ALL, plot = false, cordy = false, who = 0, since = 0, scaleNote = ''
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  // the species' growth rate against temperature, 1 at its optimum (the cardinal temperature model the engines use)
  const ctmi = (T, a, o, b) => T <= a || T >= b ? 0 : (T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T)))
  // Position in the field as a pitch. `own` pulls the distance from the centre note onto the nearest of the
  // intervals the network's modes make with its lowest; beyond the largest of them it is left where it is.
  const key = x => {
    const off = x / R * P.span * 6, a = Math.abs(off); let near = a
    if (P.own > 0 && a <= pitch[pitch.length - 1] + 1) { let best = 1e9; for (const p of pitch) if (Math.abs(p - a) < best) { best = Math.abs(p - a); near = p } }
    return P.base + (off < 0 ? -1 : 1) * (a + (near - a) * P.own)
  }
  const seed = () => { tips = [0, 1, 2].map(k => ({ x: 0, y: 0, h: k * TAU / 3 + rnd(), prog: 0, n: 0, who: 0 })); lines = []; who = 0; since = 0 }
  return {
    load(s) { spec = s; let kept = 0; pitch = ownNotes(s, .7, 24).filter((x, i) => !i || x - kept >= .3 ? (kept = x, true) : false); seed()
      H = s.has || ALL; plot = s.engine == '4m' && !!H.spores; cordy = !!H.cords && s.numbers.cord_max > 0
      scaleNote = [H.weather ? '' : 'No weather at this size: the tips grow at the species\' best temperature.', plot ? 'Spores at this size: new individuals are founded across the field, and tips of different individuals do not fuse.' : ''].filter(Boolean).join(' ')
    },
    set(k, v) { P[k] = v },
    advance(n) {
      if (!spec) return []
      fusedAgo += n / sr; branchedAgo += n / sr
      if (!tips.length) { if ((pause += n / sr) > 1.5) { pause = 0; seed() } return done(n) }
      const N = spec.numbers, pBranch = 100 / N.growth_unit_um * P.branching, ang = N.branch_angle_deg * P.angle * TAU / 360, len = P.length * sr
      warm = H.weather ? clamp(ctmi(N.t_opt_c + P.temp, N.t_min_c, N.t_opt_c, N.t_max_c), 0, 1) : 1
      if (plot && (since += n / sr) > 6 && tips.length < Math.round(P.voices)) { since = 0; who++; tips.push({ x: (rnd2() * 2 - 1) * R * .8, y: (rnd2() * 2 - 1) * R * .8, h: rnd2() * TAU, prog: 0, n: 0, who }) } // a spore lands and founds a new individual
      for (let i = tips.length; i--;) {
        const t = tips[i]; t.prog += P.pace * warm * Math.min(1, .3 + t.n * .12) * n / sr // a new branch starts slow, as in the model
        if (t.prog < 1) continue
        t.prog -= 1; t.n++; t.h += (rnd() - .5) * .2
        const px = t.x, py = t.y; t.x += Math.cos(t.h); t.y += Math.sin(t.h); lines.push(px, py, t.x, t.y); if (lines.length > 2400) lines.splice(0, 4)
        if (Math.abs(t.x) > R || Math.abs(t.y) > R) { tips.splice(i, 1); continue } // it has left the field
        let fused = false
        for (let j = 0; j < tips.length && !fused; j++) if (j != i && tips[j].who == t.who && Math.hypot(tips[j].x - t.x, tips[j].y - t.y) < 1.5 && rnd() < N.fusion_probability * P.fusion) fused = true
        if (fused) { play(key(t.x) - 12, .9, len * 2); fusedAgo = 0; tips.splice(i, 1); continue } // two tips meet and become one: a low accent
        if (tips.length < Math.round(P.voices) && rnd() < pBranch * (1 - tips.length / P.voices)) { // crowding slows branching
          tips.push({ x: t.x, y: t.y, h: t.h + (rnd() < .5 ? ang : -ang), prog: 0, n: 0, who: t.who }); play(key(t.x), .75, len); branchedAgo = 0
        } else if (t.n % Math.round(P.every) == 0) play(key(t.x), cordy ? .45 + .3 * Math.min(1, t.n / 40) : .45, len) // in a cord-former a long-lived line has thickened, and is louder
      }
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; return out },
    view() { return { tips: tips.map(t => [t.x / R, t.y / R]), who: tips.map(t => t.who), individuals: who + 1, scaleNote, lines: lines.slice(-800).map(v => v / R), warm, celsius: spec ? spec.numbers.t_opt_c + (H.weather ? P.temp : 0) : 0, fusedAgo, branchedAgo, own: pitch, sounding: notes.count(), nps } }
  }
}
