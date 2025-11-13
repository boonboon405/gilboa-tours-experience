import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { CategoryShowcase } from '@/components/CategoryShowcase';
import { Sparkles, Brain } from 'lucide-react';
import { QuizResults } from '@/utils/quizScoring';

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

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setShowQuiz(false);
    localStorage.setItem('teamDNAResults', JSON.stringify(results));
    localStorage.setItem('quizResults', JSON.stringify({
      id: `quiz-${Date.now()}`,
      top_categories: results.topCategories,
      percentages: results.percentages
    }));
    onQuizComplete?.(results);
  };

  const handleRetakeQuiz = () => {
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
              ? '100 אפשרויות ופעילויות שמחכות לכם בגלבוע ובית שאן, מחולקות ל-8 קטגוריות. ענו על Quiz קצר ונציג לכם רק את המתאים ביותר!'
              : 'We have 100+ activity options in Gilboa and Beit Shean, divided into 8 categories. Take a quick Quiz and we\'ll show you only the best matches!'
            }
          </p>
          
          {!quizResults ? (
            <div className="flex justify-center pt-2">
              <Button 
                onClick={() => setShowQuiz(true)} 
                size="lg"
                className="gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {language === 'he' ? 'התחל Quiz (7 שאלות)' : 'Start Quiz (7 Questions)'}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
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
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleRetakeQuiz}
                  size="sm"
                >
                  {language === 'he' ? 'עשה שוב את ה-Quiz (שנה או הוסף אטרקציות)' : 'Retake Quiz (Change or Add Attractions)'}
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
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl">📋</div>
              <h4 className="font-semibold text-sm">
                {language === 'he' ? 'שלב 1: Quiz' : 'Step 1: Quiz'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === 'he' ? 'שאלות על הצוות שלך' : 'Questions about your team'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h4 className="font-semibold text-sm">
                {language === 'he' ? 'שלב 2: ניתוח' : 'Step 2: Analysis'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === 'he' ? 'הבוט מזהה את 3 הקטגוריות המובילות' : 'Bot identifies top 3 categories'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">✨</div>
              <h4 className="font-semibold text-sm">
                {language === 'he' ? 'שלב 3: המלצות' : 'Step 3: Recommendations'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === 'he' ? 'רק 7 אפשרויות המתאימות ביותר מתוך 100' : 'Only 7 best matching options out of 100'}
              </p>
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
