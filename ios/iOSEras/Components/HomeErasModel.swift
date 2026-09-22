//
//  HomeErasModel.swift
//  iOSEras
//
//  The home screen as numbers. Each iOS version is a row describing how the
//  system wrapped an icon (its corner, its gloss, its label, its dock) and
//  which apps sat where. Each app carries its own list of redesigns. Blend
//  two neighbouring rows and the whole screen morphs: icons slide to their
//  new slots, arrivals scale in, departures scale away.
//

import SwiftUI

// MARK: - Measured layout

/// Where things sit on one version's home screen, measured off a real
/// screenshot of that version. Every length is a fraction of the screen's
/// width; "fromBottom" values are measured up from the screen's bottom edge.
struct HomeMetrics: Blendable {
    var iconSize: Double
    var colCentre0: Double
    var colPitch: Double
    /// Top edge of the first row of icons, from the top of the screen.
    var row0Top: Double
    var rowPitch: Double
    /// From an icon's bottom edge to the middle of its label.
    var labelBelow: Double

    var indicatorFromBottom: Double
    var dotSize: Double
    var dotPitch: Double
    var pillWidth: Double
    var pillHeight: Double
    var pillText: Double

    var dockTopFromBottom: Double
    var dockBottomGap: Double
    var dockSideInset: Double
    var dockIconFromBottom: Double
    var dockIconSize: Double
    var dockColCentre0: Double
    var dockColPitch: Double
    /// 1 when the dock icons carry labels (to iOS 10), 0 after.
    var dockLabels: Double
    /// Where the dock labels sit, from the bottom; 0 means just under the
    /// icon like the grid's. The metal tray kept them in a strip at the foot.
    var dockLabelFromBottom: Double = 0
    /// The dock's corner radius; 0 means square (edge-to-edge docks).
    var dockCorner: Double = 0
    /// How many page dots, and which one is the current page.
    var dotCount: Double = 3
    var activeDot: Double = 0

    func with(_ change: (inout HomeMetrics) -> Void) -> HomeMetrics {
        var copy = self; change(&copy); return copy
    }

    static func blend(_ a: HomeMetrics, _ b: HomeMetrics, _ t: Double) -> HomeMetrics {
        HomeMetrics(
            iconSize: .blend(a.iconSize, b.iconSize, t),
            colCentre0: .blend(a.colCentre0, b.colCentre0, t),
            colPitch: .blend(a.colPitch, b.colPitch, t),
            row0Top: .blend(a.row0Top, b.row0Top, t),
            rowPitch: .blend(a.rowPitch, b.rowPitch, t),
            labelBelow: .blend(a.labelBelow, b.labelBelow, t),
            indicatorFromBottom: .blend(a.indicatorFromBottom, b.indicatorFromBottom, t),
            dotSize: .blend(a.dotSize, b.dotSize, t),
            dotPitch: .blend(a.dotPitch, b.dotPitch, t),
            pillWidth: .blend(a.pillWidth, b.pillWidth, t),
            pillHeight: .blend(a.pillHeight, b.pillHeight, t),
            pillText: .blend(a.pillText, b.pillText, t),
            dockTopFromBottom: .blend(a.dockTopFromBottom, b.dockTopFromBottom, t),
            dockBottomGap: .blend(a.dockBottomGap, b.dockBottomGap, t),
            dockSideInset: .blend(a.dockSideInset, b.dockSideInset, t),
            dockIconFromBottom: .blend(a.dockIconFromBottom, b.dockIconFromBottom, t),
            dockIconSize: .blend(a.dockIconSize, b.dockIconSize, t),
            dockColCentre0: .blend(a.dockColCentre0, b.dockColCentre0, t),
            dockColPitch: .blend(a.dockColPitch, b.dockColPitch, t),
            dockLabels: .blend(a.dockLabels, b.dockLabels, t),
            dockLabelFromBottom: .blend(a.dockLabelFromBottom, b.dockLabelFromBottom, t),
            dockCorner: .blend(a.dockCorner, b.dockCorner, t),
            dotCount: t < 0.5 ? a.dotCount : b.dotCount,
            activeDot: t < 0.5 ? a.activeDot : b.activeDot
        )
    }
}

// MARK: - How a version dressed every icon

struct HomeChrome: Blendable {
    var columns: Double
    var rows: Double
    /// Icon edge as a share of the screen's width.
    var iconScale: Double
    /// Corner radius as a share of the icon's edge: ~0.175 for the rounded
    /// rectangles of 2007, 0.2237 for the iOS 7 superellipse.
    var cornerRatio: Double
    /// 0 for a circular-arc corner, 1 for the continuous superellipse.
    var squircle: Double
    /// The curved white shine iOS laid over the top of every icon.
    var gloss: Double
    var iconShadow: Ink
    var iconShadowRadius: Double
    var iconShadowY: Double
    /// Liquid Glass: a bright rim and inner light on every icon.
    var glassRim: Double

    var label: Ink
    var labelShadow: Ink
    var labelSize: Double

    /// The metal mesh tray of 2007-2009, 0...1.
    var dockShelf: Double
    /// The glass shelf in perspective of iOS 4-6, 0...1.
    var dockGlassShelf: Double
    /// The frosted panel from iOS 7 on, 0...1.
    var dockPanel: Double
    /// How far the dock floats in from the edges, as a share of width: 0 is
    /// edge to edge.
    var dockInset: Double
    var dockRadius: Double
    var dockTint: Ink
    var reflection: Double

    var pageDots: Ink
    /// The little magnifier left of the dots (iPhone OS 3 to iOS 6), 0...1.
    var spotlightGlyph: Double
    /// iOS 16 replaced the dots with a frosted "Search" pill, 0...1.
    var searchPill: Double

    /// Where everything goes, measured off that version's screenshot.
    var metrics: HomeMetrics

    // Flips at the halfway point.
    var typeface: EraTypeface
    var labelWeight: Font.Weight

    static func blend(_ a: HomeChrome, _ b: HomeChrome, _ t: Double) -> HomeChrome {
        let near = t < 0.5 ? a : b
        return HomeChrome(
            columns: .blend(a.columns, b.columns, t),
            rows: .blend(a.rows, b.rows, t),
            iconScale: .blend(a.iconScale, b.iconScale, t),
            cornerRatio: .blend(a.cornerRatio, b.cornerRatio, t),
            squircle: .blend(a.squircle, b.squircle, t),
            gloss: .blend(a.gloss, b.gloss, t),
            iconShadow: .blend(a.iconShadow, b.iconShadow, t),
            iconShadowRadius: .blend(a.iconShadowRadius, b.iconShadowRadius, t),
            iconShadowY: .blend(a.iconShadowY, b.iconShadowY, t),
            glassRim: .blend(a.glassRim, b.glassRim, t),
            label: .blend(a.label, b.label, t),
            labelShadow: .blend(a.labelShadow, b.labelShadow, t),
            labelSize: .blend(a.labelSize, b.labelSize, t),
            dockShelf: .blend(a.dockShelf, b.dockShelf, t),
            dockGlassShelf: .blend(a.dockGlassShelf, b.dockGlassShelf, t),
            dockPanel: .blend(a.dockPanel, b.dockPanel, t),
            dockInset: .blend(a.dockInset, b.dockInset, t),
            dockRadius: .blend(a.dockRadius, b.dockRadius, t),
            dockTint: .blend(a.dockTint, b.dockTint, t),
            reflection: .blend(a.reflection, b.reflection, t),
            pageDots: .blend(a.pageDots, b.pageDots, t),
            spotlightGlyph: .blend(a.spotlightGlyph, b.spotlightGlyph, t),
            searchPill: .blend(a.searchPill, b.searchPill, t),
            metrics: .blend(a.metrics, b.metrics, t),
            typeface: near.typeface,
            labelWeight: near.labelWeight
        )
    }
}

// MARK: - Where an app sat

/// A place on the home screen: a grid cell, or a position in the dock.
enum HomeSlot: Equatable {
    case grid(Int)
    case dock(Int)
}

// MARK: - An app and its redesigns

/// One redesign of one app's icon. `art` draws the glyph inside a unit
/// square; the background is numbers so it can blend into the next redesign.
struct IconDesign {
    /// The first timeline index this design appears at.
    let from: Int
    var top: Ink
    var bottom: Ink
    /// A bundled image (from HomeIconImages/) drawn instead of the vector
    /// art: the whole tile, as it appeared on the phone that year.
    var imageName: String? = nil
    /// Draws the artwork in a square of the given edge. Receives the blend
    /// toward the NEXT design (0 until the morph begins) so art that shares
    /// a subject across redesigns can move rather than fade.
    let art: (_ edge: CGFloat) -> AnyView
}

struct HomeApp: Identifiable {
    let id: String
    /// The name under the icon per timeline index, for renames such as
    /// Text -> Messages and iPod -> Music. Keyed by the first index it holds.
    let names: [(from: Int, name: String)]
    /// The slot per timeline index; nil where the app is not on the first
    /// page (not yet shipped, or removed). Filled in from the eras' pages.
    var slots: [HomeSlot?] = []
    var designs: [IconDesign]
    /// Cells covered each way: 1 for an icon, 2 for a small widget.
    let span: Int

    init(_ id: String, names: [(from: Int, name: String)]? = nil, span: Int = 1, designs: [IconDesign]) {
        self.id = id
        self.names = names ?? [(0, id)]
        self.span = span
        self.designs = designs
    }

    /// Reads where this app sits on each era's first page. A grid slot is
    /// the index of the cell (top-left cell for a widget) once the page's
    /// items have been laid in reading order around anything wider.
    func placed(in eras: [HomeEra], spans: [String: Int]) -> HomeApp {
        var copy = self
        copy.slots = eras.map { era in
            if let index = era.dock.firstIndex(of: id) { return .dock(index) }
            let cells = HomeApp.cells(for: era, spans: spans)
            return cells[id].map { .grid($0) }
        }
        return copy
    }

    /// Lays an era's page items into a four-column grid, reading order,
    /// each taking the first block of free cells that fits it.
    static func cells(for era: HomeEra, spans: [String: Int]) -> [String: Int] {
        let columns = 4
        var taken = Set<Int>()
        var result: [String: Int] = [:]
        for item in era.page {
            let span = spans[item] ?? 1
            var cell = 0
            while true {
                let column = cell % columns
                let fits = column + span <= columns && (0..<span).allSatisfy { dy in
                    (0..<span).allSatisfy { dx in !taken.contains(cell + dy * columns + dx) }
                }
                if fits { break }
                cell += 1
            }
            for dy in 0..<span { for dx in 0..<span { taken.insert(cell + dy * columns + dx) } }
            result[item] = cell
        }
        return result
    }

    /// Swaps in any image dropped into HomeIconImages/ named
    /// "<App>_<year>.png" (spaces as underscores), from that year until the
    /// next image or redesign.
    func withDropInImages(years: ClosedRange<Int> = 2007...2026) -> HomeApp {
        var copy = self
        let stem = id.replacingOccurrences(of: " ", with: "_")
        for year in years {
            let name = "\(stem)_\(year)"
            guard UIImage(named: name) != nil else { continue }
            let index = year - years.lowerBound
            if let existing = copy.designs.firstIndex(where: { $0.from == index }) {
                var design = copy.designs[existing]
                design.imageName = name
                copy.designs[existing] = design
            } else {
                let base = copy.designs.last(where: { $0.from <= index }) ?? copy.designs[0]
                var design = IconDesign(from: index, top: base.top, bottom: base.bottom, art: base.art)
                design.imageName = name
                copy.designs.append(design)
                copy.designs.sort { $0.from < $1.from }
            }
        }
        return copy
    }

    func name(at index: Int) -> String {
        names.last(where: { $0.from <= index })?.name ?? names.first?.name ?? id
    }

    func designIndex(at index: Int) -> Int {
        designs.lastIndex(where: { $0.from <= index }) ?? 0
    }
}

// MARK: - A version

struct HomeEra: Identifiable {
    let year: Int
    let system: String
    let device: String
    let note: String
    var chrome: HomeChrome
    let screen: ScreenLook
    let hardware: DeviceLook
    /// App ids on the first page, reading order.
    let page: [String]
    /// App ids in the dock, left to right.
    let dock: [String]
    /// What the Utilities (or Extras) folder on the page holds, in order.
    var folder: [String] = []

    var id: Int { year }
}
