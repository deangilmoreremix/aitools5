import React, { useRef, useEffect } from 'react';
import { VideoOverlay } from '../../../types/video-overlay';
import { Button } from '../../ui/Button';
import { Play, Pause, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OverlayTimelineProps {
  overlays: VideoOverlay[];
  duration: number;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onOverlayUpdate: (overlay: VideoOverlay) => void;
  className?: string;
}

const OverlayTimeline: React.FC<OverlayTimelineProps> = ({
  overlays,
  duration,
  currentTime,
  onTimeUpdate,
  onOverlayUpdate,
  className
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const time = (x / rect.width) * duration;
      onTimeUpdate(time);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [duration, onTimeUpdate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTimeUpdate(Math.max(0, currentTime - 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTimeUpdate(Math.min(duration, currentTime + 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span>{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div
        ref={timelineRef}
        className="relative h-8 bg-gray-800 rounded-lg cursor-pointer"
        onMouseDown={(e) => {
          if (!timelineRef.current) return;
          isDragging.current = true;
          const rect = timelineRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const time = (x / rect.width) * duration;
          onTimeUpdate(time);
        }}
      >
        {/* Time indicator */}
        <div
          className="absolute top-0 bottom-0 bg-red-500/20"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />

        {/* Overlay markers */}
        {overlays.map((overlay) => {
          if (!overlay.timing) return null;
          const startPercent = (overlay.timing.start / duration) * 100;
          const widthPercent = (overlay.timing.duration / duration) * 100;

          return (
            <div
              key={overlay.id}
              className="absolute top-0 h-2 bg-red-500 rounded-full"
              style={{
                left: `${startPercent}%`,
                width: `${widthPercent}%`
              }}
            />
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* Overlay tracks */}
      <div className="space-y-2">
        {overlays.map((overlay) => (
          <div
            key={overlay.id}
            className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg"
          >
            <div className="w-20 text-sm truncate">
              {overlay.type === 'text' 
                ? overlay.content.text 
                : overlay.type}
            </div>
            <div className="flex-1 relative h-6 bg-gray-700 rounded">
              {overlay.timing && (
                <div
                  className="absolute top-0 bottom-0 bg-red-500/30 rounded"
                  style={{
                    left: `${(overlay.timing.start / duration) * 100}%`,
                    width: `${(overlay.timing.duration / duration) * 100}%`
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverlayTimeline;