

## Current Text Strings (Confirmation)

Here are all descriptive text strings on the homepage outside the Hero:

### WhyChooseUs
- **Heading**: "למה לבחור בדויד טורס?"
- **Card 1**: "מקצועי ומוסמך" / "מדריך טיולים מורשה עם שנות ניסיון"
- **Card 2**: "חוויות מותאמות אישית" / "מעוצב במיוחד לקבוצות עסקיות, חברות הי טק, ועדי עובדים וחברות מקצועיות"
- **Card 3**: "בטוח ומרענן" / "מושלם לקיץ הישראלי החם"
- **Card 4**: "שירות מלא" / "כל הלוגיסטיקה מטופלת מתחילה ועד סוף"

### ServiceCards
- **Section heading**: "השירותים שלנו"
- **Section subtitle**: "בחר את החוויה המושלמת עבורך - סיורים יומיים, חוויות VIP, או אירועי גיבוש לארגונים"
- **Daily shortDesc**: "חוויות מודרכות באזור הגלבוע ועמק בית שאן"
- **Daily longDesc**: "יום מלא בחוויות היסטוריות וטבעיות מרהיבות. מתאים למשפחות, קבוצות חברים, וצוותי עבודה."
- **VIP shortDesc**: "חוויה פרימיום מותאמת אישית עם שירות יוקרתי"
- **VIP longDesc**: "סיור אקסקלוסיבי ומותאם באופן מלא לרצונותיכם..."
- **ODT shortDesc**: "פיתוח ארגוני בחוץ - גיבוש וצוות לחברות"
- **ODT longDesc**: "תוכנית ODT מקצועית המשלבת אתגרים, פעילויות גיבוש, וחוויות בטבע..."

### Footer
- **Brand description**: "יום חווייתי, מהנה ומשמעותי שמשלב היסטוריה, טבע, גיבוש, והרבה זיכרונות טובים לחברה שלכם."

### LanguageContext (English translations)
- `hero.description`: "Powerful, fun-filled day trips combining history, nature, team-building, and unforgettable memories for your company."

**Note**: WhyChooseUs, ServiceCards, and Footer are currently **Hebrew-only** — they don't use `useLanguage()` or `t()`.

---

## Plan: Update Homepage Descriptions

### Approach
Add bilingual support to the three Hebrew-only components by importing `useLanguage`, and update all vague descriptions to clearly mention: guided nature/landscape tours, team-building days, VIP private experiences, set in Gilboa mountains, Springs Valley (עמק המעיינות), and the Galilee.

### Files to modify (4)

**1. `src/components/WhyChooseUs.tsx`**
- Import `useLanguage`
- Replace hardcoded strings with bilingual versions:

| Current (HE) | New (HE) | New (EN) |
|---|---|---|
| "למה לבחור בדויד טורס?" | "למה לבחור בדויד טורס?" | "Why Choose David Tours?" |
| "מדריך טיולים מורשה עם שנות ניסיון" | "מדריך טיולים מורשה עם שנות ניסיון בהרי הגלבוע, עמק המעיינות והגליל" | "Licensed tour guide with years of experience in the Gilboa mountains, Springs Valley, and the Galilee" |
| "מעוצב במיוחד לקבוצות עסקיות, חברות הי טק, ועדי עובדים וחברות מקצועיות" | "סיורי טבע ונוף, ימי גיבוש לצוותים, וחוויות VIP פרטיות — מותאמים לקבוצות, חברות וארגונים" | "Nature and landscape tours, team-building days, and private VIP experiences — tailored for groups, companies, and organizations" |
| "מושלם לקיץ הישראלי החם" | "מעיינות צלולים, נופים ירוקים ואוויר הרים — מושלם לקיץ הישראלי" | "Crystal-clear springs, green landscapes, and mountain air — perfect for the Israeli summer" |
| "כל הלוגיסטיקה מטופלת מתחילה ועד סוף" | "כל הלוגיסטיקה מטופלת — מדריך, מסלול, ארוחות ותיאומים" | "Full logistics handled — guide, route, meals, and coordination" |

**2. `src/components/ServiceCards.tsx`**
- Import `useLanguage`
- Update section subtitle and service descriptions:

| Field | New (HE) | New (EN) |
|---|---|---|
| Section subtitle | "סיורי טבע ונוף מודרכים, ימי גיבוש לארגונים, וחוויות VIP פרטיות — בהרי הגלבוע, עמק המעיינות והגליל" | "Guided nature and landscape tours, corporate team-building days, and private VIP experiences — in the Gilboa mountains, Springs Valley, and the Galilee" |
| Daily shortDesc | "סיורי טבע ונוף מודרכים בהרי הגלבוע, עמק המעיינות והגליל" | "Guided nature and landscape tours in the Gilboa mountains, Springs Valley, and the Galilee" |
| Daily longDesc | "יום שלם של הליכה בנופים מרהיבים, מעיינות טבעיים, ואתרים היסטוריים. מתאים למשפחות, קבוצות חברים וצוותי עבודה." | "A full day of stunning landscapes, natural springs, and historical sites. Suitable for families, friend groups, and work teams." |
| VIP shortDesc | "חוויה פרטית ומותאמת אישית בנופי הגלבוע והגליל" | "Private, personalized experience in the Gilboa and Galilee landscapes" |
| ODT shortDesc | "ימי גיבוש וצוות בטבע הפתוח — הרי הגלבוע ועמק המעיינות" | "Team-building days in the open — Gilboa mountains and Springs Valley" |
| ODT longDesc | "תוכנית גיבוש מקצועית בטבע המשלבת אתגרים, עבודת צוות, ופעילויות בנופי הגלבוע ועמק המעיינות. מתאים לחברות בכל הגדלים." | "Professional outdoor team-building combining challenges, teamwork, and activities in the Gilboa and Springs Valley landscapes. Suitable for companies of all sizes." |

**3. `src/components/Footer.tsx`**
- Import `useLanguage`
- Update brand description:
  - HE: "סיורי טבע ונוף, ימי גיבוש, וחוויות VIP פרטיות בהרי הגלבוע, עמק המעיינות והגליל"
  - EN: "Nature and landscape tours, team-building days, and private VIP experiences in the Gilboa mountains, Springs Valley, and the Galilee"

**4. `src/contexts/LanguageContext.tsx`**
- Update `hero.description`:
  - EN: "Guided nature tours, team-building days, and private VIP experiences in the Gilboa mountains, Springs Valley, and the Galilee."

### What does NOT change
- Section layout, images, buttons, navigation, CTA text
- Feature lists and highlight details in ServiceCards modals
- Contact section (no descriptive text to update)
- FAQ and Testimonials (content from database)

