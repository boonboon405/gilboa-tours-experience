import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AIChat } from '@/components/AIChat';
import { VoiceChat } from '@/components/VoiceChat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, ArrowLeft, Mic, MessageSquare, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { checkAndResetForNewClient } from '@/utils/clientSession';
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
  const isHe = language === 'he';

  useEffect(() => {
    const isNewClient = checkAndResetForNewClient();
    if (isNewClient) {
      setQuizResults(null);
      return;
    }
    const stored = localStorage.getItem('quizResults');
    if (stored) {
      try { setQuizResults(JSON.parse(stored)); } catch (e) { /* ignore */ }
    }
  }, []);

  const handleCallOwner = () => {
    window.location.href = 'tel:972537314235';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 pt-20 pb-8 md:pt-24 md:pb-16 max-w-5xl">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full mb-3 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {isHe ? 'מופעל בינה מלאכותית' : 'AI-Powered'}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Heebo', sans-serif" }}>
            {isHe ? 'תכננו את החוויה שלכם' : 'Plan Your Experience'}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isHe 
              ? 'ספרו לנו מה אתם מחפשים ונמליץ על החוויה המושלמת בצפון ישראל'
              : 'Tell us what you\'re looking for and we\'ll recommend the perfect experience in Northern Israel'
            }
          </p>
        </div>

        {/* Chat Interface with Tabs */}
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 max-w-sm mx-auto">
            <TabsTrigger value="voice" className="gap-2">
              <Mic className="w-4 h-4" />
              {isHe ? 'צ\'אט קולי' : 'Voice Chat'}
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {isHe ? 'צ\'אט טקסט' : 'Text Chat'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice">
            <VoiceChat quizResults={quizResults} />
          </TabsContent>

          <TabsContent value="text">
            <AIChat 
              quizResults={quizResults} 
              onRequestHumanAgent={() => setShowHumanHandoff(true)}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHe ? 'חזרה לדף הבית' : 'Back to Home'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCallOwner}
            className="gap-2 rounded-full"
          >
            <Phone className="w-4 h-4" />
            {isHe ? 'התקשרו לדויד' : 'Call David'}
          </Button>
        </div>
      </main>

      <Footer />

      {/* Human Handoff Dialog */}
      <AlertDialog open={showHumanHandoff} onOpenChange={setShowHumanHandoff}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isHe ? 'נשמח לדבר איתכם אישית! 📞' : 'We\'d love to talk! 📞'}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                {isHe 
                  ? 'דויד, בעל החברה, ישמח לעזור לכם אישית!'
                  : 'David, the owner, would be happy to help you personally!'
                }
              </p>
              <div className="p-4 bg-primary/10 rounded-lg text-right">
                <p className="font-semibold text-foreground">{isHe ? 'דויד רחימי' : 'David Rachimi'}</p>
                <p className="text-foreground">0537314235</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isHe ? 'זמין לשיחה בשעות העבודה' : 'Available during business hours'}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogAction onClick={handleCallOwner} className="w-full sm:w-auto">
              <Phone className="w-4 h-4 ml-2" />
              {isHe ? 'התקשר עכשיו' : 'Call Now'}
            </AlertDialogAction>
            <Button
              variant="outline"
              onClick={() => setShowHumanHandoff(false)}
              className="w-full sm:w-auto"
            >
              {isHe ? 'המשך בצ\'אט' : 'Continue Chat'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Chat;
