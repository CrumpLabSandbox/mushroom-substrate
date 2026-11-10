import { start, drawNetwork } from '../kit/kit.js'
start({
  id: 'mycelium-reverb', name: 'Mycelium Reverb', family: 'effect', kind: 'P', input: true, species: 'serpula-lacrymans',
  blurb: 'The room is a fungus. The sound going in shakes the network and you hear the network ring. Its resonances are the modes of the web of hyphae at the stage of growth you choose; two microphones at the surface give left and right.',
  assumed: 'A real network would swallow sound, not ring: the ring time is a choice. With 48 modes this is a sparse, pitched reverb, not a smooth room. The web is bare strings with no soil around them. At its real size a few-day-old network rings in the hundreds to thousands of hertz; the size control moves that.',
  about: s => `${s.family} · real lowest note ${s.stages[0].hz[0].toFixed(0)} Hz young, ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz at ${s.grown.days} days`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '%', trace: 'Which snapshots of the growing network supply the resonances. The two nearest are cross-faded.', standing: 'from the model' },
    { id: 'size', label: 'Size of the network', min: .1, max: 4, value: 1, show: v => v == 1 ? 'real' : '×' + (1 / v).toFixed(2), trace: 'Scales every resonance. A network twice as big rings an octave lower.', standing: 'physics' },
    { id: 'ring', label: 'Ring time', min: .1, max: 10, value: 2.5, unit: 's', trace: 'How long the web rings after the sound stops. Real hyphae are damped almost at once.', standing: 'a choice' },
    { id: 'damp', label: 'High modes die sooner', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Extra damping of the higher resonances.', standing: 'a choice' },
    { id: 'mix', label: 'Network or the sound itself', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '% network', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Resonances', 'The lowest 24 modes of the network as a web of taut strings, from its shape and cord thickness.', 'from the model'], ['Left and right', 'Each mode is heard by two microphones at the surface according to where it moves.', 'from the model']],
  draw(g, w, h, { spec, params, view }) {
    const n = spec.stages.length - 1, st = spec.stages[Math.round(params.stage * n)], e = view ? view.energy : 0
    drawNetwork(g, st, 0, 0, w, h * .8, spec.colours[0], () => e * .7)
    const top = Math.min(8000, st.hz[st.hz.length - 1] * params.size * 1.1)
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`resonances, 0 to ${top.toFixed(0)} Hz`, 20, h * .84)
    for (const hz of st.hz) { const x = 20 + (hz * params.size / top) * (w - 40); g.fillStyle = `rgba(210,168,102,${.4 + .6 * e})`; g.fillRect(x, h * .87, 3, h * .1) }
  }
})
