// Soil Filter: sound heard through soil. Soil swallows sound, the high notes first, and more so the deeper
// the listener and the wetter the ground. The sound also arrives late, by the time it takes to travel.
export const create = sr => {
  const P = { depth: 10, wet: .3, mix: 1, level: 1 }, N = sr * .1 | 0, buf = new Float32Array(N)
  let a1 = 0, a2 = 0, a3 = 0, at = 0, cut = 1000
  return {
    load() {}, set(k, v) { P[k] = v },
    process(L, R, x) {
      const n = L.length
      cut = 12000 * Math.exp(-P.depth / (14 * (1 - .65 * P.wet))) // every 14 cm of dry soil takes the top off; wet soil does it in less
      const c = 1 - Math.exp(-6.2832 * Math.max(20, cut) / sr), gain = Math.exp(-P.depth / 60), delay = Math.min(N - 1, P.depth / 100 / 150 * sr | 0) // about 150 m/s in loose soil
      for (let i = 0; i < n; i++) {
        const s = x ? x[i] : 0; buf[at] = s; const d = buf[(at + N - delay) % N]; at = (at + 1) % N
        a1 += c * (d - a1); a2 += c * (a1 - a2); a3 += c * (a2 - a3)
        const y = (s * (1 - P.mix) + a3 * gain * P.mix * 2) * P.level; L[i] = y / (1 + Math.abs(y)); R[i] = L[i]
      }
    },
    view() { return { cut } }
  }
}
