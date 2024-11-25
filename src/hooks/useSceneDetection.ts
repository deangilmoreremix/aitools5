import { useState, useCallback } from 'react';
import { SceneDetector } from '../lib/scene-detection';
import { SceneDetectionOptions, SceneDetectionResult } from '../types/scene';
import { useToast } from './useToast';

interface UseSceneDetectionOptions extends SceneDetectionOptions {
  onProgress?: (progress: number) => void;
}

export const useSceneDetection = (options?: UseSceneDetectionOptions) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SceneDetectionResult | null>(null);
  const { addToast } = useToast();

  const detector = new SceneDetector(options);

  const analyze = useCallback(async (file: File) => {
    try {
      setAnalyzing(true);
      setProgress(0);

      // Update progress
      const updateProgress = (value: number) => {
        setProgress(value);
        options?.onProgress?.(value);
      };

      updateProgress(10);

      // Perform scene detection
      const result = await detector.detectScenes(file);

      updateProgress(100);
      setResult(result);

      addToast({
        title: 'Scene detection completed',
        type: 'success'
      });

      return result;
    } catch (error) {
      addToast({
        title: 'Scene detection failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
      throw error;
    } finally {
      setAnalyzing(false);
    }
  }, [detector, options, addToast]);

  const reset = useCallback(() => {
    setAnalyzing(false);
    setProgress(0);
    setResult(null);
  }, []);

  return {
    analyze,
    analyzing,
    progress,
    result,
    reset
  };
};