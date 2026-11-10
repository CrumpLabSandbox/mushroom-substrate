// Mushroom World's sound: the separate plugins' own sound code, several at once, under one species.
//   two voices (each one of eight instruments, played from the keys or by one of six composers),
//   an atmosphere underneath, an effect the voices are sent through, and the console.
// Parameters are addressed by id and carry real units; a choice is an index into its list (the table is
// gen/modules.js, written from the plugins' declarations by tools/build-world.js). Runs in the audio thread and in Node.
import { INSTRUMENTS } from '../kit/instruments.js'
import { COMPOSERS } from '../kit/composers.js'
import { ATMOSPHERES, EFFECTS } from '../kit/atmospheres.js'
import { makeConsole } from '../kit/console.js'
import { SLOTS, MODULES, PARAMS } from './gen/modules.js'
const us = id => id.replace(/-/g, '_')
// what the three world controls move in each part: any parameter with one of these names
const WORLD = { 'world.growth': ['stage'], 'world.wet': ['wet', 'humid', 'soak'], 'world.temp': ['temp'] }
export const makeWorld = sr => {
  const P = {}; for (const [id, v] of PARAMS) P[id] = v
  const con = makeConsole(sr, 4), buf = () => [new Float32Array(128), new Float32Array(128)]
  const S = { v1: { make: INSTRUMENTS, list: SLOTS.v1, off: 0 }, v2: { make: INSTRUMENTS, list: SLOTS.v2, off: 1 }, atmo: { make: ATMOSPHERES, list: SLOTS.atmo, off: 1 }, fx: { make: EFFECTS, list: SLOTS.fx, off: 1 } }
  for (const k in S) Object.assign(S[k], { id: null, d: null, comp: null, compId: null, b: buf(), held: new Set() })
  let spec = null, x = new Float32Array(128), changed = [], notes = 0
  for (const [k, v] of [['master.ride', 1], ['glue.on', 1]]) con.set(k, v)
  const apply = (d, id) => { for (const p of MODULES[id]) d.set(p, P[us(id) + '.' + p]) }
  const quiet = s => { if (!s.d) return; if (s.comp && s.comp.release) for (const ev of s.comp.release()) s.d.noteOff && s.d.noteOff(ev.off); for (const k of s.held) s.d.noteOff && s.d.noteOff(k); s.held.clear() }
  const build = slot => {
    const s = S[slot], i = Math.round(P[slot + '.engine']) - s.off, id = i >= 0 ? s.list[i] : null
    if (id != s.id) { quiet(s); s.id = id; s.d = id ? s.make[id](sr) : null; if (s.d) { spec && s.d.load(spec); apply(s.d, id); if (slot == 'fx') s.d.set('mix', 1) } }
    if (slot[0] == 'v') { const c = Math.round(P[slot + '.player']) - 1, cid = c >= 0 ? SLOTS.players[c] : null; if (cid != s.compId) { quiet(s); s.compId = cid; s.comp = cid ? COMPOSERS[cid](sr) : null; if (s.comp) { spec && s.comp.load(spec); apply(s.comp, cid) } } }
  }
  const strips = () => { [['v1', 1], ['v2', 2], ['atmo', 3]].forEach(([k, n]) => { con.set(`s${n}.fader`, P[k + '.level']); if (k != 'atmo') con.set(`s${n}.pan`, P[k + '.pan']) }); con.set('s4.fader', P['fx.level']); for (const k of ['master.target', 'out.ceiling', 'out.level']) con.set(k, P[k]) }
  for (const k in S) build(k); strips()
  const each = f => { for (const k in S) { const s = S[k]; s.d && f(s.d, s.id, k); s.comp && f(s.comp, s.compId, k) } }
  return {
    params: P,
    load(sp) { spec = sp; each(d => d.load(sp)); for (const k in S) { const s = S[k]; s.d && apply(s.d, s.id); s.comp && apply(s.comp, s.compId); k == 'fx' && s.d && s.d.set('mix', 1) } },
    live(m) { const a = S.atmo.d; a && a.live && a.live(m) },
    set(id, v) {
      if (!(id in P)) return; P[id] = v
      if (id.endsWith('.engine') || id.endsWith('.player')) return build(id.split('.')[0])
      if (WORLD[id]) { // a world control: carried into every part that has a parameter of that kind
        const names = WORLD[id]
        for (const mod in MODULES) for (const p of MODULES[mod]) if (names.includes(p)) { const pid = us(mod) + '.' + p, val = id == 'world.temp' ? v : v; if (P[pid] !== val) { P[pid] = val; changed.push([pid, val]); each((d, did) => did == mod && d.set(p, val)) } }
        return
      }
      const dot = id.indexOf('.'), g = id.slice(0, dot), p = id.slice(dot + 1)
      if (g in S || g == 'master' || g == 'out') return strips()
      each((d, did) => us(did) == g && d.set(p, v))
    },
    noteOn(key, vel) { for (const k of ['v1', 'v2']) { const s = S[k]; if (s.d && !s.comp && s.d.noteOn) { const q = key + 12 * Math.round(P[k + '.octave']); s.d.noteOn(q, vel); s.held.add(q); notes++ } } },
    noteOff(key) { for (const k of ['v1', 'v2']) { const s = S[k]; if (s.d && !s.comp && s.d.noteOff) { const q = key + 12 * Math.round(P[k + '.octave']); s.d.noteOff(q); s.held.delete(q) } } },
    process(L, R) {
      const n = L.length; if (x.length != n) { x = new Float32Array(n); for (const k in S) S[k].b = [new Float32Array(n), new Float32Array(n)] }
      const stems = [null, null, null, null], send = P['fx.send']; x.fill(0)
      ;['v1', 'v2'].forEach((k, i) => {
        const s = S[k], [bl, br] = s.b; if (!s.d) return; bl.fill(0); br.fill(0)
        if (s.comp) { const oct = 12 * Math.round(P[k + '.octave']); for (const ev of s.comp.advance(n)) { if (ev.off != null) s.d.noteOff && s.d.noteOff(ev.off + oct); else { s.d.noteOn && s.d.noteOn(ev.on + oct, ev.vel); notes++ } } }
        s.d.process(bl, br, null); stems[i] = s.b
        if (S.fx.d) for (let j = 0; j < n; j++) x[j] += (bl[j] + br[j]) * .5 * send
      })
      if (S.atmo.d) { const [bl, br] = S.atmo.b; bl.fill(0); br.fill(0); S.atmo.d.process(bl, br, null); stems[2] = S.atmo.b }
      if (S.fx.d) { const [bl, br] = S.fx.b; bl.fill(0); br.fill(0); S.fx.d.process(bl, br, x); stems[3] = S.fx.b }
      con.process(stems, L, R, n)
    },
    // what the page needs to draw: each part's own view, the console's meters, and any parameter a world control moved
    report() { const views = {}; for (const k in S) { const s = S[k]; views[k] = s.d && s.d.view ? s.d.view() : null; if (s.comp) views[k + 'p'] = s.comp.view() } const c = changed; changed = []; return { views, tel: con.telemetry(), changed: c, notes, ids: { v1: S.v1.id, v2: S.v2.id, atmo: S.atmo.id, fx: S.fx.id, v1p: S.v1.compId, v2p: S.v2.compId } } }
  }
}
