import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-foreground text-primary-foreground/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="text-xl font-bold text-primary-foreground">Simcha</Link>
          <div className="flex items-center gap-6 text-sm">
            <a href="#home" className="hover:text-primary-foreground transition-colors">{t('footer.home')}</a>
            <a href="#services" className="hover:text-primary-foreground transition-colors">{t('footer.services')}</a>
            <a href="#faq" className="hover:text-primary-foreground transition-colors">{t('footer.faq')}</a>
            <a href="#contact" className="hover:text-primary-foreground transition-colors">{t('footer.contact')}</a>
          </div>
          <p className="text-xs text-primary-foreground/50">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
