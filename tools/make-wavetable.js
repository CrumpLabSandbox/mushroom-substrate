#!/usr/bin/env node
// Makes a morphing wavetable from a species' electrical activity as its network grows.
//   node tools/make-wavetable.js <400k|4m> <species-slug> [--seed 1] [--steps 128] [--a 0] [--b 1] [--model 2] [--out file.wav]
// Writes a wavetable WAV (64 frames of 2,048 samples; loads in Serum, Vital and Ableton's Wavetable) and a
// .json beside it with each frame's 512 harmonic amplitudes and phases, the shape SynthLand's wavetable engine uses.
// --b -1 uses one electrode on its own. --model: 2 excitable network, 1 integrate and fire.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const record = require(path.join(ROOT, 'sound/record.js'));
const { wavetable, wavetableWav } = require(path.join(ROOT, 'sound/wavetable.js'));
const [tier, slug, ...rest] = process.argv.slice(2);
if (!tier || !slug) { console.log('usage: node tools/make-wavetable.js <400k|4m> <species-slug> [--seed n] [--steps n] [--a 0] [--b 1] [--model 2] [--out file.wav]'); process.exit(1); }
const arg = (k, d) => { const i = rest.indexOf('--' + k); return i < 0 ? d : rest[i + 1]; };
const M = new Function(fs.readFileSync(path.join(ROOT, 'engines', tier, 'core.js'), 'utf8') + ';return M')();
const sp = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines', tier, 'species', slug + '.json'), 'utf8'));
const rec = record(M, [{ id: sp.id, p: sp.p }], +arg('seed', 1), sp.s, { steps: +arg('steps', 128), listen: 640, set: { weather: 0, emode: +arg('model', 2) } });
const wt = wavetable(rec, { a: +arg('a', 0), b: +arg('b', 1) });
const out = arg('out', path.join(ROOT, 'sound', 'renders', `${slug}-${tier}-wavetable.wav`));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.from(wavetableWav(wt)));
const r = (a, d) => Array.from(a, (v) => Math.round(v * d) / d);
fs.writeFileSync(out.replace(/\.wav$/, '.json'), JSON.stringify({ format: 'mushroom-substrate.wavetable/1', name: sp.n, slug, frames: wt.frames.length, frameSize: wt.size, harmonics: wt.harmonics,
  description: `Voltage between electrodes ${wt.meta.electrodes.join(' and ')} on a ${sp.n} network over ${wt.meta.growth_days.toFixed(1)} days of growth, one cycle per frame`, meta: wt.meta,
  amps: wt.amps.map((a) => r(a, 1e5)), phases: wt.phases.map((p) => r(p, 1e4)) }) + '\n');
console.log(`${sp.n}: ${wt.frames.length} frames of ${wt.size} samples from ${wt.meta.growth_days.toFixed(1)} days of growth (${wt.meta.frames_from_one_electrode} frames fell back to one electrode)`);
console.log('wrote ' + path.relative(ROOT, out));
