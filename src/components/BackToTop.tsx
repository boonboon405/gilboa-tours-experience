import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BackToTop = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-50 h-11 w-11 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
      aria-label={isHe ? 'חזרה למעלה' : 'Back to top'}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};
