import { registerComposer } from '../kit/worklet-base.js'
import { create } from './dsp.js'
registerComposer('spore-scatter', create)
