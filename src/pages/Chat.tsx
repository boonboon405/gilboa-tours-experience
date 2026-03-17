import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AIChat } from '@/components/AIChat';
import { VoiceChat } from '@/components/VoiceChat';
import { VoiceChatComparison } from '@/components/VoiceChatComparison';
import { QuizCategoryIntegration } from '@/components/QuizCategoryIntegration';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, ArrowRight, Mic, MessageSquare, Info, Sparkles } from 'lucide-react';
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
      console.log('[Chat] New client detected, starting fresh');
      setQuizResults(null);
      return;
    }
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {isEn ? 'Chat with Our Smart Agent' : 'שיחה עם הסוכן החכם שלנו'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isEn
              ? 'Tell us what you\'re looking for and we\'ll recommend the perfect experience in Northern Israel — Gilboa, Galilee, and the Springs Valley'
              : 'ספרו, מה אתם מחפשים ואני אמליץ לכם על החוויה המושלמת בצפון, סובב כנרת, גלבוע, גליל ועמק המעינות'}
          </p>
          {quizResults && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
              {isEn ? '✨ Using your quiz preferences' : '✨ מזהה את העדפותיכם מה-Quiz שעשיתם'}
            </div>
          )}
        </div>

        <div className="mb-8 max-w-6xl mx-auto">
          <QuizCategoryIntegration language={language} />
        </div>

        <Tabs defaultValue="voice" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="voice" className="gap-2">
              <Mic className="w-4 h-4" />
              {isEn ? 'Voice Chat' : 'צ\'אט קולי'}
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {isEn ? 'Text Chat' : 'צ\'אט טקסט'}
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <Info className="w-4 h-4" />
              {isEn ? 'Compare' : 'השוואה'}
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
          <TabsContent value="compare">
            <VoiceChatComparison />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {!quizResults && (
            <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
              <ArrowRight className="w-4 h-4" />
              {isEn ? 'Back to Home' : 'חזרה לדף הבית'}
            </Button>
          )}
          <Button variant="outline" onClick={handleCallOwner} className="gap-2">
            <Phone className="w-4 h-4" />
            {isEn ? 'Call David Directly' : 'התקשרו ישירות לדויד'}
          </Button>
        </div>
      </main>

      <Footer />

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
              <div className="p-4 bg-primary/10 rounded-lg text-right">
                <p className="font-semibold text-foreground">{isEn ? 'David Rahimi' : 'דויד רחימי'}</p>
                <p className="text-foreground">0537314235</p>
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
