// Growth Form: large-scale form from a whole growth run. The prebuilt run of the species is played through
// as one piece. How many notes sound follows the number of growing tips; how loud they are follows flow
// through the network; how long they last follows its reserve. The notes are the network's real modes at
// each stage, all moved by one fixed interval, so the register falls as the network grows and its range
// widens as the colony's front moves out. Fusions sound as two neighbouring modes together and abandoned
// hyphae as a long quiet lowest mode, as often as the run's own event rates say.
import { Notes, rng, clamp } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const P = { length: 90, density: 1, base: 36, top: 96, octave: 0, thin: 1, events: 1 }, notes = new Notes(), rnd = rng(9), rnd2 = rng(91)
  let spec = null, u = 0, max = {}, low = 1, rate = 0, si = 0, fusedAgo = 9, abandonedAgo = 9, H = ALL, plot = false, flat = {}, scaleNote = '', loudBy = 'flow', longBy = 'reserve', denseBy = 'tips'
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  const at = (name, x) => { if (flat[name]) return .5; const c = spec.curves[name], p = clamp(x, 0, 1) * (c.length - 1), k = p | 0; return (c[k] + (c[Math.min(c.length - 1, k + 1)] - c[k]) * (p - k)) / max[name] }
  // a mode's real frequency as a key; one above the highest note allowed is brought down by whole octaves
  const keyOf = hz => { let k = P.base + 12 * Math.log2(hz / low); const top = Math.max(P.top, 24); while (k > top) k -= 12; while (k < 12) k += 12; return k }
  return {
    load(s) {
      spec = s; u = 0; H = s.has || ALL; plot = s.engine == '4m' && !!H.spores
      for (const k in s.curves) { max[k] = Math.max(1e-9, ...s.curves[k]); flat[k] = !(Math.max(...s.curves[k]) > 0) }
      low = s.stages[s.stages.length - 1].hz[0]
      const noFlow = !H.flow || flat.flow || flat.reserve
      loudBy = noFlow ? 'front_um' : 'flow'; longBy = noFlow ? 'length_um' : 'reserve'; denseBy = flat.tips ? 'length_um' : 'tips' // a curve that is flat at zero reads as a steady half
      scaleNote = [noFlow ? 'No flow at this size: loudness follows how far the front has reached, and note length follows the total length of hypha.' : '', plot ? 'Spores at this size: a new individual is founded a third and two-thirds of the way through, and each plays the modes of its own age.' : ''].filter(Boolean).join(' ')
    },
    set(k, v) { P[k] = v },
    advance(n) {
      if (!spec) return []
      const dt = n / sr; fusedAgo += dt; abandonedAgo += dt
      u += dt / P.length; if (u >= 1) u -= 1
      si = Math.min(spec.stages.length - 1, u * spec.stages.length | 0); let st = spec.stages[si]
      rate = P.density * 14 * at(denseBy, u)
      const flow = at(loudBy, u), reserve = at(longBy, u)
      // fusions and abandonments take the place of ordinary notes, as often as the run had them against branching at this stage
      const R = spec.rates_per_hour, br = Math.max(1e-6, R.branch[si] || 0), fu = R.fusion[si] || 0, ab = R.abandoned[si] || 0
      if (rnd() < rate * dt) {
        const what = P.events > 0 ? rnd2() : 2, pf = P.events * fu / (fu + br), pa = P.events * ab / (ab + br)
        if (what < pf) { // two hyphae become one: two neighbouring modes together
          rnd(); const i = rnd2() * (st.hz.length - 1) | 0; let j = i + 1; while (j < st.hz.length - 1 && st.hz[j] < st.hz[i] * 1.02) j++
          const len = (.2 + 1.4 * reserve) * sr; play(keyOf(st.hz[i]), .3 + .6 * flow, len); play(keyOf(st.hz[j]), .3 + .6 * flow, len); fusedAgo = 0
          return done(n)
        }
        if (what < pf + pa) { rnd(); play(keyOf(st.hz[0]), .22, (.6 + 2.4 * reserve) * sr); abandonedAgo = 0; return done(n) } // a stretch is emptied and left: the lowest mode, quiet and long
        let quiet = 1
        if (plot) { const off = (rnd2() * 3 | 0) / 3; if (off > 0 && u > off) { st = spec.stages[Math.min(spec.stages.length - 1, (u - off) * spec.stages.length | 0)]; quiet = .8 } } // a younger individual: the modes of its own age
        const reach = 1 + Math.floor(at('front_um', u) * (st.hz.length - 1)), i = rnd() * reach | 0 // the further the front, the more of the modes are in play
        play(keyOf(st.hz[i]), (.25 + .7 * flow) * quiet, (.12 + .9 * reserve) * sr)
      }
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; return out },
    view() { return spec ? { u, rate, stageIndex: si, tips: at('tips', u), flow: at('flow', u), reserve: at('reserve', u), front: at('front_um', u), loud: at(loudBy, u), long: at(longBy, u), loudBy, longBy, days: spec.stages[si].days, individuals: plot ? 1 + (u > 1 / 3) + (u > 2 / 3) : 1, scaleNote, lowest: keyOf(spec.stages[si].hz[0]) + 12 * Math.round(P.octave), fusedAgo, abandonedAgo, sounding: notes.count(), nps } : { u, rate, scaleNote } }
  }
}
