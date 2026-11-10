export const def = {
  id: 'rot-filter', name: 'Rot Filter', family: 'effect', kind: 'M', input: true, species: 'trametes-versicolor',
  blurb: 'Your sound through a rotting log. The sound going in drives a wooden bar. As the bar rots it loses stiffness and weight, so its notes fall and blur. White rot takes both together; brown rot takes stiffness first, and the notes drop sharply. Left alone the log rots while you listen, at a pace set by the species, the wetness of the wood and the temperature, and when it has gone another falls.',
  assumed: 'The way stiffness and weight fall with each kind of rot is a simple curve matching the known pattern, not fitted to data. A real log would not ring like a bar. How readily each species rots wood is a rough figure by its way of life (wood rotters fastest, others far slower), and years are squeezed into seconds. Wetness follows the known pattern only: dry wood does not rot, waterlogged wood has no air, and water adds weight and shortens the ring by amounts chosen by ear. When a note of the bar lands on a note of the incoming sound and rings above full scale, the bar is turned down until it settles.',
  about: s => `${s.name} is a ${s.fruit.trophic || 'decay'} fungus, best at ${s.numbers.t_opt_c} °C`,
  scales: {
    '4k': 'No weather in that simulator: the log rots at the species\' best temperature, and the temperature control is off.',
    '40k': 'No weather in that simulator: the log rots at the species\' best temperature, and the temperature control is off.',
    '400k': 'Temperature sets the pace of rot through the species\' own temperature curve.',
    '4m': 'As at 400K. The years that simulator covers are the scale a real log rots on; here they are still squeezed into seconds.',
  },
  params: [
    { id: 'decay', label: 'How far gone', min: 0, max: .97, value: .2, show: v => Math.round(v * 100) + '%', trace: 'The share of the log that has rotted. Sets stiffness and weight, and so every resonance. If the log is rotting as you listen, this is where it starts from.', standing: 'from the model' },
    { id: 'rot', label: 'Rotting while you listen', min: 0, max: 600, value: 60, show: v => v < 1 ? 'held' : 'a log in ' + Math.round(v) + ' s at best', trace: 'What is left of the log goes at a steady share per second, the usual way decay is described. The time is for a wood-rotting species at its best temperature in half-wet wood; other species and conditions are slower.', standing: 'sped up' },
    { id: 'wet', label: 'Wetness of the wood', min: 0, max: 1, value: .4, show: v => Math.round(v * 100) + '%', trace: 'Water makes the log heavier, so its notes are lower, and it rings for less time. Rot needs water but also air: it stops in dry wood and in waterlogged wood, and is fastest about half way.', standing: 'sourced pattern, amounts assumed' },
    { id: 'temp', label: 'Temperature', min: -5, max: 40, value: 20, unit: '°C', needs: 'weather', trace: 'The pace of rot follows the species\' temperature curve: nothing below its coldest or above its hottest, fastest at its best.', standing: 'from the model' },
    { id: 'kind', label: 'Kind of rot', min: 0, max: 2, step: 1, value: 0, show: v => ['as the species', 'white rot', 'brown rot'][Math.round(v)], trace: 'White rot removes lignin and cellulose together. Brown rot leaves the lignin and the wood loses its strength early.', standing: 'sourced pattern' },
    { id: 'length', label: 'Length of the log', min: .3, max: 3, value: 1, unit: 'm', trace: 'A longer bar is lower, as one over its length squared.', standing: 'physics' },
    { id: 'ring', label: 'Ring time when sound', min: .02, max: 3, value: .5, unit: 's', trace: 'How long sound wood rings. Rot and water shorten it.', standing: 'a choice' },
    { id: 'mix', label: 'Log or the sound itself', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '% log', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
