import { z } from 'zod';

export const OverlayPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional()
});

export const OverlayStyleSchema = z.object({
  opacity: z.number().min(0).max(1),
  blendMode: z.enum([
    'normal', 'multiply', 'screen', 'overlay',
    'darken', 'lighten', 'color-dodge', 'color-burn'
  ]),
  borderRadius: z.number().optional(),
  shadow: z.object({
    color: z.string(),
    blur: z.number(),
    offsetX: z.number(),
    offsetY: z.number()
  }).optional()
});

export const TextContentSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  font: z.string(),
  size: z.number(),
  color: z.string(),
  alignment: z.enum(['left', 'center', 'right']),
  bold: z.boolean().optional(),
  italic: z.boolean().optional()
});

export const ImageContentSchema = z.object({
  type: z.literal('image'),
  url: z.string(),
  fit: z.enum(['contain', 'cover', 'fill']).optional()
});

export const ShapeContentSchema = z.object({
  type: z.literal('shape'),
  shape: z.enum(['rectangle', 'circle', 'triangle']),
  color: z.string(),
  strokeColor: z.string().optional(),
  strokeWidth: z.number().optional()
});

export const OverlaySchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'text', 'shape']),
  position: OverlayPositionSchema,
  style: OverlayStyleSchema,
  content: z.union([TextContentSchema, ImageContentSchema, ShapeContentSchema]),
  timing: z.object({
    start: z.number(),
    duration: z.number(),
    fadeIn: z.number().optional(),
    fadeOut: z.number().optional()
  }).optional()
});

export type OverlayPosition = z.infer<typeof OverlayPositionSchema>;
export type OverlayStyle = z.infer<typeof OverlayStyleSchema>;
export type TextContent = z.infer<typeof TextContentSchema>;
export type ImageContent = z.infer<typeof ImageContentSchema>;
export type ShapeContent = z.infer<typeof ShapeContentSchema>;
export type Overlay = z.infer<typeof OverlaySchema>;