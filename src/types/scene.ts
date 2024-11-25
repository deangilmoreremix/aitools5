export interface Scene {
  id: string;
  startTime: number;
  endTime: number;
  thumbnail: string;
  confidence: number;
  tags: string[];
  description?: string;
}

export interface SceneDetectionResult {
  scenes: Scene[];
  duration: number;
  totalScenes: number;
  metadata: {
    width: number;
    height: number;
    fps: number;
    format: string;
  };
}

export interface SceneDetectionOptions {
  minSceneDuration?: number;
  threshold?: number;
  detectContent?: boolean;
  generateThumbnails?: boolean;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export interface SceneAnalysis {
  type: 'motion' | 'content' | 'audio';
  confidence: number;
  description?: string;
  tags?: string[];
  timestamp: number;
}