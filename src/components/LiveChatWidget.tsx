import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Minimize2, User, Headphones, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_type: 'visitor' | 'agent' | 'system';
  sender_name: string | null;
  message: string;
  created_at: string;
}

export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [visitorName, setVisitorName] = useState('');
  const [showNameForm, setShowNameForm] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel('live-chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // If message is from agent and chat is minimized, increment unread
          if (newMessage.sender_type === 'agent' && (isMinimized || !isOpen)) {
            setUnreadCount(prev => prev + 1);
          }

          // Mark as read by visitor if chat is open
          if (isOpen && !isMinimized && newMessage.sender_type === 'agent') {
            markMessageAsRead(newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, isOpen, isMinimized]);

  const markMessageAsRead = async (messageId: string) => {
    await supabase
      .from('live_chat_messages')
      .update({ read_by_visitor: true })
      .eq('id', messageId);
  };

  const startConversation = async () => {
    if (!visitorName.trim()) {
      toast({
        title: "שם נדרש",
        description: "אנא הזינו את שמכם להתחלת שיחה",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('live_chat_conversations')
        .insert({
          visitor_name: visitorName,
          session_id: sessionId,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(data.id);
      setShowNameForm(false);

      // Send welcome message
      await supabase
        .from('live_chat_messages')
        .insert({
          conversation_id: data.id,
          sender_type: 'system',
          sender_name: 'מערכת',
          message: `שלום ${visitorName}! 👋\n\nאנחנו כאן לעזור לכם.\n\n🤖 עונה אוטומטית חכמה תענה על שאלותיכם הראשונות\n👤 נציג אמיתי יצטרף בקרוב במידת הצורך\n\nאתם מוזמנים לכתוב את השאלה שלכם!`,
          read_by_visitor: true
        });

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להתחיל את השיחה. אנא נסו שוב",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const messageText = input.trim();
    setInput('');

    try {
      // Store visitor message
      await supabase
        .from('live_chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: 'visitor',
          sender_name: visitorName,
          message: messageText,
          read_by_agent: false
        });

      // Update conversation timestamp
      await supabase
        .from('live_chat_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Trigger AI auto-response with typing indicator
      setIsAgentTyping(true);
      setTimeout(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('live-chat-ai-response', {
            body: {
              conversationId,
              message: messageText
            }
          });

          if (error) {
            console.error('AI response error:', error);
            return;
          }

          // If AI suggests human agent is needed, show a notification
          if (data?.needsHumanAgent) {
            toast({
              title: "📞 נציג אנושי יחזור אליכם בקרוב",
              description: "השאלה שלכם הועברה לנציג שלנו",
            });
          }
        } catch (error) {
          console.error('Error triggering AI response:', error);
        } finally {
          setIsAgentTyping(false);
        }
      }, 2000); // 2 second delay to simulate "agent is typing"

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "לא הצלחנו לשלוח את ההודעה. אנא נסו שוב",
        variant: "destructive"
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsOpen(false);
    setUnreadCount(0);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={handleOpen}
        size="lg"
        className="fixed bottom-6 left-6 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all z-50 ripple-effect"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50 animate-scale-in">
        <Card 
          className="w-80 cursor-pointer hover:shadow-lg transition-all ripple-effect"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              <span className="font-semibold">צ'אט חי</span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary">
                {unreadCount} חדש
              </Badge>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 left-6 w-96 h-[600px] flex flex-col shadow-2xl z-50 border-2 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Headphones className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">צ'אט חי - תמיכה</h3>
            <p className="text-xs opacity-90">מחוברים כעת</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMinimize}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 ripple-effect"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20 ripple-effect"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Name Form or Messages */}
      {showNameForm ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full space-y-4">
            <div className="text-center space-y-2 mb-6">
              <h4 className="text-xl font-bold">שלום! 👋</h4>
              <p className="text-muted-foreground">
                אנחנו כאן לעזור לכם. הזינו את שמכם להתחלת שיחה
              </p>
            </div>
            <Input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startConversation()}
              placeholder="השם שלכם..."
              className="text-center"
            />
            <Button
              onClick={startConversation}
              className="w-full ripple-effect"
              disabled={!visitorName.trim()}
            >
              התחל שיחה
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${
                    msg.sender_type === 'visitor' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender_type === 'visitor'
                      ? 'bg-primary text-primary-foreground'
                      : msg.sender_type === 'agent'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted'
                  }`}>
                    {msg.sender_type === 'visitor' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Headphones className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`flex-1 ${
                    msg.sender_type === 'visitor' ? 'text-right' : 'text-left'
                  }`}>
                    <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                      msg.sender_type === 'visitor'
                        ? 'bg-primary text-primary-foreground'
                        : msg.sender_type === 'agent'
                        ? 'bg-secondary/20'
                        : 'bg-muted'
                    }`}>
                      {msg.sender_name && msg.sender_type !== 'visitor' && (
                        <p className="text-xs font-semibold mb-1 opacity-70">
                          {msg.sender_name}
                          {msg.sender_name === 'AI Assistant' && ' 🤖'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('he-IL', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isAgentTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div className="bg-secondary/20 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-muted/30">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="כתבו הודעה..."
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim()}
                size="icon"
                className="ripple-effect"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              🤖 מענה אוטומטי מיידי • 👤 נציג אמיתי זמין בקרוב
            </p>
          </div>
        </>
      )}
    </Card>
  );
};
