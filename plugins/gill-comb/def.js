export const def = {
  id: 'gill-comb', name: 'Gill Comb', family: 'instrument', kind: 'P', keys: true, species: 'pleurotus-ostreatus',
  blurb: 'The gills as a row of thin blades. Under a cap hang dozens of gills, each a thin plate fixed along its top edge. No two are quite the same length, so struck together they sound as a comb of close notes. As the cap opens the gills spread and their notes move apart. The species decides what hangs there: gills, spines, or the tubes of a bolete or bracket, which are air columns with their own overtones. Shorter gills between the full ones sound higher. Whatever strikes them can cross the row in time, so the comb is strummed from one side to the other, and a hard key bends the blades in their second way more.',
  assumed: 'A real gill is soft, wet tissue and does not ring. Each is treated as a blade fixed at one edge, with the overtone such a blade has. The key played sets the note of the middle gill; a species with tubes is played as a row of air columns closed at the top, with overtones 3 and 5 times the lowest, and one with spines as rods, which bend as blades do. A species whose fruit has none of these is played as if it had gills. A short gill is taken to be shallower in the same proportion as it is shorter, down to seven tenths, which for a blade is an octave. What crosses the gills, and how fast, is not modelled: the crossing time is a choice.',
  scales: {
    '4k': 'No mushrooms grow at this size: what hangs under the cap is taken from the species\' recorded form and size.',
    '40k': 'Simple mushrooms grow. The gills, spines or tubes follow the species\' form.',
    '400k': 'Mushrooms in a block of soil. The gills, spines or tubes follow the species\' form.',
    '4m': 'Real-size mushrooms: the count of gills a cap of the species\' size would carry is reported for the drawing, though at most 16 sound.' },
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm`,
  params: [
    { id: 'gills', label: 'Gills', min: 2, max: 16, step: 1, value: 12, show: v => Math.round(v), trace: 'How many gills sound. A real cap has tens to hundreds.', standing: 'a sample' },
    { id: 'open', label: 'How far the cap has opened', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'As the cap opens the gills fan out and differ more in length, so their notes spread.', standing: 'assumed' },
    { id: 'second', label: 'The blade\'s second bend', min: 0, max: 1, value: .4, trace: 'A blade fixed at one edge has a second way of bending, 6.27 times higher, and a third at 17.55. For tubes these are the air column\'s overtones, 3 and 5 times. A hard key wakes them more.', standing: 'physics' },
    { id: 'short', label: 'Short gills between', min: 0, max: 1, value: 0, show: v => v ? Math.round(100 - v * 29) + '% as deep' : 'all full', trace: 'Between the full gills hang shorter ones that do not reach the stem. Every second gill is made shallower, down to seven tenths; a blade\'s note rises as one over its depth squared, so at the limit it is an octave higher.', standing: 'physics; the proportion is assumed' },
    { id: 'sweep', label: 'Time to cross the gills', min: 0, max: .4, value: .025, show: v => v ? Math.round(v * 1000) + ' ms' : 'all at once', trace: 'Whatever strikes the gills, a drop running across or a draught, reaches them one after another from one side. At zero they are all struck together.', standing: 'a choice' },
    { id: 'ring', label: 'Ring time', min: .05, max: 4, value: .9, unit: 's', trace: 'How long the gills ring.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Species', 'The fruit form decides what hangs under the cap: gills and ridges are blades, teeth and clubs are rods, and the pores of boletes and brackets are tubes.', 'from the species'], ['How hard the key is hit', 'Loudness, and how much of the blade\'s higher bends a strike wakes: a sharp knock bends a blade in more ways than a gentle one.', 'physics']]
}
