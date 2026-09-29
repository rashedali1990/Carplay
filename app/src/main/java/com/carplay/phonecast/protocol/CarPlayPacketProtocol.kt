package com.carplay.phonecast.protocol

/**
 * Binary Packet Framing Protocol for CarPlay PhoneCast in Kotlin
 */
class CarPlayPacketProtocol {

    companion object {
        const val TYPE_VIDEO: Byte = 0x01
        const val TYPE_AUDIO: Byte = 0x02
        const val TYPE_TOUCH: Byte = 0x03
        const val TYPE_HEARTBEAT: Byte = 0x04
        const val TYPE_CONTROL: Byte = 0x05
    }

    data class Packet(
        val type: Byte,
        val payload: ByteArray
    )

    fun parsePacket(data: ByteArray): Packet? {
        if (data.size < 4) return null
        val type = data[0]
        val payload = data.copyOfRange(4, data.size)
        return Packet(type, payload)
    }

    fun buildTouchPacket(normX: Float, normY: Float, action: Int): ByteArray {
        val buffer = java.nio.ByteBuffer.allocate(16)
        buffer.put(TYPE_TOUCH)
        buffer.put(0.toByte())
        buffer.put(0.toByte())
        buffer.put(0.toByte())
        buffer.putFloat(normX)
        buffer.putFloat(normY)
        buffer.putInt(action)
        return buffer.array()
    }
}