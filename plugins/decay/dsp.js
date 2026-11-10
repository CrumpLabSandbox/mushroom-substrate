// Decay: a fallen log over years, heard as a wooden bar. Raindrops strike it. As fungi rot it, the wood
// loses stiffness and weight, and a bar's note goes as the square root of stiffness over weight. White rot
// takes everything together, so the note sinks slowly and the ring shortens. Brown rot takes the cellulose
// and leaves the lignin: stiffness goes long before weight does, the note drops sharply, and the wood
// cracks into cubes, each crack a small strike of its own.
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const BAR = [1, 2.76, 5.4, 8.93, 13.34], P = { decay: 0, years: 60, kind: 0, length: 1, rain: 6, ring: 1.2, level: 1 }, rnd = rng(43), bank = new Bank(BAR.length, sr)
  let spec = null, u = 0, auto = 0, count = 0, st = { f: 460, stiff: 1, weight: 1, brown: false }
  const tune = () => {
    const brown = P.kind > 1.5 || (P.kind < .5 && spec && spec.fruit.trophic == 'brown-rot')
    const stiff = brown ? Math.pow(1 - u, 3) * .97 + .03 : 1 - .7 * u, weight = brown ? 1 - .5 * u : 1 - .6 * u
    const f0 = 460 / (P.length * P.length) * Math.sqrt(stiff / weight) // a bar 10 cm thick: 460 Hz at one metre, falling as length squared
    BAR.forEach((r, k) => { bank.tune(k, f0 * r, P.ring * (1 - .85 * u) / (1 + k * .6)); bank.hear(k, .7 - k * .08, .5 + k * .08) })
    st = { f: f0, stiff, weight, brown }
  }
  return {
    load(s) { spec = s; tune() },
    set(k, v) { P[k] = v; if (k == 'decay') { u = v; auto = 0 } tune() },
    process(L, R) {
      const n = L.length, dt = n / sr
      if (P.years > 0) { auto += dt / P.years; u = clamp(P.decay + auto, 0, .97); if (P.decay + auto > 1.1) auto = -P.decay } // the log goes, and another falls
      if ((count += n) > 2400) { count = 0; tune() }
      if (rnd() < P.rain * dt) { const where = rnd(); for (let k = 0; k < BAR.length; k++) bank.strike(k, .5 * Math.cos((k + 1) * where * 2.2) / (1 + k * .3)) } // a drop lands somewhere along it
      if (st.brown && rnd() < u * u * 14 * dt) for (let k = 1; k < BAR.length; k++) bank.strike(k, (rnd() - .5) * .35) // brown rot cracking
      bank.process(L, R); soften(L, R, P.level)
    },
    view() { return { u, ...st } }
  }
}
