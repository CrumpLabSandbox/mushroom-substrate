// Tip Chorus: texture from branching. The growth rule itself, run live: tips advance across a field, each
// branching at the species' rate and angle and fusing when two meet. Left to right across the field is low
// to high. A tip sounds every few steps, at each branch and at each fusion, so the music starts as a few
// lines, thickens as the tips multiply, and thins where they fuse, crowd or leave the field.
import { Notes, rng, clamp, TAU } from '../kit/dsp.js'
export const create = sr => {
  const P = { pace: 5, branching: 1, angle: 1, fusion: 1, voices: 10, base: 60, span: 3, every: 4, length: .3 }, notes = new Notes(), rnd = rng(5), R = 64
  let spec = null, tips = [], pause = 0, lines = []
  const key = x => P.base + x / R * P.span * 6
  const seed = () => { tips = [0, 1, 2].map(k => ({ x: 0, y: 0, h: k * TAU / 3 + rnd(), prog: 0, n: 0 })); lines = [] }
  return {
    load(s) { spec = s; seed() },
    set(k, v) { P[k] = v },
    advance(n) {
      if (!spec) return []
      if (!tips.length) { if ((pause += n / sr) > 1.5) { pause = 0; seed() } return notes.tick(n) }
      const N = spec.numbers, pBranch = 100 / N.growth_unit_um * P.branching, ang = N.branch_angle_deg * P.angle * TAU / 360, len = P.length * sr
      for (let i = tips.length; i--;) {
        const t = tips[i]; t.prog += P.pace * Math.min(1, .3 + t.n * .12) * n / sr // a new branch starts slow, as in the model
        if (t.prog < 1) continue
        t.prog -= 1; t.n++; t.h += (rnd() - .5) * .2
        const px = t.x, py = t.y; t.x += Math.cos(t.h); t.y += Math.sin(t.h); lines.push(px, py, t.x, t.y); if (lines.length > 2400) lines.splice(0, 4)
        if (Math.abs(t.x) > R || Math.abs(t.y) > R) { tips.splice(i, 1); continue } // it has left the field
        let fused = false
        for (let j = 0; j < tips.length && !fused; j++) if (j != i && Math.hypot(tips[j].x - t.x, tips[j].y - t.y) < 1.5 && rnd() < N.fusion_probability * P.fusion) fused = true
        if (fused) { notes.play(key(t.x) - 12, .9, len * 2); tips.splice(i, 1); continue } // two tips meet and become one: a low accent
        if (tips.length < Math.round(P.voices) && rnd() < pBranch * (1 - tips.length / P.voices)) { // crowding slows branching
          tips.push({ x: t.x, y: t.y, h: t.h + (rnd() < .5 ? ang : -ang), prog: 0, n: 0 }); notes.play(key(t.x), .75, len)
        } else if (t.n % Math.round(P.every) == 0) notes.play(key(t.x), .45, len)
      }
      return notes.tick(n)
    },
    view() { return { tips: tips.map(t => [t.x / R, t.y / R]), lines: lines.slice(-800).map(v => v / R) } }
  }
}
