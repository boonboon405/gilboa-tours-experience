

## Plan: Fix TTS Hebrew Word Boundary Matching

### Problem
Two files use broken regex for Hebrew word replacement:
1. **`ttsSanitizer.ts`** — No boundaries at all (`new RegExp(original, 'g')`) → matches substrings
2. **`ttsQualityChecker.ts`** — Uses `\b` which doesn't work with Hebrew characters → misses standalone words OR matches incorrectly

Both cause corruption: "קולינריה" → "נהדרינריה" because "קול" matches as a substring.

### Fix
Use Hebrew-aware lookbehind/lookahead: `(?<![א-ת])PATTERN(?![א-ת])`

This ensures the pattern only matches when NOT surrounded by other Hebrew letters.

### Files to modify (2)

1. **`src/utils/ttsSanitizer.ts`** (line 66)
   - Change `new RegExp(original, 'g')` to `new RegExp('(?<![א-ת])' + original + '(?![א-ת])', 'g')`

2. **`src/utils/ttsQualityChecker.ts`** (lines 100, 106, 157)
   - Replace all `\\b${word}\\b` and `\\b${slang}\\b` patterns with `(?<![א-ת])${word}(?![א-ת])` for Hebrew words
   - Keep `\b` for pure ASCII words (like `DNA`) — but since all entries in the forbidden/replacement lists are Hebrew, apply the Hebrew boundary to all

### What does NOT change
- No replacement rules added or removed
- No config changes
- No other functionality affected

