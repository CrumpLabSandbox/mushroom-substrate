// The atmospheres and the effects, for the audio thread of a plugin that holds several at once.
import { create as rain } from '../rain-on-caps/dsp.js'
import { create as cloud } from '../spore-cloud/dsp.js'
import { create as chord } from '../spike-chord/dsp.js'
import { create as decay } from '../decay/dsp.js'
import { create as after } from '../after-rain/dsp.js'
import { create as floor } from '../forest-floor/dsp.js'
import { create as forage } from '../foraging/dsp.js'
import { create as reverb } from '../mycelium-reverb/dsp.js'
import { create as delay } from '../cord-delay/dsp.js'
import { create as gate } from '../excitable-gate/dsp.js'
import { create as grains } from '../spore-granulator/dsp.js'
import { create as rot } from '../rot-filter/dsp.js'
import { create as soil } from '../soil-filter/dsp.js'
export const ATMOSPHERES = { 'rain-on-caps': rain, 'spore-cloud': cloud, 'spike-chord': chord, 'decay': decay, 'after-rain': after, 'forest-floor': floor, 'foraging': forage }
export const EFFECTS = { 'mycelium-reverb': reverb, 'cord-delay': delay, 'excitable-gate': gate, 'spore-granulator': grains, 'rot-filter': rot, 'soil-filter': soil }
