import { z } from 'zod';

export const VideoOverlayPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional()
});

export const VideoOverlayStyleSchema = z.object({
  opacity: z.number().min(0).max(1),
  blendMode: z.enum([
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn'
  ])
});

export const VideoOverlayContentSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('image'),
    url: z.string()
  }),
  z.object({
    type: z.literal('text'),
    text: z.string(),
    font: z.string(),
    size: z.number(),
    color: z.string()
  }),
  z.object({
    type: z.literal('shape'),
    shape: z.enum(['rectangle', 'circle', 'triangle']),
    color: z.string()
  })
]);

export const VideoOverlaySchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'text', 'shape']),
  position: VideoOverlayPositionSchema,
  style: VideoOverlayStyleSchema,
  content: VideoOverlayContentSchema,
  timing: z.object({
    start: z.number(),
    duration: z.number()
  }).optional()
});

export type VideoOverlayPosition = z.infer<typeof VideoOverlayPositionSchema>;
export type VideoOverlayStyle = z.infer<typeof VideoOverlayStyleSchema>;
export type VideoOverlayContent = z.infer<typeof VideoOverlayContentSchema>;
export type VideoOverlay = z.infer<typeof VideoOverlaySchema>;