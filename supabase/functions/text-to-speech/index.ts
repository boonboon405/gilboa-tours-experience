import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encodeBase64 } from "https://deno.land/std@0.220.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const voiceIds: Record<string, string> = {
  'Rachel': 'EXAVITQu4vr4xnSDxMaL',
  'Aria': '9BWtsMINqrJLrRacOk9x',
  'Sarah': 'EXAVITQu4vr4xnSDxMaL',
  'Laura': 'FGY2WhTYpPnrIDTdsKH5',
  'Charlotte': 'XB0fDUnXU5powFXDhCwa',
  'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
  'Matilda': 'XrExE9yKIg1WjnnlVkGX',
  'Lily': 'pFZP5JQG7iQjIQuC4Bku',
  'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
  'Charlie': 'IKne3meq5aSn9XLyUdCD',
  'George': 'JBFqnCBsd6RMkjVDRZzb',
  'Callum': 'N2lVS1w4EtoT3dr4eOWO',
  'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
  'Daniel': 'onwK4e9ZLuTAKqWW03F9',
  'Brian': 'nPczCjzI2devNBz1zQrb',
};

const HEBREW_CHAR_REGEX = /[\u0590-\u05FF]/;

const COMMON_HEBREW_TRANSLITERATIONS: Record<string, string> = {
  'שלום': 'shalom',
  'תודה': 'todah',
  'בבקשה': 'bevakashah',
  'בשמחה': 'besimkhah',
  'כן': 'ken',
  'לא': 'lo',
  'איך': 'eikh',
  'אפשר': 'efshar',
  'לעזור': 'laazor',
  'אשמח': 'esmakh',
  'היום': 'hayom',
  'מחר': 'makhar',
  'אתם': 'atem',
  'אתן': 'aten',
  'אנחנו': 'anakhnu',
  'אני': 'ani',
  'מעולה': 'meuleh',
  'מצוין': 'metsuyan',
  'סיור': 'siyur',
  'טיול': 'tiyul',
  'גלבוע': 'gilboa',
  'גליל': 'galil',
  'עמק': 'emek',
  'המעיינות': 'hamaayanot',
};

function containsHebrew(text: string): boolean {
  return HEBREW_CHAR_REGEX.test(text);
}

function cleanTextForSpeech(text: string, language: 'he' | 'en'): string {
  const trimmed = text.trim();

  if (language === 'he') {
    return trimmed
      .replace(/[^\u0590-\u05FFa-zA-Z0-9\s.,!?;:'"()\-\/\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return trimmed
    .replace(/[^a-zA-Z0-9\s.,!?;:'"()\-\/\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeHebrew(text: string): string {
  return text
    .replace(/[^\u0590-\u05FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function transliterateHebrewWord(word: string): string {
  const strippedWord = word.replace(/[^\u0590-\u05FF]/g, '');
  if (!strippedWord) return word;

  if (COMMON_HEBREW_TRANSLITERATIONS[strippedWord]) {
    return word.replace(strippedWord, COMMON_HEBREW_TRANSLITERATIONS[strippedWord]);
  }

  const letterMap: Record<string, string> = {
    'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
    'ח': 'kh', 'ט': 't', 'י': 'y', 'כ': 'kh', 'ך': 'kh', 'ל': 'l', 'מ': 'm',
    'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'f',
    'צ': 'ts', 'ץ': 'ts', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't', 'וֹ': 'o',
  };

  let transliterated = '';
  for (const char of strippedWord) {
    transliterated += letterMap[char] ?? '';
  }

  transliterated = transliterated
    .replace(/aa+/g, 'a')
    .replace(/yy+/g, 'y')
    .replace(/vv+/g, 'v')
    .replace(/shh+/g, 'sh');

  return word.replace(strippedWord, transliterated || strippedWord);
}

function transliterateHebrewText(text: string): string {
  return text
    .split(/(\s+)/)
    .map((token) => containsHebrew(token) ? transliterateHebrewWord(token) : token)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

async function generateSpeechAudio(text: string, voiceId: string): Promise<ArrayBuffer> {
  const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.42,
        similarity_boost: 0.82,
        style: 0.08,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[TTS] ElevenLabs error:', response.status, errorText);
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return await response.arrayBuffer();
}

async function transcribeGeneratedHebrew(audioBuffer: ArrayBuffer): Promise<string | null> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'speech.mp3');
    formData.append('model', 'gpt-4o-mini-transcribe');
    formData.append('language', 'he');
    formData.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.warn('[TTS] Hebrew validation transcription failed:', response.status, await response.text());
      return null;
    }

    return (await response.text()).trim();
  } catch (error) {
    console.warn('[TTS] Hebrew validation transcription error:', error);
    return null;
  }
}

function isHebrewAudioValid(expectedText: string, transcript: string | null): boolean {
  if (!transcript) return false;

  const expected = normalizeHebrew(expectedText);
  const actual = normalizeHebrew(transcript);

  if (!expected || !actual) return false;

  const expectedWords = [...new Set(expected.split(' ').filter((word) => word.length > 1))];
  const actualWords = new Set(actual.split(' ').filter((word) => word.length > 1));

  if (expectedWords.length === 0) {
    return /[\u0590-\u05FF]{3,}/.test(actual);
  }

  const matches = expectedWords.filter((word) => actualWords.has(word)).length;
  const overlap = matches / expectedWords.length;

  return /[\u0590-\u05FF]{3,}/.test(actual) && overlap >= 0.3;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'Rachel', language = 'he' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const voiceId = voiceIds[voice] || voiceIds['Rachel'];

    const requestedLanguage = language === 'en' ? 'en' : 'he';
    const detectedLanguage = requestedLanguage === 'he' || containsHebrew(text) ? 'he' : 'en';
    const processedText = cleanTextForSpeech(text, detectedLanguage);

    console.log(`[TTS] Voice: ${voice}, requested lang: ${requestedLanguage}, detected lang: ${detectedLanguage}, text length: ${processedText.length}`);

    let arrayBuffer: ArrayBuffer;
    let mode = 'standard';

    if (detectedLanguage === 'he') {
      const nativeHebrewAudio = await generateSpeechAudio(processedText, voiceId);
      const transcript = await transcribeGeneratedHebrew(nativeHebrewAudio);
      const validationPassed = isHebrewAudioValid(processedText, transcript);

      if (validationPassed) {
        arrayBuffer = nativeHebrewAudio;
        mode = 'validated-native-hebrew';
        console.log('[TTS] Hebrew validation passed');
      } else {
        const phoneticHebrew = transliterateHebrewText(processedText);
        arrayBuffer = await generateSpeechAudio(phoneticHebrew, voiceId);
        mode = 'phonetic-hebrew-fallback';
        console.warn('[TTS] Hebrew validation failed, using phonetic fallback', { transcript });
      }
    } else {
      arrayBuffer = await generateSpeechAudio(processedText, voiceId);
      mode = 'english';
    }

    const base64Audio = encodeBase64(arrayBuffer);

    console.log(`[TTS] Generated ${arrayBuffer.byteLength} bytes, lang: ${detectedLanguage}, mode: ${mode}`);

    return new Response(
      JSON.stringify({ audioContent: base64Audio, mode }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[TTS] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
