import React from 'react';
import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  className?: string;
  showAvatar?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  className,
  showAvatar = true 
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showAvatar && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      <div className="bg-muted rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
