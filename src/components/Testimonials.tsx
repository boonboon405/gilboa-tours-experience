import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = [
  {
    quote: { he: 'הסיור בגליל היה חוויה שאני לא אשכח לעולם. דוד ידען אמיתי.', en: "The Galilee tour was an experience I'll never forget. David is a true expert." },
    name: { he: 'יעל מ.', en: 'Yael M.' },
    tour: { he: 'סיור טבע מודרך', en: 'Guided Nature Tour' },
    initials: { he: 'י', en: 'Y' },
  },
  {
    quote: { he: 'יום הגיבוש שארגן דוד לצוות שלנו היה מושלם. מקצועי, כיפי ומרגש.', en: 'The team-building day David organized for us was perfect — professional, fun, and moving.' },
    name: { he: 'רן כ.', en: 'Ran K.' },
    tour: { he: 'יום גיבוש לחברות', en: 'Corporate Team Day' },
    initials: { he: 'ר', en: 'R' },
  },
  {
    quote: { he: 'חוויית VIP ברמה של פנטהאוז. כל פרט טופל. ממליץ בחום!', en: 'A penthouse-level VIP experience. Every detail handled. Highly recommended!' },
    name: { he: 'מיכל ט.', en: 'Michal T.' },
    tour: { he: 'סיור VIP פרטי', en: 'VIP Private Tour' },
    initials: { he: 'מ', en: 'M' },
  },
];

const Testimonials = () => {
  const { language } = useLanguage();
  const lang = language as 'he' | 'en';

  return (
    <section className="bg-background border-t-[3px] border-primary py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-heading text-center mb-16 text-foreground">
          {lang === 'he' ? 'מה אומרים המשתתפים' : 'What Our Guests Say'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-card rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-accent text-xl">★</span>
                ))}
              </div>

              <p className="italic text-foreground text-base leading-relaxed mb-6 flex-1" style={{ fontFamily: 'Heebo, sans-serif' }}>
                "{t.quote[lang]}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold text-lg text-primary">
                    {t.initials[lang]}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-primary text-[15px]">{t.name[lang]}</p>
                  <p className="text-muted-foreground text-[13px]">{t.tour[lang]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
