//
//  HomeIcons+Dock.swift
//  iOSEras
//
//  Icon designs, one entry per redesign, for: Phone, Mail, Safari, Music, Messages.
//  Every generation is a vector reading of the real icon of that release:
//  glyph, colours, proportions and first year all follow the research specs
//  (icons-phone-messages-mail-safari, icons-music-photos-camera-maps) and
//  their fact-checks. Coordinates in comments are unit-square fractions of
//  the icon side, origin top-left. The system layer draws the tile, gloss,
//  shadow, glass rim and label; only the background stops and the glyph
//  live here.
//
//  Year -> release: 2007 OS 1, 2008 OS 2, 2009 OS 3, 2010 iOS 4, 2011 iOS 5,
//  2012 iOS 6, 2013 iOS 7.0, 2014 iOS 7.1/8, 2015 iOS 8.4/9, 2017 iOS 11,
//  2020 iOS 14, 2024 iOS 18, 2025 iOS 26, 2026 iOS 27.
//

import SwiftUI

extension HomeApp {
    static let dock: [HomeApp] = [

        // MARK: Phone
        // Generations: OS 1-2 flat green | OS 3-6 striped | 7.0 neon | 7.1-10 | 11-17 | 18 | 26-27.
        HomeApp("Phone", designs: [
            // iPhone OS 1-2: flat medium green, no stripes; a small glossy
            // handset sitting high (bbox x 0.24-0.78, y 0.22-0.72).
            design(2007, 0x00AC22, 0x00C92A, art { edge in
                DockHandset(edge: edge, box: DockBox(0.24, 0.22, 0.78, 0.73), look: .skeuomorphic(heavy: true))
            }),
            // iPhone OS 3 - iOS 6: darker green with 45-degree pinstripes
            // (period ~0.066 of side, ~5% contrast); a slimmer, larger,
            // grey-shaded handset. iOS 4's Retina redraw kept the design.
            // The ground holds dark green to just below the shine, then
            // brightens to neon over the bottom third.
            design(2009, 0x007C00, 0x0AF203, art { edge in
                ZStack {
                    DockGround(edge: edge, stops: DockGround.striped)
                    DockStripes(period: 0.066).stroke(.white.opacity(0.07), lineWidth: edge * 0.033)
                        .frame(width: edge, height: edge)
                    DockHandset(edge: edge, box: DockBox(0.21, 0.21, 0.80, 0.75), look: .skeuomorphic(heavy: false))
                }
            }),
            // iOS 7.0: the neon green; flat white handset, bbox 0.184-0.822.
            design(2013, 0x87FC70, 0x0BD318, art { edge in
                DockHandset(edge: edge, box: .flatHandset, look: .flat)
            }),
            // iOS 7.1 - 10: gradient darkened, glyph unchanged.
            design(2014, 0x67FF81, 0x01B41F, art { edge in
                DockHandset(edge: edge, box: .flatHandset, look: .flat)
            }),
            // iOS 11 - 17: cooler gradient (Logopedia-only), glyph unchanged.
            design(2017, 0x5DF777, 0x0ABC28, art { edge in
                DockHandset(edge: edge, box: .flatHandset, look: .flat)
            }),
            // iOS 18: light icon retuned slightly.
            design(2024, 0x66FE80, 0x00B41E, art { edge in
                DockHandset(edge: edge, box: .flatHandset, look: .flat)
            }),
            // iOS 26-27: Liquid Glass; softer green, frosted white handset.
            design(2025, 0x54EF6E, 0x25C041, art { edge in
                DockHandset(edge: edge, box: DockBox(0.182, 0.176, 0.818, 0.814), look: .glass(tint: hex(0xACE8B6)))
            }),
        ]),

        // MARK: Mail
        // Generations: OS 1-3 periwinkle sky | iOS 4-6 Retina sky | 7.0-7.1 dark-on-top blue |
        // 8-10 bolder seams | 11-17 bigger envelope | 18 | 26-27 light-on-top glass envelope.
        HomeApp("Mail", designs: [
            // iPhone OS 1 - 3: a white paper envelope over a periwinkle sky
            // that deepens under the shine and turns cyan at the bottom, with
            // wisps of cloud low left and on the right edge.
            design(2007, 0x6F86E0, 0x45B7F1, art { edge in
                DockSkyMail(edge: edge, sky: [
                    .init(color: hex(0x6F86E0), location: 0),
                    .init(color: hex(0x5A7FE2), location: 0.36),
                    .init(color: hex(0x2466D6), location: 0.47),
                    .init(color: hex(0x2B86DF), location: 0.64),
                    .init(color: hex(0x45B7F1), location: 1),
                ], seam: hex(0x7D8BA0))
            }),
            // iOS 4 - 6: the Retina redraw; a lighter sky-blue top, softer
            // grey seams and a fuller cloud bank at the lower left.
            design(2010, 0x7FA9EC, 0x8DC8EE, art { edge in
                DockSkyMail(edge: edge, sky: [
                    .init(color: hex(0x7FA9EC), location: 0),
                    .init(color: hex(0x5D99EA), location: 0.36),
                    .init(color: hex(0x2A6EC4), location: 0.47),
                    .init(color: hex(0x3D84D1), location: 0.60),
                    .init(color: hex(0x59A0DD), location: 0.72),
                    .init(color: hex(0x8DC8EE), location: 1),
                ], seam: hex(0xAEB8C4), retina: true)
            }),
            // iOS 7.0 - 7.1: the one iOS 7 icon that ran DARK to LIGHT.
            // Envelope bbox x 0.167-0.817, y 0.283-0.700; hairline seams,
            // the flap's V rounded at its apex.
            design(2013, 0x1D62F0, 0x1AD6FD, art { edge in
                DockEnvelope(edge: edge, box: DockBox(0.167, 0.283, 0.817, 0.700),
                             seam: hex(0x1C9BF6), seamWidth: 0.008, corner: 0, apexRound: 0.05)
            }),
            // iOS 8 - 10: seams doubled in weight, gradient a shade deeper.
            design(2014, 0x1E53EE, 0x19E3FF, art { edge in
                DockEnvelope(edge: edge, box: DockBox(0.168, 0.294, 0.832, 0.706),
                             seam: hex(0x1C9BF6), seamWidth: 0.017, corner: 0, apexRound: 0.055)
            }),
            // iOS 11 - 17: envelope enlarged (x 0.145-0.855), corners softened,
            // a rounder notch at the flap's apex.
            design(2017, 0x1D70F1, 0x1AC8FB, art { edge in
                DockEnvelope(edge: edge, box: DockBox(0.145, 0.274, 0.855, 0.726),
                             seam: hex(0x1B9CF6), seamWidth: 0.02, corner: 0.012, apexRound: 0.07)
            }),
            // iOS 18: near-identical light icon (dark/tinted variants arrived).
            design(2024, 0x1D70F2, 0x1AC7FC, art { edge in
                DockEnvelope(edge: edge, box: DockBox(0.145, 0.272, 0.855, 0.728),
                             seam: hex(0x1B9CF7), seamWidth: 0.02, corner: 0.012, apexRound: 0.07)
            }),
            // iOS 26-27: gradient flips light-on-top; a glass envelope with an
            // opaque white flap over a translucent blue pocket.
            design(2025, 0x57BEF4, 0x1D74FD, art { edge in
                DockGlassEnvelope(edge: edge, box: DockBox(0.127, 0.250, 0.873, 0.749))
            }),
        ]),

        // MARK: Safari
        // Generations: OS 1-6 compass rose over a map | 7-10 flat dial | 11-18 softer needle |
        // 26 glass lens | 27 brighter cyan dial with a hub.
        HomeApp("Safari", designs: [
            // iPhone OS 1 - iOS 6: white compass rose, N/E/S/W, an orange and
            // silver needle pointing north-east, all over a blue world map.
            // Apple prerendered this icon with its shine UNDER the needle,
            // so the needle rides above the system shine to keep its orange.
            design(2007, 0x5F8CE0, 0x8BDEFC, art { edge in
                DockCompassRose(edge: edge)
                DockRoseNeedle(edge: edge).dockOverShine()
            }),
            // iOS 7 - 10: blue disc (0.865 of the side) on a white tile,
            // 72 alternating ticks, a sharp needle whose tips touch the ring.
            flat(2013, 0xFFFFFF, art { edge in
                DockCompass(edge: edge, disc: 0.865, face: [hex(0x1AD6FD), hex(0x1D62F0)],
                            tickInk: .white, tickWidth: 0.008, roundTicks: false,
                            angle: 45, tip: 0.985, base: 0.27, red: hex(0xFF3B30), white: .white)
            }),
            // iOS 11 - 18: darker face, rounded ticks, a shorter, flatter needle.
            flat(2017, 0xFFFFFF, art { edge in
                DockCompass(edge: edge, disc: 0.869, face: [hex(0x1CD5FC), hex(0x1E62F0)],
                            tickInk: .white, tickWidth: 0.009, roundTicks: true,
                            angle: 50, tip: 0.92, base: 0.23, red: hex(0xFF3B30), white: .white)
            }),
            // iOS 26: off-white glass tile, smaller lens (0.80), pale ticks,
            // the needle back at 45 degrees.
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in
                DockCompass(edge: edge, disc: 0.80, face: [hex(0x5ABDF9), hex(0x1D74FD)],
                            tickInk: hex(0xD6ECFE, 0.85), tickWidth: 0.009, roundTicks: true,
                            angle: 45, tip: 0.91, base: 0.23, red: hex(0xFF413B), white: hex(0xEBF5FF),
                            glass: true)
            }),
            // iOS 27: brighter cyan-blue, 36 finer ticks, a bolder needle on a
            // visible red hub.
            design(2026, 0xF4F5F7, 0xECF0F1, art { edge in
                DockCompass(edge: edge, disc: 0.80, face: [hex(0x00ABF1), hex(0x0B81E3)],
                            ticks: 36, tickInk: hex(0xD5FFFF, 0.9), longInner: 0.76, shortInner: 0.82,
                            tickWidth: 0.008, roundTicks: true,
                            angle: 45, tip: 0.88, base: 0.25, red: hex(0xFB0A0A), white: hex(0xECF4F4),
                            hub: 0.18, glass: true)
            }),
        ]),

        // MARK: Music
        // Generations: iPod OS 1-2 | iPod OS 3 striped | iPod iOS 4 Retina | Music iOS 5-6 maroon note |
        // 7 pink-to-orange | 8.0-8.3 reversed | 8.4-13 Apple Music white | 14-17 red | 18 | 26-27 glass.
        HomeApp("Music", names: [(era(2007), "iPod"), (era(2011), "Music")], designs: [
            // iPhone OS 1-2: white iPod classic silhouette on plain orange;
            // screen and click wheel are cut-outs showing the orange.
            design(2007, 0xFF6A00, 0xFFB80C, art { edge in
                DockIPodShape().fill(.white, style: FillStyle(eoFill: true))
                    .frame(width: edge, height: edge)
            }),
            // iPhone OS 3: pinstripes added, icon darkened, iPod gets a shadow.
            design(2009, 0xF86000, 0xFDC40F, art { edge in
                DockIPod(edge: edge, stripes: true)
            }),
            // iOS 4: the Retina redraw, deeper orange running to yellow.
            design(2010, 0xD06000, 0xF9CC03, art { edge in
                DockIPod(edge: edge, stripes: true)
            }),
            // iOS 5-6: iPod split into Music and Videos; a maroon beamed note
            // pressed into mottled orange (red bottom-left, yellow bottom-right),
            // letterpressed: a light bevel below, a dark lip along the top.
            // The note sat above Apple's own shine, so it rides above the
            // system shine too.
            design(2011, 0xE8862E, 0xE85A08, art { edge in
                ZStack {
                    DockCornerGlow(edge: edge, colour: hex(0xE0100A), corner: .bottomLeading)
                    DockCornerGlow(edge: edge, colour: hex(0xE8B608), corner: .bottomTrailing)
                }
                ZStack {
                    DockNote(edge: edge, geometry: .ios5, style: hex(0xFFE2B0), opacity: 0.45)
                        .offset(y: edge * 0.01)
                    DockNote(edge: edge, geometry: .ios5, style: hex(0x3E0A02))
                        .offset(y: -edge * 0.006)
                    DockNote(edge: edge, geometry: .ios5,
                             style: LinearGradient(stops: [
                                .init(color: hex(0x5A1408), location: 0.18),
                                .init(color: hex(0x7C180A), location: 0.45),
                                .init(color: hex(0x791605), location: 0.8),
                             ], startPoint: .top, endPoint: .bottom))
                }
                .dockOverShine()
            }),
            // iOS 7.0-7.1: pink-red on TOP fading to orange, white note.
            design(2013, 0xFF2A68, 0xFF5E3A, art { edge in
                DockNote(edge: edge, geometry: .ios7, style: Color.white)
            }),
            // iOS 8.0-8.3: the same gradient reversed, orange on top.
            design(2014, 0xFF5E3A, 0xFF2A68, art { edge in
                DockNote(edge: edge, geometry: .ios7, style: Color.white)
            }),
            // iOS 8.4-13: Apple Music; a note on white running coral-pink at
            // the beam to magenta and violet down the left stem, with the
            // right stem and head shifting to blue.
            flat(2015, 0xFFFFFF, art { edge in
                ZStack {
                    DockNote(edge: edge, geometry: .appleMusic, style: LinearGradient(stops: [
                        .init(color: hex(0xFB5C6E), location: 0.16),
                        .init(color: hex(0xE25A9B), location: 0.40),
                        .init(color: hex(0xC15DC3), location: 0.52),
                        .init(color: hex(0x8A69F7), location: 0.66),
                        .init(color: hex(0x6A74F4), location: 0.84),
                    ], startPoint: .top, endPoint: .bottom))
                    DockNote(edge: edge, geometry: .appleMusic, style: LinearGradient(stops: [
                        .init(color: hex(0x42A5F5, 0), location: 0.45),
                        .init(color: hex(0x42A5F5), location: 0.66),
                    ], startPoint: .leading, endPoint: .trailing))
                    .mask(LinearGradient(stops: [
                        .init(color: .clear, location: 0.30),
                        .init(color: .black, location: 0.62),
                    ], startPoint: .top, endPoint: .bottom))
                }
            }),
            // iOS 14-17: the Apple Music red pair returns with a white note.
            design(2020, 0xFB5C74, 0xFA233B, art { edge in
                DockNote(edge: edge, geometry: .ios14, style: Color.white)
            }),
            // iOS 18: light icon retuned, the note nudged right ~0.011
            // (Logopedia; dark and tinted variants arrived).
            design(2024, 0xFC5A74, 0xFA243E, art { edge in
                DockNote(edge: edge, geometry: .ios18, style: Color.white)
            }),
            // iOS 26-27: more saturated red; frosted note fading toward the heads.
            // iOS 27 kept the iOS 26 artwork: Apple's own iOS 27 page shows
            // the dock Music icon in the iOS 26 palette.
            design(2025, 0xFF4E6F, 0xFF002D, art { edge in
                ZStack {
                    DockNote(edge: edge, geometry: .ios26, style: hex(0xC0002A), opacity: 0.35)
                        .offset(y: edge * 0.012)
                    DockNote(edge: edge, geometry: .ios26,
                             style: LinearGradient(colors: [hex(0xFFF3F5), hex(0xFDD3DB), hex(0xF9A9B8)],
                                                   startPoint: .top, endPoint: .bottom))
                }
            }),
        ]),

        // MARK: Messages
        // Generations: OS 1-2 "Text" SMS bubble | OS 3-6 empty glossy bubble on stripes |
        // 7.0 | 7.1-10 | 11-17 | 18 | 26-27 glass bubble.
        HomeApp("Messages", names: [(era(2007), "Text"), (era(2009), "Messages")], designs: [
            // iPhone OS 1-2: app named Text; a yellower green with a white
            // bubble reading "SMS" in a rounded bold sans.
            design(2007, 0x3CB012, 0x81D367, art { edge in
                ZStack {
                    DockBubbleShape(centre: CGPoint(x: 0.51, y: 0.46), rx: 0.33, ry: 0.245,
                                    tailFrom: 129, tailTo: 107, tip: CGPoint(x: 0.27, y: 0.79))
                        .fill(LinearGradient(colors: [.white, hex(0xEEF1F4)], startPoint: .top, endPoint: .bottom))
                        .frame(width: edge, height: edge)
                        .shadow(color: .black.opacity(0.3), radius: edge * 0.01, y: edge * 0.012)
                    Text("SMS")
                        .font(.system(size: edge * 0.235, weight: .heavy, design: .rounded))
                        .foregroundStyle(hex(0x2CAA00))
                        .offset(x: edge * 0.01, y: -edge * 0.035)
                }
            }),
            // iPhone OS 3 - iOS 6: renamed Messages; SMS gone, stripes in,
            // and pixel for pixel the same striped green ground as Phone.
            design(2009, 0x007C00, 0x0AF203, art { edge in
                ZStack {
                    DockGround(edge: edge, stops: DockGround.striped)
                    DockStripes(period: 0.066).stroke(.white.opacity(0.07), lineWidth: edge * 0.033)
                        .frame(width: edge, height: edge)
                    DockBubbleShape(centre: CGPoint(x: 0.496, y: 0.45), rx: 0.318, ry: 0.26,
                                    tailFrom: 130, tailTo: 105, tip: CGPoint(x: 0.29, y: 0.80))
                        .fill(LinearGradient(colors: [hex(0xF5F8FB), hex(0xE6EDF4), hex(0xEEF3F8)],
                                             startPoint: .top, endPoint: .bottom))
                        .frame(width: edge, height: edge)
                        .shadow(color: hex(0x003D00, 0.4), radius: edge * 0.012, y: edge * 0.014)
                }
            }),
            // iOS 7.0: the flat white bubble (ellipse rx 0.364, ry 0.30) that
            // then stayed pixel-identical through iOS 18.
            design(2013, 0x87FC70, 0x0BD318, art { edge in
                DockBubbleShape.flat.fill(.white).frame(width: edge, height: edge)
            }),
            design(2014, 0x67FF81, 0x01B41F, art { edge in
                DockBubbleShape.flat.fill(.white).frame(width: edge, height: edge)
            }),
            design(2017, 0x5DF777, 0x0ABC28, art { edge in
                DockBubbleShape.flat.fill(.white).frame(width: edge, height: edge)
            }),
            design(2024, 0x66FE80, 0x00B41E, art { edge in
                DockBubbleShape.flat.fill(.white).frame(width: edge, height: edge)
            }),
            // iOS 26-27: frosted glass bubble, white fading to pale green.
            design(2025, 0x54EF6E, 0x25C041, art { edge in
                ZStack {
                    DockBubbleShape.glass.fill(hex(0x1E8A34, 0.25))
                        .frame(width: edge, height: edge)
                        .offset(y: edge * 0.014)
                    DockBubbleShape.glass
                        .fill(LinearGradient(colors: [.white, hex(0xF3FDF5), hex(0xD1F3D7), hex(0xA6E8B2)],
                                             startPoint: .top, endPoint: .bottom))
                        .frame(width: edge, height: edge)
                }
            }),
        ]),
    ]
}

// MARK: - Placement

/// A glyph's bounding box in unit-square coordinates (origin top-left).
private struct DockBox {
    let x0, y0, x1, y1: Double
    init(_ x0: Double, _ y0: Double, _ x1: Double, _ y1: Double) {
        self.x0 = x0; self.y0 = y0; self.x1 = x1; self.y1 = y1
    }
    var width: Double { x1 - x0 }
    var height: Double { y1 - y0 }
    /// Centre offsets from the icon's centre.
    var dx: Double { (x0 + x1) / 2 - 0.5 }
    var dy: Double { (y0 + y1) / 2 - 0.5 }

    /// The iOS 7-18 handset footprint: a 0.64 square, measured identical
    /// from iOS 7.0 through iOS 18.
    static let flatHandset = DockBox(0.184, 0.176, 0.822, 0.814)
}

private extension View {
    /// Sizes and positions the view into `box` inside an icon of `edge`.
    func dockBox(_ box: DockBox, _ edge: CGFloat) -> some View {
        frame(width: edge * box.width, height: edge * box.height)
            .offset(x: edge * box.dx, y: edge * box.dy)
    }

    /// For a glyph Apple prerendered ABOVE the icon's own shine. Give it as a
    /// separate top-level view of the `art` builder (not inside a ZStack):
    /// the art's views join the icon's layer stack one by one, and the raised
    /// z-index lifts this one over the system's pre-2013 shine, which would
    /// otherwise wash its dark colours out. It must fill the icon square.
    func dockOverShine() -> some View {
        zIndex(1)
    }
}

/// A multi-stop vertical background, for grounds a two-stop pair cannot
/// hold. The design keeps a top/bottom pair for the morph between designs.
private struct DockGround: View {
    let edge: CGFloat
    let stops: [(UInt32, Double)]

    var body: some View {
        LinearGradient(stops: stops.map { .init(color: hex($0.0), location: $0.1) },
                       startPoint: .top, endPoint: .bottom)
            .frame(width: edge, height: edge)
    }

    /// iPhone OS 3 - iOS 6 Phone and Messages: one shared striped green,
    /// dark under the shine and neon over the bottom third.
    static let striped: [(UInt32, Double)] = [
        (0x0C820C, 0), (0x007C00, 0.30), (0x007C00, 0.50), (0x029800, 0.60),
        (0x04BC00, 0.70), (0x00D100, 0.80), (0x0AF203, 0.90), (0x0AF203, 1),
    ]
}

// MARK: - Phone

private enum DockHandsetLook {
    /// `heavy` is the chunky iPhone OS 1-2 handset; iPhone OS 3 slimmed it.
    case skeuomorphic(heavy: Bool)
    case flat
    case glass(tint: Color)
}

/// The handset: earpiece top-left, mouthpiece bottom-right. SF Symbols'
/// phone.fill is Apple's own reading of the same silhouette.
private struct DockHandset: View {
    let edge: CGFloat
    let box: DockBox
    let look: DockHandsetLook

    var body: some View {
        switch look {
        case .skeuomorphic:
            glyph(LinearGradient(colors: [.white, hex(0xDCDCDC)], startPoint: .topLeading, endPoint: .bottomTrailing))
                .shadow(color: .black.opacity(0.35), radius: edge * 0.012, y: edge * 0.014)
        case .flat:
            glyph(Color.white)
        case .glass(let tint):
            ZStack {
                glyph(tint.opacity(0.7)).offset(y: edge * 0.014)
                glyph(LinearGradient(colors: [.white, hex(0xF1FEF3), tint.opacity(0.95)],
                                     startPoint: .top, endPoint: .bottom))
            }
        }
    }

    private func glyph<S: ShapeStyle>(_ style: S) -> some View {
        Image(systemName: "phone.fill")
            .resizable()
            .scaledToFit()
            .fontWeight(weight)
            .foregroundStyle(style)
            .dockBox(box, edge)
    }

    private var weight: Font.Weight {
        if case .skeuomorphic(let heavy) = look { return heavy ? .black : .regular }
        return .medium
    }
}

/// 45-degree pinstripes rising to the right, the texture iPhone OS 3 added
/// to Phone, Messages and iPod. Stroke it at half the period for equal bands.
private struct DockStripes: Shape {
    /// Band period measured perpendicular to the stripes, as a share of the side.
    var period: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let side = min(rect.width, rect.height)
        let step = period * side * 2.0.squareRoot()
        var x = rect.minX - rect.height
        while x < rect.maxX + step {
            path.move(to: CGPoint(x: x, y: rect.maxY))
            path.addLine(to: CGPoint(x: x + rect.height, y: rect.minY))
            x += step
        }
        return path
    }
}

// MARK: - Messages

/// A speech bubble: an ellipse with a tail off the lower left, traced as one
/// closed path so gradients and shadows read it as a single body.
private struct DockBubbleShape: Shape {
    var centre: CGPoint
    var rx: Double
    var ry: Double
    /// Degrees on the ellipse (0 = right, 90 = bottom) where the tail's outer
    /// edge leaves, and where its inner edge returns.
    var tailFrom: Double
    var tailTo: Double
    var tip: CGPoint

    /// iOS 7.0 - 18: bbox x 0.135-0.863, y 0.176-0.822.
    static let flat = DockBubbleShape(centre: CGPoint(x: 0.499, y: 0.475), rx: 0.364, ry: 0.30,
                                      tailFrom: 127, tailTo: 106, tip: CGPoint(x: 0.26, y: 0.82))
    /// iOS 26: the same body with a slightly softer, shorter tail.
    static let glass = DockBubbleShape(centre: CGPoint(x: 0.50, y: 0.472), rx: 0.366, ry: 0.291,
                                       tailFrom: 127, tailTo: 106, tip: CGPoint(x: 0.27, y: 0.784))

    func path(in rect: CGRect) -> Path {
        let side = min(rect.width, rect.height)
        func point(_ degrees: Double) -> CGPoint {
            let a = degrees * .pi / 180
            return CGPoint(x: rect.minX + side * (centre.x + rx * cos(a)),
                           y: rect.minY + side * (centre.y + ry * sin(a)))
        }
        var path = Path()
        // Round the ellipse the long way from the tail's inner root to its outer root.
        path.move(to: point(tailTo))
        var angle = tailTo
        let end = tailFrom - 360
        while angle > end {
            angle = max(angle - 4, end)
            path.addLine(to: point(angle))
        }
        let outerRoot = point(tailFrom)
        let innerRoot = point(tailTo)
        let tipPoint = CGPoint(x: rect.minX + side * tip.x, y: rect.minY + side * tip.y)
        // Outer edge runs almost straight down to the point; the inner edge
        // sweeps back up in a concave curve.
        path.addQuadCurve(to: tipPoint,
                          control: CGPoint(x: outerRoot.x - side * 0.01, y: (outerRoot.y + tipPoint.y) / 2))
        path.addQuadCurve(to: innerRoot,
                          control: CGPoint(x: tipPoint.x + (innerRoot.x - tipPoint.x) * 0.45,
                                           y: tipPoint.y - (tipPoint.y - innerRoot.y) * 0.05))
        path.closeSubpath()
        return path
    }
}

// MARK: - Mail

/// The three seam lines of an envelope: the flap's V from the top corners,
/// and the pocket's two diagonals from the bottom corners up to the flap.
private struct DockEnvelopeSeams: Shape {
    /// Flap apex depth as a share of the envelope height.
    var apex: Double = 0.73
    /// How far along the width each lower diagonal climbs before it meets
    /// the flap edge (left side; mirrored).
    var meetX: Double = 0.30
    /// Half-width of the rounded notch at the apex, as a share of the width.
    var apexRound: Double = 0

    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        DockEnvelopeFlap.addV(to: &path, in: rect, apex: apex, round: apexRound)
        let meetY = rect.minY + rect.height * apex * meetX / 0.5
        path.move(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX + rect.width * meetX, y: meetY))
        path.move(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.maxX - rect.width * meetX, y: meetY))
        return path
    }
}

/// The flap alone, for a lighter fill than the pocket.
private struct DockEnvelopeFlap: Shape {
    var apex: Double = 0.73
    var apexRound: Double = 0

    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        DockEnvelopeFlap.addV(to: &path, in: rect, apex: apex, round: apexRound)
        path.closeSubpath()
        return path
    }

    /// The V from the current point (top-left corner) down to the apex and
    /// up to the top-right corner, its point eased into a curve.
    static func addV(to path: inout Path, in rect: CGRect, apex: Double, round: Double) {
        let apexPoint = CGPoint(x: rect.midX, y: rect.minY + rect.height * apex)
        guard round > 0 else {
            path.addLine(to: apexPoint)
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
            return
        }
        let dx = rect.width * round
        let dy = rect.height * apex * dx / (rect.width / 2)
        path.addLine(to: CGPoint(x: apexPoint.x - dx, y: apexPoint.y - dy))
        path.addQuadCurve(to: CGPoint(x: apexPoint.x + dx, y: apexPoint.y - dy),
                          control: CGPoint(x: apexPoint.x, y: apexPoint.y + dy * 0.35))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
    }
}

/// The flat iOS 7-18 envelope: white paper with seams showing the background.
private struct DockEnvelope: View {
    let edge: CGFloat
    let box: DockBox
    let seam: Color
    /// Seam width as a share of the icon side.
    let seamWidth: Double
    /// Corner radius as a share of the icon side.
    let corner: Double
    /// Rounded notch at the flap's apex, as a share of the envelope width.
    var apexRound: Double = 0

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: edge * corner, style: .continuous).fill(.white)
            DockEnvelopeSeams(apexRound: apexRound)
                .stroke(seam, style: StrokeStyle(lineWidth: max(0.6, edge * seamWidth),
                                                 lineCap: .round, lineJoin: .round))
        }
        .dockBox(box, edge)
    }
}

/// A soft cloud puff: bright in the middle, fading to nothing at its rim.
private struct DockCloudPuff: View {
    let edge: CGFloat
    let x, y, w, h: Double
    var alpha: Double = 0.95

    var body: some View {
        Ellipse()
            .fill(EllipticalGradient(stops: [
                .init(color: .white.opacity(alpha), location: 0),
                .init(color: .white.opacity(alpha * 0.85), location: 0.5),
                .init(color: .white.opacity(0), location: 1),
            ], center: .center, startRadiusFraction: 0, endRadiusFraction: 0.5))
            .frame(width: edge * w, height: edge * h)
            .offset(x: edge * (x - 0.5), y: edge * (y - 0.5))
    }
}

/// iPhone OS 1 - iOS 6 Mail: a sky that darkens under the shine, soft
/// cumulus low left and on the right edge, and a paper envelope with a
/// shallow flap, thin seams and a drop shadow.
private struct DockSkyMail: View {
    let edge: CGFloat
    let sky: [Gradient.Stop]
    let seam: Color
    /// The iOS 4 redraw carried a fuller cloud bank than iPhone OS 1-3.
    var retina: Bool = false

    var body: some View {
        ZStack {
            LinearGradient(stops: sky, startPoint: .top, endPoint: .bottom)
            // Clouds: a bright bank rising from the lower-left corner, thin
            // streaks along the bottom, and a puff on the right edge.
            if retina {
                DockCloudPuff(edge: edge, x: 0.16, y: 0.94, w: 0.78, h: 0.30, alpha: 1)
                DockCloudPuff(edge: edge, x: 0.44, y: 0.99, w: 0.56, h: 0.15, alpha: 0.85)
                DockCloudPuff(edge: edge, x: 0.82, y: 0.94, w: 0.50, h: 0.11, alpha: 0.7)
                DockCloudPuff(edge: edge, x: 0.80, y: 0.79, w: 0.30, h: 0.06, alpha: 0.5)
            } else {
                DockCloudPuff(edge: edge, x: 0.10, y: 0.95, w: 0.56, h: 0.24, alpha: 1)
                DockCloudPuff(edge: edge, x: 0.34, y: 0.99, w: 0.40, h: 0.10, alpha: 0.75)
                DockCloudPuff(edge: edge, x: 0.84, y: 0.95, w: 0.44, h: 0.09, alpha: 0.6)
            }
            DockCloudPuff(edge: edge, x: 0.96, y: 0.57, w: 0.32, h: 0.17, alpha: 0.9)
            DockCloudPuff(edge: edge, x: 0.86, y: 0.61, w: 0.22, h: 0.07, alpha: 0.6)
            // Envelope: bbox x 0.17-0.83, y 0.30-0.72, square corners, the
            // flap reaching a little past halfway down.
            ZStack {
                Rectangle().fill(LinearGradient(colors: [hex(0xF4F6F8), hex(0xDDE2E7)], startPoint: .top, endPoint: .bottom))
                DockEnvelopeFlap(apex: 0.57)
                    .fill(LinearGradient(colors: [hex(0xFFFFFF), hex(0xF1F3F5)], startPoint: .top, endPoint: .bottom))
                DockEnvelopeSeams(apex: 0.57, meetX: 0.34)
                    .stroke(seam, lineWidth: max(0.5, edge * 0.009))
                Rectangle().strokeBorder(hex(0xB9C1CB), lineWidth: max(0.4, edge * 0.006))
            }
            .dockBox(DockBox(0.17, 0.30, 0.83, 0.72), edge)
            .compositingGroup()
            .shadow(color: hex(0x0B2B66, 0.45), radius: edge * 0.012, y: edge * 0.014)
        }
        .frame(width: edge, height: edge)
    }
}

/// iOS 26 Mail: an opaque white flap over a translucent blue-white pocket,
/// bright seam lines and a thin specular outline.
private struct DockGlassEnvelope: View {
    let edge: CGFloat
    let box: DockBox

    var body: some View {
        let corner = edge * 0.03
        ZStack {
            // The pocket: translucent blue-white glass, bluer toward the bottom.
            RoundedRectangle(cornerRadius: corner, style: .continuous)
                .fill(LinearGradient(colors: [hex(0xDCEBFE), hex(0xB4D2F6), hex(0x8DB8F3)], startPoint: .top, endPoint: .bottom))
            // A soft blue shade cast by the flap onto the pocket.
            DockEnvelopeFlap(apex: 0.68, apexRound: 0.09)
                .fill(hex(0x2F6FD6, 0.22))
                .offset(y: edge * 0.012)
                .clipShape(RoundedRectangle(cornerRadius: corner, style: .continuous))
            // The flap: opaque white, a rounded apex about two thirds down.
            DockEnvelopeFlap(apex: 0.64, apexRound: 0.09)
                .fill(LinearGradient(colors: [.white, hex(0xF4F8FD)], startPoint: .top, endPoint: .bottom))
                .clipShape(RoundedRectangle(cornerRadius: corner, style: .continuous))
            // The lower seams read as bright glowing lines, not cut-outs.
            DockEnvelopeSeams(apex: 0.64, meetX: 0.33, apexRound: 0.09)
                .stroke(.white.opacity(0.9), style: StrokeStyle(lineWidth: max(0.5, edge * 0.009), lineCap: .round, lineJoin: .round))
            RoundedRectangle(cornerRadius: corner, style: .continuous)
                .strokeBorder(.white.opacity(0.95), lineWidth: max(0.5, edge * 0.008))
        }
        .dockBox(box, edge)
        .compositingGroup()
        .shadow(color: hex(0x0A3C9A, 0.28), radius: edge * 0.02, y: edge * 0.016)
    }
}

// MARK: - Safari

/// A ring of radial ticks. Even ticks are long, odd ticks short; radii are
/// shares of the ring's radius.
private struct DockTickRing: Shape {
    var count: Int
    var longInner: Double
    var shortInner: Double
    var outer: Double

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        for index in 0..<count {
            let angle = Double(index) / Double(count) * 2 * .pi
            let inner = (index.isMultiple(of: 2) ? longInner : shortInner) * radius
            let (s, c) = (sin(angle), cos(angle))
            path.move(to: CGPoint(x: centre.x + c * inner, y: centre.y + s * inner))
            path.addLine(to: CGPoint(x: centre.x + c * outer * radius, y: centre.y + s * outer * radius))
        }
        return path
    }
}

/// An isosceles triangle filling its rect, pointing up or down.
private struct DockTriangle: Shape {
    var up: Bool

    func path(in rect: CGRect) -> Path {
        var path = Path()
        if up {
            path.move(to: CGPoint(x: rect.midX, y: rect.minY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
            path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        } else {
            path.move(to: CGPoint(x: rect.midX, y: rect.maxY))
            path.addLine(to: CGPoint(x: rect.minX, y: rect.minY))
            path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        }
        path.closeSubpath()
        return path
    }
}

/// The flat dial of iOS 7 onward: a blue disc, a ring of ticks, and a
/// two-colour needle of two triangles meeting at the centre.
private struct DockCompass: View {
    let edge: CGFloat
    var disc: Double
    var face: [Color]
    var ticks: Int = 72
    var tickInk: Color
    var longInner: Double = 0.75
    var shortInner: Double = 0.83
    var tickOuter: Double = 0.92
    /// Tick width as a share of the icon side.
    var tickWidth: Double
    var roundTicks: Bool
    /// Degrees clockwise from north for the red tip.
    var angle: Double
    /// Needle tip radius and full base width, as shares of the disc radius.
    var tip: Double
    var base: Double
    var red: Color
    var white: Color
    /// Hub diameter as a share of the disc radius; 0 for none.
    var hub: Double = 0
    var glass: Bool = false

    var body: some View {
        let diameter = edge * disc
        let radius = diameter / 2
        ZStack {
            Circle().fill(LinearGradient(colors: face, startPoint: .top, endPoint: .bottom))
            if glass {
                Circle().strokeBorder(.white.opacity(0.45), lineWidth: max(0.5, edge * 0.01))
            }
            DockTickRing(count: ticks, longInner: longInner, shortInner: shortInner, outer: tickOuter)
                .stroke(tickInk, style: StrokeStyle(lineWidth: max(0.5, edge * tickWidth),
                                                    lineCap: roundTicks ? .round : .butt))
            ZStack {
                DockTriangle(up: true).fill(red)
                    .frame(width: radius * base, height: radius * tip)
                    .offset(y: -radius * tip / 2)
                DockTriangle(up: false).fill(white)
                    .frame(width: radius * base, height: radius * tip)
                    .offset(y: radius * tip / 2)
            }
            .rotationEffect(.degrees(angle))
            .shadow(color: .black.opacity(glass ? 0.22 : 0), radius: edge * 0.012, y: edge * 0.01)
            if hub > 0 {
                Circle().fill(RadialGradient(colors: [hex(0xFB908D), hex(0xF21C1C)],
                                             center: UnitPoint(x: 0.4, y: 0.35), startRadius: 0, endRadius: radius * hub * 0.6))
                    .frame(width: radius * hub, height: radius * hub)
                    .overlay(Circle().strokeBorder(hex(0xA9403F, 0.6), lineWidth: max(0.4, edge * 0.005)))
            }
        }
        .frame(width: diameter, height: diameter)
        .shadow(color: .black.opacity(glass ? 0.12 : 0), radius: edge * 0.015, y: edge * 0.012)
    }
}

/// An eight-point compass star: long cardinal points, shorter diagonals.
private struct DockStarShape: Shape {
    var short: Double = 0.66
    var inner: Double = 0.17

    func path(in rect: CGRect) -> Path {
        var path = Path()
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        let radius = min(rect.width, rect.height) / 2
        for step in 0..<16 {
            let angle = Double(step) * .pi / 8 - .pi / 2
            let r: Double = step.isMultiple(of: 2) ? (step.isMultiple(of: 4) ? 1 : short) : inner
            let point = CGPoint(x: centre.x + cos(angle) * r * radius, y: centre.y + sin(angle) * r * radius)
            if step == 0 { path.move(to: point) } else { path.addLine(to: point) }
        }
        path.closeSubpath()
        return path
    }
}

/// One lengthwise facet of one needle half: the tip at the far end, the
/// base across the centre of the dial.
private struct DockNeedleFacet: Shape {
    var up: Bool
    var leftHalf: Bool

    func path(in rect: CGRect) -> Path {
        let tipY = up ? rect.minY : rect.maxY
        let baseY = up ? rect.maxY : rect.minY
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: tipY))
        path.addLine(to: CGPoint(x: rect.midX, y: baseY))
        path.addLine(to: CGPoint(x: leftHalf ? rect.minX : rect.maxX, y: baseY))
        path.closeSubpath()
        return path
    }
}

/// The pale land masses behind the pre-iOS 7 compass, as smooth blobs
/// through a handful of points each (unit square).
private struct DockContinents: Shape {
    private static let masses: [[(Double, Double)]] = [
        // Upper left.
        [(0.04, 0.16), (0.16, 0.08), (0.30, 0.10), (0.40, 0.19), (0.34, 0.27),
         (0.24, 0.25), (0.18, 0.36), (0.10, 0.34), (0.03, 0.26)],
        // Upper right.
        [(0.68, 0.14), (0.82, 0.11), (0.95, 0.19), (0.97, 0.33), (0.87, 0.38),
         (0.79, 0.30), (0.70, 0.26)],
        // A strip across the left.
        [(-0.02, 0.44), (0.12, 0.41), (0.27, 0.47), (0.23, 0.56), (0.09, 0.59), (-0.02, 0.55)],
        // South America, tapering to the bottom.
        [(0.63, 0.52), (0.72, 0.49), (0.80, 0.55), (0.81, 0.64), (0.77, 0.72),
         (0.74, 0.83), (0.70, 0.96), (0.67, 0.90), (0.66, 0.78), (0.62, 0.67), (0.59, 0.58)],
    ]

    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height)
        func at(_ p: (Double, Double)) -> CGPoint { CGPoint(x: rect.minX + s * p.0, y: rect.minY + s * p.1) }
        func mid(_ a: (Double, Double), _ b: (Double, Double)) -> CGPoint { at(((a.0 + b.0) / 2, (a.1 + b.1) / 2)) }
        var path = Path()
        for mass in Self.masses {
            let n = mass.count
            path.move(to: mid(mass[n - 1], mass[0]))
            for i in 0..<n {
                path.addQuadCurve(to: mid(mass[i], mass[(i + 1) % n]), control: at(mass[i]))
            }
            path.closeSubpath()
        }
        return path
    }
}

/// iPhone OS 1 - iOS 6 Safari: sky darkening under the shine, a faint world
/// map, a tick ring at the edge, and a white compass rose with N/E/S/W in
/// translucent discs. The needle is DockRoseNeedle, drawn over the shine.
private struct DockCompassRose: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            // Base colours sit under the system shine, so the top is darker
            // than the sampled surface; the darkest band is just below the shine.
            LinearGradient(stops: [
                .init(color: hex(0x5F8CE0), location: 0),
                .init(color: hex(0x4A88E6), location: 0.36),
                .init(color: hex(0x2876E3), location: 0.47),
                .init(color: hex(0x4EA0EA), location: 0.70),
                .init(color: hex(0x8BDEFC), location: 1),
            ], startPoint: .top, endPoint: .bottom)
            // The faint world map in paler blue: land top-left and top-right,
            // a strip across the left, South America tapering at lower right.
            DockContinents().fill(hex(0xC4EEFF, 0.2))
                .frame(width: edge, height: edge)
            // The tick ring hugs the tile edge.
            DockTickRing(count: 72, longInner: 0.93, shortInner: 0.93, outer: 1)
                .stroke(hex(0x3C8FE6, 0.85), lineWidth: max(0.5, edge * 0.012))
                .frame(width: edge * 0.98, height: edge * 0.98)
            // Letter discs at the four cardinal points.
            Group {
                cardinal("N", x: 0.5, y: 0.13, rotation: 0)
                cardinal("S", x: 0.5, y: 0.87, rotation: 0)
                cardinal("W", x: 0.13, y: 0.5, rotation: -90)
                cardinal("E", x: 0.87, y: 0.5, rotation: 90)
            }
            // The rose: long thin cardinal points to r 0.30, short diagonals
            // to r 0.20, a tinted disc and a white ring at r 0.14.
            DockStarShape(short: 0.66, inner: 0.13).fill(.white)
                .frame(width: edge * 0.60, height: edge * 0.60)
            Circle().fill(hex(0x8DBDF2, 0.55))
                .frame(width: edge * 0.28, height: edge * 0.28)
            Circle().strokeBorder(.white.opacity(0.95), lineWidth: max(0.5, edge * 0.016))
                .frame(width: edge * 0.30, height: edge * 0.30)
        }
        .frame(width: edge, height: edge)
    }

    private func cardinal(_ letter: String, x: Double, y: Double, rotation: Double) -> some View {
        ZStack {
            Circle().fill(hex(0xA1C0EE, 0.55))
            Text(letter)
                .font(.system(size: edge * 0.115, weight: .bold, design: .serif))
                .foregroundStyle(.white)
                .rotationEffect(.degrees(rotation))
        }
        .frame(width: edge * 0.15, height: edge * 0.15)
        .offset(x: edge * (x - 0.5), y: edge * (y - 0.5))
    }
}

/// The pre-iOS 7 Safari needle and its chrome pivot cap: burnt orange to
/// the north-east, silver to the south-west, each half split into a lit
/// facet (upper-left) and a shaded one. Measured on both the OS 1-3 and the
/// iOS 4-6 icons: 45 degrees, tips 0.457 from the centre, 0.115 wide across
/// the pivot; the orange deepens toward the pivot, the silver shade is a
/// neutral grey. Drawn above the system shine, as Apple's own shine lay
/// beneath it.
private struct DockRoseNeedle: View {
    let edge: CGFloat

    var body: some View {
        let width = edge * 0.115
        let half = edge * 0.455
        ZStack {
            ZStack {
                // Each half is laid down whole in its shade colour and the lit
                // facet goes on top, so no background leaks along the seam.
                ZStack {
                    DockTriangle(up: true)
                        .fill(LinearGradient(colors: [hex(0xBC5826), hex(0xA94E21)], startPoint: .top, endPoint: .bottom))
                    DockNeedleFacet(up: true, leftHalf: true)
                        .fill(LinearGradient(colors: [hex(0xE06C31), hex(0xCD5F29)], startPoint: .top, endPoint: .bottom))
                }
                .frame(width: width, height: half)
                .offset(y: -half / 2)
                ZStack {
                    DockTriangle(up: false)
                        .fill(LinearGradient(colors: [hex(0xA4A4A4), hex(0xB2B2B2)], startPoint: .top, endPoint: .bottom))
                    DockNeedleFacet(up: false, leftHalf: true).fill(hex(0xF2F2F2))
                }
                .frame(width: width, height: half)
                .offset(y: half / 2)
            }
            .rotationEffect(.degrees(45))
            .compositingGroup()
            .shadow(color: hex(0x0A2A66, 0.45), radius: edge * 0.01, x: edge * 0.008, y: edge * 0.014)
            Circle().fill(RadialGradient(colors: [.white, hex(0xC7CDD4)], center: UnitPoint(x: 0.4, y: 0.35),
                                         startRadius: 0, endRadius: edge * 0.045))
                .overlay(Circle().strokeBorder(hex(0x7E8791, 0.7), lineWidth: max(0.4, edge * 0.005)))
                .frame(width: edge * 0.078, height: edge * 0.078)
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Music

/// The iPod classic silhouette. Fill even-odd: the screen and the click
/// wheel ring are holes, the centre button is solid again.
private struct DockIPodShape: Shape {
    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height)
        func box(_ x0: Double, _ y0: Double, _ x1: Double, _ y1: Double) -> CGRect {
            CGRect(x: rect.minX + s * x0, y: rect.minY + s * y0, width: s * (x1 - x0), height: s * (y1 - y0))
        }
        var path = Path()
        path.addRoundedRect(in: box(0.305, 0.15, 0.695, 0.81), cornerSize: CGSize(width: s * 0.035, height: s * 0.035))
        path.addRoundedRect(in: box(0.347, 0.208, 0.653, 0.417), cornerSize: CGSize(width: s * 0.012, height: s * 0.012))
        path.addEllipse(in: box(0.342, 0.452, 0.658, 0.768))
        path.addEllipse(in: box(0.454, 0.564, 0.546, 0.656))
        return path
    }
}

/// The striped iPod of iPhone OS 3 and iOS 4, with the drop shadow those
/// releases added under the silhouette.
private struct DockIPod: View {
    let edge: CGFloat
    let stripes: Bool

    var body: some View {
        ZStack {
            if stripes {
                DockStripes(period: 0.035).stroke(.white.opacity(0.09), lineWidth: edge * 0.0175)
                    .frame(width: edge, height: edge)
            }
            // The drop shadow as an offset silhouette: it falls below the
            // body and just inside the top edges of the screen and wheel
            // cut-outs, which otherwise keep showing the orange.
            DockIPodShape()
                .fill(hex(0x6A2A00, 0.35), style: FillStyle(eoFill: true))
                .frame(width: edge, height: edge)
                .offset(y: edge * 0.014)
            DockIPodShape()
                .fill(LinearGradient(colors: [.white, hex(0xEFF2F2)], startPoint: .top, endPoint: .bottom),
                      style: FillStyle(eoFill: true))
                .frame(width: edge, height: edge)
        }
    }
}

/// A soft colour pooling in one bottom corner, for the mottled iOS 5 orange.
private struct DockCornerGlow: View {
    let edge: CGFloat
    let colour: Color
    let corner: UnitPoint

    var body: some View {
        RadialGradient(colors: [colour.opacity(0.85), colour.opacity(0)], center: corner,
                       startRadius: 0, endRadius: edge * 0.55)
            .frame(width: edge, height: edge)
    }
}

/// The beamed note filled in one style, with a round-joined stroke of the
/// same style to soften the corners the way Apple's glyph does.
private struct DockNote<S: ShapeStyle>: View {
    let edge: CGFloat
    let geometry: DockNoteShape.Geometry
    let style: S
    /// Applied to the note as one layer, so fill and stroke never double up.
    var opacity: Double = 1

    var body: some View {
        ZStack {
            DockNoteShape(geometry: geometry).fill(style)
            DockNoteShape(geometry: geometry)
                .stroke(style, style: StrokeStyle(lineWidth: max(0.5, edge * 0.018), lineJoin: .round))
        }
        .frame(width: edge, height: edge)
        .compositingGroup()
        .opacity(opacity)
    }
}

/// Beamed pair of eighth notes, Apple's Music glyph since iOS 5. All parts
/// are polygons wound the same way so the union fills cleanly.
private struct DockNoteShape: Shape {
    struct Geometry {
        var leftStem: ClosedRange<Double>
        var rightStem: ClosedRange<Double>
        /// Beam top-edge y at the left stem's outer edge and the right stem's outer edge.
        var beamLeftY: Double
        var beamRightY: Double
        var beamThickness: Double
        /// Note-head semi-axes and centres; heads lean 20 degrees, right end up.
        var headA: Double
        var headB: Double
        var leftHead: CGPoint
        var rightHead: CGPoint
        var cornerRadius: Double = 0.012

        /// iOS 5-6: the maroon note, x 0.263-0.712, y 0.175-0.80.
        static let ios5 = Geometry(leftStem: 0.407...0.441, rightStem: 0.678...0.712,
                                   beamLeftY: 0.255, beamRightY: 0.175, beamThickness: 0.15,
                                   headA: 0.087, headB: 0.058,
                                   leftHead: CGPoint(x: 0.35, y: 0.745), rightHead: CGPoint(x: 0.625, y: 0.665))
        /// iOS 7-8.3: x 0.166-0.724, y 0.150-0.824.
        static let ios7 = Geometry(leftStem: 0.333...0.374, rightStem: 0.683...0.724,
                                   beamLeftY: 0.222, beamRightY: 0.150, beamThickness: 0.155,
                                   headA: 0.105, headB: 0.075,
                                   leftHead: CGPoint(x: 0.270, y: 0.749), rightHead: CGPoint(x: 0.620, y: 0.682))
        /// iOS 8.4-13: x 0.197-0.733, y 0.153-0.831.
        static let appleMusic = Geometry(leftStem: 0.354...0.394, rightStem: 0.693...0.732,
                                         beamLeftY: 0.225, beamRightY: 0.153, beamThickness: 0.155,
                                         headA: 0.100, headB: 0.072,
                                         leftHead: CGPoint(x: 0.2955, y: 0.755), rightHead: CGPoint(x: 0.6335, y: 0.6875))
        /// iOS 14-18: x 0.200-0.728, y 0.156-0.828, thinner stems.
        static let ios14 = Geometry(leftStem: 0.356...0.389, rightStem: 0.694...0.728,
                                    beamLeftY: 0.228, beamRightY: 0.156, beamThickness: 0.155,
                                    headA: 0.097, headB: 0.072,
                                    leftHead: CGPoint(x: 0.2945, y: 0.7515), rightHead: CGPoint(x: 0.6335, y: 0.6875))
        /// iOS 18: the iOS 14 note nudged right, x 0.211-0.739.
        static let ios18 = Geometry(leftStem: 0.367...0.400, rightStem: 0.705...0.739,
                                    beamLeftY: 0.228, beamRightY: 0.156, beamThickness: 0.155,
                                    headA: 0.097, headB: 0.072,
                                    leftHead: CGPoint(x: 0.3055, y: 0.7515), rightHead: CGPoint(x: 0.6445, y: 0.6875))
        /// iOS 26-27: x 0.209-0.743, y 0.153-0.83.
        static let ios26 = Geometry(leftStem: 0.365...0.403, rightStem: 0.704...0.743,
                                    beamLeftY: 0.226, beamRightY: 0.153, beamThickness: 0.155,
                                    headA: 0.100, headB: 0.073,
                                    leftHead: CGPoint(x: 0.306, y: 0.752), rightHead: CGPoint(x: 0.644, y: 0.686))
    }

    var geometry: Geometry

    func path(in rect: CGRect) -> Path {
        let s = min(rect.width, rect.height)
        func at(_ x: Double, _ y: Double) -> CGPoint { CGPoint(x: rect.minX + s * x, y: rect.minY + s * y) }
        let g = geometry
        var path = Path()

        // Beam: a parallelogram from the left stem's outer edge to the right stem's.
        let slope = (g.beamRightY - g.beamLeftY) / (g.rightStem.upperBound - g.leftStem.lowerBound)
        func beamTop(_ x: Double) -> Double { g.beamLeftY + slope * (x - g.leftStem.lowerBound) }
        path.move(to: at(g.leftStem.lowerBound, g.beamLeftY))
        path.addLine(to: at(g.rightStem.upperBound, g.beamRightY))
        path.addLine(to: at(g.rightStem.upperBound, g.beamRightY + g.beamThickness))
        path.addLine(to: at(g.leftStem.lowerBound, g.beamLeftY + g.beamThickness))
        path.closeSubpath()

        // Stems: from inside the beam down into each head.
        for (stem, head) in [(g.leftStem, g.leftHead), (g.rightStem, g.rightHead)] {
            let top = beamTop(stem.lowerBound) + g.beamThickness * 0.5
            path.move(to: at(stem.lowerBound, top))
            path.addLine(to: at(stem.upperBound, top))
            path.addLine(to: at(stem.upperBound, head.y))
            path.addLine(to: at(stem.lowerBound, head.y))
            path.closeSubpath()
        }

        // Heads: ellipses leaning 20 degrees, traced clockwise like the rects.
        let lean = -20.0 * Double.pi / 180
        for head in [g.leftHead, g.rightHead] {
            for step in 0...40 {
                let t = Double(step) / 40 * 2 * .pi
                let x = head.x + g.headA * cos(t) * cos(lean) - g.headB * sin(t) * sin(lean)
                let y = head.y + g.headA * cos(t) * sin(lean) + g.headB * sin(t) * cos(lean)
                if step == 0 { path.move(to: at(x, y)) } else { path.addLine(to: at(x, y)) }
            }
            path.closeSubpath()
        }
        return path
    }
}
