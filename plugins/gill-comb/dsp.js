// Gill Comb: the gills as a row of thin blades. Under a cap hang dozens of gills, each a thin plate fixed
// along its top edge. No two are quite the same length, so struck together they sound as a comb of close
// notes. As the cap opens the gills spread and their notes move apart.
// What hangs under the cap depends on the species: gills (blades), spines (rods), or tubes, which are air
// columns closed at the top and have different overtones. Between the full gills hang shorter ones, which
// sound higher. Whatever strikes the gills can cross them in time, one after another, and a hard key bends
// the blades in their second way more.
import { Bank, midiHz, soften, clamp, TAU } from '../kit/dsp.js'
const UNDER = { agaric: 'gills', chanterelle: 'gills', bolete: 'tubes', bracket: 'tubes', tooth: 'spines', coral: 'spines', club: 'spines' }
// Retunes one mode of a bank while it is ringing, keeping its loudness and where it is in its swing (a plain
// retune would reread the old motion at the new pitch, which can make it far louder).
const retuneMode = (b, i, hz, sec) => {
  const c2 = b.c2[i], sw = b.sw[i]; if (!c2 || !sw) return b.tune(i, hz, sec)
  const r = Math.sqrt(c2), y1 = b.y1[i], C = (y1 * b.c1[i] / (2 * r) - b.y2[i] * r) / sw; b.tune(i, hz, sec)
  if (b.c2[i]) { const rn = Math.sqrt(b.c2[i]); b.y2[i] = (y1 * b.c1[i] / (2 * rn) - C * b.sw[i]) / rn }
}
export const create = sr => {
  const V = 5, G = 16, P = { gills: 12, open: .3, ring: .9, second: .4, short: 0, sweep: .025, level: 1 }
  const voices = Array.from({ length: V }, () => ({ bank: new Bank(G * 3, sr), key: -1, age: 0, next: 0, n: 0, t: 0, vel: 0, span: 0 }))
  let clock = 0, energy = 0, kind = 'gills', real = true, note = '', count = 0, last = voices[0]
  const hit = (v, k) => { // one gill struck: its lowest bend, and its higher ones more for a hard key
    const a = v.vel * 1.6 / Math.sqrt(v.n), hard = v.vel / .8
    v.bank.strike(k, a); v.bank.strike(G + k, a * P.second * hard / 1.6); v.bank.strike(2 * G + k, a * P.second * P.second * hard * hard / 1.6)
  }
  return {
    load(s) {
      const form = s && s.fruit ? s.fruit.form : 'agaric', size = s && s.fruit && s.fruit.size_cm || [5, 5], parts = []
      real = form in UNDER; kind = UNDER[form] || 'gills'; count = Math.round(Math.PI * (size[0] + size[1]) / 2 * 10) // about one a millimetre round the rim
      if (!real) parts.push(`This species' fruit is a ${form} and has no gills: it is played as if it had.`)
      if (s && s.has && s.has.fruit === false) parts.push('No mushrooms grow at this size: what hangs under the cap is taken from the species\' recorded form and size.')
      note = parts.join(' ')
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.reduce((a, b) => a.age < b.age ? a : b), n = clamp(Math.round(P.gills), 1, G), f0 = midiHz(key), tubes = kind == 'tubes'
      v.key = key; v.age = ++clock; v.n = n; v.vel = clamp(vel, 0, 1); v.t = 0; v.next = 0; v.span = Math.max(0, P.sweep) * sr; last = v
      for (let k = 0; k < G; k++) {
        if (k >= n) { for (let m = 0; m < 3; m++) v.bank.tune(m * G + k, 0, 0); continue }
        const x = n > 1 ? k / (n - 1) - .5 : 0, pan = x + .5, depth = k & 1 ? 1 - .29 * clamp(P.short, 0, 1) : 1 // every second one is a short gill
        // a gill a little shorter sounds a little higher: a blade or rod as one over its depth squared, an air column as one over its length
        const f = f0 * (1 + x * P.open * .5) / (tubes ? depth : depth * depth), over = tubes ? [1, 3, 5] : [1, 6.27, 17.55], gl = Math.cos(pan * TAU / 4), gr = Math.sin(pan * TAU / 4)
        for (let m = 0; m < 3; m++) { retuneMode(v.bank, m * G + k, f * over[m], P.ring / (1 + m * (tubes ? 1 : 2.3))); v.bank.hear(m * G + k, gl, gr) }
      }
      if (!v.span) { for (let k = 0; k < n; k++) hit(v, k); v.next = n } else { hit(v, 0); v.next = 1 }
    },
    noteOff() {},
    process(L, R) {
      let e = 0
      for (const v of voices) if (v.key >= 0) {
        if (v.next < v.n) { v.t += L.length; while (v.next < v.n && v.t >= v.next * v.span / Math.max(1, v.n - 1)) hit(v, v.next++) } // the strike crossing the gills
        e += v.bank.process(L, R)
      }
      energy = Math.min(1, Math.sqrt(e) * 2); soften(L, R, P.level)
    },
    view() { return { energy, under: kind, has_gills: real, real_count: count, struck: last.next, of: last.n, scaleNote: note } }
  }
}
