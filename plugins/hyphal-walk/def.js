import { drawNetwork } from '../kit/kit.js'
export const def = {
  id: 'hyphal-walk', name: 'Hyphal Walk', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'phanerochaete-velutina',
  blurb: 'Melody from the shape of the network. Walkers travel it the way material moves through it, hop by hop along the hyphae, preferring the thicker cord at each junction. Every stop is a note: further from the centre is higher, a longer stretch is a longer note, a thicker cord is louder. A dead end is a rest, then the walker begins again from the centre.',
  assumed: 'Material in a real network does not move as a single walker, and it flows both ways at once. Tying pitch to distance from the centre is a choice; the notes themselves are the network\'s own modes.',
  about: s => `${s.family} · cords up to ${s.numbers.cord_max} hyphae thick · grown ${s.grown.days} days`,
  params: [
    { id: 'speed', label: 'Travel speed', min: .5, max: 16, value: 4, unit: 'stretches per s', trace: 'How fast a walker covers a stretch of average length. In life transport runs at millimetres to centimetres an hour.', standing: 'sped up' },
    { id: 'bias', label: 'Preference for thick cords', min: 0, max: 3, value: 1, trace: 'At a junction the odds of each way out go as cord thickness to this power. At 0 every way is equally likely; high values keep to the trunk routes.', standing: 'from the model' },
    { id: 'walkers', label: 'Walkers', min: 1, max: 4, step: 1, value: 2, show: v => Math.round(v), trace: 'How many travel at once. Each is a voice.', standing: 'a choice' },
    { id: 'rest', label: 'Rest at a dead end', min: 0, max: 3, value: .6, unit: 's', trace: 'A tip is a dead end. The phrase ends there and a new one starts from the centre.', standing: 'a choice' },
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network is walked. A young one gives short phrases; an old one, long routes along cords.', standing: 'from the model' },
    { id: 'base', label: 'Lowest note', min: 24, max: 72, step: 1, value: 48, show: v => 'key ' + Math.round(v), trace: 'Where the centre of the network is put.', standing: 'a choice' },
    { id: 'hold', label: 'How much of each stretch sounds', min: .1, max: 2, value: 1, show: v => Math.round(v * 100) + '%', trace: 'Note length as a share of the time taken to travel the stretch.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, params, view }) {
    const n = spec.stages.length - 1, st = spec.stages[Math.min(n, Math.floor(params.stage * n))], at = view ? view.at : []
    drawNetwork(g, st, 0, 0, w, h, spec.colours[0], i => at.includes(i) ? 1 : 0)
  }
}
