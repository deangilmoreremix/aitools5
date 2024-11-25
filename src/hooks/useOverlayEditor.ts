import { useState, useCallback, useRef } from 'react';
import { fabric } from 'fabric';
import { VideoOverlay } from '../types/video-overlay';
import { useToast } from './useToast';

interface UseOverlayEditorOptions {
  width: number;
  height: number;
  onUpdate?: (overlays: VideoOverlay[]) => void;
}

export const useOverlayEditor = ({ width, height, onUpdate }: UseOverlayEditorOptions) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const overlaysRef = useRef<VideoOverlay[]>([]);
  const { addToast } = useToast();

  const initCanvas = useCallback((canvasElement: HTMLCanvasElement) => {
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width,
      height,
      backgroundColor: 'transparent'
    });

    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.target);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    fabricCanvas.on('object:modified', () => {
      updateOverlays();
    });

    setCanvas(fabricCanvas);
  }, [width, height]);

  const addOverlay = useCallback((overlay: VideoOverlay) => {
    if (!canvas) return;

    let fabricObject: fabric.Object;

    switch (overlay.type) {
      case 'text':
        fabricObject = new fabric.Text(overlay.content.text, {
          left: overlay.position.x,
          top: overlay.position.y,
          fontSize: overlay.content.size,
          fontFamily: overlay.content.font,
          fill: overlay.content.color
        });
        break;

      case 'image':
        fabric.Image.fromURL(overlay.content.url, (img) => {
          img.set({
            left: overlay.position.x,
            top: overlay.position.y,
            scaleX: overlay.position.width / img.width!,
            scaleY: overlay.position.height / img.height!
          });
          canvas.add(img);
          updateOverlays();
        });
        return;

      case 'shape':
        switch (overlay.content.shape) {
          case 'rectangle':
            fabricObject = new fabric.Rect({
              left: overlay.position.x,
              top: overlay.position.y,
              width: overlay.position.width,
              height: overlay.position.height,
              fill: overlay.content.color
            });
            break;
          case 'circle':
            fabricObject = new fabric.Circle({
              left: overlay.position.x,
              top: overlay.position.y,
              radius: Math.min(overlay.position.width, overlay.position.height) / 2,
              fill: overlay.content.color
            });
            break;
          default:
            throw new Error(`Unsupported shape: ${overlay.content.shape}`);
        }
        break;

      default:
        throw new Error(`Unsupported overlay type: ${overlay.type}`);
    }

    fabricObject.set({
      opacity: overlay.style.opacity,
      globalCompositeOperation: overlay.style.blendMode,
      data: { overlayId: overlay.id }
    });

    canvas.add(fabricObject);
    updateOverlays();
  }, [canvas]);

  const removeOverlay = useCallback((id: string) => {
    if (!canvas) return;

    const object = canvas.getObjects().find(obj => obj.data?.overlayId === id);
    if (object) {
      canvas.remove(object);
      updateOverlays();
    }
  }, [canvas]);

  const updateOverlays = useCallback(() => {
    if (!canvas) return;

    const objects = canvas.getObjects();
    const updatedOverlays = objects.map(obj => {
      const overlay = overlaysRef.current.find(o => o.id === obj.data?.overlayId);
      if (!overlay) return null;

      return {
        ...overlay,
        position: {
          x: obj.left ?? 0,
          y: obj.top ?? 0,
          width: obj.getScaledWidth(),
          height: obj.getScaledHeight(),
          rotation: obj.angle ?? 0
        },
        style: {
          ...overlay.style,
          opacity: obj.opacity ?? 1
        }
      };
    }).filter((o): o is VideoOverlay => o !== null);

    overlaysRef.current = updatedOverlays;
    onUpdate?.(updatedOverlays);
  }, [canvas, onUpdate]);

  return {
    canvas,
    selectedObject,
    initCanvas,
    addOverlay,
    removeOverlay,
    updateOverlays
  };
};