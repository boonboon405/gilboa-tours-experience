import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, Briefcase, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useParallax } from '@/hooks/use-parallax';
import { use3DTilt } from '@/hooks/use-3d-tilt';
import { getClickableProps } from '@/hooks/use-keyboard-nav';
import { useLanguage } from '@/contexts/LanguageContext';

interface Service {
  id: string;
  icon: typeof Calendar;
  title: string;
  shortDesc: string;
  longDesc: string;
  features: string[];
  highlights: string[];
  cta: string;
  scrollTo?: string;
  badge?: { he: string; en: string };
}

const getServices = (language: string): Service[] => [
  {
    id: "daily",
    icon: Calendar,
    title: language === 'he' ? "סיורים יומיים" : "Daily Tours",
    shortDesc: language === 'he'
      ? "סיורי טבע ונוף מודרכים בהרי הגלבוע, עמק המעיינות והגליל"
      : "Guided nature and landscape tours in the Gilboa mountains, Springs Valley, and the Galilee",
    longDesc: language === 'he'
      ? "יום שלם של הליכה בנופים מרהיבים, מעיינות טבעיים, ואתרים היסטוריים. מתאים למשפחות, קבוצות חברים וצוותי עבודה."
      : "A full day of stunning landscapes, natural springs, and historical sites. Suitable for families, friend groups, and work teams.",
    features: language === 'he' ? [
      "בחירה מ-3 חבילות סיור מותאמות",
      "מדריך מקצועי ומנוסה",
      "התאמה אישית למשפחות וקבוצות",
      "אתרים היסטוריים ותצפיות נוף מדהימות",
      "ביקור במעיינות צלולים",
      "ארוחה כלולה באזור"
    ] : [
      "Choose from 3 tailored tour packages",
      "Professional, experienced guide",
      "Personalized for families and groups",
      "Historical sites and breathtaking viewpoints",
      "Visit crystal-clear natural springs",
      "Meal included in the area"
    ],
    highlights: language === 'he' ? [
      "משך הסיור: 7–8 שעות",
      "מתאים לגילאי 8–88+",
      "כולל מדריך, לא כולל הסעות"
    ] : [
      "Tour duration: 7–8 hours",
      "Suitable for ages 8–88+",
      "Includes guide, excludes transportation"
    ],
    cta: language === 'he' ? "בחרו את הסיור שלכם" : "Choose Your Tour",
    scrollTo: "choose-your-day"
  },
  {
    id: "vip",
    icon: Users,
    title: language === 'he' ? "סיורי VIP" : "VIP Tours",
    shortDesc: language === 'he'
      ? "חוויה פרטית ומותאמת אישית בנופי הגלבוע והגליל"
      : "Private, personalized experience in the Gilboa and Galilee landscapes",
    longDesc: language === 'he'
      ? "סיור אקסקלוסיבי ומותאם באופן מלא לרצונותיכם. שירות אישי, רכבי יוקרה, וחוויות קולינריות ברמה הגבוהה ביותר."
      : "An exclusive, fully personalized tour. Private service, luxury vehicles, and premium culinary experiences.",
    features: language === 'he' ? [
      "מסלול מותאם אישית 100%",
      "רכבי יוקרה פרטיים עם נהג",
      "חוויות קולינריות בוטיק ייחודיות",
      "מדריך פרטי צמוד לאורך כל הסיור",
      "גישה לאתרים ייחודיים",
      "שירות קונסיירז׳ מלא"
    ] : [
      "100% custom itinerary",
      "Private luxury vehicles with driver",
      "Unique boutique culinary experiences",
      "Dedicated private guide throughout",
      "Access to exclusive sites",
      "Full concierge service"
    ],
    highlights: language === 'he' ? [
      "1–45 משתתפים",
      "תיאום מלא לפי לוח הזמנים שלכם",
      "אפשרות לשילוב לינה"
    ] : [
      "1–45 participants",
      "Fully coordinated to your schedule",
      "Option to include accommodation"
    ],
    cta: language === 'he' ? "תכננו סיור VIP" : "Plan a VIP Tour",
    scrollTo: "vip-tours"
  },
  {
    id: "odt",
    icon: Briefcase,
    title: language === 'he' ? "ODT לארגונים" : "ODT for Organizations",
    shortDesc: language === 'he'
      ? "ימי גיבוש וצוות בטבע הפתוח — הרי הגלבוע ועמק המעיינות"
      : "Team-building days in the open — Gilboa mountains and Springs Valley",
    longDesc: language === 'he'
      ? "תוכנית גיבוש מקצועית בטבע המשלבת אתגרים, עבודת צוות, ופעילויות בנופי הגלבוע ועמק המעיינות. מתאים לחברות בכל הגדלים."
      : "Professional outdoor team-building combining challenges, teamwork, and activities in the Gilboa and Springs Valley landscapes. Suitable for companies of all sizes.",
    features: language === 'he' ? [
      "תכנון אירוע מותאם לצרכי הארגון",
      "פעילויות גיבוש מקצועיות ומנחים מוסמכים",
      "מתאים לקבוצות 10–200 משתתפים",
      "שילוב בין פעילות גופנית לתוכן ערכי",
      "דגש על עבודת צוות ומנהיגות",
      "אפשרות לשילוב הרצאות וסדנאות"
    ] : [
      "Event planning tailored to your organization",
      "Professional team-building with certified facilitators",
      "Suitable for groups of 10–200 participants",
      "Combines physical activity with meaningful content",
      "Focus on teamwork and leadership",
      "Option to include lectures and workshops"
    ],
    highlights: language === 'he' ? [
      "משך האירוע: חצי יום עד יומיים",
      "כולל ציוד מקצועי",
      "צוות מדריכים וצוות תמיכה"
    ] : [
      "Event duration: half day to 2 days",
      "Includes professional equipment",
      "Full guide and support team"
    ],
    cta: language === 'he' ? "צרו קשר לתכנון" : "Contact Us to Plan",
    scrollTo: "odt-section"
  }
];

export const ServiceCards = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const services = getServices(language);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);

  const handleCTA = (service: Service) => {
    setSelectedService(null);
    if (service.scrollTo) {
      setTimeout(() => {
        document.getElementById(service.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const ArrowIcon = isHe ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[90px]"
          style={parallaxSlow}
        />
        <div 
          className="absolute bottom-40 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[110px]"
          style={parallaxMedium}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">
            {isHe ? 'השירותים שלנו' : 'Our Services'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-[1.7]">
            {isHe
              ? 'סיורי טבע ונוף מודרכים, ימי גיבוש לארגונים, וחוויות VIP פרטיות — בהרי הגלבוע, עמק המעיינות והגליל'
              : 'Guided nature and landscape tours, corporate team-building days, and private VIP experiences — in the Gilboa mountains, Springs Valley, and the Galilee'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            const tilt = use3DTilt({ maxTilt: 10, scale: 1.03, speed: 500 });
            
              return (
                <Card 
                  key={service.id}
                  ref={tilt.ref}
                  className="relative hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm overflow-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  style={tilt.style}
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  {...getClickableProps(() => setSelectedService(service))}
                  aria-label={`${service.title} — ${service.shortDesc}`}
                >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-6 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.shortDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    variant="outline"
                  >
                    {isHe ? 'לחצו לפרטים מלאים' : 'Click for Full Details'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <selectedService.icon className="h-8 w-8" />
                  </div>
                  <div className="text-right flex-1">
                    <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-right pt-2">
                  {selectedService.longDesc}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-right">{isHe ? 'מה כולל?' : "What's Included?"}</h3>
                  <div className="grid gap-3">
                    {selectedService.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-right">
                        <span className="text-muted-foreground flex-1">{feature}</span>
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-right">{isHe ? 'נקודות מרכזיות' : 'Key Highlights'}</h3>
                  <div className="space-y-2">
                    {selectedService.highlights.map((highlight, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground text-right">
                        • {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => handleCTA(selectedService)}
                >
                  {selectedService.cta}
                  <ArrowIcon className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
