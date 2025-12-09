import { supabase } from "@/integrations/supabase/client";
import { sanitizeForTTS } from "./ttsSanitizer";
import { ttsConfig } from "./ttsConfig";

/**
 * Available ElevenLabs voices with Hebrew support
 */
export const ELEVENLABS_VOICES = {
  'Rachel': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'רחל', description: 'קול נשי חם ונעים' },
  'Sarah': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'שרה', description: 'קול נשי ברור ומקצועי' },
  'Aria': { id: '9BWtsMINqrJLrRacOk9x', name: 'אריה', description: 'קול נשי אנרגטי' },
  'Laura': { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'לאורה', description: 'קול נשי רך' },
  'Charlotte': { id: 'XB0fDUnXU5powFXDhCwa', name: 'שרלוט', description: 'קול נשי אלגנטי' },
  'Alice': { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'אליס', description: 'קול נשי צעיר' },
  'Matilda': { id: 'XrExE9yKIg1WjnnlVkGX', name: 'מתילדה', description: 'קול נשי בוגר' },
  'Lily': { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'לילי', description: 'קול נשי עדין' },
} as const;

export type ElevenLabsVoice = keyof typeof ELEVENLABS_VOICES;

// Store current audio element for stopping
let currentAudio: HTMLAudioElement | null = null;

/**
 * Speak text using ElevenLabs TTS via edge function
 * Falls back to Web Speech API if ElevenLabs fails
 */
export async function speakWithElevenLabs(
  text: string,
  voice: ElevenLabsVoice = 'Rachel',
  onStart?: () => void,
  onEnd?: () => void,
  language: 'he' | 'en' = 'he'
): Promise<boolean> {
  // Sanitize the text first
  const sanitizedText = sanitizeForTTS(text);
  
  if (!sanitizedText) {
    console.warn('Empty text after sanitization, skipping TTS');
    return false;
  }

  if (ttsConfig.enableLogging) {
    console.log('[ElevenLabs TTS] Speaking:', sanitizedText.substring(0, 50) + '...');
  }

  try {
    // Stop any currently playing audio
    stopElevenLabsSpeech();
    
    onStart?.();

    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: sanitizedText, voice, language }
    });

    if (error) {
      console.error('[ElevenLabs TTS] Edge function error:', error);
      throw error;
    }

    if (!data?.audioContent) {
      throw new Error('No audio content returned');
    }

    // Convert base64 to audio and play
    const audioBlob = base64ToBlob(data.audioContent, 'audio/mpeg');
    const audioUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(audioUrl);

    return new Promise((resolve) => {
      if (!currentAudio) {
        resolve(false);
        return;
      }
      
      currentAudio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        onEnd?.();
        resolve(true);
      };

      currentAudio.onerror = (e) => {
        console.error('[ElevenLabs TTS] Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        onEnd?.();
        resolve(false);
      };

      currentAudio.play().catch((e) => {
        console.error('[ElevenLabs TTS] Play error:', e);
        currentAudio = null;
        onEnd?.();
        resolve(false);
      });
    });
  } catch (error) {
    console.error('[ElevenLabs TTS] Error, falling back to Web Speech API:', error);
    onEnd?.();
    
    // Fallback to Web Speech API
    return speakWithWebSpeech(sanitizedText, onStart, onEnd);
  }
}

/**
 * Fallback to Web Speech API
 */
function speakWithWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (!('speechSynthesis' in window)) {
    console.warn('[Web Speech] Not supported');
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'he-IL';
  utterance.rate = ttsConfig.defaultRate;

  // Try to find a Hebrew voice
  const voices = window.speechSynthesis.getVoices();
  const hebrewVoice = voices.find(v => v.lang.includes('he'));
  if (hebrewVoice) {
    utterance.voice = hebrewVoice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();

  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Convert base64 string to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

/**
 * Stop any currently playing audio
 */
export function stopElevenLabsSpeech(): void {
  // Stop ElevenLabs audio if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  
  // Stop Web Speech API if it's speaking
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Check if audio is currently playing
 */
export function isElevenLabsSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}
