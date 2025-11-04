import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Layers, List, Minimize2 } from "lucide-react";

interface LayoutOption {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const layoutOptions: LayoutOption[] = [
  {
    id: 1,
    title: "כרטיסי סיורים",
    description: "3 כרטיסים עם לחיצה לפרטים במודל",
    icon: <LayoutGrid className="h-12 w-12" />,
    features: [
      "כל סיור בכרטיס נפרד",
      "פרטים נפתחים במודל",
      "עיצוב נקי ומסודר",
      "קל לסריקה מהירה"
    ]
  },
  {
    id: 2,
    title: "אקורדיון מתקפל",
    description: "רשימה מתקפלת עם כל הפרטים",
    icon: <Layers className="h-12 w-12" />,
    features: [
      "לחיצה להרחבת פרטים",
      "כל המידע באותו עמוד",
      "חסכון במקום",
      "ניווט פשוט"
    ]
  },
  {
    id: 3,
    title: "דף נחיתה מינימלי",
    description: "פוקוס על פעולה אחת",
    icon: <Minimize2 className="h-12 w-12" />,
    features: [
      "Hero + CTA ראשי",
      "רשימת תכונות קצרה",
      "ישיר לווטסאפ",
      "מקסימום המרות"
    ]
  },
  {
    id: 4,
    title: "טאבים מתקדם (נוכחי)",
    description: "ממשק טאבים עם גלילה לסקציות",
    icon: <List className="h-12 w-12" />,
    features: [
      "ניווט בין סוגי סיורים",
      "גלילה אוטומטית",
      "עיצוב מודרני",
      "כל המידע נגיש"
    ]
  }
];

interface LayoutSelectorProps {
  onSelect: (layoutId: number) => void;
}

export const LayoutSelector = ({ onSelect }: LayoutSelectorProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            בחר את פריסת האתר המועדפת עליך
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            4 אפשרויות מקצועיות - תוכל לחזור לגרסה הקודמת בכל עת דרך היסטוריית השיחות
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {layoutOptions.map((option) => (
            <Card 
              key={option.id}
              className="relative hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {option.icon}
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {option.id}
                </div>
                <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                <CardDescription className="text-sm">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => onSelect(option.id)}
                  className="w-full"
                  variant={option.id === 4 ? "default" : "outline"}
                >
                  {option.id === 4 ? "גרסה נוכחית" : "בחר פריסה"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
