package com.carplay.phonecast.auto

import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.projection.MediaProjection
import android.util.Log
import android.view.Surface

/**
 * Screen Capture Manager (Kotlin)
 * Pipes phone display into Android Auto Vehicle Surface via MediaProjection VirtualDisplay.
 */
object ScreenCaptureManager {

    private const val TAG = "ScreenCaptureManager"
    private const val VIRTUAL_DISPLAY_NAME = "AndroidAutoMirrorDisplay"

    private var carSurface: Surface? = null
    private var surfaceWidth: Int = 1920
    private var surfaceHeight: Int = 1080
    private var surfaceDpi: Int = 160

    private var mediaProjection: MediaProjection? = null
    private var virtualDisplay: VirtualDisplay? = null
    var isMirroring: Boolean = false
        private set

    fun setMediaProjection(projection: MediaProjection) {
        mediaProjection = projection
        startStreamingIfReady()
    }

    fun attachCarSurface(surface: Surface, width: Int, height: Int, dpi: Int) {
        carSurface = surface
        surfaceWidth = if (width > 0) width else 1920
        surfaceHeight = if (height > 0) height else 1080
        surfaceDpi = if (dpi > 0) dpi else 160
        startStreamingIfReady()
    }

    fun detachCarSurface() {
        stopStreaming()
        carSurface = null
    }

    fun toggleMirroring() {
        if (isMirroring) {
            stopStreaming()
        } else {
            startStreamingIfReady()
        }
    }

    private fun startStreamingIfReady() {
        val projection = mediaProjection
        val surface = carSurface

        if (projection == null || surface == null) {
            Log.d(TAG, "Cannot start streaming: projection=$projection, surface=$surface")
            return
        }

        try {
            virtualDisplay?.release()
            virtualDisplay = projection.createVirtualDisplay(
                VIRTUAL_DISPLAY_NAME,
                surfaceWidth,
                surfaceHeight,
                surfaceDpi,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR or DisplayManager.VIRTUAL_DISPLAY_FLAG_PRESENTATION,
                surface,
                null,
                null
            )
            isMirroring = true
            Log.i(TAG, "Screen Mirroring started to Android Auto Surface: ${surfaceWidth}x${height} @ ${dpi}dpi")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to create VirtualDisplay for car surface", e)
            isMirroring = false
        }
    }

    fun stopStreaming() {
        try {
            virtualDisplay?.release()
            virtualDisplay = null
            isMirroring = false
            Log.i(TAG, "Screen Mirroring to Android Auto stopped.")
        } catch (e: Exception) {
            Log.e(TAG, "Error stopping streaming", e)
        }
    }
}