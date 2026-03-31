import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, ZoomIn, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Location {
  key: string;
  nameHe: string;
  nameEn: string;
  descriptionHe: string;
  descriptionEn: string;
  imageUrl: string;
}

const locations: Location[] = [
  { key: 'sea-of-galilee', nameHe: 'כנרת', nameEn: 'Sea of Galilee', descriptionHe: 'אגם המים המתוקים הגדול בישראל', descriptionEn: 'Israel\'s largest freshwater lake', imageUrl: 'https://images.unsplash.com/photo-1739820644476-6adf21e31830?w=600&q=80&fit=crop' },
  { key: 'mount-hermon', nameHe: 'הר חרמון', nameEn: 'Mount Hermon', descriptionHe: 'הפסגה המושלגת הגבוהה בישראל', descriptionEn: 'Israel\'s highest snow-capped peak', imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=600&q=80&fit=crop' },
  { key: 'golan-heights', nameHe: 'רמת הגולן', nameEn: 'Golan Heights', descriptionHe: 'נופי בזלת וולקנים מרהיבים', descriptionEn: 'Stunning volcanic basalt landscapes', imageUrl: 'https://images.unsplash.com/photo-1608637765750-6b77adacfcac?w=600&q=80&fit=crop' },
  { key: 'banias-waterfall', nameHe: 'מפל הבניאס', nameEn: 'Banias Waterfall', descriptionHe: 'המפל הגדול והעוצמתי בצפון', descriptionEn: 'The powerful waterfall of the North', imageUrl: 'https://images.unsplash.com/photo-1660924375739-75e64670bd40?w=600&q=80&fit=crop' },
  { key: 'rosh-hanikra', nameHe: 'ראש הנקרה', nameEn: 'Rosh Hanikra', descriptionHe: 'מערות הגיר הלבנות על הים', descriptionEn: 'White chalk cliff sea caves', imageUrl: 'https://images.unsplash.com/photo-1541472544680-ccc2e0014462?w=600&q=80&fit=crop' },
  { key: 'acre-walls', nameHe: 'חומות עכו', nameEn: 'Acre Walls', descriptionHe: 'עיר נמל עתיקה ומבוצרת', descriptionEn: 'Ancient fortified port city', imageUrl: 'https://images.unsplash.com/photo-1769457661846-84ed4cb5971a?w=600&q=80&fit=crop' },
  { key: 'safed-alleys', nameHe: 'סמטאות צפת', nameEn: 'Safed Alleys', descriptionHe: 'עיר הקבלה המיסטית', descriptionEn: 'Mystical Kabbalah city', imageUrl: 'https://images.unsplash.com/photo-1566327450221-9f32845cfa56?w=600&q=80&fit=crop' },
  { key: 'mount-arbel', nameHe: 'הר ארבל', nameEn: 'Mount Arbel', descriptionHe: 'מצוקים דרמטיים מעל הכנרת', descriptionEn: 'Dramatic cliffs over the Galilee', imageUrl: 'https://images.unsplash.com/photo-1697747245806-6aa4b6565a54?w=600&q=80&fit=crop' },
  { key: 'tiberias-promenade', nameHe: 'טיילת טבריה', nameEn: 'Tiberias Promenade', descriptionHe: 'טיילת ציורית לחוף הכנרת', descriptionEn: 'Scenic waterfront promenade', imageUrl: 'https://images.unsplash.com/photo-1695898303391-d4139d30588a?w=600&q=80&fit=crop' },
  { key: 'nazareth-hills', nameHe: 'הרי נצרת', nameEn: 'Nazareth Hills', descriptionHe: 'נופי הגליל הירוקים', descriptionEn: 'Green Galilee landscapes', imageUrl: 'https://images.unsplash.com/photo-1678134017317-4edd53da833d?w=600&q=80&fit=crop' },
  { key: 'beit-shean', nameHe: 'בית שאן', nameEn: 'Beit She\'an', descriptionHe: 'התיאטרון הרומי העתיק', descriptionEn: 'Ancient Roman theater', imageUrl: 'https://images.unsplash.com/photo-1769457661805-51aaf1d16867?w=600&q=80&fit=crop' },
  { key: 'mount-gilboa', nameHe: 'הר הגלבוע', nameEn: 'Mount Gilboa', descriptionHe: 'שדות האירוסים הסגולים', descriptionEn: 'Purple iris flower fields', imageUrl: 'https://images.unsplash.com/photo-1608637765750-6b77adacfcac?w=600&q=80&fit=crop' },
  { key: 'haifa-bay', nameHe: 'מפרץ חיפה', nameEn: 'Haifa Bay', descriptionHe: 'מפרץ ים תיכוני יפהפה', descriptionEn: 'Beautiful Mediterranean bay', imageUrl: 'https://images.unsplash.com/photo-1668678348012-b0fee6ef7677?w=600&q=80&fit=crop' },
  { key: 'nahal-ayun', nameHe: 'נחל עיון', nameEn: 'Nahal Ayun', descriptionHe: 'מפלים בקניון ירוק', descriptionEn: 'Waterfalls in green canyon', imageUrl: 'https://images.unsplash.com/photo-1593543321468-bbc5676c2f94?w=600&q=80&fit=crop' },
  { key: 'hula-valley', nameHe: 'עמק החולה', nameEn: 'Hula Valley', descriptionHe: 'שמורת הציפורים הנודדות', descriptionEn: 'Migrating birds reserve', imageUrl: 'https://images.unsplash.com/photo-1641496011336-baf26b2d778a?w=600&q=80&fit=crop' },
  { key: 'mount-tabor', nameHe: 'הר תבור', nameEn: 'Mount Tabor', descriptionHe: 'ההר הכיפתי האיקוני', descriptionEn: 'Iconic dome-shaped mountain', imageUrl: 'https://images.unsplash.com/photo-1697747245806-6aa4b6565a54?w=600&q=80&fit=crop' },
  { key: 'jordan-river', nameHe: 'נהר הירדן', nameEn: 'Jordan River', descriptionHe: 'הנהר הקדוש והירוק', descriptionEn: 'The sacred green river', imageUrl: 'https://images.unsplash.com/photo-1760541726316-5c20875f8914?w=600&q=80&fit=crop' },
  { key: 'tel-dan', nameHe: 'תל דן', nameEn: 'Tel Dan', descriptionHe: 'מעיינות גן עדן', descriptionEn: 'Paradise springs', imageUrl: 'https://images.unsplash.com/photo-1552423313-b6b7ae492c4d?w=600&q=80&fit=crop' },
  { key: 'nimrod-fortress', nameHe: 'מבצר נמרוד', nameEn: 'Nimrod Fortress', descriptionHe: 'טירה מימי הביניים', descriptionEn: 'Medieval castle ruins', imageUrl: 'https://images.unsplash.com/photo-1675305369968-2d614986608d?w=600&q=80&fit=crop' },
  { key: 'ein-gev', nameHe: 'עין גב', nameEn: 'Ein Gev', descriptionHe: 'חוף מזרחי שליו לכנרת', descriptionEn: 'Serene eastern shore', imageUrl: 'https://images.unsplash.com/photo-1695898303391-d4139d30588a?w=600&q=80&fit=crop' },
  { key: 'capernaum', nameHe: 'כפר נחום', nameEn: 'Capernaum', descriptionHe: 'בית כנסת עתיק לחוף הכנרת', descriptionEn: 'Ancient lakeside synagogue', imageUrl: 'https://images.unsplash.com/photo-1769457661805-51aaf1d16867?w=600&q=80&fit=crop' },
  { key: 'arbel-valley', nameHe: 'עמק ארבל', nameEn: 'Arbel Valley', descriptionHe: 'עמק חקלאי פורה', descriptionEn: 'Fertile agricultural valley', imageUrl: 'https://images.unsplash.com/photo-1608637765750-6b77adacfcac?w=600&q=80&fit=crop' },
  { key: 'gamla', nameHe: 'גמלא', nameEn: 'Gamla', descriptionHe: 'מצדה של הגולן', descriptionEn: 'Masada of the Golan', imageUrl: 'https://images.unsplash.com/photo-1678134017317-4edd53da833d?w=600&q=80&fit=crop' },
  { key: 'korazim', nameHe: 'כורזים', nameEn: 'Korazim', descriptionHe: 'חורבות בזלת שחורות', descriptionEn: 'Black basalt ruins', imageUrl: 'https://images.unsplash.com/photo-1769457661846-84ed4cb5971a?w=600&q=80&fit=crop' },
  { key: 'agamon-hula', nameHe: 'אגמון החולה', nameEn: 'Agamon Hula', descriptionHe: 'עגורים בשקיעה', descriptionEn: 'Cranes at sunset', imageUrl: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=600&q=80&fit=crop' },
  { key: 'bahai-gardens', nameHe: 'גני הבהאי', nameEn: 'Bahai Gardens', descriptionHe: 'גנים מדורגים מרהיבים בחיפה', descriptionEn: 'Stunning terraced gardens in Haifa', imageUrl: 'https://images.unsplash.com/photo-1566327450221-9f32845cfa56?w=600&q=80&fit=crop' },
  { key: 'caesarea-aqueduct', nameHe: 'אמת המים קיסריה', nameEn: 'Caesarea Aqueduct', descriptionHe: 'שרידי אמת מים רומית על החוף', descriptionEn: 'Roman aqueduct ruins on beach', imageUrl: 'https://images.unsplash.com/photo-1769457661805-51aaf1d16867?w=600&q=80&fit=crop' },
  { key: 'zippori', nameHe: 'ציפורי', nameEn: 'Zippori', descriptionHe: 'פסיפסים מרהיבים בעיר העתיקה', descriptionEn: 'Stunning mosaics in ancient city', imageUrl: 'https://images.unsplash.com/photo-1675305369968-2d614986608d?w=600&q=80&fit=crop' },
  { key: 'megiddo', nameHe: 'מגידו', nameEn: 'Megiddo', descriptionHe: 'תל עתיק - הארמגדון', descriptionEn: 'Ancient tel - Armageddon', imageUrl: 'https://images.unsplash.com/photo-1641496011336-baf26b2d778a?w=600&q=80&fit=crop' },
  { key: 'yardenit', nameHe: 'ירדנית', nameEn: 'Yardenit', descriptionHe: 'אתר הטבילה בנהר הירדן', descriptionEn: 'Jordan River baptism site', imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80&fit=crop' },
  { key: 'katzrin', nameHe: 'קצרין', nameEn: 'Katzrin', descriptionHe: 'בירת הגולן ופארק התלמוד', descriptionEn: 'Golan capital and Talmud park', imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80&fit=crop' },
  { key: 'jezreel-valley', nameHe: 'עמק יזרעאל', nameEn: 'Jezreel Valley', descriptionHe: 'העמק החקלאי הפורה', descriptionEn: 'Fertile agricultural valley', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80&fit=crop' },
  { key: 'nahal-snir', nameHe: 'נחל שניר', nameEn: 'Nahal Snir', descriptionHe: 'שמורת טבע עם מפלים ובריכות', descriptionEn: 'Nature reserve with pools', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80&fit=crop' },
  { key: 'achziv', nameHe: 'אכזיב', nameEn: 'Achziv', descriptionHe: 'חוף ים קסום עם מפרצונים', descriptionEn: 'Magical beach with coves', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&fit=crop' },
  { key: 'hamat-gader', nameHe: 'חמת גדר', nameEn: 'Hamat Gader', descriptionHe: 'מעיינות חמים ותנינים', descriptionEn: 'Hot springs and crocodiles', imageUrl: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=600&q=80&fit=crop' },
  { key: 'bet-alfa', nameHe: 'בית אלפא', nameEn: 'Bet Alfa', descriptionHe: 'בית כנסת עתיק עם פסיפס גלגל המזלות', descriptionEn: 'Ancient zodiac mosaic synagogue', imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&q=80&fit=crop' },
  { key: 'gan-hashlosha', nameHe: 'גן השלושה', nameEn: 'Sachne', descriptionHe: 'פארק מים טבעי בעמק', descriptionEn: 'Natural water park in valley', imageUrl: 'https://images.unsplash.com/photo-1558005530-a7958896ec60?w=600&q=80&fit=crop' },
  { key: 'belvoir-fortress', nameHe: 'מבצר כוכב הירדן', nameEn: 'Belvoir Fortress', descriptionHe: 'מבצר צלבני עם נוף מרהיב', descriptionEn: 'Crusader fort with stunning views', imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80&fit=crop' },
  { key: 'mount-meron', nameHe: 'הר מירון', nameEn: 'Mount Meron', descriptionHe: 'הפסגה הגבוהה ביותר בגליל', descriptionEn: 'Highest peak in Galilee', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fit=crop' },
  { key: 'peki-in', nameHe: 'פקיעין', nameEn: 'Peki\'in', descriptionHe: 'כפר דרוזי עתיק בגליל', descriptionEn: 'Ancient Druze village in Galilee', imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80&fit=crop' },
  { key: 'nahariya-beach', nameHe: 'חוף נהריה', nameEn: 'Nahariya Beach', descriptionHe: 'חוף ים תכלת במפרץ עכו', descriptionEn: 'Blue beach in Acre Bay', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80&fit=crop' },
  { key: 'stella-maris', nameHe: 'סטלה מריס', nameEn: 'Stella Maris', descriptionHe: 'מנזר הכרמלים על הים', descriptionEn: 'Carmelite monastery by sea', imageUrl: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=600&q=80&fit=crop' },
  { key: 'druze-villages', nameHe: 'כפרים דרוזיים', nameEn: 'Druze Villages', descriptionHe: 'תרבות ייחודית בהרי הגולן', descriptionEn: 'Unique culture in Golan hills', imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80&fit=crop' },
  { key: 'majrase', nameHe: 'מג\'רסה', nameEn: 'Majrase', descriptionHe: 'פארק מים בצפון הכנרת', descriptionEn: 'Water park in north Kinneret', imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80&fit=crop' },
  { key: 'yehiam-fortress', nameHe: 'מבצר יחיעם', nameEn: 'Yehiam Fortress', descriptionHe: 'מבצר צלבני בגליל המערבי', descriptionEn: 'Crusader fort in Western Galilee', imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80&fit=crop' },
  { key: 'keshet-cave', nameHe: 'קשת מערה', nameEn: 'Keshet Cave', descriptionHe: 'קשת סלע טבעית מרהיבה', descriptionEn: 'Stunning natural rock arch', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80&fit=crop' },
  { key: 'montfort-castle', nameHe: 'מבצר מונפור', nameEn: 'Montfort Castle', descriptionHe: 'שרידי מבצר צלבני ביער', descriptionEn: 'Crusader castle ruins in forest', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80&fit=crop' },
  { key: 'nahal-kziv', nameHe: 'נחל כזיב', nameEn: 'Nahal Kziv', descriptionHe: 'שביל מים מרהיב בגליל', descriptionEn: 'Beautiful water trail in Galilee', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600&q=80&fit=crop' },
  { key: 'rosh-pina', nameHe: 'ראש פינה', nameEn: 'Rosh Pina', descriptionHe: 'מושבה היסטורית עם נוף', descriptionEn: 'Historic colony with views', imageUrl: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=600&q=80&fit=crop' },
  { key: 'miron-forest', nameHe: 'יער מירון', nameEn: 'Miron Forest', descriptionHe: 'יער אורנים ירוק בגליל העליון', descriptionEn: 'Green pine forest in Upper Galilee', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80&fit=crop' },
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
                  src={location.imageUrl}
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
                src={selectedImage.imageUrl.replace('w=600', 'w=1200')}
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
