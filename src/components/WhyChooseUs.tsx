import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Settings, Shield, Truck } from 'lucide-react';

export const WhyChooseUs = () => {
  const { t } = useLanguage();

  const reasons = [
    {
      icon: Award,
      titleKey: 'why.certified',
      descKey: 'why.certified.desc',
    },
    {
      icon: Settings,
      titleKey: 'why.custom',
      descKey: 'why.custom.desc',
    },
    {
      icon: Shield,
      titleKey: 'why.safe',
      descKey: 'why.safe.desc',
    },
    {
      icon: Truck,
      titleKey: 'why.logistics',
      descKey: 'why.logistics.desc',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
          {t('why.title')}
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
                    {t(reason.titleKey)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(reason.descKey)}
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
