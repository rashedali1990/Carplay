package com.carplay.phonecast.ui

import android.content.Intent
import android.os.Bundle
import android.view.SurfaceHolder
import android.view.View
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.carplay.phonecast.databinding.ActivityMainBinding
import com.carplay.phonecast.model.CarPlaySessionState
import com.carplay.phonecast.service.CarPlayReceiverService
import com.carplay.phonecast.touch.CarPlayTouchController
import com.carplay.phonecast.video.MediaCodecH264Decoder
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

/**
 * Main Car Screen Receiver Activity (Kotlin)
 * Renders the Apple CarPlay / PhoneCast stream onto an automotive SurfaceView.
 */
class MainActivity : AppCompatActivity(), SurfaceHolder.Callback {

    private lateinit var binding: ActivityMainBinding
    private var videoDecoder: MediaCodecH264Decoder? = null
    private lateinit var touchController: CarPlayTouchController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Automotive Head Unit Fullscreen Optimization
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        hideSystemUI()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        touchController = CarPlayTouchController { normX, normY, action ->
            CarPlayReceiverService.dispatchTouchEvent(normX, normY, action)
        }

        binding.surfaceView.holder.addCallback(this)
        setupInteractions()
        observeServiceTelemetry()
        startReceiverService()
    }

    private fun setupInteractions() {
        binding.surfaceView.setOnTouchListener { _, event ->
            touchController.handleMotionEvent(event, binding.surfaceView.width, binding.surfaceView.height)
            true
        }

        binding.btnToggleMirroring.setOnClickListener {
            CarPlayReceiverService.toggleMirroringMode()
        }
    }

    private fun observeServiceTelemetry() {
        lifecycleScope.launch {
            CarPlayReceiverService.sessionState.collectLatest { state ->
                when (state) {
                    is CarPlaySessionState.Connected -> {
                        binding.tvStatus.text = "CarPlay Connected • ${state.fps} FPS"
                        binding.tvStatus.setTextColor(0xFF38BDF8.toInt())
                        binding.connectionPulse.visibility = View.VISIBLE
                    }
                    is CarPlaySessionState.Connecting -> {
                        binding.tvStatus.text = "Connecting to iPhone..."
                        binding.tvStatus.setTextColor(0xFFFBBF24.toInt())
                    }
                    is CarPlaySessionState.Disconnected -> {
                        binding.tvStatus.text = "Waiting for iPhone (USB / Wi-Fi)..."
                        binding.tvStatus.setTextColor(0xFF9CA3AF.toInt())
                        binding.connectionPulse.visibility = View.GONE
                    }
                    is CarPlaySessionState.Error -> {
                        binding.tvStatus.text = "Error: ${state.message}"
                        binding.tvStatus.setTextColor(0xFFEF4444.toInt())
                    }
                }
            }
        }
    }

    private fun startReceiverService() {
        val intent = Intent(this, CarPlayReceiverService::class.java)
        startForegroundService(intent)
    }

    override fun surfaceCreated(holder: SurfaceHolder) {
        videoDecoder = MediaCodecH264Decoder(holder.surface).apply {
            start()
            CarPlayReceiverService.attachVideoDecoder(this)
        }
    }

    override fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int) {
        videoDecoder?.onDisplayMetricsChanged(width, height)
    }

    override fun surfaceDestroyed(holder: SurfaceHolder) {
        CarPlayReceiverService.detachVideoDecoder()
        videoDecoder?.release()
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
}