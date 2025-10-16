import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Target, Lightbulb, Heart, MessageCircle, Eye } from 'lucide-react';
import odtImage from '@/assets/odt-team.jpg';
import { ODTTypesDialog } from './ODTTypesDialog';

export const ODTSection = () => {
  const whatsappNumber = '972537314235';
  const [showODTTypes, setShowODTTypes] = useState(false);

  const benefits = [
    { icon: Users, text: 'שיתוף פעולה צוותי משופר' },
    { icon: Target, text: 'פיתוח מנהיגות' },
    { icon: Lightbulb, text: 'מיומנויות פתרון בעיות' },
    { icon: Heart, text: 'בניית אמון' },
  ];

  return (
    <section id="odt" className="py-20 bg-background">
      <div className="container mx-auto px-4">
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
            <Card className="border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setShowODTTypes(true)}>
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center justify-between">
                  מהו ODT?
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    לחץ כאן
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  אימון פיתוח חוץ משתמש באתגרים מבוססי טבע כדי לחזק עבודת צוות, מנהיגות ומיומנויות תקשורת.
                </p>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary text-center">
                    לחץ כדי לראות 15 סוגי פעילויות ODT עם תמונות ריאליסטיות
                  </p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                ODT יתרונות
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                    >
                      <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {benefit.text}
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
              <MessageCircle className="ml-2 h-5 w-5" />
              וואטסאפ
            </Button>
          </div>
        </div>
      </div>
      
      <ODTTypesDialog open={showODTTypes} onOpenChange={setShowODTTypes} />
    </section>
  );
};
