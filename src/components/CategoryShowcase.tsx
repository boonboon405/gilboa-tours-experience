import { Card, CardContent } from '@/components/ui/card';
import { categoryMetadata, DNACategory } from '@/utils/activityCategories';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface CategoryShowcaseProps {
  quizResults?: {
    topCategories: string[];
    percentages: Record<string, number>;
  };
  language?: 'he' | 'en';
  compact?: boolean;
}

export const CategoryShowcase = ({ quizResults, language = 'he', compact = false }: CategoryShowcaseProps) => {
  const categories: DNACategory[] = [
    'adventure',
    'nature', 
    'history',
    'culinary',
    'sports',
    'creative',
    'wellness',
    'teambuilding'
  ];

  const isTopCategory = (cat: DNACategory) => {
    return quizResults?.topCategories?.includes(cat);
  };

  const getPercentage = (cat: DNACategory) => {
    return quizResults?.percentages?.[cat] || 0;
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => {
          const meta = categoryMetadata[cat];
          const isTop = isTopCategory(cat);
          const percentage = getPercentage(cat);
          
          return (
            <Badge
              key={cat}
              variant={isTop ? "default" : "outline"}
              className={cn(
                "text-sm py-1.5 px-3 transition-all",
                isTop && "shadow-md"
              )}
            >
              <span className="mr-1">{meta.icon}</span>
              {meta.name}
              {isTop && percentage > 0 && (
                <span className="mr-1 font-bold">({percentage}%)</span>
              )}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat) => {
        const meta = categoryMetadata[cat];
        const isTop = isTopCategory(cat);
        const percentage = getPercentage(cat);
        
        return (
          <Card 
            key={cat} 
            className={cn(
              "overflow-hidden transition-all duration-300 hover:shadow-lg",
              isTop && "ring-2 ring-primary shadow-xl scale-105"
            )}
          >
            <div className={cn("h-1 bg-gradient-to-r", meta.color)} />
            <CardContent className="pt-4 pb-4">
              <div className="text-center space-y-2">
                <div className="text-4xl">{meta.icon}</div>
                <h3 className="font-semibold text-sm leading-tight">
                  {meta.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {meta.description}
                </p>
                {isTop && percentage > 0 && (
                  <Badge className="mt-2" variant="secondary">
                    {percentage}% התאמה
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
