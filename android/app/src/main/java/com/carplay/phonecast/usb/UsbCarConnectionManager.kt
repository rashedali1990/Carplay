package com.carplay.phonecast.usb

import android.content.Context
import android.hardware.usb.UsbAccessory
import android.hardware.usb.UsbManager
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.FileInputStream
import java.io.FileOutputStream

/**
 * Kotlin USB Accessory and USB Host Controller
 * Communicates with iPhone host over high-speed USB pipeline.
 */
class UsbCarConnectionManager(
    private val context: Context,
    private val onDataReceived: (ByteArray) -> Unit
) {
    companion object {
        private const val TAG = "UsbCarConnectionManager"
        private const val BUFFER_SIZE = 32768
    }

    private val usbManager = context.getSystemService(Context.USB_SERVICE) as UsbManager
    private var inStream: FileInputStream? = null
    private var outStream: FileOutputStream? = null
    @Volatile private var isListening = false

    suspend fun startListening() = withContext(Dispatchers.IO) {
        val accessories = usbManager.accessoryList
        if (!accessories.isNullOrEmpty()) {
            openAccessory(accessories[0])
        } else {
            Log.d(TAG, "Waiting for USB Accessory attachment...")
        }
    }

    private fun openAccessory(accessory: UsbAccessory) {
        val pfd = usbManager.openAccessory(accessory) ?: return
        val fd = pfd.fileDescriptor
        inStream = FileInputStream(fd)
        outStream = FileOutputStream(fd)
        isListening = true

        Thread({
            val buffer = ByteArray(BUFFER_SIZE)
            while (isListening) {
                try {
                    val bytesRead = inStream?.read(buffer) ?: -1
                    if (bytesRead > 0) {
                        onDataReceived(buffer.copyOf(bytesRead))
                    }
                } catch (e: Exception) {
                    Log.w(TAG, "USB Read terminated: ${e.message}")
                    break
                }
            }
        }, "UsbCar-ReaderThread").start()
    }

    fun stopListening() {
        isListening = false
        inStream?.close()
        outStream?.close()
    }
}