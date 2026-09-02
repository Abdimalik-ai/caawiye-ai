import React, { useRef, useEffect, useState } from 'react';
import { UploadCloud } from 'lucide-react';

interface ScreenshotUploaderProps {
  onAnalyze: (imageBase64: string) => void;
  isLoading: boolean;
}

export const ScreenshotUploader: React.FC<ScreenshotUploaderProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler to paste screenshot from clipboard anywhere
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (screenshot).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onAnalyze(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center my-auto">
      {/* Apple macOS Glass Window */}
      <div
        id="dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`apple-glass rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col ${
          isDragging
            ? 'scale-[0.99] ring-4 ring-white/80'
            : 'hover:scale-[1.005]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* macOS Window Titlebar with Traffic Light Dots */}
        <div className="flex items-center px-4 py-2.5 border-b border-white/60 bg-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 shadow-xs" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]/50 shadow-xs" />
          </div>
          <div className="flex-1 text-center pr-8 text-[11px] font-bold text-stone-600/70 tracking-wider uppercase">
            caawiye
          </div>
        </div>

        {/* Upload Body - Compact to prevent any viewport overflow */}
        <div className="py-10 sm:py-16 px-6 sm:px-12 flex flex-col items-center justify-center space-y-5 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/90 shadow-[0_8px_25px_rgba(0,21,252,0.15)] flex items-center justify-center text-[#0015fc] border border-white">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.75]" />
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-stone-900 max-w-md leading-snug">
            Soo Gali Chats ka Halaga Dhisee
          </h2>
        </div>
      </div>
    </div>
  );
};
