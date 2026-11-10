export const def = {
  id: 'coupled-spikes', name: 'Coupled Spikes', family: 'instrument', kind: 'S', keys: true, species: 'schizophyllum-commune',
  blurb: 'The electrical model itself as the oscillator. Each note is a small ring of excitable units, the model the engines use for spiking, run fast enough to be heard and tuned so one cycle is the note. The units pull on their neighbours as stretches of hypha do. How hard they are driven, how unequal that is and how strongly they are coupled are the model\'s own settings, and here they are the timbre, along with how fast the units recover. A hard key drives the units harder, which changes the shape of the wave as well as its loudness. Temperature is set against the species\' own coldest, best and hottest points: away from its best the drive weakens, and far enough away the units stop firing and the note falls silent.',
  assumed: 'This is the model running live at audio rate, not a recording, and the spike measurements it stands for are disputed. Real spikes take minutes to hours. With unequal drive the units run at slightly different rates, so the pitch can sit a little off the key played. One unit\'s cycle is measured by running it whenever a setting changes, so the note stays in tune as drive and recovery move. That temperature acts on the drive, through the same curve the engines use for growth, is an assumption: nobody has measured how spiking changes between a species\' cardinal temperatures. That a hard key means more drive is a choice about the keyboard.',
  scales: {
    '4k': 'The 4K engine has no electrical model or weather. The instrument runs its own ring of units, so it sounds the same; temperature is held at the species\' best.',
    '40k': 'As at 4K: the ring is run here, and there is no weather to set a temperature.',
    '400k': 'The engine that has this electrical model and weather: temperature works, against the species\' cardinal points.',
    '4m': 'The same as 400K. The plot\'s years of weather are not read; the temperature is the one you set.' },
  about: s => `in the recordings ${s.name} spikes about every ${s.numbers.spike_interval_min} minutes: a note at 220 Hz is that, ${(220 * s.numbers.spike_interval_min * 60 / 1e6).toFixed(1)} million times faster`,
  params: [
    { id: 'units', label: 'Units in the ring', min: 1, max: 6, step: 1, value: 4, show: v => Math.round(v), trace: 'How many stretches of hypha are modelled, joined in a ring and spread left to right.', standing: 'a choice' },
    { id: 'drive', label: 'Drive', min: .36, max: 1.3, value: .6, trace: 'How hard the units are pushed. In the engines, growing tips are driven hardest. It changes the wave\'s shape between slow build and sharp spike.', standing: 'model constant' },
    { id: 'spread', label: 'Unequal drive', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'How different the units\' drives are. Unequal units beat against each other.', standing: 'from the model' },
    { id: 'coupling', label: 'Coupling', min: 0, max: .5, value: .1, trace: 'How strongly each unit pulls on its neighbours. Strong coupling locks them together; weak coupling lets them drift.', standing: 'model constant' },
    { id: 'recover', label: 'Recovery', min: .03, max: .2, value: .08, trace: 'How fast a unit recovers after firing. The engines use 0.08. Slow recovery gives a long rest and a brief spike, which is a thin, bright wave; fast recovery gives a rounder one.', standing: 'model constant' },
    { id: 'touch', label: 'A hard key drives harder', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'How much the force on the key adds to the drive. A key at 0.8 gives the drive as set.', standing: 'a choice' },
    { id: 'temp', label: 'Temperature', min: -25, max: 15, value: 0, needs: 'weather', show: v => (v > 0 ? '+' : '') + v.toFixed(1) + ' °C from its best', trace: 'Activity follows the species\' temperature curve: full at its best temperature, none at its coldest and hottest. Here it scales the drive, so away from its best the wave softens and then stops.', standing: 'curve from the species; its effect on spiking assumed' },
    { id: 'attack', label: 'Attack', min: .002, max: 2, value: .01, unit: 's', trace: 'How fast a note comes in.', standing: 'a choice' },
    { id: 'release', label: 'Release', min: .02, max: 4, value: .5, unit: 's', trace: 'How fast it dies away.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
