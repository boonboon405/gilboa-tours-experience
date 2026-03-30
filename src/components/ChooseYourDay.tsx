import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sunrise, Waves, Landmark, Wine, Clock, CheckCircle2, ChevronDown, ChevronUp, Send, CalendarIcon, Sparkles, RefreshCw, Bike, Footprints, Mountain, Trophy, Target, Heart, Camera, Utensils, Coffee, BookOpen, Users, Palette, Dumbbell, TreePine, Image as ImageIcon } from 'lucide-react';
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
import { FavoritesManager } from '@/components/FavoritesManager';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ImageGallery } from '@/components/ImageGallery';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-gilboa.jpg';
import clubCarsImage from '@/assets/club-cars.jpg';
import odtTeamImage from '@/assets/odt-team.jpg';
import culinaryImage from '@/assets/culinary-experience.jpg';
import springsActivityImage from '@/assets/springs-activity.jpg';
import pelicansImage from '@/assets/pelicans.jpg';
import beitSheanImage from '@/assets/beit-shean.jpg';
import springsCombinedImage from '@/assets/springs-clubcars-combined.jpg';

interface Section {
  id: number;
  icon: any;
  title: string;
  description: string;
  time: string;
  color: string;
  images?: { src: string; alt: string; title: string }[];
  activities: string[];
}

const getSections = (isHe: boolean): Section[] => [
  {
    id: 1,
    icon: Sunrise,
    title: isHe ? "פתיחת בוקר – אנרגיה, שבירת קרח והרפתקאות" : "Morning Kickoff – Energy, Icebreakers & Adventures",
    description: isHe ? "התחל את היום עם פעולה, אוויר צח וחיוכים." : "Start the day with action, fresh air and smiles.",
    time: "09:00 - 11:30",
    color: "from-orange-500 to-yellow-500",
    images: [
      { src: heroImage, alt: isHe ? 'רכס הגלבוע המרהיב' : 'Stunning Gilboa Ridge', title: isHe ? 'רכס הגלבוע המרהיב' : 'Stunning Gilboa Ridge' },
      { src: clubCarsImage, alt: isHe ? 'אתגר רכבי שטח' : 'Off-Road Vehicle Challenge', title: isHe ? 'אתגר רכבי שטח' : 'Off-Road Challenge' },
      { src: pelicansImage, alt: isHe ? 'נדידת ציפורים' : 'Bird Migration', title: isHe ? 'נדידת ציפורים' : 'Bird Migration' },
      { src: springsCombinedImage, alt: isHe ? 'פעילויות בטבע' : 'Nature Activities', title: isHe ? 'פעילויות בטבע' : 'Nature Activities' }
    ],
    activities: isHe ? [
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
    ] : [
      "Walk through the crystal-clear Nahal HaKibbutzim stream (team obstacle rally) – Highly Recommended",
      "Off-road vehicle challenge through the Gilboa hills",
      "Jeep navigation tour through Beit She'an Valley",
      "Visit Aaron Aaronsohn's house (Land of Israel pioneer)",
      "Hot air balloon experience at dawn over the valley & fish ponds",
      "Japanese Garden at Beit Alpha – pelican watching on the Syrian-African Rift",
      "Mountain trail at Harod Park – Battle of Ain Jalut against the Mongols",
      "Relay race along the Beit She'an basalt canyon",
      "Team kayak race at Yardenit",
      "Horseback riding in the valley",
      "Paintball battle: 'Conquer the Valley!' scenario in Nir David",
      "Archery competition in Nahal HaKibbutzim waters",
      "Rappelling & rock climbing on Mount Gilboa cliffs",
      "Tug-of-war on Maayan Harod lawns",
      "Inflatable water obstacle park (mobile setup near Gan HaShlosha)",
      "Group yoga or outdoor stretching near the springs",
      "Rowing competition on the Sea of Galilee (boats or kayaks)",
      "Treasure hunt – creative mission across the valley",
      "Zipline and rope bridge activity",
      "Unique journey along the Gilboa ridge – 7 scenic lookout points",
      "Team relay 'Amazing Race: Gilboa Edition' with historical clues",
      "Basalt canyon bridge – view into Jordan",
      "Nature treasure hunt with clues tied to the biblical stories of Gilboa",
      "'Find King Saul's Sword' – historical puzzle game (story-based)",
      "Short hike to the Gilboa summit for an opening talk & coffee",
      "500 million birds migrating twice a year over the Jordan Valley",
      "Cliff climbing at ancient Beit She'an with a professional guide",
      "Electric bike race on valley trails",
      "Parkour and obstacle course at Gilboa Park",
      "Morning commando training with an experienced military commander"
    ]
  },
  {
    id: 2,
    icon: Waves,
    title: isHe ? "התקררות בצהריים – מעיינות, מים והרגעה" : "Midday Cool-Down – Springs, Water & Relaxation",
    description: isHe ? "איזון האדרנלין עם חוויות ODT, משחקי מים, מהנות והרגעה" : "Balance the adrenaline with ODT experiences, water games, fun and relaxation",
    time: "11:30 - 13:30",
    color: "from-blue-500 to-cyan-400",
    activities: isHe ? [
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
    ] : [
      "Electric vehicle challenge through 4 springs – navigation at the foot of western Gilboa – Highly Recommended",
      "Swimming at Gan HaShlosha (Sachne)",
      "Relaxed kayak cruise on Maayan Harod",
      "Picnic under palm trees near Ein Moda spring",
      "Natural spa treatments in the warm spring waters",
      "Team building 'Raft Construction Challenge' in a shallow spring",
      "Relay race through Nahal HaKibbutzim channels",
      "SUP surfing on a calm section of the Jordan River",
      "Yoga class at the Gilboa springs",
      "Mini-Olympic water games on Gan HaShlosha lawns",
      "'Spring Chef' competition – baking bread on natural stones",
      "Setting up a social hammock zone with cold coffee",
      "Massage corner with professional therapists (group rotation)",
      "Body-mind workshop: 'From Stress to Flow'",
      "Photography competition: flora, fauna and water at Sachne",
      "Water balloon battle (always fun for office teams!)",
      "Kayaking & group rowing challenge – southern tip of the Sea of Galilee",
      "Acoustic music circle in the open air near the spring",
      "Mindfulness session under eucalyptus trees",
      "Creative art corner: 'Paint the Spring'",
      "Fresh juice & smoothie bar run by team members",
      "'Trough Challenge' – non-verbal communication during a river walk",
      "Meditation and reflection time near Nahal HaKibbutzim",
      "Cold craft beer tasting from a local brewery",
      "Natural mud therapy activity (fun & photo-friendly)",
      "Easy barefoot walk along the water canal path",
      "'Zen Barefoot Challenge' – balancing on rounded stones near Tiberias hot springs",
      "Geological explanation of the Syrian-African Rift from eastern Gilboa overlooking the Jordan Valley"
    ]
  },
  {
    id: 3,
    icon: Landmark,
    title: isHe ? "היסטוריה וזהות – התחברות למקום ומטרה" : "History & Identity – Connecting to Place & Purpose",
    description: isHe ? "העשר את החוויה עם עצירות תרבותיות והיסטוריות משמעותיות." : "Enrich the experience with meaningful cultural and historical stops.",
    time: "13:30 - 15:30",
    color: "from-amber-600 to-orange-500",
    activities: isHe ? [
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
    ] : [
      "Guided tour of the Roman amphitheater at Beit She'an (Scythopolis) – Highly Recommended",
      "Explore the Beit Alpha synagogue mosaic and its symbolism",
      "Visit the memorial garden for Assaf & Dubi Shamir, father and son who fell in battle – Gilboa",
      "Guided tour of the Roman city of Beit She'an (Scythopolis)",
      "Stop at the Gilboa lookout – the story of King Saul's last battle",
      "Visit the Ein Harod Kibbutz art museum (a creative break)",
      "Storytelling circle: 'From Saul's Kingdom to the Startup Nation – Leadership Through the Ages'",
      "Visit the Australian Guru Garden for some light fun",
      "Visit a local kibbutz dairy farm – tasting, learning and laughter",
      "Biblical story session on the Gilboa ridge – Kingdom of Saul",
      "'Find the Hidden Verse' – interactive historical game",
      "Roaring waterfalls flowing straight into the Sea of Galilee – Pninat Hemda",
      "Historical trivia competition with prizes",
      "Visit the Sachne museum (ancient settlements in the valley)",
      "Visit the Tower and Stockade Museum in Nir David",
      "'Time Capsule' activity – comparing ancient and modern teamwork",
      "Visit the Roman baths at Hamat Gader (optional extension)",
      "Leadership discussion: 'What can modern teams learn from the Kibbutz?'",
      "Tour of the ancient settlement at Tel Alonim and its Byzantine mosaics",
      "Visit Nabi Samuel viewpoint – a panoramic view of history",
      "Live reenactment of Roman life at ancient Beit She'an",
      "Archaeology workshop – simulated excavation as a team challenge"
    ]
  },
  {
    id: 4,
    icon: Wine,
    title: isHe ? "קולינריה, יין וחגיגה" : "Culinary, Wine & Celebration",
    description: isHe ? "אוכל טוב  + כריכי איכות מפנקים מאחד אנשים. כאן, טעם ועבודת צוות פוגשים שמחה." : "Great food + gourmet sandwiches bring people together. Here, taste and teamwork meet joy.",
    time: "15:30 - 17:00",
    color: "from-purple-600 to-pink-500",
    activities: isHe ? [
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
    ] : [
      "Culinary experience: rich meal at a kosher restaurant with authentic Eastern cuisine in Beit She'an – 'Colosseum' restaurant at ancient Beit She'an (with Roman ruins backdrop) – Highly Recommended",
      "Wine tasting at a local boutique winery (Ramat Shirin, Jezreel Valley) + gourmet sandwiches",
      "Olive oil workshop and tasting + gourmet sandwiches",
      "Nature tabun-building competition: 'Team Master Chef Challenge' + gourmet sandwiches",
      "'Galilee Flavor Journey' – blind tasting of local products + gourmet sandwiches",
      "Traditional poyke cooking challenge (competing teams) + gourmet sandwiches",
      "Your BBQ on the Gilboa + gourmet sandwiches",
      "Kibbutz lunch buffet – seasonal local produce in Nir David + gourmet sandwiches",
      "Team dessert challenge with dates, honey & local yogurt + gourmet sandwiches",
      "Local craft beer tasting session + gourmet sandwiches",
      "Date farm visit – 'From Palm to Plate' at Kinneret Colony + gourmet sandwiches",
      "Goat cheese farm visit – tasting & milking demonstration + gourmet sandwiches",
      "Picnic lunch on Maayan Harod lawns + gourmet sandwiches",
      "Juice bar creation competition + gourmet sandwiches",
      "One-hour photography competition + gourmet sandwiches",
      "'Wine & Wisdom' – informal group discussion over local wine + gourmet sandwiches",
      "Pita baking workshop in tabun ovens + gourmet sandwiches",
      "Authentic hummus-making class – group challenge + gourmet sandwiches",
      "Authentic tea brewing with local herbs + gourmet sandwiches",
      "'Sweet Ending & Special Memory' – wine, chocolate, halva or fruit at the Gilboa summit with valley views + gourmet sandwiches",
      "Team wine toast ceremony – 'L'Chaim, to collaboration!' at Ein Megdal + gourmet sandwiches",
      "Culinary experience: rich meal at a kosher restaurant with authentic Eastern hummus at Kibbutz Beit HaShita",
      "Traditional Armenian lahmajoun workshop with a local chef + gourmet sandwiches",
      "Private chef dinner on a terrace overlooking the Gilboa + gourmet sandwiches",
      "'Team Master Chef' challenge – competitive cooking with local ingredients + gourmet sandwiches",
      "Visit Galil Mountain Winery – premium wine tasting + gourmet sandwiches"
    ]
  }
];

// Helper function to get activity icon based on keywords
const getActivityIcon = (activity: string, sectionId: number) => {
  const activityLower = activity.toLowerCase();
  
  if (activityLower.includes('רכב') || activityLower.includes('ג\'יפ') || activityLower.includes('אופניים') || activityLower.includes('vehicle') || activityLower.includes('jeep') || activityLower.includes('bike')) return <Bike className="h-5 w-5 text-white" />;
  if (activityLower.includes('הליכה') || activityLower.includes('טיול') || activityLower.includes('נדידה') || activityLower.includes('walk') || activityLower.includes('hike') || activityLower.includes('migrat')) return <Footprints className="h-5 w-5 text-white" />;
  if (activityLower.includes('טיפוס') || activityLower.includes('פסגת') || activityLower.includes('הר') || activityLower.includes('climb') || activityLower.includes('summit') || activityLower.includes('mount')) return <Mountain className="h-5 w-5 text-white" />;
  if (activityLower.includes('תחרות') || activityLower.includes('מרוץ') || activityLower.includes('אתגר') || activityLower.includes('competition') || activityLower.includes('race') || activityLower.includes('challenge')) return <Trophy className="h-5 w-5 text-white" />;
  if (activityLower.includes('קומנדו') || activityLower.includes('פיינטבול') || activityLower.includes('חץ וקשת') || activityLower.includes('commando') || activityLower.includes('paintball') || activityLower.includes('archery')) return <Target className="h-5 w-5 text-white" />;
  if (activityLower.includes('יוגה') || activityLower.includes('ספא') || activityLower.includes('מתיחה') || activityLower.includes('yoga') || activityLower.includes('spa') || activityLower.includes('stretch') || activityLower.includes('mindful') || activityLower.includes('meditation')) return <Heart className="h-5 w-5 text-white" />;
  if (activityLower.includes('טבע') || activityLower.includes('עצים') || activityLower.includes('פארק') || activityLower.includes('nature') || activityLower.includes('tree') || activityLower.includes('park')) return <TreePine className="h-5 w-5 text-white" />;
  if (activityLower.includes('מוזיאון') || activityLower.includes('ביקור') || activityLower.includes('היסטור') || activityLower.includes('museum') || activityLower.includes('visit') || activityLower.includes('histor')) return <BookOpen className="h-5 w-5 text-white" />;
  if (activityLower.includes('צילום') || activityLower.includes('photo')) return <Camera className="h-5 w-5 text-white" />;
  if (activityLower.includes('יצירה') || activityLower.includes('אמנות') || activityLower.includes('סדנה') || activityLower.includes('art') || activityLower.includes('workshop') || activityLower.includes('creative')) return <Palette className="h-5 w-5 text-white" />;
  if (activityLower.includes('בישול') || activityLower.includes('אוכל') || activityLower.includes('מסעדה') || activityLower.includes('טעימה') || activityLower.includes('cook') || activityLower.includes('food') || activityLower.includes('restaurant') || activityLower.includes('tasting') || activityLower.includes('culinary')) return <Utensils className="h-5 w-5 text-white" />;
  if (activityLower.includes('קפה') || activityLower.includes('תה') || activityLower.includes('טוסט') || activityLower.includes('coffee') || activityLower.includes('tea') || activityLower.includes('toast') || activityLower.includes('beer') || activityLower.includes('wine') || activityLower.includes('בירה') || activityLower.includes('יין')) return <Coffee className="h-5 w-5 text-white" />;
  if (activityLower.includes('אימון') || activityLower.includes('ספורט') || activityLower.includes('כושר') || activityLower.includes('training') || activityLower.includes('sport') || activityLower.includes('fitness')) return <Dumbbell className="h-5 w-5 text-white" />;
  if (activityLower.includes('צוות') || activityLower.includes('קבוצ') || activityLower.includes('גיבוש') || activityLower.includes('team') || activityLower.includes('group')) return <Users className="h-5 w-5 text-white" />;
  
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
  const { language } = useLanguage();
  const isHe = language === 'he';
  const sections = getSections(isHe);

  const [selections, setSelections] = useState<Record<number, number[]>>({ 1: [], 2: [], 3: [], 4: [] });
  const [otherOptions, setOtherOptions] = useState<Record<number, string>>({ 1: '', 2: '', 3: '', 4: '' });
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([1, 2, 3, 4]));
  const [isSending, setIsSending] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '', email: '', company: '', whatsappNumber: '', officeNumber: '',
    participantCount: '', budgetPerPerson: '275', tourType: isHe ? 'יום אחד' : '1 Day',
    specialComments: '', language: ''
  });
  const [suggestedDate, setSuggestedDate] = useState<Date>();
  
  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('teamDNAResults');
    if (savedResults) {
      try { setQuizResults(JSON.parse(savedResults)); } catch (e) { console.error('Failed to parse saved quiz results', e); }
    } else {
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
    if (newExpanded.has(sectionId)) { newExpanded.delete(sectionId); } else { newExpanded.add(sectionId); }
    setExpandedSections(newExpanded);
  };

  const toggleActivity = (sectionId: number, activityIndex: number) => {
    const currentSelections = selections[sectionId] || [];
    const isSelected = currentSelections.includes(activityIndex);
    if (isSelected) {
      setSelections({ ...selections, [sectionId]: currentSelections.filter(i => i !== activityIndex) });
    } else if (currentSelections.length < 5) {
      setSelections({ ...selections, [sectionId]: [...currentSelections, activityIndex] });
    }
  };

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
      // Always send Hebrew activity names to backend
      const heSections = getSections(true);
      const selectionsData = heSections.reduce((acc, section) => {
        const selectedIndices = selections[section.id] || [];
        const selectedActivities = selectedIndices.map(index => section.activities[index]);
        acc[section.id] = { sectionTitle: section.title, activities: selectedActivities, otherOption: otherOptions[section.id] };
        return acc;
      }, {} as any);

      const requestData = {
        contactInfo,
        suggestedDate: suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : null,
        tourType: '100 Topics Day',
        selections: selectionsData
      };

      const { error } = await supabase.functions.invoke('send-preferences-email', { body: requestData });
      if (error) throw error;

      toast({
        title: isHe ? "נשלח בהצלחה!" : "Sent Successfully!",
        description: isHe ? "ההעדפות שלך נשלחו למייל שלנו. נחזור אליך בהקדם." : "Your preferences have been sent. We'll get back to you shortly.",
      });

      setContactInfo({ name: '', email: '', company: '', whatsappNumber: '', officeNumber: '', participantCount: '', budgetPerPerson: '275', tourType: isHe ? 'יום אחד' : '1 Day', specialComments: '', language: '' });
      setSuggestedDate(undefined);
      setSelections({});
      setOtherOptions({});
    } catch (error) {
      console.error('Error sending preferences:', error);
      toast({
        title: isHe ? "שגיאה בשליחה" : "Submission Error",
        description: isHe ? "אירעה שגיאה בשליחת ההעדפות. נסה שוב מאוחר יותר." : "An error occurred while sending. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const recommendedLabel = isHe ? 'מומלץ מאד' : 'Highly Recommended';

  return (
    <>
      <TeamDNAQuiz open={showQuiz} onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} />

      <section id="choose-your-day" className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <Breadcrumbs
              items={[{ label: isHe ? 'יום כייף וגיבוש' : 'Fun & Team Building Day', href: '#choose-your-day', active: true }]}
              onNavigate={(href) => { const el = document.getElementById(href.replace('#', '')); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            />
          </div>

          <div className="text-center mb-12">
            <h2 className="section-heading text-foreground mb-6">
              {isHe ? 'יום כייף וגיבוש לחברות - כ100 טיולים ואטרקציות לבחירה' : 'Team Building Fun Day – ~100 Tours & Attractions to Choose From'}
            </h2>
            
            {quizResults && !showAllActivities && (
              <div className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">{isHe ? 'הפעילויות נבחרו במיוחד עבורכם' : 'Activities Specially Selected for Your Team'}</h3>
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {isHe ? 'בהתאם ל-DNA של הצוות שלכם:' : 'Based on your team\'s DNA:'}
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
                    {isHe ? 'שנה העדפות' : 'Change Preferences'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowAllActivities(true)}>
                    {isHe ? 'הצג את כל הפעילויות' : 'Show All Activities'}
                  </Button>
                </div>
              </div>
            )}

            {showAllActivities && (
              <div className="max-w-4xl mx-auto mb-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  {isHe ? 'מציג את כל הפעילויות.' : 'Showing all activities.'}
                  <Button variant="link" size="sm" onClick={() => setShowAllActivities(false)} className="mr-2">
                    {isHe ? 'חזור לפעילויות המומלצות' : 'Back to Recommended'}
                  </Button>
                </p>
              </div>
            )}

            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-xl text-muted-foreground leading-[1.7]">
                {isHe ? 'בחרו מתוך הקטגוריות את  האטרקציות או האתרים המועדפים עליכם' : 'Choose your preferred attractions or sites from the categories below'}
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-300">
                    <Sunrise className="h-4 w-4 ml-1" />
                    {isHe ? 'הרפתקת בוקר' : 'Morning Adventure'}
                  </Badge>
                  <span className="text-muted-foreground">←</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-300">
                    <Waves className="h-4 w-4 ml-1" />
                    {isHe ? 'הרגעת מעיינות' : 'Springs Relaxation'}
                  </Badge>
                  <span className="text-muted-foreground">←</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-300">
                    <Landmark className="h-4 w-4 ml-1" />
                    {isHe ? 'מפגש מורשת' : 'Heritage Experience'}
                  </Badge>
                  <span className="text-muted-foreground">←</span>
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-300">
                  <Wine className="h-4 w-4 ml-1" />
                  {isHe ? 'חגיגה קולינרית' : 'Culinary Celebration'}
                </Badge>
              </div>
              <p className="text-base text-muted-foreground">
                {isHe ? 'שלב אותן באופן כרונולוגי ליצירת תוכנית יום מלא (09:00 - 17:00)' : 'Combine them chronologically to create a full day plan (09:00 – 17:00)'}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="max-w-7xl mx-auto space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const currentSelections = selections[section.id] || [];
              const isExpanded = expandedSections.has(section.id);
              
              const displayActivities = (quizResults && !showAllActivities)
                ? filterActivitiesByDNA(section.activities, quizResults, 4)
                : section.activities.map((text, index) => ({ text, index, relevanceScore: 0, matchedCategories: [] }));
              
              const hasRecommendations = quizResults && !showAllActivities;
              
              return (
                <Card key={section.id} className="border-2 hover:shadow-strong transition-all duration-300">
                  <CardHeader className="cursor-pointer relative" onClick={() => toggleSection(section.id)}>
                    {hasRecommendations && (
                      <Badge className="absolute top-4 left-4 bg-gradient-hero text-white border-none flex items-center gap-1 shadow-glow z-10">
                        <Sparkles className="h-3 w-3 animate-pulse-slow" />
                        {isHe ? 'מומלץ' : 'Recommended'}
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
                              {isHe ? 'קטגוריה' : 'Category'} {section.id}: {section.title}
                            </CardTitle>
                            <Badge variant="outline" className="text-sm">
                              <Clock className="h-3 w-3 ml-1" />
                              {section.time}
                            </Badge>
                          </div>
                          <CardDescription className="text-base">{section.description}</CardDescription>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              {isHe 
                                ? 'בחר עד 5 פעילויות, יחד נקבע את האטרקציה הכי מתאימה בהיתחשב בזמנים ואפשרויות בשטח ומזג אויר'
                                : 'Select up to 5 activities — we\'ll help you choose the best fit based on timing, logistics & weather'}
                            </span>
                            <div className={`font-bold text-lg px-4 py-2 rounded-full ${currentSelections.length === 0 ? 'bg-muted text-muted-foreground border-2 border-border' : 'bg-primary text-primary-foreground shadow-lg'}`}>
                              {currentSelections.length}/5 {isHe ? 'נבחרו' : 'selected'}
                            </div>
                          </div>
                          {quizResults && !showAllActivities && (
                            <p className="text-xs text-muted-foreground mt-2">
                              {isHe 
                                ? `מציג ${displayActivities.length} פעילויות מומלצות מתוך ${section.activities.length}`
                                : `Showing ${displayActivities.length} recommended activities out of ${section.activities.length}`}
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
                      <div className="grid md:grid-cols-2 gap-3">
                        {displayActivities.map(({ text: activity, index }) => {
                          const isSelected = currentSelections.includes(index);
                          const isDisabled = !isSelected && currentSelections.length >= 5;
                          const activityIcon = getActivityIcon(activity, section.id);
                        
                          return (
                            <div
                              key={index}
                              onClick={() => !isDisabled && toggleActivity(section.id, index)}
                              className={`group relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer
                                ${isSelected ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]' 
                                  : isDisabled ? 'border-muted bg-muted/30 opacity-50 cursor-not-allowed'
                                  : 'border-border hover:border-primary/50 hover:bg-accent/5 hover:scale-[1.01] hover:shadow-sm'}`}
                            >
                              <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all", isSelected ? `bg-gradient-to-br ${section.color} shadow-md` : "bg-muted/50 group-hover:bg-muted")}>
                                {activityIcon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm leading-relaxed">
                                  <span className="font-semibold text-primary ml-1">{index + 1}.</span>
                                  {typeof activity === 'string' && activity.includes(recommendedLabel) ? (
                                    <>
                                      {activity.split(recommendedLabel)[0]}
                                      <span className="inline-flex items-center gap-1 text-yellow-600 font-bold animate-pulse-slow">
                                        <Sparkles className="h-3 w-3 inline" />
                                        {recommendedLabel}
                                      </span>
                                      {activity.split(recommendedLabel)[1]}
                                    </>
                                  ) : activity}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <FavoritesManager activityId={`section-${section.id}-activity-${index}`} activityText={typeof activity === 'string' ? activity : String(activity)} sectionId={section.id} />
                                </div>
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

                      <div className="mt-6 p-4 bg-accent/5 rounded-lg border-2 border-dashed">
                        <label className="block text-sm font-medium mb-2">
                          {isHe ? 'אפשרות אחרת (אם אין ברשימה):' : 'Other option (if not listed):'}
                        </label>
                        <Input
                          value={otherOptions[section.id] || ''}
                          onChange={(e) => setOtherOptions({ ...otherOptions, [section.id]: e.target.value })}
                          placeholder={isHe ? "תאר פעילות שאינה מופיעה ברשימה..." : "Describe an activity not on the list..."}
                          className="border-2"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Summary and Contact Form */}
          <div className="max-w-6xl mx-auto my-12">
            <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center">
                  {isHe ? 'סיכום הבחירות שלך ליום כיף' : 'Your Fun Day Selection Summary'}
                </CardTitle>
                <CardDescription className="text-center">
                  {isHe ? 'אנא מלא את הפרטים הבאים כדי שנוכל לחזור אליך' : 'Please fill in your details so we can get back to you'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-wrap justify-center gap-8 py-6">
                  {sections.map((section) => {
                    const count = (selections[section.id] || []).length;
                    const colorClasses = ['from-orange-500 to-yellow-500', 'from-blue-500 to-cyan-400', 'from-amber-600 to-orange-500', 'from-purple-600 to-pink-500'];
                    return (
                      <div key={section.id} className="flex flex-col items-center gap-3">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${colorClasses[section.id - 1]} flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>{count}</div>
                        <span className="text-lg font-medium">{isHe ? 'קטגוריה' : 'Category'} {section.id}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'שם מלא' : 'Full Name'} <span className="text-destructive">*</span></label>
                    <Input value={contactInfo.name} onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })} placeholder={isHe ? "הכנס שם מלא" : "Enter full name"} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'כתובת אימייל' : 'Email Address'} <span className="text-destructive">*</span></label>
                    <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder={isHe ? "הכנס כתובת אימייל" : "Enter email address"} dir="ltr" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'שם החברה' : 'Company Name'} <span className="text-destructive">*</span></label>
                    <Input value={contactInfo.company} onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })} placeholder={isHe ? "הכנס שם חברה" : "Enter company name"} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר וואטסאפ' : 'WhatsApp Number'} <span className="text-destructive">*</span></label>
                    <Input value={contactInfo.whatsappNumber} onChange={(e) => setContactInfo({ ...contactInfo, whatsappNumber: e.target.value })} placeholder={isHe ? "הכנס מספר וואטסאפ" : "Enter WhatsApp number"} dir="ltr" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר משרד' : 'Office Number'}</label>
                    <Input value={contactInfo.officeNumber} onChange={(e) => setContactInfo({ ...contactInfo, officeNumber: e.target.value })} placeholder={isHe ? "הכנס מספר משרד" : "Enter office number"} dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'מספר משתתפים משוער' : 'Estimated Participants'}</label>
                    <Input value={contactInfo.participantCount} onChange={(e) => setContactInfo({ ...contactInfo, participantCount: e.target.value })} placeholder={isHe ? "כמה אנשים יהיו בטיול?" : "How many people will attend?"} type="number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'סוג הטיול' : 'Tour Type'}</label>
                    <select value={contactInfo.tourType} onChange={(e) => setContactInfo({ ...contactInfo, tourType: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value={isHe ? "יום אחד" : "1 Day"}>{isHe ? "יום אחד" : "1 Day"}</option>
                      <option value={isHe ? "מספר ימים" : "Multiple Days"}>{isHe ? "מספר ימים" : "Multiple Days"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{isHe ? 'תאריך מוצע לאירוע' : 'Suggested Event Date'}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-right font-normal h-10", !suggestedDate && "text-muted-foreground")}>
                          <CalendarIcon className="ml-2 h-4 w-4" />
                          {suggestedDate ? format(suggestedDate, "dd/MM/yyyy") : <span>{isHe ? 'בחר תאריך' : 'Select a date'}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={suggestedDate} onSelect={setSuggestedDate} disabled={(date) => date < new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    {isHe ? 'הערות ומשאלות מיוחדות אותם מבקשים האורחים' : 'Special Requests & Notes from Guests'}
                  </label>
                  <Textarea value={contactInfo.specialComments} onChange={(e) => setContactInfo({ ...contactInfo, specialComments: e.target.value })} placeholder={isHe ? "שתף אותנו בפרטים נוספים, משאלות מיוחדות או סיבת האירוע..." : "Share additional details, special requests, or the occasion..."} className="min-h-[100px]" />
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    {isHe ? 'שפות: יש לציין את השפה הנדרשת לאורחים שלכם' : 'Languages: Please specify the language needed for your guests'}
                  </label>
                  <Input value={contactInfo.language} onChange={(e) => setContactInfo({ ...contactInfo, language: e.target.value })} placeholder={isHe ? "למשל: אנגלית, ספרדית, צרפתית, גרמנית..." : "e.g. English, Spanish, French, German..."} />
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={handleSendPreferences} disabled={isSending} size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8">
                    <Send className="h-5 w-5 ml-2" />
                    {isSending ? (isHe ? 'שולח...' : 'Sending...') : (isHe ? 'שלח למייל' : 'Send via Email')}
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
