export const def = {
  id: 'spore-scatter', name: 'Spore Scatter', family: 'composer', kind: 'S', composer: true, instrument: 'cap-drums', species: 'amanita-muscaria',
  blurb: 'The spread of pitches from the spread of spores. Each note is a spore landing. Most fall close to the mushroom and a few travel far, by the same rule the stand-scale engine uses; distance on the ground is distance in pitch from a centre note. Rarely a far spore founds a new individual, and the centre moves there. The parent goes on shedding for a while, so two centres are heard at once.',
  assumed: 'How long a parent keeps shedding after a new individual is founded is a choice. Turning distance on the ground into distance in pitch is a choice. The landing rule is fitted to one figure from an abstract (95% of spores within a metre). A real cap sheds tens of thousands of spores a second; only a few a second are heard here.',
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm · in the model about 94% of spores land within a metre`,
  params: [
    { id: 'rate', label: 'Spores heard', min: .5, max: 40, value: 8, unit: 'per s', trace: 'A tiny sample of the real discharge, which is about 30,000 a second from one cap.', standing: 'a sample' },
    { id: 'reach', label: 'Middling landing distance', min: .25, max: 12, value: 2.5, unit: 'semitones', trace: 'Half the spores land nearer than this. On the ground the engine uses 8 cm.', standing: 'a choice' },
    { id: 'wind', label: 'Wind', min: -1, max: 1, value: 0, show: v => v < -.05 ? 'toward low' : v > .05 ? 'toward high' : 'still', trace: 'Pushes more spores to one side.', standing: 'a choice' },
    { id: 'gust', needs: 'spores', label: 'How much discharge comes and goes', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Spore release depends on humidity and moving air, so it arrives in waves.', standing: 'assumed' },
    { id: 'found', needs: 'spores', label: 'Founding', min: 0, max: 5, value: 1, show: v => '×' + v.toFixed(1), trace: 'How readily a spore that lands far out founds a new individual, which moves the centre. In the engine this is rare.', standing: 'from the model' },
    { id: 'base', label: 'Centre note', min: 36, max: 84, step: 1, value: 60, show: v => 'key ' + Math.round(v), trace: 'Where the first mushroom stands.', standing: 'a choice' },
    { id: 'length', label: 'Note length', min: .05, max: 1.5, value: .25, unit: 's', trace: 'How long each landing sounds.', standing: 'a choice' },
    { id: 'overlap', needs: 'spores', label: 'Parent keeps shedding for about', min: 0, max: 20, value: 3, unit: 's', trace: 'After a spore founds a new individual, the old mushroom does not stop at once. Its share of the spores heard falls away over this time, so the old and new centres overlap.', standing: 'a choice' },
    { id: 'own', label: 'Pull toward the network\'s own notes', min: 0, max: 1, value: 0, show: v => Math.round(v * 100) + '%', trace: 'Moves each landing distance toward the nearest interval that the network\'s modes make with its lowest mode. Spores that land beyond the largest are left where they fell.', standing: 'a choice' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "No spores at this size: each note is a new branch placed inside the growing front, which widens through the run and begins again.",
    '40k': "As at 4K: the simple mushrooms there shed no spores.",
    '400k': "As at 4K: no spores are modelled in the block of soil.",
    '4m': "Spores: most land close, a few far, and a far one can found a new individual and move the centre.",
  }
}
