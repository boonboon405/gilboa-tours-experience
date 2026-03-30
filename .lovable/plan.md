

## Fix 4 Mobile-Specific Issues

None of the mobile issues have been addressed yet. Here is the plan:

### 1. EmergencyContactButton — avoid mobile browser UI overlap
**File:** `src/components/EmergencyContactButton.tsx`
- Change `bottom-6 left-6 h-16 w-16` to `bottom-20 left-4 h-12 w-12 md:bottom-6 md:left-6 md:h-16 md:w-16`
- Smaller on mobile (48px), moved higher to avoid browser chrome overlap
- Full size on desktop

### 2. Chat page tabs — icons-only on small screens
**File:** `src/pages/Chat.tsx`
- Wrap the Hebrew text labels in `<span className="hidden sm:inline">...</span>`
- Icons remain visible at all sizes, text appears only on sm+ screens

### 3. ChooseYourDay — ensure no overflow at 375px
**File:** `src/components/ChooseYourDay.tsx`
- Audit checkbox grids and ensure they use `grid-cols-1` on mobile, expanding to multi-column on `sm:`/`md:`
- Ensure image galleries use responsive widths (`w-full`) not fixed pixel widths

### 4. VIPTours — collapse regions into accordions on mobile
**File:** `src/components/VIPTours.tsx`
- Wrap each region's destination list in an `Accordion` component (already available in `ui/accordion.tsx`)
- On mobile, regions start collapsed; user taps to expand one at a time
- Prevents extremely tall scrollable checkbox lists

### Files modified (4)
1. `src/components/EmergencyContactButton.tsx`
2. `src/pages/Chat.tsx`
3. `src/components/ChooseYourDay.tsx`
4. `src/components/VIPTours.tsx`

