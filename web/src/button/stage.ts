// One moment on the Button timeline (ButtonErasStage.swift): that year's
// iPhone, its screen, and the button on it. render(position) blends every
// gradient stop, radius and bezel between the two years either side.

import { EraBackdrop, EraDevice, EraStatusBar } from '../core/device'
import { css, h, px } from '../core/dom'
import { ButtonFace } from './face'
import type { PagePoint } from './face'
import type { ButtonEra } from './model'
import { looksAt, scaledButton } from './model'

/** Points per millimetre of iPhone on the iOS page (ButtonErasView.scale).
 *  The button is drawn in points, so on a smaller page it shrinks with the
 *  iPhone by scale / IOS_SCALE. */
export const IOS_SCALE = 4.3

/** Where in the page a stage's own box has been laid out, asked for its
 *  current size. The button needs it to land on the device pixel grid the
 *  way SwiftUI does (see face.ts); a stage without one is simply not
 *  snapped. */
export type OriginFn = (width: number, height: number) => PagePoint | null

export class ButtonErasStage {
  readonly el: HTMLDivElement
  readonly device: EraDevice
  private backdrop: EraBackdrop
  private status: EraStatusBar
  private layer: HTMLDivElement
  private face: ButtonFace
  private year = -1
  position = 0
  /** Where this stage sits in the page (see OriginFn). */
  origin: OriginFn | null = null

  constructor(
    readonly eras: ButtonEra[],
    opts: { scale?: number; screenOnly?: boolean } = {},
  ) {
    this.device = new EraDevice({ scale: opts.scale ?? IOS_SCALE, screenOnly: opts.screenOnly })
    this.el = this.device.el
    this.el.classList.add('button-stage')
    const content = this.device.content
    // ZStack { EraBackdrop; EraStatusBar; EraButton }
    this.backdrop = new EraBackdrop()
    content.appendChild(this.backdrop.el)
    this.status = new EraStatusBar()
    content.appendChild(this.status.el)
    this.layer = h('div', 'button-layer', {}, content)
    this.face = new ButtonFace(this.layer)
  }

  /** The tallest iPhone on the timeline, in mm. */
  static tallest(eras: ButtonEra[]): number {
    return Math.max(...eras.map((e) => e.hardware.bodyHeight))
  }

  get scale(): number {
    return this.device.scale
  }

  setScale(scale: number): void {
    this.device.scale = scale
    this.render(this.position)
  }

  render(position: number): void {
    this.position = position
    const m = looksAt(this.eras, position)
    const frame = this.device.update(m.hardware)
    const W = frame.screenWidth
    const H = frame.screenHeight
    this.backdrop.update(m.screen, W, H)
    this.status.update(m.screen, m.hardware, this.device.scale, W)
    // The button sits in the middle of the screen.
    css(this.face.el, 'left', px(W / 2))
    css(this.face.el, 'top', px(H / 2))
    const button = scaledButton(m.button, this.device.scale / IOS_SCALE)
    const at = this.origin?.(frame.width, frame.height) ?? null
    const corner: PagePoint | null = at
      ? { x: at.x + frame.screenX + (W - button.width) / 2, y: at.y + frame.screenY + (H - button.height) / 2 }
      : null
    this.face.update(button, m.year, this.year >= 0, corner)
    this.year = m.year
  }
}
