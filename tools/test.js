#!/usr/bin/env node
// Repeatability and speed. Runs each 4K species from seed 1 for a fixed number of steps, hashes
// the bitmap and the counters, and compares with tools/hashes.json. `--update` rewrites that file.
// Also checks that a different seed gives a different result, and prints steps per second.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const STEPS = 400;
const HASHES = path.join(__dirname, 'hashes.json');

const M = new Function(fs.readFileSync(path.join(ROOT, 'engines/4k/core.js'), 'utf8') + ';return M')();

function run(params, seed) {
  const S = M(params, seed);
  let events = 0;
  S.ev = () => events++;
  const t0 = process.hrtime.bigint();
  for (let i = 0; i < STEPS; i++) S.step();
  const ms = Number(process.hrtime.bigint() - t0) / 1e6;
  let h = 0x811c9dc5;
  const mix = (b) => { h = Math.imul(h ^ b, 0x01000193) >>> 0; };
  for (const b of S.o) mix(b);
  for (const n of [S.len, S.br, S.fu, S.T.length]) for (let k = 0; k < 4; k++) mix((n >>> (8 * k)) & 255);
  return { hash: h.toString(16).padStart(8, '0'), tips: S.T.length, len: S.len, br: S.br, fu: S.fu, events, hours: S.t / 3600, ms };
}

const dir = path.join(ROOT, 'engines/4k/species');
const stored = fs.existsSync(HASHES) ? JSON.parse(fs.readFileSync(HASHES, 'utf8')) : {};
const update = process.argv.includes('--update');
let failed = false;
const next = {};
for (const file of fs.readdirSync(dir).sort()) {
  const slug = file.replace('.json', '');
  const { p } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const a = run(p, 1);
  const again = run(p, 1);
  const other = run(p, 2);
  const key = '4k/' + slug;
  next[key] = a.hash;
  const problems = [];
  if (a.hash !== again.hash) problems.push('two runs of seed 1 differ');
  if (a.hash === other.hash) problems.push('seed 2 gives the same result as seed 1');
  if (a.events !== a.br + a.fu) problems.push('event count does not match branch + fusion counts');
  if (!update && stored[key] && stored[key] !== a.hash) problems.push(`hash ${a.hash} differs from stored ${stored[key]}`);
  if (!update && !stored[key]) problems.push('no stored hash (run with --update)');
  if (problems.length) failed = true;
  console.log(
    `${key.padEnd(28)} ${a.hash}  ${STEPS} steps = ${a.hours.toFixed(1)} h  tips ${a.tips}  length ${a.len} px  ` +
      `branches ${a.br}  fusions ${a.fu}  ${(STEPS / (a.ms / 1000)).toFixed(0)} steps/s  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`
  );
}
if (update) fs.writeFileSync(HASHES, JSON.stringify(next, null, 2) + '\n');
process.exit(failed ? 1 : 0);
