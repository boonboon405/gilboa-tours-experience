import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Minimize2, User, Headphones } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel('live-chat-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'live_chat_messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        if (newMessage.sender_type === 'agent' && (isMinimized || !isOpen)) {
          setUnreadCount(prev => prev + 1);
        }
        if (isOpen && !isMinimized && newMessage.sender_type === 'agent') {
          supabase.from('live_chat_messages').update({ read_by_visitor: true }).eq('id', newMessage.id);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, isOpen, isMinimized]);

  const startConversation = async () => {
    if (!visitorName.trim()) {
      toast({ title: t('liveChat.nameRequired'), description: t('liveChat.nameRequiredDesc'), variant: "destructive" });
      return;
    }
    try {
      const { data, error } = await supabase
        .from('live_chat_conversations')
        .insert({ visitor_name: visitorName, session_id: sessionId, status: 'active' })
        .select()
        .single();
      if (error) throw error;
      setConversationId(data.id);
      setShowNameForm(false);
      await supabase.from('live_chat_messages').insert({
        conversation_id: data.id,
        sender_type: 'system',
        sender_name: t('liveChat.system'),
        message: t('liveChat.welcomeMessage').replace('{name}', visitorName),
        read_by_visitor: true
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({ title: t('liveChat.error'), description: t('liveChat.errorStartDesc'), variant: "destructive" });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;
    const messageText = input.trim();
    setInput('');
    try {
      await supabase.from('live_chat_messages').insert({
        conversation_id: conversationId,
        sender_type: 'visitor',
        sender_name: visitorName,
        message: messageText,
        read_by_agent: false
      });
      await supabase.from('live_chat_conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId);
      setIsAgentTyping(true);
      setTimeout(async () => {
        try {
          const { data, error } = await supabase.functions.invoke('live-chat-ai-response', {
            body: { conversationId, message: messageText }
          });
          if (error) console.error('AI response error:', error);
          if (data?.needsHumanAgent) {
            toast({ title: t('liveChat.humanAgentTitle'), description: t('liveChat.humanAgentDesc') });
          }
        } catch (error) {
          console.error('Error triggering AI response:', error);
        } finally {
          setIsAgentTyping(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: t('liveChat.sendError'), description: t('liveChat.sendErrorDesc'), variant: "destructive" });
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => { setIsOpen(true); setIsMinimized(false); setUnreadCount(0); }}
        size="lg"
        className="fixed bottom-6 left-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Card
          className="w-72 cursor-pointer hover:shadow-md transition-all"
          onClick={() => { setIsMinimized(false); setUnreadCount(0); }}
        >
          <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              <span className="text-sm font-medium">{t('liveChat.title')}</span>
            </div>
            {unreadCount > 0 && <Badge variant="secondary" className="text-xs">{unreadCount}</Badge>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 left-6 w-[360px] h-[500px] flex flex-col shadow-xl z-50 border overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Headphones className="w-4 h-4" />
          <span className="font-medium text-sm">{t('liveChat.title')}</span>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20">
            <Minimize2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); setUnreadCount(0); }} className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20">
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {showNameForm ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full space-y-4 text-center">
            <h4 className="text-lg font-bold">{t('liveChat.hello')} 👋</h4>
            <p className="text-sm text-muted-foreground">{t('liveChat.enterName')}</p>
            <Input
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && startConversation()}
              placeholder={t('liveChat.namePlaceholder')}
              className="text-center"
            />
            <Button onClick={startConversation} className="w-full" disabled={!visitorName.trim()}>
              {t('liveChat.startChat')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.sender_type === 'visitor' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender_type === 'visitor' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {msg.sender_type === 'visitor' ? <User className="w-3.5 h-3.5" /> : <Headphones className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`flex-1 ${msg.sender_type === 'visitor' ? 'text-end' : 'text-start'}`}>
                    <div className={`inline-block p-2.5 rounded-xl max-w-[85%] text-sm ${
                      msg.sender_type === 'visitor'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {msg.sender_name && msg.sender_type !== 'visitor' && (
                        <p className="text-xs font-semibold mb-0.5 opacity-70">{msg.sender_name}</p>
                      )}
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-[10px] opacity-60 mt-1">
                        {new Date(msg.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isAgentTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted p-2.5 rounded-xl">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={t('liveChat.messagePlaceholder')}
                className="flex-1 text-sm"
              />
              <Button onClick={sendMessage} disabled={!input.trim()} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
