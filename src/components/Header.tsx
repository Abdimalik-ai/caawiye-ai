import React from 'react';
import { Settings, LogIn } from 'lucide-react';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
  userTikTok?: string | null;
  userCode?: string | null;
  showSettings?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenAuth,
  userTikTok,
  userCode,
  showSettings = true,
}) => {
  return (
    <header className="w-full pt-3 pb-3 flex items-center justify-between">
      {/* Brand Pill */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full apple-glass-pill text-[#0015fc] text-[11px] font-bold tracking-wider uppercase shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#0015fc] animate-pulse" />
        <span>caawiye</span>
      </div>

      {/* Right Controls: Sign Up + Settings Cog Button */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Sign Up / User Code Button */}
        {onOpenAuth && (
          <button
            type="button"
            onClick={onOpenAuth}
            className={`px-2.5 py-1 sm:px-3 sm:py-1.2 rounded-full font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-xs ${
              userTikTok
                ? 'apple-glass text-stone-900 hover:text-[#0015fc] border border-white text-[10px] sm:text-xs'
                : 'apple-glass-pill text-[#0015fc] hover:bg-white border border-white/80 text-[10px] sm:text-xs'
            }`}
          >
            {userTikTok ? (
              <>
                <svg className="w-3 h-3 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.08a8.16 8.16 0 0 0 4.91 1.63V7.27a4.85 4.85 0 0 1-1-.58Z" />
                </svg>
                <span className="font-mono font-black text-stone-900">
                  {userCode || userTikTok}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3 stroke-[2.5]" />
                <span>Sign Up</span>
              </>
            )}
          </button>
        )}

        {/* Settings Cog Button */}
        {showSettings && onOpenSettings ? (
          <button
            type="button"
            onClick={onOpenSettings}
            title="Settings & Community"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full apple-glass-pill flex items-center justify-center text-stone-800 hover:text-[#0015fc] transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2]" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </header>
  );
};
