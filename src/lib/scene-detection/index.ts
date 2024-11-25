import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { Scene, SceneDetectionOptions, SceneDetectionResult } from '../../types/scene';
import { uploadToCloudinary } from '../cloudinary';

const DEFAULT_OPTIONS: SceneDetectionOptions = {
  minSceneDuration: 2,
  threshold: 0.3,
  detectContent: true,
  generateThumbnails: true,
  thumbnailWidth: 320,
  thumbnailHeight: 180
};

let ffmpeg: FFmpeg | null = null;

export class SceneDetector {
  private isLoaded = false;

  constructor(private options: SceneDetectionOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  private async ensureLoaded() {
    if (!this.isLoaded) {
      if (!ffmpeg) {
        ffmpeg = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await ffmpeg.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
        });
      }
      this.isLoaded = true;
    }
  }

  async detectScenes(file: File): Promise<SceneDetectionResult> {
    await this.ensureLoaded();
    if (!ffmpeg) throw new Error('FFmpeg not initialized');

    // Write file to FFmpeg's virtual filesystem
    const fileData = await file.arrayBuffer();
    await ffmpeg.writeFile('input.mp4', new Uint8Array(fileData));

    // Run scene detection command
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', `select='gt(scene,${this.options.threshold})',metadata=print:file=scenes.txt`,
      '-f', 'null', '-'
    ]);

    // Read scene detection results
    const scenesData = await ffmpeg.readFile('scenes.txt');
    const scenes = this.parseSceneData(scenesData);

    // Generate thumbnails if enabled
    if (this.options.generateThumbnails) {
      await this.generateThumbnails(scenes);
    }

    // Upload video to Cloudinary for content analysis if enabled
    if (this.options.detectContent) {
      await this.analyzeContent(scenes, file);
    }

    // Get video metadata
    const metadata = await this.getVideoMetadata(file);

    return {
      scenes,
      duration: metadata.duration,
      totalScenes: scenes.length,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        fps: metadata.fps,
        format: metadata.format
      }
    };
  }

  private async generateThumbnails(scenes: Scene[]) {
    if (!ffmpeg) throw new Error('FFmpeg not initialized');

    for (const scene of scenes) {
      await ffmpeg.exec([
        '-ss', scene.startTime.toString(),
        '-i', 'input.mp4',
        '-vframes', '1',
        '-s', `${this.options.thumbnailWidth}x${this.options.thumbnailHeight}`,
        '-f', 'image2',
        `thumb_${scene.id}.jpg`
      ]);

      const thumbnailData = await ffmpeg.readFile(`thumb_${scene.id}.jpg`);
      const thumbnailBlob = new Blob([thumbnailData.buffer], { type: 'image/jpeg' });
      const thumbnailFile = new File([thumbnailBlob], `thumb_${scene.id}.jpg`, { type: 'image/jpeg' });

      // Upload thumbnail to Cloudinary
      const result = await uploadToCloudinary(thumbnailFile);
      scene.thumbnail = result.secure_url;
    }
  }

  private async analyzeContent(scenes: Scene[], file: File) {
    // Upload video to Cloudinary with AI content analysis
    const result = await uploadToCloudinary(file, {
      resource_type: 'video',
      eager: [
        { raw_transformation: 'w_500,h_500,c_pad,e_adv_face,e_adv_eyes' }
      ],
      eager_async: true,
      categorization: 'aws_rek_tagging'
    });

    // Update scenes with AI analysis results
    scenes.forEach(scene => {
      scene.tags = result.info?.categorization?.data?.tags || [];
      scene.description = result.info?.categorization?.data?.description;
    });
  }

  private async getVideoMetadata(file: File): Promise<{
    duration: number;
    width: number;
    height: number;
    fps: number;
    format: string;
  }> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          fps: 30, // Default value as it's not directly accessible
          format: file.type.split('/')[1]
        });
      };
      
      video.src = URL.createObjectURL(file);
    });
  }

  private parseSceneData(data: Uint8Array): Scene[] {
    const text = new TextDecoder().decode(data);
    const lines = text.split('\n');
    const scenes: Scene[] = [];

    let currentTime = 0;
    lines.forEach(line => {
      if (line.includes('pts_time:')) {
        const timestamp = parseFloat(line.split('pts_time:')[1]);
        if (timestamp - currentTime >= (this.options.minSceneDuration || 0)) {
          scenes.push({
            id: Math.random().toString(36).substr(2, 9),
            startTime: currentTime,
            endTime: timestamp,
            thumbnail: '',
            confidence: Math.random(), // In practice, this would come from actual analysis
            tags: []
          });
          currentTime = timestamp;
        }
      }
    });

    return scenes;
  }
}