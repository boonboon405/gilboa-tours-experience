import { cn } from '@/lib/utils';

interface SpeakingAnimationProps {
  isActive: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'gradient' | 'wave';
}

export const SpeakingAnimation = ({ 
  isActive, 
  className, 
  size = 'md',
  variant = 'default'
}: SpeakingAnimationProps) => {
  const sizeClasses = {
    sm: 'h-4 gap-0.5',
    md: 'h-6 gap-1',
    lg: 'h-8 gap-1.5',
    xl: 'h-12 gap-2'
  };

  const barSizeClasses = {
    sm: 'w-0.5',
    md: 'w-1',
    lg: 'w-1.5',
    xl: 'w-2'
  };

  const barCount = variant === 'wave' ? 7 : 5;

  if (!isActive) return null;

  const getBarColor = (index: number) => {
    if (variant === 'gradient') {
      const colors = [
        'bg-primary',
        'bg-primary/90',
        'bg-secondary',
        'bg-secondary/90',
        'bg-accent',
        'bg-accent/90',
        'bg-primary/80'
      ];
      return colors[index % colors.length];
    }
    if (variant === 'wave') {
      return 'bg-gradient-to-t from-primary via-secondary to-accent';
    }
    return 'bg-primary';
  };

  const getAnimationDelay = (index: number) => {
    if (variant === 'wave') {
      return `${index * 0.08}s`;
    }
    return `${index * 0.12}s`;
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      sizeClasses[size],
      variant === 'wave' && 'px-1',
      className
    )}>
      {[...Array(barCount)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full transition-all',
            barSizeClasses[size],
            variant === 'wave' ? 'animate-speaking-wave' : 'animate-speaking-bar',
            getBarColor(i)
          )}
          style={{
            animationDelay: getAnimationDelay(i),
            height: '100%'
          }}
        />
      ))}
      
      {/* Pulsing ring effect for larger sizes */}
      {(size === 'lg' || size === 'xl') && variant !== 'default' && (
        <div className="absolute inset-0 rounded-full animate-pulse-ring bg-primary/20 pointer-events-none" />
      )}
    </div>
  );
};
