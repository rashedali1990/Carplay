//
//  ScreenMirroringManager.swift
//  CarPlayPhoneCast
//
//  Independent from CarPlay UI.
//  States: idle, starting, running, paused, stopped, error, unsupported
//

import Foundation
import CoreMedia
import ReplayKit

enum MirroringState: String {
    case idle
    case starting
    case running
    case paused
    case stopped
    case error
    case unsupported
}

final class ScreenMirroringManager: ObservableObject {
    static let shared = ScreenMirroringManager()

    @Published private(set) var state: MirroringState = .idle
    @Published private(set) var currentMediaTitle: String?

    private let replayKitManager = ReplayKitManager.shared
    private let videoPipeline = VideoPipeline.shared

    private init() {
        setupCaptureBridges()
    }

    func start() {
        guard CarPlayConnectionManager.shared.state == .connected else {
            state = .error
            AppLogger.shared.log("CarPlay must be connected before starting mirroring.", tag: .screenCapture, level: .warning)
            return
        }

        state = .starting
        AppLogger.shared.log("Starting ScreenMirroringManager...", tag: .screenCapture)

        replayKitManager.startInAppCapture { [weak self] result in
            DispatchQueue.main.async {
                guard let self = self else { return }
                switch result {
                case .success:
                    self.state = .running
                    self.videoPipeline.start()
                    AppLogger.shared.log("ScreenMirroringManager active.", tag: .screenCapture)
                case .failure(let error):
                    self.state = .unsupported
                    AppLogger.shared.log("ScreenMirroring unavailable: \(error.localizedDescription)", tag: .screenCapture, level: .error)
                }
            }
        }
    }

    func stop() {
        guard state == .running || state == .paused else { return }
        state = .stopped
        replayKitManager.stopCapture()
        videoPipeline.stop()
        currentMediaTitle = nil
        AppLogger.shared.log("ScreenMirroringManager stopped.", tag: .screenCapture)
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.state = .idle
        }
    }

    func pause() {
        guard state == .running else { return }
        state = .paused
        videoPipeline.pause()
        AppLogger.shared.log("ScreenMirroringManager paused.", tag: .screenCapture)
    }

    func resume() {
        guard state == .paused else { return }
        state = .running
        videoPipeline.resume()
        AppLogger.shared.log("ScreenMirroringManager resumed.", tag: .screenCapture)
    }

    func playMedia(_ item: MediaModel) {
        currentMediaTitle = item.title
        start()
        videoPipeline.injectMedia(item)
    }

    private func setupCaptureBridges() {
        replayKitManager.onVideoSampleBuffer = { [weak self] sampleBuffer in
            self?.videoPipeline.processSampleBuffer(sampleBuffer)
        }
    }
}
