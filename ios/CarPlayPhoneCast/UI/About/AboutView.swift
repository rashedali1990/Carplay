//
//  AboutView.swift
//  CarPlayPhoneCast
//
//  App Store review, privacy, and regulatory documentation inside the iOS app.
//

import SwiftUI

struct AboutView: View {
    var body: some View {
        List {
            Section(header: Text("Apple Compliance")) {
                VStack(alignment: .leading, spacing: 6) {
                    Text("Zero Private APIs")
                        .font(.headline)
                    Text("CarPlayPhoneCast utilizes solely official public APIs from Apple: CarPlay, ReplayKit, AVFoundation, and Metal.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)

                VStack(alignment: .leading, spacing: 6) {
                    Text("Driver Distraction Safety")
                        .font(.headline)
                    Text("In adherence to NHTSA guidelines, video rendering is interlocked with vehicle park state. Audio stream continues uninterrupted during transit.")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }

            Section(header: Text("Official Distribution")) {
                Text("• Distributed via Apple App Store & TestFlight")
                    .font(.caption)
                Text("• Enterprise B2B via Apple Business Manager Custom Apps")
                    .font(.caption)
                Text("• Privacy Manifest (PrivacyInfo.xcprivacy) included")
                    .font(.caption)
            }
        }
        .navigationTitle("About PhoneCast")
    }
}

struct MainTabView: View {
    var body: some View {
        TabView {
            HomeView()
                .tabItem {
                    Label("Dashboard", systemImage: "car.fill")
                }
            
            MediaContentView()
                .tabItem {
                    Label("Media", systemImage: "film.fill")
                }

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
        }
    }
}

struct MediaContentView: View {
    @EnvironmentObject var mediaService: MediaService
    
    var body: some View {
        NavigationStack {
            List(mediaService.items) { item in
                HStack {
                    Image(systemName: item.category == .videos ? "play.circle.fill" : "photo.fill")
                        .foregroundColor(.blue)
                    VStack(alignment: .leading) {
                        Text(item.title).font(.headline)
                        Text(item.resolution).font(.caption).foregroundColor(.secondary)
                    }
                    Spacer()
                    if item.favorite {
                        Image(systemName: "star.fill").foregroundColor(.yellow)
                    }
                }
            }
            .navigationTitle("Phone Content")
        }
    }
}
