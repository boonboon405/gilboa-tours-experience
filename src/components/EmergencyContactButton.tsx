import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Phone, Mail, MessageCircle, HeadphonesIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { openWhatsApp, getWhatsappTemplate, trackPhoneCall } from '@/utils/contactTracking';
import { useLanguage } from '@/contexts/LanguageContext';

export const EmergencyContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isHe = language === 'he';

  const ownerPhone = '0537314235';
  const ownerWhatsApp = '972537314235';
  const ownerEmail = 'DavidIsraelTours@gmail.com';
  const ownerName = isHe ? 'דויד דניאל רחימי' : 'David Daniel Rahimi';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-20 left-4 z-50 rounded-full h-12 w-12 md:bottom-6 md:left-6 md:h-16 md:w-16 bg-gradient-hero transition-all duration-300 group hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          aria-label={isHe ? 'דברו עם הבעלים' : 'Talk to the owner'}
        >
          <div className="relative">
            <HeadphonesIcon className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 group-hover:scale-110 transition-transform">
              !
            </Badge>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md border-l-4 border-primary">
        <SheetHeader className="text-right">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-gradient-hero">
              <HeadphonesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-2xl">
                {isHe ? 'צריכים עזרה? דברו איתי!' : 'Need help? Talk to me!'}
              </SheetTitle>
              <Badge className="mt-1 bg-green-500 text-white">
                {isHe ? 'זמין עכשיו' : 'Available Now'}
              </Badge>
            </div>
          </div>
          <SheetDescription className="text-right text-base leading-relaxed pt-2">
            <strong className="block text-foreground text-lg mb-1">
              {ownerName}
            </strong>
            <span className="block text-muted-foreground">
              {isHe ? 'מומחה הטיולים שלנו' : 'Our Tour Expert'}
            </span>
            <div className="mt-4 p-4 bg-muted rounded-lg border-r-4 border-primary">
              <p className="text-sm text-foreground">
                {isHe
                  ? '💬 אני כאן בשבילכם! אם יש שאלות, רוצים ליווי באתר יחד איתי? רוצים ייעוץ אישי — אל תהססו לפנות אליי ישירות. אענה בשמחה!'
                  : '💬 I\'m here for you! Have questions, want a guided walkthrough of the site, or need personal advice — don\'t hesitate to reach out directly. I\'ll be happy to help!'}
              </p>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">
              {isHe ? 'דרכי התקשרות:' : 'Contact Methods:'}
            </h3>
            
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full text-lg shadow-strong justify-start"
              onClick={() => openWhatsApp(ownerWhatsApp, getWhatsappTemplate('inquiry', language), 'emergency-contact-button')}
            >
              <MessageCircle className="ml-2 h-6 w-6" />
              <div className="flex-1 text-right">
                <div>{isHe ? 'שלחו הודעה בוואטסאפ' : 'Send a WhatsApp Message'}</div>
                <div className="text-xs opacity-80">{isHe ? 'מומלץ — תגובה מהירה!' : 'Recommended — fast response!'}</div>
              </div>
            </Button>

            <Button
              variant="hero"
              size="lg"
              className="w-full text-lg justify-start"
              onClick={() => {
                trackPhoneCall(ownerPhone, 'emergency-contact-button');
                window.location.href = `tel:${ownerPhone}`;
              }}
            >
              <Phone className="ml-2 h-6 w-6" />
              <div className="flex-1 text-right">
                <div>{isHe ? 'התקשרו ישירות' : 'Call Directly'}</div>
                <div className="text-xs opacity-80">{ownerPhone}</div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full text-lg border-2 justify-start"
              asChild
            >
              <a href={`mailto:${ownerEmail}`}>
                <Mail className="ml-2 h-6 w-6" />
                <div className="flex-1 text-right">
                  <div>{isHe ? 'שלחו אימייל' : 'Send an Email'}</div>
                  <div className="text-xs text-muted-foreground">{ownerEmail}</div>
                </div>
              </a>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              {isHe ? 'זמני זמינות' : 'Availability Hours'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>{isHe ? '• ימים א׳–ה׳: 08:00–20:00' : '• Sun–Thu: 08:00–20:00'}</li>
              <li>{isHe ? '• יום ו׳: 08:00–14:00' : '• Fri: 08:00–14:00'}</li>
              <li>{isHe ? '• במקרים דחופים — גם מחוץ לשעות אלו!' : '• Urgent cases — available outside these hours too!'}</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-100 text-center">
              <strong>🎯 {isHe ? 'המטרה שלי:' : 'My Goal:'}</strong> {isHe ? 'שתמצאו את החוויה המושלמת!' : 'Help you find the perfect experience!'}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
