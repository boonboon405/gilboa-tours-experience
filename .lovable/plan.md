

## Plan: Gold Nav Link Color + Text Shadow

### Files to modify (2 files)

1. **`src/components/MegaMenu.tsx`** — Change desktop nav link text color from `text-foreground`/`text-primary` to gold (`var(--gold-nav)`) and add `text-shadow: 0px 1px 3px rgba(0,0,0,0.5)` via inline style
2. **`src/components/Navigation.tsx`** — Change mobile nav link text color to gold and add the same text-shadow for mobile menu items

### Specific changes

**MegaMenu.tsx (desktop links, ~line 120-126):**
- Replace `text-foreground` and active `text-primary` with inline `color: 'var(--gold-nav)'` (or Tailwind `text-gold-nav`)
- Add `style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.5)' }}` to each nav link `<a>`

**Navigation.tsx (mobile links, ~lines 338 and 352):**
- Replace `text-foreground` with gold color on mobile nav links
- Add same text-shadow inline style

### What does NOT change
- Navigation structure, links, layout, icons, dropdowns, mega menu panels — all unchanged
- Only the text color and text-shadow of navigation link labels change

