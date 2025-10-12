import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sunrise, Waves, Landmark, Wine, Clock, CheckCircle2, ChevronDown, ChevronUp, Send, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const sections = [
  {
    id: 1,
    icon: Sunrise,
    title: "פתיחת בוקר – אנרגיה, שבירת קרח והרפתקאות",
    description: "התחל את היום עם פעולה, אוויר צח וחיוכים.",
    time: "09:00 - 11:30",
    color: "from-orange-500 to-yellow-500",
    activities: [
      "הליכה במי הנחל הצלולים לאורך נחל הקיבוצים (ראלי מכשולים צוותי) - מומלץ מאד",
      "אתגר רכבי שטח דרך גבעות הגלבוע",
      "ג'יפים בדרכי עמק בית שאן ניווט",
      "ביקור בבית אהרון אהרונסון (רוכש וגואל אדמות הארץ)",
      "חוויית כדור פורח בשחר מעל העמק ובריכות הדגים",
      "תחרות התמצאות ביער בית אלפא - וצפייה בשקנאים שעוברים בשבר סורי אפריקאי",
      "מסלול הרים בפארק חרוד - הקרב של עין ג'אלוט נגד המונגולים",
      "ריצת שליחים לאורך קניון הבזלת של בית שאן",
      "מרוץ קיאקים צוותי באתר ירדנית",
      "רכיבה על סוסים בעמק",
      "קרב פיינטבול: תרחיש 'כבוש את העמק!' - בניר דוד",
      "תחרות חץ וקשת במי נחל הקיבוצים",
      "אתגר rappelling וטיפוס בצוקי הר הגלבוע",
      "משיכת חבל על דשאי מעיין חרוד",
      "פארק מכשולי מים מתנפחים (התקנה ניידת ליד גן השלושה)",
      "יוגה קבוצתית או מתיחת כוח בחוץ ליד המעיינות",
      "תחרות חתירה בכנרת (סירות או קיאקים)",
      "ציד אוצר - משימה יצירתית ברחבי העמק",
      "פעילות זיפליין וגשר חבלים",
      "מסע יחודי אל רכס הגלבוע, 7 תצפיות נוף",
      "שליחי צוות 'מירוץ למיליון: מהדורת הגלבוע' עם רמזים היסטוריים",
      "קניון הבזלת-גשר. מבט לירדן",
      "ציד אוצר בטבע עם רמזים הקשורים לסיפורים המקראיים של הגלבוע",
      "'מצא את חרב המלך שאול' משחק חידות היסטורי (מבוסס סיפור)",
      "טיול קצר לתצפית פסגת הגלבוע לשיחת פתיחה וקפה",
      "נדידת 500,000,000 ציפורים פעמיים בשנה מעל עמק הירדן"
    ]
  },
  {
    id: 2,
    icon: Waves,
    title: "התקררות בצהריים – מעיינות, מים והרגעה",
    description: "איזון האדרנלין עם חוויות ODT, משחקי מים, מהנות והרגעה",
    time: "11:30 - 13:30",
    color: "from-blue-500 to-cyan-400",
    activities: [
      "אתגר רכבים חשמלים דרך 4 מעיינות-ניווט לרגלי הגלבוע המערבי - מומלץ מאד",
      "שחייה בגן השלושה (סחנה)",
      "פיקניק תחת עצי דקל ליד מעיין עין מודע",
      "בניית צוות 'אתגר בניית רפסודה' במעיין רדוד",
      "מרוץ שליחים בין צינורות נחל הקיבוצים",
      "גלישת סאפ במקטע הרגוע של נהר הירדן",
      "שיעור יוגה במעיינות הגלבוע",
      "משחקי מים מיני-אולימפיים בדשאי גן השלושה",
      "תחרות 'שף המעיין' – אפיית לחם על אבנים טבעיות",
      "הקמת אזור חברתי לערסלים וקפה קר",
      "פינת עיסוי עם מטפלים מקצועיים (רוטציה קבוצתית)",
      "סדנת גוף-נפש: 'ממתח לזרימה'",
      "תחרות צילום נושאי פלורה פאונה ומים בסחנה",
      "קרב בלוני מים (תמיד כיף לצוותי משרד!)",
      "קיאקים ואתגר חתירה קבוצתי - קצה דרום הכנרת",
      "מעגל מוזיקה אקוסטית באוויר הפתוח ליד המעיין",
      "מפגש מיינדפולנס תחת עצי אקליפטוס",
      "פינת אמנות יצירתית: 'צייר את המעיין'",
      "בר מיצים טריים וסמוזי המופעל על ידי חברי הצוות",
      "'אתגר שקת' – תקשורת ללא מילים במהלך הליכת הנהר",
      "זמן מדיטציה והתבוננות ליד נחל הקיבוצים",
      "טעימת בירה מקררת ממבשלת בירה מקומית",
      "פעילות טיפול בוץ טבעי (כיף וידידותי לצילום)",
      "הליכה יחפה קלה לאורך נתיב תעלת המים",
      "'אתגר זן ליחפים – תחרות איזון על אבנים עגלגלות ליד המעיינות החמים, טבריה",
      "הסבר גאולוגי לשבר הסורי אפריקאי ממרום הגלבוע המזרחי בתצפית לעבר עמק הירדן"
    ]
  },
  {
    id: 3,
    icon: Landmark,
    title: "היסטוריה וזהות – התחברות למקום ומטרה",
    description: "העשר את החוויה עם עצירות תרבותיות והיסטוריות משמעותיות.",
    time: "13:30 - 15:30",
    color: "from-amber-600 to-orange-500",
    activities: [
      "סיור מודרך באמפי תאטרון של העיר הרומית בית שאן (סקיתופוליס) - מומלץ מאד",
      "חקור את פסיפס בית הכנסת בית אלפא וסמליותו",
      "ביקור בגן הזיכרון לאסף שמיר ודובי שמיר אב ובנו שנפלו בקרב- גילבוע",
      "סיור מודרך בעיר הרומית בית שאן (סקיתופוליס)",
      "עצירה בתצפית הר הגלבוע – הסיפור של הקרב האחרון של המלך שאול",
      "ביקור במוזיאון האמנות של קיבוץ עין חרוד (הפסקה יצירתית)",
      "מעגל סיפורים: 'ממלכות שאול לעם הסטארטאפים – מנהיגות לאורך הדורות'",
      "ביקור בגן גארו אוסטרלי לכיף קל",
      "ביקור בחוות חלב קיבוצית מקומית – טעימה, למידה וצחוק",
      "מפגש סיפור מקראי על רכס הגלבוע - ממלכת שאול",
      "'מצא את הפסוק המוסתר' – משחק היסטורי אינטראקטיבי",
      "מפלי מים גועשים ישרות לכינרת-פנינת חמדה",
      "תחרות טריוויה היסטורית עם פרסים",
      "ביקור במוזיאון בסחנה (יישובים עתיקים בעמק)",
      "ביקור במוזיאון חומה ומגדל בניר דוד",
      "פעילות 'קפסולת זמן' – השוואה בין עבודת צוות עתיקה ומודרנית",
      "ביקור במרחצאות הרומיים של חמת גדר (הרחבה אופציונלית)",
      "דיון מנהיגות: 'מה צוותים מודרניים יכולים ללמוד מהקיבוץ?'"
    ]
  },
  {
    id: 4,
    icon: Wine,
    title: "קולינריה, יין וחגיגה",
    description: "אוכל טוב  + כריכי איכות מפנקים מאחד אנשים. כאן, טעם ועבודת צוות פוגשים שמחה.",
    time: "15:30 - 17:00",
    color: "from-purple-600 to-pink-500",
    activities: [
      "חוויה קולינרית: ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי - בבית שאן- מומלץ מאד",
      "טעימת יין ביקב בוטיק מקומי (רמת שירין, עמק יזרעאל) + כריכי איכות מפנקים",
      "סדנת שמן זית וטעימה + כריכי איכות מפנקים",
      "תחרות בניית טבון בטבע 'אתגר חביטות של מאסטר שף הצוות' + כריכי איכות מפנקים",
      "'מסע טעמים בגליל' – טעימה עיוורת של מוצרים מקומיים + כריכי איכות מפנקים",
      "אתגר בישול פויקה מסורתי (צוותים מתחרים) + כריכי איכות מפנקים",
      "פינת בריבקיו -BBQ שלך על הגילבוע + כריכי איכות מפנקים",
      "מזנון צהריים קיבוצי – תוצרת מקומית עונתית בניר דוד + כריכי איכות מפנקים",
      "אתגר קינוחים צוותי עם תמרים, דבש ויוגורט מקומיים + כריכי איכות מפנקים",
      "מפגש טעימת בירה מקומית + כריכי איכות מפנקים",
      "ביקור בחוות תמרים – 'מהדקל לצלחת' - במושבה כנרת + כריכי איכות מפנקים",
      "ביקור בחוות גבינות עיזים – טעימה והדגמת חליבה + כריכי איכות מפנקים",
      "ארוחת פיקניק בדשאי מעיין חרוד + כריכי איכות מפנקים",
      "תחרות יצירת בר מיצים + כריכי איכות מפנקים",
      "תחרות צילום לאורך שעה + כריכי איכות מפנקים",
      "'יין וחוכמה' – דיון קבוצתי לא פורמלי על יין מקומי + כריכי איכות מפנקים",
      "סדנת אפיית פיתה בתנורי טאבון + כריכי איכות מפנקים",
      "שיעור הכנת חומוס אותנטי – אתגר קבוצתי + כריכי איכות מפנקים",
      "בישול תה אותנטי עם עשבי תיבול מקומיים + כריכי איכות מפנקים",
      "'סיום מתוק וזיכרון מעמד מיוחד' – יין, שוקולד, חלווה או פירות בפסגת הגלבוע - תצפית נוף לעמק הכי יפה + כריכי איכות מפנקים",
      "טקס ״טוסט״ יין צוותי – 'לחיים, לשיתוף פעולה!' - בעין מגדל + כריכי איכות מפנקים",
      "חוויה קולינרית: ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי של חומוס אליהו- בקיבוץ בית השיטה"
    ]
  }
];

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

export const ChooseYourDay = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'100topics' | 'vip'>('100topics');
  const [selections, setSelections] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [vipSelections, setVipSelections] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  });
  const [otherOptions, setOtherOptions] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: ''
  });
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1, 2, 3, 4]));
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

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleActivity = (sectionId: number, activityIndex: number) => {
    const currentSelections = selections[sectionId] || [];
    const isSelected = currentSelections.includes(activityIndex);
    
    if (isSelected) {
      setSelections({
        ...selections,
        [sectionId]: currentSelections.filter(i => i !== activityIndex)
      });
    } else if (currentSelections.length < 8) {
      setSelections({
        ...selections,
        [sectionId]: [...currentSelections, activityIndex]
      });
    }
  };

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
      // Build the selections data with activity names
      const selectionsData = sections.reduce((acc, section) => {
        const selectedIndices = selections[section.id] || [];
        const selectedActivities = selectedIndices.map(index => section.activities[index]);
        
        acc[section.id] = {
          sectionTitle: section.title,
          activities: selectedActivities,
          otherOption: otherOptions[section.id]
        };
        
        return acc;
      }, {} as any);

      const { error } = await supabase.functions.invoke('send-preferences-email', {
        body: { 
          selections: selectionsData,
          contactInfo,
          suggestedDate: suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : null
        }
      });

      if (error) throw error;

      toast({
        title: "נשלח בהצלחה!",
        description: "ההעדפות שלך נשלחו למייל שלנו. נחזור אליך בהקדם.",
      });

      // Reset form and selections after successful send
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
      
      // Reset all selections and other options
      setSelections({});
      setOtherOptions({});
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

  return (
    <section id="choose-your-day" className="py-20 bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
            <Badge 
              className={cn(
                "text-lg px-6 py-2 cursor-pointer transition-all duration-300",
                activeSection === '100topics' 
                  ? "bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg scale-105" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              onClick={() => setActiveSection('100topics')}
            >
              ביחרו את יום הכיף שלכם להלן 100 נושאים לבחירה
            </Badge>
            <Badge 
              className={cn(
                "text-lg px-6 py-2 cursor-pointer transition-all duration-300",
                activeSection === 'vip' 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              onClick={() => setActiveSection('vip')}
            >
              טיולי VIP לאורחים מחו״ל
            </Badge>
          </div>
          {activeSection === '100topics' && (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                אפשרויות בלתי נשכחות-ב4 קטגוריות :
              </h2>
              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl text-muted-foreground">
                  בחר פעילות אחת או שתיים מכל קטגוריה ונשוחח יחד על תכנון סופי של יום הכיף כולל מחיר סופי
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-300">
                      <Sunrise className="h-4 w-4 ml-1" />
                      הרפתקת בוקר
                    </Badge>
                    <span className="text-muted-foreground">←</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">
                      <Waves className="h-4 w-4 ml-1" />
                      הרגעת מעיינות
                    </Badge>
                    <span className="text-muted-foreground">←</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">
                      <Landmark className="h-4 w-4 ml-1" />
                      מפגש מורשת
                    </Badge>
                    <span className="text-muted-foreground">←</span>
                  </div>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-300">
                    <Wine className="h-4 w-4 ml-1" />
                    חגיגה קולינרית
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground">
                  שלב אותן באופן כרונולוגי ליצירת תוכנית יום מלא (09:00 - 17:00)
                </p>
              </div>
            </>
          )}
        </div>

        {/* VIP Tour Section */}
        {activeSection === 'vip' && (
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
        )}

        {/* Sections */}
        {activeSection === '100topics' && (
          <div className="max-w-7xl mx-auto space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const currentSelections = selections[section.id] || [];
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <Card 
                key={section.id} 
                className="border-2 hover:shadow-strong transition-all duration-300"
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <CardTitle className="text-2xl">
                            קטגוריה {section.id}: {section.title}
                          </CardTitle>
                          <Badge variant="outline" className="text-sm">
                            <Clock className="h-3 w-3 ml-1" />
                            {section.time}
                          </Badge>
                        </div>
                        <CardDescription className="text-base">
                          {section.description}
                        </CardDescription>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            בחר עד 8 פעילויות
                          </span>
                          <div 
                            className={`font-bold text-lg px-4 py-2 rounded-full ${
                              currentSelections.length === 0 
                                ? 'bg-muted text-muted-foreground border-2 border-border' 
                                : 'bg-primary text-primary-foreground shadow-lg'
                            }`}
                          >
                            {currentSelections.length}/8 נבחרו
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-0 flex-shrink-0 p-2 rounded-md bg-primary/10 border-2 border-primary/20">
                      <ChevronUp className={`h-4 w-4 transition-opacity ${isExpanded ? 'opacity-100 text-primary' : 'opacity-40'}`} />
                      <ChevronDown className={`h-4 w-4 transition-opacity ${!isExpanded ? 'opacity-100 text-primary' : 'opacity-40'}`} />
                    </div>
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="space-y-4">
                    {/* Activities Grid */}
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.activities.map((activity, index) => {
                        const isSelected = currentSelections.includes(index);
                        const isDisabled = !isSelected && currentSelections.length >= 8;
                        
                        return (
                          <div
                            key={index}
                            onClick={() => !isDisabled && toggleActivity(section.id, index)}
                            className={`
                              flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-primary bg-primary/5' 
                                : isDisabled
                                  ? 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50 hover:bg-accent/5'
                              }
                            `}
                          >
                            <Checkbox 
                              checked={isSelected}
                              disabled={isDisabled}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed">
                                <span className="font-medium ml-1">{index + 1}.</span>
                                {typeof activity === 'string' && activity.includes('מומלץ מאד') ? (
                                  <>
                                    {activity.split('מומלץ מאד')[0]}
                                    <span className="text-yellow-500 font-bold animate-pulse">מומלץ מאד</span>
                                    {activity.split('מומלץ מאד')[1]}
                                  </>
                                ) : (
                                  activity
                                )}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Other Option */}
                    <div className="mt-6 p-4 bg-accent/5 rounded-lg border-2 border-dashed">
                      <label className="block text-sm font-medium mb-2">
                        אפשרות אחרת (אם אין ברשימה):
                      </label>
                      <Input
                        value={otherOptions[section.id] || ''}
                        onChange={(e) => setOtherOptions({
                          ...otherOptions,
                          [section.id]: e.target.value
                        })}
                        placeholder="תאר פעילות שאינה מופיעה ברשימה..."
                        className="border-2"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
        )}

        {/* Contact Form */}
        <div className="mt-12">
          <Card className="max-w-4xl mx-auto border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-center">פרטי יצירת קשר</CardTitle>
              <CardDescription className="text-center">
                אנא מלא את הפרטים הבאים כדי שנוכל לחזור אליך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    שם מלא <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    placeholder="הכנס שם מלא"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    כתובת אימייל <span className="text-destructive">*</span>
                  </label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="הכנס כתובת אימייל"
                    dir="ltr"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    שם החברה <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={contactInfo.company}
                    onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                    placeholder="הכנס שם חברה"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מספר וואטסאפ <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={contactInfo.whatsappNumber}
                    onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })}
                    placeholder="הכנס מספר וואטסאפ"
                    dir="ltr"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מספר משרד
                  </label>
                  <Input
                    value={contactInfo.officeNumber}
                    onChange={(e) => setContactInfo({ ...contactInfo, officeNumber: e.target.value })}
                    placeholder="הכנס מספר משרד"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    מספר משתתפים משוער
                  </label>
                  <Input
                    value={contactInfo.participantCount}
                    onChange={(e) => setContactInfo({ ...contactInfo, participantCount: e.target.value })}
                    placeholder="כמה אנשים יהיו בטיול?"
                    type="number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    תקציב משוער של החברה לאדם ליום גיבוש+טיול
                  </label>
                  <Input
                    value={contactInfo.budgetPerPerson}
                    onChange={(e) => setContactInfo({ ...contactInfo, budgetPerPerson: e.target.value })}
                    placeholder="275 שקל"
                    type="number"
                    step="25"
                    min="275"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    סוג הטיול
                  </label>
                  <select
                    value={contactInfo.tourType}
                    onChange={(e) => setContactInfo({ ...contactInfo, tourType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="יום אחד">יום אחד</option>
                    <option value="מספר ימים">מספר ימים</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    תאריך מוצע לאירוע
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-right font-normal h-10",
                          !suggestedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="ml-2 h-4 w-4" />
                        {suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : <span>בחר תאריך</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={suggestedDate}
                        onSelect={setSuggestedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  הערות ומשאלות מיוחדות על היום או סיבת היום בטבע
                </label>
                <Textarea
                  value={contactInfo.specialComments}
                  onChange={(e) => setContactInfo({ ...contactInfo, specialComments: e.target.value })}
                  placeholder="שתף אותנו בפרטים נוספים, משאלות מיוחדות או סיבת האירוע..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">
                  שפות: יש לציין את השפה הנדרשת לאורחים שלכם
                </label>
                <Input
                  value={contactInfo.language}
                  onChange={(e) => setContactInfo({ ...contactInfo, language: e.target.value })}
                  placeholder="למשל: אנגלית, ספרדית, צרפתית, גרמנית..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-center gap-4">
                <CardTitle className="text-2xl">סיכום הבחירות שלך ליום כייף</CardTitle>
                <Button 
                  onClick={handleSendPreferences}
                  disabled={isSending}
                  className="gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? 'שולח...' : 'שלח למייל'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {sections.map((section) => (
                  <div key={section.id} className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                      <span className="text-white font-bold">{(selections[section.id] || []).length}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">קטגוריה {section.id}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
