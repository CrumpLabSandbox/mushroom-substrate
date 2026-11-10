export const def = {
  id: 'spore-granulator', name: 'Spore Granulator', family: 'effect', kind: 'M', input: true, species: 'amanita-muscaria',
  blurb: 'Your sound, thrown like spores. The sound going in is kept for two seconds. Grains of it are launched at a steady rate. Each grain lasts a spore\'s flight time, and how far back in the kept sound it is taken from follows the rule for how far spores land: most from just now, a few from long ago. Wind pushes grains to one side.',
  assumed: 'This is an ordinary granular effect whose settings are driven by spore numbers: the model moves the controls, it does not make the sound. A real spore flies for well under a millisecond over a millimetre or two; times and distances here are stretched to be heard. The species menu changes nothing yet.',
  about: () => 'launch rate, flight time and landing distance follow the spore discharge figures',
  params: [
    { id: 'rate', label: 'Grains launched', min: 1, max: 200, value: 30, unit: 'per s', trace: 'A real cap launches about 30,000 spores a second; this is a thousandth of that.', standing: 'sourced, scaled' },
    { id: 'speed', label: 'Launch speed', min: .1, max: 1.8, value: 1, unit: 'm/s', trace: 'Measured launch speeds are 0.1 to 1.8 m/s. A faster launch flies longer, so the grain is longer.', standing: 'sourced' },
    { id: 'reach', label: 'Middling landing distance', min: .005, max: .6, value: .08, unit: 's back', trace: 'Half the grains come from more recently than this. On the ground the engine uses 8 cm.', standing: 'from the model' },
    { id: 'wind', label: 'Wind', min: -1, max: 1, value: 0, show: v => v < -.05 ? 'to the left' : v > .05 ? 'to the right' : 'still', trace: 'Pushes the grains to one side.', standing: 'a choice' },
    { id: 'mix', label: 'Grains or the sound itself', min: 0, max: 1, value: .7, show: v => Math.round(v * 100) + '% grains', trace: 'Balance only.', standing: 'a choice' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  draw(g, w, h, { spec, view }) {
    g.beginPath(); g.ellipse(w / 2, h * .25, 90, 34, 0, 0, 7); g.fillStyle = spec.colours[1]; g.fill(); g.fillStyle = spec.colours[2]; g.fillRect(w / 2 - 10, h * .25, 20, h * .5)
    if (!view) return
    for (const [back, pan] of view.seen) { g.beginPath(); g.arc(60 + pan * (w - 120), h * .32 + Math.min(1, back / .6) * h * .55, 5, 0, 7); g.fillStyle = 'rgba(233,220,188,.7)'; g.fill() }
    g.fillStyle = '#a89c82'; g.font = '22px system-ui'; g.fillText('further down: taken from longer ago', 20, h - 16)
  }
}
