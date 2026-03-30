import { 
  Accessibility, ZoomIn, Contrast, Eye, Link2, Pause, Type, 
  MousePointer2, GripHorizontal, Keyboard, Monitor, FileText, CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const getFeatures = (isHe: boolean) => [
  { icon: ZoomIn, title: isHe ? 'התאמת גודל טקסט' : 'Text Size Adjustment', description: isHe ? 'אפשרות להגדיל או להקטין את גודל הטקסט באתר עד 150% לנוחות קריאה מרבית' : 'Option to increase or decrease text size up to 150% for optimal readability' },
  { icon: Contrast, title: isHe ? 'מצב ניגודיות גבוהה' : 'High Contrast Mode', description: isHe ? 'שינוי צבעי האתר לשחור-לבן עם ניגודיות מוגברת לקריאות משופרת' : 'Switch site colors to black and white with enhanced contrast for improved readability' },
  { icon: Eye, title: isHe ? 'מצב גווני אפור' : 'Grayscale Mode', description: isHe ? 'הפיכת האתר לגווני אפור עבור משתמשים עם רגישות לצבעים' : 'Convert the site to grayscale for users with color sensitivity' },
  { icon: Link2, title: isHe ? 'הדגשת קישורים' : 'Link Highlighting', description: isHe ? 'הדגשה ויזואלית של כל הקישורים והכפתורים באתר לזיהוי קל' : 'Visual highlighting of all links and buttons for easy identification' },
  { icon: Pause, title: isHe ? 'עצירת אנימציות' : 'Stop Animations', description: isHe ? 'אפשרות לעצור את כל האנימציות והתנועות באתר למניעת הסחת דעת' : 'Option to stop all animations and motion to prevent distraction' },
  { icon: Type, title: isHe ? 'גופן קריא' : 'Readable Font', description: isHe ? 'החלפה לגופן Arial ברור וקריא עם ריווח משופר בין אותיות ושורות' : 'Switch to a clear, readable Arial font with improved letter and line spacing' },
  { icon: MousePointer2, title: isHe ? 'סמן עכבר מוגדל' : 'Enlarged Cursor', description: isHe ? 'הגדלת סמן העכבר לנראות טובה יותר על המסך' : 'Enlarge the mouse cursor for better visibility on screen' },
  { icon: GripHorizontal, title: isHe ? 'סרגל קריאה' : 'Reading Guide', description: isHe ? 'סרגל עוקב אחר העכבר המסייע במעקב אחר השורה הנקראת' : 'A reading guide that follows the cursor to help track the current line' },
  { icon: Keyboard, title: isHe ? 'ניווט מקלדת מלא' : 'Full Keyboard Navigation', description: isHe ? 'תמיכה מלאה בניווט באמצעות מקלדת בלבד, כולל מקשי Enter ו-Space להפעלת אלמנטים' : 'Full support for keyboard-only navigation, including Enter and Space keys' },
  { icon: Monitor, title: isHe ? 'תמיכה בקוראי מסך' : 'Screen Reader Support', description: isHe ? 'תוויות ARIA ומבנה סמנטי תקני לתאימות מלאה עם קוראי מסך' : 'ARIA labels and semantic structure for full screen reader compatibility' },
  { icon: FileText, title: isHe ? 'קישור דלג לתוכן' : 'Skip to Content Link', description: isHe ? 'קישור מהיר בתחילת הדף המאפשר דילוג ישיר לתוכן הראשי' : 'A quick link at the top of the page to skip directly to the main content' }
];

export const AccessibilityInfoSection = () => {
  const { language } = useLanguage();
  const isHe = language === 'he';
  const features = getFeatures(isHe);

  const steps = [
    { label: isHe ? 'שלב 1' : 'Step 1', text: isHe ? 'לחצו על כפתור הנגישות בצד שמאל של המסך' : 'Click the accessibility button on the left side of the screen' },
    { label: isHe ? 'שלב 2' : 'Step 2', text: isHe ? 'בחרו את ההגדרות המתאימות לכם' : 'Choose the settings that suit you' },
    { label: isHe ? 'שלב 3' : 'Step 3', text: isHe ? 'ההגדרות נשמרות אוטומטית' : 'Settings are saved automatically' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Accessibility className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isHe ? 'נגישות האתר' : 'Website Accessibility'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isHe 
              ? 'אתר זה הונגש בהתאם לתקן הישראלי SI 5568 ולהנחיות WCAG 2.1 ברמה AA, המבטיחים גישה שווה לאנשים עם מוגבלויות'
              : 'This website complies with Israeli Standard SI 5568 and WCAG 2.1 Level AA guidelines, ensuring equal access for people with disabilities'}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">
              {isHe ? 'עומד בתקן הישראלי SI 5568 ו-WCAG 2.1 AA' : 'Compliant with Israeli Standard SI 5568 & WCAG 2.1 AA'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            {isHe ? 'כיצד להשתמש בתפריט הנגישות?' : 'How to Use the Accessibility Menu?'}
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                {i > 0 && <div className="hidden md:block text-3xl text-muted-foreground">{isHe ? '←' : '→'}</div>}
                <div className={`w-14 h-14 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-primary/80' : 'bg-primary/60'} text-primary-foreground flex items-center justify-center shadow-lg`}>
                  {i === 2 ? <CheckCircle2 className="h-7 w-7" /> : i === 0 ? <Accessibility className="h-7 w-7" /> : <span className="text-xl font-bold">2</span>}
                </div>
                <div className={isHe ? 'text-right' : 'text-left'}>
                  <p className="font-medium text-foreground">{step.label}</p>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="bg-muted/50 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold text-foreground mb-3">
              {isHe ? 'על התקן הישראלי SI 5568' : 'About Israeli Standard SI 5568'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {isHe 
                ? 'תקן SI 5568 הוא התקן הישראלי לנגישות אתרי אינטרנט, המבוסס על הנחיות WCAG 2.1 של ארגון W3C הבינלאומי. התקן מחייב את כל האתרים בישראל להיות נגישים לאנשים עם מוגבלויות, כולל לקויות ראייה, שמיעה, מוטוריקה וקוגניציה.'
                : 'SI 5568 is the Israeli standard for web accessibility, based on the international W3C WCAG 2.1 guidelines. The standard requires all websites in Israel to be accessible to people with disabilities, including visual, auditory, motor, and cognitive impairments.'}
            </p>
            <Link to="/accessibility">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                {isHe ? 'לצפייה בהצהרת הנגישות המלאה' : 'View Full Accessibility Statement'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
