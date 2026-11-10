export const def = {
  id: 'spike-canon', name: 'Spike Canon', family: 'composer', kind: 'S', composer: true, instrument: 'hyphal-harp', species: 'schizophyllum-commune',
  blurb: 'Rhythm and counterpoint from electrical activity. A short chain of excitable units, the model the engines use for spiking, runs live. The unit at the growing tip fires on its own; the ones behind it fire only when the wave reaches them. Each firing is a note, so the voices follow one another down the hypha like a canon.',
  assumed: 'The spike recordings behind this model are disputed, and no one has measured a spike travelling along a hypha. Real spikes come minutes to hours apart; here the rate is set by ear. Each unit\'s note is one of the network\'s own modes, which is a choice of what to attach to what.',
  about: s => `${s.name} spikes about every ${s.numbers.spike_interval_min} minutes in the recordings · the notes are this network's own`,
  params: [
    { id: 'voices', label: 'Units along the hypha', min: 2, max: 8, step: 1, value: 5, show: v => Math.round(v), trace: 'How many stretches of hypha are modelled, tip first. Each is a voice.', standing: 'a choice' },
    { id: 'rate', label: 'Spike rate at the tip', min: .2, max: 8, value: 1.4, unit: 'per s', trace: 'How often the driven tip unit fires. In life this is the species\' spike interval; here it is sped up.', standing: 'sped up' },
    { id: 'coupling', label: 'Coupling along the hypha', min: 0, max: .4, value: .14, trace: 'How strongly each unit pulls on its neighbours. Too weak and the wave dies before it reaches the far end.', standing: 'model constant' },
    { id: 'spread', label: 'How much harder the tip is driven', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Growing tips are the pacemakers. At 0% no unit fires by itself; at 100% several do, and the canon breaks into cross-rhythm.', standing: 'from the model' },
    { id: 'recovery', label: 'Recovery', min: .03, max: .2, value: .08, trace: 'How fast a unit can fire again. Slower recovery makes units skip beats.', standing: 'model constant' },
    { id: 'stage', label: 'Stage of growth for the notes', min: 0, max: 1, value: .6, show: v => Math.round(v * 100) + '%', trace: 'Which snapshot of the network supplies the notes: unit k plays the network\'s k-th mode.', standing: 'from the model' },
    { id: 'base', label: 'Lowest note', min: 24, max: 72, step: 1, value: 48, show: v => 'key ' + Math.round(v), trace: 'Where the network\'s lowest mode is put. Everything else follows from its ratios.', standing: 'a choice' },
    { id: 'length', label: 'Note length', min: .05, max: 2, value: .4, unit: 's', trace: 'How long each note is held.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    if (!view) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Turn sound on to start', 30, 50); return }
    const N = view.v.length
    for (let k = 0; k < N; k++) {
      const x = 80 + k * (w - 160) / Math.max(1, N - 1), y = h * .5 - view.v[k] * h * .14, a = view.lit[k]
      if (k) { const px = 80 + (k - 1) * (w - 160) / (N - 1), py = h * .5 - view.v[k - 1] * h * .14; g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.strokeStyle = '#6d665a'; g.lineWidth = 6; g.stroke() }
      g.beginPath(); g.arc(x, y, 14 + a * 22, 0, 7); g.fillStyle = `rgb(${210 + a * 32},${168 + a * 33},${102 - a * 26})`; g.fill()
      g.fillStyle = '#a89c82'; g.font = '20px system-ui'; g.fillText(k ? '' : 'tip', x - 14, h * .82); g.fillText('+' + view.pitch[k].toFixed(1), x - 22, h * .9)
    }
    g.fillText('semitones above the lowest note', 80, h * .96)
  }
}
