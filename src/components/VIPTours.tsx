import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Send, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const vipDestinations = [
  {
    id: 1,
    region: "🌿 צפון הארץ",
    sites: [
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
      "גולן – עין עבדת, קצרין העתיקה, הר בנטל ותצפית על סוריה"
    ]
  },
  {
    id: 2,
    region: "🏞 עמק יזרעאל והגלבוע",
    sites: [
      "גבעת המורה – נוף מרהיב לעמק",
      "נחל הקיבוצים – מסלול מים חווייתי לכל המשפחה",
      "הר הגלבוע – פריחה עונתית ונוף לעמק חרוד",
      "בית שאן – עתיקות רומיות מרשימות",
      "הר תבור – מקום ההתגלות לפי המסורת הנוצרית",
      "כנסיית הבשורה – נצרת",
      "יקב תבור – טעימות יין ונוף הרים"
    ]
  },
  {
    id: 3,
    region: "🏙 חיפה והשרון",
    sites: [
      "גני הבהאיים – אתר מורשת עולמית עוצר נשימה",
      "המושבה הגרמנית – חיפה",
      "מוזיאון ההעפלה וחיל הים – חיפה",
      "קיסריה העתיקה – אמת מים, תיאטרון ונמל רומי",
      "פארק רעננה – מהגדולים במרכז הארץ",
      "שמורת הבונים – מסלול חוף סלעי יפהפה",
      "גן לאומי אפולוניה – מבצר צלבני מעל הים בהרצליה"
    ]
  },
  {
    id: 4,
    region: "🕍 ירושלים והסביבה",
    sites: [
      "העיר העתיקה בירושלים – הכותל המערבי, כנסיית הקבר, הר הבית",
      "יד ושם – מוזיאון השואה הלאומי",
      "מוזיאון ישראל – כולל דגם ירושלים ובית הספרים הלאומי",
      "הר הזיתים – תצפית לעיר העתיקה",
      "שכונת משכנות שאננים – השכונה היהודית הראשונה מחוץ לחומות",
      "שוק מחנה יהודה – תרבות, אוכל ואווירה ירושלמית",
      "עיר דוד – ארכאולוגיה מרתקת מימי בית ראשון"
    ]
  },
  {
    id: 5,
    region: "🏜 הדרום ומדבר יהודה",
    sites: [
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
      "המצפה התת ימי באילת – עולם חי תת-ימי עשיר"
    ]
  }
];

export const VIPTours = () => {
  const { toast } = useToast();
  const [vipSelections, setVipSelections] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });
  const [isSending, setIsSending] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    company: '',
    whatsappNumber: '',
    officeNumber: '',
    participantCount: '',
    budgetPerPerson: '275',
    tourType: 'יום אחד',
    specialComments: '',
    language: ''
  });
  const [suggestedDate, setSuggestedDate] = useState<Date>();

  const handleSendPreferences = async () => {
    // Validate contact info
    if (!contactInfo.name || !contactInfo.email || !contactInfo.company || !contactInfo.whatsappNumber) {
      toast({
        title: "פרטים חסרים",
        description: "אנא מלא את כל השדות הנדרשים (שם, אימייל, חברה, ומספר וואטסאפ)",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.email)) {
      toast({
        title: "אימייל לא תקין",
        description: "אנא הכנס כתובת אימייל תקינה",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const vipSelectionsData = vipDestinations.map(destination => ({
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
        title: "ההעדפות נשלחו בהצלחה!",
        description: "ניצור איתך קשר בהקדם",
      });

      // Reset form
      setVipSelections({
        1: [],
        2: [],
        3: [],
        4: [],
        5: []
      });
      setContactInfo({
        name: '',
        email: '',
        company: '',
        whatsappNumber: '',
        officeNumber: '',
        participantCount: '',
        budgetPerPerson: '275',
        tourType: 'יום אחד',
        specialComments: '',
        language: ''
      });
      setSuggestedDate(undefined);
    } catch (error) {
      console.error('Error sending preferences:', error);
      toast({
        title: "שגיאה בשליחה",
        description: "אירעה שגיאה בשליחת ההעדפות. נסה שוב מאוחר יותר.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const totalVipSelections = Object.values(vipSelections).reduce((sum, selections) => sum + selections.length, 0);

  return (
    <section id="vip-tours" className="py-20 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Badge className="text-xl px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  טיולי VIP - עד 19 מטיילים
                </Badge>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold mb-4">
                טיול VIP מיוחד לאורחים מחו״ל
              </CardTitle>
              <CardDescription className="text-lg md:text-xl leading-relaxed">
                <p className="mb-4">
                  החברה שלכם מארחת אורחים מחו״ל? דייויד טורס יכול לארח אותם בטיול VIP ברכב ממוזג מפואר ולהעניק להם חוויית טיול בלתי נשכחת ברחבי ישראל.
                </p>
                <p className="font-semibold text-primary">
                  מתאים לקבוצות של 1-19 מטיילים • נהג מקצועי ומדריך מומחה • רכב מפואר וממוזג • מסלולים מותאמים אישית
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>רכב VIP ממוזג</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>מדריך מקצועי</span>
                </div>
                <div className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span>מסלול מותאם אישית</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VIP Destinations Selection */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">בחרו את האתרים המועדפים עליכם</h3>
            <p className="text-lg text-muted-foreground">
              רשימת 50 אתרים מומלצים לביקור בישראל, מחולקים לפי אזורים גיאוגרפיים – מצפון לדרום
            </p>
            <p className="text-base text-muted-foreground mt-2">
              הרשימה כוללת אתרים היסטוריים, טבעיים, דתיים ותרבותיים, שנחשבים מהחשובים והמרתקים ביותר בארץ
            </p>
          </div>

          <div className="space-y-6">
            {vipDestinations.map((destination) => {
              const currentSelections = vipSelections[destination.id] || [];
              
              return (
                <Card 
                  key={destination.id}
                  className="border-2 hover:shadow-strong transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">
                        {destination.region}
                      </CardTitle>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-lg px-4 py-2",
                          currentSelections.length > 0 && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                        )}
                      >
                        {currentSelections.length} נבחרו
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {destination.sites.map((site, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => {
                            const isSelected = currentSelections.includes(index);
                            if (isSelected) {
                              setVipSelections({
                                ...vipSelections,
                                [destination.id]: currentSelections.filter(i => i !== index)
                              });
                            } else {
                              setVipSelections({
                                ...vipSelections,
                                [destination.id]: [...currentSelections, index]
                              });
                            }
                          }}
                        >
                          <Checkbox
                            checked={currentSelections.includes(index)}
                            className="mt-1"
                          />
                          <span className="flex-1 text-right">{site}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Summary and Contact Form */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <CardTitle className="text-3xl font-bold">
                  סיכום הבחירות שלך לטיול VIP
                </CardTitle>
                <Button 
                  onClick={handleSendPreferences}
                  disabled={isSending}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                >
                  <Send className="h-5 w-5 ml-2" />
                  {isSending ? 'שולח...' : 'שלח למייל'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-6 mb-6 border-b">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">
                    {totalVipSelections}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    אתרים נבחרו
                  </div>
                </div>
              </div>

              {/* Contact Information Form */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-center mb-6">פרטי יצירת קשר</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">שם מלא *</label>
                    <Input
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      placeholder="הכנס את שמך המלא"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">אימייל *</label>
                    <Input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="example@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">שם החברה *</label>
                    <Input
                      value={contactInfo.company}
                      onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                      placeholder="הכנס את שם החברה"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מספר וואטסאפ *</label>
                    <Input
                      type="tel"
                      value={contactInfo.whatsappNumber}
                      onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                      placeholder="05X-XXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מספר משרדי</label>
                    <Input
                      type="tel"
                      value={contactInfo.officeNumber}
                      onChange={(e) => setContactInfo({ ...contactInfo, officeNumber: e.target.value })}
                      placeholder="0X-XXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מספר משתתפים</label>
                    <Input
                      type="number"
                      value={contactInfo.participantCount}
                      onChange={(e) => setContactInfo({ ...contactInfo, participantCount: e.target.value })}
                      placeholder="מספר האורחים"
                      min="1"
                      max="19"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מספר ימים</label>
                    <Select
                      value={contactInfo.tourType}
                      onValueChange={(value) => setContactInfo({ ...contactInfo, tourType: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="בחר מספר ימים" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="יום אחד">יום אחד</SelectItem>
                        <SelectItem value="יומיים">יומיים</SelectItem>
                        <SelectItem value="3 ימים">3 ימים</SelectItem>
                        <SelectItem value="4 ימים">4 ימים</SelectItem>
                        <SelectItem value="5 ימים">5 ימים</SelectItem>
                        <SelectItem value="שבוע">שבוע</SelectItem>
                        <SelectItem value="10 ימים">10 ימים</SelectItem>
                        <SelectItem value="שבועיים">שבועיים</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">תאריך מוצע</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-right font-normal",
                            !suggestedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : "בחר תאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={suggestedDate}
                          onSelect={setSuggestedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">שפת הטיול</label>
                    <Input
                      value={contactInfo.language}
                      onChange={(e) => setContactInfo({ ...contactInfo, language: e.target.value })}
                      placeholder="למשל: עברית, אנגלית, וכו׳"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">הערות ומשאלות מיוחדות אותם מבקשים האורחים</label>
                  <Textarea
                    value={contactInfo.specialComments}
                    onChange={(e) => setContactInfo({ ...contactInfo, specialComments: e.target.value })}
                    placeholder="ספר לנו עוד על הטיול שלך..."
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};