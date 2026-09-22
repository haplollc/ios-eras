//
//  ButtonErasSwatch.swift
//  iOSEras
//
//  The button on its own: drawn large on a rounded swatch of that year's
//  screen, so a translucent 2024 capsule or a white 2015 slab still reads
//  against something, without any iPhone around it.
//

import SwiftUI

struct ButtonErasSwatch: View, Animatable {
    let eras: [ButtonEra]
    var position: Double
    /// How much larger than life the button is drawn.
    var magnification: Double = 1.75

    var animatableData: Double {
        get { position }
        set { position = newValue }
    }

    private var year: Int {
        eras[min(max(Int(position.rounded()), 0), eras.count - 1)].year
    }

    var body: some View {
        let looks = eras.looks(at: position)
        ZStack {
            EraBackdrop(look: looks.screen)
            EraButton(look: looks.button.scaled(by: magnification), year: year)
        }
        .frame(width: 340, height: 300)
        .clipShape(RoundedRectangle(cornerRadius: 44, style: .continuous))
        .shadow(color: .black.opacity(0.12), radius: 24, y: 12)
    }
}
