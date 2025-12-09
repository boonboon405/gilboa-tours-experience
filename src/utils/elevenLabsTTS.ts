import { supabase } from "@/integrations/supabase/client";
import { sanitizeForTTS } from "./ttsSanitizer";
import { ttsConfig } from "./ttsConfig";

/**
 * Available ElevenLabs voices
 */
export type ElevenLabsVoice = 'Rachel' | 'Aria' | 'Sarah' | 'Laura' | 'Charlotte' | 'Alice' | 'Matilda' | 'Lily';

/**
 * Speak text using ElevenLabs TTS via edge function
 * Falls back to Web Speech API if ElevenLabs fails
 */
export async function speakWithElevenLabs(
  text: string,
  voice: ElevenLabsVoice = 'Rachel',
  onStart?: () => void,
  onEnd?: () => void
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
    onStart?.();

    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text: sanitizedText, voice }
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
    const audio = new Audio(audioUrl);

    return new Promise((resolve) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
        resolve(true);
      };

      audio.onerror = (e) => {
        console.error('[ElevenLabs TTS] Audio playback error:', e);
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
        resolve(false);
      };

      audio.play().catch((e) => {
        console.error('[ElevenLabs TTS] Play error:', e);
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
  // Stop Web Speech API if it's speaking
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
