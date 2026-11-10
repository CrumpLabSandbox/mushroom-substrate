import { register } from '../kit/worklet-base.js'
import { create } from './dsp.js'
register('coupled-spikes', create)
