import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export const Testimonials = () => {
  const { t } = useLanguage();

  const items = [1, 2, 3].map((i) => ({
    name: t(`testimonials.${i}.name`),
    company: t(`testimonials.${i}.company`),
    text: t(`testimonials.${i}.text`),
  }));

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              className="relative bg-card border border-border rounded-lg p-8"
            >
              <Quote className="absolute top-6 end-6 h-8 w-8 text-primary/10" />

              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground text-sm leading-relaxed mb-8 italic">
                "{item.text}"
              </p>

              <div className="flex items-center gap-3 border-t border-border pt-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.name}</p>
                  <p className="text-muted-foreground text-xs">{item.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
