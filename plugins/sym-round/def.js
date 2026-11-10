export const def = {
  id: 'sym-round', name: 'Fairy Ring Round', conductor: 'round',
  blurb: 'A fairy ring grows outward for decades, and inside an old ring a younger one can start. Four rings of the same fungus, each started a while after the one before, each playing the same piece: the story of the colony\'s growth. Because each starts later, they sing it as a round.',
  assumed: 'Rings inside rings do happen, but that they follow each other at equal intervals is the form of a round, not a finding. All four voices are the same specimen; real rings of different ages would differ. Nobody has listened to this.',
  where: x => 'ring ' + (Math.min(3, x * 4 | 0) + 1) + ' has started',
  cast: [
    { role: 'Oldest ring', species: 'marasmius-oreades', scale: '4m', composer: 'growth-form', instrument: 'fairy-ring', comp: { length: 60, thin: .5, octave: 0 }, inst: { age: 20 }, strip: { target: -24, pan: -50 } },
    { role: 'Second ring', species: 'marasmius-oreades', scale: '4m', composer: 'growth-form', instrument: 'hyphal-harp', comp: { length: 60, thin: .45, octave: 1 }, strip: { target: -25, pan: -15 } },
    { role: 'Third ring', species: 'marasmius-oreades', scale: '400k', composer: 'growth-form', instrument: 'gill-comb', comp: { length: 60, thin: .4, octave: 0 }, strip: { target: -26, pan: 20 } },
    { role: 'Youngest ring', species: 'marasmius-oreades', scale: '400k', composer: 'growth-form', instrument: 'rhizomorph-bass', comp: { length: 60, thin: .5, octave: -1 }, strip: { target: -23, pan: 50 } },
  ],
  params: [
    { id: 'length', label: 'Length of the whole round', min: 60, max: 900, value: 240, unit: 's', show: v => v.toFixed(0), trace: 'From the first ring starting to all four ending. Each ring starts a quarter of this after the one before.', standing: 'a choice' },
    { id: 'entry', label: 'How soon the next ring starts', min: .2, max: 1, value: .6, show: v => Math.round(v * 100) + '% of a turn', trace: 'The gap between one ring starting and the next.', standing: 'a choice' },
  ],
  traces: [['The piece', 'Growth Form: the colony\'s own curves (tips, flow, reserve) over its recorded growth decide density, loudness and note length.', 'from the model'], ['The round', 'Each voice starts the same piece from its beginning when it enters.', 'a musical form, chosen']]
}
