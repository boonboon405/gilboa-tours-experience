import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AIChat } from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import { Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { checkAndResetForNewClient } from '@/utils/clientSession';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { language } = useLanguage();
  const isEn = language === 'en';

  useEffect(() => {
    const isNewClient = checkAndResetForNewClient();
    if (isNewClient) {
      setQuizResults(null);
      return;
    }
    const stored = localStorage.getItem('quizResults');
    if (stored) {
      try { setQuizResults(JSON.parse(stored)); } catch {}
    }
  }, []);

  const handleCallOwner = () => {
    window.location.href = 'tel:972537314235';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Full-height chat layout */}
      <main className="flex-1 flex flex-col pt-16">
        {/* Compact header */}
        <div className="border-b border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')} 
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              {isEn ? 'Home' : 'בית'}
            </Button>
            <div className="text-center">
              <h1 className="text-sm font-semibold text-foreground">
                {isEn ? 'AI Tour Advisor' : 'יועץ טיולים חכם'}
              </h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCallOwner}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <Phone className="w-3.5 h-3.5" />
              {isEn ? 'Call' : 'התקשרו'}
            </Button>
          </div>
        </div>

        {/* Chat takes all remaining space */}
        <div className="flex-1 container mx-auto px-4 py-4 max-w-3xl flex flex-col min-h-0">
          <AIChat 
            quizResults={quizResults} 
            onRequestHumanAgent={() => setShowHumanHandoff(true)}
          />
        </div>
      </main>

      {/* Human Handoff Dialog */}
      <AlertDialog open={showHumanHandoff} onOpenChange={setShowHumanHandoff}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEn ? 'We\'d love to talk to you personally! 📞' : 'נשמח לדבר איתכם אישית! 📞'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                {isEn
                  ? 'Our smart agent understood you\'d like to speak with a person. David, the company owner, would be happy to help!'
                  : 'הסוכן החכם שלנו הבין שתרצו לדבר עם בן אדם. דויד, בעל החברה, ישמח לעזור לכם אישית!'}
              </p>
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="font-semibold text-foreground">{isEn ? 'David Rahimi' : 'דויד רחימי'}</p>
                <p className="text-foreground">053-731-4235</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isEn ? 'Available during business hours' : 'זמין לשיחה בשעות העבודה'}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction onClick={handleCallOwner} className="w-full sm:w-auto">
              <Phone className="w-4 h-4 ml-2" />
              {isEn ? 'Call Now' : 'התקשר עכשיו'}
            </AlertDialogAction>
            <Button variant="outline" onClick={() => setShowHumanHandoff(false)} className="w-full sm:w-auto">
              {isEn ? 'Continue in Chat' : 'המשך בצ\'אט'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
