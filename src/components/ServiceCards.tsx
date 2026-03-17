import { Users, Crown, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Users,
    title: 'סיורים יומיים',
    description: 'סיורים מודרכים בגלבוע, עמק המעיינות ובית שאן — חוויה שמשלבת טבע, היסטוריה וכיף.',
    cta: 'לפרטים',
  },
  {
    icon: Crown,
    title: 'סיורי VIP',
    description: 'חוויות פרמיום לאורחים מחו"ל — סיורים מותאמים אישית עם שירות ברמה הגבוהה ביותר.',
    cta: 'לפרטים',
  },
  {
    icon: Mountain,
    title: 'ODT — ימי גיבוש',
    description: 'פעילויות אתגריות בטבע לארגונים וצוותים — חיזוק קשרים דרך חוויה משותפת.',
    cta: 'לפרטים',
  },
];

export const ServiceCards = () => {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            מה אנחנו מציעים
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            שלוש דרכים לחוות את צפון ישראל — כל אחת מותאמת בדיוק לצרכים שלכם.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card key={service.title} className="border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5">
                  {service.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
