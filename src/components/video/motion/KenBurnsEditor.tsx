import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { Slider } from '../../ui/Slider';
import { MotionPathEditor } from './MotionPathEditor';
import { cn } from '../../../lib/utils';

interface KenBurnsSettings {
  scale: number;
  rotation: number;
  pan: { x: number; y: number }[];
  duration: number;
  easing: string;
}

interface KenBurnsEditorProps {
  settings: KenBurnsSettings;
  onChange: (settings: KenBurnsSettings) => void;
  previewImage?: string;
  className?: string;
}

const KenBurnsEditor: React.FC<KenBurnsEditorProps> = ({
  settings,
  onChange,
  previewImage,
  className
}) => {
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (key: keyof KenBurnsSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Ken Burns Effect</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
        >
          {previewMode ? 'Edit' : 'Preview'}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Scale</label>
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={settings.scale}
            onChange={(value) => handleChange('scale', value)}
            suffix="x"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Rotation</label>
          <Slider
            min={-180}
            max={180}
            value={settings.rotation}
            onChange={(value) => handleChange('rotation', value)}
            suffix="°"
          />
        </div>
      </div>

      <div className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden">
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `scale(${settings.scale}) rotate(${settings.rotation}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.3s ease'
            }}
          />
        )}
        
        {!previewMode && (
          <MotionPathEditor
            points={settings.pan}
            onChange={(points) => handleChange('pan', points)}
            width={640}
            height={360}
          />
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <Slider
            min={1}
            max={10}
            step={0.5}
            value={settings.duration}
            onChange={(value) => handleChange('duration', value)}
            suffix="s"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Easing</label>
          <select
            value={settings.easing}
            onChange={(e) => handleChange('easing', e.target.value)}
            className="w-full bg-gray-800 rounded-lg px-4 py-2 border border-gray-700"
          >
            <option value="linear">Linear</option>
            <option value="ease">Ease</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In Out</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default KenBurnsEditor;