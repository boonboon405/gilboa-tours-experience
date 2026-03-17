import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'מיכל ל.',
    company: 'מנהלת HR, חברת הייטק',
    text: 'יום הגיבוש עם שמחה היה מדהים. הצוות חזר עם אנרגיות חדשות ותחושת שייכות אמיתית.',
    rating: 5,
  },
  {
    name: 'דוד כ.',
    company: 'מנכ"ל, חברת יבוא',
    text: 'ארגנו סיור VIP לאורחים מחו"ל והם לא הפסיקו להתפעל. שירות מקצועי ואישי.',
    rating: 5,
  },
  {
    name: 'רונית ש.',
    company: 'רכזת פעילות, עירייה',
    text: 'השילוב של טבע, היסטוריה וקולינריה היה מושלם. כבר מתכננים את הסיור הבא.',
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מה אומרים עלינו
          </h2>
          <p className="text-muted-foreground">חוויות אמיתיות מלקוחות מרוצים</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
