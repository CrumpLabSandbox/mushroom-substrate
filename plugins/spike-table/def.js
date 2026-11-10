export const def = {
  id: 'spike-table', name: 'Spike Table', family: 'instrument', kind: 'S', keys: true, species: 'phanerochaete-velutina',
  blurb: 'A wavetable instrument. The table is one cycle of the voltage between two electrodes at each of 64 stages of the network\'s growth. A held note scans through the table, so the tone changes the way the electrical wave changed as the fungus grew. Each held note also moves on through growth by itself, a hard key starts later in growth than a soft one, the right ear can read a little later than the left, and the cycles can be made uneven in length.',
  assumed: 'The model\'s voltage is used directly as the shape of the wave: this is not a vibrating body. One cycle really lasts minutes to hours. The spike recordings behind the electrical model are disputed. The tables are dark: most of their energy is in the first few harmonics. That a hard key reads later in growth, and that the two ears read different stages, are choices about how to play the table, not things the fungus does. Recorded spike intervals vary a great deal; the unevenness here is drawn fresh for each cycle from a seeded source, up to half a cycle either way at most. Where the network has no electrical model, the table is rebuilt from one excitable unit whose drive rises with the count of growing tips: that tips are driven hardest is the model\'s own rule, but the straight line from tip count to drive is an assumption.',
  scales: {
    '4k': 'No electrical model in the network. The table is one excitable unit alone, driven harder as the number of growing tips rises, so growth still changes the wave.',
    '40k': 'As at 4K: one unit alone, its drive following the tip count of the flat colony.',
    '400k': 'The full thing: voltage between two electrodes on a network whose electrical activity is modelled as it grows.',
    '4m': 'The same reading on a plot grown over years, so the table covers a much longer stretch of the network\'s life.' },
  about: s => `${s.wavetable.frames} frames from ${s.grown.days} days of growth · one cycle really lasts about ${s.numbers.spike_interval_min} minutes`,
  params: [
    { id: 'pos', label: 'Stage of growth', min: 0, max: 1, value: .2, show: v => Math.round(v * 100) + '%', trace: 'Where in the table the note reads: the shape the voltage had at that stage of the network\'s growth.', standing: 'from the model' },
    { id: 'sweep', label: 'Drift through growth', min: 0, max: 4, value: .15, unit: 'per s', trace: 'How fast the reading point drifts back and forth through the stages.', standing: 'a choice' },
    { id: 'depth', label: 'How far it drifts', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'How much of the table the drift covers.', standing: 'a choice' },
    { id: 'grow', label: 'Each note grows', min: 0, max: .5, value: .04, show: v => v ? (v * 100).toFixed(0) + '% of the table per s' : 'off', trace: 'While a key is held, that note reads further and further on in the network\'s growth, on top of the shared drift.', standing: 'from the model, sped up' },
    { id: 'touch', label: 'A hard key reads later', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'How far the force on the key moves the starting point: a hard key begins later in growth, a soft key earlier. A key at 0.8 is not moved.', standing: 'a choice' },
    { id: 'width', label: 'Right ear reads later', min: 0, max: 1, value: .15, show: v => Math.round(v * 25) + '% of the table', trace: 'The left ear hears the wave at the note\'s stage of growth, the right ear the wave from a little later, up to a quarter of the table.', standing: 'a choice' },
    { id: 'irregular', label: 'Uneven spike intervals', min: 0, max: 1, value: 0, show: v => v ? '±' + Math.round(v * 50) + '%' : 'even', trace: 'Recorded intervals between spikes are far from even. Each cycle is made longer or shorter than the key\'s by a random share, which roughens the note and at the top turns it to noise.', standing: 'sourced, contested; the amount is a choice' },
    { id: 'attack', label: 'Attack', min: .002, max: 2, value: .02, unit: 's', trace: 'How fast a note comes in.', standing: 'a choice' },
    { id: 'release', label: 'Release', min: .02, max: 4, value: .6, unit: 's', trace: 'How fast it dies away.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Wave shape', 'The voltage between two electrodes over one cycle, from the engine\'s electrical model on the growing network.', 'from the model']]
}
