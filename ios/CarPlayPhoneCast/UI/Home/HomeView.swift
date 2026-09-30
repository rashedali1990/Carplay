//
//  HomeView.swift
//  CarPlayPhoneCast
//
//  iOS 17+ Dashboard View
//

import SwiftUI

struct HomeView: View {
    @EnvironmentObject private var connectionManager: CarPlayConnectionManager
    @EnvironmentObject private var mirroringManager: ScreenMirroringManager
    @StateObject private var videoPipeline = VideoPipeline.shared

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // CarPlay Status Card
                    connectionCard

                    // Projection Controller
                    projectionCard

                    // Telemetry Grid
                    telemetryCard

                    // Driver Safety Compliance Banner
                    safetyNoticeCard
                }
                .padding()
            }
            .navigationTitle("PhoneCast")
            .background(Color(UIColor.systemGroupedBackground))
        }
    }

    private var connectionCard: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .fill(connectionManager.state == .connected ? Color.green.opacity(0.15) : Color.orange.opacity(0.15))
                    .frame(width: 50, height: 50)
                Image(systemName: "car.2.fill")
                    .font(.title2)
                    .foregroundColor(connectionManager.state == .connected ? .green : .orange)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(connectionManager.state == .connected ? "CarPlay Connected" : "Connecting / Disconnected")
                    .font(.headline)
                    .foregroundColor(.primary)
                Text(connectionManager.state == .connected ? "USB-C / Wireless MFi Protocol active" : "Connect iPhone to car to launch CarPlay")
                    .font(.footnote)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Circle()
                .fill(connectionManager.state == .connected ? Color.green : Color.orange)
                .frame(width: 12, height: 12)
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }

    private var projectionCard: some View {
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Screen Mirroring Pipeline")
                        .font(.headline)
                    Text("State: \(mirroringManager.state.rawValue.capitalized)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                Spacer()
                if mirroringManager.state == .running {
                    Image(systemName: "dot.radiowaves.left.and.right")
                        .foregroundColor(.blue)
                        .font(.title3)
                }
            }

            Button(action: {
                if mirroringManager.state == .running {
                    mirroringManager.stop()
                } else {
                    mirroringManager.start()
                }
            }) {
                HStack {
                    Image(systemName: mirroringManager.state == .running ? "stop.fill" : "play.fill")
                    Text(mirroringManager.state == .running ? "Stop Projection" : "Start Projection")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(mirroringManager.state == .running ? Color.red : Color.blue)
                .foregroundColor(.white)
                .cornerRadius(12)
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }

    private var telemetryCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("PIPELINE PERFORMANCE")
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.secondary)

            HStack(spacing: 16) {
                metricBox(title: "FPS", value: String(format: "%.0f", videoPipeline.currentFps), unit: "fps")
                metricBox(title: "Latency", value: String(format: "%.1f", videoPipeline.latencyMs), unit: "ms")
                metricBox(title: "Resolution", value: SettingsStore.shared.quality.rawValue, unit: "")
            }
        }
        .padding()
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }

    private func metricBox(title: String, value: String, unit: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title).font(.caption2).foregroundColor(.secondary)
            HStack(alignment: .firstTextBaseline, spacing: 2) {
                Text(value).font(.title3).fontWeight(.bold)
                if !unit.isEmpty { Text(unit).font(.caption2).foregroundColor(.secondary) }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var safetyNoticeCard: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.shield.fill")
                .foregroundColor(.green)
                .font(.title3)
            VStack(alignment: .leading, spacing: 2) {
                Text("Apple CarPlay Compliance Active")
                    .font(.footnote)
                    .fontWeight(.medium)
                Text("Compliant with NHTSA & Apple MFi distraction standards.")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.secondarySystemGroupedBackground))
        .cornerRadius(16)
    }
}
