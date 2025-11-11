import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AIChat } from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const Chat = () => {
  const [showHumanHandoff, setShowHumanHandoff] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load quiz results from localStorage if available
    const stored = localStorage.getItem('quizResults');
    if (stored) {
      try {
        setQuizResults(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse quiz results:', e);
      }
    }
  }, []);

  const handleCallOwner = () => {
    window.location.href = 'tel:972537314235';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            שיחה עם הסוכן החכם שלנו
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ספרו לנו מה אתם מחפשים ואני אמליץ לכם על החוויה המושלמת בגלבוע ובית שאן
          </p>
          {quizResults && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
              ✨ מזהה את העדפותיכם מה-Quiz שעשיתם
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <AIChat 
          quizResults={quizResults} 
          onRequestHumanAgent={() => setShowHumanHandoff(true)}
        />

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {!quizResults && (
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לדף הבית
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleCallOwner}
            className="gap-2"
          >
            <Phone className="w-4 h-4" />
            התקשרו ישירות לדוד
          </Button>
        </div>
      </main>

      <Footer />

      {/* Human Handoff Dialog */}
      <AlertDialog open={showHumanHandoff} onOpenChange={setShowHumanHandoff}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>נשמח לדבר איתכם אישית! 📞</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                הסוכן החכם שלנו הבין שתרצו לדבר עם בן אדם. 
                דוד, בעל החברה, ישמח לעזור לכם אישית!
              </p>
              <div className="p-4 bg-primary/10 rounded-lg text-right">
                <p className="font-semibold text-foreground">דוד רחימי</p>
                <p className="text-foreground">053-7314235</p>
                <p className="text-sm text-muted-foreground mt-2">
                  זמין לשיחה בשעות העבודה
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction onClick={handleCallOwner} className="w-full sm:w-auto">
              <Phone className="w-4 h-4 ml-2" />
              התקשר עכשיו
            </AlertDialogAction>
            <Button
              variant="outline"
              onClick={() => setShowHumanHandoff(false)}
              className="w-full sm:w-auto"
            >
              המשך בצ'אט
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
