

## Problem

The Hero component loads AI-generated images from the `generated_images` database table and **replaces** all local curated images with them. Those database images contain an inappropriate Cairo cityscape.

## Solution

Two changes:

### 1. Update `src/components/Hero.tsx`
- Import multiple local asset images that represent your actual services (Gilboa, springs, Galilee, etc.)
- Use these local images as the **permanent** default rotation set
- **Stop loading** database landscape images into the hero, OR only **append** them after local images
- Since the DB images are problematic, the simplest fix is to use only local curated images and remove the DB loading entirely from the hero

Local images to use in rotation:
- `hero-gilboa.jpg` — Gilboa mountains
- `springs-nature.jpg` — Springs/nature
- `galilee-nature.jpg` — Galilee landscape  
- `belvoir-fortress.jpg` — Historic site
- `nahal-ayun-waterfall.jpg` — Waterfall/nature
- `beit-shean-panorama.jpg` — Panoramic view

### 2. Clean up database
- Delete the bad Cairo images from the `generated_images` table where `image_type = 'landscape'`

