#!/usr/bin/env node
// Renders a species to a sound file without a browser.
//   node tools/render-audio.js <400k|4m> <species-slug> [--seed 1] [--steps 200] [--listen 2400] [--pitch 180] [--out file.wav]
// Writes the WAV and, beside it, a .json with the recording's details, the mapping and both speed-ups.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const record = require(path.join(ROOT, 'sound/record.js'));
const { synth, wav } = require(path.join(ROOT, 'sound/synth.js'));
const [tier, slug, ...rest] = process.argv.slice(2);
if (!tier || !slug) { console.log('usage: node tools/render-audio.js <400k|4m> <species-slug> [--seed n] [--steps n] [--listen n] [--pitch hz] [--out file.wav]'); process.exit(1); }
const arg = (k, d) => { const i = rest.indexOf('--' + k); return i < 0 ? d : rest[i + 1]; };
const M = new Function(fs.readFileSync(path.join(ROOT, 'engines', tier, 'core.js'), 'utf8') + ';return M')();
const sp = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines', tier, 'species', slug + '.json'), 'utf8'));
const t0 = Date.now();
const rec = record(M, [{ id: sp.id, p: sp.p }], +arg('seed', 1), sp.s, { steps: +arg('steps', 200), listen: +arg('listen', 2400), set: { weather: tier === '4m' ? 1 : 0 } });
const audio = synth(rec, { pitch: +arg('pitch', 180) });
const out = arg('out', path.join(ROOT, 'sound', 'renders', `${slug}-${tier}.wav`));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.from(wav(audio)));
fs.writeFileSync(out.replace(/\.wav$/, '.json'), JSON.stringify({ engine: tier, name: sp.n, recording: rec.meta, sound: audio.info, events: rec.events.t.length }, null, 1) + '\n');
console.log(`${sp.n}: ${audio.seconds.toFixed(1)} s of sound, ${rec.meta.segments} segments, ${rec.events.t.length} events, ${((Date.now() - t0) / 1000).toFixed(1)} s to make`);
console.log(audio.info.says);
console.log('wrote ' + path.relative(ROOT, out));
