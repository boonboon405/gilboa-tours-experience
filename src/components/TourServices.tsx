import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Briefcase, CheckCircle2 } from "lucide-react";

export const TourServices = () => {
  const isHebrew = true; // Default to Hebrew

  const services = {
    daily: {
      icon: Calendar,
      title: isHebrew ? "סיורים יומיים" : "Daily Tours",
      description: isHebrew 
        ? "חוויות מודרכות מותאמות אישית באזור הגלבוע ועמק בית שאן"
        : "Personalized guided experiences in Gilboa and Beit Shean Valley",
      features: [
        isHebrew ? "בחירה מ-3 חבילות סיור" : "Choose from 3 tour packages",
        isHebrew ? "מדריכים מקצועיים" : "Professional guides",
        isHebrew ? "התאמה אישית למשפחות וקבוצות" : "Customized for families & groups",
        isHebrew ? "אתרים היסטוריים ותצפיות נוף" : "Historical sites & viewpoints"
      ],
      cta: isHebrew ? "בחר את הסיור שלך" : "Choose Your Tour"
    },
    vip: {
      icon: Users,
      title: isHebrew ? "סיורי VIP" : "VIP Tours",
      description: isHebrew
        ? "חוויה פרימיום מותאמת אישית עם שירות יוקרתי"
        : "Premium personalized experience with luxury service",
      features: [
        isHebrew ? "מסלולים מותאמים אישית" : "Fully customized itineraries",
        isHebrew ? "רכבי יוקרה פרטיים" : "Private luxury vehicles",
        isHebrew ? "חוויות קולינריות בוטיק" : "Boutique culinary experiences",
        isHebrew ? "מדריך צמוד לאורך הסיור" : "Dedicated guide throughout"
      ],
      cta: isHebrew ? "תכנן סיור VIP" : "Plan VIP Tour"
    },
    odt: {
      icon: Briefcase,
      title: isHebrew ? "ODT לארגונים" : "Corporate ODT",
      description: isHebrew
        ? "פיתוח ארגוני בחוץ - חוויות גיבוש וצוות לחברות"
        : "Outdoor Development Training - team building for companies",
      features: [
        isHebrew ? "תכנון אירועים מותאם" : "Customized event planning",
        isHebrew ? "פעילויות גיבוש מקצועיות" : "Professional team activities",
        isHebrew ? "מתאים לקבוצות 10-200 משתתפים" : "Suitable for 10-200 participants",
        isHebrew ? "שילוב בין פעילות ותוכן" : "Activity & content integration"
      ],
      cta: isHebrew ? "צור קשר לתכנון" : "Contact for Planning"
    }
  };

  const handleCTA = (type: 'daily' | 'vip' | 'odt') => {
    if (type === 'daily') {
      document.getElementById('choose-your-day')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'vip') {
      document.getElementById('vip-tours')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('odt-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isHebrew ? "השירותים שלנו" : "Our Services"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isHebrew 
              ? "בחר את החוויה המושלמת עבורך - סיורים יומיים, חוויות VIP, או אירועי ODT לארגונים"
              : "Choose the perfect experience for you - daily tours, VIP experiences, or corporate ODT events"}
          </p>
        </div>

        <Tabs defaultValue="daily" className="w-full" dir={isHebrew ? 'rtl' : 'ltr'}>
          <TabsList className="grid w-full grid-cols-3 max-w-3xl mx-auto mb-8">
            <TabsTrigger value="daily" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">{services.daily.title}</span>
              <span className="sm:hidden">{isHebrew ? "יומי" : "Daily"}</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{services.vip.title}</span>
              <span className="sm:hidden">VIP</span>
            </TabsTrigger>
            <TabsTrigger value="odt" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">{services.odt.title}</span>
              <span className="sm:hidden">ODT</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(services).map(([key, service]) => {
            const Icon = service.icon;
            return (
              <TabsContent key={key} value={key} className="mt-8">
                <Card className="max-w-4xl mx-auto">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">{service.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="lg" 
                        onClick={() => handleCTA(key as 'daily' | 'vip' | 'odt')}
                        className="w-full sm:w-auto"
                      >
                        {service.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};
