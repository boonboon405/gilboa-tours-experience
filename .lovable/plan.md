

## Fix 3 Remaining Recommended Items

### 1. Footer copyright — dynamic year
**File:** `src/components/Footer.tsx` (line 87)
- Replace hardcoded `2025` with `{new Date().getFullYear()}`

### 2. Google Maps embed in Contact section
**File:** `src/components/ContactSection.tsx`
- Add a Google Maps `<iframe>` embed below the contact cards showing the Gilboa/Springs Valley area
- Bilingual heading: "מיקום" / "Our Location"
- Responsive: full width, rounded corners, ~300px height

### 3. Back to Top button
**File:** `src/components/BackToTop.tsx` (new file)
- Fixed button, bottom-left (opposite side from WhatsApp FAB)
- Appears after scrolling past 600px
- Smooth scroll to top on click
- `ChevronUp` icon, subtle styling with hover effect
- Bilingual aria-label
- Import into `App.tsx` alongside WhatsAppFAB

### Files changed (3)
1. `src/components/Footer.tsx` — dynamic year
2. `src/components/ContactSection.tsx` — add Google Maps embed
3. `src/components/BackToTop.tsx` — new component
4. `src/App.tsx` — add BackToTop

