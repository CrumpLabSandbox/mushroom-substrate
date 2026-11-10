export const def = {
  id: 'fairy-ring', name: 'Fairy Ring', family: 'instrument', kind: 'P', keys: true, species: 'marasmius-oreades',
  blurb: 'A ring of mycelium as a ring that carries a wave round and round. The living part of a fairy ring is a band: an outer edge advancing into fresh ground and an inner edge where it dies back. Each edge is a loop a little different in length, so the two beat. Every year the ring grows by the species\' advance, and its note falls. Real rings are often broken in one place; a break splits each note into two close ones that beat. The disturbance that sets the ring going can reach all of it or only an arc, and a hard key is a sharper disturbance than a soft one.',
  assumed: 'Nothing travels round a real fairy ring as a wave. This takes the ring\'s shape and growth and treats it as a loop. The key played is the note of a ring half a metre in radius; a real ring of that size, at the speed of a wave in a hypha, would sound at about 7 Hz. The break is one weak point: waves that move there are held back and waves that are still there pass, which is how a small load on a ring behaves; nothing is lost at it. What sets the ring going is a burst of random pushes, like rain falling on it, and that a hard key makes the pushes sharper is a choice. Except at the largest size the yearly advance is the tip speed kept up all year, which is too fast for most real rings.',
  scales: {
    '4k': 'A colony this size is millimetres across, not a ring. The ring is worked out from the species\' tip speed alone.',
    '40k': 'As at 4K: no ring grows in the engine, so the advance is the tip speed kept up all year.',
    '400k': 'As at 4K and 40K: the block of soil is centimetres across. The advance is still the tip speed kept up all year.',
    '4m': 'A plot grown over years: the yearly advance is the one the plot itself showed, with its seasons, so the ring ages at a truer rate.' },
  about: s => `advances about ${(s.numbers.tip_speed_um_h * 8.76e-3).toFixed(2)} m a year in the model (measured rings: 0.07 to 1.25 m a year)`,
  params: [
    { id: 'age', label: 'Age of the ring', min: 0, max: 40, value: 3, unit: 'years', trace: 'Each year the radius grows by the species\' advance, the loop lengthens and the note falls.', standing: 'from the species' },
    { id: 'band', label: 'Width of the living band', min: 0, max: 1.5, value: .3, unit: 'm', trace: 'The outer edge is longer than the inner by this much radius, so the two loops are slightly out of tune and beat. Measured mats are 4 to 22 cm deep; bands vary.', standing: 'a choice' },
    { id: 'gap', label: 'A break in the ring', min: 0, max: 1, value: 0, show: v => v ? Math.round(v * 100) + '%' : 'whole', trace: 'Rings are often broken where they met a path, a root or another ring. Waves that move at the break are held back there, and waves that are still at it pass freely, so every note splits into two close ones that beat. A bigger break, a wider split.', standing: 'physics, simplified; the amount is a choice' },
    { id: 'arc', label: 'How much of the ring is disturbed', min: .02, max: 1, value: 1, show: v => v > .98 ? 'all of it' : Math.round(v * 100) + '% of the way round', trace: 'The note starts with random pushes on the ring, like a shower. All round, it starts as a wash; on a short arc, the same burst comes past again each lap, which is buzzier and brighter.', standing: 'a choice' },
    { id: 'ring', label: 'Ring time', min: .1, max: 6, value: 1.5, unit: 's', trace: 'How long the wave keeps going round.', standing: 'a choice' },
    { id: 'bright', label: 'High notes kept', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'How much of the high end survives each lap.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['How hard the key is hit', 'Loudness, and how sharp the pushes are: a soft key starts the ring with slow, smooth pushes and a darker note.', 'a choice'], ['Letting go', 'The wave is damped in about a quarter of a second at any pitch.', 'a choice']]
}
