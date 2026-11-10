// Hyphal Walk: melody from the shape of the network. Walkers travel the network the way material moves
// through it, hop by hop along the hyphae. At each junction a walker prefers the thicker cord. Every stop is
// a note: its pitch is how far from the centre the walker is (further is higher, on the network's own notes),
// its length is the length of the stretch just travelled, its loudness the thickness of that cord. A dead end
// is a rest, then the walker starts again from the centre.
import { Notes, ownNotes, rng, stageAt } from '../kit/dsp.js'
export const create = sr => {
  const P = { speed: 4, bias: 1, walkers: 2, rest: .6, base: 48, stage: .7, hold: 1 }, notes = new Notes(), rnd = rng(3)
  let spec = null, adj = [], dist = [], pitch = [0], mean = 1, home = 0, walk = []
  const build = () => {
    const [st] = stageAt(spec, P.stage), n = st.xy.length / 2; adj = Array.from({ length: n }, () => []); dist = []; let far = 1, sum = 0, cnt = 0, best = 1e30
    for (let i = 0; i < n; i++) { const d = Math.hypot(st.xy[i * 2], st.xy[i * 2 + 1]); dist.push(d); far = Math.max(far, d); if (d < best) { best = d; home = i } }
    for (let e = 0; e < st.edges.length; e += 3) { const a = st.edges[e], b = st.edges[e + 1], len = Math.hypot(st.xy[a * 2] - st.xy[b * 2], st.xy[a * 2 + 1] - st.xy[b * 2 + 1]) || 1; adj[a].push([b, st.edges[e + 2], len]); adj[b].push([a, st.edges[e + 2], len]); sum += len; cnt++ }
    mean = sum / Math.max(1, cnt); dist = dist.map(d => d / far); pitch = ownNotes(spec, P.stage, 16)
    walk = Array.from({ length: 4 }, (_, k) => ({ node: home, prev: -1, wait: k * .3 * sr }))
  }
  return {
    load(s) { spec = s; build() },
    set(k, x) { P[k] = x; if (spec && k == 'stage') build() },
    advance(n) {
      if (!spec) return []
      for (let k = 0; k < Math.round(P.walkers); k++) {
        const wk = walk[k]; if ((wk.wait -= n) > 0) continue
        const opts = adj[wk.node].filter(o => o[0] != wk.prev)
        if (!opts.length) { wk.node = home; wk.prev = -1; wk.wait = P.rest * sr; continue } // a dead end: rest, then begin again
        let total = 0; for (const o of opts) total += Math.pow(o[1], P.bias)
        let pickAt = rnd() * total, go = opts[0]; for (const o of opts) { pickAt -= Math.pow(o[1], P.bias); if (pickAt <= 0) { go = o; break } }
        wk.prev = wk.node; wk.node = go[0]
        const secs = go[2] / mean / P.speed
        notes.play(P.base + pitch[Math.min(pitch.length - 1, Math.round(dist[wk.node] * (pitch.length - 1)))], Math.min(1, .3 + .16 * Math.sqrt(go[1])), secs * P.hold * sr)
        wk.wait = secs * sr
      }
      return notes.tick(n)
    },
    view() { return { at: walk.slice(0, Math.round(P.walkers)).map(w => w.node) } }
  }
}
