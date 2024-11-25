import React from 'react';
import { Button } from '../../ui/Button';
import { Image, Type, Square, Plus } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OverlayToolbarProps {
  onAddOverlay: (type: 'image' | 'text' | 'shape') => void;
  className?: string;
}

const OverlayToolbar: React.FC<OverlayToolbarProps> = ({
  onAddOverlay,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddOverlay('image')}
      >
        <Image className="w-4 h-4 mr-2" />
        Add Image
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddOverlay('text')}
      >
        <Type className="w-4 h-4 mr-2" />
        Add Text
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddOverlay('shape')}
      >
        <Square className="w-4 h-4 mr-2" />
        Add Shape
      </Button>
    </div>
  );
};

export default OverlayToolbar;