export const def = {
  id: 'soil-filter', name: 'Soil Filter', family: 'effect', kind: 'P', input: true, species: 'tuber-melanosporum',
  blurb: 'Sound heard through soil. Soil swallows sound, the high notes first, and more so the longer the way through it and the wetter the ground. The sound also arrives late, by the time it takes to travel. Two listeners sit 10 cm apart, so a source off to one side reaches them at different times and with different dullness. Rain wets the ground from the top down. The listener can be the species\' own network, shaken by what comes through. This is what a truffle would hear.',
  assumed: 'The numbers are rough: sound is taken to travel at 150 metres per second in loose soil and to lose its top end every 14 cm when dry; nothing is cut lower than 60 Hz. Real soils vary enormously. Rain is sped up: the wet front goes down at up to 12 cm a second and drains in about six seconds, where real soil takes hours to days. When the network listens, it is the full-grown network of the species ringing for about a third of a second, which is a choice, as real hyphae in soil would not ring; a mode that rings above full scale is turned down until it settles. With the network at 0% the species changes nothing.',
  about: s => `most mycelium lives in the top 10 to 20 cm · the listening network's lowest note is ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz`,
  scales: {
    '4k': 'That simulator is flat and has no weather: the distance is taken sideways through the top layer, it does not rain, and the listening network is made bigger by whole octaves to be heard.',
    '40k': 'That simulator is flat and has no weather: the distance is taken sideways through the top layer and it does not rain. The network listens at its real size.',
    '400k': 'A block of soil with depth and weather: the listener is under the surface, rain wets the ground from the top, and the network listens at its real size.',
    '4m': 'Depth and weather as at 400K. The network is metres across, so it is made smaller by whole octaves to be heard, and the page says by how much.',
  },
  params: [
    { id: 'depth', label: 'Depth of the listener', min: 0, max: 100, value: 10, unit: 'cm', trace: 'How much soil the sound passes through. Litter and organic soil hold most mycelium; truffles fruit at 5 to 30 cm.', standing: 'from the species\' habit' },
    { id: 'wet', label: 'Wetness of the soil', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'Wet soil damps high sound more strongly.', standing: 'assumed' },
    { id: 'rain', label: 'Rain', min: 0, max: 1, value: 0, needs: 'weather', show: v => v < .01 ? 'none' : v < .4 ? 'light' : v < .8 ? 'steady' : 'heavy', trace: 'While it rains a wet front moves down from the surface and the soil above it is wetter, so a deep listener hears the dulling arrive late. When the rain stops the water drains and the sound clears.', standing: 'sped up' },
    { id: 'side', label: 'Source off to one side', min: -1, max: 1, value: 0, show: v => Math.abs(v) < .02 ? 'overhead' : Math.round(Math.abs(v) * 25) + ' cm ' + (v < 0 ? 'left' : 'right'), trace: 'Two listeners 10 cm apart, as two parts of one mycelium. A source to one side has a shorter way to the nearer one: it arrives there sooner, louder and brighter.', standing: 'physics' },
    { id: 'web', label: 'Heard by the network', min: 0, max: 1, value: .25, show: v => Math.round(v * 100) + '%', trace: 'What comes through the soil shakes the species\' full-grown network, and its two microphones hear the network\'s own modes ring. Wet soil damps them.', standing: 'from the model, ring time a choice' },
    { id: 'mix', label: 'Through soil or direct', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '% through soil', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 4, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
