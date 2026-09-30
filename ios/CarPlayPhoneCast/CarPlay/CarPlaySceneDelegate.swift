//
//  CarPlaySceneDelegate.swift
//  CarPlayPhoneCast
//
//  CarPlay Screen Layout:
//  APP Connected to Car
//  [ Videos ] [ Photos ] [ Media ] [ Favorites ] [ Settings ]
//

import Foundation
import CarPlay
import UIKit

class CarPlaySceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {
    var interfaceController: CPInterfaceController?
    private var carWindow: CPWindow?
    private let connectionManager = CarPlayConnectionManager.shared
    private let mediaService = MediaService.shared
    private let mirroringManager = ScreenMirroringManager.shared

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        self.interfaceController = interfaceController
        self.carWindow = window

        connectionManager.handleConnect(interfaceController: interfaceController, window: window)
        AppLogger.shared.log("CarPlay Scene attached. Rendering root interface.", tag: .carPlay)

        setupCarPlayInterface()
    }

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didDisconnectInterfaceController interfaceController: CPInterfaceController
    ) {
        self.interfaceController = nil
        self.carWindow = nil
        connectionManager.handleDisconnect()
        AppLogger.shared.log("CarPlay Scene disconnected from vehicle.", tag: .carPlay)
    }

    // MARK: - Main Interface Builder
    private func setupCarPlayInterface() {
        guard let interfaceController = self.interfaceController else { return }

        // Grid Buttons requested:
        // [ Videos ] [ Photos ] [ Media ] [ Favorites ] [ Settings ]
        let videosButton = CPGridButton(
            titleVariants: ["Videos", "فيديوهات"],
            image: UIImage(systemName: "video.fill") ?? UIImage()
        ) { [weak self] _ in
            self?.presentCategoryList(category: .videos, title: "Videos")
        }

        let photosButton = CPGridButton(
            titleVariants: ["Photos", "الصور"],
            image: UIImage(systemName: "photo.fill") ?? UIImage()
        ) { [weak self] _ in
            self?.presentCategoryList(category: .photos, title: "Photos")
        }

        let mediaButton = CPGridButton(
            titleVariants: ["Media", "الوسائط"],
            image: UIImage(systemName: "play.rectangle.fill") ?? UIImage()
        ) { [weak self] _ in
            self?.presentCategoryList(category: .media, title: "All Media")
        }

        let favoritesButton = CPGridButton(
            titleVariants: ["Favorites", "المفضلة"],
            image: UIImage(systemName: "star.fill") ?? UIImage()
        ) { [weak self] _ in
            self?.presentCategoryList(category: .favorites, title: "Favorites")
        }

        let settingsButton = CPGridButton(
            titleVariants: ["Settings", "الإعدادات"],
            image: UIImage(systemName: "gearshape.fill") ?? UIImage()
        ) { [weak self] _ in
            self?.presentCarPlaySettings()
        }

        // Title: "APP Connected to Car"
        let rootGrid = CPGridTemplate(
            title: "APP Connected to Car",
            gridButtons: [videosButton, photosButton, mediaButton, favoritesButton, settingsButton]
        )

        // Trailing cast button
        let castButton = CPBarButton(type: .text) { [weak self] _ in
            self?.toggleMirroringAction()
        }
        castButton.title = mirroringManager.state == .running ? "Stop Cast" : "Cast"
        rootGrid.trailingNavigationBarButtons = [castButton]

        interfaceController.setRootTemplate(rootGrid, animated: true) { success, error in
            if let error = error {
                AppLogger.shared.log("Failed to set CarPlay root template: \(error.localizedDescription)", tag: .carPlay, level: .error)
            } else {
                AppLogger.shared.log("CarPlay Root Grid successfully set: APP Connected to Car", tag: .carPlay)
            }
        }
    }

    private func presentCategoryList(category: MediaCategory, title: String) {
        guard let interfaceController = self.interfaceController else { return }

        let items = mediaService.getItems(for: category)
        let listItems = items.map { item -> CPListItem in
            let listItem = CPListItem(
                text: item.title,
                detailText: item.duration ?? item.resolution,
                image: UIImage(systemName: item.category == .videos ? "play.circle" : "photo")
            )
            listItem.handler = { [weak self] _, completion in
                self?.handleItemSelection(item)
                completion()
            }
            return listItem
        }

        let section = CPListSection(items: listItems.isEmpty ? [CPListItem(text: "No Media Found", detailText: "Add items in iPhone app")] : listItems)
        let listTemplate = CPListTemplate(title: title, sections: [section])
        interfaceController.pushTemplate(listTemplate, animated: true, completion: nil)
    }

    private func presentCarPlaySettings() {
        guard let interfaceController = self.interfaceController else { return }

        let settings = SettingsStore.shared
        let items = [
            CPListItem(text: "Mirroring Status", detailText: settings.screenMirroring ? "Enabled" : "Disabled"),
            CPListItem(text: "Quality Profile", detailText: settings.quality.rawValue),
            CPListItem(text: "Frame Rate", detailText: "\(settings.frameRate.rawValue) FPS"),
            CPListItem(text: "Aspect Ratio", detailText: settings.aspectRatio.rawValue),
            CPListItem(text: "Audio Channel", detailText: settings.audio ? "Active" : "Muted")
        ]

        let section = CPListSection(items: items)
        let template = CPListTemplate(title: "CarPlay Settings", sections: [section])
        interfaceController.pushTemplate(template, animated: true, completion: nil)
    }

    private func handleItemSelection(_ item: MediaModel) {
        if connectionManager.isDriving {
            let alert = CPAlertTemplate(
                titleVariants: ["Driver Safety Active", "تنبيه الأمان أثناء القيادة"],
                actions: [CPAlertAction(title: "OK", style: .cancel, handler: { _ in })]
            )
            interfaceController?.presentTemplate(alert, animated: true, completion: nil)
            return
        }

        mirroringManager.playMedia(item)
    }

    private func toggleMirroringAction() {
        if mirroringManager.state == .running {
            mirroringManager.stop()
        } else {
            mirroringManager.start()
        }
    }
}
