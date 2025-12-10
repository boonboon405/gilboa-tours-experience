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
  "agamon-hula": "Ultra high resolution realistic photograph of Agamon Hahula lake and bird watching area, thousands of migrating cranes at sunset, water reflections, golden hour sky, breathtaking wildlife spectacle, professional wildlife photography, 16:9 aspect ratio",
  "zippori": "Ultra high resolution realistic photograph of Zippori (Sepphoris) ancient Roman city ruins in the Galilee, famous Mona Lisa of the Galilee mosaic, ornate floor mosaics, archaeological excavations, ancient theater, professional travel photography, 16:9 aspect ratio",
  "caesarea-aqueduct": "Ultra high resolution realistic photograph of Caesarea ancient Roman aqueduct on the Mediterranean coast of Israel, dramatic stone arches on sandy beach, turquoise sea, Roman engineering marvel, sunset lighting, professional travel photography, 16:9 aspect ratio",
  "bahai-gardens": "Ultra high resolution realistic photograph of Bahai Gardens in Haifa, terraced gardens cascading down Mount Carmel, perfectly manicured hedges and flowers, golden dome shrine, Mediterranean Sea view, professional landscape photography, 16:9 aspect ratio",
  "megiddo": "Ultra high resolution realistic photograph of Tel Megiddo archaeological site (Armageddon) in the Jezreel Valley, ancient tell mound, excavated ruins, panoramic valley views, biblical history site, professional travel photography, 16:9 aspect ratio",
  "beit-alpha": "Ultra high resolution realistic photograph of Beit Alpha ancient synagogue with famous zodiac mosaic floor in the Beit She'an Valley, intricate mosaic artwork, archaeological site, Jewish heritage, professional travel photography, 16:9 aspect ratio",
  "kfar-nahum": "Ultra high resolution realistic photograph of Kfar Nahum (Capernaum) lakeside town ruins by Sea of Galilee, ancient white stone synagogue, Jesus ministry site, peaceful lake setting, professional travel photography, 16:9 aspect ratio",
  "mount-beatitudes": "Ultra high resolution realistic photograph of Mount of Beatitudes overlooking Sea of Galilee, beautiful church with dome, landscaped gardens, panoramic lake view, Sermon on the Mount site, peaceful atmosphere, professional travel photography, 16:9 aspect ratio",
  "tabgha": "Ultra high resolution realistic photograph of Tabgha on the Sea of Galilee shore, ancient church of the multiplication, mosaic fish and loaves, peaceful lakeside, pilgrimage site, professional travel photography, 16:9 aspect ratio",
  "yardenit": "Ultra high resolution realistic photograph of Yardenit baptismal site on the Jordan River, peaceful flowing waters, eucalyptus trees, wooden decks, spiritual atmosphere, pilgrimage location, professional travel photography, 16:9 aspect ratio",
  "kursi": "Ultra high resolution realistic photograph of Kursi (Gergesa) ancient Byzantine monastery ruins on eastern shore of Sea of Galilee, archaeological site, miracle of swine location, lake views, professional travel photography, 16:9 aspect ratio",
  "hammat-tiberias": "Ultra high resolution realistic photograph of Hammat Tiberias hot springs and ancient synagogue, healing thermal waters, Roman-era bath ruins, zodiac mosaic floor, Sea of Galilee views, professional travel photography, 16:9 aspect ratio",
  "tzippori-mosaic": "Ultra high resolution realistic photograph of Tzippori National Park Dionysus House with stunning Roman mosaics, Mona Lisa of the Galilee, intricate floor artwork, archaeological wonder, professional travel photography, 16:9 aspect ratio",
  "beit-shearim": "Ultra high resolution realistic photograph of Beit She'arim ancient necropolis and catacombs, UNESCO World Heritage site, carved stone sarcophagi, underground burial caves, Sanhedrin tombs, professional travel photography, 16:9 aspect ratio",
  "muhraqa": "Ultra high resolution realistic photograph of Muhraqa (El-Muhraqa) on Mount Carmel, Elijah the Prophet memorial site, Carmelite monastery, panoramic Jezreel Valley views, dramatic cliff setting, professional travel photography, 16:9 aspect ratio",
  "akko-tunnels": "Ultra high resolution realistic photograph of Akko Crusader Tunnels and underground city, medieval stone architecture, dramatic lighting, Knights Templar tunnel, UNESCO heritage site, professional travel photography, 16:9 aspect ratio",
  "merom-golan": "Ultra high resolution realistic photograph of Merom Golan kibbutz viewpoint in the Golan Heights, panoramic views of Mount Hermon, volcanic landscape, pastoral scenery, northern frontier, professional landscape photography, 16:9 aspect ratio",
  "biriya-forest": "Ultra high resolution realistic photograph of Biriya Forest in Upper Galilee, largest planted forest in Israel, pine and cypress trees, hiking trails, mountain scenery, peaceful woodland, professional nature photography, 16:9 aspect ratio",
  "keshet-cave": "Ultra high resolution realistic photograph of Keshet Cave (Rainbow Cave) natural arch formation in Upper Galilee, dramatic limestone arch, Mediterranean Sea views, climbing destination, geological wonder, professional landscape photography, 16:9 aspect ratio",
  "montfort-castle": "Ultra high resolution realistic photograph of Montfort Castle Crusader fortress ruins in Upper Galilee, dramatic hilltop location, medieval stone walls, forested valley below, Teutonic Knights stronghold, professional travel photography, 16:9 aspect ratio",
  "nahal-snir": "Ultra high resolution realistic photograph of Nahal Snir (Hatzbani) stream nature reserve, crystal clear water, lush vegetation, swimming holes, Mount Hermon waters, refreshing natural pool, professional nature photography, 16:9 aspect ratio",
  "sachne": "Ultra high resolution realistic photograph of Sachne (Gan Hashlosha) natural warm water pools, paradise-like setting, palm trees, turquoise pools, waterfalls, peaceful swimming area, professional nature photography, 16:9 aspect ratio",
  "hamat-gader": "Ultra high resolution realistic photograph of Hamat Gader hot springs resort in the Golan Heights, thermal mineral pools, Roman bath ruins, crocodile farm area, Yarmouk River gorge, professional travel photography, 16:9 aspect ratio",
  "yehi-am-castle": "Ultra high resolution realistic photograph of Yehi'am Fortress Crusader castle ruins in Western Galilee, dramatic hilltop location, ancient stone walls, surrounding forest, medieval architecture, professional travel photography, 16:9 aspect ratio",
  "yehiam-fortress": "Ultra high resolution realistic photograph of Yehiam Fortress Crusader castle ruins in Western Galilee, dramatic hilltop location, ancient stone walls, surrounding forest, medieval architecture, professional travel photography, 16:9 aspect ratio",
  "katzrin": "Ultra high resolution realistic photograph of Katzrin ancient village and Talmudic park in the Golan Heights, reconstructed ancient houses, archaeological site, ancient synagogue, pastoral Golan scenery, professional travel photography, 16:9 aspect ratio",
  "jezreel-valley": "Ultra high resolution realistic photograph of Jezreel Valley (Emek Yizrael) in Northern Israel, vast green agricultural fields, distant mountains, fertile farmland, pastoral beauty, professional landscape photography, 16:9 aspect ratio",
  "achziv": "Ultra high resolution realistic photograph of Achziv Beach and national park on Northern Israeli Mediterranean coast, turquoise water coves, rocky shoreline, ancient ruins, pristine beach, professional landscape photography, 16:9 aspect ratio",
  "bet-alfa": "Ultra high resolution realistic photograph of Beit Alpha ancient synagogue with famous zodiac mosaic floor in the Beit She'an Valley, intricate mosaic artwork, archaeological site, Jewish heritage, professional travel photography, 16:9 aspect ratio",
  "gan-hashlosha": "Ultra high resolution realistic photograph of Gan Hashlosha (Sachne) natural warm water pools, paradise-like setting, palm trees, turquoise pools, waterfalls, peaceful swimming area, professional nature photography, 16:9 aspect ratio",
  "belvoir-fortress": "Ultra high resolution realistic photograph of Belvoir Fortress (Kochav HaYarden) Crusader castle overlooking Jordan Valley, massive stone walls, panoramic views, medieval fortifications, professional travel photography, 16:9 aspect ratio",
  "mount-meron": "Ultra high resolution realistic photograph of Mount Meron highest peak in the Galilee, forested mountain, hiking trails, panoramic northern Israel views, spiritual site, professional landscape photography, 16:9 aspect ratio",
  "peki-in": "Ultra high resolution realistic photograph of Peki'in ancient Druze village in Upper Galilee, stone houses, olive groves, ancient synagogue, mountain village atmosphere, professional travel photography, 16:9 aspect ratio",
  "nahariya-beach": "Ultra high resolution realistic photograph of Nahariya beach on the Mediterranean coast, blue waters, sandy beach, coastal promenade, northern Israeli seaside town, professional landscape photography, 16:9 aspect ratio",
  "stella-maris": "Ultra high resolution realistic photograph of Stella Maris Carmelite monastery on Mount Carmel Haifa, beautiful church, Mediterranean Sea views, religious site, peaceful atmosphere, professional travel photography, 16:9 aspect ratio",
  "druze-villages": "Ultra high resolution realistic photograph of Druze villages in the Golan Heights, traditional architecture, mountain scenery, cultural heritage, panoramic views, professional travel photography, 16:9 aspect ratio",
  "majrase": "Ultra high resolution realistic photograph of Majrase water park on northern shore of Sea of Galilee, beaches, palm trees, water activities, Kinneret views, family recreation, professional travel photography, 16:9 aspect ratio",
  "nahal-kziv": "Ultra high resolution realistic photograph of Nahal Kziv stream nature reserve in Western Galilee, flowing water through lush canyon, green vegetation, hiking trail, swimming holes, professional nature photography, 16:9 aspect ratio",
  "rosh-pina": "Ultra high resolution realistic photograph of Rosh Pina historic colony in Upper Galilee, stone buildings, artist quarter, panoramic Hula Valley views, charming streets, professional travel photography, 16:9 aspect ratio",
  "miron-forest": "Ultra high resolution realistic photograph of Mount Meron Forest (Miron Forest) in Upper Galilee, dense pine and oak forest, hiking trails, peaceful woodland, nature sanctuary, professional nature photography, 16:9 aspect ratio"
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
