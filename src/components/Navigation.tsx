import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sparkles, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { QuizResults } from '@/utils/quizScoring';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState<number>(0);

  useEffect(() => {
    const fetchQuizCount = async () => {
      const { count } = await supabase
        .from('quiz_results')
        .select('*', { count: 'exact', head: true });
      if (count !== null) setQuizCount(count);
    };
    fetchQuizCount();
  }, []);

  const handleQuizComplete = (results: QuizResults) => {
    console.log('Quiz completed with results:', results);
    setQuizCount(prev => prev + 1);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'בית', href: '#home' },
    { label: 'יום כייף וגיבוש לחברות', href: '#choose-your-day' },
    { label: 'טיולי VIP לאורחי חברות מחו״ל', href: '#vip-tours' },
    { label: 'גיבוש ODT', href: '#odt' },
    { label: 'צור קשר', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-card/95 backdrop-blur-sm shadow-soft z-50 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              דוד טורס
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setShowQuiz(true)}
              className="relative px-4 py-2 rounded-lg bg-gradient-hero text-white font-medium whitespace-nowrap flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 shadow-glow group"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Quiz
              {quizCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-white/30">
                  {quizCount}
                </Badge>
              )}
            </button>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
            <Link to="/booking">
              <Button variant="default" className="gap-2">
                <Calendar className="h-4 w-4" />
                הזמן סיור
              </Button>
            </Link>
            
            {/* Auth Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Shield className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>חשבון שלי</DropdownMenuLabel>
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
                    <LogOut className="ml-2 h-4 w-4" />
                    התנתק
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  כניסת מנהלים
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
              aria-label="תפריט"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <button
              onClick={() => {
                setShowQuiz(true);
                setIsOpen(false);
              }}
              className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-hero text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-glow"
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              Quiz
              {quizCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-white/30">
                  {quizCount}
                </Badge>
              )}
            </button>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link to="/booking">
              <Button variant="default" className="w-full mt-2 gap-2">
                <Calendar className="h-4 w-4" />
                הזמן סיור
              </Button>
            </Link>
            
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
                      לוח בקרה
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
                      מאגר ידע
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
                  התנתק
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full mt-2 gap-2">
                  <Shield className="h-4 w-4" />
                  כניסת מנהלים
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
