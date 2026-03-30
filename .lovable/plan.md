

## Plan: Replace Hero with Full-Width Image Carousel

### Files to modify (1)
1. **`src/components/Hero.tsx`** — Complete rewrite with a 5-slide crossfade carousel

### Files unchanged
- `src/pages/Index.tsx` — already renders `<Hero />` inside `<div id="home">`, no changes needed
- No new files created

### Implementation

**`src/components/Hero.tsx`** — Replace entirely with:

- **State**: `currentSlide` index, `isPaused` boolean
- **Auto-advance**: `useEffect` with 5s `setInterval`, cleared when `isPaused` is true
- **Crossfade**: All 5 slides rendered simultaneously as absolutely-positioned layers; active slide gets `opacity-100`, others `opacity-0`, with `transition-opacity duration-[800ms]`
- **Pause on hover**: `onMouseEnter` / `onMouseLeave` toggle `isPaused`
- **5 slides** with placeholder background `bg-[#1a3a2a]`, gradient overlay (`bg-gradient-to-t from-black/70 via-black/40 to-transparent` covering bottom 60%), headline (H1, bold, white), subtitle (white/80), and CTA button
- **Navigation**: Dot indicators at bottom center using `var(--gold-nav)` for active/border; left/right arrow buttons (`ChevronLeft`/`ChevronRight` from lucide) visible on `md:` and up, using gold color
- **CTA**: "Book Your Tour" anchor to `#contact`, styled `rounded-full px-8 py-3` with `bg-accent text-white hover:brightness-110`
- **RTL**: Hebrew headline first, English subtitle below
- Removes all old hero logic (localStorage images, parallax, AI image selector, WhatsApp button, phone number, scroll indicator)

### Slide data
```
[
  { he: "גלה את הגליל", en: "Discover the Galilee", sub: "Guided tours through Israel's most breathtaking landscapes" },
  { he: "ימי גיבוש בטבע", en: "Team Building in Nature", sub: "Unforgettable group experiences on Mount Gilboa" },
  { he: "מעיינות עמק הבזלת", en: "Springs Valley", sub: "Hidden gem tours through ancient water springs" },
  { he: "חוויות VIP", en: "VIP Experiences", sub: "Premium private tours tailored to you" },
  { he: "עמק יזרעאל", en: "Jezreel Valley", sub: "Biblical landscapes, modern luxury" },
]
```

### What does NOT change
- No files below the hero (ServiceCards, ChooseYourDay, etc.)
- No routing, layout, or other component changes

