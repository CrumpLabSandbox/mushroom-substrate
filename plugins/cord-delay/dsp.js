// Cord Delay: echoes that travel the cords. The six thickest stretches of the network become six delay
// lines. Each line's delay is the time to travel that stretch, its length set by the stretch's real length.
// Where one cord meets another of different thickness, part of a wave turns back: that reflection, worked
// out from the two cross-sections, is how much each line feeds the others.
import { stageAt, clamp, TAU } from '../kit/dsp.js'
export const create = sr => {
  const N = 6, MAXS = sr * 3 | 0, lines = Array.from({ length: N }, () => ({ buf: new Float32Array(MAXS), at: 0, len: 1000, g: .5, lp: 0, pan: .5, mm: 1 }))
  const P = { stage: .8, time: 12, feedback: .7, damp: .4, mix: .5, level: 1 }, out = new Float32Array(N)
  let spec = null, energy = 0
  const tune = () => {
    if (!spec) return
    const [st] = stageAt(spec, P.stage), E = []
    for (let e = 0; e < st.edges.length; e += 3) { const a = st.edges[e], b = st.edges[e + 1]; E.push([st.edges[e + 2], Math.hypot(st.xy[a * 2] - st.xy[b * 2], st.xy[a * 2 + 1] - st.xy[b * 2 + 1]) * .01 + .05]) }
    E.sort((p, q) => q[0] * q[1] - p[0] * p[1]) // the cords that hold the most material
    for (let k = 0; k < N; k++) {
      const c = E[k % Math.max(1, E.length)] || [1, 1], nx = E[(k + 1) % Math.max(1, E.length)] || [1, 1], l = lines[k]
      l.mm = c[1] * (1 + k * .13); l.len = clamp(l.mm * P.time / 1000 * sr | 0, 8, MAXS - 1)
      l.g = P.feedback * (.55 + .45 * Math.abs(c[0] - nx[0]) / (c[0] + nx[0] + 1e-9)) // more turns back where the thickness changes most
      l.pan = k / (N - 1)
    }
  }
  return {
    load(s) { spec = s; for (const l of lines) { l.buf.fill(0); l.lp = 0 } tune() },
    set(k, v) { P[k] = v; if (k != 'mix' && k != 'level' && k != 'damp') tune() },
    process(L, R, x) {
      if (!spec) return
      const n = L.length, a = 1 - P.damp * .9; let e = 0
      for (let i = 0; i < n; i++) {
        let sum = 0; for (let k = 0; k < N; k++) { const l = lines[k]; out[k] = l.buf[(l.at + MAXS - l.len) % MAXS]; sum += out[k] }
        const dry = x ? x[i] : 0; let wl = 0, wr = 0
        for (let k = 0; k < N; k++) {
          const l = lines[k], back = (out[k] - sum * 2 / N) * l.g // each line passes into all the others
          l.lp += a * (back - l.lp); l.buf[l.at] = dry + l.lp; l.at = (l.at + 1) % MAXS
          wl += out[k] * Math.cos(l.pan * TAU / 4); wr += out[k] * Math.sin(l.pan * TAU / 4)
        }
        e += wl * wl
        const p = (dry * (1 - P.mix) + wl * P.mix * .6) * P.level, q = (dry * (1 - P.mix) + wr * P.mix * .6) * P.level
        L[i] = p / (1 + Math.abs(p)); R[i] = q / (1 + Math.abs(q))
      }
      energy = Math.min(1, Math.sqrt(e / n) * 4)
    },
    view() { return { energy, ms: lines.map(l => l.len / sr * 1000), mm: lines.map(l => l.mm) } }
  }
}
