// A symphony: several composers at once, each playing its own instrument from its own specimen (a species grown
// at one size of simulator), each on its own stem of the console, under a conductor. The conductor is itself a
// mushroom process (succession on a log, a year, a network sharing food, the same fungus at four sizes): it
// decides how far forward each part is at each moment. Runs in the audio thread and in Node.
import { INSTRUMENTS } from './instruments.js'
import { COMPOSERS } from './composers.js'
import { makeConsole } from './console.js'
const hump = (x, at, width) => { let d = Math.abs(x - at); d = Math.min(d, 1 - d); const u = Math.max(0, 1 - d / Math.max(.02, width)); return u * u * (3 - 2 * u) } // on a circle
// Conductors: (position 0..1 round the cycle, part index, part count, the part's own place 0..1, P) -> 0..1
export const CONDUCTORS = {
  // each part has its place in a sequence and gives way to the next (succession, a year, a change of size)
  sequence: (x, i, n, at, P) => Math.max(P.floor || 0, hump(x, at, P.overlap * 1.2 / n + .5 / n)),
  // one part at a time has the food; the others answer quietly, and the turn passes round
  sharing: (x, i, n, at, P) => { const turn = hump(x, (i + .5) / n, .8 / n); return (P.answer == null ? .25 : P.answer) + (1 - (P.answer == null ? .25 : P.answer)) * turn },
  // parts enter one after another and stay: a round. The cycle restarts when it ends.
  round: (x, i, n, at, P) => x * n >= i * (P.entry == null ? 1 : P.entry) ? Math.min(1, (x * n - i * (P.entry == null ? 1 : P.entry)) * 4) * (x > .94 ? (1 - x) / .06 : 1) : 0,
  // everyone, always
  together: () => 1
}
export const makeSymphony = (sr, cast, conductor = 'together') => {
  const P = { length: 120, pos: -1, overlap: 1, level: 1 }, con = makeConsole(sr, 8), N = Math.min(8, cast.length)
  const parts = cast.slice(0, N).map((c, i) => {
    const p = { c, comp: COMPOSERS[c.composer](sr), inst: INSTRUMENTS[c.instrument](sr), L: new Float32Array(128), R: new Float32Array(128), spec: null, g: 0, want: 0, entered: false, on: 0 }
    for (const k in c.comp || {}) p.comp.set(k, c.comp[k]); for (const k in c.inst || {}) p.inst.set(k, c.inst[k])
    return p
  })
  const stems = parts.map(p => [p.L, p.R]); let t = 0, x = 0, cycles = 0
  const stop = p => { if (p.comp.release) for (const ev of p.comp.release()) p.inst.noteOff(ev.off) }
  return {
    parts, console: con,
    load(i, spec) { const p = parts[i]; if (!p) return; stop(p); p.spec = spec; p.comp.load(spec); p.inst.load(spec); for (const k in p.c.comp || {}) p.comp.set(k, p.c.comp[k]); for (const k in p.c.inst || {}) p.inst.set(k, p.c.inst[k]) },
    set(k, v) { if (k in con.params) con.set(k, v); else P[k] = v },
    pset(i, which, k, v) { const p = parts[i]; if (p) (which == 'inst' ? p.inst : p.comp).set(k, v) },
    process(L, R) {
      const n = L.length; if (parts[0].L.length != n) for (const p of parts) { p.L = new Float32Array(n); p.R = new Float32Array(n); stems[parts.indexOf(p)] = [p.L, p.R] }
      t += n / sr
      const was = x; x = P.pos >= 0 ? P.pos : (t / Math.max(5, P.length)) % 1; if (x < was - .5) cycles++
      for (let i = 0; i < N; i++) {
        const p = parts[i]; p.L.fill(0); p.R.fill(0); if (!p.spec) { stems[i] = null; continue } stems[i] = [p.L, p.R]
        p.want = CONDUCTORS[conductor](x, i, N, p.c.at == null ? (i + .5) / N : p.c.at, P)
        if (conductor == 'round') { if (p.want > 0 && !p.entered) { p.entered = true; stop(p); p.comp.load(p.spec); for (const k in p.c.comp || {}) p.comp.set(k, p.c.comp[k]) } if (p.want == 0) p.entered = false } // each voice starts the piece from its beginning as it enters
        const evs = p.comp.advance(n)
        for (const ev of evs) { if (ev.off != null) p.inst.noteOff(ev.off); else if (p.want > .02) { p.inst.noteOn(ev.on, ev.vel * (.4 + .6 * p.want)); p.on++ } }
        p.inst.process(p.L, p.R, null)
        const g0 = p.g; p.g += (p.want - p.g) * Math.min(1, n / (sr * .4)); for (let s = 0; s < n; s++) { const g = g0 + (p.g - g0) * s / n; p.L[s] *= g; p.R[s] *= g }
      }
      con.process(stems, L, R, n)
      if (P.level != 1) for (let s = 0; s < n; s++) { L[s] *= P.level; R[s] *= P.level }
    },
    view() { return { x, t, cycles, want: parts.map(p => p.g), notes: parts.map(p => p.on), parts: parts.map(p => { const v = p.comp.view ? p.comp.view() : {}; return { nps: v.nps || 0, sounding: v.sounding || 0, scaleNote: v.scaleNote || '' } }), tel: con.telemetry() } }
  }
}
