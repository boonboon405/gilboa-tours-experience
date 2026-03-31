import { supabase } from "@/integrations/supabase/client";
import { sanitizeForTTS } from "./ttsSanitizer";
import { ttsConfig } from "./ttsConfig";
import { toast } from "sonner";

/**
 * Available ElevenLabs voices with Hebrew support
 */
export const ELEVENLABS_VOICES = {
  // Female voices
  'Rachel': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'רחל', description: 'קול נשי חם ונעים', gender: 'female' },
  'Sarah': { id: 'EXAVITQu4vr4xnSDxMaL', name: 'שרה', description: 'קול נשי ברור ומקצועי', gender: 'female' },
  'Aria': { id: '9BWtsMINqrJLrRacOk9x', name: 'אריה', description: 'קול נשי אנרגטי', gender: 'female' },
  'Laura': { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'לאורה', description: 'קול נשי רך', gender: 'female' },
  'Charlotte': { id: 'XB0fDUnXU5powFXDhCwa', name: 'שרלוט', description: 'קול נשי אלגנטי', gender: 'female' },
  'Alice': { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'אליס', description: 'קול נשי צעיר', gender: 'female' },
  'Matilda': { id: 'XrExE9yKIg1WjnnlVkGX', name: 'מתילדה', description: 'קול נשי בוגר', gender: 'female' },
  'Lily': { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'לילי', description: 'קול נשי עדין', gender: 'female' },
  // Male voices
  'Roger': { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'רוג׳ר', description: 'קול גברי עמוק', gender: 'male' },
  'Charlie': { id: 'IKne3meq5aSn9XLyUdCD', name: 'צ׳רלי', description: 'קול גברי צעיר', gender: 'male' },
  'George': { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'ג׳ורג׳', description: 'קול גברי בריטי', gender: 'male' },
  'Callum': { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'קאלום', description: 'קול גברי רגוע', gender: 'male' },
  'Liam': { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'ליאם', description: 'קול גברי אנרגטי', gender: 'male' },
  'Daniel': { id: 'onwK4e9ZLuTAKqWW03F9', name: 'דניאל', description: 'קול גברי מקצועי', gender: 'male' },
  'Brian': { id: 'nPczCjzI2devNBz1zQrb', name: 'בראיין', description: 'קול גברי חם', gender: 'male' },
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

    // Use data URI for reliable base64 audio playback (avoids manual decoding issues)
    const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
    currentAudio = new Audio(audioUrl);

    return new Promise((resolve) => {
      if (!currentAudio) {
        resolve(false);
        return;
      }
      
      currentAudio.onended = () => {
        currentAudio = null;
        onEnd?.();
        resolve(true);
      };

      currentAudio.onerror = (e) => {
        console.error('[ElevenLabs TTS] Audio playback error:', e);
        currentAudio = null;
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
    return speakWithWebSpeech(sanitizedText, onStart, onEnd, language);
  }
}

/**
 * Fallback to Web Speech API
 */
function speakWithWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  language: 'he' | 'en' = 'he'
): boolean {
  if (!('speechSynthesis' in window)) {
    console.warn('[Web Speech] Not supported');
    return false;
  }

  const voices = window.speechSynthesis.getVoices();

  if (language === 'he') {
    const hebrewVoice = voices.find(v => v.lang === 'he-IL' || v.lang === 'he');
    if (!hebrewVoice) {
      console.warn('[Web Speech] No Hebrew voice available, failing silently');
      toast("Hebrew voice unavailable on this device");
      return false;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = ttsConfig.defaultRate;
    utterance.voice = hebrewVoice;
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  // English / other — unchanged fallback
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = ttsConfig.defaultRate;
  const englishVoice = voices.find(v => v.lang.includes('en'));
  if (englishVoice) utterance.voice = englishVoice;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
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
