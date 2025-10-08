import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sunrise, Waves, Landmark, Wine, Clock } from 'lucide-react';

const sections = [
  {
    id: 1,
    icon: Sunrise,
    titleEn: "Morning Kickoff / Energy & Adventure",
    titleHe: "התחלת בוקר / אנרגיה והרפתקאות",
    time: "09:00 - 11:30",
    color: "from-orange-500 to-yellow-500",
    activities: [
      { en: "Electric-car navigation challenge between four springs in the Gilboa foothills", he: "אתגר ניווט ברכבי-חשמל בין ארבעה מעיינות למרגלות הגלבוע" },
      { en: "Jeep convoy through Beit She'an Valley", he: "שיירת ג'יפים דרך עמק בית שאן" },
      { en: "Off-road rally across the fields of Kibbutz Nir David", he: "ראלי שטח בשדות קיבוץ ניר דוד" },
      { en: "Nahal HaKibbutzim water-trail walk with ODT teamwork obstacles", he: "הליכת שביל מים בנחל הקיבוצים עם מכשולי עבודת צוות ODT" },
      { en: "Sunrise hot-air-balloon flight over the valley, followed by an ODT session", he: "טיסת כדור פורח בשחר מעל העמק, ולאחריה מפגש ODT" },
      { en: "Orienteering ODT competition through Beit Alfa Forest", he: "תחרות ODT ניווט דרך יער בית אלפא" },
      { en: "ODT mountain circuit around the Ein Harod area", he: "מסלול הרים ODT באזור עין חרוד" },
      { en: "ODT trail relay along the Kantara Bridge near Beit She'an", he: "שליחים במסלול ODT לאורך גשר הקנטרה ליד בית שאן" },
      { en: "ODT and team-kayak race on the Jordan River outlet", he: "מרוץ ODT וקיאקים קבוצתיים במוצא נהר הירדן" },
      { en: "Horseback riding with ODT teamwork stations", he: "רכיבה על סוסים עם תחנות עבודת צוות ODT" },
      { en: "Paintball 'Conquer the Valley!' combat in Nir David + ODT session", he: "קרב פיינטבול 'כבוש את העמק!' בניר דוד + מפגש ODT" },
      { en: "Archery contest near Beit Hashita + ODT session", he: "תחרות חץ וקשת ליד בית השיטה + מפגש ODT" },
      { en: "Rappelling & climbing challenge on Gilboa cliffs + ODT session", he: "אתגר rappelling וטיפוס על צוקי הגלבוע + מפגש ODT" },
      { en: "Tug-of-war on the lawns of Harod + ODT session", he: "משיכת חבל על דשאי חרוד + מפגש ODT" },
      { en: "Inflatable water-obstacle park near Gan Hashlosha + ODT session", he: "פארק מכשולי מים מתנפחים ליד גן השלושה + מפגש ODT" },
      { en: "Outdoor group yoga or power-stretching beside the Valley Springs + ODT session", he: "יוגה קבוצתית או מתיחת כוח בחוץ ליד מעיינות העמק + מפגש ODT" },
      { en: "Rowing contest (boats or kayaks) on the Kinneret + ODT session", he: "תחרות חתירה (סירות או קיאקים) בכנרת + מפגש ODT" },
      { en: "Group photo treasure hunt through kibbutz lanes + ODT session", he: "ציד אוצר צילומי קבוצתי בסמטאות הקיבוץ + מפגש ODT" },
      { en: "Zipline and rope-bridge challenge in a scenic grove + ODT session", he: "אתגר זיפליין וגשר חבלים בחורשה נופית + מפגש ODT" },
      { en: "Quad-bike exploration of Gilboa ridge roads + ODT session", he: "חקירת כבישי רכס הגלבוע ברכבי שטח + מפגש ODT" },
      { en: "'Amazing Race: Gilboa Edition' checkpoint challenge + ODT session", he: "'מירוץ למיליון: מהדורת הגלבוע' אתגר נקודות ביקורת + מפגש ODT" },
      { en: "Laser-tag / color-bullet combat in open fields + ODT session", he: "קרב לייזר-טאג / כדורי צבע בשטחים פתוחים + מפגש ODT" },
      { en: "Nature scavenger hunt inspired by Biblical Gilboa stories + ODT session", he: "ציד אוצר בטבע בהשראת סיפורי הגלבוע המקראיים + מפגש ODT" },
      { en: "'Find King Saul's Sword' historical mission game + ODT session", he: "משחק משימה היסטורי 'מצא את חרב המלך שאול' + מפגש ODT" },
      { en: "Short hike to Gilboa summit lookout with opening coffee + ODT session", he: "טיול קצר לתצפית פסגת הגלבוע עם קפה פתיחה + מפגש ODT" }
    ]
  },
  {
    id: 2,
    icon: Waves,
    titleEn: "Midday Cooling Down / Springs & Relaxation",
    titleHe: "התקררות בצהריים / מעיינות והרגעה",
    time: "11:30 - 13:30",
    color: "from-blue-500 to-cyan-400",
    activities: [
      { en: "Swim in the warm spring pools of Hamat Gader", he: "שחייה בבריכות המעיין החמות של חמת גדר" },
      { en: "Float downstream through Nahal HaKibbutzim stream", he: "הצפה במורד זרם נחל הקיבוצים" },
      { en: "Picnic under palms beside a clear spring", he: "פיקניק תחת דקלים ליד מעיין צלול" },
      { en: "Raft-building challenge in a shallow cove", he: "אתגר בניית רפסודות במפרץ רדוד" },
      { en: "River-tube race along Nachal HaKibbutzim channel", he: "מרוץ צינורות נהר לאורך ערוץ נחל הקיבוצים" },
      { en: "Stand-up paddleboarding on a calm river section", he: "גלישת סאפ במקטע נהר רגוע" },
      { en: "Floating yoga class in spring pools", he: "שיעור יוגה צף בבריכות מעיין" },
      { en: "Mini-Olympics water games on the lawns", he: "משחקי מים מיני-אולימפיים על הדשאים" },
      { en: "'Spring Chef' challenge – cook on natural stones", he: "אתגר 'שף המעיין' – בישול על אבנים טבעיות" },
      { en: "Hammock rest and iced-coffee social zone", he: "אזור מנוחה בערסלים וקפה קר חברתי" },
      { en: "Massage rotation corner in the shade of Sakhne", he: "פינת רוטציית עיסויים בצל סחנה" },
      { en: "Body-mind 'Stress to Flow' workshop", he: "סדנת 'ממתח לזרימה' גוף-נפש" },
      { en: "Underwater photo contest in clear pools", he: "תחרות צילום מתחת למים בבריכות צלולות" },
      { en: "Water-balloon battle field", he: "שדה קרב בלוני מים" },
      { en: "Kayaking and group paddle session south Kinneret outlet", he: "מפגש קיאקים וחתירה קבוצתית במוצא דרום הכנרת" },
      { en: "Open-air acoustic music circle by the spring", he: "מעגל מוזיקה אקוסטית באוויר הפתוח ליד המעיין" },
      { en: "Mindfulness session under eucalyptus trees", he: "מפגש מיינדפולנס תחת עצי אקליפטוס" },
      { en: "Creative art corner – 'Paint the Spring'", he: "פינת אמנות יצירתית – 'צייר את המעיין'" },
      { en: "Fresh-juice and smoothie bar run by teams", he: "בר מיצים טריים וסמוזי המופעל על ידי צוותים" },
      { en: "'Silent Challenge' electric-car and river walk without words", he: "'אתגר שקט' רכב חשמלי והליכת נהר ללא מילים" },
      { en: "Meditation and reflection near a stream bank", he: "מדיטציה והתבוננות ליד גדת נחל" },
      { en: "Cooling beer tasting from a local microbrewery", he: "טעימת בירה מקררת ממבשלת בירה מקומית" },
      { en: "Natural mud activity for fun and photos", he: "פעילות בוץ טבעי לכיף ולצילומים" },
      { en: "Barefoot sensory walk along water edges", he: "הליכה תחושתית יחפה לאורך שפות המים" },
      { en: "'Zen Balance' stone-stacking contest", he: "תחרות ערימת אבנים 'איזון זן'" }
    ]
  },
  {
    id: 3,
    icon: Landmark,
    titleEn: "History & Identity / Connecting to Place",
    titleHe: "היסטוריה וזהות / התחברות למקום",
    time: "13:30 - 15:30",
    color: "from-amber-600 to-orange-500",
    activities: [
      { en: "Guided tour of the Roman-Byzantine ruins in Beit She'an", he: "סיור מודרך בחורבות הרומיות-ביזנטיות בבית שאן" },
      { en: "Explore the ancient mosaic synagogue at Beit Alfa", he: "חקור את בית הכנסת הפסיפסי העתיק בבית אלפא" },
      { en: "Visit the memorial garden in Kibbutz Beit Alfa", he: "ביקור בגן הזיכרון בקיבוץ בית אלפא" },
      { en: "Interactive Gilboa history quiz 'Who Walked Here?'", he: "חידון היסטוריה אינטראקטיבי של הגלבוע 'מי הלך כאן?'" },
      { en: "Stop at a Gilboa lookout to tell King Saul's story", he: "עצירה בתצפית הגלבוע לספר את סיפור המלך שאול" },
      { en: "Visit the art museum in Ein Harod", he: "ביקור במוזיאון האמנות בעין חרוד" },
      { en: "Storytelling circle – 'From Saul to Startups'", he: "מעגל סיפורים – 'משאול לסטארטאפים'" },
      { en: "Light fun break at a local wildlife park (kangaroos etc.)", he: "הפסקה כיפית קלה בפארק חיות בר מקומי (קנגרואים וכו')" },
      { en: "Visit a kibbutz dairy or farm for a product demo", he: "ביקור במחלבת או חווה קיבוצית להדגמת מוצרים" },
      { en: "Biblical storytelling along the ridge of Mount Gilboa", he: "סיפור מקראי לאורך רכס הר הגלבוע" },
      { en: "'Find the Hidden Verse' interactive game", he: "משחק אינטראקטיבי 'מצא את הפסוק הנסתר'" },
      { en: "Explore Talmudic-era remains at Tel Rehov", he: "חקור שרידים מתקופת התלמוד בתל רחוב" },
      { en: "Historical trivia competition with awards", he: "תחרות טריוויה היסטורית עם פרסים" },
      { en: "Visit the Pioneers Museum at Sakhne near Nir David", he: "ביקור במוזיאון החלוצים בסחנה ליד ניר דוד" },
      { en: "Walk through the wind-energy park on Mount Gilboa", he: "הליכה בפארק אנרגיית הרוח בהר הגלבוע" },
      { en: "'Time Capsule' activity comparing old and new - valley life", he: "פעילות 'קפסולת זמן' המשווה ישן וחדש - חיי העמק" },
      { en: "Role play – 'The Builders of the Kibbutz' acting task", he: "משחק תפקידים – משימת משחק 'בוני הקיבוץ'" },
      { en: "'Wisdom of the Land' guided storytelling on Gilboa mountain", he: "'חכמת הארץ' סיפור מודרך בהר הגלבוע" },
      { en: "Optional visit to the Roman baths of Hamat Gader", he: "ביקור אופציונלי במרחצאות הרומיים של חמת גדר" },
      { en: "Leadership discussion – lessons from the Israeli heritage", he: "דיון מנהיגות – לקחים מהמורשת הישראלית" }
    ]
  },
  {
    id: 4,
    icon: Wine,
    titleEn: "Culinary / Wine & Celebration",
    titleHe: "קולינריה / יין וחגיגה",
    time: "15:30 - 17:00",
    color: "from-purple-600 to-pink-500",
    activities: [
      { en: "Rich, flavorful meal at a kosher oriental restaurant—authentic taste of the region", he: "ארוחה עשירה וטעימה במסעדה מזרחית כשרה - טעם אותנטי של האזור" },
      { en: "Wine tasting at a local boutique winery", he: "טעימת יינות ביקב בוטיק מקומי" },
      { en: "Olive-oil workshop and tasting", he: "סדנת שמן זית וטעימה" },
      { en: "'MasterChef Team Challenge' outdoor cook-off", he: "'אתגר צוות מאסטר שף' תחרות בישול בחוץ" },
      { en: "Blind product tasting 'Galilee Taste Quest'", he: "טעימה עיוורת 'מסע טעמי הגליל'" },
      { en: "Traditional Home Cooking - Beit Shean", he: "בישול ביתי מסורתי - בית שאן" },
      { en: "Build-your-own BBQ corner by the water near a spring", he: "פינת BBQ עצמאית ליד המים קרוב למעיין" },
      { en: "Kibbutz lunch buffet with seasonal produce", he: "מזנון ארוחת צהריים קיבוצי עם תוצרת עונתית" },
      { en: "Team dessert challenge with dates, honey & yogurt", he: "אתגר קינוח צוותי עם תמרים, דבש ויוגורט" },
      { en: "Local beer tasting session", he: "מפגש טעימת בירה מקומית" },
      { en: "Date-farm visit – 'From Palm to Plate'", he: "ביקור בחוות תמרים – 'מהדקל לצלחת'" },
      { en: "Goat-cheese farm demo and tasting", he: "הדגמה וטעימה בחוות גבינת עיזים" },
      { en: "Picnic lunch on Harod lawns or Gilboa ridge", he: "ארוחת פיקניק על דשאי חרוד או רכס הגלבוע" },
      { en: "Juice-bar creation competition", he: "תחרות יצירת בר מיצים" },
      { en: "Food-photography contest", he: "תחרות צילום אוכל" },
      { en: "'Wine & Wisdom' group discussion over wine-Beit She'an", he: "'יין וחכמה' דיון קבוצתי על יין - בית שאן" },
      { en: "Tabun pita baking workshop", he: "סדנת אפיית פיתה בטאבון" },
      { en: "Authentic hummus class for teams at Beit Hashita Humus Eliyahu", he: "שיעור חומוס אותנטי לצוותים בבית השיטה חומוס אליהו" },
      { en: "Cooking with local herbs from garden plots", he: "בישול עם עשבי תיבול מקומיים מחלקות גינה" },
      { en: "'Sweet Endings' chocolate or halva workshop", he: "סדנת שוקולד או חלבה 'סיום מתוק'" },
      { en: "Team toasts 'LeChaim to Cooperation!' at sunset, watching Jordan Valley", he: "טוסטים קבוצתיים 'לחיים לשיתוף פעולה!' בשקיעה, מתבוננים בעמק הירדן" }
    ]
  }
];

export const ChooseYourDay = () => {
  const { language } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const toggleSection = (sectionId: number) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {language === 'en' ? 'Choose Your Day Activity' : 'בחר את פעילות היום שלך'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <p className="text-lg text-muted-foreground">
              {language === 'en' 
                ? 'Select 1 activity from each section → Morning Adventure → Spring Relaxation → Heritage Encounter → Culinary Celebration'
                : 'בחר פעילות אחת מכל קטגוריה → הרפתקת בוקר → הרגעה במעיינות → מפגש מורשת → חגיגה קולינרית'}
            </p>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <p className="font-semibold">
                {language === 'en' 
                  ? 'Combine them chronologically to form a full-day program (09:00 – 17:00)'
                  : 'שלב אותן כרונולוגית ליצירת תוכנית יום מלא (09:00 – 17:00)'}
              </p>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <Card 
                key={section.id}
                className="group hover:shadow-elegant transition-all duration-300 overflow-hidden cursor-pointer border-2"
                onClick={() => toggleSection(section.id)}
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
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {section.time}
                      </Badge>
                      <CardDescription className="text-white/90 mt-2 font-medium">
                        {language === 'en' 
                          ? `Choose 1 of ${section.activities.length} activities`
                          : `בחר פעילות אחת מתוך ${section.activities.length}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className={`space-y-2 transition-all duration-300 ${
                    isExpanded ? 'max-h-[600px] overflow-y-auto' : 'max-h-[240px] overflow-hidden'
                  }`}>
                    {section.activities.map((activity, idx) => (
                      <div 
                        key={idx}
                        className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group/item"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${section.color} text-white flex items-center justify-center text-sm font-bold`}>
                          {idx + 1}
                        </div>
                        <p className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">
                          {language === 'en' ? activity.en : activity.he}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-center">
                    <button className="text-sm font-medium text-primary hover:underline">
                      {isExpanded 
                        ? (language === 'en' ? 'Show Less' : 'הצג פחות')
                        : (language === 'en' ? 'Show All Activities' : 'הצג את כל הפעילויות')}
                    </button>
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