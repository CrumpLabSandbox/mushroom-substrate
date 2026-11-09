#!/usr/bin/env node
// Assembles the GitHub Pages site into _site/: the landing page, the engines, the species data
// and tiers.json (the byte counts from tools/check.js, shown on the landing page).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_site');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const dir of ['site', 'engines', 'species']) {
  const dest = dir === 'site' ? OUT : path.join(OUT, dir);
  fs.cpSync(path.join(ROOT, dir), dest, { recursive: true, filter: (p) => !path.basename(p).startsWith('.') });
}
let tiers;
try {
  tiers = execFileSync(process.execPath, [path.join(__dirname, 'check.js'), '--json'], { encoding: 'utf8' });
} catch (e) {
  tiers = e.stdout; // check.js exits 1 when a tier is over; the page still shows the numbers
}
fs.writeFileSync(path.join(OUT, 'tiers.json'), tiers);
console.log('built _site');
