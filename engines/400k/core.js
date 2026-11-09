// 400K core: the 40K model in a volume of soil, with weather, electrical activity and more than one
// individual. See docs/MODEL.md section 5. Lengths in um, rates per hour, substrate in units of
// "the cost of one segment". z is depth below the soil surface.
// No DOM, no Math.sin/cos/exp/pow, no Math.random: same individuals + seed + world = same result.
var M = (inds, seed, scn) => {
  // parameter positions in a packed species
  const E = 0, GU = 1, BA = 2, BS = 3, WOB = 4, SENS = 5, FUSE = 6, CAP = 7, UP = 8, KU = 9, SMAX = 10, C5 = 11, DA = 12,
    TOLD = 13, DI = 14, TP = 15, VT = 16, CR = 17, CMAX = 18, TOPT = 19, TMIN = 20, TMAX = 21, WOPT = 22, WWID = 23,
    EXPL = 24, RF = 25, DROP = 26, AGEF = 27, FRATE = 28, MM = 29, SPI = 35, SPA = 37, CMB = 38, DEPTH = 39
  const W = 25600, DZ = 12800, L = 100, G = 64, GZ = 32, CS = 400, GG = G * G * GZ, HS = 200, HG = 128, HZ = 64,
    N = 1 << 18, NE = N >> 2, RC = 40, NI = inds.length, PP = inds.map(o => o.p),
    EM = Math.max(...PP.map(p => p[E])), dt = L / EM, REACH = Math.max(1, Math.min(400, PP[0][VT] / EM | 0)),
    SE0 = [.3, 400, 60, 40, 25, 1.5], MOB = [0, 0, 0, 0, 1, 0], // mineral soil, wood, litter, root tip, agar, organic soil
    F = n => new Float32Array(n || N), min = Math.min, max = Math.max, ab = Math.abs, sq = Math.sqrt,
    x0 = F(), y0 = F(), z0 = F(), x1 = F(), y1 = F(), z1 = F(), si = F(), ar = F(), Q = F(), qc = F(), qr = F(), dl = F(), born = F(),
    par = new Int32Array(N), nxt = new Int32Array(N), en = new Int32Array(N), st = new Uint8Array(N), brd = new Uint8Array(N),
    tc = new Uint8Array(N), own = new Uint8Array(N), dep = new Uint16Array(N), head = new Int32Array(HG * HG * HZ).fill(-1),
    typ = new Uint8Array(GG), den = new Uint16Array(GG), wet = F(GG), se = F(GG),
    ev = F(NE), ew = F(NE), eu = F(NE), eI = F(NE), ed = F(NE), epar = new Int32Array(NE), eseg = new Int32Array(NE),
    tips = [], fus = [], fq = [], fr = [], rec = [], roots = [], D = [], trace = F(4096),
    res = PP.map(() => 0), upS = PP.map(() => 0), upE = PP.map(() => 0), AFI = [30, 31, 32, 33, 34, 30], upPk = PP.map(() => 0), rtL = PP.map(() => F(GZ)), ntip = PP.map(() => 0)
  const dno = PP.map(() => new Uint16Array(GG)), inhs = PP.map(() => F(GG)) // per individual: hyphal density and the inhibitor it emits
  let sb = F(GG), inh = inhs[0], ib = F(GG), n = 0, ne = 0, th = 0, steps = 0, lp = 0, tp = 0, a = seed >>> 0, c = 1, s = 0, i, j, k, S, hj, fj, hx, hy, hz
  const r = _ => (a = a + 0x6D2B79F5 | 0, _ = Math.imul(a ^ a >>> 15, 1 | a), _ = _ + Math.imul(_ ^ _ >>> 7, 61 | _) ^ _, ((_ ^ _ >>> 14) >>> 0) / 4294967296),
    tri = () => r() + r() - 1,
    ci = (x, y, z) => ((z / CS | 0) * G + (y / CS | 0)) * G + (x / CS | 0),
    hi = (x, y, z) => ((z / HS | 0) * HG + (y / HS | 0)) * HG + (x / HS | 0),
    inside = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < W && y < W && z < DZ,
    rw = (p, c) => max(.1, 1 - ((wet[c] - p[WOPT]) / p[WWID]) * ((wet[c] - p[WOPT]) / p[WWID])),
    // cardinal temperature model (Rosso et al. 1993): 0 at TMIN and TMAX, 1 at TOPT
    rt = (p, T) => T <= p[TMIN] || T >= p[TMAX] ? 0 : (T - p[TMAX]) * (T - p[TMIN]) * (T - p[TMIN]) /
      ((p[TOPT] - p[TMIN]) * ((p[TOPT] - p[TMIN]) * (T - p[TOPT]) - (p[TOPT] - p[TMAX]) * (p[TOPT] + p[TMIN] - 2 * T))),
    wave = p => { p = 2 * (p - (p | 0)) - 1; return 4 * p * (1 - ab(p)) }, // a sine-like cycle made of parabolas
    ball = (cx, cy, cz, rad, t) => {
      for (let z = max(0, cz - rad | 0); z <= min(GZ - 1, cz + rad); z++) for (let y = max(0, cy - rad | 0); y <= min(G - 1, cy + rad); y++)
        for (let x = max(0, cx - rad | 0); x <= min(G - 1, cx + rad); x++) (x - cx) * (x - cx) + (y - cy) * (y - cy) + (z - cz) * (z - cz) <= rad * rad && (typ[(z * G + y) * G + x] = t)
    },
    add = (xa, ya, za, xb, yb, zb, p, sub, o) => {
      if (n >= N) return -1
      let q = n++, c = ci((xa + xb) / 2, (ya + yb) / 2, (za + zb) / 2), h = hi((xa + xb) / 2, (ya + yb) / 2, (za + zb) / 2)
      x0[q] = xa; y0[q] = ya; z0[q] = za; x1[q] = xb; y1[q] = yb; z1[q] = zb; par[q] = p; dep[q] = p < 0 ? 0 : dep[p] + 1
      si[q] = sub; ar[q] = 1; born[q] = th; st[q] = 1; own[q] = o
      nxt[q] = head[h]; head[h] = q; den[c]++; dno[o][c]++; S.len += L
      // electrical nodes: one for every eighth segment along a hypha
      if (p < 0 || dep[q] % 8 == 0) { if (ne < NE) { en[q] = ne; epar[ne] = p < 0 ? -1 : en[p]; eseg[ne] = q; ev[ne] = -1.2; ew[ne] = -.62; ne++ } else en[q] = en[p] } else en[q] = en[p]
      return q
    },
    // nearest laid hypha within the capture radius of a point (in 3D lines never exactly meet)
    // and the nearest hypha of another individual within 200 um, the range at which rivals affect each other
    near = (x, y, z, s, o) => {
      let cx = x / HS | 0, cy = y / HS | 0, cz = z / HS | 0, u, v, w, k, ax, ay, az, t, dx, dy, dz, d, best = RC * RC, foe = 4e4
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
    kill = i => { tc[tips[i][0]]--; tips[i] = tips[tips.length - 1]; tips.pop() },
    drop = k => { if (st[k] == 1) { let c = ci((x0[k] + x1[k]) / 2, (y0[k] + y1[k]) / 2, (z0[k] + z1[k]) / 2); st[k] = 2; den[c]--; dno[own[k]][c]--; S.len -= L } }

  for (i = 0; i < 256; i++) D.push(c, s), [c, s] = [c * .9996988186962042 - s * .024541228522912288, c * .024541228522912288 + s * .9996988186962042]

  // the world: soil layers (litter over organic soil over mineral soil), then what the scenario adds
  for (i = 0; i < GG; i++) { k = i / (G * G) | 0; typ[i] = scn ? k < (scn == 2 ? 5 : 2) ? 2 : k < 10 ? 5 : 0 : 4 }
  const home = inds.map((o, q) => [W / 2 + (NI > 1 ? (q ? 5200 : -5200) : 0), W / 2, [6400, 3200, 800, 1600, 1600][scn]])
  if (scn == 1) { for (const h of home) ball(h[0] / CS | 0, h[1] / CS | 0, h[2] / CS | 0, 3, 1); for (i = 0; i < 5; i++) ball(8 + r() * 48 | 0, 8 + r() * 48 | 0, 3 + r() * 12 | 0, 2 + r() * 2 | 0, 1) }
  if (scn == 3) {
    for (const h of home) ball(h[0] / CS | 0, h[1] / CS | 0, h[2] / CS | 0, 1, 3)
    for (i = 0; i < 7; i++) {
      let x = 20 + r() * 24, y = 20 + r() * 24, z = 1, dx = tri(), dy = tri(), line = []
      for (j = 0; j < 46; j++) {
        dx += tri() * .5; dy += tri() * .5; k = sq(dx * dx + dy * dy) + 1e-6; dx /= k; dy /= k; x += dx; y += dy; z += .12 + r() * .16
        if (x < 1 || y < 1 || x > G - 2 || y > G - 2 || z > GZ - 2) break
        line.push(x * CS, y * CS, z * CS); j % 5 == 4 && ball(x | 0, y | 0, z | 0, 1, 3)
      }
      roots.push(line)
    }
  }
  if (scn == 4) for (i = 0; i < GG; i++) { let x = i % G, y = (i / G | 0) % G, z = i / (G * G) | 0; x > 7 && x < 56 && (y - 32) * (y - 32) + (z - 2) * (z - 2) <= 36 && (typ[i] = 1) }
  for (i = 0; i < GG; i++) se[i] = SE0[typ[i]], wet[i] = .55 + .1 * tri()

  S = {
    W, DZ, L, G, GZ, CS, dt: dt * 3600, x0, y0, z0, x1, y1, z1, si, ar, Q, qc, st, own, typ, wet, den, tips, fr, rec, roots, SE0, volts: ev, en, trace, home,
    t: 0, mean: PP[0][TOPT] - PP[0][DROP], season: 6, daily: 3, weather: 1, tsurf: 0, rain: 0, emode: 2, volt: 0, pa: 0, pb: 0,
    len: 0, br: 0, fu: 0, wars: 0, res: 0, up: 0, flow: 0, front: 0, cords: 0, fruits: 0, alpha: 0, ntips: 0, spikes: 0, pspikes: 0,
    get n() { return n }, get ne() { return ne }, get se() { return se }, get inh() { return inhs[0] }, get tp() { return tp }, tipsOf: ntip,
    // put the two electrodes on the hyphae nearest to two points
    probe(ax, ay, az, bx, by, bz) {
      let da = 1e30, db = 1e30, d
      for (let k = 0; k < ne; k++) { let q = eseg[k]; if (st[q] != 1) continue
        d = (x1[q] - ax) * (x1[q] - ax) + (y1[q] - ay) * (y1[q] - ay) + (z1[q] - az) * (z1[q] - az); d < da && (da = d, S.pa = k)
        d = (x1[q] - bx) * (x1[q] - bx) + (y1[q] - by) * (y1[q] - by) + (z1[q] - bz) * (z1[q] - bz); d < db && (db = d, S.pb = k) }
    },
    step() {
      let p, q, f, u, e, h, t, b, g, m, o, P, x, y, z, dx, dy, dz, fsum = 0, ext = 0, up = 0, cords = 0, rain = 0
      th += dt; steps++; qr.fill(0, 0, n)

      // 0. weather: a yearly and a daily temperature cycle, damped with depth; rain wets the surface and soaks down
      S.tsurf = S.mean + (S.weather ? S.season * wave(th / 8760) + S.daily * wave(th / 24) : 0)
      for (o = 0; o < NI; o++) { res[o] = 0; ntip[o] = 0; for (k = 0; k < GZ; k++) rtL[o][k] = rt(PP[o], S.mean + (S.tsurf - S.mean) * (1 - .8 * k / GZ)) }
      if (S.weather && r() < dt / 60 || S.rain) { rain = 1; S.rain = 0; S.ev && S.ev(10, 0, 0, 0) }
      if (S.weather) for (c = GG - 1; c >= 0; c--) {
        k = c / (G * G) | 0; g = wet[c]
        k ? (f = .12 * dt * (wet[c - G * G] - g + .08), f > 0 && (g += f, wet[c - G * G] -= f * .7)) : g += rain ? .45 : -.012 * dt * g
        wet[c] = g < .05 ? .05 : g > 1 ? 1 : g
      }

      // 1. tips: extend, steer away from crowding, meet other hyphae, branch behind the tip
      for (i = 0; i < tips.length; i++) {
        t = tips[i]; s = t[0]; o = t[7]; P = PP[o]
        if (st[s] != 1) { kill(i--); continue }
        ntip[o]++
        x = x1[s]; y = y1[s]; z = z1[s]; c = ci(x, y, z)
        si[s] < 1 && pull(s, 1 - si[s])
        if (si[s] < 1) { if (++t[6] > 60) { S.ev && S.ev(2, x, y, z); kill(i--) } continue }
        t[6] = 0
        // branching happens in time, at rate E/G per tip; a branch leaves at the branch angle, in a random direction around the parent
        if (tips.length < 6000 && r() < P[E] / EM * L / P[GU] * rtL[o][z / CS | 0] * rw(P, c) * (1 - den[c] / (P[CAP] * 2)) * (1 - n / N) * (1 - n / N)) {
          b = s; for (k = 1 + (r() * 5 | 0); k-- && par[b] >= 0;) b = par[b]
          if (!brd[b] && st[b] == 1) {
            dx = t[1]; dy = t[2]; dz = t[3]
            g = tri(); f = tri(); m = tri(); e = g * dx + f * dy + m * dz; g -= e * dx; f -= e * dy; m -= e * dz; e = sq(g * g + f * f + m * m) + 1e-9
            k = ((P[BA] + tri() * P[BS] * 2.45) * 256 / 360 & 255) * 2
            brd[b] = 1; tc[b]++; S.br++; S.ev && S.ev(0, x1[b], y1[b], z1[b])
            tips.push([b, D[k] * dx + D[k + 1] * g / e, D[k] * dy + D[k + 1] * f / e, D[k] * dz + D[k + 1] * m / e, 0, 0, 0, o])
          }
        }
        t[4] += P[E] / EM * rtL[o][z / CS | 0] * rw(P, c) * min(1, .3 + t[5] * .12) * (typ[c] % 5 ? 1 : P[EXPL])
        if (t[4] < 1) continue
        t[4] -= 1
        // heading: keep going, wobble, turn down the gradient of its own inhibitor, drift toward the preferred depth
        inh = inhs[o]
        g = P[WOB] * .02; f = P[SENS] * 1.5; e = 0
        dx = t[1] + tri() * g; dy = t[2] + tri() * g; dz = t[3] + tri() * g + .15 * (P[DEPTH] - z) / DZ
        if (x > CS && y > CS && z > CS && x < W - CS && y < W - CS && z < DZ - CS) {
          e = f / (ab(inh[c + 1] - inh[c - 1]) + ab(inh[c + G] - inh[c - G]) + ab(inh[c + G * G] - inh[c - G * G]) + inh[c] + 1e-6)
          dx -= e * (inh[c + 1] - inh[c - 1]); dy -= e * (inh[c + G] - inh[c - G]); dz -= e * (inh[c + G * G] - inh[c - G * G])
        }
        e = sq(dx * dx + dy * dy + dz * dz) + 1e-9; dx /= e; dy /= e; dz /= e
        z + dz * L < 0 && (dz = ab(dz) * .3) // the soil surface: turn back down
        t[1] = dx; t[2] = dy; t[3] = dz; u = x + dx * L; e = y + dy * L; h = z + dz * L
        if (!inside(u, e, h)) { kill(i--); continue }
        si[s] -= 1; qr[s] += 1; ext++; fsum += (u - home[o][0]) * (u - home[o][0]) + (e - home[o][1]) * (e - home[o][1]) + (h - home[o][2]) * (h - home[o][2])
        near(u, e, h, s, o)
        if (hj >= 0 && den[c] > 1 && r() < P[FUSE]) { // its own hypha: fuse and close a loop
          q = add(x, y, z, hx, hy, hz, s, 0, o); q >= 0 && st[hj] == 1 && (fus.push(q, hj), fq.push(0)); S.fu++; S.ev && S.ev(1, u, e, h); kill(i--); continue
        }
        if (fj >= 0) {
          S.wars++; tc[fj] || drop(fj)
          // another individual of the same species, or a fight lost: both sides die back here and leave a barrier.
          // a fight won: the rival hypha is killed and this tip grows on into its ground
          if (inds[own[fj]].id == inds[o].id || r() >= .6 * P[CMB] / (P[CMB] + PP[own[fj]][CMB])) { S.ev && S.ev(7, u, e, h); kill(i--); continue }
          S.ev && S.ev(8, u, e, h)
        }
        f = si[s] / 2; si[s] = f; q = add(x, y, z, u, e, h, s, f, o)
        if (q < 0) { kill(i--); continue }
        tc[s]--; tc[q]++; t[0] = q; t[5]++
      }

      // 2. every hypha: uptake (strongest behind the growing front), maintenance, cord thickening, abandonment
      for (i = 0; i < n; i++) {
        if (st[i] != 1) { st[i] == 2 && (i & 7) == (steps & 7) && r() < PP[own[i]][DI] * dt * 8 && (st[i] = 3); continue }
        o = own[i]; P = PP[o]; c = ci(x1[i], y1[i], z1[i]); m = P[SMAX] * ar[i]; f = rtL[o][z1[i] / CS | 0] * rw(P, c)
        g = (th - born[i]) * P[E] / 3000; g = max(typ[c] && typ[c] < 4 ? .5 : .03, 1 / (1 + g * g)) * (ar[i] > 4 ? .2 : 1)
        u = min(P[UP] * dt * g * P[AFI[typ[c]]] * f * si[i] / (P[KU] + si[i]) * se[c] / (se[c] + 5), se[c], m - si[i])
        u > 0 && (se[c] -= u, si[i] += u * .9, up += u, upS[o] += u)
        si[i] = max(0, si[i] - P[C5] * dt)
        g = ab(Q[i] + qc[i]); ar[i] += dt * P[CR] * (1 + P[CMAX] * g / (g + 8) - ar[i]); ar[i] > 4 && cords++
        res[o] += si[i]
        if ((i & 7) == (steps & 7) && par[i] >= 0 && !tc[i] && g < .02 && th - born[i] > P[TOLD] && si[i] < .2 && r() < P[DA] * dt * 32) {
          st[par[i]] == 1 && (si[par[i]] += si[i] * .5 + .3); res[o] -= si[i]; si[i] = 0; drop(i); S.ev && S.ev(3, x1[i], y1[i], z1[i])
        }
      }

      // 3. fruiting: initials start near the surface and compete for the reserve
      for (o = 0; o < NI; o++) {
        P = PP[o]; g = upE[o] = upE[o] * .98 + upS[o] * .02; upS[o] = 0; g > upPk[o] && (upPk[o] = g)
        if (th > P[AGEF] && S.tsurf <= P[TOPT] - P[DROP] && (res[o] > 2 * P[RF] || res[o] > P[RF] && g < .6 * upPk[o]) && fr.length < 14 && r() < P[FRATE] * dt)
          for (k = 8; k--;) {
            i = r() * n | 0
            if (st[i] == 1 && own[i] == o && z1[i] < 2400 && si[i] > 1 && !fr.some(v => (v.x - x1[i]) * (v.x - x1[i]) + (v.y - y1[i]) * (v.y - y1[i]) < 9e6)) { fr.push({ i, o, x: x1[i], y: y1[i], z: z1[i], m: 0, s: 0, q: 0 }); S.ev && S.ev(4, x1[i], y1[i], z1[i]); break }
          }
      }
      for (const v of fr) if (!v.s) {
        g = dt * .3 * (1 + v.m * .2); st[v.i] == 1 && si[v.i] < g && pull(v.i, g - si[v.i])
        g = st[v.i] == 1 ? min(si[v.i], g) : 0
        si[v.i] -= g; v.m += g; qr[v.i] += g
        if (g < .01) { if (++v.q > 80) { v.s = 2; st[v.i] == 1 && (si[v.i] += v.m * .5); S.ev && S.ev(5, v.x, v.y, v.z) } } else v.q = 0
        if (v.m >= PP[v.o][MM]) { v.s = 1; S.fruits++; S.ev && S.ev(6, v.x, v.y, v.z) }
      }

      // 4. growth-induced flow on the tree, then Hardy Cross relaxation around the loops that fusions close
      for (i = n - 1, f = 0; i >= 0; i--) { p = par[i]; p >= 0 ? st[i] == 1 && (qr[p] += qr[i]) : f += qr[i]; Q[i] = Q[i] * .95 + qr[i] * .05 }
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

      // 5. translocation: diffusion along hyphae, surplus pushed toward the centre, loop flow across fusions
      for (k = min(8, max(2, dt * 10 + .5 | 0)); k--;) {
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

      // 6. fields: root tips resupplied, agar substrate spreads, hyphae emit an inhibitor that spreads and decays
      for (c = 0; c < GG; c++) {
        typ[c] == 3 && (se[c] = min(40, se[c] + 6 * dt))
        x = c % G; y = (c / G | 0) % G; z = c / (G * G) | 0
        b = x && y && z && x < G - 1 && y < G - 1 && z < GZ - 1
        for (o = 0; o < NI; o++) { inh = inhs[o]; (o ? sb : ib)[c] = b ? inh[c] * .95 + .14 * (inh[c - 1] + inh[c + 1] + inh[c - G] + inh[c + G] + inh[c - G * G] + inh[c + G * G] - 6 * inh[c]) + dno[o][c] * .05 : 0 }
        scn || NI > 1 || (sb[c] = b ? se[c] + .14 * (se[c - 1] + se[c + 1] + se[c - G] + se[c + G] + se[c - G * G] + se[c + G * G] - 6 * se[c]) : se[c])
      }
      c = inhs[0]; inhs[0] = ib; ib = c; NI > 1 && inhs[1].set(sb)
      scn || NI > 1 || se.set(sb) // (with two individuals the spare buffer is in use, so agar substrate does not spread)

      // 7. electrical activity on a coarser graph (one node per 0.8 mm of hypha), on its own faster clock
      P = PP[0]; g = dt * 60 / P[SPI]; m = min(160, max(1, g * 160 + .5 | 0)); h = min(.25, g * 40 / m) // m sub-steps of h time units; 40 units = one spike interval.
      S.tdt = h / 40 * P[SPI] * 60 // seconds per sample. Slow growers would need more sub-steps than the cap allows, so they sample only part of each step
      if (S.emode) {
        for (k = 0; k < ne; k++) { q = eseg[k]; eI[k] = st[q] == 1 ? .45 + (rain && z1[q] < 1600 ? .5 : 0) : -9 } // every live node is driven just into its rhythmic range
        for (const t of tips) eI[en[t[0]]] > -9 && eI[en[t[0]]] < .5 && (eI[en[t[0]]] += .1) // a node with a growing tip on its stretch of hypha runs a little faster and leads
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
        }
      }

      // signals
      S.t = th * 3600; S.ntips = tips.length; S.res = res[0] + (res[1] || 0); S.up = up / dt; S.cords = cords
      S.alpha = S.fu / (4 * S.br + 2 * 10 * NI - 3)
      ext && (S.front = sq(fsum / ext))
      steps % 10 || rec.length < 6000 && rec.push([th, tips.length, S.len, S.res, S.up, S.flow, S.front, S.fruits, S.tsurf, S.spikes, S.wars])
    }
  }

  // inocula: ten hyphae from each individual's starting point, spread over a sphere
  inds.forEach((o, q) => {
    for (i = 0; i < 10; i++) {
      let dx = tri(), dy = tri(), dz = tri() * .5, e = sq(dx * dx + dy * dy + dz * dz) + 1e-9, h = home[q]
      dx /= e; dy /= e; dz /= e; c = add(h[0], h[1], h[2], h[0] + dx * L, h[1] + dy * L, h[2] + dz * L, -1, o.p[SMAX], q); tc[c]++; tips.push([c, dx, dy, dz, 0, 9, 0, q])
    }
  })
  S.probe(home[0][0], home[0][1], home[0][2], home[0][0] + 4000, home[0][1], home[0][2])
  return S
}
