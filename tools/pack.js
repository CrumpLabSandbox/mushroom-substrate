#!/usr/bin/env node
// Writes each tier's packed species files from the full records in species/.
// The order of the numbers is the order each core reads them in (docs/MODEL.md section 2).
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const get = (s, key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), s);
const TIERS = {
  '4k': {
    keys: ['hyphae.tip_speed', 'hyphae.growth_unit', 'hyphae.branch_angle', 'tuning_4k.wobble', 'tuning_4k.avoidance',
      'tuning_4k.fusion_probability', 'tuning_4k.uptake', 'tuning_4k.turn'],
    extra: () => ({}),
  },
  '40k': {
    keys: ['hyphae.tip_speed', 'hyphae.growth_unit', 'hyphae.branch_angle', 'hyphae.branch_angle_sd', 'hyphae.wobble',
      'hyphae.sensitivity', 'hyphae.fusion_probability', 'network.density_cap', 'substrate.uptake_rate', 'substrate.uptake_half',
      'substrate.capacity', 'substrate.maintenance', 'substrate.inactivation_rate', 'substrate.inactivation_age',
      'substrate.degradation_rate', 'substrate.passive_transport', 'substrate.transport_speed', 'network.cord_rate',
      'network.cord_max', 'environment.t_opt', 'environment.t_min', 'environment.t_max', 'environment.wet_opt',
      'environment.wet_width', 'network.explore', 'fruiting.reserve_threshold', 'fruiting.cold_drop', 'fruiting.min_age',
      'fruiting.initial_rate', 'fruiting.mature_mass', 'substrate.affinity.soil', 'substrate.affinity.wood',
      'substrate.affinity.litter', 'substrate.affinity.root', 'substrate.affinity.agar'],
    extra: (s) => ({ s: s.scenario, c: [s.display.mycelium, s.display.cap] }),
  },
};

const files = fs.readdirSync(path.join(ROOT, 'species')).filter((f) => f.endsWith('.json') && f !== 'schema.json');
for (const [tier, def] of Object.entries(TIERS)) {
  const out = path.join(ROOT, 'engines', tier, 'species');
  fs.mkdirSync(out, { recursive: true });
  let largest = 0;
  for (const file of files) {
    const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'species', file), 'utf8'));
    const missing = def.keys.filter((k) => get(s, k) == null);
    if (missing.length) { console.log(`${tier} ${file}: skipped, missing ${missing.join(', ')}`); continue; }
    const packed = JSON.stringify({ n: s.name, ...def.extra(s), p: def.keys.map((k) => get(s, k).value) });
    fs.writeFileSync(path.join(out, file), packed);
    largest = Math.max(largest, packed.length);
  }
  console.log(`${tier}: ${fs.readdirSync(out).length} species, largest ${largest} bytes`);
}
