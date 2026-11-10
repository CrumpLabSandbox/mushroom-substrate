#!/usr/bin/env node
// Builds Mushroom World's parameter table from the separate plugins' own declarations, so the combined plugin
// can never drift from them: plugins/mushroom-world/manifest.json (in the shape of a SynthLand plugin manifest,
// with every parameter) and plugins/mushroom-world/gen/modules.js (the same table for its sound code).
//   node tools/build-world.js
'use strict';
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'plugins/mushroom-world');
const VOICES = ['hyphal-harp', 'cap-drums', 'spike-table', 'coupled-spikes', 'turgor-bow', 'rhizomorph-bass', 'fairy-ring', 'gill-comb'];
const PLAYERS = ['spike-canon', 'hyphal-walk', 'tip-chorus', 'growth-form', 'season-cycle', 'spore-scatter'];
const ATMOS = ['rain-on-caps', 'spore-cloud', 'spike-chord', 'decay', 'after-rain', 'forest-floor', 'foraging'];
const FX = ['mycelium-reverb', 'cord-delay', 'excitable-gate', 'spore-granulator', 'rot-filter', 'soil-filter'];
const us = (id) => id.replace(/-/g, '_');
(async () => {
  const defs = {};
  for (const id of [...VOICES, ...PLAYERS, ...ATMOS, ...FX]) defs[id] = (await import(pathToFileURL(path.join(ROOT, 'plugins', id, 'def.js')))).def;
  const species = JSON.parse(fs.readFileSync(path.join(ROOT, 'plugins/specimens/index.json'), 'utf8'));
  const name = (id) => defs[id].name, P = [];
  const f = (id, nm, group, min, max, def, unit, description, extra) => P.push({ id, name: nm, group, type: 'float', min, max, default: def, unit: unit || '', description, ...(extra || {}) });
  const c = (id, nm, group, choices, def, description) => P.push({ id, name: nm, group, type: 'choice', choices, default: def, description });
  c('world.species', 'Species', 'World', species.map((s) => s[1]), 'Pleurotus ostreatus', 'The fungus everything is built from: its network, its fruit body, its numbers. The last 25 are invented, not real.');
  c('world.scale', 'Scale', 'World', ['4K', '40K', '400K', '4M'], '400K', 'The size of simulator the specimen was grown in. Each is a different kind of model; some processes do not exist at some sizes.');
  f('world.growth', 'Growth', 'World', 0, 1, 0.6, '', 'How grown the network is, from first threads to its full recorded size. Moves the stage of growth in every part that has one.');
  f('world.wet', 'Wet', 'World', 0, 1, 0.3, '', 'How wet the ground, the air and the caps are. Moves wetness, humidity and soaking in every part that has them.');
  f('world.temp', 'Warmth', 'World', -25, 15, 0, 'C', 'Temperature, in degrees from the species\' best. Moves temperature in every part that has it; outside the species\' limits those parts stop.');
  for (const [slot, label, list, off, lvl] of [['v1', 'Voice 1', VOICES, false, -8], ['v2', 'Voice 2', VOICES, true, -10]]) {
    c(slot + '.engine', 'Instrument', label, [...(off ? ['Off'] : []), ...list.map(name)], off ? 'Off' : name(list[0]), 'Which instrument this voice is.');
    c(slot + '.player', 'Played by', label, ['Keys', ...PLAYERS.map(name)], 'Keys', 'Keys: you play it. Otherwise a composer plays it from a process of the fungus.');
    P.push({ id: slot + '.octave', name: 'Octave', group: label, type: 'int', min: -3, max: 3, default: 0, description: 'Moves this voice by whole octaves.' });
    f(slot + '.level', 'Level', label, -60, 12, lvl, 'dB', 'This voice\'s fader into the master; -60 is silence.'); f(slot + '.pan', 'Pan', label, -100, 100, slot == 'v1' ? -15 : 15, '%', 'Left to right.');
  }
  c('atmo.engine', 'Atmosphere', 'Atmosphere', ['Off', ...ATMOS.map(name)], 'Off', 'A place that plays by itself under the voices.'); f('atmo.level', 'Level', 'Atmosphere', -60, 12, -12, 'dB', 'The atmosphere\'s fader; -60 is silence.');
  c('fx.engine', 'Effect', 'Effect', ['Off', ...FX.map(name)], 'Off', 'What the voices are sent through.'); f('fx.send', 'Send', 'Effect', 0, 1, 0.5, '', 'How much of the voices goes into the effect.'); f('fx.level', 'Return', 'Effect', -60, 12, -6, 'dB', 'How loud the effect comes back.');
  f('master.target', 'Target', 'Master', -23, -12, -18, 'LUFS', 'The loudness the master is ridden to.'); f('out.ceiling', 'Ceiling', 'Master', -6, 0, -1.5, 'dB', 'The limiter\'s ceiling.'); f('out.level', 'Level', 'Master', -60, 0, 0, 'dB', 'Output level after the limiter.');
  const modules = {};
  for (const id in defs) {
    modules[id] = { name: name(id), family: defs[id].family, kind: defs[id].kind, keys: !!defs[id].keys, live: defs[id].live || null, blurb: defs[id].blurb, scales: defs[id].scales || {}, params: [] };
    for (const p of defs[id].params) {
      if (FX.includes(id) && p.id == 'mix') continue; // inside Mushroom World the Send and Return do this
      const pid = us(id) + '.' + p.id;
      P.push({ id: pid, name: p.label, group: name(id), type: 'float', min: p.min, max: p.max, default: p.value, unit: p.unit || '', description: p.trace, standing: p.standing || 'assumed', ...(p.step ? { step: p.step } : {}), ...(p.needs ? { needs: p.needs } : {}) });
      modules[id].params.push(p.id);
    }
  }
  const manifest = {
    id: 'mushroom-world', name: 'Mushroom World', kind: 'synth', core: 'mushroom', version: '0.1.0',
    family: 'Physical and model-driven: instruments, places, effects and composers built on simulators of fungal growth',
    lineage: 'The mushroom-substrate project (CrumpLabSandbox/mushroom-substrate): four simulators of mycelial growth and the web plugins built on them. No hardware or commercial lineage.',
    description: 'One fungus, many ways to hear it. Choose a species (90 real, 25 invented) and the size of simulator it was grown in. Two voices, each one of eight instruments built from the fungus (its network as a web of taut strings, its cap as a plate, its electrical model as an oscillator), played from the keys or by one of six composers that take their notes from a process of the fungus. An atmosphere plays underneath, an effect built from the same network takes the voices, and a small console brings it to a set loudness. Three world controls (growth, wetness, warmth) move every part at once.',
    codes: { manufacturer: 'Crmp', plugin: 'SLmy' },
    macros: ['world.growth', 'world.wet', 'world.temp', 'v1.level', 'v2.level', 'atmo.level', 'fx.send', 'out.level'],
    presetCategories: ['Instruments', 'Self-playing', 'Places', 'Invented'],
    skin: { entry: 'skin/index.html', width: 1180, height: 700, theme: { accent: '#e2b45a', panel: '#14110c', text: '#ece2c8', foxfire: '#7de3c3', soil: '#231a11', spore: '#e9dcb4' } },
    slots: { v1: VOICES, v2: VOICES, players: PLAYERS, atmo: ATMOS, fx: FX }, modules,
    species: species.map((s) => ({ slug: s[0], name: s[1], common: s[2], family: s[3], form: s[4], invented: !!s[5] })),
    parameters: P,
  };
  fs.mkdirSync(path.join(OUT, 'gen'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
  fs.writeFileSync(path.join(OUT, 'gen/modules.js'), '// Written by tools/build-world.js from the plugins\' own declarations. Do not edit.\nexport const SLOTS = ' + JSON.stringify(manifest.slots) + '\nexport const MODULES = ' + JSON.stringify(Object.fromEntries(Object.entries(modules).map(([k, m]) => [k, m.params]))) + '\nexport const PARAMS = ' + JSON.stringify(P.map((p) => [p.id, p.type == 'choice' ? p.choices.indexOf(p.default) : p.default])) + '\n');
  console.log(`mushroom-world: ${P.length} parameters from ${Object.keys(defs).length} plugins, ${species.length} species`);
})();
