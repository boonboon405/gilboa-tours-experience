import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Bot, User, Send, Trash2, Languages, Settings, Download, Sparkles, Eye, Info, DollarSign, MapPin, Clock, Package, Activity, Users, Cloud, Calendar, Navigation, ParkingCircle, XCircle, UsersRound, ShoppingBag, Shirt, Backpack, ListChecks, Box, Footprints, Globe, PhoneOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { speakWithElevenLabs, stopElevenLabsSpeech, ElevenLabsVoice, ELEVENLABS_VOICES } from '@/utils/elevenLabsTTS';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';
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

type SessionPhase = 'idle' | 'listening' | 'processing' | 'speaking';

interface VoiceChatProps {
  quizResults?: {
    id: string;
    top_categories: string[];
    percentages: Record<string, number>;
  };
}

export const VoiceChat = ({ quizResults }: VoiceChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [sessionActive, setSessionActive] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [textInput, setTextInput] = useState('');
  const { language, setLanguage } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice>(() => {
    const saved = localStorage.getItem('preferred-voice');
    return (saved as ElevenLabsVoice) || 'Rachel';
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const sessionActiveRef = useRef(false);
  const { toast } = useToast();

  // Keep ref in sync with state for use in callbacks
  useEffect(() => {
    sessionActiveRef.current = sessionActive;
  }, [sessionActive]);

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

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'he' ? 'he-IL' : 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        handleVoiceInput(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Don't show error for aborted (we abort on purpose when ending session)
      if (event.error === 'aborted') return;

      // For no-speech, auto re-arm if session is still active
      if (event.error === 'no-speech') {
        if (sessionActiveRef.current) {
          try { recognition.start(); } catch (e) { /* already started */ }
        } else {
          setPhase('idle');
        }
        return;
      }

      const errorMessages: Record<string, { he: string; en: string }> = {
        'not-allowed': { he: 'נדרשת הרשאת מיקרופון', en: 'Microphone permission required' },
        'network': { he: 'שגיאת רשת', en: 'Network error' },
        'audio-capture': { he: 'לא נמצא מיקרופון', en: 'No microphone found' },
      };
      
      const msg = errorMessages[event.error] || { 
        he: `שגיאה: ${event.error}`, 
        en: `Error: ${event.error}` 
      };
      
      toast({
        title: language === 'he' ? 'שגיאה' : 'Error',
        description: language === 'he' ? msg.he : msg.en,
        variant: 'destructive'
      });
      
      // End session on critical errors
      endSession();
    };

    recognition.onend = () => {
      // Auto re-arm if session is active and we're in listening phase
      // (onend fires after each recognition result in non-continuous mode)
      if (sessionActiveRef.current && phase === 'listening') {
        try { recognition.start(); } catch (e) { /* already started */ }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]);

  // Update recognition language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'he' ? 'he-IL' : 'en-US';
    }
  }, [language]);

  // Track if greeting has been spoken
  const greetingSpokenRef = useRef(false);

  useEffect(() => {
    if (messages.length === 0 && !greetingSpokenRef.current) {
      let greeting = '';
      
      if (language === 'he') {
        if (quizResults) {
          const topCategories = quizResults.top_categories?.slice(0, 3) || [];
          const categoryNamesHe: Record<string, string> = {
            adventure: 'הרפתקאות', nature: 'טבע', history: 'היסטוריה',
            culinary: 'קולינריה', sports: 'ספורט', creative: 'יצירה',
            wellness: 'בריאות ורוגע', teambuilding: 'גיבוש צוות'
          };
          const categoryNames = topCategories.map(c => categoryNamesHe[c] || c).join(', ');
          greeting = `שלום וברוכים הבאים! אני הסוכנת הדיגיטלית של אאוטדור ישראל.\n\nעל פי השאלון שמילאתם, הקטגוריות המתאימות לכם ביותר הן: ${categoryNames}.\n\nיש לנו למעלה ממאה פעילויות שונות באזור הגלבוע, עמק המעיינות, בית שאן, הכנרת והגליל.\n\nספרו לי, כמה אתם? מה מעניין אתכם במיוחד?`;
        } else {
          greeting = `שלום וברוכים הבאים! אני הסוכנת הדיגיטלית של אאוטדור ישראל.\n\nאנחנו מתמחים בימי כיף, סיורים וחוויות בצפון ישראל, מהגלבוע ועד הכנרת, מהגולן ועד עמק יזרעאל.\n\nיש לנו למעלה ממאה פעילויות בשמונה קטגוריות שונות: הרפתקאות, טבע, היסטוריה, קולינריה, ספורט, יצירה, בריאות ורוגע וגיבוש צוות.\n\nספרו לי, כמה אתם? מה מעניין אתכם?`;
        }
      } else {
        if (quizResults) {
          const topCategories = quizResults.top_categories?.slice(0, 3) || [];
          const categoryNamesEn: Record<string, string> = {
            adventure: 'Adventure', nature: 'Nature', history: 'History',
            culinary: 'Culinary', sports: 'Sports', creative: 'Creative',
            wellness: 'Wellness', teambuilding: 'Team Building'
          };
          const categoryNames = topCategories.map(c => categoryNamesEn[c] || c).join(', ');
          greeting = `Hello and welcome! I'm the digital agent of Outdoor Israel.\n\nBased on your quiz results, your top matching categories are: ${categoryNames}.\n\nWe offer over one hundred different activities in the Gilboa region, Springs Valley, Beit Shean, Sea of Galilee, and the Galilee.\n\nTell me, how many people are in your group? What interests you most?`;
        } else {
          greeting = `Hello and welcome! I'm the digital agent of Outdoor Israel.\n\nWe specialize in day trips, tours, and experiences in Northern Israel, from the Gilboa mountains to the Sea of Galilee, from the Golan Heights to the Jezreel Valley.\n\nWe offer over one hundred activities across eight categories: Adventure, Nature, History, Culinary, Sports, Creative, Wellness, and Team Building.\n\nTell me, how many people? What interests you?`;
        }
      }

      const initialMsg: Message = {
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      };
      setMessages([initialMsg]);
      greetingSpokenRef.current = true;
    }
  }, [language, quizResults]);

  const handleLanguageChange = (newLang: 'he' | 'en') => {
    if (newLang !== language) {
      endSession();
      greetingSpokenRef.current = false;
      setMessages([]);
      setLanguage(newLang);
    }
  };

  const speakText = useCallback(async (text: string, onDone?: () => void) => {
    stopElevenLabsSpeech();
    setPhase('speaking');
    
    await speakWithElevenLabs(
      text,
      selectedVoice,
      () => setPhase('speaking'),
      () => {
        setPhase(sessionActiveRef.current ? 'listening' : 'idle');
        onDone?.();
      },
      language
    );
  }, [selectedVoice, language]);

  const handleVoiceInput = useCallback(async (transcript: string) => {
    if (!transcript.trim()) return;

    setPhase('processing');

    const sentiment = analyzeSentiment(transcript);
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      sender: 'user',
      message: transcript,
      created_at: new Date().toISOString(),
      sentiment
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      let enhancedMessage = transcript;
      if (quizResults && messages.length <= 3) {
        const topCats = quizResults.top_categories?.slice(0, 3) || [];
        const percentages = topCats.map(cat => `${cat}: ${quizResults.percentages?.[cat] || 0}%`).join(', ');
        enhancedMessage = `[CONTEXT: User completed Quiz. Top 3 categories: ${percentages}. 8 total categories available: Adventure, Nature, History, Culinary, Sports, Creative, Wellness, Team Building. ~100 activity options across these categories in Gilboa and Beit Shean region. Use this data to recommend from the most suitable categories.] ${transcript}`;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: enhancedMessage,
          conversationId,
          sessionId,
          quizResults,
          language,
          categories: {
            all: ['adventure', 'nature', 'history', 'culinary', 'sports', 'creative', 'wellness', 'teambuilding'],
            top: quizResults?.top_categories || []
          }
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: language === 'he' ? 'שגיאה' : 'Error',
          description: data.fallback || data.error,
          variant: 'destructive'
        });
        setPhase(sessionActiveRef.current ? 'listening' : 'idle');
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

      // Speak the response; on done, auto re-arm mic if session active
      await speakText(data.message, () => {
        if (sessionActiveRef.current && recognitionRef.current) {
          try {
            recognitionRef.current.lang = language === 'he' ? 'he-IL' : 'en-US';
            recognitionRef.current.start();
          } catch (e) { /* already started */ }
        }
      });

    } catch (error) {
      console.error('Voice chat error:', error);
      toast({
        title: language === 'he' ? 'שגיאה בעיבוד' : 'Processing Error',
        description: language === 'he' ? 'אנא נסו שוב או צרו קשר בטלפון 0537314235' : 'Please try again or call 0537314235',
        variant: 'destructive'
      });
      setPhase(sessionActiveRef.current ? 'listening' : 'idle');
    }
  }, [conversationId, sessionId, quizResults, language, speakText, messages.length, toast]);

  const startSession = useCallback(async () => {
    if (!recognitionRef.current) return;
    
    try {
      // Request mic permission once at session start
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setSessionActive(true);
      sessionActiveRef.current = true;
      setPhase('listening');
      
      recognitionRef.current.lang = language === 'he' ? 'he-IL' : 'en-US';
      recognitionRef.current.start();
      
      toast({
        title: language === 'he' ? '🎤 שיחה התחילה' : '🎤 Session Started',
        description: language === 'he' ? 'דברו בחופשיות, אני מקשיב...' : 'Speak freely, I\'m listening...',
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error starting session:', error);
      toast({
        title: language === 'he' ? 'שגיאת מיקרופון' : 'Microphone Error',
        description: language === 'he' 
          ? 'לא ניתן לגשת למיקרופון. אנא אפשרו גישה בהגדרות הדפדפן'
          : 'Cannot access microphone. Please allow access in browser settings',
        variant: 'destructive'
      });
    }
  }, [language, toast]);

  const endSession = useCallback(() => {
    setSessionActive(false);
    sessionActiveRef.current = false;
    setPhase('idle');
    
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
    }
    stopElevenLabsSpeech();
  }, []);

  const toggleSession = useCallback(() => {
    if (sessionActive) {
      endSession();
    } else {
      startSession();
    }
  }, [sessionActive, startSession, endSession]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = textInput.trim();
    
    if (message && phase !== 'processing') {
      setTextInput('');
      await handleVoiceInput(message);
    }
  };

  const handleClearChat = () => {
    endSession();
    setMessages([]);
    setConversationId(null);
    setSessionId(`session-${Date.now()}-${Math.random()}`);
    setTextInput('');
    greetingSpokenRef.current = false;

    // Re-trigger greeting
    let greeting = '';
    if (language === 'he') {
      greeting = quizResults
        ? `שלום! ראיתי שעשיתם את הQuiz שלנו. יש לנו כ-100 אפשרויות שונות, ואני כאן למצוא את המושלם. ספרו לי - כמה אנשים? תקציב?`
        : 'שלום! אני סוכן דיגיטלי מומחה. יש לי גישה לכ-100 חוויות שונות בגלבוע ובית שאן. ספרו לי - כמה אנשים? מה מעניין אתכם?';
    } else {
      greeting = quizResults
        ? `Hello! I saw your Quiz results. I have ~100 options. Tell me - how many people? Budget?`
        : 'Hello! I have access to ~100 experiences in Gilboa and Beit Shean. Tell me - how many people? What interests you?';
    }

    setMessages([{
      id: '0',
      sender: 'ai',
      message: greeting,
      created_at: new Date().toISOString()
    }]);
    greetingSpokenRef.current = true;

    toast({
      title: language === 'he' ? 'שיחה חדשה' : 'New Conversation',
      description: language === 'he' ? 'השיחה אופסה בהצלחה' : 'Chat cleared successfully'
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
      title: language === 'he' ? 'שיחה יוצאה' : 'Chat Exported',
      description: language === 'he' ? 'הקובץ הורד בהצלחה' : 'File downloaded successfully'
    });
  };

  const handleLoadConversation = (item: any) => {
    setMessages(item.messages);
    setConversationId(item.id);
    toast({
      title: language === 'he' ? 'שיחה נטענה' : 'Conversation loaded',
      description: language === 'he' ? 'השיחה שוחזרה בהצלחה' : 'Conversation restored successfully'
    });
  };

  const handleQuickReply = (reply: string) => {
    if (phase !== 'processing' && phase !== 'speaking') {
      setTextInput(reply);
    }
  };

  const overallSentiment = getOverallSentiment(messages);

  const allQuickReplies = useMemo(() => language === 'he' ? [
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
    { text: 'Do I need special shoes?', icon: Footprints }
  ], [language]);

  const [visibleReplies, setVisibleReplies] = useState<Array<{ text: string; icon: any }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    const shuffleReplies = () => {
      setIsAnimating(true);
      setTimeout(() => {
        const shuffled = [...allQuickReplies].sort(() => Math.random() - 0.5);
        setVisibleReplies(shuffled.slice(0, 20));
        setIsAnimating(false);
      }, 300);
    };
    shuffleReplies();
    const interval = setInterval(shuffleReplies, 10000);
    return () => clearInterval(interval);
  }, [allQuickReplies]);

  const quickReplies = visibleReplies;

  // Derive booleans for UI
  const isListening = phase === 'listening';
  const isSpeaking = phase === 'speaking';
  const isProcessing = phase === 'processing';

  if (!speechSupported) {
    return (
      <Card className="flex flex-col items-center justify-center h-[600px] max-w-4xl mx-auto p-8 text-center">
        <MicOff className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {language === 'he' ? 'צ\'אט קולי לא נתמך' : 'Voice chat not supported'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'he' ? 'אנא השתמשו ב-Chrome, Edge או Safari לתמיכה מלאה בקול' : 'Please use Chrome, Edge or Safari for full voice support'}
        </p>
      </Card>
    );
  }

  // Phase-based mic button styles
  const getMicButtonStyles = () => {
    if (sessionActive) {
      switch (phase) {
        case 'listening': return 'bg-green-500 hover:bg-green-600 ring-4 ring-green-500/30 animate-pulse';
        case 'processing': return 'bg-amber-500 hover:bg-amber-600 ring-4 ring-amber-500/30';
        case 'speaking': return 'bg-blue-500 hover:bg-blue-600 ring-4 ring-blue-500/30';
        default: return 'bg-primary hover:bg-primary/90';
      }
    }
    return 'bg-primary hover:bg-primary/90';
  };

  const getMicIcon = () => {
    if (sessionActive) {
      switch (phase) {
        case 'listening': return <Mic className="w-8 h-8 text-white" />;
        case 'processing': return <Loader2 className="w-8 h-8 text-white animate-spin" />;
        case 'speaking': return <Volume2 className="w-8 h-8 text-white" />;
        default: return <Mic className="w-8 h-8 text-white" />;
      }
    }
    return <MicOff className="w-8 h-8" />;
  };

  const getStatusText = () => {
    if (language === 'he') {
      if (!sessionActive) return 'לחצו על המיקרופון להתחלת שיחה';
      switch (phase) {
        case 'listening': return '🎤 מקשיב... דברו עכשיו';
        case 'processing': return '⚙️ מעבד את הבקשה...';
        case 'speaking': return '🔊 הסוכן מדבר...';
        default: return '🎤 שיחה פעילה';
      }
    }
    if (!sessionActive) return 'Click the microphone to start conversation';
    switch (phase) {
      case 'listening': return '🎤 Listening... speak now';
      case 'processing': return '⚙️ Processing your request...';
      case 'speaking': return '🔊 Agent is speaking...';
      default: return '🎤 Session active';
    }
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto border-border/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-3">
          <img src={companyLogo} alt="לוגו טיולים עם דויד" className="w-10 h-10 rounded-lg object-cover" />
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
              {isSpeaking && <VolumeIndicator isActive={isSpeaking} className="h-5" />}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{language === 'he' ? 'חוויות בטבע עם הדרכה מקצועית 🌿' : 'Nature experiences with professional guidance 🌿'}</span>
              {sessionActive && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {language === 'he' ? 'שיחה פעילה' : 'Live'}
                </span>
              )}
              {messages.length > 2 && (
                <span className={`text-lg ${overallSentiment.color}`} title={language === 'he' ? 'מצב רוח' : 'Mood'}>
                  {overallSentiment.icon}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-background/60 rounded-lg px-2 py-1 border border-border/50">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={language === 'he' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleLanguageChange('he')}
              className="h-7 px-2 gap-1"
              title="עברית"
            >
              <span className="text-base">🇮🇱</span>
              <span className="text-xs hidden sm:inline">עברית</span>
            </Button>
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleLanguageChange('en')}
              className="h-7 px-2 gap-1"
              title="English"
            >
              <span className="text-base">🇺🇸</span>
              <span className="text-xs hidden sm:inline">EN</span>
            </Button>
          </div>
          
          {/* Settings Button */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm hidden sm:inline">{language === 'he' ? 'הגדרות' : 'Settings'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? 'הגדרות קול' : 'Voice Settings'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ChatHistory 
                    onLoadConversation={handleLoadConversation}
                    currentConversationId={conversationId}
                    language={language}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? 'היסטוריית שיחות' : 'Chat History'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowCategories(true)}>
                  <Eye className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? 'הצג קטגוריות' : 'View Categories'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleExportChat} disabled={messages.length === 0}>
                  <Download className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? 'ייצא שיחה' : 'Export Chat'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleClearChat}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? 'נקה שיחה' : 'Clear Chat'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    stopElevenLabsSpeech();
                    if (sessionActiveRef.current) {
                      setPhase('listening');
                      try { recognitionRef.current?.start(); } catch (e) { /* */ }
                    } else {
                      setPhase('idle');
                    }
                  }}
                  className={isSpeaking ? 'text-destructive hover:text-destructive' : ''}
                >
                  {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{language === 'he' ? (isSpeaking ? 'השתק' : 'קול') : (isSpeaking ? 'Mute' : 'Voice')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            <Select value={language} onValueChange={(value: 'he' | 'en') => handleLanguageChange(value)}>
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
                toast({ title: `🔊 ${language === 'he' ? 'קול נבחר' : 'Voice selected'}: ${ELEVENLABS_VOICES[voice].name}`, duration: 2000 });
              }}
              language={language}
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
          <div className={`grid grid-cols-5 gap-2 px-3 pb-3 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} dir={language === 'he' ? 'rtl' : 'ltr'}>
            {quickReplies.map((reply, index) => {
              const Icon = reply.icon;
              return (
                <Button
                  key={`${reply.text}-${index}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  disabled={isProcessing || isSpeaking}
                  className="whitespace-nowrap text-xs hover:bg-primary/10 hover:border-primary transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{reply.text}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Voice Control - Session Toggle */}
        <div className="p-6 bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {isListening && <MicrophoneAnimation isActive={true} />}
              <Button
                onClick={toggleSession}
                size="lg"
                className={`w-20 h-20 rounded-full relative z-10 transition-all duration-300 ${getMicButtonStyles()}`}
              >
                {getMicIcon()}
              </Button>
              {isListening && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                  <WaveformVisualizer isActive={true} />
                </div>
              )}
            </div>
            <div className="space-y-2 w-full max-w-md">
              <p className="text-base font-medium text-foreground text-center px-4 py-2 bg-background/80 rounded-lg border border-border/50">
                {getStatusText()}
              </p>
              {sessionActive && (
                <button 
                  onClick={endSession}
                  className="flex items-center justify-center gap-1.5 mx-auto text-sm text-destructive hover:text-destructive/80 transition-colors"
                >
                  <PhoneOff className="w-3.5 h-3.5" />
                  {language === 'he' ? 'סיום שיחה' : 'End Session'}
                </button>
              )}
              {!sessionActive && (
                <p className="text-sm text-foreground/70 text-center px-3 py-1.5 bg-accent/10 rounded-md">
                  {language === 'he' 
                    ? 'לחצו להתחלת שיחה חופשית — hands-free'
                    : 'Click to start a hands-free conversation'
                  }
                </p>
              )}
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
