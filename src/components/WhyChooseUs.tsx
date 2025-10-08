import { Card, CardContent } from '@/components/ui/card';
import { Award, Settings, Shield, Truck } from 'lucide-react';

export const WhyChooseUs = () => {

  const reasons = [
    {
      icon: Award,
      title: 'מקצועי ומוסמך',
      desc: 'מדריך טיולים מורשה עם שנות ניסיון',
    },
    {
      icon: Settings,
      title: 'חוויות מותאמות אישית',
      desc: 'מעוצב במיוחד לקבוצות עסקיות ומקצועיות',
    },
    {
      icon: Shield,
      title: 'בטוח ומרענן',
      desc: 'מושלם לקיץ הישראלי החם',
    },
    {
      icon: Truck,
      title: 'שירות מלא',
      desc: 'כל הלוגיסטיקה מטופלת מתחילה ועד סוף',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
          למה לבחור בדוד טורס?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-block p-4 rounded-full bg-gradient-hero mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {reason.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
