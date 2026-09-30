//
//  CarPlayPhoneCastTests.swift
//  CarPlayPhoneCastTests
//

import XCTest
@testable import CarPlayPhoneCast

final class CarPlayPhoneCastTests: XCTestCase {

    func testInitialMirroringStateIsIdle() {
        let manager = ScreenMirroringManager.shared
        manager.stop()
        XCTAssertEqual(manager.state, .idle)
    }

    func testSettingsStoreDefaults() {
        let store = SettingsStore.shared
        XCTAssertTrue(store.autoConnect)
        XCTAssertTrue(store.screenMirroring)
        XCTAssertEqual(store.quality, .auto)
        XCTAssertEqual(store.frameRate, .auto)
        XCTAssertEqual(store.aspectRatio, .fit)
    }

    func testMediaServiceReturnsFavorites() {
        let service = MediaService.shared
        let favorites = service.getItems(for: .favorites)
        XCTAssertFalse(favorites.isEmpty)
        XCTAssertTrue(favorites.allSatisfy { $0.favorite })
    }
}
