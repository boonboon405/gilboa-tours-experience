import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot, User, Sparkles, RotateCcw, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { CategorySelector } from '@/components/CategorySelector';
import { CategoryBadge } from '@/components/CategoryBadge';
import { LanguageQualityBadge } from '@/components/LanguageQualityBadge';
import { VoiceTextInput } from '@/components/VoiceTextInput';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AnswerSummary, ConversationData } from '@/components/AnswerSummary';
import { RecommendedTours } from '@/components/RecommendedTours';
import { ChatExport } from '@/components/ChatExport';
import { ConversationAnalytics } from '@/components/ConversationAnalytics';
import { SpeakingAnimation } from '@/components/SpeakingAnimation';
import { VoiceSelector } from '@/components/VoiceSelector';
import companyLogo from '@/assets/company-logo.png';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';
import { detectCategoriesInMessage } from '@/utils/categoryDetector';
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
  const [selectedVoice, setSelectedVoice] = useState<ElevenLabsVoice>('Rachel');
  const [typingPreview, setTypingPreview] = useState('');
  const [conversationData, setConversationData] = useState<ConversationData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<keyof ConversationData | null>(null);
  const [showRecommendedTours, setShowRecommendedTours] = useState(false);
  const [conversationStartTime] = useState(new Date());
  const [visibleSuggestionIndex, setVisibleSuggestionIndex] = useState(0);
  const [faqQuestions, setFaqQuestions] = useState<string[]>([]);
  const [isPausedOnHover, setIsPausedOnHover] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const steps = [
    { id: 'categories', label: 'תחומי עניין', completed: !!conversationData.categories?.length, current: currentStep === 0 },
    { id: 'people', label: 'מספר אנשים', completed: !!conversationData.numberOfPeople, current: currentStep === 1 },
    { id: 'details', label: 'פרטים נוספים', completed: !!(conversationData.dates && conversationData.budget), current: currentStep === 2 },
    { id: 'summary', label: 'סיכום', completed: showSummary, current: currentStep === 3 }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [messages]);

  // Fetch FAQ questions from database
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('question')
          .eq('is_active', true)
          .order('priority', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setFaqQuestions(data.map(faq => faq.question));
        }
      } catch (error) {
        console.error('Error fetching FAQ questions:', error);
      }
    };

    fetchFAQs();
  }, []);

  // Rotate FAQ questions slowly
  useEffect(() => {
    if (faqQuestions.length === 0 || isPausedOnHover) return;
    
    const interval = setInterval(() => {
      setVisibleSuggestionIndex((prev) => (prev + 3) % faqQuestions.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [faqQuestions.length, isPausedOnHover]);

  // Keyboard navigation for FAQ
  useEffect(() => {
    if (faqQuestions.length === 0) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleNavigateFAQ('next');
      } else if (e.key === 'ArrowRight') {
        handleNavigateFAQ('prev');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [faqQuestions.length]);

  // Track if greeting has been spoken to prevent duplicate TTS
  const greetingSpokenRef = useRef(false);

  useEffect(() => {
    // Send initial greeting with recommendations
    if (messages.length === 0 && !greetingSpokenRef.current) {
      const greeting = quizResults
        ? `שלום! אני מומחה לסיוריים ומציע חוויות:
🔥 הרפתקאות  |  💧 טבע  |  🏛️ דברי הימים  |  🍷 יין ואומנות הבישול  |  ⚡ ספורט  |  🎨 יצירה  |  🌿 בריאות  |  🤝 גיבוש צוות

ראיתי שעשית את הQuiz - מעולה! ברצוני להמליץ על פעילויות שיתאימו לכם.
ספרו לי - כמה אנשים אתם? ספרו מה מעניין אתכם?`
        : `שלום! אני מומחה לסיוריים ומציע חוויות:
🔥 הרפתקאות  |  💧 טבע  |  🏛️ דברי הימים  |  🍷 יין ואומנות הבישול  |  ⚡ ספורט  |  🎨 יצירה  |  🌿 בריאות  |  🤝 גיבוש צוות

ענו על השאלות , ברצוני להמליץ על פעילויות שיתאימו לכם
ספרו לי - כמה אנשים אתם? ספרו מה מעניין אתכם? 100 פעילויות שמחכות לכם!`;

      setMessages([{
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      }]);
      
      greetingSpokenRef.current = true;
      
      // Show category selector only if no quiz results
      if (!quizResults) {
        setShowCategorySelector(true);
      }
      
      // Don't auto-play greeting - browser blocks autoplay without user interaction
      // TTS will play after the user's first interaction
    }
  }, [quizResults, language]);

  const speakText = async (text: string) => {
    // Stop any ongoing speech
    stopElevenLabsSpeech();
    
    // Use ElevenLabs for high-quality TTS
    await speakWithElevenLabs(
      text,
      selectedVoice,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      language === 'en' ? 'en' : 'he'
    );
  };

  const handleTyping = (text: string) => {
    // Show typing preview in real-time
    setTypingPreview(text);
  };

  const handleNavigateFAQ = (direction: 'prev' | 'next') => {
    if (faqQuestions.length === 0) return;
    
    setVisibleSuggestionIndex((prev) => {
      if (direction === 'next') {
        return (prev + 3) % faqQuestions.length;
      } else {
        return prev - 3 < 0 ? Math.max(0, faqQuestions.length - 3) : prev - 3;
      }
    });
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNavigateFAQ('next');
    } else if (isRightSwipe) {
      handleNavigateFAQ('prev');
    }
  };

  const getCurrentSet = () => Math.floor(visibleSuggestionIndex / 3) + 1;
  const getTotalSets = () => Math.ceil(faqQuestions.length / 3);

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
          quizResults,
          language: language === 'en' ? 'en' : 'he'
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
        description: "אנא נסו שוב או צרו קשר בטלפון 0537314235",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    console.log('📝 User message received:', userMessage);
    
    setShowCategorySelector(false);
    setTypingPreview(''); // Clear typing preview
    
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
      console.log('🚀 Sending to AI agent...');
      const { data, error } = await supabase.functions.invoke('ai-chat-agent', {
        body: {
          message: userMessage,
          conversationId,
          sessionId,
          quizResults,
          conversationData,
          currentStep
        }
      });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      if (data.error) {
        console.error('❌ AI agent error:', data.error);
        toast({
          title: "שגיאה",
          description: data.fallback || data.error,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ AI response received:', data.message?.substring(0, 50) + '...');
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
      
      // Handle conversation data updates
      if (data.conversationData) {
        const updatedData = { ...conversationData, ...data.conversationData };
        setConversationData(updatedData);
        
        // Update progress
        if (updatedData.categories?.length) setCurrentStep(Math.max(currentStep, 1));
        if (updatedData.numberOfPeople) setCurrentStep(Math.max(currentStep, 2));
        if (updatedData.dates && updatedData.budget) {
          setCurrentStep(3);
          setTimeout(() => setShowSummary(true), 1000);
        }
      }
      
      // Show alert if Arabic detected
      if (data.languageQuality?.arabicDetected) {
        toast({
          title: "⚠️ זוהתה שפה לא תקינה",
          description: `זוהו מילים ערביות: ${data.languageQuality.arabicWords?.join(', ')}`,
          variant: "destructive",
        });
      }
      
      // Speak the AI response
      speakText(data.message);
      
      // Update quick replies
      if (data.quickReplies && data.quickReplies.length > 0) {
        setQuickReplies(data.quickReplies);
      }

      // Check if human agent is needed
      if (data.message.includes('דויד') || data.message.includes('0537314235')) {
        setTimeout(() => {
          onRequestHumanAgent?.();
        }, 1000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסו שוב או צרו קשר בטלפון 0537314235",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleEditField = (field: keyof ConversationData) => {
    setEditingField(field);
    setShowSummary(false);
    
    const fieldPrompts: Record<keyof ConversationData, string> = {
      categories: 'איזה קטגוריות מעניינות אותך?',
      numberOfPeople: 'כמה אנשים משתתפים?',
      situation: 'מה הסיטואציה? (יום צוות, יום גיבוש, וכו\')',
      dates: 'מה התאריכים המועדפים?',
      budget: 'מה התקציב המשוער לאדם?',
      specificInterests: 'יש תחומי עניין ספציפיים?',
      transport: 'יש צורך בהסעות?'
    };
    
    const prompt = fieldPrompts[field];
    const aiMessage: Message = {
      id: `edit-${Date.now()}`,
      sender: 'ai',
      message: `בטח! בואו נעדכן את זה. ${prompt}`,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    speakText(aiMessage.message);
  };

  const handleConfirmSummary = async () => {
    setIsLoading(true);
    setShowSummary(false);
    
    try {
      // Show recommended tours instead of text recommendation
      setShowRecommendedTours(true);
      
      // Add a message explaining the tours
      const aiMessage: Message = {
        id: `tours-${Date.now()}`,
        sender: 'ai',
        message: '🎉 מצוין! על סמך כל הפרטים שלכם, בחרתי את 3 החבילות המתאימות ביותר. צפו למטה:',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiMessage.message);
      
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו ליצור המלצה. אנא נסו שוב.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = () => {
    setConversationData({});
    setCurrentStep(0);
    setShowSummary(false);
    setShowRecommendedTours(false);
    setMessages([{
      id: '0',
      sender: 'ai',
      message: 'בואו נתחיל מחדש! מה מעניין אתכם?',
      created_at: new Date().toISOString()
    }]);
  };

  const handleSelectTour = (tour: any) => {
    const message = `מעולה! בחרתם ב"${tour.title}". אשמח לתאם את הפרטים הסופיים איתכם. רוצים שאצור קשר טלפוני או להמשיך כאן?`;
    const aiMessage: Message = {
      id: `tour-selected-${Date.now()}`,
      sender: 'ai',
      message,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, aiMessage]);
    speakText(message);
    setShowRecommendedTours(false);
  };

  return (
    <Card className="flex flex-col h-[600px] max-w-4xl mx-auto border-border/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10">
        <img src={companyLogo} alt="לוגו טיולים עם דויד - סיורים מודרכים בצפון ישראל, הגלבוע ועמק המעיינות" className="w-10 h-10 rounded-lg object-cover" />
        <div className="relative">
          <Bot className="w-8 h-8 text-primary" />
          {isSpeaking ? (
            <div className="absolute -top-1 -right-1">
              <SpeakingAnimation isActive={isSpeaking} size="sm" />
            </div>
          ) : (
            <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse-slow" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            סוכן חכם - טיולים עם דויד
            {isSpeaking && (
              <span className="text-xs text-primary animate-pulse">מדבר...</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">חוויות בטבע עם הדרכה מקצועית 🌿</p>
        </div>
        <div className="flex items-center gap-2">
          <ChatExport 
            messages={messages}
            conversationData={conversationData}
            conversationId={conversationId}
          />
          {conversationData.numberOfPeople && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetConversation}
              className="text-xs"
            >
              <RotateCcw className="w-4 h-4 ml-1" />
              התחל מחדש
            </Button>
          )}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="p-4 border-b border-border/50 bg-background">
        <ProgressIndicator steps={steps} />
      </div>

      {/* Analytics */}
      {messages.length > 2 && (
        <div className="px-4 pt-4">
          <ConversationAnalytics 
            messages={messages}
            startTime={conversationStartTime}
            conversationData={conversationData}
          />
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Show Summary if ready */}
          {showSummary && (
            <div className="mb-4">
              <AnswerSummary
                data={conversationData}
                onEdit={handleEditField}
                onConfirm={handleConfirmSummary}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Show Recommended Tours */}
          {showRecommendedTours && (
            <div className="mb-4">
              <RecommendedTours
                conversationData={conversationData}
                onSelectTour={handleSelectTour}
              />
            </div>
          )}

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
        {/* Frequent Questions - Rotating */}
        {messages.length > 0 && !showCategorySelector && faqQuestions.length > 0 && (
          <div className="mb-3">
            <div 
              className="overflow-hidden"
              onMouseEnter={() => setIsPausedOnHover(true)}
              onMouseLeave={() => setIsPausedOnHover(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigateFAQ('prev')}
                  disabled={isLoading}
                  className="flex-shrink-0 h-8 w-8 hover:bg-muted"
                  aria-label="שאלות קודמות"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <div className="flex flex-wrap gap-2 flex-1 transition-all duration-700 ease-in-out">
                  {faqQuestions
                    .slice(visibleSuggestionIndex, visibleSuggestionIndex + 3)
                    .concat(
                      visibleSuggestionIndex + 3 > faqQuestions.length
                        ? faqQuestions.slice(0, (visibleSuggestionIndex + 3) % faqQuestions.length)
                        : []
                    )
                    .map((question, index) => (
                      <Button
                        key={`${visibleSuggestionIndex}-${index}`}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSend(question)}
                        className="text-xs animate-in fade-in slide-in-from-bottom-2 duration-500"
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigateFAQ('next')}
                  disabled={isLoading}
                  className="flex-shrink-0 h-8 w-8 hover:bg-muted"
                  aria-label="שאלות הבאות"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: getTotalSets() }).map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === getCurrentSet() - 1
                        ? 'w-6 bg-primary'
                        : 'w-1.5 bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {getCurrentSet()}/{getTotalSets()}
              </span>
            </div>
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
                onClick={() => handleQuickReply(reply)}
                className="text-xs"
                disabled={isLoading}
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
        
        {/* Voice Speed Control */}
        {/* Voice Settings */}
        <div className="mb-3 p-3 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              הגדרות קול
            </label>
            <div className="flex items-center gap-2">
              <VoiceSelector
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
              />
              {isSpeaking && (
                <SpeakingAnimation isActive={isSpeaking} size="sm" />
              )}
            </div>
          </div>
        </div>
        
        {/* Typing Preview */}
        {typingPreview && !isLoading && (
          <div className="mb-2 p-2 bg-muted/30 rounded-lg text-sm text-muted-foreground italic border border-dashed border-border">
            מקליד: {typingPreview}
          </div>
        )}
      </div>

      {/* Voice & Text Input */}
      <VoiceTextInput
        onSend={handleSend}
        onTyping={handleTyping}
        isLoading={isLoading}
        placeholder="הקלידו או דברו את התשובה שלכם..."
        disabled={isLoading}
      />

      <p className="text-xs text-muted-foreground p-2 text-center">
        רוצים לדבר עם בן אדם? רק תגידו • {isSpeaking && '🔊 מדבר...'}
      </p>
    </Card>
  );
};
