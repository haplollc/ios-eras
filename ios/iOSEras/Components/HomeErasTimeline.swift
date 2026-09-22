//
//  HomeErasTimeline.swift
//  iOSEras
//
//  One row per year: how iOS dressed its icons that year, what the
//  wallpaper looked like, which iPhone it ran on, and which apps sat on the
//  first page. The page lists are the story: an app that appears in one
//  year's list and not the last one's arrives; one that disappears leaves.
//

import SwiftUI

extension HomeMetrics {
    private init(icon: Double, col: (Double, Double), row: (Double, Double), labelBelow: Double,
                 dots: (fromBottom: Double, size: Double, pitch: Double), pill: (Double, Double, Double) = (0, 0, 0),
                 dock: (top: Double, gap: Double, side: Double), dockIcon: (fromBottom: Double, size: Double),
                 dockCol: (Double, Double), dockLabels: Bool) {
        self.init(iconSize: icon, colCentre0: col.0, colPitch: col.1, row0Top: row.0, rowPitch: row.1,
                  labelBelow: labelBelow,
                  indicatorFromBottom: dots.fromBottom, dotSize: dots.size, dotPitch: dots.pitch,
                  pillWidth: pill.0, pillHeight: pill.1, pillText: pill.2,
                  dockTopFromBottom: dock.top, dockBottomGap: dock.gap, dockSideInset: dock.side,
                  dockIconFromBottom: dockIcon.fromBottom, dockIconSize: dockIcon.size,
                  dockColCentre0: dockCol.0, dockColPitch: dockCol.1, dockLabels: dockLabels ? 1 : 0)
    }

    /// Measured off a real home-screen screenshot of each version, as
    /// fractions of the screen's width (see the spacing notes in
    /// Scripts/README.md). Versions on the same phone share a line where
    /// the screenshots agree within measuring error.
    static func measured(_ year: Int) -> HomeMetrics {
        switch year {
        case 2007, 2008:
            // iPhone OS 1.1.3 and 2: 57 pt icons on a 76 pt pitch, 88 pt rows.
            // Dots arrived in 1.1.3, so 2007 shows none. Dock labels sit in
            // the grey strip at the foot of the metal tray.
            return HomeMetrics(icon: 0.178, col: (0.1450, 0.2375), row: (0.103, 0.275), labelBelow: 0.0313,
                               dots: (0.3227, year == 2007 ? 0 : 0.0182, 0.050),
                               dock: (0.2825, 0, 0), dockIcon: (0.1650, 0.178), dockCol: (0.1450, 0.2375), dockLabels: true)
                .with { $0.dockLabelFromBottom = 0.024; $0.dotCount = year == 2007 ? 0 : 2 }
        case 2009:
            return HomeMetrics(icon: 0.178, col: (0.1450, 0.2375), row: (0.103, 0.2752), labelBelow: 0.0313,
                               dots: (0.3125, 0.0185, 0.0502),
                               dock: (0.2825, 0, 0), dockIcon: (0.1650, 0.178), dockCol: (0.1450, 0.2375), dockLabels: true)
                .with { $0.dockLabelFromBottom = 0.024; $0.dotCount = 2 }
        case 2010, 2011:
            // iOS 4-5: icons stand on a glass shelf 45 pt deep.
            return HomeMetrics(icon: 0.178, col: (0.1418, 0.2375), row: (0.105, 0.2751), labelBelow: 0.0301,
                               dots: (0.298, 0.0176, 0.050),
                               dock: (0.1412, 0, 0), dockIcon: (0.1585, 0.178), dockCol: (0.1418, 0.2375), dockLabels: true)
                .with { $0.dotCount = 2 }
        case 2012:
            return HomeMetrics(icon: 0.178, col: (0.1434, 0.2377), row: (0.1058, 0.2745), labelBelow: 0.0300,
                               dots: (0.2974, 0.0178, 0.0499),
                               dock: (0.1405, 0, 0), dockIcon: (0.1563, 0.178), dockCol: (0.1434, 0.2377), dockLabels: true)
        case 2013:
            // iOS 7: 60 pt icons, a 96 pt frosted dock that keeps its labels.
            return HomeMetrics(icon: 0.1876, col: (0.1428, 0.2374), row: (0.0771, 0.275), labelBelow: 0.0339,
                               dots: (0.3253, 0.0202, 0.050),
                               dock: (0.3008, 0, 0), dockIcon: (0.1626, 0.1876), dockCol: (0.1428, 0.2374), dockLabels: true)
        case 2014, 2015, 2016:
            // iOS 8-10 on the 4.7" iPhone. The first row sat a little higher
            // on iOS 9. iOS 10 put a Today page first: a dim first dot.
            let top = [2014: 0.065, 2015: 0.055, 2016: 0.0749][year] ?? 0.065
            return HomeMetrics(icon: 0.160, col: (0.1525, 0.2318), row: (top, 0.2345), labelBelow: 0.0312,
                               dots: (0.2765, 0.0185, 0.042),
                               dock: (0.2555, 0, 0), dockIcon: (0.1386, 0.160), dockCol: (0.1525, 0.2318), dockLabels: true)
                .with { $0.activeDot = year == 2016 ? 1 : 0 }
        case 2017, 2018, 2019:
            // iOS 11-13 on the notched 375 x 812 phones: a floating dock,
            // no dock labels.
            return HomeMetrics(icon: 0.1595, col: (0.1532, 0.2322), row: (0.1925, 0.2721), labelBelow: 0.0312,
                               dots: (0.3034, 0.0177, 0.0428),
                               dock: (0.2760, 0.0275, 0.0276), dockIcon: (0.1510, 0.1595), dockCol: (0.1532, 0.2320), dockLabels: false)
                .with {
                    $0.dotCount = year == 2019 ? 4 : 3; $0.activeDot = 1; $0.dockCorner = 0.078
                    // iOS 13 set the dots a little lower than iOS 11 and 12.
                    $0.indicatorFromBottom = year == 2019 ? 0.2970 : 0.3100
                }
        case 2020, 2021:
            return HomeMetrics(icon: 0.1606, col: (0.1506, 0.2325), row: (0.1864, 0.2540), labelBelow: 0.0324,
                               dots: (0.3720, 0.0200, 0.0478),
                               dock: (0.2794, 0.0274, 0.0259), dockIcon: (0.1532, 0.1606), dockCol: (0.1506, 0.2325), dockLabels: false)
                .with { $0.dotCount = year == 2020 ? 2 : 3; $0.dockCorner = 0.081 }
        case 2022, 2023, 2024:
            // iOS 16-18 on Dynamic Island phones: the Search pill. iOS 18
            // moved the grid up.
            let top = [2022: 0.2285, 2023: 0.2275, 2024: 0.2035][year] ?? 0.2285
            return HomeMetrics(icon: 0.1532, col: (0.1553, 0.2298), row: (top, 0.2497), labelBelow: 0.0306,
                               dots: (0.3640, 0.018, 0.045), pill: (0.1989, 0.0769, 0.0309),
                               dock: (0.2802, 0.0300, 0.0310), dockIcon: (0.1554, 0.1530), dockCol: (0.1602, 0.2265), dockLabels: false)
                .with { $0.dockCorner = year == 2024 ? 0.103 : 0.104 }
        case 2025:
            // iOS 26: a taller glass dock, only slightly inset.
            return HomeMetrics(icon: 0.1593, col: (0.1552, 0.2300), row: (0.2090, 0.2518), labelBelow: 0.0289,
                               dots: (0.3950, 0.018, 0.045), pill: (0.1990, 0.0760, 0.0295),
                               dock: (0.3100, 0.0315, 0.0300), dockIcon: (0.1710, 0.1589), dockCol: (0.1685, 0.2211), dockLabels: false)
                .with { $0.dockCorner = 0.103 }
        default:
            // iOS 27: the glass dock set further in.
            return HomeMetrics(icon: 0.1593, col: (0.1552, 0.2300), row: (0.2245, 0.2492), labelBelow: 0.0289,
                               dots: (0.3878, 0.018, 0.045), pill: (0.1940, 0.0791, 0.0295),
                               dock: (0.2995, 0.0410, 0.0405), dockIcon: (0.1700, 0.1589), dockCol: (0.1685, 0.2211), dockLabels: false)
                .with { $0.dockCorner = 0.096 }
        }
    }

    /// Label font size as a fraction of screen width, matched to each
    /// version's screenshot.
    static func labelSize(_ year: Int) -> Double {
        switch year {
        case ...2012: return 0.0328     // matched to the screenshots' label widths
        case 2013: return 0.0375        // 12 pt Helvetica Neue
        case ...2021: return 0.0320
        case ...2024: return 0.0306
        default: return 0.0300
        }
    }
}

extension HomeChrome {
    func with(_ change: (inout HomeChrome) -> Void) -> HomeChrome {
        var copy = self; change(&copy); return copy
    }

    /// 2007: glossy rounded rectangles on a metal mesh tray.
    static let glossy = HomeChrome(
        columns: 4, rows: 4, iconScale: 57.0 / 320.0,
        cornerRatio: 0.175, squircle: 0, gloss: 1,
        iconShadow: Ink(0x000000, 0.4), iconShadowRadius: 0.6, iconShadowY: 0.8,
        glassRim: 0,
        label: Ink(0xFFFFFF), labelShadow: Ink(0x000000, 0.7), labelSize: 11.0 / 320.0,
        dockShelf: 1, dockGlassShelf: 0, dockPanel: 0, dockInset: 0, dockRadius: 0, dockTint: .clear, reflection: 1,
        pageDots: Ink(0xFFFFFF), spotlightGlyph: 0, searchPill: 0,
        metrics: .measured(2008),
        typeface: .helvetica, labelWeight: .bold)

    /// 2009: the Spotlight page adds a magnifier beside the dots.
    static let glossySpotlight = glossy.with { $0.spotlightGlyph = 1 }

    /// 2010: wallpaper behind the grid, a glass shelf for a dock.
    static let glossyGlass = glossySpotlight.with { $0.dockShelf = 0; $0.dockGlassShelf = 1 }

    /// 2013: flat squircles, no gloss, a frosted strip for a dock.
    static let flat = glossy.with {
        $0.cornerRatio = 0.2237; $0.squircle = 1; $0.gloss = 0
        $0.iconScale = 60.0 / 320.0
        $0.iconShadow = .clear; $0.iconShadowRadius = 0; $0.iconShadowY = 0
        $0.labelSize = 12.0 / 320.0
        $0.labelShadow = Ink(0x000000, 0.55); $0.labelWeight = .regular; $0.typeface = .helveticaNeue
        $0.dockShelf = 0; $0.dockGlassShelf = 0; $0.dockPanel = 1; $0.dockTint = Ink(0xFFFFFF, 0.28); $0.reflection = 0
    }

    /// 2017: the dock floats in from the edges on the all-screen iPhone.
    static let floating = flat.with {
        $0.typeface = .sanFrancisco; $0.labelWeight = .regular
        $0.dockInset = 0.024; $0.dockRadius = 0.08
        $0.iconScale = 60.0 / 375.0; $0.labelSize = 12.0 / 375.0
    }

    /// 2022: the page dots become a Search pill.
    static let searchPill = floating.with { $0.searchPill = 1; $0.dockInset = 0.035 }

    /// 2025: Liquid Glass. A rim of light on every icon and a glass dock.
    static let glass = searchPill.with {
        $0.cornerRatio = 0.27; $0.glassRim = 1
        $0.iconShadow = Ink(0x000000, 0.22); $0.iconShadowRadius = 2.5; $0.iconShadowY = 1.5
        $0.dockTint = Ink(0xFFFFFF, 0.18); $0.dockRadius = 0.11; $0.dockInset = 0.04
        $0.labelShadow = Ink(0x000000, 0.35)
    }
}

extension HomeEra {
    static let timeline: [HomeEra] = {
        let dockClassic = ["Phone", "Mail", "Safari", "Music"]
        // iOS 9 swapped Safari and Mail; iOS 10 sent Mail to the grid and
        // put Messages in its place, and it has stayed that way since.
        let dock2015 = ["Phone", "Safari", "Mail", "Music"]
        let dockModern = ["Phone", "Safari", "Messages", "Music"]

        let original = DeviceLook.iPhone2007
        let iPhone3G = DeviceLook.iPhone3G
        let iPhone4 = DeviceLook.homeButtonPhone(width: 58.6, height: 115.2, radius: 8.8, screenWidth: 49.3, screenHeight: 74,
                                                 frame: 0xB9BBBE, frameWidth: 1.3, glyph: 1, ring: 0)
        let iPhone5 = DeviceLook.homeButtonPhone(width: 58.6, height: 123.8, radius: 8.8, screenWidth: 51.7, screenHeight: 91.8,
                                                 frame: 0x2E2F33, glyph: 1, ring: 0)
        let iPhone5s = DeviceLook.homeButtonPhone(width: 58.6, height: 123.8, radius: 8.8, screenWidth: 51.7, screenHeight: 91.8,
                                                  frame: 0x9A9BA0, glyph: 0, ring: 1)
        let iPhone6 = DeviceLook.homeButtonPhone(width: 67.0, height: 138.1, radius: 10, screenWidth: 58.5, screenHeight: 104,
                                                 frame: 0xA5A6AA, glyph: 0, ring: 1)
        let iPhone6s = DeviceLook.homeButtonPhone(width: 67.1, height: 138.3, radius: 10, screenWidth: 58.5, screenHeight: 104,
                                                  frame: 0xE6C3B7, face: 0xF5F5F7, homeInk: 0xC9A99D, glyph: 0, ring: 1)
        let iPhone7 = DeviceLook.homeButtonPhone(width: 67.1, height: 138.3, radius: 10, screenWidth: 58.5, screenHeight: 104,
                                                 frame: 0x1B1B1D, glyph: 0, ring: 1)
        let iPhoneX = DeviceLook.allScreen(width: 70.9, height: 143.6, bezel: 4.25, screenRadius: 6.6, frame: 0xD9D9DB, frameWidth: 1.2, notchWidth: 34.8)
        let iPhoneXS = DeviceLook.allScreen(width: 70.9, height: 143.6, bezel: 4.25, screenRadius: 6.6, frame: 0xE3CBB0, frameWidth: 1.2, notchWidth: 34.8)
        let iPhone11Pro = DeviceLook.allScreen(width: 71.4, height: 144.0, bezel: 4.5, screenRadius: 6.5, frame: 0x4E5851, frameWidth: 1.2, notchWidth: 34.8)
        let iPhone12Pro = DeviceLook.allScreen(width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0x2D4E5C, notchWidth: 34.8)
        let iPhone13Pro = DeviceLook.allScreen(width: 71.5, height: 146.7, bezel: 3.5, screenRadius: 7.8, frame: 0xA7C1D9, notchWidth: 26.8)
        let iPhone14Pro = DeviceLook.allScreen(width: 71.5, height: 147.5, bezel: 3.2, screenRadius: 9.1, frame: 0x594F63, island: true)
        let iPhone15Pro = DeviceLook.allScreen(width: 70.6, height: 146.6, bezel: 2.8, screenRadius: 9.1, frame: 0x8F8A81, island: true)
        let iPhone16Pro = DeviceLook.allScreen(width: 71.5, height: 149.6, bezel: 2.4, screenRadius: 10.3, frame: 0xBFA48F, island: true)
        let iPhone17Pro = DeviceLook.allScreen(width: 71.9, height: 150.0, bezel: 2.6, screenRadius: 10.3, frame: 0xF38B3C, island: true)
        let iPhone18Pro = DeviceLook.allScreen(width: 71.9, height: 150.0, bezel: 2.6, screenRadius: 10.3, frame: 0x6E3B3F, island: true)

        /// Home screens had no wallpaper until iOS 4: black, under a black bar.
        let black = ScreenLook.classic(top: 0x000000, bottom: 0x000000)
        func wallpaper(_ top: UInt32, _ bottom: UInt32, _ a: UInt32, _ b: UInt32, strength: Double = 1,
                       band: Ink = .clear, clockX: Double = 0.5, chrome: UInt32 = 0xFFFFFF) -> ScreenLook {
            ScreenLook.wallpaper(top: top, bottom: bottom, a: a, b: b, strength: strength).with {
                $0.statusBand = band; $0.clockX = clockX; $0.chrome = Ink(chrome)
            }
        }
        let bar = Ink(0x000000)

        let glossy5 = HomeChrome.glossyGlass.with { $0.rows = 5 }
        let flat5 = HomeChrome.flat.with { $0.rows = 5 }
        let flat6 = HomeChrome.flat.with { $0.rows = 6; $0.iconScale = 60.0 / 375.0; $0.labelSize = 12.0 / 375.0 }
        let sf6 = flat6.with { $0.typeface = .sanFrancisco; $0.labelWeight = .regular }
        let floating6 = HomeChrome.floating.with { $0.rows = 6 }
        let pill6 = HomeChrome.searchPill.with { $0.rows = 6 }
        let glass6 = HomeChrome.glass.with { $0.rows = 6 }

        // From iOS 15 the page opens with two small widgets on rows one and two.
        let widgets = ["Weather Widget", "Calendar Widget"]

        // Every stock app is on the page from the release it shipped in.
        // What does not fit goes in Apple's default folder, as Apple did.
        let folder2014 = ["Compass", "Tips", "Voice Memos", "Contacts"]
        let folder2015 = folder2014 + ["Watch", "Find Friends"]
        let folder2019 = ["Calculator", "iTunes", "Measure", "Watch", "Compass", "Tips", "Voice Memos", "Contacts"]
        let folder2020 = ["Translate", "Calculator", "iTunes", "Measure", "Watch", "Magnifier", "Compass", "Tips", "Voice Memos", "Contacts"]
        let folder2022 = ["Freeform", "Fitness"] + folder2020
        let folder2023 = ["Journal"] + folder2022
        let folder2024 = ["Find My"] + folder2023
        let page2019 = ["FaceTime", "Calendar", "Photos", "Camera", "Mail", "Clock", "Maps", "Weather",
                        "Reminders", "Notes", "Stocks", "News", "Books", "App Store", "Podcasts", "TV",
                        "Health", "Home", "Wallet", "Settings", "Files", "Shortcuts", "Find My", "Utilities"]

        return [
            HomeEra(year: 2007, system: "iPhone OS 1", device: "iPhone",
                    note: "Twelve apps, a black screen, and a metal tray to stand on. iTunes arrives in 1.1.",
                    chrome: .glossy, screen: black, hardware: original,
                    page: ["Messages", "Calendar", "Photos", "Camera", "YouTube", "Stocks", "Maps", "Weather",
                           "Clock", "Calculator", "Notes", "Settings", "iTunes"],
                    dock: dockClassic),

            HomeEra(year: 2008, system: "iPhone OS 2", device: "iPhone 3G",
                    note: "The App Store arrives. Contacts gets its own icon, on page two.",
                    chrome: .glossy, screen: black, hardware: iPhone3G,
                    page: ["Messages", "Calendar", "Photos", "Camera", "YouTube", "Stocks", "Maps", "Weather",
                           "Clock", "Calculator", "Notes", "Settings", "iTunes", "App Store"],
                    dock: dockClassic),

            HomeEra(year: 2009, system: "iPhone OS 3", device: "iPhone 3GS",
                    note: "Text becomes Messages. Voice Memos and Compass fill the page.",
                    chrome: .glossySpotlight, screen: black, hardware: iPhone3G,
                    page: ["Messages", "Calendar", "Photos", "Camera", "YouTube", "Stocks", "Maps", "Weather",
                           "Voice Memos", "Notes", "Clock", "Calculator", "Settings", "iTunes", "App Store", "Compass"],
                    dock: dockClassic),

            HomeEra(year: 2010, system: "iOS 4", device: "iPhone 4",
                    note: "Wallpaper at last. Folders arrive, and Utilities swallows the small apps. Game Center.",
                    chrome: .glossyGlass, screen: wallpaper(0x6F8A94, 0x8C989B, 0xC3CCCE, 0x4F5F66, strength: 0.7, band: Ink(0x000000, 0.65)),
                    hardware: iPhone4,
                    page: ["Messages", "Calendar", "Photos", "Camera", "YouTube", "Stocks", "Maps", "Weather",
                           "Notes", "Utilities", "iTunes", "App Store", "Game Center", "Settings"],
                    dock: dockClassic,
                    folder: ["Clock", "Calculator", "Compass", "Voice Memos", "Contacts"]),

            HomeEra(year: 2011, system: "iOS 5", device: "iPhone 4S",
                    note: "iPod splits into Music and Videos. Reminders and Newsstand move in.",
                    chrome: .glossyGlass, screen: wallpaper(0x6F8A94, 0x8C989B, 0xC3CCCE, 0x4F5F66, strength: 0.7, band: Ink(0x000000, 0.65)),
                    hardware: iPhone4,
                    page: ["Messages", "Calendar", "Photos", "Camera", "TV", "YouTube", "Maps", "Weather",
                           "Notes", "Reminders", "Game Center", "Newsstand", "iTunes", "App Store", "Settings", "Utilities"],
                    dock: dockClassic,
                    folder: ["Clock", "Stocks", "Calculator", "Compass", "Voice Memos", "Contacts"]),

            HomeEra(year: 2012, system: "iOS 6", device: "iPhone 5",
                    note: "A fifth row. YouTube is gone, Passbook is in, and Maps is Apple's own.",
                    chrome: glossy5, screen: wallpaper(0x232B32, 0x111C26, 0x2E5C8A, 0x0C2140, band: bar),
                    hardware: iPhone5,
                    page: ["Messages", "Calendar", "Photos", "Camera", "TV", "Maps", "Weather", "Wallet",
                           "Notes", "Reminders", "Clock", "Stocks", "Newsstand", "iTunes", "App Store", "Game Center",
                           "Settings", "Utilities"],
                    dock: dockClassic,
                    folder: ["Contacts", "Calculator", "Compass", "Voice Memos"]),

            HomeEra(year: 2013, system: "iOS 7", device: "iPhone 5s",
                    note: "Everything flattens and every icon is redrawn. FaceTime gets its own icon.",
                    chrome: flat5, screen: wallpaper(0x0B1A3A, 0x1A3468, 0x2C4C8A, 0x061024),
                    hardware: iPhone5s,
                    page: ["Messages", "Calendar", "Photos", "Camera", "Weather", "Clock", "Maps", "TV",
                           "Notes", "Reminders", "Stocks", "Game Center", "Newsstand", "iTunes", "App Store", "Wallet",
                           "FaceTime", "Settings", "Utilities"],
                    dock: dockClassic,
                    folder: ["Compass", "Voice Memos", "Contacts", "Calculator"]),

            HomeEra(year: 2014, system: "iOS 8", device: "iPhone 6",
                    note: "A bigger phone, a sixth row. Health, iBooks, Podcasts and Tips come built in.",
                    chrome: flat6, screen: wallpaper(0x1F1D29, 0x8C8496, 0x4E4456, 0xE4E1EA, strength: 0.85),
                    hardware: iPhone6,
                    page: ["Messages", "Calendar", "Photos", "Camera", "Weather", "Clock", "Maps", "TV",
                           "Notes", "Reminders", "Stocks", "Game Center", "Newsstand", "iTunes", "App Store", "Books",
                           "Health", "Wallet", "Settings", "FaceTime", "Calculator", "Podcasts", "Utilities"],
                    dock: dockClassic,
                    folder: folder2014),

            HomeEra(year: 2015, system: "iOS 9", device: "iPhone 6s",
                    note: "San Francisco. News replaces Newsstand, Passbook becomes Wallet. Find iPhone and Watch.",
                    chrome: sf6.with { $0.spotlightGlyph = 1 }, screen: wallpaper(0x97BCC8, 0x4C5C6F, 0xB1D7DE, 0x3E4C68),
                    hardware: iPhone6s,
                    page: ["Messages", "Calendar", "Photos", "Camera", "Weather", "Clock", "Maps", "TV",
                           "Wallet", "Notes", "Reminders", "Stocks", "iTunes", "App Store", "Books", "News",
                           "Health", "Settings", "FaceTime", "Calculator", "Podcasts", "Game Center", "Find My", "Utilities"],
                    dock: dock2015,
                    folder: folder2015),

            HomeEra(year: 2016, system: "iOS 10", device: "iPhone 7",
                    note: "Messages takes Mail's place in the dock. Home arrives, Game Center goes.",
                    chrome: sf6, screen: wallpaper(0x1B635B, 0x659075, 0xA8C4AD, 0x074D44),
                    hardware: iPhone7,
                    page: ["Mail", "Calendar", "Photos", "Camera", "Maps", "Clock", "Weather", "News",
                           "Wallet", "Notes", "Reminders", "Stocks", "TV", "Books", "iTunes", "App Store",
                           "Home", "Health", "Settings", "FaceTime", "Calculator", "Podcasts", "Find My", "Utilities"],
                    dock: dockModern,
                    folder: folder2015),

            HomeEra(year: 2017, system: "iOS 11", device: "iPhone X",
                    note: "The notch. The dock floats. Files arrives; App Store and Camera get new faces.",
                    chrome: floating6, screen: wallpaper(0x1C1240, 0x0A1E4A, 0xE8579E, 0x2B6BD8, clockX: 0.1275),
                    hardware: iPhoneX,
                    page: ["Mail", "Calendar", "Photos", "Camera", "Maps", "Clock", "Weather", "News",
                           "Home", "Notes", "Stocks", "Reminders", "TV", "App Store", "iTunes", "Books",
                           "Health", "Wallet", "Settings", "FaceTime", "Calculator", "Podcasts", "Files", "Utilities"],
                    dock: dockModern,
                    folder: ["Find My", "Find Friends", "Watch", "Compass", "Tips", "Voice Memos", "Contacts"]),

            HomeEra(year: 2018, system: "iOS 12", device: "iPhone XS",
                    note: "FaceTime takes the top corner. Measure arrives; iBooks is just Books.",
                    chrome: floating6, screen: wallpaper(0x2E3A56, 0x517889, 0xC76474, 0x2C3048, clockX: 0.1275),
                    hardware: iPhoneXS,
                    page: ["FaceTime", "Calendar", "Photos", "Camera", "Mail", "Clock", "Maps", "Weather",
                           "Notes", "Reminders", "News", "Stocks", "TV", "iTunes", "App Store", "Books",
                           "Health", "Home", "Wallet", "Settings", "Calculator", "Podcasts", "Files", "Utilities"],
                    dock: dockModern,
                    folder: ["Measure", "Find My", "Find Friends", "Watch", "Compass", "Tips", "Voice Memos", "Contacts"]),

            HomeEra(year: 2019, system: "iOS 13", device: "iPhone 11 Pro",
                    note: "Dark Mode. Find My merges two apps; Shortcuts comes built in.",
                    chrome: floating6, screen: wallpaper(0xDC6224, 0xB085A7, 0xF1953E, 0xA62B3D, clockX: 0.1275),
                    hardware: iPhone11Pro,
                    page: page2019,
                    dock: dockModern,
                    folder: folder2019),

            HomeEra(year: 2020, system: "iOS 14", device: "iPhone 12 Pro",
                    note: "Widgets and the App Library arrive. Translate and Magnifier.",
                    chrome: floating6, screen: wallpaper(0xDEA857, 0x93589B, 0xD2825C, 0x5E5394, clockX: 0.120),
                    hardware: iPhone12Pro,
                    page: page2019,
                    dock: dockModern,
                    folder: folder2020),

            HomeEra(year: 2021, system: "iOS 15", device: "iPhone 13 Pro",
                    note: "A smaller notch. Camera rounds off, Maps drops its highway shield.",
                    chrome: floating6, screen: wallpaper(0xCDBE9F, 0xAB9594, 0x474E58, 0xD7CBB5, clockX: 0.120),
                    hardware: iPhone13Pro,
                    page: page2019,
                    dock: dockModern,
                    folder: folder2020),

            HomeEra(year: 2022, system: "iOS 16", device: "iPhone 14 Pro",
                    note: "The Dynamic Island. A Search pill replaces the dots. Freeform and Fitness.",
                    chrome: pill6, screen: wallpaper(0x1B3A6B, 0x0E5A6E, 0x3FB5C9, 0xF2D35B, clockX: 0.182),
                    hardware: iPhone14Pro,
                    page: page2019,
                    dock: dockModern,
                    folder: folder2022),

            HomeEra(year: 2023, system: "iOS 17", device: "iPhone 15 Pro",
                    note: "Same page, new phone. Journal arrives.",
                    chrome: pill6, screen: wallpaper(0x6D0212, 0x27B2EA, 0xFB6A3A, 0xCC72E3, clockX: 0.182),
                    hardware: iPhone15Pro,
                    page: page2019,
                    dock: dockModern,
                    folder: folder2023),

            HomeEra(year: 2024, system: "iOS 18", device: "iPhone 16 Pro",
                    note: "Passwords gets its own app. Icons can go anywhere, dark or tinted.",
                    chrome: pill6, screen: wallpaper(0xC9A6C4, 0x8FA9D6, 0xE08CB0, 0x5F8BD0, clockX: 0.182),
                    hardware: iPhone16Pro,
                    page: ["FaceTime", "Calendar", "Photos", "Camera", "Mail", "Clock", "Maps", "Weather",
                           "Reminders", "Notes", "Stocks", "News", "Books", "App Store", "Podcasts", "TV",
                           "Health", "Home", "Wallet", "Settings", "Files", "Shortcuts", "Passwords", "Utilities"],
                    dock: dockModern,
                    folder: folder2024),

            HomeEra(year: 2025, system: "iOS 26", device: "iPhone 17 Pro",
                    note: "Liquid Glass: every icon is layered light. Games takes Podcasts' slot; Preview.",
                    chrome: glass6, screen: wallpaper(0x0B1E4A, 0x3A0F5C, 0x2F8CFF, 0xFF5FA2, clockX: 0.182),
                    hardware: iPhone17Pro,
                    page: ["FaceTime", "Calendar", "Photos", "Camera", "Mail", "Clock", "Maps", "Weather",
                           "Reminders", "Notes", "Stocks", "News", "Books", "App Store", "Games", "TV",
                           "Health", "Home", "Wallet", "Settings", "Files", "Shortcuts", "Passwords", "Utilities"],
                    dock: dockModern,
                    folder: ["Podcasts", "Preview"] + folder2024),

            HomeEra(year: 2026, system: "iOS 27", device: "iPhone 18 Pro",
                    note: "Siri gets an icon of its own and Reminders leaves the page. Sharper glass.",
                    chrome: glass6, screen: wallpaper(0x3A0A1C, 0x14060D, 0x7A1F3D, 0x4A1230, clockX: 0.182),
                    hardware: iPhone18Pro,
                    page: ["FaceTime", "Calendar", "Photos", "Camera", "Mail", "Clock", "Maps", "Weather",
                           "Siri", "Notes", "Stocks", "News", "Books", "App Store", "Games", "TV",
                           "Health", "Home", "Wallet", "Settings", "Files", "Shortcuts", "Passwords", "Utilities"],
                    dock: dockModern,
                    folder: ["Reminders", "Podcasts", "Preview"] + folder2024),
        ].map { era in
            var era = era
            era.chrome.metrics = .measured(era.year)
            era.chrome.labelSize = HomeMetrics.labelSize(era.year)
            return era
        }
    }()
}
