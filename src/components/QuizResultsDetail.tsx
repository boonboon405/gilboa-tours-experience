import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from '@/utils/quizScoring';
import { categoryMetadata } from '@/utils/activityCategories';
import { Sparkles, Award, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface QuizResultsDetailProps {
  results: QuizResults;
  onClose: () => void;
}

export const QuizResultsDetail = ({ results, onClose }: QuizResultsDetailProps) => {
  const allCategories = Object.entries(results.percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([category, percentage]) => ({
      category,
      percentage,
      ...categoryMetadata[category]
    }));

  const topCategory = allCategories[0];
  const recommendations = getRecommendations(results.topCategories);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Award className="h-12 w-12 text-primary animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            פרופיל הצוות שלכם
          </h1>
          <Award className="h-12 w-12 text-primary animate-bounce" />
        </div>
        <p className="text-xl text-muted-foreground">
          ניתוח מפורט של ה-DNA הצוותי שלכם
        </p>
      </div>

      {/* Top Category Highlight */}
      <Card className="overflow-hidden border-2 border-primary shadow-lg animate-in slide-in-from-bottom duration-700">
        <div className={cn("h-3 bg-gradient-to-r", topCategory.color)} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{topCategory.icon}</span>
              <div>
                <CardTitle className="text-3xl">{topCategory.name}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  הקטגוריה המובילה שלכם
                </CardDescription>
              </div>
            </div>
            <Badge className="text-4xl px-6 py-3 bg-primary text-primary-foreground">
              {topCategory.percentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80">{topCategory.description}</p>
        </CardContent>
      </Card>

      {/* All Categories Breakdown */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-2 animate-in slide-in-from-right duration-700">
          <TrendingUp className="h-6 w-6 text-primary" />
          פילוח מלא של העדפות הצוות
        </h2>
        {allCategories.map((cat, index) => (
          <Card 
            key={cat.category} 
            className={cn(
              "overflow-hidden transition-all hover:shadow-md animate-in slide-in-from-left",
              index === 0 && "border-primary/50"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn("h-1.5 bg-gradient-to-r", cat.color)} />
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary min-w-[80px] text-left">
                  {cat.percentage}%
                </div>
              </div>
              <Progress value={cat.percentage} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 animate-in zoom-in duration-700">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lightbulb className="h-7 w-7 text-primary" />
            המלצות מותאמות אישית
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-4 bg-background rounded-lg border animate-in slide-in-from-right"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">{index + 1}</span>
              </div>
              <p className="text-base leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team Insights */}
      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 animate-in fade-in duration-700 delay-300">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            תובנות על הצוות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Target className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-base">
              <strong>איזון:</strong> הצוות שלכם מציג איזון {getBalanceLevel(results)} בין סוגי הפעילויות השונים
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-base">
              <strong>המלצה:</strong> {getMainRecommendation(results)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center pt-4 animate-in zoom-in duration-700 delay-500">
        <Button size="lg" onClick={onClose} className="text-lg px-8 py-6">
          <Sparkles className="ml-2 h-5 w-5" />
          בואו נבחר את הפעילויות המושלמות!
        </Button>
      </div>
    </div>
  );
};

// Helper functions
function getRecommendations(topCategories: string[]): string[] {
  const recommendations: Record<string, string[]> = {
    adventure: [
      "התמקדו בפעילויות שמערבות אתגר פיזי ואדרנלין - הצוות שלכם אוהב להרגיש את הדופק עולה",
      "שלבו פעילויות מים עם אתגרים - זה יספק גם התרגשות וגם התקררות",
      "הוסיפו אלמנט תחרותי למשחקים - זה יעורר את רוח ההרפתקאות"
    ],
    nature: [
      "הקדישו זמן איכות לטבע - הצוות שלכם זקוק לחיבור עם הסביבה הטבעית",
      "בחרו במסלולים פנורמיים ונקודות תצפית - הנוף חשוב לכם",
      "שלבו הפסקות רגיעה בטבע בין הפעילויות האנרגטיות"
    ],
    history: [
      "הוסיפו הקשר היסטורי לפעילויות - הצוות שלכם מתחבר לסיפורים ולשורשים",
      "בקרו באתרים ארכיאולוגיים עם הדרכה מעמיקה",
      "שלבו משחקי תפקידים המבוססים על אירועים היסטוריים"
    ],
    food: [
      "תנו לחוויה הקולינרית מקום מרכזי - אוכל טוב חשוב לצוות שלכם",
      "בחרו בסדנאות בישול או טעימות מיוחדות",
      "הקפידו על מנות איכותיות וחוויות גסטרונומיות ייחודיות"
    ],
    sport: [
      "שלבו תחרויות ומשחקי קבוצה - הצוות שלכם אוהב אתגרים ספורטיביים",
      "הוסיפו פעילויות שדורשות עבודת צוות וקואורדינציה",
      "בחרו באתגרים פיזיים מגוונים לאורך היום"
    ],
    creative: [
      "תנו מקום לביטוי יצירתי ואומנות - הצוות שלכם צריך ערוצי הבעה",
      "שלבו סדנאות יצירה או פעילויות אמנות",
      "עודדו חשיבה out-of-the-box במשימות הצוותיות"
    ],
    wellness: [
      "דאגו לאיזון בין פעילויות לרגיעה - הצוות שלכם מעריך רווחה",
      "הוסיפו אלמנטים של מיינדפולנס ורוגע",
      "בחרו בפעילויות שמשלבות טיפוח גוף ונפש"
    ]
  };

  const recs: string[] = [];
  topCategories.forEach(cat => {
    if (recommendations[cat]) {
      recs.push(...recommendations[cat].slice(0, 2));
    }
  });

  // Add general recommendations
  recs.push("שלבו זמנים לשיחות ושיתוף בין הפעילויות - זה חיזוק את החיבור הצוותי");
  recs.push("התאימו את קצב היום לאנרגיה של הצוות - אל תדחסו יותר מדי");

  return recs.slice(0, 5);
}

function getBalanceLevel(results: QuizResults): string {
  const percentages = Object.values(results.percentages);
  const max = Math.max(...percentages);
  const min = Math.min(...percentages);
  const diff = max - min;

  if (diff < 20) return "מצוין";
  if (diff < 35) return "טוב";
  return "ממוקד";
}

function getMainRecommendation(results: QuizResults): string {
  const topPercentage = results.percentages[results.topCategories[0]];
  
  if (topPercentage > 40) {
    return "הצוות שלכם מאוד ממוקד בתחום אחד - שמרו על זה אבל שלבו גם מעט גיוון";
  }
  if (topPercentage < 25) {
    return "הצוות שלכם מגוון מאוד - תוכלו ליהנות ממגוון רחב של פעילויות";
  }
  return "יש לכם איזון טוב בין העדפות - זה יאפשר יום מגוון ומהנה לכולם";
}
