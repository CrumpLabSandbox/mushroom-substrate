// Rhizomorph Bass: one long cord as a string. A rhizomorph is not even along its length: it has thick and
// thin stretches. A wave travelling along it partly turns back wherever the thickness changes, so the cord
// rings with echoes inside it. Three stretches, two joints; the amount turned back at each joint is worked
// out from the two cross-sections.
// A hard key is a sharp, narrow pluck and a soft key a broad one. The middle of the cord can thicken while
// the note sounds, as cords do where flow passes, so the echoes grow in. An old cord has a hard rind: a stiff
// cord carries high notes faster than low ones, so its overtones go sharp.
import { midiHz, clamp, soften } from '../kit/dsp.js'
export const create = sr => {
  const V = 5, MAXN = 4096, P = { contrast: .5, joint: .35, pluck: .2, thicken: 0, rind: 0, ring: .6, bright: .6, level: 1 }
  const mk = () => ({ key: -1, age: 0, n: [1, 1, 1], r: [0, 1, 2].map(() => new Float32Array(MAXN)), l: [0, 1, 2].map(() => new Float32Array(MAXN)), at: 0, lp: [0, 0], k: [0, 0], live: 0, t: 0, q: 0, ap: new Float32Array(8), grown: 1 })
  const voices = Array.from({ length: V }, mk)
  let spec = null, clock = 0, last = null, cords = true, cordMax = 60, note = ''
  // the delay, in samples, that one stage of the rind's stiffness adds at a given pitch
  const stiffDelay = (q, w) => (w + 2 * Math.atan(q * Math.sin(w) / (1 - q * Math.cos(w)))) / w
  const joints = (v, grown) => { // how much turns back at each joint: a string's resistance to a wave goes as its cross-section
    const thick = 1 + P.contrast * Math.sqrt(cordMax) * grown, Z = [1, thick, 1]
    v.k[0] = (Z[1] - Z[0]) / (Z[1] + Z[0]); v.k[1] = (Z[2] - Z[1]) / (Z[2] + Z[1]); v.grown = grown
  }
  // A cord with a thick middle does not sound the note an even cord of its length would: its lowest note is
  // higher, by this factor (1 for an even cord). The cord is lengthened by it, so its lowest note is the key.
  const raised = (a, thick) => { let lo = 0, hi = Math.min(Math.PI / (2 * a), Math.PI / (1 - 2 * a)); for (let i = 0; i < 40; i++) { const x = (lo + hi) / 2; Math.tan(a * x) * Math.tan((1 - 2 * a) * x / 2) < thick ? lo = x : hi = x } return lo / Math.PI }
  return {
    load(s) {
      spec = s; cords = !(s.has && s.has.cords === false); cordMax = cords ? Math.max(0, s.numbers.cord_max || 0) : 0
      note = !cords ? 'No cords at this size: the string is one even hypha, so nothing turns back inside it and the thickness controls do nothing.' : cordMax ? '' : 'This species makes no cords in the model: the string is even, so nothing turns back inside it.'
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.find(v => v.key < 0) || voices.reduce((a, b) => (a.live < 1 ? a.age : a.age + 1e9) < (b.live < 1 ? b.age : b.age + 1e9) ? a : b)
      const a = clamp(P.joint, .1, .45), f = midiHz(key), w = 2 * Math.PI * f / sr, pass = sr / (2 * f) * raised(a, 1 + P.contrast * Math.sqrt(cordMax)) // samples for one pass along the cord, lengthened so its lowest note is the key
      const total = clamp(pass, 8, MAXN * 2), ends = total * a, soft = .15 + .85 * P.bright, dull = (1 - soft) / soft // the loss at each end holds the wave about this many samples
      let q = clamp(P.rind, 0, 1) * .9; while (q > .01 && stiffDelay(q, w) + dull / 2 > ends * .6) q *= .8 // a short cord cannot hold as much stiffness
      const held = Math.min(ends - 2, stiffDelay(q, w) + dull / 2) // what the rind and the loss add at each end is taken off that end's length (which the wave crosses twice), so the note stays at the key
      v.key = key; v.age = ++clock; v.live = 1; v.t = 0; v.q = q; v.ap.fill(0)
      v.n[0] = v.n[2] = clamp(Math.round(ends - held), 2, MAXN - 1); v.n[1] = clamp(Math.round(total - 2 * held) - 2 * v.n[0], 2, MAXN - 1) // thin, thick, thin
      for (let s = 0; s < 3; s++) { v.r[s].fill(0); v.l[s].fill(0) }
      joints(v, P.thicken > 0 && cordMax ? 0 : 1)
      const s0 = P.pluck < .5 ? 0 : 1, n = v.n[s0], at = Math.floor(clamp(P.pluck * 2 % 1, .05, .95) * n), wide = n * clamp(1.4 - vel, .15, 1.4) // a hard pluck is a narrow bump
      for (let i = 0; i < n; i++) { const d = Math.max(0, 1 - Math.abs(i - at) / wide); v.r[s0][i] += vel * d * d * .5; v.l[s0][i] += vel * d * d * .5 } // the pluck: a bump that sets off both ways
      v.at = 0; v.lp = [0, 0]; last = v
    },
    noteOff(key) { for (const v of voices) if (v.key == key && v.live >= 1) v.live = .25 },
    process(L, R) {
      const n = L.length, loss = Math.exp(-1 / (P.ring * 6 * sr / 100)), a = .15 + .85 * P.bright
      for (const v of voices) {
        if (v.key < 0) continue
        if (v.grown < 1) { v.t += n / sr; joints(v, Math.min(1, v.t / Math.max(.01, P.thicken))) } // the middle stretch thickens as the note sounds
        const [n0, n1, n2] = v.n, [k0, k1] = v.k, c = -v.q, ap = v.ap; let e = 0
        for (let i = 0; i < n; i++) {
          const t = v.at, o0 = v.r[0][t % n0], o1 = v.r[1][t % n1], o2 = v.r[2][t % n2], p0 = v.l[0][t % n0], p1 = v.l[1][t % n1], p2 = v.l[2][t % n2]
          // the two ends are held: the wave turns back, losing a little, the high notes most
          v.lp[0] += a * (-p0 * loss - v.lp[0]); v.lp[1] += a * (-o2 * loss - v.lp[1])
          // the rind: two stages at each end that hold the low notes back longer than the high ones
          let y = v.lp[0], z = c * y + ap[0]; ap[0] = y - c * z; y = z; z = c * y + ap[1]; ap[1] = y - c * z; v.r[0][t % n0] = z
          y = v.lp[1]; z = c * y + ap[2]; ap[2] = y - c * z; y = z; z = c * y + ap[3]; ap[3] = y - c * z; v.l[2][t % n2] = z
          // the joints: part passes, part turns back
          v.r[1][t % n1] = (1 + k0) * o0 - k0 * p1; v.l[0][t % n0] = k0 * o0 + (1 - k0) * p1
          v.r[2][t % n2] = (1 + k1) * o1 - k1 * p2; v.l[1][t % n1] = k1 * o1 + (1 - k1) * p2
          const fade = v.live < 1 ? (v.live *= .9997, v.live * 4) : 1, s = (o1 + p1) * fade
          L[i] += s * .8; R[i] += (o1 * .6 + p1) * .8 * fade; e += s * s; v.at++
        }
        if (e < 1e-10 && v.at > 4 * (n0 + n1 + n2)) { v.key = -1; v.live = 0 }
      }
      soften(L, R, P.level)
    },
    view() { return { k: last ? Array.from(last.k) : [0, 0], joint: P.joint, thick: 1 + P.contrast * Math.sqrt(cordMax) * (last ? last.grown : 1), grown: last ? last.grown : 1, cord_max: cordMax, rind: last ? last.q : 0, sounding: voices.reduce((n, v) => n + (v.key >= 0 ? 1 : 0), 0), scaleNote: note } }
  }
}
