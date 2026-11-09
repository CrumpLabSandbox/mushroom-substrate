#!/usr/bin/env node
// Calibration: runs set experiments in the engines and compares what comes out with published
// measurements. Writes docs/calibration/results.json (which the site shows) and prints a table.
// Nothing here changes a parameter; fitting is done by hand from this table and recorded in
// docs/CALIBRATION.md. Each target names where its number comes from in docs/research/.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const core = (tier) => new Function(fs.readFileSync(path.join(ROOT, 'engines', tier, 'core.js'), 'utf8') + ';return M')();
const species = (tier, slug) => JSON.parse(fs.readFileSync(path.join(ROOT, 'engines', tier, 'species', slug + '.json'), 'utf8'));
const M40 = core('40k'), M400 = core('400k'), M4M = core('4m');
const results = [];
// A value was fitted to these, so they show the fit works, not that the model predicts. The rest were not tuned to.
const FITTED = { front: 'the front factor 1.15 was fitted to these nine front speeds together', 'front-pleurotus-ostreatus': "its temperature curve was fitted to these three points, and the front factor to all nine front speeds",
  'podospora-fusion': 'the fusion probability 0.15 was fitted to this', 'fruit-coprinopsis': "the fruiting bodies' draw rate was fitted to this",
  'decay-log': 'the amount of substrate in wood was fitted to this', 'spore-range': 'the landing rule was written to give this',
  spikes: 'the interval is an input; this checks that the engine returns it', 'ring-marasmius': 'the tip speed was derived from this same ring rate', 'spread-armillaria-ostoyae': 'the tip speed was derived from this same spread rate' };
const add = (r) => {
  const { lo, hi } = r.target;
  const key = Object.keys(FITTED).sort((a, b) => b.length - a.length).find((k) => r.id.startsWith(k));
  r.role = key ? 'fitted' : 'check'; r.fit = key ? FITTED[key] : 'nothing was tuned to this';
  r.verdict = r.simulated == null ? 'did not happen' : r.simulated >= lo && r.simulated <= hi ? 'within the measured range'
    : r.simulated < lo ? `low: ${(r.simulated / lo).toFixed(2)} of the lower bound` : `high: ${(r.simulated / hi).toFixed(2)} times the upper bound`;
  r.ok = r.simulated != null && r.simulated >= lo && r.simulated <= hi;
  results.push(r);
  const f = (v) => (v == null ? '-' : Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? v.toFixed(2) : v.toFixed(3));
  console.log(`${r.ok ? 'ok  ' : 'MISS'} ${r.engine.padEnd(5)} ${r.species.padEnd(26)} ${r.measure.padEnd(44)} measured ${f(lo)}-${f(hi)} ${r.unit.padEnd(9)} simulated ${f(r.simulated)}   ${r.verdict}`);
};

// ---- 40K: colony front speed on agar. The radius is the mean distance from the centre of the outermost
// 5% of growing tips; speed is the slope between 3 mm and 10 mm, as a ruler on a Petri dish would give.
function front40(p, temp, seed = 1) {
  const S = M40(p, seed, 0);
  S.temp = temp;
  const radius = () => {
    const d = S.tips.map((t) => Math.hypot(S.x1[t[0]] - S.W / 2, S.y1[t[0]] - S.W / 2)).sort((a, b) => b - a);
    const k = Math.max(1, d.length / 20 | 0);
    return d.length ? d.slice(0, k).reduce((a, b) => a + b, 0) / k : 0;
  };
  let t3 = null, t10 = null, r3, r10;
  for (let i = 0; i < 6000 && t10 === null; i++) {
    S.step();
    const r = radius();
    if (t3 === null && r >= 3000) { t3 = S.t; r3 = r; }
    if (r >= 10000) { t10 = S.t; r10 = r; }
    if (S.tips.length === 0) break;
  }
  return t10 === null ? null : (r10 - r3) / 1000 / ((t10 - t3) / 86400); // mm per day
}
const mean = (a) => { const v = a.filter((x) => x != null); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null; };
const frontTarget = (slug, temp, lo, hi, source, note) => {
  const sp = species('40k', slug);
  add({ id: `front-${slug}-${temp}`, engine: '40K', species: sp.n, measure: `colony front speed on agar at ${temp} °C`, unit: 'mm/day',
    target: { lo, hi, source, note }, simulated: mean([1, 2, 3].map((s) => front40(sp.p, temp, s))), how: 'mean of 3 seeds; outermost 5% of tips, slope from 3 to 10 mm' });
};
frontTarget('pleurotus-ostreatus', 20, 6.0, 7.4, 'research/08 [18]', '6.7 mm/day, one study; range is ±10%');
frontTarget('pleurotus-ostreatus', 25, 10.5, 12.9, 'research/08 [18]', '11.7 mm/day, one study; range is ±10%');
frontTarget('pleurotus-ostreatus', 30, 10.8, 13.2, 'research/08 [18]', '12.0 mm/day, one study; range is ±10%');
frontTarget('schizophyllum-commune', 30, 10.5, 11.3, 'species file (search snippet)', '10.9 ± 0.4 mm/day on malt extract agar');
frontTarget('lentinula-edodes', 25, 8.7, 10.0, 'species file (search snippet)', '8.7 to 10.0 mm/day, two strains');
frontTarget('agaricus-bisporus', 24, 2.7, 5.3, 'species file (search snippet)', '2.7 rising to 5.3 mm/day on agar');
frontTarget('phanerochaete-velutina', 25, 7.6, 9.2, 'research/01 [22] (search snippet)', '8.4 mm/day; conditions not seen; range is ±10%');
frontTarget('serpula-lacrymans', 21, 4.0, 6.0, 'research/01 [24] (search snippet)', '4 to 6 mm/day');
frontTarget('rhodonia-placenta', 20, 0.12, 0.70, 'research/01 [9]', 'tip speed 5 to 29 µm/h in a thin confined film, not a colony rate');

// ---- 40K: the engine's own kinetics, against the best-measured mould (Podospora anserina, not one of the
// species). Tip speed and branching rate are put in; doubling time, front speed and fusion ratio come out.
{
  const p = species('40k', 'coprinopsis-cinerea').p.slice();
  p[0] = 307; p[1] = 307 / 0.37; p[2] = 71; p[8] = 3.07; p[18] = 0; p[19] = 27; p[20] = 5; p[21] = 40; p[26] = 0; p[7] = 12; p[6] = 0.15;
  const S = M40(p, 1, 0); S.temp = 27;
  let t20 = null, t160 = null, fu = 0, br = 0;
  for (let i = 0; i < 200; i++) { S.step(); if (t20 === null && S.ntips >= 20) t20 = S.t; if (t160 === null && S.ntips >= 160) { t160 = S.t; fu = S.fu; br = S.br; } }
  const src = 'research/01 [8] (Dikec et al.)';
  add({ id: 'podospora-doubling', engine: '40K', species: 'Podospora anserina (test organism)', measure: 'time for the number of tips to double', unit: 'h',
    target: { lo: 1.6, hi: 2.0, source: src, note: '1.81 h' }, simulated: t160 === null ? null : (t160 - t20) / 3600 / 3, how: 'tip speed 307 µm/h and branching 0.37 per h put in; time from 20 to 160 tips, divided by 3' });
  add({ id: 'podospora-front', engine: '40K', species: 'Podospora anserina (test organism)', measure: 'colony front speed at 27 °C', unit: 'mm/day',
    target: { lo: 6.5, hi: 7.8, source: 'research/03 (Dikec et al. 2022) and research/01 [11]', note: 'front 7 mm/day; tips 307 ± 18 µm/h = 7.4 mm/day' }, simulated: mean([1, 2, 3].map((s) => front40(p, 27, s))), how: 'as the front speeds above' });
  add({ id: 'podospora-fusion', engine: '40K', species: 'Podospora anserina (test organism)', measure: 'fusions per branch', unit: 'ratio',
    target: { lo: 0.09, hi: 0.16, source: src, note: '0.05 fusions against 0.37 branches per hour, about 1 in 8' }, simulated: br ? fu / br : null, how: 'counts when the colony reaches 160 tips, the same early stage as the doubling time' });
}

// ---- 40K: loopiness of a cord network, and the time a mushroom takes
{
  const sp = species('40k', 'phanerochaete-velutina');
  const a = [1, 2, 3].map((seed) => { const S = M40(sp.p, seed, 1); for (let i = 0; i < 500; i++) S.step(); return S.alphaX; });
  add({ id: 'alpha-velutina', engine: '40K', species: sp.n, measure: 'loopiness (alpha), every crossing counted', unit: '',
    target: { lo: 0.11, hi: 0.20, source: 'research/02 [1] (Bebber et al. 2007)', note: 'networks 24 cm across at 5 to 6 weeks; the engine is 2.5 cm and days' }, simulated: mean(a), how: 'mean of 3 seeds after 500 steps in the wood-block world' });
  const cc = species('40k', 'coprinopsis-cinerea'), S = M40(cc.p, 1, 0), born = [];
  let first = null;
  S.ev = (type) => { if (type === 4) born.push(S.t); if (type === 6 && first === null) first = S.t; };
  for (let i = 0; i < 1500 && first === null; i++) S.step();
  add({ id: 'fruit-coprinopsis', engine: '40K', species: cc.n, measure: 'first initial to first mature fruiting site', unit: 'days',
    target: { lo: 4, hi: 5, source: 'research/01 [7]', note: 'hyphal knot to mature mushroom in 4 to 5 days' }, simulated: first === null ? null : (first - born[0]) / 86400, how: 'time between the first "initial started" and first "matured" events at 28 °C' });
}

// ---- 400K: does the electrode show the spike interval that was put in?
for (const slug of ['pleurotus-ostreatus', 'schizophyllum-commune', 'flammulina-velutipes', 'omphalotus-nidiformis', 'cordyceps-militaris']) {
  const sp = species('400k', slug), S = M400([{ id: sp.id, p: sp.p }], 1, sp.s);
  S.weather = 0;
  for (let i = 0; i < 80; i++) S.step();
  const minutes = S.tp * S.tdt / 60, want = sp.p[35];
  add({ id: `spikes-${slug}`, engine: '400K', species: sp.n, measure: 'interval between spikes at one electrode', unit: 'min',
    target: { lo: want * 0.8, hi: want * 1.25, source: 'research/04 (Adamatzky 2022 and others)', note: `${want} min, extracellular; the measurement itself is disputed` },
    simulated: S.pspikes ? minutes / S.pspikes : null, how: 'excitable-network model, 80 growth steps, weather off; electrical time divided by spikes at the electrode nearest the inoculum' });
}

// ---- 4M: how fast a colony spreads over years, how fast wood goes, how far spores land
function stand(slug, scn, years, mean) {
  const sp = species('4m', slug), S = M4M([{ id: sp.id, p: sp.p }], 1, scn);
  if (mean != null) S.mean = mean;
  const reach = () => { let m = 0; for (let i = 0; i < S.n; i++) if (S.st[i] === 1 && S.own[i] === 0) { const d = Math.hypot(S.x1[i] - S.home[0][0], S.y1[i] - S.home[0][1]); if (d > m) m = d; } return m / 1e6; };
  const out = [];
  for (let y = 1; y <= years; y++) { while (S.t < y * 365 * 86400) S.step(); out.push({ year: y, reach: reach(), wood: S.wood }); }
  return { sp, out };
}
{
  const g = stand('armillaria-gallica', 1, 3);
  add({ id: 'spread-armillaria-gallica', engine: '4M', species: g.sp.n, measure: 'spread of rhizomorphs through soil', unit: 'm/year',
    target: { lo: 0.3, hi: 0.6, source: 'research/08 [7] (Rishbeth 1991)', note: 'rhizomorphs 0.3 to 0.6 m/year' }, simulated: (g.out[2].reach - g.out[0].reach) / 2, how: 'furthest live cord from the start, change from year 1 to year 3, fallen-logs ground' });
  const o = stand('armillaria-ostoyae', 3, 3);
  add({ id: 'spread-armillaria-ostoyae', engine: '4M', species: o.sp.n, measure: 'spread through a stand of trees', unit: 'm/year',
    target: { lo: 0.22, hi: 1.3, source: 'research/02 [20]', note: 'genets 0.22 to 1.3 m/year, three studies' }, simulated: (o.out[2].reach - o.out[0].reach) / 2, how: 'as above, trees-and-roots ground' });
  const m = stand('marasmius-oreades', 0, 4);
  add({ id: 'ring-marasmius', engine: '4M', species: m.sp.n, measure: 'advance of a fairy ring in turf', unit: 'm/year',
    target: { lo: 0.07, hi: 0.39, source: 'research/02 [24]', note: '7 to 39 cm/year' }, simulated: (m.out[3].reach - m.out[1].reach) / 2, how: 'furthest live cord, change from year 2 to year 4, meadow ground' });
  const w = stand('trametes-versicolor', 4, 4, 10);
  const k = w.out[3].wood > 0 && w.out[0].wood > 0 ? Math.log(w.out[0].wood / w.out[3].wood) / 3 : null;
  add({ id: 'decay-log', engine: '4M', species: w.sp.n, measure: 'decay constant of a log at a 10 °C mean', unit: 'per year',
    target: { lo: 0.02, hi: 0.2, source: 'research/06 (Harmon et al. 2020)', note: 'about 0.06 per year at 10 °C, with a 244-fold range worldwide; a threefold band around it is used' }, simulated: k, how: 'ln(wood left at year 1 / wood left at year 4) / 3, one big log; the log is still being colonised' });
  let within = 0; for (let i = 0; i < 100000; i++) { const u = (i + 0.5) / 100000; if (8e4 * u / (1.02 - u) <= 1e6) within++; }
  add({ id: 'spore-range', engine: '4M', species: 'all', measure: 'share of spores landing within 1 m', unit: 'fraction',
    target: { lo: 0.9, hi: 0.99, source: 'research/05 (Galante et al. 2011, abstract only)', note: '95% within 1 m' }, simulated: within / 100000, how: "the engine's landing rule, evaluated directly" });
}

const out = path.join(ROOT, 'docs', 'calibration');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), within: results.filter((r) => r.ok).length, total: results.length,
  checks: results.filter((r) => r.role === 'check').length, checks_within: results.filter((r) => r.role === 'check' && r.ok).length, results }, null, 1) + '\n');
console.log(`\n${results.filter((r) => r.ok).length} of ${results.length} within the measured range; of the ${results.filter((r) => r.role === 'check').length} that nothing was tuned to, ${results.filter((r) => r.role === 'check' && r.ok).length}`);
