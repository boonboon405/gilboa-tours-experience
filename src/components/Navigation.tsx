import { useState, useEffect } from 'react';
import { Menu, X, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { QuizResults } from '@/utils/quizScoring';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
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
