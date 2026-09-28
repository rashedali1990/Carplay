import React, { useState } from 'react';
import { 
  Play, 
  Image as ImageIcon, 
  Film, 
  Star, 
  Settings as SettingsIcon,
  ChevronRight, 
  ArrowLeft, 
  ShieldAlert, 
  Cast, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  CarPlayConnectionState, 
  CarPlaySettings, 
  MediaItem, 
  PipelineMetrics,
  MirroringState
} from '../types/carplay';

interface CarPlayDisplayProps {
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
  onSimulateVehicleMotion: (moving: boolean) => void;
}

export const CarPlayDisplay: React.FC<CarPlayDisplayProps> = ({
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
  onSimulateVehicleMotion
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedGridIndex, setSelectedGridIndex] = useState<number>(0);
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);

  // Exact 5 Buttons requested:
  // [ Videos ] [ Photos ] [ Media ] [ Favorites ] [ Settings ]
  const gridButtons = [
    { id: 'videos', title: 'Videos', icon: Play, count: mediaItems.filter(m => m.category === 'videos').length },
    { id: 'photos', title: 'Photos', icon: ImageIcon, count: mediaItems.filter(m => m.category === 'photos').length },
    { id: 'media', title: 'Media', icon: Film, count: mediaItems.length },
    { id: 'favorites', title: 'Favorites', icon: Star, count: mediaItems.filter(m => m.favorite).length },
    { id: 'settings', title: 'Settings', icon: SettingsIcon, count: null },
  ];

  const handleGridClick = (categoryId: string, index: number) => {
    setSelectedGridIndex(index);
    setActiveCategory(categoryId);
  };

  const getFilteredItems = () => {
    if (!activeCategory) return [];
    if (activeCategory === 'videos') return mediaItems.filter(m => m.category === 'videos');
    if (activeCategory === 'photos') return mediaItems.filter(m => m.category === 'photos');
    if (activeCategory === 'favorites') return mediaItems.filter(m => m.favorite);
    return mediaItems;
  };

  // Compute CSS aspect ratio or class
  const getAspectRatioStyle = () => {
    switch (settings.aspectRatio) {
      case '16:9': return 'aspect-video object-contain';
      case '4:3': return 'aspect-[4/3] object-contain';
      case 'Fill': return 'w-full h-full object-cover';
      case 'Fit': return 'w-full h-full object-contain';
      case 'Original': return 'max-h-full max-w-full object-contain';
      case 'Zoom': return 'w-full h-full object-cover scale-110';
      default: return 'w-full h-full object-contain';
    }
  };

  return (
    <div className="flex flex-col bg-neutral-950 rounded-2xl border-4 border-neutral-800 shadow-2xl overflow-hidden font-sans select-none">
      {/* Head Unit Outer Frame Top Bar */}
      <div className="bg-neutral-900/90 px-4 py-2 flex items-center justify-between border-b border-neutral-800 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${connectionState === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="font-semibold text-neutral-200">CAR DISPLAY (Apple CarPlay Head Unit)</span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400 font-mono text-[11px]">CPTemplateApplicationScene</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-neutral-800 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300">
            {metrics.resolution} @ {metrics.currentFps} FPS
          </span>
          <button 
            onClick={() => onSimulateVehicleMotion(!metrics.vehicleParked)}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition flex items-center gap-1.5 ${
              metrics.vehicleParked 
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
            }`}
            title="Toggle vehicle motion to test driver distraction interlock"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {metrics.vehicleParked ? 'Gear: PARK (0 km/h)' : `DRIVING (${metrics.vehicleSpeedKmh} km/h)`}
          </button>
        </div>
      </div>

      {/* Main Screen Body */}
      <div className="relative flex h-[390px] bg-black text-white overflow-hidden">
        {/* CarPlay Sidebar (Left dock matching Apple CarPlay UI) */}
        <div className="w-16 bg-neutral-950/95 border-r border-neutral-900 flex flex-col items-center justify-between py-4 z-20 shrink-0">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-neutral-200">13:30</span>
            <div className="flex items-end gap-0.5 h-3" title="5G Signal">
              <span className="w-0.5 h-1 bg-white rounded-full"></span>
              <span className="w-0.5 h-1.5 bg-white rounded-full"></span>
              <span className="w-0.5 h-2 bg-white rounded-full"></span>
              <span className="w-0.5 h-3 bg-white rounded-full"></span>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">5G</span>
          </div>

          {/* Quick App Dock Icons */}
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={() => { setActiveCategory(null); onSelectMedia(null); }}
              className={`p-2 rounded-xl transition ${!activeCategory && !activeMedia ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              title="CarPlay Root Template"
            >
              <Cast className="w-5 h-5 text-sky-400" />
            </button>
            <button 
              onClick={() => setShowStatusModal(true)}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-300 transition"
              title="CarPlay Telemetry"
            >
              <Sliders className="w-5 h-5" />
            </button>
          </div>

          {/* Apple CarPlay Circular Home Button */}
          <button 
            onClick={() => { setActiveCategory(null); onSelectMedia(null); }}
            className="w-10 h-10 rounded-full border-2 border-neutral-600 flex items-center justify-center hover:border-white transition group"
            title="CarPlay Home"
          >
            <div className="w-4 h-4 rounded-sm border-2 border-neutral-400 group-hover:border-white"></div>
          </button>
        </div>

        {/* CarPlay Display Canvas Area */}
        <div className="flex-1 flex flex-col bg-neutral-950 relative overflow-hidden">
          {connectionState === 'Disconnected' ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-600">
                <Cast className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-300">CarPlay Disconnected</h3>
              <p className="text-sm text-neutral-500 max-w-sm mt-1">
                Connect your iPhone via USB-C or Wireless CarPlay to launch PhoneCast.
              </p>
            </div>
          ) : (
            <>
              {/* Top CarPlay Header - Exactly 'APP Connected to Car' */}
              <div className="px-6 py-3 border-b border-neutral-900/80 flex items-center justify-between bg-neutral-950/70 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  {activeCategory || activeMedia ? (
                    <button 
                      onClick={() => {
                        if (activeMedia) {
                          onSelectMedia(null);
                        } else {
                          setActiveCategory(null);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                  ) : null}

                  {/* App Title */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow">
                      <Cast className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xs uppercase tracking-wider text-neutral-300 font-bold">
                        {activeCategory ? activeCategory.toUpperCase() : 'APP Connected to Car'}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {mirroringState === 'running' && (
                    <span className="flex items-center gap-1.5 text-xs text-sky-400 bg-sky-950/50 border border-sky-800/60 px-2 py-0.5 rounded-full font-medium">
                      <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
                      Live Stream
                    </span>
                  )}
                  <button 
                    onClick={onToggleMirroring}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      mirroringState === 'running' 
                        ? 'bg-red-950 text-red-300 border border-red-800 hover:bg-red-900' 
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-750'
                    }`}
                  >
                    {mirroringState === 'running' ? 'Stop Projection' : 'Start Projection'}
                  </button>
                </div>
              </div>

              {/* Main Content View */}
              <div className="flex-1 overflow-y-auto p-5 relative">
                {/* 1. Main Grid Template View: [ Videos ] [ Photos ] [ Media ] [ Favorites ] [ Settings ] */}
                {!activeCategory && !activeMedia && (
                  <div className="h-full flex flex-col justify-center">
                    <div className="text-center mb-5">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">
                        APP Connected to Car
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto w-full">
                      {gridButtons.map((btn, index) => {
                        const Icon = btn.icon;
                        const isFocused = selectedGridIndex === index;
                        return (
                          <button
                            key={btn.id}
                            onClick={() => handleGridClick(btn.id, index)}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-150 group border ${
                              isFocused 
                                ? 'bg-neutral-800/90 border-neutral-600 shadow-lg scale-102' 
                                : 'bg-neutral-900/60 border-neutral-850 hover:bg-neutral-850 hover:border-neutral-700'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition ${
                              btn.id === 'favorites' 
                                ? 'bg-amber-500/20 text-amber-400' 
                                : btn.id === 'settings'
                                ? 'bg-neutral-700/30 text-neutral-300'
                                : 'bg-sky-500/20 text-sky-400'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-semibold text-neutral-200 tracking-tight group-hover:text-white">
                              {btn.title}
                            </span>
                            <span className="text-[10px] text-neutral-500 mt-0.5">
                              {btn.count !== null ? `${btn.count} items` : 'Options'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-8 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                      <span>Dark Mode • Minimal • Driver Distraction Compliant</span>
                    </div>
                  </div>
                )}

                {/* 2. CPListTemplate View when category is clicked */}
                {activeCategory && activeCategory !== 'settings' && !activeMedia && (
                  <div className="space-y-2 max-w-xl mx-auto">
                    <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-neutral-900">
                      <span>{activeCategory.toUpperCase()} ({getFilteredItems().length})</span>
                      <span>Tap to stream to car head unit</span>
                    </div>
                    {getFilteredItems().length === 0 ? (
                      <div className="text-center py-12 text-neutral-500 text-sm">
                        No content in this category. Add items from the iPhone companion app.
                      </div>
                    ) : (
                      getFilteredItems().map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => onSelectMedia(item)}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-850 hover:bg-neutral-800 hover:border-neutral-700 cursor-pointer transition"
                        >
                          <div className="flex items-center gap-3.5">
                            <img 
                              src={item.thumbnailUrl} 
                              alt={item.title} 
                              className="w-14 h-10 object-cover rounded-lg border border-neutral-800 shrink-0" 
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-neutral-200">{item.title}</h4>
                              <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                                <span>{item.duration || 'Photo'}</span>
                                <span>•</span>
                                <span>{item.resolution}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleFavorite(item.id);
                              }}
                              className="p-2 text-neutral-500 hover:text-amber-400"
                            >
                              <Star className={`w-4 h-4 ${item.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                            </button>
                            <ChevronRight className="w-5 h-5 text-neutral-600" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. CarPlay Settings Template View */}
                {activeCategory === 'settings' && !activeMedia && (
                  <div className="space-y-3 max-w-lg mx-auto text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-900 text-neutral-400">
                      <span>CARPLAY QUICK SETTINGS</span>
                      <span>Synced with iPhone</span>
                    </div>

                    <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
                      <div className="p-3 flex items-center justify-between">
                        <span>Quality Profile</span>
                        <span className="font-semibold text-sky-400">{settings.quality}</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span>Frame Rate Target</span>
                        <span className="font-semibold text-sky-400">{settings.frameRate} FPS</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span>Aspect Ratio Mode</span>
                        <span className="font-semibold text-sky-400">{settings.aspectRatio}</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span>Audio Channel</span>
                        <span className="font-semibold text-emerald-400">{settings.audioEnabled ? 'Active' : 'Muted'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Active Stream / Media Player Screen */}
                {activeMedia && (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-900 text-xs">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onSelectMedia(null)}
                          className="text-neutral-400 hover:text-white flex items-center gap-1"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" /> Back to list
                        </button>
                        <span className="text-neutral-600">|</span>
                        <span className="font-semibold text-neutral-200 truncate max-w-xs">{activeMedia.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <span className="font-mono text-[11px] bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                          {settings.aspectRatio.toUpperCase()}
                        </span>
                        <span>{settings.audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-600" />}</span>
                      </div>
                    </div>

                    {/* Stream Canvas */}
                    <div className="flex-1 relative mt-2 bg-neutral-950 rounded-xl overflow-hidden flex items-center justify-center border border-neutral-900">
                      {/* Driver Safety Warning Interlock if car is moving */}
                      {!metrics.vehicleParked ? (
                        <div className="absolute inset-0 z-30 bg-neutral-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3">
                            <ShieldAlert className="w-8 h-8" />
                          </div>
                          <h4 className="text-base font-bold text-neutral-100">Driver Safety Interlock Active</h4>
                          <p className="text-xs text-neutral-400 max-w-md mt-1 leading-relaxed">
                            Video playback is locked while driving ({metrics.vehicleSpeedKmh} km/h).
                            Audio stream remains active via car speakers.
                          </p>
                          <div className="mt-4 flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-800 text-[11px] text-neutral-300">
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                            Audio stream active via CarPlay sound system
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative group">
                          <img 
                            src={activeMedia.thumbnailUrl} 
                            alt={activeMedia.title}
                            className={`transition-all duration-300 ${getAspectRatioStyle()}`}
                          />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-300 font-mono">
                            Metal CVPixelBuffer Stream
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* D-Pad / Rotary Controller Simulator */}
      <div className="bg-neutral-900 px-6 py-2.5 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="font-medium text-neutral-300">Car Controller / Rotary Knob:</span>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setSelectedGridIndex((prev) => Math.max(0, prev - 1))}
              className="px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-750 text-neutral-200 border border-neutral-700"
            >
              ◀ Left
            </button>
            <button 
              onClick={() => setSelectedGridIndex((prev) => Math.min(gridButtons.length - 1, prev + 1))}
              className="px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-750 text-neutral-200 border border-neutral-700"
            >
              Right ▶
            </button>
            <button 
              onClick={() => {
                if (!activeCategory) {
                  handleGridClick(gridButtons[selectedGridIndex].id, selectedGridIndex);
                }
              }}
              className="px-3 py-1 rounded bg-sky-900/60 hover:bg-sky-800/80 text-sky-200 border border-sky-700 font-semibold"
            >
              Press Select ⏺
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-neutral-500">
            Current Focused Element: <strong className="text-neutral-300">{gridButtons[selectedGridIndex].title}</strong>
          </span>
        </div>
      </div>

      {/* CarPlay Telemetry Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-neutral-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                CarPlay Scene Telemetry
              </h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Scene Session Role:</span>
                <span className="font-mono text-white">CPTemplateApplicationScene</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Mirroring State:</span>
                <span className="font-semibold text-sky-400 uppercase">{mirroringState}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Display Resolution:</span>
                <span className="font-mono text-white">{metrics.resolution}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Pipeline Latency:</span>
                <span className="font-mono text-emerald-400 font-semibold">{metrics.latencyMs.toFixed(1)} ms</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-neutral-800/60">
                <span className="text-neutral-400">Driver Safety Interlock:</span>
                <span className={metrics.vehicleParked ? 'text-emerald-400' : 'text-amber-400 font-bold'}>
                  {metrics.vehicleParked ? 'Parked (Safe)' : 'Active (Restricted)'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowStatusModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition"
            >
              Close Telemetry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
