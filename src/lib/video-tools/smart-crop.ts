import { SmartCropSettings } from '../../types/video-tools';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { uploadToCloudinary } from '../cloudinary';

export class SmartCropProcessor {
  private ffmpeg: FFmpeg | null = null;
  private isLoaded = false;

  private async ensureLoaded() {
    if (!this.isLoaded) {
      this.ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm')
      });
      this.isLoaded = true;
    }
  }

  async cropVideo(file: File, settings: SmartCropSettings): Promise<string> {
    await this.ensureLoaded();
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    // Upload to Cloudinary for initial processing
    const result = await uploadToCloudinary(file, {
      resource_type: 'video',
      eager: [{
        width: settings.width,
        height: settings.height,
        crop: 'fill',
        gravity: this.getGravitySettings(settings)
      }],
      eager_async: true
    });

    return result.eager[0].secure_url;
  }

  private getGravitySettings(settings: SmartCropSettings) {
    switch (settings.mode) {
      case 'face':
        return 'face';
      case 'object':
        return 'auto:object';
      case 'auto':
      default:
        return 'auto';
    }
  }

  async analyzeFocusPoints(file: File): Promise<{ x: number; y: number }[]> {
    await this.ensureLoaded();
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    // Write file to FFmpeg's virtual filesystem
    const fileData = await file.arrayBuffer();
    await this.ffmpeg.writeFile('input.mp4', new Uint8Array(fileData));

    // Run scene detection to find focus points
    await this.ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', 'select=eq(pict_type\\,I)',
      '-vsync', '2',
      '-f', 'null', '-'
    ]);

    // In a real implementation, we would analyze the frames
    // For now, return a default center point
    return [{ x: 0.5, y: 0.5 }];
  }

  async generatePreview(file: File, settings: SmartCropSettings): Promise<string> {
    await this.ensureLoaded();
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    // Generate a preview frame with the crop overlay
    const result = await uploadToCloudinary(file, {
      resource_type: 'video',
      eager: [{
        width: settings.width,
        height: settings.height,
        crop: 'fill',
        gravity: this.getGravitySettings(settings),
        format: 'jpg'
      }],
      eager_async: false
    });

    return result.eager[0].secure_url;
  }
}

export const smartCropProcessor = new SmartCropProcessor();