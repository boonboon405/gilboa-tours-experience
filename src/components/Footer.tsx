import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">Simcha</h3>
            <p className="text-background/60 text-sm leading-relaxed">
              {language === 'he'
                ? 'חוויות קבוצתיות בלתי נשכחות בצפון ישראל. סיורים, גיבוש, והרבה שמחה.'
                : 'Unforgettable group experiences in Northern Israel. Tours, team building, and lots of joy.'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              {language === 'he' ? 'צור קשר' : 'Contact'}
            </h4>
            <div className="space-y-3">
              <a href="tel:0537314235" className="flex items-center gap-2 text-background/60 hover:text-background transition-colors text-sm">
                <Phone className="h-4 w-4" />
                0537314235
              </a>
              <a href="mailto:DavidIsraelTours@gmail.com" className="flex items-center gap-2 text-background/60 hover:text-background transition-colors text-sm">
                <Mail className="h-4 w-4" />
                DavidIsraelTours@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              {language === 'he' ? 'קישורים' : 'Links'}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="text-background/60 hover:text-background transition-colors">{language === 'he' ? 'השירותים שלנו' : 'Our Services'}</a></li>
              <li><a href="#contact" className="text-background/60 hover:text-background transition-colors">{language === 'he' ? 'צור קשר' : 'Contact'}</a></li>
              <li><Link to="/accessibility" className="text-background/60 hover:text-background transition-colors">{language === 'he' ? 'הצהרת נגישות' : 'Accessibility'}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-background/40 text-sm">
          <p>© {new Date().getFullYear()} Simcha. {language === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};
