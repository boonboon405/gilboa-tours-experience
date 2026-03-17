import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-gilboa.jpg';
import { openWhatsApp, whatsappTemplates } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const Hero = () => {
  const { language } = useLanguage();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt={language === 'he' ? 'נוף פנורמי של הרי הגלבוע' : 'Panoramic view of the Gilboa mountains'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70 mb-6 font-medium">
            {language === 'he' ? 'חוויות קבוצתיות בצפון ישראל' : 'Group Experiences in Northern Israel'}
          </p>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {language === 'he' 
              ? <>יום מושלם.<br />זיכרונות לכל החיים.</>
              : <>Perfect Day.<br />Lifetime Memories.</>
            }
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            {language === 'he'
              ? 'סיורים מודרכים, ימי גיבוש, וחוויות VIP באזור הגלבוע, עמק המעיינות והגליל.'
              : 'Guided tours, team-building days, and VIP experiences in the Gilboa, Springs Valley, and Galilee region.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              className="text-base px-10"
              onClick={() => openWhatsApp('972537314235', whatsappTemplates.general, 'hero')}
            >
              <MessageCircle className="h-5 w-5" />
              {language === 'he' ? 'דברו איתנו' : 'Talk to Us'}
            </Button>
            <Link to="/booking">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-10 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                {language === 'he' ? 'הזמינו סיור' : 'Book a Tour'}
              </Button>
            </Link>
          </div>

          <a
            href="tel:0537314235"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mt-8 text-sm transition-colors"
          >
            <Phone className="h-4 w-4" />
            0537314235
          </a>
        </div>
      </div>
    </section>
  );
};
