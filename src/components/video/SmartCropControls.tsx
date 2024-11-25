import React from 'react';
import { SmartCropSettings } from '../../types/video-tools';
import { Button } from '../ui/Button';
import { Crop, Focus, LayoutTemplate, Maximize } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SmartCropControlsProps {
  settings: SmartCropSettings;
  onChange: (settings: SmartCropSettings) => void;
  onCrop: () => void;
  className?: string;
}

const SmartCropControls: React.FC<SmartCropControlsProps> = ({
  settings,
  onChange,
  onCrop,
  className
}) => {
  const aspectRatios = {
    '16:9': { width: 1920, height: 1080, label: 'Landscape' },
    '9:16': { width: 1080, height: 1920, label: 'Portrait' },
    '4:3': { width: 1440, height: 1080, label: 'Classic' },
    '1:1': { width: 1080, height: 1080, label: 'Square' }
  };

  const updateAspectRatio = (ratio: keyof typeof aspectRatios) => {
    const dimensions = aspectRatios[ratio];
    onChange({
      ...settings,
      aspectRatio: ratio,
      width: dimensions.width,
      height: dimensions.height
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <LayoutTemplate className="w-5 h-5" />
          Aspect Ratio
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(aspectRatios) as Array<keyof typeof aspectRatios>).map((ratio) => (
            <button
              key={ratio}
              onClick={() => updateAspectRatio(ratio)}
              className={cn(
                "p-4 rounded-lg border-2 transition-colors",
                settings.aspectRatio === ratio
                  ? "border-red-500 bg-red-500/10"
                  : "border-gray-700 hover:border-red-500"
              )}
            >
              <div className="text-lg font-bold">{ratio}</div>
              <div className="text-sm text-gray-400">{aspectRatios[ratio].label}</div>
              <div className="text-xs text-gray-500 mt-1">
                {aspectRatios[ratio].width}x{aspectRatios[ratio].height}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Focus className="w-5 h-5" />
          Detection Mode
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {(['auto', 'face', 'object'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChange({ ...settings, mode })}
              className={cn(
                "p-4 rounded-lg border-2 transition-colors text-left",
                settings.mode === mode
                  ? "border-red-500 bg-red-500/10"
                  : "border-gray-700 hover:border-red-500"
              )}
            >
              <div className="font-medium capitalize">{mode}</div>
              <div className="text-sm text-gray-400">
                {mode === 'auto' && 'Automatically detect important content'}
                {mode === 'face' && 'Focus on faces in the video'}
                {mode === 'object' && 'Track moving objects'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Maximize className="w-5 h-5" />
          Custom Dimensions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width (px)</label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => onChange({
                ...settings,
                width: Number(e.target.value)
              })}
              min={100}
              max={3840}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height (px)</label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => onChange({
                ...settings,
                height: Number(e.target.value)
              })}
              min={100}
              max={2160}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            />
          </div>
        </div>
      </div>

      <Button onClick={onCrop} className="w-full">
        Crop Video
      </Button>
    </div>
  );
};

export default SmartCropControls;