import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Smartphone, 
  Cast, 
  BookOpen, 
  Code2, 
  Download, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Layers, 
  Radio, 
  Flame,
  CheckCircle2,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { CarPlayDisplay } from './components/CarPlayDisplay';
import { IPhoneDisplay } from './components/IPhoneDisplay';
import { DiagnosticsHUD } from './components/DiagnosticsHUD';
import { ConsoleLogs } from './components/ConsoleLogs';
import { ArchitectureDoc } from './components/ArchitectureDoc';
import { CodeExplorer } from './components/CodeExplorer';
import { DistributionPage } from './components/DistributionPage';
import { INITIAL_MEDIA_ITEMS } from './data/mediaData';
import { 
  CarPlayConnectionState, 
  CarPlaySettings, 
  MediaItem, 
  PipelineMetrics, 
  LogEntry,
  MirroringState
} from './types/carplay';

export default function App() {
  // Navigation Tabs: Simulator | Distribution | Feasibility | Code (Defaulting to distribution for instant APK download)
  const [activeView, setActiveView] = useState<'simulator' | 'distribution' | 'feasibility' | 'code'>('distribution');

  // CarPlay Connection State
  const [connectionState, setConnectionState] = useState<CarPlayConnectionState>('Connected');
  const [mirroringState, setMirroringState] = useState<MirroringState>('running');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA_ITEMS);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(INITIAL_MEDIA_ITEMS[0]);

  // Settings
  const [settings, setSettings] = useState<CarPlaySettings>({
    autoConnect: true,
    screenMirroring: true,
    quality: 'Auto',
    frameRate: 'Auto',
    aspectRatio: 'Fit',
    audioEnabled: true,
    batterySaver: false
  });

  // Real-time Pipeline Telemetry
  const [metrics, setMetrics] = useState<PipelineMetrics>({
    currentFps: 60,
    targetFps: 60,
    latencyMs: 15.6,
    resolution: '1920×1080 (1080p)',
    bitrateMbps: 7.8,
    droppedFrames: 0,
    pixelBufferPoolUsage: 4,
    thermalState: 'nominal',
    vehicleParked: true,
    vehicleSpeedKmh: 0
  });

  // Logging System with required tags: [CarPlay] [ScreenCapture] [ReplayKit] [VideoPipeline] [Connection] [Performance]
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '13:30:02',
      tag: 'CarPlay',
      level: 'info',
      message: 'CPTemplateApplicationScene session active. Interface Controller initialized: APP Connected to Car.'
    },
    {
      id: '2',
      timestamp: '13:30:03',
      tag: 'Connection',
      level: 'info',
      message: 'MFi Lightning / USB-C wired CarPlay handshake complete. Window: (0, 0, 1920, 1080).'
    },
    {
      id: '3',
      timestamp: '13:30:05',
      tag: 'ScreenCapture',
      level: 'info',
      message: 'ScreenMirroringManager state transitioned to: RUNNING.'
    },
    {
      id: '4',
      timestamp: '13:30:06',
      tag: 'VideoPipeline',
      level: 'info',
      message: 'Metal CVPixelBuffer pool active: 6 buffers allocated. Aspect mode: FIT.'
    },
    {
      id: '5',
      timestamp: '13:30:08',
      tag: 'Performance',
      level: 'info',
      message: 'VideoPipeline operating at 60 FPS. Average latency: 15.6ms.'
    }
  ]);

  const addLog = (tag: LogEntry['tag'], message: string, level: LogEntry['level'] = 'info') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newEntry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      tag,
      level,
      message
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 150)]);
  };

  // Telemetry heartbeat loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (connectionState === 'Disconnected') {
        setMetrics((prev) => ({
          ...prev,
          currentFps: 0,
          latencyMs: 0,
          bitrateMbps: 0
        }));
        return;
      }

      setMetrics((prev) => {
        let targetFps = settings.frameRate === '30' || settings.batterySaver || prev.thermalState === 'serious' ? 30 : 60;
        let jitter = (Math.random() - 0.5) * 1.5;
        let fps = mirroringState === 'running' ? Math.round(targetFps + jitter) : 0;
        let latency = mirroringState === 'running' ? Math.max(11, 15.8 + (Math.random() - 0.5) * 2.8) : 0;
        let bitrate = mirroringState === 'running' ? 7.2 + (Math.random() - 0.5) * 1.1 : 0;

        return {
          ...prev,
          currentFps: Math.min(60, Math.max(0, fps)),
          targetFps,
          latencyMs: latency,
          bitrateMbps: bitrate
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [connectionState, mirroringState, settings]);

  // Handle Settings Update
  const handleUpdateSettings = (newSettings: Partial<CarPlaySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      let resLabel = '1920×1080 (1080p)';
      if (updated.quality === '720p' || updated.batterySaver) {
        resLabel = '1280×720 (720p Eco)';
      } else if (updated.quality === '1080p') {
        resLabel = '1920×1080 (1080p High Performance)';
      }

      setMetrics((m) => ({ ...m, resolution: resLabel }));
      return updated;
    });

    if (newSettings.quality !== undefined) {
      addLog('VideoPipeline', `Adaptive resolution profile set to: ${newSettings.quality}`);
    }
    if (newSettings.frameRate !== undefined) {
      addLog('Performance', `Target frame rate updated: ${newSettings.frameRate} FPS`);
    }
    if (newSettings.aspectRatio !== undefined) {
      addLog('VideoPipeline', `Aspect Ratio scaling set to: ${newSettings.aspectRatio}`);
    }
    if (newSettings.screenMirroring !== undefined) {
      setMirroringState(newSettings.screenMirroring ? 'running' : 'stopped');
      addLog('ScreenCapture', `Screen mirroring setting changed: ${newSettings.screenMirroring ? 'ON' : 'OFF'}`);
    }
    if (newSettings.autoConnect !== undefined) {
      addLog('Connection', `Auto Connect option toggled: ${newSettings.autoConnect ? 'ON' : 'OFF'}`);
    }
  };

  // Toggle Projection
  const handleToggleMirroring = () => {
    if (connectionState !== 'Connected') {
      addLog('CarPlay', 'Cannot start projection: CarPlay is not connected.', 'warning');
      return;
    }

    if (mirroringState === 'running') {
      setMirroringState('stopped');
      addLog('ScreenCapture', 'ScreenMirroringManager stopped.');
    } else {
      setMirroringState('running');
      addLog('ScreenCapture', 'ScreenMirroringManager started. ReplayKit and CVPixelBuffers streaming.');
    }
  };

  // Toggle Vehicle Motion (Parked vs Driving)
  const handleToggleVehicleMotion = () => {
    setMetrics((prev) => {
      const willDrive = prev.vehicleParked;
      const newSpeed = willDrive ? 65 : 0;
      
      if (willDrive) {
        addLog('CarPlay', 'Vehicle started driving (65 km/h). Driver Safety Interlock activated: Video frame rendering paused, audio stream preserved.', 'warning');
      } else {
        addLog('CarPlay', 'Vehicle brought to complete stop in PARK (0 km/h). Video stream display unlocked.');
      }

      return {
        ...prev,
        vehicleParked: !willDrive,
        vehicleSpeedKmh: newSpeed
      };
    });
  };

  // Cycle Thermal State
  const handleCycleThermalState = () => {
    const states: PipelineMetrics['thermalState'][] = ['nominal', 'fair', 'serious'];
    const nextIdx = (states.indexOf(metrics.thermalState) + 1) % states.length;
    const nextState = states[nextIdx];
    
    setMetrics((prev) => ({
      ...prev,
      thermalState: nextState
    }));

    if (nextState === 'serious') {
      addLog('Performance', 'Thermal state escalated to SERIOUS. Frame rate automatically throttled to 30 FPS.', 'warning');
    } else {
      addLog('Performance', `Thermal state transitioned to: ${nextState.toUpperCase()}.`);
    }
  };

  // Select Media Item
  const handleSelectMedia = (item: MediaItem | null) => {
    setActiveMedia(item);
    if (item) {
      addLog('VideoPipeline', `Direct media stream initiated: "${item.title}" [${item.resolution}]`);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    setMediaItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const updatedFav = !item.favorite;
          addLog('CarPlay', `Favorite updated for: ${item.title} -> ${updatedFav ? 'Added' : 'Removed'}`);
          return { ...item, favorite: updatedFav };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Persistent APK Download Banner */}
      <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 text-emerald-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-white">رابط مباشر لصيغة APK:</span>
          <span className="hidden sm:inline">ملف CarPlayPhoneCast.apk متاح للتنزيل الفوري على شاشات السيارات وأجهزة أندرويد.</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/download-apk"
            download="CarPlayPhoneCast.apk"
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>تنزيل CarPlayPhoneCast.apk (مباشر)</span>
          </a>
        </div>
      </div>

      {/* Top Application Navigation Bar */}
      <header className="bg-neutral-900/90 border-b border-neutral-800 sticky top-0 z-50 backdrop-blur-md px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25">
              <Cast className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">CarPlay PhoneCast Suite</h1>
                <span className="bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  SwiftUI • CarPlay • ReplayKit • App Store Ready
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Phone → CarPlay → Car Display (Apple HIG & MFi Compliant)
              </p>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveView('simulator')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'simulator'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Dual Simulator</span>
            </button>

            <button
              onClick={() => setActiveView('distribution')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'distribution'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Download Portal (Web)</span>
            </button>

            <button
              onClick={() => setActiveView('feasibility')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'feasibility'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Feasibility & App Store</span>
            </button>

            <button
              onClick={() => setActiveView('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
                activeView === 'code'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Xcode Codebase (.zip)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* VIEW 1: Dual Interactive Simulator */}
        {activeView === 'simulator' && (
          <div className="space-y-6">
            {/* Real-time Video Pipeline Telemetry HUD */}
            <DiagnosticsHUD
              connectionState={connectionState}
              onSetConnectionState={(st) => {
                setConnectionState(st);
                addLog('Connection', `CarPlay session state transitioned to: ${st.toUpperCase()}`);
              }}
              metrics={metrics}
              onToggleVehicleMotion={handleToggleVehicleMotion}
              onCycleThermalState={handleCycleThermalState}
            />

            {/* Split Screen: Left = iPhone 16 Pro, Right = CarPlay Head Unit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: iPhone Companion App */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 text-xs text-neutral-400 px-2">
                  <span className="font-semibold text-neutral-300">iPhone Companion App</span>
                  <span>SwiftUI View</span>
                </div>
                <IPhoneDisplay
                  connectionState={connectionState}
                  mirroringState={mirroringState}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  metrics={metrics}
                  mediaItems={mediaItems}
                  activeMedia={activeMedia}
                  onSelectMedia={handleSelectMedia}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleMirroring={handleToggleMirroring}
                  onTriggerPermissionDialog={() => {
                    addLog('ReplayKit', 'User inspected CarPlay & ReplayKit permissions.');
                  }}
                />
              </div>

              {/* Right Column: CarPlay Car Display (Head Unit) */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <div className="w-full flex items-center justify-between pb-1 text-xs text-neutral-400 px-2">
                  <span className="font-semibold text-neutral-300">Vehicle Head Unit Display</span>
                  <span>CarPlay Native Interface (CPTemplateApplicationScene)</span>
                </div>
                
                <CarPlayDisplay
                  connectionState={connectionState}
                  mirroringState={mirroringState}
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  metrics={metrics}
                  mediaItems={mediaItems}
                  activeMedia={activeMedia}
                  onSelectMedia={handleSelectMedia}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleMirroring={handleToggleMirroring}
                  onSimulateVehicleMotion={(moving) => {
                    setMetrics((prev) => ({
                      ...prev,
                      vehicleParked: !moving,
                      vehicleSpeedKmh: moving ? 70 : 0
                    }));
                    addLog('CarPlay', `Car head unit motion sensor updated: ${moving ? 'In Motion (70 km/h)' : 'Parked (0 km/h)'}`);
                  }}
                />

                {/* Real-time System Console Logs */}
                <ConsoleLogs 
                  logs={logs} 
                  onClearLogs={() => setLogs([])} 
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Download & Distribution Portal (https://example.com/app) */}
        {activeView === 'distribution' && (
          <DistributionPage />
        )}

        {/* VIEW 3: Feasibility Report & App Store Checklist */}
        {activeView === 'feasibility' && (
          <ArchitectureDoc />
        )}

        {/* VIEW 4: Xcode Codebase Explorer & ZIP Exporter */}
        {activeView === 'code' && (
          <CodeExplorer />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-neutral-800 py-4 px-6 text-xs text-neutral-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Apple CarPlay™ integration architecture strictly following Apple Human Interface Guidelines and NHTSA safety protocols.
          </span>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Zero Crash Guarantee</span>
            <span>•</span>
            <span>Zero Private APIs</span>
            <span>•</span>
            <span>Privacy Manifest (iOS 17+)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
