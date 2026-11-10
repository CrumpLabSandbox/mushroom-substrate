export const def = {
  id: 'sym-succession', name: 'Succession on a Log', conductor: 'sequence',
  blurb: 'A fallen log is not rotted by one fungus but by a sequence of them. Pioneers arrive on the fresh wood, early decay fungi push them out, then the cord-formers come up from the soil and take what is left. Five species play in that order, each a composer on its own instrument, each giving way to the one that replaces it. The console dips each voice as its successor arrives.',
  assumed: 'The order of arrival follows the published picture of succession on beech (pioneers, then early and late decay fungi, then cord-formers), but which species here stand for which stage is my choice, and real succession takes years and varies from log to log. The handover is done with loudness alone. Nobody has listened to this.',
  where: x => ['fresh wood: pioneers', 'early decay', 'brown rot sets in', 'cords arrive from the soil', 'the last of the log'][Math.min(4, x * 5 | 0)],
  cast: [
    { role: 'Pioneer', species: 'schizophyllum-commune', scale: '4k', composer: 'tip-chorus', instrument: 'hyphal-harp', at: .1, comp: { thin: .5, octave: 1 }, strip: { target: -25, pan: -55, duck_by: 2 } },
    { role: 'Early decay', species: 'trametes-versicolor', scale: '40k', composer: 'hyphal-walk', instrument: 'turgor-bow', at: .3, comp: { thin: .8 }, strip: { target: -24, pan: -25, duck_by: 3 } },
    { role: 'Brown rot', species: 'fomitopsis-pinicola', scale: '400k', composer: 'growth-form', instrument: 'gill-comb', at: .5, comp: { thin: .35, length: 60 }, strip: { target: -25, pan: 10, duck_by: 4 } },
    { role: 'Cord-former', species: 'hypholoma-fasciculare', scale: '400k', composer: 'spike-canon', instrument: 'spike-table', at: .72, comp: { octave: -1, rate: .8 }, strip: { target: -24, pan: 35, duck_by: 5 } },
    { role: 'Last', species: 'phanerochaete-velutina', scale: '4m', composer: 'season-cycle', instrument: 'rhizomorph-bass', at: .92, comp: { octave: 0 }, strip: { target: -22, pan: 0 } },
  ],
  params: [
    { id: 'length', label: 'How long the log lasts', min: 30, max: 900, value: 180, unit: 's', show: v => v.toFixed(0), trace: 'One pass from fresh wood to the last of it. A real beech log takes ten to forty years.', standing: 'sped up' },
    { id: 'pos', label: 'Where in the succession', min: -1, max: 1, value: -1, show: v => v < 0 ? 'moving by itself' : Math.round(v * 100) + '%', trace: 'Hold the log at one moment of its decay, or let it run.', standing: 'a choice' },
    { id: 'overlap', label: 'How long species share the wood', min: .3, max: 3, value: 1, show: v => '×' + v.toFixed(1), trace: 'How long an earlier fungus persists beside the one replacing it. Replacement at a meeting can take months.', standing: 'a choice' },
  ],
  traces: [['The order', 'Pioneers, early decay, later decay, cord-formers: the published sequence on fallen beech (docs/research).', 'from the literature; the casting is a choice'], ['Each voice', 'A composer plays the network of its own species, grown at the size of simulator shown under its name.', 'from the model'], ['The dip', 'Where two individuals meet, the stronger replaces the weaker: each strip is turned down while its successor sounds.', 'a choice of how to hear it']]
}
