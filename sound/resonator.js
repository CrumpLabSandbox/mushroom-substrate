// The resonator. Treats a snapshot of the network (sound/record.js) as a web of stretched strings and
// finds how it would ring: its lowest modes, each a frequency and a pattern of movement over the nodes.
//
// The physics is the string estimate from docs/research/07: a hypha is a tube held taut by its own
// turgor pressure P, so its tension is P x cross-section and its mass per length is density x
// cross-section, and waves travel along it at sqrt(P / density), about 22 m/s, whatever its width.
// Thick cords are heavier and tighter, so where thick meets thin the wave partly reflects: the
// network's shape and its cords set the modes.
//
// Real hyphae do not ring: the same research estimates that their motion is damped out almost at once.
// The ring time is therefore a free choice here, and "true to life" would be silence.
var modes = (shot, opt) => {
  const o = Object.assign({ pressure: 5e5, density: 1000, diameter: 5e-6, count: 28 }, opt)
  const N = shot.x.length, A0 = Math.PI * o.diameter * o.diameter / 4, K = new Float64Array(N * N), M = new Float64Array(N).fill(1e-30)
  for (let e = 0; e < shot.edges.length; e += 4) {
    const i = shot.edges[e], j = shot.edges[e + 1], len = shot.edges[e + 2] * 1e-6, area = shot.edges[e + 3] * A0, k = o.pressure * area / len, m = o.density * area * len / 2
    K[i * N + i] += k; K[j * N + j] += k; K[i * N + j] -= k; K[j * N + i] -= k; M[i] += m; M[j] += m
  }
  // where the fungus is anchored in its food (the start of each first hypha) the web is held still
  for (let i = 0; i < N; i++) if (shot.fixed[i]) K[i * N + i] += o.pressure * A0 / 1e-4
  // K x = w^2 M x becomes an ordinary symmetric problem in y = sqrt(M) x
  const s = Array.from(M, m => 1 / Math.sqrt(m)), A = new Float64Array(N * N), V = new Float64Array(N * N)
  for (let i = 0; i < N; i++) { V[i * N + i] = 1; for (let j = 0; j < N; j++) A[i * N + j] = K[i * N + j] * s[i] * s[j] }
  // cyclic Jacobi rotations until the off-diagonal part is gone
  for (let sweep = 0; sweep < 14; sweep++) {
    let off = 0; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) off += A[i * N + j] * A[i * N + j]
    if (off < 1e-18 * N) break
    for (let p = 0; p < N; p++) for (let q = p + 1; q < N; q++) {
      const apq = A[p * N + q]; if (Math.abs(apq) < 1e-300) continue
      const th = (A[q * N + q] - A[p * N + p]) / (2 * apq), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), sn = t * c
      for (let k = 0; k < N; k++) { const a = A[k * N + p], b = A[k * N + q]; A[k * N + p] = c * a - sn * b; A[k * N + q] = sn * a + c * b }
      for (let k = 0; k < N; k++) { const a = A[p * N + k], b = A[q * N + k]; A[p * N + k] = c * a - sn * b; A[q * N + k] = sn * a + c * b }
      for (let k = 0; k < N; k++) { const a = V[k * N + p], b = V[k * N + q]; V[k * N + p] = c * a - sn * b; V[k * N + q] = sn * a + c * b }
    }
  }
  const order = Array.from({ length: N }, (_, i) => i).filter(i => A[i * N + i] > 1).sort((a, b) => A[a * N + a] - A[b * N + b]).slice(0, o.count)
  // how far each node moves in each mode (back in real displacement), scaled so the largest is 1,
  // and the mass that moves with the mode at that scaling, in kg: a strike of impulse J (N s) at node j
  // sets the mode moving at shape[j] * J / mass metres per second
  const shape = order.map(i => { const v = Array.from({ length: N }, (_, k) => V[k * N + i] * s[k]); const m = Math.max(...v.map(Math.abs)) || 1; return v.map(x => x / m) })
  return { hz: order.map(i => Math.sqrt(A[i * N + i]) / 6.2832), shape, mass: shape.map(v => v.reduce((t, x, k) => t + M[k] * x * x, 0)), force: o.pressure * A0 }
}
if (typeof module != 'undefined') module.exports = modes
