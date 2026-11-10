#!/usr/bin/env node
// Repeatability and speed. Runs every packed species in every built engine from seed 1 for a
// fixed number of steps, hashes the state, and compares with tools/hashes.json.
// `--update` rewrites that file. Also checks that seed 2 differs and that event counts add up.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HASHES = path.join(__dirname, 'hashes.json');

const fnv = () => { let h = 0x811c9dc5; return { add(b) { h = Math.imul(h ^ b, 0x01000193) >>> 0; }, hex: () => h.toString(16).padStart(8, '0') }; };
const bytes = (arr, count) => new Uint8Array(arr.buffer, arr.byteOffset, count * arr.BYTES_PER_ELEMENT);

const ENGINES = {
  '4k': {
    steps: 400,
    make: (M, sp, seed) => M(sp.p, seed),
    hash(S) { const h = fnv(); for (const b of S.o) h.add(b); for (const n of [S.len, S.br, S.fu, S.T.length]) for (let k = 0; k < 4; k++) h.add((n >>> (8 * k)) & 255); return h.hex(); },
    summary: (S) => `tips ${S.T.length}  length ${S.len} px  branches ${S.br}  fusions ${S.fu}`,
    events: (S, ev) => ev[0] === S.br && ev[1] === S.fu,
  },
  '40k': {
    steps: 250,
    make: (M, sp, seed) => M(sp.p, seed, sp.s),
    hash(S) { const h = fnv(), n = S.n; for (const a of [S.x1, S.y1, S.si, S.ar]) for (const b of bytes(a, n)) h.add(b); for (let i = 0; i < n; i++) h.add(S.st[i]); for (const b of bytes(S.se, S.se.length)) h.add(b); return h.hex(); },
    summary: (S) => `segments ${S.n}  tips ${S.ntips}  branches ${S.br}  fusions ${S.fu}  alpha ${S.alpha.toFixed(3)}  fruits ${S.fruits}`,
    events: (S, ev) => ev[0] === S.br && ev[1] === S.fu && (ev[6] || 0) === S.fruits,
  },
};

ENGINES['400k'] = {
  steps: 150,
  // hashes are stored for these; every other species gets a short smoke run (it must grow and stay finite)
  full: ['armillaria-gallica', 'coprinopsis-cinerea', 'laccaria-bicolor', 'phanerochaete-velutina', 'pleurotus-ostreatus', 'serpula-lacrymans', 'amanita-muscaria', 'marasmius-oreades'],
  make: (M, sp, seed) => M([{ id: sp.id, p: sp.p }], seed, sp.s),
  hash(S) { const h = fnv(), n = S.n; for (const a of [S.x1, S.y1, S.z1, S.si, S.ar]) for (const b of bytes(a, n)) h.add(b); for (let i = 0; i < n; i++) h.add(S.st[i]); for (const b of bytes(S.trace, 4096)) h.add(b); return h.hex(); },
  summary: (S) => `segments ${S.n}  tips ${S.ntips}  branches ${S.br}  fusions ${S.fu}  spikes ${S.spikes}  fruits ${S.fruits}`,
  events: (S, ev) => ev[0] === S.br && ev[1] === S.fu && (ev[6] || 0) === S.fruits && (ev[9] || 0) === S.spikes,
};
ENGINES['4m'] = {
  steps: 300,
  smokeMin: 10,
  full: ['armillaria-gallica', 'phanerochaete-velutina', 'laccaria-bicolor', 'marasmius-oreades', 'coprinopsis-cinerea'],
  make: (M, sp, seed) => M([{ id: sp.id, p: sp.p }], seed, sp.s),
  hash(S) { const h = fnv(), n = S.n; for (const a of [S.x1, S.y1, S.z1, S.si]) for (const b of bytes(a, n)) h.add(b); for (let i = 0; i < n; i++) h.add(S.st[i]); for (const b of bytes(S.mtot, S.mtot.length)) h.add(b); for (const b of bytes(S.trace, 4096)) h.add(b); return h.hex(); },
  summary: (S) => `segments ${S.n}  cord tips ${S.ntips}  individuals ${S.ni}  mushrooms ${S.fruits}  wood left ${(S.wood * 100).toFixed(0)}%`,
  events: (S, ev) => ev[0] === S.br && ev[1] === S.fu && (ev[6] || 0) === S.fruits && (ev[9] || 0) === S.spikes && (ev[13] || 0) === S.ni - 1,
};

const stored = fs.existsSync(HASHES) ? JSON.parse(fs.readFileSync(HASHES, 'utf8')) : {};
const update = process.argv.includes('--update');
const next = {};
let failed = false;
let smoke = 0;
for (const [tier, eng] of Object.entries(ENGINES)) {
  const core = path.join(ROOT, 'engines', tier, 'core.js');
  if (!fs.existsSync(core)) continue;
  const src = fs.readFileSync(core, 'utf8');
  const banned = src.replace(/\/\/.*$/gm, '').match(/Math\.(random|sin|cos|tan|exp|pow|log)\b|Date\b|performance\b/);
  if (banned) { console.log(`${tier}: core uses ${banned[0]}, which is not repeatable`); failed = true; }
  const M = new Function(src + ';return M')();
  const run = (sp, seed) => {
    const S = eng.make(M, sp, seed), ev = {};
    S.ev = (type) => { ev[type] = (ev[type] || 0) + 1; };
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < eng.steps; i++) S.step();
    return { S, ev: { 0: 0, 1: 0, ...ev }, hash: eng.hash(S), ms: Number(process.hrtime.bigint() - t0) / 1e6 };
  };
  const dir = path.join(ROOT, 'engines', tier, 'species');
  for (const file of fs.readdirSync(dir).sort()) {
    const sp = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const key = tier + '/' + file.replace('.json', '');
    if (eng.full && !eng.full.includes(file.replace('.json', ''))) {
      const S = eng.make(M, sp, 1); for (let i = 0; i < 40; i++) S.step();
      let bad = S.n < (eng.smokeMin || 20); for (let i = 0; i < S.n; i++) if (!isFinite(S.si[i]) || !isFinite(S.x1[i])) bad = true;
      if (bad) { failed = true; console.log(`${key.padEnd(28)} smoke run FAIL (segments ${S.n})`); } else smoke++;
      continue;
    }
    const a = run(sp, 1), again = run(sp, 1), other = run(sp, 2);
    next[key] = a.hash;
    const problems = [];
    if (a.hash !== again.hash) problems.push('two runs of seed 1 differ');
    if (a.hash === other.hash) problems.push('seed 2 gives the same result as seed 1');
    if (!eng.events(a.S, a.ev)) problems.push('event counts do not match the counters');
    if (!update && stored[key] && stored[key] !== a.hash) problems.push(`hash ${a.hash} differs from stored ${stored[key]}`);
    if (!update && !stored[key]) problems.push('no stored hash (run with --update)');
    if (problems.length) failed = true;
    console.log(`${key.padEnd(28)} ${a.hash}  ${eng.steps} steps = ${(a.S.t / 3600).toFixed(0)} h  ${eng.summary(a.S)}  ` +
      `${(a.ms / eng.steps).toFixed(2)} ms/step  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
  }
}
// 400K only: two individuals in one block must also repeat, and must meet.
{
  const core = path.join(ROOT, 'engines/400k/core.js');
  if (fs.existsSync(core)) {
    const M = new Function(fs.readFileSync(core, 'utf8') + ';return M')();
    const load = (slug) => JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/400k/species', slug + '.json'), 'utf8'));
    const a = load('phanerochaete-velutina'), b = load('pleurotus-ostreatus');
    const run = () => { const S = M([{ id: a.id, p: a.p }, { id: b.id, p: b.p }], 1, 1); for (let i = 0; i < 400; i++) S.step(); return S; };
    const one = run(), two = run(), h1 = ENGINES['400k'].hash(one), key = '400k/two-individuals';
    next[key] = h1;
    const problems = [];
    if (h1 !== ENGINES['400k'].hash(two)) problems.push('two runs differ');
    if (!one.wars) problems.push('the two individuals never met');
    if (!update && stored[key] !== h1) problems.push(stored[key] ? `hash ${h1} differs from stored ${stored[key]}` : 'no stored hash (run with --update)');
    if (problems.length) failed = true;
    console.log(`${key.padEnd(28)} ${h1}  400 steps  segments ${one.n}  tips ${one.tipsOf.join(' + ')}  meetings ${one.wars}  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
  }
}
// Sound: a short recording and render must be finite, not silent, within full scale, and the electrode
// voices must come out near the pitch asked for.
{
  const record = require(path.join(ROOT, 'sound/record.js')), { synth } = require(path.join(ROOT, 'sound/synth.js'));
  const M = new Function(fs.readFileSync(path.join(ROOT, 'engines/400k/core.js'), 'utf8') + ';return M')();
  const sp = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/400k/species/phanerochaete-velutina.json'), 'utf8'));
  const rec = record(M, [{ id: sp.id, p: sp.p }], 1, sp.s, { steps: 40, listen: 1200, set: { weather: 0 } });
  const a = synth(rec, { pitch: 200, events: 0, body: 0, ring: 0 }), L = a.left;
  let bad = 0, peak = 0, sum = 0, best = [0, 0];
  for (const v of L) { if (!isFinite(v)) bad++; peak = Math.max(peak, Math.abs(v)); sum += v * v; }
  const slice = L.subarray(L.length >> 1, (L.length >> 1) + 24000);
  for (let f = 80; f < 500; f += 4) { const c = 2 * Math.cos(2 * Math.PI * f / 48000); let q1 = 0, q2 = 0; for (const v of slice) { const q0 = v + c * q1 - q2; q2 = q1; q1 = q0; } const pw = q1 * q1 + q2 * q2 - c * q1 * q2; if (pw > best[1]) best = [f, pw]; }
  const problems = [];
  if (bad) problems.push(bad + ' samples are not finite');
  if (peak > 0.72 || peak < 0.3) problems.push('peak ' + peak.toFixed(2));
  if (Math.sqrt(sum / L.length) < 0.02) problems.push('nearly silent');
  if (Math.abs(best[0] - 200) > 40) problems.push('voices peak at ' + best[0] + ' Hz, asked for 200');
  if (!rec.events.t.length) problems.push('no events recorded');
  // the resonator: every snapshot must give finite, rising mode frequencies, and the ring alone must sound
  const modes = require(path.join(ROOT, 'sound/resonator.js')), last = modes(rec.shots[rec.shots.length - 1]);
  if (!last.hz.length || last.hz.some((v, i) => !isFinite(v) || v <= 0 || (i && v < last.hz[i - 1] - 1e-6))) problems.push('resonator modes are not finite and rising');
  const ring = synth(rec, { voices: 0, events: 0, body: 0, ring: 1 }); let rs = 0; for (const v of ring.left) rs += v * v;
  if (!(Math.sqrt(rs / ring.left.length) > 0.005)) problems.push('the resonator alone is silent');
  // each way of listening must give finite sound that is not silent
  for (const way of ['faster', 'instrument', 'data', 'music']) {
    const w = synth(rec, { way }); let ss = 0, nb = 0; for (const v of w.left) { if (!isFinite(v)) nb++; ss += v * v; }
    if (nb || !(Math.sqrt(ss / w.left.length) > 0.003) || !w.info.says) problems.push(`way "${way}" is ${nb ? 'not finite' : 'silent or undescribed'}`);
  }
  if (problems.length) failed = true;
  console.log(`${'sound/400k'.padEnd(28)} ${a.seconds.toFixed(1)} s  peak ${peak.toFixed(2)}  voices at ${best[0]} Hz (asked 200)  ${rec.events.t.length} events  lowest note ${last.hz[0].toFixed(0)} Hz  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
}
console.log(`smoke runs passed: ${smoke}`);
if (update) fs.writeFileSync(HASHES, JSON.stringify(next, null, 2) + '\n');
process.exit(failed ? 1 : 0);
