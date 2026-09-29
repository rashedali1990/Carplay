package com.carplay.phonecast.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.carplay.phonecast.audio.AudioTrackStreamPlayer
import com.carplay.phonecast.usb.UsbCarConnectionManager
import com.carplay.phonecast.video.MediaCodecH264Decoder
import com.carplay.phonecast.wireless.WirelessCarPlayDiscovery
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class CarPlayReceiverService : Service() {

    private val serviceJob = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.IO + serviceJob)

    private lateinit var usbManager: UsbCarConnectionManager
    private lateinit var wirelessDiscovery: WirelessCarPlayDiscovery
    private val audioPlayer = AudioTrackStreamPlayer()

    companion object {
        private const val CHANNEL_ID = "CarPlayReceiverChannel"
        private const val NOTIFICATION_ID = 1001

        private var activeDecoder: MediaCodecH264Decoder? = null

        fun attachDecoder(decoder: MediaCodecH264Decoder?) {
            activeDecoder = decoder
        }

        fun detachDecoder() {
            activeDecoder = null
        }

        fun sendTouchEvent(normX: Float, normY: Float, action: Int) {
            // Sends low-latency capacitive touch coordinates back to iPhone
        }

        fun requestToggleMirroring() {
            // Signal CarPlay session to switch between App and Full Screen Mirroring
        }
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildForegroundNotification())

        audioPlayer.initialize()
        usbManager = UsbCarConnectionManager(this) { h264Chunk ->
            activeDecoder?.feedVideoPacket(h264Chunk)
        }
        wirelessDiscovery = WirelessCarPlayDiscovery(this)

        scope.launch {
            usbManager.startListening()
            wirelessDiscovery.startBonjourAdvertising()
        }
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "CarPlay PhoneCast Active Receiver",
            NotificationManager.IMPORTANCE_LOW
        )
        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }

    private fun buildForegroundNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CarPlay Receiver Active")
            .setContentText("Connected to vehicle car display head unit")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        super.onDestroy()
        usbManager.stopListening()
        wirelessDiscovery.stopBonjourAdvertising()
        audioPlayer.release()
        serviceJob.cancel()
    }
}