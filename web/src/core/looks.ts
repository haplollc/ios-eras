// The screen and the iPhone as numbers (ButtonErasModel.swift and the
// device helpers of ButtonErasTimeline.swift). Lengths on the iPhone are
// millimetres; the device view multiplies them by its scale (CSS px per mm).
// Both timelines share these.

import type { Ink } from './ink'
import { blendRecord, clamp, ink } from './ink'

// ---------------------------------------------------------------- blending

/** A copy of `value` with `change` applied (Swift's `.with { }`). */
export function withChange<T extends object>(value: T, change: (copy: T) => void): T {
  const copy = { ...value }
  change(copy)
  return copy
}

/** Where a continuous timeline position falls: the two rows either side of
 *  it and how far between them (Array.looks(at:) in Swift). */
export function segment(position: number, count: number): { lower: number; upper: number; t: number } {
  const clamped = clamp(position, 0, Math.max(count - 1, 0))
  const lower = Math.floor(clamped)
  const upper = Math.min(lower + 1, count - 1)
  return { lower, upper, t: clamped - lower }
}

/** The row nearest a position. */
export const nearestIndex = (position: number, count: number): number =>
  clamp(Math.round(position), 0, Math.max(count - 1, 0))

// ---------------------------------------------------------------- type

export type EraTypeface = 'helvetica' | 'helveticaNeue' | 'sanFrancisco'

export type FontWeight = 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black'

const weightOrder: FontWeight[] = ['ultraLight', 'thin', 'light', 'regular', 'medium', 'semibold', 'bold', 'heavy', 'black']
const cssWeights: Record<FontWeight, number> = {
  ultraLight: 100, thin: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, heavy: 800, black: 900,
}

/** CSS font stacks. Locally installed faces are referenced, never embedded. */
export const fontStacks: Record<EraTypeface, string> = {
  helvetica: `Helvetica, Arial, sans-serif`,
  helveticaNeue: `'Helvetica Neue', Helvetica, Arial, sans-serif`,
  sanFrancisco: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
}

export interface CSSFont {
  family: string
  weight: number
}

/** EraTypeface.font(size:weight:) as CSS. Helvetica has only a regular and
 *  a bold; Helvetica Neue a light, regular, medium and bold. */
export function eraFont(face: EraTypeface, weight: FontWeight): CSSFont {
  const rank = weightOrder.indexOf(weight)
  switch (face) {
    case 'helvetica':
      return { family: fontStacks.helvetica, weight: rank >= weightOrder.indexOf('semibold') ? 700 : 400 }
    case 'helveticaNeue': {
      let w = 400
      if (weight === 'light' || weight === 'thin' || weight === 'ultraLight') w = 300
      else if (weight === 'medium') w = 500
      else if (rank >= weightOrder.indexOf('semibold')) w = 700
      return { family: fontStacks.helveticaNeue, weight: w }
    }
    default:
      return { family: fontStacks.sanFrancisco, weight: cssWeights[weight] }
  }
}

/** A CSS `font` shorthand. */
export function fontCSS(face: EraTypeface, weight: FontWeight, size: number): string {
  const f = eraFont(face, weight)
  return `${f.weight} ${+size.toFixed(3)}px ${f.family}`
}

// ---------------------------------------------------------------- screen

export interface ScreenLook {
  top: Ink
  bottom: Ink
  /** The grey pinstripes of early grouped table views, 0...1. */
  pinstripes: number
  /** The woven linen of iOS 5 and 6, 0...1. */
  linen: number
  /** Soft colour blooms (blurred-gradient wallpapers), 0...1. */
  blooms: number
  bloomA: Ink
  bloomB: Ink
  /** Status bar ink. */
  chrome: Ink
  /** The opaque strip the status bar sat on before iOS 7. */
  statusBand: Ink
  /** Where the clock sits across the status bar, 0...1. */
  clockX: number
}

export const blendScreen = (a: ScreenLook, b: ScreenLook, t: number): ScreenLook => blendRecord(a, b, t)

const clearInk: Ink = { r: 1, g: 1, b: 1, a: 0 }

export const ScreenLooks = {
  white: {
    top: ink(0xffffff), bottom: ink(0xffffff), pinstripes: 0, linen: 0,
    blooms: 0, bloomA: clearInk, bloomB: clearInk,
    chrome: ink(0x000000), statusBand: clearInk, clockX: 0.5,
  } as ScreenLook,

  /** An opaque black status bar over a coloured surface: 2007 to 2011. */
  classic(top: number, bottom: number): ScreenLook {
    return withChange(ScreenLooks.white, (s) => {
      s.top = ink(top); s.bottom = ink(bottom)
      s.chrome = ink(0xffffff); s.statusBand = ink(0x000000)
    })
  },

  /** A blurred-colour wallpaper, for anything that floats or refracts. */
  wallpaper(top: number, bottom: number, a: number, b: number, strength = 1): ScreenLook {
    return withChange(ScreenLooks.white, (s) => {
      s.top = ink(top); s.bottom = ink(bottom)
      s.blooms = strength; s.bloomA = ink(a); s.bloomB = ink(b)
      s.chrome = ink(0xffffff); s.clockX = 0.17
    })
  },
}

// ---------------------------------------------------------------- iPhone

/** A front-on silhouette. Lengths are millimetres. */
export interface DeviceLook {
  bodyWidth: number
  bodyHeight: number
  bodyRadius: number
  bezelTop: number
  bezelSide: number
  bezelBottom: number
  screenRadius: number
  /** The band around the edge: chrome, steel, aluminium, titanium. */
  frame: Ink
  frameWidth: number
  /** The glass face around the display. */
  face: Ink
  homeButton: number
  homeDiameter: number
  homeGlyph: number
  homeRing: number
  homeInk: Ink
  earpiece: number
  earpieceWidth: number
  notch: number
  notchWidth: number
  notchHeight: number
  island: number
  islandWidth: number
  islandHeight: number
  islandTop: number
}

export const blendDevice = (a: DeviceLook, b: DeviceLook, t: number): DeviceLook => blendRecord(a, b, t)

/** The original: a chrome ring round a black face, a printed home glyph. */
const iPhone2007: DeviceLook = {
  bodyWidth: 61, bodyHeight: 115, bodyRadius: 11,
  bezelTop: 20.5, bezelSide: 5.85, bezelBottom: 20.5, screenRadius: 0,
  frame: ink(0xc9cbce), frameWidth: 1.5, face: ink(0x0a0a0a),
  homeButton: 1, homeDiameter: 11.2, homeGlyph: 1, homeRing: 0, homeInk: ink(0x77777c),
  earpiece: 1, earpieceWidth: 11,
  notch: 0, notchWidth: 34.8, notchHeight: 0.1,
  island: 0, islandWidth: 20.7, islandHeight: 6.1, islandTop: 1.8,
}

export interface HomeButtonPhoneSpec {
  width: number
  height: number
  radius: number
  screenWidth: number
  screenHeight: number
  frame: number
  frameWidth?: number
  face?: number
  homeInk?: number
  glyph: number
  ring: number
}

export interface AllScreenSpec {
  width: number
  height: number
  bezel: number
  screenRadius: number
  frame: number
  frameWidth?: number
  notchWidth?: number
  island?: boolean
}

export const DeviceLooks = {
  iPhone2007,

  /** A 3.5" or 4" or 4.7" home-button iPhone. */
  homeButtonPhone(o: HomeButtonPhoneSpec): DeviceLook {
    return withChange(iPhone2007, (d) => {
      d.bodyWidth = o.width; d.bodyHeight = o.height; d.bodyRadius = o.radius
      d.bezelSide = (o.width - o.screenWidth) / 2
      d.bezelTop = (o.height - o.screenHeight) / 2
      d.bezelBottom = (o.height - o.screenHeight) / 2
      d.frame = ink(o.frame); d.frameWidth = o.frameWidth ?? 1.1
      d.face = ink(o.face ?? 0x0a0a0a); d.homeInk = ink(o.homeInk ?? 0x77777c)
      d.homeDiameter = 10.9; d.homeGlyph = o.glyph; d.homeRing = o.ring
      d.earpieceWidth = 10
    })
  },

  /** An all-screen iPhone with a notch or an island. */
  allScreen(o: AllScreenSpec): DeviceLook {
    const notchWidth = o.notchWidth ?? 0
    return withChange(iPhone2007, (d) => {
      d.bodyWidth = o.width; d.bodyHeight = o.height
      d.bodyRadius = o.screenRadius + o.bezel
      d.bezelTop = o.bezel; d.bezelSide = o.bezel; d.bezelBottom = o.bezel
      d.screenRadius = o.screenRadius
      d.frame = ink(o.frame); d.frameWidth = o.frameWidth ?? 1.0; d.face = ink(0x050505)
      d.homeButton = 0; d.homeGlyph = 0; d.homeRing = 0
      d.earpiece = 0
      d.notch = notchWidth > 0 ? 1 : 0
      d.notchWidth = notchWidth > 0 ? notchWidth : 26.8
      d.notchHeight = notchWidth > 0 ? 5.3 : 0.1
      d.island = o.island ? 1 : 0
    })
  },

  iPhone3G: withChange(iPhone2007, (d) => {
    d.bodyWidth = 62.1; d.bodyHeight = 115.5
    d.bezelSide = 6.4; d.bezelTop = 20.75; d.bezelBottom = 20.75
  }),
}

/** The captions every timeline row carries. */
export interface EraCaption {
  year: number
  system: string
  device: string
  note: string
}
