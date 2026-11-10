#!/usr/bin/env node
// Renders every plugin offline, with several species, and checks the sound is finite, audible and within
// full scale. The same dsp.js files run here and in the browser's audio thread.
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..');
// --size=4k|40k|4m tests the plugins on specimens grown at that size of simulator (400K if not given)
const sizeArg = process.argv.find((a) => a.startsWith('--size=')), SIZE = sizeArg ? sizeArg.slice(7) : '400k';
process.argv = process.argv.filter((a) => !a.startsWith('--size='));
(async () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/plugins.json'), 'utf8')).filter((p) => p.built && !p.symphony && (process.argv.length < 3 || process.argv.slice(2).includes(p.id))); // name plugins to test only those
  // specimens are read at the 400K size unless --size says otherwise
  const SP = path.join(ROOT, 'plugins/specimens', SIZE);
  const species = fs.readdirSync(SP).filter((f) => f.endsWith('.json') && f !== 'index.json').map((f) => f.replace('.json', '')).sort();
  const pick = [species[0], species[Math.floor(species.length / 2)], species[species.length - 1]];
  let failed = false;
  for (const p of manifest) {
    const { create } = await import(pathToFileURL(path.join(ROOT, 'plugins', p.id, 'dsp.js')));
    if (p.family === 'composer') { // a composer is run for 20 seconds on each instrument it can play
      const { INSTRUMENTS } = await import(pathToFileURL(path.join(ROOT, 'plugins/kit/instruments.js')));
      for (const [iid, make] of Object.entries(INSTRUMENTS)) for (const slug of pick.slice(0, 2)) {
        const spec = JSON.parse(fs.readFileSync(path.join(SP, slug + '.json'), 'utf8')), sr = 48000, comp = create(sr), inst = make(sr);
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
      const spec = JSON.parse(fs.readFileSync(path.join(SP, slug + '.json'), 'utf8')), sr = 48000, d = create(sr);
      d.load(spec);
      let bad = 0, peak = 0, sum = 0, n = 0;
      for (let block = 0; block < sr * 3 / 128; block++) {
        const L = new Float32Array(128), R = new Float32Array(128), x = new Float32Array(128);
        if (p.family === 'effect' && block % 180 < 56) for (let i = 0; i < 128; i++) { const t = (block % 180) * 128 + i; x[i] = Math.sin(t * 2 * Math.PI * 220 / sr) * Math.min(1, t / 60) * Math.exp(-t / 3000) * 0.8; } // a plucked 220 Hz note every half second
        if (p.family === 'instrument' && d.noteOn && block % 120 === 0) { d.noteOff && d.noteOff(48 + (block / 120 - 1) * 5); d.noteOn(48 + block / 120 * 5, 0.8); }
        if (p.live && block % 40 === 0) d.live({ events: Array.from({ length: 12 }, (_, k) => [[0, 1, 3][k % 3], k % 6, (k * 0.37) % 1]).concat(block % 400 === 0 ? [[4, 0, 0.5]] : []), taps: { flow: 300, cords: 150, tips: 80 }, stage: block % 800 === 0 ? spec.stages[Math.min(spec.stages.length - 1, 2 + block / 800)] : undefined }); // what the live engine would send
        if (d.load2 && block === 0) d.load2(JSON.parse(fs.readFileSync(path.join(SP, pick[1] + '.json'), 'utf8')));
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
  // symphonies: several composers at once on the stem console, run for one whole cycle of the conductor
  const syms = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/plugins.json'), 'utf8')).filter((p) => p.symphony && p.built && (process.argv.length < 3 || process.argv.slice(2).includes(p.id)));
  if (syms.length) {
    const { makeSymphony } = await import(pathToFileURL(path.join(ROOT, 'plugins/kit/symphony.js')));
    for (const p of syms) {
      const { def } = await import(pathToFileURL(path.join(ROOT, 'plugins', p.id, 'def.js'))), sr = 48000, sym = makeSymphony(sr, def.cast, def.conductor), secs = 40;
      for (const q of def.params) sym.set(q.id, q.value);
      sym.set('length', secs);
      def.cast.forEach((c, i) => { const strip = { ride: 1, target: -24, range: 12, ...(c.strip || {}) }; for (const k in strip) sym.set(`s${i + 1}.${k}`, strip[k]); sym.load(i, JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/specimens', c.scale || '400k', c.species + '.json'), 'utf8'))); });
      let bad = 0, peak = 0, sum = 0, n = 0;
      for (let block = 0; block < sr * secs / 128; block++) { const L = new Float32Array(128), R = new Float32Array(128); sym.process(L, R); for (let i = 0; i < 128; i++) { if (!isFinite(L[i]) || !isFinite(R[i])) bad++; peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i])); sum += L[i] * L[i]; n++; } }
      const v = sym.view(), rms = Math.sqrt(sum / n), problems = [], quiet = v.notes.map((c, i) => c ? null : def.cast[i].role).filter(Boolean);
      if (bad) problems.push(bad + ' samples not finite'); if (peak > 0.85) problems.push('peak ' + peak.toFixed(2) + ' is over the ceiling'); if (rms < 0.002) problems.push('silent');
      if (quiet.length) problems.push('no notes from ' + quiet.join(', ')); if (Math.abs(v.tel[2] + 18) > 5) problems.push('whole-piece loudness ' + v.tel[2].toFixed(1) + ' LUFS, target -18');
      if (problems.length) failed = true;
      console.log(`${p.id.padEnd(18)} ${String(def.cast.length)} voices  notes ${v.notes.join(',').padEnd(22)} peak ${peak.toFixed(3)}  ${v.tel[2].toFixed(1)} LUFS  ${problems.length ? 'FAIL: ' + problems.join('; ') : 'ok'}`);
    }
  }
  process.exit(failed ? 1 : 0);
})();
