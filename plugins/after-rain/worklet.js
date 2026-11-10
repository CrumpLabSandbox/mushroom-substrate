import { register } from '../kit/worklet-base.js'
import { create } from './dsp.js'
register('after-rain', create)
