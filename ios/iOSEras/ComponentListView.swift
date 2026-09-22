//
//  ComponentListView.swift
//  iOSEras
//
//  The opening page: a native grouped list of every component in the
//  registry. Tapping a row pushes that component's showcase page.
//

import SwiftUI

struct ComponentListView: View {
    /// Set the UIC_OPEN env var to a component name to land straight on its
    /// page at launch. Used for scripted demo recordings.
    @State private var path: [String] = {
        if let name = ProcessInfo.processInfo.environment["UIC_OPEN"],
           ComponentRegistry.all.contains(where: { $0.name == name }) {
            return [name]
        }
        return []
    }()

    var body: some View {
        NavigationStack(path: $path) {
            List(ComponentRegistry.all) { component in
                NavigationLink(value: component.name) {
                    Label {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(component.name)
                            Text(component.subtitle)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    } icon: {
                        Image(systemName: component.systemImage)
                    }
                }
            }
            .navigationTitle("iOS Eras")
            .navigationDestination(for: String.self) { name in
                if let component = ComponentRegistry.all.first(where: { $0.name == name }) {
                    component.destination
                        .navigationTitle(name)
                        .navigationBarTitleDisplayMode(.inline)
                }
            }
        }
    }
}

#Preview {
    ComponentListView()
}
