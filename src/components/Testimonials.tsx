import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MessageSquarePlus } from 'lucide-react';
import { TestimonialSubmissionForm } from '@/components/TestimonialSubmissionForm';

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

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const Testimonials = () => {
  const { language } = useLanguage();
  const lang = language as 'he' | 'en';
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="bg-background border-t-[3px] border-primary py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-heading text-center mb-16 text-foreground">
          {lang === 'he' ? 'מה אומרים המשתתפים' : 'What Our Guests Say'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              className="bg-card rounded-2xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.07)] flex flex-col"
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-accent text-xl">★</span>
                ))}
              </div>

              <p className="italic text-foreground text-base leading-[1.7] mb-6 flex-1" style={{ fontFamily: 'Heebo, sans-serif' }}>
                "{t.quote[lang]}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {t.initials[lang]}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-primary text-[15px]">{t.name[lang]}</p>
                  <p className="text-muted-foreground text-[13px]">{t.tour[lang]}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews + Leave a Review */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <a
            href="https://www.google.com/maps/place/David+Gilboa+Tours"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary font-semibold"
          >
            <span className="text-xl">⭐</span>
            <span>4.9 ★ {lang === 'he' ? 'בגוגל' : 'on Google'}</span>
            <span className="text-sm text-muted-foreground">
              {lang === 'he' ? '— צפו בביקורות' : '— See reviews'}
            </span>
          </a>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowForm(true)}
            className="gap-2"
          >
            <MessageSquarePlus className="h-5 w-5" />
            {lang === 'he' ? 'השאר המלצה' : 'Leave a Review'}
          </Button>
        </div>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <TestimonialSubmissionForm />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export { Testimonials };
