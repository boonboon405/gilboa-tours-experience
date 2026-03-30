import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Lightbulb, Heart, MessageCircle, Eye } from 'lucide-react';
import odtImage from '@/assets/odt-team.jpg';
import { ODTTypesDialog } from './ODTTypesDialog';
import { useLanguage } from '@/contexts/LanguageContext';

export const ODTSection = () => {
  const whatsappNumber = '972537314235';
  const [showODTTypes, setShowODTTypes] = useState(false);
  const { language } = useLanguage();

  const benefits = [
    { icon: Users, text: language === 'he' ? 'שיתוף פעולה צוותי משופר' : 'Enhanced team collaboration' },
    { icon: Target, text: language === 'he' ? 'פיתוח מנהיגות' : 'Leadership development' },
    { icon: Lightbulb, text: language === 'he' ? 'מיומנויות פתרון בעיות' : 'Problem-solving skills' },
    { icon: Heart, text: language === 'he' ? 'בניית אמון' : 'Trust building' },
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
              alt={language === 'he' ? 'צוות עובדים בפעילות גיבוש ODT בטבע בהרי הגלבוע' : 'Team participating in outdoor ODT team-building activity in the Gilboa mountains'}
              className="relative rounded-2xl shadow-strong w-full h-[500px] object-cover"
            />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card className="border-2 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setShowODTTypes(true)}>
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center justify-between">
                  {language === 'he' ? 'מהו ODT?' : 'What is ODT?'}
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    {language === 'he' ? 'לחץ כאן' : 'Click here'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-[1.7]">
                  {language === 'he'
                    ? 'אימון פיתוח חוץ משתמש באתגרים מבוססי טבע כדי לחזק עבודת צוות, מנהיגות ומיומנויות תקשורת.'
                    : 'Outdoor Development Training uses nature-based challenges to strengthen teamwork, leadership, and communication skills.'}
                </p>
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-primary text-center">
                    {language === 'he'
                      ? 'לחץ כדי לראות 15 סוגי פעילויות ODT עם תמונות ריאליסטיות'
                      : 'Click to see 15 types of ODT activities with realistic images'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">
                {language === 'he' ? 'יתרונות ODT' : 'ODT Benefits'}
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
              {language === 'he' ? 'וואטסאפ' : 'WhatsApp'}
            </Button>
          </div>
        </div>
      </div>
      
      <ODTTypesDialog open={showODTTypes} onOpenChange={setShowODTTypes} />
    </section>
  );
};
