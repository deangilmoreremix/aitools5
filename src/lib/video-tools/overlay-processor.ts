import { Overlay } from '../../types/overlay';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { uploadToCloudinary } from '../cloudinary';

export class OverlayProcessor {
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

  async applyOverlays(videoFile: File, overlays: Overlay[]): Promise<string> {
    await this.ensureLoaded();
    if (!this.ffmpeg) throw new Error('FFmpeg not initialized');

    // Upload video to Cloudinary
    const videoResult = await uploadToCloudinary(videoFile, {
      resource_type: 'video'
    });

    // Upload any image overlays
    const imageOverlays = overlays.filter(o => o.type === 'image');
    const imageUploadPromises = imageOverlays.map(async overlay => {
      if (overlay.type !== 'image') return null;
      const response = await fetch(overlay.content.url);
      const blob = await response.blob();
      const file = new File([blob], 'overlay.png', { type: 'image/png' });
      const result = await uploadToCloudinary(file);
      return {
        overlayId: overlay.id,
        publicId: result.public_id
      };
    });

    const uploadedImages = await Promise.all(imageUploadPromises);

    // Build transformation string
    const transformations = overlays.map(overlay => {
      const base = {
        x: overlay.position.x,
        y: overlay.position.y,
        width: overlay.position.width,
        height: overlay.position.height,
        opacity: overlay.style.opacity,
        blendMode: overlay.style.blendMode
      };

      switch (overlay.type) {
        case 'text':
          return {
            ...base,
            overlay: {
              font_family: overlay.content.font,
              font_size: overlay.content.size,
              text: overlay.content.text,
              color: overlay.content.color
            }
          };

        case 'image':
          const uploadedImage = uploadedImages.find(img => img?.overlayId === overlay.id);
          return {
            ...base,
            overlay: uploadedImage?.publicId
          };

        case 'shape':
          return {
            ...base,
            overlay: {
              type: overlay.content.shape,
              color: overlay.content.color,
              stroke: overlay.content.strokeColor,
              stroke_width: overlay.content.strokeWidth
            }
          };
      }
    });

    // Apply transformations through Cloudinary
    const result = await uploadToCloudinary(videoFile, {
      resource_type: 'video',
      eager: [{
        raw_transformation: transformations.map(t => 
          Object.entries(t)
            .map(([key, value]) => `${key}_${value}`)
            .join(',')
        ).join('/')
      }]
    });

    return result.eager[0].secure_url;
  }

  async generatePreview(videoFile: File, overlays: Overlay[]): Promise<string> {
    // Generate a preview frame with overlays
    const result = await uploadToCloudinary(videoFile, {
      resource_type: 'video',
      eager: [{
        format: 'jpg',
        transformation: [
          { width: 1280, crop: 'scale' },
          ...overlays.map(overlay => ({
            overlay: this.getOverlayTransformation(overlay),
            width: overlay.position.width,
            height: overlay.position.height,
            x: overlay.position.x,
            y: overlay.position.y,
            opacity: overlay.style.opacity,
            blend: overlay.style.blendMode
          }))
        ]
      }]
    });

    return result.eager[0].secure_url;
  }

  private getOverlayTransformation(overlay: Overlay) {
    switch (overlay.type) {
      case 'text':
        return {
          font_family: overlay.content.font,
          font_size: overlay.content.size,
          text: overlay.content.text,
          color: overlay.content.color.replace('#', '')
        };

      case 'shape':
        return {
          resource_type: 'raw',
          public_id: `shapes/${overlay.content.shape}`,
          format: 'svg',
          color: overlay.content.color.replace('#', '')
        };

      default:
        return overlay.content.url;
    }
  }
}

export const overlayProcessor = new OverlayProcessor();