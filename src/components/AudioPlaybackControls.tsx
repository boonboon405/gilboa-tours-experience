import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioPlaybackControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  duration: number;
  volume: number;
  playbackRate: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (volume: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onSeek: (position: number) => void;
  language?: 'he' | 'en';
  className?: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioPlaybackControls: React.FC<AudioPlaybackControlsProps> = ({
  isPlaying,
  isPaused,
  progress,
  duration,
  volume,
  playbackRate,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
  onPlaybackRateChange,
  onSeek,
  language = 'he',
  className
}) => {
  const t = (he: string, en: string) => language === 'he' ? he : en;
  const playbackRates = [0.75, 1, 1.25, 1.5];

  return (
    <div className={cn("bg-card/50 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2", className)}>
      {/* Progress bar */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{formatTime(progress)}</span>
        <Slider
          value={[progress]}
          max={duration || 100}
          step={0.1}
          onValueChange={(value) => onSeek(value[0])}
          className="flex-1"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onStop}
            className="h-8 w-8 p-0"
            title={t('עצור', 'Stop')}
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSeek(Math.max(0, progress - 5))}
            className="h-8 w-8 p-0"
            title={t('-5 שניות', '-5 seconds')}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={isPaused || !isPlaying ? onPlay : onPause}
            className="h-10 w-10 p-0 rounded-full"
          >
            {isPaused || !isPlaying ? (
              <Play className="w-5 h-5" />
            ) : (
              <Pause className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSeek(Math.min(duration, progress + 5))}
            className="h-8 w-8 p-0"
            title={t('+5 שניות', '+5 seconds')}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed controls */}
        <div className="flex items-center gap-1">
          {playbackRates.map((rate) => (
            <Button
              key={rate}
              variant={playbackRate === rate ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onPlaybackRateChange(rate)}
              className="h-7 px-2 text-xs"
            >
              {rate}x
            </Button>
          ))}
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 min-w-[100px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
            className="h-8 w-8 p-0"
          >
            {volume > 0 ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => onVolumeChange(value[0] / 100)}
            className="w-16"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlaybackControls;
