export const def = {
  id: 'spike-canon', name: 'Spike Canon', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'schizophyllum-commune',
  blurb: 'Rhythm and counterpoint from electrical activity. A short chain of excitable units, the model the engines use for spiking, runs live. The unit at the growing tip fires on its own; the ones behind it fire only when the wave reaches them. Each firing is a note, so the voices follow one another down the hypha like a canon. The tip\'s drive can come and go, so that spikes arrive in trains with quiet between, and the rate can follow the species\' own spike interval.',
  assumed: 'That the spike trains in the recordings come from a tip\'s drive rising and falling is assumed, and so is their length (about sixteen spikes). Modes that are nearly the same pitch are counted as one note. The spike recordings behind this model are disputed, and no one has measured a spike travelling along a hypha. Real spikes come minutes to hours apart; here the rate is set by ear. Each unit\'s note is one of the network\'s own modes, which is a choice of what to attach to what.',
  about: s => `${s.name} spikes about every ${s.numbers.spike_interval_min} minutes in the recordings · the notes are this network's own`,
  params: [
    { id: 'voices', label: 'Units along the hypha', min: 2, max: 8, step: 1, value: 5, show: v => Math.round(v), trace: 'How many stretches of hypha are modelled, tip first. Each is a voice.', standing: 'a choice' },
    { id: 'rate', label: 'Spike rate at the tip', min: .2, max: 8, value: 1.4, unit: 'per s', trace: 'How often the driven tip unit fires. In life this is the species\' spike interval; here it is sped up.', standing: 'sped up' },
    { id: 'coupling', needs: 'electrical', label: 'Coupling along the hypha', min: 0, max: .4, value: .14, trace: 'How strongly each unit pulls on its neighbours. Too weak and the wave dies before it reaches the far end.', standing: 'model constant' },
    { id: 'spread', label: 'How much harder the tip is driven', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Growing tips are the pacemakers. At 0% no unit fires by itself; at 100% several do, and the canon breaks into cross-rhythm.', standing: 'from the model' },
    { id: 'recovery', label: 'Recovery', min: .03, max: .2, value: .08, trace: 'How fast a unit can fire again. Slower recovery makes units skip beats.', standing: 'model constant' },
    { id: 'stage', label: 'Stage of growth for the notes', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the notes: unit k plays the network\'s k-th mode.', standing: 'from the model' },
    { id: 'base', label: 'Lowest note', min: 24, max: 72, step: 1, value: 48, show: v => 'key ' + Math.round(v), trace: 'Where the network\'s lowest mode is put. Everything else follows from its ratios.', standing: 'a choice' },
    { id: 'length', label: 'Note length', min: .05, max: 2, value: .4, unit: 's', trace: 'How long each note is held.', standing: 'a choice' },
    { id: 'trains', needs: 'electrical', label: 'Spike trains', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'In the recordings spikes come in trains with quiet stretches between. This makes the tip\'s drive rise and fall once in about sixteen spikes; at 100% the chain is silent for over half of each turn.', standing: 'research estimate, disputed' },
    { id: 'species', label: 'Follow the species\' spike interval', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'At 100% the rate is multiplied by 60 minutes over the species\' recorded interval, so a species that spikes twice as often plays twice as fast. Held between 0.1 and 12 a second.', standing: 'from the species' },
    { id: 'apart', label: 'Modes closer than this are one note', min: 0, max: 2, value: .3, unit: 'semitones', trace: 'A dense network has many modes at almost the same frequency. Those nearer than this to the one below are counted once, so the voices are not all on one pitch. At 0 every mode is used.', standing: 'a choice' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "No electrical activity is modelled at this size: each unit runs alone, so there is no canon, only pulses drifting against each other.",
    '40k': "As at 4K: flow and cords exist, but no electrical network, so the units are uncoupled.",
    '400k': "The full canon: the wave passes from the tip down a chain of coupled units.",
    '4m': "Two individuals: the chain is two hyphae that do not join, each with its own tip, so two shorter canons run against each other.",
  }
}
