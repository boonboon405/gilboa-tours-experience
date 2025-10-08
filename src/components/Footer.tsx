import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const email = 'info@davidtours.com';
  const phoneNumber = '053-7314235';

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
              DavidTours
            </h3>
            <p className="text-muted-foreground">
              {t('hero.description')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{phoneNumber}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-4">
              {t('nav.activities')}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#activities" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('activities.history.title')}
                </a>
              </li>
              <li>
                <a href="#odt" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('odt.title')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('contact.title')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
