// The composers a symphony can use, for the audio thread. Each is create(sampleRate) ->
// { load, set, advance(frames) -> note events, release, view }.
import { create as canon } from '../spike-canon/dsp.js'
import { create as walk } from '../hyphal-walk/dsp.js'
import { create as chorus } from '../tip-chorus/dsp.js'
import { create as form } from '../growth-form/dsp.js'
import { create as season } from '../season-cycle/dsp.js'
import { create as scatter } from '../spore-scatter/dsp.js'
export const COMPOSERS = { 'spike-canon': canon, 'hyphal-walk': walk, 'tip-chorus': chorus, 'growth-form': form, 'season-cycle': season, 'spore-scatter': scatter }
export const COMPOSER_NAMES = { 'spike-canon': 'Spike Canon', 'hyphal-walk': 'Hyphal Walk', 'tip-chorus': 'Tip Chorus', 'growth-form': 'Growth Form', 'season-cycle': 'Season Cycle', 'spore-scatter': 'Spore Scatter' }
export const INSTRUMENT_NAMES = { 'hyphal-harp': 'Hyphal Harp', 'cap-drums': 'Cap Drums', 'spike-table': 'Spike Table', 'coupled-spikes': 'Coupled Spikes', 'turgor-bow': 'Turgor Bow', 'rhizomorph-bass': 'Rhizomorph Bass', 'fairy-ring': 'Fairy Ring', 'gill-comb': 'Gill Comb' }
