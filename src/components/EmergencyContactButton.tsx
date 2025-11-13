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

export const EmergencyContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ownerPhone = '0537314235';
  const ownerWhatsApp = '972537314235';
  const ownerEmail = 'DavidIsraelTours@gmail.com';
  const ownerName = 'דוד דניאל רחימי';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 left-6 z-50 rounded-full h-16 w-16 bg-gradient-hero transition-all duration-300 group hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] hover:scale-110 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          aria-label="דברו עם הבעלים"
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
              <SheetTitle className="text-2xl">צריכים עזרה? דברו איתי!</SheetTitle>
              <Badge className="mt-1 bg-green-500 text-white">זמין עכשיו</Badge>
            </div>
          </div>
          <SheetDescription className="text-right text-base leading-relaxed pt-2">
            <strong className="block text-foreground text-lg mb-1">
              {ownerName}
            </strong>
            <span className="block text-muted-foreground">
              מומחה הטיולים שלנו
            </span>
            <div className="mt-4 p-4 bg-muted rounded-lg border-r-4 border-primary">
              <p className="text-sm text-foreground">
                💬 אני כאן בשבילכם! אם יש שאלות, רוצים ליווי באתר יחד איתי? רוצים ייעוץ אישי - 
                אל תהססו לפנות אליי ישירות. אענה בשמחה!
              </p>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">דרכי התקשרות:</h3>
            
            <Button
              variant="whatsapp"
              size="lg"
              className="w-full text-lg shadow-strong justify-start"
              asChild
            >
              <a href={`https://wa.me/${ownerWhatsApp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="ml-2 h-6 w-6" />
                <div className="flex-1 text-right">
                  <div>שלחו הודעה בוואטסאפ</div>
                  <div className="text-xs opacity-80">מומלץ - תגובה מהירה!</div>
                </div>
              </a>
            </Button>

            <Button
              variant="hero"
              size="lg"
              className="w-full text-lg justify-start"
              asChild
            >
              <a href={`tel:${ownerPhone}`}>
                <Phone className="ml-2 h-6 w-6" />
                <div className="flex-1 text-right">
                  <div>התקשרו ישירות</div>
                  <div className="text-xs opacity-80">{ownerPhone}</div>
                </div>
              </a>
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
                  <div>שלחו אימייל</div>
                  <div className="text-xs text-muted-foreground">{ownerEmail}</div>
                </div>
              </a>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              זמני זמינות
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ימים א׳-ה׳: 08:00-20:00</li>
              <li>• יום ו׳: 08:00-14:00</li>
              <li>• במקרים דחופים - גם מחוץ לשעות אלו!</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-sm text-amber-900 dark:text-amber-100 text-center">
              <strong>🎯 המטרה שלי:</strong> שתמצאו את החוויה המושלמת!
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
