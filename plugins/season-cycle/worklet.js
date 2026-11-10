import { registerComposer } from '../kit/worklet-base.js'
import { create } from './dsp.js'
registerComposer('season-cycle', create)
