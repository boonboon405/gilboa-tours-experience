

## Confirmation: What Will Be Created and Where

**There is already a `<Testimonials />` component** at line 50 of `Index.tsx`, positioned between the galleries and `PublicFAQ`. It fetches from the database with hardcoded fallbacks.

**The plan is to completely rewrite `src/components/Testimonials.tsx`** with the premium design specified. No new files created. No changes to `Index.tsx` — the component stays in the same position (after NorthIsraelGallery, before PublicFAQ), which is between the tours/services sections and the contact section. This matches the requested placement.

---

## Plan: Premium Testimonials Redesign

### File to modify (1)

**`src/components/Testimonials.tsx`** — Full rewrite

### Design

- Remove Supabase fetch and database dependency — use the 3 specified placeholder cards as static content
- Import `useLanguage` from `LanguageContext` (consistent with other updated components)
- Remove `loading` state and spinner

### Structure

```
<section> — bg-background, border-t-[3px] border-primary, py-20
  <h2> — "מה אומרים המשתתפים" / "What Our Guests Say", font-bold 700
  <grid 3-col → 1-col>
    <card> — bg-white, shadow-[0_4px_24px_rgba(0,0,0,0.07)], rounded-2xl, p-8
      → 5 gold stars (★) in text-highlight
      → Quote text (italic, text-foreground, 16px)
      → Avatar circle (48px, bg-primary-light, white initials)
      → Name (bold, text-primary, 15px)
      → Tour type (text-muted-foreground, 13px)
```

### Bilingual Content (3 cards)

| # | Quote (HE) | Quote (EN) | Name | Tour (HE/EN) |
|---|---|---|---|---|
| 1 | הסיור בגליל היה חוויה שאני לא אשכח לעולם. דוד ידען אמיתי. | The Galilee tour was an experience I'll never forget. David is a true expert. | Yael M. / יעל מ. | סיור טבע מודרך / Guided Nature Tour |
| 2 | יום הגיבוש שארגן דוד לצוות שלנו היה מושלם. מקצועי, כיפי ומרגש. | The team-building day David organized for us was perfect — professional, fun, and moving. | Ran K. / רן כ. | יום גיבוש לחברות / Corporate Team Day |
| 3 | חוויית VIP ברמה של פנטהאוז. כל פרט טופל. ממליץ בחום! | A penthouse-level VIP experience. Every detail handled. Highly recommended! | Michal T. / מיכל ט. | סיור VIP פרטי / VIP Private Tour |

### Avatar
Circular 48px div with `bg-primary-light` and white bold initials extracted from the name.

### What does NOT change
- `Index.tsx` — no changes, component stays at line 50
- No other sections or components modified

