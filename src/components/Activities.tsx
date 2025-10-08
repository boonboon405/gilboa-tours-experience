import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mountain, Waves, Landmark, UtensilsCrossed } from 'lucide-react';
import springsImage from '@/assets/springs-activity.jpg';
import beitSheanImage from '@/assets/beit-shean.jpg';
import pelicansImage from '@/assets/pelicans.jpg';
import clubCarsImage from '@/assets/club-cars.jpg';

export const Activities = () => {
  const { t } = useLanguage();

  const activities = [
    {
      icon: Mountain,
      titleKey: 'activities.history.title',
      descKey: 'activities.history.desc',
      image: pelicansImage,
      color: 'from-primary to-primary-light',
    },
    {
      icon: Waves,
      titleKey: 'activities.adventure.title',
      descKey: 'activities.adventure.desc',
      image: springsImage,
      color: 'from-secondary to-secondary-light',
    },
    {
      icon: Landmark,
      titleKey: 'activities.culture.title',
      descKey: 'activities.culture.desc',
      image: beitSheanImage,
      color: 'from-accent to-orange-500',
    },
    {
      icon: UtensilsCrossed,
      titleKey: 'activities.culinary.title',
      descKey: 'activities.culinary.desc',
      image: clubCarsImage,
      color: 'from-primary to-accent',
    },
  ];

  return (
    <section id="activities" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('activities.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('activities.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card
                key={index}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={t(activity.titleKey)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${activity.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {t(activity.titleKey)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {t(activity.descKey)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
