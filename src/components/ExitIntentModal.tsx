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
import { openWhatsApp, whatsappTemplates, trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { t } = useLanguage();

  const ownerPhone = '0537314235';
  const ownerWhatsApp = '972537314235';
  const ownerEmail = 'DavidIsraelTours@gmail.com';
  const ownerName = 'דויד דניאל רחימי';

  useEffect(() => {
    if (hasShown) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) { setIsOpen(true); setHasShown(true); }
    };
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      if (!hasShown) { idleTimer = setTimeout(() => { setIsOpen(true); setHasShown(true); }, 45000); }
    };
    let lastScrollY = window.scrollY;
    let hasScrolledDown = false;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 800) hasScrolledDown = true;
      if (hasScrolledDown && currentScrollY < lastScrollY && currentScrollY < 300 && !hasShown) { setIsOpen(true); setHasShown(true); }
      lastScrollY = currentScrollY;
      resetIdleTimer();
    };
    const visitCount = parseInt(sessionStorage.getItem('visitCount') || '0');
    sessionStorage.setItem('visitCount', (visitCount + 1).toString());
    if (visitCount >= 2 && !hasShown) {
      setTimeout(() => { if (!hasShown) { setIsOpen(true); setHasShown(true); } }, 10000);
    }
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
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
    sessionStorage.setItem('contactAttempted', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-glow">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-full bg-gradient-hero">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl">{t('exit.title')}</DialogTitle>
          </div>
          <DialogDescription className="text-right text-base leading-relaxed pt-2">
            {t('exit.needAdvice')}
            <strong className="block text-foreground mt-2 text-lg">
              {t('exit.speakWith')} {ownerName}
            </strong>
            <span className="block mt-1 text-muted-foreground">
              {t('exit.expertAvailable')}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button variant="whatsapp" size="lg" className="w-full text-lg shadow-strong animate-bounce-slow"
            onClick={() => { handleContact('whatsapp'); openWhatsApp(ownerWhatsApp, whatsappTemplates.inquiry, 'exit-intent-modal'); }}>
            <MessageCircle className="ml-2 h-5 w-5" />
            {t('exit.whatsapp')}
          </Button>
          <Button variant="hero" size="lg" className="w-full text-lg"
            onClick={() => { handleContact('phone'); trackPhoneCall(ownerPhone, 'exit-intent-modal'); window.location.href = `tel:${ownerPhone}`; }}>
            <Phone className="ml-2 h-5 w-5" />
            {t('exit.callDirect')} {ownerPhone}
          </Button>
          <Button variant="outline" size="lg" className="w-full text-lg" asChild onClick={() => handleContact('email')}>
            <a href={`mailto:${ownerEmail}`}>
              <Mail className="ml-2 h-5 w-5" />
              {t('exit.sendEmail')}
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsOpen(false)}>
            {t('exit.continueBrowsing')}
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-xs text-muted-foreground">{t('exit.helpTip')}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
