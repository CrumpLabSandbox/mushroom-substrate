// Runs the core off the main thread. The page asks for a batch of steps and gets back a snapshot:
// new segment geometry, per-segment width/value/state, resource levels, fruiting sites and signals.
importScripts('core.js')
let S, sent = 0, mode = 'network', cells, recSent = 0, events
const snap = first => {
  const n = S.n, geom = new Float32Array((n - sent) * 6), dyn = new Float32Array(n * 3), q = Math.sqrt
  for (let i = sent, j = 0; i < n; i++) { geom[j++] = S.x0[i]; geom[j++] = S.y0[i]; geom[j++] = S.z0[i]; geom[j++] = S.x1[i]; geom[j++] = S.y1[i]; geom[j++] = S.z1[i] }
  for (let i = 0; i < n; i++) {
    dyn[i * 3] = q(S.ar[i])
    dyn[i * 3 + 1] = mode == 'reserve' ? Math.min(1, S.si[i] / 4) : mode == 'flow' ? Math.min(1, q(Math.abs(S.Q[i] + S.qc[i])) / 3) : mode == 'voltage' ? (S.volts[S.en[i]] + 2.2) / 4.4 : 0
    dyn[i * 3 + 2] = S.st[i] + 4 * S.own[i]
  }
  const level = new Uint8Array(cells.length), se = S.se
  for (let k = 0; k < cells.length; k++) level[k] = 255 * Math.min(1, se[cells[k]] / S.SE0[S.typ[cells[k]]])
  const trace = new Float32Array(4096), tp = S.tp
  for (let k = 0; k < 4096; k++) trace[k] = S.trace[(tp + k) & 4095]
  const sig = {}
  for (const k of ['t', 'dt', 'tdt', 'len', 'br', 'fu', 'wars', 'res', 'up', 'flow', 'front', 'cords', 'fruits', 'alpha', 'ntips', 'spikes', 'pspikes', 'tsurf', 'volt', 'n', 'ne', 'mean']) sig[k] = S[k]
  sig.tipsOf = [...S.tipsOf]
  const msg = { from: sent, n, geom, dyn, level, trace, sig, events, fr: S.fr.map(o => ({ x: o.x, y: o.y, z: o.z, m: o.m, s: o.s, o: o.o })), rec: S.rec.slice(recSent) }
  if (first) { msg.first = 1; msg.cells = cells; msg.types = cells.map(c => S.typ[c]); msg.roots = S.roots; msg.home = S.home; msg.world = [S.W, S.DZ, S.G, S.GZ, S.CS] }
  sent = n; recSent = S.rec.length
  postMessage(msg, [geom.buffer, dyn.buffer, level.buffer, trace.buffer])
}
onmessage = e => {
  const m = e.data
  if (m.init) {
    S = M(m.init.inds, m.init.seed, m.init.scn); Object.assign(S, m.init.set); sent = recSent = 0; mode = m.init.mode; events = {}
    S.ev = t => { events[t] = (events[t] || 0) + 1 }
    cells = []; for (let c = 0; c < S.typ.length; c++) S.typ[c] % 5 && cells.push(c) // wood, litter, root tips, agar
    snap(1)
  } else if (!S) return
  else if (m.set) Object.assign(S, m.set)
  else if (m.mode) mode = m.mode
  else if (m.probe) S.probe(...m.probe)
  else if (m.steps != null) { for (let k = m.steps; k--;) S.step(); snap() }
  else if (m.graph) {
    const n = S.n, r = (a, d) => Array.from(a.subarray(0, n), v => Math.round(v * d) / d)
    postMessage({ graph: { units: 'um; z is depth below the surface', n, x0: r(S.x0, 1), y0: r(S.y0, 1), z0: r(S.z0, 1), x1: r(S.x1, 1), y1: r(S.y1, 1), z1: r(S.z1, 1),
      cross_section: r(S.ar, 100), reserve: r(S.si, 100), flux: Array.from(S.Q.subarray(0, n), (v, i) => Math.round((v + S.qc[i]) * 1000) / 1000), state: r(S.st, 1), individual: r(S.own, 1) } })
  }
}
