import { MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
import { openWhatsApp, whatsappTemplates } from '@/utils/contactTracking';

export const WhatsAppFAB = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => openWhatsApp('972537314235', whatsappTemplates.inquiry, 'whatsapp-fab')}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)] hover:scale-110 transition-all duration-300 flex items-center justify-center"
            aria-label={isHe ? 'שלחו לנו הודעה בוואטסאפ' : 'Send us a WhatsApp message'}
          >
            <MessageCircle className="h-7 w-7" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="font-medium">
          {isHe ? 'דברו איתנו בוואטסאפ' : 'Chat with us on WhatsApp'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
