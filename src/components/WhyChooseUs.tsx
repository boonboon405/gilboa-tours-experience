import { Card, CardContent } from '@/components/ui/card';
import { Award, Settings, Shield, Truck } from 'lucide-react';
import { useParallax } from '@/hooks/use-parallax';
import { use3DTilt } from '@/hooks/use-3d-tilt';
import { useLanguage } from '@/contexts/LanguageContext';

export const WhyChooseUs = () => {
  const { t } = useLanguage();
  const parallaxSlow = useParallax(0.1);
  const parallaxFast = useParallax(0.2);

  const reasons = [
    { icon: Award, titleKey: 'why.certified', descKey: 'why.certifiedDesc' },
    { icon: Settings, titleKey: 'why.custom', descKey: 'why.customDesc' },
    { icon: Shield, titleKey: 'why.safe', descKey: 'why.safeDesc' },
    { icon: Truck, titleKey: 'why.fullService', descKey: 'why.fullServiceDesc' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" style={parallaxSlow} />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]" style={parallaxFast} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
          {t('why.title')}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            const tilt = use3DTilt({ maxTilt: 8, scale: 1.02, speed: 400 });
            
            return (
              <Card
                key={index}
                ref={tilt.ref}
                className="group hover:shadow-strong transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden"
                style={tilt.style}
                onMouseMove={tilt.onMouseMove}
                onMouseLeave={tilt.onMouseLeave}
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
