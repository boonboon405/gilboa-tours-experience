import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sunrise, Waves, Landmark, Wine, Clock, CheckCircle2, ChevronDown, ChevronUp, Send, CalendarIcon, Sparkles, RefreshCw, Bike, Footprints, Mountain, Trophy, Target, Heart, Camera, Utensils, Coffee, BookOpen, Users, Palette, Dumbbell, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TeamDNAQuiz } from '@/components/TeamDNAQuiz';
import { QuizResults } from '@/utils/quizScoring';
import { filterActivitiesByDNA } from '@/utils/activityFiltering';
import { categoryMetadata } from '@/utils/activityCategories';

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
      "הגן היפני בבית אלפא - וצפייה בשקנאים שעוברים בשבר הסורי אפריקאי",
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
      "נדידת 500,000,000 ציפורים פעמיים בשנה מעל עמק הירדן",
      "טיפוס צוק בצוק בית שאן העתיקה עם מדריך מקצועי",
      "מירוץ אופניים חשמליים בשבילי העמק",
      "פעילות פארקור ומכשולים בפארק הגלבוע",
      "אימון קומנדו בוקר עם מפקד צבאי מנוסה"
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
      "שייט קיאקים רגוע במעיין חרוד",
      "פיקניק תחת עצי דקל ליד מעיין עין מודע",
      "טיפולי ספא טבעיים במי המעיינות החמים",
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
      "דיון מנהיגות: 'מה צוותים מודרניים יכולים ללמוד מהקיבוץ?'",
      "סיור ביישוב עתיק תל אלוניים והפסיפסים הביזנטיים",
      "ביקור בתצפית נבי סמואל - מבט פנורמי על ההיסטוריה",
      "הצגה חיה של חיי הרומאים בבית שאן העתיקה",
      "סדנת ארכיאולוגיה - חפירות מדומות לאתגר צוותי"
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
      "חוויה קולינרית: ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי בבית שאן - מסעדת 'קוליזיאום' בבית שאן העתיקה (על רקע העתיקות הרומיות) - מומלץ מאד",
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
      "חוויה קולינרית: ארוחה עשירה במסעדה כשרה עם אוכל מזרחי אותנטי של חומוס אליהו- בקיבוץ בית השיטה",
      "סדנת הכנת לחמאג'ון ארמני מסורתי עם שף מקומי + כריכי איכות מפנקים",
      "ארוחת שף פרטית במרפסת נוף מול הגלבוע + כריכי איכות מפנקים",
      "אתגר 'מאסטר שף צוותי' - בישול תחרותי עם חומרי גלם מקומיים + כריכי איכות מפנקים",
      "ביקור ביקב גליל מאונטיין - טעימת יינות פרימיום + כריכי איכות מפנקים"
    ]
  }
];

// Helper function to get activity icon based on keywords
const getActivityIcon = (activity: string, sectionId: number) => {
  const activityLower = activity.toLowerCase();
  
  // Adventure activities
  if (activityLower.includes('רכב') || activityLower.includes('ג\'יפ') || activityLower.includes('אופניים')) {
    return <Bike className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('הליכה') || activityLower.includes('טיול') || activityLower.includes('נדידה')) {
    return <Footprints className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('טיפוס') || activityLower.includes('פסגת') || activityLower.includes('הר')) {
    return <Mountain className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('תחרות') || activityLower.includes('מרוץ') || activityLower.includes('אתגר')) {
    return <Trophy className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('קומנדו') || activityLower.includes('פיינטבול') || activityLower.includes('חץ וקשת')) {
    return <Target className="h-5 w-5 text-white" />;
  }
  
  // Nature & Wellness
  if (activityLower.includes('יוגה') || activityLower.includes('ספא') || activityLower.includes('מתיחה')) {
    return <Heart className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('טבע') || activityLower.includes('עצים') || activityLower.includes('פארק')) {
    return <TreePine className="h-5 w-5 text-white" />;
  }
  
  // History & Culture
  if (activityLower.includes('מוזיאון') || activityLower.includes('ביקור') || activityLower.includes('היסטור')) {
    return <BookOpen className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('צילום')) {
    return <Camera className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('יצירה') || activityLower.includes('אמנות') || activityLower.includes('סדנה')) {
    return <Palette className="h-5 w-5 text-white" />;
  }
  
  // Food & Culinary
  if (activityLower.includes('בישול') || activityLower.includes('אוכל') || activityLower.includes('מסעדה') || activityLower.includes('טעימה')) {
    return <Utensils className="h-5 w-5 text-white" />;
  }
  if (activityLower.includes('קפה') || activityLower.includes('תה') || activityLower.includes('טוסט')) {
    return <Coffee className="h-5 w-5 text-white" />;
  }
  
  // Sports & Fitness
  if (activityLower.includes('אימון') || activityLower.includes('ספורט') || activityLower.includes('כושר')) {
    return <Dumbbell className="h-5 w-5 text-white" />;
  }
  
  // Team activities
  if (activityLower.includes('צוות') || activityLower.includes('קבוצ') || activityLower.includes('גיבוש')) {
    return <Users className="h-5 w-5 text-white" />;
  }
  
  // Default icons based on section
  switch (sectionId) {
    case 1: return <Mountain className="h-5 w-5 text-white" />;
    case 2: return <Waves className="h-5 w-5 text-white" />;
    case 3: return <Landmark className="h-5 w-5 text-white" />;
    case 4: return <Wine className="h-5 w-5 text-white" />;
    default: return <Sparkles className="h-5 w-5 text-white" />;
  }
};

export const ChooseYourDay = () => {
  const { toast } = useToast();
  const [selections, setSelections] = useState<Record<number, number[]>>({
    1: [],
    2: [],
    3: [],
    4: []
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
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  // Load quiz results from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('teamDNAResults');
    if (savedResults) {
      try {
        setQuizResults(JSON.parse(savedResults));
      } catch (e) {
        console.error('Failed to parse saved quiz results', e);
      }
    } else {
      // Show quiz if no saved results
      setShowQuiz(true);
    }
  }, []);

  const handleQuizComplete = (results: QuizResults) => {
    setQuizResults(results);
    setShowAllActivities(false);
  };

  const handleResetQuiz = () => {
    localStorage.removeItem('teamDNAResults');
    setQuizResults(null);
    setShowAllActivities(false);
    setShowQuiz(true);
  };

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
    } else if (currentSelections.length < 5) {
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
      let requestData: any = {
        contactInfo,
        suggestedDate: suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : null,
        tourType: '100 Topics Day'
      };
      // Build the selections data with activity names for 100 topics
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

      requestData.selections = selectionsData;

      const { error } = await supabase.functions.invoke('send-preferences-email', {
        body: requestData
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
    <>
      {/* Team DNA Quiz Modal */}
      <TeamDNAQuiz 
        open={showQuiz}
        onClose={() => setShowQuiz(false)}
        onComplete={handleQuizComplete}
      />

      <section id="choose-your-day" className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              יום כייף וגיבוש לחברות - כ100 טיולים ואטרקציות לבחירה
            </h2>
            
            {/* DNA Results Banner */}
            {quizResults && !showAllActivities && (
              <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">הפעילויות נבחרו במיוחד עבורכם</h3>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  בהתאם ל-DNA של הצוות שלכם:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                  {quizResults.topCategories.map((category) => {
                    const meta = categoryMetadata[category];
                    const percentage = quizResults.percentages[category];
                    return (
                      <Badge key={category} variant="outline" className="text-base px-4 py-2">
                        <span className="text-xl ml-2">{meta.icon}</span>
                        {meta.name}
                        <span className="text-primary font-bold mr-2">({percentage}%)</span>
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" size="sm" onClick={handleResetQuiz}>
                    <RefreshCw className="h-4 w-4 ml-2" />
                    שנה העדפות
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAllActivities(true)}>
                    הצג את כל הפעילויות
                  </Button>
                </div>
              </div>
            )}

            {showAllActivities && (
              <div className="max-w-4xl mx-auto mb-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  מציג את כל הפעילויות.
                  <Button variant="link" size="sm" onClick={() => setShowAllActivities(false)} className="mr-2">
                    חזור לפעילויות המומלצות
                  </Button>
                </p>
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl text-muted-foreground">
                בחרו מתוך הקטגוריות את  האטרקציות או האתרים המועדפים עליכם
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
        </div>

          {/* Sections */}
          <div className="max-w-7xl mx-auto space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const currentSelections = selections[section.id] || [];
              const isExpanded = expandedSections.has(section.id);
              
              // Filter activities based on quiz results - show top 4 recommended
              const displayActivities = (quizResults && !showAllActivities)
                ? filterActivitiesByDNA(section.activities, quizResults, 4)
                : section.activities.map((text, index) => ({ text, index, relevanceScore: 0, matchedCategories: [] }));
              
              const hasRecommendations = quizResults && !showAllActivities;
              
              return (
                <Card 
                  key={section.id} 
                  className="border-2 hover:shadow-strong transition-all duration-300"
                >
                  <CardHeader 
                    className="cursor-pointer relative"
                    onClick={() => toggleSection(section.id)}
                  >
                    {hasRecommendations && (
                      <Badge className="absolute top-4 left-4 bg-gradient-hero text-white border-none flex items-center gap-1 shadow-glow z-10">
                        <Sparkles className="h-3 w-3 animate-pulse-slow" />
                        מומלץ
                      </Badge>
                    )}
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
                              בחר עד 5 פעילויות, יחד נקבע את האטרקציה הכי מתאימה בהיתחשב בזמנים ואפשרויות בשטח ומזג אויר
                            </span>
                            <div 
                              className={`font-bold text-lg px-4 py-2 rounded-full ${
                                currentSelections.length === 0 
                                  ? 'bg-muted text-muted-foreground border-2 border-border' 
                                  : 'bg-primary text-primary-foreground shadow-lg'
                              }`}
                            >
                              {currentSelections.length}/5 נבחרו
                            </div>
                          </div>
                          {quizResults && !showAllActivities && (
                            <p className="text-xs text-muted-foreground mt-2">
                              מציג {displayActivities.length} פעילויות מומלצות מתוך {section.activities.length}
                            </p>
                          )}
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
                        {displayActivities.map(({ text: activity, index }) => {
                          const isSelected = currentSelections.includes(index);
                          const isDisabled = !isSelected && currentSelections.length >= 5;
                          const activityIcon = getActivityIcon(activity, section.id);
                        
                        return (
                          <div
                            key={index}
                            onClick={() => !isDisabled && toggleActivity(section.id, index)}
                            className={`
                              group relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]' 
                                : isDisabled
                                  ? 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-sm'
                              }
                            `}
                          >
                            {/* Icon */}
                            <div className={cn(
                              "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                              isSelected 
                                ? `bg-gradient-to-br ${section.color} shadow-md` 
                                : "bg-muted/50 group-hover:bg-muted"
                            )}>
                              {activityIcon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-sm leading-relaxed">
                                <span className="font-semibold text-primary ml-1">{index + 1}.</span>
                                {typeof activity === 'string' && activity.includes('מומלץ מאד') ? (
                                  <>
                                    {activity.split('מומלץ מאד')[0]}
                                    <span className="inline-flex items-center gap-1 text-yellow-600 font-bold animate-pulse-slow">
                                      <Sparkles className="h-3 w-3 inline" />
                                      מומלץ מאד
                                    </span>
                                    {activity.split('מומלץ מאד')[1]}
                                  </>
                                ) : (
                                  activity
                                )}
                              </p>
                            </div>
                            
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                                <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                              </div>
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

        {/* Combined Summary and Contact Form */}
        <div className="max-w-6xl mx-auto my-12">
          <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                סיכום הבחירות שלך ליום כיף
              </CardTitle>
              <CardDescription className="text-center">
                אנא מלא את הפרטים הבאים כדי שנוכל לחזור אליך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Category Summary Circles */}
              <div className="flex flex-wrap justify-center gap-8 py-6">
                {sections.map((section) => {
                  const count = (selections[section.id] || []).length;
                  const colorClasses = [
                    'from-orange-500 to-yellow-500',
                    'from-blue-500 to-cyan-400',
                    'from-amber-600 to-orange-500',
                    'from-purple-600 to-pink-500'
                  ];
                  
                  return (
                    <div key={section.id} className="flex flex-col items-center gap-3">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses[section.id - 1]} flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
                        {count}
                      </div>
                      <span className="text-lg font-medium">קטגוריה {section.id}</span>
                    </div>
                  );
                })}
              </div>

              {/* Contact Form Fields */}
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
                  הערות ומשאלות מיוחדות אותם מבקשים האורחים
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

              {/* Send Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={handleSendPreferences}
                  disabled={isSending}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <Send className="h-5 w-5 ml-2" />
                  {isSending ? 'שולח...' : 'שלח למייל'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        </div>
      </section>
    </>
  );
};
