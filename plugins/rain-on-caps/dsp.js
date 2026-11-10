// Rain on Caps: a square metre of ground with mushrooms on it, in real rain, in real time. Drops arrive at
// the true rate for the rainfall. A drop on a cap strikes that cap, a small plate whose notes depend on its
// size and form; a drop on the ground is a short thud in the soil. Nothing is sped up.
// Real rain is a mix of drop sizes, many small and a few large, and it comes in showers as rain cells pass.
// A key lets one drop fall on one cap.
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const P = { rain: 8, drop: 3, spread: .5, showers: 0, count: 12, size: 1, ring: .3, ground: .5, level: 1 }, rnd = rng(7), GROUND = 8
  let spec = null, caps = [], order = [], wet = 0, sinceTune = 0, soil = new Bank(GROUND, sr), hits = [], clock = 0, now = P.rain, note = ''
  const tune = c => { // a wet cap carries water: heavier, so lower, and more damped
    const f0 = 90 * 3 / c.r * (1 - .06 * wet), pan = c.x
    c.ov.forEach((o, k) => { c.bank.tune(k, f0 * o, P.ring * (1 - .5 * wet) / (1 + k * .5)); c.bank.hear(k, Math.cos(pan * TAU / 4) / (1 + k * .4), Math.sin(pan * TAU / 4) / (1 + k * .4)) })
  }
  const build = () => {
    const z = spec.fruit.size_cm, ov = spec.cap.overtones, r2 = rng(11)
    caps = Array.from({ length: Math.round(P.count) }, () => { const c = { r: Math.max(.3, (z[0] + r2() * (z[1] - z[0])) / 2 * P.size), x: r2(), y: r2(), ov, bank: new Bank(ov.length, sr) }; tune(c); return c })
    order = caps.slice().sort((a, b) => b.r - a.r) // for the keys: biggest cap lowest
    for (let k = 0; k < GROUND; k++) { soil.tune(k, 110 + k * 22, .012); const pan = k / (GROUND - 1); soil.hear(k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4)) }
    note = !spec.has || spec.has.fruit !== false ? '' : 'No mushrooms grow at this size: the caps are the species\' recorded sizes, not grown ones.'
  }
  // one drop's size in mm: an exponential mix about the chosen size (Marshall and Palmer's finding for rain)
  const size = () => P.drop * clamp(1 + P.spread * (-Math.log(1 - rnd()) - 1), .3, 3)
  const mom = d => Math.pow(d / 4, 3.5) // a drop's momentum relative to a 4 mm drop (mass as size cubed, speed rising with size)
  const land = (c, d) => {
    const rho = Math.sqrt(rnd()), light = Math.pow(3 / c.r, 2), m = mom(d) // where on the cap it lands; a small cap is light, so it moves more
    for (let k = 0; k < c.ov.length; k++) c.bank.strike(k, clamp(m * light * .5 * Math.cos(k * 1.3 * rho), -4, 4))
    hits.push([c.x, c.y, c.r, 0, d]); if (hits.length > 40) hits.shift()
  }
  return {
    load(s) { spec = s; build() },
    set(k, v) { P[k] = v; if (spec && (k == 'count' || k == 'size')) build(); if (spec && k == 'ring') caps.forEach(tune) },
    noteOn(key, vel) { if (order.length) land(order[((key - 48) % order.length + order.length) % order.length], P.drop * (.5 + vel)) }, // let one drop fall on one cap
    noteOff() {},
    process(L, R) {
      if (!spec) return
      const dt = L.length / sr, d = P.drop / 1000, s = P.spread; clock += dt
      // rain cells pass over in a minute or so: between them the rain thins
      now = P.rain * (1 - P.showers * (1 - (.5 + .5 * Math.sin(clock * .16)) * (.6 + .4 * Math.sin(clock * .047 + 1))))
      const perM2 = (now / 3.6e6) / (Math.PI / 6 * d * d * d * (1 + 3 * s * s + 2 * s * s * s)) // drops per square metre per second: rainfall over the mean volume of a drop
      for (let i = 0; i < caps.length; i++) {
        const c = caps[i], rm = c.r / 100; let g = perM2 * Math.PI * rm * rm * dt, most = 6
        while (g > 0 && most-- && rnd() < g) { land(c, size()); g -= 1 }
        c.bank.process(L, R)
      }
      let g = perM2 * dt, most = 40 // the rest of the square metre is ground
      while (g > 0 && most-- && rnd() < g) { soil.strike(rnd() * GROUND | 0, P.ground * mom(size()) * .25 * (.5 + rnd())); g -= 1; if (rnd() < .08) { hits.push([rnd(), rnd(), 0, 0, 0]); if (hits.length > 40) hits.shift() } }
      soil.process(L, R)
      wet += (Math.min(1, now / 20) - wet) * dt / 20; if ((sinceTune += dt) > .5) { sinceTune = 0; caps.forEach(tune) }
      for (const h of hits) h[3] += dt
      soften(L, R, P.level * 1.5)
    },
    view() { return { caps: caps.map(c => [c.x, c.y, c.r]), hits: hits.map(h => h.slice()), wet, rainNow: now, scaleNote: note } }
  }
}
