import { 
  Accessibility, 
  ZoomIn, 
  Contrast, 
  Eye, 
  Link2, 
  Pause, 
  Type, 
  MousePointer2, 
  GripHorizontal,
  Keyboard,
  Monitor,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const accessibilityFeatures = [
  {
    icon: ZoomIn,
    title: 'התאמת גודל טקסט',
    description: 'אפשרות להגדיל או להקטין את גודל הטקסט באתר עד 150% לנוחות קריאה מרבית'
  },
  {
    icon: Contrast,
    title: 'מצב ניגודיות גבוהה',
    description: 'שינוי צבעי האתר לשחור-לבן עם ניגודיות מוגברת לקריאות משופרת'
  },
  {
    icon: Eye,
    title: 'מצב גווני אפור',
    description: 'הפיכת האתר לגווני אפור עבור משתמשים עם רגישות לצבעים'
  },
  {
    icon: Link2,
    title: 'הדגשת קישורים',
    description: 'הדגשה ויזואלית של כל הקישורים והכפתורים באתר לזיהוי קל'
  },
  {
    icon: Pause,
    title: 'עצירת אנימציות',
    description: 'אפשרות לעצור את כל האנימציות והתנועות באתר למניעת הסחת דעת'
  },
  {
    icon: Type,
    title: 'גופן קריא',
    description: 'החלפה לגופן Arial ברור וקריא עם ריווח משופר בין אותיות ושורות'
  },
  {
    icon: MousePointer2,
    title: 'סמן עכבר מוגדל',
    description: 'הגדלת סמן העכבר לנראות טובה יותר על המסך'
  },
  {
    icon: GripHorizontal,
    title: 'סרגל קריאה',
    description: 'סרגל עוקב אחר העכבר המסייע במעקב אחר השורה הנקראת'
  },
  {
    icon: Keyboard,
    title: 'ניווט מקלדת מלא',
    description: 'תמיכה מלאה בניווט באמצעות מקלדת בלבד, כולל מקשי Enter ו-Space להפעלת אלמנטים'
  },
  {
    icon: Monitor,
    title: 'תמיכה בקוראי מסך',
    description: 'תוויות ARIA ומבנה סמנטי תקני לתאימות מלאה עם קוראי מסך'
  },
  {
    icon: FileText,
    title: 'קישור דלג לתוכן',
    description: 'קישור מהיר בתחילת הדף המאפשר דילוג ישיר לתוכן הראשי'
  }
];

export const AccessibilityInfoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background" dir="rtl">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <Accessibility className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            נגישות האתר
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            אתר זה הונגש בהתאם לתקן הישראלי SI 5568 ולהנחיות WCAG 2.1 ברמה AA, 
            המבטיחים גישה שווה לאנשים עם מוגבלויות
          </p>
        </div>

        {/* Compliance Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">
              עומד בתקן הישראלי SI 5568 ו-WCAG 2.1 AA
            </span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {accessibilityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How to Use */}
        <div className="bg-card border border-border rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            כיצד להשתמש בתפריט הנגישות?
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                <Accessibility className="h-7 w-7" />
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">שלב 1</p>
                <p className="text-muted-foreground">לחצו על כפתור הנגישות בצד שמאל של המסך</p>
              </div>
            </div>
            <div className="hidden md:block text-3xl text-muted-foreground">←</div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold">2</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">שלב 2</p>
                <p className="text-muted-foreground">בחרו את ההגדרות המתאימות לכם</p>
              </div>
            </div>
            <div className="hidden md:block text-3xl text-muted-foreground">←</div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/60 text-primary-foreground flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">שלב 3</p>
                <p className="text-muted-foreground">ההגדרות נשמרות אוטומטית</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Info */}
        <div className="text-center">
          <div className="bg-muted/50 rounded-xl p-6 max-w-3xl mx-auto">
            <h3 className="font-semibold text-foreground mb-3">
              על התקן הישראלי SI 5568
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              תקן SI 5568 הוא התקן הישראלי לנגישות אתרי אינטרנט, המבוסס על הנחיות WCAG 2.1 
              של ארגון W3C הבינלאומי. התקן מחייב את כל האתרים בישראל להיות נגישים לאנשים 
              עם מוגבלויות, כולל לקויות ראייה, שמיעה, מוטוריקה וקוגניציה.
            </p>
            <Link to="/accessibility">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                לצפייה בהצהרת הנגישות המלאה
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
