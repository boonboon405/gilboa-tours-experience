

## Plan: Security Hardening — Input Sanitization

### Files to modify (7 files)

**Edge functions (6):**
1. `supabase/functions/forward-webhook/index.ts` — add `esc()` helper, apply to user fields, tighten length limits
2. `supabase/functions/send-contact-email/index.ts` — add `esc()`, apply to name/email/phone/message in HTML templates
3. `supabase/functions/send-booking-notification/index.ts` — add `esc()`, apply to customer_name, customer_email, customer_phone, customer_company, special_requests, tour_type, selected_destinations
4. `supabase/functions/send-lead-notification/index.ts` — add `esc()`, apply to name, email, phone, notes, source_platform, interested_keywords
5. `supabase/functions/send-preferences-email/index.ts` — add `esc()`, apply to all contactInfo fields, section titles, activity names, site names, otherOption
6. `supabase/functions/send-low-confidence-alert/index.ts` — add `esc()`, apply to visitorName, message, conversationId

**Client component (1):**
7. `src/components/ContactSection.tsx` — update zod schema max lengths: email 150→150, phone 30→20, message 1000→2000; update `maxLength` attrs on `<Input>`/`<Textarea>` elements

### Details

**`esc()` helper** (added at top of each edge function — no shared module in Deno edge functions):
```typescript
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

**Contact form validation changes (ContactSection.tsx):**
- `email`: max 255 → 150
- `phone`: max 30 → 20
- `message`: max 1000 → 2000
- Add/update `maxLength` HTML attributes on all 4 inputs to match

**Server-side (forward-webhook):** Update zod schema to match: email max 150, phone max 20, message max 2000. Apply `esc()` to query params.

**All email functions:** Wrap every user-supplied string interpolation in `esc()` before inserting into HTML templates. For arrays (destinations, keywords, activities), map each element through `esc()`.

### What does NOT change
- No routing, layout, visual design, or functionality changes
- No new files created (helper is inlined per function)

