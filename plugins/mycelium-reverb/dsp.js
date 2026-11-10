// Mycelium Reverb: the sound going in shakes the network, and you hear the network ring. The resonances
// are the network's modes as a web of taut strings, at a chosen stage of its growth; two microphones at the
// surface give left and right. Changing the size scales every mode.
import { Bank, clamp, stageAt } from '../kit/dsp.js'
export const create = sr => {
  const N = 24, bank = new Bank(N * 2, sr), P = { stage: .7, size: 1, ring: 2.5, damp: .5, mix: .5, level: 1 }
  let spec = null, wl = new Float32Array(128), wr = new Float32Array(128), energy = 0
  const tune = () => {
    if (!spec) return
    const [a, b, t] = stageAt(spec, P.stage)
    ;[[a, 1 - t, 0], [b, t, N]].forEach(([st, weight, at]) => { // the two nearest stages, cross-faded
      for (let i = 0; i < N; i++) {
        const hz = (st.hz[i] || 0) * P.size, ring = P.ring / (1 + hz / 1000 * P.damp * 2), r = Math.exp(-1 / (Math.max(.001, ring) * sr))
        bank.tune(at + i, hz, ring)
        const m = st.mic[i] || [0, 0], mm = Math.max(Math.abs(m[0]), Math.abs(m[1]), 1e-9), z = st.zone[i] || [0, 0, 0, 0, 0, 0]
        bank.hear(at + i, m[0] / mm * weight, m[1] / mm * weight)
        bank.drive[at + i] = (Math.abs(z[1]) + Math.abs(z[3]) + .08) * Math.sqrt(1 - r) * 30 // the sound enters across the web; the square root keeps long rings from piling up
      }
    })
  }
  return {
    load(s) { spec = s; bank.silence(); tune() },
    set(k, v) { P[k] = v; if (k != 'mix' && k != 'level') tune() },
    process(L, R, x) {
      const n = L.length; if (wl.length != n) { wl = new Float32Array(n); wr = new Float32Array(n) }
      wl.fill(0); wr.fill(0)
      if (!spec) return
      const e = bank.process(wl, wr, x || undefined); energy = Math.min(1, Math.sqrt(e) * 2)
      for (let i = 0; i < n; i++) { const dry = x ? x[i] * (1 - P.mix) : 0; let a = (dry + wl[i] * P.mix) * P.level, b = (dry + wr[i] * P.mix) * P.level; L[i] = a / (1 + Math.abs(a)); R[i] = b / (1 + Math.abs(b)) }
    },
    view() { return { energy } }
  }
}
