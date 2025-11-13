import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CategorySelector } from '@/components/CategorySelector';
import { CategoryBadge } from '@/components/CategoryBadge';
import { LanguageQualityBadge } from '@/components/LanguageQualityBadge';
import { VoiceTextInput } from '@/components/VoiceTextInput';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { AnswerSummary, ConversationData } from '@/components/AnswerSummary';
import { RecommendedTours } from '@/components/RecommendedTours';
import { ChatExport } from '@/components/ChatExport';
import { ConversationAnalytics } from '@/components/ConversationAnalytics';
import companyLogo from '@/assets/company-logo.png';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';
import { detectCategoriesInMessage } from '@/utils/categoryDetector';
import { sanitizeForTTS } from '@/utils/ttsSanitizer';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random()}`);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [typingPreview, setTypingPreview] = useState('');
  const [conversationData, setConversationData] = useState<ConversationData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<keyof ConversationData | null>(null);
  const [showRecommendedTours, setShowRecommendedTours] = useState(false);
  const [conversationStartTime] = useState(new Date());
  const [visibleSuggestionIndex, setVisibleSuggestionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const frequentQuestions = [
    "מה כלול במחיר?",
    "תנו לי הצעת מחיר",
    "מה להביא ביום הטיול?",
    "איך מגיעים למעיינות סחנה?",
    "האם יש אפשרות לטיול פרטי?",
    "כמה זמן לוקח הטיול?",
    "מה האקלים באזור?",
    "יש מסלולים מותאמים למשפחות?",
    "האם אפשר לשלב פעילות בניית צוות?",
    "מה השעות המומלצות לטיול?"
  ];

  const steps = [
    { id: 'categories', label: 'תחומי עניין', completed: !!conversationData.categories?.length, current: currentStep === 0 },
    { id: 'people', label: 'מספר אנשים', completed: !!conversationData.numberOfPeople, current: currentStep === 1 },
    { id: 'details', label: 'פרטים נוספים', completed: !!(conversationData.dates && conversationData.budget), current: currentStep === 2 },
    { id: 'summary', label: 'סיכום', completed: showSummary, current: currentStep === 3 }
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [messages]);

  // Rotate frequent questions slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSuggestionIndex((prev) => (prev + 3) % frequentQuestions.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [frequentQuestions.length]);

  useEffect(() => {
    // Send initial greeting with recommendations
    if (messages.length === 0) {
      const greeting = quizResults
        ? `שלום! ראיתי שעשית את הQuiz שלנו - מעולה.\n\n**4 ההמלצות המובילות שלנו:**\n1. 🌊 ביקור במעיינות סחנה - חוויה בטבע\n2. 🚙 רכבי שטח באזור הגלבוע - אדרנלין\n3. 🏛️ סיור בבית שאן העתיקה - תרבות\n4. 🍽️ ארוחה בכפר נחלל - קולינריה\n\nספרו לי - כמה אנשים אתם ומה הסיטואציה?`
        : `שלום! אני הסוכן הדיגיטלי של טיולים עם דוד.\n\n**4 ההמלצות המובילות שלנו:**\n1. 🌊 ביקור במעיינות סחנה - חוויה בטבע\n2. 🚙 רכבי שטח באזור הגלבוע - אדרנלין\n3. 🏛️ סיור בבית שאן העתיקה - תרבות\n4. 🍽️ ארוחה בכפר נחלל - קולינריה\n\nספרו לי - מה מעניין אתכם?`;

      setMessages([{
        id: '0',
        sender: 'ai',
        message: greeting,
        created_at: new Date().toISOString()
      }]);
      
      // Show category selector only if no quiz results
      if (!quizResults) {
        setShowCategorySelector(true);
      }
      
      // Speak the greeting
      setTimeout(() => speakText(greeting), 500);
    }
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;

    // Sanitize text for TTS
    const cleanText = sanitizeForTTS(text);
    if (!cleanText.trim()) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'he-IL';
    utterance.rate = 0.63; // 30% slower than 0.9
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a Hebrew voice
    const voices = window.speechSynthesis.getVoices();
    const hebrewVoice = voices.find(voice => voice.lang === 'he-IL' || voice.lang.startsWith('he'));
    if (hebrewVoice) {
      utterance.voice = hebrewVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleTyping = (text: string) => {
    // Show typing preview in real-time
    setTypingPreview(text);
  };

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
        description: "אנא נסו שוב או צרו קשר בטלפון 053-7314235",
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
      if (data.message.includes('דוד') || data.message.includes('053-7314235')) {
        setTimeout(() => {
          onRequestHumanAgent?.();
        }, 1000);
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסו שוב או צרו קשר בטלפון 053-7314235",
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
        <img src={companyLogo} alt="טיולים עם דוד" className="w-10 h-10 rounded-lg object-cover" />
        <div className="relative">
          <Bot className="w-8 h-8 text-primary" />
          <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse-slow" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">סוכן חכם - טיולים עם דוד</h3>
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
        {messages.length > 0 && !showCategorySelector && (
          <div className="mb-3 overflow-hidden">
            <div className="flex flex-wrap gap-2 transition-all duration-700 ease-in-out">
              {frequentQuestions
                .slice(visibleSuggestionIndex, visibleSuggestionIndex + 3)
                .concat(
                  visibleSuggestionIndex + 3 > frequentQuestions.length
                    ? frequentQuestions.slice(0, (visibleSuggestionIndex + 3) % frequentQuestions.length)
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
