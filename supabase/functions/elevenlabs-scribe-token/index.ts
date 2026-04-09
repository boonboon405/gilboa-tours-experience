import { corsHeaders } from '@supabase/supabase-js/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY')
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ELEVENLABS_API_KEY not configured')
    }

    const response = await fetch(
      'https://api.elevenlabs.io/v1/single-use-token/realtime_scribe',
      {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ElevenLabs token error:', errorText)
      throw new Error(`ElevenLabs API error: ${response.status}`)
    }

    const data = await response.json()

    return new Response(JSON.stringify({ token: data.token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error generating scribe token:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
