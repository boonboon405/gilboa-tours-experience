import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Sparkles, Mic, Volume2, Zap } from 'lucide-react';

export const VoiceChatComparison = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold">השוואת אפשרויות צ'אט קולי</h2>
        <p className="text-muted-foreground">
          כל שלוש הטכנולוגיות כבר מוגדרות בפרויקט שלכם - ללא צורך במפתחות API נוספים!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Browser Speech Recognition */}
        <Card className="p-6 space-y-4 border-2 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Speech Recognition</h3>
              <Badge variant="secondary" className="mt-1">קול → טקסט</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">חינם לחלוטין</p>
                <p className="text-sm text-muted-foreground">מובנה בדפדפן</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">תמיכה בעברית ואנגלית</p>
                <p className="text-sm text-muted-foreground">זיהוי דיבור מדויק</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">פועל בזמן אמת</p>
                <p className="text-sm text-muted-foreground">ללא עיכובים</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">דורש דפדפן מתאים</p>
                <p className="text-sm text-muted-foreground">Chrome/Edge/Safari מומלצים</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">שימוש נוכחי:</p>
            <Badge variant="outline" className="text-green-600">
              <Check className="w-3 h-3 mr-1" />
              מוגדר בפרויקט
            </Badge>
          </div>
        </Card>

        {/* Browser Speech Synthesis */}
        <Card className="p-6 space-y-4 border-2 border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Volume2 className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">Speech Synthesis</h3>
              <Badge variant="secondary" className="mt-1">טקסט → קול</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">חינם לחלוטין</p>
                <p className="text-sm text-muted-foreground">מובנה בדפדפן</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">קולות בעברית</p>
                <p className="text-sm text-muted-foreground">איכות טובה</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">תמיכה בכל הדפדפנים</p>
                <p className="text-sm text-muted-foreground">Chrome, Firefox, Safari, Edge</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <X className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">איכות קול בינונית</p>
                <p className="text-sm text-muted-foreground">לא כמו OpenAI TTS</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">שימוש נוכחי:</p>
            <Badge variant="outline" className="text-green-600">
              <Check className="w-3 h-3 mr-1" />
              מוגדר בפרויקט
            </Badge>
          </div>
        </Card>

        {/* Lovable AI */}
        <Card className="p-6 space-y-4 border-2 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Lovable AI</h3>
              <Badge variant="secondary" className="mt-1">אינטליגנציה שיחתית</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">שימוש חינמי כלול</p>
                <p className="text-sm text-muted-foreground">במסגרת החבילה שלכם</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">AI חכם ומותאם</p>
                <p className="text-sm text-muted-foreground">Google Gemini 2.5 Flash</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">תמיכה מלאה בעברית</p>
                <p className="text-sm text-muted-foreground">הבנת הקשר ותוכן</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">ללא מפתח API</p>
                <p className="text-sm text-muted-foreground">LOVABLE_API_KEY מוגדר אוטומטית</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">שימוש נוכחי:</p>
            <Badge variant="outline" className="text-green-600">
              <Check className="w-3 h-3 mr-1" />
              מוגדר בפרויקט
            </Badge>
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary rounded-lg">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">הפתרון המושלם - שילוב של שלושתם!</h3>
            <p className="text-muted-foreground mb-4">
              הפרויקט שלכם כבר מוגדר עם כל שלוש הטכנולוגיות ללא צורך במפתחות API נוספים:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span><strong>Speech Recognition</strong> - להקלטת דיבור המשתמש (חינם)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span><strong>Speech Synthesis</strong> - להשמעת תשובות (חינם)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span><strong>Lovable AI</strong> - לאינטליגנציה שיחתית (שימוש חינמי כלול)</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-background rounded-lg border">
              <p className="text-sm font-medium">
                ✨ היתרון: פתרון צ'אט קולי מלא ללא עלויות נוספות או הגדרות מורכבות!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
