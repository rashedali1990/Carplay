//
//  Encoder.swift
//  CarPlayPhoneCast
//
//  VideoToolbox hardware acceleration wrapper.
//

import Foundation
import VideoToolbox
import CoreMedia

final class VideoEncoder {
    static let shared = VideoEncoder()

    private var session: VTCompressionSession?

    private init() {
        setupSession()
    }

    private func setupSession() {
        VTCompressionSessionCreate(
            allocator: kCFAllocatorDefault,
            width: 1920,
            height: 1080,
            codecType: kCMVideoCodecType_H264,
            encoderSpecification: nil,
            imageBufferAttributes: nil,
            compressedDataAllocator: nil,
            outputCallback: nil,
            refcon: nil,
            compressionSessionOut: &session
        )
    }

    func encode(pixelBuffer: CVPixelBuffer) {
        guard let session = session else { return }
        VTCompressionSessionEncodeFrame(
            session,
            imageBuffer: pixelBuffer,
            presentationTimeStamp: CMTime(seconds: CACurrentMediaTime(), preferredTimescale: 600),
            duration: .invalid,
            frameProperties: nil,
            sourceFrameRefcon: nil,
            infoFlagsOut: nil
        )
    }
}
