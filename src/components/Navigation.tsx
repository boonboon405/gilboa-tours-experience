import { useState, useEffect } from 'react';
import { Menu, Compass, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { QuizResults } from '@/utils/quizScoring';
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
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
  { en: 'Home', he: 'בית', target: '#home', sectionId: 'home' },
  { en: 'Tours', he: 'סיורים', target: '#choose-your-day', sectionId: 'choose-your-day' },
  { en: 'Team Building', he: 'גיבוש', target: '#odt-section', sectionId: 'odt-section' },
  { en: 'VIP', he: 'VIP', target: '#vip-tours', sectionId: 'vip-tours' },
  { en: 'About', he: 'אודות', target: '#about', sectionId: 'about' },
  { en: 'Contact', he: 'צור קשר', target: '#contact', sectionId: 'contact' },
];

export const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    const sectionIds = navLinks.filter(l => l.sectionId).map(l => l.sectionId!);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      setDrawerOpen(false);
      element.classList.add('animate-pulse-once');
      setTimeout(() => element.classList.remove('animate-pulse-once'), 1000);
      element.setAttribute('tabindex', '-1');
      element.focus();
    }
  };

  const handleQuizComplete = (results: QuizResults) => {
    console.log('Quiz completed:', results);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const logoColor = isScrolled ? 'text-primary' : 'text-gold-nav';
  const linkColor = isScrolled
    ? 'text-foreground'
    : 'text-gold-nav';

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-[rgba(250,249,247,0.85)] backdrop-blur-[12px] shadow-lg border-b border-border/50'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label={language === 'he' ? 'תפריט ראשי' : 'Main navigation'}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[60px] md:h-[72px]">
          {/* LEFT — Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className={`flex items-center gap-2 ${logoColor} transition-colors duration-300`}
            aria-label="David Tours — Home"
          >
            <Compass className="h-5 w-5 md:h-6 md:w-6" />
            <span className="text-xl md:text-2xl font-extrabold" style={{ fontFamily: "'Heebo', sans-serif" }}>
              David Tours
            </span>
          </a>

          {/* CENTER — Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = link.sectionId ? activeSection === link.sectionId : false;




              return (
                <a
                  key={link.en}
                  href={link.target}
                  onClick={(e) => handleNavClick(e, link.target)}
                  className={`nav-link-underline relative flex flex-col items-center px-1 py-1 ${linkColor} transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded ${
                    isActive ? 'border-b-2 border-accent' : ''
                  }`}
                  style={!isScrolled ? { textShadow: '0px 1px 3px rgba(0,0,0,0.5)' } : undefined}
                  aria-label={language === 'he' ? link.he : link.en}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="text-sm font-semibold leading-tight">{language === 'he' ? link.he : link.en}</span>
                  <span className="text-[11px] opacity-70 leading-tight">{language === 'he' ? link.en : link.he}</span>
                </a>
              );
            })}
          </div>

          {/* RIGHT — CTA + utilities */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Book Now — always visible */}
            <Link to="/booking">
              <Button
                className="bg-accent text-accent-foreground rounded-full px-5 md:px-6 py-2 text-sm md:text-base font-semibold hover:brightness-110 hover:scale-[1.02] transition-all duration-200 min-w-0 md:min-w-[140px]"
                aria-label={language === 'he' ? 'הזמן עכשיו' : 'Book Now'}
              >
                {language === 'he' ? 'הזמן עכשיו' : 'Book Now'}
              </Button>
            </Link>

            {/* Desktop-only: Language + Auth */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSelector />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={language === 'he' ? 'תפריט חשבון' : 'Account menu'}>
                      <Shield className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{language === 'he' ? 'חשבון שלי' : 'My Account'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'לוח בקרה' : 'Dashboard'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/knowledge')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'מאגר ידע' : 'Knowledge Base'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/keywords')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'מילות מפתח' : 'Keywords'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/chat')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'צ\'אט מנהל' : 'Admin Chat'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/leads')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'ניהול לידים' : 'Lead Management'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/admin/ai-responses')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'עריכת תגובות AI' : 'AI Responses'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/ai-settings')}>
                          <Shield className="mr-2 h-4 w-4" />
                          {language === 'he' ? 'הגדרות AI' : 'AI Settings'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {language === 'he' ? 'התנתק' : 'Sign Out'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon" aria-label={language === 'he' ? 'כניסת מנהלים' : 'Admin Login'}>
                    <Shield className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-gold-nav focus-visible:ring-2 focus-visible:ring-primary rounded"
              onClick={() => setDrawerOpen(true)}
              aria-label={language === 'he' ? 'פתח תפריט' : 'Open menu'}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="bg-[hsl(var(--primary-dark))] border-none p-0 w-[85%] sm:max-w-sm flex flex-col"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col flex-1 p-6 pt-16">
            {/* Nav links */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.sectionId ? activeSection === link.sectionId : false;




                return (
                  <a
                    key={link.en}
                    href={link.target}
                    onClick={(e) => handleNavClick(e, link.target)}
                    className={`flex flex-col text-white/90 hover:text-white transition-colors py-2 focus-visible:ring-2 focus-visible:ring-primary rounded ${
                      isActive ? 'border-l-3 border-accent pl-3' : ''
                    }`}
                    aria-label={language === 'he' ? link.he : link.en}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="text-xl font-semibold" style={{ fontFamily: "'Heebo', sans-serif" }}>
                      {language === 'he' ? link.he : link.en}
                    </span>
                    <span className="text-sm opacity-60">{language === 'he' ? link.en : link.he}</span>
                  </a>
                );
              })}
            </div>

            {/* Drawer utilities */}
            <div className="mt-6 flex items-center gap-3">
              <LanguageSelector />
              {user ? (
                <Button
                  variant="ghost"
                  className="text-white/80 hover:text-white gap-2"
                  onClick={() => { handleSignOut(); setDrawerOpen(false); }}
                >
                  <LogOut className="h-4 w-4" />
                  {language === 'he' ? 'התנתק' : 'Sign Out'}
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setDrawerOpen(false)}>
                  <Button variant="ghost" className="text-white/80 hover:text-white gap-2">
                    <Shield className="h-4 w-4" />
                    {language === 'he' ? 'כניסת מנהלים' : 'Admin Login'}
                  </Button>
                </Link>
              )}
            </div>

            {isAdmin && user && (
              <div className="mt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => { navigate('/admin'); setDrawerOpen(false); }}>
                  <Shield className="mr-2 h-4 w-4" />{language === 'he' ? 'לוח בקרה' : 'Dashboard'}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => { navigate('/admin/knowledge'); setDrawerOpen(false); }}>
                  <Shield className="mr-2 h-4 w-4" />{language === 'he' ? 'מאגר ידע' : 'Knowledge Base'}
                </Button>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Full-width Book Now CTA at bottom */}
            <Link to="/booking" onClick={() => setDrawerOpen(false)} className="mt-6">
              <Button
                className="w-full bg-accent text-accent-foreground rounded-full py-3 text-lg font-semibold hover:brightness-110 transition-all duration-200"
                aria-label={language === 'he' ? 'הזמן עכשיו' : 'Book Now'}
              >
                {language === 'he' ? 'הזמן עכשיו' : 'Book Now'}
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <TeamDNAQuiz
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    </>
  );
};
