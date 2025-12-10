import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encodeBase64 } from "https://deno.land/std@0.220.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Voice IDs for ElevenLabs - multilingual voices
    const voiceIds: Record<string, string> = {
      // Female voices
      'Rachel': 'EXAVITQu4vr4xnSDxMaL',
      'Aria': '9BWtsMINqrJLrRacOk9x',
      'Sarah': 'EXAVITQu4vr4xnSDxMaL',
      'Laura': 'FGY2WhTYpPnrIDTdsKH5',
      'Charlotte': 'XB0fDUnXU5powFXDhCwa',
      'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
      'Matilda': 'XrExE9yKIg1WjnnlVkGX',
      'Lily': 'pFZP5JQG7iQjIQuC4Bku',
      // Male voices
      'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
      'Charlie': 'IKne3meq5aSn9XLyUdCD',
      'George': 'JBFqnCBsd6RMkjVDRZzb',
      'Callum': 'N2lVS1w4EtoT3dr4eOWO',
      'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
      'Daniel': 'onwK4e9ZLuTAKqWW03F9',
      'Brian': 'nPczCjzI2devNBz1zQrb',
    };

    const voiceId = voiceIds[voice] || voiceIds['Rachel'];

    console.log(`Generating speech for text: ${text.substring(0, 50)}...`);
    console.log(`Using voice: ${voice} (${voiceId}), language: ${language}`);

    // Add language hint prefix to help ElevenLabs detect the correct language
    // This is critical for multilingual v2 model to correctly identify the language
    let processedText = text;
    
    // For Hebrew, ensure the model knows it's Hebrew by checking if text contains Hebrew chars
    const hasHebrew = /[\u0590-\u05FF]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    
    // If language is explicitly set, we can add language context
    if (language === 'he' && !hasHebrew && hasEnglish) {
      // User wants Hebrew but text is English - this shouldn't happen, just use the text as-is
      console.log('Language set to Hebrew but text appears to be English');
    } else if (language === 'en' && hasHebrew) {
      // User wants English but text has Hebrew - use as-is, model will figure it out
      console.log('Language set to English but text contains Hebrew characters');
    }

    // Log detected language for debugging
    const detectedLanguage = hasHebrew ? 'he' : 'en';
    console.log(`Detected language from text: ${detectedLanguage}`);

    // Call ElevenLabs API - use eleven_multilingual_v2 which auto-detects language
    // Note: This model does NOT support language_code parameter - it auto-detects from text
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: processedText,
        model_id: 'eleven_multilingual_v2', // Multilingual v2 - auto-detects Hebrew from text content
        voice_settings: {
          stability: 0.5, // Lower stability for more natural Hebrew pronunciation
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
        speed: 0.85, // Slow down speech for clearer Hebrew pronunciation
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    // Convert audio to base64 using Deno's built-in encoder (avoids stack overflow)
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = encodeBase64(arrayBuffer);

    console.log(`Successfully generated speech audio (${arrayBuffer.byteLength} bytes)`);

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
