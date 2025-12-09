import { cn } from '@/lib/utils';

interface SpeakingAnimationProps {
  isActive: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SpeakingAnimation = ({ isActive, className, size = 'md' }: SpeakingAnimationProps) => {
  const sizeClasses = {
    sm: 'h-4 gap-0.5',
    md: 'h-6 gap-1',
    lg: 'h-8 gap-1.5'
  };

  const barSizeClasses = {
    sm: 'w-0.5',
    md: 'w-1',
    lg: 'w-1.5'
  };

  if (!isActive) return null;

  return (
    <div className={cn('flex items-center justify-center', sizeClasses[size], className)}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary',
            barSizeClasses[size],
            'animate-speaking-bar'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            height: '100%'
          }}
        />
      ))}
    </div>
  );
};
