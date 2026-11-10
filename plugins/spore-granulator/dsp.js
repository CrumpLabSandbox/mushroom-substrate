// Spore Granulator: your sound, thrown like spores. The sound going in is kept for two seconds. Grains of it
// are launched at a rate set by the size of the species' cap. Each grain's length is a spore's flight time,
// which depends on its launch speed; how far back in the kept sound a grain is taken from follows the rule for
// how far spores land: most from just now, a few from long ago. Wind pushes grains to one side. Cup fungi and
// puffballs let go in puffs. Air drag slows a spore at once, and a grain can be read fast at first and then
// slow in the same way. In the largest simulator a far spore can found a new individual that launches too.
import { rng, clamp, TAU } from '../kit/dsp.js'
const PUFFERS = { cup: 1, morel: 1, puffball: 1, birdsnest: 1 }, G = 64, SEEN = 50
export const create = sr => {
  const N = sr * 2 | 0, buf = new Float32Array(N), P = { rate: 30, speed: 1, reach: .08, wind: 0, cap: 1, puff: 0, drag: 0, found: .25, mix: .7, level: 1 }, rnd = rng(47)
  const gOn = new Uint8Array(G), gPos = new Float64Array(G), gLen = new Float32Array(G), gI = new Float32Array(G), gDrag = new Float32Array(G), gL = new Float32Array(G), gR = new Float32Array(G)
  const seenB = new Float32Array(SEEN), seenP = new Float32Array(SEEN)
  let at = 0, live = 0, seenAt = 0, seenN = 0, capFactor = 1, habit = 0, spores = false, fruit = true, radius = 5, burst = 0, eff = 30, gain = 1, scaleNote = ''
  let siteLife = 0, siteBack = 0, sitePan = .5, founded = 0
  return {
    load(s) {
      radius = s && s.cap && s.cap.radius_cm > 0 ? s.cap.radius_cm : 5
      capFactor = clamp(radius * radius / 25, .2, 4) // gill area, and so spores a second, goes with the square of the cap's radius; 5 cm is taken as the cap that launches 30,000 a second
      habit = s && s.fruit && PUFFERS[s.fruit.form] ? .8 : 0
      spores = !!(s && (s.has ? s.has.spores : s.engine == '4m')); fruit = !s || !s.has || s.has.fruit !== false
      siteLife = 0
      scaleNote = (fruit ? '' : 'This size grows no mushrooms: the cap is the species\' recorded size, not one that grew. ') + (spores ? 'Spores are followed at this size: a grain that lands far away can found a new individual, which launches grains of its own from there for a while.' : '')
    },
    set(k, v) { P[k] = v },
    process(L, R, x) {
      const n = L.length, puff = P.puff < .02 ? habit : P.puff, meanLen = clamp(.004 + .05 * P.speed, .002, .25)
      eff = P.rate * (1 + (capFactor - 1) * P.cap)
      const g1 = 1 / Math.sqrt(Math.max(1, eff * meanLen / 1.6)), dg = (g1 - gain) / n // many grains at once are turned down so the level does not climb with the rate
      const fade = 1 - 1 / (.08 * sr), pPuff = 1.5 / sr // a puff empties in about 80 ms; one and a half puffs a second
      for (let i = 0; i < n; i++) {
        buf[at] = x ? x[i] : 0; at = (at + 1) % N; gain += dg
        if (puff > 0) { burst *= fade; if (burst < 1e-9) burst = 0; if (rnd() < pPuff) burst = 1 }
        const now = eff * (puff > 0 ? 1 - puff + puff * burst / .12 : 1) // the same number of grains overall, gathered into the puffs
        if (siteLife > 0) siteLife--
        if (rnd() < now / sr && live < G) {
          const u = rnd(); let back = clamp(P.reach * u / (1.02 - u), 0, 1.9), pan = clamp(.5 + (rnd() - .5) * .8 + P.wind * .4, 0, 1)
          const len = clamp(.004 + .05 * P.speed * (.5 + rnd()), .002, .25) * sr | 0 // faster launch, longer flight
          if (spores && P.found > 0) {
            if (siteLife > 0 && rnd() < P.found) { back = clamp(back + siteBack, 0, 1.9); pan = clamp(sitePan + (rnd() - .5) * .2, 0, 1) } // launched by the new individual, from where and when it was founded
            else if (back > 3 * P.reach && rnd() < P.found) { siteLife = 2 * sr; siteBack = back; sitePan = pan; founded++ } // a far spore founds a new individual
          }
          let g = 0; while (gOn[g]) g++
          const d = P.drag, span = len * (1 + d / 3) + 2 // how much kept sound the grain covers when it starts fast
          gOn[g] = 1; live++; gLen[g] = len; gI[g] = 0; gDrag[g] = d; gPos[g] = (at - 1 - (back * sr | 0) - span + N * 4) % N; gL[g] = Math.cos(pan * TAU / 4); gR[g] = Math.sin(pan * TAU / 4)
          seenB[seenAt] = back; seenP[seenAt] = pan; seenAt = (seenAt + 1) % SEEN; if (seenN < SEEN) seenN++
        }
        let a = 0, b = 0
        if (live) for (let g = 0; g < G; g++) {
          if (!gOn[g]) continue
          const t = gI[g] / gLen[g], p = gPos[g], i0 = p | 0, f = p - i0, s = (buf[i0 % N] * (1 - f) + buf[(i0 + 1) % N] * f) * Math.sin(Math.PI * t)
          a += s * gL[g]; b += s * gR[g]
          gPos[g] = p + 1 + gDrag[g] * (1 - t) * (1 - t); if (++gI[g] >= gLen[g]) { gOn[g] = 0; live-- } // fast off the gill, then slowed by the air
        }
        const dry = (x ? x[i] : 0) * (1 - P.mix), p = (dry + a * gain * P.mix) * P.level, q2 = (dry + b * gain * P.mix) * P.level
        L[i] = p / (1 + Math.abs(p)); R[i] = q2 / (1 + Math.abs(q2))
      }
    },
    view() {
      const seen = []; for (let k = 0; k < seenN; k++) { const j = (seenAt - seenN + k + SEEN) % SEEN; seen.push([seenB[j], seenP[j]]) }
      return { seen, live, rate: eff, capFactor, radius, puff: P.puff < .02 ? habit : P.puff, burst, site: siteLife > 0 ? [siteBack, sitePan, siteLife / (2 * sr)] : null, founded, scaleNote }
    }
  }
}
