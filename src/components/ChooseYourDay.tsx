import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Sunrise, Waves, Landmark, Wine, Clock, CheckCircle2 } from 'lucide-react';

const sections = [
  {
    id: 1,
    icon: Sunrise,
    titleEn: "Morning Kickoff – Energy, Ice-Breaking & Adventure",
    titleHe: "פתיחת בוקר – אנרגיה, שבירת קרח והרפתקאות",
    descriptionEn: "Start the day with action, fresh air, and smiles.",
    descriptionHe: "התחל את היום עם פעולה, אוויר צח וחיוכים.",
    time: "09:00 - 11:30",
    color: "from-orange-500 to-yellow-500",
    activities: [
      { en: "Nahal Kibbutzim water trail walk (team obstacle rally)", he: "הליכת שביל מים נחל הקיבוצים (ראלי מכשולים צוותי)" },
      { en: "ATV challenge through the Gilboa foothills", he: "אתגר רכבי שטח דרך גבעות הגלבוע" },
      { en: "Jeep convoy through Beit She'an Valley", he: "שיירת ג'יפים דרך עמק בית שאן" },
      { en: "Visit the house of Aharon Aharonson (Purchaser of Jewish land)", he: "ביקור בבית אהרון אהרונסון (רוכש אדמות יהודיות)" },
      { en: "Hot-air balloon experience at sunrise over the Valley and it's fishing ponds", he: "חוויית כדור פורח בשחר מעל העמק ובריכות הדגים" },
      { en: "Orienteering competition in Beit Alfa Forest-watching Pelicans", he: "תחרות התמצאות ביער בית אלפא - צפייה בשקנאים" },
      { en: "Mountain circuit in Park Harod-The fight of Ein Jalud against the Mongols", he: "מסלול הרים בפארק חרוד - הקרב של עין ג'אלוט נגד המונגולים" },
      { en: "Trail run relay along the Beit She'an basalt canyon", he: "ריצת שליחים לאורך קניון הבזלת של בית שאן" },
      { en: "Team kayak race at Yardenit site", he: "מרוץ קיאקים צוותי באתר ירדנית" },
      { en: "Horseback ride with teamwork stations", he: "רכיבה על סוסים עם תחנות עבודת צוות" },
      { en: "Paintball battle: 'Conquer the Valley!' scenario- at Nir David", he: "קרב פיינטבול: תרחיש 'כבוש את העמק!' - בניר דוד" },
      { en: "Archery competition in the waters of Nachal Hakibutzim", he: "תחרות חץ וקשת במי נחל הקיבוצים" },
      { en: "Rappelling and climbing challenge at Mount Gilboa cliffs", he: "אתגר rappelling וטיפוס בצוקי הר הגלבוע" },
      { en: "Tug-of-war on the lawns of Ma'ayan Harod", he: "משיכת חבל על דשאי מעיין חרוד" },
      { en: "Inflatable water obstacle park (mobile setup near Gan Hashlosha)", he: "פארק מכשולי מים מתנפחים (התקנה ניידת ליד גן השלושה)" },
      { en: "Outdoor group yoga or power stretching by the springs", he: "יוגה קבוצתית או מתיחת כוח בחוץ ליד המעיינות" },
      { en: "Rowing contest on Lake Kinneret (boats or kayaks)", he: "תחרות חתירה בכנרת (סירות או קיאקים)" },
      { en: "Treasure hunt – creative mission across the valley", he: "ציד אוצר - משימה יצירתית ברחבי העמק" },
      { en: "Zipline & rope bridge activity", he: "פעילות זיפליין וגשר חבלים" },
      { en: "Quad bike exploration of Gilboa scenic ridge", he: "חקירת רכס הגלבוע הנופי ברכבי שטח" },
      { en: "Team relay 'Amazing Race: Gilboa Edition' with historical clues", he: "שליחי צוות 'מירוץ למיליון: מהדורת הגלבוע' עם רמזים היסטוריים" },
      { en: "Laser tag or color bullet combat in the fields", he: "לייזר טאג או קרב כדורי צבע בשדות" },
      { en: "Nature scavenger hunt with clues tied to biblical Gilboa stories", he: "ציד אוצר בטבע עם רמזים הקשורים לסיפורים המקראיים של הגלבוע" },
      { en: "'Find King Saul's Sword' historical puzzle game (story-based)", he: "'מצא את חרב המלך שאול' משחק חידות היסטורי (מבוסס סיפור)" },
      { en: "Short hike to the Gilboa summit lookout for the opening talk and coffee", he: "טיול קצר לתצפית פסגת הגלבוע לשיחת הפתיחה והקפה" }
    ]
  },
  {
    id: 2,
    icon: Waves,
    titleEn: "Midday Cooling Down – Springs, Water, and Relaxation",
    titleHe: "התקררות בצהריים – מעיינות, מים והרגעה",
    descriptionEn: "Balance the adrenaline with fun water experiences and relaxation.",
    descriptionHe: "איזון האדרנלין עם חוויות מים מהנות והרגעה.",
    time: "11:30 - 13:30",
    color: "from-blue-500 to-cyan-400",
    activities: [
      { en: "Swim in Gan Hashlosha (Sakhne)", he: "שחייה בגן השלושה (סחנה)" },
      { en: "Float competition in Nahal HaKibbutzim stream", he: "תחרות הצפה בזרם נחל הקיבוצים" },
      { en: "Picnic under palm trees by Ein Moda spring", he: "פיקניק תחת עצי דקל ליד מעיין עין מודע" },
      { en: "Team building 'Raft Construction Challenge' in a shallow spring", he: "בניית צוות 'אתגר בניית רפסודה' במעיין רדוד" },
      { en: "River tube race near Nir David", he: "מרוץ צינורות נהר ליד ניר דוד" },
      { en: "Stand-up paddleboarding on the Jordan River's calm section", he: "גלישת סאפ במקטע הרגוע של נהר הירדן" },
      { en: "Yoga class in the springs of the Gilboa", he: "שיעור יוגה במעיינות הגלבוע" },
      { en: "Mini-Olympics water games in Gan Hashlosha lawns", he: "משחקי מים מיני-אולימפיים בדשאי גן השלושה" },
      { en: "'Spring Chef' competition – baking bread on natural stones", he: "תחרות 'שף המעיין' – אפיית לחם על אבנים טבעיות" },
      { en: "Hammock rest & ice coffee social zone setup", he: "הקמת אזור חברתי לערסלים וקפה קר" },
      { en: "Massage corner with professional therapists (group rotation)", he: "פינת עיסוי עם מטפלים מקצועיים (רוטציה קבוצתית)" },
      { en: "Body-mind workshop: 'From Stress to Flow'", he: "סדנת גוף-נפש: 'ממתח לזרימה'" },
      { en: "Underwater photo contest at Sakhne", he: "תחרות צילום מתחת למים בסחנה" },
      { en: "Water balloon battle (always fun for office teams!)", he: "קרב בלוני מים (תמיד כיף לצוותי משרד!)" },
      { en: "Kayaking and group paddle challenge-South end of the Kinneret", he: "קיאקים ואתגר חתירה קבוצתי - קצה דרום הכנרת" },
      { en: "Open-air acoustic music circle by the spring", he: "מעגל מוזיקה אקוסטית באוויר הפתוח ליד המעיין" },
      { en: "Mindfulness session under eucalyptus trees", he: "מפגש מיינדפולנס תחת עצי אקליפטוס" },
      { en: "Creative art corner: 'Paint the Spring'", he: "פינת אמנות יצירתית: 'צייר את המעיין'" },
      { en: "Fresh juice and smoothie bar run by team members", he: "בר מיצים טריים וסמוזי המופעל על ידי חברי הצוות" },
      { en: "'Silent Challenge' – communicate without words during the river walk", he: "'אתגר שקט' – תקשורת ללא מילים במהלך הליכת הנהר" },
      { en: "Meditation & reflection time near Beit Alfa stream", he: "זמן מדיטציה והתבוננות ליד נחל בית אלפא" },
      { en: "Cooling-down beer tasting from a local microbrewery", he: "טעימת בירה מקררת ממבשלת בירה מקומית" },
      { en: "Natural mud therapy activity (fun & photo-friendly)", he: "פעילות טיפול בוץ טבעי (כיף וידידותי לצילום)" },
      { en: "Light barefoot walk along the water channel path", he: "הליכה יחפה קלה לאורך נתיב תעלת המים" },
      { en: "'Zen Challenge' – balance stones competition near Hot Water Springs, Tiberias", he: "'אתגר זן' – תחרות איזון אבנים ליד המעיינות החמים, טבריה" }
    ]
  },
  {
    id: 3,
    icon: Landmark,
    titleEn: "History & Identity – Connecting to Place and Purpose",
    titleHe: "היסטוריה וזהות – התחברות למקום ומטרה",
    descriptionEn: "Enrich the experience with meaningful cultural and historical stops.",
    descriptionHe: "העשר את החוויה עם עצירות תרבותיות והיסטוריות משמעותיות.",
    time: "13:30 - 15:30",
    color: "from-amber-600 to-orange-500",
    activities: [
      { en: "Guided tour of Beit She'an Roman city (Scythopolis)", he: "סיור מודרך בעיר הרומית בית שאן (סקיתופוליס)" },
      { en: "Explore the Beit Alfa Synagogue mosaic and its symbolism", he: "חקור את פסיפס בית הכנסת בית אלפא וסמליותו" },
      { en: "Visit the Asaf Shamir and Dubi Shamir, Memorial garden-Golboa", he: "ביקור בגן הזיכרון לאסף שמיר ודובי שמיר - גולבוע" },
      { en: "Interactive history quiz: 'Who Walked Here Before Us?'", he: "חידון היסטוריה אינטראקטיבי: 'מי הלך כאן לפנינו?'" },
      { en: "Stop at Mount Gilboa lookout – the story of King Saul's last battle", he: "עצירה בתצפית הר הגלבוע – הסיפור של הקרב האחרון של המלך שאול" },
      { en: "Visit Kibbutz Ein Harod Museum of Art (creative pause)", he: "ביקור במוזיאון האמנות של קיבוץ עין חרוד (הפסקה יצירתית)" },
      { en: "Storytelling circle: 'From Saul to Startup Nation – Leadership Through the Ages'", he: "מעגל סיפורים: 'משאול לעם הסטארטאפים – מנהיגות לאורך הדורות'" },
      { en: "Visit Gan Garoo Australian Park for light fun", he: "ביקור בגן גרו פארק אוסטרלי לכיף קל" },
      { en: "Visit a local kibbutz dairy farm – taste, learn, and laugh", he: "ביקור בחוות חלב קיבוצית מקומית – טעם, למד וצחק" },
      { en: "Biblical storytelling session at the Gilboa ridge-Kingdom of Shaul", he: "מפגש סיפורים מקראיים ברכס הגלבוע - ממלכת שאול" },
      { en: "'Find the Hidden Verse' – interactive historical game", he: "'מצא את הפסוק הנסתר' – משחק היסטורי אינטראקטיבי" },
      { en: "Visit Talmudic-era remains at Tel Rehov", he: "ביקור בשרידים מתקופת התלמוד בתל רחוב" },
      { en: "Historical trivia competition with prizes", he: "תחרות טריוויה היסטורית עם פרסים" },
      { en: "Visit the Museum in Sachne (Ancient settlements in the valley)", he: "ביקור במוזיאון בסחנה (יישובים עתיקים בעמק)" },
      { en: "Visit at Nir David Choma Ve Migdal Museum", he: "ביקור במוזיאון חומה ומגדל בניר דוד" },
      { en: "'Time Capsule' activity – comparing ancient and modern teamwork", he: "פעילות 'קפסולת זמן' – השוואת עבודת צוות עתיקה ומודרנית" },
      { en: "Visit Hamat Gader Roman baths (optional extension)", he: "ביקור במרחצאות הרומיים חמת גדר (הרחבה אופציונלית)" },
      { en: "Leadership discussion: 'What Can Modern Teams Learn from the Kibbutz?'", he: "דיון מנהיגות: 'מה יכולים צוותים מודרניים ללמוד מהקיבוץ?'" }
    ]
  },
  {
    id: 4,
    icon: Wine,
    titleEn: "Culinary, Wine, and Celebration",
    titleHe: "קולינריה, יין וחגיגה",
    descriptionEn: "Good food unites people. Here, taste and teamwork meet joy.",
    descriptionHe: "אוכל טוב מאחד אנשים. כאן, טעם ועבודת צוות נפגשים עם שמחה.",
    time: "15:30 - 17:00",
    color: "from-purple-600 to-pink-500",
    activities: [
      { en: "Culinary Experience: Rich, flavorful meal at a kosher oriental restaurant—authentic taste of the region-Beit Shean", he: "חוויה קולינרית: ארוחה עשירה וטעימה במסעדה מזרחית כשרה - טעם אותנטי של האזור - בית שאן" },
      { en: "Wine tasting at a local boutique winery (e.g., Ramat Sirin, Jezreel Valley)", he: "טעימת יינות ביקב בוטיק מקומי (לדוגמה, רמת שירין, עמק יזרעאל)" },
      { en: "Olive oil workshop and tasting", he: "סדנת שמן זית וטעימה" },
      { en: "'MasterChef Team Challenge' outdoor cooking competition", he: "'אתגר צוות מאסטר שף' תחרות בישול בחוץ" },
      { en: "'Galilee Taste Quest' – blind tasting of local products", he: "'מסע טעמי הגליל' – טעימה עיוורת של מוצרים מקומיים" },
      { en: "Traditional poyke cooking challenge (teams compete)", he: "אתגר בישול פויקה מסורתי (צוותים מתחרים)" },
      { en: "Build-your-own BBQ corner by the water", he: "פינת BBQ עצמאית ליד המים" },
      { en: "Kibbutz lunch buffet – local, seasonal produce in Nir David", he: "מזנון ארוחת צהריים קיבוצי – תוצרת מקומית ועונתית בניר דוד" },
      { en: "Team dessert challenge with local dates, honey, and yogurt", he: "אתגר קינוח צוותי עם תמרים, דבש ויוגורט מקומיים" },
      { en: "Local beer tasting session", he: "מפגש טעימת בירה מקומית" },
      { en: "Date farm visit – 'From Palm to Plate' - at Moshava Kineret", he: "ביקור בחוות תמרים – 'מהדקל לצלחת' - במושבה כנרת" },
      { en: "Visit a goat cheese farm – tasting & milking demo", he: "ביקור בחוות גבינת עיזים – טעימה והדגמת חליבה" },
      { en: "Picnic lunch at Ma'ayan Harod lawns", he: "ארוחת פיקניק בדשאי מעיין חרוד" },
      { en: "Juice bar creation competition", he: "תחרות יצירת בר מיצים" },
      { en: "Day Photography contest", he: "תחרות צילום יומי" },
      { en: "'Wine and Wisdom' – informal group discussion over local wine", he: "'יין וחכמה' – דיון קבוצתי בלתי פורמלי על יין מקומי" },
      { en: "Pita baking workshop in tabun ovens", he: "סדנת אפיית פיתה בטאבון" },
      { en: "Authentic hummus-making class – group challenge", he: "שיעור הכנת חומוס אותנטי – אתגר קבוצתי" },
      { en: "Cooking with herbs from local gardens", he: "בישול עם עשבי תיבול מגינות מקומיות" },
      { en: "'Sweet Endings' – chocolate, halva, or Fruit from the top of the Gilboa-Scenic lookout", he: "'סיומים מתוקים' – שוקולד, חלווה או פירות מפסגת הגלבוע - תצפית נופית" },
      { en: "Team toast ceremony – 'LeChaim to Cooperation!' - In Ein Migdal", he: "טקס טוסט צוותי – 'לחיים לשיתוף פעולה!' - בעין מגדל" }
    ]
  }
];

export const ChooseYourDay = () => {
  const { language } = useLanguage();
  const [selections, setSelections] = useState<{ [sectionId: number]: Set<number> }>({
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set()
  });
  const [otherInputs, setOtherInputs] = useState<{ [sectionId: number]: string }>({});

  const toggleActivity = (sectionId: number, activityIndex: number) => {
    setSelections(prev => {
      const newSelections = { ...prev };
      const sectionSet = new Set(prev[sectionId]);
      
      if (sectionSet.has(activityIndex)) {
        sectionSet.delete(activityIndex);
      } else if (sectionSet.size < 8) {
        sectionSet.add(activityIndex);
      }
      
      newSelections[sectionId] = sectionSet;
      return newSelections;
    });
  };

  const handleOtherInput = (sectionId: number, value: string) => {
    setOtherInputs(prev => ({ ...prev, [sectionId]: value }));
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {language === 'en' ? 'Non Forgettable Options' : 'אפשרויות בלתי נשכחות'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Select up to 8 activities from each section to help us understand your needs and create the perfect unforgettable day for your team.'
                : 'בחר עד 8 פעילויות מכל קטגוריה כדי לעזור לנו להבין את הצרכים שלך וליצור את היום המושלם והבלתי נשכח לצוות שלך.'}
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <p className="font-semibold">
                {language === 'en' 
                  ? 'Combine selections chronologically to form a full-day program (09:00 – 17:00)'
                  : 'שלב בחירות כרונולוגית ליצירת תוכנית יום מלא (09:00 – 17:00)'}
              </p>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            const selectedCount = selections[section.id].size;
            
            return (
              <Card 
                key={section.id}
                className="overflow-hidden border-2 hover:shadow-elegant transition-all duration-300"
              >
                <CardHeader className={`bg-gradient-to-r ${section.color} text-white`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {language === 'en' ? section.titleEn : section.titleHe}
                      </CardTitle>
                      <CardDescription className="text-white/90 mb-2">
                        {language === 'en' ? section.descriptionEn : section.descriptionHe}
                      </CardDescription>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-white/90 text-foreground">
                          {section.time}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={`${selectedCount === 8 ? 'bg-green-500' : 'bg-white/70'} text-foreground`}
                        >
                          {selectedCount}/8 {language === 'en' ? 'selected' : 'נבחרו'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {section.activities.map((activity, idx) => {
                      const isSelected = selections[section.id].has(idx);
                      const isDisabled = !isSelected && selectedCount >= 8;
                      
                      return (
                        <div 
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                            isSelected 
                              ? `border-${section.color.split(' ')[0].replace('from-', '')} bg-accent` 
                              : isDisabled
                              ? 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                              : 'border-border hover:border-primary/50 hover:bg-accent/50 cursor-pointer'
                          }`}
                          onClick={() => !isDisabled && toggleActivity(section.id, idx)}
                        >
                          <Checkbox 
                            checked={isSelected}
                            disabled={isDisabled}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="text-sm">
                              {language === 'en' ? activity.en : activity.he}
                            </p>
                          </div>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Other Option */}
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium mb-2 block">
                      {language === 'en' 
                        ? 'Other (please specify):' 
                        : 'אחר (אנא פרט):'}
                    </label>
                    <Input
                      placeholder={language === 'en' 
                        ? 'Enter your custom activity preference...' 
                        : 'הזן את העדפת הפעילות המותאמת אישית שלך...'}
                      value={otherInputs[section.id] || ''}
                      onChange={(e) => handleOtherInput(section.id, e.target.value)}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};