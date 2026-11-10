// Rain on Caps: a square metre of ground with mushrooms on it, in real rain, in real time. Drops arrive at
// the true rate for the rainfall. A drop on a cap strikes that cap, a small plate whose notes depend on its
// size and form; a drop on the ground is a short thud in the soil. Nothing is sped up.
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const P = { rain: 8, drop: 3, count: 12, size: 1, ring: .3, ground: .5, level: 1 }, rnd = rng(7), GROUND = 8
  let spec = null, caps = [], wet = 0, built = '', sinceTune = 0, soil = new Bank(GROUND, sr), hits = []
  const tune = c => { // a wet cap carries water: heavier, so lower, and more damped
    const f0 = 90 * 3 / c.r * (1 - .06 * wet), pan = c.x
    c.ov.forEach((o, k) => { c.bank.tune(k, f0 * o, P.ring * (1 - .5 * wet) / (1 + k * .5)); c.bank.hear(k, Math.cos(pan * TAU / 4) / (1 + k * .4), Math.sin(pan * TAU / 4) / (1 + k * .4)) })
  }
  const build = () => {
    const z = spec.fruit.size_cm, ov = spec.cap.overtones, r2 = rng(11)
    caps = Array.from({ length: Math.round(P.count) }, () => { const c = { r: Math.max(.3, (z[0] + r2() * (z[1] - z[0])) / 2 * P.size), x: r2(), y: r2(), ov, bank: new Bank(ov.length, sr) }; tune(c); return c })
    for (let k = 0; k < GROUND; k++) { soil.tune(k, 110 + k * 22, .012); const pan = k / (GROUND - 1); soil.hear(k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4)) }
    built = spec.slug + P.count + P.size
  }
  return {
    load(s) { spec = s; build() },
    set(k, v) { P[k] = v; if (spec && (k == 'count' || k == 'size')) build(); if (spec && k == 'ring') caps.forEach(tune) },
    process(L, R) {
      if (!spec) return
      const dt = L.length / sr, d = P.drop / 1000, perM2 = (P.rain / 3.6e6) / (Math.PI / 6 * d * d * d) // drops per square metre per second
      const mom = Math.pow(P.drop / 4, 3.5) // a drop's momentum relative to a 4 mm drop (mass as size cubed, speed rising with size)
      for (let i = 0; i < caps.length; i++) {
        const c = caps[i], rm = c.r / 100
        if (rnd() < perM2 * Math.PI * rm * rm * dt) {
          const rho = Math.sqrt(rnd()), light = Math.pow(3 / c.r, 2) // where on the cap it lands; a small cap is light, so it moves more
          for (let k = 0; k < c.ov.length; k++) c.bank.strike(k, clamp(mom * light * .5 * Math.cos(k * 1.3 * rho), -4, 4))
          hits.push([c.x, c.y, c.r, 0]); if (hits.length > 40) hits.shift()
        }
        c.bank.process(L, R)
      }
      let g = perM2 * dt // the rest of the square metre is ground
      while (g > 0 && rnd() < g) { soil.strike(rnd() * GROUND | 0, P.ground * mom * .25 * (.5 + rnd())); g -= 1; if (rnd() < .08) { hits.push([rnd(), rnd(), 0, 0]); if (hits.length > 40) hits.shift() } }
      soil.process(L, R)
      wet += (Math.min(1, P.rain / 20) - wet) * dt / 20; if ((sinceTune += dt) > .5) { sinceTune = 0; caps.forEach(tune) }
      for (const h of hits) h[3] += dt
      soften(L, R, P.level * 1.5)
    },
    view() { return { caps: caps.map(c => [c.x, c.y, c.r]), hits: hits.map(h => h.slice()), wet } }
  }
}
