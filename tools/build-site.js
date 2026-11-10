#!/usr/bin/env node
// Assembles the GitHub Pages site into _site/: the pages in site/, the engines, the species data,
// tiers.json (the byte counts from tools/check.js, shown on the landing page) and data/ (the
// exports from tools/export.js that the species browser and other projects read).
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, '_site');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT);
for (const dir of ['site', 'engines', 'species']) {
  if (!fs.existsSync(path.join(ROOT, dir))) continue;
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
execFileSync(process.execPath, [path.join(__dirname, 'export.js'), path.join(OUT, 'data')], { stdio: 'inherit' });
// the sound code the listening page loads (not the rendered files)
fs.mkdirSync(path.join(OUT, 'sound'), { recursive: true });
for (const f of ['record.js', 'resonator.js', 'synth.js', 'wavetable.js', 'worker.js', 'wt-worklet.js']) fs.copyFileSync(path.join(ROOT, 'sound', f), path.join(OUT, 'sound', f));
// the plugin platform: its pages, shared kit and prebuilt specimens
fs.cpSync(path.join(ROOT, 'plugins'), path.join(OUT, 'plugins'), { recursive: true, filter: (p) => !path.basename(p).startsWith('.') });
// the calibration table (made by tools/calibrate.js, which is run by hand because it takes half a minute)
const cal = path.join(ROOT, 'docs', 'calibration', 'results.json');
if (fs.existsSync(cal)) fs.copyFileSync(cal, path.join(OUT, 'data', 'calibration.json'));
console.log('built _site');
