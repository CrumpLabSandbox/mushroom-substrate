// One way to drive all four engines, for the specimen baker (Node) and the live grower (a worker). Each size
// of engine is a different kind of model, so each offers different things: `has` says which. Whatever the
// size, this gives the same four things: step(), the network as a graph a resonator can use (shot), the
// engine's signals (taps), and what just happened (drain: events as [type, x, y, z] in micrometres).
// A plain script: defines `grow`. No DOM.
// Tidies a reduced network: several links between the same two points become one (their cross-sections add, as
// strands lying side by side), a link from a point to itself goes, and so does any point left with no link.
var tidyShot = s => {
  const pair = new Map(), E = s.edges
  for (let e = 0; e < E.length; e += 4) { const a = Math.min(E[e], E[e + 1]), b = Math.max(E[e], E[e + 1]); if (a == b) continue; const k = a * 65536 + b, p = pair.get(k); if (p) { p[2] = (p[2] * p[4] + E[e + 2]) / (p[4] + 1); p[3] += E[e + 3]; p[4]++ } else pair.set(k, [a, b, E[e + 2], E[e + 3], 1]) }
  const used = new Set(); for (const p of pair.values()) { used.add(p[0]); used.add(p[1]) }
  const keep = s.x.map((_, i) => used.has(i)), at = []; let n = 0; keep.forEach((k, i) => at[i] = k ? n++ : -1)
  const f = a => a.filter((_, i) => keep[i]), edges = []; for (const p of pair.values()) edges.push(at[p[0]], at[p[1]], p[2], p[3])
  return { t: s.t, k: s.k, x: f(s.x), y: f(s.y), z: f(s.z), fixed: f(s.fixed), edges }
}
var grow = (tier, M, sp, seed, scn, set) => {
  const T = 1, F = 0, HAS = {
    '4k': { flow: F, cords: F, electrical: F, fruit: F, weather: F, spores: F, rivals: F, depth: F },
    '40k': { flow: T, cords: T, electrical: F, fruit: T, weather: F, spores: F, rivals: F, depth: F },
    '400k': { flow: T, cords: T, electrical: T, fruit: T, weather: T, spores: F, rivals: T, depth: T },
    '4m': { flow: T, cords: T, electrical: T, fruit: T, weather: T, spores: T, rivals: T, depth: T } }
  const ev = [], has = {}; for (const k in HAS[tier]) has[k] = !!HAS[tier][k]
  let S, G, home, W, step, taps
  if (tier == '4k') {
    // The 4K engine keeps no network, only tips and a bitmap of where they have been. The network is rebuilt
    // here by following each tip: a point every 6 pixels, joined to the point before it; a branch starts at
    // its parent's point. A tip that stops beside another hypha is joined to it when the engine counted a fusion.
    const E = M(sp.p, seed), PX = E.PX, K = 6, CAP = 1 << 17, cell = new Map()
    G = { n: 0, L: K * PX, st: new Uint8Array(CAP), par: new Int32Array(CAP), dep: new Uint16Array(CAP), x1: new Float32Array(CAP), y1: new Float32Array(CAP), ar: new Float32Array(CAP).fill(1), fus: [], t: 0 }
    const node = (x, y, par) => { if (G.n >= CAP - 1) return par; const i = G.n++; G.st[i] = 1; G.par[i] = par; G.dep[i] = par < 0 ? 0 : G.dep[par] + 1; G.x1[i] = x * PX; G.y1[i] = y * PX; cell.set((x >> 2) + (y >> 2) * 128, i); return i }
    const root = node(256, 256, -1); let pend = root, live = new Set(E.T), fu = 0
    for (const t of E.T) { t.nd = root; t.k = 0 }
    E.T.push = function (t) { t.nd = pend; t.k = 0; return Array.prototype.push.call(this, t) }
    E.ev = (type, x, y) => { ev.push([type, x * PX, y * PX, 0]); if (type) return; let p = null; for (const t of E.T) if (t[0] === x && t[1] === y) { p = t; break } pend = p ? (p.k = 0, p.nd = node(x, y, p.nd)) : root }
    step = () => {
      E.step(); G.t = E.t; const now = new Set(E.T); let joins = E.fu - fu; fu = E.fu
      for (const t of live) if (!now.has(t)) { // this tip has stopped
        const i = node(t[0], t[1], t.nd); ev.push([2, t[0] * PX, t[1] * PX, 0])
        for (let d = 0; joins > 0 && d < 9; d++) { const j = cell.get((t[0] >> 2) + d % 3 - 1 + ((t[1] >> 2) + (d / 3 | 0) - 1) * 128); if (j != null && j != i && j != t.nd && G.par[t.nd] != j) { G.fus.push(i, j); joins--; break } }
      }
      for (const t of E.T) if (++t.k >= K) { t.nd = node(t[0], t[1], t.nd); t.k = 0 }
      live = now
    }
    W = 512 * PX; home = [W / 2, W / 2, 0]; S = E
    taps = () => { let far = 0; for (const t of E.T) far = Math.max(far, Math.hypot(t[0] - 256, t[1] - 256)); return { days: E.t / 86400, tips: E.T.length, len: E.len * PX, flow: 0, up: 0, res: 0, front: far * PX, cords: 0, fruits: 0, segments: E.len, surface: 0, spores: 0 } }
  } else {
    if (tier == '40k') { S = M(sp.p, seed, scn == null ? sp.s : scn); home = [S.W / 2, S.W / 2, 0] }
    else { S = M([{ id: sp.id, p: sp.p }], seed, scn == null ? sp.s : scn); home = Array.from(S.home[0]) }
    Object.assign(S, set || {}); G = S; W = S.W
    S.ev = (t, x, y, z) => { t != 9 && ev.push([t, x, y, z || 0]) }
    step = () => S.step()
    taps = () => ({ days: S.t / 86400, tips: S.ntips, len: S.len, flow: S.flow, up: S.up, res: S.res, front: S.front, cords: S.cords, fruits: S.fruits, segments: S.n, surface: tier == '40k' ? S.temp : S.tsurf, spores: S.spores || 0 })
  }
  // the network reduced to at most `max` points, each standing for a stretch of hypha, joined by edges that
  // carry the stretch's length (um) and mean cross-section (in single hyphae): [a, b, length, cross-section, ...]
  const shot = (max = 170) => {
    const n = G.n, st = G.st, par = G.par, dep = G.dep, z1 = G.z1; let k = 4, ids
    for (; ; k += 2) { ids = []; for (let i = 0; i < n; i++) st[i] == 1 && dep[i] % k == 0 && ids.push(i); if (ids.length <= max) break }
    const at = new Map(ids.map((id, j) => [id, j])), edges = [], rep = i => { while (i >= 0 && st[i] == 1 && dep[i] % k) i = par[i]; return i >= 0 && st[i] == 1 ? at.get(i) : -1 }
    ids.forEach((id, j) => { let a = par[id], len = G.L, area = G.ar[id], m = 1; while (a >= 0 && st[a] == 1 && dep[a] % k) { len += G.L; area += G.ar[a]; m++; a = par[a] } a >= 0 && st[a] == 1 && at.has(a) && edges.push(j, at.get(a), len, area / m) })
    for (let f = 0; f < G.fus.length; f += 2) { const a = rep(G.fus[f]), b = rep(G.fus[f + 1]); a >= 0 && b >= 0 && a != b && edges.push(a, b, G.L * k / 2, 1) }
    return tidyShot({ t: G.t, k, x: ids.map(i => G.x1[i]), y: ids.map(i => G.y1[i]), z: ids.map(i => z1 ? z1[i] : 0), fixed: ids.map(i => par[i] < 0 ? 1 : 0), edges })
  }
  return { tier, has, S, W, home, step, taps, shot, drain: () => ev.splice(0), seconds: () => G.t, stepSeconds: () => S.dt }
}

