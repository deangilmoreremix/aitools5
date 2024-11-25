import { useState, useCallback } from 'react';
import { VideoOverlay } from '../types/video-overlay';
import { useToast } from './useToast';
import { uploadToCloudinary } from '../lib/cloudinary';

export const useVideoOverlay = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const applyOverlays = useCallback(async (file: File, overlays: VideoOverlay[]) => {
    try {
      setProcessing(true);
      setProgress(20);

      // Upload video to Cloudinary
      const result = await uploadToCloudinary(file);
      setProgress(50);

      // Build transformation string for overlays
      const transformations = overlays.map(overlay => {
        const base = {
          overlay: overlay.type === 'text' 
            ? `text:${overlay.content.font}_${overlay.content.size}:${overlay.content.text}`
            : overlay.type === 'image' 
            ? overlay.content.url 
            : `shape:${overlay.content.shape}`,
          color: overlay.type === 'text' || overlay.type === 'shape' 
            ? overlay.content.color.replace('#', '') 
            : undefined,
          opacity: Math.round(overlay.style.opacity * 100),
          blend: overlay.style.blendMode,
          width: overlay.position.width,
          height: overlay.position.height,
          x: overlay.position.x,
          y: overlay.position.y,
          angle: overlay.position.rotation
        };

        return Object.entries(base)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => `${key}_${value}`)
          .join(',');
      });

      // Apply transformations
      const processedUrl = result.secure_url.replace(
        '/upload/',
        `/upload/${transformations.join('/')}/`
      );

      setProgress(100);
      
      addToast({
        title: 'Overlays applied successfully',
        type: 'success'
      });

      return processedUrl;
    } catch (error) {
      addToast({
        title: 'Failed to apply overlays',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast]);

  return {
    applyOverlays,
    processing,
    progress
  };
};