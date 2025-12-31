
import React, { useState } from 'react';
import { AspectRatio } from '../types';

interface PromptInputProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio, highQuality: boolean) => void;
  onEnhance: (prompt: string) => Promise<string>;
  isGenerating: boolean;
  initialPrompt: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  onGenerate, 
  onEnhance, 
  isGenerating,
  initialPrompt 
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [highQuality, setHighQuality] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhance = async () => {
    if (!prompt || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const enhanced = await onEnhance(prompt);
      setPrompt(enhanced);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Visualization Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the scene..."
          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none h-32"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2 flex-1 min-w-[200px]">
          <label className="text-sm font-medium text-gray-400 block">Aspect Ratio</label>
          <div className="flex gap-2">
            {Object.values(AspectRatio).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  aspectRatio === ratio 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-gray-400 border-white/10 hover:border-white/30'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 py-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={highQuality} 
                onChange={(e) => setHighQuality(e.target.checked)}
              />
              <div className="w-10 h-6 bg-white/10 rounded-full peer peer-checked:bg-red-500 transition-colors"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">High Quality</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleEnhance}
          disabled={isEnhancing || isGenerating || !prompt}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2"
        >
          {isEnhancing ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : '✨ Enhance Prompt'}
        </button>
        <button
          onClick={() => onGenerate(prompt, aspectRatio, highQuality)}
          disabled={isGenerating || !prompt}
          className="flex-[2] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : 'Generate Vision'}
        </button>
      </div>
    </div>
  );
};
