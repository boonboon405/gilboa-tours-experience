

## Fix: Quiz Auto-Opening on Every Page Load

### Problem
In `src/components/ChooseYourDay.tsx` (lines 358-364), a `useEffect` checks localStorage for saved quiz results. If none are found, it calls `setShowQuiz(true)`, which auto-opens the TeamDNA Quiz dialog every time the homepage loads for new visitors (or anyone who hasn't completed the quiz).

### Fix
**File:** `src/components/ChooseYourDay.tsx`
- Remove the `setShowQuiz(true)` auto-trigger from the useEffect
- The quiz should only open when the user explicitly clicks a "Take Quiz" button
- Keep the localStorage check for loading previous results — just don't force-open the quiz

### Change
```typescript
// Before (line 358-365)
useEffect(() => {
  const savedResults = localStorage.getItem('teamDNAResults');
  if (savedResults) {
    try { setQuizResults(JSON.parse(savedResults)); } catch (e) { ... }
  } else {
    setShowQuiz(true);  // ← THIS auto-opens on every refresh
  }
}, []);

// After
useEffect(() => {
  const savedResults = localStorage.getItem('teamDNAResults');
  if (savedResults) {
    try { setQuizResults(JSON.parse(savedResults)); } catch (e) { ... }
  }
}, []);
```

### Files modified (1)
1. `src/components/ChooseYourDay.tsx` — remove auto-open quiz logic

