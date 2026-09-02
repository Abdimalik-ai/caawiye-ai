import React, { useState } from 'react';
import { X, CreditCard, Share2, MessageCircle, Check, Copy, ChevronRight, LogOut, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlans: () => void;
  userTikTok?: string | null;
  userCode?: string | null;
  onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPlans,
  userTikTok,
  userCode,
  onLogout,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'caawiye — AI Dating Assistant',
          text: 'Soo gali chats-kaada caawiye ha kuu dhiso jawaabaha ugu fiican!',
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    if (!userCode) return;
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open('https://chat.whatsapp.com/EZLHWqsDYOJDTUX5BxWMwc?s=cl&p=i&mlu=4', '_blank');
  };

  const handleOpenPlans = () => {
    onClose();
    onOpenPlans();
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md apple-glass rounded-3xl overflow-hidden shadow-2xl border border-white/90 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titlebar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/60 bg-white/50">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Settings & Options
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/70 hover:bg-white text-stone-700 flex items-center justify-center transition-all shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* User Account Info / Unique cw____ Code / Logout */}
          {userTikTok && (
            <div className="rounded-2xl bg-white/90 p-4 border border-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.88 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.08a8.16 8.16 0 0 0 4.91 1.63V7.27a4.85 4.85 0 0 1-1-.58Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-stone-900 leading-tight">
                      {userTikTok}
                    </h4>
                    <p className="text-[10px] text-stone-500 font-medium">
                      TikTok Connected
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Unique Code Box */}
              {userCode && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0015fc]" />
                    <span className="text-[11px] font-bold text-stone-600">
                      User Code:
                    </span>
                    <span className="font-mono text-xs font-extrabold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                      {userCode}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1 rounded-md hover:bg-white text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    {copiedCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 1. Iibso Credits Button -> Opens Dedicated Plans Window */}
          <div className="rounded-2xl bg-white/80 p-4 border border-white shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#0015fc]">
              <div className="w-9 h-9 rounded-xl bg-[#0015fc]/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 leading-tight">
                  Iibso Credits
                </h3>
                <p className="text-[11px] text-stone-500">
                  Arag xirmooyinka SAXIIB, WEHEL, iyo GARAB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenPlans}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs apple-blue-btn flex items-center justify-between shadow-md"
            >
              <span>Fur Daaqadda Xirmooyinka (Plans)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 2. La Wadaag Asxaabtaada */}
          <div className="rounded-2xl bg-white/80 p-4 border border-white shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#0015fc]">
              <div className="w-9 h-9 rounded-xl bg-[#0015fc]/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 leading-tight">
                  La wadaag asxaabtaada
                </h3>
                <p className="text-[11px] text-stone-500">
                  U dir link-ga caawiye asxaabtaada
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'apple-blue-btn'
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Link-ga waa la koobiyeeyay!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Koobiyeey & La Wadaag Link-ga</span>
                </>
              )}
            </button>
          </div>

          {/* 3. WhatsApp Community */}
          <div className="rounded-2xl bg-white/80 p-4 border border-white shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-600">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 leading-tight">
                  WhatsApp Community
                </h3>
                <p className="text-[11px] text-stone-500">
                  Ku biir group-ka WhatsApp ee bulshada caawiye
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ku Biir WhatsApp Community</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
