// The instruments a composer can play, for the audio thread. Add an instrument here and in playable.js.
import { create as harp } from '../hyphal-harp/dsp.js'
import { create as drums } from '../cap-drums/dsp.js'
import { create as table } from '../spike-table/dsp.js'
import { create as spikes } from '../coupled-spikes/dsp.js'
import { create as bow } from '../turgor-bow/dsp.js'
import { create as bass } from '../rhizomorph-bass/dsp.js'
import { create as ring } from '../fairy-ring/dsp.js'
export const INSTRUMENTS = { 'turgor-bow': bow, 'rhizomorph-bass': bass, 'fairy-ring': ring, 'hyphal-harp': harp, 'cap-drums': drums, 'spike-table': table, 'coupled-spikes': spikes }
