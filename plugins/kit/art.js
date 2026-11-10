// Shared drawing for the mushroom plugins: the ground in section, a network of hyphae, fruit bodies by form,
// spores, rain, and small helpers. Everything is drawn from numbers the plugin or its specimen supplies, and
// anything random is seeded, so a picture is the same each time. Canvas 2D only; no images are loaded.
export const TAU = Math.PI * 2
export const INK = { night: '#0b0d12', dusk: '#141a24', soil: '#1a130d', loam: '#241a11', clay: '#2e2116', hypha: '#efe6cf', gold: '#f2c94c', amber: '#d2a866', ember: '#e08572', moss: '#7fa36b', spore: '#e9dcb4', text: '#a89c82', dim: '#6f6654', water: '#8fc6e8' }
export const hash = n => { let a = (n | 0) + 0x9e3779b9 | 0; a = Math.imul(a ^ a >>> 16, 0x85ebca6b); a = Math.imul(a ^ a >>> 13, 0xc2b2ae35); return ((a ^ a >>> 16) >>> 0) / 4294967296 }
export const mix = (a, b, t) => a + (b - a) * t
export const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v
export const ease = t => t * t * (3 - 2 * t)
const hex = c => { if (c[0] != '#') { const m = c.match(/[\d.]+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]] } if (c.length == 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3]; const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255] } // '#rrggbb', '#rgb' or 'rgb(r,g,b)'
export const rgba = (c, a = 1) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})` }
export const blend = (c1, c2, t) => { const a = hex(c1), b = hex(c2); return `rgb(${a.map((v, i) => Math.round(mix(v, b[i], t))).join(',')})` }
export const shade = (c, k) => blend(c, k < 0 ? '#000000' : '#ffffff', Math.abs(k))

export const text = (g, s, x, y, o = {}) => { g.font = `${o.weight || 400} ${o.size || 22}px ${o.serif ? 'Georgia, serif' : 'system-ui, sans-serif'}`; g.fillStyle = o.colour || INK.text; g.textAlign = o.align || 'left'; g.fillText(s, x, y); g.textAlign = 'left' }

// The ground in section: night air above `horizon` (0..1 of the height), then litter, soil and clay, with
// stones and a few roots. `wet` 0..1 darkens it. Returns the y of the surface.
export const ground = (g, w, h, o = {}) => {
  const y0 = h * (o.horizon == null ? .3 : o.horizon), seed = o.seed || 7
  let gr = g.createLinearGradient(0, 0, 0, y0); gr.addColorStop(0, INK.night); gr.addColorStop(1, o.sky || INK.dusk); g.fillStyle = gr; g.fillRect(0, 0, w, y0)
  if (o.stars !== false) for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(233,220,180,${.08 + .25 * hash(seed + i * 3)})`; g.fillRect(hash(seed + i) * w, hash(seed + i * 7) * y0 * .9, 2, 2) }
  gr = g.createLinearGradient(0, y0, 0, h); gr.addColorStop(0, blend(INK.clay, '#000000', (o.wet || 0) * .35)); gr.addColorStop(.12, blend(INK.loam, '#000000', (o.wet || 0) * .3)); gr.addColorStop(1, INK.soil); g.fillStyle = gr; g.fillRect(0, y0, w, h - y0)
  for (let i = 0; i < 90; i++) { const x = hash(seed + i * 11) * w, y = y0 + 10 + hash(seed + i * 13) * (h - y0 - 14), r = 1.5 + hash(seed + i * 17) * (y - y0) / (h - y0) * 9; g.fillStyle = `rgba(${90 + hash(i) * 40 | 0},${72 + hash(i + 5) * 30 | 0},${52 + hash(i + 9) * 20 | 0},${.12 + .18 * hash(seed + i * 19)})`; g.beginPath(); g.ellipse(x, y, r * 1.4, r, hash(i) * 3, 0, TAU); g.fill() }
  // the litter line
  g.strokeStyle = rgba('#5a4630', .9); g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= w; x += 16) g.lineTo(x, y0 + Math.sin(x * .021 + seed) * 3 + (hash(seed + x) - .5) * 4); g.stroke()
  if (o.litter !== false) for (let i = 0; i < 26; i++) { const x = hash(seed + i * 23) * w, a = hash(seed + i * 29) * 3; g.strokeStyle = rgba(['#6b4f2c', '#7a5a2e', '#4f5a30'][i % 3], .55); g.lineWidth = 3; g.beginPath(); g.moveTo(x, y0 - 1); g.lineTo(x + Math.cos(a) * 16, y0 - 2 - Math.abs(Math.sin(a)) * 5); g.stroke() }
  return y0
}

// A reduced network (a specimen stage, or a live one) seen from above and fitted to a box.
//   o.colour, o.glow(i, x, y) -> 0..1 light at a point, o.grown 0..1 shows only the part within that share of its
//   reach, o.pulse: [{ at: 0..1, colour }] rings of light moving out from the centre, o.tilt squashes it to lie flat,
//   o.flow 0..1 brightens thick cords, o.alpha.  Returns { px, py, n, r(i) } for placing other things on it.
export const network = (g, stage, x, y, w, h, o = {}) => {
  const xy = stage.xy, E = stage.edges, n = xy.length / 2, tilt = o.tilt || 1; let m = 1
  for (let i = 0; i < xy.length; i++) m = Math.max(m, Math.abs(xy[i]))
  const s = Math.min(w, h / tilt) / 2 / m * (o.fit || .94), cx = x + w / 2, cy = y + h / 2, px = i => cx + xy[i * 2] * s, py = i => cy + xy[i * 2 + 1] * s * tilt
  const rr = i => Math.hypot(xy[i * 2], xy[i * 2 + 1]) / m, grown = o.grown == null ? 1 : o.grown, col = o.colour || INK.hypha, A = o.alpha == null ? 1 : o.alpha
  g.save(); g.lineCap = 'round'
  for (let pass = 0; pass < 2; pass++) { // a soft halo, then the threads
    for (let e = 0; e < E.length; e += 3) {
      const a = E[e], b = E[e + 1]; if (Math.max(rr(a), rr(b)) > grown) continue
      const th = Math.min(10, .7 + Math.sqrt(E[e + 2]) * .9), thick = E[e + 2] > 2
      g.beginPath(); g.moveTo(px(a), py(a)); g.lineTo(px(b), py(b))
      if (pass == 0) { g.strokeStyle = rgba(col, .07 * A + (thick ? (o.flow || 0) * .12 : 0)); g.lineWidth = th * 5 } else { g.strokeStyle = rgba(thick && o.cord ? o.cord : col, (.5 + .35 * Math.min(1, E[e + 2] / 6)) * A); g.lineWidth = th }
      g.stroke()
    }
  }
  for (const p of o.pulse || []) { // light moving out along the threads
    for (let e = 0; e < E.length; e += 3) { const a = E[e], b = E[e + 1], ra = rr(a), rb = rr(b), lo = Math.min(ra, rb), hi = Math.max(ra, rb); if (p.at < lo - .03 || p.at > hi + .03 || hi > grown) continue; const t = hi - lo < 1e-6 ? .5 : clamp((p.at - lo) / (hi - lo)), u = ra < rb ? t : 1 - t, X = mix(px(a), px(b), u), Y = mix(py(a), py(b), u); const rad = (p.size || 6); const gd = g.createRadialGradient(X, Y, 0, X, Y, rad * 2.4); gd.addColorStop(0, rgba(p.colour || INK.gold, .9 * (p.a == null ? 1 : p.a))); gd.addColorStop(1, rgba(p.colour || INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(X, Y, rad * 2.4, 0, TAU); g.fill() }
  }
  if (o.glow) for (let i = 0; i < n; i++) { if (rr(i) > grown) continue; const a = o.glow(i, xy[i * 2] / m, xy[i * 2 + 1] / m); if (a > .02) { const X = px(i), Y = py(i), R = 5 + a * 16, gd = g.createRadialGradient(X, Y, 0, X, Y, R); gd.addColorStop(0, rgba(o.glowColour || INK.gold, Math.min(1, a))); gd.addColorStop(1, rgba(o.glowColour || INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(X, Y, R, 0, TAU); g.fill() } }
  if (o.tips) { // growing tips: the points furthest out, breathing
    for (let i = 0; i < n; i++) if (rr(i) > grown * .82 && rr(i) <= grown) { g.fillStyle = rgba('#ffffff', .25 + .25 * Math.sin((o.t || 0) * 3 + i)); g.beginPath(); g.arc(px(i), py(i), 2.2, 0, TAU); g.fill() }
  }
  g.restore()
  return { px, py, n, r: rr, cx, cy, scale: s, m }
}

// One hypha in close-up, running left to right: a tube with cross-walls, cytoplasm streaming, and vesicles
// gathering at the tip. o.len 0..1, o.pressure 0..1 swells it, o.t time, o.pulses [0..1 positions of light].
export const hypha = (g, x, y, len, r, o = {}) => {
  const col = o.colour || INK.hypha, t = o.t || 0, R = r * (1 + .12 * (o.pressure || 0)), wob = o.wobble || 0
  const yy = u => y + Math.sin(u * 9 + t * (o.shake || 0)) * wob
  g.save(); g.lineCap = 'round'
  g.strokeStyle = rgba(col, .1); g.lineWidth = R * 3.2; g.beginPath(); for (let u = 0; u <= 1.001; u += .04) g.lineTo(x + u * len, yy(u)); g.stroke()
  g.strokeStyle = rgba(col, .85); g.lineWidth = R * 2; g.beginPath(); for (let u = 0; u <= 1.001; u += .04) g.lineTo(x + u * len, yy(u)); g.stroke()
  g.strokeStyle = rgba(shade(col, -.55), .9); g.lineWidth = R * 1.45; g.beginPath(); for (let u = 0; u <= 1.001; u += .04) g.lineTo(x + u * len, yy(u)); g.stroke()
  for (let k = 1; k < (o.walls || 5); k++) { const u = k / (o.walls || 5); g.strokeStyle = rgba(col, .6); g.lineWidth = 2; g.beginPath(); g.moveTo(x + u * len, yy(u) - R); g.lineTo(x + u * len, yy(u) + R); g.stroke() }
  for (let i = 0; i < 46; i++) { const u = (hash(i * 7) + t * (.05 + .1 * (o.flow == null ? .5 : o.flow)) * (.5 + hash(i))) % 1, v = (hash(i * 13) - .5) * 1.1; g.fillStyle = rgba(col, .25 + .5 * u * u); g.beginPath(); g.arc(x + u * len, yy(u) + v * R * .6, 1.2 + u * 1.6, 0, TAU); g.fill() }
  const gd = g.createRadialGradient(x + len, yy(1), 0, x + len, yy(1), R * 2.2); gd.addColorStop(0, rgba(INK.gold, .5 + .4 * (o.pressure || 0))); gd.addColorStop(1, rgba(INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(x + len, yy(1), R * 2.2, 0, TAU); g.fill()
  for (const p of o.pulses || []) { const X = x + clamp(p) * len, gd2 = g.createRadialGradient(X, yy(p), 0, X, yy(p), R * 3); gd2.addColorStop(0, rgba(o.pulseColour || '#9fe8ff', .85)); gd2.addColorStop(1, rgba(o.pulseColour || '#9fe8ff', 0)); g.fillStyle = gd2; g.beginPath(); g.arc(X, yy(p), R * 3, 0, TAU); g.fill() }
  g.restore()
}

// A fruit body in side view, standing on (x, y), about `size` pixels across its widest part.
//   form: one of the species' forms. colours: [mycelium, cap, stem]. o.grown 0..1 (a pin to full size),
//   o.light 0..1 a glow (it has just sounded), o.sway radians, o.under: also show the gills from below.
export const mushroom = (g, x, y, size, form, colours, o = {}) => {
  const cap = colours[1] || '#b9a98a', stem = colours[2] || '#e8e2d2', k = ease(clamp(o.grown == null ? 1 : o.grown)), S = size * (.18 + .82 * k), L = o.light || 0
  g.save(); g.translate(x, y); g.rotate(o.sway || 0); g.lineJoin = 'round'; g.lineCap = 'round'
  const halo = (cy, r) => { if (L > .02) { const gd = g.createRadialGradient(0, cy, 0, 0, cy, r); gd.addColorStop(0, rgba(o.lightColour || INK.gold, .55 * L)); gd.addColorStop(1, rgba(o.lightColour || INK.gold, 0)); g.fillStyle = gd; g.beginPath(); g.arc(0, cy, r, 0, TAU); g.fill() } }
  const fill = (c, top, bottom) => { const gd = g.createLinearGradient(0, top, 0, bottom); gd.addColorStop(0, shade(c, .18 + .3 * L)); gd.addColorStop(1, shade(c, -.35)); return gd }
  const stalk = (hgt, wd, c = stem) => { g.fillStyle = fill(c, -hgt, 0); g.beginPath(); g.moveTo(-wd * .62, 0); g.quadraticCurveTo(-wd * .3, -hgt * .5, -wd * .42, -hgt); g.lineTo(wd * .42, -hgt); g.quadraticCurveTo(wd * .3, -hgt * .5, wd * .62, 0); g.closePath(); g.fill() }
  const dome = (cy, rx, ry, c = cap, flat = .25) => { g.fillStyle = fill(c, cy - ry, cy + ry * flat); g.beginPath(); g.moveTo(-rx, cy); g.bezierCurveTo(-rx, cy - ry * 1.25, rx, cy - ry * 1.25, rx, cy); g.quadraticCurveTo(0, cy + ry * flat, -rx, cy); g.fill() }
  const gills = (cy, rx, ry) => { g.strokeStyle = rgba(shade(cap, -.6), .7); g.lineWidth = 1.2; for (let i = -7; i <= 7; i++) { g.beginPath(); g.moveTo(i / 7 * rx * .96, cy + ry * .02); g.lineTo(i / 7 * rx * .12, cy + ry * .2); g.stroke() } }
  switch (form) {
    case 'bolete': halo(-S * .8, S); stalk(S * .7, S * .42); dome(-S * .68, S * .55, S * .5, cap, .3); g.fillStyle = rgba(shade(cap, .5), .5); g.beginPath(); g.ellipse(0, -S * .62, S * .5, S * .07, 0, 0, TAU); g.fill(); break
    case 'bracket': case 'crust': { halo(-S * .2, S); const n = form == 'crust' ? 1 : 3; for (let i = 0; i < n; i++) { const yy = -i * S * .2, r = S * (.5 - i * .1); g.fillStyle = fill(shade(cap, i * .08), yy - r * .5, yy); g.beginPath(); g.moveTo(-r * .2, yy); g.bezierCurveTo(-r * .2, yy - r * (form == 'crust' ? .25 : .7), r, yy - r * .55, r, yy - r * .06); g.quadraticCurveTo(r * .5, yy + r * .1, -r * .2, yy); g.fill(); g.strokeStyle = rgba(shade(cap, .5), .35); g.lineWidth = 1.5; for (let b = 1; b < 4; b++) { g.beginPath(); g.ellipse(r * .35, yy - r * .1, r * .6 * b / 4, r * .34 * b / 4, -.25, Math.PI, TAU); g.stroke() } } break }
    case 'puffball': case 'truffle': case 'earthstar': halo(-S * .4, S); if (form == 'earthstar') { g.fillStyle = shade(cap, -.4); for (let i = 0; i < 7; i++) { const a = Math.PI + i / 6 * Math.PI; g.beginPath(); g.moveTo(0, -S * .05); g.lineTo(Math.cos(a) * S * .7, Math.sin(a) * S * .16 - S * .02); g.lineTo(Math.cos(a + .25) * S * .3, -S * .08); g.fill() } } g.fillStyle = fill(cap, -S * .8, 0); g.beginPath(); g.ellipse(0, -S * .38, S * .42, S * .4, 0, 0, TAU); g.fill(); for (let i = 0; i < 22; i++) { g.fillStyle = rgba(shade(cap, form == 'truffle' ? -.6 : .5), .4); g.beginPath(); g.arc((hash(i * 3) - .5) * S * .7, -S * .38 + (hash(i * 5) - .5) * S * .62, S * .018, 0, TAU); g.fill() } if (form != 'truffle') { g.fillStyle = shade(cap, -.7); g.beginPath(); g.ellipse(0, -S * .77, S * .06, S * .025, 0, 0, TAU); g.fill() } break
    case 'morel': halo(-S * .9, S); stalk(S * .55, S * .34); g.fillStyle = fill(cap, -S * 1.4, -S * .5); g.beginPath(); g.moveTo(-S * .3, -S * .52); g.bezierCurveTo(-S * .42, -S * 1.05, -S * .1, -S * 1.42, 0, -S * 1.42); g.bezierCurveTo(S * .1, -S * 1.42, S * .42, -S * 1.05, S * .3, -S * .52); g.closePath(); g.fill(); g.strokeStyle = rgba(shade(cap, -.6), .8); g.lineWidth = 2; for (let r = 0; r < 5; r++) for (let c = -2; c <= 2; c++) { const wd = S * .3 * (1 - r * .14), X = c / 2.4 * wd + (r % 2 ? wd * .2 : 0), Y = -S * .62 - r * S * .16; if (Math.abs(X) < wd) { g.beginPath(); g.ellipse(X, Y, S * .05, S * .07, 0, 0, TAU); g.stroke() } } break
    case 'coral': case 'club': { halo(-S * .6, S); const br = (X, Y, a, len, d) => { const X2 = X + Math.sin(a) * len, Y2 = Y - Math.cos(a) * len; g.strokeStyle = shade(cap, .1 * d - .1 + .3 * L); g.lineWidth = Math.max(2, S * .09 * (1 - d * .22)); g.beginPath(); g.moveTo(X, Y); g.lineTo(X2, Y2); g.stroke(); if (d < (form == 'club' ? 0 : 3)) { br(X2, Y2, a - .35 - hash(d * 7 + X) * .2, len * .72, d + 1); br(X2, Y2, a + .35 + hash(d * 11 + X) * .2, len * .72, d + 1) } }; if (form == 'club') { g.fillStyle = fill(cap, -S * 1.2, 0); g.beginPath(); g.moveTo(-S * .08, 0); g.bezierCurveTo(-S * .1, -S * .6, -S * .24, -S * 1.2, 0, -S * 1.22); g.bezierCurveTo(S * .24, -S * 1.2, S * .1, -S * .6, S * .08, 0); g.fill() } else for (let i = -1; i <= 1; i++) br(i * S * .06, 0, i * .3, S * .34, 0); break }
    case 'cup': case 'birdsnest': halo(-S * .2, S); g.fillStyle = fill(shade(cap, -.2), -S * .5, 0); g.beginPath(); g.moveTo(-S * .5, -S * .45); g.quadraticCurveTo(-S * .3, 0, 0, 0); g.quadraticCurveTo(S * .3, 0, S * .5, -S * .45); g.closePath(); g.fill(); g.fillStyle = shade(cap, .25 + .3 * L); g.beginPath(); g.ellipse(0, -S * .45, S * .5, S * .12, 0, 0, TAU); g.fill(); g.fillStyle = shade(cap, -.3); g.beginPath(); g.ellipse(0, -S * .43, S * .4, S * .08, 0, 0, TAU); g.fill(); if (form == 'birdsnest') for (let i = -1; i <= 1; i++) { g.fillStyle = '#d8d2c2'; g.beginPath(); g.ellipse(i * S * .16, -S * .42, S * .07, S * .035, 0, 0, TAU); g.fill() } break
    case 'chanterelle': halo(-S * .7, S); g.fillStyle = fill(cap, -S, 0); g.beginPath(); g.moveTo(-S * .1, 0); g.bezierCurveTo(-S * .12, -S * .5, -S * .5, -S * .7, -S * .56, -S * .95); g.quadraticCurveTo(0, -S * .78, S * .56, -S * .95); g.bezierCurveTo(S * .5, -S * .7, S * .12, -S * .5, S * .1, 0); g.closePath(); g.fill(); g.strokeStyle = rgba(shade(cap, -.5), .6); g.lineWidth = 1.5; for (let i = -5; i <= 5; i++) { g.beginPath(); g.moveTo(i * S * .016, -S * .1); g.quadraticCurveTo(i * S * .04, -S * .55, i * S * .1, -S * .86); g.stroke() } break
    case 'stinkhorn': halo(-S * 1.1, S); stalk(S * 1.25, S * .24, '#f2efe6'); g.fillStyle = fill(cap, -S * 1.5, -S * 1.1); g.beginPath(); g.ellipse(0, -S * 1.28, S * .16, S * .24, 0, 0, TAU); g.fill(); g.fillStyle = '#e9e4d6'; g.beginPath(); g.ellipse(0, -S * .02, S * .22, S * .14, 0, 0, TAU); g.fill(); break
    case 'jelly': halo(-S * .3, S); for (let i = 0; i < 5; i++) { g.fillStyle = rgba(shade(cap, (i % 2) * .15 + .3 * L), .8); g.beginPath(); g.ellipse((i - 2) * S * .15, -S * .2 - hash(i * 3) * S * .18, S * .2, S * .16 + hash(i) * S * .1, hash(i) - .5, 0, TAU); g.fill() } break
    case 'tooth': halo(-S * .5, S); g.fillStyle = fill(cap, -S * .9, -S * .4); g.beginPath(); g.ellipse(0, -S * .62, S * .5, S * .3, 0, 0, TAU); g.fill(); g.strokeStyle = shade(cap, .2 + .3 * L); g.lineWidth = 2.2; for (let i = -12; i <= 12; i++) { const X = i / 12 * S * .46, Y = -S * .62 + Math.sqrt(Math.max(0, 1 - (i / 12) ** 2)) * S * .22; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + Math.sin((o.t || 0) * 1.5 + i) * 1.5, Y + S * (.28 + .2 * hash(i * 3))); g.stroke() } break
    case 'none': g.fillStyle = shade(cap, -.3); g.beginPath(); g.arc(0, S * .12, Math.max(3, S * .12), 0, TAU); g.fill(); break
    default: { // an agaric: stem, cap, gills, sometimes a ring
      const hgt = S * (.95 + .2 * k), rx = S * .5 * (.45 + .55 * k), ry = S * (.42 - .14 * k)
      halo(-hgt, S * 1.1); stalk(hgt, S * .2)
      if (o.under) { g.fillStyle = shade(cap, -.5); g.beginPath(); g.ellipse(0, -hgt, rx, ry * .28, 0, 0, TAU); g.fill(); gills(-hgt, rx, ry * 1.2) }
      dome(-hgt, rx, ry, cap, o.under ? -.12 : .22)
      if (o.spots !== false && hash(cap.charCodeAt(1) + cap.charCodeAt(3)) > .6) for (let i = 0; i < 9; i++) { g.fillStyle = rgba('#fff8e8', .7); g.beginPath(); g.ellipse((hash(i * 3) - .5) * rx * 1.5, -hgt - ry * (.25 + hash(i * 5) * .55), rx * .06, rx * .04, 0, 0, TAU); g.fill() }
    }
  }
  g.restore()
}

// A cap seen from below: the gills as spokes. o.light per-gill function (i, n) -> 0..1, o.rings: nodal circles
// (0..1 radii) drawn as fine dust lines, as sand gathers on a vibrating plate.
export const capUnder = (g, x, y, r, colours, o = {}) => {
  const cap = colours[1] || '#b9a98a', n = o.gills || 36
  const gd = g.createRadialGradient(x, y, r * .1, x, y, r); gd.addColorStop(0, shade(cap, -.25)); gd.addColorStop(.92, shade(cap, -.5)); gd.addColorStop(1, shade(cap, .1)); g.fillStyle = gd; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill()
  for (let i = 0; i < n; i++) { const a = i / n * TAU + (o.turn || 0), L = o.light ? o.light(i, n) : 0, wob = L * Math.sin((o.t || 0) * 40 + i) * r * .012; g.strokeStyle = L > .02 ? rgba(INK.gold, .25 + .75 * L) : rgba(shade(cap, .35), .5); g.lineWidth = 1.2 + L * 3; g.beginPath(); g.moveTo(x + Math.cos(a) * r * .14, y + Math.sin(a) * r * .14); g.lineTo(x + Math.cos(a + wob) * r * .97, y + Math.sin(a + wob) * r * .97); g.stroke(); if (i % 2 == 0) { g.strokeStyle = rgba(shade(cap, .2), .3); g.lineWidth = 1; g.beginPath(); g.moveTo(x + Math.cos(a + Math.PI / n) * r * .55, y + Math.sin(a + Math.PI / n) * r * .55); g.lineTo(x + Math.cos(a + Math.PI / n) * r * .97, y + Math.sin(a + Math.PI / n) * r * .97); g.stroke() } }
  for (const [rad, a] of o.rings || []) { g.strokeStyle = rgba(INK.spore, a); g.lineWidth = 2; g.setLineDash([2, 5]); g.beginPath(); g.arc(x, y, r * rad, 0, TAU); g.stroke(); g.setLineDash([]) }
  g.fillStyle = shade(colours[2] || '#e8e2d2', -.1); g.beginPath(); g.arc(x, y, r * .13, 0, TAU); g.fill()
}

// Spores: `n` motes drifting in a box. They rise from (o.from) if given, or fill the box; o.wind bends them,
// o.fall makes them settle. Seeded, and a pure function of time.
export const spores = (g, n, x, y, w, h, t, o = {}) => {
  const col = o.colour || INK.spore
  for (let i = 0; i < n; i++) {
    const life = (hash(i * 3 + (o.seed || 0)) + t * (.04 + .08 * hash(i * 7)) * (o.speed || 1)) % 1
    let X, Y
    if (o.from) { const a = -Math.PI / 2 + (hash(i * 11) - .5) * (o.spread || 1.6); X = o.from[0] + Math.cos(a) * life * w * .5 + (o.wind || 0) * life * life * w * .6 + Math.sin(t * .7 + i) * 6; Y = o.from[1] + Math.sin(a) * life * h * .6 + (o.fall || 0) * life * life * h * .7 }
    else { X = x + ((hash(i * 5) + (o.wind || 0) * t * .03 * (.5 + hash(i))) % 1 + 1) % 1 * w + Math.sin(t * .5 + i) * 8; Y = y + ((hash(i * 9) + (o.fall || 0) * life) % 1) * h }
    const a = (o.alpha == null ? .7 : o.alpha) * Math.sin(life * Math.PI); g.fillStyle = rgba(col, a); g.beginPath(); g.arc(X, Y, (o.size || 1.6) * (.6 + hash(i)), 0, TAU); g.fill()
  }
}

// Rain: slanted streaks above the surface y0, with splashes on it. amount 0..1.
export const rain = (g, w, y0, t, amount, o = {}) => {
  const n = amount * 140 | 0; g.strokeStyle = rgba(INK.water, .35); g.lineWidth = 1.5
  for (let i = 0; i < n; i++) { const u = (hash(i * 3) + t * (1.1 + hash(i) * .8)) % 1, X = hash(i * 7) * w + u * 30, Y = u * y0; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + 5, Y + 20); g.stroke(); if (u > .93) { g.strokeStyle = rgba(INK.water, .5 * (1 - (u - .93) / .07)); g.beginPath(); g.ellipse(hash(i * 7) * w + 30, y0, (u - .93) * 260, (u - .93) * 60, 0, Math.PI, TAU); g.stroke(); g.strokeStyle = rgba(INK.water, .35) } }
}

// A ring of light spreading from a point: age 0..1.
export const ripple = (g, x, y, r, age, colour = INK.gold, squash = 1) => { if (age < 0 || age > 1) return; g.strokeStyle = rgba(colour, (1 - age) * .8); g.lineWidth = 3 * (1 - age) + 1; g.beginPath(); g.ellipse(x, y, r * age, r * age * squash, 0, 0, TAU); g.stroke() }

// A line graph of values (any range) fitted to a box; o.fill shades under it, o.at marks a position 0..1.
export const graph = (g, v, x, y, w, h, o = {}) => {
  if (!v || !v.length) return; let lo = o.lo == null ? Math.min(...v) : o.lo, hi = o.hi == null ? Math.max(...v) : o.hi; if (hi - lo < 1e-12) hi = lo + 1
  const X = i => x + i / (v.length - 1) * w, Y = i => y + h - (v[i] - lo) / (hi - lo) * h
  g.beginPath(); for (let i = 0; i < v.length; i++) g.lineTo(X(i), Y(i))
  if (o.fill) { g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = o.fill; g.fill(); g.beginPath(); for (let i = 0; i < v.length; i++) g.lineTo(X(i), Y(i)) }
  g.strokeStyle = o.colour || INK.amber; g.lineWidth = o.width || 2.5; g.stroke()
  if (o.at != null) { const i = clamp(o.at) * (v.length - 1), a = i | 0, b = Math.min(v.length - 1, a + 1), yy = mix(Y(a), Y(b), i - a); g.fillStyle = INK.gold; g.beginPath(); g.arc(x + clamp(o.at) * w, yy, 7, 0, TAU); g.fill(); g.strokeStyle = rgba(INK.gold, .35); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + clamp(o.at) * w, y); g.lineTo(x + clamp(o.at) * w, y + h); g.stroke() }
}

// Remembers recent values of something a plugin reports, so a drawing can show a short history or notice a
// change (a counter going up means something just happened). Keyed by name; lives as long as the page.
const MEM = {}
export const memory = (key, value, n = 240) => { const m = MEM[key] || (MEM[key] = []); m.push(value); if (m.length > n) m.shift(); return m }
// Returns how long ago (s) `value` last changed, given the time now; a drawing uses it to flash.
const LAST = {}
export const since = (key, value, t) => { const l = LAST[key] || (LAST[key] = { v: value, t: -99 }); if (l.v !== value) { l.v = value; l.t = t } return t - l.t }
// the specimen stage nearest a 0..1 position
export const stageOf = (spec, pos) => spec.stages[Math.round(clamp(pos) * (spec.stages.length - 1))]
// a caption strip along the bottom
export const caption = (g, w, h, lines) => { lines.forEach((s, i) => text(g, s, 22, h - 18 - (lines.length - 1 - i) * 28)) }
