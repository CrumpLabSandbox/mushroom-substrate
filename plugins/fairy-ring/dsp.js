// Fairy Ring: a ring of mycelium as a ring that carries a wave round and round. The living part of a fairy
// ring is a band: an outer edge advancing into fresh ground and an inner edge where it dies back. Each edge
// is a loop a little different in length, so the two beat. Every year the ring grows by the species' advance,
// its circumference lengthens, and its note falls.
// Waves go round each edge both ways. Real rings are often broken at one place: there, waves that move at the
// break are held back and waves that are still at it pass freely, so each note splits into two that beat.
// The disturbance can reach the whole ring or only an arc of it, and a hard key is a sharper disturbance.
import { midiHz, clamp, soften, rng } from '../kit/dsp.js'
export const create = sr => {
  const V = 6, MAXN = 8192, P = { age: 3, band: .3, gap: 0, arc: 1, ring: 1.5, bright: .5, level: 1 }, rnd = rng(41)
  const loop = () => ({ cw: new Float32Array(MAXN), ccw: new Float32Array(MAXN), n: 2, i: 0, d1: 0, d2: 0, lc: 0, la: 0, sum: 0, ap: 0 })
  const voices = Array.from({ length: V }, () => ({ key: -1, age: 0, a: loop(), b: loop(), damp: 1, hz: 0, life: 0 }))
  let spec = null, clock = 0, advance = .2, note = '', lastHz = 220
  const radius = () => .5 + advance * P.age // metres: half a metre when the key is at pitch, then it advances
  const fill = (lp, n, vel) => { // the disturbance: random pushes round the ring, or round an arc of it, sharper for a hard key
    const part = clamp(P.arc, .02, 1), m = Math.max(2, Math.round(n * part)), amp = vel * .35 / Math.sqrt(Math.sqrt(part)), sharp = clamp(vel * vel / .64, .05, 1); let x = 0, y = 0
    lp.n = n; lp.i = 0; lp.d1 = Math.round(n * .19); lp.d2 = Math.round(n * .31); lp.lc = lp.la = lp.sum = lp.ap = 0
    for (let i = 0; i < n; i++) { x += sharp * ((i < m ? (rnd() * 2 - 1) * amp : 0) - x); y += sharp * ((i < m ? (rnd() * 2 - 1) * amp : 0) - y); lp.cw[i] = x; lp.ccw[i] = y }
  }
  return {
    load(s) {
      spec = s; advance = s.numbers.tip_speed_um_h * 8.76e-3; note = ''
      const st = s.stages || [], a = st[0], b = st[st.length - 1]
      if (s.engine === '4m' && a && b && b.days - a.days > 30) { // a plot grown over years shows its own yearly advance, seasons included
        const grown = (b.reach_mm - a.reach_mm) / 1000 / ((b.days - a.days) / 365)
        if (grown > .001 && grown < 5) { advance = grown; note = 'At this size the yearly advance is the one the plot showed over its years of weather, not tip speed times a year.' }
      } else if (s.engine && s.engine !== '4m') note = 'A colony this size is far too small to be a ring. The ring is worked out from the species\' tip speed alone, as if its tips grew all year.'
    },
    set(k, v) { P[k] = v },
    noteOn(key, vel) {
      const v = voices.find(v => v.key < 0) || voices.reduce((a, b) => (a.damp < 1 ? a.age : a.age + 1e9) < (b.damp < 1 ? b.age : b.age + 1e9) ? a : b), r = radius(), f = midiHz(key) * .5 / r // a ring twice as far round sounds an octave lower
      v.key = key; v.age = ++clock; v.damp = 1; v.life = 0; v.hz = lastHz = f; vel = clamp(vel, 0, 1)
      const c = .2 + .8 * P.bright, lag = 1 + (1 - c) / c // the break and the loss of high notes each hold the wave a little; that is taken off the lap
      fill(v.a, clamp(Math.round(sr / f - lag), 4, MAXN - 1), vel); fill(v.b, clamp(Math.round(sr / f * (r + P.band) / r - lag), 4, MAXN - 1), vel) // the outer edge is longer by the width of the band
    },
    noteOff(key) { for (const v of voices) if (v.key == key && v.damp == 1) v.damp = Math.exp(-1 / (.25 * Math.max(20, v.hz))) }, // let go: the wave dies in about a quarter of a second, whatever the note
    process(L, R) {
      const n = L.length, g = Math.exp(-1 / (P.ring * sr / 60)), c = .2 + .8 * P.bright, q = -clamp(P.gap, 0, 1) * .93
      for (const v of voices) {
        if (v.key < 0) continue; let e = 0; const k = g * v.damp
        for (let i = 0; i < n; i++) {
          for (let w = 0; w < 2; w++) {
            const lp = w ? v.b : v.a, j = lp.i, N = lp.n, cw = lp.cw[j], ccw = lp.ccw[j], d1 = lp.d1, d2 = lp.d2
            lp.lc += c * (cw - lp.lc); lp.la += c * (ccw - lp.la)
            // at the break: the part of the wave that is still there passes; the part that moves there is held back
            const sum = (lp.lc + lp.la) * .5, dif = (lp.lc - lp.la) * .5, held = q * dif + lp.ap; lp.ap = dif - q * held
            lp.cw[j] = (lp.sum + held) * k; lp.ccw[j] = (lp.sum - held) * k; lp.sum = sum
            lp.i = j + 1 >= lp.n ? 0 : j + 1
            // two microphones, a fifth and a third of the way round from the break: each hears both directions as they pass it
            const m1 = lp.cw[(j + d1) % N] + lp.ccw[(j + N - d1) % N], m2 = lp.cw[(j + d2) % N] + lp.ccw[(j + N - d2) % N]
            if (w) { L[i] += m1 * .3; R[i] += m2 * .7 } else { L[i] += m1 * .7; R[i] += m2 * .3 }
            e += m1 * m1
          }
        }
        if ((v.life += n) > 3 * v.b.n && e < 1e-10) v.key = -1 // only once the wave has had time to come round
      }
      soften(L, R, P.level)
    },
    view() { const r = radius(); return { radius: r, band: P.band, advance_m_y: advance, gap: P.gap, arc: P.arc, hz: lastHz, beat_hz: lastHz * P.band / (r + P.band), sounding: voices.reduce((n, v) => n + (v.key >= 0 ? 1 : 0), 0), scaleNote: note } }
  }
}
