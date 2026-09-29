package com.carplay.phonecast.usb

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
}