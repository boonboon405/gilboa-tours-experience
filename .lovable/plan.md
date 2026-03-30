

## Plan: Remove ExitIntentModal and LiveChatWidget

### Files to delete (2)
1. `src/components/ExitIntentModal.tsx`
2. `src/components/LiveChatWidget.tsx`

### Files to modify (2)
1. **`src/pages/Index.tsx`** — Remove the `ExitIntentModal` import (line 11) and its usage `<ExitIntentModal />` (line 23)
2. **`src/App.tsx`** — Remove the `LiveChatWidget` import (line 36) and its usage `<LiveChatWidget />` (line 180)

### What does NOT change
- The primary `AIChat` component and `VoiceChat` remain untouched
- No layout, routing, or other UI changes

