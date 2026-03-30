

## Fix All 🔴 Critical Conversion Issues

### Problem Summary
Seven major components are Hebrew-only, meaning English-speaking visitors — a core audience for an Israel tour business — hit walls of untranslated content. This directly hurts conversions.

### Components to Update (7 files)

| # | File | Issue | Lines |
|---|------|-------|-------|
| 1 | `Hero.tsx` | Always shows Hebrew title + English subtitle; CTA is English-only | ~100 |
| 2 | `ChooseYourDay.tsx` | All 4 sections, 100+ activities, form labels, toasts — Hebrew-only | ~903 |
| 3 | `VIPTours.tsx` | All 5 regions, destinations, form, toasts — Hebrew-only | ~502 |
| 4 | `LandscapeGallery.tsx` | Gallery section titles, descriptions, tab labels — Hebrew-only | ~276 |
| 5 | `AccessibilityInfoSection.tsx` | Entire section (features, steps, legal) — Hebrew-only | ~195 |
| 6 | `TestimonialSubmissionForm.tsx` | Labels, placeholders, validation messages, toasts — Hebrew-only | ~171 |
| 7 | `PublicFAQ.tsx` | Loading text, section heading — Hebrew-only | ~115 |

### Approach for Each

**1. Hero.tsx**
- Import `useLanguage`
- Show only the language-appropriate title (not both stacked)
- Make CTA bilingual: "הזמינו סיור" / "Book Your Tour"
- Make subtitle bilingual per slide

**2. ChooseYourDay.tsx** (largest change)
- Convert `sections` array to a `getSections(language)` function
- Each section gets `title`, `description`, `time` in both languages
- All ~100 activities get English translations
- All form labels, placeholders, toast messages, and button text become bilingual
- The contact form fields (name, email, company, etc.) get translated labels

**3. VIPTours.tsx**
- Convert `vipDestinations` to bilingual with `region` having he/en variants
- All site names get English translations
- Form labels, validation toasts, success/error messages become bilingual
- Contact info field labels translated

**4. LandscapeGallery.tsx**
- Convert `staticGallerySections` to use `language` parameter
- Section titles: "הגליל והכנרת" → "The Galilee & Sea of Galilee"
- Section descriptions translated
- Tab labels translated
- Search placeholder translated

**5. AccessibilityInfoSection.tsx**
- Import `useLanguage`
- Convert `accessibilityFeatures` array to bilingual (title + description per feature)
- Section heading, compliance badge, "How to Use" steps, legal text — all bilingual
- Keep `dir="rtl"` only when Hebrew

**6. TestimonialSubmissionForm.tsx**
- Import `useLanguage`
- All labels: "שם מלא" → "Full Name", etc.
- Zod validation messages bilingual
- Placeholders bilingual
- Toast messages bilingual
- Submit button text bilingual

**7. PublicFAQ.tsx**
- Import `useLanguage`
- Loading text: "טוען שאלות נפוצות..." → "Loading FAQs..."
- Section heading bilingual
- FAQ content itself comes from the database (already stored)

### What Does NOT Change
- No content additions or routing changes
- No TTS, voice chat, AI chat, or admin page changes
- No design/layout/styling changes
- No functionality changes — purely i18n wrapping

### Implementation Order
1. Small files first (PublicFAQ, TestimonialSubmissionForm, AccessibilityInfoSection, Hero, LandscapeGallery)
2. Large files last (VIPTours, ChooseYourDay)

