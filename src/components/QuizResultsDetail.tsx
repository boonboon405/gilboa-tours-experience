import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from '@/utils/quizScoring';
import { categoryMetadata } from '@/utils/activityCategories';
import { Sparkles, Award, TrendingUp, Users, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizResultsDetailProps {
  results: QuizResults;
  onClose: () => void;
}

export const QuizResultsDetail = ({ results, onClose }: QuizResultsDetailProps) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const allCategories = Object.entries(results.percentages)
    .sort(([, a], [, b]) => b - a)
    .map(([category, percentage]) => ({
      category,
      percentage,
      ...categoryMetadata[category as keyof typeof categoryMetadata]
    }));

  const top = allCategories[0];
  const recommendations = getRecommendations(results.topCategories, isEn);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Hero */}
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Award className="h-12 w-12 text-primary animate-bounce" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isEn ? "Your Team Profile" : "פרופיל הצוות שלכם"}
          </h1>
          <Award className="h-12 w-12 text-primary animate-bounce" />
        </div>
        <p className="text-xl text-muted-foreground">
          {isEn ? "Detailed analysis of your team DNA" : "ניתוח מפורט של ה-DNA הצוותי שלכם"}
        </p>
      </div>

      {/* Top Category */}
      <Card className="overflow-hidden border-2 border-primary shadow-lg animate-in slide-in-from-bottom duration-700">
        <div className={cn("h-3 bg-gradient-to-r", top.color)} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{top.icon}</span>
              <div>
                <CardTitle className="text-3xl">{isEn ? top.nameEn : top.name}</CardTitle>
                <p className="text-lg text-muted-foreground mt-2">
                  {isEn ? "Your leading category" : "הקטגוריה המובילה שלכם"}
                </p>
              </div>
            </div>
            <Badge className="text-4xl px-6 py-3 bg-primary text-primary-foreground">{top.percentage}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-foreground/80">{isEn ? top.descriptionEn : top.description}</p>
        </CardContent>
      </Card>

      {/* All Categories */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold flex items-center gap-2 animate-in slide-in-from-right duration-700">
          <TrendingUp className="h-6 w-6 text-primary" />
          {isEn ? "Full Preference Breakdown" : "פילוח מלא של העדפות הצוות"}
        </h2>
        {allCategories.map((cat, index) => (
          <Card
            key={cat.category}
            className={cn("overflow-hidden transition-all hover:shadow-md animate-in slide-in-from-left", index === 0 && "border-primary/50")}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={cn("h-1.5 bg-gradient-to-r", cat.color)} />
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{isEn ? cat.nameEn : cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{isEn ? cat.descriptionEn : cat.description}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-primary min-w-[80px] text-left">{cat.percentage}%</div>
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
            {isEn ? "Personalized Recommendations" : "המלצות מותאמות אישית"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-background rounded-lg border animate-in slide-in-from-right" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">{i + 1}</span>
              </div>
              <p className="text-base leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-br from-accent/5 to-primary/5 animate-in fade-in duration-700 delay-300">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            {isEn ? "Team Insights" : "תובנות על הצוות"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Target className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-base">
              <strong>{isEn ? "Balance:" : "איזון:"}</strong>{' '}
              {isEn
                ? `Your team shows ${getBalanceLevel(results, true)} balance across activity types`
                : `הצוות שלכם מציג איזון ${getBalanceLevel(results, false)} בין סוגי הפעילויות השונים`}
            </p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
            <p className="text-base">
              <strong>{isEn ? "Recommendation:" : "המלצה:"}</strong>{' '}
              {getMainRecommendation(results, isEn)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center pt-4 animate-in zoom-in duration-700 delay-500">
        <Button size="lg" onClick={onClose} className="text-lg px-8 py-6">
          <Sparkles className={cn("h-5 w-5", isEn ? "mr-2" : "ml-2")} />
          {isEn ? "Let's choose the perfect activities!" : "בואו נבחר את הפעילויות המושלמות!"}
        </Button>
      </div>
    </div>
  );
};

function getRecommendations(topCategories: string[], isEn: boolean): string[] {
  const recs: Record<string, { he: string[]; en: string[] }> = {
    adventure: {
      he: ["התמקדו בפעילויות שמערבות אתגר פיזי ואדרנלין", "שלבו פעילויות מים עם אתגרים"],
      en: ["Focus on physical challenge and adrenaline activities", "Combine water activities with challenges"]
    },
    nature: {
      he: ["הקדישו זמן איכות לטבע", "בחרו במסלולים פנורמיים ונקודות תצפית"],
      en: ["Dedicate quality time to nature", "Choose panoramic trails and viewpoints"]
    },
    history: {
      he: ["הוסיפו הקשר היסטורי לפעילויות", "בקרו באתרים ארכיאולוגיים עם הדרכה מעמיקה"],
      en: ["Add historical context to activities", "Visit archaeological sites with in-depth guidance"]
    },
    culinary: {
      he: ["תנו לחוויה הקולינרית מקום מרכזי", "בחרו בסדנאות בישול או טעימות מיוחדות"],
      en: ["Make the culinary experience a centerpiece", "Choose cooking workshops or special tastings"]
    },
    sports: {
      he: ["שלבו תחרויות ומשחקי קבוצה", "הוסיפו פעילויות שדורשות עבודת צוות"],
      en: ["Include competitions and team games", "Add activities that require teamwork"]
    },
    creative: {
      he: ["תנו מקום לביטוי יצירתי ואומנות", "שלבו סדנאות יצירה או פעילויות אמנות"],
      en: ["Make room for creative expression and art", "Include creative workshops or art activities"]
    },
    wellness: {
      he: ["דאגו לאיזון בין פעילויות לרגיעה", "הוסיפו אלמנטים של מיינדפולנס ורוגע"],
      en: ["Balance activities with relaxation", "Add mindfulness and calm elements"]
    },
    teambuilding: {
      he: ["התמקדו בפעילויות שמחזקות תקשורת", "שלבו אתגרים שדורשים שיתוף פעולה"],
      en: ["Focus on activities that strengthen communication", "Include challenges requiring collaboration"]
    }
  };

  const result: string[] = [];
  topCategories.forEach(cat => {
    const r = recs[cat];
    if (r) result.push(...(isEn ? r.en : r.he));
  });
  result.push(isEn
    ? "Include downtime for conversation between activities to strengthen team bonds"
    : "שלבו זמנים לשיחות ושיתוף בין הפעילויות - זה מחזק את החיבור הצוותי");
  return result.slice(0, 5);
}

function getBalanceLevel(results: QuizResults, isEn: boolean): string {
  const vals = Object.values(results.percentages);
  const diff = Math.max(...vals) - Math.min(...vals);
  if (diff < 20) return isEn ? "excellent" : "מצוין";
  if (diff < 35) return isEn ? "good" : "טוב";
  return isEn ? "focused" : "ממוקד";
}

function getMainRecommendation(results: QuizResults, isEn: boolean): string {
  const top = results.percentages[results.topCategories[0]];
  if (top > 40) return isEn
    ? "Your team is highly focused in one area — keep that strength but add some variety"
    : "הצוות שלכם מאוד ממוקד בתחום אחד - שמרו על זה אבל שלבו גם מעט גיוון";
  if (top < 25) return isEn
    ? "Your team is very diverse — you can enjoy a wide range of activities"
    : "הצוות שלכם מגוון מאוד - תוכלו ליהנות ממגוון רחב של פעילויות";
  return isEn
    ? "You have a good balance of preferences — this allows a varied and fun day for everyone"
    : "יש לכם איזון טוב בין העדפות - זה יאפשר יום מגוון ומהנה לכולם";
}
