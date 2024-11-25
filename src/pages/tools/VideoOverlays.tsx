import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import FileUpload from '../../components/tools/FileUpload';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useVideoOverlay } from '../../hooks/useVideoOverlay';
import OverlayEditor from '../../components/video/overlay/OverlayEditor';
import OverlayControls from '../../components/video/overlay/OverlayControls';
import OverlayTimeline from '../../components/video/overlay/OverlayTimeline';
import OverlayToolbar from '../../components/video/overlay/OverlayToolbar';
import { VideoOverlay } from '../../types/video-tools';
import { Image, Type, Square } from 'lucide-react';

const VideoOverlays = () => {
  const [file, setFile] = useState<File | null>(null);
  const [overlays, setOverlays] = useState<VideoOverlay[]>([]);
  const [selectedOverlay, setSelectedOverlay] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { applyOverlays, processing, progress } = useVideoOverlay();
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setResultUrl(null);

    // Get video duration
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setDuration(video.duration);
    };
    video.src = URL.createObjectURL(uploadedFile);
  };

  const handleAddOverlay = (type: 'image' | 'text' | 'shape') => {
    const newOverlay: VideoOverlay = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position: {
        x: 50,
        y: 50,
        width: type === 'text' ? 300 : 100,
        height: type === 'text' ? 50 : 100
      },
      style: {
        opacity: 1,
        rotation: 0,
        blendMode: 'normal'
      },
      content: type === 'text' 
        ? { type: 'text', text: 'New Text', font: 'Arial', size: 24 }
        : type === 'image'
        ? { type: 'image', url: '' }
        : { type: 'shape', shape: 'rectangle', color: '#ffffff' }
    };

    setOverlays([...overlays, newOverlay]);
    setSelectedOverlay(newOverlay.id);
  };

  const handleApplyOverlays = async () => {
    if (!file) return;
    const result = await applyOverlays(file, overlays);
    setResultUrl(result);
  };

  return (
    <ToolLayout
      title="Video Overlays"
      description="Add custom overlays, watermarks, and text to your videos"
    >
      <div className="space-y-8">
        {!file && (
          <FileUpload
            accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
            onUpload={handleUpload}
            maxSize={200 * 1024 * 1024} // 200MB limit
          />
        )}

        {file && !processing && !resultUrl && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <OverlayToolbar onAddOverlay={handleAddOverlay} />
              <Button onClick={handleApplyOverlays}>Apply Overlays</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <OverlayEditor
                    file={file}
                    overlays={overlays}
                    onChange={setOverlays}
                    onSelectOverlay={setSelectedOverlay}
                    currentTime={currentTime}
                  />
                </div>

                <OverlayTimeline
                  overlays={overlays}
                  duration={duration}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  onOverlayUpdate={(overlay) => {
                    setOverlays(overlays.map(o => 
                      o.id === overlay.id ? overlay : o
                    ));
                  }}
                />
              </div>

              <div>
                {selectedOverlay ? (
                  <OverlayControls
                    overlay={overlays.find(o => o.id === selectedOverlay)!}
                    onChange={(updated) => {
                      setOverlays(overlays.map(o => 
                        o.id === updated.id ? updated : o
                      ));
                    }}
                    onRemove={() => {
                      setOverlays(overlays.filter(o => o.id !== selectedOverlay));
                      setSelectedOverlay(null);
                    }}
                  />
                ) : (
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Add Overlays</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleAddOverlay('image')}
                      >
                        <Image className="w-5 h-5 mr-2" />
                        Add Image Overlay
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleAddOverlay('text')}
                      >
                        <Type className="w-5 h-5 mr-2" />
                        Add Text Overlay
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleAddOverlay('shape')}
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Add Shape Overlay
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {processing && (
          <ProcessingStatus
            status="processing"
            progress={progress}
            message="Applying overlays to video..."
          />
        )}

        {resultUrl && (
          <div className="space-y-6">
            <div className="aspect-video w-full max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
              <video
                src={resultUrl}
                controls
                className="w-full h-full"
                poster={resultUrl.replace(/\.[^/.]+$/, '.jpg')}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button as="a" href={resultUrl} download>
                Download Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setOverlays([]);
                  setSelectedOverlay(null);
                  setResultUrl(null);
                  setCurrentTime(0);
                  setDuration(0);
                }}
              >
                Create New Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoOverlays;