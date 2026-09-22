//
//  HomeErasView.swift
//  iOSEras
//
//  The life of the home screen: scrub the ruler from 2007 to today and
//  watch the icons redraw themselves, apps arrive and leave, the grid grow
//  a row at a time, and the phone around it all change shape.
//

import SwiftUI

struct HomeErasView: View {
    private let eras = HomeEra.timeline
    private let apps: [HomeApp] = {
        let spans = Dictionary(uniqueKeysWithValues: HomeApp.roster.map { ($0.id, $0.span) })
        return HomeApp.roster.map { $0.withDropInImages().placed(in: HomeEra.timeline, spans: spans) }
    }()
    @State private var position: Double

    /// Points per millimetre of iPhone: the tallest one just fills the page,
    /// or the 9:16 band when recording frameless.
    private var scale: Double { Self.demoRequested ? 3.75 : 4.3 }

    init() {
        let last = HomeEra.timeline.count - 1
        // UIC_HOME_YEAR opens on a given year, for captures.
        let asked = ProcessInfo.processInfo.environment["UIC_HOME_YEAR"].flatMap(Int.init)
        let start = asked.flatMap { year in HomeEra.timeline.firstIndex { $0.year == year } }
        // UIC_HOME_POS opens part-way between years (e.g. 14.5), for
        // checking the morph.
        let between = ProcessInfo.processInfo.environment["UIC_HOME_POS"].flatMap(Double.init)
        _position = State(initialValue: between ?? Double(start ?? (Self.demoRequested ? 0 : last)))
    }

    private var era: HomeEra {
        eras[min(max(Int(position.rounded()), 0), eras.count - 1)]
    }

    /// UIC_ICON_PREVIEW=<app> shows one app at every year instead, for
    /// checking each design against the real icon.
    private static let previewApp = ProcessInfo.processInfo.environment["UIC_ICON_PREVIEW"]

    var body: some View {
        if let name = Self.previewApp, let app = apps.first(where: { $0.id == name }) {
            HomeIconGallery(app: app, eras: eras)
        } else {
            page
        }
    }

    private var page: some View {
        VStack(spacing: 0) {
            Spacer(minLength: 0)

            HomeErasStage(eras: eras, apps: apps, position: position, scale: scale)
                // The tallest iPhone sets the row, so the caption and ruler
                // hold still while the phone above them grows and shrinks.
                .frame(height: (eras.map(\.hardware.bodyHeight).max() ?? 150) * scale)

            caption
                .padding(.top, 22)

            Spacer(minLength: 0)

            ButtonErasRuler(years: eras.map(\.year), position: $position)
                .padding(.horizontal, 8)
                .padding(.bottom, 18)
        }
        .frame(maxWidth: .infinity, maxHeight: Self.demoRequested ? ButtonErasView.bandHeight : .infinity)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color.white.ignoresSafeArea())
        .ignoresSafeArea(Self.demoRequested ? .all : [])
        .preferredColorScheme(.light)
        .toolbar(Self.demoRequested ? .hidden : .automatic, for: .navigationBar)
        .task { await runDemo() }
    }

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
        .accessibilityIdentifier("homeEras.caption")
    }

    // MARK: - Scripted walk

    /// UIC_HOME_DEMO=1 scrubs the ruler the way a thumb would, so a recording
    /// shows every year with nobody touching the screen.
    private static let demoRequested =
        ProcessInfo.processInfo.environment["UIC_HOME_DEMO"] == "1"

    /// UIC_DEMO_PACE=3 runs the walk three times slower, for recording a
    /// heavy scene at a full frame rate and speeding it back up in post.
    private static let pace = ProcessInfo.processInfo.environment["UIC_DEMO_PACE"].flatMap(Double.init) ?? 1

    private func hold(_ seconds: Double) async -> Bool {
        try? await Task.sleep(for: .seconds(seconds * Self.pace))
        return !Task.isCancelled
    }

    /// Glides to a year at a thumb's pace, easing in and out. Stepped by the
    /// clock rather than handed to withAnimation, so the caption, the ruler
    /// and the haptics follow the drawing instead of jumping ahead.
    private func glide(to index: Int, over seconds: Double) async -> Bool {
        let from = position
        let to = Double(index)
        let clock = ContinuousClock()
        let start = clock.now
        while true {
            let elapsed = (clock.now - start) / .seconds(1)
            let x = min(elapsed / (seconds * Self.pace), 1)
            let eased = x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2
            position = from + (to - from) * eased
            if x >= 1 { return !Task.isCancelled }
            try? await Task.sleep(for: .seconds(1.0 / 120))
            guard !Task.isCancelled else { return false }
        }
    }

    private func runDemo() async {
        guard Self.demoRequested else { return }
        let last = eras.count - 1
        guard await hold(1.4) else { return }

        // A beat on each of the early years: apps arriving one release at a
        // time is the story here.
        for index in 1...min(6, last) {
            guard await glide(to: index, over: 0.5), await hold(0.85) else { return }
        }
        // One long pull to today, the whole redesign in one go...
        guard await glide(to: last, over: 7.0), await hold(1.4) else { return }
        // ...a quick rewind to the start...
        guard await glide(to: 0, over: 2.4), await hold(0.8) else { return }
        // ...and a steady glide back to settle on today.
        guard await glide(to: last, over: 4.6), await hold(1.3) else { return }
    }
}

#Preview {
    HomeErasView()
}
