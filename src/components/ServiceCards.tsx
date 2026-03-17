import { Calendar, Users, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const getServices = (language: string) => [
  {
    icon: Calendar,
    title: language === 'he' ? 'ימי כיף לחברות' : 'Fun Days for Companies',
    description: language === 'he'
      ? 'יום מלא של הרפתקאות, טבע, היסטוריה וגיבוש צוותי. מותאם אישית לארגון שלכם.'
      : 'A full day of adventure, nature, history, and team building. Custom-tailored for your organization.',
    features: language === 'he'
      ? ['הרפתקאות בטבע', 'מעיינות וטיולי מים', 'חוויה קולינרית', 'גיבוש צוותי']
      : ['Nature adventures', 'Springs & water hikes', 'Culinary experience', 'Team building'],
    scrollTo: 'choose-your-day',
  },
  {
    icon: Users,
    title: language === 'he' ? 'סיורי VIP' : 'VIP Tours',
    description: language === 'he'
      ? 'סיורים פרטיים ומותאמים אישית לאורחים מחו"ל ולקבוצות קטנות.'
      : 'Private custom tours for international guests and small groups.',
    features: language === 'he'
      ? ['מסלול מותאם אישית', 'מדריך פרטי', 'חוויות בוטיק', 'גמישות מלאה']
      : ['Custom route', 'Private guide', 'Boutique experiences', 'Full flexibility'],
    scrollTo: 'vip-tours',
  },
  {
    icon: Briefcase,
    title: language === 'he' ? 'גיבוש ODT לארגונים' : 'ODT Team Building',
    description: language === 'he'
      ? 'תוכניות פיתוח ארגוני בחוץ – אתגרים, עבודת צוות ומנהיגות בטבע.'
      : 'Outdoor development training – challenges, teamwork, and leadership in nature.',
    features: language === 'he'
      ? ['פעילויות גיבוש', 'פיתוח מנהיגות', 'עבודת צוות', '10-200 משתתפים']
      : ['Team activities', 'Leadership development', 'Teamwork', '10-200 participants'],
    scrollTo: 'odt-section',
  },
];

export const ServiceCards = () => {
  const { language } = useLanguage();
  const services = getServices(language);
  const Arrow = language === 'he' ? ArrowLeft : ArrowRight;

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            {language === 'he' ? 'מה אנחנו מציעים' : 'What We Offer'}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {language === 'he'
              ? 'שלושה סוגי חוויות מותאמים לכל צורך'
              : 'Three types of experiences tailored to every need'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleScroll(service.scrollTo)}
              >
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((f) => (
                    <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  {language === 'he' ? 'פרטים נוספים' : 'Learn more'}
                  <Arrow className="h-4 w-4" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
