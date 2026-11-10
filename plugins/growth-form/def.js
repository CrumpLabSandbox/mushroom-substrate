export const def = {
  id: 'growth-form', name: 'Growth Form', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'serpula-lacrymans',
  blurb: 'Large-scale form from a whole growth run. The species\' prebuilt run is played through as one piece. How many notes sound follows the number of growing tips, loudness follows flow, note length follows the network\'s reserve. The notes are the network\'s real modes at each stage, all moved by one fixed interval, so the register falls as the network grows.',
  assumed: 'Which of the available modes sounds at each moment is drawn at random. Attaching tips to density, flow to loudness and reserve to length is a choice of what to attach to what; the curves themselves are the model\'s.',
  about: s => `a ${s.grown.days}-day run · lowest mode ${s.stages[0].hz[0].toFixed(0)} Hz at the start, ${s.stages[s.stages.length - 1].hz[0].toFixed(0)} Hz at the end`,
  params: [
    { id: 'length', label: 'Length of the piece', min: 15, max: 600, value: 90, unit: 's', trace: 'The whole growth run is played in this time, then begins again.', standing: 'sped up' },
    { id: 'density', label: 'Notes per growing tip', min: .1, max: 4, value: 1, show: v => '×' + v.toFixed(2), trace: 'Scales how many notes the tip count produces.', standing: 'a choice' },
    { id: 'base', label: 'Where the grown network\'s lowest mode is put', min: 24, max: 60, step: 1, value: 36, show: v => 'key ' + Math.round(v), trace: 'One fixed interval moves every real mode frequency into reach. Their relations to each other are kept.', standing: 'a choice' },
    { id: 'top', label: 'Highest note allowed', min: 60, max: 120, step: 1, value: 96, show: v => 'key ' + Math.round(v), trace: 'The young network\'s modes are very high; anything above this is held here.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view }) {
    const u = view ? view.u : 0, rows = [['tips', 'growing tips: how many notes', '#e9dcbc'], ['flow', 'flow: how loud', '#58b4ee'], ['reserve', 'reserve: how long', '#f2c94c'], ['front_um', 'front radius: how wide the range', '#7fbf8b']]
    rows.forEach(([name, label, col], r) => {
      const c = spec.curves[name], m = Math.max(1e-9, ...c), y0 = 40 + r * (h - 60) / 4, hh = (h - 60) / 4 - 34
      g.beginPath(); c.forEach((v, i) => g.lineTo(20 + i / (c.length - 1) * (w - 40), y0 + hh - v / m * hh)); g.strokeStyle = col; g.lineWidth = 3; g.stroke()
      g.fillStyle = '#a89c82'; g.font = '20px system-ui'; g.fillText(label, 20, y0 - 8)
    })
    g.fillStyle = '#e08572'; g.fillRect(20 + u * (w - 40), 20, 3, h - 40)
  }
}
