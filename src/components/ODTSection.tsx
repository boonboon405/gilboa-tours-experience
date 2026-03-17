import { Users, Target, Lightbulb, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import odtImage from '@/assets/odt-team.jpg';
import { openWhatsApp, whatsappTemplates } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const ODTSection = () => {
  const { language } = useLanguage();

  const benefits = language === 'he' ? [
    { icon: Users, text: 'שיתוף פעולה צוותי משופר' },
    { icon: Target, text: 'פיתוח מנהיגות' },
    { icon: Lightbulb, text: 'מיומנויות פתרון בעיות' },
    { icon: Heart, text: 'בניית אמון' },
  ] : [
    { icon: Users, text: 'Enhanced team collaboration' },
    { icon: Target, text: 'Leadership development' },
    { icon: Lightbulb, text: 'Problem-solving skills' },
    { icon: Heart, text: 'Trust building' },
  ];

  return (
    <section id="odt" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <div>
            <img
              src={odtImage}
              alt={language === 'he' ? 'פעילות גיבוש ODT בטבע' : 'ODT team building activity in nature'}
              className="rounded-2xl w-full h-[400px] object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'he' ? 'גיבוש ODT לארגונים' : 'ODT Team Building'}
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {language === 'he'
                ? 'תוכניות פיתוח ארגוני בחוץ המשלבות אתגרים, עבודת צוות ומנהיגות בלב הטבע. מתאים לקבוצות של 10-200 משתתפים.'
                : 'Outdoor development programs combining challenges, teamwork, and leadership in nature. Suitable for groups of 10-200 participants.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{b.text}</span>
                  </div>
                );
              })}
            </div>

            <Button
              variant="whatsapp"
              size="lg"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.general, 'odt-section')}
            >
              <MessageCircle className="h-5 w-5" />
              {language === 'he' ? 'דברו איתנו על ODT' : 'Talk to us about ODT'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
