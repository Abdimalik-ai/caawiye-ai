import React, { useState } from 'react';
import { X, Check, Phone, ArrowLeft, Loader2, ChevronLeft } from 'lucide-react';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PricePlan {
  id: string;
  name: string;
  badge: string;
  price: string;
  ussdPrice: string;
  period: string;
  feature: string;
  popular?: boolean;
}

const PLANS: PricePlan[] = [
  {
    id: 'saxiib',
    name: 'SAXIIB',
    badge: 'Malinle',
    price: '$0.15',
    ussdPrice: '0.15', // -> *712*612570712*0.15#
    period: '/Malinle',
    feature: '⚡ 15 Fariin',
  },
  {
    id: 'wehel',
    name: 'WEHEL',
    badge: 'Asbuucle',
    price: '$1.3',
    ussdPrice: '1*3',  // -> *712*612570712*1*3#
    period: '/Isbuucle',
    feature: '⭐ 50 Fariin',
    popular: true,
  },
  {
    id: 'garab',
    name: 'GARAB',
    badge: 'Bille',
    price: '$4.5',
    ussdPrice: '4*5',  // -> *712*612570712*4*5#
    period: '/Bille',
    feature: '👑 100',
  },
];

export const PlansModal: React.FC<PlansModalProps> = ({ isOpen, onClose }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('wehel');
  const [isEnteringPhone, setIsEnteringPhone] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  const handleProceedToPhone = () => {
    setIsEnteringPhone(true);
    setErrorMsg(null);
    setIsSuccess(false);
  };

  const handleBackToSelection = () => {
    setIsEnteringPhone(false);
    setPhoneNumber('');
    setErrorMsg(null);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const handleCloseAll = () => {
    handleBackToSelection();
    onClose();
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.trim();

    if (!cleanPhone || cleanPhone.length < 6) {
      setErrorMsg('Fadlan geli lambar taleefan oo sax ah.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    const ussdString = `*712*612570712*${currentPlan.ussdPrice}#`;

    // Triggers mobile phone dialer with exact USSD string
    try {
      window.location.href = `tel:${encodeURIComponent(ussdString)}`;
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        handleCloseAll();
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg apple-glass rounded-3xl overflow-hidden shadow-2xl border border-white/90 animate-in zoom-in-95 duration-200 flex flex-col max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/60 bg-white/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={isEnteringPhone ? handleBackToSelection : handleCloseAll}
              className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-stone-700 flex items-center justify-center transition-all shadow-xs"
              title="Back / Close"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 ml-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
            </div>
          </div>
          <span className="text-[11px] font-extrabold text-[#0015fc] uppercase tracking-wider">
            caawiye Pro
          </span>
          <button
            type="button"
            onClick={handleCloseAll}
            className="w-6 h-6 rounded-full bg-white/70 hover:bg-white text-stone-700 flex items-center justify-center transition-all shadow-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content Body - Perfectly sized without scrolling */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          {!isEnteringPhone ? (
            /* STEP 1: Paywall Layout */
            <div className="space-y-5 flex-1 flex flex-col justify-between py-2">
              {/* Title & Subtitle */}
              <div className="text-center space-y-1.5 pt-1">
                <div className="inline-block px-3 py-0.5 rounded-full bg-[#0015fc]/10 text-[#0015fc] text-[10px] font-extrabold uppercase tracking-wider">
                  Premium Access
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  caawiye Pro
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-stone-600 max-w-xs mx-auto">
                  Hel jawaabaha ugu sarreeya ee wada hadalkaaga
                </p>
              </div>

              {/* 3 Price Cards in 1 Row Side-by-Side */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 py-1">
                {PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative rounded-2xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white shadow-[0_8px_25px_rgba(0,21,252,0.18)] ring-2 ring-[#0015fc] border-transparent scale-[1.02]'
                          : 'bg-white/70 hover:bg-white/90 border border-white/80 shadow-xs'
                      }`}
                    >
                      {/* Selected Checkmark Badge (Top Right) */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#0015fc] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Plan Title */}
                      <div className="text-xs sm:text-sm font-extrabold text-stone-900">
                        {plan.name}
                      </div>

                      {/* Big Price */}
                      <div className="my-2">
                        <div className="text-xl sm:text-2xl font-black text-stone-900 leading-none">
                          {plan.price}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-stone-500 font-semibold mt-1">
                          {plan.period}
                        </div>
                      </div>

                      {/* Feature Label */}
                      <div className="text-[10px] sm:text-[11px] font-bold text-stone-700 bg-stone-100/80 rounded-lg py-1.5 px-1">
                        {plan.feature}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main CTA Button: Hadda Furo */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPhone}
                  className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base apple-blue-btn flex items-center justify-center shadow-lg active:scale-[0.98] transition-all"
                >
                  <span>Hadda Furo</span>
                </button>
              </div>

              {/* Footer Links */}
              <div className="flex items-center justify-center gap-3 text-[10px] font-semibold text-stone-400 pt-0.5">
                <button type="button" className="hover:text-stone-700 transition-colors">
                  Terms
                </button>
                <span>•</span>
                <button type="button" className="hover:text-stone-700 transition-colors">
                  Cabasho
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: Phone Input Window */
            <div className="space-y-5 my-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="rounded-2xl bg-white/90 p-4 border border-white shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#0015fc]/10 text-[#0015fc]">
                    Xidhmada La Doortay
                  </span>
                  <h3 className="text-lg font-extrabold text-stone-900 mt-1">
                    {currentPlan.name} ({currentPlan.badge})
                  </h3>
                  <p className="text-xs text-stone-500">
                    {currentPlan.feature}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#0015fc]">
                    {currentPlan.price}
                  </div>
                  <div className="text-[11px] text-stone-400 font-medium">
                    {currentPlan.period}
                  </div>
                </div>
              </div>

              {isSuccess ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3 shadow-md animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-md">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-extrabold text-emerald-900">
                    Codsiga waa la diray!
                  </h3>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Waxaa taleefankaaga toos uga furmay lambarka USSD: <br />
                    <span className="font-mono font-bold text-stone-900 bg-white/80 px-2 py-1 rounded-md mt-1 inline-block">
                      *712*612570712*{currentPlan.ussdPrice}#
                    </span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="phone-input" className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                      Geli Lambarkaaga Taleefanka
                    </label>

                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 text-stone-400 flex items-center gap-1.5 pointer-events-none">
                        <Phone className="w-4 h-4 text-[#0015fc]" />
                        <span className="text-xs font-bold text-stone-700 pr-1 border-r border-stone-200">
                          +252
                        </span>
                      </div>
                      <input
                        id="phone-input"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="61XXXXXXX ama 63XXXXXXX"
                        disabled={isProcessing}
                        autoFocus
                        className="w-full pl-24 pr-4 py-3.5 rounded-2xl bg-white/90 border border-stone-200 focus:border-[#0015fc] focus:ring-4 focus:ring-[#0015fc]/15 outline-none font-semibold text-stone-900 text-base transition-all shadow-inner"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-rose-600 pl-1 animate-in fade-in">
                        {errorMsg}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm apple-blue-btn flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Fadlan sug, codsiga ayaa socda...</span>
                      </>
                    ) : (
                      <span>Xaqiiji & Bixi {currentPlan.price}</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};