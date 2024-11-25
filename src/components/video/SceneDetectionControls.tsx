import React from 'react';
import { SceneDetectionOptions } from '../../types/scene';
import { Button } from '../ui/Button';
import { Sliders, Video, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SceneDetectionControlsProps {
  options: SceneDetectionOptions;
  onChange: (options: SceneDetectionOptions) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  className?: string;
}

const SceneDetectionControls: React.FC<SceneDetectionControlsProps> = ({
  options,
  onChange,
  onAnalyze,
  isAnalyzing,
  className
}) => {
  const updateOption = <K extends keyof SceneDetectionOptions>(
    key: K,
    value: SceneDetectionOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Detection Settings
        </h3>
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Video'}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Minimum Scene Duration: {options.minSceneDuration}s
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={options.minSceneDuration}
            onChange={(e) => updateOption('minSceneDuration', Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Short scenes</span>
            <span>Long scenes</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Detection Threshold: {options.threshold}
          </label>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.1}
            value={options.threshold}
            onChange={(e) => updateOption('threshold', Number(e.target.value))}
            className="w-full accent-red-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>More scenes</span>
            <span>Fewer scenes</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.detectContent}
              onChange={(e) => updateOption('detectContent', e.target.checked)}
              className="rounded border-gray-700 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm">Enable content detection</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.generateThumbnails}
              onChange={(e) => updateOption('generateThumbnails', e.target.checked)}
              className="rounded border-gray-700 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm">Generate thumbnails</span>
          </label>
        </div>

        {options.generateThumbnails && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Width</label>
              <input
                type="number"
                value={options.thumbnailWidth}
                onChange={(e) => updateOption('thumbnailWidth', Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Height</label>
              <input
                type="number"
                value={options.thumbnailHeight}
                onChange={(e) => updateOption('thumbnailHeight', Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Video className="w-4 h-4" />
          <span>Scene Detection</span>
        </div>
        {options.detectContent && (
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            <span>Content Analysis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SceneDetectionControls;