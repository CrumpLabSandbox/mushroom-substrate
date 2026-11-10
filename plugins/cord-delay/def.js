import { drawNetwork } from '../kit/kit.js'
export const def = {
  id: 'cord-delay', name: 'Cord Delay', family: 'effect', kind: 'P', input: true, species: 'armillaria-gallica',
  blurb: 'Echoes that travel the cords. The six stretches of the network that hold the most material become six delay lines, each as long as the time to travel its stretch. Where one cord meets another of different thickness, part of a wave turns back: that reflection decides how much each line feeds the others.',
  assumed: 'A real pressure wave in a hypha dies out within a millimetre or so, so there are no echoes in life. The travel time per millimetre is set by ear; at the real wave speed of about 22 metres per second it would be 0.05 milliseconds. Reflection is taken from thickness alone.',
  about: s => `${s.family} · cords up to ${s.numbers.cord_max} hyphae thick · material really moves at about ${(s.numbers.transport_um_h / 1000).toFixed(0)} mm an hour`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .8, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the cords. Older networks have longer, thicker ones.', standing: 'from the model' },
    { id: 'time', label: 'Travel time', min: 1, max: 400, value: 12, unit: 'ms per mm', trace: 'How long a wave takes to cover a millimetre of cord. This sets every echo from the cords\' real lengths.', standing: 'slowed down' },
    { id: 'feedback', label: 'How much turns back', min: 0, max: .97, value: .7, trace: 'Scales the reflection at each junction, which itself comes from the change in thickness there.', standing: 'from the model' },
    { id: 'damp', label: 'Loss along the cord', min: 0, max: 1, value: .4, show: v => Math.round(v * 100) + '%', trace: 'High frequencies are lost each time round, as a wave in a soft tube would lose them.', standing: 'assumed' },
    { id: 'mix', label: 'Cords or the sound itself', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '% cords', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, params, view }) {
    const n = spec.stages.length - 1, st = spec.stages[Math.min(n, Math.floor(params.stage * n))]
    drawNetwork(g, st, 0, 0, w, h * .76, spec.colours[0], () => (view ? view.energy : 0) * .5)
    if (!view) return
    g.font = '20px system-ui'; view.ms.forEach((ms, k) => { g.fillStyle = '#d2a866'; g.fillRect(20, h * .78 + k * 24, Math.min(w - 260, ms / Math.max(...view.ms) * (w - 260)), 12); g.fillStyle = '#a89c82'; g.fillText(`${view.mm[k].toFixed(2)} mm · ${ms.toFixed(0)} ms`, w - 230, h * .78 + k * 24 + 12) })
  }
}
