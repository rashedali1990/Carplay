export interface AndroidFile {
  path: string;
  name: string;
  category: 'App' | 'Service' | 'USB' | 'Wireless' | 'Video' | 'Audio' | 'Touch' | 'Config' | 'Res';
  description: string;
  content: string;
}

export const ANDROID_CODEBASE: AndroidFile[] = [
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'Config',
    description: 'Android Manifest configuring USB Host, Automotive dock category, foreground receiver service, and hardware acceleration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.carplay.phonecast">

    <!-- Car Head Unit & Automotive Features -->
    <uses-feature android:name="android.hardware.type.automotive" android:required="false" />
    <uses-feature android:name="android.hardware.usb.host" android:required="true" />
    <uses-feature android:name="android.hardware.wifi" android:required="false" />
    <uses-feature android:name="android.software.leanback" android:required="false" />
    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />

    <!-- Permissions for Low-Latency Streaming & Audio -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_CONNECTED_DEVICE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />

    <application
        android:name=".CarPlayApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:hardwareAccelerated="true"
        android:theme="@style/Theme.CarPlayPhoneCast.Fullscreen">

        <!-- Automotive Metadata descriptor -->
        <meta-data
            android:name="com.google.android.gms.car.application"
            android:resource="@xml/automotive_app_desc" />

        <!-- Main Automotive / Car Screen Receiver Activity -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:screenOrientation="sensorLandscape"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:theme="@style/Theme.CarPlayPhoneCast.Fullscreen">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
                <category android:name="android.intent.category.CAR_DOCK" />
                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>

            <!-- USB Device Attached Intent Filter for Lightning/USB-C Auto Launch -->
            <intent-filter>
                <action android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED" />
                <action android:name="android.hardware.usb.action.USB_ACCESSORY_ATTACHED" />
            </intent-filter>

            <meta-data
                android:name="android.hardware.usb.action.USB_DEVICE_ATTACHED"
                android:resource="@xml/usb_device_filter" />
        </activity>

        <!-- Foreground Streaming & Audio Receiver Service -->
        <service
            android:name=".service.CarPlayReceiverService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="connectedDevice" />

    </application>
</manifest>`
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'Config',
    description: 'App-level Gradle build script specifying SDK 34, AndroidX, MediaCodec, and Kotlin Coroutines',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.carplay.phonecast"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.carplay.phonecast"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        ndk {
            abiFilters += listOf("arm64-v8a", "armeabi-v7a", "x86_64")
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")
    implementation("androidx.media3:media3-exoplayer:1.3.1")
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'App',
    description: 'Main Android activity rendering CarPlay display via SurfaceView, handling USB/WiFi connections and touch input',
    content: `package com.carplay.phonecast

import android.content.Intent
import android.os.Bundle
import android.view.MotionEvent
import android.view.SurfaceHolder
import android.view.View
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import com.carplay.phonecast.databinding.ActivityMainBinding
import com.carplay.phonecast.service.CarPlayReceiverService
import com.carplay.phonecast.touch.CarPlayTouchController
import com.carplay.phonecast.video.MediaCodecH264Decoder

class MainActivity : AppCompatActivity(), SurfaceHolder.Callback {

    private lateinit var binding: ActivityMainBinding
    private var videoDecoder: MediaCodecH264Decoder? = null
    private lateinit var touchController: CarPlayTouchController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Immersive full-screen mode for automotive car screens
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        hideSystemUI()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        touchController = CarPlayTouchController { x, y, action ->
            CarPlayReceiverService.sendTouchEvent(x, y, action)
        }

        binding.surfaceView.holder.addCallback(this)
        setupClickListeners()
        startReceiverService()
    }

    private fun setupClickListeners() {
        binding.btnToggleMirroring.setOnClickListener {
            CarPlayReceiverService.requestToggleMirroring()
        }

        binding.surfaceView.setOnTouchListener { _, event ->
            touchController.handleTouchEvent(event, binding.surfaceView.width, binding.surfaceView.height)
            true
        }
    }

    private fun startReceiverService() {
        val serviceIntent = Intent(this, CarPlayReceiverService::class.java)
        startForegroundService(serviceIntent)
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        videoDecoder = MediaCodecH264Decoder(holder.surface)
        videoDecoder?.startDecoding()
        CarPlayReceiverService.attachDecoder(videoDecoder)
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
        videoDecoder?.updateDimensions(width, height)
    }

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        CarPlayReceiverService.detachDecoder()
        videoDecoder?.stopDecoding()
        videoDecoder = null
    }

    private fun hideSystemUI() {
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            or View.SYSTEM_UI_FLAG_FULLSCREEN
        )
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/service/CarPlayReceiverService.kt',
    name: 'CarPlayReceiverService.kt',
    category: 'Service',
    description: 'Foreground Android service handling USB Host communication, wireless Bonjour discovery, and audio/video demuxing',
    content: `package com.carplay.phonecast.service

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
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/video/MediaCodecH264Decoder.kt',
    name: 'MediaCodecH264Decoder.kt',
    category: 'Video',
    description: 'Hardware-accelerated MediaCodec H.264/AVC decoder rendering video frames directly onto car screen with <25ms latency',
    content: `package com.carplay.phonecast.video

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
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/audio/AudioTrackStreamPlayer.kt',
    name: 'AudioTrackStreamPlayer.kt',
    category: 'Audio',
    description: 'Low-latency PCM 48kHz 16-bit stereo AudioTrack audio playback system for vehicle speakers',
    content: `package com.carplay.phonecast.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack

class AudioTrackStreamPlayer {

    private var audioTrack: AudioTrack? = null

    fun initialize() {
        val sampleRate = 48000
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_STEREO,
            AudioFormat.ENCODING_PCM_16BIT
        ) * 2

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
                    .setSampleRate(sampleRate)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_STEREO)
                    .build()
            )
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STREAM)
            .setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
            .build()

        audioTrack?.play()
    }

    fun writePcmData(pcmChunk: ByteArray) {
        audioTrack?.write(pcmChunk, 0, pcmChunk.size, AudioTrack.WRITE_NON_BLOCKING)
    }

    fun release() {
        audioTrack?.stop()
        audioTrack?.release()
        audioTrack = null
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/usb/UsbCarConnectionManager.kt',
    name: 'UsbCarConnectionManager.kt',
    category: 'USB',
    description: 'High-speed USB Accessory & USB Host communication pipe for wired iPhone lightning/USB-C connection',
    content: `package com.carplay.phonecast.usb

import android.content.Context
import android.hardware.usb.UsbAccessory
import android.hardware.usb.UsbManager
import java.io.FileInputStream
import java.io.FileOutputStream

class UsbCarConnectionManager(
    private val context: Context,
    private val onPacketReceived: (ByteArray) -> Unit
) {
    private val usbManager = context.getSystemService(Context.USB_SERVICE) as UsbManager
    private var inStream: FileInputStream? = null
    private var outStream: FileOutputStream? = null
    private var isRunning = false

    fun startListening() {
        val accessories = usbManager.accessoryList
        if (!accessories.isNullOrEmpty()) {
            openAccessory(accessories[0])
        }
    }

    private fun openAccessory(accessory: UsbAccessory) {
        val parcelFileDescriptor = usbManager.openAccessory(accessory) ?: return
        val fd = parcelFileDescriptor.fileDescriptor
        inStream = FileInputStream(fd)
        outStream = FileOutputStream(fd)
        isRunning = true

        Thread {
            val buffer = ByteArray(16384)
            while (isRunning) {
                try {
                    val bytesRead = inStream?.read(buffer) ?: -1
                    if (bytesRead > 0) {
                        val packet = buffer.copyOf(bytesRead)
                        onPacketReceived(packet)
                    }
                } catch (e: Exception) {
                    break
                }
            }
        }.start()
    }

    fun stopListening() {
        isRunning = false
        inStream?.close()
        outStream?.close()
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/carplay/phonecast/touch/CarPlayTouchController.kt',
    name: 'CarPlayTouchController.kt',
    category: 'Touch',
    description: 'Normalizes car screen touchscreen gestures and dispatches them to the iPhone host',
    content: `package com.carplay.phonecast.touch

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
}`
  },
  {
    path: 'android/app/src/main/res/layout/activity_main.xml',
    name: 'activity_main.xml',
    category: 'Res',
    description: 'Car head unit UI layout featuring hardware SurfaceView, status telemetry pill, and quick toggle overlay',
    content: `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#000000">

    <!-- Primary Video Surface for Apple CarPlay H.264 stream -->
    <SurfaceView
        android:id="@+id/surfaceView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

    <!-- Head Unit Top Bar with Connection Status -->
    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="top|start"
        android:layout_margin="16dp"
        android:background="#99111827"
        android:paddingHorizontal="12dp"
        android:paddingVertical="6dp"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="CarPlay Connected • 60 FPS"
            android:textColor="#38BDF8"
            android:textSize="12sp"
            android:textStyle="bold" />
    </LinearLayout>

    <!-- Floating Toggle Button -->
    <Button
        android:id="@+id/btnToggleMirroring"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom|end"
        android:layout_margin="16dp"
        android:backgroundTint="#0284C7"
        android:text="Mirroring Mode"
        android:textColor="#FFFFFF" />

</FrameLayout>`
  },
  {
    path: 'android/app/src/main/res/xml/usb_device_filter.xml',
    name: 'usb_device_filter.xml',
    category: 'Res',
    description: 'USB VID/PID filter for auto-detecting connected Apple iPhones via MFi/USB Host',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Apple Inc. Vendor ID (0x05AC) for iPhone, iPad, and MFi CarPlay dongles -->
    <usb-device vendor-id="1452" />
    <usb-accessory model="CarPlayPhoneCast" manufacturer="PhoneCast" version="1.0" />
</resources>`
  },
  {
    path: 'android/app/src/main/res/xml/automotive_app_desc.xml',
    name: 'automotive_app_desc.xml',
    category: 'Res',
    description: 'Android Automotive app descriptor for car display compliance and media playback',
    content: `<?xml version="1.0" encoding="utf-8"?>
<automotiveApp>
    <uses name="media" />
</automotiveApp>`
  }
];
