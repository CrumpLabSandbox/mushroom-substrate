#!/usr/bin/env node
// Writes each tier's packed species files from the full records in species/.
// The order of the numbers is the order each core reads them in (docs/MODEL.md section 2).
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const get = (s, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), s);

// A species inherits every value it does not set from its family file, species/families/<CODE>.json.
const merge = (base, over) => {
  const plain = (o) => o && typeof o === 'object' && !Array.isArray(o) && !('value' in o);
  if (!plain(base) || !plain(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
};
const family = (code) => {
  const f = path.join(ROOT, 'species', 'families', code + '.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
};

// Engine defaults for values that no family or species file gives.
const V = (value) => ({ value });
const FALLBACK = {
  scenario: 1,
  display: { mycelium: '#e8e2d2', cap: '#b9a98a' },
  electrical: { spike_interval: V(60), spike_duration: V(10), spike_amplitude: V(0.5) },
  combat: { score: V(0.5) },
};
// Where the mycelium prefers to live, in um below the soil surface, by family (an engine default, not a measurement).
const DEPTH = { LIT: 600, DIF: 1200, RING: 1500, 'ECM-S': 2500, 'ECM-M': 2500, 'ECM-L': 3500, RHIZ: 3000, 'CORD-S': 1500, 'CORD-L': 1500 };

const K4 = ['hyphae.tip_speed', 'hyphae.growth_unit', 'hyphae.branch_angle', 'tuning_4k.wobble', 'tuning_4k.avoidance',
  'tuning_4k.fusion_probability', 'tuning_4k.uptake', 'tuning_4k.turn'];
const K40 = ['hyphae.tip_speed', 'hyphae.growth_unit', 'hyphae.branch_angle', 'hyphae.branch_angle_sd', 'hyphae.wobble',
  'hyphae.sensitivity', 'hyphae.fusion_probability', 'network.density_cap', 'substrate.uptake_rate', 'substrate.uptake_half',
  'substrate.capacity', 'substrate.maintenance', 'substrate.inactivation_rate', 'substrate.inactivation_age',
  'substrate.degradation_rate', 'substrate.passive_transport', 'substrate.transport_speed', 'network.cord_rate',
  'network.cord_max', 'environment.t_opt', 'environment.t_min', 'environment.t_max', 'environment.wet_opt',
  'environment.wet_width', 'network.explore', 'fruiting.reserve_threshold', 'fruiting.cold_drop', 'fruiting.min_age',
  'fruiting.initial_rate', 'fruiting.mature_mass', 'substrate.affinity.soil', 'substrate.affinity.wood',
  'substrate.affinity.litter', 'substrate.affinity.root', 'substrate.affinity.agar'];
const K400 = [...K40, 'electrical.spike_interval', 'electrical.spike_duration', 'electrical.spike_amplitude', 'combat.score'];
const fruit = (s) => ({
  f: (s.fruit && s.fruit.form) || 'agaric',
  z: (() => { const v = s.fruit && s.fruit.size_cm ? [].concat(s.fruit.size_cm.value).filter((x) => typeof x === 'number') : []; return v.length > 1 ? [v[0], v[1]] : v.length ? [v[0] / 2, v[0]] : [3, 8]; })(),
  c: [s.display.mycelium, (s.fruit && s.fruit.cap_colour) || s.display.cap, (s.fruit && s.fruit.stem_colour) || '#e8e2d2'],
});

const TIERS = {
  '4k': { keys: K4, extra: () => ({}) },
  '40k': { keys: K40, extra: (s) => ({ s: s.scenario, c: [s.display.mycelium, s.display.cap] }) },
  '400k': { keys: K400, tail: (s) => [DEPTH[s.family] || 2500], extra: (s) => ({ id: s.slug, s: s.scenario, ...fruit(s) }) },
  '4m': { keys: K400, tail: (s) => [DEPTH[s.family] || 2500], extra: (s) => ({ id: s.slug, s: s.scenario, ...fruit(s) }) },
};

const files = fs.readdirSync(path.join(ROOT, 'species')).filter((f) => f.endsWith('.json') && f !== 'schema.json');
for (const [tier, def] of Object.entries(TIERS)) {
  if (!fs.existsSync(path.join(ROOT, 'engines', tier, 'core.js'))) continue;
  const out = path.join(ROOT, 'engines', tier, 'species');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  let largest = 0, count = 0;
  const list = [];
  for (const file of files) {
    const own = JSON.parse(fs.readFileSync(path.join(ROOT, 'species', file), 'utf8'));
    const s = merge(merge(FALLBACK, family(own.family)), own);
    const missing = def.keys.filter((k) => get(s, k) == null || get(s, k).value == null);
    if (missing.length) { console.log(`${tier} ${file}: skipped, missing ${missing.join(', ')}`); continue; }
    const packed = JSON.stringify({ n: s.name, ...def.extra(s), p: [...def.keys.map((k) => get(s, k).value), ...(def.tail ? def.tail(s) : [])] });
    fs.writeFileSync(path.join(out, file), packed);
    largest = Math.max(largest, packed.length); count++;
    list.push([s.slug, s.name, s.common_name || '', s.family]);
  }
  // the list of species the engine's page offers (it counts toward the engine's bytes; the 4K page lists its own)
  if (tier !== '4k') fs.writeFileSync(path.join(ROOT, 'engines', tier, 'list.json'), JSON.stringify(list));
  // Invented species (species/alien) are packed for the plugins only: they are not offered by the engines' own
  // pages, do not count toward the 100-species cap or an engine's bytes, and never sit beside the real ones.
  const alienDir = path.join(ROOT, 'species', 'alien'), alienOut = path.join(ROOT, 'plugins', 'aliens', tier);
  if (fs.existsSync(alienDir)) {
    fs.rmSync(alienOut, { recursive: true, force: true }); fs.mkdirSync(alienOut, { recursive: true });
    for (const file of fs.readdirSync(alienDir).filter((f) => f.endsWith('.json'))) {
      const own = JSON.parse(fs.readFileSync(path.join(alienDir, file), 'utf8')), s = merge(merge(FALLBACK, family(own.family)), own);
      fs.writeFileSync(path.join(alienOut, file), JSON.stringify({ n: s.name, ...TIERS['400k'].extra(s), ...def.extra(s), p: [...def.keys.map((k) => get(s, k).value), ...(def.tail ? def.tail(s) : [])] }));
    }
  }
  console.log(`${tier}: ${count} species, largest ${largest} bytes`);
}
