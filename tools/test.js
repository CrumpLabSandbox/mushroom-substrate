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

const stored = fs.existsSync(HASHES) ? JSON.parse(fs.readFileSync(HASHES, 'utf8')) : {};
const update = process.argv.includes('--update');
const next = {};
let failed = false;
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
if (update) fs.writeFileSync(HASHES, JSON.stringify(next, null, 2) + '\n');
process.exit(failed ? 1 : 0);
