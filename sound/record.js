// The recorder. Runs an engine (400K or 4M) and keeps what the sound work needs, with nothing scaled:
// electrode voltages in millivolts at the electrical clock's own rate, every event with its time and
// place, and the engine's signals once per growth step. No DOM; runs in Node and in a worker.
//
// Two clocks are recorded and kept apart:
//   growth time      seconds of simulated time in which the network grows (S.t)
//   electrical time  seconds of electrical activity listened to; `listen` samples per growth step,
//                    each `tdt` seconds long. This is usually far less than the growth time it sits in:
//                    the recorder listens to the network for a moment at each stage of its growth.
var record = (M, inds, seed, scn, opt) => {
  const o = Object.assign({ steps: 200, warm: 20, listen: 2400, electrodes: 4, set: {} }, opt)
  const S = M(inds, seed, scn)
  Object.assign(S, o.set)
  const N = o.steps * o.listen, K = o.electrodes, volts = Array.from({ length: K }, () => new Float32Array(N)),
    ev = { t: [], type: [], x: [], y: [], z: [] }, taps = [], nodes = new Int32Array(K), names = ['t', 'ntips', 'len', 'res', 'up', 'flow', 'front', 'tsurf', 'spikes', 'cords', 'fruits', 'wars', 'n']
  let w = 0, stepStart = 0, inStep = [], listening = false, sub = 0, total = 0
  // growth events get an even spread through their step; electrical spikes are counted, not stored (they are in the voltages)
  S.ev = (type, x, y, z) => { if (type == 9) return; inStep.push(type, x, y, z || 0) }
  S.sub = () => { if (!listening) return; for (let k = 0; k < K; k++) volts[k][w] = (S.volts[nodes[k]] + 1.2) * amp; w++ }
  let amp = 1
  for (let i = 0; i < o.warm; i++) S.step() // let a network exist before placing electrodes
  inStep = []
  // electrodes: on the hyphae nearest to points spread round the first individual, at a third of the way to its front
  const h = S.home[0], rad = Math.max(S.front * .35, S.L * 6)
  for (let k = 0; k < K; k++) {
    const a = k / K * 6.2832, px = h[0] + Math.cos(a) * rad, py = h[1] + Math.sin(a) * rad
    let best = 1e30
    for (let e = 0; e < S.ne; e++) { const q = S.eseg[e]; if (S.st[q] != 1) continue; const d = (S.x1[q] - px) ** 2 + (S.y1[q] - py) ** 2 + (S.z1[q] - h[2]) ** 2; if (d < best) { best = d; nodes[k] = e } }
  }
  const spa = inds[0].p[37]; amp = spa / 2 // model units to millivolts, as the engine's own trace does
  const t0 = S.t
  for (let i = 0; i < o.steps; i++) {
    stepStart = S.t; inStep = []
    listening = false; S.step()
    const m = inStep.length / 4
    for (let j = 0; j < m; j++) { ev.t.push(stepStart + (j + .5) / m * S.dt - t0); ev.type.push(inStep[j * 4]); ev.x.push(inStep[j * 4 + 1]); ev.y.push(inStep[j * 4 + 2]); ev.z.push(inStep[j * 4 + 3]) }
    taps.push(names.map(k => S[k]))
    listening = true; S.elec(o.listen); listening = false
    o.progress && o.progress((i + 1) / o.steps)
  }
  return {
    meta: { species: inds.map(d => d.id), seed, world: scn, steps: o.steps, warm: o.warm, growth_seconds: S.t - t0, step_seconds: S.dt,
      electrical_sample_seconds: S.tdt, electrical_samples: w, electrical_seconds: w * S.tdt, spike_interval_minutes: inds[0].p[35],
      electrodes: Array.from(nodes, e => { const q = S.eseg[e]; return [S.x1[q], S.y1[q], S.z1[q]] }), size: [S.W, S.DZ], segments: S.n, tap_names: names },
    volts: volts.map(v => v.subarray(0, w)), events: { t: Float64Array.from(ev.t), type: Uint8Array.from(ev.type), x: Float32Array.from(ev.x), y: Float32Array.from(ev.y), z: Float32Array.from(ev.z) }, taps
  }
}
if (typeof module != 'undefined') module.exports = record
