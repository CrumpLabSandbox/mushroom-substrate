// A network growing live, for plugins that listen to it as it grows. Runs an engine of the chosen size in its
// own thread, a few steps at a time (kit/grow.js drives all four sizes the same way). About ten times a second
// it reports what just happened (each event with the ring it happened in, counted out from the centre, and its
// left-right place) and the engine's signals; about once a second it also works out the network's modes as a
// web of taut strings, so the plugin can retune to the network as it is now.
importScripts('grow.js', '../../sound/resonator.js')
let g, timer, speed = 4, acc = 0, reach = 1000, tick = 0, sp, seed = 1, scn, tier = '400k', loaded = '', steps = 0
const FULL = { '4k': 90000, '40k': 110000, '400k': 240000, '4m': 240000 }
const begin = () => { g = grow(tier, M, sp, seed, scn, tier == '40k' || tier == '4k' ? {} : { weather: 1 }); reach = g.W / 20; tick = steps = 0 }
const stage = () => {
  const shot = g.shot(120), N = shot.x.length; if (N < 6) return null
  const md = modes(shot, { count: 24 }); if (!(md.hz[0] > 0) || md.hz[0] > 40000) return null
  const home = g.home, W = g.W, edges = shot.edges, unit = tier == '4m' ? 100 : 10
  const dist = shot.x.map((x, i) => Math.hypot(x - home[0], shot.y[i] - home[1], shot.z[i] - home[2])); reach = Math.max(W / 25, ...dist)
  const MIC = [[W * .2, W / 2, 0], [W * .8, W / 2, 0]], hear = (i, m) => 1 / (1 + Math.hypot(shot.x[i] - MIC[m][0], shot.y[i] - MIC[m][1], shot.z[i]) / (W / 10)) / N
  return { hz: md.hz, mass: md.mass, reach_mm: reach / 1000, days: g.seconds() / 86400,
    zone: md.shape.map(sh => Array.from({ length: 6 }, (_, z) => { let s = 0, c = 0; for (let i = 0; i < N; i++) if (Math.min(5, dist[i] / reach * 6 | 0) == z) { s += sh[i]; c++ } return c ? s / c : 0 })),
    mic: md.shape.map(sh => [0, 1].map(m => sh.reduce((t, v, i) => t + v * hear(i, m), 0))),
    xy: shot.x.flatMap((x, i) => [Math.round((x - home[0]) / unit), Math.round((shot.y[i] - home[1]) / unit)]), edges: Array.from({ length: edges.length / 4 }, (_, e) => [edges[e * 4], edges[e * 4 + 1], Math.round(edges[e * 4 + 3] * 10) / 10]).flat() }
}
const run = () => {
  let t = g.taps()
  if (t.segments > FULL[tier] || (steps > 60 && t.tips < 4)) { seed++; begin(); postMessage({ live: { restarted: true, events: [], taps: {}, has: g.has, tier } }) } // the ground is full or growth has stopped: a new colony
  acc += speed * .1; let k = acc | 0; acc -= k; for (; k--;) { g.step(); steps++ }
  const home = g.home, W = g.W
  const events = g.drain().slice(0, 400).map(e => [e[0], Math.min(5, Math.hypot(e[1] - home[0], e[2] - home[1], e[3] - home[2]) / reach * 6 | 0), e[1] / W])
  t = g.taps(); const out = { events, taps: t, has: g.has, tier }
  if (tick++ % 10 == 0) { const s = stage(); if (s) out.stage = s }
  postMessage({ live: out })
}
onmessage = e => {
  const m = e.data
  if (m.start) {
    clearInterval(timer); sp = m.start.sp; seed = m.start.seed || 1; scn = m.start.scn; tier = m.start.tier || '400k'
    if (loaded != tier) { importScripts('../../engines/' + tier + '/core.js'); loaded = tier }
    begin(); timer = setInterval(run, 100)
  }
  if (m.speed != null) speed = m.speed
  if (m.rain && g && g.has.weather) g.S.rain = 1
  if (m.stop) clearInterval(timer)
}
