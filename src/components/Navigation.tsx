import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'he' : 'en');
  };

  const navItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.activities', href: '#activities' },
    { key: 'nav.odt', href: '#odt' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-sm shadow-soft z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              DavidTours
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
              >
                {t(item.key)}
              </a>
            ))}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="ml-4"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
              <span className="ml-2 text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t(item.key)}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
