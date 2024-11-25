import React, { useState } from 'react';
import ToolLayout from '../../components/tools/ToolLayout';
import FileUpload from '../../components/tools/FileUpload';
import ProcessingStatus from '../../components/tools/ProcessingStatus';
import { Button } from '../../components/ui/Button';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { useToast } from '../../hooks/useToast';

interface VectorSettings {
  complexity: number;
  colorReduction: number;
  smoothing: number;
  format: 'svg' | 'eps' | 'ai';
}

const ImageVectorization = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [settings, setSettings] = useState<VectorSettings>({
    complexity: 50,
    colorReduction: 32,
    smoothing: 50,
    format: 'svg'
  });
  const { addToast } = useToast();

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
  };

  const handleVectorize = async () => {
    if (!file) return;
    
    try {
      setStatus('processing');
      setProgress(20);

      const result = await uploadToCloudinary(file);
      setProgress(60);

      // Apply vectorization transformation
      const processedUrl = result.secure_url.replace(
        '/upload/',
        `/upload/e_vectorize:${settings.complexity}:${settings.colorReduction}:${settings.smoothing}/f_${settings.format}/`
      );
      
      setResultUrl(processedUrl);
      setProgress(100);
      setStatus('completed');

      addToast({
        title: 'Image vectorized successfully',
        type: 'success'
      });
    } catch (error) {
      setStatus('error');
      addToast({
        title: 'Vectorization failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error'
      });
    }
  };

  return (
    <ToolLayout
      title="Image Vectorization"
      description="Convert raster images into scalable vector graphics"
    >
      <div className="space-y-8">
        <FileUpload
          accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
          onUpload={handleUpload}
          maxSize={10 * 1024 * 1024} // 10MB limit
        />
        
        {file && status === 'idle' && (
          <div className="space-y-6">
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Detail Level: {settings.complexity}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={settings.complexity}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    complexity: Number(e.target.value)
                  }))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Color Reduction: {settings.colorReduction} colors
                </label>
                <input
                  type="range"
                  min={2}
                  max={256}
                  step={2}
                  value={settings.colorReduction}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    colorReduction: Number(e.target.value)
                  }))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Less Colors</span>
                  <span>More Colors</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Path Smoothing: {settings.smoothing}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.smoothing}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    smoothing: Number(e.target.value)
                  }))}
                  className="w-full accent-red-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>Sharp</span>
                  <span>Smooth</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Output Format</label>
                <div className="grid grid-cols-3 gap-4">
                  {(['svg', 'eps', 'ai'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSettings(prev => ({ ...prev, format }))}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        settings.format === format 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-gray-700 hover:border-red-500'
                      }`}
                    >
                      <div className="text-lg font-bold mb-1 uppercase">{format}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={handleVectorize}>Vectorize Image</Button>
            </div>
          </div>
        )}
        
        {status === 'processing' && (
          <ProcessingStatus 
            status="processing" 
            progress={progress}
            message="Converting image to vector format..."
          />
        )}
        
        {status === 'completed' && resultUrl && (
          <div className="text-center space-y-4">
            <p className="text-green-500 mb-4">Image vectorized successfully!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <h4 className="text-sm font-medium p-2 bg-gray-800">Original</h4>
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Original" 
                  className="w-full"
                />
              </div>
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <h4 className="text-sm font-medium p-2 bg-gray-800">Vectorized</h4>
                {settings.format === 'svg' ? (
                  <img 
                    src={resultUrl} 
                    alt="Vectorized" 
                    className="w-full"
                  />
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    Preview not available for {settings.format.toUpperCase()} format
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <Button as="a" href={resultUrl} download={`vectorized.${settings.format}`}>
                Download Vector
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setProgress(0);
                  setResultUrl('');
                  setFile(null);
                }}
              >
                Vectorize Another Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};

export default ImageVectorization;