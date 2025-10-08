import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Target, Lightbulb, Heart, MessageCircle } from 'lucide-react';
import odtImage from '@/assets/odt-team.jpg';

export const ODTSection = () => {
  const { t } = useLanguage();
  const whatsappNumber = '972523456789'; // Replace with actual number

  const benefits = [
    { icon: Users, textKey: 'odt.benefit1' },
    { icon: Target, textKey: 'odt.benefit2' },
    { icon: Lightbulb, textKey: 'odt.benefit3' },
    { icon: Heart, textKey: 'odt.benefit4' },
  ];

  return (
    <section id="odt" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 text-lg px-4 py-2 bg-gradient-accent">
            ODT
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('odt.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('odt.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-hero rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <img
              src={odtImage}
              alt="ODT Team Building"
              className="relative rounded-2xl shadow-strong w-full h-[500px] object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  {t('odt.what')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('odt.what.desc')}
                </p>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {t('odt.benefits')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {t(benefit.textKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              className="w-full text-lg"
              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.whatsapp')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
