import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { ChatAnalysis } from '../types';

interface AnalysisResultProps {
  imageSrc: string;
  analysis: ChatAnalysis;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  imageSrc,
  analysis,
  onReset,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [fireRating, setFireRating] = useState<number>(0);
  const [hoveredFire, setHoveredFire] = useState<number>(0);

  // Exactly ONE primary AI response
  const singleReply = analysis.suggestedReplies[0] || {
    text: 'Only for people who keep up with my energy 😏',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleRate = (rating: number) => {
    setFireRating((prev) => (prev === rating ? 0 : rating));
  };

  const activeScore = hoveredFire || fireRating;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col justify-between space-y-3 sm:space-y-4 animate-in fade-in duration-300">
      {/* Sent screenshot purely as clean image (compact height so no scroll is needed) */}
      <div className="flex justify-end pr-1">
        <img
          src={imageSrc}
          alt="Sent conversation screenshot"
          className="max-h-28 sm:max-h-40 max-w-[170px] sm:max-w-[240px] object-contain rounded-2xl shadow-xl ring-2 ring-white/80 bg-white/30"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Left side: Single AI Response Window */}
      <div className="w-full apple-glass rounded-3xl overflow-hidden shadow-2xl">
        {/* macOS Titlebar */}
        <div className="flex items-center px-4 py-2 sm:py-2.5 border-b border-white/60 bg-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 text-center pr-8 text-[11px] font-bold text-[#0015fc] uppercase tracking-wider">
            caawiye
          </div>
        </div>

        {/* AI Response Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* The One Answer */}
          <div className="text-lg sm:text-2xl font-semibold text-stone-900 leading-snug select-all">
            "{singleReply.text}"
          </div>

          {/* Actions Row: Copy Button & Rolling Fire Emoji Rating */}
          <div className="pt-3 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2.5">
            {/* Fire Emoji Rating */}
            <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-white shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 select-none mr-0.5">
                Rate:
              </span>
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = star <= activeScore;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoveredFire(star)}
                    onMouseLeave={() => setHoveredFire(0)}
                    className={`text-xl sm:text-2xl transition-transform duration-150 transform hover:scale-130 active:scale-90 ${
                      isLit
                        ? 'opacity-100 drop-shadow-[0_2px_8px_rgba(255,100,0,0.6)] animate-bounce-short'
                        : 'opacity-25 hover:opacity-75 grayscale'
                    }`}
                    title={`${star} 🔥`}
                  >
                    🔥
                  </button>
                );
              })}
            </div>

            {/* Apple Blue Copy Button (#0015fc) */}
            <button
              type="button"
              onClick={() => handleCopy(singleReply.text)}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 active:scale-95 ${
                isCopied
                  ? 'bg-emerald-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)]'
                  : 'apple-blue-btn'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button "Ku Cesho" in Apple Glass Style */}
      <div className="pt-1">
        <button
          id="ku-cesho-btn"
          type="button"
          onClick={onReset}
          className="w-full py-3 px-5 rounded-2xl apple-glass text-stone-900 hover:text-[#0015fc] font-bold text-base tracking-wide transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl active:scale-[0.99] border border-white"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Ku Cesho</span>
        </button>
      </div>
    </div>
  );
};
