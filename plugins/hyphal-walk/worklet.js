import { registerComposer } from '../kit/worklet-base.js'
import { create } from './dsp.js'
registerComposer('hyphal-walk', create)
