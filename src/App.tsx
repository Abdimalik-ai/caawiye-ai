import React, { useState } from 'react';
import { Header } from './components/Header';
import { ScreenshotUploader } from './components/ScreenshotUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { SettingsModal } from './components/SettingsModal';
import { PlansModal } from './components/PlansModal';
import { AuthModal } from './components/AuthModal';
import { ChatAnalysis } from './types';
import { getUserCode, setUserCode, clearUserCode } from './utils/userCode';

// Curated list of single high-IQ charismatic dating replies
const SINGLE_REPLIES = [
  'Only for people who keep up with my energy 😏',
  'Tell you what, ask me in person over drinks tomorrow and I might tell you.',
  'You definitely have my attention. What are you doing this Friday?',
  'Took you long enough to text back, I was about to write you a ticket 🚓',
  'Dinner on me this weekend, but only if you promise to pick the dessert.',
  'Sounds like trouble. Count me in.',
  'I was actually just thinking about you... perfect timing.',
  'Careful now, you’re dangerously close to making me smile at my phone.',
];

export default function App() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ChatAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isPlansOpen, setIsPlansOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [userTikTok, setUserTikTok] = useState<string | null>(() => {
    return localStorage.getItem('caawiye_user_tiktok');
  });
  const [userCode, setCode] = useState<string | null>(() => {
    return getUserCode();
  });

  const handleLogin = (username: string, newCode: string) => {
    setUserTikTok(username);
    setCode(newCode);
    localStorage.setItem('caawiye_user_tiktok', username);
    setUserCode(newCode);
  };

  const handleLogout = () => {
    setUserTikTok(null);
    setCode(null);
    localStorage.removeItem('caawiye_user_tiktok');
    clearUserCode();
  };

  const handleAnalyze = (imageBase64: string) => {
    setUploadedImage(imageBase64);
    setIsLoading(true);

    // Simulate smart AI analysis delay
    setTimeout(() => {
      const selectedReply =
        SINGLE_REPLIES[Math.floor(Math.random() * SINGLE_REPLIES.length)];

      setAnalysis({
        lastMessage: 'Conversation screenshot received',
        sender: 'Her',
        detectedTone: 'Playful & Interested',
        moodCategory: 'flirty',
        subtext: 'She is checking your interest level and inviting a response.',
        suggestedReplies: [
          {
            tone: 'Charismatic',
            badge: 'Smooth',
            text: selectedReply,
            strategy: 'Direct, playful, and proactive.',
          },
        ],
        keyAdvice: 'Send this reply and wait for her response.',
      });
      setIsLoading(false);
    }, 1100);
  };

  const handleReset = () => {
    setAnalysis(null);
    setUploadedImage(null);
    setIsLoading(false);
  };

  return (
    <div className="h-screen h-[100dvh] sky-bg text-stone-900 flex flex-col justify-between selection:bg-[#0015fc] selection:text-white font-sans antialiased overflow-hidden">
      <main className="w-full max-w-2xl mx-auto px-4 py-2 sm:py-4 flex-1 flex flex-col justify-between overflow-hidden">
        <Header 
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
          userTikTok={userTikTok}
          userCode={userCode}
          showSettings={!analysis && !isLoading}
        />

        {/* 2-Page Flow - Auto-fitted to full screen with no scroll needed */}
        <div className="w-full flex-1 flex flex-col justify-center overflow-hidden my-auto">
          {isLoading ? (
            /* Loading State in macOS Glass Window */
            <div className="w-full py-12 sm:py-16 rounded-3xl apple-glass flex flex-col items-center justify-center space-y-4 text-center shadow-2xl">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-white/60 border-t-[#0015fc] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-lg select-none">
                  🔥
                </div>
              </div>
              <p className="text-base font-bold text-stone-900">
                Analyzing chat...
              </p>
            </div>
          ) : !analysis || !uploadedImage ? (
            /* Page 1: Upload Screenshot */
            <ScreenshotUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
          ) : (
            /* Page 2: Chat Result (1 AI Response) */
            <AnalysisResult
              imageSrc={uploadedImage}
              analysis={analysis}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* Settings Modal with Log Out & cw____ code functionality */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenPlans={() => setIsPlansOpen(true)}
        userTikTok={userTikTok}
        userCode={userCode}
        onLogout={handleLogout}
      />

      {/* Dedicated Plans Window Modal */}
      <PlansModal
        isOpen={isPlansOpen}
        onClose={() => setIsPlansOpen(false)}
      />

      {/* Continue with TikTok Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        userTikTok={userTikTok}
        userCode={userCode}
        onLogin={handleLogin}
      />
    </div>
  );
}
