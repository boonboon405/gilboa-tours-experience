import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LanguageQualityBadgeProps {
  hebrewScore: number;
  arabicDetected: boolean;
  arabicWords?: string[];
}

export const LanguageQualityBadge = ({ 
  hebrewScore, 
  arabicDetected, 
  arabicWords 
}: LanguageQualityBadgeProps) => {
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    return 'bg-red-500/20 text-red-700 border-red-500/30';
  };

  const getQualityIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-3 h-3" />;
    if (score >= 60) return <AlertCircle className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  const getQualityText = (score: number) => {
    if (score >= 80) return 'עברית מצוינת';
    if (score >= 60) return 'עברית טובה';
    return 'עברית נמוכה';
  };

  return (
    <TooltipProvider>
      <div className="flex gap-1 items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant="outline"
              className={`
                inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5
                ${getQualityColor(hebrewScore)}
                transition-all duration-200 hover:scale-105
              `}
            >
              {getQualityIcon(hebrewScore)}
              <span>{hebrewScore}%</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            <p className="font-medium">{getQualityText(hebrewScore)}</p>
            <p className="text-muted-foreground">ציון איכות עברית</p>
          </TooltipContent>
        </Tooltip>

        {arabicDetected && arabicWords && arabicWords.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge 
                variant="outline"
                className="
                  inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5
                  bg-red-500/30 text-red-800 border-red-500/50
                  animate-pulse
                "
              >
                <AlertTriangle className="w-3 h-3" />
                <span>ערבית</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs max-w-xs">
              <p className="font-medium text-red-600">זוהו מילים ערביות</p>
              <p className="text-muted-foreground mt-1">
                {arabicWords.join(', ')}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};
