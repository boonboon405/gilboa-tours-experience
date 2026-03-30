

## Cross-Site Audit & Polish — Every Page

### All Pages and Routes

| Route | Page | Type |
|---|---|---|
| `/` | Index (homepage) | Public |
| `/booking` | Booking | Public |
| `/chat` | Chat | Public |
| `/auth` | Auth (login/signup) | Public |
| `/accessibility` | AccessibilityStatement | Public |
| `/keywords` | KeywordsList | Public |
| `/ai-settings`, `/settings/ai` | AISettings | Public |
| `/admin` | AdminDashboard | Protected |
| `/admin/keywords` | AdminKeywords | Protected |
| `/admin/chat` | AdminChat | Protected |
| `/admin/knowledge` | AdminKnowledgeBase | Protected |
| `/admin/testimonials` | AdminTestimonials | Protected |
| `/admin/email-templates` | AdminEmailTemplates | Protected |
| `/admin/email-automation` | AdminEmailAutomation | Protected |
| `/admin/ai-responses` | AdminAIResponses | Protected |
| `/admin/categories` | AdminCategories | Protected |
| `/admin/gallery` | AdminGallery | Protected |
| `/chat-analytics` | ChatAnalytics | Protected |
| `/booking-analytics` | BookingAnalytics | Protected |
| `/dashboard` | MasterDashboard | Protected |
| `/leads` | LeadManagement | Protected |
| `*` | NotFound (404) | Public |

---

## Audit Findings & Fixes

### STEP 1 — Verification Results

1. **Heebo font**: Loaded via Google Fonts in `index.html`. Applied globally in `index.css`. ✅ OK
2. **Color palette**: All public-facing components use CSS variables. **One violation**: `NotFound.tsx` uses hardcoded `bg-gray-100`, `text-gray-600`, `text-blue-500`, `text-blue-700`. **FIX needed.**
3. **Gold nav color**: Navigation uses `text-gold-nav` with text-shadow. ✅ OK
4. **ExitIntentModal**: Search confirms zero traces. ✅ Gone
5. **Broken images**: ChooseYourDay imports from `@/assets/` — need to verify these files exist. Gallery components use static imports + DB images with fallbacks. Will flag if missing.
6. **Console errors**: No errors recorded. ✅

### STEP 2 — Spacing & Padding Issues Found

| Component | Issue | Fix |
|---|---|---|
| `AccessibilityInfoSection` | Uses `py-16` instead of `py-20` | Change to `py-20` |
| `Testimonials` | Cards use `p-8` ✅, section uses `py-20` ✅ | OK |
| `PublicFAQ` | `py-20` ✅, cards `p-6` ✅ | OK |
| `ContactSection` | `py-20` ✅, cards `p-6` ✅ | OK |
| `ODTSection` | `py-20` ✅ | OK |
| `WhyChooseUs` | `py-20` ✅, `p-6` ✅ | OK |
| `ServiceCards` | `py-20` ✅ | OK |
| `Footer` | `py-12` — slightly tight | Change to `py-16` |
| `Chat` page | `py-8` main content — tight | Change to `py-12 md:py-20` |
| `Booking` page | `pt-24 pb-16` — slightly unbalanced | Change to `pt-28 pb-20` |
| `PublicFAQ` CTA link | Uses `px-6 py-3` inline link, not a `<Button>` — inconsistent | Convert to `<Button>` component |
| `TestimonialSubmissionForm` in Index | wrapped in `py-20` ✅ | OK |
| `Testimonials` heading | `mb-16` — adequate gap ✅ | OK |

### STEP 3 — Mobile Responsiveness Issues

| Component | Issue | Fix |
|---|---|---|
| `Hero` | h1 uses `text-4xl md:text-6xl lg:text-7xl` — OK but no clamp | Add `clamp()` for smoother scaling |
| `Testimonials` | `grid-cols-1 md:grid-cols-3` — jumps from 1→3, no tablet 2-col | Change to `md:grid-cols-2 lg:grid-cols-3` |
| `ServiceCards` | `grid-cols-1 md:grid-cols-3` — same jump | Change to `md:grid-cols-2 lg:grid-cols-3` |
| `WhyChooseUs` | `md:grid-cols-2 lg:grid-cols-4` ✅ | OK |
| `ODTSection` | `lg:grid-cols-2` ✅ | OK |
| `ChooseYourDay` | Long content — needs verified mobile padding | Ensure adequate `px-4` and readable font |
| `NotFound` | No responsive consideration, hardcoded styles | Full restyle |
| `Chat` page | `TabsList grid-cols-3` — may be tight on 375px | Add text size reduction on mobile |
| `Navigation` mobile hamburger | Shows below `lg` (1024px), desktop nav hidden below `lg` ✅ | OK |
| Mobile touch targets | Buttons use `h-10` default (40px) — close to 44px but slightly under | Add `min-h-[44px]` to key mobile buttons |

### STEP 4 — Tablet Responsiveness

| Component | Issue | Fix |
|---|---|---|
| `Testimonials` | Jumps 1→3 columns | Add `md:grid-cols-2` breakpoint |
| `ServiceCards` | Jumps 1→3 columns | Add `md:grid-cols-2` breakpoint |
| `AccessibilityInfoSection` features grid | `md:grid-cols-2 lg:grid-cols-3` ✅ | OK |
| `LandscapeGallery` | Uses ImageGallery — need to verify grid | Check internal grid |
| Nav links | Visible at `lg` (1024px+), hamburger below — correct for this design | OK |

---

## Implementation Plan (Files to Edit)

### 1. `src/pages/NotFound.tsx` — Full restyle
- Remove all hardcoded colors (`bg-gray-100`, `text-gray-600`, `text-blue-500`)
- Use design system variables: `bg-background`, `text-muted-foreground`, `text-primary`
- Add Heebo font, proper spacing, bilingual text
- Add link back home with `<Button>` component

### 2. `src/components/Testimonials.tsx` — Grid breakpoint
- Change `grid-cols-1 md:grid-cols-3` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 3. `src/components/ServiceCards.tsx` — Grid breakpoint
- Change `grid-cols-1 md:grid-cols-3` → `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 4. `src/components/AccessibilityInfoSection.tsx` — Spacing
- Change `py-16` → `py-20`

### 5. `src/components/Footer.tsx` — Spacing
- Change `py-12` → `py-16`

### 6. `src/pages/Chat.tsx` — Spacing
- Change main `py-8` → `py-12 md:py-20`
- Add `pt-24` to account for fixed nav

### 7. `src/pages/Booking.tsx` — Spacing
- Change `pt-24 pb-16` → `pt-28 pb-20`

### 8. `src/components/PublicFAQ.tsx` — CTA consistency
- Replace inline `<a>` CTA with `<Button>` component using `variant="hero"`
- Make bilingual (uses language context)

### 9. `src/index.css` — Global mobile safeguards
- Add `min-h-[44px]` touch target utility
- Ensure body text minimum sizing

### 10. `src/components/Hero.tsx` — Clamp font sizing
- Replace fixed breakpoint sizes with `clamp()` for smoother mobile scaling

### What does NOT change
- Admin pages (protected, not public-facing)
- TTS, voice chat, AI chat logic
- Navigation component (already rebuilt)
- Content text (already updated)
- Color variables, design tokens

