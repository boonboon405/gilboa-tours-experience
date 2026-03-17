import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export const Navigation = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    if (isHomePage) {
      const el = document.getElementById(href.replace('#', ''));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/' + href);
    }
  };

  const navItems = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-card/95 backdrop-blur-sm border-b border-border shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary tracking-tight">Simcha</Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/chat"
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {language === 'he' ? 'צ׳אט AI' : 'AI Chat'}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-card text-foreground hover:bg-muted transition-colors"
            >
              {language === 'he' ? 'EN' : 'עב'}
            </button>
            <Link to="/booking">
              <Button size="sm">{t('nav.book')}</Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
              className="text-xs font-semibold px-3 py-1.5 rounded-md border border-border bg-card text-foreground"
            >
              {language === 'he' ? 'EN' : 'עב'}
            </button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/chat"
                className="block py-3 px-4 text-foreground hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {language === 'he' ? 'צ׳אט AI' : 'AI Chat'}
              </Link>
            </div>
            <div className="mt-4">
              <Link to="/booking">
                <Button className="w-full">{t('nav.book')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
