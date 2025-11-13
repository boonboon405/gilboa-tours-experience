import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User, Send, Trash2, Languages, Gauge, Download, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sanitizeForTTS } from '@/utils/ttsSanitizer';
import companyLogo from '@/assets/company-logo.png';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
}

interface VoiceChatProps {
  quizResults?: {
    id: string;
    top_categories: string[];
    percentages: Record<string, number>;
  };
}

export const VoiceChat = ({ quizResults }: VoiceChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [language, setLanguage] = useState<'he' | 'en'>('he');
  const [voiceSpeed, setVoiceSpeed] = useState(0.44);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setSpeechSupported(false);
      toast({
        title: "דפדפן לא נתמך",
        description: "אנא השתמשו ב-Chrome, Edge או Safari לתמיכה מלאה בקול",
        variant: "destructive"
      });
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'he' ? 'he-IL' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      await handleVoiceInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        toast({
          title: "לא נשמע קול",
          description: "אנא נסו שוב ודברו בבירור",
        });
      } else if (event.error === 'not-allowed') {
        toast({
          title: "נדרשת הרשאה",
          description: "אנא אפשרו גישה למיקרופון בדפדפן",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  useEffect(() => {
    // Send initial greeting
    if (messages.length === 0) {
      const greeting = language === 'he'
        ? quizResults
          ? `שלום! ראיתי שעשית את הQuiz שלנו - מעולה! לפי התוצאות, נראה שאתם מחפשים חוויה מיוחדת. ספרו לי קצת יותר - מה הסיטואציה? כמה אנשים?`
          : 'שלום! אני סוכן דיגיטלי. אני כאן לעזור לכם למצוא את החוויה המושלמת ליום הצוות שלכם! כיתבו לי או ספרו לי - כמה אנשים אתם? מה מעניין אתכם?'
        : quizResults
          ? `Hello! I saw you took our quiz - excellent! Based on the results, it seems you're looking for a special experience. Tell me a bit more - what's the situation? How many people?`
          : 'Hello! I am a digital agent. I am here to help you find the perfect experience for your team day! Write or tell me - how many people are you? What interests you?';

      const initialMsg: Message = {
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      };
      setMessages([initialMsg]);
      
      // Speak the greeting
      setTimeout(() => speakText(greeting), 500);
    }
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    // Sanitize text for TTS - remove emojis, special characters, and markdown
    const cleanText = sanitizeForTTS(text);
    
    // Don't speak if text is empty after sanitization
    if (!cleanText.trim()) {
      console.log('Text was empty after sanitization, skipping TTS');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'he' ? 'he-IL' : 'en-US';
    utterance.rate = voiceSpeed;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a voice matching the selected language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(voice => 
      language === 'he' 
        ? (voice.lang === 'he-IL' || voice.lang.startsWith('he'))
        : (voice.lang === 'en-US' || voice.lang.startsWith('en'))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim() || isProcessing) return;

    // Add user message to UI
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      message: transcript,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: transcript,
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
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak the AI response
      speakText(data.message);

    } catch (error) {
      console.error('Voice chat error:', error);
      toast({
        title: "שגיאה בעיבוד",
        description: "אנא נסו שוב או צרו קשר בטלפון 053-7314235",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current || isListening || isProcessing || isSpeaking) return;
    
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = textInput.trim();
    
    if (message && !isProcessing) {
      setTextInput('');
      await handleVoiceInput(message);
    }
  };

  const handleClearChat = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    // Reset conversation
    setMessages([]);
    setConversationId(null);
    setSessionId(`session-${Date.now()}-${Math.random()}`);
    setTextInput('');
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);

    // Send new greeting
    const greeting = language === 'he'
      ? quizResults
        ? `שלום! ראיתי שעשית את הQuiz שלנו - מעולה! לפי התוצאות, נראה שאתם מחפשים חוויה מיוחדת. ספרו לי קצת יותר - מה הסיטואציה? כמה אנשים?`
        : 'שלום! אני סוכן דיגיטלי. אני כאן לעזור לכם למצוא את החוויה המושלמת ליום הצוות שלכם! כיתבו לי או ספרו לי - כמה אנשים אתם? מה מעניין אתכם?'
      : quizResults
        ? `Hello! I saw you took our quiz - excellent! Based on the results, it seems you're looking for a special experience. Tell me a bit more - what's the situation? How many people?`
        : 'Hello! I am a digital agent. I am here to help you find the perfect experience for your team day! Write or tell me - how many people are you? What interests you?';

    const initialMsg: Message = {
      id: '0',
      sender: 'ai',
      message: greeting,
      created_at: new Date().toISOString()
    };
    setMessages([initialMsg]);
    
    setTimeout(() => speakText(greeting), 500);

    toast({
      title: language === 'he' ? "שיחה חדשה" : "New Conversation",
      description: language === 'he' ? "השיחה אופסה בהצלחה" : "Chat cleared successfully"
    });
  };

  const handleExportChat = () => {
    const chatText = messages.map(msg => {
      const sender = msg.sender === 'user' ? (language === 'he' ? 'אני' : 'Me') : (language === 'he' ? 'עוזר' : 'Assistant');
      const timestamp = new Date(msg.created_at).toLocaleString(language === 'he' ? 'he-IL' : 'en-US');
      return `[${timestamp}] ${sender}: ${msg.message}`;
    }).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: language === 'he' ? "שיחה יוצאה" : "Chat Exported",
      description: language === 'he' ? "הקובץ הורד בהצלחה" : "File downloaded successfully"
    });
  };

  const handleQuickReply = async (reply: string) => {
    if (!isProcessing && !isSpeaking) {
      await handleVoiceInput(reply);
    }
  };

  const quickReplies = language === 'he' ? [
    'ספר לי עוד',
    'מה האפשרויות?',
    'כמה זה עולה?',
    'איפה זה?'
  ] : [
    'Tell me more',
    'What are the options?',
    'How much does it cost?',
    'Where is it?'
  ];

  if (!speechSupported) {
    return (
      <Card className="flex flex-col items-center justify-center h-[600px] max-w-4xl mx-auto p-8 text-center">
        <MicOff className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">צ'אט קולי לא נתמך</h3>
        <p className="text-muted-foreground">
          אנא השתמשו בדפדפן Chrome, Edge או Safari למחשב עבור תכונה זו
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto border-border/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <img src={companyLogo} alt="טיולים עם דוד" className="w-10 h-10 rounded-lg object-cover" />
          <Bot className="w-8 h-8 text-primary" />
          <div>
            <h3 className="font-semibold text-lg">{language === 'he' ? 'צ\'אט קולי - טיולים עם דוד' : 'Voice Chat - Tours with David'}</h3>
            <p className="text-sm text-muted-foreground">{language === 'he' ? 'חוויות בטבע עם הדרכה מקצועית 🌿' : 'Nature experiences with professional guidance 🌿'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            title={language === 'he' ? 'הגדרות' : 'Settings'}
          >
            <Gauge className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportChat}
            title={language === 'he' ? 'ייצא שיחה' : 'Export Chat'}
            disabled={messages.length === 0}
          >
            <Download className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            title={language === 'he' ? 'נקה שיחה' : 'Clear Chat'}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSpeech}
            disabled={!isSpeaking}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-border/50 bg-muted/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <label className="text-sm font-medium">{language === 'he' ? 'שפה' : 'Language'}:</label>
            </div>
            <Select value={language} onValueChange={(value: 'he' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he">עברית</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                <label className="text-sm font-medium">{language === 'he' ? 'מהירות קול' : 'Voice Speed'}:</label>
              </div>
              <span className="text-sm text-muted-foreground">{voiceSpeed.toFixed(2)}x</span>
            </div>
            <Slider
              value={[voiceSpeed]}
              onValueChange={(value) => setVoiceSpeed(value[0])}
              min={0.3}
              max={1.5}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{language === 'he' ? 'איטי' : 'Slow'}</span>
              <span>{language === 'he' ? 'רגיל' : 'Normal'}</span>
              <span>{language === 'he' ? 'מהיר' : 'Fast'}</span>
            </div>
          </div>
        </div>
      )}

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
                </div>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Voice and Text Controls */}
      <div className="border-t border-border/50 bg-background">
        {/* Text Input */}
        <div className="space-y-2 border-b border-border/50">
          <form onSubmit={handleTextSubmit} className="flex gap-2 p-3">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={language === 'he' ? 'הקלידו את תשובתכם...' : 'Type your answer...'}
              disabled={isProcessing || isSpeaking}
              className={`flex-1 ${language === 'he' ? 'text-right' : 'text-left'}`}
              dir={language === 'he' ? 'rtl' : 'ltr'}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!textInput.trim() || isProcessing || isSpeaking}
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          
          {/* Quick Reply Buttons */}
          <div className={`flex gap-2 px-3 pb-3 overflow-x-auto ${language === 'he' ? 'flex-row-reverse' : ''}`}>
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickReply(reply)}
                disabled={isProcessing || isSpeaking}
                className="whitespace-nowrap text-xs hover:bg-primary/10 hover:border-primary transition-colors"
              >
                {reply}
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Control */}
        <div className="p-6 bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking}
              size="lg"
              className={`w-20 h-20 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse-slow' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8" />
              ) : isProcessing ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </Button>
            <div className="space-y-2 w-full max-w-md">
              <p className="text-base font-medium text-foreground text-center px-4 py-2 bg-background/80 rounded-lg border border-border/50">
                {language === 'he' ? (
                  isListening 
                    ? '🎤 מקשיב...' 
                    : isSpeaking 
                    ? '🔊 מדבר...'
                    : isProcessing
                    ? '⚙️ מעבד...'
                    : 'לחצו על המיקרופון להתחלת שיחה'
                ) : (
                  isListening 
                    ? '🎤 Listening...' 
                    : isSpeaking 
                    ? '🔊 Speaking...'
                    : isProcessing
                    ? '⚙️ Processing...'
                    : 'Click the microphone to start conversation'
                )}
              </p>
              <p className="text-sm text-foreground/70 text-center px-3 py-1.5 bg-accent/10 rounded-md">
                {language === 'he' 
                  ? 'תכונה זו פועלת בעברית ובאנגלית • ללא צורך ב-API Key'
                  : 'Works in Hebrew and English • No API Key required'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
