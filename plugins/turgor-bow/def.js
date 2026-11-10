export const def = {
  id: 'turgor-bow', name: 'Turgor Bow', family: 'instrument', kind: 'P', keys: true, species: 'serpula-lacrymans',
  blurb: 'The web sustained, not plucked. Hyphal tips do not grow smoothly: they advance in pulses. Here that pulsing is the bow. While a key is held, small strikes arrive at the pulse rate, a little irregular, with a faint hiss of smaller yields between them, and the web rings on under them. Several tips can pulse at once, each on its own clock, which turns the buzz into a texture. Temperature, set against the species\' own coldest, best and hottest points, sets how fast they pulse. A hard key gives sudden, sharp pushes and a soft key slow, dull ones. The web can go on growing while the key is held.',
  assumed: 'Pulsed tip growth is reported at 2.7 to 14 pulses a minute and is contested; here it is sped up by ear. That each pulse pushes on the web is an assumption. The web is the same bare, resized string web as the Hyphal Harp, and real hyphae are too damped to ring. Tips are taken to pulse independently of each other. Temperature slows the pulses by the growth curve the engines use, on the assumption that the pulse rate follows the growth rate. That a hard key means a wall that yields more suddenly is a choice about the keyboard; a softer yield is modelled by smoothing each push. Growth under a held key is sped up from days to seconds.',
  scales: {
    '4k': 'Tips on a small bitmap, which is all this engine has: a young thin web with no cords, bowed by its tips. No weather, so temperature is held at the species\' best.',
    '40k': 'A flat colony with cords, so the web\'s modes sit further from a plain string\'s. No weather, so temperature is held at the species\' best.',
    '400k': 'A block of soil with weather: temperature works, against the species\' cardinal points.',
    '4m': 'A plot metres across. Its real notes are below hearing, so the web is shrunk much further to reach the key; temperature works.' },
  about: s => `${s.family} · the web's own modes at the chosen stage of ${s.grown.days} days of growth`,
  params: [
    { id: 'rate', label: 'Growth pulses', min: 2, max: 120, value: 24, unit: 'per s', trace: 'How often the tips pulse. Measured at 2.7 to 14 a minute; sped up here.', standing: 'sourced, contested, sped up' },
    { id: 'jitter', label: 'How irregular the pulses are', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'Real pulses are not evenly spaced.', standing: 'assumed' },
    { id: 'tips', label: 'Tips pulsing', min: 1, max: 24, step: 1, value: 1, show: v => Math.round(v), trace: 'How many growing tips push on the web, each pulsing on its own clock. A real colony has hundreds to thousands; the count at this stage is shown in the drawing\'s data.', standing: 'a sample' },
    { id: 'temp', label: 'Temperature', min: -25, max: 15, value: 0, needs: 'weather', show: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' °C from its best', trace: 'Growth follows the species\' temperature curve: fastest at its best temperature, stopped at its coldest and hottest. The pulse rate is scaled by that curve, so far from its best the bow slows and then stops.', standing: 'curve from the species; its effect on pulsing assumed' },
    { id: 'pressure', label: 'Turgor', min: .05, max: 1.5, value: .6, trace: 'The pressure inside the hyphae. More pressure, a harder push at each pulse.', standing: 'physics' },
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the modes.', standing: 'from the model' },
    { id: 'grow', label: 'Grows while held', min: 0, max: .5, value: .03, show: v => v ? (v * 100).toFixed(0) + '% of the run per s' : 'off', trace: 'While a key is held the network goes on growing from the chosen stage, and its modes move with it.', standing: 'from the model, sped up' },
    { id: 'pos', label: 'Where the tips are', min: 0, max: 1, value: .5, show: v => v < .2 ? 'centre' : v > .8 ? 'edge' : 'between', trace: 'Distance from the centre at which the pulsing acts. Tips are at the edge of a growing colony.', standing: 'from the model' },
    { id: 'own', label: 'Its own modes', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'At 100% the overtones are the network\'s own; at 0% a plain string\'s.', standing: 'from the model' },
    { id: 'ring', label: 'Ring time', min: .05, max: 4, value: .8, unit: 's', trace: 'How long the web rings between pulses.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['How hard the key is hit', 'Loudness, and how suddenly the wall yields at each pulse: a hard key gives a sharp push that reaches the high modes, a soft key a slow one that does not.', 'a choice']]
}
