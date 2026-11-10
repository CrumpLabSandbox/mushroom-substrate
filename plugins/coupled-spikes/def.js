export const def = {
  id: 'coupled-spikes', name: 'Coupled Spikes', family: 'instrument', kind: 'S', keys: true, species: 'schizophyllum-commune',
  blurb: 'The electrical model itself as the oscillator. Each note is a small ring of excitable units, the model the engines use for spiking, run fast enough to be heard and tuned so one cycle is the note. The units pull on their neighbours as stretches of hypha do. How hard they are driven, how unequal that is and how strongly they are coupled are the model\'s own settings, and here they are the timbre.',
  assumed: 'This is the model running live at audio rate, not a recording, and the spike measurements it stands for are disputed. Real spikes take minutes to hours. With unequal drive the units run at slightly different rates, so the pitch can sit a little off the key played.',
  about: s => `in the recordings ${s.name} spikes about every ${s.numbers.spike_interval_min} minutes: a note at 220 Hz is that, ${(220 * s.numbers.spike_interval_min * 60 / 1e6).toFixed(1)} million times faster`,
  params: [
    { id: 'units', label: 'Units in the ring', min: 1, max: 6, step: 1, value: 4, show: v => Math.round(v), trace: 'How many stretches of hypha are modelled, joined in a ring and spread left to right.', standing: 'a choice' },
    { id: 'drive', label: 'Drive', min: .36, max: 1.3, value: .6, trace: 'How hard the units are pushed. In the engines, growing tips are driven hardest. It changes the wave\'s shape between slow build and sharp spike.', standing: 'model constant' },
    { id: 'spread', label: 'Unequal drive', min: 0, max: 1, value: .3, show: v => Math.round(v * 100) + '%', trace: 'How different the units\' drives are. Unequal units beat against each other.', standing: 'from the model' },
    { id: 'coupling', label: 'Coupling', min: 0, max: .5, value: .1, trace: 'How strongly each unit pulls on its neighbours. Strong coupling locks them together; weak coupling lets them drift.', standing: 'model constant' },
    { id: 'attack', label: 'Attack', min: .002, max: 2, value: .01, unit: 's', trace: 'How fast a note comes in.', standing: 'a choice' },
    { id: 'release', label: 'Release', min: .02, max: 4, value: .5, unit: 's', trace: 'How fast it dies away.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { view }) {
    const v = view ? view.v : [], N = v.length, cx = w / 2, cy = h / 2, r = Math.min(w, h) * .3
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.strokeStyle = '#6d665a'; g.lineWidth = 6; g.stroke()
    for (let k = 0; k < N; k++) { const a = k / N * 6.2832 - 1.5708, e = (v[k] + 2.2) / 4.4; g.beginPath(); g.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 14 + e * 34, 0, 7); g.fillStyle = `rgb(${90 + e * 150},${80 + e * 120},${60 + e * 20})`; g.fill() }
    if (!N) { g.fillStyle = '#a89c82'; g.font = '24px system-ui'; g.fillText('Play a note', 30, 50) }
  }
}
