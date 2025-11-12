import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CategorySelector } from '@/components/CategorySelector';
import { CategoryBadge } from '@/components/CategoryBadge';
import { LanguageQualityBadge } from '@/components/LanguageQualityBadge';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';
import { detectCategoriesInMessage } from '@/utils/categoryDetector';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
  languageQuality?: {
    hebrewScore: number;
    arabicDetected: boolean;
    arabicWords?: string[];
  };
}

interface AIChatProps {
  quizResults?: {
    id: string;
    top_categories: string[];
    percentages: Record<string, number>;
  };
  onRequestHumanAgent?: () => void;
}

export const AIChat = ({ quizResults, onRequestHumanAgent }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [messages]);

  useEffect(() => {
    // Send initial greeting
    if (messages.length === 0) {
      const greeting = quizResults
        ? `שלום. ראיתי שעשית את הQuiz שלנו - מעולה.\n\nלפי התוצאות, נראה שאתם מחפשים חוויה ${getTopCategoryDescription(quizResults.top_categories[0])}.\n\nספרו לי קצת יותר - מה הסיטואציה, כמה אנשים, מה מעניין אתכם`
        : 'שלום! אני הסוכן הדיגיטלי של החברה - טיולים עם דויד.\n\nאנחנו משלבים 7 קטגוריות של פעילויות: הרפתקאות, טבע, היסטוריה, קולינריה, ספורט, יצירתיות, ובריאות ורוגע.\n\nחשוב לנו לדעת מה מעניין אתכם?';

      setMessages([{
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      }]);
      
      // Show category selector only if no quiz results
      if (!quizResults) {
        setShowCategorySelector(true);
      }
    }
  }, []);

  const getTopCategoryDescription = (category: string): string => {
    const descriptions: Record<string, string> = {
      adventure: 'מלאת הרפתקאות ואדרנלין',
      nature: 'קרובה לטבע ונופים מרהיבים',
      history: 'עשירה בהיסטוריה ותרבות',
      culinary: 'קולינרית מיוחדת',
      sports: 'פעילה וספורטיבית',
      creative: 'יצירתית ומעוררת השראה',
      wellness: 'מרגיעה ומחזקת'
    };
    return descriptions[category] || 'מגוונת ומעניינת';
  };

  const handleCategorySelect = async (categories: string[]) => {
    setShowCategorySelector(false);
    
    const categoryNames = categories.map(cat => categoryMetadata[cat as keyof typeof categoryMetadata].name).join(', ');
    const userMessage = `מעניין אותי: ${categoryNames}`;
    
    // Add user message to UI
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      message: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          quizResults
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "שגיאה",
          description: data.fallback || data.error,
          variant: "destructive"
        });
        return;
      }

      setConversationId(data.conversationId);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        message: data.message,
        created_at: new Date().toISOString(),
        languageQuality: data.languageQuality
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Show alert if Arabic detected
      if (data.languageQuality?.arabicDetected) {
        toast({
          title: "⚠️ זוהתה שפה לא תקינה",
          description: `זוהו מילים ערביות: ${data.languageQuality.arabicWords?.join(', ')}`,
          variant: "destructive",
        });
      }
      
      if (data.quickReplies && data.quickReplies.length > 0) {
        setQuickReplies(data.quickReplies);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסו שוב או צרו קשר בטלפון 053-7314235",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setShowCategorySelector(false);
    
    // Add user message to UI immediately
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      message: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          quizResults
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "שגיאה",
          description: data.fallback || data.error,
          variant: "destructive"
        });
        return;
      }

      setConversationId(data.conversationId);

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        message: data.message,
        created_at: new Date().toISOString(),
        languageQuality: data.languageQuality
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Show alert if Arabic detected
      if (data.languageQuality?.arabicDetected) {
        toast({
          title: "⚠️ זוהתה שפה לא תקינה",
          description: `זוהו מילים ערביות: ${data.languageQuality.arabicWords?.join(', ')}`,
          variant: "destructive",
        });
      }
      
      // Update quick replies
      if (data.quickReplies && data.quickReplies.length > 0) {
        setQuickReplies(data.quickReplies);
      }

      // Check if human agent is needed
      if (data.message.includes('דוד') || data.message.includes('053-7314235')) {
        setTimeout(() => {
          onRequestHumanAgent?.();
        }, 1000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסו שוב או צרו קשר בטלפון 053-7314235",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto border-border/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="relative">
          <Bot className="w-8 h-8 text-primary" />
          <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">סוכן חכם - חוויות גלבוע</h3>
          <p className="text-sm text-muted-foreground">מומחה לסיורים מותאמים אישית</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                  
                  {/* Category badges and language quality for AI messages */}
                  {msg.sender === 'ai' && (
                    <div className="space-y-2 mt-2">
                      {/* Category badges */}
                      {(() => {
                        const categories = detectCategoriesInMessage(msg.message);
                        return categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-2 border-t border-border/30">
                            {categories.map((category) => (
                              <CategoryBadge key={category} category={category} size="sm" />
                            ))}
                          </div>
                        ) : null;
                      })()}
                      
                      {/* Language quality indicator */}
                      {msg.languageQuality && (
                        <div className="flex justify-start pt-1">
                          <LanguageQualityBadge 
                            hebrewScore={msg.languageQuality.hebrewScore}
                            arabicDetected={msg.languageQuality.arabicDetected}
                            arabicWords={msg.languageQuality.arabicWords}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-lg bg-muted">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50 bg-background">
        {/* Category Selector */}
        {showCategorySelector && (
          <div className="mb-4">
            <CategorySelector 
              onSelect={handleCategorySelect}
              disabled={isLoading}
            />
          </div>
        )}
        {/* Quick Replies */}
        {quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput(reply);
                  setTimeout(() => handleSend(), 100);
                }}
                className="text-xs"
                disabled={isLoading}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="כתבו את ההודעה שלכם..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          רוצים לדבר עם בן אדם? רק תגידו
        </p>
      </div>
    </Card>
  );
};
