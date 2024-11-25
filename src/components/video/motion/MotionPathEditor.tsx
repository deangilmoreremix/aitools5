import React, { useRef, useEffect } from 'react';
import { cn } from '../../../lib/utils';

interface Point {
  x: number;
  y: number;
}

interface MotionPathEditorProps {
  points: Point[];
  onChange: (points: Point[]) => void;
  width: number;
  height: number;
  className?: string;
}

export const MotionPathEditor: React.FC<MotionPathEditorProps> = ({
  points,
  onChange,
  width,
  height,
  className
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw path
    ctx.beginPath();
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 2;

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x * width, point.y * height);
      } else {
        ctx.lineTo(point.x * width, point.y * height);
      }
    });

    ctx.stroke();

    // Draw points
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.fillStyle = isDragging.current === index ? '#FF0000' : '#FFFFFF';
      ctx.arc(point.x * width, point.y * height, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, [points, width, height]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;

    // Check if clicking on existing point
    const pointIndex = points.findIndex(point => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      return distance < 0.02; // Click tolerance
    });

    if (pointIndex >= 0) {
      isDragging.current = pointIndex;
    } else {
      // Add new point
      onChange([...points, { x, y }]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / width;
    const y = (e.clientY - rect.top) / height;

    const newPoints = [...points];
    newPoints[isDragging.current] = { x, y };
    onChange(newPoints);
  };

  const handleMouseUp = () => {
    isDragging.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn("border border-gray-700 rounded-lg cursor-crosshair", className)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default MotionPathEditor;