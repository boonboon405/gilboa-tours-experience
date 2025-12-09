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

    // Voice IDs for ElevenLabs - these are multilingual voices
    // Using voices known to work well across languages
    const voiceIds: Record<string, string> = {
      'Rachel': 'EXAVITQu4vr4xnSDxMaL',
      'Aria': '9BWtsMINqrJLrRacOk9x',
      'Sarah': 'EXAVITQu4vr4xnSDxMaL',
      'Laura': 'FGY2WhTYpPnrIDTdsKH5',
      'Charlotte': 'XB0fDUnXU5powFXDhCwa',
      'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
      'Matilda': 'XrExE9yKIg1WjnnlVkGX',
      'Lily': 'pFZP5JQG7iQjIQuC4Bku',
    };

    const voiceId = voiceIds[voice] || voiceIds['Rachel'];

    console.log(`Generating speech for text: ${text.substring(0, 50)}...`);
    console.log(`Using voice: ${voice} (${voiceId}), language: ${language}`);

    // Call ElevenLabs API - use eleven_flash_v2_5 for better multilingual support
    // This model has improved language detection from the text content
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_flash_v2_5', // Flash v2.5 has excellent multilingual support with language auto-detection
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
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
