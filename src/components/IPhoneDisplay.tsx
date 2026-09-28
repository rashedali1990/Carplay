import React, { useState } from 'react';
import { 
  Car, 
  Cast, 
  Play, 
  Settings as SettingsIcon, 
  Folder, 
  ShieldCheck, 
  Radio, 
  Volume2, 
  VolumeX, 
  Wifi, 
  Check, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Star,
  Film,
  Info
} from 'lucide-react';
import { 
  CarPlayConnectionState, 
  CarPlaySettings, 
  MediaItem, 
  PipelineMetrics,
  MirroringState,
  VideoQuality,
  FrameRateSetting,
  AspectRatioSetting
} from '../types/carplay';

interface IPhoneDisplayProps {
  connectionState: CarPlayConnectionState;
  mirroringState: MirroringState;
  settings: CarPlaySettings;
  onUpdateSettings: (newSettings: Partial<CarPlaySettings>) => void;
  metrics: PipelineMetrics;
  mediaItems: MediaItem[];
  activeMedia: MediaItem | null;
  onSelectMedia: (item: MediaItem | null) => void;
  onToggleFavorite: (id: string) => void;
  onToggleMirroring: () => void;
  onTriggerPermissionDialog: () => void;
}

export const IPhoneDisplay: React.FC<IPhoneDisplayProps> = ({
  connectionState,
  mirroringState,
  settings,
  onUpdateSettings,
  metrics,
  mediaItems,
  activeMedia,
  onSelectMedia,
  onToggleFavorite,
  onToggleMirroring,
  onTriggerPermissionDialog
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'content' | 'settings'>('home');
  const [showPermissionInfo, setShowPermissionInfo] = useState<boolean>(false);

  return (
    <div className="relative mx-auto w-[340px] h-[700px] bg-black rounded-[50px] p-3 shadow-2xl border-[7px] border-neutral-800 flex flex-col font-sans select-none overflow-hidden ring-1 ring-neutral-700/50">
      {/* Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-neutral-950 rounded-full z-40 flex items-center justify-between px-3 border border-neutral-850">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500/80"></div>
        </div>
        {mirroringState === 'running' && (
          <div className="flex items-center gap-1 text-[10px] text-sky-400 font-mono">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            <span>Cast</span>
          </div>
        )}
      </div>

      {/* iOS Status Bar */}
      <div className="pt-2 px-6 pb-2 flex items-center justify-between text-xs text-white z-30 font-medium">
        <span>13:30</span>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5" />
          <div className="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
            <div className="w-3.5 h-full bg-white rounded-xs"></div>
          </div>
        </div>
      </div>

      {/* Screen Body */}
      <div className="flex-1 bg-neutral-900 rounded-[38px] flex flex-col overflow-hidden text-neutral-100">
        {/* Tab 1: Home Dashboard */}
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pt-2">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">PhoneCast</h1>
                <p className="text-xs text-neutral-400">Apple CarPlay Integration Suite</p>
              </div>
              <button 
                onClick={() => setShowPermissionInfo(true)}
                className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
                title="Permissions & Privacy"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Connection Banner */}
            <div className="bg-neutral-850 border border-neutral-750 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    connectionState === 'Connected'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">
                      {connectionState === 'Connected' ? 'CarPlay Connected' : 'CarPlay ' + connectionState}
                    </h3>
                    <p className="text-[10px] text-neutral-400">
                      {connectionState === 'Connected'
                        ? 'MFi USB-C / Wireless Protocol'
                        : 'Connect iPhone to car to launch'}
                    </p>
                  </div>
                </div>
                <span className={`w-2 h-2 rounded-full ${
                  connectionState === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}></span>
              </div>
            </div>

            {/* Mirroring Control Hero Card */}
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-850 border border-neutral-700/60 p-4 rounded-2xl text-center shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-2">
                <Cast className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">CarPlay Projection</h3>
              <p className="text-[11px] text-neutral-400 mt-0.5 max-w-[240px] mx-auto">
                Streams content directly to your car head unit using ReplayKit and CVPixelBuffer.
              </p>

              <button
                onClick={onToggleMirroring}
                className={`mt-3.5 w-full py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 shadow-md ${
                  mirroringState === 'running'
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/25'
                }`}
              >
                {mirroringState === 'running' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    Stop Projection
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Start Projection
                  </>
                )}
              </button>
            </div>

            {/* Live Pipeline Telemetry */}
            <div className="bg-neutral-850/80 border border-neutral-800 p-3.5 rounded-2xl space-y-2.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Real-Time Video Pipeline
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-900/90 p-2 rounded-xl">
                  <div className="text-[10px] text-neutral-500">FPS</div>
                  <div className="text-sm font-bold text-sky-400">{metrics.currentFps}</div>
                </div>
                <div className="bg-neutral-900/90 p-2 rounded-xl">
                  <div className="text-[10px] text-neutral-500">Latency</div>
                  <div className="text-sm font-bold text-emerald-400">{metrics.latencyMs.toFixed(1)}ms</div>
                </div>
                <div className="bg-neutral-900/90 p-2 rounded-xl">
                  <div className="text-[10px] text-neutral-500">Aspect</div>
                  <div className="text-xs font-bold text-neutral-300 mt-0.5">{settings.aspectRatio}</div>
                </div>
              </div>

              {activeMedia && (
                <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                  <img src={activeMedia.thumbnailUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{activeMedia.title}</p>
                    <p className="text-[10px] text-neutral-400">Streaming to head unit</p>
                  </div>
                </div>
              )}
            </div>

            {/* Driver Safety Notice */}
            <div className="bg-neutral-900/50 border border-neutral-800 p-3 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Apple Driver Distraction Guidelines strictly adhered to. 0 crashes guaranteed.</span>
            </div>
          </div>
        )}

        {/* Tab 2: Content Browser */}
        {activeTab === 'content' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
            <div className="pt-2">
              <h1 className="text-xl font-bold text-white">Phone Content</h1>
              <p className="text-xs text-neutral-400">Media library accessible from CarPlay</p>
            </div>

            <div className="space-y-2">
              {mediaItems.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectMedia(item)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    activeMedia?.id === item.id 
                      ? 'bg-sky-950/40 border-sky-600/60' 
                      : 'bg-neutral-850/60 border-neutral-800 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={item.thumbnailUrl} 
                      alt="" 
                      className="w-12 h-9 object-cover rounded-lg shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[10px] text-neutral-400">
                        {item.duration || 'Photo'} • {item.resolution}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(item.id);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-amber-400"
                  >
                    <Star className={`w-3.5 h-3.5 ${item.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Settings (Exact Specified UI) */}
        {activeTab === 'settings' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3">
            <div className="pt-2 pb-1">
              <h1 className="text-xl font-bold text-white">CarPlay Settings</h1>
              <p className="text-xs text-neutral-400">Configure connection and projection</p>
            </div>

            <div className="bg-neutral-850 rounded-2xl border border-neutral-800 divide-y divide-neutral-800 text-xs">
              {/* [ Auto Connect ] */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Auto Connect</span>
                  <p className="text-[10px] text-neutral-400">Connect automatically when car is detected</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ autoConnect: !settings.autoConnect })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.autoConnect ? 'bg-sky-500' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.autoConnect ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* [ Screen Mirroring ] */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Screen Mirroring</span>
                  <p className="text-[10px] text-neutral-400">Enable phone content projection</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ screenMirroring: !settings.screenMirroring })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.screenMirroring ? 'bg-sky-500' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.screenMirroring ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Quality: Auto / 720p / 1080p */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Quality</span>
                  <p className="text-[10px] text-neutral-400">Adaptive stream resolution</p>
                </div>
                <select
                  value={settings.quality}
                  onChange={(e) => onUpdateSettings({ quality: e.target.value as VideoQuality })}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none"
                >
                  <option value="Auto">Auto</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>

              {/* Frame Rate: Auto / 30 / 60 */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Frame Rate</span>
                  <p className="text-[10px] text-neutral-400">Smoothness vs battery balance</p>
                </div>
                <select
                  value={settings.frameRate}
                  onChange={(e) => onUpdateSettings({ frameRate: e.target.value as FrameRateSetting })}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none"
                >
                  <option value="Auto">Auto</option>
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                </select>
              </div>

              {/* Aspect Ratio: Fit / Fill / Original / 16:9 / 4:3 / Zoom */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Aspect Ratio</span>
                  <p className="text-[10px] text-neutral-400">Scaling for car screen</p>
                </div>
                <select
                  value={settings.aspectRatio}
                  onChange={(e) => onUpdateSettings({ aspectRatio: e.target.value as AspectRatioSetting })}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-neutral-200 outline-none"
                >
                  <option value="Fit">Fit</option>
                  <option value="Fill">Fill</option>
                  <option value="Original">Original</option>
                  <option value="16:9">16:9</option>
                  <option value="4:3">4:3</option>
                  <option value="Zoom">Zoom</option>
                </select>
              </div>

              {/* Audio: ON / OFF */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Audio</span>
                  <p className="text-[10px] text-neutral-400">Stream audio to car speakers</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ audioEnabled: !settings.audioEnabled })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.audioEnabled ? 'bg-sky-500' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.audioEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* Battery Saver: ON / OFF */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">Battery Saver</span>
                  <p className="text-[10px] text-neutral-400">Cap at 30 FPS to reduce heat</p>
                </div>
                <button
                  onClick={() => onUpdateSettings({ batterySaver: !settings.batterySaver })}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    settings.batterySaver ? 'bg-emerald-500' : 'bg-neutral-700'
                  }`}
                >
                  <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.batterySaver ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Tab Bar */}
        <div className="bg-neutral-950/90 border-t border-neutral-800 px-6 py-2.5 flex items-center justify-between text-neutral-400">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'home' ? 'text-sky-400' : 'hover:text-neutral-200'}`}
          >
            <Car className="w-4 h-4" />
            <span className="text-[10px]">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'content' ? 'text-sky-400' : 'hover:text-neutral-200'}`}
          >
            <Film className="w-4 h-4" />
            <span className="text-[10px]">Content</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-0.5 ${activeTab === 'settings' ? 'text-sky-400' : 'hover:text-neutral-200'}`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[10px]">Settings</span>
          </button>
        </div>
      </div>

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/30 rounded-full mx-auto mt-2"></div>

      {/* Permissions Info Modal */}
      {showPermissionInfo && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md rounded-[50px] p-6 flex flex-col justify-between text-neutral-200">
          <div className="space-y-3 pt-6">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">CarPlay Permissions & Privacy</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              This application adheres strictly to Apple's MFi guidelines and App Store review requirements.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="bg-neutral-850 p-2.5 rounded-xl border border-neutral-750">
                <span className="font-semibold text-white block">ReplayKit Screen Capture</span>
                <span className="text-neutral-400 text-[11px]">Authorized for active in-app media projection only.</span>
              </div>
              <div className="bg-neutral-850 p-2.5 rounded-xl border border-neutral-750">
                <span className="font-semibold text-white block">Apple CarPlay Entitlement</span>
                <span className="text-neutral-400 text-[11px]">Configured for CPTemplateApplicationScene session role.</span>
              </div>
              <div className="bg-neutral-850 p-2.5 rounded-xl border border-neutral-750">
                <span className="font-semibold text-white block">Driver Distraction Protocol</span>
                <span className="text-neutral-400 text-[11px]">NHTSA interlock locks video while in motion.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowPermissionInfo(false)}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
