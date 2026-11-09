// 40K core: a lattice-free hyphal graph in a patchy world. See docs/MODEL.md section 4.
// Lengths in um, rates per hour, substrate in units of "the cost of one segment".
// No DOM, no Math.sin/cos/exp/pow, no Math.random: same species + seed + scenario = same result.
var M = (P, seed, scn) => {
  const [E, GU, BA, BS, WOB, SENS, FUSE, CAP, UP, KU, SMAX, C5, DA, TOLD, DI, TP, TA, CR, CMAX,
    TOPT, TMIN, TMAX, WOPT, WWID, EXPL, RF, DROP, AGEF, FRATE, MM, A0, A1, A2, A3, A4] = P
  const W = 25600, L = 100, G = 128, CS = 200, N = 1 << 17, GG = G * G, AF = [A0, A1, A2, A3, A4],
    SE0 = [.6, 400, 60, 40, 25], MOB = [.1, 0, 0, 0, 1], // soil, wood, litter, root tip, agar
    F = () => new Float32Array(N), min = Math.min, max = Math.max,
    x0 = F(), y0 = F(), x1 = F(), y1 = F(), si = F(), ar = F(), Q = F(), qr = F(), dl = F(), born = F(),
    par = new Int32Array(N), nxt = new Int32Array(N), st = new Uint8Array(N), brd = new Uint8Array(N),
    tc = new Uint8Array(N), head = new Int32Array(GG).fill(-1), typ = new Uint8Array(GG),
    den = new Uint16Array(GG), wet = new Float32Array(GG), tips = [], fus = [], fr = [], rec = [], D = []
  let se = new Float32Array(GG), sb = new Float32Array(GG), inh = new Float32Array(GG), ib = new Float32Array(GG),
    n = 0, th = 0, steps = 0, upE = 0, upPk = 0, a = seed >>> 0, c = 1, s = 0, i, j, S, hj, ht
  const r = _ => (a = a + 0x6D2B79F5 | 0, _ = Math.imul(a ^ a >>> 15, 1 | a), _ = _ + Math.imul(_ ^ _ >>> 7, 61 | _) ^ _, ((_ ^ _ >>> 14) >>> 0) / 4294967296),
    tri = () => r() + r() - 1, K = 256 / 360,
    ci = (x, y) => (y / CS | 0) * G + (x / CS | 0),
    rw = c => max(.1, 1 - ((wet[c] - WOPT) / WWID) * ((wet[c] - WOPT) / WWID)),
    // cardinal temperature model (Rosso et al. 1993), a rational curve: 0 at TMIN and TMAX, 1 at TOPT
    rt = T => T <= TMIN || T >= TMAX ? 0 : (T - TMAX) * (T - TMIN) * (T - TMIN) /
      ((TOPT - TMIN) * ((TOPT - TMIN) * (T - TOPT) - (TOPT - TMAX) * (TOPT + TMIN - 2 * T))),
    disc = (cx, cy, rad, t) => { for (let y = max(0, cy - rad | 0); y <= min(G - 1, cy + rad); y++) for (let x = max(0, cx - rad | 0); x <= min(G - 1, cx + rad); x++) (x - cx) * (x - cx) + (y - cy) * (y - cy) <= rad * rad && (typ[y * G + x] = t) },
    add = (xa, ya, xb, yb, p, sub) => {
      if (n >= N) return -1
      let q = n++, c = ci((xa + xb) / 2, (ya + yb) / 2)
      x0[q] = xa; y0[q] = ya; x1[q] = xb; y1[q] = yb; par[q] = p; si[q] = sub; ar[q] = 1; born[q] = th; st[q] = 1
      nxt[q] = head[c]; head[c] = q; den[c]++; S.len += L
      return q
    },
    // nearest crossing of segment (xa,ya)-(xb,yb) with a laid hypha: sets hj (segment) and ht (0..1 along it)
    hit = (xa, ya, xb, yb) => {
      let rx = xb - xa, ry = yb - ya, cx = (xa + xb) / 2 / CS | 0, cy = (ya + yb) / 2 / CS | 0, u, v, k, e, sx, sy, o, t
      hj = -1; ht = 2
      for (v = max(0, cy - 1); v <= min(G - 1, cy + 1); v++) for (u = max(0, cx - 1); u <= min(G - 1, cx + 1); u++)
        for (k = head[v * G + u]; k >= 0; k = nxt[k]) {
          if (st[k] > 2) continue
          sx = x1[k] - x0[k]; sy = y1[k] - y0[k]; e = rx * sy - ry * sx
          if (e == 0) continue
          t = ((x0[k] - xa) * sy - (y0[k] - ya) * sx) / e; o = ((x0[k] - xa) * ry - (y0[k] - ya) * rx) / e
          t > .001 && t <= 1 && o >= 0 && o <= 1 && t < ht && (ht = t, hj = k)
        }
    },
    kill = i => { tc[tips[i][0]]--; tips[i] = tips[tips.length - 1]; tips.pop() }

  for (i = 0; i < 256; i++) D.push(c, s), [c, s] = [c * .9996988186962042 - s * .024541228522912288, c * .024541228522912288 + s * .9996988186962042]

  // the world: substrate types, then moisture
  typ.fill(scn ? 0 : 4)
  if (scn == 1) { disc(64, 64, 6, 1); for (i = 0; i < 3; i++) { j = (r() * 256 | 0) * 2; c = 30 + r() * 22; disc(64 + D[j] * c | 0, 64 + D[j + 1] * c | 0, 4, 1) } }
  if (scn == 2) { for (i = 0; i < 45; i++) disc(r() * G | 0, r() * G | 0, 2 + r() * 4 | 0, 2); disc(64, 64, 5, 2) }
  if (scn == 3) {
    disc(64, 64, 2, 3)
    for (i = 0; i < 5; i++) {
      let h = r() * 256, x = 64 + D[(h & 255) * 2] * 3, y = 64 + D[(h & 255) * 2 + 1] * 3
      for (j = 0; j < 44; j++) { h += tri() * 24; x += D[(h & 255) * 2]; y += D[(h & 255) * 2 + 1]; j % 4 == 3 && disc(x | 0, y | 0, 1, 3) }
    }
  }
  if (scn == 4) for (i = 0; i < GG; i++) i % G > 19 && i % G < 108 && i / G > 43 && i / G < 85 && (typ[i] = 1)
  for (i = 0; i < GG; i++) se[i] = SE0[typ[i]]
  { let v = []; for (i = 0; i < 81; i++) v.push(.3 + .6 * r())
    for (i = 0; i < GG; i++) { let gx = (i % G) / 16, gy = (i / G | 0) / 16, u = gx | 0, w = gy | 0, fx = gx - u, fy = gy - w, k = w * 9 + u
      wet[i] = (v[k] * (1 - fx) + v[k + 1] * fx) * (1 - fy) + (v[k + 9] * (1 - fx) + v[k + 10] * fx) * fy } }

  S = {
    W, L, G, CS, x0, y0, x1, y1, si, ar, Q, st, typ, wet, den, tips, fr, rec, SE0, SMAX, MM,
    t: 0, dt: L / E * 3600, temp: TOPT - DROP, len: 0, br: 0, fu: 0, res: 0, up: 0, flow: 0, front: 0, cords: 0, fruits: 0, alpha: 0, ntips: 0,
    get n() { return n }, get se() { return se }, get inh() { return inh },
    step() {
      const dt = L / E, T = rt(S.temp)
      let k, p, q, f, u, h, t, b, g, e, m, fsum = 0, ext = 0, res = 0, up = 0, cords = 0
      th += dt; steps++; qr.fill(0, 0, n)

      // 1. tips: extend, steer away from crowding, fuse, branch behind the tip
      for (i = 0; i < tips.length; i++) {
        t = tips[i]; s = t[0]
        if (st[s] != 1) { kill(i--); continue }
        c = ci(x1[s], y1[s])
        if (si[s] < 1) { if (++t[4] > 60) { S.ev && S.ev(2, x1[s], y1[s]); kill(i--) } continue }
        t[4] = 0
        t[2] += T * rw(c) * min(1, .3 + t[3] * .12) * (typ[c] ? 1 : EXPL)
        if (t[2] < 1) continue
        t[2] -= 1; h = t[1]
        j = (h - 32 & 255) * 2; u = x1[s] + D[j] * 400; e = y1[s] + D[j + 1] * 400; f = u < 0 || e < 0 || u >= W || e >= W ? 0 : inh[ci(u, e)]
        j = (h + 32 & 255) * 2; u = x1[s] + D[j] * 400; e = y1[s] + D[j + 1] * 400; g = u < 0 || e < 0 || u >= W || e >= W ? 0 : inh[ci(u, e)]
        h += tri() * WOB * K + SENS * 32 * (f - g) / (f + g + 1e-6); t[1] = h
        j = (h & 255) * 2; u = x1[s] + D[j] * L; e = y1[s] + D[j + 1] * L
        if (u < 0 || e < 0 || u >= W || e >= W) { kill(i--); continue }
        si[s] -= 1; qr[s] += 1; ext++; fsum += (u - W / 2) * (u - W / 2) + (e - W / 2) * (e - W / 2)
        hit(x1[s], y1[s], u, e)
        if (hj >= 0 && den[c] > 1 && r() < FUSE) { // fusion happens behind the front, where hyphae are dense
          q = add(x1[s], y1[s], x1[s] + (u - x1[s]) * ht, y1[s] + (e - y1[s]) * ht, s, 0)
          q >= 0 && fus.push(q, hj); S.fu++; S.ev && S.ev(1, u, e); kill(i--); continue
        }
        f = si[s] / 2; si[s] = f; q = add(x1[s], y1[s], u, e, s, f)
        if (q < 0) { kill(i--); continue }
        tc[s]--; tc[q]++; t[0] = q; t[3]++
        if (tips.length < 6000 && r() < L / GU * (1 - den[c] / CAP)) {
          b = s; for (k = 1 + (r() * 5 | 0); k-- && par[b] >= 0;) b = par[b]
          if (!brd[b] && st[b] == 1) {
            brd[b] = 1; tc[b]++; S.br++; S.ev && S.ev(0, x1[b], y1[b])
            tips.push([b, h + (r() < .5 ? 1 : -1) * (BA + tri() * BS * 2.45) * K, 0, 0, 0])
          }
        }
      }

      // 2. every hypha: uptake (needs internal substrate), maintenance, cord thickening, inactivation
      for (i = 0; i < n; i++) {
        if (st[i] != 1) { st[i] == 2 && (i & 7) == (steps & 7) && r() < DI * dt * 8 && (st[i] = 3); continue }
        c = ci(x1[i], y1[i]); m = SMAX * ar[i]
        u = min(UP * dt * AF[typ[c]] * T * rw(c) * si[i] / (KU + si[i]) * se[c] / (se[c] + 5), se[c], m - si[i])
        u > 0 && (se[c] -= u, si[i] += u * .9, up += u)
        si[i] = max(0, si[i] - C5 * dt)
        ar[i] += dt * CR * (1 + CMAX * Q[i] / (Q[i] + 1) - ar[i]); ar[i] > 4 && cords++
        res += si[i]
        if ((i & 7) == (steps & 7) && par[i] >= 0 && !tc[i] && Q[i] < .02 && th - born[i] > TOLD && si[i] < .2 && r() < DA * dt * 32) { // starved, idle and old: abandon it
          st[i] = 2; den[c]--; S.len -= L; st[par[i]] == 1 && (si[par[i]] += si[i] * .5 + .3); res -= si[i]; si[i] = 0
          S.ev && S.ev(3, x1[i], y1[i])
        }
      }

      // 3. fruiting: initials are sinks that compete for the same reserve
      upE = upE * .98 + up * .02; upE > upPk && (upPk = upE)
      if (th > AGEF && S.temp <= TOPT - DROP && (res > 2 * RF || res > RF && upE < .6 * upPk) && fr.length < 14 && r() < FRATE * dt) {
        i = r() * n | 0
        if (st[i] == 1 && si[i] > 1 && !fr.some(o => (o.x - x1[i]) * (o.x - x1[i]) + (o.y - y1[i]) * (o.y - y1[i]) < 9e6)) { fr.push({ i, x: x1[i], y: y1[i], m: 0, s: 0, z: 0 }); S.ev && S.ev(4, x1[i], y1[i]) }
      }
      for (const o of fr) if (!o.s) {
        g = st[o.i] == 1 ? min(si[o.i], dt * .5 * (1 + o.m * .2)) : 0
        si[o.i] -= g; o.m += g; qr[o.i] += g
        if (g < .01) { if (++o.z > 80) { o.s = 2; st[o.i] == 1 && (si[o.i] += o.m * .5); S.ev && S.ev(5, o.x, o.y) } } else o.z = 0
        if (o.m >= MM) { o.s = 1; S.fruits++; S.ev && S.ev(6, o.x, o.y) }
      }

      // 4. growth-induced flow: on a tree, the flux in a hypha is the demand of everything downstream
      for (i = n - 1, f = 0; i >= 0; i--) { p = par[i]; p >= 0 ? st[i] == 1 && (qr[p] += qr[i]) : f += qr[i]; Q[i] = Q[i] * .95 + qr[i] * .05 }

      // 5. translocation: passive (down the gradient) and directed (toward demand), 2 to 8 passes per step
      for (k = min(8, max(2, dt * 10 + .5 | 0)); k--;) {
        dl.fill(0, 0, n)
        for (i = 0; i < n; i++) {
          p = par[i]; if (p < 0 || st[i] != 1 || st[p] != 1) continue
          g = TP * (si[p] - si[i]) + (Q[i] > 0 ? TA * si[p] * min(1, Q[i] / (Q[p] + 1e-9)) : 0)
          g > 0 && (m = SMAX * ar[i] - si[i], g > m && (g = max(0, m)))
          dl[i] += g; dl[p] -= g
        }
        for (j = 0; j < fus.length; j += 2) { p = fus[j]; q = fus[j + 1]; st[p] == 1 && st[q] == 1 && (g = TP * (si[p] - si[q]), dl[q] += g, dl[p] -= g) }
        for (i = 0; i < n; i++) si[i] = max(0, si[i] + dl[i])
      }

      // 6. fields: root tips resupply, mobile substrate spreads, hyphae emit a diffusing inhibitor
      for (k = 0; k < 2; k++) {
        for (c = G; c < GG - G; c++) {
          m = MOB[typ[c]]; g = se[c]
          sb[c] = c % G && (c + 1) % G && m ? g + .2 * (min(m, MOB[typ[c - 1]]) * (se[c - 1] - g) + min(m, MOB[typ[c + 1]]) * (se[c + 1] - g) + min(m, MOB[typ[c - G]]) * (se[c - G] - g) + min(m, MOB[typ[c + G]]) * (se[c + G] - g)) : g
        }
        for (c = 0; c < G; c++) sb[c] = se[c], sb[GG - 1 - c] = se[GG - 1 - c]
        c = se; se = sb; sb = c
      }
      for (c = 0; c < GG; c++) {
        typ[c] == 3 && (se[c] = min(40, se[c] + 6 * dt)) // the host tree keeps supplying its root tips
        ib[c] = c > G && c < GG - G && c % G && (c + 1) % G ? inh[c] * .95 + .2 * (inh[c - 1] + inh[c + 1] + inh[c - G] + inh[c + G] - 4 * inh[c]) + den[c] * .05 : 0
      }
      c = inh; inh = ib; ib = c

      // signals
      S.t = th * 3600; S.ntips = tips.length; S.res = res; S.up = up / dt; S.flow = f / dt; S.cords = cords
      S.alpha = S.fu / (4 * S.br + 2 * 10 - 3)
      ext && (S.front = Math.sqrt(fsum / ext))
      steps % 10 || rec.length < 6000 && rec.push([th, tips.length, S.len, res, S.up, S.flow, S.front, S.fruits])
    }
  }

  // inoculum: ten hyphae from the centre
  for (i = 0; i < 10; i++) { j = (i * 25.6 & 255) * 2; c = add(W / 2, W / 2, W / 2 + D[j] * L, W / 2 + D[j + 1] * L, -1, SMAX); tc[c]++; tips.push([c, i * 25.6, 0, 9, 0]) }
  return S
}
