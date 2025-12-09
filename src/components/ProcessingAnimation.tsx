import { cn } from '@/lib/utils';
import { Loader2, Sparkles, Brain } from 'lucide-react';

interface ProcessingAnimationProps {
  isActive: boolean;
  className?: string;
  language?: 'he' | 'en';
}

export const ProcessingAnimation = ({ isActive, className, language = 'he' }: ProcessingAnimationProps) => {
  if (!isActive) return null;

  const messages = language === 'he' 
    ? ['מעבד...', 'חושב...', 'מנתח...', 'מכין תשובה...']
    : ['Processing...', 'Thinking...', 'Analyzing...', 'Preparing response...'];

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20',
      className
    )}>
      {/* Animated brain icon */}
      <div className="relative">
        <Brain className="w-6 h-6 text-primary animate-pulse" />
        <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-bounce" />
      </div>
      
      {/* Animated dots */}
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      
      {/* Rotating message */}
      <span className="text-sm text-muted-foreground animate-pulse">
        {messages[Math.floor(Date.now() / 1000) % messages.length]}
      </span>
      
      {/* Spinner */}
      <Loader2 className="w-4 h-4 text-primary animate-spin mr-auto" />
    </div>
  );
};
