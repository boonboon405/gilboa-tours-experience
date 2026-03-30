

## Content & Conversion Ideas — Status & Plan

### Already Done
1. **About David section** — ✅ `AboutDavid.tsx` exists with bio, credentials, animated counters, and trust signals. Already on homepage.
2. **TeamDNAQuiz surfaced as CTA** — ✅ Already accessible from Navigation ("Take Quiz" button) and from ChooseYourDay section. Not hidden behind admin.

### Still Missing (4 items)

#### 1. Urgency/scarcity badges on ServiceCards
**File:** `src/components/ServiceCards.tsx`
- Add a small badge (e.g. `<Badge>`) to 1-2 service cards with text like "Most Popular" / "הכי פופולרי" or "Limited Dates" / "תאריכים מוגבלים"
- Use the existing `Badge` component from `ui/badge.tsx`
- Bilingual via `language` already available in the component

#### 2. Google Reviews link/widget
**File:** `src/components/Testimonials.tsx`
- Add a "See us on Google" link/button below the testimonials carousel pointing to the Google Business profile
- Display a static "4.9 ★ on Google" trust badge (real widget embedding requires Google API key — a static link is simpler and still effective)
- Bilingual labels

#### 3. Structured data (JSON-LD)
**File:** `src/components/SEOKeywords.tsx` (already uses `<Helmet>`)
- Add a `<script type="application/ld+json">` block with `LocalBusiness` schema (name, address, phone, geo, openingHours, aggregateRating)
- Add `TouristAttraction` schema for the Gilboa region
- No new files needed — inject into the existing Helmet component

#### 4. WhatsApp templates bilingual
**File:** `src/utils/contactTracking.ts`
- Convert `whatsappTemplates` from a flat object to a function `getWhatsappTemplates(language)` returning Hebrew or English messages
- Update `openWhatsApp` signature to accept language parameter
- Update all callers (`WhatsAppFAB.tsx`, `ContactSection.tsx`, `EmergencyContactButton.tsx`, etc.) to pass current language

### Files to modify (5-6)
1. `src/components/ServiceCards.tsx` — scarcity badges
2. `src/components/Testimonials.tsx` — Google Reviews link
3. `src/components/SEOKeywords.tsx` — JSON-LD structured data
4. `src/utils/contactTracking.ts` — bilingual WhatsApp templates
5. `src/components/WhatsAppFAB.tsx` — pass language to openWhatsApp
6. Other WhatsApp callers as needed

