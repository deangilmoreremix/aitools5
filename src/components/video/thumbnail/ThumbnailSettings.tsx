import React from 'react';
import { ThumbnailOptions } from '../../../types/thumbnail';
import { Button } from '../../ui/Button';
import { Grid, Clock, Image, Settings } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ThumbnailSettingsProps {
  settings: ThumbnailOptions;
  onChange: (settings: ThumbnailOptions) => void;
  onGenerate: () => void;
  className?: string;
}

const ThumbnailSettings: React.FC<ThumbnailSettingsProps> = ({
  settings,
  onChange,
  onGenerate,
  className
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Grid className="w-5 h-5" />
          Layout
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {(['grid', 'filmstrip', 'storyboard'] as const).map((layout) => (
            <button
              key={layout}
              onClick={() => onChange({ ...settings, layout })}
              className={cn(
                "p-4 rounded-lg border-2 transition-colors",
                settings.layout === layout
                  ? "border-red-500 bg-red-500/10"
                  : "border-gray-700 hover:border-red-500"
              )}
            >
              <div className="text-lg font-bold capitalize">{layout}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5" />
          Frame Selection
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onChange({ ...settings, interval: 'uniform' })}
            className={cn(
              "p-4 rounded-lg border-2 transition-colors",
              settings.interval === 'uniform'
                ? "border-red-500 bg-red-500/10"
                : "border-gray-700 hover:border-red-500"
            )}
          >
            <div className="text-lg font-bold">Uniform</div>
            <div className="text-sm text-gray-400">Equal time intervals</div>
          </button>
          <button
            onClick={() => onChange({ ...settings, interval: 'smart' })}
            className={cn(
              "p-4 rounded-lg border-2 transition-colors",
              settings.interval === 'smart'
                ? "border-red-500 bg-red-500/10"
                : "border-gray-700 hover:border-red-500"
            )}
          >
            <div className="text-lg font-bold">Smart</div>
            <div className="text-sm text-gray-400">AI-detected key frames</div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
          <Image className="w-5 h-5" />
          Output Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Thumbnails: {settings.count}
            </label>
            <input
              type="range"
              min={3}
              max={12}
              value={settings.count}
              onChange={(e) => onChange({
                ...settings,
                count: Number(e.target.value)
              })}
              className="w-full accent-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Width</label>
              <input
                type="number"
                value={settings.size.width}
                onChange={(e) => onChange({
                  ...settings,
                  size: {
                    ...settings.size,
                    width: Number(e.target.value)
                  }
                })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <input
                type="number"
                value={settings.size.height}
                onChange={(e) => onChange({
                  ...settings,
                  size: {
                    ...settings.size,
                    height: Number(e.target.value)
                  }
                })}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={settings.format}
              onChange={(e) => onChange({
                ...settings,
                format: e.target.value as ThumbnailOptions['format']
              })}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            >
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quality: {settings.quality}%
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={settings.quality}
              onChange={(e) => onChange({
                ...settings,
                quality: Number(e.target.value)
              })}
              className="w-full accent-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.includeTimestamps}
                onChange={(e) => onChange({
                  ...settings,
                  includeTimestamps: e.target.checked
                })}
                className="rounded border-gray-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm">Include timestamps</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.smartDetection}
                onChange={(e) => onChange({
                  ...settings,
                  smartDetection: e.target.checked
                })}
                className="rounded border-gray-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm">Enable smart scene detection</span>
            </label>
          </div>
        </div>
      </div>

      <Button onClick={onGenerate} className="w-full">
        Generate Thumbnails
      </Button>
    </div>
  );
};

export default ThumbnailSettings;