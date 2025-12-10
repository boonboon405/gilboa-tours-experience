import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, ImageIcon, MapPin, RefreshCw, ZoomIn, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import belvoirFortressImg from '@/assets/belvoir-fortress.jpg';
import nahalAyunImg from '@/assets/nahal-ayun-waterfall.jpg';

interface Location {
  key: string;
  nameHe: string;
  nameEn: string;
  descriptionHe: string;
  descriptionEn: string;
  imageUrl?: string;
  isGenerating?: boolean;
  staticImage?: string;
}

const locations: Location[] = [
  // Original 25 locations
  { key: 'sea-of-galilee', nameHe: 'כנרת', nameEn: 'Sea of Galilee', descriptionHe: 'אגם המים המתוקים הגדול בישראל', descriptionEn: 'Israel\'s largest freshwater lake' },
  { key: 'mount-hermon', nameHe: 'הר חרמון', nameEn: 'Mount Hermon', descriptionHe: 'הפסגה המושלגת הגבוהה בישראל', descriptionEn: 'Israel\'s highest snow-capped peak' },
  { key: 'golan-heights', nameHe: 'רמת הגולן', nameEn: 'Golan Heights', descriptionHe: 'נופי בזלת וולקנים מרהיבים', descriptionEn: 'Stunning volcanic basalt landscapes' },
  { key: 'banias-waterfall', nameHe: 'מפל הבניאס', nameEn: 'Banias Waterfall', descriptionHe: 'המפל הגדול והעוצמתי בצפון', descriptionEn: 'The powerful waterfall of the North' },
  { key: 'rosh-hanikra', nameHe: 'ראש הנקרה', nameEn: 'Rosh Hanikra', descriptionHe: 'מערות הגיר הלבנות על הים', descriptionEn: 'White chalk cliff sea caves' },
  { key: 'acre-walls', nameHe: 'חומות עכו', nameEn: 'Acre Walls', descriptionHe: 'עיר נמל עתיקה ומבוצרת', descriptionEn: 'Ancient fortified port city' },
  { key: 'safed-alleys', nameHe: 'סמטאות צפת', nameEn: 'Safed Alleys', descriptionHe: 'עיר הקבלה המיסטית', descriptionEn: 'Mystical Kabbalah city' },
  { key: 'mount-arbel', nameHe: 'הר ארבל', nameEn: 'Mount Arbel', descriptionHe: 'מצוקים דרמטיים מעל הכנרת', descriptionEn: 'Dramatic cliffs over the Galilee' },
  { key: 'tiberias-promenade', nameHe: 'טיילת טבריה', nameEn: 'Tiberias Promenade', descriptionHe: 'טיילת ציורית לחוף הכנרת', descriptionEn: 'Scenic waterfront promenade' },
  { key: 'nazareth-hills', nameHe: 'הרי נצרת', nameEn: 'Nazareth Hills', descriptionHe: 'נופי הגליל הירוקים', descriptionEn: 'Green Galilee landscapes' },
  { key: 'beit-shean', nameHe: 'בית שאן', nameEn: 'Beit She\'an', descriptionHe: 'התיאטרון הרומי העתיק', descriptionEn: 'Ancient Roman theater' },
  { key: 'mount-gilboa', nameHe: 'הר הגלבוע', nameEn: 'Mount Gilboa', descriptionHe: 'שדות האירוסים הסגולים', descriptionEn: 'Purple iris flower fields' },
  { key: 'haifa-bay', nameHe: 'מפרץ חיפה', nameEn: 'Haifa Bay', descriptionHe: 'מפרץ ים תיכוני יפהפה', descriptionEn: 'Beautiful Mediterranean bay' },
  { key: 'nahal-ayun', nameHe: 'נחל עיון', nameEn: 'Nahal Ayun', descriptionHe: 'מפלים בקניון ירוק', descriptionEn: 'Waterfalls in green canyon' },
  { key: 'hula-valley', nameHe: 'עמק החולה', nameEn: 'Hula Valley', descriptionHe: 'שמורת הציפורים הנודדות', descriptionEn: 'Migrating birds reserve' },
  { key: 'mount-tabor', nameHe: 'הר תבור', nameEn: 'Mount Tabor', descriptionHe: 'ההר הכיפתי האיקוני', descriptionEn: 'Iconic dome-shaped mountain' },
  { key: 'jordan-river', nameHe: 'נהר הירדן', nameEn: 'Jordan River', descriptionHe: 'הנהר הקדוש והירוק', descriptionEn: 'The sacred green river' },
  { key: 'tel-dan', nameHe: 'תל דן', nameEn: 'Tel Dan', descriptionHe: 'מעיינות גן עדן', descriptionEn: 'Paradise springs' },
  { key: 'nimrod-fortress', nameHe: 'מבצר נמרוד', nameEn: 'Nimrod Fortress', descriptionHe: 'טירה מימי הביניים', descriptionEn: 'Medieval castle ruins' },
  { key: 'ein-gev', nameHe: 'עין גב', nameEn: 'Ein Gev', descriptionHe: 'חוף מזרחי שליו לכנרת', descriptionEn: 'Serene eastern shore' },
  { key: 'capernaum', nameHe: 'כפר נחום', nameEn: 'Capernaum', descriptionHe: 'בית כנסת עתיק לחוף הכנרת', descriptionEn: 'Ancient lakeside synagogue' },
  { key: 'arbel-valley', nameHe: 'עמק ארבל', nameEn: 'Arbel Valley', descriptionHe: 'עמק חקלאי פורה', descriptionEn: 'Fertile agricultural valley' },
  { key: 'gamla', nameHe: 'גמלא', nameEn: 'Gamla', descriptionHe: 'מצדה של הגולן', descriptionEn: 'Masada of the Golan' },
  { key: 'korazim', nameHe: 'כורזים', nameEn: 'Korazim', descriptionHe: 'חורבות בזלת שחורות', descriptionEn: 'Black basalt ruins' },
  { key: 'agamon-hula', nameHe: 'אגמון החולה', nameEn: 'Agamon Hula', descriptionHe: 'עגורים בשקיעה', descriptionEn: 'Cranes at sunset' },
  // New 25 locations
  { key: 'bahai-gardens', nameHe: 'גני הבהאי', nameEn: 'Bahai Gardens', descriptionHe: 'גנים מדורגים מרהיבים בחיפה', descriptionEn: 'Stunning terraced gardens in Haifa' },
  { key: 'caesarea-aqueduct', nameHe: 'אמת המים קיסריה', nameEn: 'Caesarea Aqueduct', descriptionHe: 'שרידי אמת מים רומית על החוף', descriptionEn: 'Roman aqueduct ruins on beach' },
  { key: 'zippori', nameHe: 'ציפורי', nameEn: 'Zippori', descriptionHe: 'פסיפסים מרהיבים בעיר העתיקה', descriptionEn: 'Stunning mosaics in ancient city' },
  { key: 'megiddo', nameHe: 'מגידו', nameEn: 'Megiddo', descriptionHe: 'תל עתיק - הארמגדון', descriptionEn: 'Ancient tel - Armageddon' },
  { key: 'yardenit', nameHe: 'ירדנית', nameEn: 'Yardenit', descriptionHe: 'אתר הטבילה בנהר הירדן', descriptionEn: 'Jordan River baptism site' },
  { key: 'katzrin', nameHe: 'קצרין', nameEn: 'Katzrin', descriptionHe: 'בירת הגולן ופארק התלמוד', descriptionEn: 'Golan capital and Talmud park' },
  { key: 'jezreel-valley', nameHe: 'עמק יזרעאל', nameEn: 'Jezreel Valley', descriptionHe: 'העמק החקלאי הפורה', descriptionEn: 'Fertile agricultural valley' },
  { key: 'nahal-snir', nameHe: 'נחל שניר', nameEn: 'Nahal Snir', descriptionHe: 'שמורת טבע עם מפלים ובריכות', descriptionEn: 'Nature reserve with pools' },
  { key: 'achziv', nameHe: 'אכזיב', nameEn: 'Achziv', descriptionHe: 'חוף ים קסום עם מפרצונים', descriptionEn: 'Magical beach with coves' },
  { key: 'hamat-gader', nameHe: 'חמת גדר', nameEn: 'Hamat Gader', descriptionHe: 'מעיינות חמים ותנינים', descriptionEn: 'Hot springs and crocodiles' },
  { key: 'bet-alfa', nameHe: 'בית אלפא', nameEn: 'Bet Alfa', descriptionHe: 'בית כנסת עתיק עם פסיפס גלגל המזלות', descriptionEn: 'Ancient zodiac mosaic synagogue' },
  { key: 'gan-hashlosha', nameHe: 'גן השלושה', nameEn: 'Sachne', descriptionHe: 'פארק מים טבעי בעמק', descriptionEn: 'Natural water park in valley' },
  { key: 'belvoir-fortress', nameHe: 'מבצר כוכב הירדן', nameEn: 'Belvoir Fortress', descriptionHe: 'מבצר צלבני עם נוף מרהיב', descriptionEn: 'Crusader fort with stunning views' },
  { key: 'mount-meron', nameHe: 'הר מירון', nameEn: 'Mount Meron', descriptionHe: 'הפסגה הגבוהה ביותר בגליל', descriptionEn: 'Highest peak in Galilee' },
  { key: 'peki-in', nameHe: 'פקיעין', nameEn: 'Peki\'in', descriptionHe: 'כפר דרוזי עתיק בגליל', descriptionEn: 'Ancient Druze village in Galilee' },
  { key: 'nahariya-beach', nameHe: 'חוף נהריה', nameEn: 'Nahariya Beach', descriptionHe: 'חוף ים תכלת במפרץ עכו', descriptionEn: 'Blue beach in Acre Bay' },
  { key: 'stella-maris', nameHe: 'סטלה מריס', nameEn: 'Stella Maris', descriptionHe: 'מנזר הכרמלים על הים', descriptionEn: 'Carmelite monastery by sea' },
  { key: 'druze-villages', nameHe: 'כפרים דרוזיים', nameEn: 'Druze Villages', descriptionHe: 'תרבות ייחודית בהרי הגולן', descriptionEn: 'Unique culture in Golan hills' },
  { key: 'majrase', nameHe: 'מג\'רסה', nameEn: 'Majrase', descriptionHe: 'פארק מים בצפון הכנרת', descriptionEn: 'Water park in north Kinneret' },
  { key: 'yehiam-fortress', nameHe: 'מבצר יחיעם', nameEn: 'Yehiam Fortress', descriptionHe: 'מבצר צלבני בגליל המערבי', descriptionEn: 'Crusader fort in Western Galilee' },
  { key: 'keshet-cave', nameHe: 'קשת מערה', nameEn: 'Keshet Cave', descriptionHe: 'קשת סלע טבעית מרהיבה', descriptionEn: 'Stunning natural rock arch' },
  { key: 'montfort-castle', nameHe: 'מבצר מונפור', nameEn: 'Montfort Castle', descriptionHe: 'שרידי מבצר צלבני ביער', descriptionEn: 'Crusader castle ruins in forest' },
  { key: 'nahal-kziv', nameHe: 'נחל כזיב', nameEn: 'Nahal Kziv', descriptionHe: 'שביל מים מרהיב בגליל', descriptionEn: 'Beautiful water trail in Galilee' },
  { key: 'rosh-pina', nameHe: 'ראש פינה', nameEn: 'Rosh Pina', descriptionHe: 'מושבה היסטורית עם נוף', descriptionEn: 'Historic colony with views' },
  { key: 'miron-forest', nameHe: 'יער מירון', nameEn: 'Miron Forest', descriptionHe: 'יער אורנים ירוק בגליל העליון', descriptionEn: 'Green pine forest in Upper Galilee' },
  { key: 'belvoir-scenic', nameHe: 'מבצר בלוואר', nameEn: 'Belvoir Fortress', descriptionHe: 'מבצר צלבני עם תצפית מרהיבה', descriptionEn: 'Crusader fortress with stunning views', staticImage: belvoirFortressImg },
  { key: 'ayun-waterfalls', nameHe: 'מפלי עיון', nameEn: 'Ayun Waterfalls', descriptionHe: 'מפלים בקניון ירוק מרהיב', descriptionEn: 'Waterfalls in lush green canyon', staticImage: nahalAyunImg }
];

const NorthIsraelGallery = () => {
  const { language } = useLanguage();
  const [locationImages, setLocationImages] = useState<Record<string, string>>({});
  const [generatingLocations, setGeneratingLocations] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<Location | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Load saved images from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('northIsraelGalleryImages');
    if (saved) {
      setLocationImages(JSON.parse(saved));
    }
  }, []);

  // Save images to localStorage
  useEffect(() => {
    if (Object.keys(locationImages).length > 0) {
      localStorage.setItem('northIsraelGalleryImages', JSON.stringify(locationImages));
    }
  }, [locationImages]);

  const generateImage = async (locationKey: string) => {
    setGeneratingLocations(prev => new Set(prev).add(locationKey));
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-location-image', {
        body: { locationKey }
      });

      if (error) throw error;

      if (data.publicUrl) {
        setLocationImages(prev => ({
          ...prev,
          [locationKey]: data.publicUrl
        }));
        toast.success(language === 'he' ? 'התמונה נוצרה בהצלחה!' : 'Image generated successfully!');
      }
    } catch (error: any) {
      console.error('Error generating image:', error);
      toast.error(error.message || (language === 'he' ? 'שגיאה ביצירת התמונה' : 'Error generating image'));
    } finally {
      setGeneratingLocations(prev => {
        const next = new Set(prev);
        next.delete(locationKey);
        return next;
      });
    }
  };

  const generateAllImages = async () => {
    setIsGeneratingAll(true);
    const ungenerated = locations.filter(loc => !locationImages[loc.key]);
    
    for (const location of ungenerated) {
      if (!locationImages[location.key]) {
        await generateImage(location.key);
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    setIsGeneratingAll(false);
    toast.success(language === 'he' ? 'כל התמונות נוצרו!' : 'All images generated!');
  };

  const clearAllImages = () => {
    setLocationImages({});
    localStorage.removeItem('northIsraelGalleryImages');
    toast.success(language === 'he' ? 'כל התמונות נמחקו' : 'All images cleared');
  };

  const generatedCount = Object.keys(locationImages).length;

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-heading">
            {language === 'he' ? '50 אתרים מפורסמים בצפון ישראל' : '50 Famous Sites in Northern Israel'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {language === 'he' 
              ? 'גלריית תמונות מיוצרות בינה מלאכותית של האתרים היפים ביותר בצפון הארץ'
              : 'AI-generated gallery of the most beautiful sites in Northern Israel'}
          </p>
          
          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Button 
              onClick={generateAllImages} 
              disabled={isGeneratingAll || generatedCount === 50}
              className="bg-primary hover:bg-primary/90"
            >
              {isGeneratingAll ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === 'he' ? 'מייצר תמונות...' : 'Generating...'}
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {language === 'he' ? `צור את כל התמונות (${50 - generatedCount} נותרו)` : `Generate All (${50 - generatedCount} left)`}
                </>
              )}
            </Button>
            
            {generatedCount > 0 && (
              <Button 
                variant="outline" 
                onClick={clearAllImages}
                className="border-destructive text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {language === 'he' ? 'נקה הכל' : 'Clear All'}
              </Button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">
            {language === 'he' 
              ? `${generatedCount} מתוך 50 תמונות נוצרו`
              : `${generatedCount} of 50 images generated`}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {locations.map((location) => {
            const imageUrl = location.staticImage || locationImages[location.key];
            const isGenerating = generatingLocations.has(location.key);
            const hasStaticImage = !!location.staticImage;
            
            return (
              <Card 
                key={location.key}
                className="group relative overflow-hidden rounded-2xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                onClick={() => imageUrl && setSelectedImage({ ...location, imageUrl })}
              >
                <div className="aspect-[4/3] relative bg-muted">
                  {imageUrl ? (
                    <>
                      <img 
                        src={imageUrl} 
                        alt={language === 'he' ? location.nameHe : location.nameEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                          <ZoomIn className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                      {isGenerating ? (
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            generateImage(location.key);
                          }}
                          className="hover:bg-primary/10"
                        >
                          <ImageIcon className="w-5 h-5 mr-2" />
                          {language === 'he' ? 'צור תמונה' : 'Generate'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Location Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <h3 className="text-sm font-semibold text-white truncate">
                      {language === 'he' ? location.nameHe : location.nameEn}
                    </h3>
                  </div>
                  <p className="text-xs text-white/70 truncate">
                    {language === 'he' ? location.descriptionHe : location.descriptionEn}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl">
                {selectedImage && (language === 'he' ? selectedImage.nameHe : selectedImage.nameEn)}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedImage(null)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedImage?.imageUrl && (
            <div className="relative">
              <img 
                src={selectedImage.imageUrl} 
                alt={language === 'he' ? selectedImage.nameHe : selectedImage.nameEn}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                <p className="text-white/90 text-lg">
                  {language === 'he' ? selectedImage.descriptionHe : selectedImage.descriptionEn}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NorthIsraelGallery;
