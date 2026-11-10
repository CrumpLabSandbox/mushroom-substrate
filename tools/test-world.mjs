// Renders Mushroom World offline: every instrument from the keys through an effect, every composer with a second
// voice and an atmosphere, every atmosphere alone, at all four sizes. Checks the sound is finite, audible and under
// the limiter's ceiling.   node tools/test-world.mjs
import fs from 'fs'
const root = new URL('..', import.meta.url).pathname.replace(/\/$/, ''), { makeWorld } = await import(root + '/plugins/mushroom-world/engine.js'), man = JSON.parse(fs.readFileSync(root + '/plugins/mushroom-world/manifest.json', 'utf8'))
const ch = (id, name) => man.parameters.find(p => p.id == id).choices.indexOf(name)
const sp = (z, s) => JSON.parse(fs.readFileSync(`${root}/plugins/specimens/${z}/${s}.json`, 'utf8'))
let fails = 0
const run = (label, z, slug, sets, keys) => {
  const w = makeWorld(48000); w.spec = sp(z, slug); w.load(w.spec); for (const [k, v] of sets) w.set(k, typeof v == 'string' ? ch(k, v) : v)
  let peak = 0, sum = 0, bad = 0, n = 0; const t0 = Date.now()
  for (let b = 0; b < 48000 * 12 / 128; b++) { if (keys && b % 150 == 0) { w.noteOff(48 + ((b / 150 - 1) * 5) % 24); w.noteOn(48 + (b / 150 * 5) % 24, .8) } if (b % 40 == 0) w.live({ events: Array.from({ length: 12 }, (_, k) => [[0, 1, 3][k % 3], k % 6, (k * 0.37) % 1]), taps: { flow: 300, cords: 150, tips: 80 }, stage: b % 800 == 0 ? w.spec.stages[Math.min(7, 2 + b / 800 | 0)] : undefined }) // what the live grower would send
    if (b == 2000) { w.set('world.growth', .2); w.set('world.wet', .9); w.set('world.temp', -6) } const L = new Float32Array(128), R = new Float32Array(128); w.process(L, R); for (let i = 0; i < 128; i++) { if (!isFinite(L[i]) || !isFinite(R[i])) bad++; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); sum += L[i] * L[i]; n++ } }
  const r = w.report(), rms = Math.sqrt(sum / n), ok = !bad && peak <= .85 && rms > .001; if (!ok) fails++
  console.log(label.padEnd(34), z.padEnd(5), 'peak', peak.toFixed(3), 'rms', rms.toFixed(4), 'LUFS', r.tel[2].toFixed(1), 'x realtime', (12000 / (Date.now() - t0)).toFixed(0), ok ? 'ok' : 'FAIL')
}
const V = man.slots.v1.map(id => man.modules[id].name), Pl = man.slots.players.map(id => man.modules[id].name), A = man.slots.atmo.map(id => man.modules[id].name), F = man.slots.fx.map(id => man.modules[id].name)
V.forEach((v, i) => run('keys: ' + v + ' + ' + F[i % F.length], ['4k', '40k', '400k', '4m'][i % 4], 'pleurotus-ostreatus', [['v1.engine', v], ['fx.engine', F[i % F.length]]], true))
Pl.forEach((p, i) => run(p + ' on ' + V[(i * 3) % 8] + ' + ' + A[i % A.length], ['400k', '4m', '4k', '40k'][i % 4], i % 2 ? 'fulgurella-nervosa' : 'amanita-muscaria', [['v1.engine', V[(i * 3) % 8]], ['v1.player', p], ['v2.engine', V[(i * 5 + 1) % 8]], ['v2.player', Pl[(i + 2) % 6]], ['atmo.engine', A[i % A.length]], ['fx.engine', F[(i + 3) % 6]]], false))
A.forEach((a, i) => run('only ' + a, ['400k', '4m', '4k', '40k'][i % 4], 'armillaria-gallica', [['v1.level', -60], ['atmo.engine', a], ['atmo.level', 0]], false))
process.exit(fails ? 1 : 0)
