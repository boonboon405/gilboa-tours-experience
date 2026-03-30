import { Card, CardContent } from '@/components/ui/card';
import { Award, Settings, Shield, Truck } from 'lucide-react';
import { useParallax } from '@/hooks/use-parallax';
import { use3DTilt } from '@/hooks/use-3d-tilt';

export const WhyChooseUs = () => {
  const parallaxSlow = useParallax(0.1);
  const parallaxFast = useParallax(0.2);

  const reasons = [
    {
      icon: Award,
      title: 'מקצועי ומוסמך',
      desc: 'מדריך טיולים מורשה עם שנות ניסיון',
    },
    {
      icon: Settings,
      title: 'חוויות מותאמות אישית',
      desc: 'מעוצב במיוחד לקבוצות עסקיות, חברות הי טק, ועדי עובדים וחברות מקצועיות',
    },
    {
      icon: Shield,
      title: 'בטוח ומרענן',
      desc: 'מושלם לקיץ הישראלי החם',
    },
    {
      icon: Truck,
      title: 'שירות מלא',
      desc: 'כל הלוגיסטיקה מטופלת מתחילה ועד סוף',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
      {/* Background decorative elements with parallax */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"
          style={parallaxSlow}
        />
        <div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"
          style={parallaxFast}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16">
          למה לבחור בדויד טורס?
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
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {reason.desc}
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
