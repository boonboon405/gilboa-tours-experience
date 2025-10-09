import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ODTType {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
}

const odtTypes: ODTType[] = [
  {
    id: 1,
    title: 'משחקי אמון',
    description: 'פעילויות שבהן חברי הצוות חייבים לסמוך אחד על השני כדי להצליח. כוללות משימות כמו נפילה לאחור, הליכה עם עיניים מכוסות, ואתגרים בגובה.',
    imagePrompt: 'Realistic photo of a team building trust fall exercise outdoors in nature, people catching their teammate, teamwork, professional photography'
  },
  {
    id: 2,
    title: 'פתרון בעיות יצירתי',
    description: 'אתגרים הדורשים חשיבה יצירתית ופתרון בעיות קבוצתי. צוותים עובדים יחד כדי למצוא פתרונות חדשניים למצבים מורכבים.',
    imagePrompt: 'Realistic photo of business team solving creative puzzle outdoors, brainstorming together, nature setting, professional photography'
  },
  {
    id: 3,
    title: 'מסלולי חבלים גבוהים',
    description: 'מסלולי אתגר בגובה הדורשים אומץ, איזון ותמיכה צוותית. משתתפים מתגברים על פחדים תוך תמיכה הדדית.',
    imagePrompt: 'Realistic photo of high ropes course in forest, person on rope bridge between trees, safety equipment, team building activity, professional photography'
  },
  {
    id: 4,
    title: 'ניווט והתמצאות',
    description: 'שימוש במפה ומצפן לניווט בשטח. מפתח מיומנויות קבלת החלטות, תקשורת ועבודת צוות בסביבה טבעית.',
    imagePrompt: 'Realistic photo of team navigating with map and compass in nature, orienteering activity, outdoor adventure, professional photography'
  },
  {
    id: 5,
    title: 'בניית רפסודות',
    description: 'צוותים בונים רפסודות מחומרים בסיסיים ומפליגים עליהן. דורש תכנון, שיתוף פעולה והסתגלות למצבים משתנים.',
    imagePrompt: 'Realistic photo of team building raft on lake shore, working together with ropes and logs, outdoor team activity, professional photography'
  },
  {
    id: 6,
    title: 'קיר טיפוס צוותי',
    description: 'אתגר בו כל חברי הצוות חייבים לעבור מעבר קיר גבוה יחד. מחייב תכנון אסטרטגי, תקשורת ותמיכה פיזית הדדית.',
    imagePrompt: 'Realistic photo of team helping each other climb wall outdoors, teamwork climbing challenge, people supporting teammates, professional photography'
  },
  {
    id: 7,
    title: 'חיפוש אוצר',
    description: 'משחק התמצאות עם רמזים ומשימות. צוותים עובדים יחד כדי לפתור חידות ולמצוא את האוצר תוך שימוש במיומנויות שונות.',
    imagePrompt: 'Realistic photo of team searching for treasure in forest, treasure hunt activity, people with map looking for clues, professional photography'
  },
  {
    id: 8,
    title: 'מסלולי שרידות',
    description: 'לימוד מיומנויות שרידות בסיסיות כמו הבערת אש, בניית מחסה ואיתור מזון. מחזק עצמאות ועבודת צוות במצבי לחץ.',
    imagePrompt: 'Realistic photo of team learning survival skills outdoors, building shelter in nature, outdoor survival training, professional photography'
  },
  {
    id: 9,
    title: 'הליכה מודרכת בטבע',
    description: 'מסעות הליכה ארוכים בטבע עם משימות לאורך הדרך. מפתח סיבולת, תקשורת ותמיכה הדדית במהלך אתגר פיזי משותף.',
    imagePrompt: 'Realistic photo of business team hiking together in mountains, guided nature walk, people walking on trail, professional photography'
  },
  {
    id: 10,
    title: 'משחקי מנהיגות',
    description: 'פעילויות שבהן חברי צוות מסתובבים בתפקידי מנהיגות. מפתח מיומנויות הובלה, קבלת החלטות ואחריות.',
    imagePrompt: 'Realistic photo of leadership training exercise outdoors, team leader guiding group activity, professional team building, professional photography'
  },
  {
    id: 11,
    title: 'אתגרי תקשורת',
    description: 'משימות המדגישות את חשיבות התקשורת הברורה. צוותים חייבים לתקשר ביעילות כדי להשלים אתגרים מורכבים.',
    imagePrompt: 'Realistic photo of team communication exercise in nature, people working together on challenge, team collaboration, professional photography'
  },
  {
    id: 12,
    title: 'קמפינג צוותי',
    description: 'חנייה ללילה בטבע עם פעילויות שיתופיות. בניית מחנה, בישול משותף ופעילויות לילה מחזקים את הקשרים בין חברי הצוות.',
    imagePrompt: 'Realistic photo of team camping together, campfire at night, people sitting around fire, outdoor camping activity, professional photography'
  },
  {
    id: 13,
    title: 'ספורט הרפתקאות',
    description: 'פעילויות כמו רפטינג, קיאקינג או טיפוס סלעים. דורש תיאום, תקשורת והתגברות על חששות אישיים בסביבה תומכת.',
    imagePrompt: 'Realistic photo of team white water rafting together, adventure sport activity, people in raft on river, professional photography'
  },
  {
    id: 14,
    title: 'סדנאות סביבתיות',
    description: 'פעילויות שמחברות בין גיבוש צוות לבין מודעות סביבתית. כוללות שימור טבע, נטיעת עצים ופרויקטים אקולוגיים.',
    imagePrompt: 'Realistic photo of team planting trees together, environmental workshop outdoors, people working on nature conservation, professional photography'
  },
  {
    id: 15,
    title: 'אתגרי זמן',
    description: 'משימות עם מגבלות זמן קפדניות הדורשות תכנון מהיר, ביצוע יעיל ועבודת צוות מתואמת תחת לחץ.',
    imagePrompt: 'Realistic photo of team racing against time in outdoor challenge, people working quickly together, timed team activity, professional photography'
  }
];

interface ODTTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ODTTypesDialog = ({ open, onOpenChange }: ODTTypesDialogProps) => {
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>(() => {
    // Load saved images from localStorage on initial mount
    const saved = localStorage.getItem('odt-generated-images');
    return saved ? JSON.parse(saved) : {};
  });
  const { toast } = useToast();

  // Save images to localStorage whenever they change - ALWAYS save to ensure persistence
  useEffect(() => {
    localStorage.setItem('odt-generated-images', JSON.stringify(generatedImages));
    console.log('ODT images saved to localStorage:', Object.keys(generatedImages).length, 'images');
  }, [generatedImages]);

  const generateImage = async (odtType: ODTType) => {
    // Skip if already exists (unless explicitly re-generating)
    if (generatedImages[odtType.id] && !loadingImages[odtType.id]) {
      console.log('Image already exists for ODT type:', odtType.id);
      return;
    }

    setLoadingImages(prev => ({ ...prev, [odtType.id]: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-odt-image', {
        body: { prompt: odtType.imagePrompt }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error(error.message || 'Failed to generate image');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImages(prev => {
          const updated = { ...prev, [odtType.id]: data.imageUrl };
          console.log('Image generated and saved for ODT type:', odtType.id);
          return updated;
        });
        toast({
          title: 'תמונה נוצרה בהצלחה!',
          description: 'התמונה נשמרה ותישאר זמינה לצמיתות',
        });
      } else {
        throw new Error('No image URL returned');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      
      let errorMessage = 'נסה שוב מאוחר יותר';
      
      if (error instanceof Error) {
        if (error.message.includes('timeout') || error.message.includes('timed out')) {
          errorMessage = 'היצירה לוקחת זמן רב מדי. נסה שוב בעוד מספר שניות';
        } else if (error.message.includes('Rate limit')) {
          errorMessage = 'יותר מדי בקשות. המתן רגע ונסה שוב';
        } else if (error.message.includes('Payment required')) {
          errorMessage = 'נדרשת הוספת קרדיטים';
        }
      }
      
      toast({
        title: 'שגיאה ביצירת תמונה',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoadingImages(prev => ({ ...prev, [odtType.id]: false }));
    }
  };

  const generateAllImages = async () => {
    const missingImages = odtTypes.filter(odt => !generatedImages[odt.id]);
    
    if (missingImages.length === 0) {
      toast({
        title: 'כל התמונות כבר נוצרו',
        description: 'כל 15 התמונות שמורות במערכת',
      });
      return;
    }

    toast({
      title: 'מתחיל ליצור תמונות',
      description: `יוצר ${missingImages.length} תמונות חסרות...`,
    });

    // Generate images sequentially to avoid rate limits
    for (let i = 0; i < missingImages.length; i++) {
      await generateImage(missingImages[i]);
      // Add delay between requests to avoid rate limiting
      if (i < missingImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  };

  const clearAllImages = () => {
    setGeneratedImages({});
    localStorage.setItem('odt-generated-images', JSON.stringify({}));
    console.log('All ODT images cleared from localStorage');
    toast({
      title: 'התמונות נמחקו',
      description: 'ניתן ליצור תמונות חדשות',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center">15 סוגי פעילויות ODT</DialogTitle>
          <DialogDescription className="text-center text-lg">
            בחר במתאים לכם פעילויות לגיבוש הצוות שלך בטבע
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {odtTypes.map((odtType) => (
            <Card key={odtType.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-muted flex items-center justify-center">
                {loadingImages[odtType.id] ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                ) : generatedImages[odtType.id] ? (
                  <img 
                    src={generatedImages[odtType.id]} 
                    alt={odtType.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => generateImage(odtType)}
                  >
                    צור תמונה
                  </Button>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{odtType.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {odtType.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
