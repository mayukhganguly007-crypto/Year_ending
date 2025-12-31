
import React, { useState, useEffect, useCallback } from 'react';
import { PromptInput } from './components/PromptInput';
import { ImageCard } from './components/ImageCard';
import { AspectRatio, GeneratedImage } from './types';
import { generateImage, enhancePrompt } from './services/gemini';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialPrompt] = useState("A cinematic shot of a small independent cafe at midnight on December 31st. A 'Final Sale' sign hangs in the frost-covered window. The street lights reflect in puddles of melted snow. Moody, emotional, professional photography style.");

  // Check for high quality model key selection if needed
  const handleGenerate = async (prompt: string, aspectRatio: AspectRatio, highQuality: boolean) => {
    setIsGenerating(true);
    setError(null);

    try {
      // If using Gemini 3 models, handle the mandatory key selection
      if (highQuality && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // After returning from dialog, we proceed
        }
      }

      const imageUrl = await generateImage(prompt, aspectRatio, highQuality);
      
      const newImage: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt,
        timestamp: Date.now(),
        aspectRatio
      };

      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      console.error(err);
      if (err.message === "API_KEY_ERROR") {
        setError("API Key Error: Please ensure you have a valid Gemini API Key selected.");
        if (window.aistudio) await window.aistudio.openSelectKey();
      } else {
        setError("Failed to generate image. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-900 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] bg-blue-900 rounded-full blur-[150px]"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-24">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-2">
            AI-Powered Visualization
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Year-End <span className="gradient-text">Visionary</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Harnessing the power of Gemini to visualize the stories of resilience, struggle, and new beginnings at the turning of the year.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls - Sticky */}
          <div className="lg:col-span-5 space-y-8">
            <div className="lg:sticky lg:top-8">
              <PromptInput 
                onGenerate={handleGenerate} 
                onEnhance={enhancePrompt}
                isGenerating={isGenerating}
                initialPrompt={initialPrompt}
              />
              
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="mt-8 glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Artist's Notes</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    "Struggling business" can be depicted through closed shops, empty tables, or weary owners.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    "Year ending" imagery often uses snow, fireworks (contrast), or midnight clocks.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">•</span>
                    Use the 'Enhance' tool for cinematic lighting and emotional depth.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">Generations</h2>
              <span className="text-sm text-gray-500">{images.length} images created</span>
            </div>

            {images.length === 0 && !isGenerating ? (
              <div className="aspect-video glass-panel rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-4 border-dashed border-white/20">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-400">Empty Canvas</h3>
                <p className="text-gray-600 max-w-sm">Enter a prompt on the left to start generating your year-end vision.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {isGenerating && (
                  <div className="aspect-square glass-panel rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 space-y-4 text-center">
                    <div className="loading-shimmer w-full h-full absolute inset-0 opacity-10"></div>
                    <div className="relative z-10 space-y-4">
                      <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto"></div>
                      <p className="text-sm font-medium text-red-500 animate-pulse">Capturing the zeitgeist...</p>
                      <p className="text-xs text-gray-500 italic">Thinking through the details of resilience...</p>
                    </div>
                  </div>
                )}
                {images.map(img => (
                  <ImageCard key={img.id} image={img} onDownload={handleDownload} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-gray-500 text-sm">Built with Gemini 2.5 Image Generation Engine</p>
          <div className="flex justify-center gap-6">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-xs text-gray-600 hover:text-white transition-colors">Billing Documentation</a>
            <a href="#" className="text-xs text-gray-600 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
