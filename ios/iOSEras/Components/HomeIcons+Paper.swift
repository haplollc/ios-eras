//
//  HomeIcons+Paper.swift
//  iOSEras
//
//  Icon designs, one entry per redesign, for: Calendar, Notes, Reminders,
//  Settings, Calculator, Stocks, Compass. Every generation is a reading of
//  the real icon for that release: colours sampled from period artwork,
//  geometry measured from the assets, spans from Logopedia's version notes.
//  Timeline years: 2007 OS 1, 2008 OS 2, 2009 OS 3, 2010 iOS 4, 2011 iOS 5,
//  2012 iOS 6, 2013 iOS 7, 2014 iOS 8, 2015 iOS 9, 2016 iOS 10, 2017 iOS 11,
//  2018 iOS 12, 2019 iOS 13, 2020 iOS 14, 2021 iOS 15, 2022 iOS 16,
//  2023 iOS 17, 2024 iOS 18, 2025 iOS 26, 2026 iOS 27.
//
//  The system lays a white gloss over the top half of every pre-2013 icon,
//  so the skeuomorphic reds, browns and greys here are set deeper than the
//  sampled (already gloss-lit) values to land near them once it is applied.
//  Calendar and Notes 2007-2012 instead draw their own, fainter gloss over
//  the system's (PaperSoftGloss): their header and binding colours are set
//  for that 0.4 / 0.3 shine.
//

import SwiftUI

extension HomeApp {
    static let paper: [HomeApp] = [

        // MARK: Calendar — a live date; Tuesday the 9th, the day the iPhone was announced.
        HomeApp("Calendar", designs: [
            // iPhone OS 1-3: tear-off pad, glossy red header, heavy Helvetica date.
            // Under a 0.4 gloss (see PaperSoftGloss): pink at the very top, saturated red below.
            flat(2007, 0xFFFFFF, art { edge in                                                            // sampled
                PaperSoftGloss(scale: 0.4) {
                    PaperCalendarArt(header: [hex(0xE8868A), hex(0xDC5256), hex(0xCF1E24), hex(0xC0070C)], headerHeight: 0.28,
                                     seam: hex(0x7A0304), curl: false, page: .white,
                                     weekday: "Tuesday", weekdayFont: { .custom("Helvetica-Bold", size: $0 * 0.175) },
                                     weekdayInk: .white, weekdayY: 0.16, weekdayShadow: true,
                                     numeralFont: { .custom("Helvetica-Bold", size: $0 * 0.68) }, numeralInk: hex(0x333333), numeralY: 0.665)
                }
                .frame(width: edge, height: edge)
                .zIndex(1)
            }),
            // iOS 4-6: Retina redraw; a softer red, a page-curl shadow, a bigger numeral on faintly grey paper.
            design(2010, 0xF4F4F3, 0xE6E6E6, art { edge in                                               // sampled
                PaperSoftGloss(scale: 0.4, backdrop: [hex(0xF4F4F3), hex(0xE6E6E6)]) {
                    PaperCalendarArt(header: [hex(0xD87C7C), hex(0xC44444), hex(0xB62626), hex(0x960F0F)], headerHeight: 0.275,
                                     seam: hex(0x2A0808), curl: true, page: .clear,
                                     weekday: "Tuesday", weekdayFont: { .custom("Helvetica-Bold", size: $0 * 0.18) },
                                     weekdayInk: .white, weekdayY: 0.155, weekdayShadow: true,
                                     numeralFont: { .custom("Helvetica-Bold", size: $0 * 0.80) }, numeralInk: hex(0x333333), numeralY: 0.63)
                }
                .frame(width: edge, height: edge)
                .zIndex(1)
            }),
            // iOS 7-8: the bar goes; red Helvetica Neue weekday over a hairline UltraLight numeral.
            flat(2013, 0xFFFFFF, art { edge in                                                            // documented
                PaperCalendarArt(page: .white,
                                 weekday: "Tuesday", weekdayFont: { .custom("HelveticaNeue", size: $0 * 0.163) },
                                 weekdayInk: hex(0xFF3B30), weekdayY: 0.19,
                                 numeralFont: { .custom("HelveticaNeue-UltraLight", size: $0 * 0.66) }, numeralInk: .black, numeralY: 0.59)
                    .frame(width: edge, height: edge)
            }),
            // iOS 9-10: only the typeface moves, Helvetica Neue to San Francisco.
            flat(2015, 0xFFFFFF, art { edge in                                                            // documented
                PaperCalendarArt(page: .white,
                                 weekday: "Tuesday", weekdayFont: { .system(size: $0 * 0.163, weight: .regular) },
                                 weekdayInk: hex(0xFF3B30), weekdayY: 0.19,
                                 numeralFont: { .system(size: $0 * 0.66, weight: .ultraLight) }, numeralInk: .black, numeralY: 0.595)
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-13: the text goes bold; the numeral doubles its stroke.
            flat(2017, 0xFFFFFF, art { edge in                                                            // documented
                PaperCalendarArt(page: .white,
                                 weekday: "Tuesday", weekdayFont: { .system(size: $0 * 0.18, weight: .semibold) },
                                 weekdayInk: hex(0xFF3B30), weekdayY: 0.205,
                                 numeralFont: { .system(size: $0 * 0.667, weight: .light) }, numeralInk: .black, numeralY: 0.605)
                    .frame(width: edge, height: edge)
            }),
            // iOS 14-18: the weekday becomes a bold three-letter abbreviation.
            flat(2020, 0xFFFFFF, art { edge in                                                            // documented (SVG)
                PaperCalendarArt(page: .white,
                                 weekday: "TUE", weekdayFont: { .system(size: $0 * 0.20, weight: .bold) },
                                 weekdayInk: hex(0xFF3A2F), weekdayY: 0.19,
                                 numeralFont: { .system(size: $0 * 0.624, weight: .regular) }, numeralInk: hex(0x262626), numeralY: 0.60)
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; title-case weekday, a semibold numeral raised as glass.
            design(2025, 0xFDFDFD, 0xEFEFEF, art { edge in                                                // sampled
                PaperCalendarArt(page: .clear,
                                 weekday: "Tue", weekdayFont: { .system(size: $0 * 0.20, weight: .semibold) },
                                 weekdayInk: hex(0xFF393C), weekdayY: 0.22,
                                 numeralFont: { .system(size: $0 * 0.624, weight: .semibold) }, numeralInk: hex(0x1E1E1E), numeralY: 0.61,
                                 glass: true)
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: flatter white, the red softened, the numeral pure black.
            design(2026, 0xFEFEFE, 0xF7F7F7, art { edge in                                                // sampled
                PaperCalendarArt(page: .clear,
                                 weekday: "Tue", weekdayFont: { .system(size: $0 * 0.20, weight: .semibold) },
                                 weekdayInk: hex(0xEB4B46), weekdayY: 0.222,
                                 numeralFont: { .system(size: $0 * 0.62, weight: .semibold) }, numeralInk: .black, numeralY: 0.612,
                                 glass: true)
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Notes
        HomeApp("Notes", designs: [
            // iPhone OS 1-3: a yellow legal pad under a brown leather binding.
            // Under a 0.3 gloss (see PaperSoftGloss) the leather lands on the sampled browns.
            design(2007, 0xFBF7A6, 0xF3EC8E, art { edge in                                                // sampled
                PaperSoftGloss(scale: 0.3) {
                    PaperLegalPad(leather: [hex(0x6C402F), hex(0x563529), hex(0x4B2E23), hex(0x41251A)], seam: hex(0x1E0F0A),
                                  torn: hex(0xA8985C), paper: [hex(0xFBF6A0), hex(0xF5EE8A)], rule: hex(0xDCD674),
                                  margin: hex(0xC0A86C), marginX: [0.14, 0.175], jagged: false)
                }
                .frame(width: edge, height: edge)
                .zIndex(1)
            }),
            // iOS 4-6: Retina redraw; brighter paper, greyer rules, a hand-torn edge under the binding.
            design(2010, 0xFCF8B8, 0xF5F2AA, art { edge in                                                // sampled
                PaperSoftGloss(scale: 0.3) {
                    PaperLegalPad(leather: [hex(0x664332), hex(0x553625), hex(0x492D1F), hex(0x40291E)], seam: hex(0x1A120C),
                                  torn: hex(0x9E9C74), paper: [hex(0xFCF8B8), hex(0xF5F2AA)], rule: hex(0xB4B69A),
                                  margin: hex(0xC9AF7A), marginX: [0.15, 0.19], jagged: true)
                }
                .frame(width: edge, height: edge)
                .zIndex(1)
            }),
            // iOS 7-10: flat; a deep yellow band, a row of perforations, three full-width rules.
            flat(2013, 0xF8F8F8, art { edge in                                                            // sampled
                PaperFlatPad(band: [hex(0xFFDA47), hex(0xFFD018), hex(0xFECB01)], bandHeight: 0.30, bandShadow: hex(0xAEAFB0, 0.55),
                             dots: hex(0xA8A8A8), dotsY: 0.367, dotPitch: 0.033, dotSize: 0.014,
                             rules: [0.50, 0.685, 0.878], rule: hex(0xAEAEAE))
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-18: the band shortens to a quarter, two rules, cooler greys.
            flat(2017, 0xFEFFFE, art { edge in                                                            // sampled
                PaperFlatPad(band: [hex(0xFEDE5C), hex(0xFED324), hex(0xFFCC03)], bandHeight: 0.25, bandShadow: hex(0x9B9B9B, 0.45),
                             dots: hex(0xC7C7CC), dotsY: 0.30, dotPitch: 0.033, dotSize: 0.013,
                             rules: [0.50, 0.75], rule: hex(0xC7C7CC))
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; a glassy band with a bright lip, big perforations, the rules inset with round ends.
            design(2025, 0xFAFAFA, 0xECECEC, art { edge in                                                // sampled
                PaperFlatPad(band: [hex(0xFFDC3D), hex(0xFED52D), hex(0xFEDA32)], bandHeight: 0.25, lip: hex(0xFFE040),
                             bandShadow: hex(0xC1BCA4, 0.6), dots: hex(0xC1BCA4), dotsY: 0.285, dotPitch: 0.0632, dotSize: 0.023, dotPhase: 0.051,
                             rules: [0.50, 0.75], rule: hex(0xC1C1C1), ruleInset: 0.125, ruleWidth: 0.011)
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: paler, less saturated yellow; a thinner shadow.
            design(2026, 0xF6F6F6, 0xECECEC, art { edge in                                                // sampled
                PaperFlatPad(band: [hex(0xFFE362), hex(0xF8D652), hex(0xF8D24B)], bandHeight: 0.25, lip: hex(0xFCE070),
                             bandShadow: hex(0xB9B9B9, 0.4), dots: hex(0xB9B9B9), dotsY: 0.285, dotPitch: 0.0632, dotSize: 0.023, dotPhase: 0.051,
                             rules: [0.50, 0.75], rule: hex(0xC1C1C1), ruleInset: 0.125, ruleWidth: 0.011)
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Reminders — arrived in iOS 5.
        HomeApp("Reminders", designs: [
            // iOS 5-6: a stitched black leather frame round a white card of ticked-off lines.
            design(2011, 0x333333, 0x151515, art { edge in                                                // documented
                PaperReminderCard().frame(width: edge, height: edge)
            }),
            // iOS 7-10: four coloured bullseyes down the left, faint rules to the right edge.
            flat(2013, 0xF8F8F8, art { edge in                                                            // measured
                PaperReminderRows(colours: [hex(0xFF9500), hex(0x34AADC), hex(0x4CD964), hex(0xCC73E1)], rows: [0.21, 0.40, 0.59, 0.78],
                                  markerX: 0.16, outer: 0.135, ring: 0.02, disc: 0.075,
                                  rules: [0.117, 0.306, 0.494, 0.683, 0.867], ruleX0: 0.30, ruleX1: 1.0, ruleInk: hex(0xE2E2E2), ruleWidth: 0.008)
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-12: three bullseyes, orange, blue, green, between grey rules.
            flat(2017, 0xFFFFFF, art { edge in                                                            // measured
                PaperReminderRows(colours: [hex(0xFF9500), hex(0x1FA1F7), hex(0x4CD964)], rows: [0.248, 0.498, 0.748],
                                  markerX: 0.164, outer: 0.162, ring: 0.02, disc: 0.093,
                                  rules: [0.12, 0.373, 0.623, 0.875], ruleX0: 0.333, ruleX1: 1.0, ruleInk: hex(0xD2D2D2), ruleWidth: 0.01)
                    .frame(width: edge, height: edge)
            }),
            // iOS 13-18: blue, red, orange bullseyes with a grey bar beside each.
            flat(2019, 0xFFFFFF, art { edge in                                                            // measured
                PaperReminderRows(colours: [hex(0x007AFF), hex(0xFF3B30), hex(0xFF9500)], rows: [0.25, 0.50, 0.75],
                                  markerX: 0.188, outer: 0.164, ring: 0.03, disc: 0.075,
                                  bar: PaperBar(x0: 0.367, x1: 0.879, height: 0.02, ink: hex(0xCBCBCF)))
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: the markers become glass pins, a disc in a translucent halo.
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in                                                // documented
                PaperReminderRows(colours: [hex(0x2D7CF6), hex(0xFF3B30), hex(0xFF9F0A)], rows: [0.25, 0.50, 0.75],
                                  markerX: 0.207, outer: 0.165, ring: 0, disc: 0.095, style: .glassPin,
                                  bar: PaperBar(x0: 0.35, x1: 0.83, height: 0.022, ink: hex(0xC2C2C2)))
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: solid coloured rings round a pale tinted centre, shadows deepened.
            design(2026, 0xFEFEFE, 0xEBEBEB, art { edge in                                                // documented
                PaperReminderRows(colours: [hex(0x2D7CF6), hex(0xE9463F), hex(0xF29A2E)], rows: [0.25, 0.50, 0.75],
                                  markerX: 0.203, outer: 0.17, ring: 0.04, disc: 0, style: .softRing,
                                  bar: PaperBar(x0: 0.371, x1: 0.875, height: 0.022, ink: hex(0xC1C1C1)))
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Settings
        HomeApp("Settings", designs: [
            // iPhone OS 1-3: a sawtooth silver wheel with a dark hub, two small gears at the foot,
            // on a perforated charcoal plate in a thick chrome bevel.
            design(2007, 0x58595B, 0x333436, art { edge in                                                // measured (57 px asset)
                PaperGearPlate(style: .os1).frame(width: edge, height: edge)
            }),
            // iOS 4-5: Retina redraw; longer, sharper teeth, a raised silver hub, a lighter plate.
            design(2010, 0x7C7D80, 0x55565A, art { edge in                                                // measured (114 px asset)
                PaperGearPlate(style: .ios4).frame(width: edge, height: edge)
            }),
            // iOS 6: darker plate, bold perforations, rounded teeth, the wheel raised (to match Mountain Lion).
            design(2012, 0x3A3A3B, 0x202021, art { edge in                                                // documented
                PaperGearPlate(style: .ios6).frame(width: edge, height: edge)
            }),
            // iOS 7-10: one gear as nested rings inside a dark disc, a three-spoke hub, on Apple's grey ramp.
            design(2013, 0xDBDCDE, 0x898C91, art { edge in                                                // measured
                PaperNestedGear(dark: hex(0x545454), inner: hex(0xB5B5B5), top: hex(0xDBDCDE), bottom: hex(0x898C91), scale: 1.0)
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-17: the gear goes near-black, like tvOS.
            design(2017, 0xE4E5E9, 0x8E8E94, art { edge in                                                // measured
                PaperNestedGear(dark: hex(0x2E2E2F), inner: hex(0xB4B4B6), top: hex(0xE4E5E9), bottom: hex(0x8E8E94), scale: 1.0)
                    .frame(width: edge, height: edge)
            }),
            // iOS 18: slightly zoomed out.
            design(2024, 0xE4E5E9, 0x8E8E94, art { edge in                                                // documented
                PaperNestedGear(dark: hex(0x2E2E2F), inner: hex(0xB4B4B6), top: hex(0xE4E5E9), bottom: hex(0x8E8E94), scale: 0.95)
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; a white glass gear of 36 teeth, a grey gear seen through its windows.
            design(2025, 0xA7A7AD, 0x5F5F63, art { edge in                                                // measured
                PaperGlassGears(frontAlpha: 0.94, back: hex(0xE2E2E6, 0.62), backRadius: 0.25, backHole: 0.76, backTeeth: 26,
                                ringHole: 0.75, spokeWidth: 0.055, hubRadius: 0.05, hole: hex(0x77777C))
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: flatter grey; the front gear thicker and more translucent, the back gear smaller.
            design(2026, 0x9C9C9F, 0x78787D, art { edge in                                                // measured
                PaperGlassGears(frontAlpha: 0.80, back: hex(0xE6E6EA, 0.55), backRadius: 0.23, backHole: 0.70, backTeeth: 22,
                                ringHole: 0.72, spokeWidth: 0.07, hubRadius: 0.06, hole: hex(0x78787D))
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Calculator
        HomeApp("Calculator", designs: [
            // iPhone OS 1.1: black leather in a silver bevel; round taupe keys and an orange equals.
            design(2007, 0x202020, 0x121212, art { edge in                                                // documented
                PaperCalcKeys(round: true, key: [hex(0x8A7A70), hex(0x5E4F47)], accent: [hex(0xF9A24A), hex(0xE8741C)],
                              frame: [hex(0xE4E7EC), hex(0xA9ADB3)])
                    .frame(width: edge, height: edge)
            }),
            // iPhone OS 2-3: the keys square off.
            design(2008, 0x202020, 0x121212, art { edge in                                                // documented
                PaperCalcKeys(round: false, key: [hex(0x8A7A70), hex(0x5E4F47)], accent: [hex(0xF9A24A), hex(0xE8741C)],
                              frame: [hex(0xE4E7EC), hex(0xA9ADB3)])
                    .frame(width: edge, height: edge)
            }),
            // iOS 4-6: the frame goes; the whole tile is the keypad, taupe shading top to bottom, the equals burnt orange.
            design(2010, 0xC0B3AC, 0x3E332C, art { edge in                                               // sampled
                PaperQuadrants(fills: [[.clear], [.clear], [.clear], [hex(0xEC8428), hex(0xA94A10)]], seam: hex(0x2E2521, 0.9),
                               inks: [.white, .white, .white, .white], signSize: 0.25, stroke: 0.07, embossed: true)
                    .frame(width: edge, height: edge)
            }),
            // iOS 7-10: colours inverted and flat; orange quadrants with thin white signs, a grey equals.
            flat(2013, 0xFF9500, art { edge in                                                            // documented
                PaperQuadrants(fills: [[.clear], [.clear], [.clear], [hex(0xD4D4D2)]], seam: hex(0x100707),
                               inks: [.white, .white, .white, hex(0x333333)], signSize: 0.22, stroke: 0.03, embossed: false)
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-17: a whole calculator drawn flat; the bottom row's zero is a wide pill.
            flat(2017, 0xD4D4D2, art { edge in                                                            // measured
                PaperFlatCalculator(shell: [hex(0x1C1C1C)], display: [hex(0x505050)], key: [hex(0xE0E0E0)], accent: hex(0xFF9F0A),
                                    layout: .flat, mergedBottom: true, rim: nil)
                    .frame(width: edge, height: edge)
            }),
            // iOS 18: the wide zero becomes two plain keys.
            flat(2024, 0xD4D4D2, art { edge in                                                            // documented
                PaperFlatCalculator(shell: [hex(0x1C1C1C)], display: [hex(0x505050)], key: [hex(0xE0E0E0)], accent: hex(0xFF9F0A),
                                    layout: .flat, mergedBottom: false, rim: nil)
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; a charcoal glass body with a grey rim, a glass display, domed keys.
            design(2025, 0xE0E0DE, 0xBDBDBB, art { edge in                                                // sampled
                PaperFlatCalculator(shell: [hex(0x4A4849), hex(0x363435)], display: [hex(0x9A9A9A), hex(0x6E6E6E)],
                                    key: [hex(0xF2F2F0), hex(0xCFCFCD)], accent: hex(0xFF9F0A),
                                    layout: .glass, mergedBottom: false, rim: hex(0x8A8A8A))
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: the body goes near-black, the display darker.
            design(2026, 0xD4D4D4, 0xBCBCBC, art { edge in                                                // sampled
                PaperFlatCalculator(shell: [hex(0x242223), hex(0x0A0A0A)], display: [hex(0x7A7B7B), hex(0x5E5F5F)],
                                    key: [hex(0xEDEDED), hex(0xCACACA)], accent: hex(0xF7922A),
                                    layout: .glass27, mergedBottom: false, rim: hex(0x4A4A4A))
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Stocks
        HomeApp("Stocks", designs: [
            // iPhone OS 1-2: a white chart line on graph-paper blue, months along the foot.
            design(2007, 0xB9D7FC, 0x48D8FF, art { edge in                                                // measured
                PaperStocksSky(sky: [hex(0xB9D7FC), hex(0x0174F0), hex(0x1A9CF8), hex(0x48D8FF)], line: PaperStocksSky.os1,
                               verticals: [0.30, 0.71], months: true, lineWidth: 0.034)
                    .frame(width: edge, height: edge)
            }),
            // iPhone OS 3: the months go; a new, wilder line with ruled paper to the foot.
            design(2009, 0xB9D7FC, 0x48D8FF, art { edge in                                                // measured
                PaperStocksSky(sky: [hex(0xB9D7FC), hex(0x0174F0), hex(0x1A9CF8), hex(0x48D8FF)], line: PaperStocksSky.os3,
                               verticals: [0.36, 0.78], months: false, lineWidth: 0.034)
                    .frame(width: edge, height: edge)
            }),
            // iOS 4-6: Retina redraw; a brighter cyan foot and a thicker line.
            design(2010, 0xC1D7F8, 0x78E7FD, art { edge in                                                // measured
                PaperStocksSky(sky: [hex(0xC1D7F8), hex(0x0460E2), hex(0x2AA9F5), hex(0x78E7FD)], line: PaperStocksSky.os3,
                               verticals: [0.36, 0.78], months: false, lineWidth: 0.04)
                    .frame(width: edge, height: edge)
            }),
            // iOS 7: black, grey below the line, a blue cursor bar and a dot on the peak.
            flat(2013, 0x000000, art { edge in                                                            // measured
                PaperStocksChart(grid: [0.10, 0.30, 0.50, 0.87], gridInk: hex(0x2A2A2A), gridWidth: 0.008,
                                 points: PaperStocksChart.ios7, fill: 0.10, lineWidth: 0.025, lineInk: .white,
                                 barX: 0.69, barWidth: 0.015, barInk: hex(0x1E9BF5), peakY: 0.31, marker: 0.08, markerInk: hex(0x1E9BF5))
                    .frame(width: edge, height: edge)
            }),
            // iOS 8-10: made lighter.
            flat(2014, 0x141416, art { edge in                                                            // sampled
                PaperStocksChart(grid: [0.10, 0.30, 0.50, 0.87], gridInk: hex(0x2E2E30), gridWidth: 0.008,
                                 points: PaperStocksChart.ios7, fill: 0.09, lineWidth: 0.025, lineInk: .white,
                                 barX: 0.69, barWidth: 0.015, barInk: hex(0x1E9BF5), peakY: 0.31, marker: 0.08, markerInk: hex(0x1E9BF5))
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-17: the line and bar thicken, the dot grows.
            flat(2017, 0x1A1A1B, art { edge in                                                            // measured
                PaperStocksChart(grid: [0.14, 0.33, 0.50, 0.84], gridInk: hex(0x333334), gridWidth: 0.01,
                                 points: PaperStocksChart.ios11, fill: 0.10, lineWidth: 0.032, lineInk: .white,
                                 barX: 0.656, barWidth: 0.024, barInk: hex(0x1E9BF5), peakY: 0.34, marker: 0.10, markerInk: hex(0x1E9BF5))
                    .frame(width: edge, height: edge)
            }),
            // iOS 18: a vertical gradient, the line redrawn, the cursor moved left.
            design(2024, 0x2E2E2D, 0x151616, art { edge in                                                // sampled
                PaperStocksChart(grid: [0.14, 0.33, 0.50, 0.84], gridInk: hex(0x3A3A3B), gridWidth: 0.01,
                                 points: PaperStocksChart.ios18, fill: 0.09, lineWidth: 0.032, lineInk: .white,
                                 barX: 0.594, barWidth: 0.024, barInk: hex(0x1E9BF5), peakY: 0.355, marker: 0.10, markerInk: hex(0x1E9BF5))
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; the line a raised white tube, the marker a cyan glass sphere.
            design(2025, 0x313131, 0x101010, art { edge in                                                // measured
                PaperStocksChart(grid: [0.18, 0.40, 0.60, 0.80], gridInk: hex(0x4C4C4C), gridWidth: 0.01,
                                 points: PaperStocksChart.ios26, fill: 0.10, lineWidth: 0.04, lineInk: hex(0xF4F4F4),
                                 barX: 0.604, barWidth: 0.028, barInk: hex(0x29B6F6), peakY: 0.35, marker: 0.12, markerInk: hex(0x4FD3FF), glass: true)
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: brighter cyan; the sphere drawn as a ring.
            design(2026, 0x1F1F1F, 0x161616, art { edge in                                                // documented (tentative)
                PaperStocksChart(grid: [0.18, 0.40, 0.60, 0.80], gridInk: hex(0x3E3E3E), gridWidth: 0.01,
                                 points: PaperStocksChart.ios26, fill: 0.12, lineWidth: 0.04, lineInk: hex(0xF4F4F4),
                                 barX: 0.604, barWidth: 0.028, barInk: hex(0x5FE0FF), peakY: 0.35, marker: 0.17, markerInk: hex(0x5FE0FF), ring: true, glass: true)
                    .frame(width: edge, height: edge)
            }),
        ]),

        // MARK: Compass — arrived with the 3GS in iPhone OS 3.
        HomeApp("Compass", designs: [
            // iPhone OS 3: a brass-hubbed rose on a cream dial, silver bezel, dark wood behind.
            design(2009, 0x6A4232, 0x2E180E, art { edge in                                                // reference: Logopedia Compass 2009
                PaperBrassCompass(retina: false).frame(width: edge, height: edge)
            }),
            // iOS 4-6: Retina redraw; the dial smaller in richer wood, a sharper rose.
            design(2010, 0x6E5A56, 0x240F06, art { edge in                                                // sampled
                PaperBrassCompass(retina: true).frame(width: edge, height: edge)
            }),
            // iOS 7: black; 48 white ticks, W N S E in Helvetica Neue Light, a grey disc with a crosshair.
            flat(2013, 0x000000, art { edge in                                                            // measured
                PaperDialCompass(dial: .ios7, majorInk: .white, minorInk: .white.opacity(0.6),
                                 letters: .white, letterFont: { .custom("HelveticaNeue-Light", size: $0 * 0.118) },
                                 disc: hex(0x2C2C2C), cross: hex(0xA1A1A1), marker: hex(0xFF3B30))
                    .frame(width: edge, height: edge)
            }),
            // iOS 8: lighter; the letters redrawn, the minor ticks grey.
            flat(2014, 0x141416, art { edge in                                                            // sampled (iOS 9 asset)
                PaperDialCompass(dial: .ios7, majorInk: .white, minorInk: hex(0x6F6E71),
                                 letters: .white, letterFont: { .custom("HelveticaNeue", size: $0 * 0.125) },
                                 disc: hex(0x222124), cross: hex(0xB4B4B4), marker: hex(0xFE3C30))
                    .frame(width: edge, height: edge)
            }),
            // iOS 9-10: San Francisco.
            flat(2015, 0x141416, art { edge in                                                            // measured
                PaperDialCompass(dial: .ios7, majorInk: .white, minorInk: hex(0x6F6E71),
                                 letters: .white, letterFont: { .system(size: $0 * 0.125, weight: .regular) },
                                 disc: hex(0x222124), cross: hex(0xB4B4B4), marker: hex(0xFE3C30))
                    .frame(width: edge, height: edge)
            }),
            // iOS 11-17: the tick lines grow longer, the letters firmer, the crosshair dimmer.
            flat(2017, 0x1A1A1B, art { edge in                                                            // measured
                PaperDialCompass(dial: .ios11, majorInk: .white, minorInk: hex(0x656566),
                                 letters: .white, letterFont: { .system(size: $0 * 0.13, weight: .medium) },
                                 disc: hex(0x262627), cross: hex(0x676768), marker: hex(0xFF3A2F))
                    .frame(width: edge, height: edge)
            }),
            // iOS 18: a gradient behind it, and the disc gone: a bare crosshair.
            design(2024, 0x303030, 0x151515, art { edge in                                               // measured
                PaperDialCompass(dial: .ios11, majorInk: .white, minorInk: hex(0x555455),
                                 letters: .white, letterFont: { .system(size: $0 * 0.13, weight: .medium) },
                                 disc: nil, cross: hex(0x787878), marker: hex(0xFF392F))
                    .frame(width: edge, height: edge)
            }),
            // iOS 26: Liquid Glass; big bold letters hugging a long crosshair, the ring drawn in, a glass marker.
            design(2025, 0x313131, 0x141414, art { edge in                                               // measured
                PaperDialCompass(dial: .ios26, majorInk: hex(0xF6F6F6), minorInk: hex(0x737373),
                                 letters: .white, letterFont: { .system(size: $0 * 0.17, weight: .semibold) },
                                 disc: nil, cross: hex(0x737373), marker: hex(0xFF464B), glass: true)
                    .frame(width: edge, height: edge)
            }),
            // iOS 27: the dial becomes a raised glass disc with a bright rim; the ticks move inside it.
            design(2026, 0x232323, 0x0F0F0F, art { edge in                                               // measured (tentative per Logopedia)
                PaperDialCompass(dial: .ios27, majorInk: .white, minorInk: hex(0x787878),
                                 letters: .white, letterFont: { .system(size: $0 * 0.155, weight: .semibold) },
                                 disc: nil, cross: hex(0x777777), marker: hex(0xEA534A), glass: true, bezel: true)
                    .frame(width: edge, height: edge)
            }),
        ]),
    ]
}

// MARK: - Paper composites

/// Points on the unit square, joined into a line.
private struct PaperPolyline: Shape {
    var points: [(Double, Double)]
    /// Closes the line down to the foot of the square, for the area under a chart.
    var closedToFoot = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        for (index, point) in points.enumerated() {
            let p = CGPoint(x: rect.minX + rect.width * point.0, y: rect.minY + rect.height * point.1)
            if index == 0 { path.move(to: p) } else { path.addLine(to: p) }
        }
        if closedToFoot, let first = points.first, let last = points.last {
            path.addLine(to: CGPoint(x: rect.minX + rect.width * last.0, y: rect.maxY))
            path.addLine(to: CGPoint(x: rect.minX + rect.width * first.0, y: rect.maxY))
            path.closeSubpath()
        }
        return path
    }
}

/// Horizontal rules at `ys` and vertical rules at `xs`, in unit coordinates.
private struct PaperLines: Shape {
    var ys: [Double] = []
    var x0: Double = 0
    var x1: Double = 1
    var xs: [Double] = []
    var y0: Double = 0
    var y1: Double = 1

    func path(in rect: CGRect) -> Path {
        var path = Path()
        for y in ys {
            path.move(to: CGPoint(x: rect.minX + rect.width * x0, y: rect.minY + rect.height * y))
            path.addLine(to: CGPoint(x: rect.minX + rect.width * x1, y: rect.minY + rect.height * y))
        }
        for x in xs {
            path.move(to: CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y0))
            path.addLine(to: CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y1))
        }
        return path
    }
}

/// A row of perforation dots across the full width at `y`.
private struct PaperDotRow: Shape {
    var y: Double
    var pitch: Double = 0.03
    var diameter: Double = 0.012
    /// x of the first dot centre; nil puts it half a pitch in.
    var phase: Double? = nil

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let s = rect.width
        var x = rect.minX + s * (phase ?? pitch / 2)
        while x < rect.maxX {
            path.addEllipse(in: CGRect(x: x - s * diameter / 2, y: rect.minY + rect.height * y - s * diameter / 2,
                                       width: s * diameter, height: s * diameter))
            x += s * pitch
        }
        return path
    }
}

/// Rows of perforations as straight lines, to be stroked with a zero-length
/// dash and round caps so each dash becomes a dot: one cheap path however
/// many holes the plate has.
private struct PaperDotLines: Shape {
    var pitch: Double
    var inset: Double
    /// Offsets every other row by half a pitch, rows half a pitch apart: a diamond grid.
    var stagger: Bool

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let s = min(rect.width, rect.height)
        let rowStep = stagger ? pitch * 0.5 : pitch
        var y = rect.minY + s * inset
        var row = 0
        while y < rect.maxY - s * inset * 0.5 {
            let shift = stagger && row % 2 == 1 ? s * pitch * 0.5 : 0
            path.move(to: CGPoint(x: rect.minX + s * inset + shift, y: y))
            path.addLine(to: CGPoint(x: rect.maxX - s * inset * 0.5, y: y))
            y += s * rowStep
            row += 1
        }
        return path
    }
}

/// Radial ticks as one path, `count` round the dial from 12 o'clock
/// clockwise, reaching from radius `r0` to `r1` (shares of the square's
/// side). Every `every`th tick starting at `phase` is left out, or kept
/// alone when `only` is set, so majors and minors can be stroked apart.
private struct PaperTicks: Shape {
    var count: Int
    var r0: Double
    var r1: Double
    var every: Int = 0
    var phase: Int = 0
    var only = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let s = min(rect.width, rect.height)
        let cx = rect.midX
        let cy = rect.midY
        for index in 0..<count {
            if every > 0 {
                let hit = index % every == phase
                if hit != only { continue }
            }
            let angle = Double(index) / Double(count) * 2 * .pi
            let dx = sin(angle)
            let dy = -cos(angle)
            path.move(to: CGPoint(x: cx + dx * s * r0, y: cy + dy * s * r0))
            path.addLine(to: CGPoint(x: cx + dx * s * r1, y: cy + dy * s * r1))
        }
        return path
    }
}

/// A strip of paper stubs: flat on top, torn along the bottom.
private struct PaperTornEdge: Shape {
    var jagged: Bool

    func path(in rect: CGRect) -> Path {
        let soft: [Double] = [0.55, 0.85, 0.65, 0.9, 0.6, 0.8, 0.7, 0.9, 0.6, 0.85, 0.55, 0.8, 0.7, 0.9, 0.6]
        let rough: [Double] = [0.45, 1.0, 0.6, 0.95, 0.4, 0.85, 0.7, 1.0, 0.5, 0.9, 0.35, 0.8, 0.75, 0.95, 0.5]
        let jag = jagged ? rough : soft
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        for i in stride(from: jag.count - 1, through: 0, by: -1) {
            let x = rect.minX + rect.width * Double(i) / Double(jag.count - 1)
            path.addLine(to: CGPoint(x: x, y: rect.minY + rect.height * jag[i]))
        }
        path.closeSubpath()
        return path
    }
}

/// An upward-pointing triangle.
private struct PaperTriangle: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// A gear with square, pointed or rounded teeth, optionally hollow.
private struct PaperGearShape: Shape {
    enum Profile { case square, pointed, rounded }

    var teeth: Int
    /// Tooth height as a share of the outer radius.
    var depth: Double
    var profile: Profile = .square
    /// Diameter of a central hole as a share of the outer diameter (fill even-odd).
    var hole: Double = 0
    /// Outer diameter as a share of the frame, so a gradient fill can span the whole icon.
    var extent: Double = 1

    func path(in rect: CGRect) -> Path {
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        let outer = min(rect.width, rect.height) / 2 * extent
        let inner = outer * (1 - depth)
        var path = Path()
        func point(_ angle: Double, _ radius: Double) -> CGPoint {
            CGPoint(x: centre.x + cos(angle) * radius, y: centre.y + sin(angle) * radius)
        }
        let perTooth = profile == .rounded ? 8 : (profile == .pointed ? 2 : 4)
        let steps = teeth * perTooth
        for step in 0..<steps {
            let angle = Double(step) / Double(steps) * 2 * .pi
            let radius: Double
            switch profile {
            case .square: radius = step % 4 < 2 ? outer : inner
            case .pointed: radius = step % 2 == 0 ? outer : inner
            case .rounded:
                let wave = 0.5 + 0.5 * cos(Double(teeth) * angle)
                radius = inner + (outer - inner) * pow(wave, 0.6)
            }
            let p = point(angle, radius)
            if step == 0 { path.move(to: p) } else { path.addLine(to: p) }
        }
        path.closeSubpath()
        if hole > 0 {
            let r = outer * hole
            path.addEllipse(in: CGRect(x: centre.x - r, y: centre.y - r, width: r * 2, height: r * 2))
        }
        return path
    }
}

// MARK: Calendar

/// A calendar page: optional header strip, weekday, big numeral.
private struct PaperCalendarArt: View {
    var header: [Color] = []
    var headerHeight: Double = 0.28
    var seam: Color = .clear
    var curl: Bool = false
    var page: Color
    var weekday: String
    var weekdayFont: (CGFloat) -> Font
    var weekdayInk: Color
    var weekdayY: Double
    var weekdayShadow: Bool = false
    var numeral: String = "9"
    var numeralFont: (CGFloat) -> Font
    var numeralInk: Color
    var numeralY: Double
    var glass: Bool = false

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                page
                if !header.isEmpty {
                    VStack(spacing: 0) {
                        LinearGradient(colors: header, startPoint: .top, endPoint: .bottom)
                            .frame(height: s * (headerHeight - 0.012))
                        seam.frame(height: s * 0.012)
                        if curl {
                            LinearGradient(colors: [.black.opacity(0.35), .clear], startPoint: .top, endPoint: .bottom)
                                .frame(height: s * 0.05)
                        }
                    }
                }
                Text(weekday)
                    .font(weekdayFont(s))
                    .foregroundStyle(weekdayInk)
                    .fixedSize()
                    .shadow(color: .black.opacity(weekdayShadow ? 0.45 : 0), radius: 0, y: s * 0.008)
                    .position(x: s / 2, y: s * weekdayY)
                if glass {
                    Text(numeral).font(numeralFont(s)).foregroundStyle(.black.opacity(0.16)).fixedSize()
                        .position(x: s / 2 + s * 0.012, y: s * numeralY + s * 0.016)
                    Text(numeral).font(numeralFont(s)).foregroundStyle(.white).fixedSize()
                        .position(x: s / 2 - s * 0.007, y: s * numeralY - s * 0.007)
                }
                Text(numeral)
                    .font(numeralFont(s))
                    .foregroundStyle(numeralInk)
                    .fixedSize()
                    .position(x: s / 2, y: s * numeralY)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: Notes

/// The yellow legal pad of 2007-2012: leather binding, torn stubs, rules and a double margin.
private struct PaperLegalPad: View {
    var leather: [Color]
    var seam: Color
    var torn: Color
    var paper: [Color]
    var rule: Color
    var margin: Color
    var marginX: [Double]
    var jagged: Bool

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                LinearGradient(colors: paper, startPoint: .top, endPoint: .bottom)
                PaperLines(ys: [0.42, 0.525, 0.63, 0.735, 0.84, 0.945])
                    .stroke(rule, lineWidth: max(0.6, s * 0.009))
                PaperLines(xs: marginX, y0: 0.30, y1: 1)
                    .stroke(margin, lineWidth: max(0.6, s * 0.009))
                PaperTornEdge(jagged: jagged).fill(torn)
                    .frame(height: s * 0.075)
                    .offset(y: s * 0.27)
                VStack(spacing: 0) {
                    LinearGradient(colors: leather, startPoint: .top, endPoint: .bottom).frame(height: s * 0.27)
                    seam.frame(height: s * 0.012)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The flat pad of iOS 7 onward: yellow band, perforations, rules.
private struct PaperFlatPad: View {
    var band: [Color]
    var bandHeight: Double
    var lip: Color? = nil
    var bandShadow: Color
    var dots: Color
    var dotsY: Double
    var dotPitch: Double = 0.03
    var dotSize: Double = 0.012
    var dotPhase: Double? = nil
    var rules: [Double]
    var rule: Color
    var ruleInset: Double = 0
    var ruleWidth: Double = 0.008

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                PaperLines(ys: rules, x0: ruleInset, x1: 1 - ruleInset)
                    .stroke(rule, style: StrokeStyle(lineWidth: max(0.6, s * ruleWidth), lineCap: .round))
                PaperDotRow(y: dotsY, pitch: dotPitch, diameter: dotSize, phase: dotPhase).fill(dots)
                VStack(spacing: 0) {
                    LinearGradient(colors: band, startPoint: .top, endPoint: .bottom).frame(height: s * bandHeight)
                    if let lip { lip.frame(height: s * 0.008) }
                    LinearGradient(colors: [bandShadow, .clear], startPoint: .top, endPoint: .bottom).frame(height: s * 0.03)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: Reminders

private struct PaperBar {
    var x0: Double
    var x1: Double
    var height: Double
    var ink: Color
}

private enum PaperMarkerStyle { case bullseye, glassPin, softRing }

/// One reminder marker: a bullseye, a glass pin, or a soft ring.
private struct PaperReminderMarker: View {
    var colour: Color
    var outer: CGFloat
    var ring: CGFloat
    var disc: CGFloat
    var style: PaperMarkerStyle

    var body: some View {
        ZStack {
            switch style {
            case .bullseye:
                Circle().strokeBorder(colour, lineWidth: ring).frame(width: outer, height: outer)
                Circle().fill(colour).frame(width: disc, height: disc)
            case .glassPin:
                Circle().fill(colour.opacity(0.30)).frame(width: outer, height: outer)
                Circle().fill(colour).frame(width: disc, height: disc)
                    .shadow(color: colour.opacity(0.5), radius: disc * 0.12, y: disc * 0.1)
                Circle().fill(.white.opacity(0.75)).frame(width: disc * 0.24, height: disc * 0.24)
                    .offset(x: -disc * 0.2, y: -disc * 0.22)
            case .softRing:
                Circle().fill(colour.opacity(0.32)).frame(width: outer, height: outer)
                Circle().strokeBorder(colour, lineWidth: ring).frame(width: outer, height: outer)
                    .shadow(color: .black.opacity(0.22), radius: outer * 0.08, y: outer * 0.08)
            }
        }
    }
}

/// Rows of markers with either a bar beside each or rules between them.
private struct PaperReminderRows: View {
    var colours: [Color]
    var rows: [Double]
    var markerX: Double
    var outer: Double
    var ring: Double
    var disc: Double
    var style: PaperMarkerStyle = .bullseye
    var bar: PaperBar? = nil
    var rules: [Double] = []
    var ruleX0: Double = 0.3
    var ruleX1: Double = 1
    var ruleInk: Color = .clear
    var ruleWidth: Double = 0.008

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack(alignment: .topLeading) {
                if !rules.isEmpty {
                    PaperLines(ys: rules, x0: ruleX0, x1: ruleX1).stroke(ruleInk, lineWidth: max(0.6, s * ruleWidth))
                }
                ForEach(Array(zip(colours, rows).enumerated()), id: \.offset) { _, row in
                    PaperReminderMarker(colour: row.0, outer: s * outer, ring: s * ring, disc: s * disc, style: style)
                        .position(x: s * markerX, y: s * row.1)
                    if let bar {
                        Capsule().fill(bar.ink)
                            .frame(width: s * (bar.x1 - bar.x0), height: s * bar.height)
                            .position(x: s * (bar.x0 + bar.x1) / 2, y: s * row.1)
                    }
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The iOS 5-6 Reminders: a stitched leather frame round a white ticked list.
private struct PaperReminderCard: View {
    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack {
                RoundedRectangle(cornerRadius: s * 0.13, style: .continuous)
                    .strokeBorder(hex(0x8A8A8A, 0.6), style: StrokeStyle(lineWidth: max(0.6, s * 0.006), dash: [s * 0.02, s * 0.014]))
                    .padding(s * 0.035)
                RoundedRectangle(cornerRadius: s * 0.03, style: .continuous)
                    .fill(hex(0xF4F3F3))
                    .padding(s * 0.075)
                    .shadow(color: .black.opacity(0.6), radius: s * 0.012, y: s * 0.006)
                PaperLines(ys: [0.38, 0.62], x0: 0.075, x1: 0.925).stroke(hex(0xC8C8C8), lineWidth: max(0.6, s * 0.01))
                PaperLines(xs: [0.395, 0.425], y0: 0.075, y1: 0.925).stroke(hex(0xE57373), lineWidth: max(0.5, s * 0.008))
                ForEach(Array([(0.23, 0.82), (0.50, 0.72), (0.77, 0.82)].enumerated()), id: \.offset) { _, row in
                    Image(systemName: "checkmark")
                        .font(.system(size: s * 0.13, weight: .heavy))
                        .foregroundStyle(hex(0x1A1A1A))
                        .position(x: s * 0.245, y: s * row.0)
                    RoundedRectangle(cornerRadius: s * 0.008).fill(hex(0xB1B1B1))
                        .frame(width: s * (row.1 - 0.50), height: s * 0.05)
                        .position(x: s * (0.50 + row.1) / 2, y: s * row.0)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: Settings

private enum PaperHub { case dark, silver, brushed }

/// Everything that differs between the three skeuomorphic Settings icons.
private struct PaperGearPlateStyle {
    var dots: Color
    var dotPitch: Double
    var dotSize: Double
    var stagger: Bool
    var silver: [Color]
    var rim: Color
    var profile: PaperGearShape.Profile
    var teeth: Int
    var depth: Double
    /// The big wheel's centre and tooth-tip radius, in shares of the icon.
    var x: Double
    var y: Double
    var radius: Double
    /// The cut-out windows' outer radius as a share of the tip radius.
    var window: Double
    /// Spoke angles in degrees, clockwise from 3 o'clock.
    var spokes: [Double]
    var spokeWidth: Double
    var hub: PaperHub
    var hubRadius: Double
    /// The two small gears at the foot: centres and tip radius.
    var smalls: [(Double, Double)]
    var smallRadius: Double
    var smallFace: [Color]
    var frame: [Color]
    var frameWidth: Double

    /// iPhone OS 1-3, measured from the 57 px asset. Three spokes show, at 1, 3 and
    /// 10:30 o'clock; nothing crosses the window below the hub.
    static let os1 = PaperGearPlateStyle(
        dots: hex(0x1E1E20, 0.8), dotPitch: 0.042, dotSize: 0.022, stagger: false,
        silver: [hex(0xF7F8F9), hex(0xC6C7C9), hex(0x8C8D90)], rim: hex(0x2A2A2C),
        profile: .pointed, teeth: 22, depth: 0.20, x: 0.49, y: 0.64, radius: 0.45, window: 0.66,
        spokes: [-74, 0, -138], spokeWidth: 0.032, hub: .dark, hubRadius: 0.175,
        smalls: [(0.13, 0.975), (0.84, 0.975)], smallRadius: 0.28, smallFace: [hex(0xB8B9BB), hex(0x88898B)],
        frame: [hex(0xF2F4F8), hex(0xB6B9BE), hex(0x8A8B8E)], frameWidth: 0.05)

    /// iOS 4-5, measured from the 114 px asset.
    static let ios4 = PaperGearPlateStyle(
        dots: hex(0x2E2E30, 0.9), dotPitch: 0.036, dotSize: 0.02, stagger: false,
        silver: [hex(0xFAFAFA), hex(0xCDCDCF), hex(0x929294)], rim: hex(0x3A3A3C),
        profile: .pointed, teeth: 20, depth: 0.25, x: 0.49, y: 0.65, radius: 0.46, window: 0.65,
        spokes: [-74, 2, -144], spokeWidth: 0.030, hub: .silver, hubRadius: 0.17,
        smalls: [(0.10, 0.975), (0.87, 0.975)], smallRadius: 0.28, smallFace: [hex(0xC4C4C6), hex(0x8E8E90)],
        frame: [hex(0xF6F6F6), hex(0xC8C8CA), hex(0x9A9A9C)], frameWidth: 0.038)

    /// iOS 6: rounded teeth, the wheel raised, a brushed hub, a diamond grid of bold holes.
    static let ios6 = PaperGearPlateStyle(
        dots: hex(0x0E0E0E), dotPitch: 0.05, dotSize: 0.028, stagger: true,
        silver: [hex(0xF4F4F4), hex(0xC0C0C1), hex(0x7E7E80)], rim: hex(0x262627),
        profile: .rounded, teeth: 22, depth: 0.17, x: 0.49, y: 0.555, radius: 0.42, window: 0.71,
        spokes: [-64, 6, 152, -150], spokeWidth: 0.034, hub: .brushed, hubRadius: 0.15,
        smalls: [(0.10, 0.975), (0.88, 0.975)], smallRadius: 0.27, smallFace: [hex(0xBDBDBE), hex(0x8A8A8B)],
        frame: [hex(0xE6E6E7), hex(0xC4C4C5), hex(0x8E8E8F)], frameWidth: 0.045)
}

/// A silver hub: a dark disc with a light boss (2007), a raised silver cap
/// (2010), or a brushed disc (iOS 6).
private struct PaperGearHub: View {
    var hub: PaperHub
    var diameter: CGFloat
    var rim: Color

    var body: some View {
        ZStack {
            switch hub {
            case .dark:
                Circle().fill(LinearGradient(colors: [hex(0x9C9C9E), hex(0x5A5A5C), hex(0x3A3A3C)], startPoint: .top, endPoint: .bottom))
                Circle().strokeBorder(rim, lineWidth: max(0.5, diameter * 0.03))
                Ellipse().fill(hex(0xD8D8DA)).frame(width: diameter * 0.32, height: diameter * 0.20)
                Ellipse().fill(hex(0x5A5A5C)).frame(width: diameter * 0.14, height: diameter * 0.08)
            case .silver:
                Circle().fill(LinearGradient(colors: [hex(0xEDEDEE), hex(0x9C9C9E), hex(0x6E6E70)], startPoint: .top, endPoint: .bottom))
                Circle().strokeBorder(rim, lineWidth: max(0.5, diameter * 0.03))
                Circle().strokeBorder(.black.opacity(0.25), lineWidth: max(0.5, diameter * 0.03)).padding(diameter * 0.22)
                Circle().fill(LinearGradient(colors: [hex(0xF4F4F4), hex(0x8A8A8C)], startPoint: .top, endPoint: .bottom))
                    .frame(width: diameter * 0.22, height: diameter * 0.22)
                Circle().fill(hex(0x3A3A3C)).frame(width: diameter * 0.08, height: diameter * 0.08)
            case .brushed:
                Circle().fill(AngularGradient(colors: [hex(0xF2F2F2), hex(0x9E9E9E), hex(0xE8E8E8), hex(0x8C8C8C), hex(0xF2F2F2)], center: .center))
                Circle().strokeBorder(rim, lineWidth: max(0.5, diameter * 0.03))
                Circle().fill(hex(0xDADADA)).frame(width: diameter * 0.26, height: diameter * 0.26)
                Circle().fill(hex(0x4A4A4C)).frame(width: diameter * 0.10, height: diameter * 0.10)
            }
        }
        .frame(width: diameter, height: diameter)
    }
}

/// The 2007-2012 Settings: a big silver wheel whose windows show the
/// perforated plate, two small gears at the foot, a chrome bevel frame.
private struct PaperGearPlate: View {
    var style: PaperGearPlateStyle

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let st = style
            let metal = LinearGradient(colors: st.silver, startPoint: .top, endPoint: .bottom)
            let wheel = s * st.radius * 2
            ZStack {
                PaperDotLines(pitch: st.dotPitch, inset: 0.05, stagger: st.stagger)
                    .stroke(st.dots, style: StrokeStyle(lineWidth: s * st.dotSize, lineCap: .round, dash: [0, s * st.dotPitch]))
                ZStack {
                    PaperGearShape(teeth: st.teeth, depth: st.depth, profile: st.profile, hole: st.window)
                        .fill(metal, style: FillStyle(eoFill: true))
                    PaperGearShape(teeth: st.teeth, depth: st.depth, profile: st.profile, hole: st.window)
                        .stroke(st.rim, lineWidth: max(0.5, s * 0.007))
                    // Thin flat bars, square-ended, run from under the hub into the rim. One path
                    // filled with the wheel's own gradient, so each spoke is the rim's silver where it meets it.
                    PaperSpokes(angles: st.spokes, reach: st.window + 0.06, thickness: st.spokeWidth / (st.radius * 2))
                        .fill(metal)
                    PaperGearHub(hub: st.hub, diameter: s * st.hubRadius * 2, rim: st.rim)
                }
                .frame(width: wheel, height: wheel)
                .position(x: s * st.x, y: s * st.y)
                ForEach(Array(st.smalls.enumerated()), id: \.offset) { _, spot in
                    ZStack {
                        PaperGearShape(teeth: 12, depth: 0.34, profile: st.profile).fill(metal)
                        PaperGearShape(teeth: 12, depth: 0.34, profile: st.profile).stroke(st.rim, lineWidth: max(0.5, s * 0.007))
                        Circle().fill(LinearGradient(colors: st.smallFace, startPoint: .top, endPoint: .bottom))
                            .padding(s * st.smallRadius * 0.50)
                    }
                    .frame(width: s * st.smallRadius * 2, height: s * st.smallRadius * 2)
                    .position(x: s * spot.0, y: s * spot.1)
                }
                RoundedRectangle(cornerRadius: s * 0.175)
                    .strokeBorder(LinearGradient(colors: st.frame, startPoint: .top, endPoint: .bottom), lineWidth: s * st.frameWidth)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The iOS 7-18 Settings, measured: a dark disc; inside it a toothed ring cut
/// through to the background, a window band, a lighter toothed ring, and a
/// dark centre crossed by three spokes (right, lower left, upper left) that
/// bridge the windows out to the outer ring.
private struct PaperNestedGear: View {
    var dark: Color
    var inner: Color
    var top: Color
    var bottom: Color
    var scale: Double

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height) * scale
            let backdrop = LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom)
            ZStack {
                Circle().fill(dark).frame(width: s * 0.87, height: s * 0.87)
                // The outer ring shows the tile through it: body r 0.305-0.36, teeth to 0.40.
                PaperGearShape(teeth: 56, depth: 0.10, profile: .square, hole: 0.76, extent: 0.80 * scale)
                    .fill(backdrop, style: FillStyle(eoFill: true))
                // The inner ring: body r 0.19-0.235, teeth to 0.26.
                PaperGearShape(teeth: 48, depth: 0.10, profile: .square, hole: 0.73)
                    .fill(inner, style: FillStyle(eoFill: true))
                    .frame(width: s * 0.52, height: s * 0.52)
                ForEach(0..<3, id: \.self) { index in
                    ZStack {
                        Capsule().fill(inner)
                            .frame(width: s * 0.33, height: s * 0.037)
                            .offset(x: s * 0.165)
                        Capsule().fill(inner)
                            .frame(width: s * 0.11, height: s * 0.056)
                            .offset(x: s * 0.265)
                    }
                    .rotationEffect(.degrees(Double(index) * 120))
                }
                Circle().fill(inner).frame(width: s * 0.065, height: s * 0.065)
                Circle().fill(dark).frame(width: s * 0.024, height: s * 0.024)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The iOS 26-27 Settings: a white glass gear (36 rounded teeth, a thin
/// rim, three spokes, a hub) over a smaller grey gear seen through its windows.
private struct PaperGlassGears: View {
    var frontAlpha: Double
    var back: Color
    /// The back gear's tip radius and hole (share of its diameter).
    var backRadius: Double
    var backHole: Double
    var backTeeth: Int
    /// The front ring's hole as a share of its 0.80 diameter.
    var ringHole: Double
    var spokeWidth: Double
    var hubRadius: Double
    var hole: Color

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let glass = LinearGradient(colors: [.white, hex(0xF1F1F4), hex(0xDCDCE0)], startPoint: .topLeading, endPoint: .bottomTrailing)
            ZStack {
                PaperGearShape(teeth: backTeeth, depth: 0.22, profile: .rounded, hole: backHole)
                    .fill(back, style: FillStyle(eoFill: true))
                    .frame(width: s * backRadius * 2, height: s * backRadius * 2)
                    .offset(x: -s * 0.015, y: s * 0.005)
                ZStack {
                    PaperGearShape(teeth: 36, depth: 0.15, profile: .rounded, hole: ringHole)
                        .fill(glass, style: FillStyle(eoFill: true))
                        .frame(width: s * 0.80, height: s * 0.80)
                    ForEach(0..<3, id: \.self) { index in
                        Capsule().fill(glass)
                            .frame(width: s * 0.32, height: s * spokeWidth)
                            .offset(x: s * 0.16)
                            .rotationEffect(.degrees(Double(index) * 120))
                    }
                    Circle().fill(glass).frame(width: s * hubRadius * 2, height: s * hubRadius * 2)
                    Circle().fill(hole).frame(width: s * 0.03, height: s * 0.03)
                }
                .compositingGroup()
                .opacity(frontAlpha)
                .shadow(color: .black.opacity(0.28), radius: s * 0.02, y: s * 0.02)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: Calculator

private enum PaperSign { case plus, minus, times, equals }

/// An arithmetic sign as one path of round-ended bars, so crossing strokes
/// fill once and stay clean when the whole icon is faded.
private struct PaperSignShape: Shape {
    var sign: PaperSign
    /// Stroke as a share of the frame's side.
    var stroke: Double

    func path(in rect: CGRect) -> Path {
        let size = min(rect.width, rect.height)
        let t = size * stroke
        let c = CGPoint(x: rect.midX, y: rect.midY)
        var path = Path()
        func bar(_ w: CGFloat, _ h: CGFloat, dy: CGFloat = 0, angle: Double = 0) {
            let box = CGRect(x: c.x - w / 2, y: c.y - h / 2 + dy, width: w, height: h)
            let piece = Path(roundedRect: box, cornerRadius: min(w, h) / 2)
            let turn = CGAffineTransform(translationX: c.x, y: c.y).rotated(by: angle).translatedBy(x: -c.x, y: -c.y)
            path.addPath(angle == 0 ? piece : piece.applying(turn))
        }
        switch sign {
        case .plus:
            bar(size, t)
            bar(t, size)
        case .minus:
            bar(size, t)
        case .times:
            bar(size * 0.9, t, angle: .pi / 4)
            bar(size * 0.9, t, angle: -.pi / 4)
        case .equals:
            let step = (size * 0.30 + t) / 2
            bar(size, t, dy: -step)
            bar(size, t, dy: step)
        }
        return path
    }
}

/// An arithmetic sign of a given size and stroke.
private struct PaperSignView: View {
    var sign: PaperSign
    var size: CGFloat
    var stroke: CGFloat
    var ink: Color

    var body: some View {
        PaperSignShape(sign: sign, stroke: size > 0 ? stroke / size : 0)
            .fill(ink)
            .frame(width: size, height: size)
    }
}

/// The 2007-2009 Calculator: four glossy keys on black leather in a silver bevel.
private struct PaperCalcKeys: View {
    var round: Bool
    var key: [Color]
    var accent: [Color]
    var frame: [Color]

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let keys: [(Double, Double, PaperSign)] = [(0.30, 0.30, .plus), (0.70, 0.30, .minus), (0.30, 0.70, .times), (0.70, 0.70, .equals)]
            ZStack {
                ForEach(Array(keys.enumerated()), id: \.offset) { index, key in
                    let colours = index == 3 ? accent : self.key
                    ZStack {
                        if round {
                            Circle().fill(LinearGradient(colors: colours, startPoint: .top, endPoint: .bottom))
                            Circle().strokeBorder(.black.opacity(0.35), lineWidth: max(0.5, s * 0.006))
                        } else {
                            RoundedRectangle(cornerRadius: s * 0.085, style: .continuous)
                                .fill(LinearGradient(colors: colours, startPoint: .top, endPoint: .bottom))
                            RoundedRectangle(cornerRadius: s * 0.085, style: .continuous)
                                .strokeBorder(.black.opacity(0.35), lineWidth: max(0.5, s * 0.006))
                        }
                        Ellipse().fill(.white.opacity(0.22))
                            .frame(width: s * 0.26, height: s * 0.13)
                            .offset(y: -s * 0.085)
                        PaperSignView(sign: key.2, size: s * 0.16, stroke: s * 0.035, ink: .white)
                            .shadow(color: .black.opacity(0.45), radius: 0, y: s * 0.008)
                    }
                    .frame(width: s * 0.34, height: s * 0.34)
                    .position(x: s * key.0, y: s * key.1)
                }
                RoundedRectangle(cornerRadius: s * 0.175)
                    .strokeBorder(LinearGradient(colors: frame, startPoint: .top, endPoint: .bottom), lineWidth: s * 0.032)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The 2010-2016 Calculator: four full-bleed quadrants split by a cross of
/// seams. A clear quadrant lets the tile's own gradient through, so the
/// iOS 4 taupe shades once from top to foot as the real one does.
private struct PaperQuadrants: View {
    /// Top left, top right, bottom left, bottom right; one colour is flat, two a gradient.
    var fills: [[Color]]
    var seam: Color
    var inks: [Color]
    var signSize: Double
    var stroke: Double
    var embossed: Bool

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let signs: [PaperSign] = [.plus, .minus, .times, .equals]
            ZStack {
                VStack(spacing: 0) {
                    HStack(spacing: 0) { tint(0); tint(1) }
                    HStack(spacing: 0) { tint(2); tint(3) }
                }
                PaperLines(ys: [0.5], xs: [0.5]).stroke(seam, lineWidth: max(0.8, s * 0.014))
                ForEach(0..<4, id: \.self) { index in
                    PaperSignView(sign: signs[index], size: s * signSize, stroke: s * stroke, ink: inks[index])
                        .shadow(color: .black.opacity(embossed ? 0.55 : 0), radius: embossed ? s * 0.006 : 0, y: s * 0.008)
                        .position(x: s * (index % 2 == 0 ? 0.25 : 0.75), y: s * (index < 2 ? 0.26 : 0.75))
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }

    private func tint(_ index: Int) -> some View {
        let colours = fills[index]
        return LinearGradient(colors: colours.count > 1 ? colours : [colours[0], colours[0]], startPoint: .top, endPoint: .bottom)
    }
}

/// Where the parts of the drawn calculator sit, in shares of the icon.
private struct PaperCalcLayout {
    var bodyWidth: Double
    var bodyHeight: Double
    var bodyRadius: Double
    var displayWidth: Double
    var displayHeight: Double
    var displayY: Double
    var columns: [Double]
    var rows: [Double]
    var key: Double

    /// iOS 11-18, measured from the 256 px asset.
    static let flat = PaperCalcLayout(bodyWidth: 0.52, bodyHeight: 0.76, bodyRadius: 0.08, displayWidth: 0.42, displayHeight: 0.17,
                                      displayY: 0.255, columns: [0.34, 0.50, 0.66], rows: [0.46, 0.61, 0.76], key: 0.11)
    /// iOS 26.
    static let glass = PaperCalcLayout(bodyWidth: 0.50, bodyHeight: 0.75, bodyRadius: 0.075, displayWidth: 0.40, displayHeight: 0.15,
                                       displayY: 0.255, columns: [0.35, 0.50, 0.65], rows: [0.48, 0.61, 0.74], key: 0.095)
    /// iOS 27.
    static let glass27 = PaperCalcLayout(bodyWidth: 0.50, bodyHeight: 0.75, bodyRadius: 0.075, displayWidth: 0.40, displayHeight: 0.16,
                                         displayY: 0.255, columns: [0.35, 0.50, 0.65], rows: [0.47, 0.61, 0.75], key: 0.10)
}

/// The iOS 11-27 Calculator: a whole calculator drawn flat, glassy from iOS 26.
private struct PaperFlatCalculator: View {
    var shell: [Color]
    var display: [Color]
    var key: [Color]
    var accent: Color
    var layout: PaperCalcLayout
    var mergedBottom: Bool
    /// A lighter edge round the body, for the glass years.
    var rim: Color?

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let l = layout
            let glassy = rim != nil
            ZStack {
                RoundedRectangle(cornerRadius: s * l.bodyRadius, style: .continuous)
                    .fill(gradient(shell))
                    .frame(width: s * l.bodyWidth, height: s * l.bodyHeight)
                    .shadow(color: .black.opacity(glassy ? 0.30 : 0), radius: s * 0.02, y: s * 0.02)
                if let rim {
                    RoundedRectangle(cornerRadius: s * l.bodyRadius, style: .continuous)
                        .strokeBorder(LinearGradient(colors: [rim, rim.opacity(0.35)], startPoint: .top, endPoint: .bottom),
                                      lineWidth: max(0.6, s * 0.012))
                        .frame(width: s * l.bodyWidth, height: s * l.bodyHeight)
                }
                RoundedRectangle(cornerRadius: s * 0.025, style: .continuous)
                    .fill(gradient(display))
                    .frame(width: s * l.displayWidth, height: s * l.displayHeight)
                    .position(x: s * 0.5, y: s * l.displayY)
                ForEach(0..<3, id: \.self) { row in
                    ForEach(0..<3, id: \.self) { column in
                        let merged = mergedBottom && row == 2 && column < 2
                        if !(merged && column == 1) {
                            let width = merged ? l.columns[1] - l.columns[0] + l.key : l.key
                            let x = merged ? (l.columns[0] + l.columns[1]) / 2 : l.columns[column]
                            Capsule().fill(column == 2 ? gradient([accent]) : gradient(key))
                                .frame(width: s * width, height: s * l.key)
                                .position(x: s * x, y: s * l.rows[row])
                        }
                    }
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }

    private func gradient(_ colours: [Color]) -> LinearGradient {
        LinearGradient(colors: colours.count > 1 ? colours : [colours[0], colours[0]], startPoint: .top, endPoint: .bottom)
    }
}

// MARK: Stocks

/// The 2007-2012 Stocks: a white chart line over graph-paper blue.
private struct PaperStocksSky: View {
    var sky: [Color]
    var line: [(Double, Double)]
    var verticals: [Double]
    var months: Bool
    var lineWidth: Double

    /// iPhone OS 1-2, measured from the 57 px asset.
    static let os1: [(Double, Double)] = [(0, 0.56), (0.07, 0.55), (0.12, 0.47), (0.20, 0.42), (0.27, 0.48), (0.33, 0.45), (0.40, 0.52),
                                          (0.47, 0.53), (0.53, 0.45), (0.60, 0.33), (0.65, 0.39), (0.70, 0.45), (0.76, 0.41),
                                          (0.82, 0.52), (0.88, 0.48), (0.95, 0.40), (1.0, 0.38)]
    /// iPhone OS 3 to iOS 6, measured from the 114 px asset.
    static let os3: [(Double, Double)] = [(0, 0.62), (0.08, 0.60), (0.13, 0.55), (0.20, 0.50), (0.26, 0.57), (0.30, 0.55), (0.37, 0.40),
                                          (0.44, 0.62), (0.50, 0.66), (0.58, 0.52), (0.63, 0.47), (0.70, 0.27), (0.76, 0.44),
                                          (0.80, 0.38), (0.86, 0.50), (0.91, 0.52), (1.0, 0.42)]

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                LinearGradient(colors: sky, startPoint: .top, endPoint: .bottom)
                PaperLines(ys: [0.47, 0.51, 0.55, 0.59, 0.63, 0.67, 0.71, 0.75, 0.79, 0.83, 0.87, 0.91, 0.95, 0.99])
                    .stroke(.white.opacity(0.30), lineWidth: max(0.5, s * 0.007))
                PaperLines(xs: verticals)
                    .stroke(.white.opacity(0.40), lineWidth: max(0.5, s * 0.009))
                if months {
                    ZStack {
                        hex(0x8EE7FF, 0.85)
                        ForEach(Array([("Jul", 0.10), ("Aug", 0.50), ("Sep", 0.90)].enumerated()), id: \.offset) { _, month in
                            Text(month.0)
                                .font(.system(size: s * 0.11, weight: .bold))
                                .foregroundStyle(.white)
                                .fixedSize()
                                .position(x: s * month.1, y: s * 0.09)
                        }
                    }
                    .frame(height: s * 0.18)
                    .offset(y: s * 0.82)
                }
                PaperPolyline(points: line)
                    .stroke(.white, style: StrokeStyle(lineWidth: s * lineWidth, lineCap: .round, lineJoin: .round))
                    .shadow(color: .black.opacity(0.35), radius: 0, y: s * 0.01)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The iOS 7-27 Stocks: a chart line on dark with the area beneath it a
/// shade lighter, a cursor bar and a marker on the peak.
private struct PaperStocksChart: View {
    var grid: [Double]
    var gridInk: Color
    var gridWidth: Double
    var points: [(Double, Double)]
    /// White alpha of the area under the line, just below it.
    var fill: Double
    var lineWidth: Double
    var lineInk: Color
    var barX: Double
    var barWidth: Double
    var barInk: Color
    var peakY: Double
    var marker: Double
    var markerInk: Color
    var ring: Bool = false
    var glass: Bool = false

    static let ios7: [(Double, Double)] = [(0, 0.57), (0.10, 0.61), (0.18, 0.59), (0.25, 0.52), (0.30, 0.55), (0.37, 0.41),
                                           (0.44, 0.58), (0.50, 0.61), (0.57, 0.50), (0.62, 0.49), (0.69, 0.33), (0.75, 0.45),
                                           (0.80, 0.42), (0.87, 0.53), (0.93, 0.40), (1.0, 0.33)]
    /// iOS 11-17, traced from the 256 px asset.
    static let ios11: [(Double, Double)] = [(0, 0.545), (0.08, 0.568), (0.16, 0.607), (0.20, 0.592), (0.24, 0.564), (0.28, 0.525),
                                            (0.32, 0.564), (0.34, 0.555), (0.38, 0.447), (0.40, 0.461), (0.44, 0.578), (0.50, 0.625),
                                            (0.54, 0.555), (0.60, 0.512), (0.62, 0.473), (0.656, 0.345), (0.70, 0.408), (0.72, 0.467),
                                            (0.78, 0.453), (0.82, 0.549), (0.84, 0.559), (0.88, 0.449), (0.94, 0.385), (1.0, 0.344)]
    /// iOS 18, traced from the 256 px asset: the line re-jigged, the cursor further left.
    static let ios18: [(Double, Double)] = [(0, 0.559), (0.07, 0.59), (0.12, 0.564), (0.18, 0.504), (0.20, 0.502), (0.24, 0.539),
                                            (0.26, 0.518), (0.30, 0.445), (0.34, 0.566), (0.39, 0.632), (0.44, 0.57), (0.48, 0.527),
                                            (0.52, 0.514), (0.56, 0.434), (0.594, 0.36), (0.62, 0.395), (0.66, 0.459), (0.74, 0.426),
                                            (0.76, 0.451), (0.80, 0.545), (0.84, 0.449), (0.88, 0.387), (0.94, 0.34), (1.0, 0.314)]
    static let ios26: [(Double, Double)] = [(0, 0.654), (0.10, 0.648), (0.15, 0.594), (0.20, 0.576), (0.25, 0.59), (0.30, 0.52),
                                            (0.35, 0.57), (0.40, 0.656), (0.50, 0.514), (0.55, 0.46), (0.604, 0.35), (0.65, 0.42),
                                            (0.70, 0.477), (0.75, 0.436), (0.80, 0.518), (0.85, 0.527), (0.90, 0.406), (1.0, 0.346)]

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            ZStack {
                PaperPolyline(points: points, closedToFoot: true)
                    .fill(LinearGradient(colors: [.white.opacity(fill), .white.opacity(fill * 0.3)],
                                         startPoint: UnitPoint(x: 0.5, y: 0.4), endPoint: .bottom))
                PaperLines(xs: grid).stroke(gridInk, lineWidth: max(0.5, s * gridWidth))
                Rectangle().fill(barInk)
                    .frame(width: max(0.8, s * barWidth), height: s)
                    .position(x: s * barX, y: s / 2)
                PaperPolyline(points: points)
                    .stroke(lineInk, style: StrokeStyle(lineWidth: s * lineWidth, lineCap: .round, lineJoin: .round))
                    .shadow(color: .black.opacity(glass ? 0.5 : 0), radius: s * 0.012, y: s * 0.014)
                if ring {
                    Circle().fill(hex(0x2E8C9C))
                        .frame(width: s * marker, height: s * marker)
                        .shadow(color: .black.opacity(0.45), radius: s * 0.012, y: s * 0.012)
                        .position(x: s * barX, y: s * peakY)
                    Circle().strokeBorder(markerInk.opacity(0.55), lineWidth: s * marker * 0.12)
                        .frame(width: s * marker, height: s * marker)
                        .position(x: s * barX, y: s * peakY)
                    Circle().fill(markerInk)
                        .frame(width: s * marker * 0.62, height: s * marker * 0.62)
                        .position(x: s * barX, y: s * peakY)
                } else {
                    if glass {
                        Circle().fill(markerInk.opacity(0.32)).frame(width: s * marker * 1.6, height: s * marker * 1.6)
                            .position(x: s * barX, y: s * peakY)
                    }
                    Circle().fill(markerInk).frame(width: s * marker, height: s * marker)
                        .shadow(color: .black.opacity(glass ? 0.4 : 0), radius: s * 0.01, y: s * 0.01)
                        .position(x: s * barX, y: s * peakY)
                    if glass {
                        Circle().fill(.white.opacity(0.8)).frame(width: s * marker * 0.28, height: s * marker * 0.28)
                            .position(x: s * (barX - marker * 0.2), y: s * (peakY - marker * 0.22))
                    }
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: Compass

/// The 2009-2012 Compass: a brass-hubbed rose on a cream dial in a silver bezel, over dark wood.
private struct PaperBrassCompass: View {
    var retina: Bool

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let split = LinearGradient(colors: [.white, hex(0x2B2B2B)], startPoint: .leading, endPoint: .trailing)
            let dial = retina ? 0.84 : 0.92
            ZStack {
                PaperLines(xs: [0.06, 0.13, 0.25, 0.34, 0.50, 0.61, 0.75, 0.86, 0.94])
                    .stroke(.black.opacity(0.22), lineWidth: max(0.5, s * 0.014))
                Circle().fill(LinearGradient(colors: [hex(0xF6F6F6), hex(0x8A8A8A)], startPoint: .top, endPoint: .bottom))
                    .frame(width: s * dial, height: s * dial)
                    .shadow(color: .black.opacity(0.5), radius: s * 0.015, y: s * 0.015)
                Circle().fill(RadialGradient(colors: [hex(0xFFFBF4), hex(0xF1DCC6)], center: .center, startRadius: 0, endRadius: s * 0.40))
                    .frame(width: s * (dial - 0.06), height: s * (dial - 0.06))
                Circle().strokeBorder(hex(0x6A5A4A, 0.8), lineWidth: max(0.5, s * 0.006))
                    .frame(width: s * (dial - 0.11), height: s * (dial - 0.11))
                PaperTicks(count: 72, r0: (dial - 0.20) / 2, r1: (dial - 0.12) / 2)
                    .stroke(hex(0x3C3C3C), lineWidth: max(0.4, s * 0.007))
                Circle().strokeBorder(hex(0x6A5A4A, 0.8), lineWidth: max(0.5, s * 0.006))
                    .frame(width: s * (dial - 0.20), height: s * (dial - 0.20))
                NeedleShape().fill(split).frame(width: s * 0.06, height: s * 0.40).rotationEffect(.degrees(45))
                NeedleShape().fill(split).frame(width: s * 0.06, height: s * 0.40).rotationEffect(.degrees(135))
                NeedleShape().fill(split).frame(width: s * 0.075, height: s * 0.56)
                NeedleShape().fill(split).frame(width: s * 0.075, height: s * 0.56).rotationEffect(.degrees(90))
                Circle().fill(RadialGradient(colors: [hex(0xF4DCA0), hex(0x7A5322)], center: UnitPoint(x: 0.4, y: 0.35),
                                             startRadius: 0, endRadius: s * 0.07))
                    .frame(width: s * 0.13, height: s * 0.13)
                Circle().fill(hex(0x2A1A0A)).frame(width: s * 0.035, height: s * 0.035)
                Text("E").font(.system(size: s * 0.085, weight: .bold, design: .serif)).foregroundStyle(hex(0x2A1E14))
                    .rotationEffect(.degrees(90)).position(x: s * 0.77, y: s * 0.5)
                Text("W").font(.system(size: s * 0.085, weight: .bold, design: .serif)).foregroundStyle(hex(0x2A1E14))
                    .rotationEffect(.degrees(-90)).position(x: s * 0.23, y: s * 0.5)
                Text("S").font(.system(size: s * 0.085, weight: .bold, design: .serif)).foregroundStyle(hex(0x2A1E14))
                    .position(x: s * 0.5, y: s * 0.765)
                PaperTriangle().fill(retina ? hex(0xC81417) : hex(0xB8141A))
                    .frame(width: s * 0.15, height: s * 0.12)
                    .position(x: s * 0.5, y: s * (retina ? 0.24 : 0.20))
                Text("N").font(.system(size: s * 0.065, weight: .bold, design: .serif)).foregroundStyle(.white)
                    .position(x: s * 0.5, y: s * (retina ? 0.26 : 0.22))
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// Where the flat compass's parts sit, measured per generation.
private struct PaperDialLayout {
    /// Tick band, radii as shares of the icon.
    var tickIn: Double
    var tickOut: Double
    var majorWidth: Double
    var minorWidth: Double
    /// Centres of W N S E (upper left, upper right, lower left, lower right) as offsets from the middle.
    var letterX: Double
    var letterY: Double
    var crossReach: Double
    var crossWidth: Double

    static let ios7 = PaperDialLayout(tickIn: 0.38, tickOut: 0.43, majorWidth: 0.014, minorWidth: 0.008,
                                      letterX: 0.19, letterY: 0.19, crossReach: 0.18, crossWidth: 0.008)
    static let ios11 = PaperDialLayout(tickIn: 0.365, tickOut: 0.44, majorWidth: 0.015, minorWidth: 0.010,
                                       letterX: 0.19, letterY: 0.19, crossReach: 0.18, crossWidth: 0.011)
    static let ios26 = PaperDialLayout(tickIn: 0.34, tickOut: 0.40, majorWidth: 0.016, minorWidth: 0.011,
                                       letterX: 0.10, letterY: 0.13, crossReach: 0.25, crossWidth: 0.012)
    static let ios27 = PaperDialLayout(tickIn: 0.30, tickOut: 0.36, majorWidth: 0.015, minorWidth: 0.010,
                                       letterX: 0.10, letterY: 0.125, crossReach: 0.24, crossWidth: 0.011)
}

/// The iOS 7-27 Compass: 48 ticks (white majors every 30 degrees, aligned
/// on north), W N S E on the diagonals round a crosshair, an optional disc,
/// and the red heading marker in the top right corner.
private struct PaperDialCompass: View {
    var dial: PaperDialLayout
    var majorInk: Color
    var minorInk: Color
    var letters: Color
    var letterFont: (CGFloat) -> Font
    var disc: Color?
    var cross: Color
    var marker: Color
    var glass: Bool = false
    /// iOS 27: the dial is a raised glass disc with a bright rim.
    var bezel: Bool = false

    var body: some View {
        GeometryReader { geo in
            let s = min(geo.size.width, geo.size.height)
            let d = dial
            let spots: [(String, Double, Double)] = [("W", -d.letterX, -d.letterY), ("N", d.letterX, -d.letterY),
                                                     ("S", -d.letterX, d.letterY), ("E", d.letterX, d.letterY)]
            ZStack {
                if bezel {
                    Circle().fill(LinearGradient(colors: [hex(0x262626), hex(0x151515)], startPoint: .top, endPoint: .bottom))
                        .frame(width: s * 0.84, height: s * 0.84)
                        .shadow(color: .black.opacity(0.5), radius: s * 0.02, y: s * 0.015)
                    Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.75), .white.opacity(0.18), .white.opacity(0.5)],
                                                         startPoint: .top, endPoint: .bottom),
                                          lineWidth: max(0.6, s * 0.009))
                        .frame(width: s * 0.84, height: s * 0.84)
                }
                if let disc {
                    Circle().fill(disc).frame(width: s * 0.36, height: s * 0.36)
                }
                // The majors sit at 15 + 30k degrees from 12 o'clock: every fourth of the 48, from the second.
                PaperTicks(count: 48, r0: d.tickIn, r1: d.tickOut, every: 4, phase: 2, only: false)
                    .stroke(minorInk, style: StrokeStyle(lineWidth: max(0.5, s * d.minorWidth), lineCap: .round))
                PaperTicks(count: 48, r0: d.tickIn, r1: d.tickOut, every: 4, phase: 2, only: true)
                    .stroke(majorInk, style: StrokeStyle(lineWidth: max(0.6, s * d.majorWidth), lineCap: .round))
                Rectangle().fill(cross).frame(width: max(0.6, s * d.crossWidth), height: s * d.crossReach * 2)
                Rectangle().fill(cross).frame(width: s * d.crossReach * 2, height: max(0.6, s * d.crossWidth))
                ForEach(Array(spots.enumerated()), id: \.offset) { _, spot in
                    Text(spot.0)
                        .font(letterFont(s))
                        .foregroundStyle(letters)
                        .fixedSize()
                        .shadow(color: .black.opacity(glass ? 0.5 : 0), radius: s * 0.01, y: s * 0.012)
                        .position(x: s * (0.5 + spot.1), y: s * (0.5 + spot.2))
                }
                PaperTriangle().fill(marker)
                    .frame(width: s * 0.085, height: s * 0.08)
                    .rotationEffect(.degrees(225))
                    .shadow(color: .black.opacity(glass ? 0.45 : 0), radius: s * 0.01, y: s * 0.01)
                    .position(x: s * 0.85, y: s * 0.148)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

// MARK: - Soft gloss and spokes

/// The pre-2013 shine's outline: the top of the icon cut off by a shallow
/// downward arc, as the system draws it.
private struct PaperGlossShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.40))
        path.addQuadCurve(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.40),
                          control: CGPoint(x: rect.midX, y: rect.minY + rect.height * 0.62))
        path.closeSubpath()
        return path
    }
}

/// A glossy-era design under a fainter shine than the system's. The system
/// lays white 62%→16% over every pre-2013 icon, about half white across a
/// Calendar header or Notes binding, and no red or brown survives that; the
/// real icons carry far less there. So this draws the whole tile (backdrop,
/// art) and the same shine at `scale`, and the caller raises it with
/// `.zIndex(1)` as the art's top-level view so it sits over the system's
/// shine instead of under it. The content must fill the square.
private struct PaperSoftGloss<Content: View>: View {
    var scale: Double
    /// The design's background, for art that leaves parts of the tile clear.
    var backdrop: [Color] = []
    @ViewBuilder var content: () -> Content

    var body: some View {
        ZStack {
            if !backdrop.isEmpty {
                LinearGradient(colors: backdrop, startPoint: .top, endPoint: .bottom)
            }
            content()
            PaperGlossShape()
                .fill(LinearGradient(colors: [.white.opacity(0.62), .white.opacity(0.16)], startPoint: .top, endPoint: .bottom))
                .opacity(scale)
        }
    }
}

/// Straight, square-ended spokes from the centre of the frame, as one path.
/// `angles` in degrees clockwise from 3 o'clock; `reach` is the length as a
/// share of the half-width; `thickness` is the width as a share of the width.
private struct PaperSpokes: Shape {
    var angles: [Double]
    var reach: Double
    var thickness: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let c = CGPoint(x: rect.midX, y: rect.midY)
        let length = min(rect.width, rect.height) / 2 * reach
        let half = min(rect.width, rect.height) * thickness / 2
        for degrees in angles {
            let a = degrees * .pi / 180
            let d = CGPoint(x: cos(a), y: sin(a))
            let n = CGPoint(x: -d.y * half, y: d.x * half)
            path.move(to: CGPoint(x: c.x + n.x, y: c.y + n.y))
            path.addLine(to: CGPoint(x: c.x + d.x * length + n.x, y: c.y + d.y * length + n.y))
            path.addLine(to: CGPoint(x: c.x + d.x * length - n.x, y: c.y + d.y * length - n.y))
            path.addLine(to: CGPoint(x: c.x - n.x, y: c.y - n.y))
            path.closeSubpath()
        }
        return path
    }
}
