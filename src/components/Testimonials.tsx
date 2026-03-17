import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { staggerContainer, staggerItem } from '@/components/ScrollReveal';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  testimonial_text: string;
  rating: number;
  is_featured: boolean;
}

const Testimonials = () => {
  const { t, language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials').select('*').eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false }).limit(3);
      if (error) throw error;
      setTestimonials(data && data.length > 0 ? data : getDefaults());
    } catch { setTestimonials(getDefaults()); }
    finally { setLoading(false); }
  };

  const getDefaults = (): Testimonial[] => [
    { id: '1', customer_name: language === 'he' ? 'רונית כהן' : 'Ronit Cohen', customer_company: language === 'he' ? 'מנהלת משאבי אנוש' : 'HR Manager', testimonial_text: language === 'he' ? 'יום מדהים! הצוות שלנו חזר מאוחד ומלא אנרגיה. השילוב של פעילויות גיבוש והיסטוריה היה מושלם.' : 'Amazing day! Our team came back united and energized. The combination of team-building and history was perfect.', rating: 5, is_featured: true },
    { id: '2', customer_name: language === 'he' ? 'יוסי לוי' : 'Yossi Levi', customer_company: language === 'he' ? 'מנכ"ל' : 'CEO', testimonial_text: language === 'he' ? 'חוויה בלתי נשכחת! הפעילויות היו מגוונות והמדריכים היו מעולים.' : 'Unforgettable experience! The activities were diverse and the guides were excellent.', rating: 5, is_featured: false },
    { id: '3', customer_name: language === 'he' ? 'מיכל אברהם' : 'Michal Avraham', customer_company: language === 'he' ? 'סמנכ"לית שיווק' : 'VP Marketing', testimonial_text: language === 'he' ? 'ארגון מושלם מתחילה ועד סוף. תשומת הלב לפרטים והגמישות - הכל היה ברמה הכי גבוהה.' : 'Perfect organization from start to finish. Attention to detail and flexibility - everything was top-notch.', rating: 5, is_featured: false },
  ];

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={staggerItem}
              className="p-8 rounded-2xl bg-card border border-border"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.testimonial_text}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground text-sm">{testimonial.customer_name}</p>
                {testimonial.customer_company && (
                  <p className="text-xs text-muted-foreground">{testimonial.customer_company}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export { Testimonials };
