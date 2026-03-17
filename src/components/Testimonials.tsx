import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  testimonial_text: string;
  rating: number;
}

export const Testimonials = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('id, customer_name, customer_company, testimonial_text, rating')
        .eq('status', 'approved')
        .eq('language', language)
        .order('is_featured', { ascending: false })
        .limit(3);
      if (data && data.length > 0) setItems(data);
      setLoading(false);
    };
    fetchTestimonials();
  }, [language]);

  const fallback = [
    { id: '1', customer_name: t('testimonials.1.name'), customer_company: t('testimonials.1.company'), testimonial_text: t('testimonials.1.text'), rating: 5 },
    { id: '2', customer_name: t('testimonials.2.name'), customer_company: t('testimonials.2.company'), testimonial_text: t('testimonials.2.text'), rating: 5 },
    { id: '3', customer_name: t('testimonials.3.name'), customer_company: t('testimonials.3.company'), testimonial_text: t('testimonials.3.text'), rating: 5 },
  ];

  const displayItems = items.length > 0 ? items : (loading ? [] : fallback);

  if (loading) return null;

  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {displayItems.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              initial={prefersReducedMotion ? "visible" : "hidden"}
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeUp}
              className="relative bg-card border border-border rounded-lg p-8"
            >
              <Quote className="absolute top-6 end-6 h-8 w-8 text-primary/10" />
              <div className="flex gap-1 mb-5">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-8 italic">"{item.testimonial_text}"</p>
              <div className="flex items-center gap-3 border-t border-border pt-5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {item.customer_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.customer_name}</p>
                  {item.customer_company && <p className="text-muted-foreground text-xs">{item.customer_company}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
