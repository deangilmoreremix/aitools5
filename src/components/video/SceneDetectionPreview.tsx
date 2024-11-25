import React from 'react';
import { Scene } from '../../types/scene';
import { Button } from '../ui/Button';
import { Clock, Tag, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SceneDetectionPreviewProps {
  scenes: Scene[];
  onSceneClick?: (scene: Scene) => void;
  selectedSceneId?: string;
  className?: string;
}

const SceneDetectionPreview: React.FC<SceneDetectionPreviewProps> = ({
  scenes,
  onSceneClick,
  selectedSceneId,
  className
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {scenes.map((scene) => (
        <div
          key={scene.id}
          className={cn(
            "border border-gray-800 rounded-lg overflow-hidden transition-colors",
            selectedSceneId === scene.id && "border-red-500",
            onSceneClick && "cursor-pointer hover:border-red-500/50"
          )}
          onClick={() => onSceneClick?.(scene)}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="relative w-40 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
              <img
                src={scene.thumbnail}
                alt={`Scene at ${formatTime(scene.startTime)}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                <div className="flex items-center justify-between text-xs">
                  <span>{formatTime(scene.startTime)}</span>
                  <span>{formatTime(scene.endTime)}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  Duration: {formatTime(scene.endTime - scene.startTime)}
                </span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">
                  Confidence: {Math.round(scene.confidence * 100)}%
                </span>
              </div>

              {scene.description && (
                <p className="text-sm mb-2 line-clamp-2">{scene.description}</p>
              )}

              {scene.tags && scene.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {scene.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-800 rounded-full text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {onSceneClick && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      ))}

      {scenes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No scenes detected
        </div>
      )}
    </div>
  );
};

export default SceneDetectionPreview;