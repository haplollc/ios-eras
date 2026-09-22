// The Button Eras page (ButtonErasView.swift): one push button per year,
// 2007 to 2026, drawn on that year's screen inside that year's iPhone, with
// the caption and the ruler below. "Button only" (?bare=1, UIC_ERAS_BARE in
// the Swift) drops the iPhone and shows the button 1.75x on a swatch of the
// year's screen.
//
// Query parameters (read here or by the shell):
//   ?year=2013 / ?pos=14.5   open on a year, or between two
//   ?demo=1                  the scripted walk (ButtonErasView.runDemo)
//   ?bare=1                  button only
//   ?capture=1               the iOS page layout, 440 pt wide, 4.3 pt per mm
//   ?screen=1                only the phone's screen (or with bare=1 only
//                            the swatch) at the top-left
//
// Files: model.ts (ButtonLook, blending), timeline.ts (the twenty rows),
// face.ts (the button itself), stage.ts (iPhone + screen + button),
// swatch.ts (button only), button.css.

import './button.css'
import { css, h, px } from '../core/dom'
import type { PageHandle, Shared, StageHandle } from '../ui/shared'
import type { DemoContext } from '../ui/timeline'
import { buttonTimeline } from './timeline'
import { ButtonErasStage, IOS_SCALE } from './stage'
import { ButtonSwatch, SWATCH_ROW } from './swatch'

/** ButtonErasView.runDemo, beat for beat. */
export async function buttonDemo({ glide, hold, last }: DemoContext): Promise<void> {
  if (!(await hold(1.3))) return
  // Year by year through the gel era, with a beat on each.
  for (let index = 1; index <= Math.min(5, last); index++) {
    if (!(await glide(index, 0.42)) || !(await hold(0.66))) return
  }
  // Then one long pull to today, the whole morph in one go...
  if (!(await glide(last, 6.4)) || !(await hold(1.3))) return
  // ...a quick rewind to the start...
  if (!(await glide(0, 2.2)) || !(await hold(0.7))) return
  // ...and a steady glide back to settle on today.
  if (!(await glide(last, 4.2))) return
  await hold(1.2)
}

const icons = {
  // A button alone: a capsule.
  bare: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="5" width="13" height="6" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  // An iPhone.
  phone: '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.2" y="1.5" width="7.6" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M7 3.6h2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
}

/** The stage row's contents: the iPhone, or the swatch alone, cross-fading
 *  when "Button only" is toggled (the Swift animates the switch with
 *  .snappy(duration: 0.35)). */
class ButtonPageStage implements StageHandle {
  readonly el: HTMLDivElement
  private device: ButtonErasStage
  private swatch: ButtonSwatch
  private deviceView: HTMLDivElement
  private swatchView: HTMLDivElement
  private position = 0
  private fadeTimer = 0
  /** The row's box, measured only when the layout can have changed: the
   *  stage needs it to place the button on the device pixel grid. */
  private rowBox: DOMRect | null = null
  private measured = false
  private remeasure = () => {
    this.measured = false
  }
  /** Whether each view is still drawn (the one fading out stays drawn). */
  private live = { device: true, swatch: true }

  constructor(
    eras = buttonTimeline,
    private scale: number,
    public bare: boolean,
  ) {
    this.el = h('div', 'button-page-stage')
    this.deviceView = h('div', 'button-view', {}, this.el)
    this.swatchView = h('div', 'button-view', {}, this.el)
    this.device = new ButtonErasStage(eras, { scale })
    this.deviceView.appendChild(this.device.el)
    this.swatch = new ButtonSwatch(eras, { scale })
    this.swatchView.appendChild(this.swatch.el)
    // Both views are centred in the row, so the row's box places them.
    const centred = (w: number, h: number) => {
      const box = this.row()
      return box ? { x: box.left + (box.width - w) / 2, y: box.top + (box.height - h) / 2 } : null
    }
    this.device.origin = centred
    this.swatch.origin = centred
    window.addEventListener('resize', this.remeasure)
    window.addEventListener('scroll', this.remeasure, true)
    this.settle()
  }

  private row(): DOMRect | null {
    if (!this.measured && this.el.isConnected) {
      this.rowBox = this.el.getBoundingClientRect()
      this.measured = true
    }
    return this.rowBox
  }

  /** Shows only the current view. */
  private settle(): void {
    this.live = { device: !this.bare, swatch: this.bare }
    css(this.deviceView, 'display', this.live.device ? 'flex' : 'none')
    css(this.swatchView, 'display', this.live.swatch ? 'flex' : 'none')
    this.deviceView.classList.toggle('hidden', this.bare)
    this.swatchView.classList.toggle('hidden', !this.bare)
  }

  setBare(bare: boolean, animate: boolean): void {
    if (bare === this.bare) return
    this.bare = bare
    clearTimeout(this.fadeTimer)
    if (!animate) {
      this.settle()
      this.render(this.position)
      return
    }
    // Both drawn while one fades into the other.
    this.live = { device: true, swatch: true }
    css(this.deviceView, 'display', 'flex')
    css(this.swatchView, 'display', 'flex')
    this.measured = false
    this.render(this.position)
    // Let the incoming view paint once at opacity 0 before it fades in.
    void this.el.offsetWidth
    this.deviceView.classList.toggle('hidden', bare)
    this.swatchView.classList.toggle('hidden', !bare)
    this.fadeTimer = window.setTimeout(() => this.settle(), 400)
  }

  destroy(): void {
    clearTimeout(this.fadeTimer)
    window.removeEventListener('resize', this.remeasure)
    window.removeEventListener('scroll', this.remeasure, true)
  }

  setScale(scale: number): void {
    this.measured = false
    this.scale = scale
    this.device.device.scale = scale
    this.swatch.scale = scale
    this.render(this.position)
  }

  render(position: number): void {
    this.position = position
    if (this.live.device) this.device.render(position)
    if (this.live.swatch) this.swatch.render(position)
  }
}

/** Where an element sits in the page, for the pixel-grid snapping. */
function topLeft(el: HTMLElement): { x: number; y: number } | null {
  if (!el.isConnected) return null
  const box = el.getBoundingClientRect()
  return { x: box.left, y: box.top }
}

/** The stage row's height in mm of iPhone: the tallest iPhone, or the
 *  swatch's 420 pt row. */
const rowMM = (bare: boolean, tallest: number): number => (bare ? SWATCH_ROW / IOS_SCALE : tallest)

export function mountButtonPage(container: HTMLElement, params: URLSearchParams, shared: Shared): PageHandle {
  const eras = buttonTimeline
  const start = shared.startPosition(eras)
  let bare = params.get('bare') === '1'
  const env = shared.env

  if (env.mode === 'screen') {
    // Only the screen (or only the swatch), at the top-left, 4.3 px per mm.
    if (bare) {
      const swatch = new ButtonSwatch(eras, { scale: env.scale })
      swatch.origin = () => topLeft(swatch.el)
      return shared.mountStageOnly(container, { el: swatch.el, render: (p) => swatch.render(p), setScale: (s) => swatch.setScale(s) }, start)
    }
    const stage = new ButtonErasStage(eras, { scale: env.scale, screenOnly: true })
    stage.origin = () => topLeft(stage.el)
    return shared.mountStageOnly(container, { el: stage.el, render: (p) => stage.render(p), setScale: (s) => stage.setScale(s) }, start)
  }

  const tallest = ButtonErasStage.tallest(eras)
  let stage: ButtonPageStage | null = null

  // "Button only" / "Show iPhone", as in the Swift toolbar. Not in captures,
  // whose chrome is the iOS page's.
  let toggle: HTMLButtonElement | undefined
  const renderToggle = () => {
    if (!toggle) return
    const label = bare ? 'Show iPhone' : 'Button only'
    toggle.innerHTML = `${bare ? icons.phone : icons.bare}<span>${label}</span>`
    toggle.setAttribute('aria-pressed', String(bare))
    toggle.title = label
  }
  if (env.mode === 'page') {
    toggle = h('button', 'button-only')
    toggle.type = 'button'
    renderToggle()
    toggle.addEventListener('click', () => setBare(!bare))
  }

  const spec = {
    eras,
    tallestMM: rowMM(bare, tallest),
    createStage: (scale: number): StageHandle => {
      stage = new ButtonPageStage(eras, scale, bare)
      return stage
    },
    demo: buttonDemo,
    start,
    accessory: toggle,
  }
  const handle = shared.mountTimeline(container, spec)

  function setBare(next: boolean): void {
    if (next === bare || !stage) return
    bare = next
    // The shell sizes the row from spec.tallestMM on every resize; move the
    // row now, with the Swift's 0.35 s snap.
    spec.tallestMM = rowMM(bare, tallest)
    const row = stage.el.parentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (row) {
      row.style.transition = reduce ? '' : 'height 0.35s cubic-bezier(0.3, 0.9, 0.3, 1)'
      row.style.height = px(spec.tallestMM * env.scale)
      window.setTimeout(() => {
        row.style.transition = ''
      }, 400)
    }
    stage.setBare(bare, !reduce)
    renderToggle()
    // Keep ?bare= in the address bar, so a link opens the same way.
    const url = new URL(location.href)
    if (bare) url.searchParams.set('bare', '1')
    else url.searchParams.delete('bare')
    history.replaceState(null, '', url)
  }

  return handle
}
