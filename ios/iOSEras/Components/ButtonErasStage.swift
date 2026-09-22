//
//  ButtonErasStage.swift
//  iOSEras
//
//  Draws one moment on the timeline: that year's iPhone, its screen, and the
//  button on it. `position` is animatable, so a spring on the ruler carries
//  every gradient stop, radius and bezel along with it.
//

import SwiftUI

struct ButtonErasStage: View, Animatable {
    let eras: [ButtonEra]
    var position: Double
    /// Points per millimetre of iPhone.
    var scale: Double = 4

    var animatableData: Double {
        get { position }
        set { position = newValue }
    }

    private var year: Int {
        eras[min(max(Int(position.rounded()), 0), eras.count - 1)].year
    }

    var body: some View {
        let looks = eras.looks(at: position)
        EraDevice(look: looks.hardware, scale: scale) {
            ZStack {
                EraBackdrop(look: looks.screen)
                EraStatusBar(look: looks.screen, hardware: looks.hardware, scale: scale)
                EraButton(look: looks.button, year: year)
            }
        }
    }
}

// MARK: - Button

struct EraButton: View {
    let look: ButtonLook
    let year: Int

    var body: some View {
        Button {} label: { EmptyView() }
            .buttonStyle(EraButtonStyle(look: look, year: year))
            .accessibilityLabel("Button, \(String(year)) style")
            .accessibilityIdentifier("buttonEras.button")
    }
}

private struct EraButtonStyle: ButtonStyle {
    let look: ButtonLook
    let year: Int

    func makeBody(configuration: Configuration) -> some View {
        EraButtonFace(look: look, year: year, pressed: configuration.isPressed)
    }
}

private struct EraButtonFace: View {
    let look: ButtonLook
    let year: Int
    let pressed: Bool

    var body: some View {
        let shape = RoundedRectangle(cornerRadius: min(look.cornerRadius, look.height / 2),
                                     style: look.continuousCorners ? .continuous : .circular)
        // How much of this button is painted rather than glass or bare text:
        // painted buttons darken when pressed, the rest dim like a text link.
        let painted = max(look.fillTop.a, look.fillBottom.a) * (1 - look.glass)

        // The groove is the same shape grown outward, so its corners stay
        // concentric with the fill's.
        let well = RoundedRectangle(cornerRadius: min(look.cornerRadius, look.height / 2) + look.wellWidth,
                                    style: look.continuousCorners ? .continuous : .circular)

        ZStack {
            well.fill(look.lowerLip.color)
                .padding(-look.wellWidth)
                .offset(y: 1)

            well.fill(LinearGradient(colors: [look.wellTop.color, look.wellBottom.color],
                                     startPoint: .top, endPoint: .bottom))
                .padding(-look.wellWidth)

            shape.fill(LinearGradient(stops: [
                .init(color: look.fillTop.color, location: 0),
                .init(color: look.fillUpper.color, location: look.glossLine),
                .init(color: look.fillLower.color, location: look.glossLine),
                .init(color: look.fillBottom.color, location: 1),
            ], startPoint: .top, endPoint: .bottom))
            .shadow(color: look.shadow.color, radius: look.shadowRadius, y: look.shadowY)

            if look.glass > 0.01 {
                Color.clear
                    .glassEffect(.regular.tint(look.glassTint.color).interactive(), in: shape)
                    .opacity(look.glass)
            }

            shape.inset(by: look.strokeWidth)
                .strokeBorder(LinearGradient(colors: [look.innerHighlight.color, look.innerHighlight.color.opacity(0)],
                                             startPoint: .top, endPoint: .center),
                              lineWidth: 1)

            shape.strokeBorder(LinearGradient(colors: [look.strokeTop.color, look.strokeBottom.color],
                                              startPoint: .top, endPoint: .bottom),
                               lineWidth: look.strokeWidth)

            shape.fill(.black.opacity(pressed ? 0.22 * painted : 0))

            Text(String(year))
                .font(look.typeface.font(size: look.labelSize, weight: look.weight))
                .monospacedDigit()
                .foregroundStyle(look.label.color)
                .shadow(color: look.labelShadow.color, radius: 0, y: look.labelShadowY)
                .contentTransition(.numericText(value: Double(year)))
                .animation(.snappy(duration: 0.32), value: year)
                .opacity(pressed ? 1 - 0.7 * (1 - painted) * (1 - look.glass) : 1)
        }
        .frame(width: look.width, height: look.height)
        .contentShape(shape)
        .animation(.easeOut(duration: 0.12), value: pressed)
    }
}

// MARK: - Screen

struct EraBackdrop: View {
    let look: ScreenLook

    var body: some View {
        ZStack {
            LinearGradient(colors: [look.top.color, look.bottom.color], startPoint: .top, endPoint: .bottom)

            if look.blooms > 0.01 {
                GeometryReader { geo in
                    let side = max(geo.size.width, geo.size.height)
                    // Soft blobs from radial gradients: a blur of this radius
                    // would be recomputed on every frame of a scrub.
                    ZStack {
                        Circle().fill(RadialGradient(colors: [look.bloomA.color, look.bloomA.color.opacity(0)],
                                                     center: .center, startRadius: 0, endRadius: side * 0.62))
                            .frame(width: side * 1.24, height: side * 1.24)
                            .position(x: geo.size.width * 0.18, y: geo.size.height * 0.30)
                        Circle().fill(RadialGradient(colors: [look.bloomB.color, look.bloomB.color.opacity(0)],
                                                     center: .center, startRadius: 0, endRadius: side * 0.56))
                            .frame(width: side * 1.12, height: side * 1.12)
                            .position(x: geo.size.width * 0.88, y: geo.size.height * 0.72)
                    }
                }
                .opacity(look.blooms)
            }

            if look.pinstripes > 0.01 {
                Canvas { context, size in
                    // Grouped table views sat on stripes 7 px apart: a lighter
                    // hairline pair on the blue-grey ground.
                    var x: CGFloat = 0
                    while x < size.width {
                        context.fill(Path(CGRect(x: x, y: 0, width: 1.5, height: size.height)),
                                     with: .color(.white.opacity(0.16)))
                        x += 3.5
                    }
                }
                .opacity(look.pinstripes)
            }

            if look.linen > 0.01 {
                Canvas { context, size in
                    // Linen is a weave: faint threads both ways, each with its
                    // own weight, so no two neighbours match.
                    var seed: UInt32 = 0x9E3779B9
                    func next() -> Double {
                        seed = seed &* 1_664_525 &+ 1_013_904_223
                        return Double(seed >> 8) / Double(1 << 24)
                    }
                    // Fine, short threads rather than full-width lines, or the
                    // weave reads as plaid at this size.
                    var y: CGFloat = 0
                    while y < size.height {
                        var x: CGFloat = -CGFloat(next()) * 14
                        while x < size.width {
                            let run = 6 + CGFloat(next()) * 16
                            let tone = next()
                            context.fill(Path(CGRect(x: x, y: y, width: run, height: 0.5)),
                                         with: .color((tone > 0.5 ? Color.white : .black).opacity(0.025 + 0.05 * next())))
                            x += run + CGFloat(next()) * 5
                        }
                        y += 1
                    }
                    var x: CGFloat = 0
                    while x < size.width {
                        var y: CGFloat = -CGFloat(next()) * 14
                        while y < size.height {
                            let run = 6 + CGFloat(next()) * 16
                            let tone = next()
                            context.fill(Path(CGRect(x: x, y: y, width: 0.5, height: run)),
                                         with: .color((tone > 0.5 ? Color.white : .black).opacity(0.02 + 0.04 * next())))
                            y += run + CGFloat(next()) * 5
                        }
                        x += 1
                    }
                }
                .opacity(look.linen)
            }
        }
    }
}

struct EraStatusBar: View {
    let look: ScreenLook
    let hardware: DeviceLook
    let scale: Double

    var body: some View {
        GeometryReader { geo in
            // Square-screened iPhones had a 20 pt bar on a 320 pt wide screen;
            // the notch and the island made it taller.
            let cutout = CutoutGeometry(hardware)
            // The 20 pt bar of a home-button phone, on its real point width:
            // 320 pt up to the 4" phones, 375 pt for the 4.7" ones.
            let screenMM = hardware.bodyWidth - hardware.bezelSide * 2
            let points = min(375, max(320, 320 + (screenMM - 51.7) / (58.5 - 51.7) * 55))
            let barHeight = geo.size.width * 20 / points
            let height = max(barHeight, cutout.bottom * scale + 3)
            // With a cutout, the time and battery sit on its centre line: the
            // middle of the notch's ears, or level with the island.
            let centreY = Double.blend(barHeight / 2, cutout.centreY * scale, cutout.presence)
            // 12 pt on a home-button phone, 15 pt beside a notch or island.
            let type = geo.size.width * Double.blend(12 / points, 0.040, cutout.presence)
            // The battery hugs the right edge on a home-button phone and sits
            // in the right ear beside a cutout, a little further out by the island.
            let islandShare = hardware.island / max(hardware.notch + hardware.island, 0.001)
            let batteryX = Double.blend(0.95, Double.blend(0.86, 0.881, islandShare), cutout.presence)

            ZStack {
                Rectangle().fill(look.statusBand.color)

                Text("9:41")
                    .font(.system(size: type, weight: .semibold))
                    .foregroundStyle(look.chrome.color)
                    .fixedSize()
                    .position(x: geo.size.width * look.clockX, y: centreY)

                Battery(ink: look.chrome.color)
                    .frame(width: type * 1.9, height: type * 0.9)
                    .position(x: geo.size.width * batteryX, y: centreY)
            }
            .frame(height: height)
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
    }

    private struct Battery: View {
        let ink: Color

        var body: some View {
            GeometryReader { geo in
                let body = CGRect(x: 0, y: 0, width: geo.size.width * 0.9, height: geo.size.height)
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: body.height * 0.28)
                        .strokeBorder(ink.opacity(0.45), lineWidth: 0.75)
                        .frame(width: body.width, height: body.height)
                    RoundedRectangle(cornerRadius: body.height * 0.16)
                        .fill(ink)
                        .frame(width: body.width - 3, height: body.height - 3)
                        .offset(x: 1.5)
                    Capsule().fill(ink.opacity(0.45))
                        .frame(width: geo.size.width * 0.06, height: body.height * 0.4)
                        .offset(x: body.width + 0.75)
                }
            }
        }
    }
}

// MARK: - iPhone

struct EraDevice<Screen: View>: View {
    let look: DeviceLook
    let scale: Double
    @ViewBuilder let screen: Screen

    var body: some View {
        let s = scale
        let width = look.bodyWidth * s
        let height = look.bodyHeight * s
        let body = RoundedRectangle(cornerRadius: look.bodyRadius * s, style: .continuous)
        let screenWidth = (look.bodyWidth - look.bezelSide * 2) * s
        let screenHeight = (look.bodyHeight - look.bezelTop - look.bezelBottom) * s
        let screenShape = RoundedRectangle(cornerRadius: look.screenRadius * s, style: .continuous)

        ZStack(alignment: .top) {
            body.fill(look.face.color)
                .shadow(color: .black.opacity(0.18), radius: 18, y: 12)

            body.strokeBorder(
                LinearGradient(colors: [look.frame.color, look.frame.color.opacity(0.78), look.frame.color],
                               startPoint: .topLeading, endPoint: .bottomTrailing),
                lineWidth: look.frameWidth * s)

            // The black border every display has. Invisible on a black face;
            // on a white one it is what separates screen from glass.
            RoundedRectangle(cornerRadius: look.screenRadius * s + 0.5 * s, style: .continuous)
                .fill(.black)
                .frame(width: screenWidth + 1.0 * s, height: screenHeight + 1.0 * s)
                .offset(y: look.bezelTop * s - 0.5 * s)

            screen
                .frame(width: screenWidth, height: screenHeight)
                .overlay(alignment: .top) { cutouts(scale: s) }
                .clipShape(screenShape)
                .offset(y: look.bezelTop * s)

            if look.earpiece > 0.01 {
                Capsule().fill(look.homeInk.color)
                    .frame(width: look.earpieceWidth * s, height: 1.3 * s)
                    .offset(y: (look.bezelTop * s - 1.3 * s) / 2)
                    // Gone before the shrinking bezel can carry it onto the screen.
                    .opacity(max(0, look.earpiece * 2 - 1))
            }

            if look.homeButton > 0.01 {
                homeButton(scale: s)
                    .offset(y: height - look.bezelBottom * s / 2 - look.homeDiameter * s / 2)
                    .opacity(max(0, look.homeButton * 2 - 1))
            }
        }
        .frame(width: width, height: height)
    }

    /// The notch hangs off the top edge of the display; the island floats
    /// below it. Both are drawn over the screen so they clip with it.
    private func cutouts(scale s: Double) -> some View {
        let cutout = CutoutGeometry(look)
        return CutoutShape(width: cutout.width * s, height: cutout.height * s, top: cutout.top * s,
                           bottomRadius: cutout.bottomRadius * s, topRadius: cutout.topRadius * s,
                           shoulder: cutout.shoulder * s)
            .fill(.black)
            .frame(height: (cutout.top + cutout.height + cutout.shoulder) * s + 1)
            .opacity(cutout.presence > 0.01 ? 1 : 0)
    }

    private func homeButton(scale s: Double) -> some View {
        let diameter = look.homeDiameter * s
        return ZStack {
            Circle().fill(
                RadialGradient(colors: [look.face.color, look.homeInk.color.opacity(0.35)],
                               center: .center, startRadius: diameter * 0.2, endRadius: diameter * 0.62))
            Circle().strokeBorder(look.homeInk.color.opacity(0.5), lineWidth: 0.75)
            RoundedRectangle(cornerRadius: diameter * 0.09, style: .continuous)
                .strokeBorder(look.homeInk.color, lineWidth: max(0.9, diameter * 0.035))
                .frame(width: diameter * 0.36, height: diameter * 0.36)
                .opacity(look.homeGlyph)
            Circle().strokeBorder(look.frame.color, lineWidth: max(1, diameter * 0.06))
                .opacity(look.homeRing)
        }
        .frame(width: diameter, height: diameter)
    }
}

// MARK: - Notch and island

/// The camera cutout at one moment, in millimetres. The notch of 2017-2021
/// and the island of 2022 on are one shape here, so the scrub can carry one
/// into the other: first the notch draws in to the island's size and loses
/// its shoulders, then it drops away from the top edge and rounds off.
struct CutoutGeometry {
    var width = 0.0, height = 0.0, top = 0.0
    var bottomRadius = 0.0, topRadius = 0.0, shoulder = 0.0
    /// 0 with no cutout, 1 with one.
    var presence = 0.0

    var bottom: Double { top + height }
    /// The status bar's centre line: level with the island, but on a notched
    /// phone lower than the notch's middle, where Apple set it.
    var centreY = 0.0

    init(_ look: DeviceLook) {
        presence = min(1, look.notch + look.island)
        guard presence > 0.001 else { return }
        // How far along the notch-to-island morph this moment is.
        let k = look.island / max(look.notch + look.island, 0.001)
        let shrink = min(1, k * 2)          // first half: the notch draws in
        let detach = max(0, k * 2 - 1)      // second half: it leaves the edge
        let notchRadius = look.notchHeight * 0.62
        width = .blend(look.notchWidth, look.islandWidth, shrink)
        height = .blend(look.notchHeight, look.islandHeight, shrink)
        bottomRadius = .blend(notchRadius, look.islandHeight / 2, shrink)
        shoulder = (1 - shrink) * 1.0
        top = detach * look.islandTop
        topRadius = detach * look.islandHeight / 2
        centreY = .blend(look.notchHeight * 0.73, look.islandTop + look.islandHeight / 2, k)
        // A notch arriving on an all-screen phone grows down from the edge.
        if k < 0.001 { height *= presence; bottomRadius = min(bottomRadius, height / 2) }
    }
}

/// The notch or the island: a box hanging from (or floating below) the top
/// edge, with concave shoulders where a notch meets the edge.
struct CutoutShape: Shape {
    var width: CGFloat, height: CGFloat, top: CGFloat
    var bottomRadius: CGFloat, topRadius: CGFloat, shoulder: CGFloat

    func path(in rect: CGRect) -> Path {
        var path = Path()
        guard width > 0.5, height > 0.5 else { return path }
        let x0 = rect.midX - width / 2, x1 = rect.midX + width / 2
        let y0 = rect.minY + top, y1 = y0 + height
        let rb = min(bottomRadius, height / 2, width / 2)
        let rt = min(topRadius, height / 2, width / 2)
        let sh = min(shoulder, height / 2)

        if sh > 0.05 {
            path.move(to: CGPoint(x: x0 - sh, y: y0))
            path.addQuadCurve(to: CGPoint(x: x0, y: y0 + sh), control: CGPoint(x: x0, y: y0))
        } else {
            path.move(to: CGPoint(x: x0, y: y0 + rt))
        }
        path.addLine(to: CGPoint(x: x0, y: y1 - rb))
        path.addQuadCurve(to: CGPoint(x: x0 + rb, y: y1), control: CGPoint(x: x0, y: y1))
        path.addLine(to: CGPoint(x: x1 - rb, y: y1))
        path.addQuadCurve(to: CGPoint(x: x1, y: y1 - rb), control: CGPoint(x: x1, y: y1))
        if sh > 0.05 {
            path.addLine(to: CGPoint(x: x1, y: y0 + sh))
            path.addQuadCurve(to: CGPoint(x: x1 + sh, y: y0), control: CGPoint(x: x1, y: y0))
        } else {
            path.addLine(to: CGPoint(x: x1, y: y0 + rt))
            path.addQuadCurve(to: CGPoint(x: x1 - rt, y: y0), control: CGPoint(x: x1, y: y0))
            path.addLine(to: CGPoint(x: x0 + rt, y: y0))
            path.addQuadCurve(to: CGPoint(x: x0, y: y0 + rt), control: CGPoint(x: x0, y: y0))
        }
        path.closeSubpath()
        return path
    }
}
