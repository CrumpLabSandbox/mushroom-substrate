// A stem console: up to eight stereo stems, each with a strip, summed into a master. It is a small stand-in for
// SynthLand's Stem Console (plugins/stem-console there), written here because that plugin lives in a private
// repository. It implements part of it and uses the same control names and the same layout of meter readings for
// that part, so the real console can take its place when these pieces move into SynthLand.
//   strip k (1..8):  sK.trim dB, sK.pan %, sK.width %, sK.hpf Hz, sK.lpf Hz, sK.ride 0/1, sK.target LUFS,
//                    sK.range dB, sK.gate LUFS, sK.duck_by (0 none, else a stem number), sK.duck_depth dB,
//                    sK.duck_threshold LUFS, sK.fader dB, sK.mute 0/1
//   master:          master.ride 0/1, master.target LUFS, master.range dB, glue.on 0/1, glue.threshold dB,
//                    glue.ratio, out.ceiling dB, out.level dB
// Not here: the four-band strip EQ, strip compressor, bass mono, the master's dynamic EQ and soft clip, and
// true-peak detection (the limiter here works on sample peaks with 5 ms of look-ahead). Loudness is measured
// after an approximate K-weighting (a high shelf and a low cut), not the exact BS.1770 filter.
const dB = v => Math.pow(10, v / 20), toDb = v => 20 * Math.log10(Math.max(v, 1e-9)), lufs = ms => -0.691 + 10 * Math.log10(Math.max(ms, 1e-12))
// a biquad as five numbers and two states per channel
const biquad = (type, sr, hz, q, gain) => {
  const w = 2 * Math.PI * Math.min(hz, sr * .45) / sr, c = Math.cos(w), s = Math.sin(w), al = s / (2 * q), A = Math.pow(10, (gain || 0) / 40); let b0, b1, b2, a0, a1, a2
  if (type == 'hp') { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al }
  else if (type == 'lp') { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; a0 = 1 + al; a1 = -2 * c; a2 = 1 - al }
  else { const r = 2 * Math.sqrt(A) * al; b0 = A * (A + 1 + (A - 1) * c + r); b1 = -2 * A * (A - 1 + (A + 1) * c); b2 = A * (A + 1 + (A - 1) * c - r); a0 = A + 1 - (A - 1) * c + r; a1 = 2 * (A - 1 - (A + 1) * c); a2 = A + 1 - (A - 1) * c - r } // high shelf
  return [b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0]
}
class Filt { constructor() { this.k = null; this.z = new Float64Array(4) } run(x, ch) { const k = this.k; if (!k) return x; const o = ch * 2, y = k[0] * x + this.z[o]; this.z[o] = k[1] * x - k[3] * y + this.z[o + 1]; this.z[o + 1] = k[2] * x - k[4] * y; return y } }
// loudness of a stereo signal: K-weighted mean square over a window, by a one-pole average
class Meter {
  constructor(sr, seconds) { this.a = 1 - Math.exp(-1 / (seconds * sr)); this.ms = 0; this.sh = new Filt(); this.hp = new Filt(); this.sh.k = biquad('hs', sr, 1500, .707, 4); this.hp.k = biquad('hp', sr, 38, .5) }
  push(l, r) { const a = this.hp.run(this.sh.run(l, 0), 0), b = this.hp.run(this.sh.run(r, 1), 1); this.ms += this.a * (a * a + b * b - this.ms) }
  get lufs() { return lufs(this.ms) }
}
export const makeConsole = (sr, count = 8) => {
  const P = { 'master.ride': 1, 'master.target': -18, 'master.range': 6, 'glue.on': 1, 'glue.threshold': -16, 'glue.ratio': 1.5, 'out.ceiling': -1.5, 'out.level': 0 }
  const S = Array.from({ length: count }, (_, k) => {
    const id = 's' + (k + 1) + '.'; Object.assign(P, { [id + 'trim']: 0, [id + 'pan']: 0, [id + 'width']: 100, [id + 'hpf']: 20, [id + 'lpf']: 20000, [id + 'ride']: 0, [id + 'target']: -24, [id + 'range']: 12, [id + 'gate']: -50, [id + 'duck_by']: 0, [id + 'duck_depth']: 6, [id + 'duck_threshold']: -40, [id + 'fader']: 0, [id + 'mute']: 0 })
    return { id, hp: new Filt(), lp: new Filt(), short: new Meter(sr, .8), fast: new Meter(sr, .02), ride: 0, duck: 0, g: 0, peak: 0, active: 0 }
  })
  const mom = new Meter(sr, .2), short = new Meter(sr, 1.5), outShort = new Meter(sr, 1.5), integ = { sum: 0, n: 0 }, look = Math.round(sr * .005), dl = new Float32Array(look), dr = new Float32Array(look)
  let mride = 0, glueEnv = 0, glueGr = 0, limG = 1, limGr = 0, wp = 0, tp = 0, sinceTick = 0
  const filters = () => S.forEach(s => { const h = P[s.id + 'hpf'], l = P[s.id + 'lpf']; s.hp.k = h > 21 ? biquad('hp', sr, h, .707) : null; s.lp.k = l < 19900 ? biquad('lp', sr, l, .707) : null })
  filters()
  const rideA = 1 - Math.exp(-1 / (.8 * sr)), mrideA = 1 - Math.exp(-1 / (4 * sr)), duckIn = 1 - Math.exp(-1 / (.03 * sr)), duckOut = 1 - Math.exp(-1 / (.6 * sr)), fade = 1 - Math.exp(-1 / (.02 * sr))
  const glueAtk = 1 - Math.exp(-1 / (.03 * sr)), glueRel = 1 - Math.exp(-1 / (.2 * sr)), limRel = 1 - Math.exp(-1 / (.08 * sr)), limAtk = 1 - Math.exp(-1 / (.001 * sr))
  return {
    params: P,
    set(id, v) { if (!(id in P)) return; P[id] = v; if (id.endsWith('hpf') || id.endsWith('lpf')) filters() },
    // stems: [[L, R] | null, ...] of n samples; writes the master to outL, outR. If `tap` is given ([[L, R], ...]),
    // each strip's own output (after its filters, rider, dip and fader, before the sum) is also written there, for
    // a host that places the voices in space itself and so cannot use the stereo sum.
    process(stems, outL, outR, n, tap) {
      const ceil = dB(P['out.ceiling']), level = dB(P['out.level'] <= -59.9 ? -200 : P['out.level']), thr = P['glue.threshold'], ratio = P['glue.ratio']
      for (let i = 0; i < n; i++) {
        let ml = 0, mr = 0
        for (let k = 0; k < count; k++) {
          const s = S[k], st = stems[k]; if (!st) { s.active = 0; if (tap && tap[k]) tap[k][0][i] = tap[k][1][i] = 0; continue }
          const id = s.id, trim = dB(P[id + 'trim']); let l = st[0][i] * trim, r = st[1][i] * trim
          l = s.lp.run(s.hp.run(l, 0), 0); r = s.lp.run(s.hp.run(r, 1), 1)
          const w = P[id + 'width'] / 100; if (w != 1) { const m = (l + r) / 2, d = (l - r) / 2 * w; l = m + d; r = m - d }
          const pan = P[id + 'pan'] / 100; if (pan > 0) l *= Math.cos(pan * 1.5708); else if (pan < 0) r *= Math.cos(-pan * 1.5708)
          s.short.push(l, r); s.fast.push(l, r)
          if ((i & 15) == 0) { // the slow things, sixteen times less often
            const now = s.short.lufs
            if (P[id + 'ride'] && now > P[id + 'gate']) { const want = Math.max(-P[id + 'range'], Math.min(P[id + 'range'], P[id + 'target'] - now)); s.ride += (want - s.ride) * rideA * 16 } else if (!P[id + 'ride']) s.ride += (0 - s.ride) * rideA * 16
            const by = P[id + 'duck_by'] | 0, key = by > 0 && by <= count && by != k + 1 ? S[by - 1] : null, want = key && key.active && key.fast.lufs > P[id + 'duck_threshold'] ? P[id + 'duck_depth'] : 0
            s.duck += (want - s.duck) * (want > s.duck ? duckIn : duckOut) * 16
            s.target = dB(s.ride - s.duck + (P[id + 'mute'] || P[id + 'fader'] <= -59.9 ? -200 : P[id + 'fader'])); s.active = now > -70 ? 1 : 0
          }
          s.g += ((s.target || 0) - s.g) * fade; l *= s.g; r *= s.g; if (tap && tap[k]) { tap[k][0][i] = l; tap[k][1][i] = r }
          const a = Math.abs(l) > Math.abs(r) ? Math.abs(l) : Math.abs(r); if (a > s.peak) s.peak = a
          ml += l; mr += r
        }
        // the master: a slow rider to the target, gentle glue, then the limiter
        short.push(ml, mr) // the rider listens to the sum before it; the meters below read the output
        if ((i & 15) == 0) { const now = short.lufs; if (P['master.ride'] && now > -50) { const want = Math.max(-P['master.range'], Math.min(P['master.range'], P['master.target'] - now)); mride += (want - mride) * mrideA * 16 } else if (!P['master.ride']) mride += (0 - mride) * mrideA * 16; if (outShort.lufs > -70) { integ.sum += outShort.ms; integ.n++ } }
        const mg = dB(mride); ml *= mg; mr *= mg
        if (P['glue.on']) { const a = Math.max(Math.abs(ml), Math.abs(mr)); glueEnv += (a - glueEnv) * (a > glueEnv ? glueAtk : glueRel); const over = toDb(glueEnv) - thr; glueGr = over > 0 ? over * (1 - 1 / ratio) : 0; const gg = dB(-glueGr); ml *= gg; mr *= gg } else glueGr = 0
        const pk = Math.max(Math.abs(ml), Math.abs(mr)), want = pk > ceil ? ceil / pk : 1
        limG += (want - limG) * (want < limG ? limAtk * 6 : limRel); if (want < limG && pk * limG > ceil * 1.5) limG = want
        const ol = dl[wp], or = dr[wp]; dl[wp] = ml; dr[wp] = mr; wp = (wp + 1) % look
        let yl = ol * limG, yr = or * limG; if (yl > ceil) yl = ceil; else if (yl < -ceil) yl = -ceil; if (yr > ceil) yr = ceil; else if (yr < -ceil) yr = -ceil
        limGr = -toDb(limG); const a2 = Math.max(Math.abs(yl), Math.abs(yr)); if (a2 > tp) tp = a2
        outL[i] = yl * level; outR[i] = yr * level; mom.push(outL[i], outR[i]); outShort.push(outL[i], outR[i])
      }
      sinceTick += n
    },
    // the master rider's gain now, as a multiplier: a host mixing the tapped strips itself applies this to keep the loudness target
    rideGain: () => dB(mride),
    // the same layout as the Stem Console's telemetry: 0..3 master momentary, short-term, integrated LUFS and
    // peak dB; 4 glue and 5 limiter gain reduction; 6 unused; 7 master ride dB; stem k at 8 + 6k: short-term LUFS,
    // peak dBFS, ride dB, 0, duck dB, active
    telemetry() {
      const out = [mom.lufs, outShort.lufs, integ.n ? lufs(integ.sum / integ.n) : -70, toDb(tp), glueGr, limGr, 0, mride]; tp = 0
      for (const s of S) { out.push(s.short.lufs, toDb(s.peak), s.ride, 0, s.duck, s.active); s.peak = 0 }
      return out
    }
  }
}
