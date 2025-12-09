import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { Sparkles, Brain, CheckCircle2, RotateCcw } from 'lucide-react';
import { QuizResults } from '@/utils/quizScoring';
import { Badge } from '@/components/ui/badge';
import { forceResetClientData } from '@/utils/clientSession';
import { useToast } from '@/hooks/use-toast';
import { playSound } from '@/utils/soundEffects';
import confetti from 'canvas-confetti';

interface QuizCategoryIntegrationProps {
  onQuizComplete?: (results: QuizResults) => void;
  language?: 'he' | 'en';
}

export const QuizCategoryIntegration = ({ onQuizComplete, language = 'he' }: QuizCategoryIntegrationProps) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(() => {
    const stored = localStorage.getItem('teamDNAResults');
    return stored ? JSON.parse(stored) : null;
  });
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();

  // Determine current step
  const getCurrentStep = () => {
    if (!quizResults && !showQuiz) return 1; // Not started or starting quiz
    if (showQuiz) return 1; // Currently taking quiz
    if (quizResults) return 3; // Quiz completed, showing recommendations
    return 2; // Processing (transition state)
  };

  const currentStep = getCurrentStep();

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setShowQuiz(false);
    localStorage.setItem('teamDNAResults', JSON.stringify(results));
    localStorage.setItem('quizResults', JSON.stringify({
      id: `quiz-${Date.now()}`,
      top_categories: results.topCategories,
      percentages: results.percentages
    }));
    
    // Celebration effect
    playSound('complete', 0.4);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    onQuizComplete?.(results);
  };

  const handleRetakeQuiz = () => {
    playSound('click', 0.2);
    setShowQuiz(true);
  };

  const handleResetQuiz = () => {
    playSound('whoosh', 0.2);
    setIsResetting(true);
    
    // Animate then reset
    setTimeout(() => {
      forceResetClientData();
      setQuizResults(null);
      setIsResetting(false);
      playSound('notification', 0.3);
      toast({
        title: language === 'he' ? '✨ ה-Quiz אופס' : '✨ Quiz Reset',
        description: language === 'he' ? 'כל הנתונים נמחקו, אפשר להתחיל מחדש' : 'All data cleared, you can start fresh',
      });
    }, 600);
  };

  const handleStartQuiz = () => {
    playSound('click', 0.2);
    setShowQuiz(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Brain className="w-7 h-7 text-primary" />
            {language === 'he' ? '8 הקטגוריות שלנו + Quiz אישי' : '8 Categories + Personal Quiz'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {language === 'he' 
              ? '100 אפשרויות ופעילויות שמחכות לכם בגלבוע ,בעמק המעיינות, סובב כנרת ובגליל, מחולקות לקטגוריות. ענו על Quiz ונציג לכם את המתאים ביותר!'
              : 'We have 100+ activity options in Gilboa and Beit Shean, divided into 8 categories. Take a quick Quiz and we\'ll show you only the best matches!'
            }
          </p>
          
          {!quizResults ? (
            <div className="flex justify-center pt-2">
              <Button 
                onClick={handleStartQuiz} 
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {language === 'he' ? 'התחל Quiz (7 שאלות)' : 'Start Quiz (7 Questions)'}
              </Button>
            </div>
          ) : (
            <div className={`space-y-3 transition-all duration-500 ${isResetting ? 'animate-spin-slow opacity-50 scale-95' : ''}`}>
              <div className={`bg-primary/10 border border-primary/20 rounded-lg p-3 text-center transition-all duration-300 ${isResetting ? 'blur-sm' : ''}`}>
                <p className="text-sm font-medium">
                  ✨ {language === 'he' ? 'סיימת את ה-Quiz!' : 'Quiz Completed!'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'he'
                    ? `הקטגוריות המובילות שלך: ${quizResults.topCategories.slice(0, 3).join(', ')}`
                    : `Your top categories: ${quizResults.topCategories.slice(0, 3).join(', ')}`
                  }
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRetakeQuiz}
                  size="sm"
                  disabled={isResetting}
                >
                  {language === 'he' ? 'עשה שוב את ה-Quiz' : 'Retake Quiz'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={handleResetQuiz}
                  size="sm"
                  disabled={isResetting}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className={`w-4 h-4 ml-1 transition-transform duration-500 ${isResetting ? 'animate-spin' : ''}`} />
                  {isResetting 
                    ? (language === 'he' ? 'מאפס...' : 'Resetting...') 
                    : (language === 'he' ? 'אפס הכל' : 'Reset All')
                  }
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {language === 'he' ? '8 הקטגוריות שלנו' : 'Our 8 Categories'}
          </CardTitle>
          <p className="text-sm text-center text-muted-foreground">
            {language === 'he'
              ? 'כל קטגוריה מכילה 10-15 פעילויות ייחודיות מתוך 100+ אפשרויות'
              : 'Each category contains 10-15 unique activities from 100+ options'
            }
          </p>
        </CardHeader>
        <CardContent>
          <CategoryShowcase 
            quizResults={quizResults ? {
              topCategories: quizResults.topCategories,
              percentages: quizResults.percentages
            } : undefined}
            language={language}
          />
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-[52px] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] h-1 bg-muted-foreground/20 hidden md:block">
              <div 
                className="h-full bg-gradient-to-r from-primary via-primary to-secondary transition-all duration-700 ease-out"
                style={{ 
                  width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                  boxShadow: currentStep > 1 ? '0 0 10px hsl(var(--primary) / 0.5)' : 'none'
                }}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center relative">
              {/* Step 1 */}
              <div className={`relative space-y-3 p-5 rounded-xl transition-all duration-500 ${
                currentStep === 1 
                  ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary shadow-xl scale-105 animate-pulse-slow' 
                  : currentStep > 1 
                  ? 'bg-background/50 border border-primary/30 backdrop-blur-sm'
                  : 'bg-background/50 border border-border/30 backdrop-blur-sm'
              }`}>
                {currentStep === 1 && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg animate-bounce">
                    {language === 'he' ? '🎯 כאן אתם' : '🎯 You are here'}
                  </Badge>
                )}
                {currentStep > 1 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`text-4xl transition-transform duration-300 ${currentStep === 1 ? 'scale-110 animate-bounce' : ''}`}>
                  📋
                </div>
                <h4 className="font-bold text-base">
                  {language === 'he' ? 'שלב 1: Quiz' : 'Step 1: Quiz'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'he' ? 'שאלות על הצוות שלך' : 'Questions about your team'}
                </p>
              </div>

              {/* Step 2 */}
              <div className={`relative space-y-3 p-5 rounded-xl transition-all duration-500 ${
                currentStep === 2 
                  ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary shadow-xl scale-105 animate-pulse-slow' 
                  : currentStep > 2 
                  ? 'bg-background/50 border border-primary/30 backdrop-blur-sm'
                  : 'bg-background/50 border border-border/30 backdrop-blur-sm opacity-60'
              }`}>
                {currentStep === 2 && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg animate-bounce">
                    {language === 'he' ? '🎯 כאן אתם' : '🎯 You are here'}
                  </Badge>
                )}
                {currentStep > 2 && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`text-4xl transition-transform duration-300 ${currentStep === 2 ? 'scale-110 animate-bounce' : ''}`}>
                  🎯
                </div>
                <h4 className="font-bold text-base">
                  {language === 'he' ? 'שלב 2: ניתוח' : 'Step 2: Analysis'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'he' ? 'הבוט מזהה את 3 הקטגוריות המובילות' : 'Bot identifies top 3 categories'}
                </p>
              </div>

              {/* Step 3 */}
              <div className={`relative space-y-3 p-5 rounded-xl transition-all duration-500 ${
                currentStep === 3 
                  ? 'bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary shadow-xl scale-105 animate-pulse-slow' 
                  : 'bg-background/50 border border-border/30 backdrop-blur-sm opacity-60'
              }`}>
                {currentStep === 3 && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg animate-bounce">
                    {language === 'he' ? '🎯 כאן אתם' : '🎯 You are here'}
                  </Badge>
                )}
                <div className={`text-4xl transition-transform duration-300 ${currentStep === 3 ? 'scale-110 animate-bounce' : ''}`}>
                  ✨
                </div>
                <h4 className="font-bold text-base">
                  {language === 'he' ? 'שלב 3: המלצות' : 'Step 3: Recommendations'}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {language === 'he' ? '7 אפשרויות המתאימות ביותר מתוך 100' : 'Only 7 best matching options out of 100'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Dialog */}
      <TeamDNAQuiz
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};
