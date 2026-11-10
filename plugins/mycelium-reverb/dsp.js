// Mycelium Reverb: the sound going in shakes the network, and you hear the network ring. The resonances
// are the network's modes as a web of taut strings, at a chosen stage of its growth; two microphones at the
// surface give left and right. Changing the size scales every mode. The sound can enter anywhere from the
// centre to the growing edge, and the network can be left to grow while you listen.
import { Bank, clamp } from '../kit/dsp.js'
export const create = sr => {
  const N = 24, bank = new Bank(N * 2, sr), P = { stage: .7, size: 1, ring: 2.5, damp: .5, where: .4, grow: 0, mix: .5, level: 1 }
  let spec = null, wl = new Float32Array(128), wr = new Float32Array(128), energy = 0, pos = .7, low = 0, slotA = -1, slotB = -1, fit = 1, scaleNote = '', held = 0, gain = 1
  // A network grown in the largest simulator is metres across and its real notes are far below hearing; one from
  // the smallest is so small they are near the top of hearing. The web is then resized by whole octaves until the
  // lowest note of the full-grown network lies between 100 and 1000 Hz, and the factor is stated.
  const fitTo = s => {
    const f = s.stages[s.stages.length - 1].hz[0]; fit = 1; scaleNote = ''
    if (!(f > 0)) return
    while (f * fit < 100) fit *= 2
    while (f * fit > 1000) fit /= 2
    if (fit > 1) scaleNote = `At this size the full-grown web's real lowest note is ${f < 10 ? f.toFixed(1) : f.toFixed(0)} Hz, too low to hear: it is heard as a web ${fit} times smaller.`
    if (fit < 1) scaleNote = `At this size the full-grown web's real lowest note is ${f.toFixed(0)} Hz, near the top of hearing: it is heard as a web ${1 / fit} times bigger.`
  }
  // one stage's modes into one half of the bank. A stage keeps its half for as long as it sounds (even stages
  // in the first half, odd in the second), so moving through growth never retunes a mode that is ringing loudly.
  const fill = (st, at) => {
    const c = P.where * 5
    for (let i = 0; i < N; i++) {
      const hz = (st.hz[i] || 0) * P.size * fit, ring = P.ring / (1 + hz / 1000 * P.damp * 2), r = Math.exp(-1 / (Math.max(.001, ring) * sr)), z = st.zone[i] || [0, 0, 0, 0, 0, 0]
      bank.tune(at + i, hz, ring)
      let push = 0; for (let j = 0; j < 6; j++) { const d = Math.abs(j - c); if (d < 1.5) push += Math.abs(z[j]) * (1 - d / 1.5) } // the zone the sound enters at, and a little of its neighbours
      bank.drive[at + i] = (push * 1.2 + .08) * Math.sqrt(1 - r) * 30 // the square root keeps long rings from piling up
    }
  }
  const hear = (st, at, weight) => { for (let i = 0; i < N; i++) { const m = st.mic[i] || [0, 0], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9); bank.hear(at + i, m[0] / mm * weight, m[1] / mm * weight) } }
  const tune = force => {
    if (!spec) return
    const S = spec.stages, n = S.length - 1, turning = P.grow > 0, x = turning ? clamp(pos, 0, .99999) * (n + 1) : clamp(pos, 0, 1) * n
    const a = Math.min(n, x | 0), b = a == n ? (turning && n % 2 ? 0 : n) : a + 1, t = b == a ? 0 : x - a // past the last stage a growing network gives way to a new young one
    if (force || a != slotA) { fill(S[a], a % 2 ? N : 0); slotA = a }
    if (b != a && (force || b != slotB)) { fill(S[b], b % 2 ? N : 0); slotB = b }
    if (b == a) hear(S[a], a % 2 ? 0 : N, 0) // the other half is not heard
    hear(S[a], a % 2 ? N : 0, 1 - t); if (b != a) hear(S[b], b % 2 ? N : 0, t)
    low = (S[a].hz[0] * (1 - t) + S[b].hz[0] * t) * P.size * fit
  }
  return {
    load(s) { spec = s; fitTo(s); bank.silence(); tune(1) },
    set(k, v) {
      if (k == 'grow' && spec) { const n = spec.stages.length - 1; if (v > 0 && !(P.grow > 0)) pos = pos * n / (n + 1); if (!(v > 0) && P.grow > 0) pos = Math.min(1, pos * (n + 1) / n) } // the same stage before and after growth is switched
      P[k] = v; if (k == 'stage') pos = P.grow > 0 && spec ? v * (spec.stages.length - 1) / spec.stages.length : v; if (k != 'mix' && k != 'level') tune(k != 'stage')
    },
    process(L, R, x) {
      const n = L.length; if (wl.length != n) { wl = new Float32Array(n); wr = new Float32Array(n) }
      wl.fill(0); wr.fill(0)
      if (!spec) return
      if (P.grow > 0) { pos += n / sr / P.grow; if (pos >= 1) pos -= 1; tune(0) } // the whole run, spore to full size, in `grow` seconds
      const e = bank.process(wl, wr, x || undefined); energy = Math.min(1, Math.sqrt(e) * 2)
      // a mode that sits right on a note of the sound going in can ring many times louder than the rest; the
      // network's level is turned down while it is above full scale, and let back up over about half a second
      let pk = 0; for (let i = 0; i < n; i++) { const a = Math.abs(wl[i]), b = Math.abs(wr[i]); if (a > pk) pk = a; if (b > pk) pk = b }
      held = pk > held ? pk : held + (pk - held) * (n / sr / .5)
      const g1 = held > 1 ? 1 / held : 1, dg = (g1 - gain) / n
      for (let i = 0; i < n; i++) { gain += dg; const dry = x ? x[i] * (1 - P.mix) : 0, w = P.mix * gain; let a = (dry + wl[i] * w) * P.level, b = (dry + wr[i] * w) * P.level; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b)) }
    },
    view() { return { energy, pos, low, where: P.where, growing: P.grow > 0 ? 1 : 0, turnedDown: gain, fit, days: spec ? spec.grown.days * pos : 0, scaleNote } }
  }
}
