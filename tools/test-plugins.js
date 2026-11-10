#!/usr/bin/env node
// Renders every plugin offline, with several species, and checks the sound is finite, audible and within
// full scale. The same dsp.js files run here and in the browser's audio thread.
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/plugins.json'), 'utf8')).filter((p) => p.built);
  const species = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/specimens/index.json'), 'utf8')).map((s) => s[0]);
  const pick = [species[0], species[Math.floor(species.length / 2)], species[species.length - 1]];
  let failed = false;
  for (const p of manifest) {
    const { create } = await import(pathToFileURL(path.join(ROOT, 'plugins', p.id, 'dsp.js')));
    if (p.family === 'composer') { // a composer is run for 20 seconds on each instrument it can play
      const { INSTRUMENTS } = await import(pathToFileURL(path.join(ROOT, 'plugins/kit/instruments.js')));
      for (const [iid, make] of Object.entries(INSTRUMENTS)) for (const slug of pick.slice(0, 2)) {
        const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/specimens', slug + '.json'), 'utf8')), sr = 48000, comp = create(sr), inst = make(sr);
        comp.load(spec); inst.load(spec);
        let bad = 0, peak = 0, sum = 0, n = 0, ons = 0, offs = 0;
        for (let block = 0; block < sr * 20 / 128; block++) {
          const L = new Float32Array(128), R = new Float32Array(128);
          for (const ev of comp.advance(128)) { if (ev.off != null) { offs++; inst.noteOff(ev.off); } else { ons++; if (!isFinite(ev.on) || !(ev.vel >= 0)) bad++; inst.noteOn(ev.on, ev.vel); } }
          inst.process(L, R, null);
          for (let i = 0; i < 128; i++) { if (!isFinite(L[i]) || !isFinite(R[i])) bad++; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); sum += L[i] * L[i]; n++; }
        }
        const rms = Math.sqrt(sum / n), problems = [];
        if (bad) problems.push(bad + ' bad values'); if (peak > 1.0001) problems.push('peak ' + peak.toFixed(2)); if (rms < 0.0005) problems.push('silent');
        if (ons < 5) problems.push('only ' + ons + ' notes in 20 s'); if (typeof comp.view() !== 'object') problems.push('no view');
        if (problems.length) failed = true;
        console.log(`${p.id.padEnd(18)} on ${iid.padEnd(12)} ${slug.padEnd(24)} ${String(ons).padStart(4)} notes  peak ${peak.toFixed(3)}  rms ${rms.toFixed(4)}  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
      }
      continue;
    }
    for (const slug of pick) {
      const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/specimens', slug + '.json'), 'utf8')), sr = 48000, d = create(sr);
      d.load(spec);
      let bad = 0, peak = 0, sum = 0, n = 0;
      for (let block = 0; block < sr * 3 / 128; block++) {
        const L = new Float32Array(128), R = new Float32Array(128), x = new Float32Array(128);
        if (p.family === 'effect' && block % 180 < 56) for (let i = 0; i < 128; i++) { const t = (block % 180) * 128 + i; x[i] = Math.sin(t * 2 * Math.PI * 220 / sr) * Math.min(1, t / 60) * Math.exp(-t / 3000) * 0.8; } // a plucked 220 Hz note every half second
        if (p.family === 'instrument' && d.noteOn && block % 120 === 0) { d.noteOff && d.noteOff(48 + (block / 120 - 1) * 5); d.noteOn(48 + block / 120 * 5, 0.8); }
        d.process(L, R, p.family === 'effect' ? x : null);
        for (let i = 0; i < 128; i++) { const v = L[i]; if (!isFinite(v) || !isFinite(R[i])) bad++; peak = Math.max(peak, Math.abs(v), Math.abs(R[i])); sum += v * v; n++; }
      }
      const rms = Math.sqrt(sum / n), problems = [];
      if (bad) problems.push(bad + ' samples not finite');
      if (peak > 1.0001) problems.push('peak ' + peak.toFixed(2));
      if (rms < 0.0005) problems.push('silent');
      if (d.view && typeof d.view() !== 'object') problems.push('no view');
      if (problems.length) failed = true;
      console.log(`${p.id.padEnd(18)} ${slug.padEnd(26)} peak ${peak.toFixed(3)}  rms ${rms.toFixed(4)}  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
    }
  }
  process.exit(failed ? 1 : 0);
})();
