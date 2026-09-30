//
//  ScreenMirroringProvider.swift
//  CarPlayPhoneCast
//
//  Protocol abstraction layer decoupling video rendering from CarPlay display.
//

import Foundation
import CoreMedia

protocol ScreenMirroringProvider: AnyObject {
    func startProjection()
    func stopProjection()
    func renderPixelBuffer(_ pixelBuffer: CVPixelBuffer)
}
