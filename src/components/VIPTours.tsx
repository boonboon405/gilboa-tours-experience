import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Send, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface VipDestination {
  id: number;
  region: string;
  sites: string[];
}

const getVipDestinations = (isHe: boolean): VipDestination[] => [
  {
    id: 1,
    region: isHe ? "🌿 צפון הארץ" : "🌿 Northern Israel",
    sites: isHe ? [
      "ראש הנקרה – הנקרות הלבנות והנוף לים התיכון",
      "מצודת יחיעם – מבצר צלבני עתיק בגליל המערבי",
      "עכו העתיקה – חומות, נמל, שוק ומנהרת הטמפלרים",
      "נהריה – טיילת חוף קסומה עם אווירה גלילית",
      "הר מירון – תצפיות ונקודת עליה לקבר רבי שמעון בר יוחאי",
      "צפת העתיקה – סמטאות, גלריות לאמנות וקבלה",
      "הכנרת – אתרי טבילה נוצריים וחופי רחצה",
      "קבר הרמב״ם – טבריה",
      "הר ארבל – תצפית מרהיבה על הכנרת",
      "נחל עמוד – מסלול טבע מהיפים בארץ",
      "חצור העתיקה – אתר ארכאולוגי מתקופת התנ״ך",
      "נחל דן – שמורת טבע ומים זורמים כל השנה",
      "תל דן – עיר כנענית עם שער מקורי",
      "שמורת הבניאס (נחל חרמון) – מפלים ומקדש פאן",
      "גולן – קצרין העתיקה, הר בנטל ותצפית על סוריה",
      "חמת גדר מעיינות חמים ועיר רומית"
    ] : [
      "Rosh HaNikra – White chalk grottoes overlooking the Mediterranean",
      "Yehiam Fortress – Ancient Crusader fortress in Western Galilee",
      "Old Acre (Akko) – Walls, harbor, market & Templar tunnel",
      "Nahariya – Charming coastal promenade with Galilean atmosphere",
      "Mount Meron – Scenic viewpoints & tomb of Rabbi Shimon Bar Yochai",
      "Old Safed (Tzfat) – Alleys, art galleries & Kabbalah heritage",
      "Sea of Galilee – Christian baptism sites & swimming beaches",
      "Tomb of Maimonides – Tiberias",
      "Mount Arbel – Stunning lookout over the Sea of Galilee",
      "Nahal Amud – One of Israel's most beautiful nature trails",
      "Hazor – Biblical-era archaeological site",
      "Nahal Dan – Year-round flowing water nature reserve",
      "Tel Dan – Canaanite city with original gate",
      "Banias Nature Reserve (Hermon Stream) – Waterfalls & Pan's temple",
      "Golan Heights – Ancient Katzrin, Mount Bental & view into Syria",
      "Hamat Gader – Hot springs & Roman city"
    ]
  },
  {
    id: 2,
    region: isHe ? "🏞 עמק יזרעאל והגלבוע" : "🏞 Jezreel Valley & Gilboa",
    sites: isHe ? [
      "גבעת המורה – נוף מרהיב לעמק",
      "נחל הקיבוצים – מסלול מים חווייתי לכל המשפחה",
      "הר הגלבוע – פריחה עונתית ונוף לעמק חרוד",
      "בית שאן – עתיקות רומיות מרשימות",
      "הר תבור – מקום ההתגלות לפי המסורת הנוצרית",
      "כנסיית הבשורה – נצרת",
      "יקב תבור – טעימות יין ונוף הרים",
      "סחנה-פארק גן השלושה (מים חמימים לאורך כל השנה)"
    ] : [
      "Givat HaMoreh – Stunning valley views",
      "Nahal HaKibbutzim – Family-friendly water trail",
      "Mount Gilboa – Seasonal wildflowers & Harod Valley views",
      "Beit She'an – Impressive Roman antiquities",
      "Mount Tabor – Site of the Transfiguration in Christian tradition",
      "Church of the Annunciation – Nazareth",
      "Tabor Winery – Wine tasting with mountain views",
      "Sachne / Gan HaShlosha – Warm natural springs year-round"
    ]
  },
  {
    id: 3,
    region: isHe ? "🏙 חיפה והשרון" : "🏙 Haifa & Sharon",
    sites: isHe ? [
      "גני הבהאיים – אתר מורשת עולמית עוצר נשימה",
      "המושבה הגרמנית – חיפה",
      "מוזיאון ההעפלה וחיל הים – חיפה",
      "קיסריה העתיקה – אמת מים, תיאטרון ונמל רומי",
      "פארק רעננה – מהגדולים במרכז הארץ",
      "שמורת הבונים – מסלול חוף סלעי יפהפה",
      "גן לאומי אפולוניה – מבצר צלבני מעל הים בהרצליה",
      "מערות האדם הקדמון ע״י נחל אורן-מדרון הכרמל"
    ] : [
      "Baha'i Gardens – Breathtaking UNESCO World Heritage site",
      "German Colony – Haifa",
      "Clandestine Immigration & Naval Museum – Haifa",
      "Caesarea – Roman aqueduct, amphitheater & harbor",
      "Ra'anana Park – One of the largest in central Israel",
      "HaBonim Nature Reserve – Beautiful rocky coastal trail",
      "Apollonia National Park – Crusader fortress above the sea in Herzliya",
      "Prehistoric caves near Nahal Oren – Carmel slopes"
    ]
  },
  {
    id: 4,
    region: isHe ? "🕍 ירושלים והסביבה" : "🕍 Jerusalem & Surroundings",
    sites: isHe ? [
      "העיר העתיקה בירושלים – הכותל המערבי, כנסיית הקבר, הר הבית",
      "יד ושם – מוזיאון השואה הלאומי",
      "מוזיאון ישראל – כולל דגם ירושלים ובית הספרים הלאומי",
      "הר הזיתים – תצפית לעיר העתיקה",
      "שכונת משכנות שאננים – השכונה היהודית הראשונה מחוץ לחומות",
      "שוק מחנה יהודה – תרבות, אוכל ואווירה ירושלמית",
      "עיר דוד – ארכאולוגיה מרתקת מימי בית ראשון",
      "אבו גוש כפר שוחר שלום-בדרך לבירה ירושלים"
    ] : [
      "Old City of Jerusalem – Western Wall, Church of the Holy Sepulchre, Temple Mount",
      "Yad Vashem – National Holocaust Memorial Museum",
      "Israel Museum – Including Jerusalem model & National Library",
      "Mount of Olives – Panoramic view of the Old City",
      "Mishkenot Sha'ananim – First Jewish neighborhood outside the walls",
      "Mahane Yehuda Market – Culture, food & Jerusalem atmosphere",
      "City of David – Fascinating First Temple-era archaeology",
      "Abu Ghosh – Village of peace on the way to Jerusalem"
    ]
  },
  {
    id: 5,
    region: isHe ? "🏜 הדרום ומדבר יהודה" : "🏜 Southern Israel & Judean Desert",
    sites: isHe ? [
      "ים המלח – הנקודה הנמוכה בעולם",
      "מצדה – סמל הגבורה היהודית ומורשת עולמית",
      "עין גדי – נווה מדבר ומסלולי מים",
      "מערת קומראן – מקום גילוי המגילות הגנוזות",
      "מכתש רמון – פלא גאולוגי עולמי",
      "מצפה רמון – מרכז אסטרונומי לצפייה בכוכבים",
      "באר שבע – עיר האבות, באר אברהם ומוזיאון הנגב",
      "פארק תמנע – נופי מדבר ונחושת קדומה",
      "אילת – חופי ים סוף, שנורקלינג וצלילה",
      "שמורת האלמוגים – אחת היפות בעולם",
      "המצפה התת ימי באילת – עולם חי תת-ימי עשיר",
      "שייט בים האדום בספינה"
    ] : [
      "Dead Sea – The lowest point on Earth",
      "Masada – Symbol of Jewish heroism & UNESCO World Heritage",
      "Ein Gedi – Desert oasis with water trails",
      "Qumran Caves – Where the Dead Sea Scrolls were discovered",
      "Makhtesh Ramon – A global geological wonder",
      "Mitzpe Ramon – Stargazing astronomy center",
      "Be'er Sheva – City of the Patriarchs, Abraham's Well & Negev Museum",
      "Timna Park – Desert landscapes & ancient copper mines",
      "Eilat – Red Sea beaches, snorkeling & diving",
      "Coral Reserve – One of the most beautiful in the world",
      "Eilat Underwater Observatory – Rich marine life",
      "Red Sea boat cruise"
    ]
  }
];

export const VIPTours = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const isHe = language === 'he';
  const vipDestinations = getVipDestinations(isHe);

  const [vipSelections, setVipSelections] = useState<Record<number, number[]>>({
    1: [], 2: [], 3: [], 4: [], 5: []
  });
  const [isSending, setIsSending] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '', email: '', company: '', whatsappNumber: '', officeNumber: '',
    participantCount: '', budgetPerPerson: '275', tourType: isHe ? 'יום אחד' : '1 Day',
    specialComments: '', language: ''
  });
  const [suggestedDate, setSuggestedDate] = useState<Date>();

  const handleSendPreferences = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.company || !contactInfo.whatsappNumber) {
      toast({
        title: isHe ? "פרטים חסרים" : "Missing Details",
        description: isHe ? "אנא מלא את כל השדות הנדרשים (שם, אימייל, חברה, ומספר וואטסאפ)" : "Please fill in all required fields (name, email, company, and WhatsApp number)",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast({
        title: isHe ? "אימייל לא תקין" : "Invalid Email",
        description: isHe ? "אנא הכנס כתובת אימייל תקינה" : "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const heDestinations = getVipDestinations(true);
      const vipSelectionsData = heDestinations.map(destination => ({
        region: destination.region,
        sites: (vipSelections[destination.id] || []).map(index => destination.sites[index])
      }));

      const requestData = {
        contactInfo,
        suggestedDate: suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : null,
        tourType: 'VIP Tour',
        vipSelections: vipSelectionsData
      };

      const { data, error } = await supabase.functions.invoke('send-preferences-email', {
        body: requestData
      });

      if (error) throw error;

      toast({
        title: isHe ? "ההעדפות נשלחו בהצלחה!" : "Preferences Sent Successfully!",
        description: isHe ? "ניצור איתך קשר בהקדם" : "We'll contact you shortly",
      });

      setVipSelections({ 1: [], 2: [], 3: [], 4: [], 5: [] });
      setContactInfo({
        name: '', email: '', company: '', whatsappNumber: '', officeNumber: '',
        participantCount: '', budgetPerPerson: '275', tourType: isHe ? 'יום אחד' : '1 Day',
        specialComments: '', language: ''
      });
      setSuggestedDate(undefined);
    } catch (error) {
      console.error('Error sending preferences:', error);
      toast({
        title: isHe ? "שגיאה בשליחה" : "Submission Error",
        description: isHe ? "אירעה שגיאה בשליחת ההעדפות. נסה שוב מאוחר יותר." : "An error occurred while sending preferences. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const totalVipSelections = Object.values(vipSelections).reduce((sum, selections) => sum + selections.length, 0);

  const tourDurations = isHe
    ? [{ v: 'יום אחד', l: 'יום אחד' }, { v: 'יומיים', l: 'יומיים' }, { v: '3 ימים', l: '3 ימים' }, { v: '4 ימים', l: '4 ימים' }, { v: '5 ימים', l: '5 ימים' }, { v: 'שבוע', l: 'שבוע' }, { v: '10 ימים', l: '10 ימים' }, { v: 'שבועיים', l: 'שבועיים' }]
    : [{ v: '1 Day', l: '1 Day' }, { v: '2 Days', l: '2 Days' }, { v: '3 Days', l: '3 Days' }, { v: '4 Days', l: '4 Days' }, { v: '5 Days', l: '5 Days' }, { v: '1 Week', l: '1 Week' }, { v: '10 Days', l: '10 Days' }, { v: '2 Weeks', l: '2 Weeks' }];

  return (
    <section id="vip-tours" className="py-20 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="text-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  {isHe ? 'טיולי VIP - עד 19 מטיילים' : 'VIP Tours – Up to 19 Guests'}
                </Badge>
              </div>
              <CardTitle className="section-heading mb-4">
                {isHe ? 'טיול VIP מיוחד לאורחים מחו״ל' : 'Exclusive VIP Tours for International Guests'}
              </CardTitle>
              <CardDescription className="text-lg md:text-xl leading-[1.7]">
                <p className="mb-4">
                  {isHe 
                    ? 'החברה שלכם מארחת אורחים מחו״ל? דייויד טורס יכול לארח אותם בטיול VIP ברכב ממוזג מפואר ולהעניק להם חוויית טיול בלתי נשכחת ברחבי ישראל.'
                    : 'Is your company hosting international guests? David Tours can host them on a VIP tour in a luxury air-conditioned vehicle for an unforgettable experience across Israel.'}
                </p>
                <p className="font-semibold text-primary">
                  {isHe 
                    ? 'מתאים לקבוצות של 1-19 מטיילים • נהג מקצועי ומדריך מומחה • רכב מפואר וממוזג • מסלולים מותאמים אישית'
                    : 'Suitable for groups of 1–19 guests • Professional driver & expert guide • Luxury air-conditioned vehicle • Fully customized itineraries'}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>{isHe ? 'רכב VIP ממוזג' : 'Air-Conditioned VIP Vehicle'}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>{isHe ? 'מדריך מקצועי' : 'Professional Guide'}</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>{isHe ? 'מסלול מותאם אישית' : 'Custom Itinerary'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP Destinations Selection */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">
              {isHe ? 'בחרו את חבל הארץ ואת האתרים המועדפים עליכם' : 'Choose Your Preferred Region & Sites'}
            </h3>
            <p className="text-lg text-muted-foreground">
              {isHe 
                ? 'רשימת 50 אתרים מומלצים לביקור בישראל, מחולקים לפי אזורים גיאוגרפיים – מצפון לדרום'
                : '50 recommended sites across Israel, organized by geographic region — from north to south'}
            </p>
            <p className="text-base text-muted-foreground mt-2">
              {isHe 
                ? 'הרשימה כוללת אתרים היסטוריים, טבעיים, דתיים ותרבותיים, שנחשבים מהחשובים והמרתקים ביותר בארץ'
                : 'The list includes historical, natural, religious, and cultural sites — among the most important and fascinating in the country'}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {vipDestinations.map((destination) => {
              const currentSelections = vipSelections[destination.id] || [];
              
              return (
                <AccordionItem key={destination.id} value={`region-${destination.id}`} className="border-2 rounded-lg hover:shadow-strong transition-all duration-300 px-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full mr-4">
                      <span className="text-2xl font-semibold text-right">{destination.region}</span>
                      <Badge 
                        variant="secondary" 
                        className={cn("text-lg px-4 py-2", currentSelections.length > 0 && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100")}
                      >
                        {currentSelections.length} {isHe ? 'נבחרו' : 'selected'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <p className="text-base text-muted-foreground mb-4">
                      {isHe 
                        ? 'בחר עד 5 פעילויות, יחד נקבע את האטרקציות הכי מתאימות בהיתחשב בזמנים ואפשרויות בשטח ומזג אויר'
                        : 'Select up to 5 attractions — we\'ll help you choose the best fit based on timing, logistics, and weather'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {destination.sites.map((site, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => {
                            const isSelected = currentSelections.includes(index);
                            if (isSelected) {
                              setVipSelections({ ...vipSelections, [destination.id]: currentSelections.filter(i => i !== index) });
                            } else {
                              setVipSelections({ ...vipSelections, [destination.id]: [...currentSelections, index] });
                            }
                          }}
                        >
                          <Checkbox checked={currentSelections.includes(index)} className="mt-1" />
                          <span className="flex-1">{site}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Summary and Contact Form */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-3xl font-bold">
                  {isHe ? 'סיכום הבחירות שלך לטיול VIP' : 'Your VIP Tour Selection Summary'}
                </CardTitle>
                <Button 
                  onClick={handleSendPreferences}
                  disabled={isSending}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  <Send className="h-5 w-5 ml-2" />
                  {isSending ? (isHe ? 'שולח...' : 'Sending...') : (isHe ? 'שלח למייל' : 'Send via Email')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6 mb-6 border-b">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">{totalVipSelections}</div>
                  <div className="text-lg text-muted-foreground">{isHe ? 'אתרים נבחרו' : 'Sites Selected'}</div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center mb-6">{isHe ? 'פרטי יצירת קשר' : 'Contact Information'}</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'שם מלא *' : 'Full Name *'}</label>
                    <Input value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} placeholder={isHe ? "הכנס את שמך המלא" : "Enter your full name"} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'אימייל *' : 'Email *'}</label>
                    <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder="example@company.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'שם החברה *' : 'Company Name *'}</label>
                    <Input value={contactInfo.company} onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })} placeholder={isHe ? "הכנס את שם החברה" : "Enter company name"} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר וואטסאפ *' : 'WhatsApp Number *'}</label>
                    <Input type="tel" value={contactInfo.whatsappNumber} onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })} placeholder="05X-XXXXXXX" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר משרדי' : 'Office Number'}</label>
                    <Input type="tel" value={contactInfo.officeNumber} onChange={(e) => setContactInfo({ ...contactInfo, officeNumber: e.target.value })} placeholder="0X-XXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר משתתפים' : 'Number of Participants'}</label>
                    <Input type="number" value={contactInfo.participantCount} onChange={(e) => setContactInfo({ ...contactInfo, participantCount: e.target.value })} placeholder={isHe ? "מספר האורחים" : "Number of guests"} min="1" max="19" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר ימים' : 'Number of Days'}</label>
                    <Select value={contactInfo.tourType} onValueChange={(value) => setContactInfo({ ...contactInfo, tourType: value })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={isHe ? "בחר מספר ימים" : "Select number of days"} />
                      </SelectTrigger>
                      <SelectContent>
                        {tourDurations.map(d => (
                          <SelectItem key={d.v} value={d.v}>{d.l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'תאריך מוצע' : 'Suggested Date'}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-right font-normal", !suggestedDate && "text-muted-foreground")}>
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : (isHe ? "בחר תאריך" : "Select a date")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={suggestedDate} onSelect={setSuggestedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'שפת הטיול' : 'Tour Language'}</label>
                    <Input value={contactInfo.language} onChange={(e) => setContactInfo({ ...contactInfo, language: e.target.value })} placeholder={isHe ? "למשל: עברית, אנגלית, וכו׳" : "e.g. English, Spanish, etc."} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{isHe ? 'הערות ומשאלות מיוחדות אותם מבקשים האורחים' : 'Special Requests & Notes from Guests'}</label>
                  <Textarea value={contactInfo.specialComments} onChange={(e) => setContactInfo({ ...contactInfo, specialComments: e.target.value })} placeholder={isHe ? "ספר לנו עוד על הטיול שלך..." : "Tell us more about your tour..."} rows={4} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
