import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { History, Trash2, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatHistoryItem {
  id: string;
  timestamp: number;
  messages: Array<{ sender: 'user' | 'ai'; message: string }>;
  quizResults?: any;
}

interface ChatHistoryProps {
  onLoadConversation: (item: ChatHistoryItem) => void;
  currentConversationId: string | null;
  language: 'he' | 'en';
}

const STORAGE_KEY = 'voice-chat-history';
const MAX_HISTORY_ITEMS = 10;

export const ChatHistory = ({ onLoadConversation, currentConversationId, language }: ChatHistoryProps) => {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveConversation = (conversationId: string, messages: any[], quizResults?: any) => {
    if (messages.length <= 1) return; // Don't save empty conversations

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existing: ChatHistoryItem[] = stored ? JSON.parse(stored) : [];
      
      // Check if conversation already exists
      const existingIndex = existing.findIndex(item => item.id === conversationId);
      
      const newItem: ChatHistoryItem = {
        id: conversationId,
        timestamp: Date.now(),
        messages: messages.slice(0, 20), // Keep first 20 messages
        quizResults
      };

      if (existingIndex >= 0) {
        existing[existingIndex] = newItem;
      } else {
        existing.unshift(newItem);
      }

      const trimmed = existing.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
      setHistory(trimmed);
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const deleteConversation = (id: string) => {
    try {
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setHistory(updated);
      
      toast({
        title: language === 'he' ? "שיחה נמחקה" : "Conversation deleted",
        description: language === 'he' ? "השיחה הוסרה מההיסטוריה" : "The conversation was removed from history"
      });
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return language === 'he' ? 'היום' : 'Today';
    } else if (diffDays === 1) {
      return language === 'he' ? 'אתמול' : 'Yesterday';
    } else if (diffDays < 7) {
      return language === 'he' ? `לפני ${diffDays} ימים` : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
    }
  };

  const getPreview = (messages: any[]) => {
    const userMessages = messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return language === 'he' ? 'שיחה ריקה' : 'Empty conversation';
    return userMessages[0].message.slice(0, 50) + (userMessages[0].message.length > 50 ? '...' : '');
  };

  // Expose save function to parent
  useEffect(() => {
    (window as any).saveChatHistory = saveConversation;
    return () => {
      delete (window as any).saveChatHistory;
    };
  }, [history]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" title={language === 'he' ? 'היסטוריית שיחות' : 'Chat History'}>
          <History className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={language === 'he' ? 'right' : 'left'} className="w-80">
        <SheetHeader>
          <SheetTitle className={language === 'he' ? 'text-right' : 'text-left'}>
            {language === 'he' ? 'היסטוריית שיחות' : 'Chat History'}
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm text-center">
                {language === 'he' ? 'אין שיחות שמורות' : 'No saved conversations'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    item.id === currentConversationId
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card hover:bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(item.timestamp)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => deleteConversation(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <button
                    className={`w-full text-sm ${language === 'he' ? 'text-right' : 'text-left'}`}
                    onClick={() => {
                      onLoadConversation(item);
                      setIsOpen(false);
                    }}
                  >
                    <p className="line-clamp-2 text-foreground">
                      {getPreview(item.messages)}
                    </p>
                    {item.quizResults && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary">
                        ✨ {language === 'he' ? 'עם תוצאות Quiz' : 'With Quiz results'}
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
