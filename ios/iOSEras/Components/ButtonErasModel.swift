//
//  ButtonErasModel.swift
//  iOSEras
//
//  Everything about a year that can be drawn is a number here, so two
//  neighbouring years can be blended and the button (and the iPhone it
//  lives on) morphs while the ruler is mid-drag instead of cutting.
//

import SwiftUI

// MARK: - Blending

protocol Blendable {
    static func blend(_ a: Self, _ b: Self, _ t: Double) -> Self
}

extension Double: Blendable {
    static func blend(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }
}

/// A colour kept as components, because `Color` cannot be interpolated by hand.
struct Ink: Blendable, Equatable {
    var r: Double, g: Double, b: Double, a: Double

    init(_ hex: UInt32, _ alpha: Double = 1) {
        r = Double((hex >> 16) & 0xFF) / 255
        g = Double((hex >> 8) & 0xFF) / 255
        b = Double(hex & 0xFF) / 255
        a = alpha
    }

    private init(r: Double, g: Double, b: Double, a: Double) {
        self.r = r; self.g = g; self.b = b; self.a = a
    }

    static let clear = Ink(0xFFFFFF, 0)

    var color: Color { Color(.sRGB, red: r, green: g, blue: b, opacity: a) }

    /// Blends premultiplied, so fading to `clear` does not drift toward the
    /// clear colour's hue on the way.
    static func blend(_ x: Ink, _ y: Ink, _ t: Double) -> Ink {
        let alpha = x.a + (y.a - x.a) * t
        guard alpha > 0.0001 else { return Ink(r: y.r, g: y.g, b: y.b, a: 0) }
        func mix(_ p: Double, _ q: Double) -> Double {
            (p * x.a + (q * y.a - p * x.a) * t) / alpha
        }
        return Ink(r: mix(x.r, y.r), g: mix(x.g, y.g), b: mix(x.b, y.b), a: alpha)
    }
}

// MARK: - The button

enum EraTypeface: Equatable {
    case helvetica, helveticaNeue, sanFrancisco

    func font(size: Double, weight: Font.Weight) -> Font {
        switch self {
        // fixedSize: the phones are drawn smaller than life, and a font that
        // scales with Dynamic Type rounds these small sizes to whole points.
        case .helvetica:
            return .custom(weight >= .semibold ? "Helvetica-Bold" : "Helvetica", fixedSize: size)
        case .helveticaNeue:
            let face: String
            switch weight {
            case .light, .thin, .ultraLight: face = "HelveticaNeue-Light"
            case .medium: face = "HelveticaNeue-Medium"
            case .semibold, .bold, .heavy, .black: face = "HelveticaNeue-Bold"
            default: face = "HelveticaNeue"
            }
            return .custom(face, fixedSize: size)
        case .sanFrancisco:
            return .system(size: size, weight: weight)
        }
    }
}

private extension Font.Weight {
    static func >= (lhs: Font.Weight, rhs: Font.Weight) -> Bool {
        let order: [Font.Weight] = [.ultraLight, .thin, .light, .regular, .medium, .semibold, .bold, .heavy, .black]
        return (order.firstIndex(of: lhs) ?? 3) >= (order.firstIndex(of: rhs) ?? 3)
    }
}

struct ButtonLook: Blendable {
    var width: Double
    var height: Double
    /// Use a radius of half the height or more for a capsule.
    var cornerRadius: Double

    /// A four-stop vertical fill. `fillUpper` and `fillLower` both sit on
    /// `glossLine`, so a hard gloss break is two different colours there and
    /// a flat or smooth fill is the same colour twice.
    var fillTop: Ink
    var fillUpper: Ink
    var fillLower: Ink
    var fillBottom: Ink
    var glossLine: Double

    /// The dark groove big glossy buttons were sunk into: a ring OUTSIDE the
    /// fill, darkest along its top where the surface would shade it.
    var wellTop: Ink
    var wellBottom: Ink
    var wellWidth: Double

    /// Skeuomorphic outlines were darker along the top than the bottom, so
    /// the stroke is a vertical pair. Flat eras set both the same.
    var strokeTop: Ink
    var strokeBottom: Ink
    var strokeWidth: Double
    /// A light line just inside the top edge: the bevel on glossy buttons.
    var innerHighlight: Ink
    /// A light line just under the bottom edge: the "pressed into the
    /// surface" emboss that skeuomorphic controls sat in.
    var lowerLip: Ink
    var shadow: Ink
    var shadowRadius: Double
    var shadowY: Double

    var label: Ink
    var labelSize: Double
    /// An engraved (negative y) or embossed (positive y) label shadow.
    var labelShadow: Ink
    var labelShadowY: Double

    /// How much of the real Liquid Glass layer shows, 0...1.
    var glass: Double
    var glassTint: Ink

    // Not blendable: these flip at the halfway point.
    var typeface: EraTypeface
    var weight: Font.Weight
    var continuousCorners: Bool

    /// The same button drawn larger: every length grows, colours stay.
    func scaled(by k: Double) -> ButtonLook {
        var copy = self
        copy.width *= k; copy.height *= k; copy.cornerRadius *= k
        copy.wellWidth *= k; copy.strokeWidth *= k
        copy.shadowRadius *= k; copy.shadowY *= k
        copy.labelSize *= k; copy.labelShadowY *= k
        return copy
    }

    static func blend(_ a: ButtonLook, _ b: ButtonLook, _ t: Double) -> ButtonLook {
        let near = t < 0.5 ? a : b
        return ButtonLook(
            width: .blend(a.width, b.width, t),
            height: .blend(a.height, b.height, t),
            cornerRadius: .blend(min(a.cornerRadius, a.height / 2), min(b.cornerRadius, b.height / 2), t),
            fillTop: .blend(a.fillTop, b.fillTop, t),
            fillUpper: .blend(a.fillUpper, b.fillUpper, t),
            fillLower: .blend(a.fillLower, b.fillLower, t),
            fillBottom: .blend(a.fillBottom, b.fillBottom, t),
            glossLine: .blend(a.glossLine, b.glossLine, t),
            wellTop: .blend(a.wellTop, b.wellTop, t),
            wellBottom: .blend(a.wellBottom, b.wellBottom, t),
            wellWidth: .blend(a.wellWidth, b.wellWidth, t),
            strokeTop: .blend(a.strokeTop, b.strokeTop, t),
            strokeBottom: .blend(a.strokeBottom, b.strokeBottom, t),
            strokeWidth: .blend(a.strokeWidth, b.strokeWidth, t),
            innerHighlight: .blend(a.innerHighlight, b.innerHighlight, t),
            lowerLip: .blend(a.lowerLip, b.lowerLip, t),
            shadow: .blend(a.shadow, b.shadow, t),
            shadowRadius: .blend(a.shadowRadius, b.shadowRadius, t),
            shadowY: .blend(a.shadowY, b.shadowY, t),
            label: .blend(a.label, b.label, t),
            labelSize: .blend(a.labelSize, b.labelSize, t),
            labelShadow: .blend(a.labelShadow, b.labelShadow, t),
            labelShadowY: .blend(a.labelShadowY, b.labelShadowY, t),
            glass: .blend(a.glass, b.glass, t),
            glassTint: .blend(a.glassTint, b.glassTint, t),
            typeface: near.typeface,
            weight: near.weight,
            continuousCorners: near.continuousCorners
        )
    }
}

// MARK: - The screen behind it

struct ScreenLook: Blendable {
    var top: Ink
    var bottom: Ink
    /// The grey pinstripes of early grouped table views, 0...1.
    var pinstripes: Double
    /// The woven linen of iOS 5 and 6, 0...1.
    var linen: Double
    /// Soft colour blooms: the blurred-gradient wallpapers of the flat era
    /// onward, and something for glass to refract. 0...1.
    var blooms: Double
    var bloomA: Ink
    var bloomB: Ink
    /// Status bar ink, so it flips with light and dark screens.
    var chrome: Ink
    /// The opaque strip the status bar sat on before iOS 7 let the app's own
    /// background run underneath it.
    var statusBand: Ink
    /// Where the clock sits across the status bar, 0...1: centred until the
    /// notch pushed it into the left ear.
    var clockX: Double

    static func blend(_ a: ScreenLook, _ b: ScreenLook, _ t: Double) -> ScreenLook {
        ScreenLook(
            top: .blend(a.top, b.top, t),
            bottom: .blend(a.bottom, b.bottom, t),
            pinstripes: .blend(a.pinstripes, b.pinstripes, t),
            linen: .blend(a.linen, b.linen, t),
            blooms: .blend(a.blooms, b.blooms, t),
            bloomA: .blend(a.bloomA, b.bloomA, t),
            bloomB: .blend(a.bloomB, b.bloomB, t),
            chrome: .blend(a.chrome, b.chrome, t),
            statusBand: .blend(a.statusBand, b.statusBand, t),
            clockX: .blend(a.clockX, b.clockX, t)
        )
    }
}

// MARK: - The iPhone

/// A front-on silhouette. Lengths are millimetres; the view scales them.
struct DeviceLook: Blendable {
    var bodyWidth: Double
    var bodyHeight: Double
    var bodyRadius: Double
    var bezelTop: Double
    var bezelSide: Double
    var bezelBottom: Double
    var screenRadius: Double

    /// The band around the edge: chrome, steel, aluminium, titanium.
    var frame: Ink
    var frameWidth: Double
    /// The glass face around the display.
    var face: Ink

    var homeButton: Double          // 0...1 presence
    var homeDiameter: Double
    var homeGlyph: Double           // the printed rounded square
    var homeRing: Double            // the Touch ID ring
    var homeInk: Ink

    var earpiece: Double            // 0...1 presence, in the top bezel
    var earpieceWidth: Double

    var notch: Double               // 0...1 presence
    var notchWidth: Double
    var notchHeight: Double

    var island: Double              // 0...1 presence
    var islandWidth: Double
    var islandHeight: Double
    var islandTop: Double

    static func blend(_ a: DeviceLook, _ b: DeviceLook, _ t: Double) -> DeviceLook {
        DeviceLook(
            bodyWidth: .blend(a.bodyWidth, b.bodyWidth, t),
            bodyHeight: .blend(a.bodyHeight, b.bodyHeight, t),
            bodyRadius: .blend(a.bodyRadius, b.bodyRadius, t),
            bezelTop: .blend(a.bezelTop, b.bezelTop, t),
            bezelSide: .blend(a.bezelSide, b.bezelSide, t),
            bezelBottom: .blend(a.bezelBottom, b.bezelBottom, t),
            screenRadius: .blend(a.screenRadius, b.screenRadius, t),
            frame: .blend(a.frame, b.frame, t),
            frameWidth: .blend(a.frameWidth, b.frameWidth, t),
            face: .blend(a.face, b.face, t),
            homeButton: .blend(a.homeButton, b.homeButton, t),
            homeDiameter: .blend(a.homeDiameter, b.homeDiameter, t),
            homeGlyph: .blend(a.homeGlyph, b.homeGlyph, t),
            homeRing: .blend(a.homeRing, b.homeRing, t),
            homeInk: .blend(a.homeInk, b.homeInk, t),
            earpiece: .blend(a.earpiece, b.earpiece, t),
            earpieceWidth: .blend(a.earpieceWidth, b.earpieceWidth, t),
            notch: .blend(a.notch, b.notch, t),
            notchWidth: .blend(a.notchWidth, b.notchWidth, t),
            notchHeight: .blend(a.notchHeight, b.notchHeight, t),
            island: .blend(a.island, b.island, t),
            islandWidth: .blend(a.islandWidth, b.islandWidth, t),
            islandHeight: .blend(a.islandHeight, b.islandHeight, t),
            islandTop: .blend(a.islandTop, b.islandTop, t)
        )
    }
}

// MARK: - A year

struct ButtonEra: Identifiable {
    let year: Int
    let system: String
    let device: String
    /// One line on what changed about buttons that year.
    let note: String
    let button: ButtonLook
    let screen: ScreenLook
    let hardware: DeviceLook

    var id: Int { year }
}

extension Array where Element == ButtonEra {
    /// The looks at a continuous position, blended between the two years
    /// either side of it.
    func looks(at position: Double) -> (button: ButtonLook, screen: ScreenLook, hardware: DeviceLook) {
        let clamped = Swift.min(Swift.max(position, 0), Double(count - 1))
        let lower = Int(clamped.rounded(.down))
        let upper = Swift.min(lower + 1, count - 1)
        let t = clamped - Double(lower)
        return (
            .blend(self[lower].button, self[upper].button, t),
            .blend(self[lower].screen, self[upper].screen, t),
            .blend(self[lower].hardware, self[upper].hardware, t)
        )
    }
}
