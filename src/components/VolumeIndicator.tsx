import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface VolumeIndicatorProps {
  isActive: boolean;
  className?: string;
}

export const VolumeIndicator = ({ isActive, className }: VolumeIndicatorProps) => {
  const [levels, setLevels] = useState<number[]>([0.3, 0.5, 0.7, 0.5, 0.3, 0.4, 0.6, 0.4]);

  useEffect(() => {
    if (!isActive) {
      setLevels([0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]);
      return;
    }

    // Simulate audio levels with randomized smooth animation
    const interval = setInterval(() => {
      setLevels(prev => 
        prev.map((_, i) => {
          const base = 0.3 + Math.sin(Date.now() / 200 + i) * 0.2;
          const random = Math.random() * 0.4;
          return Math.min(1, Math.max(0.15, base + random));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={cn('flex items-end justify-center gap-0.5 h-8 px-2', className)}>
      {levels.map((level, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-primary to-primary/60 transition-all duration-75 ease-out"
          style={{
            height: `${level * 100}%`,
            opacity: 0.6 + level * 0.4
          }}
        />
      ))}
    </div>
  );
};
