import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, toggleSound } from '@/utils/soundEffects';
import { cn } from '@/lib/utils';

interface SoundToggleProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const SoundToggle = ({ className, showLabel = false, size = 'icon' }: SoundToggleProps) => {
  const [enabled, setEnabled] = useState(isSoundEnabled());

  useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const handleToggle = () => {
    const newState = toggleSound();
    setEnabled(newState);
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggle}
      className={cn(
        'transition-all duration-200',
        enabled ? 'text-primary hover:text-primary' : 'text-muted-foreground hover:text-foreground',
        className
      )}
      title={enabled ? 'השתק צלילים' : 'הפעל צלילים'}
    >
      {enabled ? (
        <Volume2 className={cn('transition-transform', size === 'icon' ? 'w-5 h-5' : 'w-4 h-4')} />
      ) : (
        <VolumeX className={cn('transition-transform', size === 'icon' ? 'w-5 h-5' : 'w-4 h-4')} />
      )}
      {showLabel && (
        <span className="mr-2">
          {enabled ? 'צלילים פעילים' : 'צלילים מושתקים'}
        </span>
      )}
    </Button>
  );
};
