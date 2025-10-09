import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { variation } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Different prompts for variety - ONLY natural Israeli landscapes, NO buildings or structures
  const prompts = [
    "Ultra high resolution realistic photograph of Mount Gilboa (Har Hagilboa) in Israel at golden hour, panoramic view showing ONLY the dramatic natural mountainous landscape with rolling hills, native wildflowers and natural vegetation, clear blue sky, warm sunlight, pure nature scene with no buildings or structures, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Sea of Galilee (Kinneret) at sunrise, calm blue waters reflecting the golden sky, mountains surrounding the lake, natural shoreline, peaceful atmosphere, ONLY natural elements no buildings, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Golan Heights mountains overlooking the Sea of Galilee, dramatic rocky peaks, green valleys below, the lake shimmering in the distance, clear Mediterranean sky, pure natural landscape with no structures, professional nature photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of Mount Arbel cliff in Israel, steep dramatic natural cliffs, panoramic view of the Sea of Galilee below, surrounding mountains, wild flowers in foreground, sunset lighting, ONLY nature no buildings, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Jordan Valley in Israel, wide panoramic view showing the lush natural valley with palm trees, the Jordan River winding through green fields, distant mountains, dramatic clouds, golden hour lighting, pure nature scene, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Sea of Galilee pristine shoreline, calm blue lake, mountains in the background, natural rocks and vegetation, peaceful morning light, ONLY natural landscape elements, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of Mount Gilboa northern Israel, showing the steep mountain slopes covered with Mediterranean vegetation, rocky terrain, panoramic vista of the Jezreel Valley below, sunrise with pink and orange sky, pure nature, professional nature photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Sea of Galilee from surrounding hills, wide view of the entire lake, mountains creating a natural amphitheater, scattered clouds, vibrant blue water, natural landscape only, professional aerial-style landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of Mount Hermon in the distance with the Sea of Galilee in foreground, snow-capped peak, green valleys, the lake reflecting the sky, spring wildflowers, dramatic natural landscape composition, NO structures, professional nature photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Jordan Valley natural landscape, showing the fertile valley with date palm groves, agricultural fields in various shades of green, the winding river, desert mountains in the background, clear day with blue sky, pure nature, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of the Sea of Galilee at golden hour, natural shoreline silhouetted against the setting sun, mountains surrounding the lake turning purple and orange, calm waters, peaceful atmosphere, ONLY natural elements, professional landscape photography, 16:9 aspect ratio",
    "Ultra high resolution realistic photograph of Mount Gilboa range at sunset, dramatic mountain silhouettes, wild iris flowers in the foreground, golden light illuminating the valleys, clouds catching the sunset colors, panoramic view with Sea of Galilee visible in distance, pure natural landscape, professional landscape photography, 16:9 aspect ratio"
  ];

    const selectedPrompt = prompts[variation % prompts.length];

    console.log("Generating image with prompt:", selectedPrompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: selectedPrompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    // Upload to Supabase Storage instead of returning base64
    const base64Data = imageUrl.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `landscape-${variation}-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('landscape-images')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('landscape-images')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
