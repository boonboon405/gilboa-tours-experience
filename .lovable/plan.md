

## Plan: Security Hardening — Authentication & Access Control

### Assessment of requested changes

1. **JWT authentication for realtime tokens**: No realtime token generation edge function exists in this project. No Supabase realtime token issuance code was found. This item requires no changes — there is nothing to protect.

2. **RLS on seo_keywords table**: Already correctly configured. INSERT, UPDATE, and DELETE are already restricted to `authenticated` role with `is_admin(auth.uid())` checks. SELECT allows public access to active keywords. No changes needed.

3. **Rate limiting on all edge functions**: This is the only actionable item. Add IP-based rate limiting (30 req/min/IP) to all 15 edge functions.

### Files to modify (15 edge function files)

1. `supabase/functions/ai-chat-agent/index.ts`
2. `supabase/functions/forward-webhook/index.ts`
3. `supabase/functions/generate-category-description/index.ts`
4. `supabase/functions/generate-landscape-image/index.ts`
5. `supabase/functions/generate-location-image/index.ts`
6. `supabase/functions/generate-odt-image/index.ts`
7. `supabase/functions/live-chat-ai-response/index.ts`
8. `supabase/functions/process-email-queue/index.ts`
9. `supabase/functions/send-booking-notification/index.ts`
10. `supabase/functions/send-contact-email/index.ts`
11. `supabase/functions/send-lead-notification/index.ts`
12. `supabase/functions/send-low-confidence-alert/index.ts`
13. `supabase/functions/send-preferences-email/index.ts`
14. `supabase/functions/send-whatsapp-notification/index.ts`
15. `supabase/functions/text-to-speech/index.ts`

### Implementation detail

Add an in-memory rate limiter at the top of each edge function:

```typescript
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}
```

At the start of each handler (after CORS preflight):

```typescript
const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  ?? req.headers.get('cf-connecting-ip')
  ?? 'unknown';
if (!checkRateLimit(ip)) {
  return new Response('Too many requests', {
    status: 429,
    headers: corsHeaders,
  });
}
```

This is per-isolate in-memory limiting. It resets on cold starts but provides meaningful protection against burst abuse without external dependencies.

### What does NOT change
- No UI, layout, or data structure changes
- No RLS changes (already correct)
- No new files created

