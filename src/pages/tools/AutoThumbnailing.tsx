import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import FileUpload from '../../components/tools/FileUpload';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { useThumbnailGenerator } from '../../hooks/useThumbnailGenerator';
import ThumbnailPreview from '../../components/video/thumbnail/ThumbnailPreview';
import ThumbnailSettings from '../../components/video/thumbnail/ThumbnailSettings';
import { ThumbnailOptions } from '../../types/thumbnail';
import { Grid, Download, History, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const AutoThumbnailing = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recentFiles, setRecentFiles] = useState<{ name: string; date: string }[]>([]);
  const [settings, setSettings] = useState<ThumbnailOptions>({
    count: 6,
    layout: 'grid',
    interval: 'smart',
    size: {
      width: 640,
      height: 360
    },
    quality: 80,
    format: 'jpg',
    includeTimestamps: true,
    smartDetection: true
  });

  const {
    generateThumbnails,
    processing,
    progress,
    thumbnails,
    reset
  } = useThumbnailGenerator();

  // Load recent files from local storage
  useEffect(() => {
    const saved = localStorage.getItem('recentThumbnails');
    if (saved) {
      setRecentFiles(JSON.parse(saved));
    }
  }, []);

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    reset();
  };

  const handleGenerate = async () => {
    if (!file) return;

    const results = await generateThumbnails(file, settings);
    
    // Save to recent files
    const newRecent = [
      { name: file.name, date: new Date().toISOString() },
      ...recentFiles.slice(0, 9)
    ];
    setRecentFiles(newRecent);
    localStorage.setItem('recentThumbnails', JSON.stringify(newRecent));
  };

  const clearHistory = () => {
    setRecentFiles([]);
    localStorage.removeItem('recentThumbnails');
  };

  return (
    <ToolLayout
      title="Auto Thumbnailing"
      description="Generate smart video thumbnails and previews automatically"
    >
      <div className="space-y-8">
        {!file && (
          <>
            <FileUpload
              accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
              onUpload={handleUpload}
              maxSize={200 * 1024 * 1024} // 200MB limit
            />

            {recentFiles.length > 0 && (
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-900 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-400" />
                    <h3 className="font-medium">Recent Files</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearHistory}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
                <div className="divide-y divide-gray-800">
                  {recentFiles.map((recent, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-800/50"
                    >
                      <div>
                        <p className="font-medium">{recent.name}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(recent.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {file && !processing && !thumbnails && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={URL.createObjectURL(file)}
                  className="w-full h-full"
                  controls
                />
              </div>
            </div>

            <div>
              <ThumbnailSettings
                settings={settings}
                onChange={setSettings}
                onGenerate={handleGenerate}
              />
            </div>
          </div>
        )}
        
        {processing && (
          <ProcessingStatus 
            status="processing" 
            progress={progress}
            message="Generating thumbnails..."
          />
        )}
        
        {thumbnails && thumbnails.length > 0 && (
          <div className="space-y-6">
            <ThumbnailPreview
              thumbnails={thumbnails}
              layout={settings.layout}
              includeTimestamps={settings.includeTimestamps}
            />

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  // Download all thumbnails as ZIP
                  const zip = new JSZip();
                  thumbnails.forEach((thumb, index) => {
                    zip.file(
                      `thumbnail-${index + 1}.${settings.format}`,
                      fetch(thumb.url).then(res => res.blob())
                    );
                  });
                  zip.generateAsync({ type: 'blob' }).then(content => {
                    const url = URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `thumbnails.zip`;
                    a.click();
                    URL.revokeObjectURL(url);
                  });
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  reset();
                  setFile(null);
                }}
              >
                Generate More
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default AutoThumbnailing;