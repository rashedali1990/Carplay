package com.carplay.phonecast.auto

import android.graphics.Rect
import android.util.Log
import android.view.Surface
import androidx.car.app.AppManager
import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.SurfaceCallback
import androidx.car.app.SurfaceContainer
import androidx.car.app.model.Action
import androidx.car.app.model.ActionStrip
import androidx.car.app.model.Template
import androidx.car.app.navigation.model.NavigationTemplate

/**
 * Android Auto Screen providing Surface rendering canvas via NavigationTemplate.
 */
class AutoMirrorScreen(carContext: CarContext) : Screen(carContext) {

    companion object {
        private const val TAG = "AutoMirrorScreen"
    }

    private var activeSurface: Surface? = null

    private val surfaceCallback = object : SurfaceCallback {
        override fun onSurfaceAvailable(surfaceContainer: SurfaceContainer) {
            val surface = surfaceContainer.surface
            val width = surfaceContainer.width
            val height = surfaceContainer.height
            val dpi = surfaceContainer.dpi
            Log.i(TAG, "Android Auto Surface available: ${width}x${height} @ ${dpi}dpi")

            activeSurface = surface
            // Pass the vehicle Surface to the ScreenCaptureManager
            ScreenCaptureManager.attachCarSurface(surface, width, height, dpi)
        }

        override fun onVisibleAreaChanged(visibleArea: Rect) {
            Log.d(TAG, "Visible display area: $visibleArea")
        }

        override fun onStableAreaChanged(stableArea: Rect) {
            Log.d(TAG, "Stable display area: $stableArea")
        }

        override fun onSurfaceDestroyed(surfaceContainer: SurfaceContainer) {
            Log.i(TAG, "Android Auto Surface destroyed.")
            ScreenCaptureManager.detachCarSurface()
            activeSurface = null
        }
    }

    init {
        // Register surface callback with Android Auto AppManager
        carContext.getCarService(AppManager::class.java).setSurfaceCallback(surfaceCallback)
    }

    override fun onGetTemplate(): Template {
        val actionStrip = ActionStrip.Builder()
            .addAction(
                Action.Builder()
                    .setTitle("Toggle Mirror")
                    .setOnClickListener {
                        ScreenCaptureManager.toggleMirroring()
                    }
                    .build()
            )
            .build()

        return NavigationTemplate.Builder()
            .setActionStrip(actionStrip)
            .build()
    }
}