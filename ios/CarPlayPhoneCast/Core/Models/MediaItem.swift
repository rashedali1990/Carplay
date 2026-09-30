//
//  MediaItem.swift
//  CarPlayPhoneCast
//

import Foundation

enum MediaCategory: String, CaseIterable, Identifiable {
    case videos = "Videos"
    case photos = "Photos"
    case media = "Media"
    case favorites = "Favorites"
    var id: String { rawValue }
}

struct MediaModel: Identifiable, Equatable {
    let id: String
    let title: String
    let category: MediaCategory
    let duration: String?
    let resolution: String
    var favorite: Bool
}
