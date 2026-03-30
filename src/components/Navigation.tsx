import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sparkles, LogOut, Shield, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { QuizResults } from '@/utils/quizScoring';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MegaMenu } from '@/components/MegaMenu';
import { LanguageSelector } from '@/components/LanguageSelector';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchQuizCount = async () => {
      const { count } = await supabase
        .from('quiz_results')
        .select('*', { count: 'exact', head: true });
      if (count !== null) setQuizCount(count);
    };
    fetchQuizCount();
  }, []);

  // Scroll detection for enhanced sticky effect and progress bar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const progress = (scrollTop / maxScroll) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const sections = ['home', 'choose-your-day', 'vip-tours', 'odt-section', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Smooth scroll handler with enhanced animation
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar
      
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      
      setIsOpen(false); // Close mobile menu after click
      
      // Add a pulse animation to the target section
      element.classList.add('animate-pulse-once');
      setTimeout(() => {
        element.classList.remove('animate-pulse-once');
      }, 1000);
      
      // Set focus to the target element for screen readers
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
  };

  // Keyboard handler for navigation items
  const handleNavKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleNavClick(e, href);
    }
  };

  const handleQuizComplete = (results: QuizResults) => {
    console.log('Quiz completed with results:', results);
    setQuizCount(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = language === 'he' ? [
    { label: 'בית', href: '#home' },
    { label: 'יום כייף וגיבוש לחברות', href: '#choose-your-day' },
    { label: 'טיולי VIP לאורחי חברות מחו״ל', href: '#vip-tours' },
    { label: 'גיבוש ODT', href: '#odt-section' },
    { label: 'צור קשר', href: '#contact' },
    { label: 'הצהרת נגישות', href: '/accessibility', isLink: true },
  ] : [
    { label: 'Home', href: '#home' },
    { label: 'Fun Day for Companies', href: '#choose-your-day' },
    { label: 'VIP Tours for Guests', href: '#vip-tours' },
    { label: 'ODT Team Building', href: '#odt-section' },
    { label: 'Contact', href: '#contact' },
    { label: 'Accessibility', href: '/accessibility', isLink: true },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-card/98 backdrop-blur-md shadow-lg border-border' 
          : 'bg-card/95 backdrop-blur-sm shadow-soft border-border/50'
      }`}
      role="navigation"
      aria-label="תפריט ראשי"
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-muted/30" aria-hidden="true">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out shadow-glow"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              {language === 'he' ? 'דויד טורס' : 'DavidTours'}
            </span>
          </div>

          {/* Desktop Navigation with Mega Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setShowQuiz(true)}
              className="relative px-4 py-2.5 rounded-lg bg-gradient-hero text-white font-medium whitespace-nowrap flex items-center gap-2 hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-glow group"
            >
              <div className="relative">
                <Sparkles className="h-4 w-4 animate-pulse-slow group-hover:rotate-12 transition-transform duration-300" />
                {quizCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-3 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse bg-white text-primary font-bold border-2 border-primary"
                  >
                    {quizCount}
                  </Badge>
                )}
              </div>
              Quiz
            </button>
            
            <MegaMenu activeSection={activeSection} onNavClick={handleNavClick} />
            
            <Link 
              to="/accessibility"
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              title={language === 'he' ? 'הצהרת נגישות' : 'Accessibility Statement'}
            >
              <Accessibility className="h-4 w-4" />
              <span className="sr-only lg:not-sr-only">{language === 'he' ? 'נגישות' : 'Accessibility'}</span>
            </Link>
            
            <LanguageSelector />
            
            <Link to="/booking">
              <Button 
                variant="default" 
                className="gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <Calendar className="h-4 w-4" />
                {language === 'he' ? 'הזמן סיור' : 'Book Tour'}
              </Button>
            </Link>
            
            {/* Auth Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" title={language === 'he' ? 'תפריט חשבון' : 'Account menu'}>
                    <Shield className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{language === 'he' ? 'חשבון שלי' : 'My Account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="ml-2 h-4 w-4" />
                        לוח בקרה
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin/knowledge')}>
                        <Shield className="ml-2 h-4 w-4" />
                        מאגר ידע
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/keywords')}>
                        <Shield className="ml-2 h-4 w-4" />
                        מילות מפתח
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/chat')}>
                        <Shield className="ml-2 h-4 w-4" />
                        צ'אט מנהל
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/leads')}>
                        <Shield className="ml-2 h-4 w-4" />
                        ניהול לידים
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/admin/ai-responses')}>
                        <Shield className="ml-2 h-4 w-4" />
                        עריכת תגובות AI
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/ai-settings')}>
                        <Shield className="ml-2 h-4 w-4" />
                        הגדרות AI (טקסטים)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className={`${language === 'he' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {language === 'he' ? 'התנתק' : 'Sign Out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  {language === 'he' ? 'כניסת מנהלים' : 'Admin Login'}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? (language === 'he' ? 'סגור תפריט' : 'Close menu') : (language === 'he' ? 'פתח תפריט' : 'Open menu')}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden pb-4 animate-in fade-in slide-in-from-top-2 duration-300"
            role="menu"
          >
            <button
              onClick={() => {
                setShowQuiz(true);
                setIsOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-hero text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-glow relative"
            >
              <div className="relative">
                <Sparkles className="h-4 w-4 animate-pulse-slow" />
                {quizCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-3 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse bg-white text-primary font-bold border-2 border-primary"
                  >
                    {quizCount}
                  </Badge>
                )}
              </div>
              Quiz
            </button>
            <div className="mt-2 space-y-1" role="menuitem">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.replace('#', '');
                
                if ((item as any).isLink) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 py-3 px-4 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Accessibility className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                }
                
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    onKeyDown={(e) => handleNavKeyDown(e, item.href)}
                    className={`block py-3 px-4 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActive ? 'text-primary font-semibold bg-primary/10 border-l-4 border-primary shadow-sm' : ''
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 gap-2">
              <Link to="/booking" className="flex-1">
                <Button variant="default" className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  {language === 'he' ? 'הזמן סיור' : 'Book Tour'}
                </Button>
              </Link>
              <LanguageSelector />
            </div>
            
            {/* Mobile Auth */}
            {user ? (
              <>
                {isAdmin && (
                  <div className="mt-2 space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full gap-2"
                      onClick={() => {
                        navigate('/admin');
                        setIsOpen(false);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                      {language === 'he' ? 'לוח בקרה' : 'Dashboard'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={() => {
                        navigate('/admin/knowledge');
                        setIsOpen(false);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                      {language === 'he' ? 'מאגר ידע' : 'Knowledge Base'}
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full mt-2 gap-2"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  {language === 'he' ? 'התנתק' : 'Sign Out'}
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2 gap-2">
                  <Shield className="h-4 w-4" />
                  {language === 'he' ? 'כניסת מנהלים' : 'Admin Login'}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      <TeamDNAQuiz
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    </nav>
  );
};
