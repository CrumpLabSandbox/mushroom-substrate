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

// Every measured value in a species file is { value, unit, basis } with basis sourced (needs a
// source), inferred (needs a note) or unknown.
function speciesProblems() {
  const dir = path.join(ROOT, 'species');
  const problems = [];
  const visit = (file, key, v) => {
    if (!v || typeof v !== 'object') return;
    if ('value' in v) {
      if (!['sourced', 'inferred', 'unknown'].includes(v.basis)) problems.push(`${file}: ${key} has no valid basis`);
      if (v.basis === 'sourced' && !v.source) problems.push(`${file}: ${key} is sourced but names no source`);
      if (v.basis === 'inferred' && !v.note) problems.push(`${file}: ${key} is inferred but has no note`);
      return;
    }
    for (const k of Object.keys(v)) visit(file, key ? key + '.' + k : k, v[k]);
  };
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && f !== 'schema.json');
  for (const f of files) visit(f, '', JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const fam = path.join(dir, 'families');
  for (const f of fs.readdirSync(fam).filter((x) => x.endsWith('.json'))) visit('families/' + f, '', JSON.parse(fs.readFileSync(path.join(fam, f), 'utf8')));
  if (files.length > 100) problems.push(`${files.length} species: the cap is 100`);
  // Invented species live apart in species/alien: every value there is marked invented, and none may claim a source.
  const alien = path.join(dir, 'alien');
  if (fs.existsSync(alien)) for (const f of fs.readdirSync(alien).filter((x) => x.endsWith('.json'))) {
    const d = JSON.parse(fs.readFileSync(path.join(alien, f), 'utf8'));
    if (d.invented !== true) problems.push(`alien/${f}: not marked invented`);
    if (fs.existsSync(path.join(dir, f))) problems.push(`alien/${f}: a real species has the same file name`);
    const walk = (key, v) => { if (!v || typeof v !== 'object') return; if ('value' in v) { if (v.basis !== 'invented') problems.push(`alien/${f}: ${key} must have basis invented`); return; } for (const k of Object.keys(v)) walk(key ? key + '.' + k : k, v[k]); };
    walk('', d);
  }
  return problems;
}

const results = TIERS.map(measure);
const problems = speciesProblems();
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
if (!process.argv.includes('--json')) for (const p of problems) console.log('species: ' + p);
process.exit(results.every((r) => r.ok) && problems.length === 0 ? 0 : 1);
