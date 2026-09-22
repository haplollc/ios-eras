//
//  iOSErasApp.swift
//  iOSEras
//
//  Created by Jared Cassoutt on 6/15/26.
//

import SwiftUI

@main
struct iOSErasApp: App {
    var body: some Scene {
        WindowGroup {
            ComponentListView()
                .statusBarHidden(true)
        }
    }
}
