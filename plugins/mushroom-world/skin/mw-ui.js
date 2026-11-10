// Mushroom World's controls: small web components that talk only to window.synthland, with the same attribute
// names as SynthLand's own (sl-knob param label size, sl-choice param label select, sl-keyboard, sl-meter,
// sl-preset-browser), so the skin moves over by swapping the tag names or by restyling SynthLand's components.
// A knob is a cap seen from below: gills for the ticks, a spore for the pointer.
const host = () => window.synthland
const fmt = (p, v) => {
  if (!p) return ''
  if (p.type == 'choice') return p.choices[Math.round(v)]
  const a = Math.abs(v), s = p.type == 'int' ? String(Math.round(v)) : a >= 100 ? v.toFixed(0) : a >= 10 ? v.toFixed(1) : v.toFixed(2)
  return (p.unit == 'dB' && v <= p.min + .01 && p.min <= -59 ? 'off' : (p.unit == 'dB' && v > 0 ? '+' : '') + s) + (p.unit && !(p.unit == 'dB' && v <= p.min + .01 && p.min <= -59) ? ' ' + p.unit : '')
}
class Param extends HTMLElement {
  async connectedCallback() {
    if (this.live) return; this.live = true; await host().ready()
    this.id_ = this.getAttribute('param'); this.p = host().params().find(p => p.id == this.id_)
    if (!this.p) { this.hidden = true; return }
    this.build(); this.show(host().get(this.id_)); this.off = host().onParam((id, v) => id == this.id_ && this.show(v))
    this.addEventListener('pointerenter', () => this.dispatchEvent(new CustomEvent('mw-hint', { bubbles: true, detail: this.p })))
  }
  disconnectedCallback() { this.off && this.off(); this.live = false }
  set(v) { host().set(this.id_, v) }
}
customElements.define('mw-knob', class extends Param {
  build() {
    const big = this.getAttribute('size') == 'large', gills = Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2, r1 = i % 2 ? 17 : 9; return `<line x1="${Math.cos(a) * r1}" y1="${Math.sin(a) * r1}" x2="${Math.cos(a) * 31}" y2="${Math.sin(a) * 31}"/>` }).join('')
    this.innerHTML = `<svg viewBox="-50 -50 100 100" class="${big ? 'big' : ''}"><path class="track" d="${arc(0, 1)}"/><path class="arc"/><g class="cap"><circle r="34" class="flesh"/><g class="gills">${gills}</g><circle r="34" class="rim"/><circle r="7" class="stem"/><circle cy="-25" r="4.6" class="spore"/></g></svg><span class="lab">${this.getAttribute('label') || this.p.name}</span><span class="val"></span>`
    const svg = this.firstChild; let y0, v0; this.title = this.p.name + (this.p.description ? ': ' + this.p.description : '')
    svg.onpointerdown = e => { if (this.hasAttribute('disabled')) return; y0 = e.clientY; v0 = this.norm(host().get(this.id_)); svg.setPointerCapture(e.pointerId); this.classList.add('drag'); host().beginGesture(this.id_) }
    svg.onpointermove = e => { if (y0 == null) return; this.set(this.real(Math.max(0, Math.min(1, v0 + (y0 - e.clientY) / (e.shiftKey ? 600 : 160))))) }
    svg.onpointerup = svg.onpointercancel = () => { y0 = null; this.classList.remove('drag'); host().endGesture(this.id_) }
    svg.ondblclick = () => this.set(this.p.type == 'choice' ? this.p.choices.indexOf(this.p.default) : this.p.default)
    svg.onwheel = e => { e.preventDefault(); this.set(this.real(Math.max(0, Math.min(1, this.norm(host().get(this.id_)) - Math.sign(e.deltaY) * .02)))) }
  }
  norm(v) { const p = this.p; return p.type == 'choice' ? v / Math.max(1, p.choices.length - 1) : (v - p.min) / (p.max - p.min) }
  real(u) { const p = this.p; return p.type == 'choice' ? Math.round(u * (p.choices.length - 1)) : p.min + u * (p.max - p.min) }
  show(v) { const u = this.norm(v); this.querySelector('.cap').setAttribute('transform', `rotate(${-135 + u * 270})`); this.querySelector('.arc').setAttribute('d', arc(0, u)); this.querySelector('.val').textContent = fmt(this.p, v) }
})
function arc(a, b) { if (b - a < .002) return ''; const pt = u => { const t = (-225 + u * 270) * Math.PI / 180; return [Math.cos(t) * 43, Math.sin(t) * 43] }, [x1, y1] = pt(a), [x2, y2] = pt(b); return `M${x1.toFixed(2)} ${y1.toFixed(2)}A43 43 0 ${(b - a) * 270 > 180 ? 1 : 0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}` }

customElements.define('mw-choice', class extends Param {
  build() {
    const lab = this.getAttribute('label'), p = this.p
    if (this.hasAttribute('select') || p.choices.length > 5) {
      this.innerHTML = `${lab ? `<span class="lab">${lab}</span>` : ''}<select>${p.choices.map((c, i) => `<option value="${i}">${c}</option>`).join('')}</select>`
      this.querySelector('select').onchange = e => this.set(+e.target.value)
    } else {
      this.innerHTML = `${lab ? `<span class="lab">${lab}</span>` : ''}<span class="seg">${p.choices.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join('')}</span>`
      this.querySelectorAll('button').forEach(b => b.onclick = () => this.set(+b.dataset.i))
    }
  }
  show(v) { const s = this.querySelector('select'); if (s) s.value = Math.round(v); else this.querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.i == Math.round(v))) }
})
// a fader: a hypha with a bead on it, beside a meter the skin fills
customElements.define('mw-fader', class extends Param {
  build() {
    this.innerHTML = `<span class="lab">${this.getAttribute('label') || this.p.name}</span><div class="rail"><canvas width="10" height="88"></canvas><div class="thread"><i></i></div></div><span class="val"></span>`
    const th = this.querySelector('.thread'), at = e => { const r = th.getBoundingClientRect(); this.set(this.p.min + Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height)) * (this.p.max - this.p.min)) }; let down = false
    th.onpointerdown = e => { down = true; th.setPointerCapture(e.pointerId); at(e) }; th.onpointermove = e => down && at(e); th.onpointerup = th.onpointercancel = () => down = false
    th.ondblclick = () => this.set(this.p.default); this.meter = this.querySelector('canvas').getContext('2d')
  }
  show(v) { this.querySelector('i').style.bottom = ((v - this.p.min) / (this.p.max - this.p.min) * 100) + '%'; this.querySelector('.val').textContent = fmt(this.p, v) }
  level(lufs, held = 0) { const m = this.meter; if (!m) return; m.clearRect(0, 0, 10, 88); const u = Math.max(0, Math.min(1, (lufs + 60) / 54)); m.fillStyle = getComputedStyle(this).getPropertyValue('--sl-foxfire') || '#7de3c3'; m.fillRect(1, 88 - u * 88, 8, u * 88); if (held > .1) { m.fillStyle = '#e08572'; m.fillRect(1, 0, 8, Math.min(30, held * 3)) } }
})
customElements.define('mw-keyboard', class extends HTMLElement {
  connectedCallback() {
    const low = +(this.getAttribute('low') || 36), n = +(this.getAttribute('keys') || 49), black = [1, 3, 6, 8, 10]; let html = ''
    for (let k = low; k < low + n; k++) html += black.includes(k % 12) ? `<div class="b" data-k="${k}"><i></i></div>` : `<div data-k="${k}">${k % 12 == 0 ? `<span>C${k / 12 - 1}</span>` : ''}</div>`
    this.innerHTML = html; let held = null
    const on = (k, vel) => { host().noteOn(k, vel); const d = this.querySelector(`[data-k="${k}"]`); d && d.classList.add('on') }, off = k => { host().noteOff(k); const d = this.querySelector(`[data-k="${k}"]`); d && d.classList.remove('on') }
    const at = e => { const t = document.elementFromPoint(e.clientX, e.clientY), d = t && t.closest('mw-keyboard > div'); return d ? +d.dataset.k : null }
    this.onpointerdown = e => { held = at(e); if (held != null) { const r = this.getBoundingClientRect(); on(held, .4 + .6 * (e.clientY - r.top) / r.height) } this.setPointerCapture(e.pointerId) }
    this.onpointermove = e => { if (held == null) return; const k = at(e); if (k != null && k != held) { off(held); held = k; on(k, .8) } }
    this.onpointerup = this.onpointercancel = () => { held != null && off(held); held = null }
    const row = 'awsedftgyhujkolp;', down = {}
    addEventListener('keydown', e => { const i = row.indexOf(e.key.toLowerCase()); if (i < 0 || down[i] || e.metaKey || e.ctrlKey || e.altKey || ['INPUT', 'SELECT'].includes(e.target.tagName)) return; down[i] = 1; on(60 + i, .8) })
    addEventListener('keyup', e => { const i = row.indexOf(e.key.toLowerCase()); if (i < 0) return; down[i] = 0; off(60 + i) })
  }
})
customElements.define('mw-meter', class extends HTMLElement {
  async connectedCallback() { this.innerHTML = '<i></i><i></i>'; await host().ready(); const [a, b] = this.children; let l = 0, r = 0; host().onMeter(m => { l = Math.max(m.outL, l * .8); r = Math.max(m.outR, r * .8); a.style.width = Math.min(100, Math.sqrt(l) * 100) + '%'; b.style.width = Math.min(100, Math.sqrt(r) * 100) + '%' }) }
})
customElements.define('mw-preset-browser', class extends HTMLElement {
  async connectedCallback() {
    await host().ready(); const list = host().presets(), cats = [...new Set(list.map(p => p.category))]
    this.innerHTML = `<button type="button" data-d="-1" aria-label="Previous preset">‹</button><select aria-label="Preset"><option value="-1">edited</option>${cats.map(c => `<optgroup label="${c}">${list.filter(p => p.category == c).map(p => `<option value="${p.index}">${p.name}</option>`).join('')}</optgroup>`).join('')}</select><button type="button" data-d="1" aria-label="Next preset">›</button>`
    const sel = this.querySelector('select'), show = i => sel.value = i; show(host().currentPreset()); host().onPreset(show)
    sel.onchange = () => +sel.value >= 0 && host().loadPreset(+sel.value)
    this.querySelectorAll('button').forEach(b => b.onclick = () => { const c = host().currentPreset(); host().loadPreset(((c < 0 ? 0 : c + +b.dataset.d) + list.length) % list.length) })
  }
})
