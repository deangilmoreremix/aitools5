import React, { useRef, useEffect } from 'react';
import { SmartCropSettings } from '../../types/video-tools';
import { cn } from '../../lib/utils';

interface SmartCropPreviewProps {
  file: File;
  settings: SmartCropSettings;
  className?: string;
}

const SmartCropPreview: React.FC<SmartCropPreviewProps> = ({
  file,
  settings,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set video source
    video.src = URL.createObjectURL(file);
    video.muted = true;

    const drawPreview = () => {
      if (!video || !canvas || !ctx) return;

      // Calculate aspect ratios
      const videoRatio = video.videoWidth / video.videoHeight;
      const targetRatio = settings.width / settings.height;

      // Calculate dimensions to maintain aspect ratio
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (videoRatio > targetRatio) {
        // Video is wider than target
        drawWidth = drawHeight * videoRatio;
        offsetX = -(drawWidth - canvas.width) / 2;
      } else {
        // Video is taller than target
        drawHeight = drawWidth / videoRatio;
        offsetY = -(drawHeight - canvas.height) / 2;
      }

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw video frame
      ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

      // Draw crop overlay
      const cropWidth = canvas.width;
      const cropHeight = (canvas.width * settings.height) / settings.width;
      const cropY = (canvas.height - cropHeight) / 2;

      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, cropY); // Top
      ctx.fillRect(0, cropY + cropHeight, canvas.width, cropY); // Bottom

      // Crop border
      ctx.strokeStyle = '#FF0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, cropY, cropWidth, cropHeight);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;

      // Vertical thirds
      for (let i = 1; i < 3; i++) {
        const x = (cropWidth * i) / 3;
        ctx.beginPath();
        ctx.moveTo(x, cropY);
        ctx.lineTo(x, cropY + cropHeight);
        ctx.stroke();
      }

      // Horizontal thirds
      for (let i = 1; i < 3; i++) {
        const y = cropY + (cropHeight * i) / 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cropWidth, y);
        ctx.stroke();
      }

      // Request next frame
      requestAnimationFrame(drawPreview);
    };

    video.addEventListener('play', drawPreview);
    video.play();

    return () => {
      video.removeEventListener('play', drawPreview);
      URL.revokeObjectURL(video.src);
    };
  }, [file, settings]);

  return (
    <div className={cn("relative bg-gray-900 rounded-lg overflow-hidden", className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 opacity-0"
        muted
        loop
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="w-full h-full"
      />
    </div>
  );
};

export default SmartCropPreview;