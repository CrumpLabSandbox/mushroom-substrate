export const def = {
  id: 'tip-chorus', name: 'Tip Chorus', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'coprinopsis-cinerea',
  blurb: 'Texture from branching. The growth rule itself runs live: tips advance across a field, branching at the species\' rate and angle and fusing when two meet. Left to right across the field is low to high. The music starts as a few lines, thickens as the tips multiply, and thins where they fuse, crowd or leave. Temperature slows or stops the tips by the species\' own curve.',
  assumed: 'Mapping the field\'s left-to-right axis to pitch is a choice, and so is sounding a tip every few steps. Pitches are continuous, not the network\'s modes, unless they are pulled onto them; then intervals below the centre note mirror the ones above, which is a choice. The branching rate, angle and fusion chance come from the species file, where most are family defaults.',
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
    { id: 'temp', needs: 'weather', label: 'Temperature, from the species\' best', min: -30, max: 12, value: 0, show: v => (v >= 0 ? '+' : '') + v.toFixed(1) + ' °C', trace: 'Tip speed follows the species\' temperature curve between its lowest, best and highest temperatures. Away from the best the tips slow; outside the limits they stop and the music stops with them.', standing: 'from the species' },
    { id: 'own', label: 'Pull toward the network\'s own notes', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'Moves each note\'s distance from the centre note toward the nearest interval that the network\'s modes make with its lowest mode.', standing: 'a choice' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "This is the 4K engine's own subject: tips, branching and fusion, at a steady temperature.",
    '40k': "The same, and in a cord-forming species a long-lived line grows louder as it thickens.",
    '400k': "Adds temperature: the tips slow or stop by the species' curve.",
    '4m': "Adds spores: new individuals are founded across the field every few seconds, and tips of different individuals do not fuse.",
  }
}
