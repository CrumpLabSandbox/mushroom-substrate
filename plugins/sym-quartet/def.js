export const def = {
  id: 'sym-quartet', name: 'Electrical Quartet', conductor: 'together',
  blurb: 'Four fungi whose electrical spiking has been measured or estimated, each running the same model of an excitable hypha at its own species\' pace. Nothing conducts them. The rhythm between the four is the ratio of their spike intervals: a polyrhythm set by four species.',
  assumed: 'Spike intervals of tens of minutes are brought into hearing by one shared speed-up, so the ratios between the four are kept and everything else is not. Measured intervals vary widely between recordings of the same fungus. Whether the spikes carry any message is not known. Nobody has listened to this.',
  cast: [
    { role: 'Oyster', species: 'pleurotus-ostreatus', scale: '400k', composer: 'spike-canon', instrument: 'spike-table', comp: { species: 1, octave: 0, voices: 4, trains: .5 }, strip: { target: -25, pan: -55 } },
    { role: 'Reishi', species: 'ganoderma-lingzhi', scale: '400k', composer: 'spike-canon', instrument: 'coupled-spikes', comp: { species: 1, octave: 1, voices: 3, trains: .3 }, strip: { target: -26, pan: -18 } },
    { role: 'Caterpillar fungus', species: 'cordyceps-militaris', scale: '400k', composer: 'spike-canon', instrument: 'cap-drums', comp: { species: 1, octave: 0, voices: 3 }, strip: { target: -24, pan: 18 } },
    { role: 'Ghost fungus', species: 'omphalotus-nidiformis', scale: '400k', composer: 'spike-canon', instrument: 'rhizomorph-bass', comp: { species: 1, octave: -2, voices: 2, trains: .6 }, strip: { target: -23, pan: 55 } },
  ],
  params: [
    { id: 'level', label: 'Level', min: 0, max: 2, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['The four paces', 'Each voice fires at the shared base rate times 60 minutes over its species\' spike interval (held between a tenth and twelve a second).', 'from measurements, sped up'], ['The wave', 'In each voice a spike starts at the tip and passes down a chain of excitable units; each unit it reaches sounds a note of that species\' network.', 'from the model']]
}
