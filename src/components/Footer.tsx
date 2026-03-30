import { Mail, Phone } from 'lucide-react';
import { trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const email = 'davidisraeltours@gmail.com';
  const phoneNumber = '0537314235';

  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              {isHe ? 'דויד טורס' : 'David Tours'}
            </h3>
            <p className="text-muted-foreground">
              {isHe
                ? 'סיורי טבע ונוף, ימי גיבוש, וחוויות VIP פרטיות בהרי הגלבוע, עמק המעיינות והגליל'
                : 'Nature and landscape tours, team-building days, and private VIP experiences in the Gilboa mountains, Springs Valley, and the Galilee'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {isHe ? 'צור קשר' : 'Contact Us'}
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                onClick={() => trackPhoneCall(phoneNumber, 'footer')}
                className="flex items-center space-x-2 space-x-reverse text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-2 space-x-reverse text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {isHe ? 'קישורים מהירים' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#choose-your-day" className="text-muted-foreground hover:text-primary transition-colors">
                  {isHe ? 'בחרו את יום החוויה שלכם' : 'Choose Your Experience Day'}
                </a>
              </li>
              <li>
                <a href="#vip-tours" className="text-muted-foreground hover:text-primary transition-colors">
                  {isHe ? 'סיורי VIP' : 'VIP Tours'}
                </a>
              </li>
              <li>
                <a href="#odt" className="text-muted-foreground hover:text-primary transition-colors">
                  {isHe ? 'פעילויות גיבוש ODT' : 'ODT Team-Building Activities'}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {isHe ? 'צור קשר' : 'Contact Us'}
                </a>
              </li>
              <li>
                <a href="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">
                  {isHe ? 'הצהרת נגישות' : 'Accessibility Statement'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>{isHe ? '© 2025 דויד טורס. כל הזכויות שמורות.' : '© 2025 David Tours. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  );
};
