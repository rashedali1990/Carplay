package com.carplay.phonecast.auto

import androidx.car.app.CarAppService
import androidx.car.app.Session
import androidx.car.app.validation.HostValidator

/**
 * Android Auto Entrypoint Service (Kotlin)
 * Sideloaded APK Configuration - Allows all hosts without Google Play restrictions.
 */
class AutoMirrorCarAppService : CarAppService() {

    override fun createHostValidator(): HostValidator {
        // Essential for sideloaded APKs: permits running on any Android Auto head unit
        // without requiring Google Play Store digital signatures.
        return HostValidator.ALLOW_ALL_HOSTS_VALIDATOR
    }

    override fun onCreateSession(): Session {
        return AutoMirrorSession()
    }
}