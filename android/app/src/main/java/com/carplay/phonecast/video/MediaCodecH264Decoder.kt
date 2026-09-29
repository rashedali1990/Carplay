package com.carplay.phonecast.video

import android.media.MediaCodec
import android.media.MediaFormat
import android.view.Surface
import java.nio.ByteBuffer

class MediaCodecH264Decoder(private val surface: Surface) {

    private var codec: MediaCodec? = null
    private var isConfigured = false

    fun startDecoding() {
        val format = MediaFormat.createVideoFormat(MediaFormat.MIMETYPE_VIDEO_AVC, 1920, 1080).apply {
            setInteger(MediaFormat.KEY_LOW_LATENCY, 1)
            setInteger(MediaFormat.KEY_FRAME_RATE, 60)
            setInteger(MediaFormat.KEY_COLOR_FORMAT, 2130708361) // Surface color format
        }

        codec = MediaCodec.createDecoderByType(MediaFormat.MIMETYPE_VIDEO_AVC).apply {
            configure(format, surface, null, 0)
            start()
        }
        isConfigured = true
    }

    fun feedVideoPacket(data: ByteArray) {
        val mediaCodec = codec ?: return
        if (!isConfigured) return

        try {
            val inIndex = mediaCodec.dequeueInputBuffer(10_000)
            if (inIndex >= 0) {
                val inBuffer: ByteBuffer? = mediaCodec.getInputBuffer(inIndex)
                inBuffer?.clear()
                inBuffer?.put(data)
                mediaCodec.queueInputBuffer(inIndex, 0, data.size, System.nanoTime() / 1000, 0)
            }

            val bufferInfo = MediaCodec.BufferInfo()
            var outIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0)
            while (outIndex >= 0) {
                // Render directly onto SurfaceView with true timestamp
                mediaCodec.releaseOutputBuffer(outIndex, true)
                outIndex = mediaCodec.dequeueOutputBuffer(bufferInfo, 0)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun updateDimensions(width: Int, height: Int) {
        // Handle resolution change (720p, 1080p, ultrawide 1920x720)
    }

    fun stopDecoding() {
        try {
            codec?.stop()
            codec?.release()
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            codec = null
            isConfigured = false
        }
    }
}