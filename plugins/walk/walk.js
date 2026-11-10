// The walk: an endless seeded world at ground level, with mushrooms growing in it, and the nearest of them playing.
// What you hear is whatever is near you, placed where it stands, so the piece composes itself as you walk.
import { makeWorld, chunkContents, heightAt, biomeAt, BIOMES, CHUNK, drawnHeight, hash2, rng, clamp } from './world.js'
import { chunkMesh, formMesh, FORMS, hex } from './shapes.js'
import { makeRenderer, perspective, mul, view, invert } from './render.js'

const $ = id => document.getElementById(id), q = new URLSearchParams(location.hash.slice(1))
const R = makeRenderer($('world'))
const index = await (await fetch('../specimens/index.json')).json()
const SPECIES = index.map(([slug, name, common, family, form, invented]) => ({ slug, name, common, family, form, invented: !!invented }))

// ---- what each mushroom can sound as: the plugins' own declarations, for their controls' ranges
const INST = ['hyphal-harp', 'cap-drums', 'spike-table', 'coupled-spikes', 'turgor-bow', 'rhizomorph-bass', 'fairy-ring', 'gill-comb']
const COMP = ['spike-canon', 'hyphal-walk', 'tip-chorus', 'growth-form', 'season-cycle', 'spore-scatter']
const ATMO = ['rain-on-caps', 'spore-cloud', 'spike-chord', 'decay', 'after-rain']      // the ones that play by themselves, without a live colony
const FX = ['mycelium-reverb', 'cord-delay', 'excitable-gate', 'spore-granulator', 'rot-filter', 'soil-filter']
const DEFS = {}; await Promise.all([...INST, ...COMP, ...ATMO, ...FX].map(async id => DEFS[id] = (await import(`../${id}/def.js`)).def))
// a plugin's controls set from a seed: each moved from its default by a random amount, within its range
const KEEP = new Set(['level', 'mix', 'stage', 'octave', 'thin', 'length', 'year', 'speed'])
const seeded = (id, r, spread = .55) => DEFS[id].params.filter(p => !KEEP.has(p.id)).map(p => { let v = p.value + (r() - .5) * (p.max - p.min) * spread; v = clamp(v, p.min, p.max); if (p.step) v = Math.round(v / p.step) * p.step; return [p.id, v] })
// the sound of one mushroom: decided by the world's seed and where it stands, so it is the same every visit
const voiceOf = (W, m) => {
  const r = rng(Math.floor(hash2(m.x * 7 | 0, m.z * 7 | 0, W.seed) * 4294967296)), v = {}
  if (r() < .3) { v.atmo = ATMO[Math.floor(r() * ATMO.length)]; v.params = { atmo: seeded(v.atmo, r) } }
  else { v.inst = INST[Math.floor(r() * INST.length)]; v.comp = COMP[Math.floor(r() * COMP.length)]; v.params = { inst: seeded(v.inst, r), comp: [...seeded(v.comp, r), ['thin', .35 + r() * .5], ['octave', Math.round((r() - .5) * 2)]] } }
  if (r() < .45) { v.fx = FX[Math.floor(r() * FX.length)]; v.fxMix = .3 + r() * .45; v.params.fx = seeded(v.fx, r) }
  v.label = v.atmo ? DEFS[v.atmo].name : `${DEFS[v.comp].name} on ${DEFS[v.inst].name}`; if (v.fx) v.label += ` · ${DEFS[v.fx].name}`
  return v
}

// ---- the world and its specimens
let W, specs = {}, seed = +(q.get('seed') || Math.floor(Math.random() * 1e6)), random = q.get('random') == '1', limit = +(q.get('voices') || 8)
const chunks = new Map(), forms = Object.fromEntries(FORMS.map(f => [f, R.instanced(formMesh(f))]))
const loadWorld = async () => {
  const next = makeWorld(seed, SPECIES, random), cast = [...new Set(Object.values(next.cast).flat())], got = {}
  await Promise.all(cast.map(async s => { got[s.slug] = await (await fetch(`../specimens/${next.scaleTier}/${s.slug}.json`)).json() }))
  // only now swap the worlds, all at once, so a frame never sees the old voices with the new species
  for (let i = 0; i < SLOTS; i++) release(i)
  for (const c of chunks.values()) R.free(c.mesh); chunks.clear()
  W = next; specs = got
  history.replaceState(null, '', `#seed=${seed}${random ? '&random=1' : ''}&voices=${limit}`)
  $('title').textContent = W.title; $('seed').textContent = `seed ${seed} · ${W.scaleTier.toUpperCase()} simulator${W.invented ? ' · invented species' : ''}${random ? ' · anything grows anywhere' : ''}`
  $('cast').innerHTML = Object.entries(W.cast).map(([b, list]) => `<div><b>${BIOMES[b].name}</b> ${list.map(s => `<i>${s.name}</i>`).join(', ')}</div>`).join('')
  // start a few metres from the nearest group of mushrooms, facing it
  if (!q.has('x')) { let best = null; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) for (const m of chunkContents(W, i, j).mushrooms) if (m.lead) { const d = Math.hypot(m.x, m.z); if (!best || d < best[0]) best = [d, m] }
    if (best) { const m = best[1]; me.x = m.x + 7; me.z = m.z + 3; me.yaw = Math.atan2(m.x - me.x, -(m.z - me.z)) } }
  me.y = heightAt(W, me.x, me.z) + EYE
}

// ---- walking
const EYE = 1.7, me = { x: +(q.get('x') || 0), z: +(q.get('z') || 0), y: 0, yaw: 0, pitch: -.06, vx: 0, vz: 0, bob: 0 }, keys = {}
addEventListener('keydown', e => { if (e.target.tagName == 'INPUT') return; keys[e.code] = true; if (e.code == 'KeyR' && !e.metaKey) reseed() })
addEventListener('keyup', e => keys[e.code] = false)
const cv = $('world')
cv.addEventListener('click', () => { start(); if (!matchMedia('(pointer: coarse)').matches && cv.requestPointerLock) { const p = cv.requestPointerLock(); p && p.catch && p.catch(() => {}) } })
addEventListener('mousemove', e => { if (document.pointerLockElement != cv) return; me.yaw += e.movementX * .0022; me.pitch = clamp(me.pitch - e.movementY * .0022, -1.3, 1.3) })
document.addEventListener('pointerlockchange', () => document.pointerLockElement == cv && $('hint').classList.add('gone'))
// touch: drag on the left half to walk, on the right half to look
const touches = {}
cv.addEventListener('touchstart', e => { start(); for (const t of e.changedTouches) touches[t.identifier] = { x: t.clientX, y: t.clientY, x0: t.clientX, y0: t.clientY, left: t.clientX < innerWidth / 2 }; e.preventDefault() }, { passive: false })
cv.addEventListener('touchmove', e => { for (const t of e.changedTouches) { const s = touches[t.identifier]; if (!s) continue; if (!s.left) { me.yaw += (t.clientX - s.x) * .005; me.pitch = clamp(me.pitch - (t.clientY - s.y) * .005, -1.3, 1.3) } s.x = t.clientX; s.y = t.clientY } e.preventDefault() }, { passive: false })
cv.addEventListener('touchend', e => { for (const t of e.changedTouches) delete touches[t.identifier] })
const move = dt => {
  let f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0), s = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0)
  for (const t of Object.values(touches)) if (t.left) { f += clamp(-(t.y - t.y0) / 60, -1, 1); s += clamp((t.x - t.x0) / 60, -1, 1) }
  const speed = (keys.ShiftLeft || keys.ShiftRight ? 6 : 2.2), l = Math.hypot(f, s) || 1, k = Math.min(1, Math.hypot(f, s))
  const tx = (Math.sin(me.yaw) * f + Math.cos(me.yaw) * s) / l * speed * k, tz = (-Math.cos(me.yaw) * f + Math.sin(me.yaw) * s) / l * speed * k
  me.vx += (tx - me.vx) * Math.min(1, dt * 6); me.vz += (tz - me.vz) * Math.min(1, dt * 6)
  me.x += me.vx * dt; me.z += me.vz * dt; const v = Math.hypot(me.vx, me.vz); me.bob += v * dt * 2.1
  const ground = heightAt(W, me.x, me.z) + EYE + Math.sin(me.bob * 2) * .035 * Math.min(1, v / 2); me.y += (ground - me.y) * Math.min(1, dt * 10)
}

// ---- streaming the ground: the squares near you, nearest first, a few each frame
const VIEW = 4, FAR = 150
const stream = now => {
  const cx = Math.floor(me.x / CHUNK), cz = Math.floor(me.z / CHUNK), need = []
  for (let j = -VIEW; j <= VIEW; j++) for (let i = -VIEW; i <= VIEW; i++) if (i * i + j * j <= VIEW * VIEW + 1) { const k = (cx + i) + ',' + (cz + j); if (!chunks.has(k)) need.push([i * i + j * j, cx + i, cz + j, k]) }
  need.sort((a, b) => a[0] - b[0])
  for (const [, x, z, k] of need.slice(0, chunks.size < 9 ? 9 : 2)) { const things = chunkContents(W, x, z); chunks.set(k, { mesh: R.upload(chunkMesh(W, x, z, things, x == cx && z == cz ? .5 : 1)), things, at: now }) }
  for (const [k, c] of chunks) { const [x, z] = k.split(',').map(Number); if ((x - cx) ** 2 + (z - cz) ** 2 > (VIEW + 1.5) ** 2) { R.free(c.mesh); chunks.delete(k) } }
}

// ---- sound
const SLOTS = 10
let ctx = null, node = null, panners = [], sends = [], slots = Array(SLOTS).fill(null), levels = Array(SLOTS).fill(0), master
async function start() {
  if (ctx) { if (ctx.state != 'running') ctx.resume(); return }
  ctx = new AudioContext({ latencyHint: 'playback' }); await ctx.audioWorklet.addModule('walk-worklet.js')
  node = new AudioWorkletNode(ctx, 'walk', { numberOfInputs: 0, numberOfOutputs: SLOTS, outputChannelCount: Array(SLOTS).fill(2) })
  node.port.onmessage = e => { if (e.data.levels) levels = e.data.levels; if (e.data.error) console.warn('slot', e.data.slot, e.data.error) }
  // a shared space: farther voices send more to a long, soft reverb, the way distance sounds outdoors
  const verb = ctx.createConvolver(), len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c), r = rng(17 + c); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 2.6) * (i < 600 ? i / 600 : 1) }
  verb.buffer = ir
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .01; comp.release.value = .3
  master = ctx.createGain(); master.gain.value = +$('vol').value
  const wet = ctx.createGain(); wet.gain.value = .55; verb.connect(wet).connect(comp); comp.connect(master).connect(ctx.destination)
  for (let i = 0; i < SLOTS; i++) {
    const p = new PannerNode(ctx, { panningModel: 'HRTF', distanceModel: 'inverse', refDistance: 4, rolloffFactor: 1.15, maxDistance: 90 })
    const s = ctx.createGain(); s.gain.value = 0
    node.connect(p, i); p.connect(comp); p.connect(s).connect(verb); panners.push(p); sends.push(s)
  }
  $('hint').querySelector('b').textContent = 'Sound is on.'; setTimeout(() => $('hint').classList.add('gone'), 5000)
}
function release(i) { if (slots[i]) { node && node.port.postMessage({ release: i }); slots[i] = null } }
let lastPick = 0
const pick = now => { // which mushrooms are heard: the nearest leads of each cluster, at most `limit`
  if (!node || now - lastPick < .25) return; lastPick = now
  const leads = []; for (const c of chunks.values()) for (const m of c.things.mushrooms) if (m.lead) { const d = Math.hypot(m.x - me.x, m.z - me.z); if (d < 60) leads.push([d, m]) }
  leads.sort((a, b) => a[0] - b[0])
  const want = new Set(leads.slice(0, limit).map(([, m]) => m.id)), keep = new Set(leads.slice(0, limit + 3).map(([, m]) => m.id))
  slots.forEach((s, i) => { if (s && (!keep.has(s.m.id) || i >= limit)) release(i) })
  for (const [, m] of leads.slice(0, limit)) {
    if (slots.some(s => s && s.m.id == m.id)) continue
    const i = slots.findIndex((s, k) => !s && k < limit); if (i < 0) break
    const spec = specs[m.sp.slug]; if (!spec) continue
    const v = voiceOf(W, m); slots[i] = { m, v }
    node.port.postMessage({ slot: i, assign: { id: m.id, inst: v.inst, comp: v.comp, atmo: v.atmo, fx: v.fx, fxMix: v.fxMix, params: v.params, spec } })
  }
}
const place = () => {
  if (!ctx) return
  const l = ctx.listener, t = ctx.currentTime, f = [Math.sin(me.yaw) * Math.cos(me.pitch), Math.sin(me.pitch), -Math.cos(me.yaw) * Math.cos(me.pitch)]
  if (l.positionX) { l.positionX.setTargetAtTime(me.x, t, .03); l.positionY.setTargetAtTime(me.y, t, .03); l.positionZ.setTargetAtTime(me.z, t, .03); l.forwardX.setTargetAtTime(f[0], t, .03); l.forwardY.setTargetAtTime(f[1], t, .03); l.forwardZ.setTargetAtTime(f[2], t, .03); l.upX.value = 0; l.upY.value = 1; l.upZ.value = 0 }
  else { l.setPosition(me.x, me.y, me.z); l.setOrientation(f[0], f[1], f[2], 0, 1, 0) }
  slots.forEach((s, i) => { if (!s || !specs[s.m.sp.slug]) return; const p = panners[i], h = drawnHeight(specs[s.m.sp.slug].fruit.size_cm.reduce((a, b) => a + b) / 2) * s.m.s * .7; p.positionX.setTargetAtTime(s.m.x, t, .05); p.positionY.setTargetAtTime(s.m.y + h, t, .05); p.positionZ.setTargetAtTime(s.m.z, t, .05); sends[i].gain.setTargetAtTime(clamp(Math.hypot(s.m.x - me.x, s.m.z - me.z) / 40, .08, .9), t, .2) })
}

// ---- the panel
function reseed() { seed = Math.floor(Math.random() * 1e6); q.delete('x'); me.x = me.z = 0; loadWorld() }
$('reseed').onclick = e => { e.stopPropagation(); reseed() }
$('random').checked = random; $('random').onchange = e => { random = e.target.checked; loadWorld() }
$('voices').value = limit; $('vcount').textContent = limit; $('voices').oninput = e => { limit = +e.target.value; $('vcount').textContent = limit; history.replaceState(null, '', `#seed=${seed}${random ? '&random=1' : ''}&voices=${limit}`) }
$('vol').oninput = e => master && (master.gain.value = +e.target.value)
for (const el of document.querySelectorAll('.panel, .panel *')) el.addEventListener('click', e => e.stopPropagation())
const listen = () => {
  const rows = slots.map((s, i) => s && { s, i, d: Math.hypot(s.m.x - me.x, s.m.z - me.z) }).filter(Boolean).sort((a, b) => a.d - b.d)
  $('hear').innerHTML = rows.filter(r => specs[r.s.m.sp.slug]).map(({ s, i, d }) => { const a = Math.atan2(s.m.x - me.x, -(s.m.z - me.z)) - me.yaw, dir = ['ahead', 'ahead right', 'right', 'behind right', 'behind', 'behind left', 'left', 'ahead left'][((Math.round(a / (Math.PI / 4)) % 8) + 8) % 8]
    return `<div class="row"><span class="dot" style="--c:${specs[s.m.sp.slug].colours[1]};--l:${clamp(levels[i] * 6)}"></span><span><b>${s.m.sp.name}</b>${s.m.sp.invented ? ' <em>invented</em>' : ''}<br><small>${s.v.label}</small></span><span class="far">${d.toFixed(0)} m<br><small>${dir}</small></span></div>` }).join('') || '<small>Nothing near enough to hear. Walk on.</small>'
}

// ---- each frame
const sunOf = W => { const a = hash2(1, 2, W.seed) * 6.28, e = .45 + hash2(3, 4, W.seed) * .35; return [Math.cos(a) * Math.cos(e), Math.sin(e), Math.sin(a) * Math.cos(e)] }
const inst = {}; for (const f of FORMS) inst[f] = { data: new Float32Array(17 * 64), n: 0 }
let last = performance.now(), uiAt = 0
const frame = ms => {
  requestAnimationFrame(frame)   // first, so one bad frame never stops the world
  const now = ms / 1000, dt = Math.min(.05, (ms - last) / 1000); last = ms
  if (W) {
    move(dt); stream(now); pick(now); place()
    // the fruit bodies: each grows in over a few seconds after its square of ground appears, and glows while it sounds
    for (const f of FORMS) inst[f].n = 0
    const glowOf = {}; slots.forEach((s, i) => { if (s) glowOf[s.m.id] = clamp(levels[i] * 7) })
    for (const c of chunks.values()) for (const m of c.things.mushrooms) {
      const sp = specs[m.sp.slug]; if (!sp) continue
      const form = FORMS.includes(sp.fruit.form) ? sp.fruit.form : 'agaric', I = inst[form]
      if ((I.n + 1) * 17 > I.data.length) { const bigger = new Float32Array(I.data.length * 2); bigger.set(I.data); I.data = bigger }
      const grown = clamp((now - c.at - m.born * 5) / 6), h = drawnHeight((sp.fruit.size_cm[0] + sp.fruit.size_cm[1]) / 2) * m.s, col = sp.colours.map(hex), o = I.n++ * 17, D = I.data
      D.set([m.x, m.y - .05, m.z, h, m.a, m.lean, grown, glowOf[m.id] || 0, ...col[2], ...col[1], ...col[1].map(v => v * .75 + .2)], o)
    }
    // spores rising from the mushrooms that are sounding: more and faster the louder they are
    slots.forEach((s, i) => { if (!s) return; const lv = clamp(levels[i] * 7), sp = specs[s.m.sp.slug]; if (lv < .05 || !sp) return; const h = drawnHeight((sp.fruit.size_cm[0] + sp.fruit.size_cm[1]) / 2) * s.m.s, col = hex(sp.colours[1]), I = inst.mote
      for (let k = 0; k < 10; k++) { const life = (now * (.12 + .05 * (k % 3)) + k / 10) % 1, a = k * 2.39 + now * .3, r = .3 + life * 2.2
        if ((I.n + 1) * 17 > I.data.length) { const bigger = new Float32Array(I.data.length * 2); bigger.set(I.data); I.data = bigger }
        I.data.set([s.m.x + Math.cos(a) * r, s.m.y + h * .9 + life * 4, s.m.z + Math.sin(a) * r, .09 * Math.sin(life * Math.PI) * (.6 + lv), 0, 0, 1, lv * Math.sin(life * Math.PI), ...col, ...col, ...col], I.n++ * 17) } })
    for (const f of FORMS) R.fill(forms[f], inst[f].data.subarray(0, inst[f].n * 17), inst[f].n)
    const dpr = Math.min(devicePixelRatio || 1, 1.75); R.resize(Math.round(innerWidth * dpr), Math.round(innerHeight * dpr))
    const proj = perspective(1.15, innerWidth / innerHeight, .1, FAR), vp = mul(proj, view([me.x, me.y, me.z], me.yaw, me.pitch))
    R.frame({ eye: [me.x, me.y, me.z], vp, inv: invert(vp), pal: W.pal, sun: sunOf(W), far: FAR, time: now, chunks: [...chunks.values()].map(c => c.mesh), forms: Object.values(forms), seed: W.seed })
    if (now - uiAt > .2) { uiAt = now; listen(); $('where').textContent = `${BIOMES[biomeAt(W, me.x, me.z)].name} · ${Math.round(me.x)}, ${Math.round(me.z)}` }
  }
}
await loadWorld(); requestAnimationFrame(frame)
window.walk = { me, get W() { return W }, slots, chunks, reseed }   // for checking from the console
