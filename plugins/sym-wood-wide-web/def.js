export const def = {
  id: 'sym-wood-wide-web', name: 'Wood Wide Web', conductor: 'sharing',
  blurb: 'Five mycorrhizal fungi on the roots of the same trees. Sugar comes down from the trees to one of them at a time; that one speaks up and the others answer quietly, and the turn passes round. Two walk their networks inward, from the tips where food is found to the root. One marks the year with its mushrooms.',
  assumed: 'That carbon moves between trees through shared fungi in amounts that matter is disputed, and nothing here measures it: the turn-taking is an image of it, not a model. The five species do share hosts in northern forests. Nobody has listened to this.',
  where: x => 'the trees are feeding voice ' + (Math.min(4, x * 5 | 0) + 1),
  cast: [
    { role: 'Deceiver', species: 'laccaria-bicolor', scale: '400k', composer: 'hyphal-walk', instrument: 'hyphal-harp', comp: { inward: .5, octave: 1, thin: .7 }, strip: { target: -25, pan: -60 } },
    { role: 'Slippery jack', species: 'suillus-luteus', scale: '400k', composer: 'hyphal-walk', instrument: 'rhizomorph-bass', comp: { inward: 1, octave: -1, speed: 2 }, strip: { target: -23, pan: -20 } },
    { role: 'Fly agaric', species: 'amanita-muscaria', scale: '4m', composer: 'season-cycle', instrument: 'fairy-ring', comp: { year: 90 }, strip: { target: -25, pan: 0 } },
    { role: 'Brown roll-rim', species: 'paxillus-involutus', scale: '400k', composer: 'spike-canon', instrument: 'coupled-spikes', comp: { rate: .7, voices: 4 }, strip: { target: -26, pan: 25 } },
    { role: 'Black mat', species: 'cenococcum-geophilum', scale: '40k', composer: 'tip-chorus', instrument: 'gill-comb', comp: { thin: .35, pace: 3 }, strip: { target: -27, pan: 60 } },
  ],
  params: [
    { id: 'length', label: 'One round of feeding', min: 20, max: 600, value: 90, unit: 's', show: v => v.toFixed(0), trace: 'The time for the trees\' supply to pass once round all five fungi.', standing: 'a choice' },
    { id: 'pos', label: 'Who is being fed', min: -1, max: 1, value: -1, show: v => v < 0 ? 'passing round by itself' : 'voice ' + (Math.min(4, v * 5 | 0) + 1), trace: 'Hold the supply on one fungus, or let it pass round.', standing: 'a choice' },
    { id: 'answer', label: 'How loudly the others answer', min: 0, max: 1, value: .25, show: v => Math.round(v * 100) + '%', trace: 'A fungus not being fed still lives on its reserves. At 0% only the fed one is heard.', standing: 'a choice' },
  ],
  traces: [['The turn', 'Trees supply their fungal partners with sugar; supply shifts with the season and with which tree is in light.', 'an image, not a model'], ['Walking inward', 'What a hypha takes up at its tips is carried toward the root.', 'from the model']]
}
