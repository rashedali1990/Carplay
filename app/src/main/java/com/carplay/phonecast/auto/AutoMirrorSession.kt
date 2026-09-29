package com.carplay.phonecast.auto

import android.content.Intent
import androidx.car.app.Screen
import androidx.car.app.Session

/**
 * Android Auto Session lifecycle manager.
 */
class AutoMirrorSession : Session() {

    override fun onCreateScreen(intent: Intent): Screen {
        return AutoMirrorScreen(carContext)
    }
}