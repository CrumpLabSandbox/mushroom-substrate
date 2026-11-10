#!/usr/bin/env node
// Bakes specimens: grows each species in the 400K engine on this machine and writes the small file the
// plugins load (plugins/specimens/<slug>.json). See docs/PLUGINS.md section 3.
//   node tools/bake-specimens.js              the first batch
//   node tools/bake-specimens.js all          every species
//   node tools/bake-specimens.js <slug> ...   named species
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const record = require(path.join(ROOT, 'sound/record.js'));
const modes = require(path.join(ROOT, 'sound/resonator.js'));
const { wavetable } = require(path.join(ROOT, 'sound/wavetable.js'));
const M = new Function(fs.readFileSync(path.join(ROOT, 'engines/400k/core.js'), 'utf8') + ';return M')();
const OUT = path.join(ROOT, 'plugins', 'specimens');
const FIRST = ['phanerochaete-velutina', 'coprinopsis-cinerea', 'pleurotus-ostreatus', 'armillaria-gallica', 'laccaria-bicolor', 'serpula-lacrymans',
  'schizophyllum-commune', 'flammulina-velutipes', 'marasmius-oreades', 'amanita-muscaria', 'omphalotus-nidiformis', 'trametes-versicolor'];
// Overtones of the fruit body by form, as ratios to its lowest note. These are textbook shapes standing in
// for the real thing (a free round plate, a beam fixed at one end, a bowl, a ball): assumed, not measured.
const PLATE = [1, 1.73, 2.33, 3.91, 4.11, 6.3], BEAM = [1, 6.27, 17.55, 34.4], BOWL = [1, 2.32, 4.25, 6.63, 9.4], BALL = [1, 1.39, 1.86, 2.27, 2.9];
const FORM = { agaric: PLATE, bolete: PLATE, tooth: PLATE, chanterelle: BOWL, cup: BOWL, birdsnest: BOWL, bracket: BEAM, crust: PLATE, club: BEAM, coral: BEAM, stinkhorn: BEAM, morel: BALL,
  puffball: BALL, truffle: BALL, jelly: BALL, earthstar: BALL, none: PLATE };
const r = (v, d = 1) => Math.round(v * d) / d;

const arg = process.argv.slice(2);
const all = fs.readdirSync(path.join(ROOT, 'engines/400k/species')).map((f) => f.replace('.json', ''));
const list = arg[0] === 'all' ? all : arg.length ? arg : FIRST;
fs.mkdirSync(OUT, { recursive: true });
for (const slug of list) {
  const t0 = Date.now(), sp = JSON.parse(fs.readFileSync(path.join(ROOT, 'engines/400k/species', slug + '.json'), 'utf8'));
  const full = JSON.parse(fs.readFileSync(path.join(ROOT, 'species', slug + '.json'), 'utf8'));
  const rec = record(M, [{ id: sp.id, p: sp.p }], 1, sp.s, { steps: 96, listen: 640, set: { weather: 0 } });
  const W = rec.meta.size[0], home = rec.meta.home, MIC = [[W * .2, W / 2, 0], [W * .8, W / 2, 0]];
  // eight stages of growth, evenly through the run
  const shots = rec.shots.filter((s) => s.x.length >= 6), pick = Array.from({ length: Math.min(8, shots.length) }, (_, k) => shots[Math.round(k / Math.max(1, Math.min(8, shots.length) - 1) * (shots.length - 1))]);
  const stages = pick.map((shot) => {
    const md = modes(shot, { count: 24 }), N = shot.x.length, dist = shot.x.map((x, i) => Math.hypot(x - home[0], shot.y[i] - home[1], shot.z[i] - home[2])), far = Math.max(...dist, 1);
    const hear = (i, k) => 1 / (1 + Math.hypot(shot.x[i] - MIC[k][0], shot.y[i] - MIC[k][1], shot.z[i]) / (W / 10)) / N;
    return {
      days: r(shot.t / 86400, 100), reach_mm: r(far / 1000, 10),
      hz: md.hz.map((v) => r(v, 10)), mass: md.mass.map((v) => +v.toExponential(3)),
      // how strongly a strike in each of six rings (centre to edge) moves each mode, and how strongly each microphone hears it
      zone: md.shape.map((sh) => Array.from({ length: 6 }, (_, z) => { let s = 0, c = 0; for (let i = 0; i < N; i++) if (Math.min(5, dist[i] / far * 6 | 0) === z) { s += sh[i]; c++; } return r(c ? s / c : 0, 1000); })),
      mic: md.shape.map((sh) => [0, 1].map((k) => r(sh.reduce((t, v, i) => t + v * hear(i, k), 0), 10000))),
      // the reduced network, for drawing: positions in units of 0.01 mm from the start point, then edges [node, node, cross-section]
      xy: shot.x.flatMap((x, i) => [Math.round((x - home[0]) / 10), Math.round((shot.y[i] - home[1]) / 10)]),
      edges: Array.from({ length: shot.edges.length / 4 }, (_, e) => [shot.edges[e * 4], shot.edges[e * 4 + 1], r(shot.edges[e * 4 + 3], 10)]).flat(),
    };
  });
  const wt = wavetable(rec, { harmonics: 512 }), H = 32;
  const col = (k) => rec.meta.tap_names.indexOf(k), curve = (k) => Array.from({ length: 48 }, (_, i) => r(rec.taps[Math.round(i / 47 * (rec.taps.length - 1))][col(k)], 100));
  const hours = rec.meta.growth_seconds / 3600, count = (type) => Array.from({ length: 8 }, (_, s) => { let c = 0; for (let j = 0; j < rec.events.t.length; j++) if (rec.events.type[j] === type && Math.min(7, rec.events.t[j] / rec.meta.growth_seconds * 8 | 0) === s) c++; return r(c / (hours / 8), 100); });
  const radius = (sp.z[0] + sp.z[1]) / 4; // cm
  const spec = {
    format: 'mushroom-substrate.specimen/1', slug, name: sp.n, common: full.common_name || '', family: full.family, engine: '400k', seed: 1,
    colours: sp.c, fruit: { form: sp.f, size_cm: sp.z, trophic: full.ecology ? full.ecology.trophic : '' },
    numbers: { tip_speed_um_h: sp.p[0], growth_unit_um: sp.p[1], branch_angle_deg: sp.p[2], t_opt_c: sp.p[19], spike_interval_min: sp.p[35], spike_amplitude_mv: sp.p[37], transport_um_h: sp.p[16], cord_max: sp.p[18] },
    grown: { days: r(rec.meta.growth_seconds / 86400, 100), segments: rec.meta.segments, size_mm: [W / 1000, rec.meta.size[1] / 1000] },
    stages,
    wavetable: { frames: wt.frames.length, harmonics: H, amps: wt.amps.map((a) => Array.from(a.subarray(0, H), (v) => r(v, 10000))), phases: wt.phases.map((p) => Array.from(p.subarray(0, H), (v) => r(v, 100))) },
    curves: { tips: curve('ntips'), length_um: curve('len'), flow: curve('flow'), uptake: curve('up'), reserve: curve('res'), front_um: curve('front') },
    rates_per_hour: { branch: count(0), fusion: count(1), abandoned: count(3) },
    // the cap as a plate: 90 Hz at 3 cm radius, rising as 1/radius (docs/research/07), with the overtone set for its form
    cap: { radius_cm: r(radius, 100), lowest_hz: r(90 * 3 / radius, 10), overtones: FORM[sp.f] || PLATE },
  };
  const text = JSON.stringify(spec);
  fs.writeFileSync(path.join(OUT, slug + '.json'), text);
  console.log(`${slug.padEnd(28)} ${stages.length} stages  ${spec.grown.segments} segments  lowest note ${stages[0].hz[0]} -> ${stages[stages.length - 1].hz[0]} Hz  ${(text.length / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
// the list the plugins offer: every specimen on disk
const have = fs.readdirSync(OUT).filter((f) => f.endsWith('.json') && f !== 'index.json').map((f) => { const s = JSON.parse(fs.readFileSync(path.join(OUT, f), 'utf8')); return [s.slug, s.name, s.common, s.family, s.fruit.form]; });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(have));
console.log(`${have.length} specimens listed`);
