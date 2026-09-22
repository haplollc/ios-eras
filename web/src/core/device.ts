// The iPhone, its screen and its status bar (ButtonErasStage.swift: EraDevice,
// EraBackdrop, EraStatusBar, CutoutGeometry, CutoutShape). Each view builds
// its DOM once; update(look) then only changes styles and attributes, so a
// scrub costs a handful of property writes per frame.

import type { Ink } from './ink'
import { clamp, css as cssInk, lerp } from './ink'
import type { DeviceLook, ScreenLook } from './looks'
import { attr, continuousRectPath, css, h, linearGradient, n, px, radialGradient, s, uid } from './dom'

const c = cssInk

/** SwiftUI's `.shadow(radius: r)` is a Gaussian of standard deviation r,
 *  which CSS spells as a blur radius of 2r. */
export const shadowBlur = (radius: number): number => radius * 2

// ---------------------------------------------------------------- cutout

/** The camera cutout at one moment, in millimetres. The notch of 2017-2021
 *  and the island of 2022 on are one shape, so the scrub can carry one into
 *  the other: first the notch draws in to the island's size and loses its
 *  shoulders, then it drops away from the top edge and rounds off. */
export interface CutoutGeometry {
  width: number
  height: number
  top: number
  bottomRadius: number
  topRadius: number
  shoulder: number
  /** 0 with no cutout, 1 with one. */
  presence: number
  bottom: number
  /** The status bar's centre line. */
  centreY: number
}

export function cutoutGeometry(look: DeviceLook): CutoutGeometry {
  const g: CutoutGeometry = { width: 0, height: 0, top: 0, bottomRadius: 0, topRadius: 0, shoulder: 0, presence: 0, bottom: 0, centreY: 0 }
  g.presence = Math.min(1, look.notch + look.island)
  if (g.presence <= 0.001) return g
  const k = look.island / Math.max(look.notch + look.island, 0.001)
  const shrink = Math.min(1, k * 2)
  const detach = Math.max(0, k * 2 - 1)
  const notchRadius = look.notchHeight * 0.62
  g.width = lerp(look.notchWidth, look.islandWidth, shrink)
  g.height = lerp(look.notchHeight, look.islandHeight, shrink)
  g.bottomRadius = lerp(notchRadius, look.islandHeight / 2, shrink)
  g.shoulder = (1 - shrink) * 1.0
  g.top = detach * look.islandTop
  g.topRadius = (detach * look.islandHeight) / 2
  g.centreY = lerp(look.notchHeight * 0.73, look.islandTop + look.islandHeight / 2, k)
  if (k < 0.001) {
    g.height *= g.presence
    g.bottomRadius = Math.min(g.bottomRadius, g.height / 2)
  }
  g.bottom = g.top + g.height
  return g
}

/** CutoutShape.path(in:) as an SVG path, in a rect whose top edge is y = 0
 *  and whose centre is x = midX. */
export function cutoutPath(midX: number, width: number, height: number, top: number, bottomRadius: number, topRadius: number, shoulder: number): string {
  if (width <= 0.5 || height <= 0.5) return ''
  const x0 = midX - width / 2, x1 = midX + width / 2
  const y0 = top, y1 = y0 + height
  const rb = Math.min(bottomRadius, height / 2, width / 2)
  const rt = Math.min(topRadius, height / 2, width / 2)
  const sh = Math.min(shoulder, height / 2)
  const P = (x: number, y: number) => `${n(x)} ${n(y)}`
  let d = ''
  if (sh > 0.05) d += `M${P(x0 - sh, y0)}Q${P(x0, y0)} ${P(x0, y0 + sh)}`
  else d += `M${P(x0, y0 + rt)}`
  d += `L${P(x0, y1 - rb)}Q${P(x0, y1)} ${P(x0 + rb, y1)}`
  d += `L${P(x1 - rb, y1)}Q${P(x1, y1)} ${P(x1, y1 - rb)}`
  if (sh > 0.05) {
    d += `L${P(x1, y0 + sh)}Q${P(x1, y0)} ${P(x1 + sh, y0)}`
  } else {
    d += `L${P(x1, y0 + rt)}Q${P(x1, y0)} ${P(x1 - rt, y0)}`
    d += `L${P(x0 + rt, y0)}Q${P(x0, y0)} ${P(x0, y0 + rt)}`
  }
  return d + 'Z'
}

// ---------------------------------------------------------------- device

export interface DeviceFrame {
  width: number
  height: number
  screenX: number
  screenY: number
  screenWidth: number
  screenHeight: number
}

/** The iPhone: body, frame band, glass face, the display's black border,
 *  the screen (clipped, with the notch or island over it), earpiece and
 *  home button. `content` is where the screen's views go. */
export class EraDevice {
  readonly el: HTMLDivElement
  readonly screen: HTMLDivElement
  readonly content: HTMLDivElement
  /** CSS px per millimetre of iPhone. */
  scale: number
  readonly screenOnly: boolean
  frame: DeviceFrame = { width: 0, height: 0, screenX: 0, screenY: 0, screenWidth: 0, screenHeight: 0 }

  private shadow?: HTMLDivElement
  private svg?: SVGSVGElement
  private bodyPath?: SVGPathElement
  private framePath?: SVGPathElement
  private surroundPath?: SVGPathElement
  private stops: SVGStopElement[] = []
  private grad?: SVGLinearGradientElement
  private cutoutSvg: SVGSVGElement
  private cutout: SVGPathElement
  private earpiece?: HTMLDivElement
  private home?: HTMLDivElement
  private homeBg?: HTMLDivElement
  private homeEdge?: HTMLDivElement
  private homeGlyph?: HTMLDivElement
  private homeRing?: HTMLDivElement

  constructor(opts: { scale?: number; screenOnly?: boolean } = {}) {
    this.scale = opts.scale ?? 4.3
    this.screenOnly = !!opts.screenOnly
    this.el = h('div', 'era-device', { position: 'relative' })
    if (!this.screenOnly) {
      this.shadow = h('div', 'era-device-shadow', { position: 'absolute', left: '0', top: '0' }, this.el)
      const svg = s('svg', { class: 'era-device-body' }, this.el)
      svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible'
      const defs = s('defs', {}, svg)
      const id = uid('frame')
      this.grad = s('linearGradient', { id, gradientUnits: 'userSpaceOnUse', x1: 0, y1: 0, x2: 1, y2: 1 }, defs)
      for (const o of [0, 0.5, 1]) this.stops.push(s('stop', { offset: o }, this.grad))
      this.bodyPath = s('path', {}, svg)
      this.framePath = s('path', { fill: 'none', stroke: `url(#${id})` }, svg)
      this.surroundPath = s('path', { fill: '#000' }, svg)
      this.svg = svg
    }
    this.screen = h('div', 'era-screen', { position: 'absolute', overflow: 'hidden' }, this.el)
    this.content = h('div', 'era-screen-content', { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }, this.screen)
    this.cutoutSvg = s('svg', { class: 'era-cutout' }, this.screen)
    this.cutoutSvg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none'
    this.cutout = s('path', { fill: '#000' }, this.cutoutSvg)
    if (!this.screenOnly) {
      this.earpiece = h('div', 'era-earpiece', { position: 'absolute', 'border-radius': '999px' }, this.el)
      const home = h('div', 'era-home', { position: 'absolute' }, this.el)
      this.homeBg = h('div', '', { position: 'absolute', inset: '0', 'border-radius': '50%' }, home)
      // strokeBorder as an inset shadow, never a border: Chrome snaps border
      // widths to whole CSS pixels (0.75 becomes 1, 1.69 becomes 1), which
      // showed as a too-heavy rim and a too-thin home glyph.
      this.homeEdge = h('div', '', { position: 'absolute', inset: '0', 'border-radius': '50%' }, home)
      this.homeGlyph = h('div', '', { position: 'absolute' }, home)
      this.homeRing = h('div', '', { position: 'absolute', inset: '0', 'border-radius': '50%' }, home)
      this.home = home
    }
  }

  update(look: DeviceLook): DeviceFrame {
    const sc = this.scale
    const width = look.bodyWidth * sc
    const height = look.bodyHeight * sc
    const screenWidth = (look.bodyWidth - look.bezelSide * 2) * sc
    const screenHeight = (look.bodyHeight - look.bezelTop - look.bezelBottom) * sc
    const screenX = (width - screenWidth) / 2
    const screenY = look.bezelTop * sc
    this.frame = this.screenOnly
      ? { width: screenWidth, height: screenHeight, screenX: 0, screenY: 0, screenWidth, screenHeight }
      : { width, height, screenX, screenY, screenWidth, screenHeight }

    css(this.el, 'width', px(this.frame.width))
    css(this.el, 'height', px(this.frame.height))

    if (!this.screenOnly) {
      const bodyR = look.bodyRadius * sc
      // The shadow is a plain rounded box: at this blur the continuous
      // corner and the circular one cast the same shadow.
      // It is inset 2 px so its edge hides under the body's antialiased one.
      const sh = this.shadow!
      css(sh, 'left', '2px')
      css(sh, 'top', '2px')
      css(sh, 'width', px(width - 4))
      css(sh, 'height', px(height - 4))
      css(sh, 'border-radius', px(Math.max(0, bodyR - 2)))
      css(sh, 'box-shadow', `0 12px ${shadowBlur(18)}px rgba(0,0,0,0.18)`)

      const svg = this.svg!
      attr(svg, 'width', n(width))
      attr(svg, 'height', n(height))
      attr(svg, 'viewBox', `0 0 ${n(width)} ${n(height)}`)
      attr(this.bodyPath!, 'd', continuousRectPath(0, 0, width, height, bodyR))
      attr(this.bodyPath!, 'fill', c(look.face))

      // strokeBorder: the stroke sits inside the silhouette.
      const lw = look.frameWidth * sc
      attr(this.framePath!, 'd', continuousRectPath(lw / 2, lw / 2, width - lw, height - lw, bodyR - lw / 2))
      attr(this.framePath!, 'stroke-width', n(lw))
      attr(this.grad!, 'x2', n(width))
      attr(this.grad!, 'y2', n(height))
      attr(this.stops[0], 'stop-color', c(look.frame))
      attr(this.stops[1], 'stop-color', c(look.frame, 0.78))
      attr(this.stops[2], 'stop-color', c(look.frame))

      // The black border every display has.
      const sw = screenWidth + 1.0 * sc
      const shh = screenHeight + 1.0 * sc
      attr(this.surroundPath!, 'd', continuousRectPath((width - sw) / 2, screenY - 0.5 * sc, sw, shh, look.screenRadius * sc + 0.5 * sc))
    }

    const scr = this.screen
    css(scr, 'left', px(this.frame.screenX))
    css(scr, 'top', px(this.frame.screenY))
    css(scr, 'width', px(screenWidth))
    css(scr, 'height', px(screenHeight))
    const sr = look.screenRadius * sc
    css(scr, 'clip-path', sr > 0.05 ? `path('${continuousRectPath(0, 0, screenWidth, screenHeight, sr)}')` : 'none')

    // The notch hangs off the top edge; the island floats below it.
    const g = cutoutGeometry(look)
    if (g.presence > 0.01) {
      attr(this.cutoutSvg, 'width', n(screenWidth))
      attr(this.cutoutSvg, 'height', n((g.top + g.height + g.shoulder) * sc + 1))
      attr(this.cutout, 'd', cutoutPath(screenWidth / 2, g.width * sc, g.height * sc, g.top * sc, g.bottomRadius * sc, g.topRadius * sc, g.shoulder * sc))
      css(this.cutoutSvg, 'display', 'block')
    } else {
      css(this.cutoutSvg, 'display', 'none')
    }

    if (this.screenOnly) return this.frame

    const ep = this.earpiece!
    if (look.earpiece > 0.01) {
      const ew = look.earpieceWidth * sc
      const eh = 1.3 * sc
      css(ep, 'display', 'block')
      css(ep, 'width', px(ew))
      css(ep, 'height', px(eh))
      css(ep, 'left', px((width - ew) / 2))
      css(ep, 'top', px((look.bezelTop * sc - eh) / 2))
      css(ep, 'background', c(look.homeInk))
      // Gone before the shrinking bezel can carry it onto the screen.
      css(ep, 'opacity', n(Math.max(0, look.earpiece * 2 - 1)))
    } else {
      css(ep, 'display', 'none')
    }

    const home = this.home!
    if (look.homeButton > 0.01) {
      const d = look.homeDiameter * sc
      css(home, 'display', 'block')
      css(home, 'width', px(d))
      css(home, 'height', px(d))
      css(home, 'left', px((width - d) / 2))
      css(home, 'top', px(height - (look.bezelBottom * sc) / 2 - d / 2))
      css(home, 'opacity', n(Math.max(0, look.homeButton * 2 - 1)))
      css(this.homeBg!, 'background', radialGradient(`circle ${px(d * 0.62)} at 50% 50%`, `${c(look.face)} ${px(d * 0.2)}`, `${c(look.homeInk, 0.35)} ${px(d * 0.62)}`))
      css(this.homeEdge!, 'box-shadow', `inset 0 0 0 ${px(0.75)} ${c(look.homeInk, 0.5)}`)
      const gs = d * 0.36
      const g2 = this.homeGlyph!
      css(g2, 'width', px(gs))
      css(g2, 'height', px(gs))
      css(g2, 'left', px((d - gs) / 2))
      css(g2, 'top', px((d - gs) / 2))
      css(g2, 'border-radius', px(d * 0.09 * 1.12))
      css(g2, 'box-shadow', `inset 0 0 0 ${px(Math.max(0.9, d * 0.035))} ${c(look.homeInk)}`)
      css(g2, 'opacity', n(look.homeGlyph))
      css(this.homeRing!, 'box-shadow', `inset 0 0 0 ${px(Math.max(1, d * 0.06))} ${c(look.frame)}`)
      css(this.homeRing!, 'opacity', n(look.homeRing))
    } else {
      css(home, 'display', 'none')
    }
    return this.frame
  }
}

// ---------------------------------------------------------------- backdrop

let linenURL: string | null = null

/** The iOS 5-6 linen as a small tile: faint short threads both ways, from
 *  the same generator as the SwiftUI Canvas. */
function linenTexture(): string {
  if (linenURL) return linenURL
  const size = 256
  const dpr = Math.min(3, Math.max(1, Math.round(window.devicePixelRatio || 1)))
  const canvas = document.createElement('canvas')
  canvas.width = size * dpr
  canvas.height = size * dpr
  const ctx = canvas.getContext('2d')
  if (!ctx) return (linenURL = '')
  ctx.scale(dpr, dpr)
  let seed = 0x9e3779b9 >>> 0
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return (seed >>> 8) / (1 << 24)
  }
  for (let y = 0; y < size; y += 1) {
    let x = -next() * 14
    while (x < size) {
      const run = 6 + next() * 16
      const tone = next()
      ctx.fillStyle = tone > 0.5 ? `rgba(255,255,255,${0.025 + 0.05 * next()})` : `rgba(0,0,0,${0.025 + 0.05 * next()})`
      ctx.fillRect(x, y, run, 0.5)
      x += run + next() * 5
    }
  }
  for (let x = 0; x < size; x += 1) {
    let y = -next() * 14
    while (y < size) {
      const run = 6 + next() * 16
      const tone = next()
      ctx.fillStyle = tone > 0.5 ? `rgba(255,255,255,${0.02 + 0.04 * next()})` : `rgba(0,0,0,${0.02 + 0.04 * next()})`
      ctx.fillRect(x, y, 0.5, run)
      y += run + next() * 5
    }
  }
  linenURL = canvas.toDataURL('image/png')
  return linenURL
}

/** The screen's own surface: a vertical gradient, with blooms, pinstripes
 *  or linen over it. */
export class EraBackdrop {
  readonly el: HTMLDivElement
  private blooms: HTMLDivElement
  private stripes: HTMLDivElement
  private linen: HTMLDivElement

  constructor() {
    const fill = { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }
    this.el = h('div', 'era-backdrop', fill)
    this.blooms = h('div', '', fill, this.el)
    this.stripes = h('div', '', {
      ...fill,
      background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.16) 0 1.5px, transparent 1.5px 3.5px)',
    }, this.el)
    this.linen = h('div', '', { ...fill, 'background-size': '256px 256px' }, this.el)
  }

  update(look: ScreenLook, width: number, height: number): void {
    css(this.el, 'background', linearGradient('180deg', c(look.top), c(look.bottom)))

    if (look.blooms > 0.01) {
      const side = Math.max(width, height)
      const rA = side * 0.62
      const rB = side * 0.56
      const a = look.bloomA
      const b = look.bloomB
      const ringB = radialGradient(`circle ${px(rB)} at ${px(width * 0.88)} ${px(height * 0.72)}`, c(b), `${c({ ...b, a: 0 })} ${px(rB)}`)
      const ringA = radialGradient(`circle ${px(rA)} at ${px(width * 0.18)} ${px(height * 0.3)}`, c(a), `${c({ ...a, a: 0 })} ${px(rA)}`)
      css(this.blooms, 'display', 'block')
      css(this.blooms, 'background', `${ringB}, ${ringA}`)
      css(this.blooms, 'opacity', n(look.blooms))
    } else {
      css(this.blooms, 'display', 'none')
    }

    if (look.pinstripes > 0.01) {
      css(this.stripes, 'display', 'block')
      css(this.stripes, 'opacity', n(look.pinstripes))
    } else {
      css(this.stripes, 'display', 'none')
    }

    if (look.linen > 0.01) {
      css(this.linen, 'display', 'block')
      css(this.linen, 'background-image', `url(${linenTexture()})`)
      css(this.linen, 'opacity', n(look.linen))
    } else {
      css(this.linen, 'display', 'none')
    }
  }
}

// ---------------------------------------------------------------- status bar

/** 9:41 and a full battery, on the band iOS drew them on, sized and placed
 *  as measured for each kind of iPhone. */
export class EraStatusBar {
  readonly el: HTMLDivElement
  private band: HTMLDivElement
  private clock: HTMLSpanElement
  private battery: HTMLDivElement
  private outline: HTMLDivElement
  private fill: HTMLDivElement
  private nub: HTMLDivElement

  constructor() {
    this.el = h('div', 'era-status', { position: 'absolute', left: '0', top: '0', width: '100%', 'pointer-events': 'none' })
    this.el.setAttribute('aria-hidden', 'true')
    this.band = h('div', '', { position: 'absolute', left: '0', top: '0', width: '100%', height: '100%' }, this.el)
    this.clock = h('span', '', {
      position: 'absolute', 'white-space': 'nowrap', 'line-height': 'normal',
      transform: 'translate(-50%, -50%)', 'font-family': 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif', 'font-weight': '600',
    }, this.el)
    this.clock.textContent = '9:41'
    this.battery = h('div', '', { position: 'absolute' }, this.el)
    // An inset shadow, not a border: Chrome rounds a 0.75 px border up to a
    // whole pixel, which drew the outline half as heavy again as iOS does.
    this.outline = h('div', '', { position: 'absolute', left: '0', top: '0' }, this.battery)
    this.fill = h('div', '', { position: 'absolute' }, this.battery)
    this.nub = h('div', '', { position: 'absolute', 'border-radius': '999px' }, this.battery)
  }

  update(look: ScreenLook, hardware: DeviceLook, scale: number, width: number): void {
    const cut = cutoutGeometry(hardware)
    // The 20 pt bar of a home-button phone, on its real point width: 320 pt
    // up to the 4" phones, 375 pt for the 4.7" ones.
    const screenMM = hardware.bodyWidth - hardware.bezelSide * 2
    const points = Math.min(375, Math.max(320, 320 + ((screenMM - 51.7) / (58.5 - 51.7)) * 55))
    const barHeight = (width * 20) / points
    const height = Math.max(barHeight, cut.bottom * scale + 3)
    const centreY = lerp(barHeight / 2, cut.centreY * scale, cut.presence)
    // 12 pt on a home-button phone, 15 pt beside a notch or island.
    const type = width * lerp(12 / points, 0.04, cut.presence)
    const islandShare = hardware.island / Math.max(hardware.notch + hardware.island, 0.001)
    const batteryX = lerp(0.95, lerp(0.86, 0.881, islandShare), cut.presence)

    css(this.el, 'height', px(height))
    css(this.band, 'background', c(look.statusBand))

    const ink: Ink = look.chrome
    css(this.clock, 'font-size', px(type))
    css(this.clock, 'color', c(ink))
    css(this.clock, 'left', px(width * look.clockX))
    // SwiftUI centres the line box (ascent + descent + leading); CSS's
    // 'normal' line height leaves the digits sitting lower, which read as a
    // clock 1 pt low against the iOS captures. 0.045 em lands every year
    // within 2/3 pt (Chrome quantises a text baseline to whole CSS pixels).
    css(this.clock, 'top', px(centreY - type * 0.045))

    const bw = type * 1.9
    const bh = type * 0.9
    const bodyW = bw * 0.9
    const bat = this.battery
    css(bat, 'left', px(width * batteryX - bw / 2))
    css(bat, 'top', px(centreY - bh / 2))
    css(bat, 'width', px(bw))
    css(bat, 'height', px(bh))
    css(this.outline, 'width', px(bodyW))
    css(this.outline, 'height', px(bh))
    css(this.outline, 'border-radius', px(bh * 0.28))
    css(this.outline, 'box-shadow', `inset 0 0 0 0.75px ${c(ink, 0.45)}`)
    css(this.fill, 'left', '1.5px')
    css(this.fill, 'top', '1.5px')
    css(this.fill, 'width', px(Math.max(0, bodyW - 3)))
    css(this.fill, 'height', px(Math.max(0, bh - 3)))
    css(this.fill, 'border-radius', px(bh * 0.16))
    css(this.fill, 'background', c(ink))
    const nubH = bh * 0.4
    css(this.nub, 'left', px(bodyW + 0.75))
    css(this.nub, 'top', px((bh - nubH) / 2))
    css(this.nub, 'width', px(bw * 0.06))
    css(this.nub, 'height', px(nubH))
    css(this.nub, 'background', c(ink, 0.45))
  }
}

/** Keeps a value in 0...1 for opacity. */
export const unit = (v: number): number => clamp(v, 0, 1)
