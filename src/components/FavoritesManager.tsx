import { useState, useEffect } from 'react';
import { Heart, Share2, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FavoritesManagerProps {
  activityId: string;
  activityText: string;
  sectionId: number;
}

export const FavoritesManager = ({ activityId, activityText, sectionId }: FavoritesManagerProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Load favorites from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(activityId));
  }, [activityId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter((id: string) => id !== activityId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "הוסר מהמועדפים",
        description: "הפעילות הוסרה מרשימת המועדפים",
      });
    } else {
      // Add to favorites
      favorites.push(activityId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "נוסף למועדפים ❤️",
        description: "הפעילות נוספה לרשימת המועדפים שלך",
      });
    }
  };

  const handleShare = async (method: 'whatsapp' | 'copy' | 'email') => {
    const shareText = `🌟 פעילות מומלצת מדויד טורס:\n\n${activityText}\n\nרוצה לארגן יום גיבוש? בקר באתר שלנו!`;
    const shareUrl = window.location.href;

    switch (method) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`, '_blank');
        break;
      
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareText + '\n' + shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          toast({
            title: "הועתק ללוח! ✓",
            description: "הטקסט הועתק ללוח. אפשר להדביק אותו בכל מקום",
          });
        } catch (err) {
          toast({
            title: "שגיאה",
            description: "לא הצלחנו להעתיק. נסה שוב",
            variant: "destructive"
          });
        }
        break;
      
      case 'email':
        const subject = 'פעילות מומלצת מדויד טורס';
        const body = encodeURIComponent(shareText + '\n\n' + shareUrl);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
        break;
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFavorite}
          className={cn(
            "h-8 w-8 rounded-full transition-all duration-300",
            isFavorite 
              ? "text-red-500 hover:text-red-600 hover:scale-110" 
              : "text-muted-foreground hover:text-red-500 hover:scale-110"
          )}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-all duration-300",
              isFavorite && "fill-current animate-in zoom-in-50"
            )} 
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowShareDialog(true)}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              שתף פעילות
            </DialogTitle>
            <DialogDescription>
              שתף את הפעילות הזו עם הצוות שלך
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Activity Preview */}
            <div className="p-4 bg-muted/50 rounded-lg border-r-4 border-primary">
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                {activityText}
              </p>
            </div>

            {/* Share Options */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex-col h-20 gap-2 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300 hover:scale-105"
                onClick={() => handleShare('whatsapp')}
              >
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col h-20 gap-2 hover:bg-primary/10 hover:border-primary transition-all duration-300 hover:scale-105"
                onClick={() => handleShare('copy')}
              >
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  {copied ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <Copy className="h-4 w-4 text-white" />
                  )}
                </div>
                <span className="text-xs">{copied ? 'הועתק!' : 'העתק'}</span>
              </Button>

              <Button
                variant="outline"
                className="flex-col h-20 gap-2 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 hover:scale-105"
                onClick={() => handleShare('email')}
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs">Email</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
