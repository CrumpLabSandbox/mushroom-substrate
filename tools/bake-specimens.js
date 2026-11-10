#!/usr/bin/env node
// Bakes specimens: grows a species in an engine on this machine and writes the small file the plugins load,
// plugins/specimens/<size>/<slug>.json, one for each of the four sizes of engine (the plugins' Scale switch).
// See docs/PLUGINS.md section 3.
//   node tools/bake-specimens.js all                     every species, every size
//   node tools/bake-specimens.js <slug> ...              named species (real, or invented ones from species/alien)
//   node tools/bake-specimens.js --size=4k,40k all       only some sizes
//   node tools/bake-specimens.js --index                 only rewrite the list
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const script = (file, name) => new Function(fs.readFileSync(path.join(ROOT, file), 'utf8') + ';return ' + name)();
const record = require(path.join(ROOT, 'sound/record.js'));
const modes = require(path.join(ROOT, 'sound/resonator.js'));
const { wavetable } = require(path.join(ROOT, 'sound/wavetable.js'));
const grow = script('plugins/kit/grow.js', 'grow'), tidyShot = script('plugins/kit/grow.js', 'tidyShot');
const OUT = path.join(ROOT, 'plugins', 'specimens');
const SIZES = ['4k', '40k', '400k', '4m'];
// Overtones of the fruit body by form, as ratios to its lowest note. These are textbook shapes standing in
// for the real thing (a free round plate, a beam fixed at one end, a bowl, a ball): assumed, not measured.
const PLATE = [1, 1.73, 2.33, 3.91, 4.11, 6.3], BEAM = [1, 6.27, 17.55, 34.4], BOWL = [1, 2.32, 4.25, 6.63, 9.4], BALL = [1, 1.39, 1.86, 2.27, 2.9];
const FORM = { agaric: PLATE, bolete: PLATE, tooth: PLATE, chanterelle: BOWL, cup: BOWL, birdsnest: BOWL, bracket: BEAM, crust: PLATE, club: BEAM, coral: BEAM, stinkhorn: BEAM, morel: BALL,
  puffball: BALL, truffle: BALL, jelly: BALL, earthstar: BALL, none: PLATE };
const r = (v, d = 1) => Math.round(v * d) / d;
// where a species' packed numbers and full record are: a real species, or an invented one
const packed = (size, slug) => { for (const f of [path.join(ROOT, 'engines', size, 'species', slug + '.json'), path.join(ROOT, 'plugins/aliens', size, slug + '.json')]) if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8')); return null; };
const record_of = (slug) => { for (const f of [path.join(ROOT, 'species', slug + '.json'), path.join(ROOT, 'species/alien', slug + '.json')]) if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8')); return {}; };

// A wavetable for the sizes of engine that have no electrical model: one excitable unit of the same model, run
// alone, its drive rising through the frames. One unit, not a network: the specimen says so (from: 'unit').
const unitTable = () => {
  const amps = [], phases = [], H = 32, N = 512;
  for (let f = 0; f < 64; f++) {
    const drive = 0.34 + f / 63 * 1.0, h = 0.02; let v = -1, w = -0.5; const run = [];
    for (let i = 0; i < 12000; i++) { const a = v; v = a + h * (a - a * a * a / 3 - w + drive); w += h * 0.08 * (a + 0.7 - 0.8 * w); if (i >= 4000) run.push(v); }
    const mean = run.reduce((s, x) => s + x, 0) / run.length; let c0 = -1, c1 = -1;
    for (let i = 1; i < run.length; i++) if (run[i - 1] < mean && run[i] >= mean) { if (c0 < 0) c0 = i; else if (i - c0 > 50) { c1 = i; break; } }
    const A = [], P = [];
    if (c1 < 0) { for (let k = 0; k < H; k++) { A.push(k ? 0 : 0.8); P.push(0); } } // no oscillation at this drive: a plain tone
    else {
      const cyc = Array.from({ length: N }, (_, i) => { const x = c0 + i / N * (c1 - c0), a = x | 0; return run[a] + (run[a + 1] - run[a]) * (x - a) - mean; });
      let top = 0; const re = [], im = [];
      for (let k = 1; k <= H; k++) { let a = 0, b = 0; for (let i = 0; i < N; i++) { a += cyc[i] * Math.cos(2 * Math.PI * k * i / N); b -= cyc[i] * Math.sin(2 * Math.PI * k * i / N); } re.push(a); im.push(b); top = Math.max(top, Math.hypot(a, b)); }
      for (let k = 0; k < H; k++) { A.push(r(Math.hypot(re[k], im[k]) / top * 0.8, 10000)); P.push(r(Math.atan2(im[k], re[k]), 100)); }
    }
    amps.push(A); phases.push(P);
  }
  return { frames: 64, harmonics: H, amps, phases, from: 'unit' };
};
let UNIT = null;

const bake = (size, slug) => {
  const t0 = Date.now(), sp = packed(size, slug), meta = packed('400k', slug), full = record_of(slug);
  if (!sp || !meta) { console.log(`${slug}: no packed species for ${size}`); return; }
  const M = script(`engines/${size}/core.js`, 'M');
  // grow it, keeping: the network at about nine moments, the engine's signals at every step, and every event with its time
  let shots, rows, evT, evType, seconds, W, depth, segments, home, has, wt;
  if (size === '400k' || size === '4m') {
    const rec = record(M, [{ id: meta.id, p: sp.p }], 1, sp.s, { steps: size === '4m' ? 900 : 96, listen: size === '4m' ? 200 : 640, set: { weather: 0 } });
    const col = (k) => rec.meta.tap_names.indexOf(k);
    shots = rec.shots.map(tidyShot); rows = rec.taps.map((t) => ({ tips: t[col('ntips')], len: t[col('len')], flow: t[col('flow')], up: t[col('up')], res: t[col('res')], front: t[col('front')] }));
    evT = rec.events.t; evType = rec.events.type; seconds = rec.meta.growth_seconds; W = rec.meta.size[0]; depth = rec.meta.size[1]; segments = rec.meta.segments; home = rec.meta.home;
    has = grow(size, M, { id: meta.id, p: sp.p, s: sp.s }, 1).has;
    const w = wavetable(rec, { harmonics: 512 }), H = 32;
    wt = { frames: w.frames.length, harmonics: H, amps: w.amps.map((a) => Array.from(a.subarray(0, H), (v) => r(v, 10000))), phases: w.phases.map((p) => Array.from(p.subarray(0, H), (v) => r(v, 100))), from: 'network' };
  } else {
    const g = grow(size, M, { p: sp.p, s: sp.s }, 1), steps = size === '4k' ? 400 : 96; let peak = 0;
    shots = []; rows = []; evT = []; evType = [];
    for (let i = 0; i < steps; i++) {
      const before = g.seconds(); g.step(); const evs = g.drain(), dt = g.seconds() - before;
      evs.forEach((e, j) => { evT.push(before + (j + 0.5) / evs.length * dt); evType.push(e[0]); });
      const t = g.taps(); rows.push(t); peak = Math.max(peak, t.tips);
      if (i % 8 === 0) shots.push(g.shot());
      if (size === '4k' && i > 60 && t.tips < peak * 0.3) break; // the field is used up and growth is ending
    }
    shots.push(g.shot());
    seconds = g.seconds(); W = g.W; depth = 0; segments = rows[rows.length - 1].segments; home = g.home; has = g.has;
    wt = UNIT || (UNIT = unitTable());
  }
  const MIC = [[W * 0.2, W / 2, 0], [W * 0.8, W / 2, 0]];
  // eight stages of growth, evenly through the run
  const sane = (s) => { if (s.x.length < 6) return false; if (s.hz0 == null) s.hz0 = modes(s, { count: 2 }).hz[0]; return s.hz0 > 0 && s.hz0 < 40000; }; // leaves out the first moments, when the network is a few points with no length
  const ok = shots.filter(sane), pick = Array.from({ length: Math.min(8, ok.length) }, (_, k) => ok[Math.round(k / Math.max(1, Math.min(8, ok.length) - 1) * (ok.length - 1))]);
  if (!pick.length) { console.log(`${slug} at ${size}: nothing grew`); return; }
  const stages = pick.map((shot) => {
    const md = modes(shot, { count: 24 }), N = shot.x.length, dist = shot.x.map((x, i) => Math.hypot(x - home[0], shot.y[i] - home[1], shot.z[i] - home[2])), far = Math.max(...dist, 1);
    const hear = (i, k) => 1 / (1 + Math.hypot(shot.x[i] - MIC[k][0], shot.y[i] - MIC[k][1], shot.z[i]) / (W / 10)) / N;
    return {
      days: r(shot.t / 86400, 100), reach_mm: r(far / 1000, 10),
      hz: md.hz.map((v) => r(v, v < 50 ? 1000 : 10)), mass: md.mass.map((v) => +v.toExponential(3)),
      // how strongly a strike in each of six rings (centre to edge) moves each mode, and how strongly each microphone hears it
      zone: md.shape.map((sh) => Array.from({ length: 6 }, (_, z) => { let s = 0, c = 0; for (let i = 0; i < N; i++) if (Math.min(5, dist[i] / far * 6 | 0) === z) { s += sh[i]; c++; } return r(c ? s / c : 0, 1000); })),
      mic: md.shape.map((sh) => [0, 1].map((k) => r(sh.reduce((t, v, i) => t + v * hear(i, k), 0), 10000))),
      // the reduced network, for drawing: positions in units of 0.01 mm from the start point (0.1 mm at 4M), then edges [node, node, cross-section]
      xy: shot.x.flatMap((x, i) => [Math.round((x - home[0]) / (size === '4m' ? 100 : 10)), Math.round((shot.y[i] - home[1]) / (size === '4m' ? 100 : 10))]),
      edges: Array.from({ length: shot.edges.length / 4 }, (_, e) => [shot.edges[e * 4], shot.edges[e * 4 + 1], r(shot.edges[e * 4 + 3], 10)]).flat(),
    };
  });
  const curve = (k) => Array.from({ length: 48 }, (_, i) => r(rows[Math.round(i / 47 * (rows.length - 1))][k] || 0, 100));
  const hours = seconds / 3600, count = (type) => Array.from({ length: 8 }, (_, s) => { let c = 0; for (let j = 0; j < evT.length; j++) if (evType[j] === type && Math.min(7, evT[j] / seconds * 8 | 0) === s) c++; return r(c / (hours / 8), 100); });
  const radius = (meta.z[0] + meta.z[1]) / 4, p = meta.p; // cm; the species' own numbers are the same at every size
  const spec = {
    format: 'mushroom-substrate.specimen/2', slug, name: meta.n, common: full.common_name || '', family: full.family, engine: size, has, seed: 1,
    invented: full.invented ? true : undefined, story: full.invented ? full.notes : undefined,
    colours: meta.c, fruit: { form: meta.f, size_cm: meta.z, trophic: full.ecology ? full.ecology.trophic : '' },
    numbers: { tip_speed_um_h: p[0], growth_unit_um: p[1], branch_angle_deg: p[2], branch_angle_sd_deg: p[3], fusion_probability: p[6], density_cap: p[7], t_opt_c: p[19], t_min_c: p[20], t_max_c: p[21], cold_drop_c: p[26], spike_interval_min: p[35], spike_amplitude_mv: p[37], transport_um_h: p[16], cord_max: has.cords ? p[18] : 0 },
    grown: { days: r(seconds / 86400, 100), segments, size_mm: [W / 1000, depth / 1000] },
    stages, wavetable: wt,
    curves: { tips: curve('tips'), length_um: curve('len'), flow: curve('flow'), uptake: curve('up'), reserve: curve('res'), front_um: curve('front') },
    rates_per_hour: { branch: count(0), fusion: count(1), abandoned: count(3), fruit: count(4), spores: count(12) },
    // the cap as a plate: 90 Hz at 3 cm radius, rising as 1/radius (docs/research/07), with the overtone set for its form
    cap: { radius_cm: r(radius, 100), lowest_hz: r(90 * 3 / radius, 10), overtones: FORM[meta.f] || PLATE },
  };
  const text = JSON.stringify(spec);
  fs.mkdirSync(path.join(OUT, size), { recursive: true });
  fs.writeFileSync(path.join(OUT, size, slug + '.json'), text);
  console.log(`${size.padEnd(5)} ${slug.padEnd(30)} ${stages.length} stages  ${String(segments).padStart(7)} segments  ${String(spec.grown.days).padStart(7)} days  lowest note ${stages[0].hz[0]} -> ${stages[stages.length - 1].hz[0]} Hz  ${(text.length / 1024).toFixed(0)} KB  ${((Date.now() - t0) / 1000).toFixed(0)} s`);
};

const args = process.argv.slice(2), sizeArg = args.find((a) => a.startsWith('--size=')), sizes = sizeArg ? sizeArg.slice(7).split(',') : SIZES, names = args.filter((a) => !a.startsWith('--'));
const real = fs.readdirSync(path.join(ROOT, 'engines/400k/species')).map((f) => f.replace('.json', ''));
const alien = fs.existsSync(path.join(ROOT, 'plugins/aliens/400k')) ? fs.readdirSync(path.join(ROOT, 'plugins/aliens/400k')).map((f) => f.replace('.json', '')) : [];
const list = names[0] === 'all' ? [...real, ...alien] : names[0] === 'aliens' ? alien : names;
for (const slug of list) for (const size of sizes) bake(size, slug);
// the list the plugins offer: every specimen that exists at 400K, with the sizes it has
const dir = path.join(OUT, '400k');
if (fs.existsSync(dir) && !args.includes('--no-index')) {
  const have = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => { const s = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); return [s.slug, s.name, s.common, s.family, s.fruit.form, s.invented ? 1 : 0, SIZES.filter((z) => fs.existsSync(path.join(OUT, z, f))).join(' ')]; });
  have.sort((a, b) => a[5] - b[5] || a[1].localeCompare(b[1]));
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(have));
  console.log(`${have.length} specimens listed`);
}
