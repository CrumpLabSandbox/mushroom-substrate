// Spore Cloud: the sound of spores leaving. A mature cap sheds tens of thousands of spores a second, each
// launched at about a metre per second and pushing back on the cap as it goes. So many small pushes at random
// make a steady hiss of force on the cap, and the cap, a small plate, answers at its own notes. Discharge
// rises and falls with the air.
// Not every fruit body sheds this way. Gilled and pored ones launch spores one by one from a drop of water that
// has to condense first, so dry air stops them. Cups, morels and clubs fire their spore sacs together in puffs.
// Puffballs and bird's nests do nothing until a raindrop knocks the spores out.
import { Bank, rng, soften, clamp, TAU } from '../kit/dsp.js'
// how a fruit form sheds: 1 launched one by one, 2 in puffs, 3 knocked out by raindrops, 0 not thrown at all in life
export const WAY = { cup: 2, morel: 2, club: 2, puffball: 3, birdsnest: 3, truffle: 0, stinkhorn: 0, none: 0 }
export const wayOf = s => WAY[s.fruit.form] == null ? 1 : WAY[s.fruit.form]
export const create = sr => {
  const P = { count: 6, size: 1, rate: 30, speed: 1, waves: .5, how: 0, humid: 95, day: 0, ring: .15, level: 1 }, rnd = rng(21)
  let spec = null, caps = [], clock = 0, x = new Float32Array(128), H = 95, hour = -1, way = 1, note = ''
  const tune = c => spec.cap.overtones.forEach((o, k) => { c.bank.tune(k, 270 / c.r * o, P.ring / (1 + k * .4)); c.bank.hear(k, Math.cos(c.pan * TAU / 4) / (1 + k * .3), Math.sin(c.pan * TAU / 4) / (1 + k * .3)); c.bank.drive[k] = 1 })
  const build = () => {
    const z = spec.fruit.size_cm, ov = spec.cap.overtones, r2 = rng(23)
    caps = Array.from({ length: Math.round(P.count) }, () => { const c = { r: Math.max(.3, (z[0] + r2() * (z[1] - z[0])) / 2 * P.size), bank: new Bank(ov.length, sr), pan: r2(), phase: 0, out: 0, env: 0 }; c.phase = r2() * 9; tune(c); return c })
    const has = k => !spec.has || spec.has[k] !== false
    note = [has('fruit') ? '' : 'No mushrooms grow at this size: the caps are the species\' recorded sizes.', has('spores') ? '' : 'This size does not follow spores leaving: the rate is the published figure you set, not the simulator\'s.'].filter(Boolean).join(' ')
  }
  return {
    load(s) { spec = s; build() },
    set(k, v) { P[k] = v; if (spec && (k == 'count' || k == 'size')) build(); if (spec && k == 'ring') caps.forEach(tune) },
    process(L, R) {
      if (!spec) return
      const n = L.length, dt = n / sr; if (x.length != n) x = new Float32Array(n); clock += dt
      way = P.how > .5 ? Math.round(P.how) : wayOf(spec) || 1
      // the air: damp at night, drier by day. A spore is launched by a drop of water that must condense first, so dry air stops it
      hour = P.day > 0 ? clock / P.day * 24 % 24 : -1; H = clamp(P.humid - (hour < 0 ? 0 : 25 * (.5 - .5 * Math.cos(hour / 24 * TAU))), 0, 100)
      const q = clamp((H - 50) / 40, 0, 1), damp = way == 3 ? 1 : q * q * (3 - 2 * q)
      for (const c of caps) {
        const air = (1 - P.waves * (.5 + .5 * Math.sin(clock * .7 + c.phase) * Math.sin(clock * .19 + c.phase * 2))) * damp; let e = air // this cap's discharge just now
        if (way == 2) { // puffs: thousands of spore sacs fire together, then the cup is quiet while the next ripen
          if (rnd() < .7 * air * dt) c.env = 1
          e = c.env * 12; c.env *= Math.exp(-dt / .12)
        } else if (way == 3) { // light rain, 2 mm an hour in 2 mm drops: each drop on the skin knocks out a cloud of spores in a few hundredths of a second
          const rm = c.r / 100; if (rnd() < 133 * Math.PI * rm * rm * dt) { c.env = 1; for (let k = 0; k < c.bank.n; k++) c.bank.strike(k, .15 * Math.cos(k * 1.3 * rnd())) }
          e = c.env * 64; c.env *= Math.exp(-dt / .03)
        }
        // many random pushes a second add up to noise whose strength goes as the square root of their number;
        // a small cap is light, so the same pushes move it more (held to three times, or the smallest caps drown the rest)
        const amp = Math.sqrt(P.rate * 1000 * e / sr) * P.speed * .02 * Math.min(3, Math.pow(3 / c.r, 1.5))
        if (amp > 1e-7) for (let i = 0; i < n; i++) x[i] = (rnd() + rnd() + rnd() - 1.5) * amp; else x.fill(0)
        c.bank.process(L, R, x); c.out = Math.min(1, way == 1 ? air : c.env)
      }
      soften(L, R, P.level * 1.1)
    },
    view() { return { caps: caps.map(c => [c.pan, c.r, c.out]), humid: H, hour, way, thrown: spec ? wayOf(spec) > 0 : true, scaleNote: note } }
  }
}
