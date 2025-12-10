import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const locationPrompts: Record<string, string> = {
  "sea-of-galilee": "Ultra high resolution realistic photograph of the Sea of Galilee (Kinneret) in Israel at golden hour, calm blue waters reflecting the sky, surrounding mountains, peaceful Mediterranean atmosphere, professional landscape photography, 16:9 aspect ratio",
  "mount-hermon": "Ultra high resolution realistic photograph of Mount Hermon in Northern Israel with snow-capped peak, dramatic mountain landscape, green valleys below, clear blue sky, professional nature photography, 16:9 aspect ratio",
  "golan-heights": "Ultra high resolution realistic photograph of the Golan Heights volcanic landscape in Israel, dramatic basalt rock formations, green pastures, distant mountains, panoramic view, professional landscape photography, 16:9 aspect ratio",
  "banias-waterfall": "Ultra high resolution realistic photograph of Banias Waterfall in Northern Israel, powerful cascading water, lush green vegetation, rocky cliffs, misty atmosphere, rainforest-like setting, professional nature photography, 16:9 aspect ratio",
  "rosh-hanikra": "Ultra high resolution realistic photograph of Rosh Hanikra white chalk cliffs in Northern Israel, dramatic sea caves, turquoise Mediterranean waters, white rock formations meeting blue sea, professional landscape photography, 16:9 aspect ratio",
  "acre-walls": "Ultra high resolution realistic photograph of Acre (Akko) ancient sea walls and harbor in Northern Israel, Ottoman fortress walls, Mediterranean Sea, historic port, golden hour lighting, professional travel photography, 16:9 aspect ratio",
  "safed-alleys": "Ultra high resolution realistic photograph of Safed (Tzfat) mystical old city in the Galilee mountains, cobblestone alleys, blue-painted walls and doors, artistic quarter, mountain views, professional travel photography, 16:9 aspect ratio",
  "mount-arbel": "Ultra high resolution realistic photograph of Mount Arbel cliff overlooking the Sea of Galilee in Israel, dramatic sheer cliffs, panoramic valley view, ancient caves in cliff face, sunrise lighting, professional landscape photography, 16:9 aspect ratio",
  "tiberias-promenade": "Ultra high resolution realistic photograph of Tiberias waterfront promenade along the Sea of Galilee, palm trees, blue lake waters, historic buildings, mountain backdrop, evening light, professional travel photography, 16:9 aspect ratio",
  "nazareth-hills": "Ultra high resolution realistic photograph of Nazareth hills and valleys in the Galilee region, rolling green hills, Mediterranean landscape, olive groves, panoramic vista, professional landscape photography, 16:9 aspect ratio",
  "beit-shean": "Ultra high resolution realistic photograph of Beit She'an ancient Roman theater and ruins, massive stone columns, archaeological site, historical amphitheater, Mediterranean archaeology, professional travel photography, 16:9 aspect ratio",
  "mount-gilboa": "Ultra high resolution realistic photograph of Mount Gilboa in Northern Israel covered with wildflowers in spring, purple iris flowers, rolling mountain terrain, panoramic valley views, professional nature photography, 16:9 aspect ratio",
  "haifa-bay": "Ultra high resolution realistic photograph of Haifa Bay panoramic view from Mount Carmel, Mediterranean coastline, industrial port, city skyline, blue sea meeting urban landscape, professional landscape photography, 16:9 aspect ratio",
  "nahal-ayun": "Ultra high resolution realistic photograph of Nahal Ayun (Ayun Stream) Nature Reserve waterfalls in Northern Israel, cascading water through lush canyon, green ferns and vegetation, refreshing stream, professional nature photography, 16:9 aspect ratio",
  "hula-valley": "Ultra high resolution realistic photograph of Hula Valley wetlands nature reserve, migrating birds, pelicans and cranes, lake reflections, mountains in background, wildlife sanctuary, professional wildlife photography, 16:9 aspect ratio",
  "mount-tabor": "Ultra high resolution realistic photograph of Mount Tabor dome-shaped mountain in the Jezreel Valley, green forested slopes, iconic rounded peak, pastoral landscape, spiritual atmosphere, professional landscape photography, 16:9 aspect ratio",
  "jordan-river": "Ultra high resolution realistic photograph of the Jordan River flowing through Northern Israel, winding river through green vegetation, willow trees, peaceful waterway, baptismal site area, professional nature photography, 16:9 aspect ratio",
  "tel-dan": "Ultra high resolution realistic photograph of Tel Dan Nature Reserve with ancient springs, crystal clear water streams, lush forest, archaeological site, Garden of Eden atmosphere, professional nature photography, 16:9 aspect ratio",
  "nimrod-fortress": "Ultra high resolution realistic photograph of Nimrod Fortress (Qalaat al-Subeiba) on Mount Hermon slopes, massive medieval castle ruins, dramatic mountain setting, ancient stone walls, professional travel photography, 16:9 aspect ratio",
  "ein-gev": "Ultra high resolution realistic photograph of Ein Gev kibbutz area on the eastern shore of the Sea of Galilee, peaceful lakeshore, palm trees, Golan Heights mountains backdrop, serene atmosphere, professional landscape photography, 16:9 aspect ratio",
  "capernaum": "Ultra high resolution realistic photograph of Capernaum ancient synagogue ruins by the Sea of Galilee, white limestone columns, archaeological remains, lakeside setting, biblical heritage site, professional travel photography, 16:9 aspect ratio",
  "arbel-valley": "Ultra high resolution realistic photograph of Arbel Valley (Wadi Hamam) in the Galilee, green agricultural fields, Mount Arbel cliffs in background, fertile valley landscape, pastoral scenery, professional landscape photography, 16:9 aspect ratio",
  "gamla": "Ultra high resolution realistic photograph of Gamla ancient city ruins and Nature Reserve in the Golan Heights, dramatic cliff-top fortress remains, vulture nesting area, waterfall, rugged canyon landscape, professional nature photography, 16:9 aspect ratio",
  "korazim": "Ultra high resolution realistic photograph of Korazim (Chorazin) ancient black basalt ruins in the Galilee, volcanic stone synagogue remains, archaeological site, biblical village, professional travel photography, 16:9 aspect ratio",
  "agamon-hula": "Ultra high resolution realistic photograph of Agamon Hahula lake and bird watching area, thousands of migrating cranes at sunset, water reflections, golden hour sky, breathtaking wildlife spectacle, professional wildlife photography, 16:9 aspect ratio"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { locationKey } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = locationPrompts[locationKey];
    if (!prompt) {
      throw new Error(`Unknown location: ${locationKey}`);
    }

    console.log("Generating image for location:", locationKey);

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
            content: prompt
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

    // Upload to Supabase Storage
    const base64Data = imageUrl.split(',')[1];
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    const fileName = `location-${locationKey}-${Date.now()}.png`;
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
      JSON.stringify({ publicUrl, locationKey }),
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
