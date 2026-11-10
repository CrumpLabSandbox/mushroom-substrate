// 4M core: stand scale. A plot of woodland floor 2.56 m square and 0.64 m deep, over seasons and years.
// The state is two things: an explicit graph of cords (1 cm segments) and, per individual, a field of
// fine mycelium on a 4 cm grid. The fine mycelium feeds; the cords explore, carry and connect.
// Mushrooms come up at their real size, shed spores, and spores can found new individuals.
// See docs/MODEL.md section 5b. Lengths in um, rates per hour, substrate in units of "the cost of one
// 1 cm cord segment". z is depth below the surface.
// No DOM, no Math.sin/cos/exp/pow/log, no Math.random: same individuals + seed + world = same result.
var M = (inds, seed, scn) => {
  inds = inds.slice()
  const E = 0, GU = 1, BA = 2, BS = 3, WOB = 4, SENS = 5, FUSE = 6, CAP = 7, KU = 9, SMAX = 10, C5 = 11, DA = 12,
    TOLD = 13, DI = 14, TP = 15, VT = 16, CR = 17, CMAX = 18, TOPT = 19, TMIN = 20, TMAX = 21, WOPT = 22, WWID = 23,
    EXPL = 24, RF = 25, DROP = 26, AGEF = 27, FRATE = 28, MM = 29, SPI = 35, SPA = 37, CMB = 38, DEPTH = 39
  const W = 2.56e6, DZ = 6.4e5, L = 1e4, G = 64, GZ = 16, CS = 4e4, GG = G * G * GZ, HS = 2e4, HG = 128, HZ = 32,
    N = 1 << 18, NE = N >> 2, RC = 4000, MAXI = 8, PP = inds.map(o => o.p),
    EM = Math.max(...PP.map(p => p[E])), dt = Math.min(24, L / EM), // one step is the time the fastest cord takes to grow 1 cm, at most a day
    REACH = Math.max(1, Math.min(400, PP[0][VT] * dt / L | 0)),
    SE0 = [.3, 800, 60, 40, 25, 1.5], // (wood is set so a colonised log decays at about 0.06 per year: docs/CALIBRATION.md) // mineral soil, wood, leaf litter, root tip, turf, organic soil
    F = n => new Float32Array(n || N), min = Math.min, max = Math.max, ab = Math.abs, sq = Math.sqrt, each = f => Array.from({ length: MAXI }, f),
    x0 = F(), y0 = F(), z0 = F(), x1 = F(), y1 = F(), z1 = F(), si = F(), ar = F(), Q = F(), qc = F(), qr = F(), dl = F(), born = F(),
    par = new Int32Array(N), nxt = new Int32Array(N), en = new Int32Array(N), st = new Uint8Array(N), brd = new Uint8Array(N),
    tc = new Uint8Array(N), own = new Uint8Array(N), dep = new Uint16Array(N), head = new Int32Array(HG * HG * HZ).fill(-1),
    typ = new Uint8Array(GG), den = new Uint16Array(GG), wet = F(GG), se = F(GG), mtot = F(GG),
    ev = F(NE), ew = F(NE), eu = F(NE), eI = F(NE), ed = F(NE), epar = new Int32Array(NE), eseg = new Int32Array(NE),
    tips = [], fus = [], fq = [], fr = [], rec = [], roots = [], trees = [], logs = [], land = [], D = [], trace = F(4096), home = [],
    res = each(() => 0), upS = each(() => 0), upE = each(() => 0), upPk = each(() => 0), ntip = each(() => 0), rtL = each(() => F(GZ)),
    AFI = [30, 31, 32, 33, 34, 30],
    dno = each(() => new Uint16Array(GG)), inhs = each(() => F(GG)), myc = each(() => F(GG)), // per individual: cord density, inhibitor, fine mycelium
    ibs = each(() => F(GG)), mbs = each(() => F(GG))
  let inh, ln = 0, n = 0, ne = 0, th = 0, steps = 0, lp = 0, tp = 0, wood0 = 0, a = seed >>> 0, c = 1, s = 0, i, j, k, S, hj, fj, hx, hy, hz
  const r = _ => (a = a + 0x6D2B79F5 | 0, _ = Math.imul(a ^ a >>> 15, 1 | a), _ = _ + Math.imul(_ ^ _ >>> 7, 61 | _) ^ _, ((_ ^ _ >>> 14) >>> 0) / 4294967296),
    tri = () => r() + r() - 1,
    ci = (x, y, z) => ((z / CS | 0) * G + (y / CS | 0)) * G + (x / CS | 0),
    hi = (x, y, z) => ((z / HS | 0) * HG + (y / HS | 0)) * HG + (x / HS | 0),
    inside = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < W && y < W && z < DZ,
    rw = (p, c) => max(.1, 1 - ((wet[c] - p[WOPT]) / p[WWID]) * ((wet[c] - p[WOPT]) / p[WWID])),
    rt = (p, T) => T <= p[TMIN] || T >= p[TMAX] ? 0 : (T - p[TMAX]) * (T - p[TMIN]) * (T - p[TMIN]) /
      ((p[TOPT] - p[TMIN]) * ((p[TOPT] - p[TMIN]) * (T - p[TOPT]) - (p[TOPT] - p[TMAX]) * (p[TOPT] + p[TMIN] - 2 * T))),
    wave = p => { p = 2 * (p - (p | 0)) - 1; return 4 * p * (1 - ab(p)) },
    ball = (cx, cy, cz, rad, t) => {
      for (let z = max(0, cz - rad | 0); z <= min(GZ - 1, cz + rad); z++) for (let y = max(0, cy - rad | 0); y <= min(G - 1, cy + rad); y++)
        for (let x = max(0, cx - rad | 0); x <= min(G - 1, cx + rad); x++) (x - cx) * (x - cx) + (y - cy) * (y - cy) + (z - cz) * (z - cz) <= rad * rad && (typ[(z * G + y) * G + x] = t)
    },
    // a log lying on the ground: a cylinder of wood from (x,y) along a direction, half sunk
    log = (x, y, h, len, rad) => {
      const dx = D[(h & 255) * 2], dy = D[(h & 255) * 2 + 1]
      logs.push([x * CS, y * CS, (x + dx * len) * CS, (y + dy * len) * CS, rad * CS])
      for (let t = 0; t <= len; t += .5) ball(x + dx * t | 0, y + dy * t | 0, 0, rad, 1)
    },
    add = (xa, ya, za, xb, yb, zb, p, sub, o) => {
      if (n >= N) return -1
      let q = n++, c = ci((xa + xb) / 2, (ya + yb) / 2, (za + zb) / 2), h = hi((xa + xb) / 2, (ya + yb) / 2, (za + zb) / 2)
      x0[q] = xa; y0[q] = ya; z0[q] = za; x1[q] = xb; y1[q] = yb; z1[q] = zb; par[q] = p; dep[q] = p < 0 ? 0 : dep[p] + 1
      si[q] = sub; ar[q] = 1; born[q] = th; st[q] = 1; own[q] = o
      nxt[q] = head[h]; head[h] = q; den[c]++; dno[o][c]++; S.len += L
      if (p < 0 || dep[q] % 8 == 0) { if (ne < NE) { en[q] = ne; epar[ne] = p < 0 ? -1 : en[p]; eseg[ne] = q; ev[ne] = -1.2; ew[ne] = -.62; ne++ } else en[q] = en[p] } else en[q] = en[p]
      return q
    },
    // nearest own cord within the capture radius of a point, and nearest rival cord within 2 cm
    near = (x, y, z, s, o) => {
      let cx = x / HS | 0, cy = y / HS | 0, cz = z / HS | 0, u, v, w, k, ax, ay, az, t, dx, dy, dz, d, best = RC * RC, foe = 4e8
      hj = fj = -1
      for (w = max(0, cz - 1); w <= min(HZ - 1, cz + 1); w++) for (v = max(0, cy - 1); v <= min(HG - 1, cy + 1); v++) for (u = max(0, cx - 1); u <= min(HG - 1, cx + 1); u++)
        for (k = head[(w * HG + v) * HG + u]; k >= 0; k = nxt[k]) {
          if (st[k] > 2 || k == s || par[k] == s || k == par[s] || par[k] == par[s]) continue
          ax = x1[k] - x0[k]; ay = y1[k] - y0[k]; az = z1[k] - z0[k]
          t = ((x - x0[k]) * ax + (y - y0[k]) * ay + (z - z0[k]) * az) / (ax * ax + ay * ay + az * az + 1e-9); t = t < 0 ? 0 : t > 1 ? 1 : t
          dx = x0[k] + ax * t - x; dy = y0[k] + ay * t - y; dz = z0[k] + az * t - z; d = dx * dx + dy * dy + dz * dz
          own[k] != o ? d < foe && st[k] == 1 && (foe = d, fj = k) : d < best && (best = d, hj = k, hx = x + dx, hy = y + dy, hz = z + dz)
        }
    },
    pull = (s, need) => { for (let b = par[s], k = REACH, g; b >= 0 && k-- && need > 0 && st[b] == 1; b = par[b]) g = min(need, si[b] - .3), g > 0 && (si[b] -= g, si[s] += g, need -= g) },
    // m electrical sub-steps on the network as it stands. Also callable on its own (S.elec), which lets the
    // sound recorder listen to a network for as long as it likes between growth steps.
    elec = m => {
      const h = S.eh, P = PP[0]
      let k, p, q, g, f, e
      for (; m--;) {
        for (k = 0; k < ne; k++) ed[k] = 0
        for (k = 0; k < ne; k++) { p = epar[k]; p >= 0 && eI[k] > -9 && eI[p] > -9 && (g = .12 * (ev[p] - ev[k]), ed[k] += g, ed[p] -= g) }
        for (k = 0; k < ne; k++) {
          if (eI[k] < -8) { ev[k] = -1.2; continue }
          if (S.emode == 2) { // FitzHugh-Nagumo oscillators coupled along the hyphae; growing tips lead
            g = ev[k]; f = ew[k]; e = g + h * (g - g * g * g / 3 - f + eI[k] + ed[k]); ev[k] = e < -2.5 ? -2.5 : e > 2.5 ? 2.5 : e; ew[k] = f + h * .08 * (g + .7 - .8 * f)
            g < 1 && ev[k] >= 1 && (S.spikes++, k == S.pa && S.pspikes++, S.ev && S.ev(9, x1[eseg[k]], y1[eseg[k]], z1[eseg[k]]))
          } else if (S.emode == 1) { // integrate and fire: charge builds with activity, a spike kicks the neighbours
            eu[k] += h / 40 * (.4 + eI[k] * 2) + max(0, ed[k]) * .5; ev[k] = -1.2 + (ev[k] + 1.2) * (1 - .2 * h)
            eu[k] >= 1 && (eu[k] = 0, ev[k] = 2, S.spikes++, k == S.pa && S.pspikes++, S.ev && S.ev(9, x1[eseg[k]], y1[eseg[k]], z1[eseg[k]]))
          } else { q = eseg[k]; g = Q[q] + qc[q]; ev[k] = -1.2 + 3.2 * ab(g) / (1 + ab(g)) } // a potential that simply follows flow
        }
        trace[tp++ & 4095] = S.volt = (ev[S.pa] - ev[S.pb]) * P[SPA] / 2
        S.sub && S.sub()
      }
    },
    kill = i => { tc[tips[i][0]]--; tips[i] = tips[tips.length - 1]; tips.pop() },
    drop = k => { if (st[k] == 1) { let c = ci((x0[k] + x1[k]) / 2, (y0[k] + y1[k]) / 2, (z0[k] + z1[k]) / 2); st[k] = 2; den[c]--; dno[own[k]][c]--; S.len -= L } },
    // a new individual: ten cords from a point, and a first patch of fine mycelium
    found = (o, x, y, z) => {
      home[o] = [x, y, z]; for (let c = ci(x, y, z), k = 0; k < 7; k++) myc[o][c + [0, 1, -1, G, -G, G * G, -G * G][k]] = .8
      for (let i = 0; i < 10; i++) {
        let dx = tri(), dy = tri(), dz = tri() * .3, e = sq(dx * dx + dy * dy + dz * dz) + 1e-9
        dx /= e; dy /= e; dz /= e; c = add(x, y, z, x + dx * L, y + dy * L, max(0, z + dz * L), -1, PP[o][SMAX], o); if (c < 0) return; tc[c]++; tips.push([c, dx, dy, dz, 0, 9, 0, o])
      }
    }

  for (i = 0; i < 256; i++) D.push(c, s), [c, s] = [c * .9996988186962042 - s * .024541228522912288, c * .024541228522912288 + s * .9996988186962042]

  // the world: 4 cm of leaf litter (turf in the meadow) over organic soil to 16 cm over mineral soil
  for (i = 0; i < GG; i++) { k = i / (G * G) | 0; typ[i] = k < (scn == 2 ? 3 : 1) ? scn ? 2 : 4 : k < 4 ? 5 : 0 }
  const start = inds.map((o, q) => { j = (q * 256 / inds.length + 20 & 255) * 2; k = inds.length > 1 ? 6e5 : 0; return [W / 2 + D[j] * k, W / 2 + D[j + 1] * k, 4e4] })
  if (scn == 1) { for (i = 0; i < 4; i++) log(8 + r() * 30, 8 + r() * 48, r() * 256, 16 + r() * 14, 2 + r() * 2 | 0); for (const h of start) ball(h[0] / CS | 0, h[1] / CS | 0, 1, 2, 1) }
  if (scn == 2) for (i = 0; i < 30; i++) ball(r() * G | 0, r() * G | 0, r() * 3 | 0, 1, 1) // fallen branches in the litter
  if (scn == 3) {
    for (const h of start) ball(h[0] / CS | 0, h[1] / CS | 0, 1, 1, 3)
    for (i = 0; i < 4; i++) {
      const tx = 10 + r() * 44, ty = 10 + r() * 44; trees.push([tx * CS, ty * CS, (8 + r() * 10) * 1e4])
      for (j = 0; j < 7; j++) {
        let x = tx, y = ty, z = 1, h = r() * 256, line = []
        for (k = 0; k < 34; k++) {
          h += tri() * 20; x += D[(h & 255) * 2]; y += D[(h & 255) * 2 + 1]; z += .06 + r() * .2
          if (x < 1 || y < 1 || x > G - 2 || y > G - 2 || z > GZ - 2) break
          line.push(x * CS, y * CS, z * CS); k % 4 == 3 && ball(x | 0, y | 0, z | 0, 1, 3)
        }
        roots.push(line)
      }
    }
    log(12 + r() * 20, 12 + r() * 40, r() * 256, 18, 2)
  }
  if (scn == 4) { log(8, 32, 0, 48, 5) }
  for (i = 0; i < GG; i++) { se[i] = SE0[typ[i]]; wet[i] = .55 + .1 * tri(); typ[i] == 1 && (wood0 += se[i]) }

  S = {
    W, DZ, L, G, GZ, CS, dt: dt * 3600, x0, y0, z0, x1, y1, z1, si, ar, Q, qc, st, own, typ, wet, den, tips, fr, rec, roots, trees, logs, land, SE0, volts: ev, en, trace, home, myc, mtot,
    t: 0, mean: PP[0][TOPT] - 8, season: 8, daily: 3, weather: 1, tsurf: 0, rain: 0, emode: 2, volt: 0, pa: 0, pb: 0, ni: inds.length,
    len: 0, br: 0, fu: 0, wars: 0, res: 0, up: 0, flow: 0, front: 0, cords: 0, fruits: 0, alpha: 0, ntips: 0, spikes: 0, pspikes: 0, spores: 0, wood: 1, mycel: 0,
    get n() { return n }, get ne() { return ne }, get se() { return se }, get tp() { return tp }, tipsOf: ntip, speciesOf: () => inds.map(o => o.id),
    elec, eseg, eh: .25,
    probe(ax, ay, az, bx, by, bz) {
      let da = 1e30, db = 1e30, d
      for (let k = 0; k < ne; k++) { let q = eseg[k]; if (st[q] != 1) continue
        d = (x1[q] - ax) * (x1[q] - ax) + (y1[q] - ay) * (y1[q] - ay) + (z1[q] - az) * (z1[q] - az); d < da && (da = d, S.pa = k)
        d = (x1[q] - bx) * (x1[q] - bx) + (y1[q] - by) * (y1[q] - by) + (z1[q] - bz) * (z1[q] - bz); d < db && (db = d, S.pb = k) }
    },
    step() {
      let p, q, f, u, e, h, t, b, g, m, o, P, x, y, z, dx, dy, dz, fsum = 0, ext = 0, up = 0, cords = 0, rain = 0, wood = 0, mycel = 0
      const NI = S.ni
      th += dt; steps++; qr.fill(0, 0, n)

      // 0. weather: yearly and daily temperature cycles, damped with depth; rain wets the surface and soaks down
      S.tsurf = S.mean + (S.weather ? S.season * wave(th / 8760) + S.daily * wave(th / 24) : 0)
      for (o = 0; o < NI; o++) { res[o] = 0; ntip[o] = 0; for (k = 0; k < GZ; k++) rtL[o][k] = rt(PP[o], S.mean + (S.tsurf - S.mean) * (1 - .8 * k / GZ)) }
      if (S.weather && r() < dt / 90 || S.rain) { rain = 1; S.rain = 0; S.ev && S.ev(10, 0, 0, 0) }
      if (S.weather) for (c = GG - 1, e = min(.5, .12 * dt), u = min(.5, .004 * dt); c >= 0; c--) {
        k = c / (G * G) | 0; g = wet[c]
        k ? (f = e * (wet[c - G * G] - g + .08), f > 0 && (g += f, wet[c - G * G] -= f * .7)) : g += rain ? .45 : -u * g
        wet[c] = g < .05 ? .05 : g > 1 ? 1 : g
      }

      // 1. cord tips: extend, steer away from their own crowding, meet other cords, branch behind the tip
      for (i = 0; i < tips.length; i++) {
        t = tips[i]; s = t[0]; o = t[7]; P = PP[o]
        if (st[s] != 1) { kill(i--); continue }
        ntip[o]++
        x = x1[s]; y = y1[s]; z = z1[s]; c = ci(x, y, z)
        si[s] < 1 && pull(s, 1 - si[s])
        if (si[s] < 1) { if (++t[6] > 40) { S.ev && S.ev(2, x, y, z); kill(i--) } continue }
        t[6] = 0
        t[4] += P[E] * dt / L * rtL[o][z / CS | 0] * rw(P, c) * min(1, .3 + t[5] * .12) * (typ[c] % 5 ? 1 : max(.15, P[EXPL]))
        if (t[4] < 1) continue
        t[4] -= 1
        inh = inhs[o]
        g = P[WOB] * .02; f = P[SENS] * 1.5
        dx = t[1] + tri() * g; dy = t[2] + tri() * g; dz = t[3] + tri() * g * .5 + .2 * (P[DEPTH] * 30 - z) / DZ
        if (x > CS && y > CS && z > CS && x < W - CS && y < W - CS && z < DZ - CS) {
          e = f / (ab(inh[c + 1] - inh[c - 1]) + ab(inh[c + G] - inh[c - G]) + ab(inh[c + G * G] - inh[c - G * G]) + inh[c] + 1e-6)
          dx -= e * (inh[c + 1] - inh[c - 1]); dy -= e * (inh[c + G] - inh[c - G]); dz -= e * (inh[c + G * G] - inh[c - G * G])
        }
        e = sq(dx * dx + dy * dy + dz * dz) + 1e-9; dx /= e; dy /= e; dz /= e
        z + dz * L < 0 && (dz = ab(dz) * .3)
        t[1] = dx; t[2] = dy; t[3] = dz; u = x + dx * L; e = y + dy * L; h = z + dz * L
        if (!inside(u, e, h)) { kill(i--); continue }
        si[s] -= 1; qr[s] += 1; ext++; fsum += (u - home[o][0]) * (u - home[o][0]) + (e - home[o][1]) * (e - home[o][1])
        near(u, e, h, s, o)
        if (hj >= 0 && r() < P[FUSE]) {
          q = add(x, y, z, hx, hy, hz, s, 0, o); q >= 0 && st[hj] == 1 && (fus.push(q, hj), fq.push(0)); S.fu++; S.ev && S.ev(1, u, e, h); kill(i--); continue
        }
        if (fj >= 0) {
          S.wars++; tc[fj] || drop(fj)
          if (inds[own[fj]].id == inds[o].id || r() >= .6 * P[CMB] / (P[CMB] + PP[own[fj]][CMB])) { S.ev && S.ev(7, u, e, h); kill(i--); continue }
          S.ev && S.ev(8, u, e, h)
        }
        f = si[s] / 2; si[s] = f; q = add(x, y, z, u, e, h, s, f, o)
        if (q < 0) { kill(i--); continue }
        tc[s]--; tc[q]++; t[0] = q; t[5]++
        // at this scale a branch is a new cord; they are rarer than hyphal branches, and rarer still where cords are dense
        if (tips.length < 6000 && r() < .12 + .25 * 300 / (P[GU] + 300) && den[c] < P[CAP] * 2 && r() < (1 - n / N) * (1 - n / N)) {
          b = s; for (k = 1 + (r() * 5 | 0); k-- && par[b] >= 0;) b = par[b]
          if (!brd[b] && st[b] == 1) {
            g = tri(); f = tri(); m = tri() * .4; e = g * dx + f * dy + m * dz; g -= e * dx; f -= e * dy; m -= e * dz; e = sq(g * g + f * f + m * m) + 1e-9
            k = ((P[BA] + tri() * P[BS] * 2.45) * 256 / 360 & 255) * 2
            brd[b] = 1; tc[b]++; S.br++; S.ev && S.ev(0, x1[b], y1[b], z1[b])
            tips.push([b, D[k] * dx + D[k + 1] * g / e, D[k] * dy + D[k + 1] * f / e, D[k] * dz + D[k + 1] * m / e, 0, 0, 0, o])
          }
        }
      }

      // 2. every cord: fed by the fine mycelium in its cell, pays upkeep, thickens with flow, is abandoned when idle and empty
      for (i = 0; i < n; i++) {
        if (st[i] != 1) { st[i] == 2 && (i & 7) == (steps & 7) && r() < PP[own[i]][DI] * dt && (st[i] = 3); continue }
        o = own[i]; P = PP[o]; c = ci(x1[i], y1[i], z1[i]); m = P[SMAX] * ar[i]
        u = min(10 * P[E] / L * dt * myc[o][c] * P[AFI[typ[c]]] * rtL[o][z1[i] / CS | 0] * rw(P, c) * se[c] / (se[c] + 5) / dno[o][c], se[c], m - si[i])
        u > 0 && (se[c] -= u, si[i] += u * .9, up += u, upS[o] += u)
        si[i] = max(0, si[i] - P[C5] * .1 * dt * P[E] / 350) // upkeep scales with how fast the species lives
        g = ab(Q[i] + qc[i]); ar[i] += min(1, dt * P[CR]) * (1 + P[CMAX] * g / (g + 8) - ar[i]); ar[i] > 4 && cords++
        res[o] += si[i]
        if ((i & 7) == (steps & 7) && par[i] >= 0 && !tc[i] && g < .02 && th - born[i] > P[TOLD] * 20 && si[i] < .2 && r() < P[DA] * dt * 1.6) {
          st[par[i]] == 1 && (si[par[i]] += si[i] * .5 + .3); res[o] -= si[i]; si[i] = 0; drop(i); S.ev && S.ev(3, x1[i], y1[i], z1[i])
        }
      }

      // 3. fruiting, then spores. Initials start within 12 cm of the surface and compete for the reserve.
      for (o = 0; o < NI; o++) {
        P = PP[o]; g = upE[o] = upE[o] * .9 + upS[o] * .1; upS[o] = 0; g > upPk[o] && (upPk[o] = g)
        if (th > P[AGEF] * 4 && S.tsurf <= P[TOPT] - P[DROP] && S.tsurf > P[TMIN] + 2 && (res[o] > 2 * P[RF] || res[o] > P[RF] && g < .6 * upPk[o]) && fr.length < 80 && r() < min(1, P[FRATE] * dt * .1))
          for (k = 8; k--;) {
            i = r() * n | 0
            if (st[i] == 1 && own[i] == o && z1[i] < 1.2e5 && si[i] > 1 && !fr.some(v => v.s < 3 && (v.x - x1[i]) * (v.x - x1[i]) + (v.y - y1[i]) * (v.y - y1[i]) < 6.4e9)) { fr.push({ i, o, x: x1[i], y: y1[i], z: z1[i], m: 0, s: 0, q: 0, b: 0 }); S.ev && S.ev(4, x1[i], y1[i], z1[i]); break }
          }
      }
      for (i = fr.length; i--;) fr[i].s > 1 && fr.splice(i, 1) // aborted and rotted ones leave the list
      for (const v of fr) {
        P = PP[v.o]
        if (!v.s) { // growing: a sink on the cord network; expansion needs water
          g = dt * .3 * (1 + v.m * .2) * (.3 + wet[ci(v.x, v.y, 0)]); st[v.i] == 1 && si[v.i] < g && pull(v.i, g - si[v.i])
          g = st[v.i] == 1 ? min(si[v.i], g) : 0
          si[v.i] -= g; v.m += g; qr[v.i] += g
          if (g < .01) { if (++v.q > 12) { v.s = 2; st[v.i] == 1 && (si[v.i] += v.m * .5); S.ev && S.ev(5, v.x, v.y, v.z) } } else v.q = 0
          if (v.m >= P[MM]) { v.s = 1; v.b = th; S.fruits++; S.ev && S.ev(6, v.x, v.y, v.z) }
        } else if (v.s == 1) { // mature: sheds spores for ten days, then rots away
          S.spores += 1.08e8 * dt; S.ev && S.ev(12, v.x, v.y, 0)
          for (k = 4; k--;) { // where a few of them land: most within a metre, a long thin tail beyond
            u = r(); g = 8e4 * u / (1.02 - u); j = (r() * 256 | 0) * 2; x = v.x + D[j] * g; y = v.y + D[j + 1] * g
            if (!inside(x, y, 0)) continue
            j = (ln++ % 500) * 3; land[j] = x; land[j + 1] = y; land[j + 2] = v.o
            c = ci(x, y, 0)
            // a spore founds a new individual only on food its species can use, where no mycelium has a hold, and rarely
            if (S.ni < MAXI && n < N * .8 && mtot[c] < .05 && P[AFI[typ[c]]] > .25 && r() < .004) {
              o = S.ni++; inds.push(inds[v.o]); PP.push(P); found(o, x, y, 2e4); S.ev && S.ev(13, x, y, 0)
            }
          }
          th - v.b > 240 && (v.s = 3, S.ev && S.ev(11, v.x, v.y, 0))
        }
      }

      // 4. growth-induced flow on the tree, then Hardy Cross relaxation around the loops that fusions close
      for (i = n - 1, f = 0; i >= 0; i--) { p = par[i]; p >= 0 ? st[i] == 1 && (qr[p] += qr[i]) : f += qr[i]; Q[i] = Q[i] * .8 + qr[i] * .2 }
      S.flow = f / dt
      for (k = min(fq.length, 300); k--;) {
        lp = (lp + 1) % fq.length; u = fus[2 * lp]; e = fus[2 * lp + 1]; h = fq[lp]; m = 1; b = 1; p = u; q = e
        while (p != q) {
          if (q < 0 || p >= 0 && dep[p] >= dep[q]) { if (st[p] != 1) { b = 0; break } h += (Q[p] + qc[p]) / ar[p]; m += 1 / ar[p]; p = par[p] }
          else { if (st[q] != 1) { b = 0; break } h -= (Q[q] + qc[q]) / ar[q]; m += 1 / ar[q]; q = par[q] }
        }
        g = b ? -h / m : -fq[lp]
        if (g) { fq[lp] += g; p = u; q = e; while (p != q) q < 0 || p >= 0 && dep[p] >= dep[q] ? (qc[p] += g, p = par[p]) : (qc[q] -= g, q = par[q]) }
      }

      // 5. translocation along cords
      for (k = 6; k--;) {
        dl.fill(0, 0, n)
        for (i = 0; i < n; i++) {
          p = par[i]; if (p < 0 || st[i] != 1 || st[p] != 1) continue
          P = PP[own[i]]; g = P[TP] * (si[p] - si[i]); m = si[i] - .8 * P[SMAX] * ar[i]; m > 0 && (g -= .25 * m)
          g > 0 ? (m = P[SMAX] * ar[i] - si[i], g > m && (g = max(0, m))) : (m = P[SMAX] * ar[p] - si[p], -g > m && (g = -max(0, m)))
          dl[i] += g; dl[p] -= g
        }
        for (j = 0; j < fus.length; j += 2) { p = fus[j]; q = fus[j + 1]; e = fq[j / 2]; st[p] == 1 && st[q] == 1 && (g = PP[own[p]][TP] * (si[p] - si[q]) + (e > 0 ? .25 * si[p] * min(1, e / (ab(Q[p] + qc[p]) + 1e-9)) : -.25 * si[q] * min(1, -e / (ab(Q[q] + qc[q]) + 1e-9))), dl[q] += g, dl[p] -= g) }
        for (i = 0; i < n; i++) si[i] = max(0, si[i] + dl[i])
      }

      // 6. fields. Root tips and turf are resupplied. Each individual's fine mycelium grows where there is food
      // it can use and room, spreads to neighbouring cells, feeds itself, and dies back where food has run out.
      for (c = 0; c < GG; c++) {
        typ[c] == 3 ? se[c] = min(40, se[c] + 6 * dt) : typ[c] == 4 && (se[c] = min(25, se[c] + .004 * dt))
        typ[c] == 1 && (wood += se[c])
        x = c % G; y = (c / G | 0) % G; z = c / (G * G) | 0
        b = x && y && z < GZ - 1 && x < G - 1 && y < G - 1; k = z ? c - G * G : c
        for (o = 0, m = 0; o < NI; o++) m += myc[o][c]
        mtot[c] = m; mycel += m
        for (o = 0; o < NI; o++) {
          P = PP[o]; inh = inhs[o]; e = myc[o]; g = e[c]
          f = P[AFI[typ[c]]] * rtL[o][z] * rw(P, c) * se[c] / (se[c] + 5)
          if (b) {
            u = (e[c - 1] + e[c + 1] + e[c - G] + e[c + G] + e[k] + e[c + G * G]) / 6
            g += min(.5, .004 * dt * P[E] / 100) * ((dno[o][c] ? .1 : 0) + g + u * (.4 + P[EXPL])) * f * (1 - m) - min(.5, .0015 * dt) * g * (1.05 - P[AFI[typ[c]]] * se[c] / (se[c] + 5))
            g = g < 1e-4 ? 0 : g > 1 ? 1 : g
            u = min(se[c], .01 * dt * g * f); se[c] -= u
            ibs[o][c] = inh[c] * .8 + .14 * (inh[c - 1] + inh[c + 1] + inh[c - G] + inh[c + G] + inh[k] + inh[c + G * G] - 6 * inh[c]) + dno[o][c] * .15
          } else { g = 0; ibs[o][c] = 0 }
          mbs[o][c] = g // written back after the sweep, so neighbours read this step's starting values
        }
      }
      for (o = 0; o < NI; o++) { inhs[o].set(ibs[o]); myc[o].set(mbs[o]) }

      // 7. electrical activity on a coarser graph, on its own faster clock: m sub-steps of h time units each,
      // where 40 units is one spike interval. Slow growers would need more sub-steps than the cap allows,
      // so for them each growth step samples only part of its own length.
      P = PP[0]; g = dt * 60 / P[SPI]; m = min(160, max(1, g * 160 + .5 | 0)); S.eh = min(.25, g * 40 / m)
      S.tdt = S.eh / 40 * P[SPI] * 60 // seconds of electrical time per sample
      if (S.emode) {
        for (k = 0; k < ne; k++) { q = eseg[k]; eI[k] = st[q] == 1 ? .45 + (rain && z1[q] < 8e4 ? .5 : 0) : -9 } // every live node is driven just into its rhythmic range
        for (const t of tips) eI[en[t[0]]] > -9 && eI[en[t[0]]] < .5 && (eI[en[t[0]]] += .1) // a node with a growing tip on its stretch runs a little faster and leads
        elec(m)
      }

      // signals
      for (o = 0, S.res = 0; o < NI; o++) S.res += res[o]
      S.t = th * 3600; S.ntips = tips.length; S.up = up / dt; S.cords = cords; S.wood = wood0 ? wood / wood0 : 1; S.mycel = mycel
      S.alpha = S.fu / (4 * S.br + 20 * NI - 3)
      ext && (S.front = sq(fsum / ext))
      steps % 4 || rec.length < 8000 && rec.push([th, tips.length, S.len, S.res, S.up, S.flow, S.front, fr.filter(v => v.s == 1).length, S.tsurf, S.spikes, S.wars, S.spores, NI, S.wood, mycel])
    }
  }
  start.forEach((h, q) => found(q, h[0], h[1], h[2]))
  S.probe(home[0][0], home[0][1], home[0][2], home[0][0] + 3e5, home[0][1], home[0][2])
  return S
}
