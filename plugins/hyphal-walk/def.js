export const def = {
  id: 'hyphal-walk', name: 'Hyphal Walk', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'phanerochaete-velutina',
  blurb: 'Melody from the shape of the network. Walkers travel it the way material moves through it, hop by hop along the hyphae, preferring the thicker cord at each junction. Every stop is a note: further from the centre is higher, a longer stretch is a longer note, a thicker cord is louder. A dead end is a rest, then the walker begins again from the centre. Some walkers can travel the other way, from a tip in to the centre, and the network can grow through its stages as it is walked.',
  assumed: 'Material in a real network does not move as a single walker, and it flows both ways at once. Tying pitch to distance from the centre is a choice; the notes themselves are the network\'s own modes.',
  about: s => `${s.family} · cords up to ${s.numbers.cord_max} hyphae thick · grown ${s.grown.days} days`,
  params: [
    { id: 'speed', label: 'Travel speed', min: .5, max: 16, value: 4, unit: 'stretches per s', trace: 'How fast a walker covers a stretch of average length. In life transport runs at millimetres to centimetres an hour.', standing: 'sped up' },
    { id: 'bias', needs: 'cords', label: 'Preference for thick cords', min: 0, max: 3, value: 1, trace: 'At a junction the odds of each way out go as cord thickness to this power. At 0 every way is equally likely; high values keep to the trunk routes.', standing: 'from the model' },
    { id: 'walkers', label: 'Walkers', min: 1, max: 4, step: 1, value: 2, show: v => Math.round(v), trace: 'How many travel at once. Each is a voice.', standing: 'a choice' },
    { id: 'rest', label: 'Rest at a dead end', min: 0, max: 3, value: .6, unit: 's', trace: 'A tip is a dead end. The phrase ends there and a new one starts from the centre.', standing: 'a choice' },
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network is walked. A young one gives short phrases; an old one, long routes along cords.', standing: 'from the model' },
    { id: 'base', label: 'Lowest note', min: 24, max: 72, step: 1, value: 48, show: v => 'key ' + Math.round(v), trace: 'Where the centre of the network is put.', standing: 'a choice' },
    { id: 'hold', label: 'How much of each stretch sounds', min: .1, max: 2, value: 1, show: v => Math.round(v * 100) + '%', trace: 'Note length as a share of the time taken to travel the stretch.', standing: 'a choice' },
    { id: 'inward', needs: 'flow', label: 'Walkers travelling inward', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'What the tips take up is carried back toward the centre, so transport runs both ways. This share of the walkers start at a tip in the outer half and only take ways that lead nearer the centre, sounding each place as they leave it: falling phrases that end when no way leads further in.', standing: 'from the model' },
    { id: 'grow', label: 'Grow through the stages in', min: 0, max: 600, value: 0, show: v => v < 1 ? 'off' : Math.round(v) + ' s', trace: 'The network\'s eight stored stages of growth are walked in turn over this time, starting from the stage above, then again from the youngest. Routes and notes change at each stage.', standing: 'sped up' },
    { id: 'apart', label: 'Modes closer than this are one note', min: 0, max: 2, value: .3, unit: 'semitones', trace: 'A dense network has many modes at almost the same frequency. Those nearer than this to the one below are counted once, so the voices are not all on one pitch. At 0 every mode is used.', standing: 'a choice' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "A small young network with no cords and no flow: short outward phrases, loudness from how many ways lead on at each junction.",
    '40k': "Cords and flow: walkers keep to thick cords, thicker is louder, and some can travel inward.",
    '400k': "The same walk on a network grown in a block of soil.",
    '4m': "A plot-size network over years: long routes along cords, and some phrases begin where a spore has founded a new individual.",
  }
}
