// Meshes for the world, as plain arrays: 10 numbers a vertex (position 3, normal 3, colour 3, part 1).
// `part` tells the shader what a vertex is: 0 ground and props, 1 a mushroom's stem, 2 its cap, 3 its gills.
import { heightAt, biomeWeights, BIOME_KEYS, CHUNK, hash2, noise } from './world.js'
const TAU = Math.PI * 2
export const hex = c => { const n = parseInt(c.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255] }
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l] }

class Mesh {
  constructor() { this.v = [] }
  vert(p, n, c, part = 0) { this.v.push(p[0], p[1], p[2], n[0], n[1], n[2], c[0], c[1], c[2], part) }
  tri(a, b, c, col, part = 0) { const n = norm(cross(sub(b, a), sub(c, a))); this.vert(a, n, col, part); this.vert(b, n, col, part); this.vert(c, n, col, part) }
  // a surface of revolution about y: profile [[radius, y], ...] from bottom to top; sides around, smooth normals
  lathe(profile, sides, col, part, at = [0, 0, 0], ry = 1) {
    const ring = profile.map(([r, y], i) => { const a = profile[Math.max(0, i - 1)], b = profile[Math.min(profile.length - 1, i + 1)]; const dr = b[0] - a[0], dy = b[1] - a[1]; return { r, y, nr: dy, ny: -dr } })
    for (let i = 0; i < ring.length - 1; i++) for (let s = 0; s < sides; s++) {
      const p = (k, j) => { const a = j / sides * TAU, q = ring[k]; return [at[0] + Math.cos(a) * q.r, at[1] + q.y * ry, at[2] + Math.sin(a) * q.r] }
      const n = (k, j) => { const a = j / sides * TAU, q = ring[k]; return norm([Math.cos(a) * q.nr, q.ny, Math.sin(a) * q.nr]) }
      const c = typeof col == 'function' ? col : () => col
      const A = [i, s], B = [i, s + 1], C = [i + 1, s + 1], D = [i + 1, s]
      for (const [k, j] of [A, B, C, A, C, D]) this.vert(p(k, j), n(k, j), c(ring[k].y, j / sides), part)
    }
    return this
  }
  // a lumpy ball: an icosahedron split once, pushed out by `bump`
  blob(at, rx, ry, rz, col, bump = .15, seed = 1, part = 0) {
    const t = (1 + Math.sqrt(5)) / 2, V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(norm)
    let F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
    const mid = {}, m = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (mid[k] == null) { V.push(norm([(V[a][0] + V[b][0]) / 2, (V[a][1] + V[b][1]) / 2, (V[a][2] + V[b][2]) / 2])); mid[k] = V.length - 1 } return mid[k] }
    F = F.flatMap(([a, b, c]) => { const ab = m(a, b), bc = m(b, c), ca = m(c, a); return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]] })
    const P = V.map((v, i) => { const k = 1 + (hash2(i, seed, 7) - .5) * 2 * bump; return [at[0] + v[0] * rx * k, at[1] + v[1] * ry * k, at[2] + v[2] * rz * k] })
    for (const [a, b, c] of F) this.tri(P[a], P[c], P[b], typeof col == 'function' ? col(V[a]) : col, part)
    return this
  }
  // a tapered tube from a to b
  tube(a, b, r0, r1, sides, col) {
    const d = norm(sub(b, a)), u = norm(Math.abs(d[1]) < .9 ? cross(d, [0, 1, 0]) : cross(d, [1, 0, 0])), w = cross(d, u)
    for (let s = 0; s < sides; s++) {
      const f = (j, base, r) => { const t = j / sides * TAU; return [base[0] + (u[0] * Math.cos(t) + w[0] * Math.sin(t)) * r, base[1] + (u[1] * Math.cos(t) + w[1] * Math.sin(t)) * r, base[2] + (u[2] * Math.cos(t) + w[2] * Math.sin(t)) * r] }
      const nn = j => { const t = j / sides * TAU; return [u[0] * Math.cos(t) + w[0] * Math.sin(t), u[1] * Math.cos(t) + w[1] * Math.sin(t), u[2] * Math.cos(t) + w[2] * Math.sin(t)] }
      const A = f(s, a, r0), B = f(s + 1, a, r0), C = f(s + 1, b, r1), D = f(s, b, r1)
      for (const [p, j] of [[A, s], [B, s + 1], [C, s + 1], [A, s], [C, s + 1], [D, s]]) this.vert(p, nn(j), col)
    }
    return this
  }
  array() { return new Float32Array(this.v) }
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

// ---- one square of ground and everything fixed on it
export function chunkMesh(W, cx, cz, things, step = 1) {
  const M = new Mesh(), P = W.pal, n = CHUNK / step, x0 = cx * CHUNK, z0 = cz * CHUNK
  const g = P.ground.map(hex), grass = hex(P.grass), rock = hex(P.rock), wood = hex(P.wood), leaf = P.leaf.map(hex)
  const tint = { meadow: grass, forest: mixc(g[1], hex(P.shade), .25), deadwood: mixc(g[1], wood, .35), dunes: g[0] }
  const H = [], C = []
  for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
    const x = x0 + i * step, z = z0 + j * step, y = heightAt(W, x, z); H.push(y)
    const w = biomeWeights(W, x, z); let c = [0, 0, 0]; BIOME_KEYS.forEach((k, b) => { const t = tint[k]; c = [c[0] + t[0] * w[b], c[1] + t[1] * w[b], c[2] + t[2] * w[b]] })
    const band = hash2(Math.floor(y * 1.3), 3, W.seed) * .14 - .07            // contour bands, as in a drawn landscape
    const blot = noise(x, z, 7, W.seed + 5) * .6 + noise(x, z, 2.3, W.seed + 6) * .4      // soft patches, as in a wash of colour
    C.push(mixc(c, g[2], Math.max(0, band) * 1.5 + (blot > .62 ? .18 : 0)).map(v => v * (1 + band * .4) * (.94 + blot * .1)))
  }
  const at = (i, j) => [x0 + i * step, H[j * (n + 1) + i], z0 + j * step], nAt = (i, j) => { const l = H[j * (n + 1) + Math.max(0, i - 1)], r = H[j * (n + 1) + Math.min(n, i + 1)], d = H[Math.max(0, j - 1) * (n + 1) + i], u = H[Math.min(n, j + 1) * (n + 1) + i]; return norm([l - r, 2 * step, d - u]) }
  // edge normals need neighbours outside the chunk: recompute from the height function there
  const nEdge = (i, j) => { if (i > 0 && j > 0 && i < n && j < n) return nAt(i, j); const x = x0 + i * step, z = z0 + j * step, e = step; return norm([heightAt(W, x - e, z) - heightAt(W, x + e, z), 2 * e, heightAt(W, x, z - e) - heightAt(W, x, z + e)]) }
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const q = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]]
    for (const [a, b, c] of [[0, 2, 1], [0, 3, 2]]) for (const k of [a, b, c]) { const [ii, jj] = q[k]; M.vert(at(ii, jj), nEdge(ii, jj), C[jj * (n + 1) + ii]) }
  }
  for (const t of things.trees) { // a Moebius tree: a leaning trunk with round, layered crowns
    const h = 6 + t.s * 9, lean = [Math.cos(t.a) * .12 * h, 0, Math.sin(t.a) * .12 * h], top = [t.x + lean[0], t.y + h, t.z + lean[2]]
    M.tube([t.x, t.y - .5, t.z], top, .35 * t.s + .25, .12, 7, mixc(wood, [0, 0, 0], .1))
    const c = leaf[t.t < .5 ? 0 : 1]
    for (let k = 0; k < 3; k++) { const r = (2.4 - k * .5) * (.7 + t.s * .5); M.blob([top[0] + Math.cos(t.a + k * 2) * k * .6, top[1] - 1 + k * 1.4, top[2] + Math.sin(t.a + k * 2) * k * .6], r, r * .7, r, mixc(c, [1, 1, 1], k * .08), .18, Math.floor(t.t * 999) + k) }
  }
  for (const l of things.logs) { // a fallen log, with paler cut ends
    const len = 4 + l.s * 6, d = [Math.cos(l.a) * len / 2, 0, Math.sin(l.a) * len / 2], r = .35 + l.s * .35
    const a = [l.x - d[0], heightAt(W, l.x - d[0], l.z - d[2]) + r * .7, l.z - d[2]], b = [l.x + d[0], heightAt(W, l.x + d[0], l.z + d[2]) + r * .7, l.z + d[2]]
    M.tube(a, b, r, r * .9, 9, wood)
    const ends = mixc(wood, [1, .93, .8], .55); M.blob(a, r * .95, r * .95, r * .95, ends, .02, 3); M.blob(b, r * .85, r * .85, r * .85, ends, .02, 4)
  }
  for (const k of things.rocks) M.blob([k.x, k.y + k.s * .2, k.z], 1 + k.s * 1.6, .6 + k.s * .8, 1 + k.s * 1.2, rock, .25, Math.floor(k.t * 999))
  for (const t of things.grass) { // tufts: a few thin blades
    for (let b = 0; b < 4; b++) { const a = t.a + b * 1.6, h = .22 + t.s * .4, x = t.x + Math.cos(a) * .15, z = t.z + Math.sin(a) * .15, tip = [x + Math.cos(a) * .18, t.y + h, z + Math.sin(a) * .18], w = [Math.sin(a) * .035, 0, -Math.cos(a) * .035]
      M.tri([x - w[0], t.y - .05, z - w[2]], [x + w[0], t.y - .05, z + w[2]], tip, mixc(grass, [1, 1, .85], .15 + b * .05)); M.tri([x + w[0], t.y - .05, z + w[2]], [x - w[0], t.y - .05, z - w[2]], tip, mixc(grass, [0, 0, 0], .08)) }
  }
  return M.array()
}

// ---- fruit bodies: one mesh per form, one metre tall, drawn many times with each mushroom's own size and colours.
// Profiles are [radius, height] from the ground up. Stem colour is white, cap white, gills white: the shader tints
// each part with the mushroom's own colours.
const W1 = [1, 1, 1]
export function formMesh(form) {
  const M = new Mesh(), s = 16
  const cap = (y, r, h, flat = 0) => M.lathe([[r * .98, y - h * .08], [r, y], [r * .93, y + h * .45], [r * .7, y + h * .82], [r * .35, y + h * (1 - flat * .4)], [0, y + h * (1 - flat * .3)]], s, W1, 2)
  const under = (y, r, rin = .08) => M.lathe([[rin, y + .02], [r * .98, y - .02]], s, W1, 3)  // the underside, facing down
  const stem = (h, r0, r1, bulb = 1) => M.lathe([[r0 * bulb, 0], [r0, h * .15], [r1 * 1.05, h * .7], [r1, h]], 10, W1, 1)
  switch (form) {
    case 'bolete': stem(.55, .17, .13, 1.4); cap(.52, .36, .42, .3); under(.5, .35, .12); break
    case 'bracket': case 'crust': M.lathe([[.08, 0], [.1, .5], [.06, .7]], 8, W1, 1); for (let k = 0; k < (form == 'crust' ? 1 : 3); k++) { const y = .25 + k * .22, r = .5 - k * .1; M.lathe([[r, y], [r * .9, y + .06], [r * .5, y + .12], [0, y + .14]], s, W1, 2); M.lathe([[0, y - .01], [r, y - .01]], s, W1, 3) } break
    case 'chanterelle': M.lathe([[.06, 0], [.09, .4], [.25, .75], [.42, .95], [.4, 1], [.2, .92], [0, .9]], s, W1, 2); break
    case 'cup': case 'birdsnest': M.lathe([[.05, 0], [.22, .15], [.4, .45], [.42, .5], [.36, .48], [.2, .25], [0, .22]], s, W1, 2); if (form == 'birdsnest') for (let k = 0; k < 3; k++) M.blob([Math.cos(k * 2.1) * .1, .27, Math.sin(k * 2.1) * .1], .07, .04, .07, W1, .05, k, 3); break
    case 'morel': stem(.4, .16, .14); M.lathe([[.2, .38], [.24, .55], [.2, .8], [.1, .98], [0, 1.02]], s, W1, 2); for (let k = 0; k < 18; k++) { const a = k * 2.4, y = .45 + (k % 6) * .09, r = .22 - (y - .45) * .25; M.blob([Math.cos(a) * r, y, Math.sin(a) * r], .05, .06, .05, W1, .05, k, 3) } break
    case 'puffball': case 'truffle': case 'earthstar': if (form == 'earthstar') for (let k = 0; k < 7; k++) { const a = k / 7 * TAU; M.tri([Math.cos(a - .25) * .2, .02, Math.sin(a - .25) * .2], [Math.cos(a) * .6, .01, Math.sin(a) * .6], [Math.cos(a + .25) * .2, .02, Math.sin(a + .25) * .2], W1, 3) } M.blob([0, form == 'truffle' ? .15 : .38, 0], .38, .36, .38, W1, .06, 5, 2); break
    case 'jelly': for (let k = 0; k < 5; k++) M.blob([Math.cos(k * 1.3) * .2, .2 + k * .12, Math.sin(k * 1.3) * .2], .2, .14, .2, W1, .3, k, 2); break
    case 'coral': case 'club': { const br = (a, b, r, d) => { M.tube(a, b, r, r * .75, 6, W1); if (d < (form == 'club' ? 0 : 3)) for (const s2 of [-1, 1]) { const dir = norm([b[0] - a[0] + s2 * .2 * Math.cos(d), b[1] - a[1], b[2] - a[2] + s2 * .2 * Math.sin(d)]), len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * .72; br(b, [b[0] + dir[0] * len, b[1] + dir[1] * len, b[2] + dir[2] * len], r * .75, d + 1) } }; if (form == 'club') { M.lathe([[.06, 0], [.08, .4], [.15, .8], [.12, .98], [0, 1]], 10, W1, 2) } else for (let k = 0; k < 3; k++) br([Math.cos(k * 2) * .05, 0, Math.sin(k * 2) * .05], [Math.cos(k * 2) * .12, .35, Math.sin(k * 2) * .12], .07, 0); break }
    case 'stinkhorn': stem(.9, .1, .08); M.lathe([[.12, .82], [.12, .95], [.07, 1.04], [0, 1.06]], 10, W1, 2); M.blob([0, .05, 0], .16, .1, .16, W1, .05, 2, 3); break
    case 'tooth': cap(.45, .38, .32); for (let k = 0; k < 40; k++) { const a = k * 2.4, r = .34 * Math.sqrt((k + .5) / 40); M.tube([Math.cos(a) * r, .45, Math.sin(a) * r], [Math.cos(a) * r, .45 - .12 - (k % 4) * .03, Math.sin(a) * r], .015, .002, 4, W1) } stem(.45, .12, .1); break
    case 'none': M.blob([0, .1, 0], .14, .1, .14, W1, .2, 9, 2); break
    case 'mote': M.blob([0, .5, 0], .5, .5, .5, W1, .05, 3, 2); break   // a spore, drawn as a small bright bead
    default: stem(.82, .1, .075, 1.25); cap(.8, .4, .26); under(.79, .39) // an agaric
  }
  // stems are drawn with part 1 even inside tube(); mark tube vertices (part 0) of mushrooms as stems
  for (let i = 9; i < M.v.length; i += 10) if (M.v[i] == 0) M.v[i] = 1
  return M.array()
}
export const FORMS = ['mote', 'agaric', 'bolete', 'bracket', 'crust', 'chanterelle', 'cup', 'birdsnest', 'morel', 'puffball', 'truffle', 'earthstar', 'jelly', 'coral', 'club', 'stinkhorn', 'tooth', 'none']
