import { drawNetwork } from '../kit/kit.js'
export const def = {
  id: 'hyphal-harp', name: 'Hyphal Harp', family: 'instrument', kind: 'P', keys: true, species: 'phanerochaete-velutina',
  blurb: 'Pluck the network. Each note strikes the web of hyphae at a distance from its centre. The web is resized so its lowest mode is the key you play, and its own pattern of modes, worked out from its shape and the thickness of its cords, gives the tone.',
  assumed: 'Real hyphae are too damped to ring, so the ring time is a choice. The web is bare strings with no soil around them, reduced to at most 170 points. Resizing the web to the key played keeps its mode ratios and discards its real pitch, which is shown beside the species.',
  about: s => `${s.family} · grown ${s.grown.days} days · real lowest note ${s.stages[0].hz[0].toFixed(0)} Hz at first, ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz at the end`,
  params: [
    { id: 'stage', label: 'Stage of growth', min: 0, max: 1, value: .5, show: v => Math.round(v * 100) + '%', trace: 'Which of eight snapshots of the growing network supplies the modes. A young web is small and simple; an old one has cords and loops.', standing: 'from the model' },
    { id: 'pos', label: 'Where it is struck', min: 0, max: 1, value: .35, show: v => v < .2 ? 'centre' : v > .8 ? 'edge' : 'between', trace: 'Distance from the centre, in six rings. Each mode is driven by how much the web moves there in that mode.', standing: 'from the model' },
    { id: 'own', label: 'Its own modes', min: 0, max: 1, value: 1, show: v => Math.round(v * 100) + '%', trace: 'At 100% the overtones are the network\'s own, set by its shape and cord thickness. At 0% they are a plain string\'s.', standing: 'from the model' },
    { id: 'ring', label: 'Ring time', min: .05, max: 6, value: 1.4, unit: 's', trace: 'How long the web rings. Real hyphae are damped almost at once; the true value is near zero.', standing: 'a choice' },
    { id: 'bright', label: 'High modes ring as long', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'How much faster the higher modes die away than the lowest.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 2, value: .8, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Wave speed', 'A hypha held taut by turgor of 0.5 MPa carries waves at about 22 m/s, whatever its width.', 'research estimate'], ['Stereo', 'Two microphones at the surface; each mode is heard where it moves most.', 'from the model']],
  draw(g, w, h, { spec, params, view, t }) {
    const n = spec.stages.length - 1, st = spec.stages[Math.round(params.stage * n)], e = view ? view.energy : 0
    const box = drawNetwork(g, st, 0, 0, w * .72, h, spec.colours[0], (i, x, y) => { const d = Math.hypot(x, y); return Math.abs(d - params.pos) < .1 ? .25 + e : 0 })
    g.beginPath(); g.arc(w * .36, h / 2, Math.max(4, params.pos * box.m * box.scale), 0, 7); g.strokeStyle = 'rgba(242,201,76,.5)'; g.setLineDash([6, 8]); g.lineWidth = 2; g.stroke(); g.setLineDash([])
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText(`day ${st.days} · reaches ${st.reach_mm} mm`, 20, h - 20)
    const modes = view ? view.modes : []
    for (let i = 0; i < modes.length; i++) { g.fillStyle = `rgba(210,168,102,${.35 + .65 * e})`; g.fillRect(w * .76, h - 40 - i * (h - 80) / 16, modes[i] * w * .9, (h - 80) / 16 - 4) }
    g.fillStyle = '#a89c82'; g.fillText('modes struck', w * .76, 30)
  }
}
