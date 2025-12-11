import { useState, useEffect, useCallback } from 'react';
import { ElevenLabsVoice } from '@/utils/elevenLabsTTS';
import { VoiceOption } from '@/utils/realtimeChat';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
  sentiment?: {
    type: 'positive' | 'neutral' | 'negative';
    icon: string;
    color: string;
  };
}

interface UserPreferences {
  language: 'he' | 'en';
  elevenLabsVoice: ElevenLabsVoice;
  realtimeVoice: VoiceOption;
  chatHistory: Message[];
  conversationId: string | null;
  lastVisit: string;
}

const STORAGE_KEY = 'user-preferences';
const CHAT_HISTORY_KEY = 'chat-messages';

const defaultPreferences: UserPreferences = {
  language: 'he',
  elevenLabsVoice: 'Rachel',
  realtimeVoice: 'alloy',
  chatHistory: [],
  conversationId: null,
  lastVisit: new Date().toISOString()
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultPreferences, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load preferences:', e);
    }
    return defaultPreferences;
  });

  // Load chat history separately (can be large)
  const [chatHistory, setChatHistory] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(CHAT_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return [];
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      const toStore = { ...preferences, chatHistory: undefined };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.error('Failed to save preferences:', e);
    }
  }, [preferences]);

  // Save chat history separately
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [chatHistory]);

  const updateLanguage = useCallback((language: 'he' | 'en') => {
    setPreferences(prev => ({ ...prev, language }));
    localStorage.setItem('preferred-language', language);
  }, []);

  const updateElevenLabsVoice = useCallback((voice: ElevenLabsVoice) => {
    setPreferences(prev => ({ ...prev, elevenLabsVoice: voice }));
    localStorage.setItem('preferred-voice', voice);
  }, []);

  const updateRealtimeVoice = useCallback((voice: VoiceOption) => {
    setPreferences(prev => ({ ...prev, realtimeVoice: voice }));
    localStorage.setItem('preferred-realtime-voice', voice);
  }, []);

  const saveChatHistory = useCallback((messages: Message[], conversationId: string | null) => {
    setChatHistory(messages);
    setPreferences(prev => ({ ...prev, conversationId, lastVisit: new Date().toISOString() }));
  }, []);

  const clearChatHistory = useCallback(() => {
    setChatHistory([]);
    setPreferences(prev => ({ ...prev, conversationId: null }));
  }, []);

  const hasRecentChat = chatHistory.length > 0;

  return {
    preferences,
    chatHistory,
    hasRecentChat,
    updateLanguage,
    updateElevenLabsVoice,
    updateRealtimeVoice,
    saveChatHistory,
    clearChatHistory
  };
}
