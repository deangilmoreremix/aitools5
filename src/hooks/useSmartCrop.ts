import { useState, useCallback } from 'react';
import { SmartCropSettings } from '../types/video-tools';
import { useToast } from './useToast';
import { videoProcessor } from '../lib/video-tools';

interface UseSmartCropOptions {
  onProgress?: (progress: number) => void;
}

export const useSmartCrop = (options?: UseSmartCropOptions) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const { addToast } = useToast();

  const updateProgress = useCallback((value: number) => {
    setProgress(value);
    options?.onProgress?.(value);
  }, [options]);

  const cropVideo = useCallback(async (file: File, settings: SmartCropSettings) => {
    try {
      setProcessing(true);
      updateProgress(0);

      // Initial processing
      updateProgress(20);

      // Process the video
      const result = await videoProcessor.smartCrop(file, settings);
      
      updateProgress(100);
      setResult(result);
      
      addToast({
        title: 'Video cropped successfully',
        type: 'success'
      });

      return result;
    } catch (error) {
      addToast({
        title: 'Video cropping failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast, updateProgress]);

  const reset = useCallback(() => {
    setProcessing(false);
    setProgress(0);
    setResult(null);
  }, []);

  return {
    cropVideo,
    processing,
    progress,
    result,
    reset
  };
};