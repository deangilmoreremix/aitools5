import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import FileUpload from '../../components/tools/FileUpload';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useSmartCrop } from '../../hooks/useSmartCrop';
import { SmartCropSettings } from '../../types/video-tools';
import SmartCropControls from '../../components/video/SmartCropControls';
import SmartCropPreview from '../../components/video/SmartCropPreview';

const VideoSmartCrop = () => {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<SmartCropSettings>({
    mode: 'auto',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    focusPoint: 'center'
  });

  const {
    cropVideo,
    processing,
    progress,
    result,
    reset
  } = useSmartCrop();

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    reset();
  };

  const handleCrop = async () => {
    if (!file) return;
    await cropVideo(file, settings);
  };

  return (
    <ToolLayout
      title="Video Smart Crop"
      description="Automatically crop and resize videos while keeping the important content in frame"
    >
      <div className="space-y-8">
        {!file && (
          <FileUpload
            accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
            onUpload={handleUpload}
            maxSize={200 * 1024 * 1024} // 200MB limit
          />
        )}

        {file && !processing && !result && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <SmartCropPreview
                  file={file}
                  settings={settings}
                  className="w-full h-full"
                />
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    reset();
                  }}
                >
                  Change Video
                </Button>
                <div className="text-sm text-gray-400">
                  Output: {settings.width}x{settings.height}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <SmartCropControls
                settings={settings}
                onChange={setSettings}
                onCrop={handleCrop}
              />
            </div>
          </div>
        )}

        {processing && (
          <ProcessingStatus
            status="processing"
            progress={progress}
            message="Processing video crop..."
          />
        )}

        {result && (
          <div className="space-y-6">
            <div className="aspect-video w-full max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
              <video
                src={result}
                controls
                className="w-full h-full"
                poster={result.replace(/\.[^/.]+$/, '.jpg')}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button as="a" href={result} download>
                Download Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setFile(null);
                }}
              >
                Crop Another Video
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default VideoSmartCrop;