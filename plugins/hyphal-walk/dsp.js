// Hyphal Walk: melody from the shape of the network. Walkers travel the network the way material moves
// through it, hop by hop along the hyphae. At each junction a walker prefers the thicker cord. Every stop is
// a note: its pitch is how far from the centre the walker is (further is higher, on the network's own notes),
// its length is the length of the stretch just travelled, its loudness the thickness of that cord. A dead end
// is a rest, then the walker starts again from the centre. Some walkers can travel the other way, from a tip
// in to the centre, and the network can grow through its stages while it is walked.
import { Notes, ownNotes, rng, stageAt } from '../kit/dsp.js'
const ALL = { flow: true, cords: true, electrical: true, fruit: true, weather: true, spores: true, rivals: true, depth: true } // a specimen with no `has` has everything
export const create = sr => {
  const P = { speed: 4, bias: 1, walkers: 2, rest: .6, base: 48, stage: .7, hold: 1, octave: 0, thin: 1, apart: .3, inward: 0, grow: 0 }, notes = new Notes(), rnd = rng(3), rnd2 = rng(31)
  let spec = null, adj = [], dist = [], pitch = [0], mean = 1, home = 0, walk = [], ends = [], age = 0, pos = .7, idx = -1, H = ALL, plot = false, scaleNote = ''
  // Every note goes through here: moved by whole octaves, thinned, and ended before it is started again.
  const thinRnd = rng(101); let started = 0, nps = 0
  const play = (key, vel, samples) => {
    if (thinRnd() >= P.thin) return
    key += 12 * Math.round(P.octave); while (key < 12) key += 12; while (key > 120) key -= 12 // kept on the keyboard by whole octaves
    for (let i = notes.live.length; i--;) if (notes.live[i][0] == key) { notes.live.splice(i, 1); notes.out.push({ off: key }) }
    notes.play(key, vel, samples); started++
  }
  const done = n => { nps += (started * sr / n - nps) * Math.min(1, n / sr / 2); started = 0; return notes.tick(n) }
  const build = () => {
    const [st, , , at] = stageAt(spec, pos), n = st.xy.length / 2; idx = at; adj = Array.from({ length: n }, () => []); dist = []; let far = 1, sum = 0, cnt = 0, best = 1e30
    for (let i = 0; i < n; i++) { const d = Math.hypot(st.xy[i * 2], st.xy[i * 2 + 1]); dist.push(d); far = Math.max(far, d) }
    for (let e = 0; e < st.edges.length; e += 3) { const a = st.edges[e], b = st.edges[e + 1], len = Math.hypot(st.xy[a * 2] - st.xy[b * 2], st.xy[a * 2 + 1] - st.xy[b * 2 + 1]) || 1; adj[a].push([b, st.edges[e + 2], len]); adj[b].push([a, st.edges[e + 2], len]); sum += len; cnt++ }
    home = 0; for (let i = 0; i < n; i++) if (adj[i].length && dist[i] < best) { best = dist[i]; home = i } // the centre: the joined-up node nearest the start point
    mean = sum / Math.max(1, cnt); dist = dist.map(d => d / far)
    ends = []; for (let i = 0; i < n; i++) if (adj[i].length == 1 && i != home) ends.push(i) // the tips
    const outer = ends.filter(i => dist[i] > .5); if (outer.length) ends = outer // inward walkers set out from the outer half
    let kept = 0; pitch = ownNotes(spec, pos, 24).filter((x, i) => !i || x - kept >= P.apart ? (kept = x, true) : false) // modes closer than `apart` count as one note
    walk = Array.from({ length: 4 }, (_, k) => ({ node: home, prev: -1, wait: walk[k] ? walk[k].wait : k * .3 * sr, inward: false, begin: true }))
  }
  return {
    load(s) {
      spec = s; H = s.has || ALL; plot = s.engine == '4m' && !!H.spores; age = 0; pos = P.stage; walk = []; build()
      scaleNote = [H.cords ? '' : 'No cords at this size: every stretch is the same thickness, so loudness follows how many ways lead on from each junction.', H.flow ? '' : 'No flow at this size: nothing is carried inward, so every walker goes outward.', plot ? 'Spores at this size: some phrases begin where a spore has founded a new individual, not at the centre.' : ''].filter(Boolean).join(' ')
    },
    set(k, x) { P[k] = x; if (spec && (k == 'stage' || k == 'apart')) { if (k == 'stage') { age = 0; pos = P.stage } build() } },
    advance(n) {
      if (!spec) return []
      if (P.grow > 0) { age += n / sr / P.grow; pos = (P.stage + age) % 1; if (stageAt(spec, pos)[3] != idx) build() } // the network grows on: walkers begin again from the new centre
      const W = Math.round(P.walkers)
      for (let k = 0; k < W; k++) {
        const wk = walk[k]; if ((wk.wait -= n) > 0) continue
        if (wk.begin) { // a new phrase: outward from the centre, or inward from a tip
          wk.begin = false; wk.inward = !!H.flow && (k + .5) / W <= P.inward && ends.length > 0; wk.prev = -1
          wk.node = wk.inward ? ends[rnd2() * ends.length | 0] : plot && rnd2() < .4 ? ends.length ? ends[rnd2() * ends.length | 0] : home : home
        }
        let opts = adj[wk.node].filter(o => o[0] != wk.prev)
        if (wk.inward) { const nearer = opts.filter(o => dist[o[0]] < dist[wk.node]); opts = nearer } // inward: only ways that lead nearer the centre
        if (!opts.length || (wk.inward && wk.node == home)) { wk.begin = true; wk.node = home; wk.wait = P.rest * sr; continue } // a dead end, or home: rest, then begin again
        let total = 0; for (const o of opts) total += Math.pow(o[1], P.bias)
        let pickAt = (wk.inward ? rnd2() : rnd()) * total, go = opts[0]; for (const o of opts) { pickAt -= Math.pow(o[1], P.bias); if (pickAt <= 0) { go = o; break } }
        wk.prev = wk.node; wk.node = go[0]
        const secs = go[2] / mean / P.speed
        const where = wk.inward ? wk.prev : wk.node // an inward walker sounds the place it has just left, so its phrase starts high at the tip
        play(P.base + pitch[Math.min(pitch.length - 1, Math.round(dist[where] * (pitch.length - 1)))], H.cords ? Math.min(1, .3 + .16 * Math.sqrt(go[1])) : Math.min(1, .34 + .12 * (adj[wk.node].length - 1)), secs * P.hold * sr)
        wk.wait = secs * sr
      }
      return done(n)
    },
    // ends every note that is sounding (for whoever stops this composer)
    release() { const out = notes.live.map(l => ({ off: l[0] })); notes.live.length = 0; notes.out.length = 0; return out },
    view() { const w = walk.slice(0, Math.round(P.walkers)); return { at: w.map(x => x.node), inward: w.map(x => x.inward), far: w.map(x => dist[x.node] || 0), stage: pos, stageIndex: idx, notes: pitch.length, sounding: notes.count(), nps, scaleNote } }
  }
}
