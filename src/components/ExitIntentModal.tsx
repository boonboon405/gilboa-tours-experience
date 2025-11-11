import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageCircle, AlertCircle } from 'lucide-react';

export const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  const ownerPhone = '053-7314235';
  const ownerWhatsApp = '972537314235';
  const ownerEmail = 'DavidIsraelTours@gmail.com';
  const ownerName = 'דוד דניאל רחימי';

  useEffect(() => {
    if (hasShown) return;

    // Exit intent detection - mouse leaving viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Hesitation detection - idle for 45 seconds on key pages
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (!hasShown) {
        idleTimer = setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
        }, 45000); // 45 seconds
      }
    };

    // Scroll up detection - user scrolling back after viewing content
    let lastScrollY = window.scrollY;
    let hasScrolledDown = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 800) {
        hasScrolledDown = true;
      }
      
      // If user scrolled down significantly and then scrolled back up
      if (hasScrolledDown && currentScrollY < lastScrollY && currentScrollY < 300 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
      
      lastScrollY = currentScrollY;
      resetIdleTimer();
    };

    // Multiple visit detection using sessionStorage
    const visitCount = parseInt(sessionStorage.getItem('visitCount') || '0');
    sessionStorage.setItem('visitCount', (visitCount + 1).toString());
    
    if (visitCount >= 2 && !hasShown) {
      // Show modal on third visit if no action taken
      setTimeout(() => {
        if (!hasShown) {
          setIsOpen(true);
          setHasShown(true);
        }
      }, 10000); // After 10 seconds on third visit
    }

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    
    // Start idle timer
    resetIdleTimer();

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, [hasShown]);

  const handleContact = (type: string) => {
    // Track contact attempt
    sessionStorage.setItem('contactAttempted', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-glow">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-gradient-hero animate-pulse">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">רגע לפני שאתם הולכים...</DialogTitle>
          </div>
          <DialogDescription className="text-right text-base leading-relaxed pt-2">
            נראה שיש לכם שאלות או שאתם מהססים? 
            <strong className="block text-foreground mt-2 text-lg">
              דברו ישירות עם {ownerName}
            </strong>
            <span className="block mt-1 text-muted-foreground">
              בעל המערכת ומומחה הטיולים שלנו - זמין עכשיו!
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            variant="whatsapp"
            size="lg"
            className="w-full text-lg shadow-strong animate-bounce-slow"
            asChild
            onClick={() => handleContact('whatsapp')}
          >
            <a href={`https://wa.me/${ownerWhatsApp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="ml-2 h-5 w-5" />
              שלחו הודעה בוואטסאפ עכשיו
            </a>
          </Button>

          <Button
            variant="hero"
            size="lg"
            className="w-full text-lg"
            asChild
            onClick={() => handleContact('phone')}
          >
            <a href={`tel:${ownerPhone}`}>
              <Phone className="ml-2 h-5 w-5" />
              התקשרו ישירות: {ownerPhone}
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full text-lg"
            asChild
            onClick={() => handleContact('email')}
          >
            <a href={`mailto:${ownerEmail}`}>
              <Mail className="ml-2 h-5 w-5" />
              שלחו אימייל
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setIsOpen(false)}
          >
            אמשיך לגלוש באתר
          </Button>
        </div>

        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">
            💡 אנחנו כאן כדי לעזור! אל תהססו לפנות בכל שאלה
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
