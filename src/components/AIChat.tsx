import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategorySelector } from '@/components/CategorySelector';
import { AnswerSummary, ConversationData } from '@/components/AnswerSummary';
import { RecommendedTours } from '@/components/RecommendedTours';
import { ChatExport } from '@/components/ChatExport';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { VoiceTextInput } from '@/components/VoiceTextInput';
import { categoryMetadata } from '@/utils/activityCategories';
import { speakWithElevenLabs, stopElevenLabsSpeech, ElevenLabsVoice } from '@/utils/elevenLabsTTS';

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
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedVoice] = useState<ElevenLabsVoice>('Rachel');
  const [conversationData, setConversationData] = useState<ConversationData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<keyof ConversationData | null>(null);
  const [showRecommendedTours, setShowRecommendedTours] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const isEn = language === 'en';

  // Progress steps
  const steps = [
    { id: 'interests', label: isEn ? 'Interests' : 'תחומי עניין', completed: currentStep > 0, current: currentStep === 0 },
    { id: 'group', label: isEn ? 'Group Size' : 'גודל קבוצה', completed: currentStep > 1, current: currentStep === 1 },
    { id: 'details', label: isEn ? 'Details' : 'פרטים', completed: currentStep > 2, current: currentStep === 2 },
    { id: 'summary', label: isEn ? 'Summary' : 'סיכום', completed: currentStep > 3, current: currentStep === 3 },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const greetingSpokenRef = useRef(false);

  useEffect(() => {
    if (messages.length === 0 && !greetingSpokenRef.current) {
      const greeting = isEn
        ? (quizResults
          ? `Hi! 👋 I'm your tour advisor for Northern Israel.\n\nI see you've completed the Quiz — I'll tailor my recommendations to your preferences.\n\nHow many people are in your group? What kind of experience are you looking for?`
          : `Hi! 👋 I'm your tour advisor for Northern Israel — Gilboa, Galilee & the Springs Valley.\n\nTell me about your group and I'll find the perfect activities from our 100+ options.`)
        : (quizResults
          ? `שלום! 👋 אני יועץ הטיולים שלכם לצפון ישראל.\n\nראיתי שעשיתם את ה-Quiz — אתאים את ההמלצות להעדפות שלכם.\n\nכמה אנשים אתם? מה מעניין אתכם?`
          : `שלום! 👋 אני יועץ הטיולים שלכם — גלבוע, גליל ועמק המעיינות.\n\nספרו לי על הקבוצה שלכם ואמצא את הפעילויות המושלמות מתוך 100+ אפשרויות.`);

      setMessages([{
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      }]);
      
      greetingSpokenRef.current = true;
      if (!quizResults) setShowCategorySelector(true);
    }
  }, [quizResults, language]);

  const speakText = async (text: string) => {
    stopElevenLabsSpeech();
    await speakWithElevenLabs(
      text,
      selectedVoice,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      language === 'en' ? 'en' : 'he'
    );
  };

  const handleCategorySelect = async (categories: string[]) => {
    setShowCategorySelector(false);
    const categoryNames = categories.map(cat => categoryMetadata[cat as keyof typeof categoryMetadata]?.[isEn ? 'nameEn' : 'name'] || cat).join(', ');
    const userMessage = isEn ? `I'm interested in: ${categoryNames}` : `מעניין אותי: ${categoryNames}`;
    await sendMessage(userMessage);
  };

  const sendMessage = async (userMessage: string) => {
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
          quizResults,
          conversationData,
          currentStep,
          language: language === 'en' ? 'en' : 'he'
        }
      });

      if (error) throw error;
      if (data.error) {
        toast({ title: isEn ? "Error" : "שגיאה", description: data.fallback || data.error, variant: "destructive" });
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
      setQuickReplies(data.quickReplies || []);
      
      if (data.conversationData) {
        const updatedData = { ...conversationData, ...data.conversationData };
        setConversationData(updatedData);
        if (updatedData.categories?.length) setCurrentStep(Math.max(currentStep, 1));
        if (updatedData.numberOfPeople) setCurrentStep(Math.max(currentStep, 2));
        if (updatedData.dates && updatedData.budget) {
          setCurrentStep(3);
          setTimeout(() => setShowSummary(true), 1000);
        }
      }
      
      if (hasUserInteracted) speakText(data.message);

      if (data.message.includes('דויד') || data.message.includes('0537314235') || data.message.includes('David')) {
        setTimeout(() => onRequestHumanAgent?.(), 1000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: isEn ? "Send error" : "שגיאה בשליחה",
        description: isEn ? "Please try again or call 053-731-4235" : "אנא נסו שוב או צרו קשר בטלפון 0537314235",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;
    setHasUserInteracted(true);
    setShowCategorySelector(false);
    await sendMessage(userMessage);
  };

  const handleEditField = (field: keyof ConversationData) => {
    setEditingField(field);
    setShowSummary(false);
    const prompts: Record<keyof ConversationData, { he: string; en: string }> = {
      categories: { he: 'איזה קטגוריות מעניינות אותך?', en: 'Which categories interest you?' },
      numberOfPeople: { he: 'כמה אנשים משתתפים?', en: 'How many people are participating?' },
      situation: { he: 'מה הסיטואציה?', en: 'What\'s the occasion?' },
      dates: { he: 'מה התאריכים המועדפים?', en: 'What are your preferred dates?' },
      budget: { he: 'מה התקציב המשוער לאדם?', en: 'What\'s the estimated budget per person?' },
      specificInterests: { he: 'יש תחומי עניין ספציפיים?', en: 'Any specific interests?' },
      transport: { he: 'יש צורך בהסעות?', en: 'Do you need transportation?' }
    };
    const prompt = prompts[field][language] || prompts[field].he;
    const aiMessage: Message = {
      id: `edit-${Date.now()}`,
      sender: 'ai',
      message: isEn ? `Sure! ${prompt}` : `בטח! ${prompt}`,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);
    speakText(aiMessage.message);
  };

  const handleConfirmSummary = async () => {
    setIsLoading(true);
    setShowSummary(false);
    try {
      setShowRecommendedTours(true);
      const msg = isEn
        ? '🎉 Based on your details, here are the top 3 tour packages for you:'
        : '🎉 מצוין! על סמך הפרטים שלכם, הנה 3 החבילות המתאימות ביותר:';
      const aiMessage: Message = { id: `tours-${Date.now()}`, sender: 'ai', message: msg, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, aiMessage]);
      speakText(msg);
    } catch {
      toast({ title: isEn ? "Error" : "שגיאה", description: isEn ? "Could not generate recommendation." : "לא הצלחנו ליצור המלצה.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setConversationData({});
    setCurrentStep(0);
    setShowSummary(false);
    setShowRecommendedTours(false);
    setQuickReplies([]);
    greetingSpokenRef.current = false;
    setMessages([]);
  };

  const handleSelectTour = (tour: any) => {
    const message = isEn
      ? `Great choice — "${tour.title}"! Shall I arrange the details, or would you prefer a phone call?`
      : `מעולה! בחרתם ב"${tour.title}". רוצים שאתאם פרטים או לדבר בטלפון?`;
    const aiMessage: Message = { id: `tour-${Date.now()}`, sender: 'ai', message, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, aiMessage]);
    speakText(message);
    setShowRecommendedTours(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
      {/* Header with progress + actions */}
      <div className="px-4 py-3 border-b border-border/40 bg-muted/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">
              {isEn ? 'Text Chat' : 'צ\'אט טקסט'}
              {isSpeaking && (isEn ? ' • Speaking...' : ' • מדבר...')}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ChatExport messages={messages} conversationData={conversationData} conversationId={conversationId} />
            {messages.length > 1 && (
              <Button variant="ghost" size="sm" onClick={handleResetConversation} className="text-xs h-7 px-2 text-muted-foreground">
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        {/* Progress indicator — shows after first step */}
        {currentStep > 0 && (
          <ProgressIndicator steps={steps} className="pb-1" />
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {showSummary && (
            <div className="mb-4">
              <AnswerSummary data={conversationData} onEdit={handleEditField} onConfirm={handleConfirmSummary} isLoading={isLoading} />
            </div>
          )}

          {showRecommendedTours && (
            <div className="mb-4">
              <RecommendedTours conversationData={conversationData} onSelectTour={handleSelectTour} />
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                msg.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="border-t border-border/40 bg-background space-y-2">
        {/* Category selector */}
        {showCategorySelector && (
          <div className="px-3 pt-3">
            <CategorySelector onSelect={handleCategorySelect} disabled={isLoading} />
          </div>
        )}

        {/* Quick replies */}
        {quickReplies.length > 0 && !showCategorySelector && (
          <div className="flex gap-2 overflow-x-auto px-3 pt-2 pb-0 scrollbar-none">
            {quickReplies.slice(0, 5).map((reply, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSend(reply)}
                disabled={isLoading}
                className="text-xs whitespace-nowrap flex-shrink-0 rounded-full h-8"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}

        {/* Text + voice input */}
        <VoiceTextInput
          onSend={handleSend}
          onTyping={() => {}}
          isLoading={isLoading}
          placeholder={isEn ? "Type your message..." : "הקלידו את ההודעה שלכם..."}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
