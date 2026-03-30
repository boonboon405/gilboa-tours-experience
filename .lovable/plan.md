

## Plan: Add Hebrew Language Anchor Prefix to TTS

### File to modify (1)
1. **`supabase/functions/text-to-speech/index.ts`** — line 83-85

### Change

In the Hebrew branch (line 83: `if (language === 'he' || hasHebrew)`), prepend `[he] ` to `processedText`:

```typescript
if (language === 'he' || hasHebrew) {
  processedText = '[he] ' + processedText;
  console.log('Processing as Hebrew - enforcing Hebrew language with [he] prefix');
}
```

The English branch remains unchanged. No other API call parameters are modified.

### What does NOT change
- Voice settings, model_id, speed, voice selection — all unchanged
- Character cleaning logic — unchanged
- Rate limiting, CORS, error handling — unchanged
- Client-side code — unchanged

