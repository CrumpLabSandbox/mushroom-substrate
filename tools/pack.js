#!/usr/bin/env node
// Writes each tier's packed species files from the full records in species/.
// 4K: the name and the eight numbers the 4K core reads, in the order given in docs/MODEL.md.
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ORDER_4K = ['tip_speed', 'growth_unit', 'branch_angle', 'wobble', 'avoidance', 'fusion_probability', 'uptake', 'turn'];

const out = path.join(ROOT, 'engines', '4k', 'species');
fs.mkdirSync(out, { recursive: true });
for (const file of fs.readdirSync(path.join(ROOT, 'species')).filter((f) => f.endsWith('.json') && f !== 'schema.json')) {
  const s = JSON.parse(fs.readFileSync(path.join(ROOT, 'species', file), 'utf8'));
  if (!s.hyphae || ORDER_4K.some((k) => !s.hyphae[k])) continue; // not ready for this tier
  const packed = { n: s.name, p: ORDER_4K.map((k) => s.hyphae[k].value) };
  fs.writeFileSync(path.join(out, file), JSON.stringify(packed));
  console.log('4k', file, JSON.stringify(packed).length, 'bytes');
}
