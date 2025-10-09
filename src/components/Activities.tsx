import { Card, CardContent } from '@/components/ui/card';
import { Mountain, Waves, Landmark, UtensilsCrossed } from 'lucide-react';
import springsImage from '@/assets/springs-activity.jpg';
import beitSheanImage from '@/assets/beit-shean.jpg';
import pelicansImage from '@/assets/pelicans.jpg';
import clubCarsImage from '@/assets/club-cars.jpg';

export const Activities = () => {
  const activities = [
    {
      icon: Mountain,
      title: 'טבע ונוף היסטורי',
      description: 'ביקור בכתף שאול, צפייה באירוס הגלבוע, ושקנאים מרהיבים בנדידה מעל עמק הירדן.',
      image: pelicansImage,
      color: 'from-primary to-primary-light',
    },
    {
      icon: Waves,
      title: 'הרפתקה וגיבוש',
      description: 'ניווט ברכבי קלאב קאר חשמליים בנחל המעיינות, ארבעה מעיינות טבעיים, ומשחקי מים אינטראקטיביים.',
      image: springsImage,
      color: 'from-secondary to-secondary-light',
    },
    {
      icon: Landmark,
      title: 'רומא העתיקה בבית שאן',
      description: 'ביקור בעתיקות המרשימות של בית שאן הרומית - היפודרום והאמפיתיאטרון.',
      image: beitSheanImage,
      color: 'from-accent to-orange-500',
    },
    {
      icon: UtensilsCrossed,
      title: 'חוויה קולינרית',
      description: 'ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי - טעם אמיתי של האזור.',
      image: clubCarsImage,
      color: 'from-primary to-accent',
    },
  ];

  return (
    <section id="activities" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            מה כולל היום - דוגמא ליום כייף טיפוסי בנחל המעיינות?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מרכיבים קולינריה מקומית: גיבוש צוותי, טבע, ODT מורשת
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
                    alt={activity.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-40 group-hover:opacity-30 transition-opacity`} />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${activity.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {activity.description}
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
