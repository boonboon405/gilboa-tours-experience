import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Check, 
  X, 
  User, 
  Clock, 
  MessageCircle,
  Headphones,
  CheckCheck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_phone: string | null;
  status: 'active' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  unread_messages?: number;
}

interface Message {
  id: string;
  sender_type: 'visitor' | 'agent' | 'system';
  sender_name: string | null;
  message: string;
  read_by_agent: boolean;
  read_by_visitor: boolean;
  created_at: string;
}

const AdminChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [agentName, setAgentName] = useState('דוד רחימי');
  const [activeTab, setActiveTab] = useState('active');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load conversations
  useEffect(() => {
    loadConversations();
    
    // Subscribe to new conversations
    const conversationsChannel = supabase
      .channel('admin-conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_chat_conversations'
        },
        () => {
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(conversationsChannel);
    };
  }, [activeTab]);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    loadMessages(selectedConversation);

    const messagesChannel = supabase
      .channel(`admin-messages-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_chat_messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          
          // Mark as read by agent
          if (newMessage.sender_type === 'visitor') {
            markAsRead(newMessage.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [selectedConversation]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('live_chat_conversations')
      .select('*')
      .eq('status', activeTab)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error loading conversations:', error);
      return;
    }

    // Count unread messages for each conversation
    const conversationsWithUnread = await Promise.all(
      (data || []).map(async (conv) => {
        const { count } = await supabase
          .from('live_chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('sender_type', 'visitor')
          .eq('read_by_agent', false);

        return { 
          ...conv, 
          status: conv.status as 'active' | 'resolved' | 'closed',
          unread_messages: count || 0 
        };
      })
    );

    setConversations(conversationsWithUnread);
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('live_chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const typedMessages = (data || []).map(msg => ({
      ...msg,
      sender_type: msg.sender_type as 'visitor' | 'agent' | 'system'
    }));

    setMessages(typedMessages);

    // Mark all visitor messages as read
    await supabase
      .from('live_chat_messages')
      .update({ read_by_agent: true })
      .eq('conversation_id', conversationId)
      .eq('sender_type', 'visitor')
      .eq('read_by_agent', false);
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('live_chat_messages')
      .update({ read_by_agent: true })
      .eq('id', messageId);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConversation) return;

    const messageText = input.trim();
    setInput('');

    try {
      await supabase
        .from('live_chat_messages')
        .insert({
          conversation_id: selectedConversation,
          sender_type: 'agent',
          sender_name: agentName,
          message: messageText,
          read_by_visitor: false,
          read_by_agent: true
        });

      // Update conversation timestamp
      await supabase
        .from('live_chat_conversations')
        .update({ 
          updated_at: new Date().toISOString(),
          assigned_to: agentName
        })
        .eq('id', selectedConversation);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשלוח את ההודעה",
        variant: "destructive"
      });
    }
  };

  const updateConversationStatus = async (conversationId: string, status: 'active' | 'resolved' | 'closed') => {
    const { error } = await supabase
      .from('live_chat_conversations')
      .update({ status })
      .eq('id', conversationId);

    if (error) {
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את הסטטוס",
        variant: "destructive"
      });
    } else {
      toast({
        title: "עודכן בהצלחה",
        description: `השיחה ${status === 'resolved' ? 'נפתרה' : 'נסגרה'}`,
      });
      loadConversations();
      if (conversationId === selectedConversation) {
        setSelectedConversation(null);
      }
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">ניהול צ'אט חי</h1>
          <p className="text-muted-foreground">נהל שיחות עם לקוחות בזמן אמת</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 h-[700px]">
          {/* Conversations List */}
          <Card className="col-span-1 flex flex-col">
            <div className="p-4 border-b">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">פעילות</TabsTrigger>
                  <TabsTrigger value="resolved">נפתרו</TabsTrigger>
                  <TabsTrigger value="closed">סגורות</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>אין שיחות</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                        selectedConversation === conv.id ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {conv.visitor_name || 'אורח'}
                          </span>
                        </div>
                        {conv.unread_messages! > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conv.unread_messages}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(conv.updated_at).toLocaleString('he-IL')}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-2 flex flex-col">
            {!selectedConversation ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>בחרו שיחה מהרשימה</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedConv?.visitor_name || 'אורח'}</h3>
                      <p className="text-xs text-muted-foreground">
                        {selectedConv?.visitor_email || selectedConv?.visitor_phone || 'לא צוין'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConversationStatus(selectedConversation, 'resolved')}
                    >
                      <Check className="w-4 h-4 ml-1" />
                      סגור כנפתר
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateConversationStatus(selectedConversation, 'closed')}
                    >
                      <X className="w-4 h-4 ml-1" />
                      סגור
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 ${
                          msg.sender_type === 'agent' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.sender_type === 'agent'
                            ? 'bg-primary text-primary-foreground'
                            : msg.sender_type === 'visitor'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted'
                        }`}>
                          {msg.sender_type === 'agent' ? (
                            <Headphones className="w-4 h-4" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                        </div>
                        <div className={`flex-1 ${
                          msg.sender_type === 'agent' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                            msg.sender_type === 'agent'
                              ? 'bg-primary text-primary-foreground'
                              : msg.sender_type === 'visitor'
                              ? 'bg-secondary/20'
                              : 'bg-muted'
                          }`}>
                            {msg.sender_name && (
                              <p className="text-xs font-semibold mb-1 opacity-70">
                                {msg.sender_name}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs opacity-60">
                                {new Date(msg.created_at).toLocaleTimeString('he-IL', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {msg.sender_type === 'agent' && (
                                msg.read_by_visitor ? (
                                  <CheckCheck className="w-3 h-3 opacity-60" />
                                ) : (
                                  <Check className="w-3 h-3 opacity-60" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="כתוב הודעה..."
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminChat;
