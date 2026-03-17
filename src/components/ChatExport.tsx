import { Button } from '@/components/ui/button';
import { Download, Mail, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

interface ConversationData {
  categories?: string[];
  numberOfPeople?: number;
  situation?: string;
  dates?: string;
  budget?: string;
  specificInterests?: string;
  transport?: string;
}

interface ChatExportProps {
  messages: Message[];
  conversationData: ConversationData;
  conversationId: string | null;
}

export const ChatExport = ({ messages, conversationData, conversationId }: ChatExportProps) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(isEn ? 'en-US' : 'he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateTextContent = () => {
    let content = isEn
      ? '=== Conversation with Tours with David AI Agent ===\n\n'
      : '=== שיחה עם סוכן טיולים עם דויד ===\n\n';
    content += `${isEn ? 'Date' : 'תאריך'}: ${formatDate(new Date().toISOString())}\n`;
    content += `${isEn ? 'Conversation ID' : 'מזהה שיחה'}: ${conversationId || (isEn ? 'N/A' : 'לא זמין')}\n\n`;

    if (Object.keys(conversationData).length > 0) {
      content += isEn ? '--- Booking Details ---\n' : '--- פרטי הזמנה ---\n';
      if (conversationData.categories?.length) {
        content += `${isEn ? 'Interests' : 'תחומי עניין'}: ${conversationData.categories.join(', ')}\n`;
      }
      if (conversationData.numberOfPeople) {
        content += `${isEn ? 'Participants' : 'מספר משתתפים'}: ${conversationData.numberOfPeople}\n`;
      }
      if (conversationData.situation) {
        content += `${isEn ? 'Occasion' : 'סיטואציה'}: ${conversationData.situation}\n`;
      }
      if (conversationData.dates) {
        content += `${isEn ? 'Dates' : 'תאריכים'}: ${conversationData.dates}\n`;
      }
      if (conversationData.budget) {
        content += `${isEn ? 'Budget' : 'תקציב'}: ${conversationData.budget}\n`;
      }
      if (conversationData.specificInterests) {
        content += `${isEn ? 'Additional interests' : 'תחומי עניין נוספים'}: ${conversationData.specificInterests}\n`;
      }
      if (conversationData.transport) {
        content += `${isEn ? 'Transport' : 'תחבורה'}: ${conversationData.transport}\n`;
      }
      content += '\n';
    }

    content += isEn ? '--- Chat Transcript ---\n\n' : '--- תמליל השיחה ---\n\n';
    messages.forEach((msg) => {
      const time = formatDate(msg.created_at);
      const sender = msg.sender === 'user' ? (isEn ? 'You' : 'אתה') : (isEn ? 'AI Agent' : 'סוכן AI');
      content += `[${time}] ${sender}:\n${msg.message}\n\n`;
    });

    content += isEn ? '\n--- End of Conversation ---\n' : '\n--- סוף השיחה ---\n';
    content += isEn
      ? 'Tours with David - Nature experiences with professional guidance 🌿\n'
      : 'טיולים עם דויד - חוויות בטבע עם הדרכה מקצועית 🌿\n';
    
    return content;
  };

  const downloadAsText = () => {
    try {
      const content = generateTextContent();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${isEn ? 'chat' : 'שיחה'}-${conversationId || Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: isEn ? '✅ File downloaded' : '✅ הקובץ הורד בהצלחה',
        description: isEn ? 'The conversation was saved to your computer' : 'השיחה נשמרה במחשב שלך'
      });
    } catch (error) {
      toast({
        title: isEn ? '❌ Download error' : '❌ שגיאה בהורדה',
        description: isEn ? 'Could not download the file' : 'לא הצלחנו להוריד את הקובץ',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = () => {
    try {
      const content = generateTextContent();
      navigator.clipboard.writeText(content);
      toast({
        title: isEn ? '✅ Copied to clipboard' : '✅ הועתק ללוח',
        description: isEn ? 'Conversation content copied successfully' : 'תוכן השיחה הועתק בהצלחה'
      });
    } catch (error) {
      toast({
        title: isEn ? '❌ Copy error' : '❌ שגיאה בהעתקה',
        description: isEn ? 'Could not copy the content' : 'לא הצלחנו להעתיק את התוכן',
        variant: 'destructive'
      });
    }
  };

  const sendByEmail = () => {
    try {
      const content = generateTextContent();
      const subject = encodeURIComponent(isEn ? 'Conversation with Tours with David' : 'שיחה עם טיולים עם דויד');
      const body = encodeURIComponent(content);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      toast({
        title: isEn ? '📧 Email client opened' : '📧 נפתח דואר אלקטרוני',
        description: isEn ? 'Fill in the email address and send' : 'מלא את כתובת המייל ושלח'
      });
    } catch (error) {
      toast({
        title: isEn ? '❌ Error' : '❌ שגיאה',
        description: isEn ? 'Could not open email client' : 'לא הצלחנו לפתוח את הדואר האלקטרוני',
        variant: 'destructive'
      });
    }
  };

  if (messages.length < 2) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          {isEn ? 'Export Chat' : 'ייצוא שיחה'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={downloadAsText}>
          <Download className="w-4 h-4 ml-2" />
          {isEn ? 'Download as text' : 'הורדה כקובץ טקסט'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Share2 className="w-4 h-4 ml-2" />
          {isEn ? 'Copy to clipboard' : 'העתק ללוח'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sendByEmail}>
          <Mail className="w-4 h-4 ml-2" />
          {isEn ? 'Send by email' : 'שלח במייל'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
