import { register } from '../kit/worklet-base.js'
import { create } from './dsp.js'
register('spike-table', create)
