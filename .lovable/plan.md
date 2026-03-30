

## Plan: Add Real Hero Carousel Images

### Files to modify (1)
1. **`src/components/Hero.tsx`** — Replace placeholder `bg-[#1a3a2a]` with `background-image` referencing local files

### Files to create (5 image files)
Downloaded via `curl` from Unsplash (free license) into `public/images/hero/`:

1. **`public/images/hero/sea-of-galilee.jpg`** — Sea of Galilee with mountains (Unsplash photo `photo-1678134017317` by Jayson Boesman)
2. **`public/images/hero/mount-gilboa.jpg`** — Lush green hillside, Northern Israel (Unsplash photo `HW-zyu4mdT0` by Shalev Cohen)
3. **`public/images/hero/springs-waterfall.jpg`** — Waterfall cascading down rocky cliff into pool (Unsplash photo `fifZ1Trjnx0` by engin akyurt)
4. **`public/images/hero/jezreel-valley.jpg`** — Green grass field with blue sky, Israel landscape (Unsplash photo `lbjIl4x0-wE` by Yoav Aziz)
5. **`public/images/hero/upper-galilee.jpg`** — Green hillside with mountains in background (Unsplash photo `wBRzvZoWYxM` by Polina Koroleva)

### Implementation

1. Create `public/images/hero/` directory
2. Download each image from Unsplash CDN at 1920px width, high quality (`w=1920&q=80&auto=format`)
3. In `Hero.tsx`, add an `img` field to each slide data object pointing to `/images/hero/<filename>.jpg`
4. Replace the `<div className="absolute inset-0 bg-[#1a3a2a]" />` placeholder in each slide with a full-bleed `<img>` element using `object-cover` styling
5. All other styles (overlay, text, CTA, navigation) remain unchanged

### What does NOT change
- Slide content, gradient overlay, CTA button, navigation dots/arrows
- No other components or pages modified

