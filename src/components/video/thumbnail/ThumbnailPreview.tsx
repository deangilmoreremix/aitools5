import React from 'react';
import { Button } from '../../ui/Button';
import { Download, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface Thumbnail {
  url: string;
  timestamp: number;
}

interface ThumbnailPreviewProps {
  thumbnails: Thumbnail[];
  layout: 'grid' | 'filmstrip' | 'storyboard';
  includeTimestamps?: boolean;
  className?: string;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  thumbnails,
  layout,
  includeTimestamps = true,
  className
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "grid gap-4",
          layout === 'grid' && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          layout === 'filmstrip' && "grid-cols-1",
          layout === 'storyboard' && "grid-cols-2"
        )}
      >
        {thumbnails.map((thumb, index) => (
          <div
            key={index}
            className="group relative border border-gray-800 rounded-lg overflow-hidden bg-gray-900"
          >
            <img
              src={thumb.url}
              alt={`Thumbnail ${index + 1}`}
              className={cn(
                "w-full object-cover",
                layout === 'grid' && "aspect-video",
                layout === 'filmstrip' && "h-24",
                layout === 'storyboard' && "aspect-[16/10]"
              )}
            />
            
            {includeTimestamps && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(thumb.timestamp)}</span>
                  </div>
                  <span>#{index + 1}</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="sm"
                as="a"
                href={thumb.url}
                download={`thumbnail-${index + 1}.jpg`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThumbnailPreview;