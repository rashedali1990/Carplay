package com.carplay.phonecast

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
}