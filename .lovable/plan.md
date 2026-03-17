

## What's Missing and What Needs to Change

### Problem
The current homepage only renders 6 sections (Hero, ServiceCards, Testimonials, FAQ, Contact, Footer). The original website had many more sections and pages that exist as components but are no longer wired up. The color palette is muted/dull (terracotta + olive on cream). Only 2 routes exist beyond the homepage (`/auth`, `/admin`).

### Inventory of Unused Components & Pages

**Homepage sections (exist but not rendered):**
- `ChooseYourDay` — day planner with morning/noon/afternoon activity picks
- `VIPTours` — VIP regional tour highlights
- `ODTSection` — corporate team building section
- `WhyChooseUs` — 4 trust/value proposition cards
- `CategoryShowcase` — 8 activity category cards
- `LandscapeGallery` — photo gallery of local landscapes
- `NorthIsraelGallery` — interactive location gallery (25+ spots)
- `WhatToBring` — practical tips for visitors
- `TeamDNAQuiz` — interactive quiz for team activity matching
- `AccessibilityInfoSection` — accessibility features info

**Pages (exist but no routes):**
- `Booking` (`/booking`) — full booking form
- `AccessibilityStatement` (`/accessibility`) — legal accessibility page
- `Chat` (`/chat`) — full-page AI chat with voice
- `MasterDashboard`, `LeadManagement`, `BookingAnalytics`, `ChatAnalytics` — admin sub-pages
- `AdminGallery`, `AdminCategories`, `AdminKnowledgeBase`, `AdminTestimonials`, `AdminEmailTemplates` — admin management pages

---

### Plan

#### 1. New Design System — Lively Color Palette
Replace the current dull terracotta/olive/cream with a vibrant nature-inspired palette:

- **Primary**: Vivid teal/emerald (`160 84% 39%`) — energy, nature, adventure
- **Secondary**: Warm sunset orange (`25 95% 53%`) — warmth, excitement
- **Accent**: Golden yellow (`45 93% 58%`) — highlights, CTAs
- **Background**: Clean white with slight warmth (`40 33% 98%`)
- **Foreground**: Deep charcoal (`220 20% 14%`)
- **Muted**: Light sage gray (`160 10% 92%`)

Update `src/index.css` CSS variables accordingly. Keep Heebo font.

#### 2. Rebuild Homepage with All Sections
Update `src/pages/Index.tsx` to include all major sections in this order:

```text
Navigation
Hero
WhyChooseUs (trust badges)
ServiceCards (Daily / VIP / ODT with modals)
CategoryShowcase (8 activity categories)
ChooseYourDay (curated day planner)
VIPTours (regional highlights)
ODTSection (corporate team building)
LandscapeGallery (photo gallery)
Testimonials
PublicFAQ
ContactSection
Footer
AIChatWidget
```

Each section will get subtle fade-in scroll animations via `framer-motion`.

#### 3. Register All Missing Routes
Update `src/App.tsx` to add:

| Route | Page |
|---|---|
| `/booking` | Booking |
| `/accessibility` | AccessibilityStatement |
| `/chat` | Chat |
| `/admin/leads` | LeadManagement |
| `/admin/gallery` | AdminGallery |
| `/admin/categories` | AdminCategories |
| `/admin/testimonials` | AdminTestimonials |
| `/admin/knowledge-base` | AdminKnowledgeBase |
| `/admin/analytics` | BookingAnalytics |
| `/admin/chat-analytics` | ChatAnalytics |

Admin sub-routes wrapped in `ProtectedRoute`.

#### 4. Update Navigation
Add links for `/booking` and `/chat` in the nav. Keep `/auth` hidden from navbar. Add footer links for Accessibility Statement.

#### 5. Refresh Component Styling
Touch up each restored component to use the new color variables (they already use `bg-primary`, `text-muted-foreground` etc., so the CSS variable change handles most of it). Fix any components that use the Redux store (`WhatToBring`, `BookingForm`) — either keep Redux or migrate to `useLanguage()` context for consistency.

### Files to Change
1. `src/index.css` — new color variables
2. `src/pages/Index.tsx` — add all homepage sections
3. `src/App.tsx` — register all routes
4. `src/components/Navigation.tsx` — add Booking + Chat nav links
5. `src/components/Footer.tsx` — add accessibility link
6. `src/components/WhatToBring.tsx` — migrate from Redux to `useLanguage()` (minor fix)
7. `src/components/BookingForm.tsx` — migrate from Redux to `useLanguage()` (minor fix)

### Scope
- ~7 file edits, no new files needed
- All components already exist and are functional
- Primary effort is wiring everything together and applying the new color system

