// Cap Drums: each key is a mushroom cap of a different size, struck by a raindrop. A cap is a small plate:
// the bigger it is, the lower it sounds. The species' fruit form sets the overtones.
// How hard a key is hit is the size of the drop: a big drop is louder, but it also takes longer to land, so
// it wakes the high overtones less. Each drop leaves water on its cap, so a cap played often gets wetter,
// lower and deader, and dries when left alone. A young cap is a closed button, near a ball, and opens out.
import { Bank, midiHz, clamp, soften, TAU } from '../kit/dsp.js'
const BALL = [1, 1.39, 1.86, 2.27, 2.9] // the overtone set used for ball-shaped fruit, here for a closed button
// Retunes one mode of a bank while it is ringing, keeping its loudness and where it is in its swing (a plain
// retune would reread the old motion at the new pitch, which can make it far louder).
const retuneMode = (b, i, hz, sec) => {
  const c2 = b.c2[i], sw = b.sw[i]; if (!c2 || !sw) return b.tune(i, hz, sec)
  const r = Math.sqrt(c2), y1 = b.y1[i], C = (y1 * b.c1[i] / (2 * r) - b.y2[i] * r) / sw; b.tune(i, hz, sec)
  if (b.c2[i]) { const rn = Math.sqrt(b.c2[i]); b.y2[i] = (y1 * b.c1[i] / (2 * rn) - C * b.sw[i]) / rn }
}
export const create = sr => {
  const V = 12, voices = Array.from({ length: V }, () => ({ bank: new Bank(6, sr), key: -1, age: 0 }))
  const P = { ring: .6, wet: .15, pos: .3, open: 1, soak: .25, level: 1 }, water = new Float32Array(128), when = new Float64Array(128), DRY = 6
  let spec = null, clock = 0, now = 0, last = { key: 60, age: 9, wet: .15, drop: 0 }, energy = 0, note = '', fruits = true
  const wetOf = key => water[key] * Math.exp(-(now - when[key]) / DRY) // water left by earlier drops, drying away
  return {
    load(s) {
      spec = s; for (const v of voices) v.bank.silence(); water.fill(0)
      fruits = !(s.has && s.has.fruit === false)
      note = fruits ? '' : 'No mushrooms grow at this size: the cap is worked out from the species\' recorded size alone, and is played fully open.'
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      if (!spec) return
      const kk = clamp(Math.round(key), 0, 127), v = voices.reduce((a, b) => a.age < b.age ? a : b), ov = spec.cap.overtones, open = fruits ? clamp(P.open, 0, 1) : 1
      const wet = clamp(P.wet + wetOf(kk), 0, 1), f0 = midiHz(key) * (1 - .06 * wet), pan = clamp((key - 36) / 48, 0, 1)
      // the drop: 1 to 5 mm across, falling at its terminal speed; it pushes for about the time it takes to fall its own width
      const mm = 1 + 4 * clamp(vel, 0, 1), speed = 9.65 - 10.3 * Math.exp(-.6 * mm), contact = mm * .001 / speed
      v.key = key; v.age = ++clock
      for (let k = 0; k < 6; k++) {
        if (k >= ov.length) { v.bank.tune(k, 0, 0); continue }
        const r = k < BALL.length ? BALL[k] + (ov[k] - BALL[k]) * open : ov[k], f = f0 * r, x = Math.PI * f * contact
        retuneMode(v.bank, k, f, P.ring * (1 - .5 * wet) / (1 + k * .5)) // a wet cap is heavier and more damped
        v.bank.hear(k, Math.cos(pan * TAU / 4), Math.sin(pan * TAU / 4))
        // where on the cap the drop lands decides which overtones it wakes; a longer push reaches the high ones less
        v.bank.strike(k, vel * Math.cos(k * 1.3 * P.pos) / (1 + k * .3) * 1.6 / Math.sqrt(1 + x * x) * (k < BALL.length ? 1 : open))
      }
      water[kk] = clamp(wetOf(kk) + P.soak * .3 * (.3 + vel), 0, 1); when[kk] = now
      last = { key, age: 0, wet, drop: mm }
    },
    noteOff() {}, // a struck cap rings until it stops
    process(L, R) { let e = 0; for (const v of voices) e += v.bank.process(L, R); energy = Math.min(1, Math.sqrt(e) * 3); now += L.length / sr; last.age += L.length / sr; soften(L, R, P.level) },
    view() {
      const hz = midiHz(last.key)
      return { energy, key: last.key, age: last.age, wet: clamp(P.wet + wetOf(clamp(Math.round(last.key), 0, 127)), 0, 1), drop_mm: last.drop, open: fruits ? P.open : 1, radius_cm: 270 / hz, own_key: spec ? 69 + 12 * Math.log2(spec.cap.lowest_hz / 440) : 60, scaleNote: note }
    }
  }
}
