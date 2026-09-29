package com.carplay.phonecast.model

/**
 * Immutable State Representation for CarPlay Engine in Kotlin
 */
sealed class CarPlaySessionState {
    object Disconnected : CarPlaySessionState()
    object Connecting : CarPlaySessionState()

    data class Connected(
        val fps: Int = 60,
        val latencyMs: Int = 24,
        val resolution: String = "1920x1080",
        val isWireless: Boolean = false,
        val isMirroringActive: Boolean = true
    ) : CarPlaySessionState()

    data class Error(
        val message: String,
        val errorCode: Int = -1
    ) : CarPlaySessionState()
}
