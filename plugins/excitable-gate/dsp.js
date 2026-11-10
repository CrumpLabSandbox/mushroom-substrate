// Excitable Gate: a gate that behaves like an excitable cell. The loudness of the sound going in is the
// drive on one unit of the engines' electrical model. Below its threshold nothing passes. Above it the unit
// fires: a spike that runs its full course whatever the input does, and lets the sound through while it
// lasts. Then the unit must recover before it can fire again, however loud the input.
import { fhnStep } from '../kit/dsp.js'
export const create = sr => {
  const P = { threshold: .5, speed: 6, hold: .5, mix: 1, level: 1 }, v = new Float32Array([-1.2]), w = new Float32Array([-.62])
  let env = 0, gate = 0, fired = 0
  return {
    load() {}, set(k, x) { P[k] = x },
    process(L, R, x) {
      const n = L.length, h = 40 * P.speed / sr // the model's time per sample: one full cycle takes 1/speed seconds
      for (let i = 0; i < n; i++) {
        const s = x ? x[i] : 0; env += (Math.abs(s) - env) * (Math.abs(s) > env ? .2 : .0004)
        // the sound pushes on the unit: a steady push as drive, and a kick, so that a sharp sound can fire it too
        const push = clamp01(env / Math.max(.01, P.threshold)), before = v[0]; fhnStep(v, w, 0, Math.min(.3, h), push * .3, push * 1.2)
        if (before < 1 && v[0] >= 1) fired = 1
        gate += ((v[0] > -.6 + P.hold * -.4 ? 1 : 0) - gate) * .004 // open while the unit is up, shut while it recovers
        const y = (s * (1 - P.mix) + s * gate * P.mix) * P.level; L[i] = y / (1 + Math.abs(y)); R[i] = L[i]
      }
      fired *= .9
    },
    view() { return { v: v[0], w: w[0], gate, env, fired } }
  }
}
const clamp01 = x => x < 0 ? 0 : x > 1.5 ? 1.5 : x
