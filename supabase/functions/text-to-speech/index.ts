import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encodeBase64 } from "https://deno.land/std@0.220.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voice = 'Rachel', language = 'he' } = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY is not configured');
    }

    // Voice IDs for ElevenLabs
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

    const voiceId = voiceIds[voice] || voiceIds['Rachel'];

    // Detect if text contains Hebrew characters
    const hasHebrew = /[\u0590-\u05FF]/.test(text);
    const detectedLanguage = hasHebrew ? 'he' : 'en';

    console.log(`[TTS] Voice: ${voice}, detected lang: ${detectedLanguage}, text length: ${text.length}`);

    // For Hebrew: prefix with a Hebrew language hint to force correct pronunciation
    // This prevents the model from reading Hebrew characters as English phonemes
    let processedText = text.trim();

    if (detectedLanguage === 'he') {
      // Strip any stray non-Hebrew/English characters but keep Hebrew, English, numbers, punctuation
      processedText = processedText.replace(/[^\u0590-\u05FFa-zA-Z0-9\s.,!?;:\-'"()\n]/g, '');
    }

    // Call ElevenLabs API with eleven_multilingual_v2 which supports Hebrew natively
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: processedText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
        // Normal speed - no artificial slowing
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TTS] ElevenLabs error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = encodeBase64(arrayBuffer);

    console.log(`[TTS] Generated ${arrayBuffer.byteLength} bytes, lang: ${detectedLanguage}`);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
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
