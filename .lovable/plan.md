

## Fix: Suggestions Reshuffling + Voice Input Network Error

### Problem 1: Quick Reply Suggestions Keep Changing
Lines 528-540 in `VoiceChat.tsx` run a `setInterval` every 10 seconds that reshuffles the suggestions randomly. This is disorienting — suggestions should only randomize once on page load.

**Fix:** Remove the `setInterval`. Keep the initial shuffle on mount only.

### Problem 2: "My Turn to Talk" Triggers Network Error
The console shows `Speech recognition error: network` when clicking "My Turn to Talk". The browser's built-in `SpeechRecognition` API sends audio to Google's servers and is unreliable — it frequently fails with network errors, especially in non-Chrome browsers or when the gesture chain is broken.

**Fix:** Replace the browser `SpeechRecognition` API with **ElevenLabs Realtime STT** (`scribe_v2_realtime`) which is far more reliable and already matches the TTS provider. This involves:

1. **New edge function** `elevenlabs-scribe-token` — generates a single-use token for the ElevenLabs realtime STT WebSocket (keeps API key server-side)
2. **Install `@elevenlabs/react`** — provides the `useScribe` hook for WebSocket-based transcription
3. **Refactor `takeMyTurn`** in `VoiceChat.tsx` — instead of `recognition.start()`, connect to ElevenLabs Scribe via the `useScribe` hook with VAD (voice activity detection) for automatic silence-based segmentation
4. **Remove browser SpeechRecognition** — delete the `useEffect` that initializes `SpeechRecognition` and all related refs

### File Changes

#### 1. `src/components/VoiceChat.tsx`
- **Line 528-540**: Remove `setInterval` from the quick replies effect; keep only the initial shuffle on mount
- **Lines 94-164**: Remove browser `SpeechRecognition` initialization `useEffect`
- **Lines 166-171**: Remove the language-sync `useEffect` for recognition
- Add `useScribe` hook from `@elevenlabs/react` with:
  - `modelId: 'scribe_v2_realtime'`
  - `commitStrategy: 'vad'` (auto-commits on silence)
  - `onCommittedTranscript`: accumulates into `accumulatedTranscriptRef` and sets `hasPendingTranscript`
- **`takeMyTurn` (line 368-382)**: Instead of `recognition.start()`, call `scribe.connect()` with a token fetched from the edge function, with microphone config (echoCancellation, noiseSuppression)
- **`endSession` (line 384-395)**: Call `scribe.disconnect()` instead of `recognition.abort()`
- **`startOrResumeAI` (line 353-365)**: When sending transcript, call `scribe.disconnect()` instead of `recognition.abort()`

#### 2. New edge function: `supabase/functions/elevenlabs-scribe-token/index.ts`
- POST endpoint that calls `https://api.elevenlabs.io/v1/single-use-token/realtime_scribe` using `ELEVENLABS_API_KEY`
- Returns `{ token }` to the client
- Standard CORS headers

#### 3. Package install
- `npm install @elevenlabs/react`

### Language Handling
- The ElevenLabs Scribe model auto-detects language, so no manual `lang` parameter is needed — it handles Hebrew and English natively
- When language switches, `endSession()` disconnects the scribe session; `takeMyTurn` reconnects with a fresh token

### Summary
- Suggestions: shuffle once on load, never again
- Voice input: replace unreliable browser STT with ElevenLabs Realtime STT via WebSocket for reliable, high-quality speech recognition in both Hebrew and English

