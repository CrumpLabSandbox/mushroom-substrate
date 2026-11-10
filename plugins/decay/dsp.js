// Decay: a fallen log over years, heard as a wooden bar. Raindrops strike it. As fungi rot it, the wood
// loses stiffness and weight, and a bar's note goes as the square root of stiffness over weight. White rot
// takes everything together, so the note sinks slowly and the ring shortens. Brown rot takes the cellulose
// and leaves the lignin: stiffness goes long before weight does, the note drops sharply, and the wood
// cracks into cubes, each crack a small strike of its own.
// The rot is not even along the log. The fungus enters at one end and crosses at the pace of its own tips, so
// a slow species leaves one end soft and the other sound, and each note of the bar falls by how much of its
// bending happens in the soft part. How fast the wood goes follows the species' temperature curve and whether
// it is a wood-rotter at all. Once established, the species' own fruit bodies come out on the log and the
// rain strikes them too.
import { Bank, rng, clamp, soften, TAU } from '../kit/dsp.js'
const BL = [4.730041, 7.853205, 10.995608, 14.137165, 17.27876], BAR = [1, 2.76, 5.4, 8.93, 13.34], SEG = 24, NB = BAR.length, MAXF = 12
const WOOD = { 'white-rot': 1, 'brown-rot': 1, 'tree-parasite': .8, 'litter-soil': .4 } // how readily it rots wood; anything else .15
const has = (s, k) => !s || !s.has || s.has[k] !== false
// the cardinal temperature curve (docs/research/06 section 4): 0 at the coldest and hottest it grows at, 1 at its best
export const gT = (T, a, o, b) => T <= a || T >= b ? 0 : clamp((T - b) * (T - a) * (T - a) / ((o - a) * ((o - a) * (T - o) - (o - b) * (o + a - 2 * T))), 0, 1)
export const create = sr => {
  const P = { decay: .12, years: 60, kind: 0, length: 1, rain: 6, ring: 1.2, temp: 22, fruit: 3, level: 1 }, rnd = rng(43), bank = new Bank(NB, sr)
  // the shapes of a free bar's first five bending modes, and how sharply each bends, at SEG places along it
  const phi = [], cur = [], sumP = [], sumC = [], uu = new Float32Array(SEG), hz = new Float32Array(NB)
  for (let k = 0; k < NB; k++) {
    const b = BL[k], s = (Math.cosh(b) - Math.cos(b)) / (Math.sinh(b) - Math.sin(b)), p = new Float32Array(SEG), c = new Float32Array(SEG); let sp = 0, sc = 0
    for (let j = 0; j < SEG; j++) { const x = b * (j + .5) / SEG; p[j] = Math.cosh(x) + Math.cos(x) - s * (Math.sinh(x) + Math.sin(x)); c[j] = Math.cosh(x) - Math.cos(x) - s * (Math.sinh(x) - Math.sin(x)); sp += p[j] * p[j]; sc += c[j] * c[j] }
    phi.push(p); cur.push(c); sumP.push(sp); sumC.push(sc)
  }
  const fruits = Array.from({ length: MAXF }, () => ({ bank: null, x: 0, full: 1, r: 0, grown: 0 }))
  let spec = null, age = P.decay, auto = 0, count = 0, lag = .5, pace = 1, note = '', st = { u: 0, f: 460, stiff: 1, weight: 1, brown: false }, crack = 0, nf = 0
  const tune = () => {
    const brown = P.kind > 1.5 || (P.kind < .5 && !!spec && spec.fruit.trophic == 'brown-rot'); let mu = 0, ms = 0, mw = 0, m2 = 0
    for (let j = 0; j < SEG; j++) { const u = uu[j] = clamp(age * (1 + lag) - lag * (j + .5) / SEG, 0, .97); mu += u; m2 += u * u; ms += brown ? Math.pow(1 - u, 3) * .97 + .03 : 1 - .7 * u; mw += brown ? 1 - .5 * u : 1 - .6 * u }
    const f0 = 460 / (P.length * P.length) // a sound bar 10 cm thick: 460 Hz at one metre, falling as length squared
    for (let k = 0; k < NB; k++) {
      let S = 0, W = 0, D = 0; const p = phi[k], c = cur[k]
      for (let j = 0; j < SEG; j++) { const u = uu[j], c2 = c[j] * c[j]; S += (brown ? Math.pow(1 - u, 3) * .97 + .03 : 1 - .7 * u) * c2; W += (brown ? 1 - .5 * u : 1 - .6 * u) * p[j] * p[j]; D += u * c2 }
      hz[k] = f0 * BAR[k] * Math.sqrt((S / sumC[k]) / (W / sumP[k])); bank.tune(k, hz[k], P.ring * (1 - .85 * D / sumC[k]) / (1 + k * .6)); bank.hear(k, .7 - k * .08, .5 + k * .08)
    }
    crack = m2 / SEG; st = { u: mu / SEG, f: hz[0], stiff: ms / SEG, weight: mw / SEG, brown }
    // the species' fruit bodies come out one after another once the fungus is established, and expand
    nf = spec && has(spec, 'fruit') ? Math.min(MAXF, Math.round(P.fruit)) : 0
    for (let i = 0; i < nf; i++) {
      const F = fruits[i], g = clamp((age - .1 - .07 * i) / .2, 0, 1); F.grown = g; if (!F.bank) continue
      const r = F.full * (.15 + .85 * g); if (Math.abs(r - F.r) < F.r * .01) continue; F.r = r
      const ov = spec.cap.overtones, pan = .15 + .7 * F.x
      for (let k = 0; k < ov.length; k++) { F.bank.tune(k, g > 0 ? 270 / r * ov[k] : 0, .25 / (1 + k * .5)); F.bank.hear(k, Math.cos(pan * TAU / 4) / (1 + k * .4), Math.sin(pan * TAU / 4) / (1 + k * .4)) }
    }
  }
  const adapt = () => {
    if (!spec) return
    const n = spec.numbers, z = spec.fruit.size_cm, r2 = rng(47), cords = has(spec, 'cords') && n.cord_max > 0
    lag = clamp(230 / Math.max(1, n.tip_speed_um_h), .1, 3) * .5 * (cords ? .6 : 1) // slow tips: the far end is reached late. Cords carry the fungus along faster
    for (const F of fruits) { F.bank = new Bank(spec.cap.overtones.length, sr); F.x = r2(); F.full = Math.max(.3, (z[0] + r2() * (z[1] - z[0])) / 2); F.r = 0 }
    note = [has(spec, 'weather') ? '' : 'No weather at this size: the fungus is held at its best temperature.', has(spec, 'fruit') ? '' : 'No mushrooms grow at this size: the log stays bare.'].filter(Boolean).join(' ')
  }
  return {
    load(s) { spec = s; adapt(); tune() },
    set(k, v) { P[k] = v; if (k == 'decay') auto = 0; age = clamp(P.decay + auto, 0, 1); tune() },
    process(L, R) {
      const n = L.length, dt = n / sr
      pace = spec ? (WOOD[spec.fruit.trophic] || .15) * (has(spec, 'weather') ? gT(P.temp, spec.numbers.t_min_c, spec.numbers.t_opt_c, spec.numbers.t_max_c) : 1) : 1
      if (P.years > 0) {
        auto += dt / P.years * pace; age = clamp(P.decay + auto, 0, 1)
        if (P.decay + auto > 1.1) { auto = -P.decay; age = 0; for (let k = 0; k < NB; k++) bank.strike(k, 1.2 / (1 + k * .3)); count = 1e9 } // the log has gone, and another falls
      }
      if ((count += n) > 2400) { count = 0; tune() }
      if (rnd() < P.rain * dt) { const j = Math.min(SEG - 1, rnd() * SEG | 0); for (let k = 0; k < NB; k++) bank.strike(k, .3 * phi[k][j] / (1 + k * .3)) } // a drop lands somewhere along it: each mode by how much it moves there
      if (st.brown && rnd() < crack * 14 * dt) for (let k = 1; k < NB; k++) bank.strike(k, (rnd() - .5) * .35) // brown rot cracking
      bank.process(L, R)
      for (let i = 0; i < nf; i++) { // rain on the fruit bodies: each gets its share of the drops by its area beside the log's
        const F = fruits[i]; if (!F.bank || F.grown <= 0) continue
        const rm = F.r / 100; if (rnd() < P.rain * Math.PI * rm * rm / (P.length * .1) * dt) { const rho = Math.sqrt(rnd()), light = Math.min(2, 9 / (F.r * F.r)); for (let k = 0; k < F.bank.n; k++) F.bank.strike(k, .5 * light * Math.cos(k * 1.3 * rho)) }
        F.bank.process(L, R)
      }
      soften(L, R, P.level)
    },
    view() {
      const profile = [], fr = []; for (let j = 0; j < SEG; j += 2) profile.push((uu[j] + uu[j + 1]) / 2)
      for (let i = 0; i < nf; i++) if (fruits[i].grown > 0) fr.push([fruits[i].x, fruits[i].r, fruits[i].grown])
      return { ...st, age, front: lag > 0 ? clamp(age * (1 + lag) / lag, 0, 1) : 1, profile, modes: Array.from(hz), pace, temp: P.temp, fruits: fr, scaleNote: note }
    }
  }
}
