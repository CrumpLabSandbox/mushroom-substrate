export const def = {
  id: 'excitable-gate', name: 'Excitable Gate', family: 'effect', kind: 'S', input: true, species: 'pleurotus-ostreatus',
  blurb: 'A gate that behaves like an excitable cell. The loudness of the sound going in is the drive on one unit of the engines\' electrical model. Below its threshold nothing passes. Above it the unit fires: a spike that runs its full course whatever the input does, and lets the sound through while it lasts. Then it must recover before it can fire again. The unit can be the first of eight along a hypha, so the spike travels and the opening passes from the left ear to the right. The species sets the pace.',
  assumed: 'That loud sound could excite a fungus is not claimed; the input simply stands where the drive from a growing tip stands in the engines. A real spike takes minutes. The species changes only the pace, through its measured interval between spikes, compared with the oyster mushroom\'s 70 minutes and kept within two octaves either way; most species share their family\'s figure. A sound several times louder than the threshold holds the unit up and the gate stays open: that is what this model does when driven hard, not a fault. With travel on, the neighbouring units hold the first one down a little, so it needs a louder sound.',
  about: s => `the same excitable unit the engines use · ${s.name} spikes about every ${s.numbers.spike_interval_min < 1 ? (s.numbers.spike_interval_min * 60).toFixed(0) + ' seconds' : s.numbers.spike_interval_min + ' minutes'}`,
  scales: {
    '4k': 'No electrical activity in that simulator: one unit on its own, paced by the species. The spike cannot travel.',
    '40k': 'No electrical activity in that simulator: one unit on its own, paced by the species. The spike cannot travel.',
    '400k': 'The unit can be the first of eight coupled along a hypha, as that simulator couples them, and the spike travels from left to right.',
    '4m': 'As at 400K: a single unit or a travelling spike along eight.',
  },
  params: [
    { id: 'threshold', label: 'Threshold', min: .02, max: 1, value: .15, trace: 'How loud the sound must be before the unit fires over and over. A sudden sound a third as loud can still set off one spike.', standing: 'model constant, rescaled' },
    { id: 'speed', label: 'Speed of the unit', min: .5, max: 40, value: 6, unit: 'cycles per s', trace: 'How fast the unit lives: a spike and its recovery take one cycle. In life, minutes to hours.', standing: 'sped up' },
    { id: 'pace', label: 'Species sets the pace', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The speed is multiplied by 70 minutes over the species\' measured interval between spikes, so a slow-spiking species gives a slower gate.', standing: 'sourced interval, sped up' },
    { id: 'hold', label: 'How much of the spike lets sound through', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'The gate is open while the unit\'s voltage is above a level; this moves the level from the very tip of the spike to the whole of it.', standing: 'a choice' },
    { id: 'shape', label: 'Gate follows the spike\'s shape', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'At 0 the gate is open or shut. At 100% the loudness follows the unit\'s voltage itself: a fast rise, a slow sag, a sudden fall.', standing: 'from the model' },
    { id: 'travel', label: 'How far the spike travels', min: 0, max: 1, value: 0, needs: 'electrical', show: v => v < .01 ? 'one unit' : 'right ear ' + Math.max(1, Math.round(v * 7)) + ' units along', trace: 'Eight units coupled in a row as the engines couple them along a hypha. The left ear hears the gate at the first unit, the right ear the gate further along, so the opening crosses from left to right at the speed the spike travels.', standing: 'from the model' },
    { id: 'mix', label: 'Gated or untouched', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '% gated', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
