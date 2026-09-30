//
//  ReplayKitManager.swift
//  CarPlayPhoneCast
//
//  Official RPScreenRecorder integration.
//  Requires explicit user consent; no silent background capture.
//

import Foundation
import ReplayKit
import CoreMedia

final class ReplayKitManager {
    static let shared = ReplayKitManager()

    private let recorder = RPScreenRecorder.shared()
    private(set) var isCapturing: Bool = false

    var onVideoSampleBuffer: ((CMSampleBuffer) -> Void)?
    var onAudioSampleBuffer: ((CMSampleBuffer) -> Void)?

    private init() {}

    func startInAppCapture(completion: @escaping (Result<Void, CarPlayError>) -> Void) {
        guard recorder.isAvailable else {
            completion(.failure(.screenRecordingNotAvailable))
            return
        }

        recorder.isMicrophoneEnabled = SettingsStore.shared.audio

        recorder.startCapture(
            handler: { [weak self] sampleBuffer, sampleType, error in
                if let error = error {
                    AppLogger.shared.log("ReplayKit capture error: \(error.localizedDescription)", tag: .replayKit, level: .error)
                    return
                }

                switch sampleType {
                case .video:
                    self?.onVideoSampleBuffer?(sampleBuffer)
                case .audioApp, .audioMic:
                    self?.onAudioSampleBuffer?(sampleBuffer)
                @unknown default:
                    break
                }
            },
            completionHandler: { error in
                if let error = error {
                    AppLogger.shared.log("RPScreenRecorder permission or start failed: \(error.localizedDescription)", tag: .replayKit, level: .error)
                    completion(.failure(.recordingPermissionDenied))
                } else {
                    self.isCapturing = true
                    AppLogger.shared.log("RPScreenRecorder running with user consent.", tag: .replayKit)
                    completion(.success(()))
                }
            }
        )
    }

    func stopCapture() {
        guard isCapturing else { return }
        recorder.stopCapture { [weak self] error in
            self?.isCapturing = false
            if let error = error {
                AppLogger.shared.log("ReplayKit stop error: \(error.localizedDescription)", tag: .replayKit, level: .warning)
            } else {
                AppLogger.shared.log("ReplayKit capture finished.", tag: .replayKit)
            }
        }
    }
}
