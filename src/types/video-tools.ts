import { z } from 'zod';

// Smart Crop Types
export const SmartCropSettingsSchema = z.object({
  mode: z.enum(['auto', 'face', 'object']),
  aspectRatio: z.enum(['16:9', '9:16', '4:3', '1:1']),
  width: z.number().min(100).max(4096),
  height: z.number().min(100).max(4096),
  focusPoint: z.enum(['center', 'face', 'custom']).optional(),
  customFocus: z.object({
    x: z.number(),
    y: z.number()
  }).optional()
});

export type SmartCropSettings = z.infer<typeof SmartCropSettingsSchema>;

// Video Overlay Types
export const VideoOverlaySchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'text', 'shape']),
  position: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  }),
  style: z.object({
    opacity: z.number().min(0).max(1),
    rotation: z.number(),
    blendMode: z.string(),
    borderRadius: z.number().optional()
  }),
  content: z.union([
    z.object({ type: z.literal('image'), url: z.string() }),
    z.object({ type: z.literal('text'), text: z.string(), font: z.string(), size: z.number() }),
    z.object({ type: z.literal('shape'), shape: z.string(), color: z.string() })
  ])
});

export type VideoOverlay = z.infer<typeof VideoOverlaySchema>;

// Auto Thumbnailing Types
export const ThumbnailSettingsSchema = z.object({
  count: z.number().min(1).max(20),
  interval: z.enum(['uniform', 'smart']),
  format: z.enum(['jpg', 'png', 'webp']),
  quality: z.number().min(1).max(100),
  size: z.object({
    width: z.number().min(100).max(4096),
    height: z.number().min(100).max(4096)
  }),
  detectKeyFrames: z.boolean()
});

export type ThumbnailSettings = z.infer<typeof ThumbnailSettingsSchema>;

// Video Transform Types
export const VideoTransformSchema = z.object({
  resize: z.object({
    width: z.number().optional(),
    height: z.number().optional(),
    mode: z.enum(['fit', 'fill', 'crop'])
  }),
  rotate: z.number().min(-360).max(360),
  flip: z.object({
    horizontal: z.boolean(),
    vertical: z.boolean()
  }),
  filters: z.array(z.object({
    type: z.string(),
    params: z.record(z.any())
  }))
});

export type VideoTransform = z.infer<typeof VideoTransformSchema>;

// Background Removal Types
export const BackgroundRemovalSettingsSchema = z.object({
  mode: z.enum(['auto', 'precise', 'fast']),
  refinement: z.enum(['none', 'light', 'medium', 'heavy']),
  feathering: z.number().min(0).max(100),
  threshold: z.number().min(0).max(100)
});

export type BackgroundRemovalSettings = z.infer<typeof BackgroundRemovalSettingsSchema>;

// Image to Video Types
export const ImageToVideoSettingsSchema = z.object({
  duration: z.number().min(1).max(60),
  fps: z.number().min(1).max(60),
  transition: z.object({
    type: z.enum(['fade', 'slide', 'zoom']),
    duration: z.number()
  }),
  motion: z.object({
    type: z.enum(['none', 'pan', 'zoom', 'kenBurns']),
    params: z.record(z.any())
  }),
  audio: z.object({
    enabled: z.boolean(),
    url: z.string().optional(),
    volume: z.number().min(0).max(100)
  })
});

export type ImageToVideoSettings = z.infer<typeof ImageToVideoSettingsSchema>;

// Video Generation Types
export const VideoGenerationSettingsSchema = z.object({
  resolution: z.object({
    width: z.number(),
    height: z.number()
  }),
  duration: z.number(),
  fps: z.number(),
  quality: z.enum(['draft', 'preview', 'production']),
  format: z.enum(['mp4', 'webm']),
  composition: z.array(z.object({
    type: z.enum(['video', 'image', 'text', 'shape']),
    start: z.number(),
    duration: z.number(),
    layer: z.number(),
    transform: z.record(z.any())
  }))
});

export type VideoGenerationSettings = z.infer<typeof VideoGenerationSettingsSchema>;

// Auto Preview Types
export const PreviewSettingsSchema = z.object({
  style: z.enum(['grid', 'filmstrip', 'storyboard']),
  frames: z.number().min(3).max(20),
  interval: z.enum(['uniform', 'smart']),
  layout: z.object({
    columns: z.number().min(1).max(6),
    gap: z.number()
  }),
  showTimestamps: z.boolean(),
  showCaptions: z.boolean()
});

export type PreviewSettings = z.infer<typeof PreviewSettingsSchema>;

// Video Player Studio Types
export const PlayerSettingsSchema = z.object({
  theme: z.enum(['default', 'minimal', 'custom']),
  controls: z.object({
    play: z.boolean(),
    seek: z.boolean(),
    volume: z.boolean(),
    fullscreen: z.boolean(),
    quality: z.boolean(),
    speed: z.boolean()
  }),
  autoplay: z.boolean(),
  loop: z.boolean(),
  muted: z.boolean(),
  responsive: z.boolean(),
  customStyles: z.record(z.any()).optional()
});

export type PlayerSettings = z.infer<typeof PlayerSettingsSchema>;