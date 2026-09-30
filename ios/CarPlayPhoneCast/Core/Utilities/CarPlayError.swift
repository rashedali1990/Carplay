//
//  CarPlayError.swift
//  CarPlayPhoneCast
//

import Foundation

enum CarPlayError: LocalizedError {
    case notConnected
    case fullMirroringUnsupported
    case screenRecordingNotAvailable
    case recordingPermissionDenied
    case vehicleMovingVideoRestricted
    case thermalLimitReached

    var errorDescription: String? {
        switch self {
        case .notConnected:
            return "Apple CarPlay is not currently connected."
        case .fullMirroringUnsupported:
            return "Arbitrary screen mirroring is restricted by Apple CarPlay guidelines."
        case .screenRecordingNotAvailable:
            return "Screen recording is not available."
        case .recordingPermissionDenied:
            return "User denied screen recording permissions."
        case .vehicleMovingVideoRestricted:
            return "Video playback is locked while vehicle is in motion."
        case .thermalLimitReached:
            return "Device temperature elevated. Performance throttled."
        }
    }
}
