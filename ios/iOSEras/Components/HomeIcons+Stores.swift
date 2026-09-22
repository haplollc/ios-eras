//
//  HomeIcons+Stores.swift
//  iOSEras
//
//  Icon designs, one entry per redesign, for: App Store, iTunes, YouTube,
//  Contacts, Voice Memos, Game Center, Newsstand, TV.
//  Hex values are sampled from Logopedia's renders of the real icons (or read
//  from their SVG fills); geometry is measured from the same renders. Spans
//  follow Logopedia's per-app histories. Where two releases landed in one
//  timeline year, the later one is the one shown (iOS 4.2 over 4.0, iOS 9
//  over 8.3/8.4, iOS 13.1 over 12.3, iOS 26.1 over 26.0).
//
//  Spans (timeline year = first year shown):
//    App Store   2008 tools A on a sunburst · 2010 Retina redraw · 2013 flat ring · 2017 three sticks
//                · 2024 iOS 18 · 2025 glass sticks · 2026 clear, overlapping sticks
//    iTunes      2007 down arrow (1.1) · 2008 notes · 2010 Retina · 2013 flat (7.0) · 2014 7.1 tint
//                · 2015 iOS 9 note · 2017 star · 2024 iOS 18 · 2025 glass · 2026 violet
//    YouTube     2007 CRT set · 2009 darkened (OS 3) · 2010 Retina · removed in iOS 6
//    Contacts    2008 address book · 2009 darkened · 2010 Retina, lettered tabs · 2013 grey bust
//                · 2015 San Francisco letters · 2017 man and woman · 2019 one person · 2024 thicker ring
//                · 2025 glass disc · 2026 shaded disc
//    Voice Memos 2009 chrome mic · 2010 white mic on blue (4.2) · 2013 black waveform · 2018 red/white
//                · 2024 gradient · 2025 glass · 2026 darker
//    Game Center 2010 four hobbies (4.1) · 2013 glass bubbles · removed in iOS 10
//    Newsstand   2011 wooden shelf · 2013 magazine fan · replaced by News in iOS 9
//    TV          2011 Videos clapper · 2013 flat clapper · 2016 TV set (10.2) · 2019 wordmark (13.1)
//                · 2025 iridescent wordmark (26.1) · 2026 softer
//

import SwiftUI

extension HomeApp {
    static let stores: [HomeApp] = [storesAppStore, storesITunes, storesYouTube, storesContacts,
                                    storesVoiceMemos, storesGameCenter, storesNewsstand, storesTV]

    // MARK: App Store

    private static let storesAppStore = HomeApp("App Store", designs: [
        // iPhone OS 2-3: a pencil, a paintbrush and a ruler make an A in a white ring, on a blue sunburst.
        design(2008, 0x1638BC, 0x2A62D0, art { edge in StoresAppStoreClassic(edge: edge, retina: false) }),
        // iOS 4-6: the Retina redraw: thinner ring, cyan rays up from the bottom.
        design(2010, 0x0A36B8, 0x2F80D8, art { edge in StoresAppStoreClassic(edge: edge, retina: true) }),
        // iOS 7-10: flat, gradient reversed (light on top), a thin ring round thin tools.
        design(2013, 0x64D0F9, 0x3465E7, art { edge in
            StoresToolsA(edge: edge, ring: 0.85, ringStroke: 0.034, tool: 0.05, ruler: 0.05,
                         detail: hex(0x5DAAF3), cutTop: hex(0x64D0F9), cutBottom: hex(0x3465E7))
        }),
        // iOS 11-17: three popsicle sticks; the crossbar and legs cut free of each other.
        design(2017, 0x1AC5FB, 0x1D73F2, art { edge in
            StoresSticksA(edge: edge, look: .solid, top: hex(0x1AC5FB), bottom: hex(0x1D73F2))
        }),
        // iOS 18: the release icon, a touch deeper at the bottom.
        design(2024, 0x19C7FC, 0x1C72F2, art { edge in
            StoresSticksA(edge: edge, look: .solid, top: hex(0x19C7FC), bottom: hex(0x1C72F2))
        }),
        // iOS 26: three whole sticks as frosted white glass, brighter where they overlap.
        design(2025, 0x21B4F9, 0x1A66F0, art { edge in
            StoresSticksA(edge: edge, look: .glass, top: hex(0x21B4F9), bottom: hex(0x1A66F0))
        }),
        // iOS 27 beta 5: deeper blue; the sticks clearer and whole, so each bar reads through the others.
        design(2026, 0x3F8EF1, 0x3162E2, art { edge in
            StoresSticksA(edge: edge, look: .clear, top: hex(0x3F8EF1), bottom: hex(0x3162E2))
        }),
    ])

    // MARK: iTunes / iTunes Store

    private static let storesITunes = HomeApp("iTunes", names: [(era(2007), "iTunes"), (era(2013), "iTunes Store")], designs: [
        // iPhone OS 1.1: a white down arrow in a ring on a purple sunburst.
        design(2007, 0x62207F, 0x9C45AE, art { edge in StoresITunesClassic(edge: edge, arrow: true, retina: false) }),
        // iPhone OS 2-3: the arrow becomes a pair of beamed eighth notes.
        design(2008, 0x66217F, 0xA048B2, art { edge in StoresITunesClassic(edge: edge, arrow: false, retina: false) }),
        // iOS 4-6: Retina redraw, a brighter violet and stronger rays.
        design(2010, 0x7A2894, 0xB252C0, art { edge in StoresITunesClassic(edge: edge, arrow: false, retina: true) }),
        // iOS 7.0: flat pink to violet, a thin ring, a big note.
        design(2013, 0xF95BC6, 0xA945FC, art { edge in StoresITunesFlat(edge: edge, variant: .ios7) }),
        // iOS 7.1: hotter magenta, the note a touch smaller.
        design(2014, 0xEE49BB, 0xC336F2, art { edge in StoresITunesFlat(edge: edge, variant: .ios71) }),
        // iOS 9: the note redrawn to match Apple Music's, on a more saturated magenta.
        design(2015, 0xF23EB9, 0xCB32FC, art { edge in StoresITunesFlat(edge: edge, variant: .ios9) }),
        // iOS 11-17: a white star, its arms faintly faceted.
        design(2017, 0xE94CC0, 0xCD44F3, art { edge in
            StoresITunesStar(edge: edge, fill: .white, facet: hex(0xC43FB5, 0.06), glass: false)
        }),
        // iOS 18: minor adjustments to the star (Logopedia); the same at icon size.
        design(2024, 0xE94CC0, 0xCD44F3, art { edge in
            StoresITunesStar(edge: edge, fill: .white, facet: hex(0xC43FB5, 0.06), glass: false)
        }),
        // iOS 26: a pink-white glass star.
        design(2025, 0xD458C2, 0xBB4FEC, art { edge in
            StoresITunesStar(edge: edge, fill: hex(0xF9D8F4, 0.88), facet: hex(0xB23FB0, 0.18), glass: true)
        }),
        // iOS 27: the tile turns violet, the star pale lavender.
        design(2026, 0xAD55E4, 0xA53EE2, art { edge in
            StoresITunesStar(edge: edge, fill: hex(0xF1DDFB, 0.88), facet: hex(0x8C3FD0, 0.18), glass: true)
        }),
    ])

    // MARK: YouTube

    private static let storesYouTube = HomeApp("YouTube", designs: [
        // iPhone OS 1-2: a walnut-framed tube television with a mustard bezel.
        design(2007, 0x7A4C2B, 0x6A3F24, art { edge in StoresYouTubeSet(edge: edge, retina: false) }),
        // iPhone OS 3: every icon slightly darkened.
        design(2009, 0x6E4427, 0x5E3820, art { edge in StoresYouTubeSet(edge: edge, retina: false, dim: 0.08) }),
        // iOS 4-5: the Retina redraw: pale cream bezel, bigger screen, chrome knobs.
        design(2010, 0x74502D, 0x876549, art { edge in StoresYouTubeSet(edge: edge, retina: true) }),
    ])

    // MARK: Contacts

    private static let storesContacts = HomeApp("Contacts", designs: [
        // iPhone OS 2: a tan spiral-bound address book with a brown bust.
        design(2008, 0xE4C295, 0xCCA66F, art { edge in StoresAddressBook(edge: edge, retina: false) }),
        // iPhone OS 3: every icon slightly darkened.
        design(2009, 0xD8B688, 0xBF9962, art { edge in StoresAddressBook(edge: edge, retina: false, dim: 0.07) }),
        // iOS 4-6: Retina redraw: grained leather, silver rings, tabs lettered A to F.
        design(2010, 0xE3BE86, 0xCB8D3A, art { edge in StoresAddressBook(edge: edge, retina: true) }),
        // iOS 7-8: flat grey, a huge grey bust, four tabs lettered A-D in Helvetica Neue.
        flat(2013, 0xDDDDDD, art { edge in StoresContactsBust(edge: edge, sanFrancisco: false) }),
        // iOS 9-10: the tab letters reset in San Francisco.
        flat(2015, 0xDDDDDD, art { edge in StoresContactsBust(edge: edge, sanFrancisco: true) }),
        // iOS 11-12: a man and a woman in a ring on stone; the letters gone.
        flat(2017, 0xD8D5CB, art { edge in StoresContactsCouple(edge: edge) }),
        // iOS 13-17: one generic person in the ring.                                   documented (SVG fills)
        flat(2019, 0xD8D6CC, art { edge in StoresContactRing(edge: edge, stroke: 0.024) }),
        // iOS 18: the ring thickened.                                                  documented (SVG fills)
        flat(2024, 0xD8D6CC, art { edge in StoresContactRing(edge: edge, stroke: 0.034) }),
        // iOS 26: a grey glass disc, a white person, three tabs melting into glass.
        design(2025, 0xD7D7C9, 0xCDCDC0, art { edge in StoresContactsGlass(edge: edge, beta5: false) }),
        // iOS 27 beta 5: the disc lifts on a shadow, the person solid white, tabs deeper.
        design(2026, 0xD7D7C9, 0xCFCEC1, art { edge in StoresContactsGlass(edge: edge, beta5: true) }),
    ])

    // MARK: Voice Memos

    private static let storesVoiceMemos = HomeApp("Voice Memos", designs: [
        // iPhone OS 3: a chrome studio microphone glowing red in the dark.
        design(2009, 0x3C0506, 0x240708, art { edge in StoresChromeMic(edge: edge) }),
        // iOS 4.2-6 (4.2 shipped November 2010): a flat white microphone on blue.
        design(2010, 0x0B57CC, 0x4ED2F9, art { edge in StoresWhiteMic(edge: edge) }),
        // iOS 7-11: a black waveform on white.
        flat(2013, 0xFFFFFF, art { edge in
            StoresBarsShape(heights: StoresBarsShape.apple2013, startX: 0.0219, pitch: 0.02727, barWidth: 0.0155)
                .fill(hex(0x1C1C1C))
        }),
        // iOS 12-17: black; red bars left of a blue playhead, white bars right of it.   documented (SVG fills)
        flat(2018, 0x1A1A1B, art { edge in StoresPlayheadWave(edge: edge, look: .ios12) }),
        // iOS 18: the black picks up a gradient.                                        documented (SVG fills)
        design(2024, 0x313130, 0x131313, art { edge in StoresPlayheadWave(edge: edge, look: .ios12) }),
        // iOS 26: Liquid Glass; fewer, wider-spaced bars, a softer blue.
        design(2025, 0x313131, 0x111111, art { edge in StoresPlayheadWave(edge: edge, look: .glass) }),
        // iOS 27: a darker tile, brighter white bars, one more of them.
        design(2026, 0x242424, 0x0F0F0F, art { edge in StoresPlayheadWave(edge: edge, look: .glass27) }),
    ])

    // MARK: Game Center

    private static let storesGameCenter = HomeApp("Game Center", designs: [
        // iOS 4.1-6: chess on wood, baseball on grass, a rocket in space, darts on cork.
        design(2010, 0x8E3A16, 0xDE8B3A, art { edge in StoresGameQuadrants(edge: edge) }),
        // iOS 7-9: four glossy bubbles on white.
        flat(2013, 0xFFFFFF, art { edge in StoresGameBubbles(edge: edge) }),
    ])

    // MARK: Newsstand

    private static let storesNewsstand = HomeApp("Newsstand", designs: [
        // iOS 5-6: an empty oak bookcase with two shelves.
        design(2011, 0xE2BF86, 0xDAAE70, art { edge in StoresShelf(edge: edge) }),
        // iOS 7-8: ART, TRAVEL and SPORTS covers fanned in front of a newspaper.
        design(2013, 0xFFFFFF, 0xEDEDED, art { edge in StoresMagazines(edge: edge) }),
    ])

    // MARK: Videos / TV

    private static let storesTV = HomeApp("TV", names: [(era(2011), "Videos"), (era(2016), "TV")], designs: [
        // iOS 5-6 Videos: a chevron clapper with a hinge pin over glassy teal.
        design(2011, 0x2680B0, 0x86D6E6, art { edge in StoresClapper(edge: edge, glossy: true) }),
        // iOS 7-10.1 Videos: flat chevrons over aqua-to-blue.
        design(2013, 0x50F0C8, 0x5AC8FA, art { edge in StoresClapper(edge: edge, glossy: false) }),
        // iOS 10.2-13.0 TV: a white-outlined set with a green-to-blue screen, on black.
        flat(2016, 0x1E1E1F, art { edge in StoresTVSet(edge: edge) }),
        // iOS 13.1-26.0: the white Apple TV wordmark on charcoal.
        design(2019, 0x323232, 0x121212, art { edge in StoresTVWordmark(edge: edge, look: .white) }),
        // iOS 26.1: the rebrand: white on top, an iridescent sweep along the bottom.
        design(2025, 0x313131, 0x131313, art { edge in StoresTVWordmark(edge: edge, look: .iridescent) }),
        // iOS 27: a darker tile, silvery letters, muted colours.
        design(2026, 0x1F1E1F, 0x0F0F0F, art { edge in StoresTVWordmark(edge: edge, look: .muted) }),
    ])
}

// MARK: - Shared bits

/// A soft radial pool of colour: the bright lower centre of the 2007-2012 sunbursts, or the red heart of Voice Memos.
private struct StoresGlow: View {
    let edge: CGFloat
    let colour: Color
    let centre: UnitPoint
    let radius: Double

    var body: some View {
        Rectangle()
            .fill(RadialGradient(colors: [colour, colour.opacity(0)], center: centre, startRadius: 0, endRadius: edge * radius))
            .frame(width: edge, height: edge)
    }
}

/// Sixteen faint rays from a centre, as one shape.
private struct StoresSunburst: View {
    let edge: CGFloat
    let centre: CGPoint
    let ink: Color

    var body: some View {
        StoresRaysShape(centre: centre, rays: 16, halfAngle: 4).fill(ink)
            .frame(width: edge, height: edge)
    }
}

private struct StoresRaysShape: Shape {
    var centre: CGPoint
    var rays: Int
    var halfAngle: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let c = CGPoint(x: rect.minX + rect.width * centre.x, y: rect.minY + rect.height * centre.y)
        let length = max(rect.width, rect.height) * 0.9
        for index in 0..<rays {
            let a = Double(index) / Double(rays) * 2 * .pi + .pi / Double(rays)
            let a0 = a - halfAngle * .pi / 180, a1 = a + halfAngle * .pi / 180
            path.move(to: c)
            path.addLine(to: CGPoint(x: c.x + cos(a0) * length, y: c.y + sin(a0) * length))
            path.addLine(to: CGPoint(x: c.x + cos(a1) * length, y: c.y + sin(a1) * length))
            path.closeSubpath()
        }
        return path
    }
}

/// A row of thin marks, for a ruler's ticks, a book's tab separators or wood grain.
private struct StoresTicksShape: Shape {
    var count: Int
    var vertical: Bool = false

    func path(in rect: CGRect) -> Path {
        var path = Path()
        for index in 0..<count {
            let t = (Double(index) + 0.5) / Double(count)
            if vertical {
                path.addRect(CGRect(x: rect.minX, y: rect.minY + rect.height * t - rect.height * 0.006, width: rect.width, height: max(0.6, rect.height * 0.012)))
            } else {
                path.addRect(CGRect(x: rect.minX + rect.width * t - rect.width * 0.02, y: rect.minY, width: max(0.6, rect.width * 0.04), height: rect.height))
            }
        }
        return path
    }
}

/// A triangle pointing down: a pencil's cone.
private struct StoresTipShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// One straight stroke between two points given as shares of the frame, round- or square-ended.
private struct StoresStroke: Shape {
    var from: CGPoint
    var to: CGPoint
    var width: Double
    var round = true

    func path(in rect: CGRect) -> Path {
        var line = Path()
        line.move(to: CGPoint(x: rect.minX + rect.width * from.x, y: rect.minY + rect.height * from.y))
        line.addLine(to: CGPoint(x: rect.minX + rect.width * to.x, y: rect.minY + rect.height * to.y))
        return line.strokedPath(StrokeStyle(lineWidth: rect.width * width, lineCap: round ? .round : .butt))
    }
}

/// A circle at a centre and radius given as shares of the frame, for clipping.
private struct StoresDisc: Shape {
    var centre: CGPoint
    var radius: Double

    func path(in rect: CGRect) -> Path {
        let r = rect.width * radius
        return Path(ellipseIn: CGRect(x: rect.minX + rect.width * centre.x - r, y: rect.minY + rect.height * centre.y - r,
                                      width: r * 2, height: r * 2))
    }
}

/// Lays a vertical drawing along the line from `from` (its top) to `to` (its bottom).
private struct StoresAlong<Content: View>: View {
    let edge: CGFloat
    let from: CGPoint
    let to: CGPoint
    let width: Double
    @ViewBuilder let content: (_ width: CGFloat, _ length: CGFloat) -> Content

    var body: some View {
        let dx = (to.x - from.x) * edge, dy = (to.y - from.y) * edge
        let length = (dx * dx + dy * dy).squareRoot()
        content(edge * width, length)
            .frame(width: edge * width, height: length)
            .rotationEffect(.radians(atan2(-dx, dy)))
            .position(x: (from.x + to.x) / 2 * edge, y: (from.y + to.y) / 2 * edge)
    }
}

/// The point at height `y` on the line through `a` and `b`.
private func storesPoint(on a: CGPoint, _ b: CGPoint, y: Double) -> CGPoint {
    let t = (y - a.y) / (b.y - a.y)
    return CGPoint(x: a.x + (b.x - a.x) * t, y: y)
}

// MARK: - App Store

/// 2008-2012: the sunburst tile with the tools A in a ring a little above centre.
private struct StoresAppStoreClassic: View {
    let edge: CGFloat
    let retina: Bool

    var body: some View {
        let centre = CGPoint(x: 0.5, y: 0.475)
        ZStack {
            StoresGlow(edge: edge, colour: hex(retina ? 0x6DD8EE : 0x52B6E6), centre: UnitPoint(x: 0.5, y: 1.0), radius: retina ? 0.6 : 0.5)
            StoresSunburst(edge: edge, centre: centre, ink: .white.opacity(retina ? 0.2 : 0.12))
            StoresToolsA(edge: edge, centre: centre, scale: 0.75, ring: retina ? 0.645 : 0.64,
                         ringStroke: retina ? 0.044 : 0.056, tool: retina ? 0.054 : 0.06, ruler: retina ? 0.066 : 0.072,
                         detail: hex(0x3C78D6), cutTop: hex(0x2350C8), cutBottom: hex(0x2350C8), glossy: true, ticks: !retina)
        }
        .frame(width: edge, height: edge)
    }
}

/// The 2008-2016 A: a pencil for the left leg (tip at the bottom left, eraser short of the apex), a paintbrush
/// for the right leg (handle end at the apex), a ruler for the crossbar, all in a ring. Geometry is the iOS 7
/// icon's, measured; `scale` shrinks it about `centre` for the smaller glossy ring.
private struct StoresToolsA: View {
    let edge: CGFloat
    var centre = CGPoint(x: 0.496, y: 0.49)
    var scale: Double = 1
    var ring: Double
    var ringStroke: Double
    var tool: Double
    var ruler: Double
    var ink: Color = .white
    var detail: Color
    var cutTop: Color
    var cutBottom: Color
    var glossy = false
    var ticks = false

    private func p(_ x: Double, _ y: Double) -> CGPoint {
        CGPoint(x: centre.x + (x - 0.496) * scale, y: centre.y + (y - 0.49) * scale)
    }

    var body: some View {
        let pencilTop = p(0.455, 0.334), pencilTip = p(0.262, 0.683)
        let brushTop = p(0.497, 0.262), brushTip = p(0.724, 0.683)
        let bar = p(0.4955, 0.50)
        let barWidth = 0.525 * scale
        let above = bar.y - ruler / 2 - 0.014, below = bar.y + ruler / 2 + 0.014
        let cut = LinearGradient(colors: [cutTop, cutBottom], startPoint: .top, endPoint: .bottom)
        let cutWidth = tool + (glossy ? 0.024 : 0.04)
        ZStack {
            Circle().strokeBorder(ink, lineWidth: edge * ringStroke)
                .frame(width: edge * ring, height: edge * ring)
                .position(x: edge * centre.x, y: edge * centre.y)
            StoresRuler(height: edge * ruler, ink: ink, detail: detail, ticks: ticks)
                .frame(width: edge * barWidth, height: edge * ruler)
                .position(x: edge * bar.x, y: edge * bar.y)
            // The pencil and brush lie across the ruler, each cut free of it by a sliver of background.
            StoresStroke(from: storesPoint(on: pencilTop, pencilTip, y: above), to: storesPoint(on: pencilTop, pencilTip, y: below),
                         width: cutWidth, round: false).fill(cut)
            StoresStroke(from: storesPoint(on: brushTop, brushTip, y: above), to: storesPoint(on: brushTop, brushTip, y: below),
                         width: cutWidth, round: false).fill(cut)
            StoresAlong(edge: edge, from: pencilTop, to: pencilTip, width: tool) { w, l in
                StoresPencil(width: w, length: l, ink: ink, detail: detail, lead: glossy ? hex(0x1D3F8F) : nil)
            }
            StoresAlong(edge: edge, from: brushTop, to: brushTip, width: tool) { w, l in
                StoresBrush(width: w, length: l, ink: ink, detail: detail)
            }
        }
        .frame(width: edge, height: edge)
    }
}

private struct StoresRuler: View {
    let height: CGFloat
    let ink: Color
    let detail: Color
    let ticks: Bool

    var body: some View {
        RoundedRectangle(cornerRadius: height * 0.15, style: .continuous).fill(ink)
            .overlay(alignment: .bottom) {
                if ticks {
                    StoresTicksShape(count: 9).fill(detail.opacity(0.8))
                        .frame(height: height * 0.3)
                        .padding(.horizontal, height * 0.5)
                }
            }
    }
}

/// A pencil standing on its point: round eraser end, a ferrule line, a sharpened cone.
private struct StoresPencil: View {
    let width: CGFloat
    let length: CGFloat
    let ink: Color
    let detail: Color
    let lead: Color?

    var body: some View {
        VStack(spacing: 0) {
            UnevenRoundedRectangle(topLeadingRadius: width * 0.5, bottomLeadingRadius: 0,
                                   bottomTrailingRadius: 0, topTrailingRadius: width * 0.5, style: .continuous)
                .fill(ink).frame(width: width, height: length * 0.75)
            StoresTipShape().fill(ink).frame(width: width, height: length * 0.25)
        }
        .overlay(alignment: .top) {
            VStack(spacing: 0) {
                Color.clear.frame(height: length * 0.14)
                detail.frame(width: width, height: max(0.5, length * 0.03))
                Spacer(minLength: 0)
                detail.frame(width: width, height: max(0.5, length * 0.03))
                Color.clear.frame(height: length * 0.25)
            }
        }
        .overlay(alignment: .bottom) {
            if let lead {
                StoresTipShape().fill(lead).frame(width: width * 0.34, height: length * 0.085)
            }
        }
    }
}

/// A paintbrush, handle end up: a long handle, a metal ferrule, a tapering tuft of bristles.
private struct StoresBrush: View {
    let width: CGFloat
    let length: CGFloat
    let ink: Color
    let detail: Color

    var body: some View {
        VStack(spacing: 0) {
            UnevenRoundedRectangle(topLeadingRadius: width * 0.45, bottomLeadingRadius: 0,
                                   bottomTrailingRadius: 0, topTrailingRadius: width * 0.45, style: .continuous)
                .fill(ink).frame(width: width * 0.9, height: length * 0.64)
            detail.frame(width: width * 1.1, height: max(0.5, length * 0.022))
            Rectangle().fill(ink).frame(width: width * 1.1, height: length * 0.11)
            StoresBristleShape().fill(ink).frame(width: width * 1.4, height: length * 0.228)
        }
    }
}

/// A brush's tuft: full width at the ferrule, curving to a point that flicks to one side.
private struct StoresBristleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX + rect.width * 0.1, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - rect.width * 0.1, y: rect.minY))
        path.addQuadCurve(to: CGPoint(x: rect.minX + rect.width * 0.72, y: rect.maxY),
                          control: CGPoint(x: rect.maxX + rect.width * 0.08, y: rect.minY + rect.height * 0.62))
        path.addQuadCurve(to: CGPoint(x: rect.minX + rect.width * 0.1, y: rect.minY),
                          control: CGPoint(x: rect.minX - rect.width * 0.12, y: rect.minY + rect.height * 0.5))
        path.closeSubpath()
        return path
    }
}

private enum StoresStickLook { case solid, glass, clear }

/// The 2017+ A, measured from the icon: the two legs cross just below their tips; the "/" leg stops at the
/// crossbar and resumes as a short stub below it; slivers of background mark where each stick passes over
/// the next. The glass sticks of iOS 26 and 27 drop the slivers: they are whole and overlap, the overlaps lighter.
private struct StoresSticksA: View {
    let edge: CGFloat
    let look: StoresStickLook
    let top: Color
    let bottom: Color

    var body: some View {
        let background = LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom)
        ZStack {
            stick(CGPoint(x: 0.437, y: 0.215), CGPoint(x: 0.748, y: 0.755), 0.085)
            stick(CGPoint(x: 0.558, y: 0.215), CGPoint(x: 0.252, y: 0.755), 0.085)
            stick(CGPoint(x: 0.19, y: 0.617), CGPoint(x: 0.805, y: 0.617), 0.072)
            if look == .solid {
                // "/" over "\" just below the crossing; the crossbar over the "/" leg; "\" over the crossbar.
                StoresStroke(from: CGPoint(x: 0.580, y: 0.291), to: CGPoint(x: 0.516, y: 0.405), width: 0.03, round: false).fill(background)
                StoresStroke(from: CGPoint(x: 0.22, y: 0.668), to: CGPoint(x: 0.38, y: 0.668), width: 0.03, round: false).fill(background)
                StoresStroke(from: CGPoint(x: 0.576, y: 0.572), to: CGPoint(x: 0.660, y: 0.720), width: 0.03, round: false).fill(background)
            }
        }
        .frame(width: edge, height: edge)
    }

    @ViewBuilder
    private func stick(_ a: CGPoint, _ b: CGPoint, _ width: Double) -> some View {
        let shape = StoresStroke(from: a, to: b, width: width)
        switch look {
        case .solid:
            shape.fill(.white)
        case .glass:
            shape.fill(LinearGradient(colors: [.white.opacity(0.80), hex(0xB6E2FE, 0.70)], startPoint: .top, endPoint: .bottom))
                .shadow(color: .black.opacity(0.16), radius: edge * 0.018, y: edge * 0.012)
                .overlay(shape.stroke(.white.opacity(0.6), lineWidth: max(0.5, edge * 0.007)))
        case .clear:
            shape.fill(LinearGradient(colors: [hex(0xF4FAFD, 0.72), hex(0xD2E8F8, 0.6)], startPoint: .top, endPoint: .bottom))
                .shadow(color: .black.opacity(0.14), radius: edge * 0.018, y: edge * 0.012)
                .overlay(shape.stroke(.white.opacity(0.7), lineWidth: max(0.5, edge * 0.007)))
        }
    }
}

// MARK: - iTunes

/// 2007-2012: the purple sunburst tile, a ring, and an arrow or the notes.
private struct StoresITunesClassic: View {
    let edge: CGFloat
    let arrow: Bool
    let retina: Bool

    var body: some View {
        let centre = CGPoint(x: 0.5, y: 0.475)
        ZStack {
            StoresGlow(edge: edge, colour: hex(retina ? 0xCF74D4 : 0xB85CC2), centre: UnitPoint(x: 0.5, y: 1.0), radius: retina ? 0.5 : 0.42)
            StoresSunburst(edge: edge, centre: centre, ink: .white.opacity(retina ? 0.14 : 0.09))
            Circle().strokeBorder(.white, lineWidth: edge * (retina ? 0.042 : 0.052))
                .frame(width: edge * 0.645, height: edge * 0.645)
                .position(x: edge * centre.x, y: edge * centre.y)
            if arrow {
                StoresDownArrow().fill(.white)
                    .frame(width: edge * 0.32, height: edge * 0.36)
                    .position(x: edge * 0.5, y: edge * 0.485)
            } else {
                StoresNoteShape(scale: 0.74, centre: CGPoint(x: 0.52, y: 0.48)).fill(.white)
                StoresNoteHeads(scale: 0.74, centre: CGPoint(x: 0.52, y: 0.48)).fill(.white)
            }
        }
        .frame(width: edge, height: edge)
    }
}

private enum StoresNoteVariant { case ios7, ios71, ios9 }

/// 2013-2016: a thin ring and a big pair of beamed notes.
private struct StoresITunesFlat: View {
    let edge: CGFloat
    let variant: StoresNoteVariant

    var body: some View {
        let scale = variant == .ios71 ? 0.95 : 1
        let rise = variant == .ios9 ? 0.062 : 0.047
        let head = variant == .ios9 ? 1.07 : 1
        ZStack {
            Circle().strokeBorder(.white, lineWidth: edge * 0.036)
                .frame(width: edge * 0.85, height: edge * 0.85)
                .position(x: edge * 0.4985, y: edge * 0.492)
            StoresNoteShape(scale: scale, beamRise: rise).fill(.white)
            StoresNoteHeads(scale: scale, head: head).fill(.white)
        }
        .frame(width: edge, height: edge)
    }
}

private struct StoresDownArrow: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width, h = rect.height
        path.move(to: CGPoint(x: rect.minX + w * 0.32, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX + w * 0.68, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX + w * 0.68, y: rect.minY + h * 0.50))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + h * 0.50))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + h * 0.50))
        path.addLine(to: CGPoint(x: rect.minX + w * 0.32, y: rect.minY + h * 0.50))
        path.closeSubpath()
        return path
    }
}

/// The two stems and the beam of the note as one outline (so nothing overlaps within the path).
/// Coordinates are the iOS 7 icon's, measured; `scale` shrinks them about `centre`.
private struct StoresNoteShape: Shape {
    var scale: Double = 1
    var centre = CGPoint(x: 0.49, y: 0.49)
    /// How much higher the beam's right end sits than its left.
    var beamRise: Double = 0.047
    var stem: Double = 0.027

    func path(in rect: CGRect) -> Path {
        func pt(_ x: Double, _ y: Double) -> CGPoint {
            CGPoint(x: rect.minX + rect.width * (centre.x + (x - 0.49) * scale),
                    y: rect.minY + rect.height * (centre.y + (y - 0.49) * scale))
        }
        let left = 0.375, right = 0.668, top = 0.292, thickness = 0.098
        func beamBottom(_ x: Double) -> Double { top + thickness - beamRise * (x - left) / (right - left) }
        var path = Path()
        path.move(to: pt(left, 0.662))
        path.addLine(to: pt(left, top))
        path.addLine(to: pt(right, top - beamRise))
        path.addLine(to: pt(right, 0.632))
        path.addLine(to: pt(right - stem, 0.632))
        path.addLine(to: pt(right - stem, beamBottom(right - stem)))
        path.addLine(to: pt(left + stem, beamBottom(left + stem)))
        path.addLine(to: pt(left + stem, 0.662))
        path.closeSubpath()
        return path
    }
}

/// The two tilted oval note heads, sitting at the foot of each stem on its left.
private struct StoresNoteHeads: Shape {
    var scale: Double = 1
    var centre = CGPoint(x: 0.49, y: 0.49)
    var head: Double = 1

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let rx = rect.width * 0.077 * head * scale, ry = rect.width * 0.057 * head * scale
        for (x, y) in [(0.325, 0.662), (0.594, 0.632)] {
            let cx = rect.minX + rect.width * (centre.x + (x - 0.49) * scale)
            let cy = rect.minY + rect.height * (centre.y + (y - 0.49) * scale)
            path.addEllipse(in: CGRect(x: -rx, y: -ry, width: rx * 2, height: ry * 2),
                            transform: CGAffineTransform(translationX: cx, y: cy).rotated(by: -22 * .pi / 180))
        }
        return path
    }
}

/// A five-pointed star, or just the clockwise half of each arm (its facets).
private struct StoresStarShape: Shape {
    var facets = false

    func path(in rect: CGRect) -> Path {
        let c = CGPoint(x: rect.midX, y: rect.midY)
        let outer = min(rect.width, rect.height) / 2
        let inner = outer * 0.40
        func vertex(_ i: Int) -> CGPoint {
            let a = Double(i) / 10 * 2 * .pi - .pi / 2
            let r = i.isMultiple(of: 2) ? outer : inner
            return CGPoint(x: c.x + cos(a) * r, y: c.y + sin(a) * r)
        }
        var path = Path()
        if facets {
            for arm in 0..<5 {
                path.move(to: c)
                path.addLine(to: vertex(arm * 2))
                path.addLine(to: vertex(arm * 2 + 1))
                path.closeSubpath()
            }
        } else {
            path.move(to: vertex(0))
            for i in 1..<10 { path.addLine(to: vertex(i)) }
            path.closeSubpath()
        }
        return path
    }
}

/// 2017+: the star, its arms split light and dark; from iOS 26 frosted glass with a rim and a shadow.
private struct StoresITunesStar: View {
    let edge: CGFloat
    let fill: Color
    let facet: Color
    let glass: Bool

    var body: some View {
        ZStack {
            StoresStarShape().fill(fill)
                .shadow(color: .black.opacity(glass ? 0.2 : 0), radius: edge * 0.022, y: edge * 0.016)
            StoresStarShape(facets: true).fill(facet)
            if glass {
                StoresStarShape().stroke(.white.opacity(0.65), style: StrokeStyle(lineWidth: max(0.5, edge * 0.009), lineJoin: .round))
            }
        }
        .frame(width: edge * 0.74, height: edge * 0.74)
        .offset(y: edge * 0.035)
    }
}

// MARK: - YouTube

/// The built-in YouTube app's tube television, seen head on; the tile's gradient is the walnut cabinet.
private struct StoresYouTubeSet: View {
    let edge: CGFloat
    let retina: Bool
    var dim: Double = 0

    var body: some View {
        let inset = retina ? 0.06 : 0.055
        let bezel: [Color] = retina
            ? [hex(0xBCA56A), hex(0xD6C18A), hex(0xE9D6AA), hex(0xF5E7C4), hex(0xFBEDCB)]
            : [hex(0xC6A157), hex(0xE3B862), hex(0xF8CB6D), hex(0xFFD88C), hex(0xFFE1A4)]
        let screen: [Gradient.Stop] = retina
            ? [.init(color: hex(0xD8DAD3), location: 0), .init(color: hex(0xB0B5AB), location: 0.22),
               .init(color: hex(0x9DA495), location: 0.42), .init(color: hex(0x7F8670), location: 0.52),
               .init(color: hex(0x8B947A), location: 0.72), .init(color: hex(0x97A384), location: 1)]
            : [.init(color: hex(0xCCD1C8), location: 0), .init(color: hex(0xA2AA98), location: 0.28),
               .init(color: hex(0x7C8770), location: 0.45), .init(color: hex(0x636F54), location: 0.56),
               .init(color: hex(0x6E7C5C), location: 0.8), .init(color: hex(0x7F9469), location: 1)]
        let screenShape = RoundedRectangle(cornerRadius: edge * (retina ? 0.2 : 0.17), style: .continuous)
        let knobY = retina ? 0.365 : 0.335
        ZStack {
            RoundedRectangle(cornerRadius: edge * 0.13, style: .continuous)
                .fill(LinearGradient(colors: bezel, startPoint: .top, endPoint: .bottom))
                .frame(width: edge * (1 - 2 * inset), height: edge * (1 - 2 * inset))
            screenShape
                .fill(LinearGradient(stops: screen, startPoint: .top, endPoint: .bottom))
                .overlay(screenShape.strokeBorder(hex(retina ? 0x4E5248 : 0x444C3A), lineWidth: max(0.6, edge * 0.014)))
                .frame(width: edge * (retina ? 0.82 : 0.80), height: edge * (retina ? 0.64 : 0.63))
                .offset(y: edge * (retina ? -0.06 : -0.075))
            ForEach([-1.0, 1.0], id: \.self) { side in
                ZStack {
                    Circle().fill(hex(retina ? 0xCFCFCF : 0x6C6766))
                    Circle().fill(hex(retina ? 0x262626 : 0x1B1717)).padding(edge * 0.022)
                    Circle().fill(hex(retina ? 0x9A9A9A : 0x5A4A40)).frame(width: edge * 0.035, height: edge * 0.035)
                }
                .frame(width: edge * 0.125, height: edge * 0.125)
                .offset(x: edge * 0.315 * side, y: edge * knobY)
            }
            StoresGrilleShape().fill(hex(retina ? 0x2A2A2A : 0x403838))
                .frame(width: edge * 0.22, height: edge * 0.085)
                .offset(y: edge * knobY)
            if dim > 0 {
                Rectangle().fill(.black.opacity(dim)).frame(width: edge, height: edge)
            }
        }
    }
}

/// Seven vertical bars, the middle tallest.
private struct StoresGrilleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let heights: [Double] = [0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4]
        let pitch = rect.width / 7
        for (index, h) in heights.enumerated() {
            let bar = CGRect(x: rect.minX + pitch * CGFloat(index) + pitch * 0.3, y: rect.midY - rect.height * h / 2,
                             width: pitch * 0.4, height: rect.height * h)
            path.addRoundedRect(in: bar, cornerSize: CGSize(width: bar.width / 2, height: bar.width / 2))
        }
        return path
    }
}

// MARK: - Contacts

/// iPhone OS 2-6: the spiral-bound address book; the tile's gradient is the cover.
private struct StoresAddressBook: View {
    let edge: CGFloat
    let retina: Bool
    var dim: Double = 0

    var body: some View {
        ZStack {
            // The spine and its wire rings down the left edge.
            Rectangle()
                .fill(LinearGradient(colors: [hex(retina ? 0x5E3E18 : 0xB0874F), hex(retina ? 0xA8783C : 0xD4AE78)],
                                     startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * 0.13, height: edge)
                .offset(x: -edge * 0.435)
            StoresCoilsShape(count: retina ? 10 : 9)
                .fill(LinearGradient(colors: [hex(0xFFFFFF), hex(0xA9A9AC)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.115, height: edge * 0.90)
                .offset(x: -edge * 0.445)
                .shadow(color: .black.opacity(0.45), radius: 0, y: max(0.5, edge * 0.008))
            StoresBookTabs(edge: edge, letters: retina)
            StoresBust(edge: edge, ink: hex(retina ? 0x4C2816 : 0x502F1C))
            if dim > 0 {
                Rectangle().fill(.black.opacity(dim))
            }
        }
        .frame(width: edge, height: edge)
    }
}

/// The binding's wire rings.
private struct StoresCoilsShape: Shape {
    var count: Int

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let pitch = rect.height / CGFloat(count)
        for index in 0..<count {
            let coil = CGRect(x: rect.minX, y: rect.minY + pitch * CGFloat(index) + pitch * 0.3, width: rect.width, height: pitch * 0.42)
            path.addRoundedRect(in: coil, cornerSize: CGSize(width: coil.height / 2, height: coil.height / 2))
        }
        return path
    }
}

/// Six dark leather thumb tabs down the right edge; lettered A-F on the Retina book.
private struct StoresBookTabs: View {
    let edge: CGFloat
    let letters: Bool

    var body: some View {
        let names = ["A", "B", "C", "D", "E", "F"]
        VStack(spacing: 0) {
            ForEach(0..<6, id: \.self) { index in
                ZStack {
                    LinearGradient(colors: [hex(0x7A4E2C), hex(0x42240F)], startPoint: .leading, endPoint: .trailing)
                    if letters {
                        Text(names[index])
                            .font(.system(size: edge * 0.06, weight: .bold))
                            .foregroundStyle(hex(0xEAD6AE))
                    }
                }
                .overlay(alignment: .bottom) {
                    Rectangle().fill(hex(0xD2AE80, 0.7)).frame(height: max(0.5, edge * 0.008))
                }
            }
        }
        .frame(width: edge * 0.13, height: edge)
        .offset(x: edge * 0.435)
    }
}

/// The brown bust on the old address book: a head over square-cut shoulders.
private struct StoresBust: View {
    let edge: CGFloat
    let ink: Color

    var body: some View {
        ZStack {
            Ellipse().fill(ink).frame(width: edge * 0.155, height: edge * 0.19).offset(y: -edge * 0.105)
            Rectangle().fill(ink).frame(width: edge * 0.08, height: edge * 0.07).offset(y: -edge * 0.01)
            UnevenRoundedRectangle(topLeadingRadius: edge * 0.11, bottomLeadingRadius: 0,
                                   bottomTrailingRadius: 0, topTrailingRadius: edge * 0.11, style: .continuous)
                .fill(ink)
                .frame(width: edge * 0.38, height: edge * 0.125)
                .offset(y: edge * 0.068)
            // The pressed edge catches the light under the shoulders.
            Rectangle().fill(.white.opacity(0.35)).frame(width: edge * 0.38, height: max(0.5, edge * 0.01)).offset(y: edge * 0.135)
        }
    }
}

/// iOS 7-10: the "no photo" bust in grey, big enough to run off the bottom, and four lettered tabs.
private struct StoresContactsBust: View {
    let edge: CGFloat
    let sanFrancisco: Bool

    var body: some View {
        let grey = hex(0x9A9A9A)
        let letterFont: Font = sanFrancisco
            ? .system(size: edge * 0.1, weight: .regular)
            : .custom("HelveticaNeue-Light", size: edge * 0.105)
        ZStack {
            StoresHeadShape().fill(grey)
            Ellipse().fill(grey).frame(width: edge * 1.10, height: edge * 0.44).position(x: edge * 0.40, y: edge * 1.02)
            StoresTabColumn(edge: edge, width: 0.19,
                            colours: [hex(0xC8C7C4), hex(0x5AC8FA), hex(0x4CD964), hex(0xFF9500)],
                            letters: ["A", "B", "C", "D"], font: letterFont, ink: hex(0x474747))
        }
        .frame(width: edge, height: edge)
    }
}

/// The iOS 7 "no photo" head and neck, measured: a domed crown, near-straight sides, a jaw tapering into the neck.
private struct StoresHeadShape: Shape {
    func path(in rect: CGRect) -> Path {
        func pt(_ x: Double, _ y: Double) -> CGPoint {
            CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y)
        }
        var path = Path()
        path.move(to: pt(0.19, 0.30))
        path.addQuadCurve(to: pt(0.405, 0.08), control: pt(0.19, 0.08))
        path.addQuadCurve(to: pt(0.62, 0.30), control: pt(0.62, 0.08))
        path.addLine(to: pt(0.62, 0.44))
        path.addQuadCurve(to: pt(0.53, 0.68), control: pt(0.60, 0.60))
        path.addLine(to: pt(0.53, 0.86))
        path.addLine(to: pt(0.28, 0.86))
        path.addLine(to: pt(0.28, 0.68))
        path.addQuadCurve(to: pt(0.19, 0.44), control: pt(0.21, 0.60))
        path.closeSubpath()
        return path
    }
}

/// The right-hand column of coloured tabs, optionally lettered; `soft` blends them as Liquid Glass does.
private struct StoresTabColumn: View {
    let edge: CGFloat
    let width: Double
    let colours: [Color]
    var letters: [String] = []
    var font: Font = .system(size: 10)
    var ink: Color = .clear
    var soft = false

    var body: some View {
        Group {
            if soft {
                LinearGradient(stops: softStops, startPoint: .top, endPoint: .bottom)
                    .overlay(alignment: .leading) {
                        // The glass tab bleeds a little light into the page beside it.
                        LinearGradient(colors: [.white.opacity(0), .white.opacity(0.35)], startPoint: .leading, endPoint: .trailing)
                            .frame(width: edge * width * 0.35)
                    }
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(colours.enumerated()), id: \.offset) { index, colour in
                        ZStack {
                            colour
                            if index < letters.count {
                                Text(letters[index]).font(font).foregroundStyle(ink)
                            }
                        }
                    }
                }
                .overlay(alignment: .leading) {
                    Rectangle().fill(.black.opacity(0.10)).frame(width: max(0.5, edge * 0.006))
                }
            }
        }
        .frame(width: edge * width, height: edge)
        .offset(x: edge * (0.5 - width / 2))
    }

    private var softStops: [Gradient.Stop] {
        let n = Double(colours.count)
        var stops: [Gradient.Stop] = []
        for (index, colour) in colours.enumerated() {
            stops.append(.init(color: colour, location: Double(index) / n + (index == 0 ? 0 : 0.035)))
            stops.append(.init(color: colour, location: Double(index + 1) / n - (index == colours.count - 1 ? 0 : 0.035)))
        }
        return stops
    }
}

/// iOS 11-12: a man and, in front of him, a woman with long hair, in a ring on stone.
private struct StoresContactsCouple: View {
    let edge: CGFloat

    var body: some View {
        let ink = hex(0xA9A19B), paper = hex(0xD8D5CB)
        ZStack {
            Circle().strokeBorder(ink, lineWidth: edge * 0.025)
                .frame(width: edge * 0.63, height: edge * 0.63)
                .position(x: edge * 0.435, y: edge * 0.50)
            ZStack {
                // Him.
                Circle().fill(ink).frame(width: edge * 0.19, height: edge * 0.19).position(x: edge * 0.325, y: edge * 0.44)
                Rectangle().fill(ink).frame(width: edge * 0.10, height: edge * 0.12).position(x: edge * 0.325, y: edge * 0.58)
                RoundedRectangle(cornerRadius: edge * 0.11, style: .continuous).fill(ink)
                    .frame(width: edge * 0.36, height: edge * 0.34).position(x: edge * 0.25, y: edge * 0.80)
                // Her, cut free of him by a sliver of stone.
                her(paper, pad: 0.022)
                her(ink, pad: 0)
            }
            .frame(width: edge, height: edge)
            .clipShape(StoresDisc(centre: CGPoint(x: 0.435, y: 0.5), radius: 0.3))
            StoresTabColumn(edge: edge, width: 0.115, colours: [hex(0xC4C2BA), hex(0x5AC8FA), hex(0xFF9500), hex(0x4CD964)])
        }
        .frame(width: edge, height: edge)
    }

    private func her(_ colour: Color, pad: Double) -> some View {
        ZStack {
            UnevenRoundedRectangle(topLeadingRadius: edge * (0.11 + pad), bottomLeadingRadius: edge * 0.05,
                                   bottomTrailingRadius: edge * 0.05, topTrailingRadius: edge * (0.11 + pad), style: .continuous)
                .fill(colour)
                .frame(width: edge * (0.22 + pad * 2), height: edge * (0.29 + pad * 2))
                .position(x: edge * 0.55, y: edge * 0.485)
            Rectangle().fill(colour)
                .frame(width: edge * (0.13 + pad * 2), height: edge * 0.10)
                .position(x: edge * 0.55, y: edge * 0.65)
            RoundedRectangle(cornerRadius: edge * (0.12 + pad), style: .continuous).fill(colour)
                .frame(width: edge * (0.34 + pad * 2), height: edge * (0.32 + pad * 2))
                .position(x: edge * 0.535, y: edge * 0.83)
        }
    }
}

/// iOS 13-18: one generic person in a ring, the shoulders cut by the ring.
private struct StoresContactRing: View {
    let edge: CGFloat
    let stroke: Double

    var body: some View {
        let ink = hex(0xA9A29A)
        ZStack {
            // Apple's shoulders are a wide circular cap that runs INTO the ring and merges with it,
            // not a rounded box floating clear of it: a 0.567 disc set low, clipped by the ring's
            // OUTER edge (0.31). Head, body and ring are measured off the shipping iOS 18 icon.
            Circle().strokeBorder(ink, lineWidth: edge * stroke)
                .frame(width: edge * 0.62, height: edge * 0.62)
                .position(x: edge * 0.434, y: edge * 0.50)
            ZStack {
                Circle().fill(ink).frame(width: edge * 0.218, height: edge * 0.218).position(x: edge * 0.434, y: edge * 0.432)
                Circle().fill(ink).frame(width: edge * 0.567, height: edge * 0.567).position(x: edge * 0.434, y: edge * 0.883)
            }
            .frame(width: edge, height: edge)
            .clipShape(StoresDisc(centre: CGPoint(x: 0.434, y: 0.5), radius: 0.31))
            StoresTabColumn(edge: edge, width: 0.115, colours: [hex(0xC4C2BA), hex(0x5AC8FA), hex(0xFF9500), hex(0x4CD964)])
        }
        .frame(width: edge, height: edge)
    }
}

/// iOS 26+: a grey glass disc holding a white head and a lens-shaped body; three glass tabs.
private struct StoresContactsGlass: View {
    let edge: CGFloat
    let beta5: Bool

    var body: some View {
        let centre = CGPoint(x: 0.437, y: 0.5)
        ZStack {
            StoresTabColumn(edge: edge, width: 0.115,
                            colours: beta5 ? [hex(0x6FBBEF), hex(0xEE9335), hex(0x6AD463)]
                                           : [hex(0x58C4F7), hex(0xFC9719), hex(0x61D874)],
                            soft: true)
            Circle()
                .fill(LinearGradient(colors: beta5 ? [hex(0xA4A296), hex(0xABA89B)] : [hex(0x96928A), hex(0xA29F93)],
                                     startPoint: .top, endPoint: .bottom))
                .overlay(Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.55), .white.opacity(0.1), .white.opacity(0.35)],
                                                              startPoint: .top, endPoint: .bottom),
                                               lineWidth: max(0.5, edge * 0.01)))
                .frame(width: edge * 0.632, height: edge * 0.632)
                .shadow(color: .black.opacity(beta5 ? 0.22 : 0.07), radius: edge * 0.025, y: edge * 0.016)
                .position(x: edge * centre.x, y: edge * centre.y)
            Circle().fill(.white.opacity(beta5 ? 1 : 0.96))
                .frame(width: edge * 0.25, height: edge * 0.25)
                .position(x: edge * 0.438, y: edge * 0.425)
            Ellipse()
                .fill(.white.opacity(beta5 ? 1 : 0.72))
                .overlay(Ellipse().strokeBorder(.white.opacity(beta5 ? 0 : 0.95), lineWidth: max(0.5, edge * 0.012)))
                .frame(width: edge * 0.42, height: edge * 0.22)
                .position(x: edge * 0.437, y: edge * 0.72)
                .frame(width: edge, height: edge)
                .clipShape(StoresDisc(centre: centre, radius: 0.30))
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Voice Memos

/// iPhone OS 3: a chrome studio microphone, mesh head over a bright collar, on a thin stand.
private struct StoresChromeMic: View {
    let edge: CGFloat

    var body: some View {
        let chrome = LinearGradient(colors: [hex(0x7E7E82), hex(0xF6F6F8), hex(0xBDBDC1), hex(0x5A5A5E)],
                                    startPoint: .leading, endPoint: .trailing)
        ZStack {
            StoresGlow(edge: edge, colour: hex(0xD01E26), centre: UnitPoint(x: 0.5, y: 0.42), radius: 0.64)
            Rectangle().fill(chrome).frame(width: edge * 0.05, height: edge * 0.36).offset(y: edge * 0.33)
            RoundedRectangle(cornerRadius: edge * 0.03, style: .continuous)
                .fill(LinearGradient(colors: [hex(0x2A2A2C), hex(0x6E6E72), hex(0x1A1A1C)], startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * 0.32, height: edge * 0.09)
                .offset(y: edge * 0.115)
            Capsule()
                .fill(RadialGradient(colors: [hex(0x4A4A4E), hex(0x121214)], center: UnitPoint(x: 0.4, y: 0.35),
                                     startRadius: 0, endRadius: edge * 0.28))
                .frame(width: edge * 0.42, height: edge * 0.54)
                .offset(y: -edge * 0.18)
            StoresDotGridShape(columns: 7, rows: 12).fill(hex(0xD4D4D8))
                .frame(width: edge * 0.34, height: edge * 0.48)
                .clipShape(Capsule())
                .offset(y: -edge * 0.18)
            Capsule().strokeBorder(chrome, lineWidth: edge * 0.022)
                .frame(width: edge * 0.42, height: edge * 0.54)
                .offset(y: -edge * 0.18)
            RoundedRectangle(cornerRadius: edge * 0.015, style: .continuous).fill(chrome)
                .frame(width: edge * 0.46, height: edge * 0.075)
                .offset(y: edge * 0.035)
        }
        .frame(width: edge, height: edge)
    }
}

/// A grid of small round holes, as one shape.
private struct StoresDotGridShape: Shape {
    var columns: Int
    var rows: Int

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let dx = rect.width / CGFloat(columns), dy = rect.height / CGFloat(rows)
        let d = min(dx, dy) * 0.5
        for row in 0..<rows {
            let shift = row.isMultiple(of: 2) ? 0 : dx / 2
            for column in 0..<columns {
                let x = rect.minX + dx * (CGFloat(column) + 0.5) + shift - dx / 4
                let y = rect.minY + dy * (CGFloat(row) + 0.5)
                path.addEllipse(in: CGRect(x: x - d / 2, y: y - d / 2, width: d, height: d))
            }
        }
        return path
    }
}

/// iOS 4.2-6: the flat white microphone in its U-shaped cradle, on a deep-blue-to-cyan tile.
private struct StoresWhiteMic: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            Rectangle().fill(LinearGradient(stops: [.init(color: hex(0x1A63D3), location: 0), .init(color: hex(0x0450C8), location: 0.55),
                                                    .init(color: hex(0x4FD2F9), location: 1)],
                                            startPoint: .top, endPoint: .bottom))
            RoundedRectangle(cornerRadius: edge * 0.02, style: .continuous).fill(.white)
                .frame(width: edge * 0.36, height: edge * 0.045)
                .offset(y: edge * 0.32)
            Rectangle().fill(.white).frame(width: edge * 0.045, height: edge * 0.16).offset(y: edge * 0.225)
            Circle().trim(from: 0, to: 0.5)
                .stroke(.white, style: StrokeStyle(lineWidth: edge * 0.036, lineCap: .round))
                .frame(width: edge * 0.42, height: edge * 0.42)
                .offset(y: -edge * 0.05)
            Capsule().fill(LinearGradient(colors: [.white, hex(0xD9EFFF)], startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * 0.26, height: edge * 0.42)
                .offset(y: -edge * 0.13)
            Rectangle().fill(hex(0x8CC4F0)).frame(width: edge * 0.26, height: max(0.5, edge * 0.012)).offset(y: -edge * 0.03)
        }
        .frame(width: edge, height: edge)
    }
}

/// A row of round-ended bars centred on the midline. Positions and heights are shares of the edge.
private struct StoresBarsShape: Shape {
    var heights: [Double]
    var startX: Double
    var pitch: Double
    var barWidth: Double

    /// The iOS 7 icon's waveform (of the word "Apple"), measured, left to right, with the dotted
    /// baseline running out to both edges.
    static let apple2013: [Double] = [0.018, 0.02, 0.018, 0.02, 0.021, 0.028, 0.021, 0.032, 0.066, 0.283, 0.211, 0.397, 0.352, 0.836, 0.579, 0.597,
                                      0.354, 0.233, 0.110, 0.238, 0.188, 0.273, 0.106, 0.115, 0.126, 0.083, 0.055, 0.071,
                                      0.039, 0.035, 0.041, 0.028, 0.02, 0.018, 0.02, 0.018]

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let e = rect.width
        let w = e * barWidth
        for (index, h) in heights.enumerated() {
            let height = max(w, e * h)
            let bar = CGRect(x: rect.minX + e * (startX + pitch * Double(index)) - w / 2, y: rect.midY - height / 2,
                             width: w, height: height)
            path.addRoundedRect(in: bar, cornerSize: CGSize(width: w / 2, height: w / 2))
        }
        return path
    }
}

private enum StoresWaveLook { case ios12, glass, glass27 }

/// iOS 12+: red bars (what has played), a blue playhead with a dot at each end, white bars (what is to come).
/// Bar lists are measured from the icons.
private struct StoresPlayheadWave: View {
    let edge: CGFloat
    let look: StoresWaveLook

    var body: some View {
        let isGlass = look != .ios12
        let red = look == .ios12 ? hex(0xFF3B30) : look == .glass ? hex(0xDB4C3A) : hex(0xDB5547)
        let white = look == .glass ? hex(0xEFEFEF) : .white
        let blue = look == .ios12 ? hex(0x1BADF8) : look == .glass ? hex(0x4D8CE4) : hex(0x5292F0)
        let reds: [Double] = isGlass
            ? [0.047, 0.148, 0.097, 0.343, 0.266, 0.765, 0.515, 0.577, 0.242, 0.343]
            : [0.016, 0.031, 0.023, 0.023, 0.016, 0.047, 0.086, 0.250, 0.180, 0.375, 0.320, 0.656, 0.508, 0.523,
               0.328, 0.203, 0.117, 0.211]
        let whites: [Double] = look == .ios12
            ? [0.242, 0.102, 0.117, 0.133, 0.086, 0.055, 0.070, 0.047, 0.039, 0.039, 0.031, 0.047, 0.031, 0.023,
               0.031, 0.016, 0.016]
            : look == .glass ? [0.075, 0.202, 0.266, 0.116, 0.165, 0.047, 0.097, 0.047, 0.022]
                             : [0.076, 0.205, 0.265, 0.114, 0.167, 0.045, 0.098, 0.045, 0.023, 0.038]
        let headX = isGlass ? 0.499 : 0.512
        let reach = isGlass ? 0.393 : 0.3765
        let dot = isGlass ? 0.057 : 0.059
        ZStack {
            StoresBarsShape(heights: reds, startX: isGlass ? 0.10 : 0.023, pitch: isGlass ? 0.03988 : 0.0271,
                            barWidth: isGlass ? 0.015 : 0.016)
                .fill(red)
            StoresBarsShape(heights: whites, startX: isGlass ? 0.539 : 0.537, pitch: isGlass ? 0.0399 : 0.02725,
                            barWidth: isGlass ? 0.015 : 0.016)
                .fill(white)
            Capsule().fill(blue).frame(width: edge * 0.016, height: edge * reach * 2)
                .offset(x: edge * (headX - 0.5))
            ForEach([-1.0, 1.0], id: \.self) { side in
                Circle().fill(blue)
                    .overlay(Circle().fill(.white.opacity(isGlass ? 0.35 : 0)).frame(width: edge * dot * 0.4, height: edge * dot * 0.4)
                        .offset(x: -edge * dot * 0.14, y: -edge * dot * 0.14))
                    .frame(width: edge * dot, height: edge * dot)
                    .offset(x: edge * (headX - 0.5), y: edge * reach * side)
            }
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Game Center

/// iOS 4.1-6: a walnut-and-maple chessboard with a knight, a bat and ball on grass, a rocket in space, a dart in cork.
private struct StoresGameQuadrants: View {
    let edge: CGFloat

    var body: some View {
        let q = edge / 2
        ZStack {
            QuadrantArt(colours: [hex(0xDB8E2C), hex(0x5E9A05), hex(0x2A62D6), hex(0xDE8B3A)], seam: .black.opacity(0.45))
                .frame(width: edge, height: edge)
            // Chess: dark squares top left and bottom right, a white knight.
            StoresCheckerShape(divisions: 2).fill(hex(0x6A2208))
                .frame(width: q, height: q).offset(x: -q / 2, y: -q / 2)
            StoresKnightShape().fill(.white)
                .frame(width: edge * 0.30, height: edge * 0.36)
                .offset(x: -edge * 0.255, y: -edge * 0.245)
                .shadow(color: .black.opacity(0.4), radius: edge * 0.01, y: edge * 0.01)
            // Baseball: the bat's barrel up to the right, its knob down to the left, the ball top left.
            StoresStroke(from: CGPoint(x: 0.69, y: 0.31), to: CGPoint(x: 0.875, y: 0.125), width: 0.1).fill(.white)
            StoresStroke(from: CGPoint(x: 0.60, y: 0.40), to: CGPoint(x: 0.73, y: 0.27), width: 0.045).fill(.white)
            Circle().fill(.white).frame(width: edge * 0.055, height: edge * 0.055).position(x: edge * 0.595, y: edge * 0.405)
            Circle().fill(.white).frame(width: edge * 0.075, height: edge * 0.075).position(x: edge * 0.615, y: edge * 0.135)
            // Space: a deeper blue with a few stars, a white rocket climbing to the right.
            Rectangle().fill(RadialGradient(colors: [hex(0x3F86E0), hex(0x1C47C8)], center: .init(x: 0.4, y: 0.4),
                                            startRadius: 0, endRadius: q * 0.9))
                .frame(width: q, height: q).offset(x: -q / 2, y: q / 2)
            StoresStarsShape().fill(.white.opacity(0.8)).frame(width: q, height: q).offset(x: -q / 2, y: q / 2)
            StoresRocket(size: edge * 0.5, window: hex(0x2A62D6))
                .offset(x: -edge * 0.245, y: edge * 0.245)
            // Darts: a thick ring and a bull on cork, the dart in from the top left.
            Circle().strokeBorder(.white, lineWidth: edge * 0.042)
                .frame(width: edge * 0.31, height: edge * 0.31).position(x: edge * 0.755, y: edge * 0.755)
            Circle().fill(.white).frame(width: edge * 0.09, height: edge * 0.09).position(x: edge * 0.755, y: edge * 0.755)
            StoresStroke(from: CGPoint(x: 0.63, y: 0.63), to: CGPoint(x: 0.75, y: 0.75), width: 0.03).fill(.white)
            StoresStroke(from: CGPoint(x: 0.595, y: 0.645), to: CGPoint(x: 0.645, y: 0.595), width: 0.035).fill(.white)
        }
        .frame(width: edge, height: edge)
    }
}

/// The dark squares of a checkerboard, starting top left.
private struct StoresCheckerShape: Shape {
    var divisions: Int

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let w = rect.width / CGFloat(divisions), h = rect.height / CGFloat(divisions)
        for row in 0..<divisions {
            for column in 0..<divisions where (row + column).isMultiple(of: 2) {
                path.addRect(CGRect(x: rect.minX + w * CGFloat(column), y: rect.minY + h * CGFloat(row), width: w, height: h))
            }
        }
        return path
    }
}

/// A chess knight's silhouette facing left: a horse's head with ears and a long snout on a stepped base.
private struct StoresKnightShape: Shape {
    func path(in rect: CGRect) -> Path {
        let points: [(Double, Double)] = [
            (0.12, 1.00), (0.90, 1.00), (0.90, 0.90), (0.78, 0.86), (0.82, 0.66), (0.88, 0.44), (0.84, 0.24),
            (0.70, 0.10), (0.56, 0.04), (0.50, 0.00), (0.44, 0.08), (0.34, 0.12), (0.18, 0.26), (0.04, 0.44),
            (0.00, 0.54), (0.08, 0.62), (0.20, 0.60), (0.32, 0.54), (0.44, 0.52), (0.40, 0.66), (0.30, 0.80),
            (0.26, 0.86), (0.12, 0.90),
        ]
        var path = Path()
        for (index, p) in points.enumerated() {
            let point = CGPoint(x: rect.minX + rect.width * p.0, y: rect.minY + rect.height * p.1)
            if index == 0 { path.move(to: point) } else { path.addLine(to: point) }
        }
        path.closeSubpath()
        return path
    }
}

/// A white rocket climbing to the upper right: a pointed body with a porthole, two fins, a flame.
private struct StoresRocket: View {
    let size: CGFloat
    let window: Color

    var body: some View {
        ZStack {
            StoresFlameShape().fill(.white).frame(width: size * 0.12, height: size * 0.2).offset(y: size * 0.37)
            StoresFinsShape().fill(.white).frame(width: size * 0.46, height: size * 0.3).offset(y: size * 0.14)
            StoresRocketBodyShape().fill(.white).frame(width: size * 0.24, height: size * 0.6).offset(y: -size * 0.04)
            Circle().fill(window).frame(width: size * 0.1, height: size * 0.1).offset(y: -size * 0.1)
        }
        .frame(width: size, height: size)
        .rotationEffect(.degrees(45))
    }
}

/// A rocket's body: a pointed nose swelling to full width, then tapering a little to the tail.
private struct StoresRocketBodyShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addQuadCurve(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.5),
                          control: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.12))
        path.addLine(to: CGPoint(x: rect.maxX - rect.width * 0.14, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX + rect.width * 0.14, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.5))
        path.addQuadCurve(to: CGPoint(x: rect.midX, y: rect.minY),
                          control: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.12))
        path.closeSubpath()
        return path
    }
}

/// Two swept fins, one each side of a rocket's tail.
private struct StoresFinsShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        for side in [-1.0, 1.0] {
            func pt(_ x: Double, _ y: Double) -> CGPoint {
                CGPoint(x: rect.midX + rect.width * x * side, y: rect.minY + rect.height * y)
            }
            path.move(to: pt(0.18, 0.0))
            path.addLine(to: pt(0.5, 0.72))
            path.addLine(to: pt(0.5, 1.0))
            path.addLine(to: pt(0.18, 0.78))
            path.closeSubpath()
        }
        return path
    }
}

/// A flame: round at the top, a point at the bottom.
private struct StoresFlameShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addQuadCurve(to: CGPoint(x: rect.midX, y: rect.maxY), control: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.6))
        path.addQuadCurve(to: CGPoint(x: rect.minX, y: rect.minY), control: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.6))
        path.closeSubpath()
        return path
    }
}

/// A scatter of tiny stars.
private struct StoresStarsShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let points: [(Double, Double, Double)] = [(0.12, 0.14, 0.03), (0.30, 0.08, 0.02), (0.82, 0.12, 0.025), (0.90, 0.40, 0.02),
                                                  (0.18, 0.44, 0.02), (0.70, 0.30, 0.015), (0.86, 0.80, 0.025), (0.10, 0.86, 0.02), (0.50, 0.92, 0.015)]
        for (x, y, r) in points {
            let d = rect.width * r
            path.addEllipse(in: CGRect(x: rect.minX + rect.width * x - d / 2, y: rect.minY + rect.height * y - d / 2, width: d, height: d))
        }
        return path
    }
}

/// iOS 7-9: four glossy bubbles, measured: a big blue one left, a yellow one top right that turns green
/// where it lies over the blue, purple low left, pink in front.
private struct StoresGameBubbles: View {
    let edge: CGFloat

    var body: some View {
        let blueDia = 0.62, blueAt = CGPoint(x: 0.398, y: 0.433)
        let yellowDia = 0.48, yellowAt = CGPoint(x: 0.614, y: 0.35)
        ZStack {
            bubble([hex(0x6A8CF2), hex(0x16AAFD), hex(0x08C4FF), hex(0x34CCF2)], start: .top, end: .bottom, dia: blueDia, at: blueAt)
            // The green lens is the yellow bubble seen through the blue one.
            bubble([hex(0xF0C200), hex(0xFFE100), hex(0xF8EA4A)], start: .top, end: .bottom, dia: yellowDia, at: yellowAt) {
                Circle().fill(LinearGradient(colors: [hex(0x5E9E00), hex(0x3B9B00), hex(0x12AA13), hex(0x02B34D)],
                                             startPoint: .top, endPoint: .bottom))
                    .mask {
                        Circle()
                            .frame(width: edge * blueDia, height: edge * blueDia)
                            .offset(x: edge * (blueAt.x - yellowAt.x), y: edge * (blueAt.y - yellowAt.y))
                    }
            }
            bubble([hex(0x7A2ED6), hex(0xB42AEC), hex(0x7447FB)], start: .top, end: .bottom, dia: 0.30, at: CGPoint(x: 0.37, y: 0.78))
            bubble([hex(0xFF4A6C), hex(0xFF2C8E), hex(0xFF3A7E), hex(0xFFB145)], start: .top, end: .bottom, dia: 0.43, at: CGPoint(x: 0.67, y: 0.655))
        }
        .frame(width: edge, height: edge)
    }

    private func bubble(_ colours: [Color], start: UnitPoint, end: UnitPoint, dia: Double, at centre: CGPoint) -> some View {
        bubble(colours, start: start, end: end, dia: dia, at: centre) { EmptyView() }
    }

    /// `lens` is drawn over the bubble's body, under its rim and highlight.
    private func bubble<Lens: View>(_ colours: [Color], start: UnitPoint, end: UnitPoint, dia: Double, at centre: CGPoint,
                                    @ViewBuilder lens: () -> Lens) -> some View {
        ZStack {
            Circle().fill(LinearGradient(colors: colours, startPoint: start, endPoint: end))
                .opacity(0.93)
            lens().opacity(0.95)
            Circle().strokeBorder(.black.opacity(0.08), lineWidth: max(0.5, edge * 0.006))
            Ellipse().fill(LinearGradient(colors: [.white.opacity(0.8), .white.opacity(0.1)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * dia * 0.56, height: edge * dia * 0.30)
                .offset(y: -edge * dia * 0.27)
        }
        .frame(width: edge * dia, height: edge * dia)
        .position(x: edge * centre.x, y: edge * centre.y)
    }
}

// MARK: - Newsstand

/// iOS 5-6: an empty bookcase: a pale oak frame, a darker inner edge, two planks with shadows under them.
private struct StoresShelf: View {
    let edge: CGFloat

    var body: some View {
        let rim = 0.075
        let inner = edge * (1 - 2 * rim)
        ZStack {
            // The back wall, warm oak, lit from the middle.
            Rectangle()
                .fill(LinearGradient(colors: [hex(0xA06A3A), hex(0xC89156), hex(0xD5A369), hex(0xC89156), hex(0xA06A3A)],
                                     startPoint: .leading, endPoint: .trailing))
                .frame(width: inner, height: inner)
            StoresTicksShape(count: 6).fill(hex(0x7A4722, 0.16))
                .frame(width: inner * 0.7, height: inner)
            // The side walls, seen in perspective.
            StoresSideWallsShape(depth: 0.13).fill(LinearGradient(colors: [hex(0x7E4E28), hex(0xA7713F)], startPoint: .top, endPoint: .bottom))
                .frame(width: inner, height: inner)
            // Shadow under the top rail.
            Rectangle().fill(LinearGradient(colors: [.black.opacity(0.35), .clear], startPoint: .top, endPoint: .bottom))
                .frame(width: inner, height: edge * 0.08)
                .offset(y: -inner / 2 + edge * 0.04)
            ForEach([0.365, 0.675], id: \.self) { y in
                ZStack(alignment: .top) {
                    Rectangle().fill(hex(0xE9C68C)).frame(height: edge * 0.032)
                    Rectangle().fill(hex(0x6E3F1B)).frame(height: edge * 0.014).offset(y: edge * 0.032)
                    Rectangle().fill(LinearGradient(colors: [.black.opacity(0.38), .clear], startPoint: .top, endPoint: .bottom))
                        .frame(height: edge * 0.07).offset(y: edge * 0.046)
                }
                .frame(width: inner, height: edge * 0.105, alignment: .top)
                .offset(y: edge * (y - 0.5) + edge * 0.04)
            }
            RoundedRectangle(cornerRadius: edge * 0.175, style: .circular)
                .strokeBorder(LinearGradient(colors: [hex(0xE8C891), hex(0xD9AE70)], startPoint: .top, endPoint: .bottom),
                              lineWidth: edge * rim)
                .frame(width: edge, height: edge)
            RoundedRectangle(cornerRadius: edge * 0.10, style: .circular)
                .strokeBorder(hex(0x6B3E1E), lineWidth: max(0.6, edge * 0.016))
                .frame(width: inner, height: inner)
        }
        .frame(width: edge, height: edge)
    }
}

/// A bookcase's two side walls: trapezoids narrowing from the front edge toward the back.
private struct StoresSideWallsShape: Shape {
    var depth: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let d = rect.width * depth
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.minX + d, y: rect.minY + d * 0.8))
        path.addLine(to: CGPoint(x: rect.minX + d, y: rect.maxY - d * 0.8))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        path.move(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - d, y: rect.minY + d * 0.8))
        path.addLine(to: CGPoint(x: rect.maxX - d, y: rect.maxY - d * 0.8))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// iOS 7-8: ART, TRAVEL and SPORTS covers fanned in front of a newspaper, measured from the icon.
private struct StoresMagazines: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            // The newspaper behind: grey page, blackletter-ish masthead, a column of rules.
            ZStack(alignment: .top) {
                Rectangle().fill(hex(0xD6D8D6))
                Text("News")
                    .font(.system(size: edge * 0.1, weight: .black, design: .serif))
                    .foregroundStyle(hex(0x1A1A1A))
                    .padding(.top, edge * 0.01)
                StoresLinenShape(rows: 5).fill(hex(0x8E9290))
                    .frame(width: edge * 0.18, height: edge * 0.12)
                    .padding(.top, edge * 0.13)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.leading, edge * 0.03)
            }
            .frame(width: edge * 0.49, height: edge * 0.52)
            .position(x: edge * 0.355, y: edge * 0.38)
            cover(hex(0xF8D548), width: 0.254, height: 0.47, at: CGPoint(x: 0.18, y: 0.575)) {
                ZStack {
                    Text("ART").font(.system(size: edge * 0.075, weight: .medium)).foregroundStyle(hex(0x222222))
                        .offset(y: -edge * 0.17)
                    Circle().fill(hex(0x1EB0EC)).frame(width: edge * 0.10, height: edge * 0.10).offset(y: -edge * 0.03)
                    Rectangle().fill(hex(0xEE4B3E)).frame(width: edge * 0.085, height: edge * 0.085)
                        .offset(x: -edge * 0.05, y: edge * 0.12)
                }
            }
            cover(hex(0x31A9E1), width: 0.38, height: 0.557, at: CGPoint(x: 0.497, y: 0.531)) {
                ZStack {
                    LinearGradient(colors: [hex(0x31A9E1), hex(0x9AD6F2)], startPoint: .top, endPoint: .bottom)
                        .padding(.top, edge * 0.12)
                    Text("TRAVEL").font(.system(size: edge * 0.078, weight: .bold).width(.condensed))
                        .foregroundStyle(hex(0x1F3E8C))
                        .offset(y: -edge * 0.215)
                    Image(systemName: "airplane").font(.system(size: edge * 0.15, weight: .regular))
                        .foregroundStyle(.white).rotationEffect(.degrees(-90)).offset(y: edge * 0.05)
                }
            }
            cover(hex(0x4CBB5B), width: 0.333, height: 0.42, at: CGPoint(x: 0.767, y: 0.60)) {
                ZStack {
                    Text("SPORTS").font(.system(size: edge * 0.062, weight: .bold).width(.condensed))
                        .foregroundStyle(.white)
                        .offset(y: -edge * 0.16)
                    Circle().fill(hex(0xE9F03A)).frame(width: edge * 0.11, height: edge * 0.11).offset(y: -edge * 0.035)
                    StoresCourtShape().stroke(.white.opacity(0.95), lineWidth: max(0.5, edge * 0.008))
                        .frame(width: edge * 0.28, height: edge * 0.11)
                        .offset(y: edge * 0.145)
                }
            }
        }
        .frame(width: edge, height: edge)
    }

    private func cover<Content: View>(_ colour: Color, width: Double, height: Double, at centre: CGPoint,
                                      @ViewBuilder content: () -> Content) -> some View {
        Rectangle().fill(colour)
            .overlay(content())
            .clipped()
            .frame(width: edge * width, height: edge * height)
            .shadow(color: .black.opacity(0.22), radius: edge * 0.012, x: -edge * 0.006, y: edge * 0.004)
            .position(x: edge * centre.x, y: edge * centre.y)
    }
}

/// Horizontal rules, evenly spaced.
private struct StoresLinenShape: Shape {
    var rows: Int

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let pitch = rect.height / CGFloat(rows)
        for index in 0..<rows {
            path.addRect(CGRect(x: rect.minX, y: rect.minY + pitch * CGFloat(index), width: rect.width, height: max(0.5, pitch * 0.3)))
        }
        return path
    }
}

/// A tennis court in perspective: the outline, the service line and the centre line.
private struct StoresCourtShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let inset = rect.width * 0.18
        path.move(to: CGPoint(x: rect.minX + inset, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - inset, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        path.move(to: CGPoint(x: rect.minX + inset * 0.55, y: rect.midY))
        path.addLine(to: CGPoint(x: rect.maxX - inset * 0.55, y: rect.midY))
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        return path
    }
}

// MARK: - Videos / TV

/// The Videos app: a clapper of black-and-white chevrons across the top of the tile. The glossy one has a
/// hinge pin and sits over tinted glass; the flat one over plain aqua.
private struct StoresClapper: View {
    let edge: CGFloat
    let glossy: Bool

    var body: some View {
        let band = glossy ? 0.34 : 0.30
        ZStack(alignment: .top) {
            if glossy {
                Rectangle().fill(LinearGradient(colors: [hex(0x124E7E, 0.95), hex(0x124E7E, 0)],
                                                startPoint: .topTrailing, endPoint: .bottomLeading))
                StoresSheenShape().fill(.white.opacity(0.2))
            }
            ZStack {
                Rectangle().fill(hex(glossy ? 0x151515 : 0x131313))
                StoresChevronsShape(offset: glossy ? 0.189 : 0, pitch: glossy ? 0.356 : 0.35,
                                    stripe: glossy ? 0.165 : 0.182, point: band / 2)
                    .fill(LinearGradient(colors: glossy ? [hex(0xF4F4F4), hex(0xA2A2A2)] : [hex(0xF7F7F7), hex(0xF2F2F2)],
                                         startPoint: .top, endPoint: .bottom))
                Rectangle().fill(.black.opacity(0.25)).frame(height: max(0.5, edge * 0.008))
                if glossy {
                    Rectangle().fill(LinearGradient(colors: [hex(0x8C8C8C), hex(0x55555A)], startPoint: .top, endPoint: .bottom))
                        .frame(width: edge * 0.13)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Circle().fill(.white).frame(width: edge * 0.05, height: edge * 0.05)
                        .position(x: edge * 0.075, y: edge * 0.17)
                }
            }
            .frame(width: edge, height: edge * band)
            Rectangle().fill(.black).frame(width: edge, height: edge * 0.018).offset(y: edge * band)
        }
        .frame(width: edge, height: edge, alignment: .top)
    }
}

/// Right-pointing chevrons across a band: each stripe slants one way above the middle and back below it.
private struct StoresChevronsShape: Shape {
    var offset: Double
    var pitch: Double
    var stripe: Double
    /// How far right the stripe travels from the band's top edge to its middle, as a share of the width.
    var point: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        func pt(_ x: Double, _ y: Double) -> CGPoint {
            CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y)
        }
        var x0 = offset - pitch * 2
        while x0 < 1.0 {
            path.move(to: pt(x0, 0))
            path.addLine(to: pt(x0 + stripe, 0))
            path.addLine(to: pt(x0 + stripe + point, 0.5))
            path.addLine(to: pt(x0 + stripe, 1))
            path.addLine(to: pt(x0, 1))
            path.addLine(to: pt(x0 + point, 0.5))
            path.closeSubpath()
            x0 += pitch
        }
        return path
    }
}

/// The lighter wedge of glass in the lower left of the 2010 Videos icon.
private struct StoresSheenShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.93))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.50))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// iOS 10.2: a white-outlined flat screen with a green-to-blue picture, on a stand bar.
private struct StoresTVSet: View {
    let edge: CGFloat

    var body: some View {
        // Measured off the shipping iOS 10.2 icon: the bezel is a heavy 0.033 line (this was 0.024,
        // a third too light), the set 0.712 x 0.442 and the stand bar 0.398 x 0.041 - which leaves
        // the picture inside the same 0.646 wide.
        let frame = RoundedRectangle(cornerRadius: edge * 0.02, style: .continuous)
        ZStack {
            frame
                .fill(LinearGradient(colors: [hex(0x4FE9B8), hex(0x51E3CB), hex(0x38AAD3)], startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(frame.strokeBorder(.white, lineWidth: edge * 0.033))
                .frame(width: edge * 0.712, height: edge * 0.442)
                .offset(y: -edge * 0.039)
            RoundedRectangle(cornerRadius: edge * 0.006, style: .continuous).fill(.white)
                .frame(width: edge * 0.398, height: edge * 0.041)
                .offset(y: edge * 0.2305)
        }
    }
}

private enum StoresWordmarkLook { case white, iridescent, muted }

/// The Apple logo's own outline in a unit box (y down), traced from the system font's Apple glyph
/// (U+F8FF) with CTFontCreatePathForGlyph — the same drawing SF's apple.logo uses. Rasterised, the
/// two agree to IoU 0.996, and both agree with the shipping Apple TV icon's apple to IoU 0.992.
/// A Shape rather than `Image(systemName:)` so the web port can draw the identical path.
private struct StoresAppleMark: Shape {
    static let bodyStart = CGPoint(x: 0.7248, y: 0.2418)
    /// Quadratics: control point then end point, 34 of them.
    static let body: [(Double, Double, Double, Double)] = [
        (0.7423, 0.2418, 0.7843, 0.2463), (0.8263, 0.2508, 0.8767, 0.2718), (0.9270, 0.2927, 0.9683, 0.3411),
        (0.9659, 0.3430, 0.9453, 0.3549), (0.9247, 0.3669, 0.8993, 0.3897), (0.8739, 0.4126, 0.8549, 0.4478),
        (0.8358, 0.4829, 0.8358, 0.5313), (0.8358, 0.5867, 0.8600, 0.6254), (0.8842, 0.6641, 0.9163, 0.6876),
        (0.9485, 0.7112, 0.9734, 0.7221), (0.9984, 0.7331, 1.0000, 0.7337), (0.9992, 0.7363, 0.9798, 0.7795),
        (0.9603, 0.8227, 0.9159, 0.8756), (0.8771, 0.9213, 0.8323, 0.9600), (0.7875, 0.9987, 0.7248, 0.9987),
        (0.6828, 0.9987, 0.6558, 0.9887), (0.6289, 0.9787, 0.6003, 0.9687), (0.5718, 0.9587, 0.5234, 0.9587),
        (0.4766, 0.9587, 0.4453, 0.9691), (0.4140, 0.9794, 0.3858, 0.9897), (0.3577, 1.0000, 0.3196, 1.0000),
        (0.2617, 1.0000, 0.2181, 0.9626), (0.1745, 0.9252, 0.1285, 0.8730), (0.0753, 0.8111, 0.0377, 0.7218),
        (0.0000, 0.6325, 0.0000, 0.5416), (0.0000, 0.4442, 0.0452, 0.3781), (0.0904, 0.3121, 0.1614, 0.2782),
        (0.2324, 0.2444, 0.3085, 0.2444), (0.3489, 0.2444, 0.3846, 0.2550), (0.4203, 0.2656, 0.4516, 0.2766),
        (0.4830, 0.2876, 0.5083, 0.2876), (0.5329, 0.2876, 0.5654, 0.2760), (0.5979, 0.2643, 0.6384, 0.2531),
        (0.6788, 0.2418, 0.7248, 0.2418),
    ]
    static let leafStart = CGPoint(x: 0.6812, y: 0.1599)
    /// Quadratics: control point then end point, 12 of them.
    static let leaf: [(Double, Double, Double, Double)] = [
        (0.6503, 0.1902, 0.6035, 0.2105), (0.5567, 0.2308, 0.5147, 0.2308), (0.5059, 0.2308, 0.4980, 0.2295),
        (0.4972, 0.2276, 0.4964, 0.2224), (0.4956, 0.2173, 0.4956, 0.2115), (0.4956, 0.1728, 0.5163, 0.1364),
        (0.5369, 0.0999, 0.5630, 0.0761), (0.5964, 0.0438, 0.6471, 0.0226), (0.6979, 0.0013, 0.7439, 0.0000),
        (0.7462, 0.0084, 0.7462, 0.0200), (0.7462, 0.0587, 0.7280, 0.0951), (0.7098, 0.1315, 0.6812, 0.1599),
    ]

    func path(in rect: CGRect) -> Path {
        var path = Path()
        for (start, loop) in [(Self.bodyStart, Self.body), (Self.leafStart, Self.leaf)] {
            let at = { (x: Double, y: Double) in
                CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y)
            }
            path.move(to: at(start.x, start.y))
            for (cx, cy, x, y) in loop { path.addQuadCurve(to: at(x, y), control: at(cx, cy)) }
            path.closeSubpath()
        }
        return path
    }
}

/// The Apple TV wordmark: the logo and a lowercase "tv" on one baseline. From iOS 26.1 the letters
/// are white with an iridescent sweep rising through their bottom third (violet, cyan, green under
/// the logo; yellow in the t; pink in the v).
///
/// Every number here is measured off the shipping icon — macOS 26 Tahoe's TV.app at 2048 px and the
/// App Store's iOS artwork, which carry the same late-2025 rebrand — as a fraction of the tile:
///   apple x 0.1173-0.4289  y 0.2764-0.6610
///   t     x 0.4563-0.6051  y 0.3190-0.6598,  stem x 0.4964-0.5541
///   v     x 0.6300-0.8821  y 0.3834-0.6574
/// iOS's SF Display sets "tv" a little wider than Apple's own letterforms, so size, the horizontal
/// squeeze and the kerning are fitted to that measured ink rather than shared with the web, which
/// starts from SF Text and needs its own numbers for the same result.
private struct StoresTVWordmark: View {
    let edge: CGFloat
    let look: StoresWordmarkLook

    var body: some View {
        switch look {
        case .white: painted(Color.white)
        case .iridescent: sheen(dim: 1, top: .white)
        case .muted: sheen(dim: 0.86, top: hex(0xE6E6E8))
        }
    }

    /// Both glyphs placed by their measured ink rather than by a stack's idea of the gap: the apple's
    /// frame IS its ink box (the traced outline fills its unit box), and the "tv" is pinned by its
    /// baseline (0.6544, which puts the t's tail on 0.6598) and by its leading edge (0.4548, the t's
    /// crossbar at 0.4563 less its left side bearing). `fixedSize` keeps the Text at its ideal width —
    /// inside a mask the proposal is re-rounded, and a hair less than ideal truncates "tv" to "…".
    private var mark: some View {
        ZStack(alignment: .topLeading) {
            Color.clear
            StoresAppleMark()
                .frame(width: edge * 0.3116, height: edge * 0.3846)
                .offset(x: edge * 0.1173, y: edge * 0.2764)
            Text("tv")
                .font(.system(size: edge * 0.524, weight: .semibold))
                .kerning(-edge * 0.0044)
                .fixedSize()
                .scaleEffect(x: 0.978, anchor: .leading)
                .alignmentGuide(.leading) { _ in -edge * 0.4548 }
                .alignmentGuide(.top) { $0[.lastTextBaseline] - edge * 0.6544 }
        }
        .frame(width: edge, height: edge)
    }

    /// One paint through the mark. Every look goes through this, so the white years and the
    /// iridescent ones lay the glyphs out identically.
    private func painted<S: View>(_ fill: S) -> some View {
        fill.mask { mark }.frame(width: edge, height: edge)
    }

    /// SWEEP: read straight off the artwork's bottom band (below y 0.598 the white has run out, so
    /// what is there IS the sweep) as hue/saturation at full value — 255deg s0.49 at x 0.16, 216/0.40
    /// at 0.25, 200/0.47 at 0.31, 96/0.44 at 0.51, 43/0.59 at 0.57, 8/0.47 at 0.71, 333/0.33 at 0.80.
    /// The left end runs off the bottom of the apple's lobe, so its violet is un-mixed from higher up.
    private static let sweep: [(Double, UInt32)] = [
        (0.118, 0x8861FF), (0.16, 0xA282FF), (0.20, 0xA89DFF), (0.25, 0x99C3FF),
        (0.31, 0x87D8FF), (0.37, 0x8CFFED), (0.44, 0x8BFFA3), (0.51, 0xBDFF8F),
        (0.57, 0xFFD568), (0.63, 0xFFB478), (0.70, 0xFF9A84), (0.77, 0xFFA2B2),
        (0.84, 0xFFABD2), (0.882, 0xFFADD8),
    ]

    /// WHITE CAP: opaque to y 0.43 — the top 40% of the mark carries no colour at all — then down to
    /// nothing by 0.605. Apple's own saturation by tile row is 0.004 at y 0.39, 0.019 at 0.43, 0.066
    /// at 0.47, 0.167 at 0.51, 0.305 at 0.55, 0.409 at 0.59, 0.474 at 0.63; ours was at 0.091 by
    /// y 0.43 already, which is what washed the whole mark out.
    private static let cap: [(Double, Double)] = [
        (0, 1), (0.43, 1), (0.46, 0.94), (0.49, 0.856), (0.52, 0.683), (0.55, 0.437), (0.58, 0.178), (0.605, 0), (1, 0),
    ]

    /// Both gradients span the whole TILE (a foreground style would restart on each glyph), masked by
    /// the mark, so their locations are the measured tile fractions above.
    private func sheen(dim: Double, top: Color) -> some View {
        painted(
            ZStack {
                LinearGradient(stops: Self.sweep.map { .init(color: Self.shade($1, dim), location: $0) },
                               startPoint: .leading, endPoint: .trailing)
                LinearGradient(stops: Self.cap.map { .init(color: top.opacity($1), location: $0) },
                               startPoint: .top, endPoint: .bottom)
            }
        )
        .shadow(color: .black.opacity(0.45), radius: edge * 0.02, y: edge * 0.014)
    }

    /// 2026's muted sibling: the same sweep dimmed to 0.86 of its value.
    private static func shade(_ value: UInt32, _ dim: Double) -> Color {
        let channel = { (shift: UInt32) in Double((value >> shift) & 0xFF) / 255 * dim }
        return Color(.sRGB, red: channel(16), green: channel(8), blue: channel(0))
    }
}
