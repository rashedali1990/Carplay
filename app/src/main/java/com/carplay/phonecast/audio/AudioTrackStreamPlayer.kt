package com.carplay.phonecast.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Log

/**
 * Low-Latency Automotive AudioTrack Player in Kotlin
 * Supports 48,000 Hz, 16-bit Stereo PCM audio stream.
 */
class AudioTrackStreamPlayer {

    companion object {
        private const val TAG = "AudioTrackStreamPlayer"
        private const val SAMPLE_RATE = 48000
    }

    private var audioTrack: AudioTrack? = null

    fun initAudioTrack() {
        val minBufferSize = AudioTrack.getMinBufferSize(
            SAMPLE_RATE,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_16BIT
        )

        audioTrack = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(SAMPLE_RATE)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                    .build()
            )
            .setBufferSizeInBytes(minBufferSize * 2)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
            .build().apply {
                play()
            }

        Log.d(TAG, "AudioTrack initialized: ${SAMPLE_RATE}Hz Stereo PCM")
    }

    fun playPcmChunk(pcmData: ByteArray) {
        audioTrack?.write(pcmData, 0, pcmData.size, AudioTrack.WRITE_NON_BLOCKING)
    }

    fun release() {
        try {
            audioTrack?.stop()
            audioTrack?.release()
        } catch (e: Exception) {
            Log.e(TAG, "Error releasing AudioTrack", e)
        } finally {
            audioTrack = null
        }
    }
}