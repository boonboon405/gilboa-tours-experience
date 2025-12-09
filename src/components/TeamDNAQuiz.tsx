import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { quizQuestions, calculateQuizResults, QuizResults } from '@/utils/quizScoring';
import { categoryMetadata } from '@/utils/activityCategories';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';
import { QuizResultsDetail } from '@/components/QuizResultsDetail';
import { playSound, preloadSounds } from '@/utils/soundEffects';

interface TeamDNAQuizProps {
  open: boolean;
  onClose: () => void;
  onComplete: (results: QuizResults) => void;
}

export const TeamDNAQuiz = ({ open, onClose, onComplete }: TeamDNAQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[][]>(Array(quizQuestions.length).fill([]));
  const [showResults, setShowResults] = useState(false);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];
  const selectedAnswers = answers[currentQuestion] || [];
  
  // Count how many questions have been answered
  const answeredCount = answers.filter(answer => answer.length > 0).length;

  // Preload sounds on mount
  useEffect(() => {
    preloadSounds();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    playSound('pop', 0.2);
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = [answerIndex]; // Single selection
    setAnswers(newAnswers);
    
    // Auto-advance to next question after a brief delay for visual feedback
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        playSound('whoosh', 0.15);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate and show results on last question
        const calculatedResults = calculateQuizResults(newAnswers);
        setResults(calculatedResults);
        setShowResults(true);
        playSound('complete', 0.4);
      }
    }, 400); // 400ms delay for visual feedback
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate and show results
      const calculatedResults = calculateQuizResults(answers);
      setResults(calculatedResults);
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      playSound('whoosh', 0.15);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = async () => {
    if (results) {
      playSound('success', 0.3);
      
      // Save to localStorage
      localStorage.setItem('teamDNAResults', JSON.stringify(results));
      
      // Save analytics to database
      try {
        await supabase.from('quiz_results').insert({
          scores: results.scores as any,
          top_categories: results.topCategories,
          percentages: results.percentages as any,
          session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        });
      } catch (err) {
        console.error('Error saving quiz analytics:', err);
        // Don't block user flow if analytics fail
      }
      
      onComplete(results);
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const canProceed = selectedAnswers.length > 0;

  // Trigger confetti when results are shown
  useEffect(() => {
    if (showResults && results && !showDetailedResults) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showResults, results, showDetailedResults]);

  if (showDetailedResults && results) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <QuizResultsDetail results={results} onClose={handleFinish} />
        </DialogContent>
      </Dialog>
    );
  }

  if (showResults && results) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2 duration-700">
              <Sparkles className="h-8 w-8 text-primary animate-spin" />
              נהדר! אנחנו מכירים אתכם יותר טוב עכשיו
            </DialogTitle>
            <DialogDescription className="text-center text-lg pt-2 animate-in fade-in duration-700 delay-200">
              זיהינו את ה-DNA של הצוות שלכם. הנה ה-3 הקטגוריות המובילות:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            {results.topCategories.map((category, index) => {
              const meta = categoryMetadata[category];
              const percentage = results.percentages[category];
              
              return (
                <Card key={category} className="overflow-hidden">
                  <div className={cn("h-2 bg-gradient-to-r", meta.color)} />
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{meta.icon}</span>
                        <div>
                          <h3 className="text-xl font-bold">{meta.name}</h3>
                          <p className="text-sm text-muted-foreground">{meta.description}</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {percentage}%
                      </div>
                    </div>
                    <Progress value={percentage} className="h-3" />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <p className="text-lg mb-2">
              ✨ <strong>מושלם!</strong> בחרנו עבורכם את הפעילויות הכי מתאימות
            </p>
            <p className="text-sm text-muted-foreground">
              במקום 100+ אפשרויות, תראו רק את 7-10 הפעילויות המתאימות ביותר לכל קטגוריית זמן
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => setShowDetailedResults(true)} 
              variant="outline" 
              className="flex-1" 
              size="lg"
            >
              <FileText className="ml-2 h-5 w-5" />
              הצג ניתוח מפורט
            </Button>
            <Button onClick={handleFinish} className="flex-1" size="lg">
              <CheckCircle2 className="ml-2 h-5 w-5" />
              בואו נתחיל לבחור פעילויות!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3">
            <DialogTitle className="text-2xl text-center flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              בואו נכיר את הצוות שלכם! 
            </DialogTitle>
            {answeredCount > 0 && (
              <Badge 
                variant="default" 
                className="animate-in zoom-in duration-300 bg-primary text-primary-foreground text-base px-3 py-1.5 font-bold"
              >
                {answeredCount}/{quizQuestions.length}
              </Badge>
            )}
          </div>
          <DialogDescription className="text-center text-base">
            ענו על 7 שאלות קצרות ונציג לכם רק את הפעילויות המתאימות ביותר
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>שאלה {currentQuestion + 1} מתוך {quizQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl text-center">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={cn(
                    "w-full p-4 rounded-lg border-2 transition-all duration-200",
                    "flex items-center gap-4 text-right hover:scale-[1.02]",
                    selectedAnswers.includes(index)
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 bg-card"
                  )}
                >
                  <span className="text-3xl">{answer.icon}</span>
                  <span className="text-lg flex-1">{answer.text}</span>
                  {selectedAnswers.includes(index) && (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="flex-1"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              חזור
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1"
            >
              {currentQuestion === quizQuestions.length - 1 ? 'סיים' : 'הבא'}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {/* Skip Option */}
          <div className="text-center">
            <Button variant="ghost" onClick={handleSkip} className="text-sm text-muted-foreground">
              דלג על השאלון - תן לי לראות הכל
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
