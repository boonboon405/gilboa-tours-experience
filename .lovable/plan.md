

## Confirmation: Every Component and Section to Touch

### Global / Shared UI (3 files)
1. **`src/components/ui/button.tsx`** — Update base variants and add `transition-all duration-200`
2. **`src/components/ui/input.tsx`** — Ensure focus ring uses `ring-primary`
3. **`src/components/ui/textarea.tsx`** — Same focus ring fix

### Homepage Sections (10 component files)
4. **`src/components/Hero.tsx`** — Section heading typography
5. **`src/components/WhyChooseUs.tsx`** — Heading clamp sizing, body text line-height
6. **`src/components/ServiceCards.tsx`** — Heading, body text, button variants in modal, CTA buttons
7. **`src/components/ChooseYourDay.tsx`** — Heading, spacing, submit button loading state
8. **`src/components/VIPTours.tsx`** — Heading, spacing, submit button loading state
9. **`src/components/ODTSection.tsx`** — Heading, CTA buttons
10. **`src/components/LandscapeGallery.tsx`** — Heading typography
11. **`src/components/Testimonials.tsx`** — Heading typography consistency
12. **`src/components/PublicFAQ.tsx`** — Heading typography
13. **`src/components/ContactSection.tsx`** — Heading, form inputs, submit button (already has loading)

### Forms (2 files)
14. **`src/components/BookingForm.tsx`** — Submit button loading state (already has it — verify)
15. **`src/components/TestimonialSubmissionForm.tsx`** — Submit button loading state (already has it — verify)

### Modals/Dialogs (3 files — verify only)
16. **`src/components/ui/dialog.tsx`** — Already has X close button + backdrop; verify backdrop opacity
17. **`src/components/ODTTypesDialog.tsx`** — Uses Dialog; verify close behavior
18. **`src/components/TeamDNAQuiz.tsx`** — Uses Dialog; verify close behavior
19. **`src/components/ImageLightbox.tsx`** — Custom lightbox; verify backdrop + close

### Global CSS (1 file)
20. **`src/index.css`** — Add utility class for consistent section headings

**Not touched**: Navigation, Footer (no buttons/forms), AIChat, VoiceChat, routing, TTS, any admin pages.

---

## Plan: Premium Polish Pass

### 1. Button System (`button.tsx`)

Update the base CVA string to include `transition-all duration-200` (replacing `transition-colors`). Update variants:
- `default` (primary CTA): `bg-accent text-white hover:brightness-110 rounded-full min-w-[140px]`
- `hero`: keep gradient but add `rounded-full min-w-[140px]`
- `whatsapp`: add `rounded-full min-w-[140px]`
- `outline` (secondary/ghost-like): `border-primary text-primary bg-transparent hover:bg-primary/5 rounded-full`
- `ghost`: keep as-is (used for icon buttons in chat toolbars — should not become rounded-full)
- `secondary`, `destructive`, `link`: keep existing styles, just ensure `transition-all duration-200`

### 2. Dialog Backdrop (`dialog.tsx`)

Change overlay from `bg-black/80` to `bg-black/60` to match spec. Already has X close button and close-on-backdrop-click (Radix default). No other changes needed.

### 3. Form Inputs (`input.tsx`, `textarea.tsx`)

Replace `focus-visible:ring-ring` with `focus-visible:ring-primary` so focus ring uses the teal brand color. Placeholder already uses `placeholder:text-muted-foreground` — no change needed.

### 4. Section Headings — Global Utility (`index.css`)

Add a utility class:
```css
.section-heading {
  font-family: 'Heebo', sans-serif;
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1.2;
}
```

### 5. Apply Heading Class + Body Text (10 section components)

In each section component, apply `section-heading` to the `<h2>` and ensure body/description text has `leading-[1.7]` (line-height 1.7). Ensure all sections use `py-20`.

Components: Hero (h1 stays as-is — already large), WhyChooseUs, ServiceCards, ChooseYourDay, VIPTours, ODTSection, LandscapeGallery, Testimonials, PublicFAQ, ContactSection.

### 6. Form Loading States

- **ContactSection**: Already has `isSubmitting` — already disables button and shows "שולח..." — verified OK
- **BookingForm**: Already has `isSubmitting` from Redux — verified OK
- **TestimonialSubmissionForm**: Already has `submitting` state — verified OK
- **ChooseYourDay**: Has a submit form — verify it shows loading state; add if missing
- **VIPTours**: Has a submit form — verify it shows loading state; add if missing

### 7. Verify No Timer/Exit-Intent Modals

Search confirmed: no ExitIntentModal or timer-based modal opens exist. The only `setTimeout` + `setShow` is in AIChat for showing a summary after data collection (legitimate UX, not a popup). No changes needed.

### What does NOT change
- Content text, routing, TTS logic, voice selection
- Admin pages, chat components (AIChat/VoiceChat)
- Navigation, Footer layout
- Ghost variant (used for toolbar icon buttons — must stay compact)

