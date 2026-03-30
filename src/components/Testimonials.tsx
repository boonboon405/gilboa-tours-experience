import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { getLanguage } from '@/store/slices/languageSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_company: string | null;
  testimonial_text: string;
  rating: number;
  is_featured: boolean;
}

const Testimonials = () => {
  const language = useAppSelector(getLanguage);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('status', 'approved')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      
      // If we have database testimonials, use them
      if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        // Fallback to default testimonials if none in database
        setTestimonials(getDefaultTestimonials());
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials(getDefaultTestimonials());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTestimonials = () => [
    {
      id: '1',
      customer_name: language === 'he' ? 'רונית כהן' : 'Ronit Cohen',
      customer_company: language === 'he' ? 'מנהלת משאבי אנוש, חברת הייטק' : 'HR Manager, Tech Company',
      testimonial_text: language === 'he' 
        ? 'יום מדהים! הצוות שלנו חזר מאוחד ומלא אנרגיה. השילוב של פעילויות גיבוש והיסטוריה היה מושלם.'
        : 'Amazing day! Our team came back united and energized. The combination of team-building and history was perfect.',
      rating: 5,
      is_featured: true,
    },
    {
      id: '2',
      customer_name: language === 'he' ? 'יוסי לוי' : 'Yossi Levi',
      customer_company: language === 'he' ? 'מנכ"ל, חברת ייצור' : 'CEO, Manufacturing Company',
      testimonial_text: language === 'he'
        ? 'חוויה בלתי נשכחת! הפעילויות היו מגוונות והמדריכים היו מעולים.'
        : 'Unforgettable experience! The activities were diverse and the guides were excellent.',
      rating: 5,
      is_featured: false,
    },
    {
      id: '3',
      customer_name: language === 'he' ? 'מיכל אברהם' : 'Michal Avraham',
      customer_company: language === 'he' ? 'סמנכ"לית שיווק' : 'VP Marketing',
      testimonial_text: language === 'he'
        ? 'ארגון מושלם מתחילה ועד סוף. תשומת הלב לפרטים, הגמישות בהתאמת התוכנית - הכל היה ברמה הכי גבוהה.'
        : 'Perfect organization from start to finish. Attention to detail and flexibility - everything was top-notch.',
      rating: 5,
      is_featured: false,
    },
  ];

  if (loading) {
    return (
      <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {language === 'he' ? 'מה הלקוחות שלנו אומרים' : 'What Our Clients Say'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' 
              ? 'אלפי חברות סומכות עלינו ליצירת חוויות בלתי נשכחות' 
              : 'Thousands of companies trust us to create unforgettable experiences'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
              <CardContent className="p-6 relative">
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.testimonial_text}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground">
                    {testimonial.customer_name}
                  </p>
                  {testimonial.customer_company && (
                    <p className="text-sm text-muted-foreground">
                      {testimonial.customer_company}
                    </p>
                  )}
                  {testimonial.is_featured && (
                    <span className="text-xs text-primary font-semibold">⭐ המלצה מודגשת</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Testimonials };
