import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Mic, MicOff, Volume2, RotateCcw, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useTTS } from '@/hooks/use-tts';
import { RealtimeVoiceChat } from '@/components/RealtimeVoiceChat';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_REPLIES_HE = [
  'מה אתם מציעים?',
  'כמה עולה?',
  'מתאים לקבוצות?',
  'איך מזמינים?',
  'ספרו עוד',
];

const QUICK_REPLIES_EN = [
  'What do you offer?',
  'How much does it cost?',
  'Good for groups?',
  'How to book?',
  'Tell me more',
];

export const AIChatWidget = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [showRealtime, setShowRealtime] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tts = useTTS();

  const handleVoiceResult = useCallback((text: string) => {
    if (text.trim()) {
      sendMessageFromText(text.trim());
    }
  }, []);

  const speech = useSpeechRecognition({
    language: language === 'he' ? 'he-IL' : 'en-US',
    onResult: handleVoiceResult,
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickReplies = language === 'he' ? QUICK_REPLIES_HE : QUICK_REPLIES_EN;

  const sendMessageFromText = async (text: string) => {
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: { message: text, conversationId, sessionId, language },
      });

      if (error) throw error;

      if (data?.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const reply = data?.response || data?.message || (language === 'he' ? 'מצטער, לא הצלחתי לעבד את הבקשה.' : 'Sorry, I couldn\'t process your request.');
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      // Auto-speak the response
      tts.speak(reply);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: language === 'he' ? 'אירעה שגיאה. נסו שוב או התקשרו ל-0537314235.' : 'An error occurred. Please try again or call 0537314235.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    sendMessageFromText(text.trim());
  };

  const toggleMic = () => {
    if (speech.isListening) {
      speech.stopListening();
    } else {
      tts.stop();
      speech.startListening();
    }
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 end-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 end-6 z-50 w-[360px] h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary text-primary-foreground">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{t('chat.title')}</span>
                {tts.isSpeaking && (
                  <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setShowRealtime(!showRealtime)}
                  title={t('voice.realtime.toggle')}
                >
                  <Radio className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {showRealtime ? (
              <RealtimeVoiceChat onClose={() => setShowRealtime(false)} />
            ) : (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-3">
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground text-sm mb-4">{t('chat.welcome')}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {quickReplies.map((q) => (
                            <button
                              key={q}
                              onClick={() => sendMessage(q)}
                              className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted hover:bg-accent transition-colors text-foreground"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-foreground rounded-ee-sm'
                              : 'bg-muted text-foreground rounded-es-sm'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {/* Replay button for assistant messages */}
                          {msg.role === 'assistant' && i === messages.length - 1 && (
                            <button
                              onClick={() => tts.speak(msg.content)}
                              className="mt-1.5 flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                            >
                              <RotateCcw className="w-3 h-3" />
                              {t('voice.replay')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-muted px-3 py-2 rounded-xl rounded-es-sm">
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                      </div>
                    )}

                    {/* Mic listening indicator */}
                    {speech.isListening && (
                      <div className="flex justify-end">
                        <div className="bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-xl rounded-ee-sm flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-destructive rounded-full"
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                          />
                          <span className="text-xs text-destructive">{speech.transcript || t('voice.listening')}</span>
                        </div>
                      </div>
                    )}

                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                {/* Quick replies */}
                {messages.length > 0 && messages.length < 6 && !loading && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {quickReplies.slice(0, 3).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted hover:bg-accent transition-colors text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-4 py-3 border-t border-border">
                  <div className="flex gap-2">
                    {speech.isSupported && (
                      <Button
                        variant={speech.isListening ? 'destructive' : 'outline'}
                        size="icon"
                        onClick={toggleMic}
                        disabled={loading}
                        className="shrink-0"
                      >
                        {speech.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    )}
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                      placeholder={t('chat.placeholder')}
                      className="flex-1 text-sm"
                      disabled={loading || speech.isListening}
                    />
                    <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
