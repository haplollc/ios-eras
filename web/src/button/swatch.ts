// The button on its own (ButtonErasSwatch.swift): drawn 1.75x larger on a
// rounded 340 x 300 swatch of that year's screen, so a translucent 2024
// capsule or a white 2015 slab still reads against something, without any
// iPhone around it. The frameless "Button only" mode (UIC_ERAS_BARE).

import { EraBackdrop, shadowBlur } from '../core/device'
import { continuousRectPath, css, h, px } from '../core/dom'
import { ButtonFace } from './face'
import type { PagePoint } from './face'
import type { ButtonEra } from './model'
import { looksAt, scaledButton } from './model'
import { IOS_SCALE } from './stage'
import type { OriginFn } from './stage'

export const SWATCH_WIDTH = 340
export const SWATCH_HEIGHT = 300
export const SWATCH_RADIUS = 44
/** How much larger than life the button is drawn. */
export const MAGNIFICATION = 1.75
/** The row the swatch sits in on the iOS page (.frame(height: 420)). */
export const SWATCH_ROW = 420

export class ButtonSwatch {
  readonly el: HTMLDivElement
  private shadow: HTMLDivElement
  private clip: HTMLDivElement
  private backdrop: EraBackdrop
  private face: ButtonFace
  private year = -1
  /** CSS px per mm of iPhone; the swatch is drawn at scale / 4.3. */
  scale: number
  position = 0
  /** Where this swatch sits in the page (see OriginFn). */
  origin: OriginFn | null = null

  constructor(readonly eras: ButtonEra[], opts: { scale?: number } = {}) {
    this.scale = opts.scale ?? IOS_SCALE
    this.el = h('div', 'button-swatch', { position: 'relative' })
    // .shadow(color: .black.opacity(0.12), radius: 24, y: 12) of the clipped
    // swatch, which is opaque: a box shadow under it, inset a little so its
    // edge hides under the swatch's antialiased one.
    this.shadow = h('div', 'button-swatch-shadow', { position: 'absolute' }, this.el)
    this.clip = h('div', 'button-swatch-clip', { position: 'absolute', left: '0', top: '0', overflow: 'hidden' }, this.el)
    this.backdrop = new EraBackdrop()
    this.clip.appendChild(this.backdrop.el)
    const layer = h('div', 'button-layer', {}, this.clip)
    this.face = new ButtonFace(layer)
  }

  /** The swatch's size in CSS px at a scale. */
  static size(scale: number): { width: number; height: number } {
    const k = scale / IOS_SCALE
    return { width: SWATCH_WIDTH * k, height: SWATCH_HEIGHT * k }
  }

  setScale(scale: number): void {
    this.scale = scale
    this.render(this.position)
  }

  render(position: number): void {
    this.position = position
    const k = this.scale / IOS_SCALE
    const W = SWATCH_WIDTH * k
    const H = SWATCH_HEIGHT * k
    const R = SWATCH_RADIUS * k
    css(this.el, 'width', px(W))
    css(this.el, 'height', px(H))
    css(this.clip, 'width', px(W))
    css(this.clip, 'height', px(H))
    css(this.clip, 'clip-path', `path('${continuousRectPath(0, 0, W, H, R)}')`)
    const inset = 2
    css(this.shadow, 'left', px(inset))
    css(this.shadow, 'top', px(inset))
    css(this.shadow, 'width', px(W - inset * 2))
    css(this.shadow, 'height', px(H - inset * 2))
    css(this.shadow, 'border-radius', px(R - inset))
    css(this.shadow, 'box-shadow', `0 ${px(12 * k)} ${px(shadowBlur(24 * k))} rgba(0,0,0,0.12)`)

    const m = looksAt(this.eras, position)
    this.backdrop.update(m.screen, W, H)
    css(this.face.el, 'left', px(W / 2))
    css(this.face.el, 'top', px(H / 2))
    const button = scaledButton(m.button, MAGNIFICATION * k)
    const at = this.origin?.(W, H) ?? null
    const corner: PagePoint | null = at
      ? { x: at.x + (W - button.width) / 2, y: at.y + (H - button.height) / 2 }
      : null
    this.face.update(button, m.year, this.year >= 0, corner)
    this.year = m.year
  }
}
