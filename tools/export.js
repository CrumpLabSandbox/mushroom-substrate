#!/usr/bin/env node
// Writes the data files the site and other projects read, from species/ and species/families/:
//   species.json           one record per species for the species browser, every parameter listed
//                          after family inheritance with its basis and where it came from
//   families.json          the network families and their members
//   worldbuilder.json      a small pack for placing and drawing mushrooms without a simulator
//   README-worldbuilder.md what the fields of that pack mean
//   summary.json           the headline counts, for the landing page
// Usage: node tools/export.js [output directory]   (default _site/data)
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, '_site', 'data'));
const SPECIES = path.join(ROOT, 'species');
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// Engine defaults for values no family or species file gives (the same ones tools/pack.js uses).
const FALLBACK = {
  electrical: { spike_interval: { value: 60 }, spike_duration: { value: 10 }, spike_amplitude: { value: 0.5 } },
  combat: { score: { value: 0.5 } },
};
// The blocks that hold measured values, in the order the browser shows them.
const SECTIONS = ['hyphae', 'network', 'substrate', 'environment', 'fruiting', 'electrical', 'combat', 'tuning_4k', 'fruit'];
const BASES = ['sourced', 'inferred', 'unknown'];

const BIOME_NAMES = biomeNames();
// How each family's network spreads, for a renderer that only wants to cluster mushrooms.
const NETWORK = {
  DIF: 'one dense short-lived patch on a single deposit of dung or compost',
  MAT: 'fills one log or trunk and stays inside it',
  'CORD-S': 'short cords reaching wood within about a metre',
  'CORD-L': 'long sparse cords linking wood many metres apart',
  RHIZ: 'root-like rhizomorphs spreading tens of metres from tree to tree',
  RING: 'an expanding ring in grass or litter, empty in the middle',
  LIT: 'many small separate patches scattered through leaf litter',
  'ECM-S': 'stays within centimetres of the roots of its host tree',
  'ECM-M': 'patches up to about a metre around host tree roots',
  'ECM-L': 'cords running metres through soil between host trees',
  HOST: 'confined to one living host: a trunk, an insect or another fungus',
  GARDEN: 'a garden kept inside an insect nest or gallery',
};

// Every {value, basis} leaf below `o`, as [dotted key, leaf].
function leaves(o, prefix, out = []) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return out;
  if ('value' in o) { out.push([prefix, o]); return out; }
  for (const k of Object.keys(o)) leaves(o[k], prefix ? prefix + '.' + k : k, out);
  return out;
}
const section = (o, name) => (o && o[name] !== undefined ? leaves(o[name], name) : []);

// The biome codes and their names, read from the column key of the species survey.
function biomeNames() {
  const names = {};
  try {
    const text = fs.readFileSync(path.join(ROOT, 'docs', 'research', '08-species-survey.md'), 'utf8');
    const m = text.match(/\*\*Biomes:\*\*([\s\S]*?)\n- \*\*/);
    if (m) for (const part of m[1].replace(/\s+/g, ' ').replace(/\.\s*$/, '').split(',')) {
      const p = part.trim().match(/^([A-Z]{3})\s+(.+)$/);
      if (p) names[p[1]] = p[2];
    }
  } catch (e) { /* the survey is optional; codes then stand for themselves */ }
  return names;
}

const numbers = (v) => [].concat(v == null ? [] : v).filter((x) => typeof x === 'number' && isFinite(x));
// One drawing size in cm: the lite block's, else the middle of the measured range, else 5.
function sizeCm(s) {
  if (s.lite && typeof s.lite.size_cm === 'number') return s.lite.size_cm;
  const v = numbers(s.fruit && s.fruit.size_cm && s.fruit.size_cm.value);
  if (v.length > 1) return round((v[0] + v[v.length - 1]) / 2);
  if (v.length === 1) return round(v[0] * 0.75); // only an upper limit is known
  return 5;
}
const round = (x) => Math.round(x * 100) / 100;

function main() {
  const familyFiles = fs.readdirSync(path.join(SPECIES, 'families')).filter((f) => f.endsWith('.json')).sort();
  const families = {};
  for (const f of familyFiles) { const fam = read(path.join(SPECIES, 'families', f)); families[fam.code || f.replace('.json', '')] = fam; }
  const files = fs.readdirSync(SPECIES).filter((f) => f.endsWith('.json') && f !== 'schema.json').sort();
  const all = files.map((f) => read(path.join(SPECIES, f)));

  const species = all.map((s) => {
    const fam = families[s.family] || {};
    const own = new Map(SECTIONS.flatMap((n) => section(s, n)));
    const inherited = new Map(SECTIONS.flatMap((n) => section(fam, n)));
    const fallback = new Map(SECTIONS.flatMap((n) => section(FALLBACK, n)));
    const keys = [];
    for (const n of SECTIONS) for (const m of [inherited, own, fallback]) for (const k of m.keys()) if (k.startsWith(n + '.') && !keys.includes(k)) keys.push(k);
    const counts = { total: 0, sourced: 0, inferred: 0, unknown: 0, own: 0, inherited: 0, own_sourced: 0 };
    const params = keys.map((key) => {
      const from = own.has(key) ? 'species' : inherited.has(key) ? 'family' : 'engine default';
      const v = own.get(key) || inherited.get(key) || fallback.get(key);
      const basis = BASES.includes(v.basis) ? v.basis : 'unknown';
      const p = { key, value: v.value, unit: v.unit || '', basis, from };
      if (v.source) p.source = v.source;
      if (v.note) p.note = v.note; else if (from === 'engine default') p.note = 'engine default; no family or species file gives a value';
      counts.total++; counts[basis]++;
      if (from === 'species') { counts.own++; if (basis === 'sourced') counts.own_sourced++; } else counts.inherited++;
      return p;
    });
    const fruit = s.fruit || {};
    return {
      slug: s.slug, name: s.name, common_name: s.common_name || '',
      family: s.family, family_name: fam.name || s.family,
      tier: s.tier || '', data_richness: s.data_richness == null ? null : s.data_richness,
      taxonomy: s.taxonomy || {},
      ecology: s.ecology || {},
      fruit: {
        form: fruit.form || 'none',
        size_cm: fruit.size_cm ? fruit.size_cm.value : null,
        cap_colour: fruit.cap_colour || (s.display && s.display.cap) || (fam.display && fam.display.cap) || '#b9a98a',
        stem_colour: fruit.stem_colour || '#e8e2d2',
        bioluminescent: !!fruit.bioluminescent,
      },
      display: { ...(fam.display || {}), ...(s.display || {}) },
      notes: s.notes || '',
      counts, params,
    };
  });

  const familyList = Object.values(families).map((f) => ({
    code: f.code, name: f.name, description: f.description || '', type_species: f.type_species || '',
    members: all.filter((s) => s.family === f.code).map((s) => s.slug),
  }));

  const usedBiomes = [...new Set(all.flatMap((s) => (s.lite && s.lite.biomes) || (s.ecology && s.ecology.biomes) || []))];
  const biomeOrder = [...Object.keys(BIOME_NAMES).filter((b) => usedBiomes.includes(b)), ...usedBiomes.filter((b) => !BIOME_NAMES[b]).sort()];
  const world = {
    version: 1,
    generated: new Date().toISOString(),
    biomes: Object.fromEntries(biomeOrder.map((b) => [b, BIOME_NAMES[b] || b])),
    forms: [...new Set(all.map((s) => (s.lite && s.lite.form) || (s.fruit && s.fruit.form) || 'none'))].sort(),
    families: Object.fromEntries(Object.values(families).map((f) => [f.code, { name: f.name, network: NETWORK[f.code] || f.name }])),
    species: all.map((s) => {
      const lite = s.lite || {}, fruit = s.fruit || {}, eco = s.ecology || {};
      const o = {
        id: s.slug, name: s.name, common: s.common_name || '',
        family: lite.family || s.family,
        trophic: eco.trophic || 'other',
        form: lite.form || fruit.form || 'none',
        size_cm: sizeCm(s),
        colours: Array.isArray(lite.colours) && lite.colours.length === 2 ? lite.colours
          : [fruit.cap_colour || (s.display && s.display.cap) || '#b9a98a', fruit.stem_colour || '#e8e2d2'],
        biomes: (lite.biomes && lite.biomes.length ? lite.biomes : eco.biomes) || [],
        continents: eco.continents || [],
        abundance: Math.min(3, Math.max(1, Math.round(lite.abundance || 1))),
      };
      if (fruit.bioluminescent) o.glow = true;
      if (eco.hosts) o.hosts = eco.hosts;
      return o;
    }),
  };

  fs.mkdirSync(OUT, { recursive: true });
  const write = (name, text) => { fs.writeFileSync(path.join(OUT, name), text); return Buffer.byteLength(text); };
  const sizes = {
    'species.json': write('species.json', JSON.stringify(species)),
    'families.json': write('families.json', JSON.stringify(familyList)),
    'worldbuilder.json': write('worldbuilder.json', JSON.stringify(world)),
  };
  const noSize = all.filter((s) => !(s.lite && typeof s.lite.size_cm === 'number') && !numbers(s.fruit && s.fruit.size_cm && s.fruit.size_cm.value).length).map((s) => s.name);
  write('README-worldbuilder.md', readme(world, noSize));
  const withSourced = species.filter((s) => s.counts.own_sourced > 0).length;
  const sum = (k) => species.reduce((a, s) => a + s.counts[k], 0);
  write('summary.json', JSON.stringify({
    species: species.length, families: familyList.length, values: sum('total'), sourced_values: sum('sourced'),
    inferred_values: sum('inferred'), unknown_values: sum('unknown'), species_with_sourced: withSourced,
    species_with_own_parameters: species.filter((s) => s.params.some((p) => p.from === 'species' && !p.key.startsWith('fruit.'))).length,
  }));
  console.log(`export: ${species.length} species, ${familyList.length} families, ${withSourced} with a sourced value of their own; ` +
    Object.entries(sizes).map(([k, v]) => `${k} ${v.toLocaleString('en-US')} bytes`).join(', '));
}

function readme(world, noSize) {
  return `# worldbuilder.json

A small pack of ${world.species.length} fungi for placing and drawing mushrooms on a generated world without
running any simulator. Written by \`tools/export.js\` in
[mushroom-substrate](https://github.com/CrumpLabSandbox/mushroom-substrate) from the species
files there.

**How far to trust it.** Sizes, colours, biomes, continents and hosts are mostly general
knowledge that nobody checked against the literature; the species files tag almost all of them
\`inferred\`, and \`abundance\` and the colours are display choices, not data. Use it to make a
plausible world, not as a reference.

## Top level

| Field | Meaning |
|---|---|
| \`version\` | Format version, ${world.version}. |
| \`generated\` | When the file was written (ISO date). |
| \`biomes\` | Biome code to plain name: ${Object.entries(world.biomes).map(([k, v]) => `${k} ${v}`).join(', ')}. |
| \`forms\` | Every fruit body form used: ${world.forms.join(', ')}. \`none\` means no fruit body is made. |
| \`families\` | Network family code to \`{name, network}\`. \`network\` is one phrase on how the mycelium spreads, which says how the mushrooms should cluster. |
| \`species\` | The list below. |

## Each species

| Field | Meaning |
|---|---|
| \`id\` | Slug; also the file name in \`species/\` and the \`?s=\` value the simulators accept. |
| \`name\`, \`common\` | Scientific name and common name (may be empty). |
| \`family\` | Network family code, a key of \`families\`. Not the taxonomic family. |
| \`trophic\` | How it feeds: white-rot, brown-rot, litter-soil, dung, ectomycorrhizal, tree-parasite, insect-parasite, mycoparasite, insect-farmed or other. |
| \`form\` | Fruit body form, one of \`forms\`. |
| \`size_cm\` | One typical width (height for clubs and stinkhorns) in cm. Where no size is known it is 5${noSize.length ? ' (' + noSize.map((n) => '*' + n + '*').join(', ') + ')' : ''}. |
| \`colours\` | \`[cap, stem]\` as hex colours. |
| \`biomes\` | Biome codes it is found in. |
| \`continents\` | NA, SA, EU, AS, AF, AU (Australasia). |
| \`abundance\` | 1 rare or local, 2 occasional, 3 common. A relative weight only. |
| \`glow\` | Present and true if it is bioluminescent. |
| \`hosts\` | Short text naming its trees, insects or other hosts. Left out when it has none. |

## A placement rule to start from

1. At a point on the world, take the local biome code and continent.
2. Candidates are the species whose \`biomes\` include it (and whose \`continents\` include the
   continent, if the world has them). Drop ectomycorrhizal and tree-parasite species where there
   are no trees, and dung species where there are no grazers.
3. Pick one with probability proportional to \`abundance\` squared, so common species dominate.
4. Draw it as its \`form\` at \`size_cm\`, varying the size by about a third either way, in its
   \`colours\`; light it if \`glow\` is set.
5. Cluster by family: RING in an arc or ring several metres across; MAT and HOST as a group on one
   log or trunk; CORD-S, CORD-L and RHIZ as several groups on nearby wood; the ECM families in a
   loose scatter under one tree, wider from ECM-S to ECM-L; LIT as many singles over the litter;
   DIF as one tight troop; GARDEN on or beside a nest mound.
`;
}

main();
