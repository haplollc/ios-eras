// The button as numbers (ButtonErasModel.swift). Everything about a year
// that can be drawn is a number or an Ink, so two neighbouring years can be
// blended and the button (and the iPhone it lives on) morphs while the ruler
// is mid-drag instead of cutting. The screen and the iPhone reuse the shared
// ScreenLook / DeviceLook of src/core/looks.ts (same fields as the Swift).

import type { Ink } from '../core/ink'
import { blendRecord, lerp } from '../core/ink'
import type { DeviceLook, EraCaption, EraTypeface, FontWeight, ScreenLook } from '../core/looks'
import { blendDevice, blendScreen, segment } from '../core/looks'

export interface ButtonLook {
  width: number
  height: number
  /** Use a radius of half the height or more for a capsule. */
  cornerRadius: number

  /** A four-stop vertical fill. `fillUpper` and `fillLower` both sit on
   *  `glossLine`, so a hard gloss break is two different colours there and a
   *  flat or smooth fill is the same colour twice. */
  fillTop: Ink
  fillUpper: Ink
  fillLower: Ink
  fillBottom: Ink
  glossLine: number

  /** The dark groove big glossy buttons were sunk into: a ring OUTSIDE the
   *  fill, darkest along its top. */
  wellTop: Ink
  wellBottom: Ink
  wellWidth: number

  /** The outline, darker along the top than the bottom in the glossy years. */
  strokeTop: Ink
  strokeBottom: Ink
  strokeWidth: number
  /** A light line just inside the top edge: the bevel on glossy buttons. */
  innerHighlight: Ink
  /** A light line just under the bottom edge: the emboss. */
  lowerLip: Ink
  shadow: Ink
  shadowRadius: number
  shadowY: number

  label: Ink
  labelSize: number
  /** An engraved (negative y) or embossed (positive y) label shadow. */
  labelShadow: Ink
  labelShadowY: number

  /** How much of the real Liquid Glass layer shows, 0...1. */
  glass: number
  glassTint: Ink

  // Not blendable: these flip at the halfway point.
  typeface: EraTypeface
  weight: FontWeight
  continuousCorners: boolean
}

/** The same button drawn larger: every length grows, colours stay. */
export function scaledButton(look: ButtonLook, k: number): ButtonLook {
  if (k === 1) return look
  return {
    ...look,
    width: look.width * k,
    height: look.height * k,
    cornerRadius: look.cornerRadius * k,
    wellWidth: look.wellWidth * k,
    strokeWidth: look.strokeWidth * k,
    shadowRadius: look.shadowRadius * k,
    shadowY: look.shadowY * k,
    labelSize: look.labelSize * k,
    labelShadowY: look.labelShadowY * k,
  }
}

/** ButtonLook.blend: every number and Ink blends; the corner radius blends
 *  from each side's effective radius (at most half the height), so a capsule
 *  does not overshoot on its way to a slab. */
export function blendButton(a: ButtonLook, b: ButtonLook, t: number): ButtonLook {
  const out = blendRecord(a, b, t)
  out.cornerRadius = lerp(Math.min(a.cornerRadius, a.height / 2), Math.min(b.cornerRadius, b.height / 2), t)
  return out
}

export interface ButtonEra extends EraCaption {
  /** One line on what changed about buttons that year. */
  note: string
  button: ButtonLook
  screen: ScreenLook
  hardware: DeviceLook
}

export interface ButtonMoment {
  button: ButtonLook
  screen: ScreenLook
  hardware: DeviceLook
  /** The year the label shows: the nearest row's. */
  year: number
}

/** The looks at a continuous position, blended between the two years either
 *  side of it (Array<ButtonEra>.looks(at:)). */
export function looksAt(eras: ButtonEra[], position: number): ButtonMoment {
  const { lower, upper, t } = segment(position, eras.length)
  const a = eras[lower]
  const b = eras[upper]
  const near = Math.min(Math.max(Math.round(position), 0), eras.length - 1)
  return {
    button: blendButton(a.button, b.button, t),
    screen: blendScreen(a.screen, b.screen, t),
    hardware: blendDevice(a.hardware, b.hardware, t),
    year: eras[near].year,
  }
}
