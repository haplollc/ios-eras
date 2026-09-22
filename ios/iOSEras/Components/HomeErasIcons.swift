//
//  HomeErasIcons.swift
//  iOSEras
//
//  The shared kit for drawing home screen icons, and the roster that joins
//  the per-group files (HomeIcons+Dock, +Media, +Paper, +Stores, +Arrivals).
//  Each design is a background pair and a glyph built from basic shapes or an
//  SF Symbol: a vector reading of the real icon, so a 2007 icon can ease into
//  its 2013 self instead of cutting.
//

import SwiftUI

// MARK: - Building blocks

func era(_ year: Int) -> Int { year - 2007 }

func design(_ year: Int, _ top: UInt32, _ bottom: UInt32,
                    _ art: @escaping (CGFloat) -> AnyView) -> IconDesign {
    IconDesign(from: era(year), top: Ink(top), bottom: Ink(bottom), art: art)
}

func flat(_ year: Int, _ colour: UInt32, _ art: @escaping (CGFloat) -> AnyView) -> IconDesign {
    design(year, colour, colour, art)
}

func art<V: View>(@ViewBuilder _ build: @escaping (CGFloat) -> V) -> (CGFloat) -> AnyView {
    { edge in AnyView(build(edge)) }
}

/// An SF Symbol filling `size` of the icon.
func symbol(_ name: String, _ colour: Color = .white, size: Double = 0.5,
                    weight: Font.Weight = .medium, emboss: Bool = false) -> (CGFloat) -> AnyView {
    art { edge in
        Image(systemName: name)
            .font(.system(size: edge * size, weight: weight))
            .foregroundStyle(colour)
            .shadow(color: .black.opacity(emboss ? 0.35 : 0), radius: 0, y: edge * -0.012)
    }
}

func hex(_ value: UInt32, _ alpha: Double = 1) -> Color { Ink(value, alpha).color }

let nothing: (CGFloat) -> AnyView = { _ in AnyView(EmptyView()) }

// MARK: - The roster

extension HomeApp {
    static let roster: [HomeApp] = dock + media + paper + stores + arrivals + extra

    /// The page's default folder. Its tile is drawn from its contents.
    static let folderID = "Utilities"
}

// MARK: - Small composites

/// Four overlapping coloured circles.
struct GameBubbles: View {
    let edge: CGFloat
    let alpha: Double

    var body: some View {
        ZStack {
            Circle().fill(hex(0xFF2D55, alpha)).frame(width: edge * 0.36, height: edge * 0.36).offset(x: -edge * 0.12, y: -edge * 0.12)
            Circle().fill(hex(0xAF52DE, alpha)).frame(width: edge * 0.36, height: edge * 0.36).offset(x: edge * 0.12, y: -edge * 0.12)
            Circle().fill(hex(0x5AC8FA, alpha)).frame(width: edge * 0.36, height: edge * 0.36).offset(x: -edge * 0.12, y: edge * 0.12)
            Circle().fill(hex(0xFFCC00, alpha)).frame(width: edge * 0.36, height: edge * 0.36).offset(x: edge * 0.12, y: edge * 0.12)
        }
    }
}

/// Three cards fanned in a wallet.
struct WalletCards: View {
    let edge: CGFloat
    var sleeve: Color = hex(0x2C2C2E)

    var body: some View {
        ZStack {
            ForEach(Array([hex(0xFF3B30), hex(0x4CD964), hex(0x007AFF), hex(0xFFCC00)].enumerated()), id: \.offset) { index, colour in
                RoundedRectangle(cornerRadius: edge * 0.04, style: .continuous)
                    .fill(colour)
                    .frame(width: edge * 0.62, height: edge * 0.40)
                    .offset(y: edge * (-0.16 + 0.09 * Double(index)))
            }
            RoundedRectangle(cornerRadius: edge * 0.05, style: .continuous)
                .fill(sleeve)
                .frame(width: edge * 0.68, height: edge * 0.30)
                .offset(y: edge * 0.22)
        }
    }
}

/// One skeuomorphic calculator key.
struct CalcKey: View {
    let colour: Color
    let sign: String
    let edge: CGFloat

    var body: some View {
        RoundedRectangle(cornerRadius: edge * 0.06, style: .continuous)
            .fill(LinearGradient(colors: [colour.opacity(0.85), colour], startPoint: .top, endPoint: .bottom))
            .frame(width: edge * 0.36, height: edge * 0.30)
            .overlay(CalcSign(sign, edge: edge, ink: .white))
    }
}

struct CalcSign: View {
    let sign: String
    let edge: CGFloat
    let ink: Color

    init(_ sign: String, edge: CGFloat, ink: Color) { self.sign = sign; self.edge = edge; self.ink = ink }

    var body: some View {
        Text(sign).font(.system(size: edge * 0.2, weight: .medium)).foregroundStyle(ink)
    }
}
