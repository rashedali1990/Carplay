export type CarPlayConnectionState = 
  | 'Connected'
  | 'Disconnected'
  | 'Connecting'
  | 'Reconnecting'
  | 'Error';

export type MirroringState =
  | 'idle'
  | 'starting'
  | 'running'
  | 'paused'
  | 'stopped'
  | 'error'
  | 'unsupported';

export type VideoQuality = 'Auto' | '720p' | '1080p';
export type FrameRateSetting = 'Auto' | '30' | '60';
export type AspectRatioSetting = 'Fit' | 'Fill' | 'Original' | '16:9' | '4:3' | 'Zoom';

export interface CarPlaySettings {
  autoConnect: boolean;
  screenMirroring: boolean;
  quality: VideoQuality;
  frameRate: FrameRateSetting;
  aspectRatio: AspectRatioSetting;
  audioEnabled: boolean;
  batterySaver: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'videos' | 'photos' | 'media' | 'favorites' | 'recent';
  duration?: string;
  resolution: string;
  thumbnailUrl: string;
  videoUrl?: string;
  aspectRatio: number;
  dateAdded: string;
  favorite: boolean;
}

export interface PipelineMetrics {
  currentFps: number;
  targetFps: number;
  latencyMs: number;
  resolution: string;
  bitrateMbps: number;
  droppedFrames: number;
  pixelBufferPoolUsage: number;
  thermalState: 'nominal' | 'fair' | 'serious' | 'critical';
  vehicleParked: boolean;
  vehicleSpeedKmh: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  tag: 'CarPlay' | 'ScreenCapture' | 'ReplayKit' | 'VideoPipeline' | 'Connection' | 'Performance';
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
}
