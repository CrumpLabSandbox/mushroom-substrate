export const def = {
  id: 'spore-granulator', name: 'Spore Granulator', family: 'effect', kind: 'M', input: true, species: 'amanita-muscaria',
  blurb: 'Your sound, thrown like spores. The sound going in is kept for two seconds. Grains of it are launched at a rate set by the size of the species\' cap. Each grain lasts a spore\'s flight time, and how far back in the kept sound it is taken from follows the rule for how far spores land: most from just now, a few from long ago. Wind pushes grains to one side. Cup fungi, morels, puffballs and bird\'s nests let go in puffs. Air drag can bend each grain\'s pitch as it slows.',
  assumed: 'This is an ordinary granular effect whose settings are driven by spore numbers: the model moves the controls, it does not make the sound. A real spore flies for well under a millisecond over a millimetre or two; times and distances here are stretched to be heard. The figure of 30,000 spores a second is taken to belong to a cap of 5 cm radius, and other caps are scaled by their area, held between a fifth and four times. Puffs come one and a half times a second and last about 80 ms: the pattern is real, the timing is a choice. Which forms puff is a rough rule by fruit form. Founding of new individuals is only used with the largest simulator.',
  about: s => `cap radius ${s.cap.radius_cm} cm · ${({ cup: 1, morel: 1, puffball: 1, birdsnest: 1 })[s.fruit.form] ? 'lets its spores go in puffs' : 'launches spores steadily'}`,
  scales: {
    '4k': 'No mushrooms grow in that simulator: the cap is the species\' recorded size. Grains are launched from one place only.',
    '40k': 'The simple mushrooms of that simulator set the rate by their cap. Grains are launched from one place only.',
    '400k': 'As at 40K: the cap sets the rate, one launch place.',
    '4m': 'Spores are followed there and can found new individuals: a grain that lands far away starts a second launch place, further back in time and to one side, for about two seconds.',
  },
  params: [
    { id: 'rate', label: 'Grains launched', min: 1, max: 200, value: 30, unit: 'per s', trace: 'A real cap launches about 30,000 spores a second; this is a thousandth of that, for a cap of 5 cm radius.', standing: 'sourced, scaled' },
    { id: 'cap', label: 'Cap of the species sets the rate', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'Spores come from the gill surface, which goes with the square of the cap\'s radius. A bigger cap launches more grains a second.', standing: 'inferred from cap size' },
    { id: 'speed', label: 'Launch speed', min: .1, max: 1.8, value: 1, unit: 'm/s', trace: 'Measured launch speeds are 0.1 to 1.8 m/s. A faster launch flies longer, so the grain is longer.', standing: 'sourced' },
    { id: 'drag', label: 'Slowed by the air', min: 0, max: 1, value: 0, show: v => v < .01 ? 'not heard' : 'starts ' + Math.round(v * 100) + '% fast', trace: 'A spore leaves fast and the air stops it almost at once. Each grain is read faster at first and settles to true speed, so its pitch starts high and falls.', standing: 'physics, stretched' },
    { id: 'reach', label: 'Middling landing distance', min: .005, max: .6, value: .08, unit: 's back', trace: 'Half the grains come from more recently than this. On the ground the engine uses 8 cm.', standing: 'from the model' },
    { id: 'puff', label: 'Puffs', min: 0, max: 1, value: 0, show: v => v < .02 ? 'as the species' : Math.round(v * 100) + '% in puffs', trace: 'Gilled mushrooms launch spores one by one, steadily. Cup fungi fire thousands of spore sacs at once and puffballs puff when a raindrop hits. The same number of grains, gathered into bursts.', standing: 'sourced pattern, timing a choice' },
    { id: 'found', label: 'Far spores found new individuals', min: 0, max: 1, value: .25, needs: 'spores', show: v => Math.round(v * 100) + '% of far ones', trace: 'A spore that lands more than three times the middling distance away can start a new individual, which then launches grains from its own place and time for about two seconds.', standing: 'from the model, largest simulator only' },
    { id: 'wind', label: 'Wind', min: -1, max: 1, value: 0, show: v => v < -.05 ? 'to the left' : v > .05 ? 'to the right' : 'still', trace: 'Pushes the grains to one side.', standing: 'a choice' },
    { id: 'mix', label: 'Grains or the sound itself', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '% grains', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
