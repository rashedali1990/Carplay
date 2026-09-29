package com.carplay.phonecast.touch

import android.view.MotionEvent

class CarPlayTouchController(
    private val onTouchDispatched: (Float, Float, Int) -> Unit
) {
    fun handleTouchEvent(event: MotionEvent, viewWidth: Int, viewHeight: Int) {
        if (viewWidth <= 0 || viewHeight <= 0) return

        // Normalize coordinates to 0.0 .. 1.0 (Apple CarPlay Touch Standard)
        val normX = (event.x / viewWidth).coerceIn(0f, 1f)
        val normY = (event.y / viewHeight).coerceIn(0f, 1f)

        val actionType = when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> 0
            MotionEvent.ACTION_MOVE -> 1
            MotionEvent.ACTION_UP -> 2
            MotionEvent.ACTION_CANCEL -> 3
            else -> return
        }

        onTouchDispatched(normX, normY, actionType)
    }
}