// One timeline page, the same for the home screen and the button: the stage
// row (as tall as the tallest iPhone, so the caption and ruler hold still
// while the phone grows and shrinks), the caption, and the ruler. Drives the
// stage from the ruler, the keyboard, and the scripted walk.

import type { EraCaption } from '../core/looks'
import { nearestIndex } from '../core/looks'
import { h, px } from '../core/dom'
import { Caption } from './caption'
import { Ruler } from './ruler'
import { clicker } from './sound'

/** What a page's stage must offer. Build the DOM once; render() is called
 *  on every frame of a scrub with a continuous position (0 = first year). */
export interface StageHandle {
  el: HTMLElement
  render(position: number): void
  /** CSS px per millimetre of iPhone changed (the window was resized). */
  setScale(scale: number): void
  destroy?(): void
}

/** Handed to a page's scripted walk. Both resolve false once cancelled. */
export interface DemoContext {
  /** Eases to a year index over `seconds`, stepped by the clock. */
  glide(index: number, seconds: number): Promise<boolean>
  hold(seconds: number): Promise<boolean>
  /** The last year index. */
  last: number
}

export interface TimelineSpec {
  eras: EraCaption[]
  /** The tallest iPhone on this timeline, in mm: it sets the stage row. */
  tallestMM: number
  /** Builds the stage for a scale (CSS px per mm). */
  createStage(scale: number): StageHandle
  /** The scripted walk (HomeErasView.runDemo / ButtonErasView.runDemo). */
  demo?: (d: DemoContext) => Promise<void>
  /** Opening position; default the last year. */
  start?: number
  /** Something to show at the top right of the stage row (a toggle). */
  accessory?: HTMLElement
  /** Called whenever the position changes (after the stage has rendered). */
  onPosition?: (position: number) => void
}

export interface PageHandle {
  readonly position: number
  readonly playing: boolean
  play(): void
  stop(): void
  setPosition(position: number): void
  onPlayingChange(cb: (playing: boolean) => void): () => void
  destroy(): void
}

/** How the page is being shown. */
export type LayoutMode = 'page' | 'capture' | 'screen'

export interface Env {
  mode: LayoutMode
  /** CSS px per mm for the stage right now. */
  scale: number
  onScale(cb: (scale: number) => void): () => void
  /** Multiplies every demo duration (UIC_DEMO_PACE). */
  pace: number
}

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

export class TimelineView implements PageHandle {
  readonly el: HTMLDivElement
  private stage: StageHandle
  private stageRow: HTMLDivElement
  private caption: Caption
  private ruler: Ruler
  private pos: number
  private nearest = -1
  private demoToken: { cancelled: boolean; wake: Set<() => void> } | null = null
  private listeners = new Set<(playing: boolean) => void>()
  private unScale: () => void
  private onKeyDoc: (e: KeyboardEvent) => void
  private urlTimer = 0

  constructor(container: HTMLElement, private spec: TimelineSpec, private env: Env) {
    const last = spec.eras.length - 1
    this.pos = Math.min(Math.max(spec.start ?? last, 0), last)
    this.el = h('div', 'timeline', {}, container)
    this.stageRow = h('div', 'stage-row', {}, this.el)
    // The drawing is one picture to assistive tech; the caption and the
    // ruler carry the words.
    this.stageRow.setAttribute('role', 'img')
    this.stage = spec.createStage(env.scale)
    this.stageRow.appendChild(this.stage.el)
    if (spec.accessory) this.stageRow.appendChild(spec.accessory)
    this.caption = new Caption()
    this.el.appendChild(this.caption.el)
    const rulerWrap = h('div', 'ruler-wrap', {}, this.el)
    this.ruler = new Ruler({
      years: spec.eras.map((e) => e.year),
      position: this.pos,
      onInput: (p) => this.apply(p, false),
      onGrab: () => this.stop(),
      valueText: (i) => `${spec.eras[i].year}, ${spec.eras[i].system}`,
    })
    rulerWrap.appendChild(this.ruler.el)
    this.sizeRow(env.scale)
    this.apply(this.pos, false, false)

    this.unScale = env.onScale((scale) => {
      this.sizeRow(scale)
      this.stage.setScale(scale)
      this.stage.render(this.pos)
    })

    // Arrow keys and space work from anywhere on the page.
    this.onKeyDoc = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (target && (target.closest('input, textarea, select, [contenteditable], .ruler') || e.metaKey || e.ctrlKey || e.altKey)) return
      if (target && target.closest('button, a') && (e.key === ' ' || e.key === 'Enter')) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.ruler.step(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        this.ruler.step(1)
      } else if (e.key === ' ') {
        e.preventDefault()
        if (this.playing) this.stop()
        else this.play()
      }
    }
    document.addEventListener('keydown', this.onKeyDoc)
  }

  get position(): number {
    return this.pos
  }

  get playing(): boolean {
    return this.demoToken !== null
  }

  private sizeRow(scale: number): void {
    this.stageRow.style.height = px(this.spec.tallestMM * scale)
  }

  setPosition(position: number): void {
    this.ruler.setPosition(position)
    this.apply(position, true)
  }

  /** Moves everything to a position. */
  private apply(position: number, fromOutside: boolean, animate = true): void {
    this.pos = position
    this.stage.render(position)
    if (fromOutside) this.ruler.setPosition(position)
    const i = nearestIndex(position, this.spec.eras.length)
    if (i !== this.nearest) {
      const first = this.nearest < 0
      this.nearest = i
      const era = this.spec.eras[i]
      this.caption.set(era, animate && !first)
      this.stageRow.setAttribute('aria-label', `${era.system} on the ${era.device}, ${era.year}`)
      if (!first) {
        clicker().tick()
        if (this.ruler.isDragging && 'vibrate' in navigator) {
          try {
            navigator.vibrate(4)
          } catch {
            /* not allowed */
          }
        }
      }
      this.rememberYear()
    }
    this.spec.onPosition?.(position)
  }

  /** Keeps ?year= in the address bar in step, so a link opens where you are. */
  private rememberYear(): void {
    if (this.env.mode !== 'page') return
    clearTimeout(this.urlTimer)
    this.urlTimer = window.setTimeout(() => {
      if (this.playing) return
      const url = new URL(location.href)
      url.searchParams.set('year', String(this.spec.eras[this.nearest].year))
      url.searchParams.delete('pos')
      url.searchParams.delete('demo')
      history.replaceState(null, '', url)
    }, 500)
  }

  // ---------------------------------------------------------------- demo

  onPlayingChange(cb: (playing: boolean) => void): () => void {
    this.listeners.add(cb)
    return () => this.listeners.delete(cb)
  }

  private emit(): void {
    for (const cb of this.listeners) cb(this.playing)
  }

  play(): void {
    if (!this.spec.demo || this.playing) return
    const token = { cancelled: false, wake: new Set<() => void>() }
    this.demoToken = token
    this.emit()
    const pace = this.env.pace
    const hold = (seconds: number) =>
      new Promise<boolean>((resolve) => {
        if (token.cancelled) return resolve(false)
        const done = () => {
          token.wake.delete(done)
          clearTimeout(timer)
          resolve(!token.cancelled)
        }
        const timer = setTimeout(done, seconds * pace * 1000)
        token.wake.add(done)
      })
    // Stepped by the clock rather than a CSS animation, so the caption, the
    // ruler's bold year and the ticks follow the drawing.
    const glide = (index: number, seconds: number) =>
      new Promise<boolean>((resolve) => {
        if (token.cancelled) return resolve(false)
        const from = this.pos
        const to = index
        const start = performance.now()
        const step = (now: number) => {
          if (token.cancelled) return resolve(false)
          const x = Math.min((now - start) / (seconds * pace * 1000), 1)
          this.ruler.setPosition(from + (to - from) * easeInOut(x))
          this.apply(from + (to - from) * easeInOut(x), false)
          if (x >= 1) resolve(true)
          else requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    const last = this.spec.eras.length - 1
    const run = async () => {
      // Rewind first when starting from somewhere else.
      if (this.pos > 0.01) {
        if (!(await glide(0, Math.min(2.4, 0.6 + this.pos * 0.09)))) return
      }
      await this.spec.demo!({ glide, hold, last })
    }
    void run().finally(() => {
      if (this.demoToken === token) {
        this.demoToken = null
        this.emit()
        this.rememberYear()
      }
    })
  }

  stop(): void {
    const token = this.demoToken
    if (!token) return
    token.cancelled = true
    for (const wake of [...token.wake]) wake()
    this.demoToken = null
    // Settle on the nearest year rather than stopping between two. (A drag
    // or key press that stopped the walk takes over from this spring.)
    if (Math.abs(this.pos - Math.round(this.pos)) > 0.001) this.ruler.springTo(Math.round(this.pos))
    this.emit()
  }

  destroy(): void {
    this.stop()
    clearTimeout(this.urlTimer)
    this.unScale()
    document.removeEventListener('keydown', this.onKeyDoc)
    this.ruler.destroy()
    this.stage.destroy?.()
    this.el.remove()
  }
}

/** Renders ONLY a stage (for ?screen=1 captures). */
export function mountStageOnly(container: HTMLElement, stage: StageHandle, position: number): PageHandle {
  container.appendChild(stage.el)
  stage.render(position)
  return {
    position,
    playing: false,
    play() {},
    stop() {},
    setPosition(p: number) {
      stage.render(p)
    },
    onPlayingChange() {
      return () => {}
    },
    destroy() {
      stage.destroy?.()
      stage.el.remove()
    },
  }
}
