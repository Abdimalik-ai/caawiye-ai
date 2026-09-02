import React, { useState } from 'react';
import { X, Check, Loader2, Copy, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userTikTok: string | null;
  userCode: string | null;
  onLogin: (username: string, code: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userTikTok,
  userCode,
  onLogin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleTikTokAuth = () => {
    setIsLoading(true);

    // Simulate TikTok Login & generate unique cw____ code
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      const generatedUsername = '@user_' + Math.floor(1000 + Math.random() * 9000);
      const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
      const newCode = `cw${randomDigits}`;

      onLogin(generatedUsername, newCode);

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  const handleCopyCode = () => {
    if (!userCode) return;
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm apple-glass rounded-3xl overflow-hidden shadow-2xl border border-white/90 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/60 bg-white/50">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[11px] font-extrabold text-stone-700 uppercase tracking-wider">
            {userTikTok ? 'Akoonkaaga' : 'Sign In with TikTok'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-stone-700 flex items-center justify-center transition-all shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {userTikTok && userCode ? (
            /* Already Logged In: Show Account & Unique cw____ Code (No extra continue button) */
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.08a8.16 8.16 0 0 0 4.91 1.63V7.27a4.85 4.85 0 0 1-1-.58Z" />
                </svg>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-stone-900">
                  Akoonkaaga waa diyaar
                </h3>
                <p className="text-xs font-bold text-stone-600">
                  {userTikTok}
                </p>
              </div>

              {/* Unique cw____ Code Card */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-white shadow-sm space-y-1.5 text-center">
                <div className="text-[10px] font-extrabold text-[#0015fc] uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#0015fc]" />
                  <span>Koodhkaaga Gaarka Ah (Unique Code)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-2xl font-black text-stone-900 tracking-wider">
                    {userCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    title="Koobiyeey Koodhka"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 font-medium">
                  Koodhkani wuxuu u gaar yahay akoonkaaga ({userCode}).
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs apple-blue-btn shadow-md active:scale-98 transition-all"
              >
                Waayahay (Xidh)
              </button>
            </div>
          ) : (
            /* First Time: Single-click Continue with TikTok */
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.08a8.16 8.16 0 0 0 4.91 1.63V7.27a4.85 4.85 0 0 1-1-.58Z" />
                  </svg>
                </div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  Ku Gal TikTok
                </h3>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Sign In hal taabasho ah oo toos kuu siinaya koodhkaaga gaarka ah ee <strong>cw____</strong>.
                </p>
              </div>

              {showSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Waad ku guuleysatay galitaanka!</span>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleTikTokAuth}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-2xl bg-black hover:bg-stone-900 active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Fadlan sug, TikTok ayaa furmaya...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.08a8.16 8.16 0 0 0 4.91 1.63V7.27a4.85 4.85 0 0 1-1-.58Z" />
                        </svg>
                        <span>Continue with TikTok</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
