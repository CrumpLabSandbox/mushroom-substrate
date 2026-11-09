#!/usr/bin/env node
// Checks every engine against its byte limit.
// A substrate is one engine plus one species: everything in engines/<tier>/ counts, except that
// of the packed species files in engines/<tier>/species/ only the largest counts (one is loaded
// at a time). Exits 1 if any tier is over. `--json` prints the result as JSON (the site reads it).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TIERS = [
  { id: '4k', limit: 4096 },
  { id: '40k', limit: 40960 },
  { id: '400k', limit: 409600 },
  { id: '4m', limit: 4194304 },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.startsWith('.') ? [] : [{ file: p, bytes: fs.statSync(p).size }];
  });
}

function measure(tier) {
  const dir = path.join(ROOT, 'engines', tier.id);
  const speciesDir = path.join(dir, 'species') + path.sep;
  const all = walk(dir);
  const engine = all.filter((f) => !f.file.startsWith(speciesDir));
  const species = all.filter((f) => f.file.startsWith(speciesDir));
  const engineBytes = engine.reduce((n, f) => n + f.bytes, 0);
  const largest = species.reduce((m, f) => (f.bytes > m.bytes ? f : m), { file: null, bytes: 0 });
  const total = engineBytes + largest.bytes;
  return {
    tier: tier.id,
    limit: tier.limit,
    engineBytes,
    speciesCount: species.length,
    largestSpecies: largest.file ? path.relative(ROOT, largest.file) : null,
    largestSpeciesBytes: largest.bytes,
    total,
    built: engine.length > 0,
    ok: total <= tier.limit,
  };
}

const results = TIERS.map(measure);
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const state = !r.built ? 'not built' : r.ok ? 'ok' : 'OVER LIMIT';
    const pct = ((100 * r.total) / r.limit).toFixed(1);
    console.log(
      `${r.tier.padEnd(5)} ${String(r.total).padStart(9)} / ${String(r.limit).padEnd(9)} ${pct.padStart(6)}%  ${state}` +
        (r.largestSpecies ? `  (engine ${r.engineBytes} + ${r.largestSpecies} ${r.largestSpeciesBytes})` : '')
    );
  }
}
process.exit(results.every((r) => r.ok) ? 0 : 1);
