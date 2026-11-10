// The instruments a composer can play, for the audio thread. Add an instrument here and in playable.js.
import { create as harp } from '../hyphal-harp/dsp.js'
import { create as drums } from '../cap-drums/dsp.js'
import { create as table } from '../spike-table/dsp.js'
import { create as spikes } from '../coupled-spikes/dsp.js'
export const INSTRUMENTS = { 'hyphal-harp': harp, 'cap-drums': drums, 'spike-table': table, 'coupled-spikes': spikes }
