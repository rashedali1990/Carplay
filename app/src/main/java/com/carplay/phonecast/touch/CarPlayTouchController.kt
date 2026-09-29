package com.carplay.phonecast.touch

import android.view.MotionEvent

/**
 * Kotlin Touch Event Normalizer
 * Scales vehicle touchscreen events into 0.0 - 1.0 floating point coordinates.
 */
class CarPlayTouchController(
    private val onTouchAction: (Float, Float, Int) -> Unit
) {
    fun handleMotionEvent(event: MotionEvent, viewWidth: Int, viewHeight: Int) {
        if (viewWidth <= 0 || viewHeight <= 0) return

        val normX = (event.x / viewWidth).coerceIn(0f, 1f)
        val normY = (event.y / viewHeight).coerceIn(0f, 1f)

        val action = when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> 0
            MotionEvent.ACTION_MOVE -> 1
            MotionEvent.ACTION_UP -> 2
            MotionEvent.ACTION_CANCEL -> 3
            else -> return
        }

        onTouchAction(normX, normY, action)
    }
}