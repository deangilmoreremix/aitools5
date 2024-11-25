import React from 'react';
import { VideoOverlay } from '../../../types/video-overlay';
import { HexColorPicker } from 'react-colorful';
import { Button } from '../../ui/Button';
import { Settings, Sliders, Palette, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OverlayControlsProps {
  overlay: VideoOverlay;
  onChange: (overlay: VideoOverlay) => void;
  onRemove: () => void;
  className?: string;
}

const OverlayControls: React.FC<OverlayControlsProps> = ({
  overlay,
  onChange,
  onRemove,
  className
}) => {
  const updateStyle = (key: keyof VideoOverlay['style'], value: any) => {
    onChange({
      ...overlay,
      style: { ...overlay.style, [key]: value }
    });
  };

  const updateContent = (key: string, value: any) => {
    onChange({
      ...overlay,
      content: { ...overlay.content, [key]: value }
    });
  };

  return (
    <div className={cn("bg-gray-900 rounded-lg p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Overlay Settings
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>

      <div className="space-y-6">
        {/* Common Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Opacity: {Math.round(overlay.style.opacity * 100)}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={overlay.style.opacity * 100}
              onChange={(e) => updateStyle('opacity', Number(e.target.value) / 100)}
              className="w-full accent-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Blend Mode</label>
            <select
              value={overlay.style.blendMode}
              onChange={(e) => updateStyle('blendMode', e.target.value)}
              className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
            </select>
          </div>
        </div>

        {/* Type-specific Settings */}
        {overlay.type === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Content</label>
              <input
                type="text"
                value={overlay.content.text}
                onChange={(e) => updateContent('text', e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <input
                type="number"
                value={overlay.content.size}
                onChange={(e) => updateContent('size', Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <HexColorPicker
                color={overlay.content.color}
                onChange={(color) => updateContent('color', color)}
              />
            </div>
          </div>
        )}

        {overlay.type === 'shape' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Shape Type</label>
              <select
                value={overlay.content.shape}
                onChange={(e) => updateContent('shape', e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Fill Color</label>
              <HexColorPicker
                color={overlay.content.color}
                onChange={(color) => updateContent('color', color)}
              />
            </div>
          </div>
        )}

        {/* Timing Controls */}
        {overlay.timing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Time (s)</label>
              <input
                type="number"
                value={overlay.timing.start}
                onChange={(e) => onChange({
                  ...overlay,
                  timing: { ...overlay.timing!, start: Number(e.target.value) }
                })}
                min={0}
                step={0.1}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Duration (s)</label>
              <input
                type="number"
                value={overlay.timing.duration}
                onChange={(e) => onChange({
                  ...overlay,
                  timing: { ...overlay.timing!, duration: Number(e.target.value) }
                })}
                min={0.1}
                step={0.1}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayControls;