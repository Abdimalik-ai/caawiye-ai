export interface ReplySuggestion {
  tone: string;
  badge: string;
  text: string;
  strategy: string;
}

export type MoodCategory = 'flirty' | 'testing' | 'casual' | 'curious' | 'upset' | 'sweet' | 'neutral';

export interface ChatAnalysis {
  lastMessage: string;
  sender: string;
  detectedTone: string;
  moodCategory: MoodCategory;
  subtext: string;
  suggestedReplies: ReplySuggestion[];
  keyAdvice: string;
}
