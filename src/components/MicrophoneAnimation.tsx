import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MicrophoneAnimationProps {
  isActive: boolean;
  className?: string;
}

export const MicrophoneAnimation = ({ isActive, className }: MicrophoneAnimationProps) => {
  const [ripples, setRipples] = useState<number[]>([]);

  useEffect(() => {
    if (!isActive) {
      setRipples([]);
      return;
    }

    // Create ripples at intervals
    const interval = setInterval(() => {
      setRipples(prev => {
        const newRipples = [...prev, Date.now()];
        // Keep only last 3 ripples
        return newRipples.slice(-3);
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {/* Pulsing rings */}
      {ripples.map((id, index) => (
        <div
          key={id}
          className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping"
          style={{
            animationDuration: '1.5s',
            animationDelay: `${index * 0.2}s`,
            opacity: 0.6 - index * 0.15
          }}
        />
      ))}
      
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-red-400/20 animate-pulse" />
      
      {/* Sound wave bars */}
      <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-1 bg-red-400 rounded-full animate-bounce"
            style={{
              height: `${12 + Math.random() * 16}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.4s'
            }}
          />
        ))}
      </div>
      
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-1 bg-red-400 rounded-full animate-bounce"
            style={{
              height: `${12 + Math.random() * 16}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.4s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

