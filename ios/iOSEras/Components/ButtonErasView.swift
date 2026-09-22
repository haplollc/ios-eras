//
//  ButtonErasView.swift
//  iOSEras
//
//  The life of an iOS button: scrub the ruler from 2007 to today and one
//  button, on that year's iPhone, is redrawn the way iOS drew it then.
//

import SwiftUI

struct ButtonErasView: View {
    private let eras = ButtonEra.timeline
    @State private var position: Double

    /// Points per millimetre of iPhone: the tallest one just fills the page.
    private let scale = 4.3

    init() {
        let last = ButtonEra.timeline.count - 1
        // UIC_ERAS_YEAR opens on a given year, for captures.
        let asked = ProcessInfo.processInfo.environment["UIC_ERAS_YEAR"].flatMap(Int.init)
        let start = asked.flatMap { year in ButtonEra.timeline.firstIndex { $0.year == year } }
        _position = State(initialValue: Double(start ?? (Self.demoRequested ? 0 : last)))
    }

    private var era: ButtonEra {
        eras[min(max(Int(position.rounded()), 0), eras.count - 1)]
    }

    /// UIC_ERAS_BARE=1 drops the iPhone and shows the button alone, large,
    /// on a swatch of that year's screen.
    @State private var bare = ProcessInfo.processInfo.environment["UIC_ERAS_BARE"] == "1"

    var body: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 0)

            if bare {
                ButtonErasSwatch(eras: eras, position: position)
                    .frame(height: 420)
            } else {
                ButtonErasStage(eras: eras, position: position, scale: scale)
                    // The tallest iPhone sets the row, so the caption and ruler
                    // hold still while the phone above them grows and shrinks.
                    .frame(height: (eras.map(\.hardware.bodyHeight).max() ?? 150) * scale)
            }

            caption
                .padding(.top, 22)

            Spacer(minLength: 0)

            ButtonErasRuler(years: eras.map(\.year), position: $position)
                .padding(.horizontal, 8)
                .padding(.bottom, 18)
        }
        // For a frameless recording the page lives in a 9:16 band of the
        // screen so the video can be cut straight from the capture.
        .frame(maxWidth: .infinity, maxHeight: Self.demoRequested ? Self.bandHeight : .infinity)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.white.ignoresSafeArea())
        .ignoresSafeArea(Self.demoRequested ? .all : [])
        .preferredColorScheme(.light)
        .toolbar(Self.demoRequested ? .hidden : .automatic, for: .navigationBar)
        .toolbar {
            if !Self.demoRequested {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(bare ? "Show iPhone" : "Button only") {
                        withAnimation(.snappy(duration: 0.35)) { bare.toggle() }
                    }
                }
            }
        }
        .task { await runDemo() }
    }

    /// 9:16 of the screen's width: what a frameless portrait video keeps.
    static var bandHeight: CGFloat { UIScreen.main.bounds.width * 16 / 9 }

    private var caption: some View {
        VStack(spacing: 5) {
            HStack(spacing: 6) {
                Text(era.system)
                    .fontWeight(.semibold)
                Text("·").foregroundStyle(.tertiary)
                Text(era.device)
                    .foregroundStyle(.secondary)
            }
            .font(.system(size: 18))
            .contentTransition(.opacity)

            Text(era.note)
                .font(.system(size: 14.5))
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .lineLimit(2, reservesSpace: true)
                .contentTransition(.opacity)
                .padding(.horizontal, 28)
        }
        .foregroundStyle(.black)
        .animation(.snappy(duration: 0.3), value: era.year)
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("buttonEras.caption")
    }

    // MARK: - Scripted walk

    /// UIC_ERAS_DEMO=1 scrubs the ruler the way a thumb would, so a recording
    /// shows every year with nobody touching the screen.
    private static let demoRequested =
        ProcessInfo.processInfo.environment["UIC_ERAS_DEMO"] == "1"

    private func hold(_ seconds: Double) async -> Bool {
        try? await Task.sleep(for: .seconds(seconds))
        return !Task.isCancelled
    }

    /// Glides to a year at a thumb's pace, easing in and out. The position
    /// is stepped by hand rather than handed to withAnimation, so the caption,
    /// the ruler's bold year and the haptics all follow the drawing instead
    /// of jumping to the destination the moment the glide starts.
    private func glide(to index: Int, over seconds: Double) async -> Bool {
        let from = position
        let to = Double(index)
        let clock = ContinuousClock()
        let start = clock.now
        // Sleeping is imprecise, so each frame reads the clock and places the
        // position where it belongs at that instant; the glide lands on time
        // however long the sleeps actually took.
        while true {
            let elapsed = (clock.now - start) / .seconds(1)
            let x = min(elapsed / seconds, 1)
            let eased = x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2
            position = from + (to - from) * eased
            if x >= 1 { return !Task.isCancelled }
            guard await hold(1.0 / 120) else { return false }
        }
    }

    private func runDemo() async {
        guard Self.demoRequested else { return }
        let last = eras.count - 1
        guard await hold(1.3) else { return }

        // Year by year through the gel era, with a beat on each.
        for index in 1...min(5, last) {
            guard await glide(to: index, over: 0.42), await hold(0.66) else { return }
        }
        // Then one long pull to today, the whole morph in one go...
        guard await glide(to: last, over: 6.4), await hold(1.3) else { return }
        // ...a quick rewind to the start...
        guard await glide(to: 0, over: 2.2), await hold(0.7) else { return }
        // ...and a steady glide back to settle on today.
        guard await glide(to: last, over: 4.2), await hold(1.2) else { return }
    }
}

#Preview {
    ButtonErasView()
}
