export const def = {
  id: 'sym-magnitudes', name: 'Orders of Magnitude', conductor: 'sequence',
  blurb: 'One fungus, heard at four sizes of simulator at once. At 4K it is tips on a bitmap, a centimetre across and a day old: quick, high and simple. At 40K it is a colony with food moving through it. At 400K it is a block of soil with electrical activity. At 4M it is a plot of ground over years, with mushrooms and spores. The piece zooms out through the four and back, and each size brings what only it has.',
  assumed: 'The four simulators are different models, not one model at four magnifications, so this is four accounts of a fungus set side by side. What each size lacks is listed on every plugin page. Nobody has listened to this.',
  where: x => ['4K: tips on a bitmap', '40K: a colony with flow', '400K: a block of soil', '4M: a plot over years', '4M: spores'][Math.min(4, x * 5 | 0)],
  cast: [
    { role: 'Tips', species: 'pleurotus-ostreatus', scale: '4k', composer: 'tip-chorus', instrument: 'hyphal-harp', at: .1, comp: { thin: .6, octave: 1, pace: 8 }, strip: { target: -26, pan: -50 } },
    { role: 'Flow', species: 'pleurotus-ostreatus', scale: '40k', composer: 'hyphal-walk', instrument: 'turgor-bow', at: .3, comp: { inward: .6 }, strip: { target: -24, pan: -20 } },
    { role: 'Spikes', species: 'pleurotus-ostreatus', scale: '400k', composer: 'spike-canon', instrument: 'spike-table', at: .5, comp: { voices: 5 }, strip: { target: -25, pan: 10 } },
    { role: 'Years', species: 'pleurotus-ostreatus', scale: '4m', composer: 'season-cycle', instrument: 'rhizomorph-bass', at: .7, comp: { year: 45 }, strip: { target: -23, pan: 0 } },
    { role: 'Spores', species: 'pleurotus-ostreatus', scale: '4m', composer: 'spore-scatter', instrument: 'gill-comb', at: .9, comp: { thin: .6, rate: 6 }, strip: { target: -27, pan: 50 } },
  ],
  params: [
    { id: 'length', label: 'Time to zoom out and back', min: 30, max: 900, value: 120, unit: 's', show: v => v.toFixed(0), trace: 'One pass from the smallest simulator to the largest and round again.', standing: 'a choice' },
    { id: 'pos', label: 'Size', min: -1, max: 1, value: -1, show: v => v < 0 ? 'zooming by itself' : ['4K', '40K', '400K', '4M', '4M: spores'][Math.min(4, v * 5 | 0)], trace: 'Hold the piece at one size of simulator, or let it zoom.', standing: 'a choice' },
    { id: 'overlap', label: 'How many sizes are heard at once', min: .3, max: 4, value: 1.6, show: v => '×' + v.toFixed(1), trace: 'Narrow: one size at a time. Wide: all four together.', standing: 'a choice' },
    { id: 'floor', label: 'The sizes not in view', min: 0, max: 1, value: .12, show: v => Math.round(v * 100) + '%', trace: 'How loud the other sizes stay while one is in view.', standing: 'a choice' },
  ],
  traces: [['The four sizes', 'The project\'s four engines, each about ten times the code of the one before: 4K, 40K, 400K, 4M.', 'the project\'s own design'], ['What each adds', '40K adds flow and cords; 400K adds depth, weather and electrical activity; 4M adds years, real-size mushrooms and spores.', 'from the model']]
}
