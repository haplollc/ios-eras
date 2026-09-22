// The table: one row per year, 2007 to 2026 (ButtonErasTimeline.swift).
// Colours marked "sampled" were measured from period assets (Apple's own HIG
// screenshots and figures, and pixel-faithful GUI kits of the day); the rest
// are judged by eye.
//
// An honest timeline has quiet years. Button rendering did not change at all
// from 2007 to 2009, nor from 2010 to 2011, nor from 2021 to 2024, so in
// those stretches the row shows a different REAL button of that year rather
// than inventing a difference, and the note says so.

import type { Ink } from '../core/ink'
import { ink } from '../core/ink'
import type { DeviceLook } from '../core/looks'
import { DeviceLooks, ScreenLooks, withChange } from '../core/looks'
import type { ButtonEra, ButtonLook } from './model'

const clearInk: Ink = ink(0xffffff, 0)

/** `$0.fill(ink)`: the same colour at all four stops. */
function fill(b: ButtonLook, c: Ink): void {
  b.fillTop = c
  b.fillUpper = c
  b.fillLower = c
  b.fillBottom = c
}

// ---------------------------------------------------------------- buttons

/** Nothing drawn: every era starts here and turns on what it used. */
const blank: ButtonLook = {
  width: 176, height: 42, cornerRadius: 10,
  fillTop: clearInk, fillUpper: clearInk, fillLower: clearInk, fillBottom: clearInk,
  glossLine: 0.5,
  wellTop: clearInk, wellBottom: clearInk, wellWidth: 0,
  strokeTop: clearInk, strokeBottom: clearInk, strokeWidth: 1,
  innerHighlight: clearInk, lowerLip: clearInk,
  shadow: ink(0x000000, 0), shadowRadius: 0, shadowY: 0,
  label: ink(0x000000), labelSize: 18,
  labelShadow: ink(0x000000, 0), labelShadowY: 0,
  glass: 0, glassTint: ink(0x0088ff, 0),
  typeface: 'sanFrancisco', weight: 'regular', continuousCorners: false,
}

/** The gel push button of 2007 to 2011: a lighter top half, a hard step at
 *  exactly half height, a nearly flat lower half, sunk in a dark groove.
 *  Silver, as on an action sheet. */
const gelSilver = withChange(blank, (b) => {
  b.height = 40; b.cornerRadius = 9.5
  b.fillTop = ink(0xf5f5f5); b.fillUpper = ink(0xd2d3d5) // sampled
  b.fillLower = ink(0xc0c1c4); b.fillBottom = ink(0xc0c1c4) // sampled
  b.wellTop = ink(0x141517); b.wellBottom = ink(0x464951); b.wellWidth = 3
  b.innerHighlight = ink(0xfbfbfb)
  b.lowerLip = ink(0xffffff, 0.12)
  b.strokeWidth = 0
  b.label = ink(0x000000); b.labelSize = 19
  b.labelShadow = ink(0xffffff, 0.7); b.labelShadowY = 1
  b.typeface = 'helvetica'; b.weight = 'bold'
})

/** The prominent blue of a Done or Send button. */
const gelBlue = withChange(blank, (b) => {
  b.width = 150; b.height = 38; b.cornerRadius = 7
  b.fillTop = ink(0x6792e8); b.fillUpper = ink(0x225fda) // sampled
  b.fillLower = ink(0x1f55c3); b.fillBottom = ink(0x1f57c6) // sampled
  b.strokeTop = ink(0x0f2a60); b.strokeBottom = ink(0x174194) // sampled
  b.innerHighlight = ink(0xffffff, 0.22)
  b.lowerLip = ink(0xffffff, 0.3)
  b.label = ink(0xffffff); b.labelSize = 17
  b.labelShadow = ink(0x000000, 0.6); b.labelShadowY = -1
  b.typeface = 'helvetica'; b.weight = 'bold'
})

/** UIButtonTypeRoundedRect: flat white, thin grey outline, bold blue label.
 *  No gloss at all, which is accurate. */
const roundedRect = withChange(blank, (b) => {
  b.width = 160; b.height = 40; b.cornerRadius = 10
  fill(b, ink(0xffffff))
  b.strokeTop = ink(0xacafb1); b.strokeBottom = ink(0xaaadb0) // sampled
  b.label = ink(0x324f85); b.labelSize = 16
  b.typeface = 'helvetica'; b.weight = 'bold'
})

/** iOS 7's answer: no body at all, only the tint. */
const tintText = withChange(blank, (b) => {
  b.width = 150; b.height = 44
  b.label = ink(0x007aff); b.labelSize = 19
  b.typeface = 'helveticaNeue'; b.weight = 'regular'
})

/** The iOS 15 filled button: a flat continuous-cornered slab. */
const filledSlab = withChange(blank, (b) => {
  b.width = 190; b.height = 46; b.cornerRadius = 10
  fill(b, ink(0x007aff)) // documented
  b.strokeWidth = 0
  b.label = ink(0xffffff); b.labelSize = 17
  b.typeface = 'sanFrancisco'; b.weight = 'regular'
  b.continuousCorners = true
})

export const ButtonLooks = { blank, gelSilver, gelBlue, roundedRect, tintText, filledSlab }

// ---------------------------------------------------------------- iPhones

const homeButtonPhone = DeviceLooks.homeButtonPhone
const allScreen = DeviceLooks.allScreen

const iPhone4: DeviceLook = homeButtonPhone({ width: 58.6, height: 115.2, radius: 8.8, screenWidth: 49.3, screenHeight: 74, frame: 0xb9bbbe, frameWidth: 1.3, glyph: 1, ring: 0 })

// ---------------------------------------------------------------- the timeline

export const buttonTimeline: ButtonEra[] = [
  {
    year: 2007, system: 'iPhone OS 1', device: 'iPhone',
    note: "No SDK yet. Every button is Apple's own, and every one is gel.",
    button: gelSilver,
    screen: ScreenLooks.classic(0x6d737f, 0x515762),
    hardware: DeviceLooks.iPhone2007,
  },
  {
    year: 2008, system: 'iPhone OS 2', device: 'iPhone 3G',
    note: "The SDK ships. This plain white rounded rect becomes every app's button.",
    button: roundedRect,
    screen: withChange(ScreenLooks.classic(0xc5ccd4, 0xc5ccd4), (s) => { s.pinstripes = 1 }),
    hardware: DeviceLooks.iPhone3G,
  },
  {
    year: 2009, system: 'iPhone OS 3', device: 'iPhone 3GS',
    note: 'Same pixels as 2007. The glossy blue Done button is on every screen.',
    button: gelBlue,
    screen: ScreenLooks.classic(0xb0bccd, 0x6d84a2),
    hardware: DeviceLooks.iPhone3G,
  },
  {
    year: 2010, system: 'iOS 4', device: 'iPhone 4',
    note: 'Retina. The same gel, redrawn razor sharp and set in Helvetica Neue.',
    button: withChange(gelSilver, (b) => {
      b.fillTop = ink(0x9ec699); b.fillUpper = ink(0x41bf4a) // sampled green
      b.fillLower = ink(0x0eb81d); b.fillBottom = ink(0x0d9d23)
      b.innerHighlight = ink(0xd6e6d3)
      b.label = ink(0xffffff)
      b.labelShadow = ink(0x000000, 0.45); b.labelShadowY = -1
      b.typeface = 'helveticaNeue'
    }),
    screen: ScreenLooks.classic(0x3a3f48, 0x23272e),
    hardware: iPhone4,
  },
  {
    year: 2011, system: 'iOS 5', device: 'iPhone 4S',
    note: 'The button does not change at all. The linen behind it is new.',
    button: withChange(gelSilver, (b) => { b.typeface = 'helveticaNeue' }),
    screen: withChange(ScreenLooks.classic(0x4e4e53, 0x46464b), (s) => { s.linen = 1 }),
    hardware: iPhone4,
  },
  {
    year: 2012, system: 'iOS 6', device: 'iPhone 5',
    note: 'The hard gloss line melts into satin. Last stop before flat.',
    button: withChange(gelSilver, (b) => {
      // Smooth all the way down, darkest three quarters of the way, then
      // lifting again: light reflected up off the surface.
      b.fillTop = ink(0xfefefe); b.fillUpper = ink(0xc2c3c5) // sampled
      b.fillLower = ink(0xc2c3c5); b.fillBottom = ink(0xe9eaea) // sampled
      b.glossLine = 0.75
      b.wellTop = ink(0x161719)
      b.innerHighlight = ink(0xfefefe)
      b.lowerLip = ink(0xffffff, 0.2)
      b.typeface = 'helveticaNeue'
    }),
    screen: withChange(ScreenLooks.classic(0x777d85, 0x60666f), (s) => { s.statusBand = ink(0x4e6a93) }),
    hardware: homeButtonPhone({ width: 58.6, height: 123.8, radius: 8.8, screenWidth: 49.9, screenHeight: 88.5, frame: 0x2e2f33, glyph: 1, ring: 0 }),
  },
  {
    year: 2013, system: 'iOS 7', device: 'iPhone 5s',
    note: 'The button loses its body. Only the tint is left.',
    button: tintText,
    screen: ScreenLooks.white,
    hardware: homeButtonPhone({ width: 58.6, height: 123.8, radius: 8.8, screenWidth: 49.9, screenHeight: 88.5, frame: 0x9a9ba0, glyph: 0, ring: 1 }),
  },
  {
    year: 2014, system: 'iOS 8', device: 'iPhone 6',
    note: 'A hairline comes back, just enough to say tap me.',
    button: withChange(tintText, (b) => {
      b.width = 120; b.height = 36; b.cornerRadius = 5
      b.strokeTop = ink(0x007aff); b.strokeBottom = ink(0x007aff)
      b.labelSize = 17; b.weight = 'medium'
    }),
    screen: ScreenLooks.white,
    hardware: homeButtonPhone({ width: 67.0, height: 138.1, radius: 11, screenWidth: 58.5, screenHeight: 104, frame: 0xa5a6aa, glyph: 0, ring: 1 }),
  },
  {
    year: 2015, system: 'iOS 9', device: 'iPhone 6s',
    note: 'San Francisco replaces Helvetica Neue, and sheet buttons grow tall and round.',
    button: withChange(tintText, (b) => {
      // The action sheet's Cancel slab: solid white, 13 pt corners.
      b.width = 200; b.height = 50; b.cornerRadius = 13
      fill(b, ink(0xffffff)) // sampled
      b.typeface = 'sanFrancisco'; b.weight = 'semibold'; b.labelSize = 19
    }),
    // A sheet dims whatever is behind it by about forty percent.
    screen: withChange(ScreenLooks.white, (s) => { s.top = ink(0x999999); s.bottom = ink(0x999999) }),
    hardware: homeButtonPhone({ width: 67.1, height: 138.3, radius: 11, screenWidth: 58.5, screenHeight: 104, frame: 0xe6c3b7, face: 0xf5f5f7, homeInk: 0xc9a99d, glyph: 0, ring: 1 }),
  },
  {
    year: 2016, system: 'iOS 10', device: 'iPhone 7',
    note: "Officially still borderless. In Apple's own apps, buttons get filled again.",
    button: withChange(filledSlab, (b) => {
      // Maps' Directions button: plain circular 8 pt corners.
      b.width = 186; b.height = 44; b.cornerRadius = 8
      b.weight = 'semibold'; b.continuousCorners = false
    }),
    screen: ScreenLooks.white,
    hardware: homeButtonPhone({ width: 67.1, height: 138.3, radius: 11, screenWidth: 58.5, screenHeight: 104, frame: 0x1b1b1d, glyph: 0, ring: 1 }),
  },
  {
    year: 2017, system: 'iOS 11', device: 'iPhone X',
    note: "Everything goes bold. The App Store's outlined GET becomes a solid capsule.",
    button: withChange(tintText, (b) => {
      b.width = 118; b.height = 38; b.cornerRadius = 19
      fill(b, ink(0xf0f1f6)) // sampled
      b.typeface = 'sanFrancisco'; b.weight = 'bold'; b.labelSize = 17
      b.continuousCorners = true
    }),
    screen: withChange(ScreenLooks.white, (s) => { s.clockX = 0.17 }),
    hardware: allScreen({ width: 70.9, height: 143.6, bezel: 4.3, screenRadius: 6.5, frame: 0xd9d9db, frameWidth: 1.2, notchWidth: 34.8 }),
  },
  {
    year: 2018, system: 'iOS 12', device: 'iPhone XS',
    note: 'A speed release. The filled Continue button quietly becomes the default.',
    button: withChange(filledSlab, (b) => {
      b.cornerRadius = 8; b.weight = 'semibold'; b.continuousCorners = false
    }),
    screen: withChange(ScreenLooks.white, (s) => { s.clockX = 0.17 }),
    hardware: allScreen({ width: 70.9, height: 143.6, bezel: 4.3, screenRadius: 6.5, frame: 0xe3cbb0, frameWidth: 1.2, notchWidth: 34.8 }),
  },
  {
    year: 2019, system: 'iOS 13', device: 'iPhone 11 Pro',
    note: 'Dark Mode. Blue brightens for the night, and corners go continuous.',
    button: withChange(filledSlab, (b) => {
      b.cornerRadius = 14; b.weight = 'semibold' // documented
      fill(b, ink(0x0a84ff)) // documented
    }),
    screen: withChange(ScreenLooks.white, (s) => { s.top = ink(0x000000); s.bottom = ink(0x000000); s.chrome = ink(0xffffff); s.clockX = 0.17 }),
    hardware: allScreen({ width: 71.4, height: 144.0, bezel: 4.3, screenRadius: 6.5, frame: 0x4e5851, frameWidth: 1.2, notchWidth: 34.8 }),
  },
  {
    year: 2020, system: 'iOS 14', device: 'iPhone 12 Pro',
    note: 'The main button holds still. New: a quiet grey platter that opens a menu.',
    button: withChange(tintText, (b) => {
      b.width = 124; b.height = 36; b.cornerRadius = 7
      fill(b, ink(0x767680, 0.12)) // documented
      b.typeface = 'sanFrancisco'; b.weight = 'regular'; b.labelSize = 18
      b.continuousCorners = true
    }),
    screen: withChange(ScreenLooks.white, (s) => { s.clockX = 0.17 }),
    hardware: allScreen({ width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0x2d4e5c, notchWidth: 34.8 }),
  },
  {
    year: 2021, system: 'iOS 15', device: 'iPhone 13 Pro',
    note: 'The first real system filled button since iOS 6. Still perfectly flat.',
    button: filledSlab,
    screen: withChange(ScreenLooks.white, (s) => { s.clockX = 0.17 }),
    hardware: allScreen({ width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0xa7c1d9, notchWidth: 26.8 }),
  },
  {
    year: 2022, system: 'iOS 16', device: 'iPhone 14 Pro',
    note: "Stock button unchanged. This one is the new Lock Screen's Customize.",
    button: withChange(filledSlab, (b) => {
      b.cornerRadius = 14; b.weight = 'semibold'
      fill(b, ink(0x2c2c2e)) // sampled
    }),
    screen: ScreenLooks.wallpaper(0x000000, 0x000000, 0x3b2a6b, 0x143a5e, 0.45),
    hardware: allScreen({ width: 71.5, height: 147.5, bezel: 3.2, screenRadius: 8.4, frame: 0x594f63, island: true }),
  },
  {
    year: 2023, system: 'iOS 17', device: 'iPhone 15 Pro',
    note: 'Corners keep rounding. The slab becomes a capsule.',
    button: withChange(filledSlab, (b) => { b.cornerRadius = 23; b.weight = 'semibold' }),
    screen: withChange(ScreenLooks.white, (s) => { s.clockX = 0.17 }),
    hardware: allScreen({ width: 70.6, height: 146.6, bezel: 2.2, screenRadius: 9.3, frame: 0x8f8a81, island: true }),
  },
  {
    year: 2024, system: 'iOS 18', device: 'iPhone 16 Pro',
    note: 'Buttons start floating on blur. You can see where this is going.',
    button: withChange(filledSlab, (b) => {
      b.width = 150; b.height = 38; b.cornerRadius = 19
      fill(b, ink(0xffffff, 0.28)) // sampled
      b.weight = 'semibold'; b.labelSize = 16
    }),
    screen: ScreenLooks.wallpaper(0x2a241d, 0x17130f, 0xc98b4b, 0x5b7a45, 0.9),
    hardware: allScreen({ width: 71.5, height: 149.6, bezel: 1.8, screenRadius: 9.8, frame: 0xbfa48f, island: true }),
  },
  {
    year: 2025, system: 'iOS 26', device: 'iPhone 17 Pro',
    note: 'Liquid Glass. The button is made of light now.',
    button: withChange(filledSlab, (b) => {
      b.height = 48; b.cornerRadius = 24
      fill(b, clearInk)
      b.glass = 1; b.glassTint = ink(0x0088ff, 0.86) // documented
      // Airy and borderless: a wide soft shadow, a rim that fades out at the sides.
      b.innerHighlight = ink(0xffffff, 0.28)
      b.shadow = ink(0x000000, 0.12); b.shadowRadius = 12; b.shadowY = 4
      b.weight = 'semibold'
    }),
    screen: ScreenLooks.wallpaper(0x0b1e4a, 0x3a0f5c, 0x2f8cff, 0xff5fa2),
    hardware: allScreen({ width: 71.9, height: 150.0, bezel: 1.7, screenRadius: 10.2, frame: 0xf38b3c, island: true }),
  },
  {
    year: 2026, system: 'iOS 27', device: 'iPhone 18 Pro',
    note: 'Same glass, retuned: a crisper dark edge and a brighter rim.',
    button: withChange(filledSlab, (b) => {
      b.height = 48; b.cornerRadius = 24
      fill(b, clearInk)
      b.glass = 1; b.glassTint = ink(0x0088ff, 0.96)
      // Frostier, with a hairline dark edge outside a brighter rim and a much
      // tighter shadow.
      b.strokeTop = ink(0x000000, 0.1); b.strokeBottom = ink(0x000000, 0.1); b.strokeWidth = 0.5
      b.innerHighlight = ink(0xffffff, 0.55)
      b.shadow = ink(0x000000, 0.07); b.shadowRadius = 4.5; b.shadowY = 2
      b.weight = 'semibold'
    }),
    screen: ScreenLooks.wallpaper(0x072b33, 0x2b0f4a, 0x19c3b1, 0xff8a3d),
    hardware: allScreen({ width: 71.9, height: 150.0, bezel: 1.6, screenRadius: 10.2, frame: 0x6e3b3f, island: true }),
  },
]

/** The tallest iPhone on the timeline, in mm: it sets the stage's row. */
export const tallestButtonPhone = (): number => Math.max(...buttonTimeline.map((e) => e.hardware.bodyHeight))
