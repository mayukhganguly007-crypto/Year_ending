
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCardProps {
  image: GeneratedImage;
  onDownload: (url: string, filename: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onDownload }) => {
  return (
    <div className="group relative glass-panel rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-500">
      <div className="aspect-square relative overflow-hidden bg-black/50">
        <img 
          src={image.url} 
          alt={image.prompt} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <p className="text-sm text-gray-200 line-clamp-3 mb-4 italic">
            "{image.prompt}"
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(image.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <button
              onClick={() => onDownload(image.url, `year-end-${image.id}.png`)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md p-2 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
