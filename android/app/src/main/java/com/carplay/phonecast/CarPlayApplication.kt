package com.carplay.phonecast

import android.app.Application
import android.util.Log
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob

/**
 * CarPlay PhoneCast - Automotive Kotlin Application
 * Initializes low-latency video decoding and vehicle integration.
 */
class CarPlayApplication : Application() {

    companion object {
        const val TAG = "CarPlayPhoneCast"
        lateinit var instance: CarPlayApplication
            private set
    }

    private val applicationScope = CoroutineScope(
        SupervisorJob() + Dispatchers.Default + CoroutineExceptionHandler { _, throwable ->
            Log.e(TAG, "Unhandled coroutine exception in CarPlay engine", throwable)
        }
    )

    override fun onCreate() {
        super.onCreate()
        instance = this
        Log.i(TAG, "CarPlay PhoneCast Kotlin Engine initialized for Android Automotive & Car Screens.")
    }
}