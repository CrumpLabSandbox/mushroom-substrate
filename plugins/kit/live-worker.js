// A network growing live, for plugins that listen to it as it grows. Runs the 400K engine in its own
// thread, a few steps at a time. About ten times a second it reports what just happened (each event with the
// ring it happened in, counted out from the centre, and its left-right place); about once a second it also
// works out the network's modes as a web of taut strings, so the plugin can retune to the network as it is now.
importScripts('../../engines/400k/core.js', '../../sound/resonator.js')
let S, timer, speed = 4, acc = 0, evs = [], home, W, reach = 1000, tick = 0, sp, seed = 1, scn
const begin = () => {
  S = M([{ id: sp.id, p: sp.p }], seed, scn == null ? sp.s : scn); S.weather = 1; home = S.home[0]; W = S.W; evs = []; reach = 1000; tick = 0
  S.ev = (t, x, y, z) => { if (t == 9) return; const d = Math.hypot(x - home[0], y - home[1], (z || 0) - home[2]); evs.push([t, Math.min(5, d / reach * 6 | 0), x / W]) }
}
const stage = () => {
  const n = S.n, st = S.st, par = S.par, dep = S.dep; let k = 4, ids
  for (; ; k += 2) { ids = []; for (let i = 0; i < n; i++) st[i] == 1 && dep[i] % k == 0 && ids.push(i); if (ids.length <= 120) break }
  if (ids.length < 6) return null
  const at = new Map(ids.map((id, j) => [id, j])), edges = [], rep = i => { while (i >= 0 && st[i] == 1 && dep[i] % k) i = par[i]; return i >= 0 && st[i] == 1 ? at.get(i) : -1 }
  ids.forEach((id, j) => { let a = par[id], len = S.L, area = S.ar[id], m = 1; while (a >= 0 && st[a] == 1 && dep[a] % k) { len += S.L; area += S.ar[a]; m++; a = par[a] } a >= 0 && st[a] == 1 && at.has(a) && edges.push(j, at.get(a), len, area / m) })
  for (let f = 0; f < S.fus.length; f += 2) { const a = rep(S.fus[f]), b = rep(S.fus[f + 1]); a >= 0 && b >= 0 && a != b && edges.push(a, b, S.L * k / 2, 1) }
  const shot = { x: ids.map(i => S.x1[i]), y: ids.map(i => S.y1[i]), z: ids.map(i => S.z1[i]), fixed: ids.map(i => par[i] < 0 ? 1 : 0), edges }, md = modes(shot, { count: 24 }), N = ids.length
  const dist = shot.x.map((x, i) => Math.hypot(x - home[0], shot.y[i] - home[1], shot.z[i] - home[2])); reach = Math.max(1000, ...dist)
  const MIC = [[W * .2, W / 2, 0], [W * .8, W / 2, 0]], hear = (i, m) => 1 / (1 + Math.hypot(shot.x[i] - MIC[m][0], shot.y[i] - MIC[m][1], shot.z[i]) / (W / 10)) / N
  return { hz: md.hz, mass: md.mass, reach_mm: reach / 1000,
    zone: md.shape.map(sh => Array.from({ length: 6 }, (_, z) => { let s = 0, c = 0; for (let i = 0; i < N; i++) if (Math.min(5, dist[i] / reach * 6 | 0) == z) { s += sh[i]; c++ } return c ? s / c : 0 })),
    mic: md.shape.map(sh => [0, 1].map(m => sh.reduce((t, v, i) => t + v * hear(i, m), 0))),
    xy: shot.x.flatMap((x, i) => [Math.round((x - home[0]) / 10), Math.round((shot.y[i] - home[1]) / 10)]), edges: Array.from({ length: edges.length / 4 }, (_, e) => [edges[e * 4], edges[e * 4 + 1], Math.round(edges[e * 4 + 3] * 10) / 10]).flat() }
}
const run = () => {
  if (S.n > 240000 || (S.t > 86400 * 3 && S.ntips < 4)) { seed++; begin(); postMessage({ live: { restarted: true, events: [], taps: {} } }) } // the block is full or growth has stopped: a new colony
  acc += speed * .1; let k = acc | 0; acc -= k; for (; k--;) S.step()
  const out = { events: evs.splice(0, 400), taps: { days: S.t / 86400, tips: S.ntips, flow: S.flow, cords: S.cords, fruits: S.fr.filter(o => o.s == 1).length, segments: S.n, surface: S.tsurf } }; evs.length = 0
  if (tick++ % 10 == 0) { const s = stage(); if (s) out.stage = s }
  postMessage({ live: out })
}
onmessage = e => {
  const m = e.data
  if (m.start) { clearInterval(timer); sp = m.start.sp; seed = m.start.seed || 1; scn = m.start.scn; begin(); timer = setInterval(run, 100) }
  if (m.speed != null) speed = m.speed
  if (m.rain && S) S.rain = 1
  if (m.stop) clearInterval(timer)
}
