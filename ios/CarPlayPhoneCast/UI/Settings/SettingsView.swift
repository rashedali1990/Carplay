//
//  SettingsView.swift
//  CarPlayPhoneCast
//
//  Settings view conforming to user specifications:
//  CarPlay
//  [ Auto Connect ]
//  [ Screen Mirroring ]
//  Quality: Auto / 720p / 1080p
//  Frame Rate: Auto / 30 / 60
//  Aspect Ratio: Fit / Fill / Original
//  Audio: ON / OFF
//  Battery Saver: ON / OFF
//

import SwiftUI

enum VideoQuality: String, CaseIterable, Identifiable {
    case auto = "Auto"
    case p720 = "720p"
    case p1080 = "1080p"
    var id: String { rawValue }
}

enum FrameRate: String, CaseIterable, Identifiable {
    case auto = "Auto"
    case fps30 = "30"
    case fps60 = "60"
    var id: String { rawValue }
}

enum AspectRatio: String, CaseIterable, Identifiable {
    case fit = "Fit"
    case fill = "Fill"
    case original = "Original"
    case widescreen = "16:9"
    case classic = "4:3"
    case zoom = "Zoom"
    var id: String { rawValue }
}

final class SettingsStore: ObservableObject {
    static let shared = SettingsStore()

    @Published var autoConnect: Bool = true
    @Published var screenMirroring: Bool = true
    @Published var quality: VideoQuality = .auto
    @Published var frameRate: FrameRate = .auto
    @Published var aspectRatio: AspectRatio = .fit
    @Published var audio: Bool = true
    @Published var batterySaver: Bool = false

    private init() {}
}

struct SettingsView: View {
    @StateObject private var settings = SettingsStore.shared

    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("CarPlay Settings")) {
                    Toggle("Auto Connect", isOn: $settings.autoConnect)
                        .tint(.blue)

                    Toggle("Screen Mirroring", isOn: $settings.screenMirroring)
                        .tint(.blue)

                    Picker("Quality", selection: $settings.quality) {
                        ForEach(VideoQuality.allCases) { q in
                            Text(q.rawValue).tag(q)
                        }
                    }

                    Picker("Frame Rate", selection: $settings.frameRate) {
                        ForEach(FrameRate.allCases) { fps in
                            Text(fps.rawValue).tag(fps)
                        }
                    }

                    Picker("Aspect Ratio", selection: $settings.aspectRatio) {
                        ForEach(AspectRatio.allCases) { ratio in
                            Text(ratio.rawValue).tag(ratio)
                        }
                    }

                    Toggle("Audio", isOn: $settings.audio)
                        .tint(.blue)

                    Toggle("Battery Saver", isOn: $settings.batterySaver)
                        .tint(.green)
                }

                Section(header: Text("Distribution & Legal")) {
                    NavigationLink(destination: AboutView()) {
                        Label("About & App Store Compliance", systemImage: "info.circle")
                    }
                }
            }
            .navigationTitle("CarPlay")
        }
    }
}
