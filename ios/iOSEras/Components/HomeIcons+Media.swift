//
//  HomeIcons+Media.swift
//  iOSEras
//
//  Icon designs, one entry per redesign, for: Photos, Camera, Maps, Weather, Clock.
//  Every generation below is drawn from the real icon of that release (see
//  research-home/specs/icons-music-photos-camera-maps.md and
//  icons-calendar-clock-weather-notes.md): same glyph, same colours, same
//  proportions in unit-square coordinates, same first year. The system layer
//  draws the tile, the 2007-2012 gloss, the 2025+ glass rim and the label;
//  this file draws only the background stops and the artwork.
//

import SwiftUI

extension HomeApp {
    static let media: [HomeApp] = [
        HomeApp("Photos", designs: [
            // iPhone OS 1 - iOS 6: the sunflower photograph on a hazy sky.
            design(2007, 0xB7D2F6, 0xBDD6EA, art { edge in MediaSunflowerArt(edge: edge) }),
            // iOS 7 - iOS 18: the eight-petal pinwheel, unchanged for eleven years.
            flat(2013, 0xFFFFFF, art { edge in
                MediaPinwheelArt(edge: edge, glass: false, width: 0.265, inner: 0.02, outer: 0.445,
                                 petals: [hex(0xFAAA31), hex(0xF6E422), hex(0xB9D753), hex(0x6CBEB0),
                                          hex(0x79ADDC), hex(0xA48DC1), hex(0xD388B1), hex(0xF37A5D)])
            }),
            // iOS 26: eight separate glass petals, saturated, with a white gap at the centre.
            design(2025, 0xFFFFFF, 0xECECEC, art { edge in
                MediaPinwheelArt(edge: edge, glass: true, width: 0.22, inner: 0.06, outer: 0.40,
                                 petals: [hex(0xFF8502), hex(0xFEC200), hex(0x6FC000), hex(0x1FA96A),
                                          hex(0x3F8CED), hex(0x9A74E0), hex(0xF155C1), hex(0xFF5561)])
            }),
            // iOS 27: candy-bright petals, sampled from a real iOS 27.0 home screen:
            // the blue turns cyan, the green mint, the violet lavender.
            design(2026, 0xFFFFFF, 0xE8E9EA, art { edge in
                MediaPinwheelArt(edge: edge, glass: true, width: 0.225, inner: 0.05, outer: 0.405,
                                 petals: [hex(0xFF8D00), hex(0xFECC00), hex(0x8FD500), hex(0x00D582),
                                          hex(0x00ABF3), hex(0x9F8CE1), hex(0xFF6DB2), hex(0xFF5960)])
            }),
        ]),

        HomeApp("Camera", designs: [
            // iPhone OS 1 - iOS 6: a photoreal lens on brushed silver.
            design(2007, 0xF6F6F6, 0x7E8186, art { edge in MediaLensArt(edge: edge, look: .classic) }),
            // iOS 7 - iOS 10: a dark camera body with two light lines and a shutter button.
            design(2013, 0xDBDBDD, 0x898C92, art { edge in MediaCameraArt(edge: edge, generation: .ios7) }),
            // iOS 11 - iOS 14: lines gone, body flat, shutter button floats above.
            design(2017, 0xE4E3E8, 0x909094, art { edge in MediaCameraArt(edge: edge, generation: .ios11) }),
            // iOS 15 - iOS 17: rounder body, shutter button removed.
            design(2021, 0xE5E5EA, 0x8E8D92, art { edge in MediaCameraArt(edge: edge, generation: .ios15) }),
            // iOS 18: a thicker lens ring and a bigger yellow dot, further right.
            design(2024, 0xE5E5EA, 0x8E8D92, art { edge in MediaCameraArt(edge: edge, generation: .ios18) }),
            // iOS 26: the lens returns, large, in Liquid Glass: grey glass bezel, navy
            // glass, a highlight upper-left and a blue flare arcing round the lower right.
            design(2025, 0xD5D5D5, 0xA4A4A4, art { edge in MediaLensArt(edge: edge, look: .glass26) }),
            // iOS 27: lighter tile, darker bezel, reflections moved onto the vertical axis
            // (Logopedia's iOS 27 asset; not corroborated by press coverage).
            design(2026, 0xDADADA, 0xBEBEBE, art { edge in MediaLensArt(edge: edge, look: .glass27) }),
        ]),

        HomeApp("Maps", designs: [
            // iPhone OS 1 - iOS 5: Google-era tile of 1 Infinite Loop, I-280 shield, red pushpin.
            design(2007, 0xF2EFE7, 0xD3CFC1, art { edge in MediaMapGoogleArt(edge: edge) }),
            // iOS 6: Apple's own map; the blue route that turned left off the overpass.
            design(2012, 0xF6F1E1, 0xDAD3BC, art { edge in MediaMapIOS6Art(edge: edge) }),
            // iOS 7 - iOS 10: the flat map, route corrected, shield bottom-left.
            flat(2013, 0xE5DDC9, art { edge in MediaMapIOS7Art(edge: edge) }),
            // iOS 11 - iOS 14: Apple Park beside I-280.
            flat(2017, 0xE3E1DA, art { edge in MediaMapParkArt(edge: edge) }),
            // iOS 15 - iOS 18: the big location marker; the shield is gone.
            flat(2021, 0xF2F1F6, art { edge in MediaMapModernArt(edge: edge, look: .ios15) }),
            // iOS 26: same map as raised glass blocks, frosted marker ring.
            design(2025, 0xF6F6F6, 0xF0F0F0, art { edge in MediaMapModernArt(edge: edge, look: .ios26) }),
            // iOS 27: the marker ring becomes a clear lens; Apple Park is three thin arcs.
            design(2026, 0xEFEFEF, 0xE2E2E2, art { edge in MediaMapModernArt(edge: edge, look: .ios27) }),
        ]),

        HomeApp("Weather", designs: [
            // iPhone OS 1 - 3: a sun over a hard blue horizon and a static 73°.
            design(2007, 0x0F72EE, 0x40D2FB, art { edge in MediaWeatherArt(edge: edge, look: .classic2007) }),
            // iOS 4 - iOS 6: the Retina redraw, paler sky, a sun with forty rays.
            design(2010, 0x3584E6, 0x89DDFB, art { edge in MediaWeatherArt(edge: edge, look: .retina2010) }),
            // iOS 7 - iOS 10: a flat sun behind a translucent cloud.
            design(2013, 0x1D68F0, 0x19CEFC, art { edge in MediaWeatherArt(edge: edge, look: .flat2013) }),
            // iOS 11 - iOS 14: retuned per Logopedia, slightly less cyan, cloud a touch bigger.
            design(2017, 0x1D76F2, 0x1AC2FA, art { edge in MediaWeatherArt(edge: edge, look: .flat2017) }),
            // iOS 15 - iOS 18: sun moves to the right, sky darker at the top, cloud blue-white.
            design(2021, 0x0C53AF, 0x33A0E9, art { edge in MediaWeatherArt(edge: edge, look: .ios15) }),
            // iOS 26: gradient reversed again, cloud and sun in Liquid Glass.
            design(2025, 0x369AE6, 0x0D53AD, art { edge in MediaWeatherArt(edge: edge, look: .ios26) }),
            // iOS 27 release: brighter blue, a warmer sun.
            design(2026, 0x349EFF, 0x1B73DA, art { edge in MediaWeatherArt(edge: edge, look: .ios27) }),
        ]),

        HomeApp("Clock", designs: [
            // iPhone OS 1 - 3: a glossy black tile, white face, tapered hands frozen at
            // 10:15, a red cap at the pivot.
            design(2007, 0x4A4A4A, 0x000000, art { edge in MediaClockArt(edge: edge, spec: .skeuo2007) }),
            // iOS 4 - iOS 5: the Retina redraw; bigger face, white cap ringed in black.
            design(2010, 0x525252, 0x000000, art { edge in MediaClockArt(edge: edge, spec: .skeuo2010) }),
            // iOS 6: the same clock, hands rounded into bars.
            design(2012, 0x4A4A4A, 0x000000, art { edge in MediaClockArt(edge: edge, spec: .skeuo2012) }),
            // iOS 7: flat on black and live for the first time; hairline hands, red-orange seconds.
            flat(2013, 0x000000, art { edge in MediaClockArt(edge: edge, spec: .flat2013) }),
            // iOS 8.0: bolder, longer hands.
            flat(2014, 0x000000, art { edge in MediaClockArt(edge: edge, spec: .flat2014) }),
            // iOS 8.3 - iOS 9: thin again, tile softens to dark grey, San Francisco numerals.
            flat(2015, 0x1E1E1F, art { edge in MediaClockArt(edge: edge, spec: .flat2015) }),
            // iOS 10: the second hand turns orange.
            flat(2016, 0x1E1E1F, art { edge in MediaClockArt(edge: edge, spec: .flat2016) }),
            // iOS 11 - iOS 13: rounded hand ends, hands reach the numerals.
            flat(2017, 0x202021, art { edge in MediaClockArt(edge: edge, spec: .flat2017) }),
            // iOS 14 - iOS 17: bold hands with a thin stem, semibold numerals.
            flat(2020, 0x1C1C1E, art { edge in MediaClockArt(edge: edge, spec: .flat2020) }),
            // iOS 18: a gradient behind the same face.
            design(2024, 0x303030, 0x151515, art { edge in MediaClockArt(edge: edge, spec: .flat2024) }),
            // iOS 26: Swiss railway dial filling the tile, only 12 / 3 / 6 / 9.
            design(2025, 0xFFFFFF, 0xEBEBEB, art { edge in MediaClockArt(edge: edge, spec: .swiss2025) }),
            // iOS 27: the same dial, lighter indices, a shorter second hand.
            design(2026, 0xFEFEFE, 0xF6F6F6, art { edge in MediaClockArt(edge: edge, spec: .swiss2026) }),
        ]),
    ]
}

// MARK: - Placement helpers

/// Unit-square coordinates: origin top-left, fractions of the icon edge.
private extension View {
    func mediaAt(_ edge: CGFloat, _ cx: Double, _ cy: Double, w: Double, h: Double) -> some View {
        frame(width: edge * w, height: edge * h)
            .offset(x: edge * (cx - 0.5), y: edge * (cy - 0.5))
    }

    func mediaCircle(_ edge: CGFloat, _ cx: Double, _ cy: Double, r: Double) -> some View {
        mediaAt(edge, cx, cy, w: r * 2, h: r * 2)
    }
}

private func mediaPoint(_ x: Double, _ y: Double, in rect: CGRect) -> CGPoint {
    CGPoint(x: rect.minX + rect.width * x, y: rect.minY + rect.height * y)
}

/// Any path in unit coordinates.
private struct MediaPath: Shape {
    let build: (CGRect) -> Path
    func path(in rect: CGRect) -> Path { build(rect) }
}

/// A filled polygon in unit coordinates.
private struct MediaPolygon: Shape {
    let points: [(Double, Double)]
    func path(in rect: CGRect) -> Path {
        var path = Path()
        for (index, point) in points.enumerated() {
            let p = mediaPoint(point.0, point.1, in: rect)
            if index == 0 { path.move(to: p) } else { path.addLine(to: p) }
        }
        path.closeSubpath()
        return path
    }
}

/// N radial bars between two radii, as one path. `skipEvery` leaves out
/// every n-th bar (minute ticks skip the hours).
private struct MediaRadialBars: Shape {
    var count: Int
    var inner: Double
    var outer: Double
    var width: Double
    var skipEvery: Int = 0

    func path(in rect: CGRect) -> Path {
        let side = min(rect.width, rect.height)
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        var path = Path()
        for index in 0..<count where skipEvery == 0 || index % skipEvery != 0 {
            let angle = Double(index) / Double(count) * 2 * .pi
            let bar = CGRect(x: -side * width / 2, y: -side * outer, width: side * width, height: side * (outer - inner))
            let transform = CGAffineTransform(translationX: centre.x, y: centre.y).rotated(by: angle)
            path.addPath(Path(roundedRect: bar, cornerRadius: side * width / 2), transform: transform)
        }
        return path
    }
}

/// A ring of pointed petals, as one path.
private struct MediaPetalRing: Shape {
    var count: Int
    var inner: Double
    var outer: Double
    var width: Double
    var phase: Double = 0

    func path(in rect: CGRect) -> Path {
        let side = min(rect.width, rect.height)
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        var path = Path()
        for index in 0..<count {
            let angle = (Double(index) + phase) / Double(count) * 2 * .pi
            var petal = Path()
            petal.move(to: CGPoint(x: 0, y: -side * inner))
            petal.addQuadCurve(to: CGPoint(x: 0, y: -side * outer),
                               control: CGPoint(x: -side * width, y: -side * (inner + outer) / 2))
            petal.addQuadCurve(to: CGPoint(x: 0, y: -side * inner),
                               control: CGPoint(x: side * width, y: -side * (inner + outer) / 2))
            petal.closeSubpath()
            path.addPath(petal, transform: CGAffineTransform(translationX: centre.x, y: centre.y).rotated(by: angle))
        }
        return path
    }
}

/// Apple's navigation arrow: a slim triangle with a notch cut up to 0.66 of
/// the height, and every corner rounded off - a blunt tip, soft swept-back
/// wings, a soft notch. The outline is traced from the real iOS 18 Maps
/// marker: straight sides, widest at 0.95 of the height, the wings rounded
/// away so the bottom reads as two soft points rather than two spikes.
private struct MediaArrowShape: Shape {
    func path(in rect: CGRect) -> Path {
        func p(_ x: Double, _ y: Double) -> CGPoint { mediaPoint(x, y, in: rect) }
        var path = Path()
        path.move(to: p(0.5, 0))
        path.addCurve(to: p(0.5953, 0.10), control1: p(0.5295, 0), control2: p(0.5657, 0.038))
        path.addLine(to: p(1, 0.95))
        path.addQuadCurve(to: p(0.945, 1), control: p(1.024, 1))
        path.addQuadCurve(to: p(0.8475, 0.95), control: p(0.9074, 1))
        path.addLine(to: p(0.5479, 0.70))
        path.addQuadCurve(to: p(0.4521, 0.70), control: p(0.5, 0.66))
        path.addLine(to: p(0.1525, 0.95))
        path.addQuadCurve(to: p(0.055, 1), control: p(0.0926, 1))
        path.addQuadCurve(to: p(0, 0.95), control: p(-0.024, 1))
        path.addLine(to: p(0.4047, 0.10))
        path.addCurve(to: p(0.5, 0), control1: p(0.4343, 0.038), control2: p(0.4705, 0))
        path.closeSubpath()
        return path
    }
}

/// An Interstate shield: a crown of three scallops over sides that bow out
/// and meet at a rounded point.
private struct MediaShieldShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: mediaPoint(0.02, 0.17, in: rect))
        path.addQuadCurve(to: mediaPoint(0.34, 0.15, in: rect), control: mediaPoint(0.17, 0.0, in: rect))
        path.addQuadCurve(to: mediaPoint(0.66, 0.15, in: rect), control: mediaPoint(0.5, 0.0, in: rect))
        path.addQuadCurve(to: mediaPoint(0.98, 0.17, in: rect), control: mediaPoint(0.83, 0.0, in: rect))
        path.addCurve(to: mediaPoint(0.5, 1.0, in: rect), control1: mediaPoint(1.02, 0.55, in: rect), control2: mediaPoint(0.82, 0.92, in: rect))
        path.addCurve(to: mediaPoint(0.02, 0.17, in: rect), control1: mediaPoint(0.18, 0.92, in: rect), control2: mediaPoint(-0.02, 0.55, in: rect))
        path.closeSubpath()
        return path
    }
}

/// The three-lobed cloud on a flat base. Drawn in a box whose height is
/// 0.674 of its width.
private struct MediaCloudShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width
        func circle(_ cx: Double, _ cy: Double, _ r: Double) -> CGRect {
            CGRect(x: rect.minX + w * (cx - r), y: rect.minY + w * (cy - r), width: w * r * 2, height: w * r * 2)
        }
        var path = Path()
        path.addEllipse(in: circle(0.18, 0.49, 0.18))
        path.addEllipse(in: circle(0.45, 0.30, 0.30))
        path.addEllipse(in: circle(0.75, 0.42, 0.25))
        // The flat base runs only between the end lobes' centres, so both ends
        // are the lobes' own round arcs down to the base at 0.67w.
        path.addRect(CGRect(x: rect.minX + w * 0.18, y: rect.minY + w * 0.42, width: w * 0.57, height: w * 0.25))
        return path
    }
}

/// A tapered clock hand: a spade from the pivot to a point.
private struct MediaTaperedHand: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: mediaPoint(0.5, 0, in: rect))
        path.addLine(to: mediaPoint(1, 0.86, in: rect))
        path.addLine(to: mediaPoint(0.5, 1, in: rect))
        path.addLine(to: mediaPoint(0, 0.86, in: rect))
        path.closeSubpath()
        return path
    }
}

// MARK: - Photos

/// iPhone OS 1 - iOS 6: a big sunflower head against a hazy summer sky: two
/// rings of broad golden petals round a near-black seed disc, on a green stem
/// with a leaf either side.
private struct MediaSunflowerArt: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            // The deeper blue band across the middle of the sky, and a little haze.
            LinearGradient(colors: [.clear, hex(0x5E8CC8, 0.9), hex(0x8FB2DE, 0.5), .clear],
                           startPoint: .top, endPoint: .bottom)
                .mediaAt(edge, 0.5, 0.50, w: 1, h: 0.44)
            MediaGlow(colour: .white, alpha: 0.75).mediaAt(edge, 0.10, 0.60, w: 0.40, h: 0.16)
            MediaGlow(colour: .white, alpha: 0.6).mediaAt(edge, 0.95, 0.66, w: 0.30, h: 0.14)
            // Stem and leaves.
            Capsule().fill(LinearGradient(colors: [hex(0xADC75D), hex(0x5B8412)], startPoint: .leading, endPoint: .trailing))
                .frame(width: edge * 0.06, height: edge * 0.32)
                .rotationEffect(.degrees(8))
                .offset(x: edge * -0.03, y: edge * 0.37)
            Ellipse().fill(LinearGradient(colors: [hex(0x5C9A22), hex(0x2F5A08)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.27, height: edge * 0.11)
                .rotationEffect(.degrees(-32))
                .offset(x: edge * -0.23, y: edge * 0.22)
            Ellipse().fill(LinearGradient(colors: [hex(0x4E8418), hex(0x1F3A04)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.32, height: edge * 0.085)
                .rotationEffect(.degrees(-22))
                .offset(x: edge * 0.29, y: edge * 0.31)
            // Petals: three staggered rings of narrow pointed rays, the back ones
            // longest and shaded, so sky shows between the tips.
            MediaPetalRing(count: 13, inner: 0.12, outer: 0.415, width: 0.085, phase: 0.33)
                .fill(LinearGradient(colors: [hex(0xEAA416), hex(0xB86E06)], startPoint: .top, endPoint: .bottom))
                .mediaCircle(edge, 0.53, 0.43, r: 0.5)
            MediaPetalRing(count: 13, inner: 0.12, outer: 0.39, width: 0.085, phase: 0.67)
                .fill(LinearGradient(colors: [hex(0xFFD834), hex(0xF0AC18)], startPoint: .top, endPoint: .bottom))
                .mediaCircle(edge, 0.53, 0.43, r: 0.5)
            MediaPetalRing(count: 13, inner: 0.12, outer: 0.36, width: 0.09)
                .fill(LinearGradient(colors: [hex(0xFFE640), hex(0xFFD42C), hex(0xF8C020)], startPoint: .top, endPoint: .bottom))
                .mediaCircle(edge, 0.53, 0.43, r: 0.5)
            // The seed disc: brown-black, a darker rim, a pale crescent of seeds.
            Circle().fill(RadialGradient(colors: [hex(0x1E1206), hex(0x2E1D0C), hex(0x4A3216)],
                                         center: UnitPoint(x: 0.45, y: 0.45), startRadius: 0, endRadius: edge * 0.16))
                .mediaCircle(edge, 0.53, 0.43, r: 0.155)
            Circle().strokeBorder(hex(0x2A1A0A, 0.9), lineWidth: edge * 0.014)
                .mediaCircle(edge, 0.53, 0.43, r: 0.155)
            Circle().trim(from: 0.85, to: 1.12)
                .stroke(hex(0x9C7E52, 0.8), style: StrokeStyle(lineWidth: edge * 0.022, lineCap: .round))
                .mediaCircle(edge, 0.53, 0.44, r: 0.075)
        }
        .frame(width: edge, height: edge)
    }
}

/// iOS 7 onward: eight capsules fanned round the centre. The flat version
/// multiplies where petals overlap; the glass version is eight separate
/// translucent petals with a rim and a shadow.
private struct MediaPinwheelArt: View {
    let edge: CGFloat
    let glass: Bool
    let width: Double
    let inner: Double
    let outer: Double
    let petals: [Color]

    var body: some View {
        let length = outer - inner
        ZStack {
            ForEach(Array(petals.enumerated()), id: \.offset) { index, colour in
                Capsule().fill(colour)
                    .overlay {
                        if glass {
                            Capsule().strokeBorder(.white.opacity(0.45), lineWidth: edge * 0.008)
                        }
                    }
                    .shadow(color: .black.opacity(glass ? 0.18 : 0), radius: edge * 0.012, y: edge * 0.012)
                    .frame(width: edge * width, height: edge * length)
                    .offset(y: -edge * (inner + length / 2))
                    .rotationEffect(.degrees(Double(index) / Double(petals.count) * 360))
                    .blendMode(.multiply)
            }
            if !glass {
                Circle().fill(.white).frame(width: edge * 0.04, height: edge * 0.04)
            }
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Camera

private enum MediaLensLook { case classic, glass26, glass27 }

/// A camera lens seen head-on.
private struct MediaLensArt: View {
    let edge: CGFloat
    let look: MediaLensLook

    var body: some View {
        ZStack {
            switch look {
            case .classic: classic
            case .glass26: glass26
            case .glass27: glass27
            }
        }
        .frame(width: edge, height: edge)
    }

    /// iPhone OS 1 - iOS 6: a thick black barrel, a stepped ridge, a slate-blue
    /// glass with its inner element ringed, aperture reflections upper-left.
    private var classic: some View {
        ZStack {
            Circle().fill(LinearGradient(colors: [hex(0x1C1C1C), hex(0x050505)], startPoint: .top, endPoint: .bottom))
                .shadow(color: .black.opacity(0.45), radius: edge * 0.02, y: edge * 0.015)
                .mediaCircle(edge, 0.5, 0.5, r: 0.33)
            Circle().strokeBorder(LinearGradient(colors: [hex(0x3C3C3C), hex(0x1A1A1A)], startPoint: .top, endPoint: .bottom), lineWidth: edge * 0.035)
                .mediaCircle(edge, 0.5, 0.5, r: 0.245)
            Circle().fill(RadialGradient(colors: [hex(0x86A8C4), hex(0x4E7494), hex(0x263A4E), hex(0x0B1826)],
                                         center: UnitPoint(x: 0.42, y: 0.38), startRadius: 0, endRadius: edge * 0.21))
                .mediaCircle(edge, 0.5, 0.5, r: 0.195)
            Circle().strokeBorder(hex(0x9CBAD2, 0.45), lineWidth: edge * 0.008)
                .mediaCircle(edge, 0.5, 0.5, r: 0.125)
            Circle().fill(RadialGradient(colors: [hex(0x5E83A4, 0.9), hex(0x1C2C3C, 0.9)], center: .center, startRadius: 0, endRadius: edge * 0.07))
                .mediaCircle(edge, 0.51, 0.51, r: 0.07)
            // Aperture-blade reflections: three pale segments round the upper left.
            ForEach(0..<3, id: \.self) { index in
                let from = 0.53 + Double(index) * 0.065
                Circle().trim(from: from, to: from + 0.045)
                    .stroke(hex(index == 1 ? 0xDDE8F2 : 0xB7CCDD, 0.9), style: StrokeStyle(lineWidth: edge * 0.035))
                    .mediaCircle(edge, 0.5, 0.5, r: 0.13)
            }
            Circle().fill(.white.opacity(0.9)).mediaCircle(edge, 0.565, 0.56, r: 0.018)
            Circle().fill(.white.opacity(0.45)).mediaCircle(edge, 0.535, 0.60, r: 0.01)
        }
    }

    /// iOS 26: a grey glass bezel, a thin black rim, deep navy glass; a white-hot
    /// highlight upper-left in a blue haze with a warm flare beside it, and a
    /// blue-white flare arcing round the lower right.
    private var glass26: some View {
        ZStack {
            Circle().fill(LinearGradient(colors: [hex(0x9C9C9C, 0.92), hex(0x676767, 0.95)], startPoint: .top, endPoint: .bottom))
                .overlay(Circle().strokeBorder(hex(0xC4C4C4, 0.85), lineWidth: edge * 0.006))
                .shadow(color: .black.opacity(0.28), radius: edge * 0.02, x: edge * 0.008, y: edge * 0.015)
                .mediaCircle(edge, 0.5, 0.5, r: 0.405)
            Circle().fill(hex(0x16181F))
                .mediaCircle(edge, 0.5, 0.5, r: 0.362)
            Circle().fill(RadialGradient(colors: [hex(0x161824), hex(0x1D2132), hex(0x2B3553)],
                                         center: .center, startRadius: edge * 0.06, endRadius: edge * 0.345))
                .mediaCircle(edge, 0.5, 0.5, r: 0.345)
            Circle().strokeBorder(hex(0x3F3B55, 0.9), lineWidth: edge * 0.007).mediaCircle(edge, 0.5, 0.5, r: 0.30)
            Circle().strokeBorder(hex(0x3F3B55, 0.6), lineWidth: edge * 0.005).mediaCircle(edge, 0.5, 0.5, r: 0.245)
            // The flare round the lower right: a blue halo, a bright blue band, a white core.
            MediaGlow(colour: hex(0x9A6263), alpha: 0.9).rotationEffect(.degrees(-35)).mediaAt(edge, 0.66, 0.52, w: 0.13, h: 0.08)
            MediaCrescent(dx: -0.05, dy: -0.045, inner: 0.72)
                .fill(AngularGradient(stops: [.init(color: hex(0x0A66C0, 0), location: 0),
                                              .init(color: hex(0x1F7FE0, 0.8), location: 0.10),
                                              .init(color: hex(0x7CC0FF), location: 0.22),
                                              .init(color: hex(0x2E86EA, 0.85), location: 0.34),
                                              .init(color: hex(0x0A66C0, 0), location: 0.45),
                                              .init(color: hex(0x0A66C0, 0), location: 1)],
                                      center: .center, startAngle: .degrees(-40), endAngle: .degrees(320)), style: FillStyle(eoFill: true))
                .mediaCircle(edge, 0.5, 0.5, r: 0.24)
            MediaCrescent(dx: -0.07, dy: -0.06, inner: 0.80)
                .fill(AngularGradient(stops: [.init(color: .white.opacity(0), location: 0.05),
                                              .init(color: hex(0xE8F4FF), location: 0.20),
                                              .init(color: .white.opacity(0), location: 0.36)],
                                      center: .center, startAngle: .degrees(-40), endAngle: .degrees(320)), style: FillStyle(eoFill: true))
                .mediaCircle(edge, 0.5, 0.5, r: 0.21)
            // The highlight upper-left. The hot core stays small: on the real
            // icon it is a specular point in a wide haze, not a white blob.
            MediaGlow(colour: hex(0x6F9BF2), alpha: 0.95, core: 0.2).rotationEffect(.degrees(-40)).mediaAt(edge, 0.45, 0.36, w: 0.44, h: 0.26)
            MediaGlow(colour: hex(0xA06A62), alpha: 0.85).rotationEffect(.degrees(-15)).mediaAt(edge, 0.335, 0.465, w: 0.18, h: 0.08)
            MediaGlow(colour: hex(0xEEF5FF), alpha: 1, core: 0.30).mediaCircle(edge, 0.425, 0.40, r: 0.105)
            Circle().fill(.white).mediaCircle(edge, 0.425, 0.40, r: 0.023)
        }
    }

    /// iOS 27: a darker, crisper bezel; the reflections sit on the vertical axis,
    /// a highlight at the top and a soft blue crescent at the bottom.
    private var glass27: some View {
        ZStack {
            Circle().fill(LinearGradient(colors: [hex(0x7C7C7C), hex(0x575757)], startPoint: .top, endPoint: .bottom))
                .overlay(Circle().strokeBorder(hex(0xA2A2A2, 0.7), lineWidth: edge * 0.006))
                .shadow(color: .black.opacity(0.25), radius: edge * 0.015, y: edge * 0.012)
                .mediaCircle(edge, 0.5, 0.5, r: 0.415)
            Circle().fill(RadialGradient(colors: [hex(0x10101A), hex(0x1A1A28), hex(0x24233B)],
                                         center: .center, startRadius: edge * 0.05, endRadius: edge * 0.365))
                .mediaCircle(edge, 0.5, 0.5, r: 0.365)
            Circle().strokeBorder(hex(0x34344C), lineWidth: edge * 0.007).mediaCircle(edge, 0.5, 0.5, r: 0.30)
            // Bottom crescent.
            MediaCrescent(dx: 0, dy: -0.07, inner: 0.74)
                .fill(AngularGradient(stops: [.init(color: hex(0x6A78B2, 0), location: 0.08),
                                              .init(color: hex(0x7F8DC4, 0.85), location: 0.16),
                                              .init(color: hex(0xC4D7FA), location: 0.25),
                                              .init(color: hex(0x7F8DC4, 0.85), location: 0.34),
                                              .init(color: hex(0x6A78B2, 0), location: 0.42)],
                                      center: .center), style: FillStyle(eoFill: true))
                .mediaCircle(edge, 0.5, 0.5, r: 0.235)
            MediaCrescent(dx: 0, dy: -0.09, inner: 0.80)
                .fill(AngularGradient(stops: [.init(color: .white.opacity(0), location: 0.15),
                                              .init(color: hex(0xEEF7FF), location: 0.25),
                                              .init(color: .white.opacity(0), location: 0.35)],
                                      center: .center), style: FillStyle(eoFill: true))
                .mediaCircle(edge, 0.5, 0.5, r: 0.205)
            // Top highlight: a blue haze, warm fringes either side, a white core.
            MediaGlow(colour: hex(0x9DB4F5), alpha: 0.95, core: 0.2).mediaAt(edge, 0.5, 0.34, w: 0.46, h: 0.29)
            MediaGlow(colour: hex(0x946A6C), alpha: 0.8).mediaAt(edge, 0.375, 0.36, w: 0.15, h: 0.08)
            MediaGlow(colour: hex(0x946A6C), alpha: 0.8).mediaAt(edge, 0.625, 0.36, w: 0.15, h: 0.08)
            MediaGlow(colour: hex(0xF4FBFF), alpha: 1, core: 0.30).mediaAt(edge, 0.5, 0.33, w: 0.20, h: 0.16)
            Ellipse().fill(.white).mediaAt(edge, 0.5, 0.33, w: 0.055, h: 0.044)
        }
    }
}

/// A crescent: the disc minus a smaller disc shifted by (dx, dy) (fractions of
/// the frame) with `inner` times the radius, so it is thickest opposite the
/// shift. Fill it with an even-odd style.
private struct MediaCrescent: Shape {
    var dx: Double
    var dy: Double
    var inner: Double

    func path(in rect: CGRect) -> Path {
        var path = Path(ellipseIn: rect)
        let r = rect.width / 2 * inner
        let c = CGPoint(x: rect.midX + rect.width * dx, y: rect.midY + rect.height * dy)
        path.addEllipse(in: CGRect(x: c.x - r, y: c.y - r, width: r * 2, height: r * 2))
        return path
    }
}

/// A soft blob: solid colour at the centre fading to nothing at the edge of
/// its frame. `core` is how much of the radius stays solid.
private struct MediaGlow: View {
    let colour: Color
    var alpha: Double = 1
    var core: Double = 0

    var body: some View {
        Ellipse().fill(EllipticalGradient(stops: [.init(color: colour.opacity(alpha), location: 0),
                                                  .init(color: colour.opacity(alpha), location: core * 0.5),
                                                  .init(color: colour.opacity(0), location: 0.5)],
                                          center: .center, startRadiusFraction: 0, endRadiusFraction: 1))
    }
}

private enum MediaCameraGeneration { case ios7, ios11, ios15, ios18 }

/// The camera body: a rounded body with a pentaprism hump and a ring cut out
/// for the lens, so the tile shows through.
private struct MediaCameraShape: Shape {
    var x0: Double, x1: Double, y0: Double, y1: Double
    var corner: Double
    var humpTop: Double, humpTopX0: Double, humpTopX1: Double, humpBaseX0: Double, humpBaseX1: Double
    var curvedHump: Bool
    var ringCentre: (Double, Double), ringOuter: Double, ringInner: Double

    func path(in rect: CGRect) -> Path {
        let side = min(rect.width, rect.height)
        func p(_ x: Double, _ y: Double) -> CGPoint { mediaPoint(x, y, in: rect) }
        let r = side * corner
        var path = Path()
        path.move(to: p(x0, y1).applying(.init(translationX: r, y: 0)))
        path.addLine(to: p(x1, y1).applying(.init(translationX: -r, y: 0)))
        path.addArc(tangent1End: p(x1, y1), tangent2End: p(x1, y0), radius: r)
        path.addArc(tangent1End: p(x1, y0), tangent2End: p(humpBaseX1, y0), radius: r)
        path.addLine(to: p(humpBaseX1, y0))
        if curvedHump {
            let w = humpBaseX1 - humpTopX1
            path.addCurve(to: p(humpTopX1, humpTop),
                          control1: p(humpBaseX1 - w * 0.6, y0),
                          control2: p(humpTopX1 + w * 0.4, humpTop))
            path.addLine(to: p(humpTopX0, humpTop))
            path.addCurve(to: p(humpBaseX0, y0),
                          control1: p(humpTopX0 - w * 0.4, humpTop),
                          control2: p(humpBaseX0 + w * 0.6, y0))
        } else {
            let hr = side * 0.02
            path.addArc(tangent1End: p(humpTopX1, humpTop), tangent2End: p(humpTopX0, humpTop), radius: hr)
            path.addArc(tangent1End: p(humpTopX0, humpTop), tangent2End: p(humpBaseX0, y0), radius: hr)
            path.addLine(to: p(humpBaseX0, y0))
        }
        path.addArc(tangent1End: p(x0, y0), tangent2End: p(x0, y1), radius: r)
        path.addArc(tangent1End: p(x0, y1), tangent2End: p(x1, y1), radius: r)
        path.closeSubpath()
        // Even-odd: the outer circle punches a hole, the inner circle fills it back in.
        let c = p(ringCentre.0, ringCentre.1)
        path.addEllipse(in: CGRect(x: c.x - side * ringOuter, y: c.y - side * ringOuter, width: side * ringOuter * 2, height: side * ringOuter * 2))
        path.addEllipse(in: CGRect(x: c.x - side * ringInner, y: c.y - side * ringInner, width: side * ringInner * 2, height: side * ringInner * 2))
        return path
    }
}

/// iOS 7 - iOS 18: the camera glyph in its four generations.
private struct MediaCameraArt: View {
    let edge: CGFloat
    let generation: MediaCameraGeneration

    var body: some View {
        ZStack {
            switch generation {
            case .ios7:
                MediaCameraShape(x0: 0.150, x1: 0.850, y0: 0.275, y1: 0.758, corner: 0.03,
                                 humpTop: 0.192, humpTopX0: 0.383, humpTopX1: 0.617, humpBaseX0: 0.333, humpBaseX1: 0.667,
                                 curvedHump: false, ringCentre: (0.5, 0.517), ringOuter: 0.150, ringInner: 0.125)
                    .fill(LinearGradient(colors: [hex(0x4A4A4A), hex(0x323232), hex(0x2B2B2B)], startPoint: .top, endPoint: .bottom),
                          style: FillStyle(eoFill: true))
                // The two light lines that made the body look concave.
                Rectangle().fill(hex(0xB5B7BB)).mediaAt(edge, 0.5, 0.329, w: 0.70, h: 0.009)
                Rectangle().fill(hex(0xA3A6AA)).mediaAt(edge, 0.5, 0.704, w: 0.70, h: 0.009)
                RoundedRectangle(cornerRadius: edge * 0.006).fill(hex(0x3A3A3A))
                    .mediaAt(edge, 0.246, 0.261, w: 0.058, h: 0.022)
                Circle().fill(hex(0xE3BB46)).mediaCircle(edge, 0.658, 0.388, r: 0.016)
            case .ios11:
                MediaCameraShape(x0: 0.133, x1: 0.867, y0: 0.300, y1: 0.756, corner: 0.045,
                                 humpTop: 0.217, humpTopX0: 0.378, humpTopX1: 0.622, humpBaseX0: 0.328, humpBaseX1: 0.667,
                                 curvedHump: true, ringCentre: (0.5, 0.5225), ringOuter: 0.156, ringInner: 0.133)
                    .fill(hex(0x2F2F2F), style: FillStyle(eoFill: true))
                RoundedRectangle(cornerRadius: edge * 0.008).fill(hex(0x2F2F2F))
                    .mediaAt(edge, 0.253, 0.2665, w: 0.072, h: 0.033)
                Circle().fill(hex(0xFFCC00)).mediaCircle(edge, 0.683, 0.378, r: 0.022)
            case .ios15:
                MediaCameraShape(x0: 0.1335, x1: 0.8667, y0: 0.278, y1: 0.772, corner: 0.09,
                                 humpTop: 0.2055, humpTopX0: 0.439, humpTopX1: 0.562, humpBaseX0: 0.335, humpBaseX1: 0.665,
                                 curvedHump: true, ringCentre: (0.5, 0.522), ringOuter: 0.1667, ringInner: 0.1322)
                    .fill(hex(0x2D2D2E), style: FillStyle(eoFill: true))
                Circle().fill(hex(0xFECC00)).mediaCircle(edge, 0.716, 0.389, r: 0.0277)
            case .ios18:
                MediaCameraShape(x0: 0.136, x1: 0.865, y0: 0.280, y1: 0.773, corner: 0.09,
                                 humpTop: 0.207, humpTopX0: 0.440, humpTopX1: 0.563, humpBaseX0: 0.335, humpBaseX1: 0.665,
                                 curvedHump: true, ringCentre: (0.5, 0.522), ringOuter: 0.1646, ringInner: 0.1276)
                    .fill(hex(0x2D2D2E), style: FillStyle(eoFill: true))
                Circle().fill(hex(0xFFCC00)).mediaCircle(edge, 0.735, 0.389, r: 0.0326)
            }
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Maps

/// The "280" shield, coloured per generation.
private struct MediaShieldArt: View {
    let edge: CGFloat
    var crown: Color
    var body_: Color
    var bodyBottom: Color? = nil
    var border: Color = .white
    var borderWidth: Double = 0.012
    /// The red crown's share of the shield's height.
    var crownHeight: Double = 0.30
    var glossy = false

    var body: some View {
        GeometryReader { geo in
            let h = geo.size.height
            ZStack(alignment: .top) {
                MediaShieldShape().fill(border)
                ZStack(alignment: .top) {
                    LinearGradient(colors: [body_, bodyBottom ?? body_], startPoint: .top, endPoint: .bottom)
                    VStack(spacing: 0) {
                        crown.frame(height: h * crownHeight)
                        border.frame(height: h * 0.035)
                    }
                    if glossy {
                        LinearGradient(colors: [.white.opacity(0.45), .white.opacity(0)], startPoint: .top, endPoint: .bottom)
                            .frame(height: h * 0.55)
                    }
                }
                .clipShape(MediaShieldShape())
                .padding(edge * borderWidth)
                Text("280")
                    .font(.system(size: h * 0.40, weight: .bold))
                    .foregroundStyle(.white)
                    .kerning(-h * 0.01)
                    .offset(y: h * (crownHeight + 0.06))
            }
        }
    }
}

/// The pushpin of the Google era.
private struct MediaPushpinArt: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            Ellipse().fill(.black.opacity(0.35))
                .mediaAt(edge, 0.36, 0.71, w: 0.20, h: 0.05)
                .blur(radius: edge * 0.008)
            Capsule().fill(LinearGradient(colors: [hex(0xF5F3EF), hex(0x868378)], startPoint: .leading, endPoint: .trailing))
                .mediaAt(edge, 0.245, 0.735, w: 0.024, h: 0.17)
            Ellipse().fill(hex(0x2A2A2A)).mediaAt(edge, 0.245, 0.822, w: 0.04, h: 0.018)
            Circle().fill(RadialGradient(colors: [hex(0xFFD6DB), hex(0xE8464C), hex(0xCC2B32), hex(0xA41D22)],
                                         center: UnitPoint(x: 0.35, y: 0.3), startRadius: 0, endRadius: edge * 0.085))
                .shadow(color: .black.opacity(0.35), radius: edge * 0.01, y: edge * 0.01)
                .mediaCircle(edge, 0.245, 0.575, r: 0.078)
        }
    }
}

/// iPhone OS 1 - iOS 5: beige Cupertino, the Infinite Loop, an orange 280, a pushpin.
private struct MediaMapGoogleArt: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            // Grey-cased white streets.
            streets.stroke(hex(0xB3AE9E), style: StrokeStyle(lineWidth: edge * 0.05, lineCap: .round, lineJoin: .round))
            streets.stroke(.white, style: StrokeStyle(lineWidth: edge * 0.03, lineCap: .round, lineJoin: .round))
            // The orange interstate, with white casing. Colours sit a step deeper
            // than the sampled ones because the system gloss lightens this half.
            Rectangle().fill(.white).mediaAt(edge, 0.5, 0.3175, w: 1, h: 0.20)
            Rectangle().fill(LinearGradient(colors: [hex(0xF2A00E), hex(0xFDB928)], startPoint: .top, endPoint: .bottom))
                .mediaAt(edge, 0.5, 0.3175, w: 1, h: 0.165)
            // De Anza: the yellow road running top to bottom.
            Rectangle().fill(.white).mediaAt(edge, 0.245, 0.5, w: 0.135, h: 1)
            Rectangle().fill(LinearGradient(colors: [hex(0xF2E83C), hex(0xDEDA49)], startPoint: .top, endPoint: .bottom))
                .mediaAt(edge, 0.245, 0.5, w: 0.11, h: 1)
            // Only the system gloss lights the shield; crown and body sit a step
            // deeper and more saturated so they read red and royal blue under it.
            MediaShieldArt(edge: edge, crown: hex(0xE8101C), body_: hex(0x0B3CE8), bodyBottom: hex(0x0A2A9E), crownHeight: 0.30, glossy: false)
                .shadow(color: .black.opacity(0.3), radius: edge * 0.01, y: edge * 0.01)
                .mediaAt(edge, 0.655, 0.27, w: 0.47, h: 0.36)
            MediaPushpinArt(edge: edge)
        }
        .frame(width: edge, height: edge)
    }

    private var streets: MediaPath {
        MediaPath { rect in
            var path = Path()
            path.addRoundedRect(in: CGRect(x: rect.minX + rect.width * 0.37, y: rect.minY + rect.height * 0.43,
                                           width: rect.width * 0.27, height: rect.height * 0.43),
                                cornerSize: CGSize(width: rect.width * 0.13, height: rect.width * 0.13))
            path.move(to: mediaPoint(0.80, 0.42, in: rect)); path.addLine(to: mediaPoint(0.80, 1.02, in: rect))
            path.move(to: mediaPoint(0.64, 0.86, in: rect)); path.addLine(to: mediaPoint(1.02, 0.86, in: rect))
            path.move(to: mediaPoint(0.80, 0.55, in: rect)); path.addLine(to: mediaPoint(1.02, 0.55, in: rect))
            path.move(to: mediaPoint(-0.02, 0.60, in: rect))
            path.addCurve(to: mediaPoint(0.37, 0.66, in: rect), control1: mediaPoint(0.10, 0.70, in: rect), control2: mediaPoint(0.22, 0.58, in: rect))
            path.move(to: mediaPoint(0.10, -0.02, in: rect)); path.addLine(to: mediaPoint(0.10, 0.22, in: rect))
            path.move(to: mediaPoint(0.50, -0.02, in: rect)); path.addLine(to: mediaPoint(0.50, 0.22, in: rect))
            path.move(to: mediaPoint(0.50, 0.86, in: rect)); path.addLine(to: mediaPoint(0.50, 1.02, in: rect))
            return path
        }
    }
}

/// iOS 6: Apple's map, a yellow 280 and the blue route that turned left off it.
private struct MediaMapIOS6Art: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            streets.stroke(hex(0xC9C2AC), style: StrokeStyle(lineWidth: edge * 0.045, lineCap: .round, lineJoin: .round))
            streets.stroke(hex(0xFFFEF8), style: StrokeStyle(lineWidth: edge * 0.028, lineCap: .round, lineJoin: .round))
            // The highway: gold edges round a yellow core.
            Rectangle().fill(hex(0xEEB400)).mediaAt(edge, 0.5, 0.2875, w: 1, h: 0.175)
            Rectangle().fill(hex(0xFAD800)).mediaAt(edge, 0.5, 0.2875, w: 1, h: 0.105)
            // The white north-south road.
            Rectangle().fill(hex(0xE8E2CC)).mediaAt(edge, 0.24, 0.5, w: 0.12, h: 1)
            Rectangle().fill(hex(0xFFFFFD)).mediaAt(edge, 0.24, 0.5, w: 0.10, h: 1)
            // The route: in from the left along the overpass, then down to the puck.
            route.stroke(hex(0x379ACD), style: StrokeStyle(lineWidth: edge * 0.078, lineCap: .round, lineJoin: .round))
            route.stroke(LinearGradient(colors: [hex(0x22B2F6), hex(0x1FBAFF)], startPoint: .top, endPoint: .bottom),
                         style: StrokeStyle(lineWidth: edge * 0.062, lineCap: .round, lineJoin: .round))
            MediaShieldArt(edge: edge, crown: hex(0xC8101E), body_: hex(0x1256EC), bodyBottom: hex(0x0A30B8),
                           border: hex(0xF4F4F4), borderWidth: 0.02, crownHeight: 0.22, glossy: false)
                .shadow(color: .black.opacity(0.3), radius: edge * 0.012, y: edge * 0.012)
                .mediaAt(edge, 0.66, 0.265, w: 0.49, h: 0.38)
            // The puck.
            Circle().fill(LinearGradient(colors: [.white, hex(0xCCD8DF)], startPoint: .top, endPoint: .bottom))
                .shadow(color: .black.opacity(0.35), radius: edge * 0.015, y: edge * 0.012)
                .mediaCircle(edge, 0.255, 0.75, r: 0.105)
            Circle().fill(RadialGradient(colors: [hex(0x49A6F9), hex(0x2F80E8)], center: .center, startRadius: 0, endRadius: edge * 0.085))
                .mediaCircle(edge, 0.255, 0.75, r: 0.085)
            MediaArrowShape().fill(.white).mediaAt(edge, 0.255, 0.7425, w: 0.10, h: 0.115)
            Circle().trim(from: 0.5, to: 1.0).fill(.white.opacity(0.35)).mediaCircle(edge, 0.255, 0.75, r: 0.08)
        }
        .frame(width: edge, height: edge)
    }

    private var route: MediaPath {
        MediaPath { rect in
            var path = Path()
            path.move(to: mediaPoint(-0.02, 0.2875, in: rect))
            path.addLine(to: mediaPoint(0.19, 0.2875, in: rect))
            path.addQuadCurve(to: mediaPoint(0.2575, 0.36, in: rect), control: mediaPoint(0.2575, 0.2875, in: rect))
            path.addLine(to: mediaPoint(0.2575, 0.66, in: rect))
            return path
        }
    }

    private var streets: MediaPath {
        MediaPath { rect in
            var path = Path()
            path.addRoundedRect(in: CGRect(x: rect.minX + rect.width * 0.43, y: rect.minY + rect.height * 0.50,
                                           width: rect.width * 0.25, height: rect.height * 0.42),
                                cornerSize: CGSize(width: rect.width * 0.12, height: rect.width * 0.12))
            path.move(to: mediaPoint(0.82, 0.40, in: rect)); path.addLine(to: mediaPoint(0.82, 1.02, in: rect))
            path.move(to: mediaPoint(0.68, 0.88, in: rect)); path.addLine(to: mediaPoint(1.02, 0.88, in: rect))
            path.move(to: mediaPoint(0.82, 0.58, in: rect)); path.addLine(to: mediaPoint(1.02, 0.58, in: rect))
            path.move(to: mediaPoint(0.29, 0.62, in: rect)); path.addLine(to: mediaPoint(0.43, 0.62, in: rect))
            path.move(to: mediaPoint(0.12, -0.02, in: rect)); path.addLine(to: mediaPoint(0.12, 0.20, in: rect))
            path.move(to: mediaPoint(0.55, -0.02, in: rect)); path.addLine(to: mediaPoint(0.55, 0.20, in: rect))
            path.move(to: mediaPoint(0.55, 0.92, in: rect)); path.addLine(to: mediaPoint(0.55, 1.02, in: rect))
            return path
        }
    }
}

/// iOS 7 - iOS 10: flat blocks of park and paper, a corrected route, the shield bottom-left.
private struct MediaMapIOS7Art: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            Rectangle().fill(hex(0x76C63C)).mediaAt(edge, 0.345, 0.0775, w: 0.69, h: 0.155)
            Rectangle().fill(hex(0xFBC7D1)).mediaAt(edge, 0.9225, 0.0675, w: 0.155, h: 0.135)
            Rectangle().fill(.white).mediaAt(edge, 0.4225, 0.25, w: 0.845, h: 0.19)
            Rectangle().fill(.white).mediaAt(edge, 0.7725, 0.5, w: 0.145, h: 1)
            Rectangle().fill(.white).mediaAt(edge, 0.9225, 0.625, w: 0.155, h: 0.07)
            // The yellow highway sweeping from the left edge out through the bottom.
            highway.stroke(hex(0xECBF3D), style: StrokeStyle(lineWidth: edge * 0.115, lineCap: .butt))
            highway.stroke(hex(0xFFDF01), style: StrokeStyle(lineWidth: edge * 0.09, lineCap: .butt))
            Rectangle().fill(hex(0xFFDF01)).rotationEffect(.degrees(-40)).mediaAt(edge, 0.93, 0.97, w: 0.12, h: 0.09)
            // The route.
            route.stroke(hex(0x419CFF), style: StrokeStyle(lineWidth: edge * 0.075, lineCap: .butt, lineJoin: .round))
            MediaShieldArt(edge: edge, crown: hex(0xDB1D22), body_: hex(0x007AFF), borderWidth: 0.014, crownHeight: 0.17)
                .mediaAt(edge, 0.345, 0.545, w: 0.40, h: 0.32)
            Circle().fill(.white).mediaCircle(edge, 0.765, 0.685, r: 0.10)
            Circle().fill(hex(0x007AFF)).mediaCircle(edge, 0.765, 0.685, r: 0.092)
            MediaArrowShape().fill(.white).mediaAt(edge, 0.765, 0.68, w: 0.068, h: 0.11)
        }
        .frame(width: edge, height: edge)
    }

    private var route: MediaPath {
        MediaPath { rect in
            var path = Path()
            path.move(to: mediaPoint(-0.02, 0.2325, in: rect))
            path.addLine(to: mediaPoint(0.7675, 0.2325, in: rect))
            path.addLine(to: mediaPoint(0.7675, 0.60, in: rect))
            return path
        }
    }

    private var highway: MediaPath {
        MediaPath { rect in
            var path = Path()
            path.move(to: mediaPoint(-0.05, 0.56, in: rect))
            path.addCurve(to: mediaPoint(0.60, 1.05, in: rect),
                          control1: mediaPoint(0.30, 0.56, in: rect), control2: mediaPoint(0.45, 0.74, in: rect))
            return path
        }
    }
}

/// iOS 11 - iOS 14: Apple Park at the top-right, I-280 crossing diagonally.
private struct MediaMapParkArt: View {
    let edge: CGFloat

    var body: some View {
        // The highway's upper edge: y = 0.136 + 0.70 (x - 0.019); it is 0.295 tall.
        func upper(_ x: Double) -> Double { 0.136 + 0.70 * (x - 0.019) }
        return ZStack {
            MediaPolygon(points: [(0.25, -0.02), (1.02, -0.02), (1.02, upper(1.02)), (0.25, upper(0.25))])
                .fill(hex(0x9DE07B))
            MediaPolygon(points: [(-0.02, upper(-0.02) + 0.295), (0.25, upper(0.25) + 0.295), (0.25, 1.02), (-0.02, 1.02)])
                .fill(hex(0xFFB2C2))
            // Apple Park: a cream ring round the top-right corner.
            Circle().strokeBorder(hex(0x8AC66C), lineWidth: edge * 0.241).mediaCircle(edge, 1.0, 0.0, r: 0.556)
            Circle().strokeBorder(hex(0xF3F0E9), lineWidth: edge * 0.209).mediaCircle(edge, 1.0, 0.0, r: 0.540)
            // I-280.
            Rectangle().fill(hex(0xFCAB1A))
                .frame(width: edge * 2, height: edge * 0.242)
                .rotationEffect(.degrees(35))
                .offset(x: edge * 0.0065, y: edge * 0.12)
            Rectangle().fill(hex(0xFFD634))
                .frame(width: edge * 2, height: edge * 0.209)
                .rotationEffect(.degrees(35))
                .offset(x: edge * 0.0065, y: edge * 0.12)
            // Wolfe Road and the route on it.
            Rectangle().fill(hex(0xCBC8C1)).mediaAt(edge, 0.25, 0.5, w: 0.242, h: 1)
            Rectangle().fill(.white).mediaAt(edge, 0.25, 0.5, w: 0.209, h: 1)
            Rectangle().fill(hex(0x3394E3)).mediaAt(edge, 0.25, 0.27, w: 0.125, h: 0.56)
            Circle().fill(hex(0x0078D9))
                .shadow(color: .black.opacity(0.12), radius: edge * 0.008, y: edge * 0.015)
                .mediaCircle(edge, 0.25, 0.594, r: 0.177)
            MediaArrowShape().fill(.white).mediaAt(edge, 0.25, 0.583, w: 0.158, h: 0.216)
            MediaShieldArt(edge: edge, crown: hex(0xDF1D25), body_: hex(0x0078D9), borderWidth: 0.015, crownHeight: 0.18)
                .mediaAt(edge, 0.75, 0.787, w: 0.388, h: 0.314)
        }
        .frame(width: edge, height: edge)
    }
}

private enum MediaMapLook { case ios15, ios26, ios27 }

/// iOS 15 onward: Apple Park and I-280 as coloured blocks round a big marker.
private struct MediaMapModernArt: View {
    let edge: CGFloat
    let look: MediaMapLook

    var body: some View {
        // The diagonal road: upper edge y = 0.105 + 0.66 x, lower edge y = 0.39 + 0.655 x.
        func upper(_ x: Double) -> Double { 0.105 + 0.66 * x }
        func lower(_ x: Double) -> Double { 0.39 + 0.655 * x }
        let green: Color = look == .ios15 ? hex(0x7FEE7E) : hex(0x40DC5A)
        let greenLow: Color = look == .ios15 ? hex(0x43D761) : hex(0x46DB5F)
        let pink: Color = look == .ios15 ? hex(0xED99D2) : (look == .ios26 ? hex(0xFE88CE) : hex(0xE774AF))
        let yellow: Color = look == .ios15 ? hex(0xFBC701) : (look == .ios26 ? hex(0xFDCE14) : hex(0xF2BB09))
        let routeTop: Color = look == .ios15 ? hex(0x358FF9) : (look == .ios26 ? hex(0x1294FE) : hex(0x0084FF))
        let routeLow: Color = look == .ios15 ? hex(0x0771EB) : (look == .ios26 ? hex(0x0983FE) : hex(0x0485FF))
        let markerR = look == .ios15 ? 0.2555 : (look == .ios26 ? 0.284 : 0.29)
        let discR = look == .ios15 ? 0.211 : (look == .ios26 ? 0.226 : 0.215)
        let centre = look == .ios15 ? (0.378, 0.622) : (0.375, 0.61)
        let rim = look == .ios15 ? 0.0 : 0.006
        // The arrow, measured off each icon: iOS 26 draws it bigger in its disc.
        let arrowW = look == .ios15 ? 0.224 : 0.239
        let arrowH = look == .ios15 ? 0.271 : 0.290
        let arrowRise = look == .ios15 ? 0.016 : 0.0175
        return ZStack {
            // Blocks.
            MediaPolygon(points: [(-0.02, -0.02), (0.233, -0.02), (0.233, upper(0.233)), (-0.02, upper(-0.02))]).fill(green)
            MediaPolygon(points: [(0.522, -0.02), (1.02, -0.02), (1.02, upper(1.02)), (0.522, upper(0.522))])
                .fill(LinearGradient(colors: [green, greenLow], startPoint: .topLeading, endPoint: .bottomTrailing))
            MediaPolygon(points: [(-0.02, lower(-0.02)), (0.233, lower(0.233)), (0.233, 1.02), (-0.02, 1.02)]).fill(pink)
            MediaPolygon(points: [(0.528, 0.735), (0.528, 1.02), (0.94, 1.02)]).fill(yellow)
            // Apple Park round the top-right corner.
            switch look {
            case .ios15:
                Circle().strokeBorder(hex(0xF2F1F6), lineWidth: edge * 0.175).mediaCircle(edge, 1.0, 0.0, r: 0.386)
                Circle().strokeBorder(hex(0xD2D1D6), lineWidth: edge * 0.131).mediaCircle(edge, 1.0, 0.0, r: 0.364)
            case .ios26:
                Circle().strokeBorder(hex(0xBFF4C8), lineWidth: edge * 0.06).mediaCircle(edge, 1.0, 0.0, r: 0.33)
                Circle().strokeBorder(hex(0xBFF4C8, 0.55), lineWidth: edge * 0.04).mediaCircle(edge, 1.0, 0.0, r: 0.40)
            case .ios27:
                Circle().strokeBorder(hex(0x9AE398), lineWidth: edge * 0.15).mediaCircle(edge, 1.0, 0.0, r: 0.40)
                Circle().strokeBorder(.white, lineWidth: edge * 0.009).mediaCircle(edge, 1.0, 0.0, r: 0.25)
                Circle().strokeBorder(.white, lineWidth: edge * 0.009).mediaCircle(edge, 1.0, 0.0, r: 0.31)
                Circle().strokeBorder(.white, lineWidth: edge * 0.009).mediaCircle(edge, 1.0, 0.0, r: 0.38)
            }
            // The route down the vertical road.
            Rectangle().fill(LinearGradient(colors: [routeTop, routeLow], startPoint: .top, endPoint: .bottom))
                .mediaAt(edge, 0.3775, 0.20, w: 0.211, h: 0.44)
            // The marker.
            if look == .ios27 {
                Circle().fill(.white.opacity(0.28))
                    .overlay(Circle().strokeBorder(.white.opacity(0.9), lineWidth: edge * 0.012))
                    .shadow(color: .black.opacity(0.18), radius: edge * 0.02, y: edge * 0.015)
                    .mediaCircle(edge, centre.0, centre.1, r: markerR)
            } else {
                Circle().fill(.white)
                    .shadow(color: .black.opacity(look == .ios15 ? 0.15 : 0.22), radius: edge * 0.03, y: edge * 0.02)
                    .mediaCircle(edge, centre.0, centre.1, r: markerR)
            }
            Circle().fill(LinearGradient(colors: look == .ios27 ? [hex(0x43A0FE), hex(0x0786FE)] :
                                         (look == .ios15 ? [hex(0x3F8FEC), hex(0x0178FF)] : [hex(0x1193FE), hex(0x47A0FA)]),
                                         startPoint: .top, endPoint: .bottom))
                .overlay(Circle().strokeBorder(.white.opacity(0.5), lineWidth: edge * rim))
                .shadow(color: .black.opacity(look == .ios27 ? 0.3 : 0), radius: edge * 0.015, y: edge * 0.015)
                .mediaCircle(edge, centre.0, centre.1, r: discR)
            MediaArrowShape().fill(look == .ios26 ? hex(0xE9F5FE) : .white)
                .mediaAt(edge, centre.0, centre.1 - arrowRise, w: arrowW, h: arrowH)
        }
        .frame(width: edge, height: edge)
    }
}

// MARK: - Weather

private enum MediaWeatherLook { case classic2007, retina2010, flat2013, flat2017, ios15, ios26, ios27 }

/// A sun, a cloud, and for the first six years a temperature.
private struct MediaWeatherArt: View {
    let edge: CGFloat
    let look: MediaWeatherLook

    var body: some View {
        ZStack {
            switch look {
            case .classic2007:
                lowerSky([hex(0x0472F0), hex(0x0279F2), hex(0x027FF3), hex(0x0C96F6), hex(0x1EAFF9), hex(0x35C6FA), hex(0x40D2FB)])
                sun(cx: 0.508, cy: 0.44, r: 0.225, colours: [hex(0xFFB066), hex(0xFF961E), hex(0xFFB41C), hex(0xFFDA10), hex(0xFFF604)], glow: 0.285)
                temperature(y: 0.855, size: 0.235)
            case .retina2010:
                lowerSky([hex(0x2F7EE4), hex(0x3584E6), hex(0x3C8BE7), hex(0x4E9FEC), hex(0x64B6F2), hex(0x7DD1F8), hex(0x89DDFB)])
                MediaRadialBars(count: 40, inner: 0.19, outer: 0.31, width: 0.006)
                    .fill(hex(0xFFF3B0, 0.55))
                    .mediaCircle(edge, 0.50, 0.43, r: 0.5)
                sun(cx: 0.50, cy: 0.43, r: 0.195, colours: [hex(0xFFE2C0), hex(0xFFA43E), hex(0xFFB82C), hex(0xFFD81D), hex(0xFFFA0B)], glow: 0.26)
                temperature(y: 0.86, size: 0.235)
            case .flat2013:
                Circle().fill(hex(0xFFD900)).mediaCircle(edge, 0.312, 0.392, r: 0.170)
                MediaCloudShape().fill(.white.opacity(0.85)).mediaAt(edge, 0.5335, 0.525, w: 0.617, h: 0.416)
            case .flat2017:
                Circle().fill(hex(0xFFD500)).mediaCircle(edge, 0.308, 0.389, r: 0.164)
                MediaCloudShape().fill(.white.opacity(0.85)).mediaAt(edge, 0.547, 0.525, w: 0.628, h: 0.423)
            case .ios15:
                Circle().fill(LinearGradient(colors: [hex(0xF6C743), hex(0xFAE54C)], startPoint: .top, endPoint: .bottom))
                    .mediaCircle(edge, 0.674, 0.417, r: 0.1795)
                MediaCloudShape()
                    .fill(LinearGradient(colors: [hex(0xF9F9FE), hex(0xE4ECF9), hex(0xC8DDF3), hex(0x9CC9EF)], startPoint: .top, endPoint: .bottom))
                    .mediaAt(edge, 0.464, 0.531, w: 0.63, h: 0.425)
                glowThroughCloud(cx: 0.674, cy: 0.417, r: 0.20, cloudX: 0.464, cloudY: 0.531, cloudW: 0.63, tint: hex(0xF5F0BF))
            case .ios26:
                glassSun(cx: 0.695, cy: 0.373, r: 0.185, top: hex(0xFDDD62), bottom: hex(0xF1BF25))
                glassCloud(cx: 0.4535, cy: 0.535, w: 0.653, fill: [hex(0xEDF5FD), hex(0xC9DEF0), hex(0xA3C3E6), hex(0x7AA6D8)])
                glowThroughCloud(cx: 0.695, cy: 0.373, r: 0.20, cloudX: 0.4535, cloudY: 0.535, cloudW: 0.653, tint: hex(0xFCE9B5))
            case .ios27:
                glassSun(cx: 0.695, cy: 0.375, r: 0.185, top: hex(0xFFC81A), bottom: hex(0xFFA500))
                glassCloud(cx: 0.4535, cy: 0.535, w: 0.653, fill: [hex(0xF0F6FE), hex(0xCFE3FC), hex(0xAFCEF6), hex(0x8FBCF1)])
                glowThroughCloud(cx: 0.695, cy: 0.375, r: 0.20, cloudX: 0.4535, cloudY: 0.535, cloudW: 0.653, tint: hex(0xFFE3A6))
            }
        }
        .frame(width: edge, height: edge)
    }

    /// Below the horizon (y 0.42 - 1.0): a deep royal-blue band at the horizon
    /// that shades to cyan only near the bottom.
    private func lowerSky(_ colours: [Color]) -> some View {
        let locations: [CGFloat] = [0, 0.14, 0.22, 0.40, 0.57, 0.74, 1]
        return LinearGradient(stops: zip(colours, locations).map { Gradient.Stop(color: $0, location: $1) },
                              startPoint: .top, endPoint: .bottom)
            .mediaAt(edge, 0.5, 0.71, w: 1, h: 0.58)
    }

    /// The skeuomorphic sun: orange at the top shading to yellow at the rim, with a warm glow.
    private func sun(cx: Double, cy: Double, r: Double, colours: [Color], glow: Double) -> some View {
        ZStack {
            Circle().fill(RadialGradient(colors: [hex(0xFFC84A, 0.7), hex(0xFFD54A, 0)], center: .center, startRadius: edge * r * 0.85, endRadius: edge * glow))
                .mediaCircle(edge, cx, cy, r: glow)
            Circle().fill(LinearGradient(colors: colours, startPoint: .top, endPoint: .bottom))
                .overlay(Circle().strokeBorder(hex(0xE0800F, 0.8), lineWidth: edge * 0.008))
                .mediaCircle(edge, cx, cy, r: r)
        }
    }

    private func temperature(y: Double, size: Double) -> some View {
        Text("73°")
            .font(.system(size: edge * size, weight: .bold))
            .foregroundStyle(.white)
            .shadow(color: hex(0x0A3C8C, 0.6), radius: 0, y: edge * 0.012)
            .offset(x: edge * 0.06, y: edge * (y - 0.5))
    }

    private func glassSun(cx: Double, cy: Double, r: Double, top: Color, bottom: Color) -> some View {
        Circle().fill(LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom))
            .overlay(Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.7), .white.opacity(0)], startPoint: .topLeading, endPoint: .bottom), lineWidth: edge * 0.012))
            .overlay(Circle().strokeBorder(hex(0xE08A0E, 0.55), lineWidth: edge * 0.006))
            .shadow(color: hex(0x0A3C8C, 0.25), radius: edge * 0.015, y: edge * 0.012)
            .mediaCircle(edge, cx, cy, r: r)
    }

    /// A white cloud with the tinted cloud drawn a hair smaller on top: the
    /// sliver of white that shows round the edge is the glass rim.
    private func glassCloud(cx: Double, cy: Double, w: Double, fill: [Color]) -> some View {
        ZStack {
            MediaCloudShape().fill(.white.opacity(0.95))
                .shadow(color: hex(0x08306E, 0.35), radius: edge * 0.02, x: edge * 0.01, y: edge * 0.02)
            MediaCloudShape()
                .fill(LinearGradient(colors: fill, startPoint: .top, endPoint: .bottom))
                .scaleEffect(0.978)
        }
        .mediaAt(edge, cx, cy, w: w, h: w * 0.674)
    }

    /// The sun showing through the cloud where they overlap.
    private func glowThroughCloud(cx: Double, cy: Double, r: Double, cloudX: Double, cloudY: Double, cloudW: Double, tint: Color) -> some View {
        Circle().fill(RadialGradient(colors: [tint, tint.opacity(0)], center: .center, startRadius: edge * r * 0.5, endRadius: edge * r))
            .mediaCircle(edge, cx, cy, r: r)
            .mask(MediaCloudShape().mediaAt(edge, cloudX, cloudY, w: cloudW, h: cloudW * 0.674))
    }
}

// MARK: - Clock

private enum MediaHandStyle { case tapered, bar, roundBar, stem }
private enum MediaCapStyle { case redDisc, whiteDisc, dot, ring }

private struct MediaClockSpec {
    var face: Color? = hex(0xF1F1F1)
    var faceRadius = 0.433
    var faceCentreY = 0.5
    var faceRim: Color? = nil
    var numeralInk: Color = .black
    var numeralWeight: Font.Weight = .light
    var numeralSize = 0.10
    var numeralRadius = 0.335
    var numeralDesign: Font.Design = .default
    var quartersOnly = false
    var swiss = false
    var indexInk = hex(0x3C3C3C)
    var tickInk = hex(0xC7C7C7)
    var handInk: Color = .black
    var handStyle: MediaHandStyle = .bar
    var hourWidth = 0.019, hourLength = 0.18
    var minuteWidth = 0.019, minuteLength = 0.28
    var secondInk = hex(0xDC3E1C)
    var secondWidth = 0.008, secondLength = 0.39, secondTail = 0.05
    var cap: MediaCapStyle = .dot
    var hourAngle = 306.0, minuteAngle = 54.0, secondAngle = 180.0
    var handShadow = false

    // iPhone OS 1 - iOS 5: static 10:15, tapered black hands, red seconds straight up.
    static let skeuo2007 = MediaClockSpec(
        face: hex(0xF4F4F4), faceRadius: 0.41, faceCentreY: 0.46, faceRim: hex(0x2A2A2A),
        numeralInk: hex(0x1E1E1E), numeralWeight: .bold, numeralSize: 0.095, numeralRadius: 0.315,
        handStyle: .tapered, hourWidth: 0.042, hourLength: 0.21, minuteWidth: 0.036, minuteLength: 0.33,
        secondInk: hex(0xEC0000), secondWidth: 0.014, secondLength: 0.36, secondTail: 0.06,
        cap: .redDisc, hourAngle: 307.5, minuteAngle: 90, secondAngle: 0, handShadow: true)
    // iOS 4 - iOS 5: the Retina redraw. The face grows and rises, the numerals
    // darken, and the red cap becomes a white disc ringed in black.
    static let skeuo2010: MediaClockSpec = {
        var spec = skeuo2007
        spec.faceRadius = 0.415; spec.faceCentreY = 0.45; spec.face = hex(0xF6F6F6)
        spec.numeralInk = hex(0x222222); spec.numeralRadius = 0.325
        spec.hourWidth = 0.05; spec.hourLength = 0.20; spec.hourAngle = 314
        spec.minuteWidth = 0.042; spec.minuteLength = 0.33; spec.minuteAngle = 86
        spec.secondInk = hex(0xE00000); spec.secondWidth = 0.016; spec.secondLength = 0.37; spec.secondTail = 0.04
        spec.cap = .whiteDisc
        return spec
    }()
    // iOS 6: the same clock with the hands rounded into bars.
    static let skeuo2012: MediaClockSpec = {
        var spec = skeuo2010
        spec.handStyle = .roundBar
        spec.hourWidth = 0.036; spec.hourLength = 0.225; spec.hourAngle = 315
        spec.minuteWidth = 0.032; spec.minuteLength = 0.33; spec.minuteAngle = 87
        return spec
    }()
    // iOS 7.0 - 7.1: flat, live, hairline hands, Helvetica Neue Light numerals.
    static let flat2013 = MediaClockSpec()
    // iOS 8.0 - 8.2: bolder, longer hands.
    static let flat2014 = MediaClockSpec(hourWidth: 0.025, hourLength: 0.26, minuteWidth: 0.025, minuteLength: 0.38)
    // iOS 8.3 - iOS 9: thin again, longer; San Francisco.
    static let flat2015 = MediaClockSpec(face: hex(0xF5F5F8), numeralWeight: .regular, hourLength: 0.26, minuteLength: 0.38)
    // iOS 10: orange seconds.
    static let flat2016 = MediaClockSpec(face: hex(0xF5F5F8), faceRadius: 0.439, numeralWeight: .regular,
                                         hourWidth: 0.021, hourLength: 0.24, minuteWidth: 0.021, minuteLength: 0.39,
                                         secondInk: hex(0xFF9500), secondWidth: 0.012, secondLength: 0.41, secondTail: 0.06, cap: .ring)
    // iOS 11 - iOS 13: rounded ends, hands reach the numerals.
    static let flat2017 = MediaClockSpec(face: hex(0xF5F5F8), numeralInk: hex(0x1C1C1D), numeralWeight: .semibold, numeralSize: 0.115, numeralRadius: 0.35,
                                         handStyle: .roundBar, hourWidth: 0.025, hourLength: 0.27, minuteWidth: 0.025, minuteLength: 0.40,
                                         secondInk: hex(0xFF9500), secondWidth: 0.012, secondLength: 0.41, secondTail: 0.06, cap: .ring)
    // iOS 14 - iOS 17: bold hands on a thin stem, semibold numerals.
    static let flat2020 = MediaClockSpec(face: hex(0xF5F5F8), numeralInk: hex(0x1C1C1D), numeralWeight: .semibold, numeralSize: 0.115, numeralRadius: 0.35,
                                         handStyle: .stem, hourWidth: 0.036, hourLength: 0.23, minuteWidth: 0.033, minuteLength: 0.39,
                                         secondInk: hex(0xFF9500), secondWidth: 0.012, secondLength: 0.41, secondTail: 0.06, cap: .ring)
    // iOS 18: the same face; the second hand reads a deeper orange.
    static let flat2024: MediaClockSpec = {
        var spec = flat2020
        spec.secondInk = hex(0xFF8000)
        return spec
    }()
    // iOS 26: the Swiss railway dial filling the tile.
    static let swiss2025 = MediaClockSpec(face: nil, numeralInk: hex(0x3C3C3C), numeralWeight: .semibold, numeralSize: 0.14, numeralRadius: 0.275,
                                          numeralDesign: .rounded, quartersOnly: true, swiss: true,
                                          handStyle: .stem, hourWidth: 0.040, hourLength: 0.27, minuteWidth: 0.040, minuteLength: 0.40,
                                          secondInk: hex(0xFF9501), secondWidth: 0.015, secondLength: 0.391, secondTail: 0.067, cap: .ring)
    // iOS 27: lighter indices, a shorter second hand.
    static let swiss2026: MediaClockSpec = {
        var spec = swiss2025
        spec.numeralInk = hex(0x50504F); spec.indexInk = hex(0x50504F); spec.tickInk = hex(0xC8C8C8)
        spec.secondInk = hex(0xFF8E00); spec.secondLength = 0.355; spec.secondTail = 0.10
        return spec
    }()
}

private struct MediaClockArt: View {
    let edge: CGFloat
    let spec: MediaClockSpec

    var body: some View {
        ZStack {
            if let face = spec.face {
                Circle().fill(face)
                    .overlay {
                        if let rim = spec.faceRim {
                            Circle().strokeBorder(rim, lineWidth: max(0.6, edge * 0.006))
                        }
                    }
                    .mediaCircle(edge, 0.5, spec.faceCentreY, r: spec.faceRadius)
            }
            if spec.swiss {
                let inset = RoundedRectangle(cornerRadius: edge * 0.22, style: .continuous).inset(by: edge * 0.05)
                MediaRadialBars(count: 12, inner: 0.35, outer: 0.80, width: 0.0135)
                    .fill(spec.indexInk)
                    .frame(width: edge, height: edge)
                    .clipShape(inset)
                MediaRadialBars(count: 60, inner: 0.30, outer: 0.80, width: 0.011, skipEvery: 5)
                    .fill(spec.tickInk)
                    .frame(width: edge, height: edge)
                    .mask {
                        ZStack {
                            inset.fill(.black)
                            RoundedRectangle(cornerRadius: edge * 0.22, style: .continuous).inset(by: edge * 0.12)
                                .fill(.black).blendMode(.destinationOut)
                        }
                        .compositingGroup()
                    }
            }
            numerals
            hands
        }
        .frame(width: edge, height: edge)
    }

    private var numerals: some View {
        let cy = spec.faceCentreY
        return ForEach(spec.quartersOnly ? [12, 3, 6, 9] : Array(1...12), id: \.self) { hour in
            let angle = Double(hour) / 12 * 2 * .pi
            Text("\(hour)")
                .font(.system(size: edge * spec.numeralSize, weight: spec.numeralWeight, design: spec.numeralDesign))
                .foregroundStyle(spec.numeralInk)
                .offset(x: edge * spec.numeralRadius * sin(angle), y: edge * (cy - 0.5) - edge * spec.numeralRadius * cos(angle))
        }
    }

    private var hands: some View {
        let cy = spec.faceCentreY
        return ZStack {
            hand(width: spec.hourWidth, length: spec.hourLength, angle: spec.hourAngle)
            hand(width: spec.minuteWidth, length: spec.minuteLength, angle: spec.minuteAngle)
            Capsule().fill(spec.secondInk)
                .frame(width: edge * spec.secondWidth, height: edge * (spec.secondLength + spec.secondTail))
                .offset(y: -edge * (spec.secondLength - spec.secondTail) / 2)
                .rotationEffect(.degrees(spec.secondAngle))
                .shadow(color: .black.opacity(spec.handShadow ? 0.3 : 0), radius: edge * 0.008, y: edge * 0.01)
            switch spec.cap {
            case .redDisc:
                Circle().fill(RadialGradient(colors: [hex(0xFF7A7A), hex(0xC80000)], center: .center, startRadius: 0, endRadius: edge * 0.03))
                    .frame(width: edge * 0.06, height: edge * 0.06)
            case .whiteDisc:
                Circle().fill(.white).overlay(Circle().strokeBorder(.black, lineWidth: max(0.6, edge * 0.008)))
                    .frame(width: edge * 0.06, height: edge * 0.06)
            case .dot:
                Circle().fill(spec.secondInk).frame(width: edge * 0.024, height: edge * 0.024)
            case .ring:
                Circle().fill(spec.secondInk).frame(width: edge * 0.044, height: edge * 0.044)
                Circle().fill(hex(0xEDEDED)).frame(width: edge * 0.016, height: edge * 0.016)
            }
        }
        .offset(y: edge * (cy - 0.5))
    }

    @ViewBuilder
    private func hand(width: Double, length: Double, angle: Double) -> some View {
        switch spec.handStyle {
        case .tapered:
            MediaTaperedHand().fill(spec.handInk)
                .frame(width: edge * width, height: edge * (length + 0.03))
                .offset(y: -edge * (length - 0.03) / 2)
                .rotationEffect(.degrees(angle))
                .shadow(color: .black.opacity(spec.handShadow ? 0.35 : 0), radius: edge * 0.008, y: edge * 0.012)
        case .bar:
            Rectangle().fill(spec.handInk)
                .frame(width: edge * width, height: edge * (length + 0.02))
                .offset(y: -edge * (length - 0.02) / 2)
                .rotationEffect(.degrees(angle))
        case .roundBar:
            Capsule().fill(spec.handInk)
                .frame(width: edge * width, height: edge * (length + 0.03))
                .offset(y: -edge * (length - 0.03) / 2)
                .rotationEffect(.degrees(angle))
                .shadow(color: .black.opacity(spec.handShadow ? 0.35 : 0), radius: edge * 0.008, y: edge * 0.012)
        case .stem:
            ZStack {
                Capsule().fill(spec.handInk)
                    .frame(width: edge * 0.019, height: edge * 0.09)
                    .offset(y: -edge * 0.035)
                Capsule().fill(spec.handInk)
                    .frame(width: edge * width, height: edge * (length - 0.07))
                    .offset(y: -edge * (length + 0.07) / 2)
            }
            .rotationEffect(.degrees(angle))
        }
    }
}
