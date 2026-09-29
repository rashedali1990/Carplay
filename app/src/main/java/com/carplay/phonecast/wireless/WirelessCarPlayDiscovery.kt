package com.carplay.phonecast.wireless

import android.content.Context
import android.net.nsd.NsdManager
import android.net.nsd.NsdServiceInfo
import android.util.Log

/**
 * Kotlin Wireless CarPlay Discovery via Android NsdManager (Bonjour/mDNS)
 */
class WirelessCarPlayDiscovery(private val context: Context) {

    companion object {
        private const val TAG = "WirelessCarPlayDiscovery"
        private const val SERVICE_TYPE = "_carplay._tcp."
        private const val SERVICE_NAME = "CarPlay-PhoneCast-Auto"
        private const val CARPLAY_PORT = 7000
    }

    private val nsdManager = context.getSystemService(Context.NSD_SERVICE) as NsdManager

    private val registrationListener = object : NsdManager.RegistrationListener {
        override fun onServiceRegistered(serviceInfo: NsdServiceInfo) {
            Log.i(TAG, "Bonjour CarPlay service successfully registered: ${serviceInfo.serviceName}")
        }

        override fun onRegistrationFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
            Log.e(TAG, "Bonjour registration failed with error code: $errorCode")
        }

        override fun onServiceUnregistered(serviceInfo: NsdServiceInfo) {
            Log.i(TAG, "Bonjour CarPlay service unregistered.")
        }

        override fun onUnregistrationFailed(serviceInfo: NsdServiceInfo, errorCode: Int) {
            Log.e(TAG, "Bonjour unregistration failed: $errorCode")
        }
    }

    fun startBonjourAdvertising() {
        val serviceInfo = NsdServiceInfo().apply {
            serviceName = SERVICE_NAME
            serviceType = SERVICE_TYPE
            port = CARPLAY_PORT
        }

        try {
            nsdManager.registerService(serviceInfo, NsdManager.PROTOCOL_DNS_SD, registrationListener)
        } catch (e: Exception) {
            Log.e(TAG, "Error registering Bonjour service", e)
        }
    }

    fun stopBonjourAdvertising() {
        try {
            nsdManager.unregisterService(registrationListener)
        } catch (e: Exception) {
            Log.w(TAG, "Error unregistering Bonjour service: ${e.message}")
        }
    }
}