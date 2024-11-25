import { z } from 'zod';

export const ThumbnailOptionsSchema = z.object({
  count: z.number().min(1).max(20),
  layout: z.enum(['grid', 'filmstrip', 'storyboard']),
  interval: z.enum(['uniform', 'smart']),
  size: z.object({
    width: z.number().min(100).max(3840),
    height: z.number().min(100).max(2160)
  }),
  quality: z.number().min(1).max(100),
  format: z.enum(['jpg', 'png', 'webp']),
  includeTimestamps: z.boolean(),
  smartDetection: z.boolean()
});

export type ThumbnailOptions = z.infer<typeof ThumbnailOptionsSchema>;

export interface ThumbnailResult {
  url: string;
  timestamp: number;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}