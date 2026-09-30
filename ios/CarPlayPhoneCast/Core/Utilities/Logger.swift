//
//  Logger.swift
//  CarPlayPhoneCast
//

import Foundation
import os.log

enum LogTag: String {
    case carPlay = "CarPlay"
    case screenCapture = "ScreenCapture"
    case replayKit = "ReplayKit"
    case videoPipeline = "VideoPipeline"
    case connection = "Connection"
    case performance = "Performance"
}

final class AppLogger {
    static let shared = AppLogger()
    private let logger = Logger(subsystem: "com.example.carplayphonecast", category: "App")

    func log(_ message: String, tag: LogTag, level: OSLogType = .default) {
        #if DEBUG
        logger.log(level: level, "[\(tag.rawValue, privacy: .public)] \(message, privacy: .public)")
        #endif
    }
}
