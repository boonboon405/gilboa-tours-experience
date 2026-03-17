import { Calendar, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

export const ServiceCards = () => {
  const { t } = useLanguage();

  const services = [
    {
      id: "daily",
      icon: Calendar,
      titleKey: 'services.dailyTitle',
      shortDescKey: 'services.dailyShort',
    },
    {
      id: "vip",
      icon: Users,
      titleKey: 'services.vipTitle',
      shortDescKey: 'services.vipShort',
    },
    {
      id: "odt",
      icon: Briefcase,
      titleKey: 'services.odtTitle',
      shortDescKey: 'services.odtShort',
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{t(service.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t(service.shortDescKey)}
                </p>
                <Link to="/booking">
                  <Button variant="outline" size="sm">
                    {t('hero.bookTour')}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
