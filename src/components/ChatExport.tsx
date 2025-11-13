import { Button } from '@/components/ui/button';
import { Download, Mail, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateTextContent = () => {
    let content = '=== שיחה עם סוכן טיולים עם דוד ===\n\n';
    content += `תאריך: ${formatDate(new Date().toISOString())}\n`;
    content += `מזהה שיחה: ${conversationId || 'לא זמין'}\n\n`;

    if (Object.keys(conversationData).length > 0) {
      content += '--- פרטי הזמנה ---\n';
      if (conversationData.categories?.length) {
        content += `תחומי עניין: ${conversationData.categories.join(', ')}\n`;
      }
      if (conversationData.numberOfPeople) {
        content += `מספר משתתפים: ${conversationData.numberOfPeople}\n`;
      }
      if (conversationData.situation) {
        content += `סיטואציה: ${conversationData.situation}\n`;
      }
      if (conversationData.dates) {
        content += `תאריכים: ${conversationData.dates}\n`;
      }
      if (conversationData.budget) {
        content += `תקציב: ${conversationData.budget}\n`;
      }
      if (conversationData.specificInterests) {
        content += `תחומי עניין נוספים: ${conversationData.specificInterests}\n`;
      }
      if (conversationData.transport) {
        content += `תחבורה: ${conversationData.transport}\n`;
      }
      content += '\n';
    }

    content += '--- תמליל השיחה ---\n\n';
    messages.forEach((msg, index) => {
      const time = formatDate(msg.created_at);
      const sender = msg.sender === 'user' ? 'אתה' : 'סוכן AI';
      content += `[${time}] ${sender}:\n${msg.message}\n\n`;
    });

    content += '\n--- סוף השיחה ---\n';
    content += 'טיולים עם דוד - חוויות בטבע עם הדרכה מקצועית 🌿\n';
    
    return content;
  };

  const downloadAsText = () => {
    try {
      const content = generateTextContent();
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `שיחה-${conversationId || Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: '✅ הקובץ הורד בהצלחה',
        description: 'השיחה נשמרה במחשב שלך'
      });
    } catch (error) {
      toast({
        title: '❌ שגיאה בהורדה',
        description: 'לא הצלחנו להוריד את הקובץ',
        variant: 'destructive'
      });
    }
  };

  const copyToClipboard = () => {
    try {
      const content = generateTextContent();
      navigator.clipboard.writeText(content);
      toast({
        title: '✅ הועתק ללוח',
        description: 'תוכן השיחה הועתק בהצלחה'
      });
    } catch (error) {
      toast({
        title: '❌ שגיאה בהעתקה',
        description: 'לא הצלחנו להעתיק את התוכן',
        variant: 'destructive'
      });
    }
  };

  const sendByEmail = () => {
    try {
      const content = generateTextContent();
      const subject = encodeURIComponent('שיחה עם טיולים עם דוד');
      const body = encodeURIComponent(content);
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      
      toast({
        title: '📧 נפתח דואר אלקטרוני',
        description: 'מלא את כתובת המייל ושלח'
      });
    } catch (error) {
      toast({
        title: '❌ שגיאה',
        description: 'לא הצלחנו לפתוח את הדואר האלקטרוני',
        variant: 'destructive'
      });
    }
  };

  if (messages.length < 2) {
    return null; // Don't show export until there's actual conversation
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          ייצוא שיחה
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={downloadAsText}>
          <Download className="w-4 h-4 ml-2" />
          הורדה כקובץ טקסט
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard}>
          <Share2 className="w-4 h-4 ml-2" />
          העתק ללוח
        </DropdownMenuItem>
        <DropdownMenuItem onClick={sendByEmail}>
          <Mail className="w-4 h-4 ml-2" />
          שלח במייל
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
