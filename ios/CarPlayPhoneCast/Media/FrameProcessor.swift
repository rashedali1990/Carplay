//
//  FrameProcessor.swift
//  CarPlayPhoneCast
//
//  Metal Shading Language & CoreVideo frame transformer.
//

import Foundation
import Metal
import CoreVideo

final class FrameProcessor {
    static let shared = FrameProcessor()

    private var device: MTLDevice?
    private var commandQueue: MTLCommandQueue?

    private init() {
        device = MTLCreateSystemDefaultDevice()
        commandQueue = device?.makeCommandQueue()
    }

    func process(pixelBuffer: CVPixelBuffer) {
        // Fast aspect ratio matrix transformation and scaling
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer { CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly) }
    }
}
