import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Video, FileVideo, Wand2, RotateCw, FastForward, Scissors, Layers,
  Image, Palette, Box, Crop, Zap, Sparkles, Film, Music, Cog,
  Upload, Download, Play, Eye, Camera, Maximize, MinusCircle,
  Type, Layout, Monitor, Tv, Sliders, Repeat, Split, Globe
} from 'lucide-react';

const tools = [
  {
    category: "Video Tools",
    icon: <Video className="w-6 h-6 text-red-500" />,
    tools: [
      { 
        id: "video-to-gif", 
        name: "Video to GIF", 
        path: "/tools/video-to-gif", 
        description: "Convert videos to high-quality GIFs",
        icon: <FileVideo className="w-5 h-5" />
      },
      { 
        id: "gif-converter", 
        name: "GIF Converter", 
        path: "/tools/gif-converter", 
        description: "Convert and optimize GIF files",
        icon: <Wand2 className="w-5 h-5" />
      },
      { 
        id: "video-compressor", 
        name: "Video Compressor", 
        path: "/tools/video-compressor", 
        description: "Compress videos while maintaining quality",
        icon: <FileVideo className="w-5 h-5" />
      },
      { 
        id: "reverse-video", 
        name: "Reverse Video", 
        path: "/tools/reverse-video", 
        description: "Create reverse playback videos",
        icon: <RotateCw className="w-5 h-5" />
      },
      { 
        id: "speed-video", 
        name: "Speed Video", 
        path: "/tools/speed-video", 
        description: "Adjust video playback speed",
        icon: <FastForward className="w-5 h-5" />
      },
      { 
        id: "video-trim", 
        name: "Video Trim", 
        path: "/tools/video-trim", 
        description: "Cut and trim your videos",
        icon: <Scissors className="w-5 h-5" />
      },
      { 
        id: "video-merge", 
        name: "Video Merge", 
        path: "/tools/video-merge", 
        description: "Combine multiple videos",
        icon: <Layers className="w-5 h-5" />
      },
      {
        id: "video-smart-crop",
        name: "Video Smart Crop",
        path: "/tools/video-smart-crop",
        description: "Intelligently crop videos while preserving content",
        icon: <Crop className="w-5 h-5" />
      },
      {
        id: "scene-detection",
        name: "Scene Detection",
        path: "/tools/scene-detection",
        description: "Detect and analyze video scenes",
        icon: <Split className="w-5 h-5" />
      },
      {
        id: "video-overlays",
        name: "Video Overlays",
        path: "/tools/video-overlays",
        description: "Add custom overlays and watermarks",
        icon: <Layers className="w-5 h-5" />
      },
      {
        id: "auto-thumbnailing",
        name: "Auto Thumbnailing",
        path: "/tools/auto-thumbnailing",
        description: "Generate video thumbnails automatically",
        icon: <Image className="w-5 h-5" />
      },
      {
        id: "video-transforms",
        name: "Video Transforms",
        path: "/tools/video-transforms",
        description: "Apply visual transformations",
        icon: <Sliders className="w-5 h-5" />
      },
      {
        id: "remove-video-bg",
        name: "Remove Video Background",
        path: "/tools/remove-video-bg",
        description: "Remove video backgrounds",
        icon: <MinusCircle className="w-5 h-5" />
      },
      {
        id: "image-to-video",
        name: "Image to Video",
        path: "/tools/image-to-video",
        description: "Convert images to video",
        icon: <Film className="w-5 h-5" />
      },
      {
        id: "video-generation",
        name: "Video Generation",
        path: "/tools/video-generation",
        description: "Generate videos from scratch",
        icon: <Sparkles className="w-5 h-5" />
      },
      {
        id: "auto-previews",
        name: "Auto Previews",
        path: "/tools/auto-previews",
        description: "Generate automatic video previews",
        icon: <Play className="w-5 h-5" />
      },
      {
        id: "video-player",
        name: "Video Player Studio",
        path: "/tools/video-player",
        description: "Create custom video players",
        icon: <Play className="w-5 h-5" />
      }
    ]
  },
  {
    category: "Image Tools",
    icon: <Image className="w-6 h-6 text-red-500" />,
    tools: [
      {
        id: "background-removal",
        name: "Background Removal",
        path: "/tools/background-removal",
        description: "Remove image backgrounds",
        icon: <MinusCircle className="w-5 h-5" />
      },
      {
        id: "smart-crop",
        name: "Smart Crop",
        path: "/tools/smart-crop",
        description: "Intelligent content-aware cropping",
        icon: <Crop className="w-5 h-5" />
      },
      {
        id: "color-enhancement",
        name: "Color Enhancement",
        path: "/tools/color-enhancement",
        description: "Enhance and adjust image colors",
        icon: <Palette className="w-5 h-5" />
      },
      {
        id: "image-upscaler",
        name: "Image Upscaler",
        path: "/tools/image-upscaler",
        description: "Upscale images using AI",
        icon: <Maximize className="w-5 h-5" />
      },
      {
        id: "image-restore",
        name: "Image Restore",
        path: "/tools/image-restore",
        description: "Restore old or damaged photos",
        icon: <Wand2 className="w-5 h-5" />
      },
      {
        id: "round-corners",
        name: "Round Corners",
        path: "/tools/round-corners",
        description: "Add rounded corners to images",
        icon: <Box className="w-5 h-5" />
      }
    ]
  },
  {
    category: "AI Enhancement",
    icon: <Sparkles className="w-6 h-6 text-red-500" />,
    tools: [
      {
        id: "ai-transcription",
        name: "AI Transcription",
        path: "/tools/ai-transcription",
        description: "Convert speech to text with AI",
        icon: <Type className="w-5 h-5" />
      },
      {
        id: "video-noise-reduction",
        name: "Video Noise Reduction",
        path: "/tools/video-noise-reduction",
        description: "Remove video noise using AI",
        icon: <Wand2 className="w-5 h-5" />
      },
      {
        id: "video-stabilization",
        name: "Video Stabilization",
        path: "/tools/video-stabilization",
        description: "Stabilize shaky video footage",
        icon: <Camera className="w-5 h-5" />
      },
      {
        id: "content-aware-encoding",
        name: "Content-Aware Encoding",
        path: "/tools/content-aware-encoding",
        description: "Smart video compression",
        icon: <Cog className="w-5 h-5" />
      }
    ]
  },
  {
    category: "Delivery & Optimization",
    icon: <Globe className="w-6 h-6 text-red-500" />,
    tools: [
      {
        id: "multi-cdn",
        name: "Multi CDN",
        path: "/tools/multi-cdn",
        description: "Optimize content delivery",
        icon: <Globe className="w-5 h-5" />
      },
      {
        id: "adaptive-streaming",
        name: "Adaptive Streaming",
        path: "/tools/adaptive-streaming",
        description: "Create adaptive bitrate streams",
        icon: <Monitor className="w-5 h-5" />
      },
      {
        id: "dynamic-delivery",
        name: "Dynamic Delivery",
        path: "/tools/dynamic-delivery",
        description: "Optimize for different devices",
        icon: <Tv className="w-5 h-5" />
      },
      {
        id: "upload-widget",
        name: "Upload Widget",
        path: "/tools/upload-widget",
        description: "Create upload widgets",
        icon: <Upload className="w-5 h-5" />
      }
    ]
  }
];

const Tools = () => {
  return (
    <div className="space-y-12">
      {tools.map((category) => (
        <div key={category.category} className="space-y-6">
          <div className="flex items-center gap-2">
            {category.icon}
            <h2 className="text-2xl font-bold">{category.category}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.tools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                className="block p-6 bg-gray-900 rounded-xl border border-gray-800 hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  {tool.icon}
                  <h3 className="text-lg font-semibold group-hover:text-red-500">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-gray-400">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tools;