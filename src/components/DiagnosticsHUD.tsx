import React from 'react';
import { 
  Activity, 
  Cpu, 
  Gauge, 
  Layers, 
  Wifi, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { CarPlayConnectionState, PipelineMetrics } from '../types/carplay';

interface DiagnosticsHUDProps {
  connectionState: CarPlayConnectionState;
  onSetConnectionState: (state: CarPlayConnectionState) => void;
  metrics: PipelineMetrics;
  onToggleVehicleMotion: () => void;
  onCycleThermalState: () => void;
}

export const DiagnosticsHUD: React.FC<DiagnosticsHUDProps> = ({
  connectionState,
  onSetConnectionState,
  metrics,
  onToggleVehicleMotion,
  onCycleThermalState
}) => {
  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 shadow-xl text-neutral-300">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-800 text-xs">
        {/* Pipeline Flow Visualization - Kotlin Engine */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono py-1">
          <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
            iPhone Host (H.264)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            UsbCarConnection (Kotlin)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-sky-950 text-sky-300 border border-sky-800">
            MediaCodec Low-Latency (Kotlin)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800">
            AudioTrack 48kHz (Kotlin)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
            Automotive SurfaceView (60 FPS)
          </span>
        </div>

        {/* Session Simulation Controls */}
        <div className="flex items-center gap-2">
          {/* Connection Simulator */}
          <div className="flex items-center gap-1 bg-neutral-850 p-1 rounded-lg border border-neutral-750 text-[11px]">
            <span className="text-neutral-400 px-1">CarPlay:</span>
            {(['Connected', 'Disconnected', 'Connecting', 'Reconnecting'] as CarPlayConnectionState[]).map((st) => (
              <button
                key={st}
                onClick={() => onSetConnectionState(st)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition ${
                  connectionState === st
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Vehicle Park / Drive Interlock Toggle */}
          <button
            onClick={onToggleVehicleMotion}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
              metrics.vehicleParked
                ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-750'
                : 'bg-amber-950/80 border-amber-700/80 text-amber-300 hover:bg-amber-900'
            }`}
          >
            {metrics.vehicleParked ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulate Driving</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Simulate Parked</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-3">
        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Pipeline FPS</span>
            <Activity className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {metrics.currentFps} <span className="text-xs text-neutral-500 font-normal">/ {metrics.targetFps}</span>
          </div>
        </div>

        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Latency</span>
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            {metrics.latencyMs.toFixed(1)} <span className="text-xs font-normal">ms</span>
          </div>
        </div>

        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Resolution</span>
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-white truncate font-mono mt-0.5">
            {metrics.resolution}
          </div>
        </div>

        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Bitrate</span>
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            {metrics.bitrateMbps.toFixed(1)} <span className="text-xs text-neutral-500 font-normal">Mbps</span>
          </div>
        </div>

        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Thermal State</span>
            <Flame className={`w-3.5 h-3.5 ${metrics.thermalState === 'nominal' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>
          <button 
            onClick={onCycleThermalState}
            className="text-left font-semibold capitalize text-sm font-mono hover:underline"
            title="Click to cycle thermal states"
          >
            <span className={metrics.thermalState === 'nominal' ? 'text-emerald-400' : 'text-amber-400'}>
              {metrics.thermalState}
            </span>
          </button>
        </div>

        <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-850">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
            <span>Safety Interlock</span>
            {metrics.vehicleParked ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            )}
          </div>
          <div className={`text-xs font-bold uppercase mt-1 ${metrics.vehicleParked ? 'text-emerald-400' : 'text-amber-400'}`}>
            {metrics.vehicleParked ? 'Parked (Full Media)' : 'Driving (Audio Only)'}
          </div>
        </div>
      </div>
    </div>
  );
};
