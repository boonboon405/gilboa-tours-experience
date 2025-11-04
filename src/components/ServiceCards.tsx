import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, Briefcase, CheckCircle2, ArrowLeft } from "lucide-react";

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
}

const services: Service[] = [
  {
    id: "daily",
    icon: Calendar,
    title: "סיורים יומיים",
    shortDesc: "חוויות מודרכות באזור הגלבוע ועמק בית שאן",
    longDesc: "יום מלא בחוויות היסטוריות וטבעיות מרהיבות. מתאים למשפחות, קבוצות חברים, וצוותי עבודה.",
    features: [
      "בחירה מ-3 חבילות סיור מותאמות",
      "מדריך מקצועי ומנוסה",
      "התאמה אישית למשפחות וקבוצות",
      "אתרים היסטוריים ותצפיות נוף מדהימות",
      "ביקור במעיינות טבעיים",
      "ארוחה כלולה באזור"
    ],
    highlights: [
      "משך הסיור: 6-8 שעות",
      "מתאים לגילאי 8-88+",
      "כולל מדריך לא כולל הסעות"
    ],
    cta: "בחר את הסיור שלך",
    scrollTo: "choose-your-day"
  },
  {
    id: "vip",
    icon: Users,
    title: "סיורי VIP",
    shortDesc: "חוויה פרימיום מותאמת אישית עם שירות יוקרתי",
    longDesc: "סיור אקסקלוסיבי ומותאם באופן מלא לרצונותיכם. שירות אישי, רכבי יוקרה, וחוויות קולינריות ברמה הגבוהה ביותר.",
    features: [
      "מסלול מותאם אישית 100%",
      "רכבי יוקרה פרטיים עם נהג",
      "חוויות קולינריות בוטיק ייחודיות",
      "מדריך פרטי צמוד לאורך כל הסיור",
      "גישה לאתרים ייחודיים וסגורים",
      "שירות קונסיירז' מלא"
    ],
    highlights: [
      "עד 8 משתתפים",
      "תיאום מלא לפי לוח הזמנים שלכם",
      "אפשרות לשילוב לינה"
    ],
    cta: "תכנן סיור VIP",
    scrollTo: "vip-tours"
  },
  {
    id: "odt",
    icon: Briefcase,
    title: "ODT לארגונים",
    shortDesc: "פיתוח ארגוני בחוץ - גיבוש וצוות לחברות",
    longDesc: "תוכנית ODT מקצועית המשלבת אתגרים, פעילויות גיבוש, וחוויות בטבע. מתאים לחברות בכל הגדלים.",
    features: [
      "תכנון אירוע מותאם לצרכי הארגון",
      "פעילויות גיבוש מקצועיות ומנחים מוסמכים",
      "מתאים לקבוצות 10-200 משתתפים",
      "שילוב בין פעילות גופנית לתוכן ערכי",
      "דגש על עבודת צוות ומנהיגות",
      "אפשרות לשילוב הרצאות וסדנאות"
    ],
    highlights: [
      "משך האירוע: חצי יום עד יומיים",
      "כולל ציוד מקצועי",
      "צוות מדריכים וצוות תמיכה"
    ],
    cta: "צור קשר לתכנון",
    scrollTo: "odt-section"
  }
];

export const ServiceCards = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleCTA = (service: Service) => {
    setSelectedService(null);
    if (service.scrollTo) {
      setTimeout(() => {
        document.getElementById(service.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            השירותים שלנו
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            בחר את החוויה המושלמת עבורך - סיורים יומיים, חוויות VIP, או אירועי גיבוש לארגונים
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card 
                key={service.id}
                className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
                onClick={() => setSelectedService(service)}
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
                    לחץ לפרטים מלאים
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
                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-right">מה כולל?</h3>
                  <div className="grid gap-3">
                    {selectedService.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-right">
                        <span className="text-muted-foreground flex-1">{feature}</span>
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-right">נקודות מרכזיות</h3>
                  <div className="space-y-2">
                    {selectedService.highlights.map((highlight, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground text-right">
                        • {highlight}
                      </p>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => handleCTA(selectedService)}
                >
                  {selectedService.cta}
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
