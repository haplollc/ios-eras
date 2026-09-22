//
//  HomeErasGlyphs.swift
//  iOSEras
//
//  The drawing kit for home screen icons. Everything is built from basic
//  shapes in a unit square, so an icon is a handful of parameters rather
//  than a bitmap, and one era's artwork can ease into the next.
//

import SwiftUI

// MARK: - Shapes

/// A chat bubble: a rounded body with a tail off the lower left.
struct BubbleShape: Shape {
    /// 0 is a squarer, glossier 2007 bubble; 1 is the rounder iOS 7 one.
    var roundness: Double = 1

    var animatableData: Double {
        get { roundness }
        set { roundness = newValue }
    }

    func path(in rect: CGRect) -> Path {
        let body = CGRect(x: rect.minX, y: rect.minY, width: rect.width, height: rect.height * 0.82)
        let radius = body.height * (0.34 + 0.16 * roundness)
        var path = Path(roundedRect: body, cornerRadius: radius, style: .continuous)
        var tail = Path()
        tail.move(to: CGPoint(x: rect.minX + rect.width * 0.20, y: body.maxY - 1))
        tail.addQuadCurve(to: CGPoint(x: rect.minX + rect.width * 0.08, y: rect.maxY),
                          control: CGPoint(x: rect.minX + rect.width * 0.20, y: rect.maxY - rect.height * 0.04))
        tail.addQuadCurve(to: CGPoint(x: rect.minX + rect.width * 0.42, y: body.maxY - 1),
                          control: CGPoint(x: rect.minX + rect.width * 0.30, y: rect.maxY - rect.height * 0.02))
        tail.closeSubpath()
        path.addPath(tail)
        return path
    }
}

/// An envelope: the body, with the flap drawn as a V from the top corners.
struct EnvelopeFlap: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.minY + rect.height * 0.58))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        return path
    }
}

/// A gear: a ring of rounded teeth around a hub.
struct GearShape: Shape {
    var teeth: Int = 12
    /// Tooth depth as a share of the radius.
    var depth: Double = 0.16

    func path(in rect: CGRect) -> Path {
        let centre = CGPoint(x: rect.midX, y: rect.midY)
        let outer = min(rect.width, rect.height) / 2
        let inner = outer * (1 - depth)
        var path = Path()
        let steps = teeth * 4
        for step in 0..<steps {
            let angle = Double(step) / Double(steps) * 2 * .pi
            // Two steps out on the tooth, two steps in the gap.
            let radius = step % 4 < 2 ? outer : inner
            let point = CGPoint(x: centre.x + cos(angle) * radius, y: centre.y + sin(angle) * radius)
            if step == 0 { path.move(to: point) } else { path.addLine(to: point) }
        }
        path.closeSubpath()
        return path
    }
}

/// A map pin: a ball on a tapering stem.
struct PinShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let head = CGRect(x: rect.minX, y: rect.minY, width: rect.width, height: rect.width)
        path.addEllipse(in: head)
        path.move(to: CGPoint(x: rect.midX - rect.width * 0.12, y: head.maxY - rect.width * 0.1))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.midX + rect.width * 0.12, y: head.maxY - rect.width * 0.1))
        path.closeSubpath()
        return path
    }
}

/// A compass needle: a long diamond.
struct NeedleShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.midX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.midY))
        path.addLine(to: CGPoint(x: rect.midX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.midY))
        path.closeSubpath()
        return path
    }
}

// MARK: - Composed artwork

/// A ring of tick marks, for a compass or a clock.
struct TickRing: View {
    var count: Int
    var length: Double = 0.08
    var width: Double = 0.012
    var ink: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                ForEach(0..<count, id: \.self) { index in
                    Capsule().fill(ink)
                        .frame(width: side * width, height: side * length)
                        .offset(y: -side / 2 + side * length / 2)
                        .rotationEffect(.degrees(Double(index) / Double(count) * 360))
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A compass: face, ticks and a two-tone needle. `flat` eases it from the
/// dimensional brass-and-glass of 2007 to the white dial of iOS 7.
struct CompassArt: View {
    var face: Color
    var ticks: Color
    var north: Color
    var south: Color
    /// Degrees the needle leans from vertical.
    var lean: Double = 45

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Circle().fill(face)
                TickRing(count: 36, length: 0.06, width: 0.010, ink: ticks).padding(side * 0.05)
                TickRing(count: 12, length: 0.11, width: 0.016, ink: ticks).padding(side * 0.05)
                ZStack {
                    NeedleShape().fill(north)
                        .mask(alignment: .top) { Rectangle().frame(height: side * 0.39) }
                    NeedleShape().fill(south)
                        .mask(alignment: .bottom) { Rectangle().frame(height: side * 0.39) }
                }
                .frame(width: side * 0.15, height: side * 0.78)
                .rotationEffect(.degrees(lean))
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// The eight-petal pinwheel: capsules fanned around a centre, each blended
/// into its neighbour where they overlap.
struct PinwheelArt: View {
    var petals: [Color]

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                ForEach(Array(petals.enumerated()), id: \.offset) { index, colour in
                    Capsule().fill(colour.opacity(0.88))
                        .frame(width: side * 0.27, height: side * 0.44)
                        .offset(y: -side * 0.235)
                        .rotationEffect(.degrees(Double(index) / Double(petals.count) * 360))
                        .blendMode(.multiply)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A flower seen head-on: a ring of petals round a seeded centre.
struct FlowerArt: View {
    var petal: Color
    var petalShade: Color
    var centre: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                ForEach(0..<16, id: \.self) { index in
                    Ellipse()
                        .fill(LinearGradient(colors: [petal, petalShade], startPoint: .top, endPoint: .bottom))
                        .frame(width: side * 0.17, height: side * 0.40)
                        .offset(y: -side * 0.27)
                        .rotationEffect(.degrees(Double(index) / 16 * 360 + (index.isMultiple(of: 2) ? 0 : 6)))
                }
                Circle().fill(RadialGradient(colors: [centre.opacity(0.75), centre],
                                             center: .center, startRadius: 0, endRadius: side * 0.16))
                    .frame(width: side * 0.34, height: side * 0.34)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A camera lens seen head-on: barrel, glass, and a small catch-light.
struct LensArt: View {
    var barrel: Color
    var glass: Color
    var glint: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Circle().fill(LinearGradient(colors: [barrel.opacity(0.75), barrel], startPoint: .top, endPoint: .bottom))
                Circle().fill(.black.opacity(0.85)).padding(side * 0.10)
                Circle().fill(RadialGradient(colors: [glass, .black], center: .init(x: 0.4, y: 0.35),
                                             startRadius: 0, endRadius: side * 0.36))
                    .padding(side * 0.17)
                Circle().fill(glint)
                    .frame(width: side * 0.10, height: side * 0.10)
                    .offset(x: -side * 0.11, y: -side * 0.12)
                    .blur(radius: side * 0.012)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// An analogue clock showing ten past ten, the watchmaker's pose.
struct ClockArt: View {
    var face: Color
    var ink: Color
    var second: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Circle().fill(face)
                TickRing(count: 12, length: 0.07, width: 0.022, ink: ink).padding(side * 0.06)
                Capsule().fill(ink)
                    .frame(width: side * 0.045, height: side * 0.27)
                    .offset(y: -side * 0.115)
                    .rotationEffect(.degrees(-55))
                Capsule().fill(ink)
                    .frame(width: side * 0.032, height: side * 0.38)
                    .offset(y: -side * 0.17)
                    .rotationEffect(.degrees(60))
                Capsule().fill(second)
                    .frame(width: side * 0.014, height: side * 0.46)
                    .offset(y: -side * 0.13)
                    .rotationEffect(.degrees(180))
                Circle().fill(second).frame(width: side * 0.05, height: side * 0.05)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A calendar page: weekday over a large date.
struct CalendarArt: View {
    var header: Color
    var headerInk: Color
    var page: Color
    var dateInk: Color
    /// 0 sets the weekday in a filled header strip (2007); 1 sets it as
    /// bare coloured text on the page (iOS 7).
    var flat: Double
    var dateWeight: Font.Weight
    var weekday: String = "Tuesday"
    var weekdayWeight: Font.Weight = .medium

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                page
                header
                    .frame(height: side * 0.30)
                    .opacity(1 - flat)
                VStack(spacing: -side * 0.03) {
                    Text(weekday)
                        .font(.system(size: side * (weekday.count > 3 ? 0.15 : 0.17), weight: weekdayWeight))
                        .foregroundStyle(flat > 0.5 ? header : headerInk)
                        .padding(.top, side * 0.08)
                    Text("9")
                        .font(.system(size: side * 0.62, weight: dateWeight))
                        .foregroundStyle(dateInk)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A ruled notepad with a bound top edge.
struct NotepadArt: View {
    var binding: Color
    var paper: Color
    var rule: Color
    var bandHeight: Double = 0.26
    var rules: Int = 5

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack(alignment: .top) {
                paper
                VStack(spacing: side * (rules > 2 ? 0.13 : 0.22)) {
                    ForEach(0..<rules, id: \.self) { _ in
                        Rectangle().fill(rule).frame(height: max(0.5, side * 0.012))
                    }
                }
                .padding(.top, side * (bandHeight + 0.14))
                binding.frame(height: side * bandHeight)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A scrap of street map: land, a couple of roads, and a marker. `marker`
/// eases the red pushpin of 2007 into the blue location dot of iOS 7.
struct MapArt: View {
    var land: Color
    var park: Color
    var road: Color
    var highway: Color
    var pin: Color
    var marker: Double = 0

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                land
                park.frame(width: side * 0.5, height: side * 0.42)
                    .offset(x: -side * 0.30, y: side * 0.32)
                Rectangle().fill(road)
                    .frame(width: side * 1.6, height: side * 0.09)
                    .rotationEffect(.degrees(-28))
                    .offset(y: side * 0.10)
                Rectangle().fill(highway)
                    .frame(width: side * 0.15, height: side * 1.6)
                    .rotationEffect(.degrees(22))
                    .offset(x: side * 0.14)
                PinShape().fill(pin)
                    .frame(width: side * 0.17, height: side * 0.36)
                    .offset(x: -side * 0.18, y: -side * 0.17)
                    .shadow(color: .black.opacity(0.3), radius: side * 0.015, y: side * 0.01)
                    .opacity(1 - marker)
                ZStack {
                    Circle().fill(.white).frame(width: side * 0.30, height: side * 0.30)
                    Circle().fill(pin).frame(width: side * 0.24, height: side * 0.24)
                    Image(systemName: "location.north.fill")
                        .font(.system(size: side * 0.12, weight: .bold))
                        .foregroundStyle(.white)
                }
                .offset(x: side * 0.16, y: side * 0.14)
                .scaleEffect(0.6 + 0.4 * marker)
                .opacity(marker)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A sun, optionally behind a cloud.
struct WeatherArt: View {
    var sun: Color
    var cloud: Color
    /// 0 is a lone sun; 1 brings the cloud in front of it.
    var cloudy: Double
    /// The static "73°" the skeuomorphic icon wore.
    var temperature: String? = nil
    /// iOS 15 moved the sun to the right of the cloud.
    var sunOnRight: Bool = false

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            let flip: CGFloat = sunOnRight ? -1 : 1
            ZStack {
                Circle().fill(sun)
                    .frame(width: side * (temperature == nil ? 0.44 : 0.36), height: side * (temperature == nil ? 0.44 : 0.36))
                    .offset(x: -side * 0.10 * cloudy * flip - side * (temperature == nil ? 0 : 0.18),
                            y: -side * 0.08 * cloudy - side * (temperature == nil ? 0 : 0.16))
                ZStack {
                    Capsule().frame(width: side * 0.56, height: side * 0.22).offset(y: side * 0.07)
                    Circle().frame(width: side * 0.26, height: side * 0.26).offset(x: -side * 0.10)
                    Circle().frame(width: side * 0.34, height: side * 0.34).offset(x: side * 0.08, y: -side * 0.05)
                }
                .foregroundStyle(cloud)
                .offset(x: side * 0.08 * flip, y: side * 0.12)
                .opacity(cloudy)
                if let temperature {
                    Text(temperature)
                        .font(.system(size: side * 0.30, weight: .bold))
                        .foregroundStyle(.white)
                        .shadow(color: .black.opacity(0.35), radius: 0, y: -side * 0.012)
                        .offset(x: side * 0.12, y: side * 0.20)
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// An old tube television: a rounded cabinet, a bulging screen, two dials.
struct TelevisionArt: View {
    var cabinet: Color
    var screen: Color
    var trim: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                RoundedRectangle(cornerRadius: side * 0.12, style: .continuous).fill(cabinet)
                    .frame(width: side * 0.82, height: side * 0.62)
                RoundedRectangle(cornerRadius: side * 0.10, style: .continuous).fill(screen)
                    .frame(width: side * 0.56, height: side * 0.46)
                    .offset(x: -side * 0.09)
                VStack(spacing: side * 0.06) {
                    Circle().fill(trim).frame(width: side * 0.09, height: side * 0.09)
                    Circle().fill(trim).frame(width: side * 0.09, height: side * 0.09)
                }
                .offset(x: side * 0.29)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A letter A built from three strokes, leaning on each other.
struct StickLetterA: View {
    var ink: Color
    var weight: Double = 0.075

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Capsule().fill(ink).frame(width: side * weight, height: side * 0.62)
                    .rotationEffect(.degrees(30)).offset(x: -side * 0.10)
                Capsule().fill(ink).frame(width: side * weight, height: side * 0.62)
                    .rotationEffect(.degrees(-30)).offset(x: side * 0.10)
                Capsule().fill(ink).frame(width: side * 0.62, height: side * weight)
                    .offset(y: side * 0.14)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A rocket: a capsule body, two fins, a porthole, pointing up and right.
struct RocketArt: View {
    var body_: Color
    var window: Color

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Capsule().fill(body_).frame(width: side * 0.26, height: side * 0.62)
                ForEach([-1.0, 1.0], id: \.self) { direction in
                    Path { path in
                        path.move(to: .zero)
                        path.addLine(to: CGPoint(x: 0, y: side * 0.22))
                        path.addLine(to: CGPoint(x: side * 0.12 * direction, y: side * 0.24))
                        path.closeSubpath()
                    }
                    .fill(body_)
                    .offset(x: side * 0.11 * direction, y: side * 0.06)
                }
                Circle().fill(window).frame(width: side * 0.12, height: side * 0.12).offset(y: -side * 0.12)
            }
            .rotationEffect(.degrees(45))
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// A butterfly of four rounded wings meeting at a seam.
struct ButterflyArt: View {
    var wings: [Color]

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                ForEach(Array(wings.prefix(4).enumerated()), id: \.offset) { index, colour in
                    let upper = index < 2
                    let left = index.isMultiple(of: 2)
                    UnevenRoundedRectangle(topLeadingRadius: side * (upper ? 0.24 : 0.06),
                                           bottomLeadingRadius: side * (upper ? 0.06 : 0.20),
                                           bottomTrailingRadius: side * (upper ? 0.06 : 0.20),
                                           topTrailingRadius: side * (upper ? 0.24 : 0.06),
                                           style: .continuous)
                        .fill(colour)
                        .frame(width: side * 0.30, height: side * (upper ? 0.34 : 0.26))
                        .rotationEffect(.degrees((upper ? -18 : 12) * (left ? 1 : -1)))
                        .offset(x: side * 0.18 * (left ? -1 : 1), y: side * (upper ? -0.14 : 0.16))
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// Three keys fanned across the icon.
struct KeysArt: View {
    var colours: [Color]

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                ForEach(Array(colours.prefix(3).enumerated()), id: \.offset) { index, colour in
                    Image(systemName: "key.fill")
                        .font(.system(size: side * 0.58, weight: .medium))
                        .foregroundStyle(colour)
                        .rotationEffect(.degrees(-25 + 25 * Double(index)))
                        .offset(x: side * (-0.14 + 0.14 * Double(index)))
                }
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// Four full-bleed quadrants with hairline seams.
struct QuadrantArt: View {
    var colours: [Color]
    var seam: Color = .black.opacity(0.5)

    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                VStack(spacing: side * 0.012) {
                    HStack(spacing: side * 0.012) { colours[0]; colours[1] }
                    HStack(spacing: side * 0.012) { colours[2]; colours[3] }
                }
                .background(seam)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}

/// iOS 27's Siri: a chrome sphere, dark above a bright wavy horizon and
/// silver below it, with a whisper of the Siri colours round the rim.
struct SiriOrbArt: View {
    var body: some View {
        GeometryReader { geo in
            let side = min(geo.size.width, geo.size.height)
            ZStack {
                Circle().fill(LinearGradient(stops: [
                    .init(color: Color(red: 0.23, green: 0.24, blue: 0.25), location: 0),
                    .init(color: Color(red: 0.34, green: 0.35, blue: 0.36), location: 0.44),
                    .init(color: Color(red: 0.99, green: 1.0, blue: 1.0), location: 0.50),
                    .init(color: Color(red: 0.67, green: 0.70, blue: 0.75), location: 0.56),
                    .init(color: Color(red: 0.96, green: 0.96, blue: 0.97), location: 1),
                ], startPoint: .top, endPoint: .bottom))
                Circle().strokeBorder(AngularGradient(colors: [Color(red: 0.99, green: 0.45, blue: 0.62), Color(red: 0.62, green: 0.42, blue: 0.98),
                                                               Color(red: 0.30, green: 0.72, blue: 1.0), Color(red: 0.99, green: 0.75, blue: 0.40),
                                                               Color(red: 0.99, green: 0.45, blue: 0.62)], center: .center),
                                      lineWidth: side * 0.035)
                    .opacity(0.55)
            }
            .frame(width: geo.size.width, height: geo.size.height)
        }
    }
}
