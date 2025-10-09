import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LandscapeImageSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImagesSelected: (images: string[]) => void;
}

const STORAGE_KEY = 'landscape-images';

export const LandscapeImageSelector = ({ open, onOpenChange, onImagesSelected }: LandscapeImageSelectorProps) => {
  const [images, setImages] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Persist images to localStorage whenever they change
  useEffect(() => {
    if (images.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    }
  }, [images]);

  const generateImage = async (variation: number) => {
    setGeneratingIndex(variation);
    try {
      const { data, error } = await supabase.functions.invoke('generate-landscape-image', {
        body: { variation }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limit")) {
          toast({
            title: "הגעת למגבלת השימוש",
            description: "אנא נסה שוב בעוד כמה רגעים",
            variant: "destructive"
          });
        } else if (data.error.includes("Payment required")) {
          toast({
            title: "נדרשת הוספת קרדיט",
            description: "יש להוסיף קרדיט לחשבון",
            variant: "destructive"
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setImages(prev => {
        const newImages = [...prev];
        newImages[variation] = data.imageUrl;
        return newImages;
      });
      
      toast({
        title: "תמונה נוצרה בהצלחה!",
        description: `אפשרות ${variation + 1} מתוך 12`
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "שגיאה ביצירת תמונה",
        description: "אנא נסה שוב",
        variant: "destructive"
      });
    } finally {
      setGeneratingIndex(null);
    }
  };

  const generateAllImages = async () => {
    setLoading(true);
    setImages([]);
    
    // Generate images sequentially to avoid rate limits
    for (let i = 0; i < 12; i++) {
      await generateImage(i);
      // Add a small delay between requests
      if (i < 11) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setLoading(false);
  };

  const handleUseImages = () => {
    const validImages = images.filter(img => img);
    if (validImages.length > 0) {
      onImagesSelected(validImages);
      onOpenChange(false);
      toast({
        title: "התמונות נבחרו בהצלחה!",
        description: `${validImages.length} תמונות יתחלפו כל 10 שניות`
      });
    }
  };

  const clearAllImages = () => {
    setImages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "כל התמונות נמחקו",
      description: "כעת תוכל ליצור תמונות חדשות"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">צור 12 תמונות נוף ישראליות</DialogTitle>
              <DialogDescription>
                תמונות של הגלבוע, הכנרת והרים מסביב יתחלפו אוטומטית כל 10 שניות
              </DialogDescription>
            </div>
            {images.some(img => img) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllImages}
                className="mr-2"
              >
                <Trash2 className="h-4 w-4 ml-2" />
                מחק הכל
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            onClick={generateAllImages}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                מייצר תמונות...
              </>
            ) : (
              <>
                <Sparkles className="ml-2 h-5 w-5" />
                צור 12 אפשרויות חדשות
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => (
              <div
                key={index}
                className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-transparent"
              >
                {images[index] ? (
                  <img
                    src={images[index]}
                    alt={`אפשרות ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : generatingIndex === index ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">אפשרות {index + 1}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {images.some(img => img) && (
            <Button
              onClick={handleUseImages}
              className="w-full"
              size="lg"
            >
              השתמש בכל התמונות ({images.filter(img => img).length} תמונות)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
