export const def = {
  id: 'spike-table', name: 'Spike Table', family: 'instrument', kind: 'S', keys: true, species: 'phanerochaete-velutina',
  blurb: 'A wavetable instrument. The table is one cycle of the voltage between two electrodes at each of 64 stages of the network\'s growth. A held note scans through the table, so the tone changes the way the electrical wave changed as the fungus grew.',
  assumed: 'The model\'s voltage is used directly as the shape of the wave: this is not a vibrating body. One cycle really lasts minutes to hours. The spike recordings behind the electrical model are disputed. The tables are dark: most of their energy is in the first few harmonics.',
  about: s => `${s.wavetable.frames} frames from ${s.grown.days} days of growth · one cycle really lasts about ${s.numbers.spike_interval_min} minutes`,
  params: [
    { id: 'pos', label: 'Stage of growth', min: 0, max: 1, value: .2, show: v => Math.round(v * 100) + '%', trace: 'Where in the table the note reads: the shape the voltage had at that stage of the network\'s growth.', standing: 'from the model' },
    { id: 'sweep', label: 'Drift through growth', min: 0, max: 4, value: .15, unit: 'per s', trace: 'How fast the reading point drifts back and forth through the stages.', standing: 'a choice' },
    { id: 'depth', label: 'How far it drifts', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'How much of the table the drift covers.', standing: 'a choice' },
    { id: 'attack', label: 'Attack', min: .002, max: 2, value: .02, unit: 's', trace: 'How fast a note comes in.', standing: 'a choice' },
    { id: 'release', label: 'Release', min: .02, max: 4, value: .6, unit: 's', trace: 'How fast it dies away.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['Wave shape', 'The voltage between two electrodes over one cycle, from the engine\'s electrical model on the growing network.', 'from the model']],
  draw(g, w, h, { spec, view }) {
    const wt = spec.wavetable, F = wt.frames, cur = Math.round((view ? view.pos : 0) * (F - 1))
    for (let f = 0; f < F; f += 2) {
      const d = 1 - f / (F - 1), x0 = 30 + d * 130, y0 = h - 50 - d * (h - 130), ww = w - 200
      g.beginPath(); for (let i = 0; i <= 96; i++) { let x = 0; for (let k = 0; k < 12; k++) x += wt.amps[f][k] * Math.cos(6.2832 * (k + 1) * i / 96 + wt.phases[f][k]); g.lineTo(x0 + i / 96 * ww, y0 - x * 42) }
      const on = Math.abs(f - cur) < 2; g.strokeStyle = on ? '#f2c94c' : `rgba(233,220,188,${.15 + .45 * (1 - d)})`; g.lineWidth = on ? 4 : 1.5; g.stroke()
    }
  }
}
