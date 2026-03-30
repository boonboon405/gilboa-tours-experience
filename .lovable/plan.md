

## Confirmation: Current Header Code

The current `src/components/Navigation.tsx` (434 lines) includes:
- Logo with gradient text
- MegaMenu component (elaborate dropdowns with images, breadcrumbs, highlights)
- Quiz button with badge counter
- LanguageSelector dropdown
- Accessibility link
- Book Tour button
- Admin auth dropdown menu
- Mobile menu (conditional render, not a drawer)
- TeamDNAQuiz dialog
- Scroll progress bar
- IntersectionObserver for active section

The MegaMenu (`src/components/MegaMenu.tsx`, 239 lines) is a separate component with image-heavy dropdown panels.

---

## Plan: Premium Header Rebuild

### File to modify (1)
**`src/components/Navigation.tsx`** — Complete rewrite

### What gets removed
- MegaMenu import and usage (the elaborate image dropdowns)
- Scroll progress bar
- Quiz button in the header (it can remain via the TeamDNAQuiz dialog triggered elsewhere)
- The old mobile menu (inline conditional render)

### What gets preserved
- TeamDNAQuiz dialog (kept at bottom of component, opened from admin menu or elsewhere)
- Auth/admin dropdown menu (kept in desktop right side, compact)
- LanguageSelector (kept in desktop right side)
- IntersectionObserver for active section highlighting
- Smooth scroll handler (`handleNavClick`)
- All imports from AuthContext, LanguageContext

### New Structure

```text
<nav> (fixed, top-0, w-full, z-[1000], h-[72px] desktop / h-[60px] mobile)
  ├─ Transparent state (scrollY < 80): no bg, no border, no shadow
  ├─ Scrolled state (scrollY >= 80): backdrop-blur-[12px], bg-[rgba(250,249,247,0.85)], shadow
  │
  ├─ <div max-w-7xl mx-auto px-6> (container)
  │   ├─ LEFT: Logo
  │   │   └─ Compass icon (Lucide) + "David Tours" text
  │   │   └─ Color: gold-nav when transparent, primary when scrolled
  │   │   └─ Heebo 800, 1.5rem desktop / 1.25rem mobile
  │   │
  │   ├─ CENTER (hidden below lg): Nav Links
  │   │   └─ 6 links: Home|Tours|Team Building|VIP|About|Contact
  │   │   └─ Each link has Hebrew subtitle (12px, 70% opacity)
  │   │   └─ Color: gold-nav with text-shadow
  │   │   └─ Hover: underline slides in from left (::after pseudo, scaleX, 300ms)
  │   │   └─ Active: bottom border in accent color
  │   │
  │   ├─ RIGHT: CTA + utilities
  │   │   └─ "Book Now / הזמן עכשיו" button (always visible, all viewports)
  │   │   └─ LanguageSelector (desktop only)
  │   │   └─ Admin auth dropdown (desktop only, if logged in)
  │   │   └─ Hamburger ☰ (mobile only, below md)
  │   │
  ├─ MOBILE DRAWER (Sheet from right)
  │   ├─ bg-[hsl(var(--primary-dark))]
  │   ├─ X close button top-right
  │   ├─ Nav links vertical, white, Heebo 600, 1.25rem, with Hebrew subtitles
  │   ├─ Full-width "Book Now" CTA at bottom
  │   ├─ LanguageSelector
  │   ├─ Admin links if authenticated
  │   └─ body overflow:hidden while open
```

### Nav Links Definition (bilingual)

| EN Label | HE Subtitle | Target |
|---|---|---|
| Home | בית | #home |
| Tours | סיורים | #choose-your-day |
| Team Building | גיבוש | #odt-section |
| VIP | VIP | #vip-tours |
| About | אודות | #accessibility (links to /accessibility) |
| Contact | צור קשר | #contact |

### Hover Underline Effect

Add CSS in `index.css`:
```css
.nav-link-underline::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: hsl(var(--accent));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 300ms ease;
}
.nav-link-underline:hover::after {
  transform: scaleX(1);
}
```

### Mobile Drawer

Use the existing `Sheet` component (`src/components/ui/sheet.tsx`) which is already in the project — it handles backdrop, close-on-click, body scroll lock, and slide-in animation from the right.

### Accessibility
- `aria-label` on nav, hamburger, close button, all links, CTA
- `role="navigation"`, `role="menuitem"` on links
- `focus-visible:ring-2 focus-visible:ring-primary` on all interactive elements
- Keyboard navigable (native `<a>` and `<button>` elements)

### Files to modify (2)
1. **`src/components/Navigation.tsx`** — Full rewrite
2. **`src/index.css`** — Add `.nav-link-underline` utility class

### What does NOT change
- `MegaMenu.tsx` file (left untouched, just no longer imported)
- `Index.tsx`, routing, TTS, AIChat, any other components
- Auth logic, admin dropdown items
- LanguageSelector component

