//
//  MediaService.swift
//  CarPlayPhoneCast
//

import Foundation

final class MediaService: ObservableObject {
    static let shared = MediaService()

    @Published private(set) var items: [MediaModel] = []

    private init() {
        seedItems()
    }

    func getItems(for category: MediaCategory) -> [MediaModel] {
        switch category {
        case .videos: return items.filter { $0.category == .videos }
        case .photos: return items.filter { $0.category == .photos }
        case .media: return items
        case .favorites: return items.filter { $0.favorite }
        }
    }

    func toggleFavorite(id: String) {
        if let idx = items.firstIndex(where: { $0.id == id }) {
            items[idx].favorite.toggle()
        }
    }

    private func seedItems() {
        items = [
            MediaModel(id: "1", title: "Scenic Mountain Road", category: .videos, duration: "04:12", resolution: "3840x2160", favorite: true),
            MediaModel(id: "2", title: "Desert Sunset Horizon", category: .photos, duration: nil, resolution: "4032x3024", favorite: true),
            MediaModel(id: "3", title: "Race Track Telemetry", category: .videos, duration: "11:45", resolution: "1920x1080", favorite: false),
            MediaModel(id: "4", title: "Coastal Drone View", category: .photos, duration: nil, resolution: "3840x2160", favorite: false),
            MediaModel(id: "5", title: "Audio Broadcast Feed", category: .media, duration: "25:00", resolution: "Audio/Video", favorite: true)
        ]
    }
}
