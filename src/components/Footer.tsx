import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();
  const email = 'davidisraeltours@gmail.com';
  const phoneNumber = '0537314235';

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t('footer.brandName')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              {t('footer.contact')}
            </h4>
            <div className="space-y-2">
              <a
                href={`tel:${phoneNumber}`}
                onClick={() => trackPhoneCall(phoneNumber, 'footer')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <Link to="/booking" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.bookTour')}
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.accessibilityStatement')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
