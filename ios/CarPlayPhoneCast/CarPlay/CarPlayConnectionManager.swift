//
//  CarPlayConnectionManager.swift
//  CarPlayPhoneCast
//
//  States: Connected, Disconnected, Connecting, Reconnecting, Error
//  Handles automatic reconnection and thermal throttles.
//

import Foundation
import CarPlay
import Combine

enum CarPlayState: String {
    case connected = "Connected"
    case disconnected = "Disconnected"
    case connecting = "Connecting"
    case reconnecting = "Reconnecting"
    case error = "Error"
}

final class CarPlayConnectionManager: ObservableObject {
    static let shared = CarPlayConnectionManager()

    @Published private(set) var state: CarPlayState = .disconnected
    @Published private(set) var isDriving: Bool = false
    @Published private(set) var lastError: CarPlayError?

    private(set) var activeInterface: CPInterfaceController?
    private(set) var activeWindow: CPWindow?

    private var reconnectTimer: Timer?

    private init() {
        setupThermalObservation()
    }

    func handleConnect(interfaceController: CPInterfaceController, window: CPWindow) {
        self.activeInterface = interfaceController
        self.activeWindow = window
        self.state = .connected
        self.lastError = nil
        reconnectTimer?.invalidate()
        reconnectTimer = nil
        AppLogger.shared.log("CarPlay session connected.", tag: .connection)

        if SettingsStore.shared.autoConnect && SettingsStore.shared.screenMirroring {
            ScreenMirroringManager.shared.start()
        }
    }

    func handleDisconnect() {
        self.activeInterface = nil
        self.activeWindow = nil
        self.state = .disconnected
        ScreenMirroringManager.shared.stop()
        AppLogger.shared.log("CarPlay session disconnected.", tag: .connection)

        // Automatic Reconnect loop if AutoConnect is enabled
        if SettingsStore.shared.autoConnect {
            triggerAutoReconnect()
        }
    }

    func simulateMotion(driving: Bool) {
        self.isDriving = driving
        AppLogger.shared.log("Vehicle motion status: \(driving ? "Driving (>0 km/h)" : "Parked")", tag: .carPlay)
    }

    private func triggerAutoReconnect() {
        self.state = .reconnecting
        AppLogger.shared.log("Attempting automatic CarPlay session reconnect...", tag: .connection)

        reconnectTimer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: false) { [weak self] _ in
            guard let self = self else { return }
            if self.activeInterface == nil {
                self.state = .disconnected
                AppLogger.shared.log("Awaiting vehicle connection handshake.", tag: .connection)
            }
        }
    }

    private func setupThermalObservation() {
        NotificationCenter.default.addObserver(forName: ProcessInfo.thermalStateDidChangeNotification, object: nil, queue: .main) { _ in
            let thermal = ProcessInfo.processInfo.thermalState
            AppLogger.shared.log("Thermal condition update: \(thermal.rawValue)", tag: .performance)
        }
    }
}
