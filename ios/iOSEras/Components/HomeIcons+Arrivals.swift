//
//  HomeIcons+Arrivals.swift
//  iOSEras
//
//  Icon designs, one entry per redesign, for: Wallet, Health, Books, News, Home, Files, Measure, Shortcuts, Translate, Freeform, Journal, Passwords, Games, Preview, Siri.
//  Colours marked "sampled" come from period artwork; "documented" ones
//  from Logopedia's change notes. Geometry is in fractions of the tile.
//
//  Spans (timeline year = first year the design is shown):
//  Wallet     2012 Passbook leather · 2013 three passes · 2014 four passes (Apple Pay) ·
//             2015 Wallet on black · 2024 gradient · 2025 glass · 2026 clearer glass
//  Health     2014 heart top-right · 2024 heart retouched · 2025 glass heart · 2026 deeper heart
//  Books      2014 iBooks · 2017 iOS 11 redraw · 2021 wider gap · 2024 vivid orange · 2025 glass · 2026 darker
//  News       2015 newspaper · 2016 paper with N · 2017 thinner lines · 2019 big N · 2024 smaller N ·
//             2025 glass N · 2026 deeper N
//  Home       2016 rounded nested house · 2024 squarer · 2025 glass house · 2026 deeper orange
//  Files      2017 folder · 2024 wider · 2025 glass folder · 2026 flatter blue
//  Measure    2018 ruler band · 2024 gradient · 2025 glass · 2026 darker glass
//  Shortcuts  2018 navy diamonds · 2021 pink/cyan · 2025 purple glass · 2026 bluer violet
//  Translate  2020 globe + bubbles · 2024 bubbles only · 2025 cyan glass · 2026 lighter
//  Freeform   2022 scribble (iOS 18 kept it) · 2025 glass · 2026 teal (26.4 / iOS 27)
//  Journal    2023 butterfly · 2025 glass · 2026 brighter
//  Passwords  2024 flat keys on white · 2025 glass keys on dark · 2026 brighter keys
//  Games      2025 rocket · 2026 coral
//  Preview    2025 loupe on blue · 2026 loupe over a picture
//  Siri       2026 chrome orb
//

import SwiftUI

extension HomeApp {
    static let arrivals: [HomeApp] = [
        HomeApp("Wallet", names: [(era(2012), "Passbook"), (era(2015), "Wallet")], designs: [
            design(2012, 0x2F2F30, 0x232324, art { edge in ArrivalsPassbookLeather(edge: edge) }),                 // sampled
            flat(2013, 0x56B7EF, art { edge in ArrivalsPassbookBands(edge: edge, applePay: false) }),              // sampled
            flat(2014, 0xFB4D43, art { edge in ArrivalsPassbookBands(edge: edge, applePay: true) }),               // sampled
            flat(2015, 0x1E1E1F, art { edge in ArrivalsWalletArt(edge: edge, scale: 1.0, glass: false) }),         // sampled
            design(2024, 0x303030, 0x151515, art { edge in ArrivalsWalletArt(edge: edge, scale: 0.98, glass: false) }),   // documented
            design(2025, 0x313131, 0x141414, art { edge in ArrivalsWalletArt(edge: edge, scale: 0.98, glass: true) }),    // sampled
            design(2026, 0x1F1E1F, 0x0E0E0E, art { edge in ArrivalsWalletArt(edge: edge, scale: 0.98, glass: true, clarity: 0.72) }),   // sampled
        ]),

        HomeApp("Health", designs: [
            flat(2014, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsHeart(edge: edge, top: hex(0xFF5894), bottom: hex(0xFF2B1F),
                              box: CGRect(x: 0.386, y: 0.157, width: 0.456, height: 0.416), cleft: 0.19, glass: false)
            }),
            flat(2024, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsHeart(edge: edge, top: hex(0xFF5895), bottom: hex(0xFF2D29),
                              box: CGRect(x: 0.388, y: 0.155, width: 0.454, height: 0.418), cleft: 0.23, glass: false)
            }),
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in                                                         // sampled
                ArrivalsHeart(edge: edge, top: hex(0xFF3298), bottom: hex(0xFE0A1C),
                              box: CGRect(x: 0.388, y: 0.157, width: 0.454, height: 0.421), cleft: 0.22, glass: true)
            }),
            design(2026, 0xFFFEFE, 0xE8E9E7, art { edge in                                                         // sampled
                ArrivalsHeart(edge: edge, top: hex(0xEB3E7F), bottom: hex(0xEA3337),
                              box: CGRect(x: 0.388, y: 0.157, width: 0.454, height: 0.421), cleft: 0.22, glass: true, shadow: 0.42)
            }),
        ]),

        HomeApp("Books", names: [(era(2014), "iBooks"), (era(2018), "Books")], designs: [
            design(2014, 0xFFA601, 0xF9681D, art { edge in                                                         // sampled
                ArrivalsOpenBook(edge: edge, gap: 0.016, page: ArrivalsPageShape(outerTop: 0.12, spineTop: 0.10, spineBottom: 1.0, outerBottom: 0.88, hump: 0.62))
            }),
            design(2017, 0xFD9E05, 0xFA7219, art { edge in                                                         // sampled
                ArrivalsOpenBook(edge: edge, gap: 0.018, page: ArrivalsPageShape(outerTop: 0.10, spineTop: 0.10, spineBottom: 1.0, outerBottom: 0.90, hump: 0.70))
            }),
            design(2021, 0xFEA502, 0xF86A1D, art { edge in                                                         // sampled
                ArrivalsOpenBook(edge: edge, gap: 0.045, page: ArrivalsPageShape(outerTop: 0.09, spineTop: 0.09, spineBottom: 0.985, outerBottom: 1.0, hump: 0.85), height: 0.525)
            }),
            design(2024, 0xFFA100, 0xFE5E00, art { edge in                                                         // sampled
                ArrivalsOpenBook(edge: edge, gap: 0.045, page: ArrivalsPageShape(outerTop: 0.09, spineTop: 0.09, spineBottom: 0.985, outerBottom: 1.0, hump: 0.85), height: 0.525)
            }),
            design(2025, 0xFF9606, 0xF8671F, art { edge in ArrivalsGlassBook(edge: edge, page: hex(0xFBEFE6), plate: hex(0xF6B070)) }),   // sampled
            design(2026, 0xFF8A0B, 0xFE7200, art { edge in ArrivalsGlassBook(edge: edge, page: hex(0xFDF5EC), plate: hex(0xF7B36A)) }),   // sampled (iOS 27 beta 5 home screen)
        ]),

        HomeApp("News", designs: [
            design(2015, 0xFF505F, 0xFF2E54, art { edge in ArrivalsNewspaper(edge: edge, style: .photo) }),         // sampled
            design(2016, 0xEF4961, 0xEF3A5D, art { edge in ArrivalsNewspaper(edge: edge, style: .thickLines) }),    // sampled
            design(2017, 0xEF4961, 0xEF3A5D, art { edge in ArrivalsNewspaper(edge: edge, style: .thinLines) }),     // sampled
            flat(2019, 0xFFFFFF, art { edge in                                                                     // sampled (iOS 13)
                ArrivalsNewsN(size: edge * 0.579, top: hex(0xFD5163), bottom: hex(0xFD3B5C), glass: false)
            }),
            flat(2024, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsNewsN(size: edge * 0.579, top: hex(0xFD5163), bottom: hex(0xFD3C5C), glass: false)
            }),
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in                                                         // sampled
                ArrivalsNewsN(size: edge * 0.585, top: hex(0xFE5668), bottom: hex(0xFE4666), glass: true)
            }),
            design(2026, 0xFEFEFE, 0xF5F4F5, art { edge in                                                         // sampled
                ArrivalsNewsN(size: edge * 0.585, top: hex(0xFB5368), bottom: hex(0xF94051), glass: true, shadow: 0.36)
            }),
        ]),

        HomeApp("Home", designs: [
            flat(2016, 0xFFFEFE, art { edge in ArrivalsHouse(edge: edge, look: .rounded) }),                       // sampled
            flat(2024, 0xFFFFFF, art { edge in ArrivalsHouse(edge: edge, look: .square) }),                        // sampled
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in ArrivalsHouse(edge: edge, look: .glass) }),             // sampled
            design(2026, 0xFFFFFF, 0xF4F5F4, art { edge in ArrivalsHouse(edge: edge, look: .deepGlass) }),         // sampled
        ]),

        HomeApp("Files", designs: [
            flat(2017, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsFolder(edge: edge, left: 0.128, tabTop: 0.211, backTop: 0.261, slipTop: 0.306, slipBottom: 0.326, frontTop: 0.333,
                               bottom: 0.789, back: [hex(0x19B5F9), hex(0x1AABF8)], front: [hex(0x18C0FA), hex(0x1C7BF2)],
                               slip: .white, slipInset: 0.012, glass: false)
            }),
            flat(2024, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsFolder(edge: edge, left: 0.122, tabTop: 0.211, backTop: 0.261, slipTop: 0.306, slipBottom: 0.321, frontTop: 0.333,
                               bottom: 0.789, back: [hex(0x1AB2F9), hex(0x1AA9F7)], front: [hex(0x18C1FA), hex(0x1C7BF3)],
                               slip: .white, slipInset: 0.012, glass: false)
            }),
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in                                                         // sampled
                ArrivalsFolder(edge: edge, left: 0.125, tabTop: 0.195, backTop: 0.25, slipTop: 0.281, slipBottom: 0.33, frontTop: 0.312,
                               bottom: 0.797, back: [hex(0x07BBFC), hex(0x00B3FD)], front: [hex(0x32C6FF), hex(0x0179F2)],
                               slip: hex(0xF3F5F6), slipInset: 0.035, glass: true)
            }),
            design(2026, 0xFEFEFE, 0xF6F5F5, art { edge in                                                         // sampled
                ArrivalsFolder(edge: edge, left: 0.125, tabTop: 0.195, backTop: 0.25, slipTop: 0.281, slipBottom: 0.33, frontTop: 0.312,
                               bottom: 0.793, back: [hex(0x54C0FE), hex(0x44A5FD)], front: [hex(0x4CAEFE), hex(0x337CF1)],
                               slip: hex(0xE4E4E6), slipInset: 0.035, glass: true)
            }),
        ]),

        HomeApp("Measure", designs: [
            flat(2018, 0x19191B, art { edge in ArrivalsRuler(edge: edge, look: .band) }),                          // sampled
            design(2024, 0x303030, 0x151515, art { edge in ArrivalsRuler(edge: edge, look: .flat) }),              // sampled
            design(2025, 0x313131, 0x141414, art { edge in ArrivalsRuler(edge: edge, look: .glass) }),             // sampled
            design(2026, 0x1F1F1F, 0x0F0F0F, art { edge in ArrivalsRuler(edge: edge, look: .glass) }),             // iOS 27 dark-tile trend; no render seen
        ]),

        HomeApp("Shortcuts", designs: [
            flat(2018, 0x1E265A, art { edge in                                                                     // sampled (SVG)
                ArrivalsDiamonds(edge: edge,
                                 upper: [hex(0xF0625A), hex(0xEE6080), hex(0xE35FAA), hex(0x8C3F9A, 0.8)],
                                 lower: [hex(0x4DC2A1), hex(0x2F9FD0), hex(0x1F7DF1)],
                                 upperAlpha: 0.88, glass: false)
            }),
            flat(2021, 0x1C1E5A, art { edge in                                                                     // sampled
                ArrivalsDiamonds(edge: edge,
                                 upper: [hex(0xF45E78), hex(0xF25E90), hex(0xE95DB4), hex(0x9E4B8E)],
                                 lower: [hex(0x33ACB0), hex(0x2A96C8), hex(0x157FE8)],
                                 upperAlpha: 0.96, glass: false)
            }),
            design(2025, 0x4A2990, 0x291B61, art { edge in                                                         // sampled
                ArrivalsDiamonds(edge: edge,
                                 upper: [hex(0xE66C9C), hex(0xC8537A), hex(0x9B3D78)],
                                 lower: [hex(0x483EA1), hex(0x785BB9), hex(0xD48AD2)],
                                 upperAlpha: 0.9, glass: true)
            }),
            design(2026, 0x421D8F, 0x29157A, art { edge in                                                         // sampled
                ArrivalsDiamonds(edge: edge,
                                 upper: [hex(0xF07FB0), hex(0xC9537D), hex(0x9D3E7F)],
                                 lower: [hex(0x4A3EAB), hex(0x7A5CBF), hex(0xE28BD4)],
                                 upperAlpha: 0.88, glass: true, roundness: 0.27)
            }),
        ]),

        HomeApp("Translate", designs: [
            flat(2020, 0x1A1A1B, art { edge in                                                                     // sampled
                ArrivalsTranslateArt(edge: edge, globe: hex(0x4DAFC3), light: hex(0xFFFFFF), lightInk: hex(0x1A1A1B),
                                     dark: hex(0x30AEC7), darkInk: hex(0xFFFFFF), spread: false, glass: false)
            }),
            design(2024, 0x303030, 0x151515, art { edge in                                                         // sampled
                ArrivalsTranslateArt(edge: edge, globe: nil, light: hex(0xFFFFFF), lightInk: hex(0x1A1A1B),
                                     dark: hex(0x53BBE1), darkInk: hex(0xFFFFFF), spread: true, glass: false)
            }),
            design(2025, 0x53D8E1, 0x73ABDC, art { edge in                                                         // sampled
                ArrivalsTranslateArt(edge: edge, globe: nil, light: hex(0xFAFEFF), lightInk: hex(0x27343A),
                                     dark: hex(0x1C2D34), darkInk: hex(0xFFFFFF), spread: true, glass: true)
            }),
            design(2026, 0x81E4EF, 0x76CEEE, art { edge in                                                         // sampled
                ArrivalsTranslateArt(edge: edge, globe: nil, light: hex(0xF7FDFE), lightInk: hex(0x27343A),
                                     dark: hex(0x193035), darkInk: hex(0xFFFFFF), spread: true, glass: true)
            }),
        ]),

        HomeApp("Freeform", designs: [
            flat(2022, 0xFFFFFF, art { edge in                                                                     // sampled
                ArrivalsFreeformArt(edge: edge, circle: [hex(0xFF9A37), hex(0xFE6361)], square: [hex(0x00DCFD), hex(0x3CBBE5)],
                                    squareAlpha: 0.85, stroke: hex(0x023A5E), highlight: nil, squareRadius: 0.07)
            }),
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in                                                         // sampled
                ArrivalsFreeformArt(edge: edge, circle: [hex(0xF17445), hex(0xF47D71)], square: [hex(0x0CFAFF), hex(0x0DBFE8)],
                                    squareAlpha: 0.88, stroke: hex(0x012B32), highlight: hex(0x2ED6E0), squareRadius: 0.12)
            }),
            design(2026, 0x265D7B, 0x153A48, art { edge in                                                         // sampled (iOS 27 render)
                ArrivalsFreeformArt(edge: edge, circle: [hex(0x55B5C8, 0.72), hex(0x2F8397, 0.72)], square: [hex(0x62D2E6, 0.62), hex(0x357E92, 0.62)],
                                    squareAlpha: 1.0, stroke: hex(0xDFFEFF), highlight: nil, squareRadius: 0.12, glow: hex(0x7FF3FF))
            }),
        ]),

        HomeApp("Journal", designs: [
            flat(2023, 0x212438, art { edge in                                                                     // sampled
                ArrivalsButterfly(edge: edge,
                                  upperLeft: [hex(0x7570AD), hex(0xB47197)], lowerLeft: [hex(0x7385E4), hex(0x889BF5)],
                                  upperRight: [hex(0xFF9794), hex(0xFFD2BE)], lowerRight: [hex(0xC9505A), hex(0xFF645E)], glass: false)
            }),
            design(2025, 0x303453, 0x202439, art { edge in                                                         // sampled
                ArrivalsButterfly(edge: edge,
                                  upperLeft: [hex(0x8567FE), hex(0xA75EDD)], lowerLeft: [hex(0x3B5BD8), hex(0x4468C4)],
                                  upperRight: [hex(0xFDA79E), hex(0xFECCB9)], lowerRight: [hex(0xD8435F), hex(0xB03448)], glass: true)
            }),
            design(2026, 0x353854, 0x232538, art { edge in                                                         // sampled
                ArrivalsButterfly(edge: edge,
                                  upperLeft: [hex(0x7051E2), hex(0x974CB8)], lowerLeft: [hex(0x3D48F2), hex(0x5A82F7)],
                                  upperRight: [hex(0xF09C87), hex(0xF2AE96)], lowerRight: [hex(0xEA4A6C), hex(0xEA554C)], glass: true)
            }),
        ]),

        HomeApp("Passwords", designs: [
            flat(2024, 0xFFFFFF, art { edge in ArrivalsFannedKeys(edge: edge) }),                                   // sampled
            // Measured off the iOS 26.5 runtime icon, which is what an iPhone actually
            // draws: the tile is #313131 to #141414, the same dark glass gradient Wallet
            // and Measure use that year, and the keys are muted (#F7CE46, #58B95C,
            // #2E80E0) and darken to 0.62 down the blade. The last pass keyed these to
            // the macOS 26 dump instead and came out near-black with a vivid green.
            design(2025, 0x313131, 0x141414, art { edge in                                                         // measured
                ArrivalsGlassKeys(edge: edge, colours: [hex(0xF7CE46), hex(0x58B95C), hex(0x2E80E0)],
                                  bow: 0.3403, spacing: 0.2052, fade: [0.93, 0.86, 0.62])
            }),
            // iOS 27 ships the same key geometry; its own artwork is brighter and barely
            // darkens (measured #FFDE45, #18CB45, #2B8AF6, foot 0.77). The tile stays on
            // this row's deliberate deeper black, as Measure's does.
            design(2026, 0x1F1F1F, 0x0F0F0F, art { edge in                                                         // measured
                ArrivalsGlassKeys(edge: edge, colours: [hex(0xFFDE45), hex(0x18CB45), hex(0x2B8AF6)],
                                  bow: 0.3403, spacing: 0.2052, fade: [0.93, 0.79, 0.77])
            }),
        ]),

        HomeApp("Games", designs: [
            design(2025, 0xFF6645, 0xFE162E, art { edge in ArrivalsRocketArt(edge: edge, hull: hex(0xFFFFFF, 0.86), porthole: hex(0xF4323E)) }),   // sampled
            design(2026, 0xEC5847, 0xE93D39, art { edge in ArrivalsRocketArt(edge: edge, hull: hex(0xFCE6E3, 0.94), porthole: hex(0xE0453A)) }),   // sampled
        ]),

        HomeApp("Preview", designs: [
            design(2025, 0xAFCFFE, 0x3F7FFF, art { edge in ArrivalsLoupe(edge: edge) }),                            // sampled (macOS 26 render)
            design(2026, 0xFFFEFF, 0xE8E8E7, art { edge in ArrivalsPictureLoupe(edge: edge) }),                     // sampled (dock screenshot)
        ]),

        HomeApp("Siri", designs: [
            design(2026, 0xFFFFFF, 0xF3F3F4, art { edge in ArrivalsSiriOrb().frame(width: edge * 0.80, height: edge * 0.80) }),   // sampled (dock screenshot)
        ]),
    ]
}


// MARK: - Wallet

/// A ticket: a rounded card with a semicircular punch in the top edge.
private struct ArrivalsTicketShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path(roundedRect: rect, cornerRadius: rect.width * 0.08, style: .continuous)
        let notch = rect.width * 0.11
        path.addEllipse(in: CGRect(x: rect.midX - notch / 2, y: rect.minY - notch / 2, width: notch, height: notch))
        return path
    }
}

/// iOS 6 Passbook: three passes fanned in a diagonal leather pocket.
private struct ArrivalsPassbookLeather: View {
    let edge: CGFloat

    var body: some View {
        let cardW = edge * 0.30
        let cardH = edge * 0.54
        ZStack {
            // The passes, back to front.
            ZStack {
                ArrivalsTicketShape().fill(hex(0x2E9E42), style: FillStyle(eoFill: true))
                    .frame(width: cardW, height: cardH)
                    .overlay(Image(systemName: "tag.fill").font(.system(size: edge * 0.09, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.9)).offset(y: -edge * 0.10))
                    .rotationEffect(.degrees(-20))
                    .offset(x: -edge * 0.20, y: edge * 0.05)
                ArrivalsTicketShape().fill(hex(0xF5C324), style: FillStyle(eoFill: true))
                    .frame(width: cardW, height: cardH)
                    .overlay(Image(systemName: "airplane").font(.system(size: edge * 0.11, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.92)).offset(y: -edge * 0.09))
                    .rotationEffect(.degrees(-5))
                    .offset(x: -edge * 0.02, y: -edge * 0.01)
                ArrivalsTicketShape().fill(hex(0x2A8FD8), style: FillStyle(eoFill: true))
                    .frame(width: cardW, height: cardH)
                    .overlay(Image(systemName: "video.fill").font(.system(size: edge * 0.10, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.92)).offset(y: -edge * 0.10))
                    .rotationEffect(.degrees(15))
                    .offset(x: edge * 0.18, y: -edge * 0.03)
            }
            .offset(y: -edge * 0.06)

            // The pocket: leather below a stitched diagonal seam.
            ArrivalsPocketWedge().fill(LinearGradient(colors: [hex(0x2C2C2D), hex(0x1F1F20)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge, height: edge)
                .shadow(color: .black.opacity(0.5), radius: edge * 0.015, y: -edge * 0.008)
            ArrivalsPocketSeam().stroke(hex(0x5A5A5C), style: StrokeStyle(lineWidth: edge * 0.012, dash: [edge * 0.025, edge * 0.02]))
                .frame(width: edge, height: edge)
        }
        .frame(width: edge, height: edge)
    }
}

private struct ArrivalsPocketWedge: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.62))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.44))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

private struct ArrivalsPocketSeam: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.665))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.485))
        return path
    }
}

/// One horizontal pass band of the iOS 7/8 Passbook: fills from `top` to the
/// bottom of the tile, with an optional round punch cut into its top edge
/// and an optional zigzag torn top edge.
private struct ArrivalsBandShape: Shape {
    var top: Double
    var notchX: Double? = nil
    var notchRadius: Double = 0.07
    var zigzag: Bool = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let y = rect.minY + rect.height * top
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: y))
        if zigzag {
            let teeth = 20
            let pitch = rect.width / Double(teeth)
            let depth = rect.height * 0.03
            for step in 0..<teeth {
                let x0 = rect.minX + pitch * Double(step)
                path.addLine(to: CGPoint(x: x0 + pitch / 2, y: y + depth))
                path.addLine(to: CGPoint(x: x0 + pitch, y: y))
            }
        } else if let notchX {
            let r = rect.width * notchRadius
            let cx = rect.minX + rect.width * notchX
            path.addLine(to: CGPoint(x: cx - r, y: y))
            path.addArc(center: CGPoint(x: cx, y: y), radius: r, startAngle: .degrees(180), endAngle: .degrees(0), clockwise: true)
            path.addLine(to: CGPoint(x: rect.maxX, y: y))
        } else {
            path.addLine(to: CGPoint(x: rect.maxX, y: y))
        }
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// iOS 7 (three passes) and iOS 8 (four, with the red card band) Passbook.
private struct ArrivalsPassbookBands: View {
    let edge: CGFloat
    let applePay: Bool

    var body: some View {
        // Band tops, as fractions of the tile.
        let blueTop: Double = applePay ? 0.28 : 0
        let greenTop: Double = applePay ? 0.52 : 0.38
        let orangeTop: Double = applePay ? 0.76 : 0.68
        ZStack(alignment: .topLeading) {
            if applePay {
                ArrivalsBandShape(top: blueTop, notchX: 0.85).fill(hex(0x4CA2D3))
            }
            ArrivalsBandShape(top: greenTop, notchX: 0.5).fill(hex(0x3DC500))
            ArrivalsBandShape(top: orangeTop, zigzag: true).fill(hex(0xFFA100))

            if applePay {
                glyph("creditcard.fill", y: 0.13)
            }
            glyph("airplane", y: (blueTop + greenTop) / 2 - (applePay ? 0.01 : 0.02))
            glyph("video.fill", y: (greenTop + orangeTop) / 2)
            glyph("cup.and.saucer.fill", y: (orangeTop + 1) / 2)
        }
        .frame(width: edge, height: edge)
    }

    private func glyph(_ name: String, y: Double) -> some View {
        Image(systemName: name)
            .font(.system(size: edge * 0.13, weight: .medium))
            .foregroundStyle(.white)
            .frame(width: edge * 0.20, height: edge * 0.20)
            .position(x: edge * 0.19, y: edge * y)
    }
}

/// The front pocket of the Wallet: a panel whose top edge dips in a round U.
private struct ArrivalsPocketShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let dipW = rect.width * 0.38
        let dipD = rect.height * 0.22
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.midX - dipW / 2, y: rect.minY))
        path.addCurve(to: CGPoint(x: rect.midX, y: rect.minY + dipD),
                      control1: CGPoint(x: rect.midX - dipW * 0.28, y: rect.minY),
                      control2: CGPoint(x: rect.midX - dipW * 0.22, y: rect.minY + dipD))
        path.addCurve(to: CGPoint(x: rect.midX + dipW / 2, y: rect.minY),
                      control1: CGPoint(x: rect.midX + dipW * 0.22, y: rect.minY + dipD),
                      control2: CGPoint(x: rect.midX + dipW * 0.28, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// The Wallet (iOS 9+): a pale leather wallet, cards tucked behind a pocket
/// whose notch shows the red card. `glass` is the Liquid Glass reading with
/// a translucent pocket and three cards.
private struct ArrivalsWalletArt: View {
    let edge: CGFloat
    var scale: Double = 1
    var glass: Bool
    /// How see-through the glass pocket is (higher = clearer).
    var clarity: Double = 0.55

    var body: some View {
        let w = edge * 0.76
        let h = edge * 0.60
        let cardW = w * 0.90
        ZStack(alignment: .top) {
            // Back of the wallet.
            RoundedRectangle(cornerRadius: edge * 0.07, style: .continuous)
                .fill(glass ? hex(0xE6DCD5) : hex(0xCFCCC2))
            // Cards, top to bottom.
            if glass {
                card(hex(0x22A3EE), width: cardW, top: 0.09)
                card(hex(0xF3C11A), width: cardW, top: 0.22)
                card(hex(0xF96550), width: cardW, top: 0.35)
            } else {
                card(hex(0x3B99C9), width: cardW, top: 0.09)
                card(hex(0xFEB003), width: cardW, top: 0.19)
                card(hex(0x50BE3D), width: cardW, top: 0.29)
                card(hex(0xF26D5F), width: cardW, top: 0.39)
            }
            // Front pocket.
            ArrivalsPocketShape()
                .fill(glass ? hex(0xEDE3DD).opacity(1 - clarity * 0.5) : hex(0xDAD7CD))
                .frame(width: w, height: h * 0.55)
                .offset(y: h * 0.45)
                .shadow(color: .black.opacity(glass ? 0.10 : 0.16), radius: edge * 0.006, y: -edge * 0.004)
            if glass {
                ArrivalsPocketShape()
                    .stroke(.white.opacity(0.7), lineWidth: edge * 0.008)
                    .frame(width: w, height: h * 0.55)
                    .offset(y: h * 0.45)
            }
        }
        .frame(width: w, height: h)
        .clipShape(RoundedRectangle(cornerRadius: edge * 0.07, style: .continuous))
        .overlay {
            if glass {
                RoundedRectangle(cornerRadius: edge * 0.07, style: .continuous)
                    .strokeBorder(.white.opacity(0.55), lineWidth: edge * 0.008)
            }
        }
        .shadow(color: .black.opacity(glass ? 0.35 : 0), radius: edge * 0.03, y: edge * 0.02)
        .scaleEffect(scale)
        .frame(width: edge, height: edge)
    }

    private func card(_ colour: Color, width: CGFloat, top: Double) -> some View {
        RoundedRectangle(cornerRadius: edge * 0.03, style: .continuous)
            .fill(colour)
            .frame(width: width, height: edge * 0.40)
            .offset(y: edge * 0.60 * top)
    }
}


// MARK: - Health

/// Apple's heart: two round lobes over a pointed tip. `cleft` is how far the
/// notch between the lobes dips, as a share of the height.
private struct ArrivalsHeartShape: Shape {
    var cleft: Double = 0.22

    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + w * x, y: rect.minY + h * y) }
        var path = Path()
        path.move(to: p(0.5, cleft))
        path.addCurve(to: p(0.0, 0.33), control1: p(0.43, cleft - 0.31), control2: p(-0.01, -0.06))
        path.addCurve(to: p(0.5, 1.0), control1: p(0.0, 0.60), control2: p(0.31, 0.83))
        path.addCurve(to: p(1.0, 0.33), control1: p(0.69, 0.83), control2: p(1.0, 0.60))
        path.addCurve(to: p(0.5, cleft), control1: p(1.01, -0.06), control2: p(0.57, cleft - 0.31))
        path.closeSubpath()
        return path
    }
}

/// The Health heart, which has always sat up and to the right of centre.
private struct ArrivalsHeart: View {
    let edge: CGFloat
    let top: Color
    let bottom: Color
    /// The heart's bounding box as fractions of the tile.
    let box: CGRect
    var cleft: Double
    var glass: Bool
    var shadow: Double = 0.3

    var body: some View {
        let w = edge * box.width, h = edge * box.height
        ZStack {
            ArrivalsHeartShape(cleft: cleft)
                .fill(LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom))
                .shadow(color: bottom.opacity(glass ? shadow : 0), radius: edge * 0.03, y: edge * 0.025)
            if glass {
                ArrivalsHeartShape(cleft: cleft)
                    .stroke(LinearGradient(colors: [.white.opacity(0.8), .white.opacity(0)], startPoint: .top, endPoint: .center),
                            lineWidth: edge * 0.012)
                Ellipse().fill(.white.opacity(0.32))
                    .frame(width: w * 0.20, height: h * 0.11)
                    .rotationEffect(.degrees(-35))
                    .offset(x: -w * 0.25, y: -h * 0.27)
            }
        }
        .frame(width: w, height: h)
        .offset(x: edge * box.minX, y: edge * box.minY)
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}

// MARK: - Books

/// One page of the flat iBooks/Books glyph, drawn as the left page (spine
/// on the right): an arched top and a bottom edge that humps up mid-page.
private struct ArrivalsPageShape: Shape {
    var outerTop: Double
    var spineTop: Double
    var spineBottom: Double
    var outerBottom: Double
    /// Control height of the bottom edge: lower lifts a bigger hump.
    var hump: Double

    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + w * x, y: rect.minY + h * y) }
        var path = Path()
        path.move(to: p(0, outerTop))
        path.addQuadCurve(to: p(1, spineTop), control: p(0.45, -(outerTop + spineTop) / 2))
        path.addLine(to: p(1, spineBottom))
        path.addQuadCurve(to: p(0, outerBottom), control: p(0.5, hump))
        path.closeSubpath()
        return path
    }
}

private struct ArrivalsOpenBook: View {
    let edge: CGFloat
    var gap: Double
    let page: ArrivalsPageShape
    var height: Double = 0.55

    var body: some View {
        let bookW = edge * 0.666
        let pageW = (bookW - edge * gap) / 2
        HStack(spacing: edge * gap) {
            page.fill(.white).frame(width: pageW, height: edge * height)
            page.fill(.white).frame(width: pageW, height: edge * height)
                .scaleEffect(x: -1)
        }
        .frame(width: edge, height: edge)
    }
}

/// One page of the Liquid Glass book: a rounded outer corner, an arch that
/// dips into a V at the spine, and a bottom that droops to the spine.
private struct ArrivalsGlassPageShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + w * x, y: rect.minY + h * y) }
        var path = Path()
        path.move(to: p(0.0, 0.09))
        path.addQuadCurve(to: p(0.08, 0.015), control: p(0.0, 0.015))
        path.addQuadCurve(to: p(1.0, 0.13), control: p(0.55, -0.03))
        path.addLine(to: p(1.0, 1.0))
        path.addQuadCurve(to: p(0.0, 0.91), control: p(0.45, 0.83))
        path.closeSubpath()
        return path
    }
}

private struct ArrivalsGlassBook: View {
    let edge: CGFloat
    let page: Color
    let plate: Color

    var body: some View {
        ZStack(alignment: .topLeading) {
            // The cover: a translucent plate peeking out round the pages.
            RoundedRectangle(cornerRadius: edge * 0.05, style: .continuous)
                .fill(plate.opacity(0.8))
                .overlay(RoundedRectangle(cornerRadius: edge * 0.05, style: .continuous)
                    .strokeBorder(.white.opacity(0.5), lineWidth: edge * 0.008))
                .frame(width: edge * 0.725, height: edge * 0.505)
                .offset(x: edge * 0.14, y: edge * 0.28)
            HStack(spacing: edge * 0.004) {
                pageView
                pageView.scaleEffect(x: -1)
            }
            .offset(x: edge * 0.178, y: edge * 0.222)
            .shadow(color: hex(0x9A4A10).opacity(0.25), radius: edge * 0.02, y: edge * 0.012)
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }

    private var pageView: some View {
        ArrivalsGlassPageShape()
            .fill(LinearGradient(colors: [page, page, hex(0xF1DCC9)], startPoint: .leading, endPoint: .trailing))
            .frame(width: edge * 0.32, height: edge * 0.55)
    }
}

// MARK: - News

/// The News corner sliver, top-right: from 55% along the top edge round the
/// corner to 46% down the side, its inner edge bowed toward the corner. The
/// bottom-left sliver is the same turned half a turn.
private struct ArrivalsNewsWedge: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        var path = Path()
        for flip in [false, true] {
            func q(_ x: Double, _ y: Double) -> CGPoint { flip ? p(1 - x, 1 - y) : p(x, y) }
            path.move(to: q(0.55, 0))
            path.addLine(to: q(1, 0))
            path.addLine(to: q(1, 0.46))
            path.addQuadCurve(to: q(0.55, 0), control: q(0.80, 0.12))
            path.closeSubpath()
        }
        return path
    }
}

/// The News monogram: a thick diagonal bar and two thin corner slivers,
/// all inside a rounded square.
private struct ArrivalsNewsN: View {
    let size: CGFloat
    let top: Color
    let bottom: Color
    var glass: Bool
    var shadow: Double = 0.26

    var body: some View {
        ZStack {
            LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom)
                .frame(width: size, height: size)
                .mask { letter }
            if glass {
                // A pale glass sheen over the upper half of the letter.
                LinearGradient(colors: [.white.opacity(0.30), .white.opacity(0)], startPoint: .top, endPoint: .center)
                    .frame(width: size, height: size)
                    .mask { letter }
            }
        }
        .frame(width: size, height: size)
        .shadow(color: bottom.opacity(glass ? shadow : 0), radius: size * 0.05, y: size * 0.05)
    }

    private var letter: some View {
        ZStack {
            Rectangle()
                .frame(width: size * 0.36, height: size * 2)
                .rotationEffect(.degrees(-45))
            ArrivalsNewsWedge().fill(.black)
                .frame(width: size, height: size)
        }
        .frame(width: size, height: size)
        .clipShape(RoundedRectangle(cornerRadius: size * 0.08, style: .continuous))
    }
}

/// The city in the iOS 9 front-page photo: a stepped row of towers.
private struct ArrivalsSkyline: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        let steps: [(Double, Double)] = [(0.0, 0.55), (0.10, 0.70), (0.18, 0.50), (0.27, 0.80), (0.36, 0.62),
                                         (0.47, 0.88), (0.56, 0.58), (0.66, 0.72), (0.76, 0.52), (0.86, 0.66), (1.0, 0.66)]
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        for index in 0..<(steps.count - 1) {
            let (x0, height) = steps[index]
            let x1 = steps[index + 1].0
            path.addLine(to: CGPoint(x: rect.minX + w * x0, y: rect.maxY - h * height))
            path.addLine(to: CGPoint(x: rect.minX + w * x1, y: rect.maxY - h * height))
        }
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// iOS 9-12.1 News: a white newspaper with a curled left edge.
private struct ArrivalsNewspaper: View {
    enum Style { case photo, thickLines, thinLines }
    let edge: CGFloat
    let style: Style

    var body: some View {
        let photo = style == .photo
        let paper: CGRect = photo ? CGRect(x: 0.22, y: 0.22, width: 0.62, height: 0.56)
            : (style == .thinLines ? CGRect(x: 0.21, y: 0.19, width: 0.64, height: 0.625) : CGRect(x: 0.20, y: 0.19, width: 0.635, height: 0.615))
        let curlX = photo ? 0.145 : 0.135
        ZStack(alignment: .topLeading) {
            // The curled-back page behind.
            UnevenRoundedRectangle(topLeadingRadius: edge * 0.012, bottomLeadingRadius: edge * 0.035,
                                   bottomTrailingRadius: 0, topTrailingRadius: 0, style: .continuous)
                .fill(LinearGradient(colors: [hex(0xF6F6F7), hex(0xD2D2D6)], startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * (paper.minX - curlX + 0.02), height: edge * (paper.height - 0.045))
                .offset(x: edge * curlX, y: edge * (paper.minY + 0.035))
            // The front page.
            RoundedRectangle(cornerRadius: edge * 0.012, style: .continuous)
                .fill(.white)
                .frame(width: edge * paper.width, height: edge * paper.height)
                .shadow(color: .black.opacity(0.14), radius: edge * 0.008, x: -edge * 0.004)
                .offset(x: edge * paper.minX, y: edge * paper.minY)
            if photo {
                photoPage
            } else {
                ArrivalsNewsN(size: edge * 0.255, top: hex(0xEF4B62), bottom: hex(0xEF4B62), glass: false)
                    .offset(x: edge * (paper.minX + 0.063), y: edge * 0.258)
                let thick = style == .thickLines
                ForEach([0.600, 0.671, 0.742], id: \.self) { y in
                    Rectangle().fill(thick ? hex(0xC6C5CA) : hex(0xBDBDC1))
                        .frame(width: edge * (paper.maxX - paper.minX - 0.063), height: edge * (thick ? 0.03 : 0.009))
                        .offset(x: edge * (paper.minX + 0.063), y: edge * (y - (thick ? 0.015 : 0.0045)))
                }
            }
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }

    /// iOS 9's front page: masthead rules round a globe, a skyline photo,
    /// and two lines of copy.
    private var photoPage: some View {
        ZStack(alignment: .topLeading) {
            ForEach([0.285, 0.335], id: \.self) { y in
                Rectangle().fill(hex(0x707070)).frame(width: edge * 0.18, height: edge * 0.011)
                    .offset(x: edge * 0.26, y: edge * y)
                Rectangle().fill(hex(0x707070)).frame(width: edge * 0.18, height: edge * 0.011)
                    .offset(x: edge * 0.60, y: edge * y)
            }
            Image(systemName: "globe")
                .font(.system(size: edge * 0.115, weight: .light))
                .foregroundStyle(hex(0x5A5A5A))
                .frame(width: edge * 0.13, height: edge * 0.13)
                .offset(x: edge * 0.455, y: edge * 0.25)
            ZStack(alignment: .bottom) {
                hex(0xABE1FA)
                Ellipse().fill(.white.opacity(0.9)).frame(width: edge * 0.14, height: edge * 0.06)
                    .offset(x: -edge * 0.14, y: -edge * 0.15)
                Ellipse().fill(.white.opacity(0.85)).frame(width: edge * 0.12, height: edge * 0.05)
                    .offset(x: edge * 0.16, y: -edge * 0.16)
                ArrivalsSkyline().fill(hex(0x5B5957)).frame(height: edge * 0.15)
            }
            .frame(width: edge * 0.57, height: edge * 0.24)
            .offset(x: edge * 0.24, y: edge * 0.40)
            ForEach([0.685, 0.735], id: \.self) { y in
                RoundedRectangle(cornerRadius: edge * 0.008).fill(hex(0xBDBDBD))
                    .frame(width: edge * 0.57, height: edge * 0.018)
                    .offset(x: edge * 0.24, y: edge * y)
            }
        }
    }
}

// MARK: - Home

/// A polygon with every corner rounded to `radius`.
private func arrivalsRoundedPolygon(_ points: [CGPoint], radius: CGFloat) -> Path {
    var path = Path()
    let count = points.count
    guard count > 2 else { return path }
    let last = points[count - 1]
    path.move(to: CGPoint(x: (last.x + points[0].x) / 2, y: (last.y + points[0].y) / 2))
    for index in 0..<count {
        path.addArc(tangent1End: points[index], tangent2End: points[(index + 1) % count], radius: radius)
    }
    path.closeSubpath()
    return path
}

/// Roof pitch of the Home glyph (rise over run).
private let arrivalsRoofPitch = 0.78

/// A house pentagon in tile fractions: apex, eaves, flat base.
private struct ArrivalsPentagon: Shape {
    var halfWidth: Double
    var apex: Double
    var base: Double
    var corner: Double

    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        let eave = apex + halfWidth * arrivalsRoofPitch
        return arrivalsRoundedPolygon([p(0.5, apex), p(0.5 + halfWidth, eave), p(0.5 + halfWidth, base),
                                       p(0.5 - halfWidth, base), p(0.5 - halfWidth, eave)], radius: s * corner)
    }
}

/// The outer house of the Home icon: overhanging eaves and a chimney.
private struct ArrivalsHouseSilhouette: Shape {
    var apex: Double
    var base: Double
    var chimneyLeft: Double
    var chimneyTop: Double
    var corner: Double

    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        func roof(_ x: Double) -> Double { apex + abs(x - 0.5) * arrivalsRoofPitch }
        let chimneyRight = 0.78
        let eave = roof(0.13)
        let soffit = eave + 0.045
        return arrivalsRoundedPolygon([
            p(0.5, apex), p(chimneyLeft, roof(chimneyLeft)), p(chimneyLeft, chimneyTop), p(chimneyRight, chimneyTop),
            p(chimneyRight, roof(chimneyRight)), p(0.87, eave), p(0.87, soffit), p(0.79, soffit), p(0.79, base),
            p(0.21, base), p(0.21, soffit), p(0.13, soffit), p(0.13, eave),
        ], radius: s * corner)
    }
}

/// Home: a house outline filled with ever-smaller houses in lighter oranges.
private struct ArrivalsHouse: View {
    enum Look { case rounded, square, glass, deepGlass }
    let edge: CGFloat
    let look: Look

    private struct Layer {
        let halfWidth: Double
        let apex: Double
        let base: Double
        let colours: [Color]
    }

    var body: some View {
        let glass = look == .glass || look == .deepGlass
        let corner: Double = look == .rounded ? 0.018 : (glass ? 0.014 : 0.005)
        let s = spec
        ZStack(alignment: .topLeading) {
            ArrivalsHouseSilhouette(apex: s.apex, base: s.base, chimneyLeft: glass ? 0.72 : 0.70,
                                    chimneyTop: glass ? 0.23 : 0.20, corner: corner)
                .fill(LinearGradient(colors: s.outer, startPoint: .top, endPoint: .bottom))
            ForEach(Array(s.layers.enumerated()), id: \.offset) { index, layer in
                let shape = ArrivalsPentagon(halfWidth: layer.halfWidth, apex: layer.apex, base: layer.base,
                                             corner: glass && index == s.layers.count - 1 ? 0.02 : corner)
                shape.fill(LinearGradient(colors: layer.colours.count > 1 ? layer.colours : layer.colours + layer.colours,
                                           startPoint: .top, endPoint: .bottom))
                if look == .deepGlass && index < s.layers.count - 1 {
                    // iOS 27 outlines each glass layer in a darker orange.
                    shape.stroke(hex(0xE25A00, 0.55), lineWidth: edge * 0.008)
                }
                if glass {
                    shape.stroke(LinearGradient(colors: [.white.opacity(0.75), .white.opacity(0.1)], startPoint: .top, endPoint: .bottom),
                                 lineWidth: edge * 0.007)
                }
            }
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
        .shadow(color: hex(0xC05A00).opacity(look == .deepGlass ? 0.3 : 0), radius: edge * 0.022, y: edge * 0.018)
    }

    private var spec: (apex: Double, base: Double, outer: [Color], layers: [Layer]) {
        switch look {
        case .rounded:
            return (0.122, 0.806, [hex(0xF68D1C), hex(0xFC9306)], [
                Layer(halfWidth: 0.244, apex: 0.189, base: 0.756, colours: [hex(0xFEAD29)]),
                Layer(halfWidth: 0.189, apex: 0.256, base: 0.700, colours: [hex(0xFFC047)]),
                Layer(halfWidth: 0.133, apex: 0.322, base: 0.644, colours: [hex(0xFED365)]),
                Layer(halfWidth: 0.078, apex: 0.389, base: 0.589, colours: [hex(0xFEE57D)]),
            ])
        case .square:
            return (0.128, 0.811, [hex(0xF78D1E), hex(0xFD9402)], [
                Layer(halfWidth: 0.239, apex: 0.200, base: 0.756, colours: [hex(0xFCAB29)]),
                Layer(halfWidth: 0.183, apex: 0.272, base: 0.700, colours: [hex(0xFEBE46)]),
                Layer(halfWidth: 0.128, apex: 0.344, base: 0.644, colours: [hex(0xFDD164)]),
                Layer(halfWidth: 0.072, apex: 0.411, base: 0.594, colours: [hex(0xFEE57D)]),
            ])
        case .glass:
            return (0.148, 0.808, [hex(0xFFAE06), hex(0xFE9C00)], [
                Layer(halfWidth: 0.213, apex: 0.246, base: 0.734, colours: [hex(0xFDB622), hex(0xFD8C00)]),
                Layer(halfWidth: 0.128, apex: 0.344, base: 0.648, colours: [hex(0xFDDA62), hex(0xFEB41E)]),
                Layer(halfWidth: 0.078, apex: 0.441, base: 0.578, colours: [hex(0xFFFDD6), hex(0xFEF1A4)]),
            ])
        case .deepGlass:
            return (0.150, 0.810, [hex(0xFF9100), hex(0xFF7B00)], [
                Layer(halfWidth: 0.213, apex: 0.246, base: 0.730, colours: [hex(0xFFB02F), hex(0xFFA11B)]),
                Layer(halfWidth: 0.128, apex: 0.344, base: 0.652, colours: [hex(0xFFD571), hex(0xFFC55A)]),
                Layer(halfWidth: 0.078, apex: 0.441, base: 0.580, colours: [hex(0xFFFBC3), hex(0xFFFED5)]),
            ])
        }
    }
}

// MARK: - Files

/// The back of the folder with its tab, in tile fractions. Ends under the
/// front panel, so only its top matters.
private struct ArrivalsFolderBack: Shape {
    var left: Double
    var tabTop: Double
    var backTop: Double
    var tabWidth: Double

    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        let right = 1 - left
        let r = 0.03
        let tabEnd = left + tabWidth
        var path = Path()
        path.move(to: p(left, 0.6))
        path.addLine(to: p(left, tabTop + r))
        path.addQuadCurve(to: p(left + r, tabTop), control: p(left, tabTop))
        path.addLine(to: p(tabEnd, tabTop))
        path.addCurve(to: p(tabEnd + 0.05, backTop), control1: p(tabEnd + 0.025, tabTop), control2: p(tabEnd + 0.025, backTop))
        path.addLine(to: p(right - r, backTop))
        path.addQuadCurve(to: p(right, backTop + r), control: p(right, backTop))
        path.addLine(to: p(right, 0.6))
        path.closeSubpath()
        return path
    }
}

private struct ArrivalsFolder: View {
    let edge: CGFloat
    let left: Double
    let tabTop: Double
    let backTop: Double
    let slipTop: Double
    let slipBottom: Double
    let frontTop: Double
    let bottom: Double
    let back: [Color]
    let front: [Color]
    let slip: Color
    let slipInset: Double
    let glass: Bool

    var body: some View {
        let width = 1 - 2 * left
        let panel = UnevenRoundedRectangle(topLeadingRadius: edge * 0.022, bottomLeadingRadius: edge * 0.04,
                                           bottomTrailingRadius: edge * 0.04, topTrailingRadius: edge * 0.022, style: .continuous)
        ZStack(alignment: .topLeading) {
            ArrivalsFolderBack(left: left, tabTop: tabTop, backTop: backTop, tabWidth: glass ? 0.235 : 0.20)
                .fill(LinearGradient(colors: back, startPoint: .top, endPoint: .bottom))
            RoundedRectangle(cornerRadius: edge * 0.006, style: .continuous)
                .fill(slip)
                .frame(width: edge * (width - 2 * slipInset), height: edge * (slipBottom - slipTop))
                .offset(x: edge * (left + slipInset), y: edge * slipTop)
            panel
                .fill(LinearGradient(colors: glass ? front.map { $0.opacity(0.95) } : front, startPoint: .top, endPoint: .bottom))
                .overlay {
                    if glass {
                        panel.strokeBorder(LinearGradient(colors: [.white.opacity(0.75), .white.opacity(0.12)], startPoint: .top, endPoint: .bottom),
                                           lineWidth: edge * 0.008)
                    }
                }
                .frame(width: edge * width, height: edge * (bottom - frontTop))
                .offset(x: edge * left, y: edge * frontTop)
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
        .shadow(color: hex(0x0A4FB0).opacity(glass ? 0.26 : 0), radius: edge * 0.025, y: edge * 0.02)
    }
}

// MARK: - Measure

/// One row of ruler ticks as a single path. `lengths` gives each tick's
/// length as a share of the tile; ticks hang from `y` (or rise, if `up`).
private struct ArrivalsTicks: Shape {
    var xs: [Double]
    var lengths: [Double]
    var y: Double
    var up: Bool
    var width: Double = 0.012

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width * width
        for (index, x) in xs.enumerated() where lengths[index] > 0 {
            let length = rect.height * lengths[index]
            let top = up ? rect.minY + rect.height * y - length : rect.minY + rect.height * y
            path.addRoundedRect(in: CGRect(x: rect.minX + rect.width * x - w / 2, y: top, width: w, height: length),
                                cornerSize: CGSize(width: w / 2, height: w / 2))
        }
        return path
    }
}

private struct ArrivalsDots: Shape {
    var count: Int
    var from: Double
    var to: Double
    var y: Double
    var diameter: Double
    var square: Bool = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let d = rect.width * diameter
        for index in 0..<count {
            let x = from + (to - from) * Double(index) / Double(count - 1)
            let box = CGRect(x: rect.minX + rect.width * x - d / 2, y: rect.minY + rect.height * y - d / 2, width: d, height: d)
            if square { path.addRect(box) } else { path.addEllipse(in: box) }
        }
        return path
    }
}

/// Measure: a ruler's two scales with a dotted yellow tape between two
/// end dots.
private struct ArrivalsRuler: View {
    enum Look { case band, flat, glass }
    let edge: CGFloat
    let look: Look

    var body: some View {
        if look == .glass { glassRuler } else { flatRuler }
    }

    /// iOS 12-18: thin white ticks, square dashes.
    private var flatRuler: some View {
        let topXs = (0..<13).map { (index: Int) -> Double in 0.059 + 0.0726 * Double(index) }
        let topLen = (0..<13).map { (index: Int) -> Double in
            if index == 0 { return 0.16 }
            if index == 8 { return 0.14 }
            return index.isMultiple(of: 2) ? 0.09 : 0.06
        }
        let bottomXs = (0..<21).map { (index: Int) -> Double in 0.039 + 0.0459 * Double(index) }
        let bottomLen = (0..<21).map { (index: Int) -> Double in
            guard index % 5 == 0 else { return 0.055 }
            return index % 10 == 5 ? 0.165 : 0.105
        }
        return ZStack {
            if look == .band {
                // The lighter ruler body between darker margins.
                hex(0x202020).frame(width: edge, height: edge * 0.648)
            }
            ArrivalsTicks(xs: topXs, lengths: topLen, y: 0.205, up: false, width: 0.011).fill(.white)
            ArrivalsTicks(xs: bottomXs, lengths: bottomLen, y: 0.785, up: true, width: 0.011).fill(.white)
            ArrivalsDots(count: 19, from: 0.125, to: 0.875, y: 0.5, diameter: 0.02, square: true).fill(hex(0xFFD100))
            ArrivalsDots(count: 2, from: 0.0625, to: 0.9375, y: 0.5, diameter: 0.063).fill(hex(0xFFCC00))
        }
        .frame(width: edge, height: edge)
    }

    /// iOS 26+: bold white major ticks, grey minor ones, round beads.
    private var glassRuler: some View {
        let topXs = (0..<13).map { (index: Int) -> Double in 0.125 + 0.0625 * Double(index) }
        let topWhite = (0..<13).map { (index: Int) -> Double in
            guard index.isMultiple(of: 2) else { return 0 }
            return index == 0 || index == 8 ? 0.21 : 0.145
        }
        let topGrey = (0..<13).map { (index: Int) -> Double in index.isMultiple(of: 2) ? 0 : 0.08 }
        let bottomXs = (0..<21).map { (index: Int) -> Double in 0.105 + 0.0395 * Double(index) }
        let bottomWhite = (0..<21).map { (index: Int) -> Double in
            guard index % 5 == 0 else { return 0 }
            return index % 10 == 5 ? 0.19 : 0.13
        }
        let bottomGrey = (0..<21).map { (index: Int) -> Double in index % 5 == 0 ? 0 : 0.07 }
        return ZStack {
            ArrivalsTicks(xs: topXs, lengths: topGrey, y: 0.19, up: false, width: 0.013).fill(hex(0x7B7B7B))
            ArrivalsTicks(xs: bottomXs, lengths: bottomGrey, y: 0.79, up: true, width: 0.013).fill(hex(0x6B6B6B))
            ZStack {
                ArrivalsTicks(xs: topXs, lengths: topWhite, y: 0.19, up: false, width: 0.017).fill(hex(0xF8F8F8))
                ArrivalsTicks(xs: bottomXs, lengths: bottomWhite, y: 0.79, up: true, width: 0.017).fill(hex(0xF0F0F0))
                ArrivalsDots(count: 11, from: 0.1875, to: 0.8125, y: 0.5, diameter: 0.026).fill(hex(0xF0C100))
                ForEach([0.108, 0.892], id: \.self) { x in
                    Circle().fill(RadialGradient(colors: [hex(0xFFE066), hex(0xF2B400)], center: .init(x: 0.35, y: 0.3),
                                                 startRadius: 0, endRadius: edge * 0.035))
                        .frame(width: edge * 0.058, height: edge * 0.058)
                        .position(x: edge * x, y: edge * 0.5)
                }
            }
            .shadow(color: .black.opacity(0.45), radius: edge * 0.012, y: edge * 0.01)
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Shortcuts

/// Two squashed rounded diamonds, the upper one overlapping the lower.
private struct ArrivalsDiamonds: View {
    let edge: CGFloat
    /// Left, middle and right of the upper diamond.
    let upper: [Color]
    /// Lower-left edge to upper-right edge of the lower diamond.
    let lower: [Color]
    var upperAlpha: Double
    let glass: Bool
    var roundness: Double = 0.2

    var body: some View {
        ZStack {
            // Before the 45° turn, bottom-leading becomes the left vertex and
            // the bottom edge becomes the lower-left edge.
            diamond(colours: lower, start: .bottom, end: .top)
                .offset(x: edge * shift, y: edge * lift)
            diamond(colours: upper, start: .bottomLeading, end: .topTrailing)
                .opacity(upperAlpha)
                .offset(x: -edge * shift, y: -edge * lift)
        }
        .shadow(color: .black.opacity(glass ? 0.3 : 0), radius: edge * 0.025, y: edge * 0.02)
        .frame(width: edge, height: edge)
    }

    // Measured off Apple's icons: 0.58 of the tile across (0.65 on the
    // glass icon) and about two thirds as tall, the pair barely overlapping.
    private var side: CGFloat { edge * (glass ? 0.46 : 0.41) }
    private var squash: CGFloat { glass ? 0.66 : 0.655 }
    private var lift: CGFloat { glass ? 0.13 : 0.165 }
    private var shift: CGFloat { glass ? 0.025 : 0.02 }

    private func diamond(colours: [Color], start: UnitPoint, end: UnitPoint) -> some View {
        RoundedRectangle(cornerRadius: side * roundness, style: .continuous)
            .fill(LinearGradient(colors: colours, startPoint: start, endPoint: end))
            .overlay {
                if glass {
                    RoundedRectangle(cornerRadius: side * roundness, style: .continuous)
                        .strokeBorder(LinearGradient(colors: [.white.opacity(0.6), .white.opacity(0.1)], startPoint: .topLeading, endPoint: .bottomTrailing),
                                      lineWidth: edge * 0.008)
                }
            }
            .frame(width: side, height: side)
            .rotationEffect(.degrees(45))
            .scaleEffect(x: 1, y: squash)
    }
}

// MARK: - Translate

private struct ArrivalsSpeechBubble: Shape {
    /// Tail off the bottom-right corner when true, bottom-left otherwise.
    var tailRight: Bool

    func path(in rect: CGRect) -> Path {
        let bodyH = rect.height * 0.84
        let body = CGRect(x: rect.minX, y: rect.minY, width: rect.width, height: bodyH)
        var path = Path(roundedRect: body, cornerRadius: bodyH * 0.22, style: .continuous)
        var tail = Path()
        let x0 = tailRight ? rect.maxX - rect.width * 0.30 : rect.minX + rect.width * 0.10
        let x1 = tailRight ? rect.maxX - rect.width * 0.10 : rect.minX + rect.width * 0.30
        let tip = tailRight ? rect.maxX - rect.width * 0.14 : rect.minX + rect.width * 0.14
        tail.move(to: CGPoint(x: x0, y: body.maxY - 1))
        tail.addLine(to: CGPoint(x: tip, y: rect.maxY))
        tail.addLine(to: CGPoint(x: x1, y: body.maxY - 1))
        tail.closeSubpath()
        path.addPath(tail)
        return path
    }
}

/// A wireframe globe: a circle, two meridians and three latitude lines.
private struct ArrivalsGlobe: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.addEllipse(in: rect)
        path.addEllipse(in: rect.insetBy(dx: rect.width * 0.25, dy: 0))
        path.addEllipse(in: rect.insetBy(dx: rect.width * 0.40, dy: 0))
        path.move(to: CGPoint(x: rect.minX, y: rect.midY)); path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        for dy in [-0.28, 0.28] {
            let y = rect.midY + rect.height * dy
            let half = sqrt(max(0, 0.25 - dy * dy)) * rect.width
            path.move(to: CGPoint(x: rect.midX - half, y: y)); path.addLine(to: CGPoint(x: rect.midX + half, y: y))
        }
        return path
    }
}

private struct ArrivalsTranslateArt: View {
    let edge: CGFloat
    let globe: Color?
    let light: Color
    let lightInk: Color
    let dark: Color
    let darkInk: Color
    /// The iOS 18+ layout, where the bubbles moved closer together.
    let spread: Bool
    let glass: Bool

    var body: some View {
        let lightRect = spread ? CGRect(x: 0.13, y: 0.22, width: 0.40, height: 0.34) : CGRect(x: 0.07, y: 0.17, width: 0.40, height: 0.36)
        let darkRect = spread ? CGRect(x: 0.47, y: 0.42, width: 0.40, height: 0.34) : CGRect(x: 0.53, y: 0.53, width: 0.40, height: 0.34)
        ZStack(alignment: .topLeading) {
            if let globe {
                ArrivalsGlobe().stroke(globe, lineWidth: edge * 0.022)
                    .frame(width: edge * 0.74, height: edge * 0.74)
                    .offset(x: edge * 0.155, y: edge * 0.13)
            }
            bubble(lightRect, fill: light, ink: lightInk, text: "A", tailRight: false)
            bubble(darkRect, fill: dark, ink: darkInk, text: "文", tailRight: true)
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }

    private func bubble(_ r: CGRect, fill: Color, ink: Color, text: String, tailRight: Bool) -> some View {
        ArrivalsSpeechBubble(tailRight: tailRight)
            .fill(fill)
            .overlay {
                if glass {
                    ArrivalsSpeechBubble(tailRight: tailRight).stroke(.white.opacity(0.45), lineWidth: edge * 0.008)
                }
            }
            .overlay(alignment: .top) {
                Text(text)
                    .font(.system(size: edge * r.height * 0.62, weight: .medium))
                    .foregroundStyle(ink)
                    .frame(height: edge * r.height * 0.84)
            }
            .frame(width: edge * r.width, height: edge * r.height)
            .shadow(color: .black.opacity(glass ? 0.25 : 0), radius: edge * 0.02, y: edge * 0.015)
            .offset(x: edge * r.minX, y: edge * r.minY)
    }
}

// MARK: - Freeform

/// The hand-drawn "m" scribble of the Freeform icon.
private struct ArrivalsScribble: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + w * x, y: rect.minY + h * y) }
        var path = Path()
        path.move(to: p(0.19, 0.62))
        path.addCurve(to: p(0.40, 0.375), control1: p(0.27, 0.45), control2: p(0.34, 0.375))
        path.addCurve(to: p(0.49, 0.585), control1: p(0.45, 0.375), control2: p(0.45, 0.585))
        path.addCurve(to: p(0.64, 0.43), control1: p(0.53, 0.585), control2: p(0.58, 0.43))
        path.addCurve(to: p(0.74, 0.567), control1: p(0.70, 0.43), control2: p(0.70, 0.567))
        path.addCurve(to: p(0.90, 0.445), control1: p(0.78, 0.567), control2: p(0.84, 0.445))
        return path
    }
}

private struct ArrivalsFreeformArt: View {
    let edge: CGFloat
    let circle: [Color]
    let square: [Color]
    let squareAlpha: Double
    let stroke: Color
    let highlight: Color?
    let squareRadius: Double
    /// A soft light under the stroke, for the dark iOS 27 icon.
    var glow: Color? = nil

    var body: some View {
        let line = StrokeStyle(lineWidth: edge * 0.055, lineCap: .round, lineJoin: .round)
        ZStack(alignment: .topLeading) {
            Circle().fill(LinearGradient(colors: circle, startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.585, height: edge * 0.585)
                .offset(x: edge * 0.10, y: edge * 0.31)
            RoundedRectangle(cornerRadius: edge * squareRadius, style: .continuous)
                .fill(LinearGradient(colors: square, startPoint: .top, endPoint: .bottomTrailing))
                .opacity(squareAlpha)
                .frame(width: edge * 0.54, height: edge * 0.54)
                .offset(x: edge * 0.33, y: edge * 0.13)
            if let glow {
                ArrivalsScribble()
                    .stroke(glow.opacity(0.55), style: StrokeStyle(lineWidth: edge * 0.088, lineCap: .round, lineJoin: .round))
                    .frame(width: edge, height: edge)
            }
            ArrivalsScribble()
                .stroke(stroke, style: line)
                .frame(width: edge, height: edge)
                .shadow(color: .black.opacity(highlight == nil ? 0 : 0.25), radius: edge * 0.015, y: edge * 0.012)
            if let highlight {
                ArrivalsScribble()
                    .stroke(highlight.opacity(0.7), style: StrokeStyle(lineWidth: edge * 0.011, lineCap: .round, lineJoin: .round))
                    .frame(width: edge, height: edge)
                    .offset(y: -edge * 0.012)
            }
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}

// MARK: - Journal

/// The Journal butterfly's upper-left wing, in tile fractions: a tall
/// petal whose top rises outward and whose tail hooks down to the seam.
private struct ArrivalsUpperWing: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        var path = Path()
        path.move(to: p(0.19, 0.205))
        path.addQuadCurve(to: p(0.235, 0.155), control: p(0.19, 0.155))
        path.addLine(to: p(0.398, 0.228))
        path.addQuadCurve(to: p(0.472, 0.33), control: p(0.472, 0.255))
        path.addLine(to: p(0.472, 0.50))
        path.addCurve(to: p(0.217, 0.43), control1: p(0.45, 0.49), control2: p(0.34, 0.45))
        path.addQuadCurve(to: p(0.19, 0.405), control: p(0.19, 0.43))
        path.closeSubpath()
        return path
    }
}

/// The lower-left wing: a squared top, a straight outer side and a round
/// bottom that sweeps up to the seam.
private struct ArrivalsLowerWing: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        var path = Path()
        path.move(to: p(0.472, 0.53))
        path.addLine(to: p(0.295, 0.53))
        path.addQuadCurve(to: p(0.255, 0.57), control: p(0.255, 0.53))
        path.addLine(to: p(0.255, 0.76))
        path.addQuadCurve(to: p(0.315, 0.842), control: p(0.255, 0.842))
        path.addCurve(to: p(0.472, 0.735), control1: p(0.41, 0.842), control2: p(0.472, 0.80))
        path.closeSubpath()
        return path
    }
}

/// Journal: four wings, the right pair mirrored across a dark seam.
private struct ArrivalsButterfly: View {
    let edge: CGFloat
    /// Upper wings run outer edge to seam; lower wings top to bottom.
    let upperLeft: [Color]
    let lowerLeft: [Color]
    let upperRight: [Color]
    let lowerRight: [Color]
    let glass: Bool

    var body: some View {
        ZStack {
            half(upper: upperLeft, lower: lowerLeft)
            half(upper: upperRight, lower: lowerRight)
                .scaleEffect(x: -1)
        }
        .frame(width: edge, height: edge)
        .shadow(color: .black.opacity(glass ? 0.32 : 0), radius: edge * 0.02, y: edge * 0.015)
    }

    private func half(upper: [Color], lower: [Color]) -> some View {
        ZStack {
            wing(ArrivalsLowerWing(), colours: lower, start: .init(x: 0.5, y: 0.53), end: .init(x: 0.5, y: 0.84))
            wing(ArrivalsUpperWing(), colours: upper, start: .init(x: 0.16, y: 0.3), end: .init(x: 0.47, y: 0.4))
                .opacity(glass ? 0.94 : 0.97)
        }
        .frame(width: edge, height: edge)
    }

    private func wing<S: Shape>(_ shape: S, colours: [Color], start: UnitPoint, end: UnitPoint) -> some View {
        shape.fill(LinearGradient(colors: colours, startPoint: start, endPoint: end))
            .overlay {
                if glass {
                    shape.stroke(LinearGradient(colors: [.white.opacity(0.55), .white.opacity(0.08)], startPoint: .top, endPoint: .bottom),
                                 lineWidth: edge * 0.007)
                }
            }
    }
}

// MARK: - Passwords

/// A key drawn in tile fractions: a round bow with a hole, and a blade with
/// its bit. Bow and blade wind the same way so they fill as one; the hole
/// winds the other way so it stays open.
private struct ArrivalsKeyShape: Shape {
    // `inset` cuts the tooth valley back into the blade, the way Apple's
    // middle key does; 0 leaves the valley on the blade's own edge. `notch`
    // is a single bite out of the blade's right edge.
    enum Bit {
        case none
        case chevrons(count: Int, from: Double, pitch: Double, depth: Double, inset: Double = 0)
        case block
        case notch(from: Double, to: Double, depth: Double)
    }
    enum Tip { case round, point, slant, bevel }
    var x: Double          // bow centre
    var y: Double
    var bow: Double        // bow diameter
    var hole: Double       // hole diameter
    var holeLift: Double = 0.17   // hole centre above the bow centre, share of the bow
    var blade: Double      // blade width
    var bladeShift: Double = 0
    var bottom: Double
    var bit: Bit = .none
    var tip: Tip = .round

    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ px: Double, _ py: Double) -> CGPoint { CGPoint(x: rect.minX + s * px, y: rect.minY + s * py) }
        var path = Path()
        // The bow, clockwise.
        circle(&path, cx: x, cy: y, r: bow / 2, clockwise: true, p)
        // The hole, anticlockwise, sitting in the upper part of the bow.
        if hole > 0 { circle(&path, cx: x, cy: y - bow * holeLift, r: hole / 2, clockwise: false, p) }
        // The blade, clockwise from its top-left.
        let x0 = x + bladeShift - blade / 2, x1 = x + bladeShift + blade / 2
        let top = y + bow * 0.3
        path.move(to: p(x0, top))
        path.addLine(to: p(x1, top))
        switch bit {
        case .none:
            break
        case let .chevrons(count, from, pitch, depth, inset):
            let vx = x1 - inset
            for index in 0..<count {
                let y0 = from + pitch * Double(index)
                path.addLine(to: p(vx, y0))
                path.addLine(to: p(x1 + depth, y0 + pitch * 0.45))
                path.addLine(to: p(x1 + depth, y0 + pitch * 0.55))
                path.addLine(to: p(vx, y0 + pitch))
            }
        case let .notch(from, to, depth):
            let span = to - from
            path.addLine(to: p(x1, from))
            path.addLine(to: p(x1 - depth, from + span * 0.45))
            path.addLine(to: p(x1 - depth, from + span * 0.58))
            path.addLine(to: p(x1, to))
        case .block:
            // One plain rectangle. Measured off Apple's glass icon: it runs
            // from 0.081 to 0.251 below the bow's foot and reaches 0.731 of a
            // blade past the blade's right edge — no second step.
            let b = y + bow / 2
            path.addLine(to: p(x1, b + 0.081))
            path.addLine(to: p(x1 + blade * 0.731, b + 0.081))
            path.addLine(to: p(x1 + blade * 0.731, b + 0.251))
            path.addLine(to: p(x1, b + 0.251))
        }
        let xc = (x0 + x1) / 2
        switch tip {
        case .round:
            path.addLine(to: p(x1, bottom - blade / 2))
            path.addQuadCurve(to: p(xc, bottom), control: p(x1, bottom))
            path.addQuadCurve(to: p(x0, bottom - blade / 2), control: p(x0, bottom))
        case .point:
            // Apple's middle key: the taper starts half a blade above the apex.
            path.addLine(to: p(x1, bottom - blade * 0.5))
            path.addLine(to: p(xc, bottom))
            path.addLine(to: p(x0, bottom - blade * 0.5))
        case .bevel:
            // A 'slant' the other way up: the right edge runs off at an angle
            // and the bottom-left corner is the rounded one, as Apple's blue
            // key is.
            path.addLine(to: p(x1, bottom - blade * 0.44))
            path.addLine(to: p(x0 + blade * 0.48, bottom))
            path.addQuadCurve(to: p(x0, bottom - blade * 0.25), control: p(x0, bottom))
        case .slant:
            path.addLine(to: p(x1, bottom - blade * 0.25))
            path.addQuadCurve(to: p(x1 - blade * 0.3, bottom), control: p(x1, bottom))
            path.addLine(to: p(x0, bottom - blade * 0.75))
        }
        path.closeSubpath()
        return path
    }

    private func circle(_ path: inout Path, cx: Double, cy: Double, r: Double, clockwise: Bool,
                        _ p: (Double, Double) -> CGPoint) {
        let k = 0.5523 * r
        // Screen coordinates: top -> right -> bottom -> left is clockwise.
        let points: [(Double, Double)] = clockwise
            ? [(cx, cy - r), (cx + r, cy), (cx, cy + r), (cx - r, cy)]
            : [(cx, cy - r), (cx - r, cy), (cx, cy + r), (cx + r, cy)]
        let dir: Double = clockwise ? 1 : -1
        path.move(to: p(points[0].0, points[0].1))
        path.addCurve(to: p(points[1].0, points[1].1), control1: p(cx + dir * k, cy - r), control2: p(points[1].0, cy - k))
        path.addCurve(to: p(points[2].0, points[2].1), control1: p(points[1].0, cy + k), control2: p(cx + dir * k, cy + r))
        path.addCurve(to: p(points[3].0, points[3].1), control1: p(cx - dir * k, cy + r), control2: p(points[3].0, cy + k))
        path.addCurve(to: p(points[0].0, points[0].1), control1: p(points[3].0, cy - k), control2: p(cx - dir * k, cy - r))
        path.closeSubpath()
    }
}

/// iOS 18 Passwords: three flat keys fanned right, each cut out of the one
/// behind by a white gap.
private struct ArrivalsFannedKeys: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            key(x: 0.365, colours: [hex(0xFFD94A), hex(0xFFBE00)], bit: .none)
            key(x: 0.500, colours: [hex(0x4CD96C), hex(0x2EC351)], bit: .none)
            key(x: 0.635, colours: [hex(0x5CC6F8), hex(0x0079FF)],
                bit: .chevrons(count: 2, from: 0.50, pitch: 0.13, depth: 0.06))
        }
        .frame(width: edge, height: edge)
    }

    private func key(x: Double, colours: [Color], bit: ArrivalsKeyShape.Bit) -> some View {
        let shape = ArrivalsKeyShape(x: x, y: 0.30, bow: 0.335, hole: 0.10, holeLift: 0.26, blade: 0.065, bladeShift: -0.05,
                                     bottom: 0.862, bit: bit, tip: .slant)
        return ZStack {
            shape.stroke(.white, style: StrokeStyle(lineWidth: edge * 0.04, lineJoin: .round))
            shape.fill(LinearGradient(colors: colours, startPoint: .init(x: 0.5, y: 0.12), endPoint: .init(x: 0.5, y: 0.88)))
            // The hole shows the white tile, not the key behind.
            Circle().fill(.white)
                .frame(width: edge * 0.10, height: edge * 0.10)
                .position(x: edge * x, y: edge * (0.30 - 0.335 * 0.26))
        }
        .frame(width: edge, height: edge)
    }
}

/// iOS 26+ Passwords: three glass keys side by side, bows overlapping.
///
/// Every number measured off Apple's own artwork — the iOS 26.5 and iOS 27
/// runtime icons and the macOS 26 dump all agree to a fifth of a unit:
/// - the three bows are the SAME circle, 34.03 across, on centres 20.52 apart
///   at u 29.48 / 50.00 / 70.52, so the keys span u 12.5-87.5. The blue bow
///   only looks the widest because it is drawn last and nothing crops it; we
///   had three 27-unit bows 18.5 apart spanning u 18-81.
/// - bow centres sit at v 34.3 (we had 28.5) and the blades end at v 82.7.
/// - the blades are NOT the same width: 7.71 (yellow), 12.52 (green, whose
///   zigzag cuts 1.05 back into it and stands 2.4 proud), 10.90 (blue).
/// `fade` is the key's alpha at v 40, v 55 and the foot: the iOS 26 keys
/// darken hard down the blade (to 0.62), the iOS 27 ones much less.
private struct ArrivalsGlassKeys: View {
    let edge: CGFloat
    let colours: [Color]
    var bow: Double
    var spacing: Double
    var fade: [Double]

    private static let bowY = 0.343

    var body: some View {
        let first = 0.5 - spacing
        ZStack {
            key(0, x: first, blade: 0.0771, bottom: 0.8275, bit: .block, tip: .round)
            key(1, x: first + spacing, blade: 0.1252, bottom: 0.8344,
                bit: .chevrons(count: 3, from: 0.505, pitch: 0.0875, depth: 0.024, inset: 0.0105), tip: .point)
            key(2, x: first + spacing * 2, blade: 0.109, bottom: 0.829,
                bit: .notch(from: 0.624, to: 0.713, depth: 0.023), tip: .bevel)
        }
        .frame(width: edge, height: edge)
    }

    private func key(_ index: Int, x: Double, blade: Double, bottom: Double,
                     bit: ArrivalsKeyShape.Bit, tip: ArrivalsKeyShape.Tip) -> some View {
        let colour = colours[index]
        let bowY = Self.bowY
        let shape = ArrivalsKeyShape(x: x, y: bowY, bow: bow, hole: bow * 0.238, holeLift: 0.175,
                                     blade: blade, bottom: bottom, bit: bit, tip: tip)
        let stops: [Gradient.Stop] = [
            .init(color: colour, location: 0),
            .init(color: colour.opacity(fade[0]), location: 0.364),
            .init(color: colour.opacity(fade[1]), location: 0.591),
            .init(color: colour.opacity(fade[2]), location: 1),
        ]
        return ZStack {
            shape.fill(LinearGradient(stops: stops, startPoint: .init(x: 0.5, y: 0.16), endPoint: .init(x: 0.5, y: 0.82)))
            // Specular rim round the bow.
            Circle()
                .strokeBorder(LinearGradient(colors: [.white.opacity(0.6), .white.opacity(0)], startPoint: .top, endPoint: .bottom),
                              lineWidth: edge * 0.007)
                .frame(width: edge * bow, height: edge * bow)
                .position(x: edge * x, y: edge * bowY)
        }
        .frame(width: edge, height: edge)
        .shadow(color: .black.opacity(0.35), radius: edge * 0.02, y: edge * 0.015)
    }
}

// MARK: - Games

/// A rocket hull pointing up: a pointed nose and a rounded tail.
private struct ArrivalsHullShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width, h = rect.height
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + w * x, y: rect.minY + h * y) }
        var path = Path()
        path.move(to: p(0.5, 0))
        path.addQuadCurve(to: p(1.0, 0.42), control: p(0.96, 0.10))
        path.addLine(to: p(1.0, 0.88))
        path.addQuadCurve(to: p(0.5, 1.0), control: p(1.0, 1.0))
        path.addQuadCurve(to: p(0.0, 0.88), control: p(0.0, 1.0))
        path.addLine(to: p(0.0, 0.42))
        path.addQuadCurve(to: p(0.5, 0), control: p(0.04, 0.10))
        path.closeSubpath()
        return path
    }
}

/// Both swept fins, drawn in a square about the hull's centre (units of the
/// square): each leaves the hull side a little below the middle and trails
/// out past the tail.
private struct ArrivalsFinsShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.midX + s * x, y: rect.midY + s * y) }
        var path = Path()
        for side in [1.0, -1.0] {
            path.move(to: p(side * 0.11, 0.0))
            path.addQuadCurve(to: p(side * 0.235, 0.42), control: p(side * 0.33, 0.12))
            path.addQuadCurve(to: p(side * 0.11, 0.31), control: p(side * 0.19, 0.31))
            path.closeSubpath()
        }
        return path
    }
}

/// The rocket's exhaust, drawn nose-up in a square about the hull's centre
/// (units of the square): a round head against the tail and three pointed
/// tongues trailing away from it. Solid, with no inner cut-out.
private struct ArrivalsExhaustShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.midX + s * x, y: rect.midY + s * y) }
        // Apple draws the puff clear of the tail: the head sits 0.47 down the
        // rocket's axis and the whole shape is scaled with its radius.
        let c = 0.47, r = 0.085, scale = r / 0.075, k = 0.5523 * 0.075
        func q(_ x: Double, _ dy: Double) -> CGPoint { p(x * scale, c + dy * scale) }
        var path = Path()
        // Round head (toward the hull).
        path.move(to: q(-0.075, 0))
        path.addCurve(to: q(0, -0.075), control1: q(-0.075, -k), control2: q(-k, -0.075))
        path.addCurve(to: q(0.075, 0), control1: q(k, -0.075), control2: q(0.075, -k))
        // Right tongue, middle tongue, left tongue.
        path.addQuadCurve(to: q(0.060, 0.080), control: q(0.076, 0.050))
        path.addQuadCurve(to: q(0.027, 0.038), control: q(0.040, 0.048))
        path.addQuadCurve(to: q(0.000, 0.120), control: q(0.028, 0.085))
        path.addQuadCurve(to: q(-0.027, 0.038), control: q(-0.028, 0.085))
        path.addQuadCurve(to: q(-0.060, 0.080), control: q(-0.040, 0.048))
        path.addQuadCurve(to: q(-0.075, 0), control: q(-0.076, 0.050))
        path.closeSubpath()
        return path
    }
}

/// Games: a glass rocket climbing to the upper right.
private struct ArrivalsRocketArt: View {
    let edge: CGFloat
    let hull: Color
    let porthole: Color

    var body: some View {
        // Apple's hull is slimmer than a third of the tile and its porthole is
        // nearly two thirds of the hull across.
        let hullW = edge * 0.235
        let hullH = edge * 0.70
        ZStack {
            ArrivalsFinsShape().fill(hull.opacity(0.88))
            ArrivalsHullShape().fill(hull)
                .frame(width: hullW, height: hullH)
            // Nose cone light and the porthole.
            ArrivalsHullShape().fill(.white.opacity(0.35))
                .frame(width: hullW, height: hullH)
                .mask(alignment: .top) { Rectangle().frame(height: hullH * 0.34) }
            Circle().fill(porthole)
                .frame(width: edge * 0.14, height: edge * 0.14)
                .overlay(Circle().strokeBorder(.white.opacity(0.9), lineWidth: edge * 0.012))
                .offset(y: -edge * 0.13)
            // Exhaust: a solid glass puff under the tail.
            ArrivalsExhaustShape().fill(hull.opacity(0.7))
        }
        .frame(width: edge, height: edge)
        .shadow(color: .black.opacity(0.22), radius: edge * 0.02, y: edge * 0.012)
        .rotationEffect(.degrees(45))
        .offset(x: edge * 0.067, y: -edge * 0.087)
        .frame(width: edge, height: edge)
    }
}

// MARK: - Preview

/// The glass skirt of the loupe: from under the eyepiece out to a round
/// foot, in tile fractions.
private struct ArrivalsSkirtShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = rect.width
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        var path = Path()
        path.move(to: p(0.29, 0.47))
        path.addLine(to: p(0.17, 0.78))
        path.addQuadCurve(to: p(0.83, 0.78), control: p(0.5, 0.96))
        path.addLine(to: p(0.71, 0.47))
        path.closeSubpath()
        return path
    }
}

/// iOS 26 Preview: a charcoal loupe on a clear glass skirt, over blue.
private struct ArrivalsLoupe: View {
    let edge: CGFloat

    var body: some View {
        ZStack(alignment: .topLeading) {
            // The skirt and the bright pool of light at its foot.
            ArrivalsSkirtShape().fill(LinearGradient(colors: [.white.opacity(0.18), .white.opacity(0.38)], startPoint: .top, endPoint: .bottom))
            Ellipse().fill(.white.opacity(0.2))
                .frame(width: edge * 0.44, height: edge * 0.12)
                .offset(x: edge * 0.28, y: edge * 0.715)
            ArrivalsSkirtShape().stroke(.white.opacity(0.7), lineWidth: edge * 0.009)
            // The eyepiece: a dark drum with a lens in its top.
            Ellipse().fill(hex(0x1C1C1E))
                .frame(width: edge * 0.46, height: edge * 0.115)
                .offset(x: edge * 0.27, y: edge * 0.4125)
            Rectangle()
                .fill(LinearGradient(colors: [hex(0x1E1E20), hex(0x46464A), hex(0x2A2A2C), hex(0x151517)], startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * 0.46, height: edge * 0.245)
                .offset(x: edge * 0.27, y: edge * 0.225)
            Text("PREVIEW 10×")
                .font(.system(size: edge * 0.036, weight: .semibold))
                .foregroundStyle(.white.opacity(0.28))
                .frame(width: edge * 0.46)
                .offset(x: edge * 0.27, y: edge * 0.38)
            Ellipse().fill(LinearGradient(colors: [hex(0x5A5A5E), hex(0x28282A)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.46, height: edge * 0.135)
                .offset(x: edge * 0.27, y: edge * 0.1575)
            Ellipse().fill(RadialGradient(colors: [hex(0x8FE3F6), hex(0x2F92C0), hex(0x0E3A55)],
                                          center: .init(x: 0.45, y: 0.4), startRadius: 0, endRadius: edge * 0.15))
                .frame(width: edge * 0.32, height: edge * 0.09)
                .offset(x: edge * 0.34, y: edge * 0.18)
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}

/// iOS 27 Preview: a soft pastel picture with a glass loupe over its
/// lower-right corner.
private struct ArrivalsPictureLoupe: View {
    let edge: CGFloat

    var body: some View {
        ZStack(alignment: .topLeading) {
            // The picture: blue sky over a pink and gold wash.
            RoundedRectangle(cornerRadius: edge * 0.10, style: .continuous)
                .fill(LinearGradient(stops: [
                    .init(color: hex(0x59B8F9), location: 0),
                    .init(color: hex(0x8DAAF8), location: 0.42),
                    .init(color: hex(0xE0B8F9), location: 0.66),
                    .init(color: hex(0xF3C4FA), location: 0.82),
                    .init(color: hex(0xFFC85E), location: 1),
                ], startPoint: .top, endPoint: .bottom))
                .overlay {
                    // A white wisp across the middle.
                    Ellipse().fill(RadialGradient(colors: [.white.opacity(0.7), .white.opacity(0)], center: .center,
                                                  startRadius: 0, endRadius: edge * 0.2))
                        .frame(width: edge * 0.46, height: edge * 0.16)
                        .rotationEffect(.degrees(-20))
                        .offset(x: -edge * 0.05, y: edge * 0.02)
                }
                .frame(width: edge * 0.70, height: edge * 0.70)
                .offset(x: edge * 0.14, y: edge * 0.15)
            // The loupe: a clear disc with a black lens ring.
            ZStack {
                Circle().fill(.white.opacity(0.28))
                Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.95), .white.opacity(0.35)], startPoint: .topLeading, endPoint: .bottomTrailing),
                                      lineWidth: edge * 0.012)
                Circle().fill(RadialGradient(colors: [hex(0xE9B6F2), hex(0x9FA6F4)], center: .center, startRadius: 0, endRadius: edge * 0.1))
                    .frame(width: edge * 0.21, height: edge * 0.21)
                Circle().strokeBorder(LinearGradient(colors: [hex(0x3A3A3C), hex(0x121213)], startPoint: .top, endPoint: .bottom),
                                      lineWidth: edge * 0.075)
                    .frame(width: edge * 0.36, height: edge * 0.36)
                Circle().strokeBorder(.white.opacity(0.75), lineWidth: edge * 0.008)
                    .frame(width: edge * 0.215, height: edge * 0.215)
            }
            .frame(width: edge * 0.52, height: edge * 0.52)
            .shadow(color: .black.opacity(0.2), radius: edge * 0.025, y: edge * 0.02)
            .offset(x: edge * 0.40, y: edge * 0.40)
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}

// MARK: - Siri

/// The horizon across the Siri orb, in unit fractions of the orb. Traced
/// from the 1024 pt artwork (com.apple.campo): the white core sits at
/// (0.25, 0.453) (0.40, 0.476) (0.50, 0.514) (0.60, 0.552) (0.75, 0.579)
/// (0.80, 0.570) — it falls left to right the whole way, with no crest on
/// the left and no lift at the right rim.
private func arrivalsHorizon(_ path: inout Path, _ p: (Double, Double) -> CGPoint) {
    path.move(to: p(-0.02, 0.42))
    path.addCurve(to: p(0.30, 0.456), control1: p(0.14, 0.446), control2: p(0.20, 0.452))
    path.addCurve(to: p(0.62, 0.558), control1: p(0.42, 0.482), control2: p(0.50, 0.514))
    path.addCurve(to: p(1.02, 0.578), control1: p(0.72, 0.578), control2: p(0.84, 0.572))
}

private struct ArrivalsHorizonShape: Shape {
    func path(in rect: CGRect) -> Path {
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y) }
        var path = Path()
        arrivalsHorizon(&path, p)
        path.addLine(to: p(1.02, 1.1))
        path.addLine(to: p(-0.02, 1.1))
        path.closeSubpath()
        return path
    }
}

private struct ArrivalsHorizonLine: Shape {
    func path(in rect: CGRect) -> Path {
        func p(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y) }
        var path = Path()
        arrivalsHorizon(&path, p)
        return path
    }
}

/// One prism fringe of the Siri horizon: the horizon line nudged off the
/// white core, softened, and faded out at both rims.
private struct ArrivalsSiriFringe: View {
    var side: Double
    var dy: Double
    var colour: Color
    var width: Double
    var alpha: Double
    var soft: Double

    var body: some View {
        ArrivalsHorizonLine()
            .stroke(LinearGradient(stops: [
                .init(color: colour.opacity(0), location: 0.02),
                .init(color: colour.opacity(alpha), location: 0.24),
                .init(color: colour.opacity(alpha), location: 0.90),
                .init(color: colour.opacity(0), location: 1.0),
            ], startPoint: .leading, endPoint: .trailing),
                    style: StrokeStyle(lineWidth: side * width, lineCap: .round))
            .offset(y: side * dy)
            .blur(radius: side * soft / 80)
    }
}

/// iOS 27's Siri: a chrome sphere, charcoal above a prism-split horizon and
/// polished silver below it. Measured off the 1024 pt artwork:
/// - the cap is LIGHTEST near the middle (#5D5C5F at (0.41, 0.36)) and
///   darkest at the rim (#21242A), not the other way round;
/// - the split runs ACROSS the band, not along it: warm (#F9B897) about
///   3 units above the core, cyan 2 below, blue 4 below;
/// - the silver is a pool brightest at (0.50, 0.87) at #EDEFF1, falling to
///   #9FA1A3 out at the rims — it is not a horizontal band.
private struct ArrivalsSiriOrb: View {
    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                // The cap: light through the middle, near-black at the rim.
                Circle().fill(RadialGradient(colors: [hex(0x585A5F), hex(0x3D4045), hex(0x262A30), hex(0x1D2027)],
                                             center: .init(x: 0.45, y: 0.42),
                                             startRadius: 0, endRadius: side * 0.62))
                // The chrome below the horizon, and its caustic pool.
                ArrivalsHorizonShape()
                    .fill(LinearGradient(stops: [
                        .init(color: hex(0x5B5F64), location: 0.44),
                        .init(color: hex(0x7E8288), location: 0.62),
                        .init(color: hex(0x999CA0), location: 0.80),
                        .init(color: hex(0xA9ACAF), location: 1.0),
                    ], startPoint: .top, endPoint: .bottom))
                Circle()
                    .fill(RadialGradient(colors: [.white.opacity(0.74), .white.opacity(0.36), .white.opacity(0)],
                                         center: .center, startRadius: 0, endRadius: side * 0.41))
                    .frame(width: side * 0.82, height: side * 0.82)
                    .position(x: side * 0.5, y: side * 0.875)
                    .clipShape(ArrivalsHorizonShape())
                // The horizon, split across its thickness: warm above, cool below.
                ArrivalsSiriFringe(side: side, dy: -0.026, colour: hex(0xF9A985), width: 0.050, alpha: 0.95, soft: 1.6)
                ArrivalsSiriFringe(side: side, dy: 0.046, colour: hex(0x8FBAF9), width: 0.055, alpha: 0.80, soft: 1.9)
                ArrivalsSiriFringe(side: side, dy: 0.020, colour: hex(0xBDF4F9), width: 0.038, alpha: 0.95, soft: 1.3)
                ArrivalsSiriFringe(side: side, dy: -0.004, colour: hex(0xFFF6E4), width: 0.030, alpha: 0.80, soft: 1.0)
                ArrivalsSiriFringe(side: side, dy: 0, colour: hex(0xFDFDFD), width: 0.022, alpha: 1.0, soft: 0.55)
                // The flare where the band runs off the right rim.
                Circle()
                    .fill(RadialGradient(colors: [.white.opacity(0.85), .white.opacity(0.30), .white.opacity(0)],
                                         center: .init(x: 0.579, y: 0.5), startRadius: 0, endRadius: side * 0.19))
                    .frame(width: side * 0.38, height: side * 0.38)
                    .position(x: side * 0.93, y: side * 0.66)
                Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.5), .white.opacity(0.0), .black.opacity(0.2)],
                                                     startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: side * 0.015)
            }
            .clipShape(Circle())
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}
