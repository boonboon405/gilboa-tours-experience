import { Users, Crown, Mountain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const ServiceCards = () => {
  const { t } = useLanguage();

  const services = [
    { icon: Users, titleKey: 'services.daily.title', descKey: 'services.daily.desc' },
    { icon: Crown, titleKey: 'services.vip.title', descKey: 'services.vip.desc' },
    { icon: Mountain, titleKey: 'services.odt.title', descKey: 'services.odt.desc' },
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('services.title')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('services.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((s) => (
            <Card key={s.titleKey} className="border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <s.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{t(s.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t(s.descKey)}</p>
                <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5">
                  {t('services.cta')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
