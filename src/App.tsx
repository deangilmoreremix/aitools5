import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Pricing from './pages/Pricing';

// Video Tools
import VideoToGif from './pages/tools/VideoToGif';
import GifConverter from './pages/tools/GifConverter';
import VideoCompressor from './pages/tools/VideoCompressor';
import ReverseVideo from './pages/tools/ReverseVideo';
import SpeedVideo from './pages/tools/SpeedVideo';
import VideoTrim from './pages/tools/VideoTrim';
import VideoMerge from './pages/tools/VideoMerge';
import VideoSmartCrop from './pages/tools/VideoSmartCrop';
import SceneDetection from './pages/tools/SceneDetection';
import VideoOverlays from './pages/tools/VideoOverlays';
import AutoThumbnailing from './pages/tools/AutoThumbnailing';
import VideoTransforms from './pages/tools/VideoTransforms';
import RemoveVideoBg from './pages/tools/RemoveVideoBg';
import ImageToVideo from './pages/tools/ImageToVideo';
import VideoGeneration from './pages/tools/VideoGeneration';
import AutoPreviews from './pages/tools/AutoPreviews';
import VideoPlayer from './pages/tools/VideoPlayer';

// Image Tools
import BackgroundRemoval from './pages/tools/BackgroundRemoval';
import SmartCrop from './pages/tools/SmartCrop';
import ColorEnhancement from './pages/tools/ColorEnhancement';
import ImageUpscaler from './pages/tools/ImageUpscaler';
import ImageRestore from './pages/tools/ImageRestore';
import RoundCorners from './pages/tools/RoundCorners';

// AI Enhancement Tools
import AiTranscription from './pages/tools/AiTranscription';
import VideoNoiseReduction from './pages/tools/VideoNoiseReduction';
import VideoStabilization from './pages/tools/VideoStabilization';
import ContentAwareEncoding from './pages/tools/ContentAwareEncoding';

// Delivery & Optimization Tools
import MultiCdn from './pages/tools/MultiCdn';
import AdaptiveStreaming from './pages/tools/AdaptiveStreaming';
import DynamicDelivery from './pages/tools/DynamicDelivery';
import UploadWidget from './pages/tools/UploadWidget';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Video Tools */}
          <Route path="/tools/video-to-gif" element={<VideoToGif />} />
          <Route path="/tools/gif-converter" element={<GifConverter />} />
          <Route path="/tools/video-compressor" element={<VideoCompressor />} />
          <Route path="/tools/reverse-video" element={<ReverseVideo />} />
          <Route path="/tools/speed-video" element={<SpeedVideo />} />
          <Route path="/tools/video-trim" element={<VideoTrim />} />
          <Route path="/tools/video-merge" element={<VideoMerge />} />
          <Route path="/tools/video-smart-crop" element={<VideoSmartCrop />} />
          <Route path="/tools/scene-detection" element={<SceneDetection />} />
          <Route path="/tools/video-overlays" element={<VideoOverlays />} />
          <Route path="/tools/auto-thumbnailing" element={<AutoThumbnailing />} />
          <Route path="/tools/video-transforms" element={<VideoTransforms />} />
          <Route path="/tools/remove-video-bg" element={<RemoveVideoBg />} />
          <Route path="/tools/image-to-video" element={<ImageToVideo />} />
          <Route path="/tools/video-generation" element={<VideoGeneration />} />
          <Route path="/tools/auto-previews" element={<AutoPreviews />} />
          <Route path="/tools/video-player" element={<VideoPlayer />} />

          {/* Image Tools */}
          <Route path="/tools/background-removal" element={<BackgroundRemoval />} />
          <Route path="/tools/smart-crop" element={<SmartCrop />} />
          <Route path="/tools/color-enhancement" element={<ColorEnhancement />} />
          <Route path="/tools/image-upscaler" element={<ImageUpscaler />} />
          <Route path="/tools/image-restore" element={<ImageRestore />} />
          <Route path="/tools/round-corners" element={<RoundCorners />} />

          {/* AI Enhancement Tools */}
          <Route path="/tools/ai-transcription" element={<AiTranscription />} />
          <Route path="/tools/video-noise-reduction" element={<VideoNoiseReduction />} />
          <Route path="/tools/video-stabilization" element={<VideoStabilization />} />
          <Route path="/tools/content-aware-encoding" element={<ContentAwareEncoding />} />

          {/* Delivery & Optimization Tools */}
          <Route path="/tools/multi-cdn" element={<MultiCdn />} />
          <Route path="/tools/adaptive-streaming" element={<AdaptiveStreaming />} />
          <Route path="/tools/dynamic-delivery" element={<DynamicDelivery />} />
          <Route path="/tools/upload-widget" element={<UploadWidget />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;