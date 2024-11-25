import { useState, useCallback } from 'react';
import { ThumbnailOptions } from '../types/thumbnail';
import { useToast } from './useToast';
import { uploadToCloudinary } from '../lib/cloudinary';

export const useThumbnailGenerator = () => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbnails, setThumbnails] = useState<{ url: string; timestamp: number }[] | null>(null);
  const { addToast } = useToast();

  const generateThumbnails = useCallback(async (file: File, options: ThumbnailOptions) => {
    try {
      setProcessing(true);
      setProgress(0);

      // Upload video to Cloudinary
      const result = await uploadToCloudinary(file);
      setProgress(30);

      // Calculate timestamps
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      await new Promise((resolve) => {
        video.onloadedmetadata = resolve;
      });

      const duration = video.duration;
      const timestamps = options.interval === 'uniform'
        ? Array.from({ length: options.count }, (_, i) => i * (duration / (options.count - 1)))
        : await detectKeyFrames(file, options.count);

      setProgress(50);

      // Generate thumbnails
      const thumbnails = await Promise.all(
        timestamps.map(async (timestamp, index) => {
          const transformation = [
            `w_${options.size.width}`,
            `h_${options.size.height}`,
            'c_fill',
            `q_${options.quality}`,
            `so_${timestamp}`,
            options.smartDetection && 'g_auto',
            `f_${options.format}`
          ].filter(Boolean).join(',');

          const thumbnailUrl = result.secure_url.replace(
            '/upload/',
            `/upload/${transformation}/`
          );

          setProgress(50 + ((index + 1) / timestamps.length) * 50);

          return {
            url: thumbnailUrl,
            timestamp
          };
        })
      );

      setThumbnails(thumbnails);
      setProgress(100);

      addToast({
        title: 'Thumbnails generated successfully',
        type: 'success'
      });

      return thumbnails;
    } catch (error) {
      addToast({
        title: 'Failed to generate thumbnails',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
      throw error;
    } finally {
      setProcessing(false);
    }
  }, [addToast]);

  const reset = useCallback(() => {
    setProcessing(false);
    setProgress(0);
    setThumbnails(null);
  }, []);

  return {
    generateThumbnails,
    processing,
    progress,
    thumbnails,
    reset
  };
};

// Helper function to detect key frames using scene detection
async function detectKeyFrames(file: File, count: number): Promise<number[]> {
  // This would typically use more sophisticated scene detection
  // For now, return evenly spaced timestamps
  const video = document.createElement('video');
  video.src = URL.createObjectURL(file);
  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  const duration = video.duration;
  return Array.from(
    { length: count },
    (_, i) => i * (duration / (count - 1))
  );
}