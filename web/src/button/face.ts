// One push button at one moment (EraButtonFace in ButtonErasStage.swift):
// the dark well it is sunk into and the lip under it, the four-stop fill
// with its shadow, the Liquid Glass layer, the inner highlight, the outline,
// the pressed tint, and the year, whose digits roll when it changes
// (.contentTransition(.numericText)).
//
// Built once; update() only rewrites what changed. Every layer is an HTML
// box so its gradient is a CSS gradient, interpolated like SwiftUI's
// (dom.ts linearGradient), and every one is cut to shape with a clip-path,
// which the browser honours to the subpixel (see BLEED below).

import type { Ink } from '../core/ink'
import { clamp, css as cssInk } from '../core/ink'
import type { EraTypeface } from '../core/looks'
import { eraFont, fontCSS } from '../core/looks'
import { shadowBlur } from '../core/device'
import { continuousRectPath, css, h, linearGradient, n, px, roundedRectPath } from '../core/dom'
import type { ButtonLook } from './model'

const c = cssInk

/** A rounded rectangle path: the iOS 7 corner, or a plain circular one. */
function rectPath(x: number, y: number, w: number, h: number, r: number, continuous: boolean): string {
  return continuous ? continuousRectPath(x, y, w, h, r) : roundedRectPath(x, y, w, h, r)
}

/** Every layer is cut out with a clip-path rather than a border-radius,
 *  because the browser rounds a box with a background to whole CSS pixels
 *  but honours a clip-path exactly -- and a button that is half a pixel
 *  wrong in one layer and right in the next reads as a soft edge. The box
 *  itself is grown by BLEED so that its (rounded) background always reaches
 *  past the clip. Lengths below are in the button's own coordinates, where
 *  (0, 0) is its top-left corner. */
const BLEED = 1

/** Places a box over the button's rect, grown by `grow`, and cuts that
 *  rounded rectangle out of it. Returns where the button's origin sits in
 *  the box, for gradients. */
function shapeBox(el: HTMLElement, w: number, hgt: number, r: number, continuous: boolean, grow = 0): number {
  const W = w + grow * 2
  const H = hgt + grow * 2
  const off = grow + BLEED
  css(el, 'left', px(-off))
  css(el, 'top', px(-off))
  css(el, 'width', px(Math.max(0, W + BLEED * 2)))
  css(el, 'height', px(Math.max(0, H + BLEED * 2)))
  const rr = Math.max(0, Math.min(r + grow, W / 2, H / 2))
  css(el, 'clip-path', `path('${rectPath(BLEED, BLEED, W, H, rr, continuous)}')`)
  return off
}

/** Covers the button's rect but shows only the band between two insets from
 *  its edge, which is how SwiftUI's strokeBorder (and the glass rim) draw.
 *  Returns where the button's origin sits in the box, for gradients. */
function bandBox(el: HTMLElement, w: number, hgt: number, r: number, from: number, to: number, continuous: boolean): number {
  const pad = Math.max(0, -from) + BLEED
  const W = w + pad * 2
  const H = hgt + pad * 2
  css(el, 'left', px(-pad))
  css(el, 'top', px(-pad))
  css(el, 'width', px(Math.max(0, W)))
  css(el, 'height', px(Math.max(0, H)))
  const rr = Math.max(0, Math.min(r, w / 2, hgt / 2))
  const edge = (inset: number): string =>
    rectPath(pad + inset, pad + inset, w - inset * 2, hgt - inset * 2, Math.max(0, rr - inset), continuous)
  css(el, 'clip-path', `path(evenodd, '${edge(from)}${edge(to)}')`)
  return pad
}

/** A top-to-bottom gradient whose stops are given in the button's own
 *  coordinates, on a box whose origin sits `off` px above and left of it. */
function downGradient(off: number, ...stops: Array<[string, number]>): string {
  return linearGradient('180deg', ...stops.map(([colour, y]) => `${colour} ${px(off + y)}`))
}

const shown = (el: HTMLElement, on: boolean): void => css(el, 'display', on ? 'block' : 'none')

/** Where the button's top-left corner sits in the page, before the browser
 *  rounds it. The browser snaps a painted box to whole CSS pixels; SwiftUI
 *  snaps to whole device pixels, which on a 3x screen is three times finer,
 *  so the same button can land up to half a point out. Given this, the face
 *  carries the difference in a transform, which is applied after the
 *  rounding and keeps its subpixel part. */
export interface PagePoint {
  x: number
  y: number
}

/** SwiftUI's rounding: to the device pixel grid, a half going up-left (which
 *  is where the iOS renders put every button's edge). */
function toDevicePixels(v: number, dpr: number): number {
  // The epsilon keeps a value that is a half pixel in exact arithmetic, but a
  // hair over it in floating point, on the same side as SwiftUI's.
  return Math.ceil(v * dpr - 0.5 - 1e-6) / dpr
}

// ---------------------------------------------------------------- glass

/** Liquid Glass (.glassEffect(.regular.tint(t))) as the web can draw it: a
 *  blur of what is behind, under a nearly opaque colour made from the tint,
 *  with a bright rim around the edge that sweeps from the top-left corner to
 *  the bottom-right one.
 *
 *  The colour is (1 - a) * GLASS_BASE + a * GLASS_TINT_GAIN * tint per
 *  channel (a = the tint's alpha) and lets GLASS_BLEED of the blurred
 *  backdrop through; the rim is RIM_COLOUR, strongest in its outer
 *  RIM_OUTER px and RIM_FADE of that out to RIM_INNER. Every number was
 *  fitted to the iOS 26 renders of the two glass years (0x0088FF at 0.86
 *  and at 0.96), measured on their wallpapers. */
export const GLASS_BASE = [155, 237, 195]
export const GLASS_TINT_GAIN = [1.04, 0.896, 0.962]
export const GLASS_BLEED = 0.07
export const GLASS_BLUR = 10
const RIM_COLOUR = '95,240,255'
const RIM_ALPHA = 0.94
/** How far the sweep dims between the two bright corners. */
const RIM_DIM = 0.62
const RIM_OUTER = 0.5
const RIM_INNER = 1
const RIM_FADE = 0.65

function glassColour(tint: Ink): string {
  const a = clamp(tint.a, 0, 1)
  const ch = [tint.r, tint.g, tint.b].map((v, i) =>
    clamp(Math.round((1 - a) * GLASS_BASE[i] + a * GLASS_TINT_GAIN[i] * v * 255), 0, 255))
  return `rgba(${ch[0]},${ch[1]},${ch[2]},${n(1 - GLASS_BLEED)})`
}

/** The sweep: bright at the top-left and bottom-right of the edge, dimmer
 *  along the middle of it. */
function rimSweep(strength: number): string {
  const edge = `rgba(${RIM_COLOUR},${n(RIM_ALPHA * strength)})`
  const mid = `rgba(${RIM_COLOUR},${n(RIM_ALPHA * RIM_DIM * strength)})`
  return linearGradient('135deg', `${edge} 0%`, `${mid} 50%`, `${edge} 100%`)
}

// ---------------------------------------------------------------- label

/** Where the label's baseline belongs, as a share of the font size below the
 *  button's middle. SwiftUI centres a Text by its line box, so the baseline
 *  lands half an ascent above and half a descent below the middle -- but
 *  from the font's real metrics, while the browser first rounds ascent and
 *  descent to whole pixels, which moves the same text by up to half a pixel
 *  in a way that changes with the size. The face works out both and nudges
 *  the label by the difference. LABEL_TUNE is the small leftover per face,
 *  measured against the iOS renders. */
const LABEL_TUNE: Record<EraTypeface, number> = {
  helvetica: 0,
  helveticaNeue: 0.021,
  sanFrancisco: -0.012,
}

/** A font's ascent and descent as shares of its size, as this browser has
 *  them. Measured once per face at a size where rounding does not matter. */
const metrics = new Map<string, { ascent: number; descent: number }>()

function fontMetrics(family: string, weight: number): { ascent: number; descent: number } {
  const key = `${weight}|${family}`
  const known = metrics.get(key)
  if (known) return known
  const em = 1000
  const box = h('div', 'bf-metrics', {
    position: 'absolute', left: '-9999px', top: '0', 'line-height': 'normal',
    'white-space': 'nowrap', visibility: 'hidden', font: `${weight} ${em}px ${family}`,
  })
  const base = h('span', '', { display: 'inline-block', width: '0', height: '0', 'vertical-align': 'baseline' })
  box.append('0', base)
  document.body.appendChild(box)
  const b = box.getBoundingClientRect()
  const ascent = base.getBoundingClientRect().top - b.top
  const out = b.height > 0 ? { ascent: ascent / em, descent: (b.height - ascent) / em } : { ascent: 0.95, descent: 0.23 }
  box.remove()
  metrics.set(key, out)
  return out
}

/** The year, one box per character, so a change rolls only the digits that
 *  differ: the old one slides out and blurs away, the new one slides in
 *  (up when the year grows, down when it shrinks), like numericText. */
class RollingLabel {
  readonly el: HTMLDivElement
  private slots: Array<{ el: HTMLSpanElement; cur: HTMLSpanElement; ch: string }> = []
  private value = ''

  constructor(parent: HTMLElement) {
    this.el = h('div', 'bf-label', {}, parent)
  }

  set(value: string, animate: boolean): void {
    if (value === this.value) return
    const up = Number(value) > Number(this.value)
    const first = this.value === ''
    this.value = value
    while (this.slots.length < value.length) {
      const el = h('span', 'bf-slot', {}, this.el)
      const cur = h('span', 'bf-glyph', {}, el)
      this.slots.push({ el, cur, ch: '' })
    }
    while (this.slots.length > value.length) this.slots.pop()!.el.remove()
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    this.slots.forEach((slot, i) => {
      const ch = value[i]
      if (slot.ch === ch) return
      const old = slot.ch
      slot.ch = ch
      slot.cur.textContent = ch
      if (first || !animate || reduce || !old || typeof slot.cur.animate !== 'function') return
      const out = h('span', 'bf-glyph bf-out', {}, slot.el)
      out.textContent = old
      const d = up ? -1 : 1
      const timing: KeyframeAnimationOptions = { duration: 320, easing: 'cubic-bezier(0.25, 1, 0.35, 1)', fill: 'both' }
      slot.cur.getAnimations().forEach((a) => a.cancel())
      slot.cur.animate(
        [
          { transform: `translateY(${-d * 0.55}em) scale(0.8)`, opacity: 0, filter: 'blur(2px)' },
          { transform: 'none', opacity: 1, filter: 'blur(0px)' },
        ],
        timing,
      )
      out
        .animate(
          [
            { transform: 'none', opacity: 1, filter: 'blur(0px)' },
            { transform: `translateY(${d * 0.55}em) scale(0.8)`, opacity: 0, filter: 'blur(2px)' },
          ],
          timing,
        )
        .finished.then(
          () => out.remove(),
          () => out.remove(),
        )
    })
  }
}

// ---------------------------------------------------------------- the face

export class ButtonFace {
  /** A zero-size anchor at the button's centre; place it with left/top. */
  readonly el: HTMLDivElement
  /** The button's own box (look.width x look.height), centred on el. */
  private box: HTMLDivElement
  private lip: HTMLDivElement
  private well: HTMLDivElement
  private shadow: HTMLDivElement
  private fill: HTMLDivElement
  private glass: HTMLDivElement
  private glassFill: HTMLDivElement
  private rimOuter: HTMLDivElement
  private rimInner: HTMLDivElement
  private highlight: HTMLDivElement
  private stroke: HTMLDivElement
  private press: HTMLDivElement
  private label: RollingLabel
  private pressed = false
  /** The subpixel nudge currently in the face's transform. */
  private nudge = { x: 0, y: 0 }
  private last: { look: ButtonLook; year: number; origin: PagePoint | null } | null = null

  constructor(parent?: HTMLElement) {
    this.el = h('div', 'bf', {}, parent)
    this.box = h('div', 'bf-box', {}, this.el)
    this.lip = h('div', 'bf-layer', {}, this.box)
    this.well = h('div', 'bf-layer', {}, this.box)
    // SwiftUI shadows a filled shape from its path, so a glass button with
    // no fill of its own still casts one: a box-shadow on a box of the same
    // shape does the same. (It has no clip-path -- that would cut it off.)
    this.shadow = h('div', 'bf-layer', {}, this.box)
    this.fill = h('div', 'bf-layer', {}, this.box)
    // The blur sits on an inner box: a backdrop-filter gets a layer of its
    // own, which the browser snaps to whole pixels, so the shaped parent is
    // what cuts its edge.
    this.glass = h('div', 'bf-layer bf-glass', {}, this.box)
    this.glassFill = h('div', '', {
      position: 'absolute', inset: '-1px',
      'backdrop-filter': `blur(${GLASS_BLUR}px)`,
      '-webkit-backdrop-filter': `blur(${GLASS_BLUR}px)`,
    }, this.glass)
    this.rimOuter = h('div', 'bf-layer', {}, this.box)
    this.rimInner = h('div', 'bf-layer', {}, this.box)
    this.highlight = h('div', 'bf-layer', {}, this.box)
    this.stroke = h('div', 'bf-layer', {}, this.box)
    this.press = h('div', 'bf-layer bf-press', {}, this.box)
    this.label = new RollingLabel(this.box)

    // It is a real Button in the Swift: it darkens (or dims) while held.
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return
      this.setPressed(true)
    }
    const up = () => this.setPressed(false)
    this.box.addEventListener('pointerdown', down)
    this.box.addEventListener('pointerup', up)
    this.box.addEventListener('pointerleave', up)
    this.box.addEventListener('pointercancel', up)
  }

  private setPressed(on: boolean): void {
    if (on === this.pressed) return
    this.pressed = on
    if (this.last) this.update(this.last.look, this.last.year, false, this.last.origin)
  }

  update(look: ButtonLook, year: number, animate = true, origin: PagePoint | null = null): void {
    this.last = { look, year, origin }
    const w = look.width
    const hh = look.height
    const r = Math.min(look.cornerRadius, hh / 2)
    const cont = look.continuousCorners
    const box = this.box
    css(box, 'left', px(-w / 2))
    css(box, 'top', px(-hh / 2))
    css(box, 'width', px(w))
    css(box, 'height', px(hh))

    // Land on the device pixel grid, where SwiftUI puts it. Which whole CSS
    // pixel the browser would round this box to depends on the fractions its
    // ancestors carry, so the box is measured (its own nudge taken back off)
    // rather than guessed; `origin` says where it belongs.
    const dpr = window.devicePixelRatio || 1
    if (origin && dpr > 1.01) {
      const at = box.getBoundingClientRect()
      if (at.width > 0) {
        const laidOutX = at.left - this.nudge.x
        const laidOutY = at.top - this.nudge.y
        this.nudge = {
          x: toDevicePixels(origin.x, dpr) - laidOutX,
          y: toDevicePixels(origin.y, dpr) - laidOutY,
        }
        css(this.el, 'transform', `translate(${px(this.nudge.x)}, ${px(this.nudge.y)})`)
      }
    } else if (this.nudge.x || this.nudge.y) {
      this.nudge = { x: 0, y: 0 }
      css(this.el, 'transform', 'none')
    }

    // How much of this button is painted rather than glass or bare text:
    // painted buttons darken when pressed, the rest dim like a text link.
    const painted = Math.max(look.fillTop.a, look.fillBottom.a) * (1 - look.glass)

    // The groove is the same shape grown outward, so its corners stay
    // concentric with the fill's; the lip is the groove again, 1 pt lower.
    const ww = look.wellWidth
    shown(this.lip, ww > 0.01 && look.lowerLip.a > 0.001)
    shown(this.well, ww > 0.01 && (look.wellTop.a > 0.001 || look.wellBottom.a > 0.001))
    if (ww > 0.01) {
      shapeBox(this.lip, w, hh, r, cont, ww)
      css(this.lip, 'margin-top', '1px')
      css(this.lip, 'background', c(look.lowerLip))
      const wellAt = shapeBox(this.well, w, hh, r, cont, ww)
      css(this.well, 'background', downGradient(wellAt - ww,
        [c(look.wellTop), 0], [c(look.wellBottom), hh + ww * 2]))
    }

    const sh = look.shadow
    const shadowOn = sh.a > 0.001
    shown(this.shadow, shadowOn)
    if (shadowOn) {
      css(this.shadow, 'left', '0px')
      css(this.shadow, 'top', '0px')
      css(this.shadow, 'width', px(w))
      css(this.shadow, 'height', px(hh))
      css(this.shadow, 'border-radius', px(r))
      css(this.shadow, 'box-shadow', `0 ${px(look.shadowY)} ${px(shadowBlur(look.shadowRadius))} ${c(sh)}`)
    }

    const fillOn = look.fillTop.a > 0.001 || look.fillUpper.a > 0.001 || look.fillLower.a > 0.001 || look.fillBottom.a > 0.001
    shown(this.fill, fillOn)
    if (fillOn) {
      const fillAt = shapeBox(this.fill, w, hh, r, cont)
      const gloss = clamp(look.glossLine, 0, 1) * hh
      css(this.fill, 'background', downGradient(fillAt,
        [c(look.fillTop), 0], [c(look.fillUpper), gloss], [c(look.fillLower), gloss], [c(look.fillBottom), hh]))
    }

    // Liquid Glass.
    const glassOn = look.glass > 0.01
    shown(this.glass, glassOn)
    shown(this.rimOuter, glassOn)
    shown(this.rimInner, glassOn)
    if (glassOn) {
      shapeBox(this.glass, w, hh, r, cont)
      css(this.glassFill, 'background', glassColour(look.glassTint))
      css(this.glass, 'opacity', n(look.glass))
      bandBox(this.rimOuter, w, hh, r, 0, RIM_OUTER, cont)
      css(this.rimOuter, 'background', rimSweep(1))
      css(this.rimOuter, 'opacity', n(look.glass))
      bandBox(this.rimInner, w, hh, r, RIM_OUTER, RIM_INNER, cont)
      css(this.rimInner, 'background', rimSweep(RIM_FADE))
      css(this.rimInner, 'opacity', n(look.glass))
    }

    // The bevel: a 1 pt line inside the outline, fading out by half height.
    const sw = look.strokeWidth
    const hiOn = look.innerHighlight.a > 0.001
    shown(this.highlight, hiOn)
    if (hiOn) {
      const hiAt = bandBox(this.highlight, w, hh, r, sw, sw + 1, cont)
      css(this.highlight, 'background', downGradient(hiAt,
        [c(look.innerHighlight), 0], [c(look.innerHighlight, 0), hh / 2]))
    }

    const strokeOn = sw > 0.01 && (look.strokeTop.a > 0.001 || look.strokeBottom.a > 0.001)
    shown(this.stroke, strokeOn)
    if (strokeOn) {
      const strokeAt = bandBox(this.stroke, w, hh, r, 0, sw, cont)
      css(this.stroke, 'background', downGradient(strokeAt,
        [c(look.strokeTop), 0], [c(look.strokeBottom), hh]))
    }

    // A painted button darkens while held; the tint stays in place so it can
    // fade in and out (.animation(.easeOut(duration: 0.12), value: pressed)).
    const pressable = painted > 0.001
    shown(this.press, pressable)
    if (pressable) {
      shapeBox(this.press, w, hh, r, cont)
      css(this.press, 'background', `rgba(0,0,0,${n(0.22 * painted)})`)
      css(this.press, 'opacity', this.pressed ? '1' : '0')
    }

    const label = this.label
    label.set(String(year), animate)
    css(label.el, 'font', fontCSS(look.typeface, look.weight, look.labelSize))
    // The `font` shorthand resets it, so it follows the font.
    css(label.el, 'font-variant-numeric', 'tabular-nums')
    const face = eraFont(look.typeface, look.weight)
    const met = fontMetrics(face.family, face.weight)
    const size = look.labelSize
    // Where the browser's rounded metrics put the baseline, and where the
    // font's real ones do.
    const rounded = (Math.round(met.ascent * size) - Math.round(met.descent * size)) / 2
    const wanted = ((met.ascent - met.descent) / 2 + LABEL_TUNE[look.typeface]) * size
    const shift = wanted - rounded
    css(label.el, 'transform', Math.abs(shift) > 0.001 ? `translateY(${px(shift)})` : 'none')
    css(label.el, 'color', c(look.label))
    css(label.el, 'text-shadow', look.labelShadow.a > 0.001 ? `0 ${px(look.labelShadowY)} 0 ${c(look.labelShadow)}` : 'none')
    css(label.el, 'opacity', n(this.pressed ? 1 - 0.7 * (1 - painted) * (1 - look.glass) : 1))
  }
}
