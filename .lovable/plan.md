

## Implement 3 Remaining 🟢 Nice-to-Have Items

### Status Summary
- ✅ Animated counters — already in `AboutDavid.tsx`
- ✅ Parallax hook exists and is used on background blobs
- ❌ 3 items still missing (below)

---

### 1. Pulse animation on "Book Now" nav button
**File:** `src/components/Navigation.tsx` + `src/index.css`

Add a CSS `@keyframes pulse-cta` that runs every 8 seconds — a subtle scale+glow pulse on the "Book Now" / "הזמינו סיור" button in the header. Apply via a utility class `.animate-pulse-cta`.

```css
@keyframes pulse-cta {
  0%, 85%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0); }
  90% { transform: scale(1.05); box-shadow: 0 0 12px 4px rgba(var(--accent-rgb), 0.3); }
  95% { transform: scale(1.02); box-shadow: 0 0 6px 2px rgba(var(--accent-rgb), 0.1); }
}
```

### 2. Skeleton loading in PublicFAQ
**File:** `src/components/PublicFAQ.tsx`

Replace the spinner with 3 skeleton cards matching the FAQ accordion layout — a heading bar + 4 accordion-item-shaped rectangles per card. Uses existing `Skeleton` component.

### 3. Scroll-reveal on LandscapeGallery images
**File:** `src/components/LandscapeGallery.tsx`

Wrap each gallery card in a `motion.div` with `initial={{ opacity: 0, y: 30 }}` and `whileInView={{ opacity: 1, y: 0 }}` with staggered delays. Subtle scale on hover already exists via CSS; this adds the scroll-triggered entrance.

### 4. Video hero slide (dependency note)
Replacing a hero slide with a drone video requires an actual `.mp4` asset. Two options:
- **Option A**: User provides a 10-second drone clip of the Gilboa
- **Option B**: Skip this item (a static image carousel is already professional)

I'll implement items 1-3 now and flag item 4 for user decision.

---

### Files to modify (3)
1. `src/index.css` — add `@keyframes pulse-cta` + utility class
2. `src/components/Navigation.tsx` — add pulse class to Book Now button
3. `src/components/PublicFAQ.tsx` — replace spinner with skeleton cards
4. `src/components/LandscapeGallery.tsx` — add framer-motion scroll-reveal to image cards

