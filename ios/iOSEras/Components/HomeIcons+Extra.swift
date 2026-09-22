//
//  HomeIcons+Extra.swift
//  iOSEras
//
//  The rest of the stock apps: FaceTime and Podcasts, the utilities that
//  lived in Apple's default folder (Tips, Watch, Find My, Find Friends,
//  Magnifier, Fitness), the folder itself, and the two small widgets iOS 15
//  put at the top of the page (defined, not currently placed).
//
//  Each app lists one design per redesign, starting at the timeline year the
//  redesign shipped. Colours are sampled from Logopedia's copies of Apple's
//  icons; geometry is measured from them in unit-square coordinates.
//

import SwiftUI

extension HomeApp {
    static let extra: [HomeApp] = [

        // 7.0 | 7.1 darker | 11 wider gaps | 12 button gone, lens filled |
        // 18 wider gap | 26 glass | 27 softer green.
        HomeApp("FaceTime", designs: [
            design(2013, 0x83FB6C, 0x0FD41A, art { edge in ExtraCameraArt(edge: edge, camera: .ios7, look: .flat) }),
            design(2014, 0x65FB7E, 0x07B724, art { edge in ExtraCameraArt(edge: edge, camera: .ios7, look: .flat) }),
            design(2017, 0x58F473, 0x0DBC2A, art { edge in ExtraCameraArt(edge: edge, camera: .ios11, look: .flat) }),
            design(2018, 0x5AF675, 0x0EBF2C, art { edge in ExtraCameraArt(edge: edge, camera: .ios12, look: .flat) }),
            design(2024, 0x62FC7C, 0x04B722, art { edge in ExtraCameraArt(edge: edge, camera: .ios18, look: .flat) }),
            design(2025, 0x54EF6E, 0x25C041, art { edge in
                ExtraCameraArt(edge: edge, camera: .ios26, look: .glass(top: hex(0xEAFCEE), bottom: hex(0xD2F2D8), shade: hex(0x117A28, 0.45)))
            }),
            design(2026, 0x82EC7C, 0x62CD53, art { edge in
                ExtraCameraArt(edge: edge, camera: .ios26, look: .glass(top: hex(0xFBFEFB), bottom: hex(0xEDF8EE), shade: hex(0x2E8F2A, 0.35)))
            }),
        ]),

        // Apple's default folder. Its tile is drawn from what is inside it;
        // this design is only its fallback.
        HomeApp("Utilities", names: [(era(2010), "Utilities"), (era(2014), "Extras"), (era(2020), "Utilities")], designs: [
            flat(2010, 0x3A3A3C, nothing),
        ]),

        // 8-17 white bulb on amber | 18 brighter yellow, new base | 26 glass
        // bulb, gradient flips | 27 muted gold, pale glass.
        HomeApp("Tips", designs: [
            design(2014, 0xF4AD3D, 0xF8CB46, art { edge in ExtraTipsArt(edge: edge, look: .ios8) }),
            design(2024, 0xFFB700, 0xFFCA00, art { edge in ExtraTipsArt(edge: edge, look: .ios18) }),
            design(2025, 0xFFCA00, 0xFFB302, art { edge in ExtraTipsArt(edge: edge, look: .ios26) }),
            design(2026, 0xF4C241, 0xF0B13C, art { edge in ExtraTipsArt(edge: edge, look: .ios27) }),
        ]),

        // 8.2 sport band | 12.1.1 Series 4 | 14.2 Solo Loop | 17 retouched |
        // 18.1 gradient, side button gone | 26 glass | 27 darker glass.
        HomeApp("Watch", designs: [
            flat(2015, 0x1B1B1B, art { edge in ExtraWatchArt(edge: edge, look: .sportBand) }),
            flat(2018, 0x1B1A1D, art { edge in ExtraWatchArt(edge: edge, look: .series4) }),
            flat(2020, 0x1B1B1C, art { edge in ExtraWatchArt(edge: edge, look: .soloLoop) }),
            flat(2023, 0x1B1B1C, art { edge in ExtraWatchArt(edge: edge, look: .ios17) }),
            design(2024, 0x303030, 0x151515, art { edge in ExtraWatchArt(edge: edge, look: .ios18) }),
            design(2025, 0x313131, 0x141414, art { edge in ExtraWatchArt(edge: edge, look: .glass26) }),
            design(2026, 0x232323, 0x101010, art { edge in ExtraWatchArt(edge: edge, look: .glass27) }),
        ]),

        // Find iPhone (iOS 7 icon): a green radar sweep in a black bezel.
        // Find My: a green disc with a blue dot and its heading beam.
        HomeApp("Find My", names: [(era(2015), "Find iPhone"), (era(2019), "Find My")], designs: [
            flat(2015, 0xF0EFF4, art { edge in ExtraRadarArt(edge: edge) }),
            design(2019, 0xDDDDDA, 0xCCCCCA, art { edge in ExtraFindMyArt(edge: edge, look: .ios13) }),
            design(2024, 0xF7F7F6, 0xD5D3D6, art { edge in ExtraFindMyArt(edge: edge, look: .ios18) }),
            design(2025, 0xE1E1DF, 0xBFBFBD, art { edge in ExtraFindMyArt(edge: edge, look: .ios26) }),
            design(2026, 0xDEDEDE, 0xC1C1C1, art { edge in ExtraFindMyArt(edge: edge, look: .ios27) }),
        ]),

        // Two figures arm in arm on amber: framed until iOS 9, bare from
        // iOS 10. Merged into Find My in iOS 13.
        HomeApp("Find Friends", designs: [
            design(2015, 0xF8D757, 0xF09B39, art { edge in ExtraFriendsArt(edge: edge, framed: true) }),
            design(2016, 0xF8CE45, 0xF29A38, art { edge in ExtraFriendsArt(edge: edge, framed: false) }),
        ]),

        // A loupe with a yellow plus: 14 flat black | 18 gradient | 26 glass
        // lens | 27 darker, heavier rim.
        HomeApp("Magnifier", designs: [
            flat(2020, 0x1A1A1B, art { edge in ExtraMagnifierArt(edge: edge, look: .flat(plus: hex(0xFFD800))) }),
            design(2024, 0x303030, 0x151515, art { edge in ExtraMagnifierArt(edge: edge, look: .flat(plus: hex(0xFFDA00))) }),
            design(2025, 0x303030, 0x141414, art { edge in ExtraMagnifierArt(edge: edge, look: .glass(rim: 0.034)) }),
            design(2026, 0x232323, 0x101010, art { edge in ExtraMagnifierArt(edge: edge, look: .glass(rim: 0.038)) }),
        ]),

        // Activity's three rings: Move, Exercise, Stand. 8.2-17 flat black |
        // 18 gradient | 26 glass tubes | 27 softer rings, darker ground.
        HomeApp("Fitness", names: [(era(2015), "Activity"), (era(2020), "Fitness")], designs: [
            flat(2015, 0x1E1E1E, art { edge in ExtraActivityRings(edge: edge, look: .ios8) }),
            design(2024, 0x2F2F2F, 0x151515, art { edge in ExtraActivityRings(edge: edge, look: .ios18) }),
            design(2025, 0x313131, 0x131313, art { edge in ExtraActivityRings(edge: edge, look: .ios26) }),
            design(2026, 0x1F1F1F, 0x0F0F0F, art { edge in ExtraActivityRings(edge: edge, look: .ios27) }),
        ]),

        // 7 dark-to-light violet, fading rings | 9 light-to-dark, solid rings |
        // 18 refined | 26 glass discs | 27 deeper violet.
        HomeApp("Podcasts", designs: [
            design(2013, 0x842BC1, 0xD36AFA, art { edge in ExtraPodcastsArt(edge: edge, look: .ios7) }),
            design(2015, 0xD46DFC, 0x862EC3, art { edge in ExtraPodcastsArt(edge: edge, look: .ios9) }),
            design(2024, 0xD66EFD, 0x8528C3, art { edge in ExtraPodcastsArt(edge: edge, look: .ios18) }),
            design(2025, 0xA454CF, 0x7530AD, art { edge in ExtraPodcastsArt(edge: edge, look: .ios26) }),
            design(2026, 0x883FBB, 0x6F3399, art { edge in ExtraPodcastsArt(edge: edge, look: .ios27) }),
        ]),

        // The small Weather widget: city, big temperature, condition, range.
        HomeApp("Weather Widget", names: [(era(2021), "Weather")], span: 2, designs: [
            design(2021, 0x2F6ED6, 0x1E4CA8, art { edge in
                ExtraWeatherWidget(edge: edge)
            }),
            design(2025, 0x3B8BEA, 0x1C4FB0, art { edge in
                ExtraWeatherWidget(edge: edge)
            }),
        ]),

        // The small Calendar widget: red weekday, the date, an empty day.
        HomeApp("Calendar Widget", names: [(era(2021), "Calendar")], span: 2, designs: [
            flat(2021, 0xFFFFFF, art { edge in
                ExtraCalendarWidget(edge: edge)
            }),
            design(2025, 0xFFFFFF, 0xF2F2F4, art { edge in
                ExtraCalendarWidget(edge: edge)
            }),
        ]),
    ]
}

// MARK: - Unit-square helpers

/// A box in unit-square coordinates, from its corners.
private func extraBox(_ x0: Double, _ y0: Double, _ x1: Double, _ y1: Double) -> CGRect {
    CGRect(x: x0, y: y0, width: x1 - x0, height: y1 - y0)
}

/// Scales a unit-square box into `rect`.
private func extraScaled(_ box: CGRect, _ rect: CGRect) -> CGRect {
    CGRect(x: rect.minX + box.minX * rect.width, y: rect.minY + box.minY * rect.height,
           width: box.width * rect.width, height: box.height * rect.height)
}

/// A closed polygon (unit-square points) with every corner rounded.
private func extraRoundedPolygon(_ points: [CGPoint], radius: Double, in rect: CGRect) -> Path {
    var path = Path()
    guard points.count > 2 else { return path }
    let pts = points.map { CGPoint(x: rect.minX + $0.x * rect.width, y: rect.minY + $0.y * rect.height) }
    let last = pts[pts.count - 1]
    path.move(to: CGPoint(x: (last.x + pts[0].x) / 2, y: (last.y + pts[0].y) / 2))
    for index in pts.indices {
        path.addArc(tangent1End: pts[index], tangent2End: pts[(index + 1) % pts.count], radius: radius * rect.width)
    }
    path.closeSubpath()
    return path
}

/// A tapered bar: `topHalf` wide at `y0`, `bottomHalf` wide at `y1`, round-cornered.
private struct ExtraTaper: Shape {
    var y0: Double
    var y1: Double
    var topHalf: Double
    var bottomHalf: Double
    var radius: Double

    func path(in rect: CGRect) -> Path {
        extraRoundedPolygon([CGPoint(x: 0.5 - topHalf, y: y0), CGPoint(x: 0.5 + topHalf, y: y0),
                             CGPoint(x: 0.5 + bottomHalf, y: y1), CGPoint(x: 0.5 - bottomHalf, y: y1)],
                            radius: radius, in: rect)
    }
}

/// A Liquid Glass glyph: a frosted fill over a soft offset shade, with a
/// bright rim catching the light along its top.
private struct ExtraGlassGlyph<S: Shape>: View {
    let shape: S
    let edge: CGFloat
    let top: Color
    let bottom: Color
    let shade: Color

    var body: some View {
        ZStack {
            shape.fill(shade).offset(y: edge * 0.02)
            shape.fill(LinearGradient(colors: [top, bottom], startPoint: .top, endPoint: .bottom))
            shape.stroke(LinearGradient(colors: [.white, .white.opacity(0)], startPoint: .top, endPoint: .center),
                         lineWidth: edge * 0.012)
        }
        .frame(width: edge, height: edge)
    }
}

private enum ExtraLook {
    case flat
    case glass(top: Color, bottom: Color, shade: Color)
}

// MARK: - FaceTime

/// The FaceTime video camera: a rounded body, a lens hood, and (iOS 7-11)
/// a small button left of the body and a flat bar right of the hood.
private struct ExtraCameraShape: Shape {
    var box: CGRect
    var boxRadius: Double
    /// Hood: its narrow edge at `x0` (half-height `inner`), wide at `x1`.
    var hood: (x0: Double, x1: Double, inner: Double, outer: Double, radius: Double)
    var centreY: Double
    var button: CGRect? = nil
    var bar: CGRect? = nil

    func path(in rect: CGRect) -> Path {
        var path = Path(roundedRect: extraScaled(box, rect), cornerRadius: boxRadius * rect.width, style: .continuous)
        path.addPath(extraRoundedPolygon([CGPoint(x: hood.x0, y: centreY - hood.inner), CGPoint(x: hood.x1, y: centreY - hood.outer),
                                          CGPoint(x: hood.x1, y: centreY + hood.outer), CGPoint(x: hood.x0, y: centreY + hood.inner)],
                                         radius: hood.radius, in: rect))
        if let button {
            path.addPath(Path(roundedRect: extraScaled(button, rect), cornerRadius: button.width * rect.width * 0.35))
        }
        if let bar {
            path.addPath(Path(roundedRect: extraScaled(bar, rect), cornerRadius: bar.width * rect.width * 0.3))
        }
        return path
    }

    /// iOS 7.0-10: button, body, hood and bar.
    static let ios7 = ExtraCameraShape(box: extraBox(0.152, 0.285, 0.648, 0.703), boxRadius: 0.055,
                                       hood: (0.668, 0.824, 0.063, 0.162, 0.008), centreY: 0.494,
                                       button: extraBox(0.117, 0.383, 0.141, 0.438),
                                       bar: extraBox(0.844, 0.338, 0.867, 0.650))
    /// iOS 11: the same parts pulled slightly apart.
    static let ios11 = ExtraCameraShape(box: extraBox(0.152, 0.285, 0.648, 0.703), boxRadius: 0.055,
                                        hood: (0.676, 0.824, 0.065, 0.160, 0.008), centreY: 0.494,
                                        button: extraBox(0.109, 0.383, 0.133, 0.438),
                                        bar: extraBox(0.852, 0.338, 0.875, 0.650))
    /// iOS 12-17: no button, the hood filled into a solid trapezoid.
    static let ios12 = ExtraCameraShape(box: extraBox(0.152, 0.285, 0.637, 0.715), boxRadius: 0.075,
                                        hood: (0.660, 0.848, 0.086, 0.227, 0.035), centreY: 0.5)
    /// iOS 18: a wider gap between body and hood.
    static let ios18 = ExtraCameraShape(box: extraBox(0.164, 0.279, 0.633, 0.721), boxRadius: 0.08,
                                        hood: (0.676, 0.836, 0.086, 0.218, 0.04), centreY: 0.5)
    /// iOS 26-27: a taller body and a slim wedge of a hood all but touching
    /// it. Fitted to Apple's icon, whose hood is half 0.092 high at x 0.67
    /// and 0.204 at x 0.80 (the old blunt trapezoid was 0.076 and 0.173).
    static let ios26 = ExtraCameraShape(box: extraBox(0.148, 0.258, 0.652, 0.738), boxRadius: 0.085,
                                        hood: (0.660, 0.860, 0.085, 0.250, 0.040), centreY: 0.5)
}

private struct ExtraCameraArt: View {
    let edge: CGFloat
    let camera: ExtraCameraShape
    let look: ExtraLook

    var body: some View {
        switch look {
        case .flat:
            camera.fill(.white).frame(width: edge, height: edge)
        case .glass(let top, let bottom, let shade):
            ExtraGlassGlyph(shape: camera, edge: edge, top: top, bottom: bottom, shade: shade)
        }
    }
}

// MARK: - Podcasts

private struct ExtraPodcastsArt: View {
    enum Look { case ios7, ios9, ios18, ios26, ios27 }
    let edge: CGFloat
    let look: Look

    var body: some View {
        switch look {
        case .ios7:
            // Two whole rings in translucent white, fading out downwards.
            ZStack {
                ring(radius: 0.315, width: 0.055, gap: 0, centreY: 0.44, style: fade)
                ring(radius: 0.184, width: 0.055, gap: 0, centreY: 0.44, style: fade)
                head(y: 0.426, diameter: 0.164, fill: .white)
                ExtraTaper(y0: 0.547, y1: 0.883, topHalf: 0.068, bottomHalf: 0.055, radius: 0.05)
                    .fill(LinearGradient(colors: [.white, hex(0xF3E6F7)], startPoint: .top, endPoint: .bottom))
                    .frame(width: edge, height: edge)
            }
        case .ios9, .ios18:
            // Solid white rings, cut open at the bottom where the body stands.
            let refined = look == .ios18
            ZStack {
                ring(radius: 0.329, width: refined ? 0.044 : 0.042, gap: 20, centreY: 0.458, style: Color.white)
                ring(radius: 0.212, width: refined ? 0.044 : 0.042, gap: 36, centreY: 0.458, style: Color.white)
                head(y: 0.433, diameter: 0.167, fill: .white)
                ExtraTaper(y0: 0.55, y1: refined ? 0.878 : 0.883, topHalf: refined ? 0.090 : 0.088,
                           bottomHalf: refined ? 0.056 : 0.054, radius: refined ? 0.056 : 0.06)
                    .fill(.white)
                    .frame(width: edge, height: edge)
            }
        case .ios26, .ios27:
            // The rings become two nested glass discs.
            let deep = look == .ios27
            ZStack {
                disc(diameter: deep ? 0.718 : 0.726, fill: deep ? hex(0xA55CD8, 0.55) : hex(0xC68DE5, 0.42))
                disc(diameter: 0.454, fill: deep ? hex(0xC9A3E6, 0.72) : hex(0xD6AEEC, 0.5))
                head(y: 0.447, diameter: 0.172, fill: deep ? hex(0xF4E8FD) : hex(0xFBF7FE))
                ExtraGlassGlyph(shape: ExtraTaper(y0: 0.562, y1: 0.865, topHalf: 0.095, bottomHalf: 0.066, radius: 0.062),
                                edge: edge, top: deep ? hex(0xF4E8FD) : hex(0xFCF9FF),
                                bottom: deep ? hex(0xDCC6EE, 0.8) : hex(0xE4D7EE, 0.78),
                                shade: hex(0x4A1B78, 0.35))
            }
        }
    }

    private var fade: LinearGradient {
        LinearGradient(colors: [.white.opacity(0.5), .white.opacity(0.3), .white.opacity(0.02)],
                       startPoint: .top, endPoint: .bottom)
    }

    private func ring<S: ShapeStyle>(radius: Double, width: Double, gap: Double, centreY: Double, style: S) -> some View {
        Circle()
            .trim(from: gap / 360, to: 1 - gap / 360)
            .stroke(style, style: StrokeStyle(lineWidth: edge * width, lineCap: .butt))
            .rotationEffect(.degrees(90))
            .frame(width: edge * radius * 2, height: edge * radius * 2)
            .offset(y: edge * (centreY - 0.5))
    }

    private func head(y: Double, diameter: Double, fill: Color) -> some View {
        Circle().fill(fill)
            .frame(width: edge * diameter, height: edge * diameter)
            .offset(y: edge * (y - 0.5))
    }

    private func disc(diameter: Double, fill: Color) -> some View {
        ZStack {
            Circle().fill(fill)
            Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.55), .white.opacity(0.04)],
                                                 startPoint: .top, endPoint: .bottom),
                                  lineWidth: edge * 0.008)
        }
        .frame(width: edge * diameter, height: edge * diameter)
        .offset(y: edge * (0.461 - 0.5))
    }
}

// MARK: - Fitness

/// Three Activity rings, each a closed loop whose rounded end laps its start
/// at twelve o'clock, shading from its start colour to its end colour.
private struct ExtraActivityRings: View {
    enum Look { case ios8, ios18, ios26, ios27 }
    let edge: CGFloat
    let look: Look

    private var radii: [Double] {
        switch look {
        case .ios8, .ios18: return [0.387, 0.2635, 0.139]
        case .ios26, .ios27: return [0.357, 0.2445, 0.131]
        }
    }

    private var width: Double {
        switch look {
        case .ios8, .ios18: return 0.094
        case .ios26, .ios27: return 0.086
        }
    }

    /// (start, end) per ring, outer to inner.
    private var colours: [(UInt32, UInt32)] {
        switch look {
        case .ios8: return [(0xFF2618, 0xFF2890), (0x93F900, 0xD8FF00), (0x00DFF7, 0x00FFA9)]
        case .ios18: return [(0xFF2616, 0xFF2990), (0x96FC00, 0xD5FF00), (0x00DBF7, 0x00FFA8)]
        case .ios26: return [(0xFF0010, 0xFF0096), (0x7BFF00, 0xCCFF00), (0x00F0FA, 0x00FFA4)]
        case .ios27: return [(0xEA3534, 0xEA3390), (0xA3FC4E, 0xD2FD50), (0x6EEDF0, 0x75FCA8)]
        }
    }

    private var glass: Bool { look == .ios26 || look == .ios27 }

    var body: some View {
        ZStack {
            ForEach(0..<3, id: \.self) { index in
                ring(radius: radii[index], start: hex(colours[index].0), end: hex(colours[index].1))
            }
        }
    }

    private func ring(radius: Double, start: Color, end: Color) -> some View {
        let diameter = edge * radius * 2
        let line = edge * width
        return ZStack {
            if glass {
                Circle().stroke(.black.opacity(0.55), lineWidth: line * 1.3)
            }
            Circle().stroke(AngularGradient(stops: [.init(color: start, location: 0),
                                                    .init(color: end, location: 0.72),
                                                    .init(color: end, location: 1)],
                                            center: .center, startAngle: .degrees(-90), endAngle: .degrees(270)),
                            lineWidth: line)
            if glass {
                // The tube's sheen: a pale line along its upper outside.
                Circle().stroke(LinearGradient(colors: [.white.opacity(0.55), .white.opacity(0)], startPoint: .top, endPoint: .center),
                                lineWidth: line * 0.16)
                    .frame(width: diameter + line * 0.6, height: diameter + line * 0.6)
            }
            // The end cap laps the start; its shade falls clockwise only.
            Circle().fill(.black.opacity(0.35))
                .frame(width: line, height: line)
                .offset(x: line * 0.16, y: -diameter / 2)
            Circle().fill(end)
                .frame(width: line, height: line)
                .offset(y: -diameter / 2)
        }
        .frame(width: diameter, height: diameter)
    }
}

// MARK: - Tips

/// A light bulb: a round globe narrowing through curved shoulders to a
/// flat-bottomed neck.
private struct ExtraBulbShape: Shape {
    var centreY: Double
    var radius: Double
    /// Degrees below the globe's equator where the neck curves away.
    var leave: Double
    var neckY: Double
    var neckHalf: Double
    var controlHalf: Double
    var controlY: Double

    func path(in rect: CGRect) -> Path {
        func point(_ x: Double, _ y: Double) -> CGPoint {
            CGPoint(x: rect.minX + x * rect.width, y: rect.minY + y * rect.height)
        }
        let a = leave * .pi / 180
        var path = Path()
        path.move(to: point(0.5 - neckHalf, neckY))
        path.addQuadCurve(to: point(0.5 - radius * cos(a), centreY + radius * sin(a)),
                          control: point(0.5 - controlHalf, controlY))
        // Round the top of the globe, lower-left to lower-right.
        let steps = 24
        for step in 1...steps {
            let angle = (.pi - a) + Double(step) / Double(steps) * (.pi + 2 * a)
            path.addLine(to: point(0.5 + radius * cos(angle), centreY + radius * sin(angle)))
        }
        path.addQuadCurve(to: point(0.5 + neckHalf, neckY), control: point(0.5 + controlHalf, controlY))
        path.closeSubpath()
        return path
    }
}

private struct ExtraTipsArt: View {
    enum Look { case ios8, ios18, ios26, ios27 }
    let edge: CGFloat
    let look: Look

    var body: some View {
        switch look {
        case .ios8:
            ZStack {
                ExtraBulbShape(centreY: 0.39, radius: 0.234, leave: 25, neckY: 0.71, neckHalf: 0.074,
                               controlHalf: 0.09, controlY: 0.60)
                    .fill(LinearGradient(colors: [hex(0xFFF1D6), .white], startPoint: .top, endPoint: .center))
                    .frame(width: edge, height: edge)
                filament(barY: 0.441, barHalf: 0.11, stemBottom: 0.69, ink: hex(0xF6BF43))
                band(y: 0.745, half: 0.075, height: 0.030, ink: .white)
                band(y: 0.800, half: 0.064, height: 0.030, ink: .white)
                band(y: 0.855, half: 0.045, height: 0.030, ink: .white)
            }
        case .ios18:
            ZStack {
                ExtraBulbShape(centreY: 0.375, radius: 0.242, leave: 30, neckY: 0.75, neckHalf: 0.105,
                               controlHalf: 0.12, controlY: 0.63)
                    .fill(.white)
                    .frame(width: edge, height: edge)
                filament(barY: 0.47, barHalf: 0.102, stemBottom: 0.69, ink: hex(0xFFC000))
                band(y: 0.7875, half: 0.09, height: 0.025, ink: .white)
                UnevenRoundedRectangle(topLeadingRadius: edge * 0.008, bottomLeadingRadius: edge * 0.05,
                                       bottomTrailingRadius: edge * 0.05, topTrailingRadius: edge * 0.008,
                                       style: .continuous)
                    .fill(.white)
                    .frame(width: edge * 0.15, height: edge * 0.055)
                    .offset(y: edge * (0.8425 - 0.5))
            }
        case .ios26, .ios27:
            // A clear glass bulb, the ground's yellow showing through its top,
            // on a stack of brass rings.
            let muted = look == .ios27
            // Measured off Apple's icon: a round globe that keeps its curve
            // to 44 degrees below the equator, then a short, wide neck
            // straight into a base that ends at 0.77, not 0.89.
            let bulb = ExtraBulbShape(centreY: 0.35, radius: 0.246, leave: 44, neckY: 0.63, neckHalf: 0.132,
                                      controlHalf: 0.1455, controlY: 0.5755)
            ZStack {
                bulb.fill(LinearGradient(stops: [.init(color: muted ? hex(0xFAE666) : hex(0xFDD545), location: 0.1),
                                                 .init(color: muted ? hex(0xFFFDEE) : hex(0xFCE9AB), location: 0.55),
                                                 .init(color: muted ? hex(0xFBEFCC) : hex(0xFFF6D0), location: 1)],
                                         startPoint: .top, endPoint: .bottom))
                    .frame(width: edge, height: edge)
                bulb.stroke(LinearGradient(colors: [.white, .white.opacity(0.35)], startPoint: .top, endPoint: .bottom),
                            lineWidth: edge * 0.012)
                    .frame(width: edge, height: edge)
                filament(barY: 0.45, barHalf: 0.104, stemBottom: 0.625, ink: .white.opacity(muted ? 0.88 : 0.8),
                         barH: 0.042, stemW: 0.042)
                band(y: 0.655, half: 0.135, height: 0.042, ink: muted ? hex(0xA38B3D) : hex(0xD9B23C))
                band(y: 0.70, half: 0.128, height: 0.042, ink: muted ? hex(0x8E7632) : hex(0xC49A2A))
                band(y: 0.745, half: 0.112, height: 0.042, ink: muted ? hex(0x715610) : hex(0xB48B1E))
            }
        }
    }

    /// The T-shaped filament.
    private func filament(barY: Double, barHalf: Double, stemBottom: Double, ink: Color,
                          barH: Double = 0.028, stemW: Double = 0.034) -> some View {
        ZStack {
            Capsule().fill(ink)
                .frame(width: edge * barHalf * 2, height: edge * barH)
                .offset(y: edge * (barY - 0.5))
            Capsule().fill(ink)
                .frame(width: edge * stemW, height: edge * (stemBottom - barY))
                .offset(y: edge * ((barY + stemBottom) / 2 - 0.5))
        }
    }

    private func band(y: Double, half: Double, height: Double, ink: Color) -> some View {
        Capsule().fill(ink)
            .frame(width: edge * half * 2, height: edge * height)
            .offset(y: edge * (y - 0.5))
    }
}

// MARK: - Watch

/// An Apple Watch in profile: the case on the left, crown and button on its
/// side, and the band looping round to the right.
private struct ExtraWatchArt: View {
    enum Look { case sportBand, series4, soloLoop, ios17, ios18, glass26, glass27 }
    let edge: CGFloat
    let look: Look

    private struct Spec {
        var watchCase: CGRect
        var caseRadius: Double
        var caseTop: UInt32
        var caseBottom: UInt32
        var crown: CGPoint
        var crownSize: Double
        var button: CGRect?
        var band: CGRect
        var bandWidth: Double
        var tuck = false
        var lugs = true
    }

    private var spec: Spec {
        switch look {
        case .sportBand:
            return Spec(watchCase: extraBox(0.215, 0.30, 0.315, 0.70), caseRadius: 0.03, caseTop: 0xBDBDBD, caseBottom: 0x8A8A8A,
                        crown: CGPoint(x: 0.262, y: 0.42), crownSize: 0.085, button: extraBox(0.245, 0.52, 0.28, 0.635),
                        band: extraBox(0.215, 0.17, 0.805, 0.83), bandWidth: 0.026, tuck: true)
        case .series4:
            return Spec(watchCase: extraBox(0.18, 0.285, 0.295, 0.715), caseRadius: 0.035, caseTop: 0xB5B5B5, caseBottom: 0x858585,
                        crown: CGPoint(x: 0.235, y: 0.415), crownSize: 0.075, button: extraBox(0.215, 0.52, 0.255, 0.665),
                        band: extraBox(0.185, 0.15, 0.84, 0.85), bandWidth: 0.028, tuck: true)
        case .soloLoop:
            return Spec(watchCase: extraBox(0.215, 0.30, 0.315, 0.70), caseRadius: 0.03, caseTop: 0xB8B8B8, caseBottom: 0x8C8C8C,
                        crown: CGPoint(x: 0.262, y: 0.43), crownSize: 0.065, button: extraBox(0.248, 0.515, 0.278, 0.625),
                        band: extraBox(0.225, 0.18, 0.80, 0.82), bandWidth: 0.03)
        case .ios17:
            return Spec(watchCase: extraBox(0.212, 0.295, 0.315, 0.705), caseRadius: 0.032, caseTop: 0xB0B0B0, caseBottom: 0x8A8A8A,
                        crown: CGPoint(x: 0.262, y: 0.43), crownSize: 0.068, button: extraBox(0.247, 0.515, 0.279, 0.628),
                        band: extraBox(0.225, 0.175, 0.80, 0.825), bandWidth: 0.032)
        case .ios18:
            return Spec(watchCase: extraBox(0.20, 0.27, 0.33, 0.73), caseRadius: 0.035, caseTop: 0x929293, caseBottom: 0x8A8A8A,
                        crown: CGPoint(x: 0.268, y: 0.43), crownSize: 0.07, button: nil,
                        band: extraBox(0.235, 0.18, 0.785, 0.82), bandWidth: 0.032)
        case .glass26, .glass27:
            // Measured off Apple's icon: the loop is centred on the tile and
            // its strap is thin, not the fat tube a 0.05 stroke drew.
            return Spec(watchCase: extraBox(0.16, 0.27, 0.29, 0.73), caseRadius: 0.045, caseTop: 0xDADADA, caseBottom: 0x8E8E8E,
                        crown: CGPoint(x: 0.215, y: 0.42), crownSize: 0.065, button: nil,
                        band: extraBox(0.169, 0.14, 0.835, 0.862), bandWidth: 0.038, lugs: false)
        }
    }

    var body: some View {
        let s = spec
        let glass = look == .glass26 || look == .glass27
        ZStack(alignment: .topLeading) {
            // The band.
            if glass {
                Ellipse()
                    .stroke(LinearGradient(colors: [hex(0xF2F2F2, look == .glass27 ? 0.95 : 0.9), hex(0x8F8F8F, 0.85)],
                                           startPoint: .top, endPoint: .bottom),
                            lineWidth: edge * s.bandWidth)
                    .extraPlace(s.band, edge)
            } else {
                Ellipse().stroke(.white, lineWidth: edge * s.bandWidth).extraPlace(s.band, edge)
            }
            if s.tuck {
                // The sport band's tail, tucked back over the loop, and its pin.
                let tail = s.band.insetBy(dx: -0.032, dy: -0.032)
                Ellipse().trim(from: 0.83, to: 1).stroke(.white, style: StrokeStyle(lineWidth: edge * s.bandWidth, lineCap: .round))
                    .extraPlace(tail, edge)
                Ellipse().trim(from: 0, to: 0.05).stroke(.white, style: StrokeStyle(lineWidth: edge * s.bandWidth, lineCap: .round))
                    .extraPlace(tail, edge)
                Circle().fill(.white)
                    .extraPlace(CGRect(x: tail.maxX - 0.018 - 0.012, y: tail.midY + tail.height * 0.14, width: 0.03, height: 0.03), edge)
            }
            // The case.
            RoundedRectangle(cornerRadius: edge * s.caseRadius, style: .continuous)
                .fill(LinearGradient(colors: [hex(s.caseTop), hex(s.caseBottom)], startPoint: .top, endPoint: .bottom))
                .extraPlace(s.watchCase, edge)
            if s.lugs {
                let lugX = s.watchCase.maxX - 0.035
                Circle().fill(.white).extraPlace(CGRect(x: lugX - 0.022, y: s.watchCase.minY - 0.008, width: 0.044, height: 0.044), edge)
                Circle().fill(.white).extraPlace(CGRect(x: lugX - 0.022, y: s.watchCase.maxY - 0.036, width: 0.044, height: 0.044), edge)
                if look == .ios18 {
                    // iOS 18's band ends show their pins.
                    Circle().fill(hex(0x2A2A2A)).extraPlace(CGRect(x: lugX - 0.011, y: s.watchCase.minY + 0.003, width: 0.022, height: 0.022), edge)
                    Circle().fill(hex(0x2A2A2A)).extraPlace(CGRect(x: lugX - 0.011, y: s.watchCase.maxY - 0.025, width: 0.022, height: 0.022), edge)
                }
            }
            crown(s)
            if let button = s.button {
                Capsule().fill(hex(0x2A2A2A)).extraPlace(button, edge)
                Capsule().strokeBorder(.white, lineWidth: edge * 0.009).extraPlace(button, edge)
            }
        }
        .frame(width: edge, height: edge, alignment: .topLeading)
    }

    @ViewBuilder
    private func crown(_ s: Spec) -> some View {
        let box = CGRect(x: s.crown.x - s.crownSize / 2, y: s.crown.y - s.crownSize / 2, width: s.crownSize, height: s.crownSize)
        switch look {
        case .sportBand:
            // A black sapphire crown in a white rim.
            Circle().fill(.black).extraPlace(box, edge)
            Circle().strokeBorder(.white, lineWidth: edge * 0.014).extraPlace(box, edge)
        case .series4, .soloLoop, .ios17:
            Circle().fill(hex(0x2A2A2A)).extraPlace(box, edge)
            Circle().strokeBorder(.white, lineWidth: edge * 0.013).extraPlace(box, edge)
        case .ios18:
            Circle().strokeBorder(hex(0x2A2A2A), lineWidth: edge * 0.014).extraPlace(box, edge)
        case .glass26, .glass27:
            Circle().fill(LinearGradient(colors: [.white, hex(0xC8C8C8)], startPoint: .top, endPoint: .bottom)).extraPlace(box, edge)
        }
    }
}

private extension View {
    /// Sizes and places the view over a unit-square box inside an icon of `edge`
    /// (in a top-leading ZStack).
    func extraPlace(_ box: CGRect, _ edge: CGFloat) -> some View {
        frame(width: edge * box.width, height: edge * box.height)
            .offset(x: edge * box.minX, y: edge * box.minY)
    }
}

// MARK: - Find iPhone and Find My

/// Find iPhone, iOS 7-12: a green radar in a black bezel, its sweep just
/// past one-thirty with the glow trailing behind it.
private struct ExtraRadarArt: View {
    let edge: CGFloat

    var body: some View {
        ZStack {
            Circle().fill(.black).frame(width: edge * 0.90, height: edge * 0.90)
            Circle()
                .fill(AngularGradient(stops: [.init(color: hex(0x184A20), location: 0),
                                              .init(color: hex(0x1F5A28), location: 0.125),
                                              .init(color: hex(0x266A31), location: 0.375),
                                              .init(color: hex(0x359E46), location: 0.625),
                                              .init(color: hex(0x41C858), location: 0.875),
                                              .init(color: hex(0x54DB63), location: 1)],
                                      center: .center, startAngle: .degrees(-45), endAngle: .degrees(315)))
                .frame(width: edge * 0.855, height: edge * 0.855)
            ForEach([0.25, 0.54, 0.835], id: \.self) { diameter in
                Circle().stroke(hex(0x45DC48), lineWidth: edge * 0.011)
                    .frame(width: edge * diameter, height: edge * diameter)
            }
            // The sweep's leading edge.
            Capsule().fill(hex(0x7CEB86, 0.55))
                .frame(width: edge * 0.008, height: edge * 0.42)
                .offset(y: -edge * 0.21)
                .rotationEffect(.degrees(45))
        }
    }
}

/// A heading beam: a wedge from the centre to the edge of a disc.
private struct ExtraBeamShape: Shape {
    var radius: Double
    var halfAngle: Double

    func path(in rect: CGRect) -> Path {
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        var path = Path()
        path.move(to: centre)
        let steps = 8
        for step in 0...steps {
            let angle = (-90 - halfAngle + 2 * halfAngle * Double(step) / Double(steps)) * .pi / 180
            path.addLine(to: CGPoint(x: centre.x + cos(angle) * radius * rect.width,
                                     y: centre.y + sin(angle) * radius * rect.height))
        }
        path.closeSubpath()
        return path
    }
}

private struct ExtraFindMyArt: View {
    enum Look { case ios13, ios18, ios26, ios27 }
    let edge: CGFloat
    let look: Look

    private struct Palette {
        var disc: (UInt32, UInt32)
        var zone: (UInt32, UInt32)
        var zoneEdge: Color
        var beam: [UInt32]
        var halo: Color
        var dot: (UInt32, UInt32)
        var radius: Double
    }

    private var palette: Palette {
        switch look {
        case .ios13:
            return Palette(disc: (0x38D46B, 0x2EBA58), zone: (0x4CDC66, 0x42CE5A), zoneEdge: hex(0x5BE275),
                           beam: [0x36CF76, 0x1DA7B4, 0x0A84EC], halo: hex(0xEFEFF4), dot: (0x007AFF, 0x007AFF), radius: 0.42)
        case .ios18:
            return Palette(disc: (0x38D46A, 0x2CB452), zone: (0x4DDD66, 0x43CE5B), zoneEdge: hex(0x5CE277),
                           beam: [0x3AD370, 0x25B3A2, 0x0F89D9], halo: hex(0xEFEFF4), dot: (0x007AFF, 0x007AFF), radius: 0.42)
        case .ios26:
            return Palette(disc: (0x1FD05A, 0x33B462), zone: (0x1ADD5C, 0x13D759), zoneEdge: hex(0x6AF09C),
                           beam: [0x15E7B9, 0x08CBC2, 0x018CCF], halo: hex(0xC8F3D8), dot: (0x0382F4, 0x0096D1), radius: 0.40)
        case .ios27:
            return Palette(disc: (0x5ACF58, 0x4CB446), zone: (0x6AEC55, 0x62E04F), zoneEdge: hex(0x86F070),
                           beam: [0x5CC993, 0x52B9A9, 0x439ACF], halo: hex(0xE3E5E7), dot: (0x3C80F7, 0x3176EE), radius: 0.40)
        }
    }

    var body: some View {
        let p = palette
        let glass = look == .ios26 || look == .ios27
        ZStack {
            Circle()
                .fill(LinearGradient(colors: [hex(p.disc.0), hex(p.disc.1)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * p.radius * 2, height: edge * p.radius * 2)
            if glass {
                Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.7), .white.opacity(0.15)], startPoint: .top, endPoint: .bottom),
                                      lineWidth: edge * 0.012)
                    .frame(width: edge * p.radius * 2, height: edge * p.radius * 2)
            }
            if look == .ios27 {
                // iOS 27 lifts the inner zone off the disc with a shadow.
                Circle().fill(hex(0x2F8A22, 0.55))
                    .frame(width: edge * 0.53, height: edge * 0.53)
                    .offset(y: edge * 0.012)
            }
            Circle()
                .fill(LinearGradient(colors: [hex(p.zone.0), hex(p.zone.1)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.52, height: edge * 0.52)
            Circle().stroke(p.zoneEdge, lineWidth: edge * (glass ? 0.014 : 0.012))
                .frame(width: edge * 0.52, height: edge * 0.52)
            ExtraBeamShape(radius: p.radius - 0.004, halfAngle: 29)
                .fill(LinearGradient(colors: p.beam.map { hex($0, look == .ios27 ? 0.85 : 1) },
                                     startPoint: .top, endPoint: .center))
                .frame(width: edge, height: edge)
            Circle().fill(p.halo).frame(width: edge * 0.225, height: edge * 0.225)
            Circle()
                .fill(LinearGradient(colors: [hex(p.dot.0), hex(p.dot.1)], startPoint: .top, endPoint: .bottom))
                .frame(width: edge * 0.165, height: edge * 0.165)
            if glass {
                Circle().strokeBorder(LinearGradient(colors: [.white.opacity(0.8), .white.opacity(0)], startPoint: .top, endPoint: .center),
                                      lineWidth: edge * 0.008)
                    .frame(width: edge * 0.165, height: edge * 0.165)
            }
        }
    }
}

// MARK: - Find Friends

/// Two figures standing arm in arm, their outstretched arms one bar.
private struct ExtraFriendsArt: View {
    let edge: CGFloat
    let framed: Bool

    var body: some View {
        ZStack {
            if framed {
                RoundedRectangle(cornerRadius: edge * 0.16, style: .continuous)
                    .stroke(.white.opacity(0.95), lineWidth: edge * 0.013)
                    .frame(width: edge * 0.855, height: edge * 0.855)
            }
            ZStack {
                Capsule().fill(.white)
                    .frame(width: edge * 0.75, height: edge * 0.05)
                    .offset(y: edge * (0.385 - 0.5))
                figure(at: 0.352)
                figure(at: 0.648)
            }
            .scaleEffect(framed ? 0.95 : 1)
            .offset(y: framed ? edge * 0.008 : 0)
        }
        .frame(width: edge, height: edge)
    }

    private func figure(at x: Double) -> some View {
        ZStack {
            Circle().fill(.white)
                .frame(width: edge * 0.113, height: edge * 0.113)
                .offset(x: edge * (x - 0.5), y: edge * (0.265 - 0.5))
            RoundedRectangle(cornerRadius: edge * 0.02, style: .continuous).fill(.white)
                .frame(width: edge * 0.133, height: edge * 0.20)
                .offset(x: edge * (x - 0.5), y: edge * (0.46 - 0.5))
            leg(x: x - 0.0685, lean: 13.9)
            leg(x: x + 0.0685, lean: -13.9)
        }
    }

    private func leg(x: Double, lean: Double) -> some View {
        Capsule().fill(.white)
            .frame(width: edge * 0.056, height: edge * 0.29)
            .rotationEffect(.degrees(lean))
            .offset(x: edge * (x - 0.5), y: edge * (0.655 - 0.5))
    }
}

// MARK: - Magnifier

/// A loupe: a ring round a yellow plus, its handle out to the lower right.
private struct ExtraMagnifierArt: View {
    enum Look {
        case flat(plus: Color)
        case glass(rim: Double)
    }
    let edge: CGFloat
    let look: Look

    private var centre: CGPoint { CGPoint(x: 0.424, y: 0.405) }

    var body: some View {
        ZStack {
            switch look {
            case .flat(let plus):
                handle(fill: AnyShapeStyle(Color.white), width: 0.056)
                Circle().stroke(.white, lineWidth: edge * 0.036)
                    .frame(width: edge * 0.48, height: edge * 0.48)
                    .offset(x: edge * (centre.x - 0.5), y: edge * (centre.y - 0.5))
                // Apple draws a fine plus (0.016 of the edge on the glass
                // icon), not the 0.042 slab this used to be.
                cross(ink: plus, weight: 0.028, reach: 0.25)
            case .glass(let rim):
                handle(fill: AnyShapeStyle(LinearGradient(colors: [.white, hex(0x9A9A9A)], startPoint: .topLeading, endPoint: .bottomTrailing)),
                       width: 0.055)
                Circle()
                    .fill(RadialGradient(colors: [hex(0x5A5638), hex(0x2E2C1E)], center: .init(x: 0.4, y: 0.35),
                                         startRadius: 0, endRadius: edge * 0.26))
                    .frame(width: edge * 0.48, height: edge * 0.48)
                    .offset(x: edge * (centre.x - 0.5), y: edge * (centre.y - 0.5))
                cross(ink: hex(0xF5CF2A, 0.9), weight: 0.016, reach: 0.246)
                Circle().stroke(LinearGradient(colors: [.white, hex(0xB4B4B4)], startPoint: .top, endPoint: .bottom),
                                lineWidth: edge * rim)
                    .frame(width: edge * 0.49, height: edge * 0.49)
                    .offset(x: edge * (centre.x - 0.5), y: edge * (centre.y - 0.5))
            }
        }
        .frame(width: edge, height: edge)
    }

    /// The handle, from the ring's edge out along the diagonal.
    private func handle(fill: AnyShapeStyle, width: Double) -> some View {
        // From 0.26 to 0.60 out from the lens centre, at 45 degrees.
        let mid = 0.43
        return Capsule().fill(fill)
            .frame(width: edge * width, height: edge * 0.34)
            .rotationEffect(.degrees(-45))
            .offset(x: edge * (centre.x + mid * cos(.pi / 4) - 0.5), y: edge * (centre.y + mid * sin(.pi / 4) - 0.5))
    }

    private func cross(ink: Color, weight: Double, reach: Double) -> some View {
        ZStack {
            Capsule().fill(ink).frame(width: edge * reach, height: edge * weight)
            Capsule().fill(ink).frame(width: edge * weight, height: edge * reach)
        }
        .offset(x: edge * (centre.x - 0.5), y: edge * (centre.y - 0.5))
    }
}

// MARK: - Widgets

private struct ExtraWeatherWidget: View {
    let edge: CGFloat

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Cupertino").font(.system(size: edge * 0.085, weight: .semibold))
            Text("72°").font(.system(size: edge * 0.26, weight: .light)).padding(.top, -edge * 0.01)
            Spacer(minLength: 0)
            Image(systemName: "sun.max.fill").font(.system(size: edge * 0.09)).foregroundStyle(hex(0xFFD60A))
            Text("Sunny").font(.system(size: edge * 0.08, weight: .semibold))
            Text("H:75°  L:58°").font(.system(size: edge * 0.075, weight: .medium)).opacity(0.85)
        }
        .foregroundStyle(.white)
        .padding(edge * 0.095)
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}

private struct ExtraCalendarWidget: View {
    let edge: CGFloat

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("TUESDAY").font(.system(size: edge * 0.075, weight: .semibold)).foregroundStyle(hex(0xFF3B30))
            Text("9").font(.system(size: edge * 0.22, weight: .regular)).foregroundStyle(.black)
            Spacer(minLength: 0)
            Text("No more events today").font(.system(size: edge * 0.07, weight: .regular)).foregroundStyle(hex(0x8E8E93))
        }
        .padding(edge * 0.095)
        .frame(width: edge, height: edge, alignment: .topLeading)
    }
}
