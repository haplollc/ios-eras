//
//  HomeIconGallery.swift
//  iOSEras
//
//  One app at every year, each drawn with that year's chrome on a swatch of
//  that year's wallpaper. A checking tool: launch with UIC_ICON_PREVIEW=<app>.
//

import SwiftUI

struct HomeIconGallery: View {
    let app: HomeApp
    let eras: [HomeEra]

    var body: some View {
        let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: 4)
        VStack(spacing: 12) {
            Text(app.id)
                .font(.title2.weight(.semibold))
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(Array(eras.enumerated()), id: \.offset) { index, era in
                    VStack(spacing: 6) {
                        ZStack {
                            EraBackdrop(look: era.screen)
                            // The icon at the size it has on a 375 pt wide screen.
                            HomeIcon(app: app, lower: index, upper: index, t: 0,
                                     chrome: era.chrome, edge: 375 * era.chrome.iconScale,
                                     width: 375, docked: false)
                                .opacity(app.slots[index] == nil ? 0.35 : 1)
                        }
                        .frame(width: 96, height: 108)
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        Text(String(era.year))
                            .font(.caption2.monospacedDigit())
                            .foregroundStyle(app.slots[index] == nil ? .tertiary : .secondary)
                    }
                    .accessibilityIdentifier("gallery.\(era.year)")
                }
            }
            .padding(.horizontal, 12)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .padding(.top, 8)
        .background(Color(white: 0.96).ignoresSafeArea())
        .preferredColorScheme(.light)
        .toolbar(.hidden, for: .navigationBar)
    }
}
