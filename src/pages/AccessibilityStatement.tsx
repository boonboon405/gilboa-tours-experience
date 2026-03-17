import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accessibility, Phone, Mail, Calendar } from 'lucide-react';

const AccessibilityStatement = () => {
  const lastUpdated = '08/12/2025';
  
  return (
    <>
      <Helmet>
        <title>הצהרת נגישות | טיולים עם דוד</title>
        <meta name="description" content="הצהרת נגישות של אתר טיולים עם דוד בהתאם לתקן הישראלי SI 5568" />
      </Helmet>

      <Navigation />
      
      <main id="main-content" className="min-h-screen bg-background py-20" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Accessibility className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">הצהרת נגישות</h1>
            <p className="text-lg text-muted-foreground">
              טיולים עם דוד מחויבים להנגשת האתר לאנשים עם מוגבלויות
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>מחויבות לנגישות</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground">
                <p>
                  אתר טיולים עם דוד פועל להנגשת האתר לאנשים עם מוגבלויות בהתאם לתקן הישראלי 
                  SI 5568 ולהנחיות WCAG 2.1 ברמה AA.
                </p>
                <p>
                  אנו מאמינים שלכל אדם יש זכות לגישה שווה למידע ולשירותים, ולכן השקענו 
                  מאמצים רבים בהנגשת האתר עבור כלל המשתמשים.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>אמצעי נגישות באתר</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>התאמת גודל הטקסט - אפשרות להגדלה והקטנה של הטקסט</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>מצב ניגודיות גבוהה לקריאות משופרת</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>מצב גווני אפור לרגישות לצבעים</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>הדגשת קישורים לזיהוי קל</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>אפשרות לעצירת אנימציות</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>גופן קריא - מעבר לגופן ברור יותר</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>סמן עכבר מוגדל</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>סרגל קריאה לעזרה במעקב אחר השורות</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>ניווט מלא באמצעות מקלדת</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>תיאורי תמונות (alt text) לקוראי מסך</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>מבנה סמנטי תקני של הדף</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span>קישור "דלג לתוכן" לניווט מהיר</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>שימוש בתפריט הנגישות</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground">
                <p>
                  תפריט הנגישות נמצא בכפתור הנגישות בצד שמאל של המסך (אייקון של אדם).
                  לחיצה על הכפתור תפתח את תפריט הנגישות בו תוכלו להפעיל או לכבות את 
                  ההגדרות השונות.
                </p>
                <p>
                  ההגדרות נשמרות אוטומטית ויחולו גם בביקורים הבאים שלכם באתר.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>מגבלות ידועות</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none text-foreground">
                <p>
                  למרות מאמצינו להנגיש את האתר באופן מלא, ייתכן שחלקים מסוימים 
                  עדיין אינם נגישים לחלוטין. אנו ממשיכים לעבוד על שיפור הנגישות.
                </p>
                <ul>
                  <li>חלק מהתמונות עשויות להיות חסרות תיאור מלא</li>
                  <li>תוכן שנוצר על ידי משתמשים (כגון המלצות) עשוי שלא להיות מונגש במלואו</li>
                  <li>מפות אינטראקטיביות עשויות להיות מוגבלות בנגישות</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>יצירת קשר בנושא נגישות</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-6">
                  נתקלתם בבעיית נגישות? נשמח לקבל פנייתכם ולטפל בה בהקדם:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a href="tel:+972537314235" className="text-primary hover:underline">
                      053-731-4235
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a href="mailto:info@davidtours.co.il" className="text-primary hover:underline">
                      info@davidtours.co.il
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  עדכון אחרון
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  הצהרת נגישות זו עודכנה לאחרונה בתאריך: <strong>{lastUpdated}</strong>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccessibilityStatement;
