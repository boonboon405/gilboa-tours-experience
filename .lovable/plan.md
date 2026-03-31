

## Two-Button Voice Control: Play/Pause + Talk

### What We're Building

Replace the single mic toggle with two distinct, branded buttons:

1. **"Start / Resume AI" button** (teal/primary) — Starts the session and makes the AI speak its greeting or continue speaking its response. When clicked again after user speaks, AI processes and responds.
2. **"My Turn to Talk" button** (accent/orange) — Pauses AI speech immediately, activates the microphone so the user can speak. When user is done, they click the first button to let the AI respond.

Additionally: switching language mid-session immediately stops all speech and resets.

### User Flow

```text
[Idle] → Click "Start AI" → AI speaks greeting (phase: speaking)
      → Click "My Turn" → AI stops talking, mic activates (phase: listening)
      → User speaks...
      → Click "Send to AI" → mic stops, AI processes + responds (phase: processing → speaking)
      → Click "My Turn" again → interrupt AI, speak again
      → ...repeat...
      → Click "End Session" → everything stops
```

### Language Switch Behavior
When user switches language (he↔en), `handleLanguageChange` already calls `endSession()` which stops TTS + recognition. The greeting regenerates in the new language. No additional change needed — already works.

### File Changes

#### 1. `src/components/VoiceChat.tsx` — Major UI refactor of controls

**State changes:**
- Keep `phase` state machine (`idle | listening | processing | speaking`)
- Keep `sessionActive` flag
- Remove auto-re-arm logic from `speakText` callback and `recognition.onend` — user now manually controls turns

**New control flow:**
- `startOrResumeAI()`: If no session, start session + speak greeting. If session active and user just spoke (has pending transcript), send to AI. If AI finished and waiting, do nothing.
- `takeMyTurn()`: Call `stopElevenLabsSpeech()`, set phase to `listening`, start recognition. Recognition stays on until user clicks "Send to AI".
- `recognition.continuous = true` so it captures everything while user talks
- `recognition.onresult`: Accumulate transcript into a ref (don't send immediately)
- When user clicks "Start AI" button after speaking: stop recognition, send accumulated transcript to `handleVoiceInput`

**UI — Bottom control bar:**
Replace the single 80px mic button with two side-by-side branded buttons:

- **Left button**: "▶ Start AI" / "▶ Let AI Respond" — teal/primary, rounded-full, min-w-[140px]
  - Idle: "Start Conversation" with play icon
  - After user spoke: "Send to AI" with send icon  
  - While AI speaking: disabled or shows "AI Speaking..."
- **Right button**: "🎤 My Turn" — accent/orange, rounded-full, min-w-[140px]
  - Only enabled when AI is speaking or session is active
  - While listening: shows "Listening..." with pulse animation
  - While idle (no session): disabled

- **End Session** link stays below

**Phase-based status text** updates to reflect the manual turn-taking.

#### 2. `src/utils/elevenLabsTTS.ts` — No changes needed

`stopElevenLabsSpeech()` already handles immediate interruption. The `onEnd` callback still fires correctly.

#### 3. `src/components/VoiceChat.tsx` — Language switch already stops speech

`handleLanguageChange` calls `endSession()` which calls `stopElevenLabsSpeech()` — this already handles the requirement that switching language stops the current voice immediately.

### Visual Design (Brand Identity)

- **Start/AI button**: Uses `bg-primary` (teal) with `hover:brightness-110`, `rounded-full`, `min-w-[140px]`, Heebo font
- **My Turn button**: Uses `bg-accent` (sunset orange) with `hover:brightness-110`, `rounded-full`, `min-w-[140px]`
- Active listening state: orange button gets `ring-4 ring-accent/30 animate-pulse`
- AI speaking state: teal button gets `ring-4 ring-primary/30`
- Status text: centered below buttons in `bg-background/80 rounded-lg border` container
- Both buttons use standard `200ms transition-all` per brand standards

### Summary

- Remove auto-loop logic (no auto re-arm)
- Two explicit buttons for turn-taking
- Accumulated transcript sent on user's command
- Language switch = immediate stop (already works)
- Brand-consistent button styling

