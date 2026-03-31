

## Fix Voice Chat: Hands-Free Conversational Agent

### Problem
The Voice Chat mic button fails because:
1. **One-shot recognition**: Browser `SpeechRecognition` fires once and stops — no re-arming after the AI replies
2. **No session concept**: There is no "active conversation session" state; the button toggles a single recognition attempt
3. **Language desync**: `VoiceChat` manages its own local `language` state, separate from the global `LanguageContext`, causing potential mismatches in STT/TTS
4. **getUserMedia called every click**: Requesting mic permission on every tap can cause browser prompts or `NotAllowedError`

### Solution: Hands-Free Conversational Loop

Replace the current one-shot mic logic with a session-based state machine that automatically re-listens after each AI response.

### Architecture

```text
[Idle] --click mic--> [Session Active: Listening]
                          |
                     (user speaks)
                          |
                     [Processing] (send to AI agent)
                          |
                     [Speaking] (TTS plays AI response)
                          |
                     (TTS ends)
                          |
                     [Listening] (auto re-arm)
                          ...
[Session Active] --click mic--> [Idle] (end session)
```

### Files to Modify

#### 1. `src/components/VoiceChat.tsx` (major refactor)

- **Add session state**: Replace `isListening` boolean with a `sessionActive` flag plus a `phase` enum (`idle | listening | processing | speaking`)
- **Request mic permission once** at session start, store the stream
- **Continuous recognition**: Set `recognition.continuous = true` so it keeps listening within a session
- **Auto re-arm on TTS end**: When `speakText` finishes (the `onEnd` callback), automatically call `recognition.start()` if session is still active
- **Single mic button**: Acts as session toggle — first click starts session (requests mic + begins listening), second click ends session (stops recognition + TTS)
- **Sync language with global context**: Import `useLanguage` from `LanguageContext` instead of maintaining a separate local state. When the global language changes, restart the recognition with the correct `lang`
- **Visual feedback**: Update status text to show session state clearly (Listening / Processing / Speaking / Click to end session)

#### 2. `src/contexts/LanguageContext.tsx` (minor)

- Persist language to `localStorage` on change (currently only VoiceChat does this separately)
- Read initial language from `localStorage` so it stays in sync

#### 3. `src/utils/elevenLabsTTS.ts` (no change needed)

Already supports `onEnd` callback which will be used to trigger re-listening.

### Key Implementation Details

**Session start flow:**
```
1. await navigator.mediaDevices.getUserMedia({ audio: true })
2. Set sessionActive = true, phase = 'listening'
3. recognition.lang = language === 'he' ? 'he-IL' : 'en-US'
4. recognition.continuous = true
5. recognition.start()
```

**On speech result:**
```
1. phase = 'processing'
2. recognition.stop() (pause while AI processes)
3. Send transcript to ai-chat-agent with language param
4. phase = 'speaking'
5. speakText(response, { onEnd: () => {
     if (sessionActive) {
       phase = 'listening'
       recognition.start()  // re-arm
     }
   }})
```

**Session end:**
```
1. sessionActive = false
2. recognition.stop()
3. stopElevenLabsSpeech()
4. phase = 'idle'
```

**Language sync:**
- Remove local `language` state from VoiceChat
- Use `const { language } = useLanguage()` from context
- When language changes via the header buttons, update `recognition.lang` and restart if in session

### Bilingual Support
- STT: `recognition.lang` set to `he-IL` or `en-US` based on active language
- AI Agent: `language` param already sent to edge function, which adjusts system prompt
- TTS: `language` param already passed to ElevenLabs edge function

### UI Changes
- Mic button: green pulsing when session active + listening, orange when processing, blue when AI speaking
- Status text: "Session active - listening..." / "Processing..." / "AI is speaking..." / "Click mic to start"
- Add a small "End session" label when session is active

