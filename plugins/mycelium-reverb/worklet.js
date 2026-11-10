import { register } from '../kit/worklet-base.js'
import { create } from './dsp.js'
register('mycelium-reverb', create)
