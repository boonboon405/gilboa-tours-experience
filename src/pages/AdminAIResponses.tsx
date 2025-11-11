import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Bot, User, Save, Search, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  conversation_id: string;
  sender: string;
  message: string;
  created_at: string;
  sentiment_score: number | null;
}

interface Conversation {
  id: string;
  session_id: string;
  created_at: string;
  status: string;
  detected_mood: string[];
  user_name: string | null;
  user_email: string | null;
}

export default function AdminAIResponses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון שיחות",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון הודעות",
        variant: "destructive",
      });
    }
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessage(messageId);
    setEditedContent(currentContent);
  };

  const handleSaveMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ message: editedContent })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, message: editedContent } : msg
      ));

      setEditingMessage(null);
      setEditedContent('');

      toast({
        title: "הצלחה",
        description: "התגובה עודכנה בהצלחה",
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לעדכן את התגובה",
        variant: "destructive",
      });
    }
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.session_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              חזרה למנהל
            </Button>
            <h1 className="text-3xl font-bold">ניהול תגובות AI</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                שיחות
              </CardTitle>
              <Input
                placeholder="חפש שיחה..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {isLoading ? (
                    <p className="text-center text-muted-foreground py-4">טוען...</p>
                  ) : filteredConversations.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">אין שיחות</p>
                  ) : (
                    filteredConversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation === conv.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                        onClick={() => setSelectedConversation(conv.id)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">
                            {conv.user_name || 'אורח'}
                          </span>
                          <Badge variant={conv.status === 'active' ? 'default' : 'secondary'}>
                            {conv.status}
                          </Badge>
                        </div>
                        <p className="text-xs opacity-80 mb-1">
                          {conv.user_email || 'ללא אימייל'}
                        </p>
                        <div className="flex items-center gap-1 text-xs opacity-60">
                          <Calendar className="w-3 h-3" />
                          {new Date(conv.created_at).toLocaleDateString('he-IL')}
                        </div>
                        {conv.detected_mood && conv.detected_mood.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {conv.detected_mood.slice(0, 2).map((mood, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {mood}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                הודעות בשיחה
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedConversation ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">בחר שיחה כדי לראות הודעות</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">אין הודעות בשיחה זו</p>
                    ) : (
                      messages.map((msg) => (
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
                            <div className="mb-1 text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleString('he-IL')}
                              {msg.sentiment_score !== null && (
                                <Badge variant="outline" className="mr-2">
                                  Sentiment: {msg.sentiment_score.toFixed(2)}
                                </Badge>
                              )}
                            </div>
                            {editingMessage === msg.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  className="min-h-[100px]"
                                  dir="rtl"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveMessage(msg.id)}
                                  >
                                    <Save className="w-4 h-4 ml-1" />
                                    שמור
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingMessage(null);
                                      setEditedContent('');
                                    }}
                                  >
                                    ביטול
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className={`inline-block p-3 rounded-lg max-w-[85%] ${
                                msg.sender === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.message}</p>
                                {msg.sender === 'ai' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="mt-2"
                                    onClick={() => handleEditMessage(msg.id, msg.message)}
                                  >
                                    ערוך תגובה
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}