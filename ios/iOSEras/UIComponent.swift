//
//  UIComponent.swift
//  iOSEras
//
//  A single entry in the component library and the central registry of
//  all components. To add a new component: build its showcase view, then
//  add one `UIComponent` to `ComponentRegistry.all`.
//

import SwiftUI

/// Describes one showcaseable UI component in the library.
struct UIComponent: Identifiable {
    let id = UUID()
    let name: String
    let subtitle: String
    let systemImage: String
    /// The page pushed when this component's row is tapped.
    let destination: AnyView

    init<Destination: View>(
        name: String,
        subtitle: String,
        systemImage: String,
        @ViewBuilder destination: () -> Destination
    ) {
        self.name = name
        self.subtitle = subtitle
        self.systemImage = systemImage
        self.destination = AnyView(destination())
    }
}

/// The full catalog of components shown on the opening page.
enum ComponentRegistry {
    static let all: [UIComponent] = [
        UIComponent(
            name: "Home Screen Eras",
            subtitle: "Scrub the home screen through every iOS",
            systemImage: "square.grid.3x3.fill"
        ) {
            HomeErasView()
        },
        UIComponent(
            name: "Button Eras",
            subtitle: "Scrub one button through every year of iOS",
            systemImage: "button.horizontal.top.press.fill"
        ) {
            ButtonErasView()
        },
    ]
}
