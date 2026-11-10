// Spore Cloud: the sound of spores leaving. A mature cap sheds tens of thousands of spores a second, each
// launched at about a metre per second and pushing back on the cap as it goes. So many small pushes at random
// make a steady hiss of force on the cap, and the cap, a small plate, answers at its own notes. Discharge
// rises and falls with the air.
import { Bank, rng, soften, TAU } from '../kit/dsp.js'
export const create = sr => {
  const P = { count: 6, size: 1, rate: 30, speed: 1, waves: .5, ring: .15, level: 1 }, rnd = rng(21)
  let spec = null, caps = [], clock = 0, x = new Float32Array(128)
  const build = () => {
    const z = spec.fruit.size_cm, ov = spec.cap.overtones, r2 = rng(23)
    caps = Array.from({ length: Math.round(P.count) }, (_, c) => {
      const r = Math.max(.3, (z[0] + r2() * (z[1] - z[0])) / 2 * P.size), bank = new Bank(ov.length, sr), pan = r2(), f0 = 90 * 3 / r
      ov.forEach((o, k) => { bank.tune(k, f0 * o, P.ring / (1 + k * .4)); bank.hear(k, Math.cos(pan * TAU / 4) / (1 + k * .3), Math.sin(pan * TAU / 4) / (1 + k * .3)); bank.drive[k] = 1 })
      return { bank, r, pan, phase: r2() * 9, out: 0 }
    })
  }
  return {
    load(s) { spec = s; build() },
    set(k, v) { P[k] = v; if (spec && (k == 'count' || k == 'size' || k == 'ring')) build() },
    process(L, R) {
      if (!spec) return
      const n = L.length; if (x.length != n) x = new Float32Array(n); clock += n / sr
      for (const c of caps) {
        const air = 1 - P.waves * (.5 + .5 * Math.sin(clock * .7 + c.phase) * Math.sin(clock * .19 + c.phase * 2)) // this cap's discharge just now
        // many random pushes a second add up to noise whose strength goes as the square root of their number;
        // a small cap is light, so the same pushes move it more
        const amp = Math.sqrt(P.rate * 1000 * air / sr) * P.speed * .02 * Math.pow(3 / c.r, 1.5)
        for (let i = 0; i < n; i++) x[i] = (rnd() + rnd() + rnd() - 1.5) * amp
        c.bank.process(L, R, x); c.out = air
      }
      soften(L, R, P.level * 1.1)
    },
    view() { return { caps: caps.map(c => [c.pan, c.r, c.out]) } }
  }
}
