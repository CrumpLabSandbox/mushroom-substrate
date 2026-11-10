export const def = {
  id: 'cap-drums', name: 'Cap Drums', family: 'instrument', kind: 'P', keys: true, lowKey: 36, species: 'amanita-muscaria',
  blurb: 'Each key is a mushroom cap of a different size, struck by a raindrop. A cap is treated as a small plate: the bigger it is, the lower it sounds. The species\' fruit form sets the overtones, so a flat cap, a shelf, a cup and a ball each ring differently. How hard you hit a key is the size of the drop: a big drop is louder but lands more slowly, so it is a little duller. Each drop leaves water behind, so a cap played often gets wetter, lower and deader, and dries when left alone. A young cap can be played as a closed button that opens out.',
  assumed: 'A cap\'s lowest note is put at 90 Hz for a 3 cm radius, rising as the cap gets smaller: an estimate from one research report. The overtone sets are textbook shapes standing in for each form. Real caps are soft and barely ring, so the ring time is a choice. Drops are 1 to 5 mm across at their terminal speed, and each pushes on the cap for the time it takes to fall its own width; loudness follows how hard the key is hit, not the drop\'s true momentum, which would vary far more. How much water a drop leaves and the six seconds a cap takes to dry are choices. A closed button is given the overtones used for ball-shaped fruit, and opening moves them to the species\' own form in a straight line.',
  scales: {
    '4k': 'No mushrooms grow at this size. The caps are worked out from the species\' recorded size and form, and are always fully open.',
    '40k': 'Simple mushrooms grow, but there is no weather: the rain is whatever you play.',
    '400k': 'Mushrooms and weather: caps of the species\' form, wetted by the drops you play.',
    '4m': 'Real-size mushrooms on a plot. The species\' own cap size is reported so the drawing can mark its key.' },
  about: s => `${s.fruit.form}, ${s.fruit.size_cm.join(' to ')} cm across in life · a real cap of this species sounds near ${s.cap.lowest_hz.toFixed(0)} Hz · a key an octave higher is a cap half the size`,
  params: [
    { id: 'ring', label: 'Ring time', min: .03, max: 3, value: .6, unit: 's', trace: 'How long a struck cap rings. Real caps are damped almost at once.', standing: 'a choice' },
    { id: 'wet', label: 'How wet the cap is', min: 0, max: 1, value: .15, show: v => Math.round(v * 100) + '%', trace: 'A soaked cap carries water: it is heavier, so up to 6% lower, and more damped.', standing: 'assumed' },
    { id: 'soak', label: 'Water each drop leaves', min: 0, max: 1, value: .25, show: v => Math.round(v * 100) + '%', trace: 'Each drop adds to the wetness of the cap it hits, a big drop more. The water dries away over about six seconds, so a cap played often goes lower and deader and then recovers.', standing: 'assumed' },
    { id: 'open', label: 'How far the cap has opened', min: 0, max: 1, value: 1, needs: 'fruit', show: v => v < .1 ? 'button' : v > .9 ? 'open' : Math.round(v * 100) + '%', trace: 'A young cap is a closed button, close to a ball. As it expands it takes the species\' own form, and its overtones move from a ball\'s to that form\'s.', standing: 'assumed' },
    { id: 'pos', label: 'Where the drop lands', min: 0, max: 1, value: .3, show: v => v < .2 ? 'centre' : v > .8 ? 'rim' : 'between', trace: 'A hit at the centre wakes different overtones from a hit at the rim.', standing: 'physics, simplified' },
    { id: 'level', label: 'Level', min: 0, max: 3, value: 1, trace: 'Loudness only.', standing: 'a choice' },
  ],
  traces: [['How hard the key is hit', 'The size of the drop, 1 to 5 mm. A bigger drop is louder, takes longer to land (its width divided by its fall speed, a quarter to half a millisecond), and so wakes the high overtones less.', 'physics; loudness is a choice'], ['Pitch', 'The key sets the cap\'s size: its lowest note rises as 1 ÷ radius.', 'research estimate'], ['Overtones', 'From the species\' fruit form: plate, beam, bowl or ball.', 'assumed']]
}
