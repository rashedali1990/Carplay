//
//  CarPlayPhoneCastApp.swift
//  CarPlayPhoneCast
//
//  Production iOS App with Apple CarPlay Integration.
//  Targeting iOS 17+ and CarPlay framework.
//

import SwiftUI
import CarPlay

@main
struct CarPlayPhoneCastApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    @StateObject private var connectionManager = CarPlayConnectionManager.shared
    @StateObject private var mediaService = MediaService.shared
    @StateObject private var mirroringManager = ScreenMirroringManager.shared

    var body: some Scene {
        WindowGroup {
            MainTabView()
                .environmentObject(connectionManager)
                .environmentObject(mediaService)
                .environmentObject(mirroringManager)
                .preferredColorScheme(.dark)
                .onAppear {
                    AppLogger.shared.log("CarPlayPhoneCast application active on iOS.", tag: .carPlay)
                }
        }
    }
}

// MARK: - Scene Delegation Router
class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
    ) -> Bool {
        AppLogger.shared.log("Application initialization finished. Listening for CarPlay scenes.", tag: .connection)
        return true
    }

    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        if connectingSceneSession.role == .carTemplateApplication {
            let carConfig = UISceneConfiguration(
                name: "CarPlay Template Configuration",
                sessionRole: connectingSceneSession.role
            )
            carConfig.delegateClass = CarPlaySceneDelegate.self
            return carConfig
        }
        
        return UISceneConfiguration(
            name: "Default iOS Configuration",
            sessionRole: connectingSceneSession.role
        )
    }
}
