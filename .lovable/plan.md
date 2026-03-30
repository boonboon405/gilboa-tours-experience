

## Plan: Add Hebrew Voice Test Button to AI Chat

### File to modify (1)
1. **`src/components/AIChat.tsx`** — Add a "בדיקת קול" button next to the VoiceSelector

### Change

In the voice settings section (lines 778-786), add a compact ghost button after the VoiceSelector that:
- Calls `speakWithElevenLabs` with the test phrase `"[he] שלום, אני דוד. ברוכים הבאים לסיורים שלנו בגליל."` using the currently selected voice
- Is disabled while `isSpeaking` is true
- Styled as a ghost button with gold text (`text-[var(--color-gold-nav)]`), no background, subtle border on hover

```tsx
<Button
  variant="ghost"
  size="sm"
  disabled={isSpeaking}
  onClick={() => {
    speakWithElevenLabs(
      "[he] שלום, אני דוד. ברוכים הבאים לסיורים שלנו בגליל.",
      selectedVoice,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      'he'
    );
  }}
  className="text-[var(--color-gold-nav)] hover:border hover:border-[var(--color-gold-nav)]/30 text-xs px-2 py-1 h-auto"
>
  🔊 בדיקת קול
</Button>
```

Inserted inside the `<div className="flex items-center gap-2">` block, after `<VoiceSelector ... />` and before the speaking animation.

### What does NOT change
- No other chat functionality, layout, or components modified
- VoiceSelector, SpeakingAnimation, message handling all unchanged

