//
//  ButtonErasTimeline.swift
//  iOSEras
//
//  The table: one row per year, 2007 to 2026. Colours marked "sampled" were
//  measured from period assets (Apple's own HIG screenshots and figures, and
//  pixel-faithful GUI kits of the day); the rest are judged by eye.
//
//  An honest timeline has quiet years. Button rendering did not change at
//  all from 2007 to 2009, nor from 2010 to 2011, nor from 2021 to 2024, so
//  in those stretches the row shows a different REAL button of that year
//  rather than inventing a difference, and the note says so.
//

import SwiftUI

// MARK: - Buttons

extension ButtonLook {
    func with(_ change: (inout ButtonLook) -> Void) -> ButtonLook {
        var copy = self; change(&copy); return copy
    }

    /// Nothing drawn: every era starts here and turns on what it used.
    static let blank = ButtonLook(
        width: 176, height: 42, cornerRadius: 10,
        fillTop: .clear, fillUpper: .clear, fillLower: .clear, fillBottom: .clear,
        glossLine: 0.5,
        wellTop: .clear, wellBottom: .clear, wellWidth: 0,
        strokeTop: .clear, strokeBottom: .clear, strokeWidth: 1,
        innerHighlight: .clear, lowerLip: .clear,
        shadow: Ink(0x000000, 0), shadowRadius: 0, shadowY: 0,
        label: Ink(0x000000), labelSize: 18,
        labelShadow: Ink(0x000000, 0), labelShadowY: 0,
        glass: 0, glassTint: Ink(0x0088FF, 0),
        typeface: .sanFrancisco, weight: .regular, continuousCorners: false)

    /// The gel push button of 2007 to 2011: a lighter top half, a hard step
    /// at exactly half height, a nearly flat lower half, sunk in a dark
    /// groove. Silver, as on an action sheet.
    static let gelSilver = blank.with {
        $0.height = 40; $0.cornerRadius = 9.5
        $0.fillTop = Ink(0xF5F5F5); $0.fillUpper = Ink(0xD2D3D5)      // sampled
        $0.fillLower = Ink(0xC0C1C4); $0.fillBottom = Ink(0xC0C1C4)   // sampled
        $0.wellTop = Ink(0x141517); $0.wellBottom = Ink(0x464951); $0.wellWidth = 3
        $0.innerHighlight = Ink(0xFBFBFB)
        $0.lowerLip = Ink(0xFFFFFF, 0.12)
        $0.strokeWidth = 0
        $0.label = Ink(0x000000); $0.labelSize = 19
        $0.labelShadow = Ink(0xFFFFFF, 0.7); $0.labelShadowY = 1
        $0.typeface = .helvetica; $0.weight = .bold
    }

    /// The prominent blue of a Done or Send button.
    static let gelBlue = blank.with {
        $0.width = 150; $0.height = 38; $0.cornerRadius = 7
        $0.fillTop = Ink(0x6792E8); $0.fillUpper = Ink(0x225FDA)      // sampled
        $0.fillLower = Ink(0x1F55C3); $0.fillBottom = Ink(0x1F57C6)   // sampled
        $0.strokeTop = Ink(0x0F2A60); $0.strokeBottom = Ink(0x174194) // sampled
        $0.innerHighlight = Ink(0xFFFFFF, 0.22)
        $0.lowerLip = Ink(0xFFFFFF, 0.3)
        $0.label = Ink(0xFFFFFF); $0.labelSize = 17
        $0.labelShadow = Ink(0x000000, 0.6); $0.labelShadowY = -1
        $0.typeface = .helvetica; $0.weight = .bold
    }

    /// UIButtonTypeRoundedRect: flat white, thin grey outline, bold blue
    /// label. No gloss at all, which is accurate.
    static let roundedRect = blank.with {
        $0.width = 160; $0.height = 40; $0.cornerRadius = 10
        $0.fillTop = Ink(0xFFFFFF); $0.fillUpper = Ink(0xFFFFFF)
        $0.fillLower = Ink(0xFFFFFF); $0.fillBottom = Ink(0xFFFFFF)
        $0.strokeTop = Ink(0xACAFB1); $0.strokeBottom = Ink(0xAAADB0) // sampled
        $0.label = Ink(0x324F85); $0.labelSize = 16
        $0.typeface = .helvetica; $0.weight = .bold
    }

    /// iOS 7's answer: no body at all, only the tint.
    static let tintText = blank.with {
        $0.width = 150; $0.height = 44
        $0.label = Ink(0x007AFF); $0.labelSize = 19
        $0.typeface = .helveticaNeue; $0.weight = .regular
    }

    /// The iOS 15 filled button: a flat continuous-cornered slab.
    static let filledSlab = blank.with {
        $0.width = 190; $0.height = 46; $0.cornerRadius = 10
        $0.fillTop = Ink(0x007AFF); $0.fillUpper = Ink(0x007AFF)      // documented
        $0.fillLower = Ink(0x007AFF); $0.fillBottom = Ink(0x007AFF)
        $0.strokeWidth = 0
        $0.label = Ink(0xFFFFFF); $0.labelSize = 17
        $0.typeface = .sanFrancisco; $0.weight = .regular
        $0.continuousCorners = true
    }

    mutating func fill(_ ink: Ink) {
        fillTop = ink; fillUpper = ink; fillLower = ink; fillBottom = ink
    }
}

// MARK: - Screens

extension ScreenLook {
    func with(_ change: (inout ScreenLook) -> Void) -> ScreenLook {
        var copy = self; change(&copy); return copy
    }

    static let white = ScreenLook(
        top: Ink(0xFFFFFF), bottom: Ink(0xFFFFFF), pinstripes: 0, linen: 0,
        blooms: 0, bloomA: .clear, bloomB: .clear,
        chrome: Ink(0x000000), statusBand: .clear, clockX: 0.5)

    /// An opaque black status bar over a coloured surface: 2007 to 2011.
    static func classic(top: UInt32, bottom: UInt32) -> ScreenLook {
        white.with {
            $0.top = Ink(top); $0.bottom = Ink(bottom)
            $0.chrome = Ink(0xFFFFFF); $0.statusBand = Ink(0x000000)
        }
    }

    /// A blurred-colour wallpaper, for anything that floats or refracts.
    static func wallpaper(top: UInt32, bottom: UInt32, a: UInt32, b: UInt32, strength: Double = 1) -> ScreenLook {
        white.with {
            $0.top = Ink(top); $0.bottom = Ink(bottom)
            $0.blooms = strength; $0.bloomA = Ink(a); $0.bloomB = Ink(b)
            $0.chrome = Ink(0xFFFFFF); $0.clockX = 0.17
        }
    }
}

// MARK: - iPhones

extension DeviceLook {
    func with(_ change: (inout DeviceLook) -> Void) -> DeviceLook {
        var copy = self; change(&copy); return copy
    }

    /// The original: a chrome ring round a black face, a printed home glyph.
    static let iPhone2007 = DeviceLook(
        bodyWidth: 61, bodyHeight: 115, bodyRadius: 11,
        bezelTop: 20.5, bezelSide: 5.85, bezelBottom: 20.5, screenRadius: 0,
        frame: Ink(0xC9CBCE), frameWidth: 1.5, face: Ink(0x0A0A0A),
        homeButton: 1, homeDiameter: 11.2, homeGlyph: 1, homeRing: 0, homeInk: Ink(0x77777C),
        earpiece: 1, earpieceWidth: 11,
        notch: 0, notchWidth: 34.8, notchHeight: 0.1,
        island: 0, islandWidth: 20.7, islandHeight: 6.1, islandTop: 1.8)

    /// A 3.5" or 4" or 4.7" home-button iPhone.
    static func homeButtonPhone(width: Double, height: Double, radius: Double,
                                screenWidth: Double, screenHeight: Double,
                                frame: UInt32, frameWidth: Double = 1.1,
                                face: UInt32 = 0x0A0A0A, homeInk: UInt32 = 0x77777C,
                                glyph: Double, ring: Double) -> DeviceLook {
        iPhone2007.with {
            $0.bodyWidth = width; $0.bodyHeight = height; $0.bodyRadius = radius
            $0.bezelSide = (width - screenWidth) / 2
            $0.bezelTop = (height - screenHeight) / 2
            $0.bezelBottom = (height - screenHeight) / 2
            $0.frame = Ink(frame); $0.frameWidth = frameWidth
            $0.face = Ink(face); $0.homeInk = Ink(homeInk)
            $0.homeDiameter = 10.9; $0.homeGlyph = glyph; $0.homeRing = ring
            $0.earpieceWidth = 10
        }
    }

    /// An all-screen iPhone with a notch or an island.
    static func allScreen(width: Double, height: Double, bezel: Double, screenRadius: Double,
                          frame: UInt32, frameWidth: Double = 1.0,
                          notchWidth: Double = 0, island: Bool = false) -> DeviceLook {
        iPhone2007.with {
            $0.bodyWidth = width; $0.bodyHeight = height
            $0.bodyRadius = screenRadius + bezel
            $0.bezelTop = bezel; $0.bezelSide = bezel; $0.bezelBottom = bezel
            $0.screenRadius = screenRadius
            $0.frame = Ink(frame); $0.frameWidth = frameWidth; $0.face = Ink(0x050505)
            $0.homeButton = 0; $0.homeGlyph = 0; $0.homeRing = 0
            $0.earpiece = 0
            $0.notch = notchWidth > 0 ? 1 : 0
            $0.notchWidth = notchWidth > 0 ? notchWidth : 26.8
            $0.notchHeight = notchWidth > 0 ? 5.3 : 0.1
            $0.island = island ? 1 : 0
        }
    }

    static let iPhone3G = iPhone2007.with {
        $0.bodyWidth = 62.1; $0.bodyHeight = 115.5
        $0.bezelSide = 6.4; $0.bezelTop = 20.75; $0.bezelBottom = 20.75
    }
}

// MARK: - The timeline

extension ButtonEra {
    static let timeline: [ButtonEra] = [
        ButtonEra(
            year: 2007, system: "iPhone OS 1", device: "iPhone",
            note: "No SDK yet. Every button is Apple's own, and every one is gel.",
            button: .gelSilver,
            screen: .classic(top: 0x6D737F, bottom: 0x515762),
            hardware: .iPhone2007),

        ButtonEra(
            year: 2008, system: "iPhone OS 2", device: "iPhone 3G",
            note: "The SDK ships. This plain white rounded rect becomes every app's button.",
            button: .roundedRect,
            screen: ScreenLook.classic(top: 0xC5CCD4, bottom: 0xC5CCD4).with { $0.pinstripes = 1 },
            hardware: .iPhone3G),

        ButtonEra(
            year: 2009, system: "iPhone OS 3", device: "iPhone 3GS",
            note: "Same pixels as 2007. The glossy blue Done button is on every screen.",
            button: .gelBlue,
            screen: .classic(top: 0xB0BCCD, bottom: 0x6D84A2),
            hardware: .iPhone3G),

        ButtonEra(
            year: 2010, system: "iOS 4", device: "iPhone 4",
            note: "Retina. The same gel, redrawn razor sharp and set in Helvetica Neue.",
            button: ButtonLook.gelSilver.with {
                $0.fillTop = Ink(0x9EC699); $0.fillUpper = Ink(0x41BF4A)      // sampled green
                $0.fillLower = Ink(0x0EB81D); $0.fillBottom = Ink(0x0D9D23)
                $0.innerHighlight = Ink(0xD6E6D3)
                $0.label = Ink(0xFFFFFF)
                $0.labelShadow = Ink(0x000000, 0.45); $0.labelShadowY = -1
                $0.typeface = .helveticaNeue
            },
            screen: .classic(top: 0x3A3F48, bottom: 0x23272E),
            hardware: .homeButtonPhone(width: 58.6, height: 115.2, radius: 8.8, screenWidth: 49.3, screenHeight: 74,
                                       frame: 0xB9BBBE, frameWidth: 1.3, glyph: 1, ring: 0)),

        ButtonEra(
            year: 2011, system: "iOS 5", device: "iPhone 4S",
            note: "The button does not change at all. The linen behind it is new.",
            button: ButtonLook.gelSilver.with { $0.typeface = .helveticaNeue },
            screen: ScreenLook.classic(top: 0x4E4E53, bottom: 0x46464B).with { $0.linen = 1 },
            hardware: .homeButtonPhone(width: 58.6, height: 115.2, radius: 8.8, screenWidth: 49.3, screenHeight: 74,
                                       frame: 0xB9BBBE, frameWidth: 1.3, glyph: 1, ring: 0)),

        ButtonEra(
            year: 2012, system: "iOS 6", device: "iPhone 5",
            note: "The hard gloss line melts into satin. Last stop before flat.",
            button: ButtonLook.gelSilver.with {
                // Smooth all the way down, darkest three quarters of the way,
                // then lifting again: light reflected up off the surface.
                $0.fillTop = Ink(0xFEFEFE); $0.fillUpper = Ink(0xC2C3C5)      // sampled
                $0.fillLower = Ink(0xC2C3C5); $0.fillBottom = Ink(0xE9EAEA)   // sampled
                $0.glossLine = 0.75
                $0.wellTop = Ink(0x161719)
                $0.innerHighlight = Ink(0xFEFEFE)
                $0.lowerLip = Ink(0xFFFFFF, 0.2)
                $0.typeface = .helveticaNeue
            },
            screen: ScreenLook.classic(top: 0x777D85, bottom: 0x60666F).with { $0.statusBand = Ink(0x4E6A93) },
            hardware: .homeButtonPhone(width: 58.6, height: 123.8, radius: 8.8, screenWidth: 49.9, screenHeight: 88.5,
                                       frame: 0x2E2F33, glyph: 1, ring: 0)),

        ButtonEra(
            year: 2013, system: "iOS 7", device: "iPhone 5s",
            note: "The button loses its body. Only the tint is left.",
            button: .tintText,
            screen: .white,
            hardware: .homeButtonPhone(width: 58.6, height: 123.8, radius: 8.8, screenWidth: 49.9, screenHeight: 88.5,
                                       frame: 0x9A9BA0, glyph: 0, ring: 1)),

        ButtonEra(
            year: 2014, system: "iOS 8", device: "iPhone 6",
            note: "A hairline comes back, just enough to say tap me.",
            button: ButtonLook.tintText.with {
                $0.width = 120; $0.height = 36; $0.cornerRadius = 5
                $0.strokeTop = Ink(0x007AFF); $0.strokeBottom = Ink(0x007AFF)
                $0.labelSize = 17; $0.weight = .medium
            },
            screen: .white,
            hardware: .homeButtonPhone(width: 67.0, height: 138.1, radius: 11, screenWidth: 58.5, screenHeight: 104,
                                       frame: 0xA5A6AA, glyph: 0, ring: 1)),

        ButtonEra(
            year: 2015, system: "iOS 9", device: "iPhone 6s",
            note: "San Francisco replaces Helvetica Neue, and sheet buttons grow tall and round.",
            button: ButtonLook.tintText.with {
                // The action sheet's Cancel slab: solid white, 13 pt corners.
                $0.width = 200; $0.height = 50; $0.cornerRadius = 13
                $0.fill(Ink(0xFFFFFF))                                        // sampled
                $0.typeface = .sanFrancisco; $0.weight = .semibold; $0.labelSize = 19
            },
            // A sheet dims whatever is behind it by about forty percent.
            screen: ScreenLook.white.with { $0.top = Ink(0x999999); $0.bottom = Ink(0x999999) },
            hardware: .homeButtonPhone(width: 67.1, height: 138.3, radius: 11, screenWidth: 58.5, screenHeight: 104,
                                       frame: 0xE6C3B7, face: 0xF5F5F7, homeInk: 0xC9A99D, glyph: 0, ring: 1)),

        ButtonEra(
            year: 2016, system: "iOS 10", device: "iPhone 7",
            note: "Officially still borderless. In Apple's own apps, buttons get filled again.",
            button: ButtonLook.filledSlab.with {
                // Maps' Directions button: plain circular 8 pt corners.
                $0.width = 186; $0.height = 44; $0.cornerRadius = 8
                $0.weight = .semibold; $0.continuousCorners = false
            },
            screen: .white,
            hardware: .homeButtonPhone(width: 67.1, height: 138.3, radius: 11, screenWidth: 58.5, screenHeight: 104,
                                       frame: 0x1B1B1D, glyph: 0, ring: 1)),

        ButtonEra(
            year: 2017, system: "iOS 11", device: "iPhone X",
            note: "Everything goes bold. The App Store's outlined GET becomes a solid capsule.",
            button: ButtonLook.tintText.with {
                $0.width = 118; $0.height = 38; $0.cornerRadius = 19
                $0.fill(Ink(0xF0F1F6))                                        // sampled
                $0.typeface = .sanFrancisco; $0.weight = .bold; $0.labelSize = 17
                $0.continuousCorners = true
            },
            screen: ScreenLook.white.with { $0.clockX = 0.17 },
            hardware: .allScreen(width: 70.9, height: 143.6, bezel: 4.3, screenRadius: 6.5,
                                 frame: 0xD9D9DB, frameWidth: 1.2, notchWidth: 34.8)),

        ButtonEra(
            year: 2018, system: "iOS 12", device: "iPhone XS",
            note: "A speed release. The filled Continue button quietly becomes the default.",
            button: ButtonLook.filledSlab.with {
                $0.cornerRadius = 8; $0.weight = .semibold; $0.continuousCorners = false
            },
            screen: ScreenLook.white.with { $0.clockX = 0.17 },
            hardware: .allScreen(width: 70.9, height: 143.6, bezel: 4.3, screenRadius: 6.5,
                                 frame: 0xE3CBB0, frameWidth: 1.2, notchWidth: 34.8)),

        ButtonEra(
            year: 2019, system: "iOS 13", device: "iPhone 11 Pro",
            note: "Dark Mode. Blue brightens for the night, and corners go continuous.",
            button: ButtonLook.filledSlab.with {
                $0.cornerRadius = 14; $0.weight = .semibold                   // documented
                $0.fill(Ink(0x0A84FF))                                        // documented
            },
            screen: ScreenLook.white.with { $0.top = Ink(0x000000); $0.bottom = Ink(0x000000); $0.chrome = Ink(0xFFFFFF); $0.clockX = 0.17 },
            hardware: .allScreen(width: 71.4, height: 144.0, bezel: 4.3, screenRadius: 6.5,
                                 frame: 0x4E5851, frameWidth: 1.2, notchWidth: 34.8)),

        ButtonEra(
            year: 2020, system: "iOS 14", device: "iPhone 12 Pro",
            note: "The main button holds still. New: a quiet grey platter that opens a menu.",
            button: ButtonLook.tintText.with {
                $0.width = 124; $0.height = 36; $0.cornerRadius = 7
                $0.fill(Ink(0x767680, 0.12))                                  // documented
                $0.typeface = .sanFrancisco; $0.weight = .regular; $0.labelSize = 18
                $0.continuousCorners = true
            },
            screen: ScreenLook.white.with { $0.clockX = 0.17 },
            hardware: .allScreen(width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8,
                                 frame: 0x2D4E5C, notchWidth: 34.8)),

        ButtonEra(
            year: 2021, system: "iOS 15", device: "iPhone 13 Pro",
            note: "The first real system filled button since iOS 6. Still perfectly flat.",
            button: .filledSlab,
            screen: ScreenLook.white.with { $0.clockX = 0.17 },
            hardware: .allScreen(width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8,
                                 frame: 0xA7C1D9, notchWidth: 26.8)),

        ButtonEra(
            year: 2022, system: "iOS 16", device: "iPhone 14 Pro",
            note: "Stock button unchanged. This one is the new Lock Screen's Customize.",
            button: ButtonLook.filledSlab.with {
                $0.cornerRadius = 14; $0.weight = .semibold
                $0.fill(Ink(0x2C2C2E))                                        // sampled
            },
            screen: .wallpaper(top: 0x000000, bottom: 0x000000, a: 0x3B2A6B, b: 0x143A5E, strength: 0.45),
            hardware: .allScreen(width: 71.5, height: 147.5, bezel: 3.2, screenRadius: 8.4,
                                 frame: 0x594F63, island: true)),

        ButtonEra(
            year: 2023, system: "iOS 17", device: "iPhone 15 Pro",
            note: "Corners keep rounding. The slab becomes a capsule.",
            button: ButtonLook.filledSlab.with { $0.cornerRadius = 23; $0.weight = .semibold },
            screen: ScreenLook.white.with { $0.clockX = 0.17 },
            hardware: .allScreen(width: 70.6, height: 146.6, bezel: 2.2, screenRadius: 9.3,
                                 frame: 0x8F8A81, island: true)),

        ButtonEra(
            year: 2024, system: "iOS 18", device: "iPhone 16 Pro",
            note: "Buttons start floating on blur. You can see where this is going.",
            button: ButtonLook.filledSlab.with {
                $0.width = 150; $0.height = 38; $0.cornerRadius = 19
                $0.fill(Ink(0xFFFFFF, 0.28))                                  // sampled
                $0.weight = .semibold; $0.labelSize = 16
            },
            screen: .wallpaper(top: 0x2A241D, bottom: 0x17130F, a: 0xC98B4B, b: 0x5B7A45, strength: 0.9),
            hardware: .allScreen(width: 71.5, height: 149.6, bezel: 1.8, screenRadius: 9.8,
                                 frame: 0xBFA48F, island: true)),

        ButtonEra(
            year: 2025, system: "iOS 26", device: "iPhone 17 Pro",
            note: "Liquid Glass. The button is made of light now.",
            button: ButtonLook.filledSlab.with {
                $0.height = 48; $0.cornerRadius = 24
                $0.fill(.clear)
                $0.glass = 1; $0.glassTint = Ink(0x0088FF, 0.86)              // documented
                // Airy and borderless: a wide soft shadow, a rim that fades
                // out at the sides.
                $0.innerHighlight = Ink(0xFFFFFF, 0.28)
                $0.shadow = Ink(0x000000, 0.12); $0.shadowRadius = 12; $0.shadowY = 4
                $0.weight = .semibold
            },
            screen: .wallpaper(top: 0x0B1E4A, bottom: 0x3A0F5C, a: 0x2F8CFF, b: 0xFF5FA2),
            hardware: .allScreen(width: 71.9, height: 150.0, bezel: 1.7, screenRadius: 10.2,
                                 frame: 0xF38B3C, island: true)),

        ButtonEra(
            year: 2026, system: "iOS 27", device: "iPhone 18 Pro",
            note: "Same glass, retuned: a crisper dark edge and a brighter rim.",
            button: ButtonLook.filledSlab.with {
                $0.height = 48; $0.cornerRadius = 24
                $0.fill(.clear)
                $0.glass = 1; $0.glassTint = Ink(0x0088FF, 0.96)
                // Frostier, with a hairline dark edge outside a brighter rim
                // and a much tighter shadow.
                $0.strokeTop = Ink(0x000000, 0.10); $0.strokeBottom = Ink(0x000000, 0.10); $0.strokeWidth = 0.5
                $0.innerHighlight = Ink(0xFFFFFF, 0.55)
                $0.shadow = Ink(0x000000, 0.07); $0.shadowRadius = 4.5; $0.shadowY = 2
                $0.weight = .semibold
            },
            screen: .wallpaper(top: 0x072B33, bottom: 0x2B0F4A, a: 0x19C3B1, b: 0xFF8A3D),
            hardware: .allScreen(width: 71.9, height: 150.0, bezel: 1.6, screenRadius: 10.2,
                                 frame: 0x6E3B3F, island: true)),
    ]
}
