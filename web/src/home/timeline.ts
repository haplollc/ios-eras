// One row per year (HomeErasTimeline.swift): how iOS dressed its icons that
// year, what the wallpaper looked like, which iPhone it ran on, and which
// apps sat on the first page.

import type { Ink } from '../core/ink'
import { ink } from '../core/ink'
import type { ScreenLook } from '../core/looks'
import { DeviceLooks, ScreenLooks, withChange } from '../core/looks'
import type { HomeChrome, HomeEra, HomeMetrics } from './model'

const clear: Ink = { r: 1, g: 1, b: 1, a: 0 }

// ---------------------------------------------------------------- metrics

function metrics(o: {
  icon: number
  col: [number, number]
  row: [number, number]
  labelBelow: number
  dots: [number, number, number]
  pill?: [number, number, number]
  dock: [number, number, number]
  dockIcon: [number, number]
  dockCol: [number, number]
  dockLabels: boolean
}): HomeMetrics {
  const pill = o.pill ?? [0, 0, 0]
  return {
    iconSize: o.icon, colCentre0: o.col[0], colPitch: o.col[1], row0Top: o.row[0], rowPitch: o.row[1],
    labelBelow: o.labelBelow,
    indicatorFromBottom: o.dots[0], dotSize: o.dots[1], dotPitch: o.dots[2],
    pillWidth: pill[0], pillHeight: pill[1], pillText: pill[2],
    dockTopFromBottom: o.dock[0], dockBottomGap: o.dock[1], dockSideInset: o.dock[2],
    dockIconFromBottom: o.dockIcon[0], dockIconSize: o.dockIcon[1],
    dockColCentre0: o.dockCol[0], dockColPitch: o.dockCol[1], dockLabels: o.dockLabels ? 1 : 0,
    dockLabelFromBottom: 0, dockCorner: 0, dotCount: 3, activeDot: 0,
  }
}

/** Measured off a real home-screen screenshot of each version, as fractions
 *  of the screen's width. */
export function measured(year: number): HomeMetrics {
  switch (year) {
    case 2007:
    case 2008:
      // iPhone OS 1.1.3 and 2: 57 pt icons on a 76 pt pitch, 88 pt rows.
      return withChange(
        metrics({ icon: 0.178, col: [0.145, 0.2375], row: [0.103, 0.275], labelBelow: 0.0313,
          dots: [0.3227, year === 2007 ? 0 : 0.0182, 0.05],
          dock: [0.2825, 0, 0], dockIcon: [0.165, 0.178], dockCol: [0.145, 0.2375], dockLabels: true }),
        (m) => { m.dockLabelFromBottom = 0.024; m.dotCount = year === 2007 ? 0 : 2 },
      )
    case 2009:
      return withChange(
        metrics({ icon: 0.178, col: [0.145, 0.2375], row: [0.103, 0.2752], labelBelow: 0.0313,
          dots: [0.3125, 0.0185, 0.0502],
          dock: [0.2825, 0, 0], dockIcon: [0.165, 0.178], dockCol: [0.145, 0.2375], dockLabels: true }),
        (m) => { m.dockLabelFromBottom = 0.024; m.dotCount = 2 },
      )
    case 2010:
    case 2011:
      // iOS 4-5: icons stand on a glass shelf 45 pt deep.
      return withChange(
        metrics({ icon: 0.178, col: [0.1418, 0.2375], row: [0.105, 0.2751], labelBelow: 0.0301,
          dots: [0.298, 0.0176, 0.05],
          dock: [0.1412, 0, 0], dockIcon: [0.1585, 0.178], dockCol: [0.1418, 0.2375], dockLabels: true }),
        (m) => { m.dotCount = 2 },
      )
    case 2012:
      return metrics({ icon: 0.178, col: [0.1434, 0.2377], row: [0.1058, 0.2745], labelBelow: 0.03,
        dots: [0.2974, 0.0178, 0.0499],
        dock: [0.1405, 0, 0], dockIcon: [0.1563, 0.178], dockCol: [0.1434, 0.2377], dockLabels: true })
    case 2013:
      // iOS 7: 60 pt icons, a 96 pt frosted dock that keeps its labels.
      return metrics({ icon: 0.1876, col: [0.1428, 0.2374], row: [0.0771, 0.275], labelBelow: 0.0339,
        dots: [0.3253, 0.0202, 0.05],
        dock: [0.3008, 0, 0], dockIcon: [0.1626, 0.1876], dockCol: [0.1428, 0.2374], dockLabels: true })
    case 2014:
    case 2015:
    case 2016: {
      // iOS 8-10 on the 4.7" iPhone. iOS 10 put a Today page first.
      const top = ({ 2014: 0.065, 2015: 0.055, 2016: 0.0749 } as Record<number, number>)[year] ?? 0.065
      return withChange(
        metrics({ icon: 0.16, col: [0.1525, 0.2318], row: [top, 0.2345], labelBelow: 0.0312,
          dots: [0.2765, 0.0185, 0.042],
          dock: [0.2555, 0, 0], dockIcon: [0.1386, 0.16], dockCol: [0.1525, 0.2318], dockLabels: true }),
        (m) => { m.activeDot = year === 2016 ? 1 : 0 },
      )
    }
    case 2017:
    case 2018:
    case 2019:
      // iOS 11-13 on the notched 375 x 812 phones: a floating dock, no labels.
      return withChange(
        metrics({ icon: 0.1595, col: [0.1532, 0.2322], row: [0.1925, 0.2721], labelBelow: 0.0312,
          dots: [0.3034, 0.0177, 0.0428],
          dock: [0.276, 0.0275, 0.0276], dockIcon: [0.151, 0.1595], dockCol: [0.1532, 0.232], dockLabels: false }),
        (m) => {
          m.dotCount = year === 2019 ? 4 : 3; m.activeDot = 1; m.dockCorner = 0.078
          m.indicatorFromBottom = year === 2019 ? 0.297 : 0.31
        },
      )
    case 2020:
    case 2021:
      return withChange(
        metrics({ icon: 0.1606, col: [0.1506, 0.2325], row: [0.1864, 0.254], labelBelow: 0.0324,
          dots: [0.372, 0.02, 0.0478],
          dock: [0.2794, 0.0274, 0.0259], dockIcon: [0.1532, 0.1606], dockCol: [0.1506, 0.2325], dockLabels: false }),
        (m) => { m.dotCount = year === 2020 ? 2 : 3; m.dockCorner = 0.081 },
      )
    case 2022:
    case 2023:
    case 2024: {
      // iOS 16-18 on Dynamic Island phones: the Search pill.
      const top = ({ 2022: 0.2285, 2023: 0.2275, 2024: 0.2035 } as Record<number, number>)[year] ?? 0.2285
      return withChange(
        metrics({ icon: 0.1532, col: [0.1553, 0.2298], row: [top, 0.2497], labelBelow: 0.0306,
          dots: [0.364, 0.018, 0.045], pill: [0.1989, 0.0769, 0.0309],
          dock: [0.2802, 0.03, 0.031], dockIcon: [0.1554, 0.153], dockCol: [0.1602, 0.2265], dockLabels: false }),
        (m) => { m.dockCorner = year === 2024 ? 0.103 : 0.104 },
      )
    }
    case 2025:
      // iOS 26: a taller glass dock, only slightly inset.
      return withChange(
        metrics({ icon: 0.1593, col: [0.1552, 0.23], row: [0.209, 0.2518], labelBelow: 0.0289,
          dots: [0.395, 0.018, 0.045], pill: [0.199, 0.076, 0.0295],
          dock: [0.31, 0.0315, 0.03], dockIcon: [0.171, 0.1589], dockCol: [0.1685, 0.2211], dockLabels: false }),
        (m) => { m.dockCorner = 0.103 },
      )
    default:
      // iOS 27: the glass dock set further in.
      return withChange(
        metrics({ icon: 0.1593, col: [0.1552, 0.23], row: [0.2245, 0.2492], labelBelow: 0.0289,
          dots: [0.3878, 0.018, 0.045], pill: [0.194, 0.0791, 0.0295],
          dock: [0.2995, 0.041, 0.0405], dockIcon: [0.17, 0.1589], dockCol: [0.1685, 0.2211], dockLabels: false }),
        (m) => { m.dockCorner = 0.096 },
      )
  }
}

/** Label font size as a fraction of screen width. */
export function labelSize(year: number): number {
  if (year <= 2012) return 0.0328
  if (year === 2013) return 0.0375
  if (year <= 2021) return 0.032
  if (year <= 2024) return 0.0306
  return 0.03
}

// ---------------------------------------------------------------- chrome

/** 2007: glossy rounded rectangles on a metal mesh tray. */
const glossy: HomeChrome = {
  columns: 4, rows: 4, iconScale: 57.0 / 320.0,
  cornerRatio: 0.175, squircle: 0, gloss: 1,
  iconShadow: ink(0x000000, 0.4), iconShadowRadius: 0.6, iconShadowY: 0.8,
  glassRim: 0,
  label: ink(0xffffff), labelShadow: ink(0x000000, 0.7), labelSize: 11.0 / 320.0,
  dockShelf: 1, dockGlassShelf: 0, dockPanel: 0, dockInset: 0, dockRadius: 0, dockTint: clear, reflection: 1,
  pageDots: ink(0xffffff), spotlightGlyph: 0, searchPill: 0,
  metrics: measured(2008),
  typeface: 'helvetica', labelWeight: 'bold',
}

const glossySpotlight = withChange(glossy, (c) => { c.spotlightGlyph = 1 })
const glossyGlass = withChange(glossySpotlight, (c) => { c.dockShelf = 0; c.dockGlassShelf = 1 })
const flat = withChange(glossy, (c) => {
  c.cornerRatio = 0.2237; c.squircle = 1; c.gloss = 0
  c.iconScale = 60.0 / 320.0
  c.iconShadow = clear; c.iconShadowRadius = 0; c.iconShadowY = 0
  c.labelSize = 12.0 / 320.0
  c.labelShadow = ink(0x000000, 0.55); c.labelWeight = 'regular'; c.typeface = 'helveticaNeue'
  c.dockShelf = 0; c.dockGlassShelf = 0; c.dockPanel = 1; c.dockTint = ink(0xffffff, 0.28); c.reflection = 0
})
const floating = withChange(flat, (c) => {
  c.typeface = 'sanFrancisco'; c.labelWeight = 'regular'
  c.dockInset = 0.024; c.dockRadius = 0.08
  c.iconScale = 60.0 / 375.0; c.labelSize = 12.0 / 375.0
})
const searchPill = withChange(floating, (c) => { c.searchPill = 1; c.dockInset = 0.035 })
const glass = withChange(searchPill, (c) => {
  c.cornerRatio = 0.27; c.glassRim = 1
  c.iconShadow = ink(0x000000, 0.22); c.iconShadowRadius = 2.5; c.iconShadowY = 1.5
  c.dockTint = ink(0xffffff, 0.18); c.dockRadius = 0.11; c.dockInset = 0.04
  c.labelShadow = ink(0x000000, 0.35)
})

export const HomeChromes = { glossy, glossySpotlight, glossyGlass, flat, floating, searchPill, glass }

// ---------------------------------------------------------------- eras

function build(): HomeEra[] {
  const dockClassic = ['Phone', 'Mail', 'Safari', 'Music']
  const dock2015 = ['Phone', 'Safari', 'Mail', 'Music']
  const dockModern = ['Phone', 'Safari', 'Messages', 'Music']

  const D = DeviceLooks
  const original = D.iPhone2007
  const iPhone3G = D.iPhone3G
  const iPhone4 = D.homeButtonPhone({ width: 58.6, height: 115.2, radius: 8.8, screenWidth: 49.3, screenHeight: 74, frame: 0xb9bbbe, frameWidth: 1.3, glyph: 1, ring: 0 })
  const iPhone5 = D.homeButtonPhone({ width: 58.6, height: 123.8, radius: 8.8, screenWidth: 51.7, screenHeight: 91.8, frame: 0x2e2f33, glyph: 1, ring: 0 })
  const iPhone5s = D.homeButtonPhone({ width: 58.6, height: 123.8, radius: 8.8, screenWidth: 51.7, screenHeight: 91.8, frame: 0x9a9ba0, glyph: 0, ring: 1 })
  const iPhone6 = D.homeButtonPhone({ width: 67.0, height: 138.1, radius: 10, screenWidth: 58.5, screenHeight: 104, frame: 0xa5a6aa, glyph: 0, ring: 1 })
  const iPhone6s = D.homeButtonPhone({ width: 67.1, height: 138.3, radius: 10, screenWidth: 58.5, screenHeight: 104, frame: 0xe6c3b7, face: 0xf5f5f7, homeInk: 0xc9a99d, glyph: 0, ring: 1 })
  const iPhone7 = D.homeButtonPhone({ width: 67.1, height: 138.3, radius: 10, screenWidth: 58.5, screenHeight: 104, frame: 0x1b1b1d, glyph: 0, ring: 1 })
  const iPhoneX = D.allScreen({ width: 70.9, height: 143.6, bezel: 4.25, screenRadius: 6.6, frame: 0xd9d9db, frameWidth: 1.2, notchWidth: 34.8 })
  const iPhoneXS = D.allScreen({ width: 70.9, height: 143.6, bezel: 4.25, screenRadius: 6.6, frame: 0xe3cbb0, frameWidth: 1.2, notchWidth: 34.8 })
  const iPhone11Pro = D.allScreen({ width: 71.4, height: 144.0, bezel: 4.5, screenRadius: 6.5, frame: 0x4e5851, frameWidth: 1.2, notchWidth: 34.8 })
  const iPhone12Pro = D.allScreen({ width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0x2d4e5c, notchWidth: 34.8 })
  const iPhone13Pro = D.allScreen({ width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0xa7c1d9, notchWidth: 26.8 })
  const iPhone14Pro = D.allScreen({ width: 71.5, height: 147.5, bezel: 3.2, screenRadius: 9.1, frame: 0x594f63, island: true })
  const iPhone15Pro = D.allScreen({ width: 70.6, height: 146.6, bezel: 2.8, screenRadius: 9.1, frame: 0x8f8a81, island: true })
  const iPhone16Pro = D.allScreen({ width: 71.5, height: 149.6, bezel: 2.4, screenRadius: 10.3, frame: 0xbfa48f, island: true })
  const iPhone17Pro = D.allScreen({ width: 71.9, height: 150.0, bezel: 2.6, screenRadius: 10.3, frame: 0xf38b3c, island: true })
  const iPhone18Pro = D.allScreen({ width: 71.9, height: 150.0, bezel: 2.6, screenRadius: 10.3, frame: 0x6e3b3f, island: true })

  /** Home screens had no wallpaper until iOS 4: black, under a black bar. */
  const black = ScreenLooks.classic(0x000000, 0x000000)
  const wallpaper = (top: number, bottom: number, a: number, b: number,
    o: { strength?: number; band?: Ink; clockX?: number; chrome?: number } = {}): ScreenLook =>
    withChange(ScreenLooks.wallpaper(top, bottom, a, b, o.strength ?? 1), (s) => {
      s.statusBand = o.band ?? clear; s.clockX = o.clockX ?? 0.5; s.chrome = ink(o.chrome ?? 0xffffff)
    })
  const bar = ink(0x000000)

  const glossy5 = withChange(glossyGlass, (c) => { c.rows = 5 })
  const flat5 = withChange(flat, (c) => { c.rows = 5 })
  const flat6 = withChange(flat, (c) => { c.rows = 6; c.iconScale = 60.0 / 375.0; c.labelSize = 12.0 / 375.0 })
  const sf6 = withChange(flat6, (c) => { c.typeface = 'sanFrancisco'; c.labelWeight = 'regular' })
  const floating6 = withChange(floating, (c) => { c.rows = 6 })
  const pill6 = withChange(searchPill, (c) => { c.rows = 6 })
  const glass6 = withChange(glass, (c) => { c.rows = 6 })

  const folder2014 = ['Compass', 'Tips', 'Voice Memos', 'Contacts']
  const folder2015 = [...folder2014, 'Watch', 'Find Friends']
  const folder2019 = ['Calculator', 'iTunes', 'Measure', 'Watch', 'Compass', 'Tips', 'Voice Memos', 'Contacts']
  const folder2020 = ['Translate', 'Calculator', 'iTunes', 'Measure', 'Watch', 'Magnifier', 'Compass', 'Tips', 'Voice Memos', 'Contacts']
  const folder2022 = ['Freeform', 'Fitness', ...folder2020]
  const folder2023 = ['Journal', ...folder2022]
  const folder2024 = ['Find My', ...folder2023]
  const page2019 = ['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Clock', 'Maps', 'Weather',
    'Reminders', 'Notes', 'Stocks', 'News', 'Books', 'App Store', 'Podcasts', 'TV',
    'Health', 'Home', 'Wallet', 'Settings', 'Files', 'Shortcuts', 'Find My', 'Utilities']

  type Row = Omit<HomeEra, 'folder'> & { folder?: string[] }
  const rows: Row[] = [
    { year: 2007, system: 'iPhone OS 1', device: 'iPhone',
      note: 'Twelve apps, a black screen, and a metal tray to stand on. iTunes arrives in 1.1.',
      chrome: glossy, screen: black, hardware: original,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'YouTube', 'Stocks', 'Maps', 'Weather',
        'Clock', 'Calculator', 'Notes', 'Settings', 'iTunes'],
      dock: dockClassic },

    { year: 2008, system: 'iPhone OS 2', device: 'iPhone 3G',
      note: 'The App Store arrives. Contacts gets its own icon, on page two.',
      chrome: glossy, screen: black, hardware: iPhone3G,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'YouTube', 'Stocks', 'Maps', 'Weather',
        'Clock', 'Calculator', 'Notes', 'Settings', 'iTunes', 'App Store'],
      dock: dockClassic },

    { year: 2009, system: 'iPhone OS 3', device: 'iPhone 3GS',
      note: 'Text becomes Messages. Voice Memos and Compass fill the page.',
      chrome: glossySpotlight, screen: black, hardware: iPhone3G,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'YouTube', 'Stocks', 'Maps', 'Weather',
        'Voice Memos', 'Notes', 'Clock', 'Calculator', 'Settings', 'iTunes', 'App Store', 'Compass'],
      dock: dockClassic },

    { year: 2010, system: 'iOS 4', device: 'iPhone 4',
      note: 'Wallpaper at last. Folders arrive, and Utilities swallows the small apps. Game Center.',
      chrome: glossyGlass, screen: wallpaper(0x6f8a94, 0x8c989b, 0xc3ccce, 0x4f5f66, { strength: 0.7, band: ink(0x000000, 0.65) }),
      hardware: iPhone4,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'YouTube', 'Stocks', 'Maps', 'Weather',
        'Notes', 'Utilities', 'iTunes', 'App Store', 'Game Center', 'Settings'],
      dock: dockClassic,
      folder: ['Clock', 'Calculator', 'Compass', 'Voice Memos', 'Contacts'] },

    { year: 2011, system: 'iOS 5', device: 'iPhone 4S',
      note: 'iPod splits into Music and Videos. Reminders and Newsstand move in.',
      chrome: glossyGlass, screen: wallpaper(0x6f8a94, 0x8c989b, 0xc3ccce, 0x4f5f66, { strength: 0.7, band: ink(0x000000, 0.65) }),
      hardware: iPhone4,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'TV', 'YouTube', 'Maps', 'Weather',
        'Notes', 'Reminders', 'Game Center', 'Newsstand', 'iTunes', 'App Store', 'Settings', 'Utilities'],
      dock: dockClassic,
      folder: ['Clock', 'Stocks', 'Calculator', 'Compass', 'Voice Memos', 'Contacts'] },

    { year: 2012, system: 'iOS 6', device: 'iPhone 5',
      note: "A fifth row. YouTube is gone, Passbook is in, and Maps is Apple's own.",
      chrome: glossy5, screen: wallpaper(0x232b32, 0x111c26, 0x2e5c8a, 0x0c2140, { band: bar }),
      hardware: iPhone5,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'TV', 'Maps', 'Weather', 'Wallet',
        'Notes', 'Reminders', 'Clock', 'Stocks', 'Newsstand', 'iTunes', 'App Store', 'Game Center',
        'Settings', 'Utilities'],
      dock: dockClassic,
      folder: ['Contacts', 'Calculator', 'Compass', 'Voice Memos'] },

    { year: 2013, system: 'iOS 7', device: 'iPhone 5s',
      note: 'Everything flattens and every icon is redrawn. FaceTime gets its own icon.',
      chrome: flat5, screen: wallpaper(0x0b1a3a, 0x1a3468, 0x2c4c8a, 0x061024),
      hardware: iPhone5s,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'Weather', 'Clock', 'Maps', 'TV',
        'Notes', 'Reminders', 'Stocks', 'Game Center', 'Newsstand', 'iTunes', 'App Store', 'Wallet',
        'FaceTime', 'Settings', 'Utilities'],
      dock: dockClassic,
      folder: ['Compass', 'Voice Memos', 'Contacts', 'Calculator'] },

    { year: 2014, system: 'iOS 8', device: 'iPhone 6',
      note: 'A bigger phone, a sixth row. Health, iBooks, Podcasts and Tips come built in.',
      chrome: flat6, screen: wallpaper(0x1f1d29, 0x8c8496, 0x4e4456, 0xe4e1ea, { strength: 0.85 }),
      hardware: iPhone6,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'Weather', 'Clock', 'Maps', 'TV',
        'Notes', 'Reminders', 'Stocks', 'Game Center', 'Newsstand', 'iTunes', 'App Store', 'Books',
        'Health', 'Wallet', 'Settings', 'FaceTime', 'Calculator', 'Podcasts', 'Utilities'],
      dock: dockClassic,
      folder: folder2014 },

    { year: 2015, system: 'iOS 9', device: 'iPhone 6s',
      note: 'San Francisco. News replaces Newsstand, Passbook becomes Wallet. Find iPhone and Watch.',
      chrome: withChange(sf6, (c) => { c.spotlightGlyph = 1 }), screen: wallpaper(0x97bcc8, 0x4c5c6f, 0xb1d7de, 0x3e4c68),
      hardware: iPhone6s,
      page: ['Messages', 'Calendar', 'Photos', 'Camera', 'Weather', 'Clock', 'Maps', 'TV',
        'Wallet', 'Notes', 'Reminders', 'Stocks', 'iTunes', 'App Store', 'Books', 'News',
        'Health', 'Settings', 'FaceTime', 'Calculator', 'Podcasts', 'Game Center', 'Find My', 'Utilities'],
      dock: dock2015,
      folder: folder2015 },

    { year: 2016, system: 'iOS 10', device: 'iPhone 7',
      note: "Messages takes Mail's place in the dock. Home arrives, Game Center goes.",
      chrome: sf6, screen: wallpaper(0x1b635b, 0x659075, 0xa8c4ad, 0x074d44),
      hardware: iPhone7,
      page: ['Mail', 'Calendar', 'Photos', 'Camera', 'Maps', 'Clock', 'Weather', 'News',
        'Wallet', 'Notes', 'Reminders', 'Stocks', 'TV', 'Books', 'iTunes', 'App Store',
        'Home', 'Health', 'Settings', 'FaceTime', 'Calculator', 'Podcasts', 'Find My', 'Utilities'],
      dock: dockModern,
      folder: folder2015 },

    { year: 2017, system: 'iOS 11', device: 'iPhone X',
      note: 'The notch. The dock floats. Files arrives; App Store and Camera get new faces.',
      chrome: floating6, screen: wallpaper(0x1c1240, 0x0a1e4a, 0xe8579e, 0x2b6bd8, { clockX: 0.1275 }),
      hardware: iPhoneX,
      page: ['Mail', 'Calendar', 'Photos', 'Camera', 'Maps', 'Clock', 'Weather', 'News',
        'Home', 'Notes', 'Stocks', 'Reminders', 'TV', 'App Store', 'iTunes', 'Books',
        'Health', 'Wallet', 'Settings', 'FaceTime', 'Calculator', 'Podcasts', 'Files', 'Utilities'],
      dock: dockModern,
      folder: ['Find My', 'Find Friends', 'Watch', 'Compass', 'Tips', 'Voice Memos', 'Contacts'] },

    { year: 2018, system: 'iOS 12', device: 'iPhone XS',
      note: 'FaceTime takes the top corner. Measure arrives; iBooks is just Books.',
      chrome: floating6, screen: wallpaper(0x2e3a56, 0x517889, 0xc76474, 0x2c3048, { clockX: 0.1275 }),
      hardware: iPhoneXS,
      page: ['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Clock', 'Maps', 'Weather',
        'Notes', 'Reminders', 'News', 'Stocks', 'TV', 'iTunes', 'App Store', 'Books',
        'Health', 'Home', 'Wallet', 'Settings', 'Calculator', 'Podcasts', 'Files', 'Utilities'],
      dock: dockModern,
      folder: ['Measure', 'Find My', 'Find Friends', 'Watch', 'Compass', 'Tips', 'Voice Memos', 'Contacts'] },

    { year: 2019, system: 'iOS 13', device: 'iPhone 11 Pro',
      note: 'Dark Mode. Find My merges two apps; Shortcuts comes built in.',
      chrome: floating6, screen: wallpaper(0xdc6224, 0xb085a7, 0xf1953e, 0xa62b3d, { clockX: 0.1275 }),
      hardware: iPhone11Pro,
      page: page2019, dock: dockModern, folder: folder2019 },

    { year: 2020, system: 'iOS 14', device: 'iPhone 12 Pro',
      note: 'Widgets and the App Library arrive. Translate and Magnifier.',
      chrome: floating6, screen: wallpaper(0xdea857, 0x93589b, 0xd2825c, 0x5e5394, { clockX: 0.12 }),
      hardware: iPhone12Pro,
      page: page2019, dock: dockModern, folder: folder2020 },

    { year: 2021, system: 'iOS 15', device: 'iPhone 13 Pro',
      note: 'A smaller notch. Camera rounds off, Maps drops its highway shield.',
      chrome: floating6, screen: wallpaper(0xcdbe9f, 0xab9594, 0x474e58, 0xd7cbb5, { clockX: 0.12 }),
      hardware: iPhone13Pro,
      page: page2019, dock: dockModern, folder: folder2020 },

    { year: 2022, system: 'iOS 16', device: 'iPhone 14 Pro',
      note: 'The Dynamic Island. A Search pill replaces the dots. Freeform and Fitness.',
      chrome: pill6, screen: wallpaper(0x1b3a6b, 0x0e5a6e, 0x3fb5c9, 0xf2d35b, { clockX: 0.182 }),
      hardware: iPhone14Pro,
      page: page2019, dock: dockModern, folder: folder2022 },

    { year: 2023, system: 'iOS 17', device: 'iPhone 15 Pro',
      note: 'Same page, new phone. Journal arrives.',
      chrome: pill6, screen: wallpaper(0x6d0212, 0x27b2ea, 0xfb6a3a, 0xcc72e3, { clockX: 0.182 }),
      hardware: iPhone15Pro,
      page: page2019, dock: dockModern, folder: folder2023 },

    { year: 2024, system: 'iOS 18', device: 'iPhone 16 Pro',
      note: 'Passwords gets its own app. Icons can go anywhere, dark or tinted.',
      chrome: pill6, screen: wallpaper(0xc9a6c4, 0x8fa9d6, 0xe08cb0, 0x5f8bd0, { clockX: 0.182 }),
      hardware: iPhone16Pro,
      page: ['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Clock', 'Maps', 'Weather',
        'Reminders', 'Notes', 'Stocks', 'News', 'Books', 'App Store', 'Podcasts', 'TV',
        'Health', 'Home', 'Wallet', 'Settings', 'Files', 'Shortcuts', 'Passwords', 'Utilities'],
      dock: dockModern, folder: folder2024 },

    { year: 2025, system: 'iOS 26', device: 'iPhone 17 Pro',
      note: "Liquid Glass: every icon is layered light. Games takes Podcasts' slot; Preview.",
      chrome: glass6, screen: wallpaper(0x0b1e4a, 0x3a0f5c, 0x2f8cff, 0xff5fa2, { clockX: 0.182 }),
      hardware: iPhone17Pro,
      page: ['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Clock', 'Maps', 'Weather',
        'Reminders', 'Notes', 'Stocks', 'News', 'Books', 'App Store', 'Games', 'TV',
        'Health', 'Home', 'Wallet', 'Settings', 'Files', 'Shortcuts', 'Passwords', 'Utilities'],
      dock: dockModern, folder: ['Podcasts', 'Preview', ...folder2024] },

    { year: 2026, system: 'iOS 27', device: 'iPhone 18 Pro',
      note: 'Siri gets an icon of its own and Reminders leaves the page. Sharper glass.',
      chrome: glass6, screen: wallpaper(0x3a0a1c, 0x14060d, 0x7a1f3d, 0x4a1230, { clockX: 0.182 }),
      hardware: iPhone18Pro,
      page: ['FaceTime', 'Calendar', 'Photos', 'Camera', 'Mail', 'Clock', 'Maps', 'Weather',
        'Siri', 'Notes', 'Stocks', 'News', 'Books', 'App Store', 'Games', 'TV',
        'Health', 'Home', 'Wallet', 'Settings', 'Files', 'Shortcuts', 'Passwords', 'Utilities'],
      dock: dockModern, folder: ['Reminders', 'Podcasts', 'Preview', ...folder2024] },
  ]

  // Every row takes the metrics and label size measured for its year.
  return rows.map((row) => ({
    ...row,
    folder: row.folder ?? [],
    chrome: withChange(row.chrome, (c) => {
      c.metrics = measured(row.year)
      c.labelSize = labelSize(row.year)
    }),
  }))
}

export const homeTimeline: HomeEra[] = build()
