export const def = {
  id: 'cord-delay', name: 'Cord Delay', family: 'effect', kind: 'P', input: true, species: 'armillaria-gallica',
  blurb: 'Echoes that travel the cords. The six stretches of the network that hold the most material become six delay lines, each as long as the time to travel its stretch. Where one cord meets another of different thickness, part of a wave turns back: that reflection decides how much each line feeds the others. Each echo sits left to right where its cord really lies, thick cords keep more of the high sound, and a species that moves material faster gives quicker echoes.',
  assumed: 'A real pressure wave in a hypha dies out within a millimetre or so, so there are no echoes in life. The travel time per millimetre is set by ear; at the real wave speed of about 22 metres per second it would be 0.05 milliseconds. Reflection is taken from thickness alone. That a wave travels faster in a species whose cords carry material faster is assumed, not measured, and so is the rule that a thick cord loses less high sound than a thin one. When a setting changes, each echo glides to its new time, which bends its pitch for a moment.',
  scales: {
    '4k': 'No cords at this size: the six longest stretches of single hyphae, all one thickness, so echoes differ by length and place only.',
    '40k': 'The cords of the flat colony, with their real thickness and place.',
    '400k': 'The cords of the network in the block of soil; species that form no cords give six equal hyphae.',
    '4m': 'Cords metres long: the wave is taken ten or more times faster so the echoes fit in three seconds, and the page says by how much.',
  },
  about: s => `${s.family} · cords up to ${s.numbers.cord_max} hyphae thick · material really moves at about ${(s.numbers.transport_um_h / 1000).toFixed(0)} mm an hour`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .8, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the cords. Older networks have longer, thicker ones.', standing: 'from the model' },
    { id: 'time', label: 'Travel time', min: 1, max: 400, value: 12, unit: 'ms per mm', trace: 'How long a wave takes to cover a millimetre of cord. This sets every echo from the cords\' real lengths.', standing: 'slowed down' },
    { id: 'feedback', label: 'How much turns back', min: 0, max: .97, value: .7, trace: 'Scales the reflection at each junction, which itself comes from the change in thickness there.', standing: 'from the model' },
    { id: 'damp', label: 'Loss along the cord', min: 0, max: 1, value: .4, show: v => Math.round(v * 100) + '%', trace: 'High frequencies are lost each time round, as a wave in a soft tube would lose them. A thick cord loses less than a thin one.', standing: 'assumed' },
    { id: 'thicken', label: 'How much the cords have thickened', min: 0, max: 2, value: 1, needs: 'cords', show: v => v < .05 ? 'not at all' : v == 1 ? 'as grown' : '×' + v.toFixed(2), trace: 'Cords thicken where material flows through them. This raises or lowers every cross-section as a power, from all alike to twice as contrasted as grown, which changes which cords are chosen, how much turns back between them and how bright each echo stays.', standing: 'from the model, exaggerated by choice' },
    { id: 'own', label: 'Species\' own speed', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'Species move material along their cords at 10 to 20 mm an hour. The wave is taken faster in the same proportion, measured against 14 mm an hour, so a fast species gives quicker echoes.', standing: 'assumed' },
    { id: 'mix', label: 'Cords or the sound itself', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '% cords', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ]
}
