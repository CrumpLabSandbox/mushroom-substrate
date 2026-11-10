export const def = {
  id: 'growth-form', name: 'Growth Form', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'serpula-lacrymans',
  blurb: 'Large-scale form from a whole growth run. The species\' prebuilt run is played through as one piece. How many notes sound follows the number of growing tips, loudness follows flow, note length follows the network\'s reserve. The notes are the network\'s real modes at each stage, all moved by one fixed interval, so the register falls as the network grows. Fusions sound as two neighbouring modes together and abandoned hyphae as a long quiet lowest mode, as often as the run had them.',
  assumed: 'A fusion as two notes and an abandonment as the lowest mode are choices; how often they come is the run\'s own count against its branching. Which of the available modes sounds at each moment is drawn at random. Attaching tips to density, flow to loudness and reserve to length is a choice of what to attach to what; the curves themselves are the model\'s.',
  about: s => `a ${s.grown.days}-day run · lowest mode ${s.stages[0].hz[0].toFixed(0)} Hz at the start, ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz at the end`,
  params: [
    { id: 'length', label: 'Length of the piece', min: 15, max: 600, value: 90, unit: 's', trace: 'The whole growth run is played in this time, then begins again.', standing: 'sped up' },
    { id: 'density', label: 'Notes per growing tip', min: .1, max: 4, value: 1, show: v => '×' + v.toFixed(2), trace: 'Scales how many notes the tip count produces.', standing: 'a choice' },
    { id: 'base', label: 'Where the grown network\'s lowest mode is put', min: 24, max: 60, step: 1, value: 36, show: v => 'key ' + Math.round(v), trace: 'One fixed interval moves every real mode frequency into reach. Their relations to each other are kept.', standing: 'a choice' },
    { id: 'top', label: 'Highest note allowed', min: 60, max: 120, step: 1, value: 96, show: v => 'key ' + Math.round(v), trace: 'The young network\'s modes are very high; anything above this is brought down by whole octaves until it fits.', standing: 'a choice' },
    { id: 'events', label: 'Fusions and abandonments heard', min: 0, max: 4, value: 1, show: v => '×' + v.toFixed(2), trace: 'For each stage the run counted branches, fusions and abandoned stretches per hour. A fusion sounds two neighbouring modes together; an abandonment sounds the lowest mode, quiet and long. Each takes the place of an ordinary note as often as it happened against branching.', standing: 'from the model' },
    { id: 'octave', label: 'Register', min: -3, max: 3, step: 1, value: 0, show: v => (v > 0 ? '+' : '') + Math.round(v) + ' octaves', trace: 'Moves every note by whole octaves. The intervals between the network\'s notes are kept.', standing: 'a choice' },
    { id: 'thin', label: 'Share of notes heard', min: .05, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'The process runs the same; only this share of its events is sounded, picked at random. For playing alongside other composers.', standing: 'a choice' },
  ],
  scales: {
    '4k': "A day or two of growth with no flow: loudness follows the front, note length the total length of hypha; fusions sound, nothing is abandoned.",
    '40k': "Flow sets loudness and reserve sets note length; abandoned stretches are heard as the colony prunes itself.",
    '400k': "The same form from a run in a block of soil.",
    '4m': "Years of growth in one piece, with a new individual founded a third and two-thirds of the way through, each playing the modes of its own age.",
  }
}
