

## Plan: Update Global Design Tokens

### Files to modify (2 files only)

1. **`src/index.css`** — Update `:root` and `.dark` CSS custom properties with new HSL color values; update gradient and shadow definitions that reference old HSL values
2. **`tailwind.config.ts`** — Add `highlight` and `gold` color tokens that map to the new CSS variables

### What changes

**`src/index.css` `:root` block:**
| Token | Old HSL | New HSL (from hex) |
|---|---|---|
| `--background` | `45 20% 98%` | `40 23% 97%` (#faf9f7) |
| `--foreground` | `150 30% 15%` | `0 0% 10%` (#1a1a1a) |
| `--card` | `0 0% 100%` | `0 0% 100%` (no change) |
| `--card-foreground` | `150 30% 15%` | `0 0% 10%` |
| `--popover` / `--popover-foreground` | same pattern | match card/foreground |
| `--primary` | `145 55% 35%` | `174 77% 26%` (#0f766e) |
| `--primary-light` | `145 45% 45%` | `174 72% 40%` (#14b8a6) |
| `--accent` | `30 75% 55%` | `25 95% 53%` (#f97316) |
| `--muted-foreground` | `150 20% 40%` | `220 9% 46%` (#6b7280) |
| `--muted` | `45 15% 92%` | `40 20% 94%` (slightly adjusted warm) |
| `--ring` | `145 55% 35%` | `174 77% 26%` (match primary) |
| `--border` / `--input` | `45 20% 88%` | `40 20% 88%` (minor warm shift) |

New variables added:
- `--highlight: 45 93% 47%` (#eab308)
- `--gold-nav: 43 100% 50%` (#FFB800)

Gradients and shadows updated to reference new primary HSL (`174 77% 26%`) and accent HSL (`25 95% 53%`).

Dark mode block updated proportionally.

**`tailwind.config.ts`:**
- Add `highlight` color mapping to `hsl(var(--highlight))`
- Add `gold: { nav: "hsl(var(--gold-nav))" }` for navigation gold accent

### What does NOT change
- No layout, component, font, or functionality changes
- No file additions or deletions
- Tailwind utility class names remain the same — only the underlying CSS variable values change

