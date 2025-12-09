import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User, Send, Trash2, Languages, Gauge, Download, Sparkles, Eye, Info, DollarSign, MapPin, Clock, Package, Activity, Users, Cloud, Calendar, Navigation, ParkingCircle, XCircle, UsersRound, ShoppingBag, Shirt, Backpack, ListChecks, Box, Footprints } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { speakWithElevenLabs, stopElevenLabsSpeech, ElevenLabsVoice } from '@/utils/elevenLabsTTS';
import { analyzeSentiment, getOverallSentiment } from '@/utils/sentimentAnalysis';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { ChatHistory } from '@/components/ChatHistory';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { SpeakingAnimation } from '@/components/SpeakingAnimation';
import { VoiceSelector } from '@/components/VoiceSelector';
import { VolumeIndicator } from '@/components/VolumeIndicator';
import { MicrophoneAnimation } from '@/components/MicrophoneAnimation';
import { ProcessingAnimation } from '@/components/ProcessingAnimation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import companyLogo from '@/assets/company-logo.png';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  created_at: string;
  sentiment?: {
    type: 'positive' | 'neutral' | 'negative';
    icon: string;
    color: string;
  };
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
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice>(() => {
    const saved = localStorage.getItem('preferred-voice');
    return (saved as ElevenLabsVoice) || 'Rachel';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Save conversation to history periodically
  useEffect(() => {
    if (messages.length > 1 && conversationId) {
      const saveToHistory = (window as any).saveChatHistory;
      if (saveToHistory) {
        saveToHistory(conversationId, messages, quizResults);
      }
    }
  }, [messages, conversationId, quizResults]);

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
    // Send initial greeting with enhanced quiz integration and categories
    if (messages.length === 0) {
      let greeting = '';
      
      if (language === 'he') {
        if (quizResults) {
          const topCategories = quizResults.top_categories?.slice(0, 3) || [];
          const categoryNames = topCategories.join(', ');
          greeting = `שלום! ראיתי שעשיתם את הQuiz - מעולה! 
זיהיתי שאתם מתאימים במיוחד ל-3 הקטגוריות הבאות: ${categoryNames}. 

יש לנו 8 קטגוריות עם כ-100 אפשרויות פעילות שונות בגלבוע ובית שאן:
🔥 הרפתקאות ואקסטרים
💧 טבע, מים ורוגע  
🏛️ היסטוריה ותרבות
🍷 קולינריה ויין
⚡ ספורט וצוותיות
🎨 יצירה ורוחניות
🌿 בריאות ופינוק
🤝 בניית צוות

לחצו על כפתור "הצג קטגוריות" כדי לראות את כולן. 
עכשיו ספרו לי - כמה אנשים? מה התקציב?`;
        } else {
          greeting = `שלום! אני מומחה לסיוריים ומציע חוויות:
🔥 הרפתקאות  |  💧 טבע  |  🏛️ דברי הימים  |  🍷 יין ואומנות הבישול  |  ⚡ ספורט  |  🎨 יצירה  |  🌿 בריאות  |  🤝 גיבוש צוות

ענו על השאלות , ברצוני להמליץ על פעילויות שיתאימו לכם
ספרו לי - כמה אנשים אתם? ספרו מה מעניין אתכם? 100 פעילויות שמחכות לכם!`;
        }
      } else {
        if (quizResults) {
          const topCategories = quizResults.top_categories?.slice(0, 3) || [];
          const categoryNames = topCategories.join(', ');
          greeting = `Hello! I saw your Quiz results - excellent!
I identified you're especially suited for these 3 categories: ${categoryNames}.

We have 8 categories with ~100 different activity options in Gilboa and Beit Shean:
🔥 Adventure & Extreme
💧 Nature & Water
🏛️ History & Culture
🍷 Culinary & Wine
⚡ Sports & Teamwork
🎨 Creative & Spiritual
🌿 Wellness & Pampering
🤝 Team Building

Click "View Categories" to see them all.
Now tell me - how many people? What's your budget?`;
        } else {
          greeting = `Hello! I'm an expert on Gilboa and Beit Shean with access to 8 categories of experiences:
🔥 Adventure | 💧 Nature | 🏛️ History | 🍷 Culinary | ⚡ Sports | 🎨 Creative | 🌿 Wellness | 🤝 Team Building

~100 options waiting for you! It's worth taking our short Quiz (7 questions) so I can recommend exactly what suits you.
Tell me - how many people? What interests you?`;
        }
      }

      const initialMsg: Message = {
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      };
      setMessages([initialMsg]);
      
      setTimeout(() => speakText(greeting), 500);
    }
  }, []);

  const speakText = async (text: string) => {
    // Stop any ongoing speech
    stopElevenLabsSpeech();
    
    // Use ElevenLabs for high-quality Hebrew TTS
    await speakWithElevenLabs(
      text,
      selectedVoice,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim() || isProcessing) return;

    // Analyze sentiment of user message
    const sentiment = analyzeSentiment(transcript);

    // Add user message to UI with sentiment
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      message: transcript,
      created_at: new Date().toISOString(),
      sentiment
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setIsProcessing(true);

    try {
      // Enhanced context for AI with quiz results and categories
      let enhancedMessage = transcript;
      if (quizResults && messages.length <= 3) {
        const topCats = quizResults.top_categories?.slice(0, 3) || [];
        const percentages = topCats.map(cat => `${cat}: ${quizResults.percentages?.[cat] || 0}%`).join(', ');
        enhancedMessage = `[CONTEXT: User completed Quiz. Top 3 categories: ${percentages}. 
8 total categories available: Adventure, Nature, History, Culinary, Sports, Creative, Wellness, Team Building.
~100 activity options across these categories in Gilboa and Beit Shean region.
Use this data to recommend from the most suitable categories.] 
${transcript}`;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: enhancedMessage,
          conversationId,
          sessionId,
          quizResults,
          categories: {
            all: ['adventure', 'nature', 'history', 'culinary', 'sports', 'creative', 'wellness', 'teambuilding'],
            top: quizResults?.top_categories || []
          }
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
          description: "אנא נסו שוב או צרו קשר בטלפון 0537314235",
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

    // Send enhanced greeting
    let greeting = '';
    if (language === 'he') {
      if (quizResults) {
        const topCategory = quizResults.top_categories?.[0] || '';
        const percentage = quizResults.percentages?.[topCategory] || 0;
        greeting = `שלום! ראיתי שעשיתם את הQuiz שלנו ומצאתי משהו מעניין! אתם מתאימים במיוחד ל${topCategory} עם ${Math.round(percentage)}% התאמה. יש לנו כ-100 אפשרויות שונות, ואני כאן למצוא את המושלם. ספרו לי - כמה אנשים? תקציב?`;
      } else {
        greeting = 'שלום! אני סוכן דיגיטלי מומחה. יש לי גישה לכ-100 חוויות שונות בגלבוע ובית שאן. ספרו לי - כמה אנשים? מה מעניין אתכם?';
      }
    } else {
      if (quizResults) {
        const topCategory = quizResults.top_categories?.[0] || '';
        const percentage = quizResults.percentages?.[topCategory] || 0;
        greeting = `Hello! I saw your Quiz results - interesting! You're suited for ${topCategory} with ${Math.round(percentage)}% match. I have ~100 options. Tell me - how many people? Budget?`;
      } else {
        greeting = 'Hello! I am a digital expert. I have access to ~100 experiences in Gilboa and Beit Shean. Tell me - how many people? What interests you?';
      }
    }

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

  const handleLoadConversation = (item: any) => {
    setMessages(item.messages);
    setConversationId(item.id);
    
    toast({
      title: language === 'he' ? "שיחה נטענה" : "Conversation loaded",
      description: language === 'he' ? "השיחה שוחזרה בהצלחה" : "Conversation restored successfully"
    });
  };

  const handleQuickReply = async (reply: string) => {
    if (!isProcessing && !isSpeaking) {
      await handleVoiceInput(reply);
    }
  };

  const overallSentiment = getOverallSentiment(messages);

  const allQuickReplies = language === 'he' ? [
    { text: 'ספרו לי עוד על הפעילות', icon: Info },
    { text: 'אילו אפשרויות יש?', icon: ListChecks },
    { text: 'מה עולה הפעילות?', icon: DollarSign },
    { text: 'איפה נמצא המקום?', icon: MapPin },
    { text: 'כמה זמן נמשכת הפעילות?', icon: Clock },
    { text: 'מה כלול במחיר?', icon: Package },
    { text: 'איזו רמה פיזית דרושה?', icon: Activity },
    { text: 'האם מתאים לכל הגילאים?', icon: Users },
    { text: 'איך מזג האוויר משפיע?', icon: Cloud },
    { text: 'איך מבצעים הזמנה?', icon: Calendar },
    { text: 'איך מגיעים למקום?', icon: Navigation },
    { text: 'האם יש חניה במקום?', icon: ParkingCircle },
    { text: 'מה מדיניות הביטול?', icon: XCircle },
    { text: 'יש הנחה לקבוצות?', icon: UsersRound },
    { text: 'מה צריך להביא לפעילות?', icon: ShoppingBag },
    { text: 'איזה ביגוד מומלץ?', icon: Shirt },
    { text: 'צריך להגיע עם ציוד מיוחד?', icon: Backpack },
    { text: 'איך להתכונן לפעילות?', icon: ListChecks },
    { text: 'האם מספקים ציוד במקום?', icon: Box },
    { text: 'מה צריך ללבוש?', icon: Shirt },
    { text: 'האם צריך נעליים מיוחדות?', icon: Footprints }
  ] : [
    { text: 'Tell me more about the activity', icon: Info },
    { text: 'What options are available?', icon: ListChecks },
    { text: 'What is the cost?', icon: DollarSign },
    { text: 'Where is the location?', icon: MapPin },
    { text: 'How long is the activity?', icon: Clock },
    { text: 'What is included in the price?', icon: Package },
    { text: 'What physical level is required?', icon: Activity },
    { text: 'Is it suitable for all ages?', icon: Users },
    { text: 'How does weather affect it?', icon: Cloud },
    { text: 'How do I book?', icon: Calendar },
    { text: 'How do I get there?', icon: Navigation },
    { text: 'Is parking available?', icon: ParkingCircle },
    { text: 'What is the cancellation policy?', icon: XCircle },
    { text: 'Are there group discounts?', icon: UsersRound },
    { text: 'What should I bring?', icon: ShoppingBag },
    { text: 'What clothing is recommended?', icon: Shirt },
    { text: 'Do I need special equipment?', icon: Backpack },
    { text: 'How should I prepare?', icon: ListChecks },
    { text: 'Do you provide equipment?', icon: Box },
    { text: 'What should I wear?', icon: Shirt },
    { text: 'Do I need special shoes?', icon: Footprints }
  ];

  // Rotate quick replies randomly every 10 seconds with fade animation
  const [visibleReplies, setVisibleReplies] = useState<Array<{ text: string; icon: any }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const shuffleReplies = () => {
      // Trigger fade out
      setIsAnimating(true);
      
      // After fade out completes, shuffle and fade in
      setTimeout(() => {
        const shuffled = [...allQuickReplies].sort(() => Math.random() - 0.5);
        setVisibleReplies(shuffled.slice(0, 10));
        setIsAnimating(false);
      }, 300); // Match the CSS transition duration
    };
    
    shuffleReplies();
    const interval = setInterval(shuffleReplies, 10000);
    
    return () => clearInterval(interval);
  }, [language]);

  const quickReplies = visibleReplies;

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
          <img src={companyLogo} alt="לוגו טיולים עם דויד - סיורים מודרכים בצפון ישראל, הגלבוע ועמק המעיינות" className="w-10 h-10 rounded-lg object-cover" />
          <div className="relative">
            <Bot className="w-8 h-8 text-primary" />
            {isSpeaking && (
              <div className="absolute -top-1 -right-1">
                <SpeakingAnimation isActive={isSpeaking} size="sm" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {language === 'he' ? 'צ\'אט קולי - טיולים עם דויד' : 'Voice Chat - Tours with David'}
              {isSpeaking && (
                <VolumeIndicator isActive={isSpeaking} className="h-5" />
              )}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{language === 'he' ? 'חוויות בטבע עם הדרכה מקצועית 🌿' : 'Nature experiences with professional guidance 🌿'}</span>
              {messages.length > 2 && (
                <span className={`text-lg ${overallSentiment.color}`} title={language === 'he' ? 'מצב רוח' : 'Mood'}>
                  {overallSentiment.icon}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <ChatHistory 
            onLoadConversation={handleLoadConversation}
            currentConversationId={conversationId}
            language={language}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCategories(true)}
            title={language === 'he' ? 'הצג קטגוריות' : 'View Categories'}
          >
            <Eye className="w-5 h-5" />
          </Button>
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
            onClick={() => {
              stopElevenLabsSpeech();
              setIsSpeaking(false);
            }}
            title={language === 'he' ? 'השתק' : 'Mute'}
            className={isSpeaking ? 'text-destructive hover:text-destructive' : ''}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
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
          
          {/* Voice Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <label className="text-sm font-medium">{language === 'he' ? 'בחירת קול' : 'Voice Selection'}:</label>
              </div>
              {isSpeaking && <SpeakingAnimation isActive={isSpeaking} size="sm" />}
            </div>
            <VoiceSelector
              selectedVoice={selectedVoice}
              onVoiceChange={(voice) => {
                setSelectedVoice(voice);
                localStorage.setItem('preferred-voice', voice);
              }}
              className="w-full"
            />
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
                  <div className="flex items-start gap-2">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed flex-1">{msg.message}</p>
                    {msg.sentiment && msg.sender === 'user' && (
                      <span className={`text-base ${msg.sentiment.color}`} title={msg.sentiment.type}>
                        {msg.sentiment.icon}
                      </span>
                    )}
                  </div>
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
                <ProcessingAnimation isActive={isProcessing} language={language} />
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
          <div className={`flex flex-wrap gap-2 px-3 pb-3 ${language === 'he' ? 'flex-row-reverse' : ''} transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {quickReplies.map((reply, index) => {
              const Icon = reply.icon;
              return (
                <Button
                  key={`${reply.text}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  disabled={isProcessing || isSpeaking}
                  className="whitespace-nowrap text-xs hover:bg-primary/10 hover:border-primary transition-all duration-200 shadow-sm flex items-center gap-1.5 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {reply.text}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Voice Control */}
        <div className="p-6 bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <MicrophoneAnimation isActive={isListening} />
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing || isSpeaking}
                size="lg"
                className={`w-20 h-20 rounded-full relative z-10 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
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
              {isListening && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <WaveformVisualizer isActive={isListening} />
                </div>
              )}
            </div>
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

      {/* Categories Dialog */}
      <Dialog open={showCategories} onOpenChange={setShowCategories}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {language === 'he' ? '8 הקטגוריות שלנו' : 'Our 8 Categories'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              {language === 'he'
                ? 'כ-100 אפשרויות פעילות מחולקות ל-8 קטגוריות. הקטגוריות המודגשות הן המתאימות ביותר לפי ה-Quiz שלך.'
                : '~100 activity options divided into 8 categories. Highlighted categories are best suited based on your Quiz results.'
              }
            </p>
            <CategoryShowcase 
              quizResults={quizResults ? {
                topCategories: quizResults.top_categories || [],
                percentages: quizResults.percentages || {}
              } : undefined}
              language={language}
            />
            <div className="text-center pt-4">
              <Button onClick={() => setShowCategories(false)}>
                {language === 'he' ? 'סגור' : 'Close'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
