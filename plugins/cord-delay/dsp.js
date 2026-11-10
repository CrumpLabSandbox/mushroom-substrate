// Cord Delay: echoes that travel the cords. The six stretches of the network that hold the most material
// become six delay lines. Each line's delay is the time to travel that stretch, its length set by the stretch's
// real length. Where one cord meets another of different thickness, part of a wave turns back: that reflection,
// worked out from the two cross-sections, is how much each line feeds the others. Each echo is placed left to
// right where its cord really lies, and thick cords keep more of the high sound than thin ones.
import { stageAt, clamp, TAU } from '../kit/dsp.js'
export const create = sr => {
  const N = 6, MAXS = sr * 3 | 0, lines = Array.from({ length: N }, () => ({ buf: new Float32Array(MAXS), len: 1000, cur: 1000, g: .5, lp: 0, a: 1, pan: .5, gl: .7, gr: .7, mm: 1, thick: 1 }))
  const P = { stage: .8, time: 12, feedback: .7, damp: .4, thicken: 1, own: 1, mix: .5, level: 1 }, out = new Float32Array(N)
  let spec = null, energy = 0, at = 0, faster = 1, pace = 1, fresh = true, scaleNote = ''
  const tune = () => {
    if (!spec) return
    const [st] = stageAt(spec, P.stage), E = [], cords = !spec.has || spec.has.cords !== false, p = cords ? P.thicken : 0
    for (let e = 0; e < st.edges.length; e += 3) { const a = st.edges[e], b = st.edges[e + 1]; E.push([Math.pow(Math.max(1, st.edges[e + 2]), p), Math.hypot(st.xy[a * 2] - st.xy[b * 2], st.xy[a * 2 + 1] - st.xy[b * 2 + 1]) * .01 + .05, (st.xy[a * 2] + st.xy[b * 2]) / 2]) }
    E.sort((p, q) => q[0] * q[1] - p[0] * p[1]) // the cords that hold the most material
    // the species' own speed: material moves faster in some species; the wave is taken to follow in proportion
    pace = Math.pow(14000 / clamp(spec.numbers.transport_um_h || 14000, 2000, 100000), P.own)
    let longest = 0, lo = 1e9, hi = -1e9
    for (let k = 0; k < N; k++) {
      const c = E[k % Math.max(1, E.length)] || [1, 1, 0], nx = E[(k + 1) % Math.max(1, E.length)] || [1, 1, 0], l = lines[k]
      l.mm = c[1] * (1 + k * .13); l.thick = c[0]; l.x = c[2]; longest = Math.max(longest, l.mm); lo = Math.min(lo, c[2]); hi = Math.max(hi, c[2])
      l.g = P.feedback * (.55 + .45 * Math.abs(c[0] - nx[0]) / (c[0] + nx[0] + 1e-9)) // more turns back where the thickness changes most
    }
    // a network metres across has cords too long for the three seconds kept: the wave is then taken faster, by a stated factor
    faster = 1; while (longest * P.time * pace / faster > 2500) faster *= 10
    for (let k = 0; k < N; k++) {
      const l = lines[k]
      l.len = clamp(l.mm * P.time * pace / faster / 1000 * sr, 8, MAXS - 2); if (fresh) l.cur = l.len
      l.pan = hi - lo > 1e-6 ? (l.x - lo) / (hi - lo) : k / (N - 1); l.gl = Math.cos(l.pan * TAU / 4); l.gr = Math.sin(l.pan * TAU / 4) // left to right as the cords lie
      l.a = 1 - P.damp * .9 / (1 + .25 * Math.log2(Math.max(1, l.thick))) // a thick cord loses less of the high sound each time round
    }
    fresh = false
    scaleNote = (cords ? '' : 'No cords at this size: every stretch is one hypha thick, so the echoes differ by length and place only, and the thickening control does nothing. ') + (faster > 1 ? `The cords here are up to ${(longest / 1000).toFixed(1)} m long: the wave is taken ${faster} times faster so the echoes fit in three seconds.` : '')
  }
  return {
    load(s) { spec = s; for (const l of lines) { l.buf.fill(0); l.lp = 0 } fresh = true; tune() },
    set(k, v) { P[k] = v; if (k != 'mix' && k != 'level') tune() },
    process(L, R, x) {
      if (!spec) return
      const n = L.length; let e = 0
      for (let i = 0; i < n; i++) {
        let sum = 0
        for (let k = 0; k < N; k++) {
          const l = lines[k]; if (l.cur != l.len) { const d = l.len - l.cur; l.cur += d > .25 ? .25 : d < -.25 ? -.25 : d } // a delay glides to its new length, never jumps
          const rp = at - l.cur + MAXS, i0 = rp | 0, f = rp - i0, b = l.buf; out[k] = b[i0 % MAXS] * (1 - f) + b[(i0 + 1) % MAXS] * f; sum += out[k]
        }
        const dry = x ? x[i] : 0; let wl = 0, wr = 0
        for (let k = 0; k < N; k++) {
          const l = lines[k], back = (out[k] - sum * 2 / N) * l.g // each line passes into all the others
          l.lp += l.a * (dry + back - l.lp); if (l.lp < 1e-18 && l.lp > -1e-18) l.lp = 0; l.buf[at] = l.lp // the loss applies to every trip along the cord, the first included
          wl += out[k] * l.gl; wr += out[k] * l.gr
        }
        at = (at + 1) % MAXS; e += wl * wl
        const p = (dry * (1 - P.mix) + wl * P.mix * .6) * P.level, q = (dry * (1 - P.mix) + wr * P.mix * .6) * P.level
        L[i] = p / (1 + Math.abs(p)); R[i] = q / (1 + Math.abs(q))
      }
      energy = Math.min(1, Math.sqrt(e / n) * 4)
    },
    view() { return { energy, ms: lines.map(l => l.len / sr * 1000), mm: lines.map(l => l.mm), thick: lines.map(l => l.thick), pan: lines.map(l => l.pan), back: lines.map(l => l.g), pace, faster, scaleNote } }
  }
}
