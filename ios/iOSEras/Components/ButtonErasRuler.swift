//
//  ButtonErasRuler.swift
//  iOSEras
//
//  A ruler you scrub instead of a slider you nudge: a row of hairline ticks
//  that swell into a bell around the indicator, with the years set beneath.
//  The position is continuous so whatever it drives can morph mid-drag; on
//  release it springs to the nearest year.
//

import SwiftUI

struct ButtonErasRuler: View {
    let years: [Int]
    /// Continuous index into `years`: 0 is the first year, `years.count - 1`
    /// the last. Fractional while a finger is down.
    @Binding var position: Double
    var ink: Color = .black

    /// Ticks drawn per year step. Three reads as a ruler without crowding.
    private let ticksPerYear = 3
    private let tickArea: CGFloat = 56
    private let labelArea: CGFloat = 22
    private let inset: CGFloat = 14

    @State private var isDragging = false

    private var lastIndex: Double { Double(max(years.count - 1, 1)) }
    private var nearestIndex: Int {
        min(max(Int(position.rounded()), 0), years.count - 1)
    }

    var body: some View {
        GeometryReader { geo in
            let track = geo.size.width - inset * 2
            VStack(spacing: 0) {
                RulerTicks(position: position,
                           lastIndex: lastIndex,
                           tickCount: (years.count - 1) * ticksPerYear + 1,
                           inset: inset,
                           lifted: isDragging ? 1 : 0,
                           ink: ink)
                    .frame(height: tickArea)
                labels(track: track)
                    .frame(height: labelArea)
            }
            .contentShape(Rectangle())
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        if !isDragging {
                            withAnimation(.easeOut(duration: 0.18)) { isDragging = true }
                        }
                        let raw = Double((value.location.x - inset) / track) * lastIndex
                        position = min(max(raw, 0), lastIndex)
                    }
                    .onEnded { _ in
                        withAnimation(.easeOut(duration: 0.3)) { isDragging = false }
                        withAnimation(.spring(response: 0.34, dampingFraction: 0.82)) {
                            position = Double(nearestIndex)
                        }
                    }
            )
        }
        .frame(height: tickArea + labelArea)
        .sensoryFeedback(.selection, trigger: nearestIndex)
        .accessibilityElement()
        .accessibilityLabel("Year")
        .accessibilityValue(String(years[nearestIndex]))
        .accessibilityAdjustableAction { direction in
            let step = direction == .increment ? 1 : -1
            let next = min(max(nearestIndex + step, 0), years.count - 1)
            withAnimation(.spring(response: 0.34, dampingFraction: 0.82)) {
                position = Double(next)
            }
        }
        .accessibilityIdentifier("buttonEras.ruler")
    }

    /// Every other year is labelled, like the major marks on a ruler, and the
    /// current year is always called out in bold; its immediate neighbours
    /// step aside so the bold label never collides.
    private func labels(track: CGFloat) -> some View {
        ZStack(alignment: .topLeading) {
            ForEach(Array(years.enumerated()), id: \.offset) { index, year in
                let isCurrent = index == nearestIndex
                let onGrid = index.isMultiple(of: 2)
                let shown = isCurrent || (onGrid && abs(index - nearestIndex) > 1)
                Text(String(year))
                    .font(.system(size: 9, weight: isCurrent ? .bold : .regular).monospacedDigit())
                    .foregroundStyle(isCurrent ? ink : ink.opacity(0.38))
                    .fixedSize()
                    .position(x: inset + track * CGFloat(Double(index) / lastIndex), y: 13)
                    .opacity(shown ? 1 : 0)
                    .animation(.easeOut(duration: 0.15), value: shown)
                    .animation(.easeOut(duration: 0.15), value: isCurrent)
            }
        }
    }
}

/// The ticks are one Canvas rather than a view per tick: the bell is
/// recomputed for every tick on every frame of a drag, and fifty-odd views
/// re-laying out at 120 Hz is wasted work next to fifty-odd line fills.
private struct RulerTicks: View, Animatable {
    var position: Double
    let lastIndex: Double
    let tickCount: Int
    let inset: CGFloat
    /// 0 at rest, 1 while a finger is down: the bell grows a little taller.
    var lifted: Double
    let ink: Color

    var animatableData: AnimatablePair<Double, Double> {
        get { AnimatablePair(position, lifted) }
        set { position = newValue.first; lifted = newValue.second }
    }

    var body: some View {
        Canvas { context, size in
            let track = size.width - inset * 2
            let indicatorX = inset + track * CGFloat(position / lastIndex)
            // The bell's width is a share of the track, so it reads the same
            // on any phone.
            let sigma = track * 0.15
            let rest: CGFloat = 5
            let swell: CGFloat = 30 + 8 * CGFloat(lifted)

            for tick in 0..<tickCount {
                let x = inset + track * CGFloat(tick) / CGFloat(max(tickCount - 1, 1))
                let distance = (x - indicatorX) / sigma
                let bell = exp(-0.5 * distance * distance)
                let height = rest + swell * bell
                let line = CGRect(x: x - 0.5, y: size.height - height, width: 1, height: height)
                context.fill(Path(roundedRect: line, cornerRadius: 0.5),
                             with: .color(ink.opacity(0.16 + 0.26 * bell)))
            }

            let indicatorHeight = rest + swell + 8
            let indicator = CGRect(x: indicatorX - 1.25, y: size.height - indicatorHeight,
                                   width: 2.5, height: indicatorHeight)
            context.fill(Path(roundedRect: indicator, cornerRadius: 1.25), with: .color(ink))
        }
    }
}

#Preview {
    @Previewable @State var position = 6.0
    ButtonErasRuler(years: Array(2007...2026), position: $position)
        .padding()
}
