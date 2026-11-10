import { def as floor } from '../forest-floor/def.js'
export const def = {
  ...floor, id: 'foraging', name: 'Foraging', species: 'phanerochaete-velutina', live: { speed: 'speed', rain: 'rain', world: 1 },
  blurb: 'A cord-former searching soil for wood, live. As Forest Floor, with one more force: material moving through thick cords pushes on them, a steady push that only the web\'s lowest modes answer. While the fungus explores with thin hyphae this is silent. When it finds buried wood and the route to it thickens into cords carrying flow, a low tone swells under the strikes.',
  assumed: 'That flow through a cord pushes on it steadily enough to sound is an assumption: real flow is slow and smooth. Everything assumed in Forest Floor applies here too. Finding wood is by chance, as in the simulator. At a size with no flow the low tone follows the number of growing tips, which is a stand-in, not the same thing.',
  about: s => `${s.family} · buried wood in soil · cords up to ${s.numbers.cord_max} hyphae thick`,
  traces: [...floor.traces, ['The low tone', 'Flow from the centre and the number of thick cord pieces, both from the live simulator, set how hard the lowest four modes are pushed.', 'from the model, with an assumed link']],
  scales: { '4k': 'No flow and no cords at this size, so the low tone follows the number of growing tips. No mushrooms, no rain; the web\'s notes are lowered by whole octaves.', '40k': 'The size foraging belongs to: flow, thickening cords and die-back in a flat colony. The low tone is flow through cords.', '400k': 'The same in a block of soil, with rain and wet ground.', '4m': 'A plot metres across: the web\'s notes are raised by whole octaves; cords carry flow over metres, spores leave and found new individuals.' }
}
