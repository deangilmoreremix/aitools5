import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import FileUpload from '../../components/tools/FileUpload';
import { useSceneDetection } from '../../hooks/useSceneDetection';
import SceneDetectionControls from '../../components/video/SceneDetectionControls';
import SceneDetectionPreview from '../../components/video/SceneDetectionPreview';
import { SceneDetectionOptions } from '../../types/scene';

const SceneDetection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<SceneDetectionOptions>({
    minSceneDuration: 2,
    threshold: 0.3,
    detectContent: true,
    generateThumbnails: true,
    thumbnailWidth: 320,
    thumbnailHeight: 180
  });

  const {
    analyze,
    analyzing,
    progress,
    result,
    reset
  } = useSceneDetection(options);

  const handleUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    reset();
  };

  const handleAnalyze = async () => {
    if (!file) return;
    await analyze(file);
  };

  return (
    <ToolLayout
      title="Scene Detection"
      description="Automatically detect and analyze scenes in your videos using AI"
    >
      <div className="space-y-8">
        <FileUpload
          accept={{ 'video/*': ['.mp4', '.mov', '.avi', '.webm'] }}
          onUpload={handleUpload}
          maxSize={200 * 1024 * 1024} // 200MB limit
        />

        {file && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {result && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Detected Scenes</h3>
                    <div className="text-sm text-gray-400">
                      {result.totalScenes} scenes • {Math.round(result.duration)}s total
                    </div>
                  </div>
                  <SceneDetectionPreview scenes={result.scenes} />
                </div>
              )}
            </div>

            <div>
              <SceneDetectionControls
                options={options}
                onChange={setOptions}
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzing}
              />

              {analyzing && (
                <div className="mt-4 bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Analyzing video...</span>
                    <span className="text-sm text-gray-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default SceneDetection;