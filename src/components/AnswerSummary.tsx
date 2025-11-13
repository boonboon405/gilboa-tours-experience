import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConversationData {
  categories?: string[];
  numberOfPeople?: number;
  situation?: string;
  dates?: string;
  budget?: string;
  specificInterests?: string;
  transport?: string;
}

interface AnswerSummaryProps {
  data: ConversationData;
  onEdit: (field: keyof ConversationData) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AnswerSummary = ({ data, onEdit, onConfirm, isLoading }: AnswerSummaryProps) => {
  const summaryItems = [
    {
      label: 'קטגוריות מעניינות',
      value: data.categories?.join(', ') || 'לא צוין',
      field: 'categories' as keyof ConversationData,
      icon: '🎯'
    },
    {
      label: 'מספר משתתפים',
      value: data.numberOfPeople ? `${data.numberOfPeople} אנשים` : 'לא צוין',
      field: 'numberOfPeople' as keyof ConversationData,
      icon: '👥'
    },
    {
      label: 'סיטואציה',
      value: data.situation || 'לא צוין',
      field: 'situation' as keyof ConversationData,
      icon: '📋'
    },
    {
      label: 'תאריכים',
      value: data.dates || 'לא צוין',
      field: 'dates' as keyof ConversationData,
      icon: '📅'
    },
    {
      label: 'תקציב משוער',
      value: data.budget || 'לא צוין',
      field: 'budget' as keyof ConversationData,
      icon: '💰'
    },
    {
      label: 'תחומי עניין ספציפיים',
      value: data.specificInterests || 'לא צוין',
      field: 'specificInterests' as keyof ConversationData,
      icon: '⭐'
    },
    {
      label: 'הסעות',
      value: data.transport || 'לא צוין',
      field: 'transport' as keyof ConversationData,
      icon: '🚗'
    }
  ];

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="w-6 h-6 text-primary animate-pulse-slow" />
          סיכום הפרטים שלכם
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          בדקו שהכל נכון לפני שנמליץ על החבילה המושלמת עבורכם
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {summaryItems.map((item) => (
          <div
            key={item.field}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg transition-all",
              item.value !== 'לא צוין' 
                ? "bg-background border border-border/50 hover:border-primary/30"
                : "bg-muted/30 border border-dashed border-muted-foreground/30"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </div>
                <div className={cn(
                  "text-base font-semibold",
                  item.value === 'לא צוין' && "text-muted-foreground italic"
                )}>
                  {item.value}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item.field)}
              className="hover:bg-primary/10"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="pt-4 border-t border-border">
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full bg-gradient-hero text-white font-semibold py-6 text-lg shadow-strong hover:opacity-90 transition-all"
            size="lg"
          >
            {isLoading ? (
              <>מכין המלצה מותאמת אישית...</>
            ) : (
              <>
                <Sparkles className="w-5 h-5 ml-2 animate-pulse-slow" />
                בואו נמצא את החבילה המושלמת!
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
