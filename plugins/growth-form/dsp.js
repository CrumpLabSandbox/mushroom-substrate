// Growth Form: large-scale form from a whole growth run. The prebuilt run of the species is played through
// as one piece. How many notes sound follows the number of growing tips; how loud they are follows flow
// through the network; how long they last follows its reserve. The notes are the network's real modes at
// each stage, all moved by one fixed interval, so the register falls as the network grows and its range
// widens as the colony's front moves out.
import { Notes, rng, clamp } from '../kit/dsp.js'
export const create = sr => {
  const P = { length: 90, density: 1, base: 36, top: 96 }, notes = new Notes(), rnd = rng(9)
  let spec = null, u = 0, max = {}, low = 1, rate = 0
  const at = (name, x) => { const c = spec.curves[name], p = clamp(x, 0, 1) * (c.length - 1), k = p | 0; return (c[k] + (c[Math.min(c.length - 1, k + 1)] - c[k]) * (p - k)) / max[name] }
  return {
    load(s) { spec = s; u = 0; for (const k in s.curves) max[k] = Math.max(1e-9, ...s.curves[k]); low = s.stages[s.stages.length - 1].hz[0] },
    set(k, v) { P[k] = v },
    advance(n) {
      if (!spec) return []
      u += n / sr / P.length; if (u >= 1) u -= 1
      const st = spec.stages[Math.min(spec.stages.length - 1, u * spec.stages.length | 0)]
      rate = P.density * 14 * at('tips', u)
      if (rnd() < rate * n / sr) {
        const reach = 1 + Math.floor(at('front_um', u) * (st.hz.length - 1)), i = rnd() * reach | 0 // the further the front, the more of the modes are in play
        notes.play(clamp(P.base + 12 * Math.log2(st.hz[i] / low), 12, P.top), .25 + .7 * at('flow', u), (.12 + .9 * at('reserve', u)) * sr)
      }
      return notes.tick(n)
    },
    view() { return { u, rate } }
  }
}
