import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, Briefcase, CheckCircle2, ArrowLeft } from "lucide-react";
import { useParallax } from '@/hooks/use-parallax';
import { use3DTilt } from '@/hooks/use-3d-tilt';
import { getClickableProps } from '@/hooks/use-keyboard-nav';
import { useLanguage } from '@/contexts/LanguageContext';

export const ServiceCards = () => {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const parallaxSlow = useParallax(0.15);
  const parallaxMedium = useParallax(0.25);

  const services = [
    {
      id: "daily",
      icon: Calendar,
      titleKey: 'services.dailyTitle',
      shortDescKey: 'services.dailyShort',
      longDescKey: 'services.dailyLong',
      featureKeys: ['services.dailyFeature1', 'services.dailyFeature2', 'services.dailyFeature3', 'services.dailyFeature4', 'services.dailyFeature5', 'services.dailyFeature6'],
      highlightKeys: ['services.dailyHighlight1', 'services.dailyHighlight2', 'services.dailyHighlight3'],
      ctaKey: 'services.dailyCTA',
      scrollTo: "choose-your-day"
    },
    {
      id: "vip",
      icon: Users,
      titleKey: 'services.vipTitle',
      shortDescKey: 'services.vipShort',
      longDescKey: 'services.vipLong',
      featureKeys: ['services.vipFeature1', 'services.vipFeature2', 'services.vipFeature3', 'services.vipFeature4', 'services.vipFeature5', 'services.vipFeature6'],
      highlightKeys: ['services.vipHighlight1', 'services.vipHighlight2', 'services.vipHighlight3'],
      ctaKey: 'services.vipCTA',
      scrollTo: "vip-tours"
    },
    {
      id: "odt",
      icon: Briefcase,
      titleKey: 'services.odtTitle',
      shortDescKey: 'services.odtShort',
      longDescKey: 'services.odtLong',
      featureKeys: ['services.odtFeature1', 'services.odtFeature2', 'services.odtFeature3', 'services.odtFeature4', 'services.odtFeature5', 'services.odtFeature6'],
      highlightKeys: ['services.odtHighlight1', 'services.odtHighlight2', 'services.odtHighlight3'],
      ctaKey: 'services.odtCTA',
      scrollTo: "odt-section"
    }
  ];

  const handleCTA = (service: any) => {
    setSelectedService(null);
    if (service.scrollTo) {
      setTimeout(() => {
        document.getElementById(service.scrollTo!)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[90px]" style={parallaxSlow} />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[110px]" style={parallaxMedium} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                aria-label={`${t(service.titleKey)} - ${t(service.shortDescKey)}`}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-6 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{t(service.titleKey)}</CardTitle>
                  <CardDescription className="text-base">
                    {t(service.shortDescKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {t('services.clickDetails')}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

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
                    <DialogTitle className="text-2xl">{t(selectedService.titleKey)}</DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-right pt-2">
                  {t(selectedService.longDescKey)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-right">{t('services.whatIncluded')}</h3>
                  <div className="grid gap-3">
                    {selectedService.featureKeys.map((key: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 text-right">
                        <span className="text-muted-foreground flex-1">{t(key)}</span>
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3 text-right">{t('services.keyPoints')}</h3>
                  <div className="space-y-2">
                    {selectedService.highlightKeys.map((key: string, idx: number) => (
                      <p key={idx} className="text-sm text-muted-foreground text-right">
                        • {t(key)}
                      </p>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => handleCTA(selectedService)}
                >
                  {t(selectedService.ctaKey)}
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
