import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, ZoomIn, X } from 'lucide-react';
import { israelImages } from '@/data/israelImages';
import { useLanguage } from '@/contexts/LanguageContext';

interface Location {
  key: string;
  nameHe: string;
  nameEn: string;
  descriptionHe: string;
  descriptionEn: string;
}

const locations: Location[] = [
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
];

const NorthIsraelGallery = () => {
  const { language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<Location | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">{language === 'he' ? 'אתרים מפורסמים' : 'Famous Sites'}</span>
          </div>
          <h2 className="section-heading mb-4">
            {language === 'he' ? 'גלו את צפון ישראל' : 'Discover Northern Israel'}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === 'he' ? '50 אתרים מרהיבים שמחכים לכם' : '50 stunning sites waiting for you'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {locations.map((location) => (
            <Card
              key={location.key}
              className="group relative overflow-hidden rounded-2xl border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
              onClick={() => setSelectedImage(location)}
            >
              <div className="aspect-[4/3] relative bg-muted">
                <img
                  src={israelImages[location.key]}
                  alt={language === 'he' ? location.nameHe : location.nameEn}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-1 text-white">
                    <ZoomIn className="h-4 w-4" />
                    <span className="text-xs">{language === 'he' ? 'הגדל' : 'Zoom'}</span>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm truncate">
                  {language === 'he' ? location.nameHe : location.nameEn}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {language === 'he' ? location.descriptionHe : location.descriptionEn}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {selectedImage && (language === 'he' ? selectedImage.nameHe : selectedImage.nameEn)}
            </DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="relative">
              <img
                src={israelImages[selectedImage.key]}
                alt={language === 'he' ? selectedImage.nameHe : selectedImage.nameEn}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              <p className="text-muted-foreground mt-4 text-center">
                {language === 'he' ? selectedImage.descriptionHe : selectedImage.descriptionEn}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NorthIsraelGallery;
