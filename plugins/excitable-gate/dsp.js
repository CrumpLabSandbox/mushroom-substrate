// Excitable Gate: a gate that behaves like an excitable cell. The loudness of the sound going in is the
// drive on one unit of the engines' electrical model. Below its threshold nothing passes. Above it the unit
// fires: a spike that runs its full course whatever the input does, and lets the sound through while it
// lasts. Then the unit must recover before it can fire again, however loud the input.
// The unit can be the first of eight along a hypha, coupled as the engines couple them: the spike then
// travels, the left ear hears the gate at the first unit and the right ear the gate further along.
// The species sets the pace: one with a longer measured interval between spikes runs slower.
import { fhnStep } from '../kit/dsp.js'
export const create = sr => {
  const K = 8, COUPLE = .6, P = { threshold: .15, speed: 6, hold: .5, pace: 1, shape: 0, travel: 0, mix: 1, level: 1 }, v = new Float32Array(K).fill(-1.2), w = new Float32Array(K).fill(-.62)
  let env = 0, gate = 0, gateR = 0, fired = 0, own = 1, interval = 70, chain = true, scaleNote = '', far = 0, wasTravel = false
  return {
    load(s) {
      interval = s && s.numbers && s.numbers.spike_interval_min > 0 ? s.numbers.spike_interval_min : 70
      own = Math.min(4, Math.max(.25, 70 / interval)) // against the oyster mushroom's 70 minutes; kept within two octaves either way
      chain = !s || !s.has || s.has.electrical !== false
      scaleNote = chain ? '' : 'No electrical network at this size: the gate is one unit on its own and the spike cannot travel, so left and right are the same.'
    },
    set(k, x) { P[k] = x },
    process(L, R, x) {
      const n = L.length, rate = P.speed * (1 + (own - 1) * P.pace), h = Math.min(.3, 40 * rate / sr) // the model's time per sample: one full cycle takes 1/rate seconds
      const travel = chain && P.travel > .01; far = travel ? Math.max(1, Math.round(P.travel * (K - 1))) : 0
      if (wasTravel && !travel) for (let k = 1; k < K; k++) { v[k] = -1.2; w[k] = -.62 } wasTravel = travel
      const level = P.hold < .5 ? 1.6 - P.hold * 4.8 : -.8 - (P.hold - .5) * .4, // from only the tip of the spike to the whole of it
         slew = Math.min(.05, .004 * Math.max(1, rate / 12)) // the gate keeps up with a fast unit
      for (let i = 0; i < n; i++) {
        const s = x ? x[i] : 0; env += (Math.abs(s) - env) * (Math.abs(s) > env ? .2 : .0004)
        // the sound pushes on the unit: a steady push as drive, and a kick, so that a sharp sound can fire it too.
        // The unit starts to fire over and over when the push reaches about 0.3, so that is where the threshold is put
        const push = clamp01(env / Math.max(.01, P.threshold) * .3), before = v[0], v0 = v[0], v1 = v[1]
        if (travel) { // the rest of the hypha: each unit is pulled toward its neighbours, as in the engines
          let left = v0; for (let k = 1; k < K; k++) { const me = v[k], right = k < K - 1 ? v[k + 1] : me; fhnStep(v, w, k, h, 0, COUPLE * (left + right - 2 * me)); left = me }
        }
        fhnStep(v, w, 0, h, push * .3, push * 1.2 + (travel ? COUPLE * (v1 - v0) : 0))
        if (before < 1 && v[0] >= 1) fired = 1
        // open while the unit is up, shut while it recovers; or, by `shape`, as open as the voltage is high
        const a = v[0], b = v[far]
        const ta = (a > level ? 1 : 0) * (1 - P.shape) + P.shape * (a < -1.2 ? 0 : a > 1.8 ? 1 : (a + 1.2) / 3), tb = far ? (b > level ? 1 : 0) * (1 - P.shape) + P.shape * (b < -1.2 ? 0 : b > 1.8 ? 1 : (b + 1.2) / 3) : ta
        gate += (ta - gate) * slew; gateR += (tb - gateR) * slew
        const y = (s * (1 - P.mix) + s * gate * P.mix) * P.level, z = (s * (1 - P.mix) + s * gateR * P.mix) * P.level; L[i] = y / (1 + Math.abs(y)); R[i] = z / (1 + Math.abs(z))
      }
      fired *= .9
    },
    view() { return { v: v[0], w: w[0], gate, env, fired, gateR, chain: Array.from(v.subarray(0, far + 1)), far, rate: P.speed * (1 + (own - 1) * P.pace), interval, scaleNote } }
  }
}
const clamp01 = x => x < 0 ? 0 : x > 1.5 ? 1.5 : x
