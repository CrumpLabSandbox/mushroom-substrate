export const def = {
  id: 'tip-chorus', name: 'Tip Chorus', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'coprinopsis-cinerea',
  blurb: 'Texture from branching. The growth rule itself runs live: tips advance across a field, branching at the species\' rate and angle and fusing when two meet. Left to right across the field is low to high. The music starts as a few lines, thickens as the tips multiply, and thins where they fuse, crowd or leave.',
  assumed: 'Mapping the field\'s left-to-right axis to pitch is a choice, and so is sounding a tip every few steps. Pitches are continuous, not the network\'s modes. The branching rate, angle and fusion chance come from the species file, where most are family defaults.',
  about: s => `branches every ${s.numbers.growth_unit_um} µm of hypha per tip, at ${s.numbers.branch_angle_deg}°; fuses ${Math.round(s.numbers.fusion_probability * 100)}% of the times two meet`,
  params: [
    { id: 'pace', label: 'Tip speed', min: 1, max: 20, value: 5, unit: 'steps per s', trace: 'How fast tips advance. One step is 0.1 mm; in life a tip takes minutes to hours over it.', standing: 'sped up' },
    { id: 'branching', label: 'Branching', min: 0, max: 4, value: 1, show: v => '×' + v.toFixed(2), trace: 'Multiplies the species\' branching rate (one branch per growth unit of hypha, per tip).', standing: 'from the species' },
    { id: 'angle', label: 'Branch angle', min: 0, max: 2, value: 1, show: v => '×' + v.toFixed(2), trace: 'Multiplies the species\' branch angle. Wide angles spread the voices across the pitch range; narrow ones keep them in a bundle.', standing: 'from the species' },
    { id: 'fusion', label: 'Fusion', min: 0, max: 6, value: 1, show: v => '×' + v.toFixed(2), trace: 'Multiplies the chance that two tips that meet become one. A fusion sounds an octave lower.', standing: 'from the species' },
    { id: 'voices', label: 'Room for tips', min: 2, max: 24, step: 1, value: 10, show: v => Math.round(v), trace: 'Crowding: branching slows as the field fills, and stops at this many tips.', standing: 'from the model' },
    { id: 'every', label: 'A tip sounds every', min: 1, max: 12, step: 1, value: 4, show: v => Math.round(v) + ' steps', trace: 'How often an advancing tip is heard between branches.', standing: 'a choice' },
    { id: 'base', label: 'Centre note', min: 36, max: 84, step: 1, value: 60, show: v => 'key ' + Math.round(v), trace: 'The pitch of the middle of the field, where growth starts.', standing: 'a choice' },
    { id: 'span', label: 'Width of the field', min: .5, max: 5, value: 3, unit: 'octaves', trace: 'How much pitch the 12.8 mm field covers.', standing: 'a choice' },
    { id: 'length', label: 'Note length', min: .05, max: 2, value: .3, unit: 's', trace: 'How long each note is held.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const s = Math.min(w, h) * .46, cx = w / 2, cy = h / 2, L = view.lines
    g.strokeStyle = spec.colours[0]; g.globalAlpha = .7; g.lineWidth = 2; g.beginPath()
    for (let i = 0; i < L.length; i += 4) { g.moveTo(cx + L[i] * s, cy + L[i + 1] * s); g.lineTo(cx + L[i + 2] * s, cy + L[i + 3] * s) }
    g.stroke(); g.globalAlpha = 1
    for (const [x, y] of view.tips) { g.beginPath(); g.arc(cx + x * s, cy + y * s, 7, 0, 7); g.fillStyle = '#f2c94c'; g.fill() }
    g.fillStyle = '#a89c82'; g.font = '20px system-ui'; g.fillText('low', cx - s, h - 16); g.fillText('high', cx + s - 40, h - 16)
  }
}
