export const def = {
  id: 'sym-year', name: 'A Year in the Wood', conductor: 'sequence',
  blurb: 'One wood through one year. Morels in spring, growing fast in cool ground. Stinkhorn cords foraging through summer. Fly agaric and penny bun fruiting and shedding spores in autumn, after the first cold nights. Velvet shank alone through the winter, slow spikes on frozen wood. Each season has its fungus, composer and instrument, and the year turns.',
  assumed: 'The seasons of these species are general knowledge, not measurements in this project. Each composer runs on its own clock inside its season, so the parts are not locked together. Nobody has listened to this.',
  where: x => ['late winter', 'spring', 'early summer', 'high summer', 'early autumn', 'autumn', 'first frosts', 'winter'][Math.min(7, x * 8 | 0)],
  cast: [
    { role: 'Spring', species: 'morchella-importuna', scale: '400k', composer: 'tip-chorus', instrument: 'hyphal-harp', at: .2, comp: { thin: .6, pace: 7 }, strip: { target: -25, pan: -45 } },
    { role: 'Summer', species: 'phallus-impudicus', scale: '40k', composer: 'hyphal-walk', instrument: 'turgor-bow', at: .42, comp: { speed: 5 }, strip: { target: -24, pan: -15 } },
    { role: 'Autumn', species: 'amanita-muscaria', scale: '4m', composer: 'season-cycle', instrument: 'fairy-ring', at: .64, comp: { year: 40 }, strip: { target: -23, pan: 15 } },
    { role: 'Spores', species: 'boletus-edulis', scale: '4m', composer: 'spore-scatter', instrument: 'gill-comb', at: .7, comp: { rate: 6, thin: .6, octave: 1 }, strip: { target: -27, pan: 50 } },
    { role: 'Winter', species: 'flammulina-velutipes', scale: '400k', composer: 'spike-canon', instrument: 'spike-table', at: .93, comp: { octave: -1, rate: .5, voices: 3 }, strip: { target: -25, pan: 0 } },
  ],
  params: [
    { id: 'length', label: 'Length of the year', min: 30, max: 900, value: 150, unit: 's', show: v => v.toFixed(0), trace: 'One year, from late winter round to winter.', standing: 'sped up' },
    { id: 'pos', label: 'Time of year', min: -1, max: 1, value: -1, show: v => v < 0 ? 'turning by itself' : ['late winter', 'spring', 'early summer', 'high summer', 'early autumn', 'autumn', 'first frosts', 'winter'][Math.min(7, v * 8 | 0)], trace: 'Hold the year at one season, or let it turn.', standing: 'a choice' },
    { id: 'overlap', label: 'How far the seasons run into each other', min: .3, max: 3, value: 1.1, show: v => '×' + v.toFixed(1), trace: 'A mild year blurs the seasons; a hard one separates them.', standing: 'a choice' },
  ],
  traces: [['The seasons', 'Morels fruit in spring; stinkhorn in summer; fly agaric and penny bun in autumn after a fall in temperature; velvet shank in winter.', 'general knowledge'], ['Each voice', 'A composer plays the network of its own species at the size of simulator shown.', 'from the model']]
}
