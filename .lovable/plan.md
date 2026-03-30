

## Plan: Hebrew-Safe WebSpeech Fallback

### File to modify (1)
1. **`src/utils/elevenLabsTTS.ts`**

### Changes

**1. Pass `language` to the fallback call (line 113)**

Change the catch block to forward the language parameter:
```typescript
return speakWithWebSpeech(sanitizedText, onStart, onEnd, language);
```

**2. Rewrite `speakWithWebSpeech` (lines 120–147)**

Add a `language` parameter (default `'he'`). When language is Hebrew:
- Check `getVoices()` for a voice with `lang === 'he-IL'` or `lang === 'he'`
- If found → use it as fallback (current behavior)
- If NOT found → skip speech, import `toast` from sonner, show `toast("Hebrew voice unavailable on this device")`, return `false`

When language is NOT Hebrew → keep current behavior unchanged (use any available voice).

```typescript
function speakWithWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  language: 'he' | 'en' = 'he'
): boolean {
  if (!('speechSynthesis' in window)) {
    return false;
  }

  const voices = window.speechSynthesis.getVoices();

  if (language === 'he') {
    const hebrewVoice = voices.find(v => v.lang === 'he-IL' || v.lang === 'he');
    if (!hebrewVoice) {
      console.warn('[Web Speech] No Hebrew voice available, failing silently');
      toast("Hebrew voice unavailable on this device");
      return false;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'he-IL';
    utterance.rate = ttsConfig.defaultRate;
    utterance.voice = hebrewVoice;
    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
    return true;
  }

  // English / other — unchanged fallback
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = ttsConfig.defaultRate;
  const englishVoice = voices.find(v => v.lang.includes('en'));
  if (englishVoice) utterance.voice = englishVoice;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
  return true;
}
```

**3. Add import** — Add `import { toast } from "sonner";` at top of file.

### What does NOT change
- ElevenLabs API call, voice selection, sanitization — unchanged
- English fallback behavior — unchanged
- No other files modified

