//
//  HomeErasStage.swift
//  iOSEras
//
//  Draws the home screen at one moment on the timeline. Every icon is placed
//  by blending where it sat in the version before with where it sits in the
//  version after, so a new row of apps pushes the old ones along instead of
//  the grid cutting from one layout to the next.
//

import SwiftUI

struct HomeErasStage: View, Animatable {
    let eras: [HomeEra]
    let apps: [HomeApp]
    var position: Double
    var scale: Double = 4

    var animatableData: Double {
        get { position }
        set { position = newValue }
    }

    var body: some View {
        let clamped = min(max(position, 0), Double(eras.count - 1))
        let lower = Int(clamped.rounded(.down))
        let upper = min(lower + 1, eras.count - 1)
        let t = clamped - Double(lower)
        let hardware = DeviceLook.blend(eras[lower].hardware, eras[upper].hardware, t)
        let screen = ScreenLook.blend(eras[lower].screen, eras[upper].screen, t)
        let chrome = HomeChrome.blend(eras[lower].chrome, eras[upper].chrome, t)

        EraDevice(look: hardware, scale: scale) {
            ZStack {
                EraBackdrop(look: screen)
                GeometryReader { geo in
                    let layoutA = HomeLayout(chrome: eras[lower].chrome, hardware: eras[lower].hardware, size: geo.size, scale: scale)
                    let layoutB = HomeLayout(chrome: eras[upper].chrome, hardware: eras[upper].hardware, size: geo.size, scale: scale)
                    let edge = geo.size.width * chrome.metrics.iconSize
                    let dockEdge = geo.size.width * chrome.metrics.dockIconSize

                    HomeDock(chrome: chrome, layout: .blend(layoutA.dockFrame, layoutB.dockFrame, t),
                             cornerRadius: .blend(layoutA.dockCornerRadius, layoutB.dockCornerRadius, t))

                    ForEach(apps) { app in
                        let slotA = app.slots[lower]
                        let slotB = app.slots[upper]
                        if slotA != nil || slotB != nil {
                            let pointA = (slotA ?? slotB).map { layoutA.centre(of: $0, span: app.span) } ?? .zero
                            let pointB = (slotB ?? slotA).map { layoutB.centre(of: $0, span: app.span) } ?? .zero
                            // An arrival grows out of its new slot; a
                            // departure shrinks into its old one.
                            let presence = slotA == nil ? t : (slotB == nil ? 1 - t : 1)
                            let anchor = slotA == nil ? pointB : (slotB == nil ? pointA : CGPoint.blend(pointA, pointB, t))
                            // Judged at the nearer year, so a dock icon does not
                            // grow a label the year before it moves to the grid.
                            let current = t < 0.5 ? (slotA ?? slotB) : (slotB ?? slotA)
                            let docked = { if case .dock = current { return true } else { return false } }()

                            let near = t < 0.5 ? lower : upper
                            let contents = app.id == HomeApp.folderID
                                ? eras[near].folder.compactMap { id in apps.first { $0.id == id } }
                                : nil
                            HomeIcon(app: app, lower: lower, upper: upper, t: t,
                                     chrome: chrome, edge: app.span > 1 ? layoutB.widgetEdge : (docked ? dockEdge : edge),
                                     width: geo.size.width, docked: docked,
                                     contents: contents, yearIndex: near)
                                .scaleEffect(0.35 + 0.65 * presence)
                                .opacity(presence)
                                .position(anchor)
                        }
                    }

                    HomePageIndicator(chrome: chrome, width: geo.size.width)
                        .position(x: geo.size.width / 2,
                                  y: Double.blend(layoutA.dotsY, layoutB.dotsY, t))
                }
                EraStatusBar(look: screen, hardware: hardware, scale: scale)
            }
        }
    }
}

// MARK: - Layout

/// Where things go for ONE version. Two of these get blended.
struct HomeLayout {
    let chrome: HomeChrome
    let hardware: DeviceLook
    let size: CGSize
    let scale: Double

    private var m: HomeMetrics { chrome.metrics }
    private var W: Double { size.width }
    private var H: Double { size.height }

    var iconEdge: Double { W * m.iconSize }
    var dockIconEdge: Double { W * m.dockIconSize }

    var dockFrame: CGRect {
        let inset = W * m.dockSideInset
        let top = H - W * m.dockTopFromBottom
        let bottom = H - W * m.dockBottomGap
        return CGRect(x: inset, y: top, width: W - inset * 2, height: max(0, bottom - top))
    }

    /// Concentric with the screen's corner: the screen's radius less the
    /// gap. Square when the dock runs edge to edge.
    var dockCornerRadius: Double { W * m.dockCorner }

    /// The centre of the page dots, or of the Search pill.
    var dotsY: Double { H - W * m.indicatorFromBottom }

    /// A small widget is two icons plus the gutter between them, square.
    var widgetEdge: Double { iconEdge + W * m.colPitch }

    /// The centre of an icon tile (its label hangs below, outside this).
    func centre(of slot: HomeSlot, span: Int = 1) -> CGPoint {
        switch slot {
        case .dock(let index):
            return CGPoint(x: W * (m.dockColCentre0 + m.dockColPitch * Double(index)),
                           y: H - W * m.dockIconFromBottom)
        case .grid(let index):
            let columns = 4
            let column = Double(index % columns)
            let row = Double(index / columns)
            let x = W * (m.colCentre0 + m.colPitch * (column + Double(span - 1) / 2))
            let y = W * (m.row0Top + m.rowPitch * (row + Double(span - 1) / 2)) + iconEdge / 2
            return CGPoint(x: x, y: y)
        }
    }
}

extension CGPoint {
    static func blend(_ a: CGPoint, _ b: CGPoint, _ t: Double) -> CGPoint {
        CGPoint(x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t)
    }
}

extension CGRect {
    static func blend(_ a: CGRect, _ b: CGRect, _ t: Double) -> CGRect {
        CGRect(x: a.minX + (b.minX - a.minX) * t, y: a.minY + (b.minY - a.minY) * t,
               width: a.width + (b.width - a.width) * t, height: a.height + (b.height - a.height) * t)
    }
}

// MARK: - One icon

struct HomeIcon: View {
    let app: HomeApp
    let lower: Int
    let upper: Int
    let t: Double
    let chrome: HomeChrome
    let edge: Double
    let width: Double
    let docked: Bool
    /// Set for the folder: the apps inside it, drawn as mini icons.
    var contents: [HomeApp]? = nil
    var yearIndex: Int = 0

    var body: some View {
        let labelSize = chrome.labelSize * width
        // Grid labels hang just under the icon; the metal tray's sat in a
        // strip at the foot of the dock.
        let m = chrome.metrics
        let labelOffset = docked && m.dockLabelFromBottom > 0.001
            ? width * (m.dockIconFromBottom - m.dockLabelFromBottom)
            : edge / 2 + width * m.labelBelow
        let indexA = app.designIndex(at: lower)
        let indexB = app.designIndex(at: upper)
        let designA = app.designs[indexA]
        let designB = app.designs[indexB]
        let mix = indexA == indexB ? 0 : t
        // A small widget keeps its own, shallower corner (22 pt on 155 pt).
        let shape = HomeIconShape(cornerRatio: app.span > 1 ? 0.145 : chrome.cornerRatio,
                                  squircle: app.span > 1 ? 1 : chrome.squircle)
        let name = app.name(at: t < 0.5 ? lower : upper)

        let isWidget = app.span > 1
        ZStack {
            ZStack {
                shape.fill(LinearGradient(colors: [Ink.blend(designA.top, designB.top, mix).color,
                                                   Ink.blend(designA.bottom, designB.bottom, mix).color],
                                          startPoint: .top, endPoint: .bottom))

                if let contents {
                    HomeFolderTile(contents: contents, yearIndex: yearIndex, chrome: chrome, edge: edge)
                } else {
                    // The old artwork sinks back as the new one comes forward.
                    HomeDesignArt(design: designA, edge: edge)
                        .scaleEffect(designA.imageName == nil ? 1 - 0.12 * mix : 1)
                        .opacity(1 - mix)
                    if mix > 0 {
                        HomeDesignArt(design: designB, edge: edge)
                            .scaleEffect(designB.imageName == nil ? 0.88 + 0.12 * mix : 1)
                            .opacity(mix)
                    }
                }

                let imaged = (mix < 0.5 ? designA : designB).imageName != nil
                if chrome.gloss > 0.01 && !isWidget && !imaged && contents == nil {
                    HomeGloss().fill(LinearGradient(colors: [.white.opacity(0.62), .white.opacity(0.16)],
                                                    startPoint: .top, endPoint: .bottom))
                        .opacity(chrome.gloss)
                }

                if chrome.glassRim > 0.01 {
                    shape.strokeBorder(LinearGradient(colors: [.white.opacity(0.85), .white.opacity(0.08), .white.opacity(0.45)],
                                                      startPoint: .topLeading, endPoint: .bottomTrailing),
                                       lineWidth: max(0.8, edge * 0.022))
                        .opacity(chrome.glassRim)
                }
            }
            .frame(width: edge, height: edge)
            .clipShape(shape)
            // Two dozen multi-shape icons redrawn on every frame of a scrub
            // are the bottleneck; each one is flattened into a single GPU
            // layer. The folder is left alone: its frost is a live material.
            .flattened(contents == nil)
            .shadow(color: chrome.iconShadow.color, radius: chrome.iconShadowRadius, y: chrome.iconShadowY)

            // The label hangs below the tile at the measured distance and
            // takes no layout space, so the tile's centre is the icon's.
            Text(name)
                .font(chrome.typeface.font(size: labelSize, weight: chrome.labelWeight))
                .foregroundStyle(chrome.label.color)
                // A soft shadow keeps white labels legible on pale wallpapers.
                .shadow(color: chrome.labelShadow.color, radius: 1.3, y: 0.8)
                .lineLimit(1)
                .fixedSize()
                .offset(y: labelOffset)
                // The dock kept its labels until iOS 11.
                .opacity(docked ? chrome.metrics.dockLabels : 1)
        }
        .frame(width: edge, height: edge)
        .accessibilityElement()
        .accessibilityLabel(name)
    }
}

private extension View {
    @ViewBuilder func flattened(_ on: Bool) -> some View {
        if on { drawingGroup() } else { self }
    }
}

/// A design's artwork: the dropped-in image if there is one, else the
/// vector glyph.
private struct HomeDesignArt: View {
    let design: IconDesign
    let edge: Double

    var body: some View {
        if let name = design.imageName, let image = UIImage(named: name) {
            Image(uiImage: image)
                .resizable()
                .interpolation(.high)
                .aspectRatio(contentMode: .fill)
                .frame(width: edge, height: edge)
        } else {
            design.art(edge)
        }
    }
}

/// Apple's default folder: a translucent tile holding up to nine tiny icons.
/// Dark linen-glass in the glossy years, frosted from iOS 7.
private struct HomeFolderTile: View {
    let contents: [HomeApp]
    let yearIndex: Int
    let chrome: HomeChrome
    let edge: Double

    var body: some View {
        let skeuo = chrome.gloss > 0.5
        let mini = edge * (skeuo ? 0.21 : 0.2)
        let gap = edge * (skeuo ? 0.07 : 0.055)
        ZStack {
            if skeuo {
                Rectangle().fill(Color(white: 0.24))
                Rectangle().strokeBorder(LinearGradient(colors: [.white.opacity(0.75), .white.opacity(0.35)],
                                                        startPoint: .top, endPoint: .bottom),
                                         lineWidth: max(0.8, edge * 0.07))
            } else {
                Rectangle().fill(.ultraThinMaterial)
                Rectangle().fill(.white.opacity(0.22))
            }
            VStack(spacing: gap) {
                ForEach(0..<3, id: \.self) { row in
                    HStack(spacing: gap) {
                        ForEach(0..<3, id: \.self) { column in
                            let index = row * 3 + column
                            if index < contents.count {
                                miniIcon(contents[index], size: mini)
                            } else {
                                Color.clear.frame(width: mini, height: mini)
                            }
                        }
                    }
                }
            }
        }
        .frame(width: edge, height: edge)
    }

    private func miniIcon(_ app: HomeApp, size: Double) -> some View {
        let design = app.designs[app.designIndex(at: yearIndex)]
        let shape = HomeIconShape(cornerRatio: chrome.cornerRatio, squircle: chrome.squircle)
        return ZStack {
            shape.fill(LinearGradient(colors: [design.top.color, design.bottom.color], startPoint: .top, endPoint: .bottom))
            HomeDesignArt(design: design, edge: size)
        }
        .frame(width: size, height: size)
        .clipShape(shape)
    }
}

/// Rounded rectangle whose corner eases from a circular arc to the
/// continuous superellipse iOS 7 introduced.
struct HomeIconShape: InsettableShape {
    var cornerRatio: Double
    var squircle: Double
    var inset: CGFloat = 0

    var animatableData: AnimatablePair<Double, Double> {
        get { AnimatablePair(cornerRatio, squircle) }
        set { cornerRatio = newValue.first; squircle = newValue.second }
    }

    func path(in rect: CGRect) -> Path {
        let r = rect.insetBy(dx: inset, dy: inset)
        let radius = min(r.width, r.height) * cornerRatio
        // The two corner styles disagree only near the corner, so switching
        // at the midpoint is invisible at icon size.
        return Path(roundedRect: r, cornerRadius: radius, style: squircle > 0.5 ? .continuous : .circular)
    }

    func inset(by amount: CGFloat) -> HomeIconShape {
        var copy = self; copy.inset += amount; return copy
    }
}

/// The shine: the top of the icon, cut off by a shallow downward arc.
private struct HomeGloss: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: rect.minX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.minY + rect.height * 0.40))
        path.addQuadCurve(to: CGPoint(x: rect.minX, y: rect.minY + rect.height * 0.40),
                          control: CGPoint(x: rect.midX, y: rect.minY + rect.height * 0.62))
        path.closeSubpath()
        return path
    }
}

// MARK: - Dock and dots

private struct HomeDock: View {
    let chrome: HomeChrome
    let layout: CGRect
    let cornerRadius: Double

    var body: some View {
        ZStack {
            if chrome.dockShelf > 0.01 {
                // 2007: a perforated metal tray that lightens toward the foot,
                // over a flat grey strip the labels sit in.
                let strip = min(layout.height * 0.2, layout.width * 0.047)
                VStack(spacing: 0) {
                    ZStack {
                        LinearGradient(colors: [Color(white: 0.30), Color(white: 0.63)], startPoint: .top, endPoint: .bottom)
                        Canvas { context, size in
                            var y: CGFloat = 1.5
                            while y < size.height {
                                context.fill(Path(CGRect(x: 0, y: y, width: size.width, height: 0.6)),
                                             with: .color(.black.opacity(0.16)))
                                y += 2.4
                            }
                        }
                    }
                    Color(white: 0.44).frame(height: strip)
                }
                .frame(width: layout.width, height: layout.height)
                .position(x: layout.midX, y: layout.midY)
                .opacity(chrome.dockShelf)
            }
            if chrome.dockGlassShelf > 0.01 {
                // iOS 4-6: a pale glass shelf in perspective. The top surface
                // catches the light, the front face is darker, the lip bright.
                let face = layout.width * 0.063
                let lip = layout.width * 0.012
                ZStack(alignment: .bottom) {
                    ShelfShape().fill(.white.opacity(0.32))
                        .overlay(ShelfShape().stroke(.white.opacity(0.45), lineWidth: 0.7)
                            .mask(LinearGradient(colors: [.white, .clear], startPoint: .top, endPoint: .center)))
                    // The front face darkens softly toward the lip; no hard step.
                    VStack(spacing: 0) {
                        LinearGradient(colors: [.black.opacity(0), .black.opacity(0.16)], startPoint: .top, endPoint: .bottom)
                            .frame(height: face)
                        Rectangle().fill(.white.opacity(0.5)).frame(height: lip)
                    }
                }
                .frame(width: layout.width, height: layout.height)
                .position(x: layout.midX, y: layout.midY)
                .opacity(chrome.dockGlassShelf)
            }
            if chrome.dockPanel > 0.01 {
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(.ultraThinMaterial)
                    .overlay(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                        .fill(chrome.dockTint.color))
                    .frame(width: layout.width, height: layout.height)
                    .position(x: layout.midX, y: layout.midY)
                    .opacity(chrome.dockPanel)
            }
        }
    }
}

/// A trapezoid: a shelf floor in perspective, back edge inset.
private struct ShelfShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let inset = rect.width * 0.03
        path.move(to: CGPoint(x: rect.minX + inset, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - inset, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
        path.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        path.closeSubpath()
        return path
    }
}

/// Dots, with the Spotlight magnifier beside them in the early years, that
/// swell into iOS 16's frosted Search pill.
private struct HomePageIndicator: View {
    let chrome: HomeChrome
    let width: Double

    var body: some View {
        let ink = chrome.pageDots.color
        let m = chrome.metrics
        let dot = width * m.dotSize
        let gap = max(0, width * (m.dotPitch - m.dotSize))
        let count = Int(m.dotCount.rounded())
        let current = Int(m.activeDot.rounded())
        ZStack {
            // The whole row is centred, magnifier included.
            HStack(spacing: gap) {
                if chrome.spotlightGlyph > 0.01 {
                    Image(systemName: "magnifyingglass")
                        .font(.system(size: dot * 1.1, weight: .heavy))
                        .foregroundStyle(ink.opacity(0.4 * chrome.spotlightGlyph))
                        .frame(width: dot)
                }
                ForEach(0..<max(count, 0), id: \.self) { index in
                    Circle().fill(index == current ? ink : ink.opacity(0.35))
                        .frame(width: dot, height: dot)
                }
            }
            .opacity(1 - chrome.searchPill)

            // Sized from the screenshot: label-sized text in a small capsule.
            HStack(spacing: width * m.pillText * 0.28) {
                Image(systemName: "magnifyingglass").font(.system(size: width * m.pillText * 0.68, weight: .bold))
                Text("Search").font(.system(size: width * m.pillText, weight: .semibold))
            }
            .foregroundStyle(ink)
            .frame(width: max(1, width * m.pillWidth), height: max(1, width * m.pillHeight))
            .background(Capsule().fill(.ultraThinMaterial).overlay(Capsule().fill(ink.opacity(0.18))))
            .scaleEffect(0.6 + 0.4 * chrome.searchPill)
            .opacity(chrome.searchPill)
        }
    }
}
