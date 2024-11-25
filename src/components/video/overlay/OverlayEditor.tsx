import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { VideoOverlay } from '../../../types/video-overlay';
import { useOverlayEditor } from '../../../hooks/useOverlayEditor';
import { Button } from '../../ui/Button';
import { Image, Type, Square } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OverlayEditorProps {
  file: File;
  overlays: VideoOverlay[];
  onChange: (overlays: VideoOverlay[]) => void;
  onSelectOverlay: (id: string | null) => void;
  currentTime: number;
  className?: string;
}

const OverlayEditor: React.FC<OverlayEditorProps> = ({
  file,
  overlays,
  onChange,
  onSelectOverlay,
  currentTime,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { canvas, initCanvas, addOverlay, removeOverlay } = useOverlayEditor({
    width: 1280,
    height: 720,
    onUpdate: onChange
  });

  useEffect(() => {
    if (!canvasRef.current) return;
    initCanvas(canvasRef.current);
  }, [initCanvas]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.src = URL.createObjectURL(file);

    return () => {
      if (videoRef.current?.src) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, [file]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = currentTime;
  }, [currentTime]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay({
            id: Math.random().toString(36).substr(2, 9),
            type: 'image',
            position: { x: 100, y: 100, width: 200, height: 200 },
            style: { opacity: 1, blendMode: 'normal' },
            content: { type: 'image', url: '' }
          })}
        >
          <Image className="w-4 h-4 mr-2" />
          Add Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay({
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            position: { x: 100, y: 100, width: 300, height: 50 },
            style: { opacity: 1, blendMode: 'normal' },
            content: { type: 'text', text: 'New Text', font: 'Arial', size: 24, color: '#ffffff' }
          })}
        >
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay({
            id: Math.random().toString(36).substr(2, 9),
            type: 'shape',
            position: { x: 100, y: 100, width: 100, height: 100 },
            style: { opacity: 1, blendMode: 'normal' },
            content: { type: 'shape', shape: 'rectangle', color: '#ffffff' }
          })}
        >
          <Square className="w-4 h-4 mr-2" />
          Add Shape
        </Button>
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full"
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto"
        />
      </div>
    </div>
  );
};

export default OverlayEditor;