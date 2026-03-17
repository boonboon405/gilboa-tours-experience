import { useState, useEffect } from 'react';
import { Menu, X, Calendar, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/98 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label={language === 'he' ? 'תפריט ראשי' : 'Main menu'}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            {t('nav.brandName')}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <button onClick={() => scrollTo('home')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              {t('nav.home')}
            </button>
            <button onClick={() => scrollTo('contact')} className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              {t('nav.contact')}
            </button>
            <Link to="/accessibility" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
              {t('nav.accessibility')}
            </Link>

            <LanguageSelector />

            <Link to="/booking">
              <Button size="sm" className="gap-2">
                <Calendar className="h-4 w-4" />
                {t('nav.bookTour')}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title={t('nav.accountMenu')}>
                    <Shield className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('nav.myAccount')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        {t('nav.dashboard')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/knowledge')}>
                        {t('nav.knowledgeBase')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/chat')}>
                        {t('nav.adminChat')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/leads')}>
                        {t('nav.leadManagement')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className={`${language === 'he' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  {t('nav.adminLogin')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 space-y-2 animate-fade-in">
            <button onClick={() => scrollTo('home')} className="block w-full text-start py-2 px-4 rounded-lg hover:bg-muted transition-colors">
              {t('nav.home')}
            </button>
            <button onClick={() => scrollTo('contact')} className="block w-full text-start py-2 px-4 rounded-lg hover:bg-muted transition-colors">
              {t('nav.contact')}
            </button>
            <Link to="/accessibility" onClick={() => setIsOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted transition-colors">
              {t('nav.accessibility')}
            </Link>
            <Link to="/booking" onClick={() => setIsOpen(false)}>
              <Button className="w-full gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                {t('nav.bookTour')}
              </Button>
            </Link>
            {user ? (
              <div className="space-y-2 pt-2 border-t border-border">
                {isAdmin && (
                  <Button variant="outline" className="w-full" onClick={() => { navigate('/admin'); setIsOpen(false); }}>
                    {t('nav.dashboard')}
                  </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                  <LogOut className="h-4 w-4" />
                  {t('nav.signOut')}
                </Button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full mt-1">
                  {t('nav.adminLogin')}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
