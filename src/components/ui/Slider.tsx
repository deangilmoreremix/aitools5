import React from 'react';
import { cn } from '../../lib/utils';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  suffix = '',
  className
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm text-gray-400">
        <span>{min}{suffix}</span>
        <span>{value}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-red-500"
      />
    </div>
  );
};