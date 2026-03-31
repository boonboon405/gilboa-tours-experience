

## Fix Voice Chat: Immediate AI Greeting + Barge-In Interruption

### Problem
1. **No immediate AI speech on session start**: Clicking the mic only starts listening — the AI greeting (already displayed as text) is never spoken aloud
2. **No barge-in**: When the user starts speaking, the AI keeps talking — there's no interruption logic
3. **Hebrew voice verification**: Need to confirm the language param flows correctly to the TTS edge function

### Changes

#### 1. `src/components/VoiceChat.tsx` — `startSession` function

**Speak greeting immediately on session start:**
- After getting mic permission and setting session active, call `speakText()` with the current greeting message (first message in `messages` array)
- Set phase to `'speaking'` first (not `'listening'`), then after greeting finishes, auto-transition to `'listening'` and start recognition
- This way: click mic → AI speaks greeting → then listens for user

**Add barge-in (interrupt) logic:**
- In `recognition.onresult`, before processing the transcript, call `stopElevenLabsSpeech()` to immediately cut off any AI speech
- This means: if AI is speaking and user starts talking, the AI stops mid-sentence and the user's input gets processed
- Also in `recognition.onstart` or when speech is first detected, stop TTS playback

**Flow after fix:**
```text
Click mic → [Speaking] (AI speaks greeting)
                → TTS ends → [Listening] (auto-arm mic)
                → User speaks (interrupts AI if still talking) → [Processing] → [Speaking] → [Listening] → ...
Click mic again → [Idle] (end session)
```

#### 2. `src/components/VoiceChat.tsx` — Speech recognition setup

**Enable barge-in during continuous listening:**
- In the `recognition.onresult` handler (line ~104), add `stopElevenLabsSpeech()` as the first action before calling `handleVoiceInput`
- This ensures any currently playing AI audio is cut immediately when user speech is detected

#### 3. Hebrew voice verification

The current flow is correct:
- `speakText` calls `speakWithElevenLabs(text, selectedVoice, ..., language)` where `language` comes from `useLanguage()` context
- The edge function receives `language`, detects Hebrew chars, prepends `[he]` prefix, uses `eleven_multilingual_v2` model
- No code change needed here — the Hebrew path is properly wired

### Summary of code changes

**`src/components/VoiceChat.tsx`:**
1. `startSession`: After mic permission, speak the greeting message first (phase = speaking), then on TTS end transition to listening + start recognition
2. `recognition.onresult`: Add `stopElevenLabsSpeech()` at the top to enable barge-in interruption
3. `recognition.continuous = true` should remain to keep re-arming within a session

No other files need changes.

