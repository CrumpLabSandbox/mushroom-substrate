// The world: endless ground made from a seed. Everything here is a pure function of the seed and a position, so
// the same seed always gives the same place, and walking back finds the same mushrooms where you left them.
// Units are metres; x is east, z is south, y is up.

// ---- seeded numbers
export const hash2 = (x, z, s) => { let h = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(s | 0, 2246822519); h = Math.imul(h ^ h >>> 13, 1274126177); return ((h ^ h >>> 16) >>> 0) / 4294967296 }
export const rng = seed => { let a = seed >>> 0 || 1; return () => (a = a + 0x6D2B79F5 | 0, a = Math.imul(a ^ a >>> 15, 1 | a) >>> 0, a = (a + Math.imul(a ^ a >>> 7, 61 | a) ^ a) >>> 0, ((a ^ a >>> 14) >>> 0) / 4294967296) }
const smooth = t => t * t * (3 - 2 * t), lerp = (a, b, t) => a + (b - a) * t
export const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v
// value noise on a grid of `size` metres, 0..1
export const noise = (x, z, size, s) => { const gx = x / size, gz = z / size, ix = Math.floor(gx), iz = Math.floor(gz), fx = smooth(gx - ix), fz = smooth(gz - iz); return lerp(lerp(hash2(ix, iz, s), hash2(ix + 1, iz, s), fx), lerp(hash2(ix, iz + 1, s), hash2(ix + 1, iz + 1, s), fx), fz) }
const fbm = (x, z, size, s, oct = 5) => { let v = 0, a = .5, t = 0; for (let o = 0; o < oct; o++) { v += noise(x, z, size, s + o * 101) * a; t += a; size /= 2.07; a *= .5 } return v / t }

// ---- the look of a world: Moebius-like palettes, each a sky, a ground and an ink
export const PALETTES = [
  { name: 'Peach desert', sky: ['#f6e2c4', '#9fd6d2', '#5e8fb3'], sun: '#fff4d6', ground: ['#e9c79d', '#d79b74', '#b8735a'], grass: '#c9c27a', leaf: ['#e8a35c', '#d1694f'], wood: '#8a5a44', rock: '#cfb7a3', ink: '#2e2238', shade: '#7b5f8f', fog: '#f2d9bd' },
  { name: 'Violet garage', sky: ['#f2d6e6', '#b9a6dd', '#5d5a9e'], sun: '#fff0f6', ground: ['#c9b5d9', '#9d8cc2', '#6f6aa6'], grass: '#8fc7b0', leaf: ['#79cdb8', '#4fa3a6'], wood: '#5d4a6e', rock: '#d8c9e3', ink: '#231b33', shade: '#4d3f74', fog: '#e6d3ea' },
  { name: 'Jade marsh', sky: ['#e9f2d8', '#a8d8c3', '#4f8f8c'], sun: '#fbffe6', ground: ['#b7d39a', '#86b07f', '#5a8a6a'], grass: '#d8e08a', leaf: ['#f0b860', '#e0784e'], wood: '#6e5440', rock: '#c2cdb6', ink: '#1f2a26', shade: '#3f5f63', fog: '#dcebd0' },
  { name: 'Rust mesa', sky: ['#fbe7cf', '#f0b78f', '#c26b5a'], sun: '#fff7e8', ground: ['#e3a77a', '#c9765a', '#99504a'], grass: '#d9b06a', leaf: ['#7fb3a0', '#4f8a86'], wood: '#5a3a33', rock: '#e8c3a3', ink: '#2b1d1d', shade: '#7a4560', fog: '#f4d2b4' },
  { name: 'Ice field', sky: ['#f4f6fb', '#c4dcef', '#7aa1c9'], sun: '#ffffff', ground: ['#e7eef4', '#c3d3e2', '#8fa6c0'], grass: '#b6c9a6', leaf: ['#e6a8b8', '#b77a9e'], wood: '#6a6278', rock: '#f1f4f8', ink: '#22283a', shade: '#6d7fa8', fog: '#e6edf5' },
  { name: 'Night bloom', sky: ['#3b3666', '#22234a', '#0f1230'], sun: '#e7f3ff', ground: ['#4a4f7a', '#383d66', '#262a4d'], grass: '#4f8a8a', leaf: ['#7de3c3', '#9a7de3'], wood: '#2f2a44', rock: '#6a6c94', ink: '#07080f', shade: '#1c1d3c', fog: '#2c2f5a', night: true },
]

// ---- the kinds of ground. Each has its shapes and what can grow there (families from species/families)
export const BIOMES = {
  meadow: { name: 'meadow', families: ['RING', 'LIT', 'DIF'], trees: .004, logs: .002, rocks: .004, grass: .5, rough: .5 },
  forest: { name: 'forest', families: ['ECM-S', 'ECM-M', 'ECM-L', 'HOST', 'LIT'], trees: .03, logs: .006, rocks: .004, grass: .2, rough: .8 },
  deadwood: { name: 'fallen wood', families: ['MAT', 'CORD-S', 'CORD-L', 'RHIZ'], trees: .01, logs: .03, rocks: .006, grass: .15, rough: .7 },
  dunes: { name: 'dunes', families: ['DIF', 'GARDEN', 'ECM-S'], trees: .0015, logs: .0015, rocks: .012, grass: .06, rough: 1.4 },
}
export const BIOME_KEYS = Object.keys(BIOMES)

// A world: the seed's palette, how rough its ground is, which biomes it favours, and the species that live in it.
//   species: [{ slug, name, family, form, size, invented }] from plugins/specimens/index.json
//   random:  true puts any species anywhere; false grows each where its family belongs
export function makeWorld(seed, species, random = false) {
  const r = rng(seed * 7919 + 13), pal = PALETTES[Math.floor(r() * PALETTES.length)]
  const relief = .6 + r() * 1.6, scale = 120 + r() * 160, invented = r() < .25
  // the cast: up to three species for each biome, chosen from those whose family fits; invented worlds use invented species
  const pool = species.filter(s => !!s.invented == invented || (invented && r() < .2))
  const cast = {}
  for (const b of BIOME_KEYS) {
    let fit = random ? pool : pool.filter(s => BIOMES[b].families.includes(s.family))
    if (fit.length < 3) fit = pool
    const pick = []; for (let k = 0; k < 3; k++) pick.push(fit[Math.floor(r() * fit.length)])
    cast[b] = [...new Set(pick)]
  }
  const weights = BIOME_KEYS.map(() => .2 + r()), size = ['4k', '40k', '400k', '4m'][Math.floor(r() * 4)]
  const names = ['Hollow', 'Reach', 'Barrens', 'Garden', 'Fold', 'Drift', 'Spires', 'Basin', 'Margin', 'Shelf']
  return { seed, pal, relief, scale, cast, weights, random, invented, scaleTier: r() < .5 ? '400k' : size, title: `${pal.name.split(' ')[0]} ${names[Math.floor(r() * names.length)]}`, density: .6 + r() * .8 }
}

// the ground's height at a point, in metres
export function heightAt(W, x, z) {
  const s = W.seed, big = fbm(x, z, W.scale * 2.2, s + 1, 4), mid = fbm(x, z, W.scale * .5, s + 2, 4), b = biomeWeights(W, x, z)
  let rough = 0; BIOME_KEYS.forEach((k, i) => rough += b[i] * BIOMES[k].rough)
  const mesa = W.pal.name.startsWith('Rust') ? Math.round(big * 5) / 5 * .6 + big * .4 : big   // stepped land in the mesa palette
  return (mesa - .5) * 26 * W.relief + (mid - .5) * 6 * rough * W.relief
}
// how much of each biome is at a point (they blend at their edges); sums to 1
export function biomeWeights(W, x, z) {
  const a = noise(x, z, 260, W.seed + 31), c = noise(x, z, 190, W.seed + 37)
  const centres = [[.25, .3], [.75, .35], [.3, .78], [.72, .76]]
  const w = centres.map(([u, v], i) => W.weights[i] / (.02 + (a - u) ** 2 + (c - v) ** 2) ** 2)
  const t = w.reduce((p, q) => p + q, 0); return w.map(v => v / t)
}
export const biomeAt = (W, x, z) => { const w = biomeWeights(W, x, z); let best = 0; for (let i = 1; i < w.length; i++) if (w[i] > w[best]) best = i; return BIOME_KEYS[best] }

// Everything in one square of ground, CHUNK metres a side: trees, logs, rocks, grass, and mushrooms.
export const CHUNK = 32
export function chunkContents(W, cx, cz) {
  const r = rng(Math.floor(hash2(cx, cz, W.seed) * 4294967296)), x0 = cx * CHUNK, z0 = cz * CHUNK, out = { trees: [], logs: [], rocks: [], grass: [], mushrooms: [] }
  const area = CHUNK * CHUNK
  const place = () => { const x = x0 + r() * CHUNK, z = z0 + r() * CHUNK; return { x, z, y: heightAt(W, x, z), biome: biomeAt(W, x, z) } }
  const count = (k, b) => { const n = BIOMES[b][k] * area; return Math.floor(n) + (r() < n % 1 ? 1 : 0) }
  const here = biomeAt(W, x0 + CHUNK / 2, z0 + CHUNK / 2)
  for (const k of ['trees', 'logs', 'rocks']) for (let i = count(k, here); i--;) { const p = place(); if (BIOMES[p.biome][k] < .003 && r() < .6) continue; out[k].push({ ...p, s: .6 + r() * .9, a: r() * Math.PI * 2, t: r() }) }
  for (let i = Math.round(BIOMES[here].grass * 260); i--;) { const p = place(); out.grass.push({ ...p, s: .4 + r() * .8, a: r() * Math.PI * 2 }) }
  // mushrooms: in clusters (a mycelium fruits in groups), more where wood and trees are
  const clusters = Math.round((4 + r() * 5) * W.density)
  for (let c = 0; c < clusters; c++) {
    let p = place()
    const anchor = (here == 'deadwood' && out.logs.length && r() < .7) ? out.logs[Math.floor(r() * out.logs.length)] : (here == 'forest' && out.trees.length && r() < .6) ? out.trees[Math.floor(r() * out.trees.length)] : null
    if (anchor) p = { x: anchor.x + (r() - .5) * 4, z: anchor.z + (r() - .5) * 4, biome: anchor.biome }
    const cast = W.cast[p.biome], sp = cast[Math.floor(r() * cast.length)]
    if (!sp) continue
    const n = 2 + Math.floor(r() * (sp.form == 'bracket' ? 3 : 7)), ring = sp.family == 'RING' && r() < .5
    for (let k = 0; k < n; k++) {
      const a = ring ? k / n * Math.PI * 2 : r() * Math.PI * 2, d = ring ? 3 + r() * .3 : Math.sqrt(r()) * 2.4
      const x = p.x + Math.cos(a) * d, z = p.z + Math.sin(a) * d
      out.mushrooms.push({ id: `${cx}.${cz}.${c}.${k}`, x, z, y: heightAt(W, x, z), sp, lead: k == 0, s: (k == 0 ? 1 : .45 + r() * .5), a: r() * Math.PI * 2, lean: (r() - .5) * .25, born: r() })
    }
  }
  return out
}

// How tall a fruit body is drawn, in metres. Real sizes are centimetres; this is a storybook world, so they are
// enlarged, the small ones most: a 5 cm cap stands about a metre and a half tall, a 40 cm bracket about four.
export const drawnHeight = sizeCm => .55 + .3 * Math.pow(Math.max(.2, sizeCm), .75)
