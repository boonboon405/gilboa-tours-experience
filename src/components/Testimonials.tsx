import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  testimonial_text: string;
  rating: number;
}

export const Testimonials = () => {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('status', 'approved')
          .order('is_featured', { ascending: false })
          .limit(3);
        if (data && data.length > 0) setTestimonials(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {language === 'he' ? 'מה הלקוחות אומרים' : 'What Our Clients Say'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.id} className="p-8 rounded-2xl bg-card border border-border">
              <Quote className="w-8 h-8 text-muted-foreground/20 mb-4" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                "{t.testimonial_text}"
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-sm">{t.customer_name}</p>
                {t.customer_company && (
                  <p className="text-xs text-muted-foreground">{t.customer_company}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
