// A ruler you scrub instead of a slider you nudge (ButtonErasRuler.swift): a
// row of hairline ticks that swell into a bell around the indicator, with
// the years set beneath. The position is continuous, so whatever it drives
// can morph mid-drag; on release it springs to the nearest year.

import { clamp } from '../core/ink'
import { h, px } from '../core/dom'

const TICKS_PER_YEAR = 3
const TICK_AREA = 56
const LABEL_AREA = 22
const INSET = 14

export interface RulerOptions {
  years: number[]
  position: number
  /** CSS colour of the ticks and labels. */
  ink?: [number, number, number]
  /** The position changed by the user (drag, spring, keys). */
  onInput: (position: number) => void
  /** A finger (or mouse) went down on the ruler. */
  onGrab?: () => void
  /** What a screen reader announces for a year index. */
  valueText?: (index: number) => string
}

/** A damped spring toward a target, SwiftUI's .spring(response:dampingFraction:). */
export class Spring {
  private x0 = 0
  private v0 = 0
  private target = 0
  private start = 0
  private readonly w0: number
  private readonly zeta: number
  active = false

  constructor(response = 0.34, damping = 0.82) {
    this.w0 = (2 * Math.PI) / response
    this.zeta = damping
  }

  begin(from: number, to: number, velocity = 0, now = performance.now()): void {
    this.x0 = from
    this.v0 = velocity
    this.target = to
    this.start = now
    this.active = true
  }

  /** The value at `now`; clears `active` once settled. */
  sample(now = performance.now()): number {
    const t = (now - this.start) / 1000
    const { w0, zeta } = this
    const a = this.x0 - this.target
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    const b = (this.v0 + zeta * w0 * a) / wd
    const env = Math.exp(-zeta * w0 * t)
    const x = this.target + env * (a * Math.cos(wd * t) + b * Math.sin(wd * t))
    if (env * (Math.abs(a) + Math.abs(b)) < 0.0004) {
      this.active = false
      return this.target
    }
    return x
  }
}

const easeOut = (x: number) => 1 - (1 - x) * (1 - x)

export class Ruler {
  readonly el: HTMLDivElement
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private labels: HTMLSpanElement[] = []
  private years: number[]
  private position: number
  private width = 0
  private dpr = 1
  private dragging = false
  private pointerId: number | null = null
  private lifted = 0
  private liftFrom = 0
  private liftTo = 0
  private liftStart = 0
  private liftDuration = 0.18
  private spring = new Spring()
  private frame = 0
  private nearest = -1
  private ink: [number, number, number]
  private resizeObserver: ResizeObserver

  constructor(private opts: RulerOptions) {
    this.years = opts.years
    this.position = opts.position
    this.ink = opts.ink ?? [0, 0, 0]
    this.el = h('div', 'ruler')
    this.el.tabIndex = 0
    this.el.setAttribute('role', 'slider')
    this.el.setAttribute('aria-label', 'Year')
    this.el.setAttribute('aria-valuemin', String(this.years[0]))
    this.el.setAttribute('aria-valuemax', String(this.years[this.years.length - 1]))
    this.el.style.height = px(TICK_AREA + LABEL_AREA)
    this.canvas = h('canvas', 'ruler-ticks', {}, this.el)
    this.canvas.setAttribute('aria-hidden', 'true')
    this.ctx = this.canvas.getContext('2d')!
    const labelRow = h('div', 'ruler-labels', {}, this.el)
    labelRow.setAttribute('aria-hidden', 'true')
    for (const year of this.years) {
      const l = h('span', 'ruler-label', {}, labelRow)
      l.textContent = String(year)
      this.labels.push(l)
    }

    this.el.addEventListener('pointerdown', this.onDown)
    this.el.addEventListener('pointermove', this.onMove)
    this.el.addEventListener('pointerup', this.onUp)
    this.el.addEventListener('pointercancel', this.onUp)
    this.el.addEventListener('lostpointercapture', this.onUp)
    this.el.addEventListener('keydown', this.onKey)
    this.resizeObserver = new ResizeObserver(() => this.layout())
    this.resizeObserver.observe(this.el)
  }

  private get lastIndex(): number {
    return Math.max(this.years.length - 1, 1)
  }

  get value(): number {
    return this.position
  }

  get isDragging(): boolean {
    return this.dragging
  }

  /** Set from outside (a demo, another control). Stops any spring. */
  setPosition(position: number): void {
    this.spring.active = false
    this.position = position
    this.schedule()
  }

  /** Springs to a year index, as a release or a key press does. */
  springTo(index: number): void {
    this.spring.begin(this.position, clamp(index, 0, this.years.length - 1))
    this.schedule()
  }

  destroy(): void {
    cancelAnimationFrame(this.frame)
    this.resizeObserver.disconnect()
    this.el.remove()
  }

  // ---------------------------------------------------------------- input

  private positionAt(clientX: number): number {
    const rect = this.el.getBoundingClientRect()
    const track = rect.width - INSET * 2
    const raw = ((clientX - rect.left - INSET) / track) * this.lastIndex
    return clamp(raw, 0, this.lastIndex)
  }

  private onDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    this.el.focus({ preventScroll: true })
    this.opts.onGrab?.()
    this.pointerId = e.pointerId
    try {
      this.el.setPointerCapture(e.pointerId)
    } catch {
      /* not capturable */
    }
    this.dragging = true
    this.spring.active = false
    this.animateLift(1, 0.18)
    this.input(this.positionAt(e.clientX))
  }

  private onMove = (e: PointerEvent) => {
    if (!this.dragging || e.pointerId !== this.pointerId) return
    this.input(this.positionAt(e.clientX))
  }

  private onUp = (e: PointerEvent) => {
    if (!this.dragging || e.pointerId !== this.pointerId) return
    this.dragging = false
    this.pointerId = null
    this.animateLift(0, 0.3)
    this.springTo(Math.round(this.position))
  }

  private onKey = (e: KeyboardEvent) => {
    const i = Math.round(this.position)
    let next: number | null = null
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = i - 1
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = i + 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = this.years.length - 1
    else if (e.key === 'PageDown') next = i - 5
    else if (e.key === 'PageUp') next = i + 5
    if (next === null) return
    e.preventDefault()
    this.opts.onGrab?.()
    this.springTo(next)
  }

  /** Step by one year from anywhere on the page. */
  step(delta: number): void {
    this.opts.onGrab?.()
    this.springTo(Math.round(this.position) + delta)
  }

  private input(position: number): void {
    this.position = position
    this.opts.onInput(position)
    this.schedule()
  }

  private animateLift(to: number, duration: number): void {
    this.liftFrom = this.lifted
    this.liftTo = to
    this.liftStart = performance.now()
    this.liftDuration = duration
    this.schedule()
  }

  // ---------------------------------------------------------------- drawing

  private schedule(): void {
    if (this.frame) return
    this.frame = requestAnimationFrame(this.tick)
  }

  private tick = (now: number) => {
    this.frame = 0
    let again = false
    if (this.spring.active) {
      const p = this.spring.sample(now)
      this.position = p
      this.opts.onInput(p)
      again = again || this.spring.active
    }
    if (this.lifted !== this.liftTo) {
      const x = Math.min(1, (now - this.liftStart) / 1000 / this.liftDuration)
      this.lifted = this.liftFrom + (this.liftTo - this.liftFrom) * easeOut(x)
      if (x >= 1) this.lifted = this.liftTo
      else again = true
    }
    this.draw()
    if (again) this.schedule()
  }

  private layout(): void {
    const width = this.el.clientWidth
    const dpr = Math.min(3, window.devicePixelRatio || 1)
    if (width === this.width && dpr === this.dpr) return
    this.width = width
    this.dpr = dpr
    this.canvas.width = Math.round(width * dpr)
    this.canvas.height = Math.round(TICK_AREA * dpr)
    this.canvas.style.width = px(width)
    this.canvas.style.height = px(TICK_AREA)
    const track = width - INSET * 2
    this.labels.forEach((l, i) => {
      l.style.left = px(INSET + (track * i) / this.lastIndex)
    })
    this.draw()
  }

  private draw(): void {
    const { ctx, width, dpr } = this
    if (!width) return
    const [r, g, b] = this.ink
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, TICK_AREA)
    const track = width - INSET * 2
    const indicatorX = INSET + track * (this.position / this.lastIndex)
    // The bell's width is a share of the track, so it reads the same on any phone.
    const sigma = track * 0.15
    const rest = 5
    const swell = 30 + 8 * this.lifted
    const tickCount = (this.years.length - 1) * TICKS_PER_YEAR + 1
    for (let i = 0; i < tickCount; i++) {
      const x = INSET + (track * i) / Math.max(tickCount - 1, 1)
      const d = (x - indicatorX) / sigma
      const bell = Math.exp(-0.5 * d * d)
      const height = rest + swell * bell
      ctx.fillStyle = `rgba(${r},${g},${b},${0.16 + 0.26 * bell})`
      roundRect(ctx, x - 0.5, TICK_AREA - height, 1, height, 0.5)
    }
    const ih = rest + swell + 8
    ctx.fillStyle = `rgb(${r},${g},${b})`
    roundRect(ctx, indicatorX - 1.25, TICK_AREA - ih, 2.5, ih, 1.25)

    // Every other year is labelled, like the major marks on a ruler, and the
    // current year is always called out in bold; its immediate neighbours
    // step aside so the bold label never collides.
    const nearest = clamp(Math.round(this.position), 0, this.years.length - 1)
    if (nearest !== this.nearest) {
      this.nearest = nearest
      this.labels.forEach((l, i) => {
        const current = i === nearest
        const shown = current || (i % 2 === 0 && Math.abs(i - nearest) > 1)
        l.classList.toggle('current', current)
        l.classList.toggle('shown', shown)
      })
      this.el.setAttribute('aria-valuenow', String(this.years[nearest]))
      this.el.setAttribute('aria-valuetext', this.opts.valueText?.(nearest) ?? String(this.years[nearest]))
    }
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath()
  const rr = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
  ctx.fill()
}
