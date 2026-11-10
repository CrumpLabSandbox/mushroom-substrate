export const def = {
  id: 'mycelium-reverb', name: 'Mycelium Reverb', family: 'effect', kind: 'P', input: true, species: 'serpula-lacrymans',
  blurb: 'The room is a fungus. The sound going in shakes the network and you hear the network ring. Its resonances are the modes of the web of hyphae at the stage of growth you choose; two microphones at the surface give left and right. You choose where on the web the sound enters, from the centre to the growing edge, and the network can be left to grow while you listen.',
  assumed: 'A real network would swallow sound, not ring: the ring time is a choice. With 48 modes this is a sparse, pitched reverb, not a smooth room. The web is bare strings with no soil around them. At its real size a few-day-old network rings in the hundreds to thousands of hertz; the size control moves that. Growth while you listen replays the stored stages of one run, sped up by a very large factor; when it is full grown a new young network takes over, which is a choice. If a mode sits on a note of the incoming sound and rings above full scale, the network is turned down until it settles. Networks from the smallest and largest simulators are resized by whole octaves so they can be heard, and the page says by how much.',
  scales: {
    '4k': 'A network about a centimetre across whose real notes are near the top of hearing; it is made bigger by whole octaves, and the factor is stated.',
    '40k': 'The flat colony of that simulator at its real size, cords included in its modes.',
    '400k': 'The network from the block of soil at its real size.',
    '4m': 'A network metres across and years old whose real notes are below hearing; it is made smaller by whole octaves, and the factor is stated. Growth while you listen covers years.',
  },
  about: s => `${s.family} · real lowest note ${s.stages[0].hz[0].toFixed(0)} Hz young, ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz at ${s.grown.days} days`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '%', trace: 'Which snapshots of the growing network supply the resonances. The two nearest are cross-faded.', standing: 'from the model' },
    { id: 'size', label: 'Size of the network', min: .1, max: 4, value: 1, show: v => v == 1 ? 'real' : '×' + (1 / v).toFixed(2), trace: 'Scales every resonance. A network twice as big rings an octave lower.', standing: 'physics' },
    { id: 'ring', label: 'Ring time', min: .1, max: 10, value: 2.5, unit: 's', trace: 'How long the web rings after the sound stops. Real hyphae are damped almost at once.', standing: 'a choice' },
    { id: 'damp', label: 'High modes die sooner', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Extra damping of the higher resonances.', standing: 'a choice' },
    { id: 'where', label: 'Where the sound enters', min: 0, max: 1, value: .4, show: v => v < .2 ? 'at the centre' : v > .8 ? 'at the growing edge' : Math.round(v * 100) + '% of the way out', trace: 'The web is divided into six rings from the centre to the edge. Each mode is driven by how much it moves in the ring where the sound enters, so the old centre and the young edge wake different resonances.', standing: 'from the model' },
    { id: 'grow', label: 'Growth while you listen', min: 0, max: 120, value: 0, show: v => v < .5 ? 'held' : 'whole run in ' + Math.round(v) + ' s', trace: 'Moves through the stored stages of the run on its own, from a young network to the full-grown one, so the resonances fall as the web spreads. Starts from the stage set above.', standing: 'sped up' },
    { id: 'mix', label: 'Network or the sound itself', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '% network', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Resonances', 'The lowest 24 modes of the network as a web of taut strings, from its shape and cord thickness.', 'from the model'], ['Left and right', 'Each mode is heard by two microphones at the surface according to where it moves.', 'from the model'], ['Size of simulator', 'If the full-grown network\'s lowest note is outside 100 to 1000 Hz, the whole web is resized by whole octaves until it is inside.', 'a choice, stated on the page']]
}
