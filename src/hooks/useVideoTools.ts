import { useState, useCallback } from 'react';
import { videoProcessor } from '../lib/video-tools';
import { useToast } from './useToast';
import {
  SmartCropSettings,
  VideoOverlay,
  ThumbnailSettings,
  VideoTransform,
  BackgroundRemovalSettings,
  ImageToVideoSettings,
  VideoGenerationSettings,
  PreviewSettings,
  PlayerSettings
} from '../types/video-tools';

interface UseVideoToolsOptions {
  onProgress?: (progress: number) => void;
}

export const useVideoTools = (options?: UseVideoToolsOptions) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { addToast } = useToast();

  const updateProgress = useCallback((value: number) => {
    setProgress(value);
    options?.onProgress?.(value);
  }, [options]);

  const smartCrop = useCallback(async (file: File, settings: SmartCropSettings) => {
    try {
      setProcessing(true);
      updateProgress(0);
      const result = await videoProcessor.smartCrop(file, settings);
      updateProgress(100);
      addToast({ title: 'Video cropped successfully', type: 'success' });
      return result;
    } catch (error) {
      addToast({
        title: 'Video cropping failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast, updateProgress]);

  const applyOverlays = useCallback(async (file: File, overlays: VideoOverlay[]) => {
    try {
      setProcessing(true);
      updateProgress(0);
      const result = await videoProcessor.applyOverlays(file, overlays);
      updateProgress(100);
      addToast({ title: 'Overlays applied successfully', type: 'success' });
      return result;
    } catch (error) {
      addToast({
        title: 'Failed to apply overlays',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast, updateProgress]);

  const generateThumbnails = useCallback(async (file: File, settings: ThumbnailSettings) => {
    try {
      setProcessing(true);
      updateProgress(0);
      const results = await videoProcessor.generateThumbnails(file, settings);
      updateProgress(100);
      addToast({ title: 'Thumbnails generated successfully', type: 'success' });
      return results;
    } catch (error) {
      addToast({
        title: 'Thumbnail generation failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast, updateProgress]);

  // Add other tool methods here...

  return {
    processing,
    progress,
    smartCrop,
    applyOverlays,
    generateThumbnails,
    // Export other methods...
  };
};